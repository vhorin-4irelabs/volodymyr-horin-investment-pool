pragma solidity ^0.8.0;

import "../ERC20/IERC20.sol";
import "../utils/SafeMath.sol";

contract TokenStorage {
    using SafeMath for uint256;

    address public immutable _token;

    address private _admin;

    mapping (address => uint256) private _ethBalances;
    mapping (address => uint256) private _tokenBalances;

    event DepositToken(address indexed from, uint256 value);
    event WithdrawToken(address indexed from, uint256 value);

    event DepositETH(address indexed from, uint256 value);
    event WithdrawETH(address indexed from, uint256 value);

    constructor(address token, address admin) {
        _token = token;
        _admin = admin;
    }

    function depositToken(uint256 amount) public returns (bool) {
        IERC20(_token).transferFrom(msg.sender, address(this), amount);
        _tokenBalances[msg.sender] = _tokenBalances[msg.sender].add(amount);
        emit DepositToken (msg.sender, amount);
        return true;
    }

    function withdrawToken(uint256 amount) public returns (bool) {
        _tokenBalances[msg.sender] = _tokenBalances[msg.sender].sub(amount, "Receive amount exceeds balance");
        IERC20(_token).transfer(msg.sender, amount);
        emit WithdrawToken (msg.sender, amount);
        return true;
    }

    function getTokenBalance() public view returns (uint256) {
        return _tokenBalances[msg.sender];
    }

    function updateTokenBalance(address target, uint256 balance) public returns (bool) {
        require(msg.sender == _admin, "Method allowed only for admin");
        _tokenBalances[target] = balance;
        return true;
    }

    function depositETH() public payable returns (bool) {
        _ethBalances[msg.sender] = _ethBalances[msg.sender].add(msg.value);
        emit DepositETH (msg.sender, msg.value);
        return true;
    }

    function withdrawETH(uint256 amount) public returns (bool) {
        _ethBalances[msg.sender] = _ethBalances[msg.sender].sub(amount, "Receive amount exceeds balance");
        payable(msg.sender).transfer(amount);
        emit WithdrawETH (msg.sender, amount);
        return true;
    }

    function getETHBalance() public view returns (uint256) {
        return _ethBalances[msg.sender];
    }
}