pragma solidity >=0.4.17 <0.9.0;

/**
 * 领养相关逻辑
 * 存储修饰 storage=（数据写入区块链，落地磁盘）；memory=（数据写入内存，不持久化）；calldata=（数据不可修改，不可持久化）
 */
contract Adoption {

    // 领养信息记录（数组下标=宠物ID,值=领养者的地址）
    // 注意：成员变量默认的存储修饰是 storage 模式，就是数据写入区块链。落地磁盘
    address[16] public adopters;

    /**
     * 领养宠物
     * @param petId 宠物ID
     * return 宠物ID
     */
    function adopt(uint petId) public returns (uint) {
        // 判断宠物ID是否大等于0 并且 小于等于15
        require(petId >= 0 && petId <= 15);
        adopters[petId] = msg.sender;
        return petId;
    }

    /**
     * 获取所有宠物的领养信息
     * view   表示该函数是视图函数，在函数内部是不能更改成员变量的信息的
     * memory 表示内存中的数据（在这里的修饰是返回内存中的数据）
     */
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

}