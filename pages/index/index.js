var util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    /*if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }*/
    var check = util.checkLogin()
    console.log(check.res)
    if (check.res){
      this.navByStatus(check.status)
    } else {
      // Stay
    }
  },
  getUserInfo: function(e) {

    var that = this
    
    app.globalData.userInfo = e.detail.userInfo

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    // 登录
    wx.login({
      success: res => {

        wx.request({
          url: "http://localhost:3000/oauth/wechat",
          method: "GET",
          data: {
            code: res.code,
            img: app.globalData.userInfo.avatarUrl,
            country: app.globalData.userInfo.country,
            province: app.globalData.userInfo.province,
            city: app.globalData.userInfo.city,
            gender: app.globalData.userInfo.gender,
            language: app.globalData.userInfo.language,
            alias: app.globalData.userInfo.nickName,
            rand: Math.round(Math.random() * 100000)
          },
          success: function (res) {

            if(res.data.status){
              // Save login token
              wx.setStorage({
                key: "login_token",
                data: res.data.data.token
              })

              // Save login sessionKey
              wx.setStorage({
                key: "login_sessionKey",
                data: res.data.data.sessionKey
              })

              // Save login status
              wx.setStorage({
                key: "login_status",
                data: res.data.data.userStatus
              })

              // Save login uuid
              wx.setStorage({
                key: "login_uuid",
                data: res.data.data.uuid
              })

              // Save login token
              wx.setStorage({
                key: "login_img",
                data: app.globalData.userInfo.avatarUrl
              })

              // Save data groups
              wx.setStorage({
                key: "data_groups",
                data: res.data.data.groups ? res.data.data.groups : null
              })
              

              // Navigate to page
              that.navByStatus(util.checkLogin().status)
            }
            
          },
          fail: function (err) {
            console.log(err)
          }

        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  toCal: function(){
    wx.redirectTo({
      url: '/pages/calmain/calmain',
    })
  },

  checkLogin: function() {
    if(util.checkLogin().res){
      console.log("Logged")
    } else {
      console.log("Unlogged")
    }
  },

  navByStatus: function (status) {

    if (status == 1) {
      wx.redirectTo({
        url: '/pages/connect/connect',
      })
    }

    else if (status == 2) {
      wx.redirectTo({
        url: '/pages/calmain/calmain',
      })
    }

    else {
      wx.redirectTo({
        url: '/pages/banned/banned',
      })
    }
  }
})
