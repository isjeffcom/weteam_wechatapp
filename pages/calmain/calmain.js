var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
// pages/calendar/calmain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: "/init",
    allTTData: [],
    currentEvtArr: [],
    currentView: "week",
    calendarConfig: {
      //multi: false, // 是否开启多选,
      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: false, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      chooseAreaMode: false, // 开启日期范围选择模式，该模式下只可选择时间段
      //markToday: 'T', // 当天日期展示不使用默认数字，用特殊文字标记
      defaultDay: true, // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
      highlightToday: false, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      takeoverTap: false, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      preventSwipe: false, // 是否禁用日历滑动切换月份
      disablePastDay: true, // 是否禁选当天之前的日期
      disableLaterDay: false, // 是否禁选当天之后的日期
      firstDayOfWeek: 'Sun', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: true, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: false // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    // Check if already logged
    var check = util.checkLogin()
    console.log(check.res)
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
    this.calendar.switchView('week').then(() => { });
    this.renderDayEvt(this.calendar.getSelectedDay())
    //console.log(this.data.currentEvtArr)
  },

  renderDayEvt (date) {
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

      // 1st of the selection 
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
      this.update()
      console.log("no timetable data, try to get data")
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
        if(getData){
          this.renderDayEvt(that.calendar.getSelectedDay())
        }
        
      }
    })
  },

  /**
   * 选择日期后执行的事件
   * currentSelect 当前点击的日期
   * allSelectedDays 选择的所有日期（当mulit为true时，allSelectedDays有值）
   */
  afterTapDay(e) {
    this.renderDayEvt(e.detail)
    //console.log(e.detail); // => { currentSelect: {}, allSelectedDays: [] }
  },
  /**
   * 当日历滑动时触发(适用于周/月视图)
   * 可在滑动时按需在该方法内获取当前日历的一些数据
   */
  onSwipe(e) {
    console.log('onSwipe', e.detail);
    const dates = this.calendar.getCalendarDates();
  },
  /**
   * 当改变月份时触发
   * => current 当前年月 / next 切换后的年月
   */
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail);
    // => { current: { month: 3, ... }, next: { month: 4, ... }}
  },
  /**
   * 周视图下当改变周时触发
   * => current 当前周信息 / next 切换后周信息
   */
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail);
    // {
    //    current: { currentYM: {year: 2019, month: 1 }, dates: [{}] },
    //    next: { currentYM: {year: 2019, month: 1}, dates: [{}] },
    //    directionType: 'next_week'
    // }
  },
  /**
   * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
   * currentSelect 当前点击的日期
   */
  onTapDay(e) {
    console.log('onTapDay', e.detail); // => { year: 2019, month: 12, day: 3, ...}
  },
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   */
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e);
  },

  toWeek () {
    var that = this
    if(this.data.currentView == "week") {
      this.calendar.switchView('mouth').then(() => {
        that.setData({
          currentView: "mouth"
        })
      });
    } else {
      that.setData({
        currentView: "week"
      })
      this.calendar.switchView('week').then(() => { });
    }
    
  }
})