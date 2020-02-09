var util = require('../../utils/util.js')
var request = require('../../utils/request.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    api: '/init',
    allTTData: [],
    currentEvtArr: [],
    currentView: "week",
    hasUpdated: false,
  },

  onLoad: function(){

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

    else if(check.res && check.status == 1){
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

    this.setData({
      allTTData: util.getTT()
    })

    this.renderDayEvt()

  },

  onShow () {
    /*this.animate('#calmain', [
      { opacity: 0, ease: "ease-in-out" },
      { opacity: 1, ease: "ease-in-out" },
    ], 400, function () {
        this.clearAnimation('#calmain', {}, function () {

      })
    }.bind(this))*/
  },

  renderDayEvt (date) {

    var that = this

    const ttLastUp = wx.getStorageSync("tt_lastUp")
    const currentTs = new Date().getTime()
    const expire = 7 * (24 * (60 * (60 * 1000))) //7 day
    //const expire = 0
    
    if(!date){
      var tod = new Date()
      date = { day: tod.getDate(), month: tod.getMonth() + 1, week: tod.getDay(), year: tod.getFullYear() }
    }
    
    var evtData = this.getEvt(date)

    if (evtData.status){
      this.setData({
        currentEvtArr: evtData.data
      })
    }

    // If data expired 
    if (!this.data.hasUpdated && currentTs - ttLastUp > expire) {

      request.updateTT((res) => {
        that.setData({
          hasUpdated: true
        })
      })
    }
  },

  getEvt(sDate){

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
      request.updateTT((res) => {

        if (res.data.status) {

          var result = res.data.data

          that.renderDayEvt(sDate)

          return { status: false, count: 0, data: "updating" }

        } else {

          return { status: false, count: 0, data: "no timetable data" }

        }
      })
    }
  },

  /**
   * 选择日期后执行的事件
   */
  afterTapDay(e) {
    this.renderDayEvt(e.detail)
  },

  // Share Mini App
  onShareAppMessage: function () {

    return {
      title: '爱大共享课程表，让小组协作更高效',
      desc: 'TEAMWORK - 爱丁堡大学日程表小组管理微信工具',
      path: '/pages/calmain/calmain'
    }

  },

})