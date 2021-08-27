const { expect } = require('chai');

const Proxy = artifacts.require('Proxy');

// TODO: Add tests for Proxy
contract('Proxy', function (accounts) {
  beforeEach(async function () {
    this.token = await Proxy.new();
  });

  describe('TODO: Add tests', function () {
    it('TODO: Add tests', async function () {
      expect(true).to.be.equal(true);
    });
  });
});
