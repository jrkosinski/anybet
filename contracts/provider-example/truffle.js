require('babel-register')
var HDWalletProvider = require("truffle-hdwallet-provider"); 
	
var mnemonic = "put virtual street chicken order civil when aerobic discover culture buzz street";

/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
	networks: {
		development: {
		  host: "localhost",
		  port: 9545,
		  network_id: "*" // Match any network id
		},
		ropsten: {
			provider: function() {
				return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/811b27d11a824e41bb4e9f57ec7f47f2");
			}, 
			network_id: 3, 
			gas: 4700000, 
			from: "0x0fF34fCF14571ceD47a94015eaFdB27B9fCB0338".toLowerCase()
		}, 
		ropsten_local: {
			provider: function() {
				return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/811b27d11a824e41bb4e9f57ec7f47f2");
			}, 
			network_id: 3, 
			gas: 4700000, 
			from: "0x0fF34fCF14571ceD47a94015eaFdB27B9fCB0338".toLowerCase()
		}
		/*
		rinkeby: {
		  host: "localhost", // Connect to geth on the specified
		  port: 8545,
		  network_id: 4,
		  gas: 4612388 // Gas limit used for deploys
		}
		*/
	}
};
