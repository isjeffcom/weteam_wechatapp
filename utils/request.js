const util = require("./util.js")

var base_api = "http://localhost:3000"

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

module.exports = {
  genPost: genPost
}