pragma solidity ^0.5.0;

import "./DateLib.sol";
import "./Ownable.sol";
import "./ProviderInterface.sol";

//TODO: enforce max number of bettable options (100?) 

contract Anybet is Ownable {
    Event[] public events; 
    Bet[] public bets;
    address payable houseWallet;

    mapping(bytes32 => uint) eventIdToIndex; 
    mapping(address => bytes32[]) internal userToBets;
    mapping(bytes32 => uint[]) internal eventToBets;
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
        uint minBetAmt;
        ProviderInterface.EventState state;
        uint8 outcome;
        uint totalBet;
        bool finalized;
    }

    struct ProviderEvent {
        bytes32 eventId;
        ProviderInterface.EventState state;
        string name;
        uint date; 
        string options;
        uint8 optionCount; 
        uint8 outcome;
    }

    struct Bet {
        bytes32 id; //hash of event id and user 
        address user;
        bytes32 eventId;
        uint amount; 
        uint8 option;
        bool finalized; 
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

    function getAllEvents() public view returns (bytes32[] memory) {
        //TODO: this might cost alot of gas
        //collect up all the events
        bytes32[] memory output = new bytes32[](events.length); 

        for (uint n = events.length; n > 0; n--) {
            output[n-1] = events[n-1].eventId;
        }

        return output; 
    }

    function getEventDetails(bytes32 _eventId) public returns (
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
            Event storage localEvent = events[index-1]; 

            ProviderEvent memory providerEvent = _refreshEventFromProvider(localEvent); 
            return (localEvent.eventId, localEvent.providerAddress, localEvent.providerEventId, providerEvent.name, providerEvent.date, localEvent.minBetAmt, localEvent.state, providerEvent.options, providerEvent.optionCount, providerEvent.outcome); 
        }
        
        return (0, address(0), 0, "", 0, 0, ProviderInterface.EventState.Unknown, "", 0, 0);
    }

    function getEventId(address _providerAddress, bytes32 _eventId) public pure returns (bytes32) {        
        bytes32 newId = keccak256(abi.encodePacked(_providerAddress, _eventId)); 
        return newId;
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
        ProviderEvent memory providerEvent = _refreshEventFromProvider(evt); 

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
        require(_outcome >= 0 && _outcome < providerEvent.optionCount, "invalid chosen outcome - not within valid range of options");

        //place the bet 
        uint[] storage betIndexes = eventToBets[_eventId]; 
        bytes32 betId = _generateBetId(_eventId, msg.sender); 
        uint betIndex = bets.push(Bet(betId, msg.sender, _eventId, msg.value, _outcome, false))-1; 
        betIndexes.push(betIndex);
        userBets.push(_eventId); 
        output = true;

        //add to the total bet amount 
        evt.totalBet += msg.value;

        //add to the total bet for option 
        bytes32 optionId = _generateOptionId(_eventId, _outcome); 
        optionIdToBetAmount[optionId] += msg.value;

        return output; 
    }

    //one element returned per bettable option (max 255) 
    function getBetTotals(bytes32 _eventId) public view returns(uint[255] memory) {
        uint[255] memory output; 
        uint index = eventIdToIndex[_eventId]; 
        require(index > 0, "event not found"); 

        uint[] storage betIndexes = eventToBets[_eventId]; 

        for (uint n = 0; n<betIndexes.length; n++) {
            uint betIndex = betIndexes[n]; 
            output[bets[betIndex].option] += bets[betIndex].amount; 
        }

        return output; 
    }

    //handles payouts 
    function handlePayoutsForEvent(bytes32 _eventId) public returns (bool) {
        //get event, ensure that it exists
        uint index = eventIdToIndex[_eventId]; 

        if (events.length > 0 && index > 0) {
            Event storage localEvent = events[index-1]; 

            //refresh event from provider 
            _refreshEventFromProvider(localEvent);

            //make sure that event is in a state to be finalized 
            if (!localEvent.finalized) {

                if (localEvent.state == ProviderInterface.EventState.Cancelled) {
                    //if cancelled, return all bets 
                    uint[] storage allBets = eventToBets[_eventId]; 
                    for (uint n=0; n<allBets.length; n++) {
                        Bet storage bet = bets[allBets[n]]; 

                        if (!bet.finalized) {
                            //return the amount bet to the user 
                            bet.finalized = true;
                        }
                    }

                    //event is finalized 
                    localEvent.finalized = true;
                }
                else if (localEvent.state == ProviderInterface.EventState.Completed) {

                    //if completed, handle payouts to each user who won 
                    uint[] storage allBets = eventToBets[_eventId]; 
                    
                    //calculate total amount bet on winning option
                    uint payToHouse = 0; 
                    uint totalBetForEvent = localEvent.totalBet;
                    uint totalWinningBet = _getTotalBetOnEventOption(_eventId, localEvent.outcome);
                    uint totalLosingBet = (totalBetForEvent - totalWinningBet); 

                    for (uint n=0; n<allBets.length; n++) {
                        Bet storage bet = bets[allBets[n]]; 

                        if (!bet.finalized) {
                            bool userIsWinner = (localEvent.outcome == bet.option); 

                            if (userIsWinner) {
                                //pay the user a winner's share 
                                address payable userWallet = address(uint160(address(bet.user)));
                                if (userWallet.send(bet.amount)) {
                                    bet.finalized = true;
                                }
                            }
                        }
                    }

                    //now pay the remainder house 
                    if (payToHouse > 0) {
                        houseWallet.transfer(payToHouse); 
                    }

                    //event is finalized 
                    localEvent.finalized = true;
                }
                else {
                    require(false, "Event is not in a state to be finalized"); 
                }
            }
            else {
                require(false, "Event has already been finalized"); 
            }
        }
        else {
            require(false, "Specified event was not found"); 
        }
    }


    // -- EXTERNAL METHODS -- 

    function addEvent(address _providerAddress, bytes32 _eventId, uint _minBetAmt) external onlyOwner returns (bytes32) {
        //get event from provider
        
        bytes32 newId = 0;

        ProviderEvent memory providerEvent = _getEventFromProvider(_providerAddress, _eventId); 

        if (providerEvent.state == ProviderInterface.EventState.Pending) {
            //generate new unique event index 
            newId = getEventId(_providerAddress, _eventId); 

            //check for duplicate 
            if (eventIdToIndex[newId] == 0) {
                //add the event 
                uint newCount = events.push(Event(
                    newId,
                    _providerAddress, 
                    _eventId,
                    (_minBetAmt < globalMinBetAmt) ? globalMinBetAmt : _minBetAmt,
                    providerEvent.state, 
                    0, 
                    0, 
                    false
                )); 

                //add event to index mapping
                eventIdToIndex[newId] = newCount;

                //add event to bets mapping 
            }
        }

        return newId;
    }


    // -- ADMIN FUNCTIONS -- 

    function setHouseWallet(address _address) public onlyOwner {
        houseWallet = address(uint160(address(_address)));
    }


    // -- PRIVATE METHODS -- 

    function _generateBetId(bytes32 _eventId, address _user) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_eventId, _user)); 
    }

    function _generateOptionId(bytes32 _eventId, uint8 _option) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_eventId, _option)); 
    }

    function _getEmptyBet() private pure returns (Bet memory) {
        return Bet(0, address(0), 0, 0, 0, false); 
    }

    function _getEventFromProvider(address providerAddress, bytes32 eventId) private view returns (ProviderEvent memory) {
        ProviderInterface provider = ProviderInterface(providerAddress);
        ProviderEvent memory output; 

        string memory name;
        ProviderInterface.EventState state;
        uint date;
        string memory options;
        uint8 optionCount;
        uint8 outcome;

        (,name,state,date,options,optionCount,outcome) = provider.getEvent(eventId); 
        
        output.name = name;
        output.state = state;
        output.date = date;
        output.options = options;
        output.outcome = outcome; 
        output.optionCount = optionCount; 

        return output; 
    }

    function _refreshEventFromProvider(Event storage _event) private returns (ProviderEvent memory) {
        ProviderEvent memory output = _getEventFromProvider(_event.providerAddress, _event.providerEventId); 

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

    //NO LONGER USER 
    function _calculateWinnings(Event storage evt, bytes32 _eventId, address _user) private view returns (uint) {
        
        //ensure valid event id 
        require(_eventExists(_eventId), "event not found"); 

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
            if (evt.state == ProviderInterface.EventState.Completed) {

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
        }

        return 0;
    }
}