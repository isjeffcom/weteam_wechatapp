const util = require('../../utils/util.js')
const request = require('../../utils/request.js')

// pages/team/team.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: "/group/all",
    allGroups: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const allGroups = util.getGroups()
    
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
    this.update()
  },

  update: function () {

    var postReady = {
      uuid: util.getUUID()
    }
    request.genPost(this.data.api, postReady, (res) => {
      if (res) {
        console.log(res.data.data)
        
        this.setData({
          allGroups: res.data.data
        })

        wx.setStorage({
          key: "data_groups",
          data: this.data.allGroups
        })
      }
    })
  },

  toNew () {
    wx.navigateTo({
      url: '/pages/newgroup/newgroup',
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