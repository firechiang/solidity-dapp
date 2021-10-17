const Migrations = artifacts.require("Migrations");
// 引入合约
const Adoption = artifacts.require("Adoption");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  // 部署合约
  deployer.deploy(Adoption);
};
