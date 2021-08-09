const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const ERC20Mock = artifacts.require('ERC20Mock');
const TokenStorage = artifacts.require('TokenStorage');

contract('TokenStorage', function (accounts) {
  const [initialHolder, testAccount] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token = await ERC20Mock.new(name, symbol, initialHolder, initialSupply);
    this.tokenStorage = await TokenStorage.new(this.token.address, initialHolder);
  });

  describe('depositToken', function () {
    it('when not allowed, can not deposit tokens', async function () {
      await expectRevert(this.tokenStorage.depositToken(
        initialSupply, { from: initialHolder }), 'ERC20: transfer amount exceeds allowance',
      );
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });

    it('when exceeds allowance. can not deposit tokens', async function () {
      await this.token.approve(this.tokenStorage.address, initialSupply - 1, { from: initialHolder });
      await expectRevert(this.tokenStorage.depositToken(
        initialSupply, { from: initialHolder }), 'ERC20: transfer amount exceeds allowance',
      );
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });

    it('when not enough tokens, can not deposit tokens', async function () {
      await this.token.approve(this.tokenStorage.address, initialSupply + 1, { from: initialHolder });
      await expectRevert(this.tokenStorage.depositToken(
        initialSupply + 1, { from: initialHolder }), 'ERC20: transfer amount exceeds balance',
      );
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });

    it('deposits correctly', async function () {
      await this.token.approve(this.tokenStorage.address, initialSupply, { from: initialHolder });
      await this.tokenStorage.depositToken(initialSupply, { from: initialHolder });
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal(initialSupply);
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal('0');
    });
  });

  describe('withdrawToken', function () {
    it('when not enough balance, can not withdraw tokens', async function () {
      await this.token.approve(this.tokenStorage.address, initialSupply, { from: initialHolder });
      await this.tokenStorage.depositToken(initialSupply, { from: initialHolder });
      await expectRevert(this.tokenStorage.withdrawToken(
        initialSupply + 1, { from: initialHolder }), 'Receive amount exceeds balance',
      );
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal(initialSupply);
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal('0');
    });

    it('withdraws correctly', async function () {
      await this.token.approve(this.tokenStorage.address, initialSupply, { from: initialHolder });
      await this.tokenStorage.depositToken(initialSupply, { from: initialHolder });
      await this.tokenStorage.withdrawToken(initialSupply, { from: initialHolder });
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });
  });

  describe('getTokenBalance', function () {
    it('when no tokens, returns zero', async function () {
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
    });

    it('when has some tokens, returns sender balance', async function () {
      await this.token.approve(this.tokenStorage.address, initialSupply, { from: initialHolder });
      await this.tokenStorage.depositToken(initialSupply, { from: initialHolder });
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });
  });

  describe('updateTokenBalance', function () {
    it('when sender is not admin, reverts', async function () {
      await expectRevert(this.tokenStorage.updateTokenBalance(
        initialHolder, '1',
        { from: testAccount }), 'Method allowed only for admin',
      );
      expect(await this.tokenStorage.getTokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
    });

    it('when sender is not admin, updates balance', async function () {
      const testBalance = '777';
      await this.tokenStorage.updateTokenBalance(testAccount, testBalance, { from: initialHolder });
      expect(await this.tokenStorage.getTokenBalance({ from: testAccount })).to.be.bignumber.equal(testBalance);
    });
  });

  describe('depositETH', function () {
    it('when not enough ether, can not deposit', async function () {
      const balanceBeforeDeposit = await web3.eth.getBalance(testAccount);
      await expectRevert(
        this.tokenStorage.depositETH({
          from: testAccount,
          value: new BN(balanceBeforeDeposit).add(new BN(1)).toString(),
          gasPrice: 0
        }),
        'sender doesn\'t have enough funds');
      expect(await web3.eth.getBalance(testAccount)).to.be.bignumber.equal(balanceBeforeDeposit);
    });

    it('deposits correctly', async function () {
      const ethToSend = '777';
      const balanceBeforeDeposit = await web3.eth.getBalance(testAccount);

      await this.tokenStorage.depositETH({
        from: testAccount,
        value: ethToSend,
        gasPrice: 0
      });

      expect(await web3.eth.getBalance(testAccount)).to.be.bignumber.equal(new BN(balanceBeforeDeposit).sub(new BN(ethToSend)));
      expect(await this.tokenStorage.getETHBalance({ from: testAccount })).to.be.bignumber.equal(ethToSend);
    });
  });

  describe('withdrawETH', function () {
    it('when not enough balance, can not withdraw ether', async function () {
      const initEthBalance = '123';
      await this.tokenStorage.depositETH({
        from: testAccount,
        value: initEthBalance,
        gasPrice: 0
      });
      const balanceBeforeWithdraw = await web3.eth.getBalance(testAccount);
      await expectRevert(
        this.tokenStorage.withdrawETH( new BN(initEthBalance).add(new BN('1')).toString(), {
          from: testAccount,
          gasPrice: 0
        }),
        'Receive amount exceeds balance');
      expect(await web3.eth.getBalance(testAccount)).to.be.bignumber.equal(balanceBeforeWithdraw);
      expect(await this.tokenStorage.getETHBalance({ from: testAccount })).to.be.bignumber.equal(initEthBalance);
    });

    it('withdraws correctly', async function () {
      const initEthBalance = '123';
      const ethToWithdraw = '122';
      await this.tokenStorage.depositETH({
        from: testAccount,
        value: initEthBalance,
        gasPrice: 0
      });
      const balanceBeforeWithdraw = await web3.eth.getBalance(testAccount);

      await this.tokenStorage.withdrawETH(ethToWithdraw, {
        from: testAccount,
        gasPrice: 0
      });

      expect(await web3.eth.getBalance(testAccount)).to.be.bignumber.equal(new BN(balanceBeforeWithdraw).add(new BN(ethToWithdraw)));
      expect(await this.tokenStorage.getETHBalance({ from: testAccount })).to.be.bignumber.equal(new BN(initEthBalance).sub(new BN(ethToWithdraw)));
    });
  });


  describe('getETHBalance', function () {
    it('when no ether, returns zero', async function () {
      expect(await this.tokenStorage.getETHBalance({ from: testAccount })).to.be.bignumber.equal('0');
    });

    it('when has some ether, returns sender balance', async function () {
      const initEthBalance = '707';
      await this.tokenStorage.depositETH({
        from: testAccount,
        value: initEthBalance
      });
      expect(await this.tokenStorage.getETHBalance({ from: testAccount })).to.be.bignumber.equal(initEthBalance);
    });
  });
});
