const ERC20 = artifacts.require("ERC20");
const appConfig = require('../app.config');

module.exports = function(deployer) {
  deployer.deploy(ERC20, appConfig.ERC20.tokenName, appConfig.ERC20.symbol, appConfig.ERC20.initialSupply, appConfig.ERC20.ownerAddress);
};
