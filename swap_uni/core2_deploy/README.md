#### 合约部署（注意：以下合约部署在Goerli网络，还有同一个账户同一个nonce值无论在那个网络上部署出来的合约地址都是一样的，这样我们的合约就可以兼容多个网络）
#### 编译工厂合约
![image](https://github.com/firechiang/solidity-dapp/blob/master/images/swap01.PNG)

#### 部署工厂合约（注意：当前合约部署完成后，需获得配对合约编译后二进制Hash值，可在编辑器中执行一下INIT_CODE_PAIR_HASH变量生成该值，并记录下来，在路由合约中修改，注意修改时去掉Hash值前面的0x；合约部署成功后合约地址=0x3Ed063e72204380122dD63df451b65A1B32b23c7）
![image](https://github.com/firechiang/solidity-dapp/blob/master/images/swap02.PNG)

#### 编译路由合约（注意：编译之前需要修改配对合约编译后二进制Hash值，该值在02UniswapV2Router02.sol文件第700行处修改，注意修改时不需要Hash值前面的0x）
![image](https://github.com/firechiang/solidity-dapp/blob/master/images/swap03.PNG)

#### 部署路由合约（成功后合约地址=0x6aEd7C957B4F357E1f2d4Dbe4991F63c1E7A0cf0）
![image](https://github.com/firechiang/solidity-dapp/blob/master/images/swap04.PNG)