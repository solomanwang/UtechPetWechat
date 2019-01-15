
App({
  data: {
    number: '',
    eqmNumber: '',//设备号
    eqmKey:'',
    eqmNumberNew: '',
    modelName: '',
    eqmImg: '',
    animalVO: [],//宠物vo对象
    casArray: [],
    stepNum: "",
    openId: '',//
    list: '',
    tempFilePaths: '',
    status: '',
    aname: '',
    animalId: '',
    asex: '',
    eqm: '',
    headImg: '',
    phoneId: '',
    varieties: '',//宠物品种集合
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  globalData: {
    appid: 'wx91b2cf461c56fd3c', //appid需自己提供，此处的appid我随机编写
    secret: '9ed7df070d5766b4d03137fe3a5a5718', //secret需自己提供，此处的secret我随机编写
    httpUrl: "http://127.0.0.1:8083",
    websocketUrl: 'www.ai-ray.cn:8082'
    // httpUrl: "http://118.24.243.241:8083",
    // websocketUrl: '118.24.243.241:8082'
  },
  onLaunch: function() {
    console.log("---------onLaunch----------");
    var that = this
    if (that.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 
      // 所以此处加入 callback 以防止这种情况 
      that.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else { // 在没有 open-type=getUserInfo 版本的兼容处理 
      wx.getUserInfo({
        success: res => {
          that.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //请求获取openid
    console.log("login.....")
    this.getOpenId();
    console.log("---------onLaunch_over----------");
  },
  getUserInfo: function(e) {
    console.log(e) 
    app.globalData.userInfo = e.detail.userInfo 
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getOpenId: function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          if (res.code) {
            var d = that.globalData; //这里存储了appid、secret、token串  
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              // header: {}, // 设置请求的 header  
              success: function (res) {
                console.log('结果' + res.data.openid);
                that.data.openId = res.data.openid;
                var res = {
                  status:200,
                  data:res.data.openid
                }
                resolve(res);
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            var res = {
              status: 300,
              data: '错误'
            }
            reject('error');
          }
        }
      });
    })
  }

})