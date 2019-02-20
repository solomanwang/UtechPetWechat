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
    scale: "14",
    userLat: "",
    userLong: "",
    markers: [],
    stepNum: "今日步数",
    animalVO: [],
    eqmNumber: null,
    isOpen: false,
    index: 0,
  },
  /**
   * 生命周期函数--监听页面加载 
   * 
   */
  onLoad: function() {
    console.log("----------onLoad-------")
    var that = this;
    // 获取手机屏幕高度 
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
        })
      }
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
        return app.getPhone(res.data.openid, phoneUrl); //根据openid获取用户信息
      })
      .then(function(res) {
        console.log('phone :', res)
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
        console.log('res :')
        that.setData({
          animalVO: res.data,
          // index: [1]
        })
        //遍历animalVO看是否有设备绑定
        if(that.data.animalVO.length > 0){
          let num = animalUtil.getEqmNumberFromAnimalVO(res.data);
          //如果找到eqmNumber则setData
          if(Object.keys(num).length > 0){
            that.setData({
              eqmNumber: num[0],
              index: num[1]
            })
          }
        }
        
        //把查询的数据放到app.data做全局变量
        app.data.animalVO = res.data
        app.data.eqmNumber = that.data.eqmNumber

        // 如果查询出eqmNumber进行websocket连接
        if (app.data.eqmNumber != undefined && app.data.eqmNumber != null && app.data.eqmNumber != '') {
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
    let num = app.data.eqmNumber;
    if (num != null && num != undefined) {
      that.setData({
        eqmNumber: num
      })
    }
    that.setData({
      animalVO: app.data.animalVO
    })

    //获取用户位置将显示地图调整至用户未中心
    console.log('that.mapCtx:', that.mapCtx);
    if (that.mapCtx != undefined) {
      that.mapCtx.moveToLocation();
    }

    //因为程序加载异步问题，onLoad里面的连接还未建立就会执行到这里，所以加入判定条件，判定之前已经建立过连接在监听是否需要重新连接
    if (that.data.isOpen) {
      console.log('连接打开', this.data.isOpen)
      httpUtil.onSocketClose() //监听socket连接是否关闭，关闭自动重新建立连接
    }

    //接收到服务器回传数据
    wx.onSocketMessage(function(res) {
      util.parseData(that, res)
    });
  },

  //程序加载成功后获取map上下文
  onReady: function() {
    this.mapCtx = wx.createMapContext("map");
  },

  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置 
    if (e.type == 'end') {}
  },

  // 跳到电子围栏页
  // fenceTap: function() {
  //   wx.navigateTo({
  //     url: '/pages/home/fence/fence',
  //   })
  // },

  // 跳到轨迹追踪页
  trackTap: function() {
    wx.navigateTo({
      url: '/pages/home/line/line',
    })
  },

  //发送websocket指令给设备
  goTap: function(e) {
    console.log('number:', e.currentTarget.dataset.value)
    //判断如果没有在宠物商绑定设备无法发送指令
    if (this.data.animalVO.length < 1) {
      wx.showToast({
        title: '请先绑定宠物',
        icon: 'none',
        mask: true,
        duration: 1000
      })
      return;
    }
    //如果发送指令前没有连接那么先进行连接
    if (!this.data.isOpen) {
      httpUtil.connectSocket();
      this.setData({
        isOpen: true
      })
    }
    //判定条件
    var is = app.data.eqmNumber != undefined && app.data.eqmNumber != null && app.data.eqmNumber != '';
    if (is) {//成立开始发送指令
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
        duration: 1000
      })
    }
  },

})