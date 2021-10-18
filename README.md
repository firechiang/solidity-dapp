#### 一、安装ETH智能合约部署工具，[Truffle使用文档](https://www.trufflesuite.com/docs/truffle/getting-started/creating-a-project)
```
$ npm install -g truffle
```

#### 二、安装ETH链上环境模拟器，[下载地址](https://github.com/trufflesuite/ganache-ui/releases)
![image](https://github.com/firechiang/solidity-dapp/blob/master/images/solidity-dapp-ganache-001.PNG)
![image](https://github.com/firechiang/solidity-dapp/blob/master/images/solidity-dapp-ganache-002.PNG)
![image](https://github.com/firechiang/solidity-dapp/blob/master/images/solidity-dapp-ganache-003.PNG)

#### 三、部署ETH智能合约
```
$ cd '项目目录'

# 编译智能合约
$ truffle compile

# 部署智能合约（注意：要把智能合约部署到ETH的哪个网络上，在项目目录下的truffle-config.js上配置）
# 部署成功后，在 build\contracts 目录下的 Adoption.json 文件里面会自动加上 networks 要部署到的网络相关信息
$ truffle migrate

# 使用代码测试智能合约相关逻辑（注意：单元测试代码下载test目录下。测试代码可以使用solidity或javascript编写）
# 测试代码编写文档 @see https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-solidity
$ truffle test
```

