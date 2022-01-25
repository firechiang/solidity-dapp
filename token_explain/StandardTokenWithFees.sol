pragma solidity ^0.4.18;

import "./StandardToken.sol";
import "./Ownable.sol";

/**
 *  转账时需要交易费用（转账时减去交易费用）
 */ 
contract StandardTokenWithFees is StandardToken, Ownable {

  // Additional variables for use if transaction fees ever became necessary
  uint256 public basisPointsRate = 0;
  uint256 public maximumFee = 0;
  uint256 constant MAX_SETTABLE_BASIS_POINTS = 20;
  uint256 constant MAX_SETTABLE_FEE = 50;

  string public name;
  string public symbol;
  uint8 public decimals;
  uint public _totalSupply;

  uint public constant MAX_UINT = 2**256 - 1;


  // 计算交易费用
  function calcFee(uint _value) constant returns (uint) {
    uint fee = (_value.mul(basisPointsRate)).div(10000);
    if (fee > maximumFee) {
        fee = maximumFee;
    }
    return fee;
  }
  
  // 转账
  function transfer(address _to, uint _value) public returns (bool) {
    uint fee = calcFee(_value);
    uint sendAmount = _value.sub(fee);

    super.transfer(_to, sendAmount);
    if (fee > 0) {
      super.transfer(owner, fee);
    }
  }

  // 授权后转账
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[_from]);
    require(_value <= allowed[_from][msg.sender]);

    uint fee = calcFee(_value);
    uint sendAmount = _value.sub(fee);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(sendAmount);
    if (allowed[_from][msg.sender] < MAX_UINT) {
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    }
    Transfer(_from, _to, sendAmount);
    if (fee > 0) {
      balances[owner] = balances[owner].add(fee);
      Transfer(_from, owner, fee);
    }
    return true;
  }

  // 设置交易费用
  function setParams(uint newBasisPoints, uint newMaxFee) public onlyOwner {
      // Ensure transparency by hardcoding limit beyond which fees can never be added
      require(newBasisPoints < MAX_SETTABLE_BASIS_POINTS);
      require(newMaxFee < MAX_SETTABLE_FEE);

      basisPointsRate = newBasisPoints;
      maximumFee = newMaxFee.mul(uint(10)**decimals);

      Params(basisPointsRate, maximumFee);
  }

  // Called if contract ever adds fees
  event Params(uint feeBasisPoints, uint maxFee);

}