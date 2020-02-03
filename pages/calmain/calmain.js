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
    currentView: "week"
  },

  onLoad: function(){
    wx.hideShareMenu()
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

    /*var test = { day: 1, week: 6, mouth: 1, year: 2020 }
    this.afterTapDay(test)*/

    //this.calendar.switchView('week').then(() => { });
    //this.renderDayEvt(this.calendar.getSelectedDay())
  },

  renderDayEvt (date) {
    
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
  },

  getEvt(sDate){
    
    // Get data from local storage
    var tt = this.data.allTTData

    if(tt){
      // sometime is an arr, so get the 1st one(only one)
      if (Array.isArray(sDate)){
        sDate = sDate[0]
      }

      // combine query string
      var tar = sDate.year + "-" + util.ifSingleAddZero(sDate.month) + "-" + sDate.day

      // excute matcher
      var res = util.timeEvtMatcher(tar, tt)

      // Return
      return {status: true, count: res.length, data: res}

    } else {
      // If no timetable data from storage, get new
      this.update()
      return { status: false, count: 0, data: "no timetable data, try to get data" }
      
    }
    
  },

  update() {
    var that = this
    var postData = {
      u: util.getSNum(),
      p: util.getPsw(),
      m: "up"
    }

    request.genPost(this.data.api, postData, (res) => {
      
      if (res.status) {
        var getData = wx.setStorageSync('data_tt', res.data.data)
        this.setData({
          allTTData: res.data.data
        })
        this.renderDayEvt()
      }
    })
  },

  /**
   * 选择日期后执行的事件
   */
  afterTapDay(e) {
    this.renderDayEvt(e.detail)
  },

})