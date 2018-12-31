pragma solidity ^0.5.0;

import "./DateLib.sol";
import "./Ownable.sol";
import "./ProviderInterface.sol";

contract Anybet is Ownable {
    Event[] events; 
    mapping(bytes32 => uint) eventIdToIndex; 
    mapping(address => bytes32[]) internal userToBets;
    mapping(bytes32 => Bet[]) internal eventToBets;

    using DateLib for DateLib.DateTime;

    //constants
    //TODO: could be per event ?
    uint internal minimumBetAmount = 1000000000000;

    //defines a event along with its outcome
    struct Event {
        bytes32 eventId;
        address providerAddress;
        bytes32 providerEventId;
        string name;
        uint date; 
        ProviderInterface.EventState state;
        string options;
        uint8 optionCount; 
        uint8 outcome;
    }

    struct Bet {
        address user;
        bytes32 eventId;
        uint amount; 
        uint8 option;
    }

    function addEvent(address _providerAddress, bytes32 _eventId) external onlyOwner returns (bytes32) {
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
            uint newIndex = events.push(Event(
                newId,
                _providerAddress, 
                _eventId,
                name, 
                date,
                ProviderInterface.EventState.Pending,
                options, 
                optionCount,
                0  
            )); 
            eventIdToIndex[newId] = newIndex;
        }

        return newId;
    }

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

    function getEventData(bytes32 _eventId) public view returns (
        bytes32 eventId,
        address providerAddress,
        bytes32 providerEventId,
        string memory name,
        uint date, 
        ProviderInterface.EventState state,
        string memory options, 
        uint8 optionCount, 
        uint8 outcome 
    ) {
        uint index = eventIdToIndex[_eventId]; 
        if (events.length > 0 && index > 0) {
            Event storage evt = events[_getEventIndex(_eventId)]; 
            return (evt.eventId, evt.providerAddress, evt.providerEventId, evt.name, evt.date, evt.state, evt.options, evt.optionCount, evt.outcome); 
            //return (_eventId, address(0), 0, "", index, ProviderInterface.EventState.Unknown, "", 0, 0);
        }
        
        return (0, address(0), 0, "", 0, ProviderInterface.EventState.Unknown, "", 0, 0);
    }

    function placeBet(bytes32 _eventId, uint8 _outcome) public payable returns (bool) {                                 
        bool output = false; 

        //require that bet amount meets minimum requirement 
        require(msg.value >= minimumBetAmount, "bet amount is less than minimum");

        //require that event exists 
        require(events.length > 0, "no available events"); 
        uint eventIndex = eventIdToIndex[_eventId]; 
        require(eventIndex > 0, "event not found"); 

        //refresh event from oracle provider
        Event storage evt = events[_getEventIndex(_eventId)]; 
        _refreshEventFromProvider(evt); 

        //require that event is pending (bettable)
        require(evt.state == ProviderInterface.EventState.Pending, "event is not bettable"); 

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
        bets.push(Bet(msg.sender, _eventId, msg.value, _outcome))-1; 
        userBets.push(_eventId); 
        output = true;

        return output; 
    }


    // -- PRIVATE METHODS -- 

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

    function _getEventIndex(bytes32 _eventId) private view returns (uint) {
        return eventIdToIndex[_eventId]-1; 
    }
}