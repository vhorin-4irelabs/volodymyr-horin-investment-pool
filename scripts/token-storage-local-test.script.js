require('dotenv').config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const tokenStorageConfig = require('../build/contracts/TokenStorage.json');
const TokenStorageProxyConfig = require('../build/contracts/TokenStorageProxy.json');
const erc20Config = require('../build/contracts/ERC20.json');

// Token owner address + private key
const ownerAccountAddress = process.env.OWNER_ADDRESS;
const ownerAccountPrivateKey = process.env.PRIVATE_KEY;

// First address from ganache + private key
const testAccountAddress = '';
const testAccountPrivateKey = '';

// Contracts
const erc20ContractAddress = '';
const tokenStorageContractAddress = '';
const tokenStorageProxyContractAddress = '';

module.exports = async function() {
  const ownerWallet = new Web3(new HDWalletProvider(ownerAccountPrivateKey, `http://localhost:8545`));
  const testWallet = new Web3(new HDWalletProvider(testAccountPrivateKey, `http://localhost:8545`));
  const erc20Contract = new ownerWallet.eth.Contract(erc20Config.abi, erc20ContractAddress);
  const tokenStorageContract = new ownerWallet.eth.Contract(tokenStorageConfig.abi, tokenStorageProxyContractAddress);
  const tokenStorageProxyContract = new ownerWallet.eth.Contract(TokenStorageProxyConfig.abi, tokenStorageProxyContractAddress);
  const oneToken = web3.utils.toWei('1');

  console.log('Sending 1.1 ETH to owner address...');
  await testWallet.eth.sendTransaction({
    from: testAccountAddress,
    to: ownerAccountAddress,
    value: web3.utils.toWei('1.1', 'ether'),
    gas: 2000000,
  });
  console.log(`1.1 ETH sent to owner ${ownerAccountAddress}`);

  console.log('Updating TokenStorageProxy implementation version...');
  await tokenStorageProxyContract.methods.upgradeTo(tokenStorageContractAddress).send({
    from: ownerAccountAddress
  });
  console.log(
    'TokenStorageProxy version: ',
    await tokenStorageProxyContract.methods.currentVersion().call({ from: ownerAccountAddress })
  );

  console.log('Approving 1 token for TokenStorageProxy contract...');
  await erc20Contract.methods.approve(tokenStorageProxyContractAddress, oneToken).send({
    from: ownerAccountAddress
  });
  console.log(`1 token has been approved for TokenStorageProxy (${tokenStorageProxyContractAddress})`);

  console.log('Depositing 1 token...');
  await tokenStorageContract.methods.depositToken(oneToken).send({
    from: ownerAccountAddress
  });
  console.log('1 token has been deposited');
  console.log(
    'Owner token balance: ',
    await tokenStorageContract.methods.getTokenBalance().call({ from: ownerAccountAddress })
  );

  console.log('Withdrawing 1 token...');
  await tokenStorageContract.methods.withdrawToken(oneToken).send({
    from: ownerAccountAddress
  });
  console.log('1 token has been received');
  console.log(
    'Owner token balance: ',
    await tokenStorageContract.methods.getTokenBalance().call({ from: ownerAccountAddress })
  );

  console.log('Setting owner balance to 1 token...');
  await tokenStorageContract.methods.updateTokenBalance(ownerAccountAddress, oneToken).send({
    from: ownerAccountAddress
  });
  console.log(
    'Owner token balance: ',
    await tokenStorageContract.methods.getTokenBalance().call({ from: ownerAccountAddress })
  );

  console.log('Setting owner balance to 0...');
  await tokenStorageContract.methods.updateTokenBalance(ownerAccountAddress, 0).send({
    from: ownerAccountAddress
  });
  console.log(
    'Owner token balance: ',
    await tokenStorageContract.methods.getTokenBalance().call({ from: ownerAccountAddress })
  );

  console.log('Depositing 1 ETH...');
  await tokenStorageContract.methods.depositETH().send({
    from: ownerAccountAddress,
    value: oneToken,
  });
  console.log('1 ETH has been deposited');
  console.log(
    'Owner ETH balance: ',
    await tokenStorageContract.methods.getETHBalance().call({ from: ownerAccountAddress })
  );

  console.log('Withdrawing 1 ETH...');
  await tokenStorageContract.methods.withdrawETH(oneToken).send({
    from: ownerAccountAddress,
  });
  console.log('1 ETH has been received');
  console.log(
    'Owner ETH balance: ',
    await tokenStorageContract.methods.getETHBalance().call({ from: ownerAccountAddress })
  );

  console.log('Sending 1 ETH back to test address...');
  await ownerWallet.eth.sendTransaction({
    from: ownerAccountAddress,
    to: testAccountAddress,
    value: web3.utils.toWei('1', 'ether'),
    gas: 2000000,
  });
  console.log(`1 ETH sent back to test account ${ownerAccountAddress}`);
  console.log(
    'Owner ETH balance: ',
    await tokenStorageContract.methods.getETHBalance().call({ from: ownerAccountAddress })
  );
}