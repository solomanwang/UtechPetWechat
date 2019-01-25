var app = getApp();

//检查宠物对象表单
function checkForm(animalVO){
  let flag = false;
  if (animalVO.aname == undefined || animalVO.aname == '') {
    wx.showToast({
      title: '名字不能为空',
      icon: 'false',
      duration: 1000
    })
  } else if (animalVO.birthday == undefined || animalVO.birthday == '') {
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
  app.data.casArray = wx.getStorageSync('varieties')
  console.log("app.data.casArray.lenght--", app.data.casArray.lenght)
  //如果没有缓存从数据库拉取放入缓存
  if(app.data.casArray.lenght == undefined){
    console.log("无缓存")
    wx.request({
      url: app.globalData.HTTP_URL + '/MiniProgram/findVarieties',
      data: {
        'parentId': 1
      },
      method: 'GET',
      success: function (res) {//品种请求成功
        console.log("请求品种数据成功")
        //存入缓存
        wx.setStorageSync('varieties', res.data)
        app.data.casArray = res.data
      },
      fail: function (res) {
        // 品种请求异常
        console.log("error", res)
      }
    })
  }
}
//循环获取下标
function getIndex(arr,len,value){
  for (var j = 0; j < len; j++) {
    if(arr[j].varietiesName == value){
      return j;
    }
  }
}

//遍历animalVO取出设备号
function getEqmNumberFromAnimalVO(animalVO){
  let number = [];
  animalVO.forEach((value,index,array)=>{
    console.log('val:',value.eqmNumber)
    if(value.eqmNumber != null && value.eqmNumber != ''){
       number.push(value.eqmNumber);
       number.push(index);
    }
  })
  console.log('number:',number)
  return number;
}

module.exports = {
  checkForm: checkForm,
  getVarieties: getVarieties,
  getIndex: getIndex,
  getEqmNumberFromAnimalVO: getEqmNumberFromAnimalVO
}