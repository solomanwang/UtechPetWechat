// pages/pet/edit/edit.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectPerson: true,
    eqmNumberNew: '绑上我的项圈',
    selectArea: false,
    showView: false,
    nickName: "",
    avatarUrl: "",
    casArray: [],
    userName: '',
    mobile: '',
    Gender: 'female',
    casIndex: 0,
    eqmNumber: '',
    phoneId: '',
    arr: []
  },
  //选择品种
  bindCasPickerChange: function (e) {
    app.data.varietiesName = this.data.casArray[e.detail.value].varietiesName;
    this.setData({
      casIndex: e.detail.value
    })
    console.log('casIndex' + this.data.casIndex)
    console.log('hahahahhaahaah'+app.data.varietiesName)
  },
  onLoad:function(){
    var that = this;
    //从缓存中拉取品种信息如果
    wx.clearStorage();//清除缓存
    wx.getStorage({
      key: 'varieties',
      success: function(res) {
        console.log("-----品种---缓存有")
        console.log(res)
        that.setData({
          casArray : res.data
        })
      },
      fail:function(res){
      }
    })
    console.log("casArray = " + this.data.casArray)
    if (this.data.casArray === null || this.data.casArray.lenght == 'undefined'){
      console.log("-----品种---缓存无")
      let arr = that.getVarieties(1, that.callback)
      console.log(arr)
      that.setData({
        casArray: arr 
      })

      //存入缓存
      wx.setStorage({
        key: 'varieties',
        data: that.casArray,
      })
    }
     
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
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
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
  // 页面中传过来的值（姓名，品种，年龄性别等）
  getNameValue: function (e) {
    this.data.getNameValue = e.detail.value;
    console.log(this.data.getNameValue);
  },
  classifyTap: function (e) {
    console.log(e.currentTarget.dataset.casArray);
  },
  getAgeValue: function (e) {
    this.data.getAgeValue = e.detail.value;
    console.log(this.data.getAgeValue);
  },
  // 单选框的内容
  // 1表示母，2表示公；
  radioChange: function (e) {
    app.data.asex = e.detail.value;
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
  // 保存
  saveTap: function (e) {
    var index = this.data.casIndex;
    var casArray = this.data.casArray;
    var aname = this.data.getNameValue;
    var aheadImg = app.data.tempFilePaths;
    var varietiesName = casArray[index].varietiesName;
    var age = this.data.getAgeValue;
    var asex = app.data.asex;
    var eqmNumber = this.data.eqmNumberNew;
    var phoneId = this.data.phoneId;
    console.log('casIndex' + this.data.casIndex)
    console.log('anameaname' + aname)
    console.log('age' + age)
    console.log('asex' + asex)
    console.log('varietiesName' + varietiesName)
    console.log('eqmNumber' + eqmNumber)
    console.log('phoneId****' + phoneId)
    if (aname != undefined & aname != '' & age != undefined & age != '' & asex != undefined & asex != '' & varietiesName != undefined & varietiesName != '') {
      wx.request({
        url: app.globalData.httpUrl + '/MiniProgram/addAnimal.do',
        data: {
          'openId': app.data.openId,
          'aheadImg': aheadImg,
          'aname': aname,
          'varietiesName': varietiesName,
          'age': age,
          'asex': app.data.asex,
          'eqmNumber': eqmNumber,
          'phoneId': phoneId,
        },
        method: 'POST',
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded' // 默认值
        // },
        success: function (res) {
          console.log(varietiesName)
          console.log(res.data)
          wx.switchTab({
            url: '../../home/home',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
          })
        },
        fail: function (res) {
        }
      })
    } else if (aname == undefined) {
      wx.showToast({
        title: '名字不能为空',
        icon: 'false',
        duration: 2000
      })
    } else if (age == undefined) {
      wx.showToast({
        title: '年龄不能为空',
        icon: 'false',
        duration: 2000
      })
    } else if (asex == '') {
      wx.showToast({
        title: '性别不能为空',
        icon: 'false',
        duration: 2000
      })
    } else if (varietiesName == undefined) {
      wx.showToast({
        title: '品种不能为空',
        icon: 'false',
        duration: 2000
      })
    }
  },
  //获取狗狗品种
  getVarieties:function(parentId,callback){
    //如果没有缓存从数据库拉取放入缓存
    wx.request({
      url: app.globalData.httpUrl + '/MiniProgram/findVarieties.do',
      data: {
        'parentId': parentId
      },
      method: 'GET',
      success: function (res) {
        callback(res.data)
      },
    }) 
  }
  ,
  callback:function(res){//回调函数
    console.log(res)
    return res
  }

})