const web3 = require('web3'); 
const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const web3js = new web3(new web3.providers.HttpProvider("http://localhost:9545"));

const address = '0xDB83D5291CCAce20949a21B5524C93F202E9B1ba'; // '0xEEdCB96C203F1B8016fe0989eD6FDf7DA5d9155F'; 

const abi = [
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
    "name": "eventExists",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x118e58bd"
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
        "name": "name",
        "type": "string"
      },
      {
        "name": "state",
        "type": "uint8"
      },
      {
        "name": "date",
        "type": "uint256"
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
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_date",
        "type": "uint256"
      },
      {
        "name": "_options",
        "type": "string"
      },
      {
        "name": "_optionCount",
        "type": "uint8"
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
    "signature": "0x9501cec4"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_eventId",
        "type": "bytes32"
      }
    ],
    "name": "cancelEvent",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xaa26176c"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_eventId",
        "type": "bytes32"
      }
    ],
    "name": "lockEvent",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xc7b3aa3c"
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
    "name": "completeEvent",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x27afc7ae"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "testConnection",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function",
    "signature": "0x3412a15c"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "addTestData",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xa212b454"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x38cc4831"
  }
]; 

const test = async(() => {
    const contract = new web3js.eth.Contract(abi, address); 

    const accounts = await(web3js.eth.getAccounts()); 

    //web3.sendTransaction({to:"0x0fF34fCF14571ceD47a94015eaFdB27B9fCB0338", from:accounts[0], value:web3.toWei("0.5", "ether")})

    //transfer some eth to 0x0fF34fCF14571ceD47a94015eaFdB27B9fCB0338

    const evts = await(contract.methods.getPendingEvents().call()); 
    for (let n=0; n<evts.length; n++) {
        const evt = await(contract.methods.getEvent(evts[n]).call()); 
        console.log(JSON.stringify(evt)); 
    }
    
    let output = null; 
    
    //output = await(contract.methods.eventExists("0x87cd7e3abddb8f641b7a09d21f7d8c1f4455004011c0f5824a684eec7a843fc7").call()); 

    output = await(contract.methods.addEvent("huckabee vs. doncaster", 1552670254, "mike huckabee|claudius doncaster", 2).call());
    
    let exists = await(contract.methods.eventExists(output).call()); 
    if (exists) {
      console.log('but why?')
    }

    //output = await(contract.methods.cancelEvent(evts[1]).call()); 

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