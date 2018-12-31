const web3 = require('web3'); 
const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const web3js = new web3(new web3.providers.HttpProvider("http://localhost:9545"));

const address = '0xEEdCB96C203F1B8016fe0989eD6FDf7DA5d9155F'; 

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
      "signature": "0x0b791430"
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
      "constant": false,
      "inputs": [
        {
          "name": "_providerAddress",
          "type": "address"
        },
        {
          "name": "_eventId",
          "type": "bytes32"
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
      "signature": "0x76df42ef"
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
    }
  ]; 

const test = async(() => {
    const contract = new web3js.eth.Contract(abi, address); 

    const accounts = await(web3js.eth.getAccounts()); 

    const evts = await(contract.methods.getPendingEvents().call()); 
    for (let n=0; n<evts.length; n++) {
        const evt = await(contract.methods.getEvent(evts[n]).call()); 
        console.log(JSON.stringify(evt)); 
    }
    
    /*
    storeMyValue.methods.getPendingEvents().send({
        from: accounts[0]
      }, (error, transactionHash) => {
        console.log("transaction hash is ",transactionHash);
        this.setState({transactionHash});
      });
      */
    
});

test();