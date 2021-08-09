require('dotenv').config();

module.exports = {
  ERC20: {
    tokenName: 'FutureCoin',
    symbol: 'FC',
    initialSupply: '1000000000000000000000',
    ownerAddress: process.env.OWNER_ADDRESS,
  },
  TokenStorage: {
    admin: process.env.OWNER_ADDRESS,
  }
};
