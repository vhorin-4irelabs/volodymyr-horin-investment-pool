pragma solidity ^0.8.0;

import "./Context.sol";
import "./StorageSlot.sol";

abstract contract Ownable is Context {
    /**
     * @dev Storage slot with the address of the current owner.
     * This is the keccak-256 hash of "ownable.owner"
     */
    bytes32 internal constant _OWNER_SLOT = 0x8a721d7331971cd5eefcd6a2b20c226462fc25662d105424a4f69c8d550cca50;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the initial owner.
     */
    constructor(address initialOwner) {
        _setOwner(initialOwner);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return StorageSlot.getAddressSlot(_OWNER_SLOT).value;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _setOwner(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _setOwner(newOwner);
    }

    function _setOwner(address newOwner) private {
        address oldOwner = owner();
        StorageSlot.getAddressSlot(_OWNER_SLOT).value = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}