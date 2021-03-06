const web3 = require('web3'); 
const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const common = require('anybet-common');
const exception = common.exceptions('API');

const ROPSTEN_PROVIDER = "https://ropsten.infura.io/v3/811b27d11a824e41bb4e9f57ec7f47f2"; 
const LOCAL_PROVIDER = "http://localhost:9545"; 

const web3js = new web3(new web3.providers.HttpProvider(LOCAL_PROVIDER));

const _contractAddress = '0xDB83D5291CCAce20949a21B5524C93F202E9B1ba'; 
//const _contractAddress = '0x7B2FcEF2d89e31fbb992aF80a19A516A7EF4259B'; 

//const _ownerAddress = '0x0fF34fCF14571ceD47a94015eaFdB27B9fCB0338'; 
let _ownerAddress = null; 

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


const test = async(() => {
    const evts = await(_contract.methods.getPendingEvents().call()); 
    for (let n=0; n<evts.length; n++) {
        const evt = await(_contract.methods.getEvent(evts[n]).call()); 
        console.log(JSON.stringify(evt)); 
    }
    
    let output = null; 
    
    //output = await(_contract.methods.eventExists("0x87cd7e3abddb8f641b7a09d21f7d8c1f4455004011c0f5824a684eec7a843fc7").call()); 

    output = await(_contract.methods.addEvent("huckabee vs. doncaster", 1552670254, "mike huckabee|claudius doncaster", 2).call());
    
    let exists = await(_contract.methods.eventExists(output).call()); 
    if (exists) {
      console.log('but why?')
    }
});

const getAllEvents = async((context) => {
    return exception.try(() => {
        const output = [];
        const evts = await(_contract.methods.getAllEvents().call()); 
        if (evts && evts.length) {
            for (let n=0; n<evts.length; n++) {
                output.push({id: evts[n]});
            }
        }

        return {
            status: 200,
            content: output 
        }; 
    }, {
        defaultValue: {status: 500, content: null}
    });
});

const getPendingEvents = async((context) => {
    return exception.try(() => {
        const output = []; 
        const evts = await(_contract.methods.getPendingEvents().call()); 
        if (evts && evts.length) {
            for (let n=0; n<evts.length; n++) {
                output.push({id: evts[n]});
            }
        }

        return {
            status: 200,
            content: output 
        }; 
    }, {
        defaultValue: {status: 500, content: null}
    });
});

const getEventDetails = async((context, eventId) => {
    return exception.try(() => {
        const record = await(_contract.methods.getEvent(eventId).call()); 
        const output = {
            id: record.eventId,
            name: record.name, 
            date: parseInt(record.date), 
            options: record.options.split('|'), 
            outcome: parseInt(record.outcome),
            state: parseInt(record.state)
        };

        return {
            status: 200,
            content: output 
        }; 
    }, {
        defaultValue: {status: 500, content: null}
    });
});

const createEvent = async((context, name, options, date) => {
    return exception.try(() => {
        let output = false;

        if (!options) 
            options = [];

        //TODO: add validation of params
        let optionsString = ""; 
        for (let n=0; n<options.length; n++) {
            optionsString += options[n]; 
            if (n < (options.length-1)) 
                optionsString += "|"; 
        }

        const result = await(_contract.methods.addEvent(name, date, optionsString, options.length).send({from:_ownerAddress, gas: 3000000})); 
        if (result) {
            output = true;
        }

        return {
            status: 200,
            output: output
        }; 
    }, {
        defaultValue: {status: 500, content: null}
    });
});

const cancelEvent = async((context, eventId) => {
    return exception.try(() => {
        let output = false;

        const result = await(_contract.methods.cancelEvent(eventId).send({from:_ownerAddress})); 
        if (result) {
            output = true;
        }

        return {
            status: 200,
            output: output
        }; 
    }, {
        defaultValue: {status: 500, content: null}
    });
});

const lockEvent = async((context, eventId) => {
    return exception.try(() => {
        return exception.try(() => {
            let output = false;
    
            const result = await(_contract.methods.lockEvent(eventId).send({from:_ownerAddress})); 
            if (result) {
                output = true;
            }
    
            return {
                status: 200,
                output: output
            }; 
        });
    }, {
        defaultValue: {status: 500, content: null}
    });
});

const completeEvent = async((context, eventId, outcome) => {
    return exception.try(() => {
        let output = false;
    
        const result = await(_contract.methods.completeEvent(eventId, outcome).send({from:_ownerAddress})); 
        if (result) {
            output = true;
        }
    
        return {
            status: 200,
            output: output
        }; 
    }, {
        defaultValue: {status: 500, content: null}
    });
});

module.exports = {
    getAllEvents,
    getPendingEvents,
    getEventDetails,
    createEvent,
    cancelEvent,
    lockEvent,
    completeEvent
}