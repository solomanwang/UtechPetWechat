// pages/pet/edit/edit.js
var app = getApp();
const util = require('../../../utils/util.js')
const animalUtil = require('../../../utils/animal.js')
const httpUtil = require('../../../utils/httpUtil.js')
const findEqmUrl = app.globalData.HTTP_URL + '/MiniProgram/EqmByPhone'
const addAnimalUrl = app.globalData.HTTP_URL + '/MiniProgram/animal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectPerson: true,
    selectArea: false,
    showView: false,
    start: '2000-01-01',
    end: '',
    varietiesName: "",//品种名
    avatarUrl: "",
    casArray: [],
    Gender: 'female',
    casIndex: 0,
    date: '选择日期',
    headerImg:'../../../image/pet.svg',
    animal:{
      'headImg': '',
      'imgKey': '',
      'aname': '',
      'varietiesName': '中华田园犬',
      'birthday': '',
      'asex': '',
      'eqmNumber': '',
      'phoneId': '',
    },
    eqm: {
      eqmNumber: '',
      phoneId: "",
      modelName: "",
      eqmImg: ""
    },
  },
  
  /** -----------------------------------------------onLoad--------------------------------------------------- */
  onLoad:function(options){
    var that = this;
    var date = new Date;
    let end = util.formatTimeN(date)
    that.setData({
      casArray:app.data.casArray,
      eqm:null,
      end:end
    })
  },

  // 上传图片
  imageTap: function(){
    var that = this;
    util.upLoadImg(that);
  },

  //查询用户的设备信息
  clickPerson: function () {
    var that = this;
    var selectPerson = this.data.selectPerson;

    if (selectPerson == true) {
      //查询未关联宠物的设备
      httpUtil.promiseHttp(findEqmUrl, 'POST', app.data.user.phone)
      .then(function (res) {
        if (res.data != '') {
          that.setData({
            selectArea: true,
            selectPerson: false,
            newEqm: res.data
          })
        } else {
          wx.showToast({
            title: '没有找到您的设备',
          })
        }
        
      })
    } else {
      that.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  
  //点击切换  宠物绑定设备获取信息
  mySelect: function (e) {
    var that = this;
    that.data.animal.eqmNumber = e.currentTarget.dataset.number;
    let _eqm = {
      eqmNumber: e.currentTarget.dataset.number,
      modelName: e.currentTarget.dataset.modelname,
      eqmImg: e.currentTarget.dataset.img
    }
    that.setData({
      eqm: _eqm,
      selectPerson: true,
      selectArea: false,
    })
  },

  //解除设备与宠物的关联
  untieTap: function (e) {
    this.data.animal.eqmNumber = null;
    this.setData({
      eqm: null
    })
  },
  // 增加宠物
  saveTap: function (e) {
    let animalVO = this.data.animal;
    // 判断用户信息填写
    let flag = animalUtil.checkForm(animalVO);
    if (flag) {    
      //添加手机号码
      animalVO.phoneId = app.data.user.phone;
      httpUtil.promiseHttp(addAnimalUrl, 'POST', animalVO)
      .then(function(res){
        let _eqmNumber = res.data.eqmNumber;
        // 跳转pet页面
        if (res.statusCode == 201 || res.statusCode == 200) {
          //如果app.data.animalVO没有宠物可能为 ''，所以需要声明app.data.animalVO为数组 才能使用forEach。push方法
          if(app.data.animalVO == ''){
            app.data.animalVO = []
          }
      // 返回的宠物对象推送到app.data.animalVO.push(res)
          app.data.animalVO.forEach((value, index, array) => {
            //设备号更新
            if (_eqmNumber == value.eqmNumber && value.animalId != res.data.animalId) {
              array[index].eqmNumber = null;
            }
          })

          app.data.animalVO.push(res.data)

          if (animalVO.eqmNumber != null && animalVO.eqmNumber != undefined) {
              app.data.eqmNumber = animalVO.eqmNumber;
          }
          wx.switchTab({
            url: '../../pet/pet',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
          })
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'false',
            duration: 1000
          })
        }
      }).catch(function(res){
        console.log('error:',res)
      })

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
    this.data.animal.birthday = e.detail.value
    console.log('选择的时间为', this.data.animal.birthday)
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