pragma solidity >=0.4.17 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

/**
 * 测试Adoption智能合约
 */ 
contract TestAdoption {
    // 拿到Adoption合约
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

     /**
      * 测试领养宠物
      */
    function testCanAdoption() public {
        // 宠物ID
        uint expected = 1;
        // 领养宠物返回的ID就是我们传入的ID
        uint petId = adoption.adopt(expected);
        // 错误信息=返回的宠物ID与我们传入的不一直
        Assert.equal(petId,expected,"The returned Pet ID is different from the one we passed in");
    }

    /**
     * 测试宠物领养者的地址是否与当前合约地址一致（注意：先执行上面的领养宠物函数，领养成功后再执行当前函数）
     */
    function testGetAdoptionAddress() public {
        // 当前智能合约的地址（从当前对象中获取当前合约地址）
        address expected = address(this);
        // 获取宠物领养者的地址（先取到数组再通过下标取到值）
        address adopter = adoption.adopters(1);
        // 错误信息=领养者的地址与当前合约地址不一致
        Assert.equal(adopter,expected,"The address of the adopter is inconsistent with the current contract address");
    }

    /**
     * 测试获取所有宠物领养信息，再测试宠物领养者的地址是否与当前合约地址一致（注意：先执行最上面的领养宠物函数，领养成功后再执行当前函数）
     */
    function testGetAllAdopters() public {
        // 当前智能合约的地址（从当前对象中获取当前合约地址）
        address expected = address(this);
        // 宠物所有领养信息
        address[16] memory adopters = adoption.getAdopters();
        // 错误信息=领养者的地址与当前合约地址不一致
        Assert.equal(adopters[1],expected,"The address of the adopter is inconsistent with the current contract address");
    }
}


