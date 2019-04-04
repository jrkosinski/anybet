
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
        alert(web3.eth.accounts[0]);
        api.getContractInfo((data, err) => {
            if (data) {
                AnybetContract = web3.eth.contract(data.abi);
                Anybet = AnybetContract.at(data.address); 

                window.contracts.anybet = Anybet;
            }
        }); 
    }
});