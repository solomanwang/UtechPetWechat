// pages/bingPhone/bingPhone.js
var app = getApp();
var util = require('../../utils/util.js')
var httpUtil = require('../../utils/httpUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      id: '',
      openId: '',
      phone: '',
      code: ''
    },
    codeBtn: '获取验证码',
    disabled: false,
    _code: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.data.user = app.data.user
    console.log('this.data.user:', this.data.user)
  },
  //获取输入的手机号码
  getPhoneValue: function(e) {
    this.data.user.phone = e.detail.value;
  },
  //获取输入的验证码
  getCodeValue: function(e) {
    this.data.user.code = e.detail.value;
  },

  //绑定手机号码
  bingPhone: function() {
    //校验手机号码
    var _phone = util.checkPhone(this.data.user.phone)
    //校验验证码
    var _code = util.checkCode(this.data.user.code)
    
    var url = app.globalData.HTTP_URL + '/MiniProgram/phone'

    if (_phone && _code) {//校验成功发送请求
      httpUtil.promiseHttp(url, 'POST', this.data.user).then((res) =>{
        if (res.statusCode == 200){
          wx.reLaunch({
            url: '../home/home'
          })
          console.log('绑定成功')
        }else{
          console.log('绑定失败')
        }
      }).catch((res) => {
        wx.showToast({
          title: '绑定失败',
        })
      })
    }
  },
  //获取验证码
  getCode: function() {
    var that = this;
    //检验手机号码是否输入且是否正确
    var _phone = util.checkPhone(this.data.user.phone)
    var getCodeUrl = app.globalData.HTTP_URL + '/MiniProgram/getPhoneCode'
    var sendData = {
      'number': this.data.user.phone
    };
    //手机号码检验合格发送获取验证码请求
    if (_phone) {
      that.setData({
        disabled: true
      });
      httpUtil.promiseHttp(getCodeUrl, 'GET', sendData)
      .then((res) => {//请求成功返回
        that.data._code = res.data;
        if (that.data._code) {//开始倒计时
          util.setTimeInterval(app.globalData.COUNT_DOWN, that)
        }
      }).catch((res) => {//失败进入
        that.setData({
          disabled: false
        });
        console.log('fail:',res)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})