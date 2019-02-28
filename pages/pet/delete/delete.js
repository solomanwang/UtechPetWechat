// pages/pet/edit/edit.js
var app = getApp();
const animalUtil = require('../../../utils/animal.js')
const eqmlUtil = require('../../../utils/eqm.js')
const httpUtil = require('../../../utils/httpUtil.js')
const util = require('../../../utils/util.js')
const animalUrl = app.globalData.HTTP_URL + '/MiniProgram/animal'
const eqmUrl = app.globalData.HTTP_URL + '/MiniProgram/eqm'
const findEqmUrl = app.globalData.HTTP_URL + '/MiniProgram/EqmByPhone'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectPerson: true,
    selectArea: false,
    deleteAnimalId: '', //保存点击后需要删除的宠物ID
    start: '2000-01-01',
    end: '',
    boy: false,
    girl: false,
    arr: [],
    birthday: '',
    casArray: [],
    casIndex: '',
    headerImg: '',
    animal: {
      headImg: '',
      imgKey: '',
      animalId: "",
      aname: "",
      varietiesName: "",
      birthday: "",
      asex: "",
      eqmNumber: null,
      phoneId: '',
    },
    //选择设备弹出框展示数据
    newEqm: {
      eqmNumber: "",
      phoneId: "",
      modelName: "",
      eqmImg: ""
    },
    //宠物详情展示设备数据
    eqm: {
      eqmNumber: "",
      phoneId: "",
      modelName: "",
      eqmImg: ""
    },
  },
  /**
   * 生命周期函数--监听页面加载*************************************************************************************start
   */
  onLoad: function() {
    var that = this;
    var storageAnimal = wx.getStorageSync(app.globalData.ANIMAL);
    console.log('缓存取出来的数据：', storageAnimal)
    var asex = storageAnimal.asex;
    let m = null;
    let w = null;
    let len = app.data.casArray.length; //数组的长度
    //返回的下标
    var num = animalUtil.getIndex(app.data.casArray, len, storageAnimal.varietiesName);
    var _headImg = storageAnimal.headImg == '' ? '../../../image/pet.svg' : storageAnimal.headImg;
    //获取当前时间戳
    var date = new Date;
    let end = util.formatTimeN(date)
    //设置wxml界面数据（data）---------------------------------------------------------------------start
    //判断性别设置checked
    if (asex == 1) {
      m = 'true'
    } else if (asex == 2) {
      w = 'true'
    };
    //设置变量
    that.setData({
      casIndex: num,
      casArray: app.data.casArray,
      deleteAnimalId: storageAnimal.animalId,
      end: end,
      birthday: storageAnimal.birthday,
      boy: m,
      girl: w,
      headerImg: _headImg,
      animal: {
        animalId: storageAnimal.animalId,
        aname: storageAnimal.aname,
        birthday: storageAnimal.birthday,
        varietiesName: storageAnimal.varietiesName,
        asex: storageAnimal.asex,
        headImg: storageAnimal.headImg,
        imgKey: storageAnimal.imgKey,
        eqmNumber: storageAnimal.eqmNumber,
        phoneId: app.data.user.phone,
      },
    })
    //根据设备号查找绑定的设备
    if (that.data.animal.eqmNumber != null) {
      let eqmNumberData = {
        eqmNumber: that.data.animal.eqmNumber
      };
      httpUtil.promiseHttp(eqmUrl, 'GET', eqmNumberData).then(function(res) {
        that.setData({
          eqm: res.data
        })
      })
    }else{
      that.setData({
        eqm:''
      })
    }

  },

  /** 生命周期函数--监听页面加载*************************************************************************************end */
  // 上传图片
  imageTap: function() {
    var that = this;
    util.upLoadImg(that);
  },

  // 单选框的内容
  // 1表示母，2表示公；
  radioChange: function(e) {
    if (e.detail.value != 1) {
      this.data({
        boy: !boy,
        girl: !girl
      })
    }
    this.data.animal.asex = e.detail.value;
  },

  //保存修改后的数据
  saveTap: function(e) {
    // 判断用户信息填写
    let saveAnimal = this.data.animal;
    let flag = animalUtil.checkForm(saveAnimal);
    //填写正确发送请求更新数据
    if (flag) {
      //添加宠物对象  
      httpUtil.promiseHttp(animalUrl, 'PUT', saveAnimal).then(function(res) {
        //请求成功，更新数据
        let id = Number.parseInt(res.data.animalId);
        let _eqmNumber = res.data.eqmNumber;
        if (res.statusCode == 200) {
          app.data.animalVO.forEach((value, index, array) => {
            //设备号更新
            if (_eqmNumber == value.eqmNumber && value.animalId != id) {
              array[index].eqmNumber = null;
            }
            //对象数据更新
            if (value.animalId == id) {
              array[index] = res.data
            }
          })
          if(saveAnimal.eqmNumber != null && saveAnimal.eqmNumber != undefined){
              app.data.eqmNumber = saveAnimal.eqmNumber
          }
          wx.switchTab({
            url: '../../pet/pet',
          })
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'false',
            duration: 1000
          })
        }
      })
    } else { //信息系填写正确，获取animal对象发送请求
      console.log('不能发送')
    }
  },

  //解除设备与宠物的关联
  untieTap: function(e) {
    this.data.animal.eqmNumber = null;
    this.setData({
      eqm: null
    })
  },

  /** 删除动物********************************************************************************************************start */
  deleteTap: function(e) {
    var that = this;
    var animalId = that.data.deleteAnimalId; //获取删除id
    let sendData = { //封装animal对象，只需要两个字段，id和imgKey
      animalId:animalId,
      imgKey:that.data.animal.imgKey
    };
    console.log(sendData)
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success: function(res) {
        //确定开始请求
        if (res.confirm) {

          httpUtil.promiseHttp(animalUrl, 'DELETE', sendData).then(function(res) {
            // 请求成功以后更新数组
            if (res.statusCode == 201 || res.statusCode == app.globalData.OK) {
              app.data.animalVO.forEach((value, index, array) => {
                if (value.animalId == animalId) {
                  app.data.animalVO.splice(index, 1)
                }
              })
              wx.switchTab({
                url: '../../pet/pet',
              })
            } else {
              wx.showToast({
                title: '操作失败',
                icon: 'false',
                duration: 1000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //点击选择类型
  clickPerson: function() {
    var that = this;
    var selectPerson = this.data.selectPerson;

    if (selectPerson == true) {
      //查询未关联宠物的设备
      httpUtil.promiseHttp(findEqmUrl, 'POST', app.data.user.phone)
      .then(function(res) {
      if(res.data != ''){
        that.setData({
          selectArea: true,
          selectPerson: false,
          newEqm :res.data
        })
      }else{
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
  mySelect: function(e) {
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



  // 页面中传过来的值（姓名，品种，年龄性别等）
  getNameValue: function(e) {
    this.data.animal.aname = e.detail.value;
  },
  // 获取宠物性别
  // 1表示母，2表示公；
  radioChange: function(e) {
    this.data.animal.asex = e.detail.value;
  },
  //选择品种
  bindCasPickerChange: function(e) {
    this.setData({
      varietiesName: this.data.casArray[e.detail.value].varietiesName,
      casIndex: e.detail.value
    })
    this.data.animal.varietiesName = this.data.casArray[e.detail.value].varietiesName
    console.log('选择的品种是：', this.data.animal.varietiesName)
  },
  //日期选择器
  bindDateChange: function(e) {
    var that = this;
    this.data.animal.birthday = e.detail.value
    console.log('选择的时间为', this.data.animal.birthday)
    that.setData({
      birthday: e.detail.value
    })
  },
})