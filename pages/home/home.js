// pages/home/home.js
var app = getApp();
const animalUtil = require('../../utils/animal.js')
const eqmlUtil = require('../../utils/eqm.js')
const httpUtil = require('../../utils/httpUtil.js')
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scale: "18",
    userLat: "",
    userLong: "",
    markers: [],
    stepNum: "今日步数",
    animalVO: [],
    eqmNumber: null,
    isOpen: false,
    index:0,
  },
  /**
   * 生命周期函数--监听页面加载 
   * 
   */
  onLoad: function() {
    console.log("----------onLoad-------")
    var that = this;
    /**
     * 获取宠物信息-参数为openId
     * */
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    app.getOpenId()
      .then(function(res) {
        let phoneUrl = app.globalData.HTTP_URL + '/MiniProgram/user';
        return app.getPhone(res.data.openid, phoneUrl); //根据获取openid获取用户信息
      })
      .then(function(res) {
        //判断状态码赋值
        if (res.statusCode == 200) {
          app.data.user = res.data
        } else {
          wx.showToast({
            title: '获取失败，请重试',
            icon: 'none',
            duration: 1000
          })
        }
        //判断手机号码是否存在
        if (app.data.user.phone == null || app.data.user.phone == undefined || app.data.user.phone == "") {
          //表示找到用户但是没有绑定手机,跳转绑定页面
          wx.navigateTo({
            url: '/pages/bingPhone/bingPhone'
          })
          // 未找到手机号码抛出异常
          throw new Error('phone is null')
        }

        return app.data.user.phone
      })
      .then(function(res) {
        //根据手机号码查询宠物信息
        let findAnimalUrl = app.globalData.HTTP_URL + '/MiniProgram/findAllAnimal'
        return httpUtil.promiseHttp(findAnimalUrl, 'POST', res)
      })
      //成功后setData
      .then(function(res) {
        //遍历animalVO看是否有设备绑定
        let num = animalUtil.getEqmNumberFromAnimalVO(res.data);
        that.setData({
          animalVO: res.data,
          eqmNumber: num[0],
          index:[1]
        })
        app.data.animalVO = res.data
        //将设备号存入缓存
        wx.setStorage({
          key: app.globalData.EQM_NUMBER,
          data: that.data.eqmNumber,
        })

        // 如果查询出eqmNumber进行websocket连接
        if (that.data.eqmNumber != undefined && that.data.eqmNumber != null) {
          console.log('开始连接。。。')
          httpUtil.connectSocket(); //连接websocket
          that.setData({
            isOpen: true
          })
        }

      })
      .catch(function(res) {
        console.log('error:', res)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    console.log("----------onShow-------")
    var that = this;
    that.setData({
      animalVO: app.data.animalVO
    })

    type: 'gcj02',
      //程序打开加载地图组件
      wx.getLocation({
        success: function(res) {
          that.setData({
            userLat: res.latitude,
            userLong: res.longitude,
          })
        }
      })

    // 获取手机屏幕高度 
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
        })
      }
    })

    //因为程序加载异步问题，onLoad里面的连接还未建立就会执行到这里，所以加入判定条件，判定之前已经建立过连接在监听是否需要重新连接
    if (that.data.isOpen) {
      console.log('连接打开', this.data.isOpen)
      httpUtil.onSocketClose() //监听socket连接是否关闭，关闭自动重新建立连接
    }

    httpUtil.onSocketOpen(); //监听是否连接打开

    //接收到服务器回传数据
    wx.onSocketMessage(function (res) {
      util.parseData(that, res)
      console.log("lat:",that.data.userLat,that.data.userLong)
    });
  },

  //程序加载成功后获取map上下文
  onReady: function() {
    this.mapCtx = wx.createMapContext("map");
  },

  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置 
    if (e.type == 'end') { }
  },

  // 跳到电子围栏页
  fenceTap: function() {
    wx.navigateTo({
      url: '/pages/home/fence/fence',
    })
  },

  // 跳到轨迹追踪页
  trackTap: function() {
    wx.navigateTo({
      url: '/pages/home/line/line',
    })
  },

  //发送websocket指令给设备
  goTap: function(e) {
    console.log("发送指令" + e.currentTarget.dataset.value)
    if (this.data.eqmNumber != undefined && this.data.eqmNumber != null) {

      httpUtil.onSocketClose();

      wx.sendSocketMessage({
        data: e.currentTarget.dataset.value,
        fail: function(res) {
          wx.showToast({
            title: '发送失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      wx.showToast({
        title: '没有设备',
        icon: 'none',
        mask: true,
        duration: 500
      })
    }
  },

})