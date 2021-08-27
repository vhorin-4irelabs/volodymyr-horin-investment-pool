// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../utils/Ownable.sol";

contract OwnableMock is Ownable {
    constructor(address owner) Ownable(owner) {}
}
