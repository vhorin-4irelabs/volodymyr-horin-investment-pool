const ERC20 = artifacts.require("ERC20");
const TokenStorage = artifacts.require("TokenStorage");
const TokenStorageProxy = artifacts.require("TokenStorageProxy");
const appConfig = require('../app.config');

module.exports = async function(deployer) {
  await deployer.deploy(ERC20, appConfig.ERC20.tokenName, appConfig.ERC20.symbol, appConfig.ERC20.initialSupply, appConfig.ERC20.ownerAddress);

  const instanceERC20 = await ERC20.deployed();

  await deployer.deploy(TokenStorage, instanceERC20.address, appConfig.TokenStorage.ownerAddress);

  const instanceTokenStorage = await TokenStorage.deployed();

  await deployer.deploy(TokenStorageProxy, instanceTokenStorage.address, appConfig.TokenStorage.ownerAddress);
};
