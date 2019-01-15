// pages/home/home.js
var app = getApp();
const aniamalUtil = require('../../utils/animal.js')
//经纬度转换参数
var pi = 3.1415926535897932384626
var a = 6378245.0;
var ee = 0.00669342162296594323;
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
    eqmNumber: ''
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
    app.getOpenId().then(function(res) {
      console.log(res);
      if (res.status == 200) {
        //请求用户的宠物对象，参数为openId
        console.log("open_id = " + app.data.openId);
        wx.request({
          url: app.globalData.httpUrl + '/MiniProgram/findAllAnimal.do',
          method: 'POST',
          data: app.data.openId,
          success: function(res) {
            console.log('宠物对象响应');
            app.data.animalVO = res.data;
            console.log(app.data.animalVO);
            //未查到宠物信息弹窗提示
            if (res.statusCode == 200) {
              that.setData({
                animalVO: res.data,
              })
              //判断宠物是否绑定设备，如果有将第一个设备号取出
              var num = res.data[0].eqmNumber;
              console.log('key' + num);
              if (num != null) {
                app.data.eqmNumber = num //设置app全局变量
                that.setData({ //设备本页面变量
                  eqmNumber: num
                })
              }
            }
          }
        })
      } else {
        console.log(res.data)
      }
    })

    // 如果查询出eqmNumber进行websocket连接
    if (this.data.eqmNumber != null) {
      wx.connectSocket({
        url: 'ws://' + app.globalData.websocketUrl,
      })
    }

    // websocket连接成功回调函数
    wx.onSocketOpen(function() {
      wx.showToast({
        title: '服务器连接成功',
        icon: 'success',
        duration: 1000
      })
      console.log("websocket已经连接")
    })
    // websocket连接失败回调
    wx.onSocketError(function(res) {
      console.log('WebSocket连接打开失败，请检查！')
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

    //监听socket连接是否关闭，关闭自动重新建立连接
    if (this.data.eqmNumber != null) {
      wx.onSocketClose(function(res) {
        console.log("连接断开，开始重新连接")
        wx.connectSocket({
          url: 'ws://' + app.globalData.websocketUrl,
          success: function(res) {
            console.log("重新连接成功")
            wx.showToast({
              title: '重新连接成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      })
    }

    //接收到服务器回传数据
    wx.onSocketMessage(function(res) {
      console.log('收到服务器内容：' + res.data)
      //截取回传指令判断进入哪个方法
      let data = res.data;
      let cum = data.slice(0, 3)
      if (cum == 'SP:') { //获取步数统计  
        let arr = that.paresStepCount(data);
        console.log("传感器数据" + arr)
        app.data.stepNum = parseInt(arr[0])
        that.setData({
          stepNum: parseInt(arr[0])
        })
      } else if (cum == 'GPS') { //获取GPS数据
        //获取map上下文添加marker
        that.getCenterLocation(data);
      } else if (cum == 'CLO') { //设备关闭
        console.log("设备关闭")
        wx.showToast({
          title: '设备关闭',
          icon: 'error',
          duration: 2000
        })
      } else if (cum == 'OPE') { //设备开启
        console.log("设备开启")
        wx.showToast({
          title: '设备打开',
          icon: 'success',
          duration: 2000
        })
      } else if (cum == 'OUT') { //设备开启
        console.log("与服务器断开")
        wx.showToast({
          title: '与服务器断开',
          icon: 'error',
          duration: 2000
        })
      } else if (cum == 'CON') { //设备开启
        console.log("与服务器连接")
        wx.showToast({
          title: '与服务器连接',
          icon: 'success',
          duration: 2000
        })
      } else if (cum == 'NEQ') { //设备开启
        console.log("设备未打开")
        wx.showToast({
          title: '设备未打开',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext("map");
  },
  //获取当前地图中心的经纬度，返回的是 gcj02 坐标系
  getCenterLocation: function(data) {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function(res) {
        that.setData({
          userLat: res.longitude,
          userLong: res.latitude,
          //将回传的经纬度解析为marker添加到markers
          markers: [that.paresLatAndLong(data)]
        })
      }
    })
  },
  //解析gps经纬度
  paresLatAndLong: function(e) {
    //GPS29.805230,106.397880NE9
    let arr = e.split(",")
    let lat = arr[0].slice(3, arr[0].length)
    let long = arr[1].slice(0, 10)
    //调用坐标换算函数并将参数类型进行转换
    let local = this.wgs84ToGcj02(parseFloat(lat), parseFloat(long))
    console.log("解析以后的坐标" + local)
    let marker = {
      iconPath: "../../image/localtion.png",
      id: 2,
      latitude: local[0],
      longitude: local[1],
      width: 25,
      height: 25,
    }
    return marker;
  },
  //解析步数统计
  paresStepCount(e) {
    //SP:XXXXXX,TP:YYY
    let src = [];
    let arr = e.split(",");
    let count = arr[0].slice(3, arr[0].length);
    let temperature = arr[1].slice(3, arr[1].length);
    src.push(count);
    src.push(temperature);
    return src;
  },
  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if (e.type == 'end') {}
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
  //wgs84坐标转换gcj02坐标
  wgs84ToGcj02: function(lat, lon) {
    // if (outOfChina(lat, lon)) { return null; }
    let dLat = this.transformLat(lon - 105.0, lat - 35.0);
    let dLon = this.transformLon(lon - 105.0, lat - 35.0);
    let radLat = (lat / 180.0) * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    let mgLat = (lat + dLat);
    let mgLon = (lon + dLon);
    let local = [mgLat, mgLon];
    return local;
  },

  transformLat: function(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
  },
  transformLon: function(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
  },
  //发送websocket指令给设备
  goTap: function(e) {
    console.log("发送指令" + e.currentTarget.dataset.value)
    wx.sendSocketMessage({
      data: e.currentTarget.dataset.value,
      fail: function(res) {
        wx.showToast({
          title: '发送失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  // wx.request({  页面加载向后台发送请求宠物信息
  //   url: app.globalData.httpUrl + '/MiniProgram/findAllAnimal.do',
  //   method: 'POST',
  //   data: app.data.openId,
  //   success: function (res) {
  //     console.log('宠物对象响应');
  //     app.data.animalVO = res.data;
  //     console.log(app.data.animalVO);
  //     //未查到宠物信息弹窗提示
  //     if (res.statusCode == 404) {
  //       wx.showToast({
  //         title: '你还未添加动物',
  //         icon: 'none',
  //         duration: 1000,
  //         mask: true
  //       })
  //       //查询到宠物信息setData
  //     } else if (res.statusCode == 200) {
  //       that.setData({
  //         animalVO: res.data,
  //       })
  //       //判断宠物是否绑定设备，如果有将第一个设备号取出
  //       var num = res.data[0].eqmNumber;
  //       console.log('key' + num);
  //       if (num != null) {
  //         app.data.eqmNumber = num//设置app全局变量
  //         that.setData({//设备本页面变量
  //           eqmNumber: num
  //         })
  //       }
  //     }
  //   }
  // })
})