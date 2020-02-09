var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: '/init',
    avatar: "",
    acc: "",
    list: [
      
      {
        title: "更新日程",
        icon: "../../assets/imgs/up_blue.svg",
        action: "update"
      },
      {
        title: "功能介绍",
        icon: "../../assets/imgs/info.svg",
        action: "toInfo"
      },
      {
        title: "使用条款",
        icon: "../../assets/imgs/article.svg",
        action: "toTerms"
      },
      {
        title: "设置",
        icon: "../../assets/imgs/settings.svg",
        action: "toSetting"
      },
      /*{
        title: "关于和联系",
        icon: "../../assets/imgs/info.svg",
        action: "toContact"
      }*/
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      acc: util.getAccInfo(),
      avatar: util.getImg()
    })
  },

  update(){
    wx.showLoading({
      title: '正在更新',
    })
    request.updateTT((res)=>{
      wx.hideLoading()
    })
  },

  toSetting () {
    wx.navigateTo({
      url: '/pages/settings/settings',
    })
  },

  toInfo(){
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.animate('#all', [
      { opacity: 0, ease: "ease-in-out" },
      { opacity: 1, ease: "ease-in-out" },
    ], 400, function () {
      this.clearAnimation('#all', {}, function () {

      })
    }.bind(this))
  },

  toTerms(){
    wx.navigateTo({
      url: '/pages/terms/terms',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})