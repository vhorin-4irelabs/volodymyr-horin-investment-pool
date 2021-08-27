const { expect } = require('chai');

const TokenStorageProxy = artifacts.require('TokenStorageProxy');

// TODO: Add tests for TokenStorageProxy
contract('TokenStorageProxy', function (accounts) {
  const [initialImplementation, owner] = accounts;

  beforeEach(async function () {
    this.token = await TokenStorageProxy.new(initialImplementation, owner);
  });

  describe('TODO: Add tests', function () {
    it('TODO: Add tests', async function () {
      expect(true).to.be.equal(true);
    });
  });
});
