var app = getApp();

/***
 * promise网络请求返回一个promise对象
 * 参数url 请求地址
 * 参数type post get put delete
 * 参数data 请求数据
 * resolve 成功的回调
 * reject 失败的回调
 */
function promiseHttp(url, type, data) {

  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      method: type,
      data: data,
      success: function(res) {
        console.log('请求成功', res)
        resolve(res)
      },
      fail: function(res) {
        console.log('请求失败', res)
        reject(res)
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  })
}

//创建socket连接
function connectSocket() {
  wx.connectSocket({
    url: app.globalData.WEBSOCKET_URL,
    success(res) {
      console.log('连接成功！', res)
      showSuccess()
    },
    fail(res) {
      showError()
      console.log('error:', res)
    }
  })
}

//连接失败
function connectSocketError() {
  wx.onSocketError(function(res) {
    showError();
  })
}

//监听socket连接是否关闭，关闭自动重新建立连接
function onSocketClose() {
  wx.onSocketClose(function(res) {
    console.log('连接关闭，开始重新连接', this.data.isOpen)
    wx.connectSocket({
      url: app.globalData.WEBSOCKET_URL,
      success(res) {
        console.log('重新连接中', res)
        wx.showToast({
          title: '重新连接中...',
          icon: 'none'
        })
      },
      fail(res) {
        showError()
      }
    })
  })
}
//监听socket连接是否开启
function onSocketOpen() {
  wx.onSocketOpen(function() {
    showSuccess();
  })
}

//socket接收消息


function showSuccess() {
  wx.showToast({
    title: '连接成功',
    icon: 'success',
    duration: 1000
  })
}

function showError() {
  wx.showToast({
    title: '连接失败',
    icon: 'none',
    duration: 1000
  })
}

//电量和步数统计
function paresPower(e) {
  let stepNum = e.slice(3, e.length)
  return stepNum
}

module.exports = {
  promiseHttp: promiseHttp,
  connectSocket: connectSocket,
  onSocketClose: onSocketClose,
  onSocketOpen: onSocketOpen,
}