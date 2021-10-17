// 部署智能合约脚本
// 部署教程 @see https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations
// 引入合约
const Adoption = artifacts.require("Adoption");

module.exports = function (deployer) {
  // 部署合约
  deployer.deploy(Adoption);
};