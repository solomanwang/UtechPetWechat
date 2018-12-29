// pages/equip/bind/bind.js
var app = getApp();
Page({
  data: {
    eqmNumber: "",
    modelName: "",
    eqmImg: ""
  },
  onShow: function (options) {
    this.setData({
      eqmNumber: app.data.eqmNumber,
      modelName: app.data.modelName,
      eqmImg: app.data.eqmImg
    })
  }
})