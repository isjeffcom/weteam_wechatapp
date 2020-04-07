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
    password: "",
    sEnabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.hideShareMenu()

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

  inpStuNum: function (e) {
    
    this.setData({
      username: e.detail.value
    })
  },

  inpPsw: function (e) {

    if (e.detail.value.length > 0) {
      this.setData({
        sEnabled: true
      })
    } else {
      this.setData({
        sEnabled: false
      })
    }

    this.setData({
      password: e.detail.value
    })
  },

  toConnect: function () {
    
    if(this.data.sEnabled == false){
      return
    }

    wx.showLoading({ title: '验证中', icon: 'loading' });

    var that = this 
    if (this.data.username.length > 0 && this.data.password.length > 0){

      var token = util.getToken()
      var uuid = util.getUUID()

      var postData = {
        u: this.data.username,
        p: this.data.password,
        token: token,
        uuid: uuid,
        m: "init"
      }

      request.genPost(this.data.api, postData, (res) => {

        wx.hideLoading()

        console.log(res)

        if(res.status){

          var saveData = wx.setStorageSync("data_tt", res.data.data)
          var saveName = wx.setStorageSync("data_n", res.data.name)
          var saveSNum = wx.setStorageSync("login_snum", that.data.username)
          //var savePsw = wx.setStorageSync("login_psw", that.data.password)
          var saveEncPsw = wx.setStorageSync("login_psw", res.data.encPsw)
          var saveEncPswState = wx.setStorageSync("psw_enc", true)
          var setStatus = wx.setStorageSync("login_status", res.data.userStatus)

          if (res.data.testAcc) {
            wx.setStorageSync("login_psw", "locked")
            wx.setStorageSync("login_snum", "locked")
            wx.setStorageSync("login_token", res.data.fakeToken)
            wx.setStorageSync("login_uuid", res.data.fakeUUID)
            wx.setStorageSync("login_img", res.data.fakeIMG)
            wx.setStorageSync("data_groups", res.data.fakeGroups)
            wx.setStorageSync("test_acc", true)
          }

          if(this.options.tojoin){
            wx.redirectTo({
              url: '/pages/join/join?tojoin=' + this.options.tojoin,
            })
          } else {
            wx.switchTab({
              url: '/pages/calmain/calmain',
            })
          }

          

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