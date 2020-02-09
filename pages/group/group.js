const util = require('../../utils/util.js')
const request = require('../../utils/request.js')

// pages/team/team.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    api: "/group/all",
    allGroups: [],
    showGuide: false,
    countDown: 30,
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
      return
    }

    // First Time Open show guideline image
    this.firstTimeGuide()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    /*this.animate('#all', [
      { opacity: 0, ease: "ease-in-out" },
      { opacity: 1, ease: "ease-in-out" },
    ], 400, function () {
        this.clearAnimation('#all', {}, function () {

      })
    }.bind(this))*/

    this.update()
  },

  firstTimeGuide(){
    var that = this
    const check = wx.getStorageSync("guide_group")
    if(!check){
      this.setData({
        showGuide: true
      })
    }

    setInterval(()=>{
      this.setData({
        countDown: this.data.countDown - 1
      })
      if(this.data.countDown <= 0){
        that.closeGuide()
      }
    }, 1000)
  },

  closeGuide(){
    wx.setStorage({
      key: 'guide_group',
      data: '1',
    })
    this.setData({
      showGuide: false
    })
  },

  update: function () {


    var postReady = {
      uuid: util.getUUID()
    }
    request.genPost(this.data.api, postReady, (res) => {

      console.log(res)

      if (res.status) {
        
        this.setData({
          allGroups: res.data.data,
          cg: []
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
        key: "open",
        val: e.currentTarget.dataset.open
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