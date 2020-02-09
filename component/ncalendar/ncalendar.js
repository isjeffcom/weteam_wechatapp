var util = require('../../utils/util.js')

Component({
  lifetimes: {
    attached: function (e) {
      this.setData({
        cvcY: -15
      })
      // Start
      var today = this.getToday()
      this.renderDate(today)
      
    },
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      setTimeout(() => {
        // Init View
        if (this.data.currentView != this.data.initView) {
          this.toView(this.data.initView, 360)
          this.setData({
            currentView: this.data.initView
          })
        }
      }, 880)
      /*this.setData({
        currentView: this.data.initView
      })*/
    },
    hide: function () {
      if (this.data.currentView != this.data.initView) {
        this.toView(this.data.initView, 360)
        this.setData({
          currentView: this.data.initView
        })
      }
    },
    resize: function () { },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    weekStartMonday: {
      type: Boolean,
      value: true
    },
    initView: {
      type: String,
      value: "mouth"
    },
    selectedColor:{
      type: String,
      value: "#000000"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weeksStr: ["M", "T", "W", "T", "F", "S", "S"],
    thisToday: Object,
    thisTodayStr: Object,
    currentSelected: Number,
    mouthSlotNum: 35,
    thisMouth: Array,
    thisMouthInWeek: Array,
    thisYear: Array,
    weekView: Array,
    weekCurrent: 0,
    currentView: "mouth",
    cvcY: 0,
    cvcYInit: 0,
    cvcOpen: false,
    cvcHeight:28,
    calHeight: 60,
    cc_height_mouth: "560rpx",
    cc_height_week: "80rpx",
    ct_height_mouth: "32rpx",
    ct_height_week: "0rpx"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // Render Functions
    renderDate(date){

      // Receive date obj: day, mouth, year, weekday
      
      var mouthDay = this.getMouthDay(date.mouth, date.year)
      var wholeMouth = this.generateMouthArr(mouthDay)
      // Return arr[0]: date, arr[1]: weekday
      var thisMouth = this.fillWeekday(date.year, date.mouth, date.day, date.week, wholeMouth)
      var thisMouthInWeek = this.convertToWeekArr(thisMouth)
      //var currentWeekCount = this.idCurrentWeek(date, thisMouthInWeek)
      
      var thisTodayStr = {
        year: date.year,
        mouth: this.constMouthStr(date.mouth),
      }
      
      this.setData({
        thisToday: date,
        thisMouthInWeek: thisMouthInWeek,
        thisTodayStr: thisTodayStr,
        thisMouth: thisMouth,
        //currentWeekCount: currentWeekCount,
        currentSelected: date.day
      })

      return
    },

    idCurrentWeek(day, arr){
      for(let i=0;i<arr.length;i++){
        for(let ii=0;ii<arr[i].length;ii++){
          if(day == arr[i][ii].d && arr[i][ii].isThisMouth){
            return i
          }
        }
      }

      return false
    },

    convertToWeekArr(data){
      var arr = []
      var tmp = []
      // Generate Week Count for week view
      for (let i = 0; i < data.length; i++) {
        if(tmp.length >= 6){
          tmp.push(data[i])
          arr.push(tmp)
          tmp = []
        } else {
          tmp.push(data[i])
        }
      }
      return arr
    },

    fillWeekday(year, mouth, today, weekday, all){

      var res = []

      var idx = util.whereInArr(today, all)

      var todayObj = [weekday, today]

      // Get first and end weekday
      var mouthSE = this.getFirstAndEndWeekday(today, weekday, all)

      // Generate all days
      for(var i=0;i<all.length;i++){
        var wd = (mouthSE.first + i) % 7
        var tmp = { d: all[i], w: wd, y: year, m: mouth, isThisMouth: true}
        res.push(tmp)
      }

      // Fill begin and end
      // Fill begin (last mouth)
      if(mouthSE.start != 1){
        var lT = mouthSE.start == 0 ? 6 : (6 - (6 - mouthSE.first))-1

        var lastMouthDay = this.getMouthDay(mouth-1, year)

        for (var i = 0; i < lT; i++) {
          var tmp = { d: lastMouthDay - i, w: (mouthSE.first - (i + 1)) % 7, y: year, m: mouth, isThisMouth: false }
          res.unshift(tmp)
        }
      }
      
      // Fill end (next mouth)
      if(mouthSE.end != 0){
        // if is Sunday fo nothing, else get rest
        var sT = mouthSE.end == 0 ? 0 : (6 - mouthSE.end) + 1
        for (var i = 0; i < sT; i++) {
          var tmp = { d: i + 1, w: (mouthSE.end + (i + 1)) % 7, y: year, m: mouth, isThisMouth: false }
          res.push(tmp)
        }
      }
      return res
    },

    // Control Functions
    nextMouth () {

      const n = this.data.thisToday

      if(n.mouth == 11){
        n.year = n.year + 1
        n.mouth = 0
      } else {
        n.mouth = n.mouth + 1
      }

      var checkIfDayExist = this.getMouthDay(n.mouth, n.year)
      if (n.day >= checkIfDayExist) {
        n.day = checkIfDayExist
      }
      
      this.renderDate(this.getToday(n))
    },

    lastMouth() {
      const n = this.data.thisToday
      
      if(n.mouth == 0){
        n.year = n.year - 1
        n.mouth = 11
      } else {
        n.mouth = n.mouth - 1
      }

      var checkIfDayExist = this.getMouthDay(n.mouth, n.year)
      if (n.day > checkIfDayExist) {
        n.day = checkIfDayExist
      }
      
      this.renderDate(this.getToday(n))
    },

    cvcChange (e) {
      var cP = e.detail.y

      if (!this.data.cvcOpen){
        if (this.data.currentView == "mouth" && cP < -25) {
          this.toView("week", 320)
        }

        if (this.data.currentView == "week" && cP > -10) {
          this.toView("mouth", 320)
        }
      }

    },

    setCVC(bol){
      this.setData({
        cvcOpen: bol,
        cvcY: -15
      })
    },

    btnChangeView(){

      var angle = {
        start: this.data.currentView == "week" ? 0 : -180,
        end: this.data.currentView == "week" ? -180 : 0
      }

      this.toView()

      this.animate('#valendar-view-c-btn', [
        { rotate: angle.start, ease: "ease-in-out" },
        { rotate: angle.end, ease: "ease-in-out" }
      ], 440, function () {
          this.clearAnimation('#valendar-view-c-btn', {}, function () {
          // Do nothing...
        })
      }.bind(this))
      
    },

    toView(mode, speed){
      var that = this

      if (!mode){
        mode = this.data.currentView == "week" ? "mouth" : "week"
      }

      speed = speed ? speed : 320

      this.setCVC(true)

      var calContainer = {
        opacity: [1, 0, 1],
        height: [this.data.cc_height_mouth, this.data.cc_height_week, this.data.cc_height_week],
        ease: "ease-in-out"
      }

      var calControl = {
        opacity: [1, 0],
        height: [this.data.ct_height_mouth, this.data.ct_height_week],
        translate: [
          [0, 0]
          [0, -30]
        ],
        ease: "ease-in-out"
      }

      //console.log(calContainer, calControl)
      

      if(mode == "week"){

        var currentWeekCount = this.idCurrentWeek(this.data.currentSelected, this.data.thisMouthInWeek)
        this.setData({
          currentWeekCount: currentWeekCount,
        })

        this.toViewAni(calContainer, calControl, true, speed)
      }

      if(mode == "mouth"){
        this.toViewAni(calContainer, calControl, false, speed)
      }

      this.setData({
        currentView: mode
      })
    },

    toViewAni(ani1, ani2, bol, speed){
      
      var that = this

      if (!speed || speed < 0) {
        speed = 200
      }

      if(!bol){
        ani1.opacity = ani1.opacity.reverse()
        ani1.height = ani1.height.reverse()

        ani2.opacity = ani2.opacity.reverse()
        ani2.height = ani2.height.reverse()
        ani2.translate = ani2.translate.reverse()
      }

      this.animate('#calendar-cont', [
        { opacity: ani1.opacity[0], height: ani1.height[0], ease: "ease-in-out"},
        { opacity: ani1.opacity[1], ease: "ease-in-out"},
        { opacity: ani1.opacity[2], height: ani1.height[2], ease: "ease-in-out"}
      ], speed, function () {

        this.clearAnimation('#calendar-cont', { }, function () {
          // Do nothing...
        })

      }.bind(this))

      this.animate('#calendar-control', [
        { opacity: ani2.opacity[0], height: ani2.height[0], ease: "ease-in-out", translate: ani2.translate[0] },
        { opacity: ani2.opacity[1], height: ani2.height[1], ease: "ease-in-out", translate: ani2.translate[1] },
      ], speed*0.3, function () {
          this.clearAnimation('#calendar-control', { }, function () {
            that.setCVC(false)
        })
      }.bind(this))

    },

    daySelected: function(e){

      if(!e.currentTarget.dataset.d.isThisMouth){
        return false
      }

      var res = {
        day: e.currentTarget.dataset.d.d,
        month: parseInt(e.currentTarget.dataset.d.m) + 1,
        week: e.currentTarget.dataset.d.w,
        year: e.currentTarget.dataset.d.y,
      }

      this.setData({
        currentSelected: res.day
      })

      this.triggerEvent('onDayTap', res)

      return res
    },

    // Basic Functions
    getFirstAndEndWeekday(today, weekday, all) {
      var firstWeekday = 0
      var endWeekday = 0

      if (today == 1) {
        firstWeekday = weekday
      } else {
        var ftt = today
        if (today - weekday < 0) {
          ftt = today + 7
        }

        firstWeekday = (ftt - weekday) % 7
        firstWeekday = 7 - firstWeekday

        if(this.data.weekStartMonday){
          firstWeekday = firstWeekday + 1
        }
      }

      endWeekday = (weekday + (all.length - today)) % 7
      endWeekday = endWeekday == 0 ? 0 : endWeekday
      return { first: firstWeekday, end: endWeekday }
    },

    getToday(val){
      var date
      // val = { year: Num, mouth: Num, day: Num }
      if(val){
        date = new Date(val.year, val.mouth, val.day)
      } else {
        date = new Date()
      }

      return {
        day: date.getDate(),
        week: date.getDay(),
        mouth: date.getMonth(),
        year: date.getFullYear()
      }

    },

    getMouthDay(mouth, year){
      // mouth is start from 1
      var totalDay = 0
      
      if(mouth == 1){
        // If is Feb, others is normal
        if(this.leapYear(year)){
          totalDay = 29
        } else {
          totalDay = 28
        }
      } else {
        totalDay = this.matchMouth(mouth)
      }
      return totalDay
    },

    matchMouth(mouth){
      // do not pass 1, feb
      var day = 30
      
      const m31 = [1, 3, 5, 7, 8, 10, 12]

      for(var i=0;i<m31.length;i++){
        if(mouth + 1 == m31[i]){
          day = 31
          return day
        }
      }

      return day
    },

    generateMouthArr(total){

      total = parseInt(total)

      var arr = []
      for(var i=0;i<total;i++){
        arr.push(i+1)
      }
      return arr
    },

    leapYear(year){
      return((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    },

    constMouthStr(str){
      return str+1 > 9 ? str + 1 : "0" + (str + 1)
    }
  }

})
