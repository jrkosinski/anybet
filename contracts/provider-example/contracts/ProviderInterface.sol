pragma solidity ^0.5.0;

contract ProviderInterface {

    enum EventState {
        Unknown,    // 0 - event maybe nonexistent
        Pending,    // 1 - event not yet completed or cancelled
        Locked,     // 2 - betting is locked, event may be underway
        Completed,  // 2 - event has taken place; outcome should be in
        Cancelled   // 3 - event was cancelled; there's no outcome
    }

    function getPendingEvents() public view returns (bytes32[] memory);

    function getAllEvents() public view returns (bytes32[] memory);

    function eventExists(bytes32 _eventId) public view returns (bool); 

    function addEvent(string memory _name, uint _date, string memory _options, uint8 _optionCount) public returns (bytes32);

    function cancelEvent(bytes32 _eventId) external; 

    function lockEvent(bytes32 _eventId) external; 

    function completeEvent(bytes32 _eventId, uint8 _outcome) external; 

    function getEvent(bytes32 _eventId) public view returns (
        bytes32 eventId,
        string memory name,
        EventState state, 
        uint date, 
        string memory options,
        uint8 optionCount,
        uint8 outcome);


    // -- TEST FUNCTIONS --

    function testConnection() public pure returns (bool);

    function addTestData() public; 
}
