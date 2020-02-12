const util = require("./util.js")

//const base_api = "http://localhost:3000"
const base_api = "https://uoedcal.isjeff.com"
const tt_api = '/init'

function getBaseUrl () {
  return base_api
}

function genPost(api, data, callback) {
  
  api = base_api + api

  const ess = {
    uuid: util.getUUID(),
    token: util.getToken()
  }

  const d = Object.assign(data, ess)
  
  wx.request({
    url: api,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    data: d,
    success: function (res) {
      if (res.data.status) {
        callback({ status: true, data: res.data })
      } else {
        callback({ status: false, data: res.data })
      }
    },
    fail: function (err) {
      callback({ status: false, data: null, error: err })
    }
  })
}

function updateTT (callback) {

  // For testing account
  if (wx.getStorageSync("test_acc")) {
    callback({status: true, data:"isTestAcc"})
    return
  }

  var that = this

  var postData = {
    u: util.getSNum(),
    p: util.getPsw(),
    m: "up"
  }

  if (wx.getStorageSync("psw_enc")){
    postData.isEnc = true
  }

  genPost(tt_api, postData, (res) => {

    if (res.status) {
      var getData = wx.setStorageSync('data_tt', res.data.data)
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      })

      wx.setStorage({
        key: 'tt_lastUp',
        data: new Date().getTime(),
      })
      
      callback({ status: true, data: res.data.data })
      return

    } else {
      const err = res.data.err

      if (err.indexOf("unauthorized") != -1) {
        wx.showToast({
          title: '密码发生变更或有误，请重新登录',
          icon: 'none'
        })

        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 1400)
        callback({status: false, err: "noauth", errcode: 1})
        return
      }

      else if (err.indexOf("testacc") != -1) {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
        callback({ status: false, err: "testacc", errcode: 2 })
        return
      }

      else {
        wx.showToast({
          title: '网络连接错误',
          icon: 'none'
        })
        callback({ status: false, err: "testacc", errcode: 3 })
        return
        
      }

    }
  })
}

module.exports = {
  genPost: genPost,
  getBaseUrl: getBaseUrl,
  updateTT: updateTT
}