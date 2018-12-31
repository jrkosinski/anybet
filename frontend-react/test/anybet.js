const Anybet = artifacts.require("./Anybet.sol");

contract("Anybet", accounts => {
  it("...should store the value 89.", async () => {
    const anybetInstance = await Anybet.deployed();

    /*

    // Set value of 89
    await anybetInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await anybetInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
    */
  });
});
