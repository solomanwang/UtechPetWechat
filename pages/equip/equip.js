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
    eqmNumber:null
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
        console.log('arr:', arr);
        that.data.eqm.eqmNumber = arr[0];
        console.log('eqmNumber:',arr[0]);
        let modleNumber = arr[1]
        //获取设备号发送后台查询是否绑定手机
        console.log(this.data.eqm)
        let sendData = {
          eqmNumber: that.data.eqm.eqmNumber
        }
        httpUtil.promiseHttp(EqmUrl, 'GET', sendData).then(function(res) {
          if (res.statusCode == app.globalData.OK) {
            console.log('eqm--:', res.data)
            if (res.data.phoneId == null || res.data.phoneId == '') { //未查到数据 跳转未绑定页面
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
      data: app.data.eqmNumber + '&' + e.currentTarget.dataset.value,
    })
  },
  
  //页面显示发送获取电量请求
  onShow() {
    util.hasPhone(); //判断是否有电话号码
    var that = this
    let num = app.data.eqmNumber;
    if(num != undefined){
      // that.setData({

      // })
    }
    if(app.data.unbund){
      that.setData({
        show:false,
        eqm:null
      })
    }
    
    httpUtil.onSocketClose();//监听socket连接是否关闭，关闭自动重新建立连接

    wx.onSocketMessage(function (res) {
      util.parseData(that, res)
    });//接收到服务器回传数据   
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
      // if (that.data.eqm.eqmNumber != null && that.data.eqm.eqmNumber != undefined && that.data.eqm.eqmNumber != '') {
      //   console.log('发送电量请求')
      //   wx.sendSocketMessage({//打开表示显示页面即发送获取电量指令
      //     data: that.data.eqm.eqmNumber + '&GDF'
      //   })
      // }
    })
  },
  // 解绑
  unbundTap: function(e) {
    let eqmNumber = e.currentTarget.dataset.eqmnumber;
    app.data.eqmNumber = null;
    wx.navigateTo({
      url: '/pages/equip/unbund/unbund'
    })
  }

})