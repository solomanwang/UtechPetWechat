// pages/equip/unbund/unbund.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getPhoneValue: null,
    phone: null,
    codename: '获取验证码',
    getCodeValue: null,
    code: null,
    iscode: null,
    eqmNumber: '',
    modelName: '',
    phoneId:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.data.eqmNumber = options.eqmNumber;
    var modelName = options.modelName;
    var phoneId = options.phoneId;
    this.setData({
      eqmNumber: app.data.eqmNumber,
      modelName: modelName,
      phoneId: phoneId
    })
    console.log('eqmNumber' + app.data.eqmNumber);
    console.log('modelName' + modelName);
    console.log('phoneId' + phoneId);
  },
  // getPhoneValue: function (e) {
  //   this.data.getPhoneValue = e.detail.value;
  //   console.log('电话号码'+this.data.getPhoneValue)
  // },
  getCodeValue: function (e) {
    this.data.getCodeValue = e.detail.value;
  },
  removeTap:function(){
    var _this = this;
    wx.request({
      url: app.globalData.httpUrl+'/MiniProgram/getPhoneCode.do',
      header: app.data.header,
      data: {
        "number": _this.data.phoneId
      },
      // method: 'POST',
      success(res) {
        console.log(res.data)
        _this.setData({
          iscode: res.data
        })
        var num = 61;
        var timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            _this.setData({
              codename: '重新发送',
              disabled: false
            })

          } else {
            _this.setData({
              codename: num + "s"
            })
          }
        }, 1000)
      }
    })
  },
  unbidTap: function () {
    var code = this.data.getCodeValue;
    var eqmNumber = app.data.eqmNumber;
    console.log('eqmNumber' + eqmNumber)
    if (code != '' & code != null){
      wx.request({
        url: app.globalData.httpUrl + '/MiniProgram/deleteEqm.do',
        header: app.data.header,
       
        data: {
          "code": code,
          "eqmNumber": eqmNumber,
          "openId": app.data.openId
        },
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded' // 默认值
        // },
        // method: 'POST',
        success: function (res) {
          console.log('app.data.header' + app.data.header)
          wx.showToast({
            title: '解绑成功',
            icon: 'success',
            duration: 2000,
          }),
            wx.switchTab({
              url: '../../equip/equip',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
        },
        fail: function (res) {
          wx.showToast({
            title: '解绑失败',
            icon: 'success',
            duration: 2000,
          })
        }
      })
    } else if (code == '' & code == null){
      wx.showToast({
        title: '请输入验证码',
        icon: 'success',
        duration: 2000,
      })
    }
    console.log(code);
  }
})