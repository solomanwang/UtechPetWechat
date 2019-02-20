// pages/home/line/line.js
var app = getApp();
const httpUtil = require('../../../utils/httpUtil.js')
const getGPSurl = app.globalData.HTTP_URL + '/MiniProgram/GPS'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    points: [],
    polyline: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('polymap')
    var sendData = {
      'eqmNumber': app.data.eqmNumber
    };
    httpUtil.promiseHttp(getGPSurl, 'GET',sendData)
    .then((res=>{
      // Object.keys(res.data).length > 0 判断回传数据是否为空
      if (Object.keys(res.data).length > 0){
        that.paserGPS(res.data)
        var polyline = [{
          points: that.data.points,
          color: '#FFB90F',
          width: 5,
          dottedLine: true,
          borderWidth: 3,
          arrowLine: true
        }]
        that.setData({
          polyline: polyline
        })
        // 让地图展示所有的坐标点
        this.mapCtx.includePoints({
          padding: [2],
          points: this.data.points
        })
      }else{
        console.log('error:', '没有GPS数据')
        wx.showToast({
          title: '没有找到数据,即将跳回到首页',
          icon: 'none',
          duration: 2000,
        })
        //2秒后返回上一页
        setTimeout(function(){
          console.log('-------------------------------------------')
          wx.navigateBack({
            delta: 1
          })
        },2000)
      } 
      }))
    
  },
  //解析GPS数据生成Posints 坐标点
  paserGPS(res) {
    for (var i in res) {
      let str = res[i].split(",")
      let lon = {
        latitude: str[0],
        longitude: str[1].slice(0, str[1].indexOf("N"))
      }
      this.data.points.push(lon)
    }
  }
})
