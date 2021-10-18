// web3js相关文档 https://web3js.readthedocs.io/en/v1.3.0/#
App = {
  web3Provider: null,
  contracts: {},

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

    return await App.initWeb3();
  },

  /**
   * 初始化web3
   * @see https://github.com/ChainSafe/web3.js
   * @returns 
   */
  initWeb3: async function() {
    // 注意：连接地址是ETH RPC服务地址
    //var web3 = new Web3('ws://127.0.0.1:7545')
    var web3 = new Web3('http://127.0.0.1:7545')
    console.info(web3)

    //App.web3Provider = web3.currentProvider
    // websocket 连接
    //App.web3Provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:7545')

    // http 连接
    App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
    web3.setProvider(App.web3Provider)

    //web3.setProvider('ws://127.0.0.1:7545')
    //web3.setProvider('http://127.0.0.1:7545')
    //web3.setProvider(App.web3Provider)

    //console.log(App.web3Provider)
    

    
    // 初始化智能合约
    return App.initContract();
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
    // 绑定点击领养按钮事件
    return App.bindEvents()
  },

  /**
   * 绑定点击领养按钮事件
   */
  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
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
    web3.eth.getAccounts().then((error,accounts) => {
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
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
