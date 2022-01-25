pragma solidity ^0.4.0;


// 测试智能合约代码
contract BaseTest {
    
    uint8 a = 2;
    
    // 一个函数，它的返回值是一个int类型
    function getNum(uint8 b) public constant returns (int) {
        return a + b;
    }
    
    
}