var app = getApp();

const formatTimeD = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeN = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//计算周岁
//JS根据出生日期 得到年龄                 
//参数strBirthday已经是正确格式的2017-12-12这样的日期字符串  
function getAge(strBirthday) {
  var returnAge;
  var strBirthdayArr = strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];
  console.log('出生年份',birthYear)
  var d = new Date();
  var nowYear = d.getYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();
  console.log('现在年份', nowYear)
  if (nowYear == birthYear) {
    returnAge = 0;//同年 则为0岁  
  }
  else {
    var ageDiff = nowYear - birthYear; //年之差  
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay;//日之差  
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
      else {
        var monthDiff = nowMonth - birthMonth;//月之差  
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
    }
    else {
      console.log('出生日期输入错误')
      returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
    }
  }

  return returnAge;//返回周岁年龄  

}
//判断是否有phone，没有就跳转到绑定页面
function hasPhone(){
  if (app.data.user.phone == null || app.data.user.phone == undefined || app.data.user.phone == ''){
    wx.navigateTo({
      url: '../bingPhone/bingPhone'
    })
  }
}

//获取验证码
function getCode(phone){
  wx.request({
    url: app.globalData.httpUrl + '/MiniProgram/getPhoneCode.do',
    data: {
      "number": phone
    },
    success(res) {
      console.log('验证码',res.data)
      return res.data
    }
  })
}
//设置定时任务
//num 为设置倒计时的时间
function setTimeInterval(num,that){
  var timer = setInterval(function () {
    num--;
    console.log('倒计时：',num)
    if (num <= 0) {
      clearInterval(timer);
      that.setData({
        codeBtn: '重新发送',
        disabled: false
      })

    } else {
      that.setData({
        codeBtn: num + "s"
      })
    }
  }, 1000)
}

//检查输入手机号码格式
function checkPhone(phone){
  var reg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
  if (phone == "" || phone == null) {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!reg.test(phone)) {
    wx.showToast({
      title: '手机号格式错误',
      icon: 'none',
      duration: 1000
    })
    return false;
  }else{
    return true;
  }
}
//检查验证码格式
function checkCode(code){
  var reg = /^\d{6}\b/;
  if (code == "" || code == null) {
    wx.showToast({
      title: '验证码不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!reg.test(code)) {
    wx.showToast({
      title: '验证码格式错误',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true;
  }
}

module.exports = {
  formatTimeD: formatTimeD,
  formatTimeN: formatTimeN,
  getAge:getAge,
  checkPhone: checkPhone,
  checkCode: checkCode,
  getCode: getCode,
  setTimeInterval: setTimeInterval,
  hasPhone: hasPhone
}
