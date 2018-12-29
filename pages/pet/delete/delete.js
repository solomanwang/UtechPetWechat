// pages/pet/edit/edit.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectPerson: true,
    eqmNumberNew: '请先绑定设备',
    selectArea: false,
    animalId: '',
    aname: '',
    eqmNumber: '',
    age: '',
    varietiesName: '',
    asex: '',
    head_img: '',
    casArray: [],
    casIndex: "",
    IsUndefind: '',
    animal:{
      animalId:"",
      aname:"",
      varietiesName: "",
      age: "",
      asex: "",
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
    var list = '';
    var clen = '';
    //获得所有物种----------------------------------------------------------------------------start
    wx.request({
      url: app.globalData.httpUrl +'/MiniProgram/findVarieties.do',
      data: { 'parentId': 1 },
      //请求成功返回
      success: function (res) {
        list = res.data.data;
        for (var i = 0; i < list.length; i++) {
          if (list[i].varietiesName === varietiesName) {
            clen = i;
          }
        }
        that.setData({
          casArray: res.data.data,
          casIndex: clen
        })
      },
      //请求失败返回
      fail: function (res) {
        console.log("错误" + res)
      }
    });
    // 获取所有未绑定宠物的设备
    wx.request({
      url: app.globalData.httpUrl + '/MiniProgram/findEqmByStatus.do',
      data: {
        "openId": app.data.openId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          arr: res.data.data
        })
      }
    })  
    //获得所有物种----------------------------------------------------------------------------end
    //设置wxml界面数据（data）---------------------------------------------------------------------start
    //判断性别设置checked
    if (asex == 1) {
      swman = 'true'
    } else if (asex == 2) {
      sman = 'true'
    };
    //设置变量
    this.setData({
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
  getNameValue: function (e) {
    this.data.getNameValue = e.detail.value;
    console.log('this.data.getNameValue' + e.detail.value);
  },
  classifyTap: function (e) {
    console.log('e.currentTarget.dataset.casArray'+e.currentTarget.dataset.casArray);
  },
  getAgeValue: function (e) {
    this.data.getAgeValue = e.detail.value;
    console.log('this.data.getAgeValue'+this.data.getAgeValue);
  },
  // 单选框的内容
  // 1表示母，2表示公；
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：' + e.detail.value)
    app.data.asex = e.detail.value;
  },
  /** 删除动物********************************************************************************************************start */
  deleteTap: function () {
    console.log("balala")
    var that = this;
    var animalId = that.data.animal.animalId;
    var eqmNumber = that.data.animal.eqm.eqmNumber;
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.httpUrl + '/MiniProgram/deleteAnimal.do',
            data: { 
              animalId: animalId,
              eqmNumber: eqmNumber 
              },
            success: function (res) {
              wx.switchTab({
                url: '../../home/home'
              })
            },
            fail: function () {
              wx.showToast({
                title: '服务器网络错误!',
                icon: 'loading',
                duration: 1500
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })   
  },
  /** 删除动物********************************************************************************************************end */
  /** 跟新动物*******************************************************************************************************start */
  //获取修改后的年纪(bindinput事件，只有当inputs输入时触发，这个类似于input的keyup或者keydown事件处理方式。)
  getAgeValue: function (e) {
    var man = null;
    var wman = null;
    if (this.data.animal.asex == 1) {
      wman = 'true'
    } else if (this.data.animal.asex == 2) {
      man = 'true'
    };
    this.setData({
      animal: {
        animalId: this.data.animal.animalId,
        aname: this.data.animal.aname,
        varietiesName: this.data.animal.varietiesName,
        age: e.detail.value,
        asex: this.data.animal.asex,
        eqm: {
          eqmNumber: this.data.animal.eqmNumber,
          phoneId: this.data.animal.phoneId,
          modelName: this.data.animal.modelName,
          eqmImg: this.data.animal.eqmImg
        },
        checked: {
          man: man,
          wman: wman
        }
      }
    });
  },
  //获取修改后的年纪--------------------------------------------
  getNameValue: function (e) {
    var man = null;
    var wman = null;
    if (this.data.animal.asex == 1) {
      wman = 'true'
    } else if (this.data.animal.asex == 2) {
      man = 'true'
    };
    this.setData({
      animal: {
        animalId: this.data.animal.animalId,
        aname: e.detail.value,
        varietiesName: this.data.animal.varietiesName,
        age: this.data.animal.age,
        asex: this.data.animal.asex,
        eqm: {
          eqmNumber: this.data.animal.eqmNumber,
          phoneId: this.data.animal.phoneId,
          modelName: this.data.animal.modelName,
          eqmImg: this.data.animal.eqmImg
        },
        checked: {
          man: man,
          wman: wman
        }
      }
      
      
    });
  },
  //获取dog物种值--------------------------------------------------
  bindCasPickerChange: function (e) {
    var man = null;
    var wman = null;
    if (this.data.animal.asex == 1) {
      wman = 'true'
    } else if (this.data.animal.asex == 2) {
      man = 'true'
    };
    this.setData({
      animal: {
        animalId: this.data.animal.animalId,
        aname: this.data.animal.aname,
        varietiesName: this.data.casArray[e.detail.value].varietiesName,
        age: this.data.animal.age,
        asex: this.data.animal.asex,
        eqm: {
          eqmNumber: this.data.animal.eqmNumber,
          phoneId: this.data.animal.phoneId,
          modelName: this.data.animal.modelName,
          eqmImg: this.data.animal.eqmImg
        },
        checked: {
          man: man,
          wman: wman
        }
      }  
    })
    // if (e.detail.value == 4) {
    //   this.setData({ reply: true })
    // } else {
    //   this.setData({ reply: false })
    // }
    this.setData({
      
        casIndex: e.detail.value
       
    })
  },

  //获取性别---------------------------------------------------------
  radioChange: function (e) {
    var man = null;
    var wman = null;
    if (e.detail.value == 1) {
      wman = 'true'
    } else if (e.detail.value == 2) {
      man = 'true'
    };
    this.setData({
      animal: {
        animalId: this.data.animal.animalId,
        aname: this.data.animal.aname,
        varietiesName: this.data.casArray[e.detail.value].varietiesName,
        age: this.data.animal.age,
        asex: e.detail.value,
        eqm: {
          eqmNumber: this.data.animal.eqmNumber,
          phoneId: this.data.animal.phoneId,
          modelName: this.data.animal.modelName,
          eqmImg: this.data.animal.eqmImg
        },
        checked: {
          man: man,
          wman: wman
        }
      }
    })
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
  saveTap: function (e) {
    var that = this;
    var aname = that.data.animal.aname;
    var age = that.data.animal.age;
    var asex = that.data.animal.asex;
    var varietiesName = that.data.animal.varietiesName;
    console.log('aname' + aname)
    console.log('age' + age)
    console.log('asex' + asex)
    console.log('varietiesName' + varietiesName)
    console.log('eqmNumberOld' + this.data.animal.eqm.eqmNumber)
    console.log('eqmNumber' + app.data.eqmNumberNew)
    if (aname == null || aname == '') {
      wx.showToast({
        title: '名字不能为空',
        icon: 'false',
        duration: 2000,
      })
    }
    if (age == null || age == '') {
      wx.showToast({
        title: '年龄不能为空',
        icon: 'false',
        duration: 2000
      })
    }
    if (asex == null || asex == '') {
      wx.showToast({
        title: '性别不能为空',
        icon: 'false',
        duration: 2000
      })
    }
    if (varietiesName == null || varietiesName == '') {
      wx.showToast({
        title: '种类不能为空',
        icon: 'false',
        duration: 2000
      })
    }
    if (aname != null && aname != '' && age != null && age != '' && asex != null && asex != '' && varietiesName != null && varietiesName != '') {
      wx.request({
        url: app.globalData.httpUrl + '/MiniProgram/updateAnimal.do',
        data: {
          animal_id: that.data.animal.animalId,
          aname: aname,
          age: age,
          asex: asex,
          head_img: that.data.head_img,
          varietiesName: varietiesName
        },
        success: function (res) {
          wx.switchTab({
            url: '../../home/home'
          })
        },
        fail: function (res) {
        }
      })
    }
    // if (aname != undefined & aname != '' & age != undefined & age != '' & asex != undefined & asex != '' & varietiesName != undefined & varietiesName != '') {
    // wx.request({
    //   url: app.globalData.httpUrl +'/MiniProgram/updateAnimal.do',
    //   data: {
    //     animal_id: that.data.animal.animalId,
    //     aname: aname,
    //     age: age,
    //     asex: asex,
    //     head_img: that.data.head_img,
    //     varietiesName: varietiesName,
    //     eqmNumberOld: this.data.animal.eqm.eqmNumber,
    //     eqmNumber: app.data.eqmNumberNew,
    //     phoneId: app.data.phoneId
    //   },
    //   success: function (res) {   
    //     console.log('eqmNumberNew' + app.data.eqmNumberNew)
    //     console.log('phoneId' + app.data.phoneId)
    //     wx.switchTab({
    //       url: '../../home/home'
    //     })
    //   },
    //   fail: function (res) {
    //   }
    // })
    // } else if (aname == '') {
    //   wx.showToast({
    //     title: '名字不能为空',
    //     icon: 'false',
    //     duration: 2000
    //   })
    // } else if (age == '') {
    //   wx.showToast({
    //     title: '年龄不能为空',
    //     icon: 'false',
    //     duration: 2000
    //   })
    // } 
  },
  /** 动物与设备解绑*******************************************************************************************************end */
  untieTap: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要解绑吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.httpUrl + '/MiniProgram/untiedAnimalAndEqm.do',
            data: {
              animalId: that.data.animal.animalId
            },
            success: function (res) {
              console.log('成功' + res)
              wx.switchTab({
                url: '../../home/home'
              })
            },
            fail: function (res) {
              console.log('失败' + res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })   
  }
})