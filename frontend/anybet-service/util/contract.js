const web3 = require('web3'); 
const await = require('asyncawait/await'); 
const async = require('asyncawait/async'); 
const keccak256 = require('keccak256'); 
const common = require('anybet-common');
const exception = common.exceptions('API');
const abi = require('./abi'); 

const ROPSTEN_PROVIDER = "https://ropsten.infura.io/v3/811b27d11a824e41bb4e9f57ec7f47f2"; 
const LOCAL_PROVIDER = "http://localhost:9545"; 

const web3js = new web3(new web3.providers.HttpProvider(LOCAL_PROVIDER));

const _contractAddress = '0x3aF71F00ACF888F4470Cea09BE8AC1ee513ea4B3'; 

//const _ownerAddress = '0x0fF34fCF14571ceD47a94015eaFdB27B9fCB0338'; 
let _ownerAddress = null; 

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
        //const r = await(_contract.methods.placeBet("0x76aa380ce4bde298c69b07de6f0a85ff97ff9f56bd8d693de2fb26cdb756347d", 0).send({from: _ownerAddress, gas:1000000, value:1000000000000})); 
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

        let result = await(_contract.methods.addEvent(providerAddress, providerEventId, minimumBet).send({from:_ownerAddress, gas: 3000000})); 
        if (result) {
            eventId = '0x' + keccak256(providerAddress, providerEventId).toString('hex'); 
            //eventId = await(_contract.methods.getEventId(providerAddress, providerEventId).call()); 
        }

        return eventId;
    });
});

module.exports = {
    abi: abi, 
    address: _contractAddress, 
    
    getAllEvents,
    getPendingEvents, 
    getEventDetails, 
    addEvent
}; 