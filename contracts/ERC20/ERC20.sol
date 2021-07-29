pragma solidity ^0.8.0;

import "../utils/SafeMath.sol";
import "./IERC20.sol";
import "../utils/Context.sol";

contract ERC20 is Context, IERC20 {
    using SafeMath for uint256;

    string private _name; // token name
    string private _symbol; // token symbols, referred to as
    uint8 private _decimals; // Number of decimal places tokens
    uint256 private _totalSupply; // token issuing a total

    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) {
        _name = name;
        _symbol = symbol;
        _mint(owner, initialSupply);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return 18;
    }

    // totalSupply specific implementation method, where a return to the private variable _totalSupply, this value can be directly is our total tokens, which also reason to write is to revise the total amount of tokens hidden, can not be made arbitrarily modified.
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    // balanceOf specific implementation method, mapping is a key-value pair data structure.
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    // Here is a concrete realization transfer method, and it is open to the _transfer method, because we realize the transfer function of a _transfer in vivo.
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    // Here is a concrete realization approve the method, and it is open to approve approach, because we approve of _approve function is implemented in the method body.
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    // Here is a concrete realization transferFrom method, and it is open to the _transferFrom approach, because we transferFrom functionality is implemented in a _transferFrom method body.
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    // increase the number of approved, we can see here is a direct value corresponding to the approved _allowances was a modification.
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    // reduce the number of approval, the approval of the minimum number is 0, it can not be negative. solidity itself is not the add () sub () method, which is SafeMath library method.
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    // transfer method implementation
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer (sender, recipient, amount); // this event is triggered Transfer
    }

    // (mining) issuance of tokens, specifying a valid address to add a certain number of tokens, because of the additional, so to modify _totalSupply tokens of the total value. Use internal modifier indicates that the internal function, choose whether to implement the methods disclosed in accordance with project requirements.
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    // (destroy) reduction token, the address is added to destroy a certain number of tokens, also need to modify _totalSupply tokens of the total value.
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    // approve the specific implementation method
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval (owner, spender, amount); // this event is triggered Approval
    }

    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        _approve(account, _msgSender(), _allowances[account][_msgSender()].sub(amount, "ERC20: burn amount exceeds allowance"));
    }
}
