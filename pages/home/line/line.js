// pages/home/line/line.js
var app = getApp();
const httpUtil = require('../../../utils/httpUtil.js')
const util = require('../../../utils/util.js')
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
        //解析GPS数据，修正偏移量
        that.setData({
          points: util.paserGPS(res.data)
        })
        var polyline = [{
          points: that.data.points,
          color: '#FFB90F',
          width: 8,
          dottedLine: false,
          borderWidth: 5,
          borderColor:'#FFB90F',
          arrowLine: true
        }]
        that.setData({
          polyline: polyline
        })
        // 让地图展示所有的坐标点
        this.mapCtx.includePoints({
          padding: [10],
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
  
})
