pragma solidity =0.5.16;

import '../UniswapV2ERC20.sol';

contract ERC20 is UniswapV2ERC20 {

    //token名称
    string public constant name = "LSW Test Coin";
    //token缩写
    string public constant symbol = "LSWC";

    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply * 10**18);
    }
}