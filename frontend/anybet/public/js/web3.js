
let AnybetContract = null;
let Anybet = null;

$(document).ready(() => {
    window.contracts = {
        anybet: null
    };

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
    }

    if (web3) {
        AnybetContract = web3.eth.contract([
            {
              "constant": true,
              "inputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "events",
              "outputs": [
                {
                  "name": "eventId",
                  "type": "bytes32"
                },
                {
                  "name": "providerAddress",
                  "type": "address"
                },
                {
                  "name": "providerEventId",
                  "type": "bytes32"
                },
                {
                  "name": "name",
                  "type": "string"
                },
                {
                  "name": "date",
                  "type": "uint256"
                },
                {
                  "name": "minBetAmt",
                  "type": "uint256"
                },
                {
                  "name": "state",
                  "type": "uint8"
                },
                {
                  "name": "options",
                  "type": "string"
                },
                {
                  "name": "optionCount",
                  "type": "uint8"
                },
                {
                  "name": "outcome",
                  "type": "uint8"
                },
                {
                  "name": "totalBet",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function",
              "signature": "0x0b791430"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "bets",
              "outputs": [
                {
                  "name": "id",
                  "type": "bytes32"
                },
                {
                  "name": "user",
                  "type": "address"
                },
                {
                  "name": "eventId",
                  "type": "bytes32"
                },
                {
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "name": "option",
                  "type": "uint8"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function",
              "signature": "0x22af00fa"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "name": "",
                  "type": "address"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function",
              "signature": "0x8da5cb5b"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0xf2fde38b"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event",
              "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "getPendingEvents",
              "outputs": [
                {
                  "name": "",
                  "type": "bytes32[]"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function",
              "signature": "0xb4184e70"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "_eventId",
                  "type": "bytes32"
                }
              ],
              "name": "getEvent",
              "outputs": [
                {
                  "name": "eventId",
                  "type": "bytes32"
                },
                {
                  "name": "providerAddress",
                  "type": "address"
                },
                {
                  "name": "providerEventId",
                  "type": "bytes32"
                },
                {
                  "name": "name",
                  "type": "string"
                },
                {
                  "name": "date",
                  "type": "uint256"
                },
                {
                  "name": "minBetAmt",
                  "type": "uint256"
                },
                {
                  "name": "state",
                  "type": "uint8"
                },
                {
                  "name": "options",
                  "type": "string"
                },
                {
                  "name": "optionCount",
                  "type": "uint8"
                },
                {
                  "name": "outcome",
                  "type": "uint8"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function",
              "signature": "0x8c172fa2"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "_eventId",
                  "type": "bytes32"
                },
                {
                  "name": "_outcome",
                  "type": "uint8"
                }
              ],
              "name": "placeBet",
              "outputs": [
                {
                  "name": "",
                  "type": "bool"
                }
              ],
              "payable": true,
              "stateMutability": "payable",
              "type": "function",
              "signature": "0x0e52bb49"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "_eventId",
                  "type": "bytes32"
                }
              ],
              "name": "getBetTotals",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256[255]"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function",
              "signature": "0x5e5f8915"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "_providerAddress",
                  "type": "address"
                },
                {
                  "name": "_eventId",
                  "type": "bytes32"
                },
                {
                  "name": "_minBetAmt",
                  "type": "uint256"
                }
              ],
              "name": "addEvent",
              "outputs": [
                {
                  "name": "",
                  "type": "bytes32"
                }
              ],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0xbee13e36"
            }
          ]); 
        Anybet = AnybetContract.at('0x3bEf203429eE95CC4732321F227616A84325a83a'); 

        window.contracts.anybet = Anybet;
    }
});