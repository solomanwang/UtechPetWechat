var app = getApp();
Page({
  /**  页面的初始数据 */
  data: {
    getPhoneValue:null,
    phone:null,
    codename:'获取验证码',
    getCodeValue:null,
    code:null,
    iscode:null,
    eqmNumber: "",
    modelName: "",
    eqmImg: ""
  },
  onShow: function (options) {  
    this.setData({
      eqmNumber: app.data.eqmNumber,
      modelName: app.data.modelName,
      eqmImg: app.data.eqmImg
    }) 
  },
  getPhoneValue:function(e){
    app.data.number = e.detail.value;
  },
  getCodeValue: function (e) {
    this.data.getCodeValue = e.detail.value;
  },
  getVerificationCode:function(){
    var _this=this;
    var number = app.data.number;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if(number==""||number==null){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }else if(!myreg.test(number)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    }else{
      wx.request({
        url: app.globalData.httpUrl+'/MiniProgram/getPhoneCode.do',
        header: app.data.header,
        data:{
          "number":number
        },
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
    }
    console.log(number);
  },
  save:function(){
    var code = this.data.getCodeValue;
    console.log('number' + app.data.number)
    console.log('code' + code)
    if (app.data.number != '' & code != '' & app.data.number != null & code != null){
      wx.request({
        url: app.globalData.httpUrl + '/MiniProgram/verificationCode.do',
        header: app.data.header,
        data: {
          "code": code,
          "openId": app.data.openId,
          "modelName": app.data.modelName,
          "eqmImg": app.data.eqmImg
        },
        success: function (res) {
          console.log('888888888888' + res);
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000,
          }),
          wx.switchTab({
            url: '../../equip/equip',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '绑定失败',
            icon: 'success',
            duration: 2000,
          })
        }
      })
    } else if (app.data.number == '' || app.data.number == null){
        wx.showToast({
          title: '请输入电话号码',
          icon: 'success',
          duration: 2000,
        })
    } else if (code == '' || code == null) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'success',
        duration: 2000,
      })
    }
    console.log(code);
  }
})
