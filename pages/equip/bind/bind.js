// pages/equip/bind/bind.js
var app = getApp();
Page({
  data: {
    eqmNumber: "",
    modelName: "",
    eqmImg: ""
  },
  onLoad: function (options) {
    this.setData({
      eqmNumber: options.eqmNumber,
      modelName: options.modelName,
      eqmImg: options.eqmImg
    })
  }
})