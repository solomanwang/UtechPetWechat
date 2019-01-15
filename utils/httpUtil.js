var app = getApp();

function httpSend(url, type, data) {
  wx.request({
    url: url,
    method: type,
    data: data,
    success: function(res) {
      console.log('请求成功', res)
      return res.data;
    },
    fail: function(res) {
      console.log('请求失败', res)
    }
  })
}


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
      complete:function(){
        wx.hideLoading()
      }
    })
  })
}


module.exports = {
  httpSend: httpSend,
  promiseHttp: promiseHttp
}