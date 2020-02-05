var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
// pages/groupadmin/groupadmin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: "/group/find",
    api_imgs: "/user/imgs",
    api_up: "/group/update",
    api_leave: "/group/leave",
    api_archive: "/group/archive",
    api_remove: "/group/remove",
    gName: "",
    gCode: "",
    gid: "",
    gState: "",
    gAdm: "",
    newGState: false,
    lockDown: false,
    allGroupData: {},
    memsAll: [],
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gName: this.options.n,
      gid: this.options.gid,
      gCode: this.options.code
    })

    this.getGroup()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getGroup(){
    var that = this
    var postReady = {
      gid: this.data.gid,
      code: this.data.gCode
    }
    request.genPost(this.data.api, postReady, (res)=>{

      
      if(res.status){
        var d = res.data.data
        var mems = d.members

        if(mems.indexOf(",") != -1){
          mems = mems.split(",")
        } else {
          mems = mems
        }

        that.getMembers(mems)

        that.setData({
          allGroupData: d,
          gName: d.name,
          gState: d.open == 1 ? true : false,
          newGName: d.name,
          newGState: d.open == 1 ? true : false,
          gAdm: d.adm,
          isAdm: d.adm == parseInt(util.getUUID()) ? true : false
        })

        that.setData({
          isLoading: false
        })

        if(!that.data.isAdm){
          that.setData({
            lockDown: true
          })
        }

      } else {

        wx.showToast({
          title: '网络连接失败, 请重试',
          icon: "none"
        })
        
        this.setData({
          lockDown: true
        })

        return
      }
      
    })
  },

  ipNewGName (e) {
    this.setData({
      newGName: e.detail.value
    })
  },

  getMembers(mems) {
    const postReady = {
      uids: mems
    }
    request.genPost(this.data.api_imgs, postReady, (res) => {
      this.setData({
        memsAll: res.data.data
      })

    })
  },

  update(){

    if (this.data.lockDown || this.data.isLoading == true){
      return
    }

    if (this.data.newGName.length > 18) {
      wx.showToast({
        title: '小组名称不能超过9个中文或18个英文',
        icon: "none",
      })
      return
    }

    wx.showLoading({
      title: '正在保存',
    })

    var postReady = {
      gid: this.data.gid,
      name: this.data.newGName,
      state: this.data.newGState ? 1 : 0
    }

    request.genPost(this.data.api_up, postReady, (res)=>{

      wx.hideLoading()

      if(res.status){
        wx.showToast({
          title: '更新成功',
          icon: "success"
        })

        setTimeout(()=>{
          wx.navigateBack({
            delta: 2
          })
        }, 2000)

        return
      } else {
        if (res.data.err.indexOf("notadm") != -1) {
          wx.showToast({
            title: '你不是管理员',
            icon: "none"
          })
        } else {
          wx.showToast({
            title: '网络连接失败, 请重试',
            icon: "none"
          })
        }

        return
      }
    })
  },

  delPreAsk () {
    var that = this
    wx.showModal({
      title: '危险操作',
      content: '你确定要移除本小组吗？本操作无法撤回',
      success(res) {
        if (res.confirm) {
          that.del()
        } else if (res.cancel) {
          // Do nothing...
        }
      }
    })
  },

  removeAsk(e){
    const tid = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    var that = this
    wx.showModal({
      title: '注意',
      content: '你确定要移除本小组成员吗？',
      success(res) {
        if (res.confirm) {
          that.remove(tid)
        } else if (res.cancel) {
          // Do nothing...
        }
      }
    })
  },

  remove(tid){

    if (!tid || this.data.isLoading == true){
      return
    }

    wx.showLoading({
      title: '加载中',
    })

    var postReady = {
      gid: this.data.gid,
      tuuid: tid
    }

    request.genPost(this.data.api_remove, postReady, (res) => {

      wx.hideLoading()


      if (res.status) {
        wx.showToast({
          title: '成功移除成员',
          icon: "success"
        })

        this.getGroup()

      } else {
        wx.showToast({
          title: '网络错误，请重试',
          icon: "none"
        })
      }
    })
  },

  del(){

    if (this.data.isLoading == true){
      return
    }

    wx.showLoading({
      title: '加载中',
    })

    var postReady = {
      gid: this.data.gid
    }

    request.genPost(this.data.api_archive, postReady, (res) => {

      wx.hideLoading()

      if (res.status) {
        wx.showToast({
          title: '成功移除小组',
          icon: "success"
        })

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/group/group',
          })
        }, 2000)

      } else {
        wx.showToast({
          title: '网络错误，请重试',
          icon: "none"
        })
      }
    })
  },

  leaveAsk(){
    var that = this
    wx.showModal({
      title: '注意',
      content: '你确定要离开小组吗？离开后可以从分享链接重新进入',
      success(res) {
        if (res.confirm) {
          that.leave()
        } else if (res.cancel) {
          // Do nothing...
        }
      }
    })
  },

  leave () {

    if (this.data.isLoading == true){
      return
    }

    wx.showLoading({
      title: '加载中',
    })

    var postReady = {
      gid: this.data.gid
    }

    request.genPost(this.data.api_leave, postReady, (res)=>{
      
      wx.hideLoading()

      if(res.status){
        wx.showToast({
          title: '成功离开小组',
          icon: "success"
        })

        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/group/group',
          })
        }, 2000)

      } else{
        wx.showToast({
          title: '网络错误，请重试',
          icon: "none"
        })
      }
    })
  },

  stateChange(e){
    this.setData({
      newGState: e.detail.value
    })
  }



})