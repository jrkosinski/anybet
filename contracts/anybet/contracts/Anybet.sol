pragma solidity ^0.5.0;

import "./DateLib.sol";
import "./Ownable.sol";
import "./OracleInterface.sol";

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
        OracleInterface.EventState state;
        string options;
        uint8 optionCount; 
        uint8 result;
    }

    struct Bet {
        address user;
        bytes32 eventId;
        uint amount; 
        uint8 option;
    }

    function addEvent(address _providerAddress, bytes32 _eventId) public onlyOwner returns (bytes32) {
        //get event from provider
        OracleInterface provider = OracleInterface(_providerAddress);
        bytes32 newId = 0;
        
        bytes32 eventId;
        string memory name;
        string memory options; 
        uint8 optionCount; 
        OracleInterface.EventState state;
        uint date;

        (eventId, name, state, date, options, optionCount,) = provider.getEvent(_eventId);

        if (state == OracleInterface.EventState.Pending) {
            //generate new unique event index 
            newId = keccak256(abi.encodePacked(_providerAddress, _eventId)); 

            //add the event 
            uint newIndex = events.push(Event(
                newId,
                _providerAddress, 
                _eventId,
                name, 
                date,
                OracleInterface.EventState.Pending,
                options, 
                optionCount,
                0  
            )); 
            eventIdToIndex[newId] = newIndex+1;
        }

        return newId;
    }

    function getEvent(bytes32 _eventId) public view returns (
        bytes32 eventId,
        address providerAddress,
        bytes32 providerEventId,
        string memory name,
        uint date, 
        OracleInterface.EventState state,
        string memory options, 
        uint8 optionCount, 
        uint8 result 
    ) {
        uint index = eventIdToIndex[_eventId]; 
        if (events.length > 0 && index >= 0) {
            Event storage evt = events[index]; 
            return (evt.eventId, evt.providerAddress, evt.providerEventId, evt.name, evt.date, evt.state, evt.options, evt.optionCount, evt.result); 
        }
        
        return (0, address(0), 0, "", 0, OracleInterface.EventState.Unknown, "", 0, 0);
    }

    function placeBet(bytes32 _eventId, uint8 _result) public payable returns (bool) {                                 
        bool output = false; 

        //require that bet amount meets minimum requirement 
        require(msg.value >= minimumBetAmount, "bet amount is less than minimum");

        //require that event exists 
        require(events.length > 0, "no available events"); 
        uint eventIndex = eventIdToIndex[_eventId]; 
        require(eventIndex >= 0, "event not found"); 

        //refresh event from oracle provider
        Event storage evt = events[eventIndex]; 
        refreshEventFromOracle(evt); 

        //require that event is pending (bettable)
        require(evt.state == OracleInterface.EventState.Pending, "event is not bettable"); 

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

        //TODO: ensure that result is within proper range

        //place the bet 
        Bet[] storage bets = eventToBets[_eventId]; 
        bets.push(Bet(msg.sender, _eventId, msg.value, _result))-1; 
        userBets.push(_eventId); 
        output = true;

        return output; 
    }


    // -- PRIVATE METHODS -- 

    function refreshEventFromOracle(Event storage _event) private returns (bool) {
        bool output = false; 

        //get event from oracle 
        OracleInterface provider = OracleInterface(_event.providerAddress);
                
        bytes32 eventId;
        string memory name;
        OracleInterface.EventState state;
        uint date;
        string memory options;
        uint8 optionCount; 
        uint8 result; 

        (eventId, name, state, date, options, optionCount, result) = provider.getEvent(_event.providerEventId);

        //update the internal record if necessary 
        if (state != OracleInterface.EventState.Unknown) {
            if (_event.state != state) 
                _event.state = state; 
            if (_event.result != result)
                _event.result = result;
        }

        return output; 
    }
}