const util = require('../../utils/util.js')
const request = require('../../utils/request.js')
const app = getApp()


// pages/newgroup/newgroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: "/group/add",
    groupName: "",
    members: [],
    adm: Number,
    nameAlert: false,
    btn_style: "#999999",
    btn_able: "#0277F9",
    btn_disable: "#999999",
    searchOverlay: false,
    searchUserRes: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
  },

  tapToOverlay: function (){
    this.openSearchBox(true)
  },

  tapCloseOverlay: function () {
    this.openSearchBox(false)
  },

  openSearchBox: function (bol) {
    this.setData({
      searchOverlay: bol
    })
  },

  addMember: function (val) {
    var arr = this.data.members
    arr.push(val.detail.res)
    this.setData({
      members: arr
    })
    this.openSearchBox(false)
    //console.log(this.data.members)
  },

  removeMember: function (e) {
    var arr = this.data.members
    var index = this.idIndexInArr(e.currentTarget.dataset.id, arr)
    if(index){
      arr.splice(index, 1)

      this.setData({
        members: arr
      })
    } else {
      wx.showToast({
        title: '不能删除自己',
        icon: 'none'
      })
    }
  },

  idIndexInArr(target, arr){
    var index = false
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id == target && i != 0) {
        index = i
      }
    }
    return index
  },

  inpName: function (e) {
    this.setData({
      groupName: e.detail.value
    })

    if (util.checkInput(e.detail.value) || e.detail.value.length < 1){
      this.setData({
        nameAlert: true,
        btn_style: "#999999"
      })
    } else {
      this.setData({
        nameAlert: false,
        btn_style: "#0277F9"
      })
    }
  },

  submit: function () {
    if(this.data.nameAlert || this.data.groupName.length < 1){
      return
    }

    if(this.data.groupName.length > 18){
      wx.showToast({
        title: '小组名称不能超过9个中文或18个英文',
        icon: "none",
      })
      return
    }

    var groupName = util.removeEmoji(this.data.groupName)

    wx.showLoading({
      title: '正在创建',
    })

    var allMem = this.data.members
    var mems = []
    for(var i=0;i<allMem.length;i++){
      mems.push(allMem[i].id)
    }

    var postReady = {
      uuid: util.getUUID(),
      token: util.getToken(),
      n: groupName,
      m: String(mems)
    }

    request.genPost(this.data.api, postReady, (res)=>{
      if(res.status){
        wx.hideLoading()
        wx.navigateBack({
          url: '/pages/group/group',
        })
      } else {
        wx.showToast({
          title: '创建失败',
        })
      }
    })

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
    
    var self = {
      id: util.getUUID(),
      name: util.getName(),
      img: util.getImg()
    }

    //var arr = [self]
    this.setData({
      members: [self]
    })
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

  }
})