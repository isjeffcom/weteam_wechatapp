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

    wx.hideShareMenu()
    const allGroups = util.getGroups()
    this.setData({
      allGroups: allGroups
    })

    // If option come with to join url than join
    if(this.options.tojoin){
      this.toJoin(this.options.tojoin)
    }
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
      console.log(res.data.data)
      if (res.status) {
        
        this.setData({
          allGroups: res.data.data
        })

        wx.setStorage({
          key: "data_groups",
          data: this.data.allGroups
        })
      } else {
        wx.showToast({
          title: '网络连接失败，无法获取最新数据',
          icon: "none"
        })
      }
    })
  },

  toNew () {
    wx.navigateTo({
      url: '/pages/newgroup/newgroup',
    })
  },

  toDetail: function(e){
    var par = [
      {
        key: "gid",
        val: e.currentTarget.dataset.id
      },
      {
        key: "gname",
        val: e.currentTarget.dataset.n
      },
      {
        key: "uids",
        val: e.currentTarget.dataset.uids
      },
      {
        key: "code",
        val: e.currentTarget.dataset.code
      }

      
    ]

    console.log(util.constURLParam(par))

    wx.navigateTo({
      url: '/pages/groupdetail/groupdetail' + util.constURLParam(par)
    })
  }
})