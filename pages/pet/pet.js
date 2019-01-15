var app = getApp();
const animalUtil = require('../../utils/animal.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    casArray: [] ,
    arr:"",
    stepNum: "",
    animalVO:[]//宠物对象数组
  },
  onLoad:function(){
     //获得所有品种--------------start
    animalUtil.getVarieties();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow : function () { 
    //页面显示加载宠物对象集合
    var that = this;
    console.log("步数统计:",app.data.stepNum)
    console.log("app页面宠物对象= " , app.data.animalVO)
    that.setData({
      animalVO: app.data.animalVO, //从app取出宠物对象集合
      stepNum:app.data.stepNum
    })
  },
  // 跳到添加宠物页
  addTap : function(options){
    wx.navigateTo({
      url: '/pages/pet/edit/edit?user_id=111',
    })
  },
  //删除
  petTap:function(e){
    var animalId = e.currentTarget.dataset.idnum;
    var aname = e.currentTarget.dataset.aname;
    let varietiesName = e.currentTarget.dataset.var;
    let age = e.currentTarget.dataset.age;
    let asex = e.currentTarget.dataset.asex;
    let eqmNumber = e.currentTarget.dataset.eqmnumber;
    let modelName = e.currentTarget.dataset.modelname;
    let phoneId = e.currentTarget.dataset.phoneid;
    console.log("eqm"+eqmNumber)
    console.log("aname" + aname)
    console.log("animalId" + animalId)
    console.log("varietiesName" + varietiesName)
    console.log("asex" + asex)
    console.log("modelName" + modelName)
    console.log("phoneId" + phoneId)
    wx.navigateTo({
      url: 'delete/delete?animalId=' + animalId + "&aname=" + aname + "&varietiesName=" + varietiesName + "&age=" + age
        + "&asex=" + asex + "&eqmNumber=" +eqmNumber + "&phoneId=" + phoneId + "&modelName=" + modelName
    })
  }

  //下拉刷新
})