pragma solidity =0.5.16;

import './interfaces/IUniswapV2Factory.sol';
import './UniswapV2Pair.sol';

/**
 * 创建流动性时为交易对创建部署UniswapV2Pair合约（创建部署交易配对合约）
 */
contract UniswapV2Factory is IUniswapV2Factory {
    //收税地址
    address public feeTo;
    //控制修改收税地址的地址
    address public feeToSetter;
    //配对合约映射,地址(token0)=>(地址(token1)=>地址(配对合约地址))
    mapping(address => mapping(address => address)) public getPair;
    //所有配对合约地址数组
    address[] public allPairs;
    //配对合约被创建事件
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);
    /**
     * @dev 构造函数
     * @param _feeToSetter 控制修改收税地址的地址
     */
    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    /**
     * @dev 查询配对合约数组的长度
     */
    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    /**
     * 创建部署配对合约
     * @param tokenA TokenA
     * @param tokenB TokenB
     * @return pair 配对地址
     */
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        //确认tokenA不等于tokenB
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        //将tokenA和tokenB进行大小排序,确保tokenA小于tokenB
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        //确认token0不等于0地址
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        //确认配对映射中不存在token0=>token1（就是通过token0去getPair这个Map里面取值，取到值之后再用token1继续取值，最终得到结果）
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        //给bytecode变量赋值为"UniswapV2Pair"合约的创建字节码（就是UniswapV2Pair合约文件经过编译后的字节码）
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        //将token0和token1打包后创建哈希（注意：这个操作是为了部署合约和计算得到配对合约部署成功后的合约地址）
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        //内联汇编
        assembly {
            //通过create2方法布署合约,并且加盐,返回地址到pair变量（就是配对合约部署成功后的合约地址）
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        //通过合约地址调用合约中的"initialize"方法,传入token0,token1参数
        //说明：调用上面刚刚部署好的配对合约，里面的initialize函数，也就是初始化刚刚部署好的配对合约
        IUniswapV2Pair(pair).initialize(token0, token1);
        //为配对映射赋值 token0=>token1=pair
        getPair[token0][token1] = pair;
        //反过来又为配对映射赋值 token1=>token0=pair
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        //将合约地址存入配对数组中
        allPairs.push(pair);
        //触发配对合约部署成功事件
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    /**
     * @dev 设置收税地址
     * @param _feeTo 收税地址
     */
    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }

    /**
     * @dev 修改控制收税地址的地址
     * @param _feeToSetter 控制收税地址的地址
     */
    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}