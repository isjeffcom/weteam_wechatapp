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

    console.log(util.getAccInfo())
  },

  update(){

    wx.showLoading({
      title: '正在更新',
    })

    var that = this
    var postData = {
      u: util.getSNum(),
      p: util.getPsw(),
      m: "up"
    }

    request.genPost(this.data.api, postData, (res) => {
      wx.hideLoading()

      if (res.status) {
        var getData = wx.setStorageSync('data_tt', res.data.data)

        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })

      } else {
        const err = res.data.err

        if (err.indexOf("unauthorized") != -1){
          wx.showToast({
            title: '密码更改，需重新授权',
            icon: 'none'
          })
          setTimeout(()=>{
            wx.clearStorageSync()
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }, 2000)
        } 
        
        else if (err.indexOf("testacc") != -1) {
          wx.showToast({
            title: '更新完毕',
            icon: 'none'
          })
        }
        
        else {
          wx.showToast({
            title: '网络连接错误',
            icon: 'none'
          })
        }
        
      }
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