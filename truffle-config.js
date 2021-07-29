require('dotenv').config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

const infuraAccessToken = process.env.INFURA_ACCESS_TOKEN;
const privateKey = process.env.PRIVATE_KEY;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(privateKey, `https://rinkeby.infura.io/v3/${infuraAccessToken}`);
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  },
  compilers: {
    solc: {
      version: "0.8.2"
    }
  },
  plugins: [
    'truffle-plugin-verify',
    'solidity-coverage'
  ],

  api_keys: {
    etherscan: etherscanApiKey,
  }
};
