var util = require('../../utils/util.js')
var request = require('../../utils/request.js')

Page({

  data: {
    api: "/group/tts",
    api_imgs: "/user/imgs",
    gid: "",
    gname: "",
    gcode: "",
    memImgs: [],
    allTTData: [],
    currentEvtArr: [],
    currentView: "week",
    titleNav: 'back'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gid: this.options.gid,
      gname: this.options.gname,
      gcode: this.options.code,
      titleNav: this.options.join == 't' ? 'home' : 'back'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    // Check if already logged
    var check = util.checkLogin()


    if (check.res && check.status == 2) {
      // Stay
    }

    else if (check.res && check.status == 1) {
      wx.redirectTo({
        url: '/pages/connect/connect',
      })
      return
    }

    else {
      wx.redirectTo({
        url: '/pages/index/index',
      })
      return
    }

    var tryGetGTT = util.getGTT(this.data.gid)
    if (tryGetGTT) {
      this.setData({
        allTTData: tryGetGTT
      })
    }

    this.renderDayEvt()
    this.update()
    this.getImgs()

  },

  getImgs(){

    const postReady = {
      uids: this.options.uids
    }

    request.genPost(this.data.api_imgs, postReady, (res)=>{
      this.setData({
        memImgs: res.data.data
      })
    })
    
  },

  afterTapDay(e) {
    this.renderDayEvt(e.detail)
  },

  renderDayEvt(date) {
    if (!date) {
      var tod = new Date()
      date = { day: tod.getDate(), week: tod.getDay(), month: tod.getMonth() + 1, year: tod.getFullYear() }
    }

    var evtData = this.getEvt(date)

    if (evtData.status) {
      this.setData({
        currentEvtArr: evtData.data
      })
    }
  },

  getEvt(sDate) {

    // Get data from local storage
    var tt = this.data.allTTData

    if (tt) {
      // sometime is an arr, so get the 1st one(only one)
      if (Array.isArray(sDate)) {
        sDate = sDate[0]
      }

      // combine query string
      var tar = sDate.year + "-" + util.ifSingleAddZero(sDate.month) + "-" + sDate.day

      // excute matcher
      var res = util.timeEvtMatcher(tar, tt)

      // Return
      return { status: true, count: res.length, data: res }

    } else {
      // If no timetable data from storage, get new
      this.update()
      return { status: false, count: 0, data: "no timetable data, try to get data" }
    }

  },

  // Share Mini App
  onShareAppMessage: function () {

    return {
      title: '邀请你加入小组: ' + this.data.gname,
      desc: 'TEAMWORK - 爱丁堡大学日程表小组管理微信工具',
      path: '/pages/join/join?gid=' + this.data.gid + "&gcode=" + this.data.gcode + "&n=" + util.getName() + "&uids=" + this.options.uids
    }
  },

  toAdmin(){
    wx.navigateTo({
      url: '/pages/groupadmin/groupadmin?gid=' + this.data.gid + "&code=" + this.data.gcode + "&n=" + util.getName(),
    })
  },

  update() {
    var that = this
    var postData = {
      uuid: util.getUUID(),
      gid: this.data.gid
    }

    request.genPost(this.data.api, postData, (res) => {
      if (res.status) {
        this.setData({
          allTTData: res.data.data
        })
        //this.renderDayEvt(that.calendar.getSelectedDay())
        var getData = wx.setStorageSync('data_gtt_'+this.data.gid, res.data.data)
        this.renderDayEvt()
      }
    })
  }
})