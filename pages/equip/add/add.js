var app = getApp();
const eqmlUtil = require('../../../utils/eqm.js')
const util = require('../../../utils/util.js')
const httpUtil = require('../../../utils/httpUtil.js')
Page({
  /**  页面的初始数据 */
  data: {
    getPhoneValue:null,
    phone:null,
    codeBtn:'获取验证码',
    getCodeValue:null,
    code:null,
    _code: false,
    eqmNumber: "",
    modelName: "",
    eqmImg: "",
    disabled: false
  },
  onLoad: function (options) { 
    console.log(options) 
    let modelName = eqmlUtil.getModleName(options.modleNumber);
    let eqmImg = eqmlUtil.getEqmImg(options.modleNumber);
    this.setData({
      eqmNumber: options.eqmNumber,
      modelName: modelName,
      eqmImg: eqmImg,
      phone:app.data.user.phone
    }) 

  },
  getPhoneValue:function(e){
    this.data.phone = e.detail.value;
  },
  getCodeValue: function (e) {
    this.data.getCodeValue = e.detail.value;
  },
  
  //获取验证码
  getCode: function () {
    var that = this;
    //检验手机号码是否输入且是否正确
    var _phone = util.checkPhone(this.data.phone)
    var getCodeUrl = app.globalData.HTTP_URL + '/MiniProgram/getPhoneCode'
    var sendData = {
      'number': this.data.phone
    };

    //手机号码检验合格发送获取验证码请求
    if (_phone) {
      that.setData({
        disabled:true
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
  //绑定
  save:function(){
    //校验手机号码
    let _phone = util.checkPhone(this.data.phone)
    //校验验证码
    let _code = util.checkCode(this.data.getCodeValue)

    var url = app.globalData.HTTP_URL + '/MiniProgram/eqm'

    if (_phone && _code) {//校验成功发送请求
    let sendEqm = {
      eqmNumber:this.data.eqmNumber,
      modelName: this.data.modelName,
      phoneId: this.data.phone,
      eqmImg: this.data.eqmImg,
      code: this.data.getCodeValue
    }
    console.log(sendEqm)
      httpUtil.promiseHttp(url, 'POST', sendEqm).then((res) => {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 1000,
          }),
          wx.reLaunch({
            url: '../../equip/equip'
          })
          console.log('绑定成功')
        } else {
          wx.showToast({
            title: '绑定失败',
            duration: 1000,
          })
        }
      }).catch((res) => {
        wx.showToast({
          title: '请求失败',
        })
      })
    }
  }
})
