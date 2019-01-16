// pages/equip/unbund/unbund.js
var app = getApp();
const util = require('../../../utils/util.js')
const httpUtil = require('../../../utils/httpUtil.js')

const eqmUrl = app.globalData.HTTP_URL + '/MiniProgram/eqm'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getPhoneValue: null,
    codeBtn: '获取验证码',
    code: null,
    iscode: null,
    eqmNumber: '',
    modelName: '',
    phoneId: '',
    eqmImg:'',
    disabled: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   console.log(options)
    this.setData({
      eqmNumber: options.eqmNumber,
      modelName: options.modelName,
      phoneId: options.phoneId,
      eqmImg: options.eqmImg
    })

  },

  getCodeValue: function(e) {
    this.data.code = e.detail.value;
    console.log('code:', this.data.code)
  },
  //获取验证码
  getCode: function() {
    var that = this;
    //检验手机号码是否输入且是否正确
    var _phone = util.checkPhone(app.data.user.phone)
    var getCodeUrl = app.globalData.HTTP_URL + '/MiniProgram/getPhoneCode'
    var sendData = {
      'number': app.data.user.phone
    };
    //手机号码检验合格发送获取验证码请求
    if (_phone) {
      that.setData({
        disabled: true
      });
      httpUtil.promiseHttp(getCodeUrl, 'GET', sendData)
        .then((res) => { //请求成功返回
          that.data._code = res.data;
          if (that.data._code) { //开始倒计时
            util.setTimeInterval(app.globalData.COUNT_DOWN, that)
          }
        }).catch((res) => { //失败进入
          that.setData({
            disabled: false
          });
          console.log('fail:', res)
        })
    }
  },
  unbidTap: function() {
    //校验手机号码
    var _phone = util.checkPhone(this.data.phoneId)
    //校验验证码
    var _code = util.checkCode(this.data.code)
    let _eqm = {
      phoneId: this.data.phoneId,
      code: this.data.code,
      eqmNumber: this.data.eqmNumber,
    }
    console.log('_eqm:', _eqm)
    if (_phone && _code) { //校验成功发送请求
      httpUtil.promiseHttp(eqmUrl, 'DELETE', _eqm).then((res) => {
        if (res.statusCode == 200) {
          app.data.unbund = true
          wx.showToast({
              title: '解绑成功',
              icon: 'success',
              duration: 1000,
            }),
            wx.switchTab({
              url: '../../equip/equip', 
            })
        } else {
          wx.showToast({
            title: '解绑失败',
            duration: 1000,
          })
        }
      }).catch((res) => {
        wx.showToast({
          title: '绑定失败',
        })
      })
    }
  }
})