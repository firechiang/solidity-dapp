// web3js相关文档 https://web3js.readthedocs.io/en/v1.3.0/#
App = {
  web3Provider: null,
  contracts: {},
  web3: null,
  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });
    // 绑定点击事件
    return App.bindEvents()
  },

  /**
   * 初始化智能合约
   * @returns 
   */
  initContract: function() {
    // 获取到智能合约相关abi并初始化对象
    // 注意：我们可以直接引用 Adoption.json 是因为我们在 bs-config.json 配置文件里面将智能合约相关文件加载到了 lite-server 服务
    $.getJSON('Adoption.json', function(data) {
        console.info(data)
        // 初始化智能合约
        App.contracts.Adoption = TruffleContract(data)
        App.contracts.Adoption.setProvider(App.web3Provider)
        // 标记宠物是否被领养
        return App.markAdopted()
    });
  },

  /**
   * 绑定点击事件
   */
  bindEvents: function() {
    // 绑定点击领养按钮事件
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    // 绑定点击连接钱包事件
    $(document).on('click', '#connect_wallet', App.handleConnectWallet);
    // 绑定点击断开连接钱包事件
    $(document).on('click', '#disconnect_wallet', App.handleDisconnectWallet);
  },

  /**
   * 标记宠物是否被领养
   */
  markAdopted: function() {
    // 获取到智能合约实例
    App.contracts.Adoption.deployed().then(function(instance) {
      // 使用智能合约实例instance，调用智能合约函数 getAdopters 并返回结果
      return instance.getAdopters.call()

    }).then(function(adopters) {
        // 遍历智能合约函数 getAdopters 返回的结果
        for(i=0;i<adopters.length;i++) {
            // 该宠物已被领养（禁用领养按钮）
            if(adopters[i] !== '0x0000000000000000000000000000000000000000') {
              $('.panel-pet').eq(i).find('button').text('Success').attr('disabled',true)
            }
        }
    }).catch(e => {
      console.error(e)
    })
  },
  /**
   * 处理领养逻辑
   * @param {} event 
   */
  handleAdopt: function(event) {
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    // 获取ETH账户余额
    App.web3.eth.getAccounts((error,accounts) => {
        console.info('账户信息')
        console.info(accounts)
        // 把第一个账户当成默认账户
        var account = accounts[0]
        // 获取到智能合约实例
        App.contracts.Adoption.deployed().then(function(instance) {
            // 使用智能合约实例instance，调用智能合约函数 adopt 领养宠物，并返回领养结果
            return instance.adopt(petId,{from:account})
        }).then(res => {
            console.info(res+'号宠物被领养');
            // 处理智能合约函数 adopt 领养宠物返回的结果
            // 刷新界面标记宠物是否被领养
            return App.markAdopted()
        }).catch(e => {
          console.error(e)
        })
    });
  },
  /**
   * 处理钱包连接逻辑
   * @param {*} event 
   */
  handleConnectWallet: function(event) {
    console.info(ethereum)
    // 浏览器安装了 MetaMask 插件
    if (window.ethereum) {
      App.web3 = new Web3(window.ethereum);
      // 引导用户授权
      window.ethereum
      .request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })
      .then((permissions) => {
        const accountsPermission = permissions.find(
          (permission) => permission.parentCapability === 'eth_accounts'
        );
        if (accountsPermission) {
          console.log('eth_accounts permission successfully requested（用户授权成功）!');
          // 获取账户相关信息
          App.getAccountInfo();
        }
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Permissions needed to continue（用户未授权）.');
        } else {
          console.error(error);
        }
      });
      try {
        // 请求连接MetaMask（已废弃，建议使用下面eth_requestAccounts（获取账户的方式））
        //window.ethereum.enable();
        // 获取用户账户信息
        //window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts)=>{
            // 钱包账户信息
            //console.info('钱包账户信息'+accounts)
        //});
      } catch (error) {
        // 用户拒绝获取MetaMask账户信息
        console.info(error)
      }
      // 判断MetaMask所连接的网络ID是不是 Ethereum 主网的
      if (window.ethereum.networkVersion !== "1") {
          //console.log('当前网络不在以太坊')
      }
      // 监听账号切换
      window.ethereum.on("accountsChanged", function(accounts) {
        $('#connect_wallet').text('已连接：'+accounts[0]).attr('disabled',true)
      });
      // 监听链切换
      ethereum.on('chainChanged', (chainId) => {

      });
      // 监听连接
      ethereum.on('connect',  (connectInfo) => {
        // 确定提供程序何时/是否连接。
        if(ethereum.isConnected()){
            console.info('asasas')
        }
      });
      // 监听断开连接
      ethereum.on('disconnect', (error) => {

      });
      // 监听消息
      ethereum.on('message', (message) => {

      });

    } else if (window.web3) {
      // Use Mist/MetaMask's provider.
      App.web3 = window.web3;
      // 获取账户相关信息
      App.getAccountInfo();
    } else {
      // 注意：连接地址是ETH RPC服务地址
      // websocket 连接
      //const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:7545');
      // http 连接
      const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      App.web3 = new Web3(provider);
      // 获取账户相关信息
      App.getAccountInfo();
    }
  },

  /**
   * 处理断开连接钱包逻辑
   * @param {*} event 
   */
  handleDisconnectWallet: function(event) {
      console.info(App.web3.eth.accounts)
      // 放开连接钱包按钮
      $('#connect_wallet').text('连接钱包').attr('disabled',false);
      // 隐藏断开连接钱包按钮
      $("#disconnect_wallet").css({"display":"none"});
  },

  /**
   * 获取账户相关
   */
  getAccountInfo: function() {
    App.web3.eth.getAccounts(function(error,accounts) {
      $('#connect_wallet').text('已连接：'+accounts[0]).attr('disabled',true)
    });
    // 配置 web3Provider
    App.web3Provider = App.web3.currentProvider;
    // 钱包连接成功初始化智能合约
    App.initContract();
    // 显示断开连接钱包按钮
    $("#disconnect_wallet").css({"display":"block"});
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
