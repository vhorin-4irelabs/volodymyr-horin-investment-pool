pragma solidity ^0.8.0;

import "../utils/StorageSlot.sol";

contract Proxy {
    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the keccak-256 hash of "proxy.implementation"
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x24ed44ee9374370fd3aa7c8b1abf58827504c20f65246b17d2b9e7e1aef77847;

    /**
     * @dev Storage slot with the number of the current version.
     * This is the keccak-256 hash of "proxy.version"
     */
    bytes32 internal constant _VERSION_SLOT = 0xd5fc8d396276aa91befc6c316c18c9435be69c677ed2ba2a3e9d17d7cfcb51f0;

    /**
     * @dev Delegates the current call to `implementation`.
     *
     * This function does not return to its internall call site, it will return directly to the external caller.
     */
    function _delegate(address implementation) internal virtual {
        assembly {
        // Copy msg.data. We take full control of memory in this inline assembly
        // block because it will not return to Solidity code. We overwrite the
        // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

        // Call the implementation.
        // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)

        // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    /**
     * @dev Delegates the current call to the address returned by `_implementation()`.
     *
     * This function does not return to its internall call site, it will return directly to the external caller.
     */
    function _fallback() internal virtual {
        _delegate(_implementation());
    }

    /**
     * @dev Fallback function that delegates calls to the address returned by `_implementation()`. Will run if no other
     * function in the contract matches the call data.
     */
    fallback() external payable virtual {
        _fallback();
    }

    /**
     * @dev Returns the address to which the fallback function
     * and {_fallback} should delegate.
     */
    function _implementation() internal view returns (address) {
        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }

    /**
     * @dev Returns the address to which the fallback function
     * and {_fallback} should delegate.
     */
    function _version() internal view returns (uint256) {
        return StorageSlot.getUint256Slot(_VERSION_SLOT).value;
    }

    /**
     * @dev Stores a new address in the implementation slot.
     */
    function _setImplementation(address newImplementation) internal {
        StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
    }

    /**
     * @dev Stores a new address in the implementation slot.
     */
    function _setVersion(uint256 newVersion) internal {
        StorageSlot.getUint256Slot(_VERSION_SLOT).value = newVersion;
    }
}