pragma solidity ^0.5.0;

import "./DateLib.sol";
import "./Ownable.sol";
import "./ProviderInterface.sol";

//TODO: enforce max number of bettable options (100?) 

contract Provider is ProviderInterface, Ownable {
    Event[] events; 
    mapping(bytes32 => uint) eventIdToIndex; 

    //defines a event along with its outcome
    struct Event {
        bytes32 eventId;
        string name;
        uint date; 
        ProviderInterface.EventState state;
        string options;
        uint8 optionCount; 
        uint8 outcome;
    }

    using DateLib for DateLib.DateTime;

    //gets a list of ids of all events which are in state Pending
    function getPendingEvents() public view returns (bytes32[] memory) {
        uint count = 0; 

        //TODO: this might cost alot of gas

        //get count of pending events 
        for (uint i = 0; i < events.length; i++) {
            if (events[i].state == EventState.Pending) 
                count++; 
        }

        //collect up all the pending events
        bytes32[] memory output = new bytes32[](count); 

        if (count > 0) {
            uint index = 0;
            for (uint n = events.length; n > 0; n--) {
                if (events[n-1].state == EventState.Pending) 
                    output[index++] = events[n-1].eventId;
            }
        } 

        return output; 
    }

    //gets a list of ids of all events, pending or not
    function getAllEvents() public view returns (bytes32[] memory) {
        bytes32[] memory output = new bytes32[](events.length); 

        //TODO: this might cost alot of gas; could it be stored instead?

        //get all ids 
        if (events.length > 0) {
            uint index = 0;
            for (uint n = events.length; n > 0; n--) {
                output[index++] = events[n-1].eventId;
            }
        }
        
        return output; 
    }

    //returns true if the given event id is valid and corresponds to an event
    function eventExists(bytes32 _eventId) public view returns (bool) {
        if (events.length == 0)
            return false;
        uint index = eventIdToIndex[_eventId]; 
        return (index > 0); 
    }

    //gets the event details for the given event id 
    function getEvent(bytes32 _eventId) public view returns (
        bytes32 eventId,
        string memory name,
        EventState state, 
        uint date, 
        string memory options,
        uint8 optionCount,
        uint8 outcome) {
        
        //get the match 
        if (eventExists(_eventId)) {
            Event storage evt = events[_getEventIndex(_eventId)];
            return (evt.eventId, evt.name, evt.state, evt.date, evt.options, evt.optionCount, evt.outcome); 
        }
        else {
            return (0, "", ProviderInterface.EventState.Unknown, 0, "", 0, 0); 
        }
    }

    //adds a new event into the system 
    function addEvent(string memory _name, uint _date, string memory _options, uint8 _optionCount) public onlyOwner returns (bytes32) {

        //hash the crucial info to get a unique id 
        bytes32 id = keccak256(abi.encodePacked(_name, _options, _optionCount, _date)); 

        //require that the match be unique (not already added) 
        require(!eventExists(id), "duplicate event exists");
        
        //add the match 
        uint newIndex = events.push(Event(id, _name, _date, EventState.Pending, _options, _optionCount, 0))-1; 
        eventIdToIndex[id] = newIndex+1;
        
        //return the unique id of the new match
        return id;
    }

    //cancels an event 
    function cancelEvent(bytes32 _eventId) onlyOwner external {
        require(eventExists(_eventId), "event not found");
        uint index = _getEventIndex(_eventId);
        Event storage evt = events[index]; 
        require(evt.state == EventState.Pending || evt.state == EventState.Locked, "only pending or locked events may be cancelled"); 
        evt.state = EventState.Cancelled;
    }

    //locks an event - no more bets can be placed 
    function lockEvent(bytes32 _eventId) onlyOwner external {
        require(eventExists(_eventId), "event not found"); 
        uint index = _getEventIndex(_eventId);
        Event storage evt = events[index]; 
        require(evt.state == EventState.Pending, "only pending events may be locked"); 
        evt.state = EventState.Locked;
    }

    //declares the outcome of an event and sets its state to Completed 
    function completeEvent(bytes32 _eventId, uint8 _outcome) onlyOwner external {

        //require that it exists
        require(eventExists(_eventId), "event not found"); 

        //get the match 
        uint index = _getEventIndex(_eventId);
        Event storage evt = events[index]; 

        //make sure that match is pending (outcome not already declared)
        require(evt.state == EventState.Pending || evt.state == EventState.Locked, "invalid starting state to complete event"); 
        
        //set the outcome
        evt.outcome = _outcome;

        //set the outcome 
        evt.state = EventState.Completed;
    }


    // -- PRIVATE METHODS --

    function _getEventIndex(bytes32 _eventId) private view returns (uint) {
        return eventIdToIndex[_eventId]-1; 
    }


    // -- TEST FUNCTIONS --

    function testConnection() public pure returns (bool) {
        return true;
    }

    function addTestData() public onlyOwner {
        addEvent("will Trump remain president?", DateLib.DateTime(2020, 1, 30, 0, 0, 0, 0, 0).toUnixTimestamp(), "yes|no", 2);
        addEvent("who will win the trubador contest?", DateLib.DateTime(2020, 1, 30, 0, 0, 0, 0, 0).toUnixTimestamp(), "gooki|pookino", 3);
    }

    function getAddress() public view returns (address) {
        return address(this); 
    }
}