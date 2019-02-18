App({
  data: {
    user: {
      id: '',
      openId: '',
      phone: ''
    },
    eqmModle: {
      MODLE_A: '丐中丐',
      MODLE_B: '入门级',
      MODLE_C: '精英型',
      MODLE_D: '土豪专用',
    },
    img: {
      IMG_A: 'http://images-cn.ssl-images-amazon.com/images/I/41asy57wpHL._AA160_.jpg',
      IMG_B: 'http://static.leiphone.com/uploads/2014/05/40529110120.jpg',
      IMG_C: 'http://images-cn.ssl-images-amazon.com/images/I/41asy57wpHL._AA160_.jpg',
      IMG_D: '../../image/pic.jpg',
    },
    unbund: false,
    number: '',
    eqmNumber: '', //设备号
    eqmKey: '',
    eqmNumberNew: '',
    modelName: '',
    eqmImg: '',
    animalVO: [], //宠物vo对象集合
    casArray: [],
    stepNum: "",
    openId: '', //
    list: '',
    tempFilePaths: '',
    status: '',
    aname: '',
    animalId: '',
    asex: '',
    eqm: '',
    headImg: '',
    phoneId: '',
    varieties: '', //宠物品种集合
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  globalData: {
    APP_ID: 'wx91b2cf461c56fd3c', //appid需自己提供，此处的appid我随机编写
    SECRET: '9ed7df070d5766b4d03137fe3a5a5718', //secret需自己提供，此处的secret我随机编写
    HTTP_URL: "http://www.ai-ray.cn:8083", //http请求前缀
    // HTTP_URL: "http://127.0.0.1:8083", //http请求前缀
    WEBSOCKET_URL: 'ws://127.0.0.1:8082', //websocket 请求前缀
    COUNT_DOWN: 60, //倒计时时间
    OK: 200,
    ANIMAL:'animal',
    EQM:'eqm',
    EQM_NUMBER:'eqmNumber',
    // HTTP_URL: "http://118.24.243.241:8083",
    // websocketUrl: '118.24.243.241:8082'
  },
  onLaunch: function() {
    console.log("---------onLaunch----------");
    var that = this
    // if (that.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 
    //   // 所以此处加入 callback 以防止这种情况 
    //   that.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else { // 在没有 open-type=getUserInfo 版本的兼容处理 
    //   wx.getUserInfo({
    //     success: res => {
    //       that.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    //请求获取openid
    console.log("login.....")
    // wx.showLoading({
    //   title: '加载中',
    // })
    // this.getOpenId();
    // wx.hideLoading
    console.log("---------onLaunch_over----------");
  },
  // getUserInfo: function(e) {
  //   console.log(e) 
  //   app.globalData.userInfo = e.detail.userInfo 
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  getOpenId: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function(res) {
          if (res.code) {
            var d = that.globalData; //这里存储了appid、secret、token串  
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' +
              d.APP_ID + '&secret=' + d.SECRET + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              success: function(res) {
                that.data.openId = res.data.openid;
                resolve(res);
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            reject(res.errMsg);
          }
        }
      });
    })
  },
  //根据openId获取用户信息
  getPhone: function(openId, getPhoneUrl) {
    console.log('openid:', openId)
    return new Promise(function(resolve, reject) {
      wx.request({
        url: getPhoneUrl,
        data: {
          'openId': openId
        },
        method: 'GET',
        success: function(res) {
          resolve(res)
        }
      })
    })

  }

})