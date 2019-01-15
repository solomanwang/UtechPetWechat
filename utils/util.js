const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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

module.exports = {
  formatTime: formatTime,
  getAge:getAge
}
