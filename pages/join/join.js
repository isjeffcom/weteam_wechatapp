const request = require("../../utils/request.js")
const util = require("../../utils/util.js")
// pages/join/join.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: "/group/find",
    api_join: "/group/join",
    gid: "",
    gcode: "",
    uname: "",
    groupData: {},
    status: 0,
    autoJoin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var req = {}
    // If is coming back from auth
    if (this.options.tojoin){
      req = JSON.parse(decodeURIComponent(this.options.tojoin))

      // Auto force join
      this.setData({
        autoJoin: true
      })
    }

    this.setData({
      gid: this.options.gid ? this.options.gid : req.id,
      gcode: this.options.gcode ? this.options.gcode : req.code,
      uname: this.options.n ? this.options.n : req.name
    })

    this.getGroupInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // Check if already logged
    var check = util.checkLogin()
    this.setData({
      status: check.status
    })
  },

  getGroupInfo(){
    var that = this
    var postReady = {
      gid: this.data.gid,
      code: this.data.gcode
    }

    request.genPost(this.data.api, postReady, (res)=>{

      var d = res.data.data

      if(d.members.indexOf(",") != -1){
        var dm = d.members.split(",")
        d.memsArr = dm
        d.memsCount = dm.length
      } else {
        d.memsCount = 1
      }
      
      that.setData({
        groupData: d
      })

      if(this.data.autoJoin){
        this.joinCheck()
      }
    })
  },

  joinCheck(){
    
    if (this.data.status == 2) {
      // Stay
      this.join(this.data.gid, this.data.groupData.memsArr, this.data.groupData.name)
    }

    else if (this.data.status == 1) {
      // Stay
      wx.redirectTo({
        url: '/pages/connect/connect?tojoin=' + encodeURIComponent(JSON.stringify(this.data.groupData)),
      })
      return
    }

    else {
      wx.redirectTo({
        url: '/pages/index/index?tojoin=' + encodeURIComponent(JSON.stringify(this.data.groupData)),
      })
      return
    }
  },

  join(gid, uids, gname){
    wx.showLoading()

    var postReady = {
      uuid: util.getUUID(),
      gid: gid
    }

    request.genPost(this.data.api_join, postReady, (res)=>{
      console.log(res)
      wx.hideLoading()
      if(res.status){
        uids.push(postReady.uuid)
        wx.showToast({
          title: '加入成功',
          icon: 'success'
        })
        wx.redirectTo({
          url: '/pages/groupdetail/groupdetail?gid=' + gid + '&uids=' + String(uids) + '&gname=' + gname + '&join=' + 't'
        })
        return
      } else {
        var err = res.data.err
        if (err.indexOf("ingroup") != -1){

          wx.showToast({
            title: '您已经在小组中，无需重复添加',
            icon: 'none'
          })

          wx.redirectTo({
            url: '/pages/groupdetail/groupdetail?gid=' + gid + '&uids=' + String(uids) + '&gname=' + gname + '&join=' + 't'
          })

          return
          
        } else {
          wx.showToast({
            title: '网络错误，加入失败',
            icon: 'none'
          })
          return
        }
      }

      
    })
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '邀请你加入小组: ' + this.data.groupData.name,
      desc: 'TEAMWORK - 爱丁堡学生日程表小组管理微信小程序',
      path: '/pages/join/join?gid=' + this.data.gid + "&code=" + this.data.gcode + "&n=" + this.data.uname
    }
  }
})