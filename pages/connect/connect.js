const request = require('../../utils/request.js')
const util = require('../../utils/util.js')
// pages/connect/connect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: "/init",
    username: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var check = util.checkLogin()
    if (!check.res){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    } 

    else if(check.status == 2){
      wx.redirectTo({
        url: '/pages/calmain/calmain',
      })
    }
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

  },

  inpStuNum: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  inpPsw: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  toConnect: function () {
    wx.showLoading({ title: '验证中', icon: 'loading', duration: 10000 });

    var that = this
    if (this.data.username.length > 0 && this.data.password.length > 0){

      var token = util.getToken()
      var uuid = util.getUUID()

      var postData = {
        u: this.data.username,
        p: this.data.password,
        m: "init"
      }

      request.genPost(this.data.api, postData, (res) => {

        wx.hideLoading()

        if(res.status){
          console.log(res.data)
          var saveData = wx.setStorageSync("data_tt", res.data.data)
          var saveName = wx.setStorageSync("data_n", res.data.name)
          var saveSNum = wx.setStorageSync("login_snum", that.data.username)
          var savePsw = wx.setStorageSync("login_psw", that.data.password)
          var setStatus = wx.setStorageSync("login_status", res.data.userStatus)

          wx.switchTab({
            url: '/pages/calmain/calmain',
          })

        } else {

          wx.showToast({
            title: '请检查学号和密码',
            icon: 'none',
            duration: 2000
          })
          
        }


        
      })

    }
    
  }
})