pragma solidity ^0.5.0;

import "./DateLib.sol";
import "./Ownable.sol";
import "./ProviderInterface.sol";

contract Anybet is Ownable {
    Event[] public events; 

    mapping(bytes32 => uint) eventIdToIndex; 
    mapping(address => bytes32[]) internal userToBets;
    mapping(bytes32 => Bet[]) internal eventToBets;
    mapping(bytes32 => Bet) internal betIdToBet; 
    mapping(bytes32 => uint) internal optionIdToBetAmount;

    using DateLib for DateLib.DateTime;

    //constants
    //TODO: could be per event ?
    uint internal globalMinBetAmt = 1000000000000;
    uint internal houseCutPercentage = 3; 

    //defines an event along with its outcome
    struct Event {
        bytes32 eventId;
        address providerAddress;
        bytes32 providerEventId;
        string name;
        uint date; 
        uint minBetAmt;
        ProviderInterface.EventState state;
        string options;
        uint8 optionCount; 
        uint8 outcome;
        uint totalBet;
    }

    struct Bet {
        bytes32 id; //hash of event id and user 
        address user;
        bytes32 eventId;
        uint amount; 
        uint8 option;
    }


    // -- PUBLIC METHODS -- 

    function getPendingEvents() public view returns (bytes32[] memory) {
        uint count = 0; 

        //TODO: this might cost alot of gas

        //get count of pending events 
        for (uint i = 0; i < events.length; i++) {
            if (events[i].state != ProviderInterface.EventState.Completed && events[i].state != ProviderInterface.EventState.Cancelled) 
                count++; 
        }

        //collect up all the pending events
        bytes32[] memory output = new bytes32[](count); 

        if (count > 0) {
            uint index = 0;
            for (uint n = events.length; n > 0; n--) {
                if (events[n-1].state != ProviderInterface.EventState.Completed && events[n-1].state != ProviderInterface.EventState.Cancelled) 
                    output[index++] = events[n-1].eventId;
            }
        } 

        return output; 
    }

    function getEvent(bytes32 _eventId) public view returns (
        bytes32 eventId,
        address providerAddress,
        bytes32 providerEventId,
        string memory name,
        uint date, 
        uint minBetAmt,
        ProviderInterface.EventState state,
        string memory options, 
        uint8 optionCount, 
        uint8 outcome 
    ) {
        uint index = eventIdToIndex[_eventId]; 
        if (events.length > 0 && index > 0) {
            Event storage evt = events[index-1]; 
            return (evt.eventId, evt.providerAddress, evt.providerEventId, evt.name, evt.date, evt.minBetAmt, evt.state, evt.options, evt.optionCount, evt.outcome); 
        }
        
        return (0, address(0), 0, "", 0, 0, ProviderInterface.EventState.Unknown, "", 0, 0);
    }

    function placeBet(bytes32 _eventId, uint8 _outcome) public payable returns (bool) {                                 
        bool output = false; 

        //require that bet amount meets minimum requirement 
        require(msg.value >= globalMinBetAmt, "bet amount is less than absolute minimum");

        //require that event exists 
        require(events.length > 0, "no available events"); 
        uint eventIndex = eventIdToIndex[_eventId]; 
        require(eventIndex > 0, "event not found"); 

        //refresh event from oracle provider
        Event storage evt = events[_getEventIndex(_eventId)]; 
        _refreshEventFromProvider(evt); 

        //require that event is pending (bettable)
        require(evt.state == ProviderInterface.EventState.Pending, "event is not bettable"); 

        //enforce minimum bet 
        require(msg.value >= evt.minBetAmt, "bet amount is less than defined minimum"); 

        //require that user doesn't already have a bet for this event 
        bool userHasBet = false;
        bytes32[] storage userBets = userToBets[msg.sender]; 
        if (userBets.length > 0) {
            for (uint n = 0; n < userBets.length; n++) {
                if (userBets[n] == _eventId) {
                    userHasBet = true;
                    break;
                }
            }
        }
        //TODO: allow user to increase his bet?
        require(!userHasBet, "user already has a running bet for this event");

        //ensure that outcome is within proper range
        require(_outcome >= 0 && _outcome < evt.optionCount, "invalid chosen outcome - not within valid range of options");

        //place the bet 
        Bet[] storage bets = eventToBets[_eventId]; 
        bytes32 betId = _generateBetId(_eventId, msg.sender); 
        bets.push(Bet(betId, msg.sender, _eventId, msg.value, _outcome))-1; 
        userBets.push(_eventId); 
        output = true;

        //add to the total bet amount 
        evt.totalBet += msg.value;

        //add to the total bet for option 
        bytes32 optionId = _generateOptionId(_eventId, _outcome); 
        optionIdToBetAmount[optionId] += msg.value;

        return output; 
    }

    function getBetTotals(bytes32 _eventId) public view returns(uint[255] memory) {
        uint[255] memory output; 
        uint index = eventIdToIndex[_eventId]; 
        require(index > 0, "event not found"); 

        Bet[] storage bets = eventToBets[_eventId]; 

        for (uint n = 0; n<bets.length; n++) {
            output[bets[n].option] += bets[n].amount; 
        }

        return output; 
    }

    // -- EXTERNAL METHODS -- 

    function addEvent(address _providerAddress, bytes32 _eventId, uint _minBetAmt) external onlyOwner returns (bytes32) {
        //get event from provider
        
        ProviderInterface provider = ProviderInterface(_providerAddress);
        bytes32 newId = 0;
        
        bytes32 eventId;
        string memory name;
        string memory options; 
        uint8 optionCount; 
        ProviderInterface.EventState state;
        uint date;

        (eventId, name, state, date, options, optionCount,) = provider.getEvent(_eventId);

        if (state == ProviderInterface.EventState.Pending) {
            //generate new unique event index 
            newId = keccak256(abi.encodePacked(_providerAddress, _eventId)); 

            //add the event 
            uint newCount = events.push(Event(
                newId,
                _providerAddress, 
                _eventId,
                name, 
                date,
                (_minBetAmt < globalMinBetAmt) ? globalMinBetAmt : _minBetAmt,
                ProviderInterface.EventState.Pending,
                options, 
                optionCount,
                0, 
                0
            )); 

            eventIdToIndex[newId] = newCount;
        }

        return newId;
    }


    // -- PRIVATE METHODS -- 

    function _generateBetId(bytes32 _eventId, address _user) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_eventId, _user)); 
    }

    function _generateOptionId(bytes32 _eventId, uint8 _option) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_eventId, _option)); 
    }

    function _getEmptyBet() private pure returns (Bet memory) {
        return Bet(0, address(0), 0, 0, 0); 
    }

    function _refreshEventFromProvider(Event storage _event) private returns (bool) {
        bool output = false; 

        //get event from oracle 
        ProviderInterface provider = ProviderInterface(_event.providerAddress);
                
        bytes32 eventId;
        string memory name;
        ProviderInterface.EventState state;
        uint date;
        string memory options;
        uint8 optionCount; 
        uint8 outcome; 

        (eventId, name, state, date, options, optionCount, outcome) = provider.getEvent(_event.providerEventId);

        //update the internal record if necessary 
        if (state != ProviderInterface.EventState.Unknown) {
            if (_event.state != state) 
                _event.state = state; 
            if (_event.outcome != outcome)
                _event.outcome = outcome;
        }

        return output; 
    }

    function _eventExists(bytes32 _eventId) private view returns (bool) {
        return eventIdToIndex[_eventId] > 0;
    }

    function _getEventIndex(bytes32 _eventId) private view returns (uint) {
        return eventIdToIndex[_eventId]-1; 
    }

    function _getUserBetForEvent(bytes32 _eventId, address _user) private view returns (Bet storage) {
        bytes32 betId = _generateBetId(_eventId, _user); 
        Bet storage bet = betIdToBet[betId]; 
        return bet; 
    }

    function _getTotalBetOnEventOption(bytes32 _eventId, uint8 _option) private view returns (uint) {
        bytes32 optionId = _generateOptionId(_eventId, _option);
        return optionIdToBetAmount[optionId]; 
    }

    function _calculateWinnings(bytes32 _eventId, address _user) private view returns (uint) {
        
        //ensure valid event id 
        require(_eventExists(_eventId), "event not found"); 

        //get the event 
        Event storage evt = events[_getEventIndex(_eventId)];

        //if event was cancelled, refund all original bet amount
        if (evt.state == ProviderInterface.EventState.Cancelled) {  
            //return the full amount of bet, if user has made one
            Bet storage userBet = _getUserBetForEvent(_eventId, _user);
            if (userBet.user == _user) {
                return userBet.amount;
            }
        }
        else {
            //require that event is finished
            require(evt.state == ProviderInterface.EventState.Completed, "event not yet completed");

            //get the user's bet
            Bet storage userBet = _getUserBetForEvent(_eventId, _user);

            if (userBet.user == _user) {

                bool userIsWinner = (evt.outcome == userBet.option); 

                //if user lost, he gets nothing back 
                if (!userIsWinner) {
                    return 0;
                }
                else {
                    //get stats 
                    uint totalBetForEvent = evt.totalBet;
                    uint totalWinningBet = _getTotalBetOnEventOption(_eventId, evt.outcome);
                    uint totalLosingBet = (totalBetForEvent - totalWinningBet); 

                    //calculate winnings 
                    uint winnings = userBet.amount; 
                    winnings += ((winnings/totalWinningBet) * totalLosingBet); 

                    //return winnings minus house cut 
                    return winnings - (winnings/100) * houseCutPercentage; 
                }
            }            
        }

        return 0;
    }
}