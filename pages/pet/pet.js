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
    stepNum: "0",
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
    console.log("animalVO: ", app.data.animalVO)
    that.setData({
      animalVO: app.data.animalVO, //从app取出宠物对象集合
      stepNum: 4564
    })
  },
  // 跳到添加宠物页
  addTap: function(options) {
    wx.navigateTo({
      url: '/pages/pet/edit/edit?user_id=111',
    })
  },
  //删除
  petTap: function(e) {
    var animalId = e.currentTarget.dataset.idnum;
    var aname = e.currentTarget.dataset.aname;
    let varietiesName = e.currentTarget.dataset.var;
    let age = e.currentTarget.dataset.age;
    let asex = e.currentTarget.dataset.asex;
    let eqmNumber = e.currentTarget.dataset.eqmnumber;
    wx.navigateTo({
      url: 'delete/delete?animalId=' + animalId + "&aname=" + aname + "&varietiesName=" + varietiesName + "&birthday=" + age +
        "&asex=" + asex + "&eqmNumber=" + eqmNumber
    })
  }

  //下拉刷新
})