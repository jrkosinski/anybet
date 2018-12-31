pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Anybet.sol";

contract TestAnybet {

  function testItStoresAValue() public {
    Anybet anybet = Anybet(DeployedAddresses.Anybet());

/*
    anybet.set(89);

    uint expected = 89;

    Assert.equal(anybet.get(), expected, "It should store the value 89.");
    */
  }
}
