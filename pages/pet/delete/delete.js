// pages/pet/edit/edit.js
var app = getApp();
const animalUtil = require('../../../utils/animal.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectPerson: true,
    eqmNumberNew: '请先绑定设备',
    selectArea: false,
    deleteAnimalId: '',//保存点击后需要删除的宠物ID
    aname: '',
    eqmNumber: '',
    age: '',
    data: '',
    varietiesName: '',
    asex: '',
    head_img: '',
    casArray: [],
    casIndex: '',
    IsUndefind: '',
    animal:{
      'openId': '',
      'aheadImg': '',
      'animalId':"",
      'aname':"",
      'varietiesName': "",
      'age': "",
      'asex': "",
      'eqmNumber': '',
      'phoneId': '',
      eqm: {
        eqmNumber:"",
        phoneId:"",
        modelName:"",
        eqmImg: ""
      },
      checked: {
        man: '',
        wman: ''
      }
    }
  },
  /**
    * 生命周期函数--监听页面加载*************************************************************************************start
    */
  onLoad: function (options) {
    var that = this;
    var asex = options.asex;
    var varietiesName = options.varietiesName;
    var sman = null;
    var swman = null;
    // 获取所有未绑定宠物的设备
    console.log('options = ',options);
    let len = app.data.casArray.length;//数组的长度
    //返回的下标
    var num = animalUtil.getIndex(app.data.casArray,len,options.varietiesName);
    
    //设置wxml界面数据（data）---------------------------------------------------------------------start
    //判断性别设置checked
    if (asex == 1) {
      swman = 'true'
    } else if (asex == 2) {
      sman = 'true'
    };
    //设置变量
    this.setData({
      date:options.age,
      casIndex: num,
      casArray:app.data.casArray,
      deleteAnimalId:options.animalId,
      animal: {
        animalId: options.animalId,
        aname: options.aname,
        age: options.age,
        varietiesName: options.varietiesName,
        asex: options.asex,
        eqm: {
          eqmNumber: options.eqmNumber,
          phoneId: options.phoneId,
          modelName: options.modelName,
          eqmImg: options.eqmImg,
        },
        head_img: '',
        checked: {
          man: sman,
          wman: swman
        }
      },
    })
    //判断是否有设备
    var undefind = null;
    console.log("isundefind:"+this.data.animal.eqm.eqmNumber.length)
    if (this.data.animal.eqm.eqmNumber.length==9){
      undefind=0;
    } else {
      undefind = 1;
    }
    this.setData({
      IsUndefind: undefind
    })
    console.log("isundefind:**" + this.data.IsUndefind)
    //设置wxml界面数据（data）---------------------------------------------------------------------start
  },
  onShow:function(){

  },
 /** 生命周期函数--监听页面加载*************************************************************************************end */
  // 上传图片
  imageTap: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var that = this;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        app.data.tempFilePaths = res.tempFilePaths
        console.log('图片路径' + tempFilePaths)
      }
    })
  },
  // 页面中传过来的值（姓名，品种，年龄性别等）
  classifyTap: function (e) {
    console.log('e.currentTarget.dataset.casArray'+e.currentTarget.dataset.casArray);
  },
  // 单选框的内容
  // 1表示母，2表示公；
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：' + e.detail.value)
    this.data.animal.asex = e.detail.value;
  },
  //保存修改后的数据
  saveTap: function (e) {
    // 判断用户信息填写
    let flag = animalUtil.checkForm(this.data.animal);
    console.log('flag = ', flag)
    if (flag) {
      console.log('封装好的宠物对象值：', this.data.animal)
      animalUtil.sendAnimalVO(this.data.animal, 'PUT');//添加宠物对象  
    } else {//信息系填写正确，获取animal对象发送请求
      console.log('不能发送')
    }
  },
  /** 删除动物********************************************************************************************************start */
  deleteTap: function (e) {
    var that = this;
    
    var animalId = that.data.deleteAnimalId;
    console.log('deleteAnimalId = ', that.data.deleteAnimalId)
    // var eqmNumber = that.data.animal.eqm.eqmNumber;
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          // TODO 无法请求
          // that.deleteAnimal(animalId,'DELETE');
          animalUtil.sendAnimalVO(animalId, 'DELETE');
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })   
  },
  //删除
  deleteAnimal:function(animalId,contentType){
    animalUtil.sendAniamlVO(animalId, contentType);
    // animalUtil.sendAnimalVO(animalVO, 'PUT')
  },

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
  // 编辑保存
    
  /** 动物与设备解绑*******************************************************************************************************end */
  // 页面中传过来的值（姓名，品种，年龄性别等）
  getNameValue: function (e) {
    this.data.animal.aname = e.detail.value;
  },
  // 获取宠物性别
  // 1表示母，2表示公；
  radioChange: function (e) {
    this.data.animal.asex = e.detail.value;
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
})