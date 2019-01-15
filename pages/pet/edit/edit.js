// pages/pet/edit/edit.js
var app = getApp();
const util = require('../../../utils/util.js')
const animalUtil = require('../../../utils/animal.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectPerson: true,
    eqmNumberNew: '绑上我的项圈',
    selectArea: false,
    showView: false,
    // nickName: "",//宠物名
    varietiesName: "",//品种名
    avatarUrl: "",
    casArray: [],
    userName: '',
    mobile: '',
    Gender: 'female',
    casIndex: 0,
    eqmNumber: '',
    phoneId: '',
    date: '选择日期',
    animal:{
      'openId': '',
      'aheadImg': '',
      'aname': '',
      'varietiesName': '',
      'age': '',
      'asex': '',
      'eqmNumber': '',
      'phoneId': '',
    }
  },
  
  /** -----------------------------------------------onLoad--------------------------------------------------- */
  onLoad:function(options){
    var that = this;
    console.log('options = ', options);
    //从缓存中拉取品种信息如果
    that.setData({
      casArray:app.data.casArray
    })
    // this.data.animal.varietiesName = '中华田园犬';
  },
  /** -----------------------------------------------onShow--------------------------------------------------- */
  onShow: function (options) {
    var that = this;
    that.setData({
      image: "image",
      aname: "aname",
      varietiesName: "varietiesName",
      age: "age",
      asex: "asex"
    })

    // 获取所有未绑定宠物的设备
    // wx.request({
    //   url: app.globalData.httpUrl + '/MiniProgram/findEqmByStatus.do',
    //   data: {
    //     "openId": app.data.openId,
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     that.setData({
    //       arr: res.data.data
    //     })
    //   }
    // }) 
  },

  // 上传图片
  imageTap: function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var that = this;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        app.data.tempFilePaths = res.tempFilePaths
        console.log('图片路径'+tempFilePaths)
      }
    })
  },
  
  // 宠物绑定设备获取信息
  // bindTap: function(e){
  //   this.setData({
  //     eqmNumber: e.currentTarget.dataset.eqmnumber,
  //     phoneId: e.currentTarget.dataset.phoneid
  //   })
  //   console.log("eqm*********************" + e.currentTarget.dataset.eqmnumber)
  //   console.log("phoneId********************" + e.currentTarget.dataset.phoneid) 
  // },
  //点击选择类型
  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  //点击切换  宠物绑定设备获取信息
  mySelect: function (e) {
    var eqmNumberNew = e.currentTarget.dataset.eqmnumber;
    var phoneId = e.currentTarget.dataset.phoneid;
    var img = e.currentTarget.dataset.img;
    this.setData({
      eqmNumberNew: eqmNumberNew,
      phoneId: phoneId,
      img: img,
      selectPerson: true,
      selectArea: false,
    })
    console.log("eqm" + eqmNumberNew)
    console.log("phoneId" + phoneId)
    app.data.eqmNumberNew = eqmNumberNew;
    app.data.phoneId = phoneId
  },
  // 增加宠物
  saveTap: function (e) {
    let animalVO = this.data.animal;
    // 判断用户信息填写
    let flag = animalUtil.checkForm(animalVO);
    console.log('flag = ',flag)
    if (flag) {    
      console.log('封装好的宠物对象值：', animalVO)
      animalVO.openId = app.data.openId;
      animalUtil.sendAnimalVO(animalVO, 'POST');//添加宠物对象  
    }else{//信息系填写正确，获取animal对象发送请求
      console.log('不能发送')
    }
  },
  //选择品种
  bindCasPickerChange: function (e) {
    this.setData({
      varietiesName: this.data.casArray[e.detail.value].varietiesName,
      casIndex:e.detail.value
    })
    this.data.animal.varietiesName = this.data.casArray[e.detail.value].varietiesName
    console.log('选择的品种是：', this.data.animal.varietiesName)
  },
  //日期选择器
  bindDateChange: function (e) {
    this.data.animal.age = e.detail.value
    console.log('选择的时间为', this.data.animal.age)
    this.setData({
      date: e.detail.value
    })
  },
// 页面中传过来的值（姓名，品种，年龄性别等）
  getNameValue: function (e) {
    this.data.animal.aname = e.detail.value;
  },
  classifyTap: function (e) {
    console.log(e.currentTarget.dataset.casArray);
  },
  // 获取宠物性别
  // 1表示母，2表示公；
  radioChange: function (e) {
    this.data.animal.asex = e.detail.value;
  },
})