pragma solidity ^0.5.0;

contract OracleInterface {

    enum EventState {
        Unknown,    // 0 - event maybe nonexistent
        Pending,    // 1 - event not yet completed or cancelled
        Locked,     // 2 - betting is locked, event may be underway
        Completed,  // 2 - event has taken place; result should be in
        Cancelled   // 3 - event was cancelled; there's no outcome
    }

    function getPendingEvents() public view returns (bytes32[] memory);

    function getAllEvents() public view returns (bytes32[] memory);

    function eventExists(bytes32 _matchId) public view returns (bool); 

    function addEvent(string memory _name, string memory _team1, string memory _team2, uint _date) public returns (bytes32);

    function cancelEvent(bytes32 _matchId) external; 

    function lockEvent(bytes32 _matchId) external; 

    function completeEvent(bytes32 _matchId, uint8 result) external; 

    function getEvent(bytes32 _matchId) public view returns (
        bytes32 id,
        string memory name,
        EventState state, 
        uint date, 
        string memory options,
        uint8 optionCount,
        uint8 result);


    // -- TEST FUNCTIONS --

    function testConnection() public pure returns (bool);

    function addTestData() public; 
}
