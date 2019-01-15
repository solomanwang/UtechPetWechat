var app = getApp();

//获取宠物对象
function getAnimals(openId){
  wx.request({
    url: app.globalData.httpUrl + '/MiniProgram/findAllAnimal.do',
    method: 'POST',
    data: openId,
    success: function (res) {
      app.data.animalVO = res.data
      console.log('app的宠物VO对象为', app.data.animalVO);
      return res.data;
    },fail:function(res){
      console.log('请求失败',res)
    }
  })
}

//发送宠物对象
function sendAnimalVO(animalVO, type){
  wx.request({
    url: app.globalData.httpUrl + '/MiniProgram/Animal.do',
    data: animalVO,
    method: type,
    success: function (res) {
      if (res.statusCode == 201 || res.statusCode == 200) {
        console.log('添加宠物成功', res)
        getAnimals(app.data.openId)//请求以后刷新app.data.aniamlVO数据
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
    },
    fail: function (res) {
      console.log('进入fail')
    }
  })
}
//检查宠物对象表单
function checkForm(animalVO){
  let flag = false;
  if (animalVO.aname == undefined || animalVO.aname == '') {
    wx.showToast({
      title: '名字不能为空',
      icon: 'false',
      duration: 1000
    })
  } else if (animalVO.age == undefined || animalVO.age == '') {
    wx.showToast({
      title: '请选择出生日期',
      icon: 'false',
      duration: 1000
    })
  } else if (animalVO.asex == undefined || animalVO.asex == '') {
    wx.showToast({
      title: '请选择性别',
      icon: 'false',
      duration: 1000
    })
  } else if (animalVO.varietiesName == undefined || animalVO.varietiesName == '') {
    wx.showToast({
      title: '请选择品种',
      icon: 'false',
      duration: 1000
    })
  } else {//信息系填写正确，获取animal对象发送请求
    flag = true;
  }
  return flag;
}
//获取品种集合
function getVarieties(){
  wx.getStorage({
    key: 'varieties',
    success: function (res) {
      console.log("有缓存")
      app.data.casArray = res.data
    },
    //如果没有缓存从数据库拉取放入缓存
    fail: function (res) {
      console.log("无缓存")
      wx.request({
        url: app.globalData.httpUrl + '/MiniProgram/findVarieties.do',
        data: {
          'parentId': 1
        },
        method: 'GET',
        success: function (res) {//品种请求成功
          console.log("请求品种数据成功")
          //存入缓存
          wx.setStorage({
            key: 'varieties',
            data: res.data,
          })
          // that.setData({
          //   casArray: res.data
          // })
          app.data.casArray = res.data
        },
        fail: function (res) {
          // 品种请求异常
          console.log("error",res)
        }
      })
    }
  });
}
//循环获取下标
function getIndex(arr,len,value){
  for (var j = 0; j < len; j++) {
    if(arr[j].varietiesName == value){
      console.log('返回的index = ',j)
      return j;
    }
  }
}

module.exports = {
  sendAnimalVO: sendAnimalVO,
  checkForm: checkForm,
  getVarieties: getVarieties,
  getIndex: getIndex,
  getAnimals: getAnimals
}