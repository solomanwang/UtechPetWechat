var app = getApp();
const animalUtil = require('../../utils/animal.js')
const eqmlUtil = require('../../utils/eqm.js')
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    casArray: [],
    arr: "",
    animalVO: [] //宠物对象数组
  },
  onLoad: function() {
    //获得所有品种--------------start
    animalUtil.getVarieties();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {

    util.hasPhone(); //判断是否有电话号码

    //页面显示加载宠物对象集合
    var that = this;
    that.setData({
      animalVO: app.data.animalVO, //从app取出宠物对象集合
    })
  },
  // 跳到添加宠物页
  addTap: function(options) {
    wx.navigateTo({
      url: '/pages/pet/edit/edit?user_id=111',
    })
  },
  //编辑
  petTap: function(e) {
    var animalId = e.currentTarget.dataset.idnum;
    this.data.animalVO.forEach((value, index, array) => {
      //设备号更新
      if (animalId == value.animalId) {
        wx.setStorageSync(app.globalData.ANIMAL, array[index]);
      }
    })
    wx.navigateTo({
      url: 'delete/delete'
    })
  }

})