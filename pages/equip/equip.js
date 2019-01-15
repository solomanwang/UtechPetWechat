var app = getApp();
const eqmlUtil = require('../../utils/eqm.js')
const util = require('../../utils/util.js')
const httpUtil = require('../../utils/httpUtil.js')
const findEqmUrl = app.globalData.HTTP_URL + '/MiniProgram/EqmByPhone'
const EqmUrl = app.globalData.HTTP_URL + '/MiniProgram/eqm'
Page({
  data: {
    show: false,
    power: '点击',
    //设备
    eqm: {
      animalId: '',
      code: '',
      eqmImg: "",
      eqmNumber: "",
      modelName: "",
      phoneId: "",
      qrCode: ''
    },
    
  },
  // 添加设备扫描二维码
  click: function() {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        let result = res.result;
        //解析获取二维码内容
        let arr = result.split('-');
        that.data.eqm.eqmNumber = arr[0];
        let modleNumber = arr[1]
        //获取设备号发送后台查询是否绑定手机
        console.log(this.data.eqm)
        let sendData = {
          eqmNumber: that.data.eqm.eqmNumber
        }
        httpUtil.promiseHttp(EqmUrl, 'GET', sendData).then(function(res) {
          if (res.statusCode == app.globalData.OK) {
            console.log('eqm--:', res.data)
            if (res.data == null || res.data == '') { //未查到数据 跳转未绑定页面
              wx.navigateTo({
                url: 'add/add?eqmNumber=' + that.data.eqm.eqmNumber + "&modleNumber=" + modleNumber 
              })
            } else { //查到绑定信息 跳转已经绑定页面
              wx.navigateTo({
                url: 'bind/bind?eqmNumber=' + res.data.eqmNumber + "&modelName=" + res.data.modelName + "&eqmImg=" + res.data.eqmImg
              })
            }
          }
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 3000
        })
      },
    })
  },
  //发送websocket指令给设备
  goTap: function(e) {
    console.log("发送指令" + e.currentTarget.dataset.value)
    wx.sendSocketMessage({
      data: e.currentTarget.dataset.value,
    })
  },
  //电量和步数统计
  paresPower(e) {
    let arr = e.split(",")
    let stepNum = arr[1].slice(3, arr[1].length)
    return stepNum
  },
  //页面显示发送获取电量请求
  onShow() {
    util.hasPhone(); //判断是否有电话号码
    var that = this
    if(app.data.unbund){
      that.setData({
        show:false,
        eqm:null
      })
    }
    // wx.sendSocketMessage({//打开表示显示页面即发送获取电量指令
    //   data: 'GDF'
    // })
    //监听socket连接是否关闭，关闭自动重新建立连接
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
    wx.onSocketMessage(function(res) {
      //截取回传指令判断进入哪个方法
      let data = res.data;
      let cum = data.slice(0, 3)
      //ID:XXXXXXX,BT:YY
      if (cum == 'ID:') { //获取设备电量  
        let arr = that.paresPower(data);
        console.log("传感器数据" + arr)
        that.setData({
          power: parseInt(arr) * 20 + "%"
        })
      } else if (cum == 'CLO') { //设备关闭
        console.log("设备关闭")
        wx.showToast({
          title: '设备关闭',
          icon: 'error',
          duration: 2000
        })
      } else if (cum == 'OUT') { //设备开启
        console.log("与服务器断开")
        wx.showToast({
          title: '与服务器断开',
          icon: 'error',
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
    //  获取绑定的设备信息

  },
  onLoad: function() {
    var that = this;

    //查询用户设备信息
    httpUtil.promiseHttp(findEqmUrl, 'POST', app.data.user.phone).then(function(res) {
      if (res.statusCode == app.globalData.OK && res.data != "") {
        that.setData({
          eqm: res.data,
          show: true
        })
        console.log(that.data.eqm)
      }
    })
  },
  // 解绑
  unbundTap: function(e) {

    let eqmNumber = e.currentTarget.dataset.eqmnumber;
    let phoneId = e.currentTarget.dataset.phoneid;
    let modelName = e.currentTarget.dataset.modelname;
    let eqmImg = e.currentTarget.dataset.eqmimg;
    console.log(eqmImg)
    wx.navigateTo({
      url: '/pages/equip/unbund/unbund?eqmNumber=' + eqmNumber + "&phoneId=" + phoneId + "&modelName=" + modelName + '&eqmImg=' + eqmImg
    })
  }

})