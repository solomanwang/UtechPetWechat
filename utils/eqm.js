var app = getApp();

//查找用户宠物是否绑定设备,如果查询到有设备绑定将第一个设备号返回
function getEqmNumber(arr){
  for (var j = 0, len = arr.length; j<len; j++){
    let num = arr[j].eqmNumber;
    console.log('eqmNumber = ',num)
    if(num != "" & num != null & num != undefined){
      return num;
    }else{
      return null;
    }
  }
}
//根据设备号查询绑定的设备
function findEqmByEqmNumber(eqmNumber){
  console.log('eqmNumber = ', eqmNumber)
  wx.request({
    url: app.globalData.HTTP_URL + '/MiniProgram/eqm',
    data: {
      'eqmNumber': eqmNumber
    },
    method:'GET',
    success:function(res){
      if(res.statusCode == 200){
        console.log('查询出来的设备：', res)
        return res.data
      }else{
        console.log('出现错误')
      }
    }
  })
}

//根据手机号查询未绑定宠物的设备
// function findUnbindEqm(openId,that){
//   wx.request({
//     url: app.globalData.HTTP_URL + '/MiniProgram/EqmByPhone',
//     data: openId,
//     method: 'POST',
//     success: function (res) {
//       if (res.statusCode == 200) {
//         that.setData({
//           arr: res.data
//         })
//       } else {
//         console.log('未找到')
//       }
//     },
//     fail: function (res) {
//       console.log('出现错误')
//     }
//   })
// }
//解除设备绑定
function unbingEqmwithAnimal(animalId){
  wx.request({
    url: app.globalData.HTTP_URL + '/MiniProgram/eqm',
    data:animalId,
    method:'GET',
    success:function(res){
      console.log('与宠物的绑定解除成功：',res)
    }
  })
}

//根据手机号码查询用户的设备
function findEqmByOpenId(phone,that){
  
  wx.request({
    url: app.globalData.HTTP_URL + '/MiniProgram/EqmByPhone',
    data: {
      "phoneId": phone,
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log('返回的设备 :', res.data)
      if(res.statusCode == 200 && res.data != ""){//200表示请求成功获取
        that.setData({
          show : true,
          eqm : res.data
        })
      }else if(res.statusCode == 404){//表示未找到设备
        console.log('未找到设备')
      }
      
    }
  })
}

module.exports = {
  getEqmNumber:getEqmNumber,
  findEqmByEqmNumber: findEqmByEqmNumber,
  // findUnbindEqm: findUnbindEqm,
  findEqmByOpenId: findEqmByOpenId
}