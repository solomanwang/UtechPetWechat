var app = getApp();
//经纬度转换参数
const pi = 3.1415926535897932384626
const a = 6378245.0;
const ee = 0.00669342162296594323;

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
  console.log('出生年份', birthYear)
  var d = new Date();
  var nowYear = d.getYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();
  console.log('现在年份', nowYear)
  if (nowYear == birthYear) {
    returnAge = 0; //同年 则为0岁  
  } else {
    var ageDiff = nowYear - birthYear; //年之差  
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差  
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差  
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      console.log('出生日期输入错误')
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天  
    }
  }

  return returnAge; //返回周岁年龄  

}
//判断是否有phone，没有就跳转到绑定页面
function hasPhone() {
  if (app.data.user.phone == null || app.data.user.phone == undefined || app.data.user.phone == '') {
    wx.navigateTo({
      url: '../bingPhone/bingPhone'
    })
  }
}

//宠物头像上传
function upLoadImg(that) {
  wx.chooseImage({
    count: 1, //默认9
    sizeType: ['original', 'compressed'], //可以指定原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], //可以指定来源相册还是相机，默认二者都有
    success(res) {
      var tempFile = res.tempFiles
      if (tempFile[0].size > 5242880) {
        //图片压缩API无法使用
        // wx.compressImage({
        //   src: tempFile[0].path, // 图片路径
        //   quality: 50, // 压缩质量
        //   success(res){
        //       console.log('压缩后的文件',res)
        //   }
        // })
        wx.showToast({
          title: '相片最大不能超过5MB',
          icon: 'none',
          duration: 2000
        })
        throw new Error('相片过大')
      }
      wx.showToast({
        title: '正在上传...',
        icon: 'loading',
        mask: true,
        duration: 10000
      })
      wx.uploadFile({
        url: app.globalData.HTTP_URL + '/MiniProgram/image', // 仅为示例，非真实的接口地址
        filePath: res.tempFilePaths[0],
        name: 'file',
        formData: {
          imgKey: that.data.animal.imgKey
        },
        header: {
          "Content-Type": "multipart/form-data"
        },
        success(res) {
          wx.hideToast();
          if (res.statusCode == app.globalData.OK) {
            let data = JSON.parse(res.data)
            console.log('data：', data)
            that.data.animal.headImg = data.imageUrl
            that.data.animal.imgKey = data.imgKey
            that.setData({
              headerImg: data.imageUrl
            })
          }
        },
        fail(res) {
          wx.hideToast();
          console.log('error', res)
        }
      })
    }
  })
}
//设置定时任务
//num 为设置倒计时的时间
function setTimeInterval(num, that) {
  var timer = setInterval(function() {
    num--;
    console.log('倒计时：', num)
    if (num <= 0) {
      clearInterval(timer);
      that.setData({
        codeBtn: '重新发送',
        disabled: false
      })

    } else {
      that.setData({
        disabled: true,
        codeBtn: num + "s"
      })
    }
  }, 1000)
}

//检查输入手机号码格式
function checkPhone(phone) {
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
  } else {
    return true;
  }
}
//检查验证码格式
function checkCode(code) {
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

function parseData(that, res) {
  console.log('data=', res)
  //截取回传指令判断进入哪个方法
  let data = res.data;
  //ID:XXXXXXX,BT:YY
  if (data.startsWith('BT:')) { //获取设备电量  
    let arr = that.paresPower(data);
    console.log("传感器数据" + arr)
    that.setData({
      power: parseInt(arr) * 20 + "%"
    })
  } else if (data.startsWith('CLO:')) { //设备关闭
    console.log("设备关闭")
    wx.showToast({
      title: '设备关闭',
      icon: 'error',
      duration: 1000
    })
  } else if (data.startsWith('OUT')) { //设备开启
    console.log("与服务器断开")
    wx.showToast({
      title: '与服务器断开',
      icon: 'error',
      duration: 1000
    })
  } else if (data.startsWith('NEQ')) { //设备开启
    console.log("设备未打开")
    wx.showToast({
      title: '设备未打开',
      icon: 'error',
      duration: 1000
    })
  } else if (data.startsWith('SP')) { //获取步数统计   
    let arr = paresStepCount(data);
    console.log("传感器数据" + arr)
    that.data.animalVO[that.animalId].stepNum = parseInt(arr[0])
    console.log(that.data.animalVO[animalId])
    that.setData({
      stepNum: parseInt(arr[0])
    })
  } else if (data.startsWith('GPS')) { //获取GPS数据 
    //获取map上下文添加marker 
    getCenterLocation(that,data);
  }else if(data.startsWith('NOT_FIND')){
    wx.showToast({
      title: '还未获取到位置信息，请稍等',
    })
  }
}

//解析步数统计
function paresStepCount(e) {
  //SP:XXXXXX,TP:YYY
  let src = [];
  let arr = e.split(",");
  let count = arr[0].slice(3, arr[0].length);
  let temperature = arr[1].slice(3, arr[1].length);
  src.push(count);
  src.push(temperature);
  return src;
}

//获取当前地图中心的经纬度，返回的是 gcj02 坐标系
function getCenterLocation(that,data) {
  that.mapCtx.getCenterLocation({
    success: function(res) {
      that.setData({
        userLat: res.longitude,
        userLong: res.latitude,
        //将回传的经纬度解析为marker添加到markers
        markers: [paresLatAndLong(data)]
      })
    }
  })
}

//解析gps经纬度
function paresLatAndLong(e) {
  //GPS29.805230,106.397880NE9
  let arr = e.split(",")
  let lat = arr[0].slice(3, arr[0].length)
  let long = arr[1].slice(0, arr[1].indexOf("N"))
  console.log(long)
  console.log(arr[1].indexOf('N'))
  //调用坐标换算函数并将参数类型进行转换
  let local = wgs84ToGcj02(parseFloat(lat), parseFloat(long))
  console.log("解析以后的坐标" + local)
  let marker = {
    iconPath: "../image/localtion.png",
    id: 2,
    latitude: local[0],
    longitude: local[1],
    width: 25,
    height: 25,
  }
  return marker;
}

//wgs84坐标转换gcj02坐标
function wgs84ToGcj02(lat, lon) {
  // if (outOfChina(lat, lon)) { return null; }
  let dLat = transformLat(lon - 105.0, lat - 35.0);
  let dLon = transformLon(lon - 105.0, lat - 35.0);
  let radLat = (lat / 180.0) * pi;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  let sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
  let mgLat = (lat + dLat);
  let mgLon = (lon + dLon);
  let local = [mgLat, mgLon];
  return local;
}

function transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLon(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
  return ret;
}

module.exports = {
  formatTimeD: formatTimeD,
  formatTimeN: formatTimeN,
  getAge: getAge,
  checkPhone: checkPhone,
  checkCode: checkCode,
  setTimeInterval: setTimeInterval,
  hasPhone: hasPhone,
  upLoadImg: upLoadImg,
  parseData: parseData
}