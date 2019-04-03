const web3 = require('web3'); 
const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const common = require('anybet-common');
const exception = common.exceptions('API');

const ROPSTEN_PROVIDER = "https://ropsten.infura.io/v3/811b27d11a824e41bb4e9f57ec7f47f2"; 
const LOCAL_PROVIDER = "http://localhost:9545"; 

const web3js = new web3(new web3.providers.HttpProvider(LOCAL_PROVIDER));

const _contractAddress = '0x9Ba86AB88bC462b3A95cc25D71566c8bd228e1BF'; 
//const _contractAddress = '0x7B2FcEF2d89e31fbb992aF80a19A516A7EF4259B'; 

//const _ownerAddress = '0x0fF34fCF14571ceD47a94015eaFdB27B9fCB0338'; 
let _ownerAddress = null; 

const abi = [
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
    "inputs": [],
    "name": "getAllEvents",
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xc27a500d"
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
        "name": "_eventId",
        "type": "bytes32"
      }
    ],
    "name": "refreshEventFromProvider",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x33bd08ae"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_eventId",
        "type": "bytes32"
      }
    ],
    "name": "finalizeBet",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x130b11d6"
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
]; 

const _contract = new web3js.eth.Contract(abi, _contractAddress); 
let _accounts = null;

const initializeWeb3 = async(() => {
    exception.try(() => {
        _accounts = await(web3js.eth.getAccounts()); 
    
        if (!_ownerAddress) 
            _ownerAddress = _accounts[0]; 
    
    
        let balance = await(web3js.eth.getBalance(_ownerAddress));
        web3js.eth.personal.unlockAccount(_ownerAddress); 
        //web3js.eth.sendTransaction({from:_ownerAddress,to:"0x0fF34fCF14571ceD47a94015eaFdB27B9fCB0338", value:Math.floor(balance/2)});
        
        console.log(_accounts);
    });
});

initializeWeb3(); 

const getAllEvents = async(() => {
    return exception.try(() => {
        return await(_contract.methods.getAllEvents().call()); 
    });
});

const getPendingEvents = async(() => {
    return exception.try(() => {
        return await(_contract.methods.getPendingEvents().call()); 
    });
});

const getEventDetails = async((eventId) => {
    return exception.try(() => {
        return await(_contract.methods.getEvent(eventId).call()); 
    });
});

const addEvent = async((providerAddress, providerEventId, minimumBet) => {
    return exception.try(() => {
        let eventId = null;

        const result = await(_contract.methods.addEvent(providerAddress, providerEventId, minimumBet).send({from:_ownerAddress, gas: 3000000})); 
        if (result) {
            eventId = result;
        }

        return eventId;
    });
});

module.exports = {
    getAllEvents,
    getPendingEvents, 
    getEventDetails, 
    addEvent
}; 