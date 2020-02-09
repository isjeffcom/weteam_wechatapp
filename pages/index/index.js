var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
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
    wx.hideShareMenu()
    wx.clearStorage()
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
    if (check.res){
      this.navByStatus(check.status)
    } else {
      // Stay
    }
  },
  getUserInfo: function(e) {

    

    var that = this

    wx.showLoading({
      title: '正在登陆',
    })

    
    
    app.globalData.userInfo = e.detail.userInfo

    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '请授权登录信息',
        content: '您可以到：「右上角」 - 「关于」 / 「右上角」 - 「设置」中重新开启登录信息授权'
      })
      wx.hideLoading()
      return
    }

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    var alias = app.globalData.userInfo.nickName
    alias = util.removeEmoji(alias)

    // 登录
    wx.login({
      success: res => {

        wx.request({
          url: request.getBaseUrl() + "/oauth/wechat",
          method: "GET",
          data: {
            code: res.code,
            img: app.globalData.userInfo.avatarUrl,
            country: app.globalData.userInfo.country,
            province: app.globalData.userInfo.province,
            city: app.globalData.userInfo.city,
            gender: app.globalData.userInfo.gender,
            language: app.globalData.userInfo.language,
            alias: alias,
            rand: Math.round(Math.random() * 100000)
          },
          success: function (res) {

            wx.hideLoading()

            console.log(app.globalData.userInfo.nickName)
            //console.log(res)
            

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
            } else {
              wx.hideLoading()

              wx.showToast({
                title: '网络错误，请重试',
                icon: "none"
              })
            }
            
          },
          fail: function (err) {

            console.log(err)

            wx.hideLoading()

            wx.showToast({
              title: '网络错误，请重试',
              icon: "none"
            })
            console.log(err)
          }

        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: res => {
        console.log("reject")
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

  toTerms: function(){
    wx.navigateTo({
      url: '/pages/terms/terms',
    })
  },

  navByStatus: function (status) {
    

    if (status == 1) {

      if (this.options.tojoin) {
        wx.redirectTo({
          url: '/pages/connect/connect?tojoin=' + this.options.tojoin,
        })
        return
      } else {
        wx.redirectTo({
          url: '/pages/connect/connect',
        })
        return
      }

    }

    else if (status == 2) {

      if (this.options.tojoin) {
        wx.redirectTo({
          url: '/pages/join/join?tojoin=' + this.options.tojoin,
        })
        return
      } else {
        wx.switchTab({
          url: '/pages/calmain/calmain',
        })
        return
      }

    }

    else if (status == 99) {
      wx.showToast({
        title: '账号被禁止登录，请联系管理员',
        icon: "none"
      })
    }

    else{
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    }
  }
})
