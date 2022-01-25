pragma solidity ^0.4.4;
/* solhint-disable var-name-mixedcase */


contract Migrations {
    address public owner;
    uint public last_completed_migration;

    // 定义一个函数修改器（函数过滤器）名字叫 restricted ，就是在某个函数调用之前执行函数过滤器码(相当于过滤器代码)
    modifier restricted() {
        // _ 表示判断通过后调用实际函数
        if (msg.sender == owner) _;
    }

    // 构造器
    function Migrations() public {
        owner = msg.sender;
    }
    
    // 设置已完成
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    // 更新最后完成状态
    function upgrade(address newAddress) public restricted {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(last_completed_migration);
    }
}
