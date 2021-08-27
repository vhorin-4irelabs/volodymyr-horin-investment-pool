pragma solidity ^0.8.0;

import "../utils/Ownable.sol";
import "../Proxy/Proxy.sol";

contract TokenStorageProxy is Ownable, Proxy {

    constructor(address initialImplementation, address owner) Ownable(owner) {
        _setImplementation(initialImplementation);
        _setVersion(1);
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`.
     */
    function upgradeTo(address newImplementation) external onlyOwner {
        uint256 newVersion = _version() + 1;
        _setImplementation(newImplementation);
        _setVersion(newVersion);
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`.
     */
    function currentVersion() external view returns(uint256) {
        return _version();
    }
}