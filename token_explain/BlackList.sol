pragma solidity ^0.4.18;

import "./Ownable.sol";

/**
 * @dev 黑名单
 */
contract BlackList is Ownable {

    // 查询某个地址是否进入黑名单
    /////// Getter to allow the same blacklist to be used also by other contracts (including upgraded Tether) ///////
    function getBlackListStatus(address _maker) external constant returns (bool) {
        return isBlackListed[_maker];
    }
    // 存储地址是否进入黑名单
    mapping (address => bool) public isBlackListed;

    // 添加黑名单
    function addBlackList (address _evilUser) public onlyOwner {
        isBlackListed[_evilUser] = true;
        AddedBlackList(_evilUser);
    }

    // 移除黑名单
    function removeBlackList (address _clearedUser) public onlyOwner {
        isBlackListed[_clearedUser] = false;
        RemovedBlackList(_clearedUser);
    }

    event AddedBlackList(address indexed _user);

    event RemovedBlackList(address indexed _user);

}
