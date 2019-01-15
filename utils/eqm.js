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

//解析二维码内容 strim()
function getModleName(res){
  if(res == '001'){
    return app.data.eqmModle.MODLE_A
  }
  if(res == '002'){
    return app.data.eqmModle.MODLE_B
  }
  if(res == '003'){
    return app.data.eqmModle.MODLE_C
  }
  if(res == '004'){
    return app.data.eqmModle.MODLE_D
  }
}
//返回图片链接
function getEqmImg(res){
  if (res == '001') {
    return app.data.img.IMG_A
  }
  if (res == '002') {
    return app.data.img.IMG_B
  }
  if (res == '003') {
    return app.data.img.IMG_C
  }
  if (res == '004') {
    return app.data.img.IMG_D
  }
}

module.exports = {
  getEqmNumber:getEqmNumber,
  getModleName: getModleName,
  getEqmImg: getEqmImg
}