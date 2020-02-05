var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
// pages/settings/settings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api_tt: "/timetable/checkopen",
    api_tt_up: "/timetable/open",
    isLoading: true,
    privacy: false
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTTSettings()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getTTSettings(){
    request.genPost(this.data.api_tt, {}, (res) => {
      
      if(res.status){
        this.setData({
          isLoading: false,
          privacy: res.data.data == 0 ? true : false
        })
      } else {
        wx.showToast({
          title: '网络连接错误',
          icon: "none"
        })
      }
    })
  },

  privacyUpdate(bol){

    wx.showLoading({
      title: '正在设置',
    })

    var postReady = {
      open: bol ? 1 : 0
    }

    request.genPost(this.data.api_tt_up, postReady, (res)=>{

      wx.hideLoading()

      if(res.status){

        this.setData({
          privacy: bol
        })

        wx.showToast({
          title: '设置成功',
          icon: "none",
        })
      } else {
        wx.showToast({
          title: '网络连接错误',
          icon: "none",
        })
      }
    })
    
  },

  logout(){
    util.logout()
  },


  privacyChangeAsk() {

    var that = this

    if (this.data.privacy == false){
      wx.showModal({
        title: '开启隐私模式',
        content: '开启隐私模式将使你的小组成员无法看到您日程的名称，位置和详情。但时间段信息依然是可见的。确认开启？',
        success(res) {
          if (res.confirm) {
            that.privacyUpdate(true)
          } else if (res.cancel) {
            that.setData({
              privacy: false
            })
          }
        }
      })

    } else {

      that.privacyUpdate(!this.data.privacy)
    }
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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