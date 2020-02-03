var util = require('../../utils/util.js')
var timeProcessing = require('../../utils/time.js')
var testData = require('../../utils/testData.js')
Component({
  lifetimes: {
    attached: function (e) {
      
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    events: Array,
    hasMems: {
      type: String,
      value: "f",
    },
    memsImg: Array
  },

  observers:{ 
    "events": function(val){
      //console.log(val)
      this.renderEvts(val)
    },
    "memsImg": function(val){
      var eevt = this.data.events
      for (let i=0; i<eevt.length;i++){
        var uinfo = this.matchEvtUImg(eevt[i].uuid, this.data.memsImg)
        eevt[i].uimg = uinfo.img
        eevt[i].uname = uinfo.name
      }
      /*this.setData({
        innerEvts: eevt
      })*/

      this.renderEvts(eevt)
      console.log(eevt)

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    times: [
      "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00",
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"
    ],
    innerEvts: Array,
    currentLine: Object,
    currentInfo: Array,
    currentInfoIndex: 0,
    ttEvtsDisplay: true,
    screenWidth: 0,
    slotHeight: 60,
    detailOpen: false,
    bugOffset: 6,
    memsAvas: Array,
    hMems: true
  },

  ready: function (e) {
    this.positionToTimeSlot()
    this.currentTime()

    setInterval(()=>{
      this.currentTime()
    }, 60 * 1000)

    this.setData({
      hMems: this.data.hasMems == "f" ? false : true,
      screenWidth: wx.getSystemInfoSync().windowWidth
    })
    
    //this.toWeek()
    //console.log(this.data.events)
  },


  /**
   * 组件的方法列表
   */
  methods: {
    renderEvts (data) {

      // Use test data here
      //var evts = this.parseEvtsTop(testData.ttTestData)

      var evts = this.parseEvtsTop(data)
      evts = timeProcessing.reConstructDataByTimeSlot(evts)

      this.setData({
        innerEvts: evts,
        ttEvtsDisplay: true
      })

    },

    parseEvtsTop(data) {
      var res = data
      for(var i = 0; i<res.length; i++) {
        
        res[i].size = timeProcessing.timeToSize(res[i].startTime, res[i].endTime, this.data.slotHeight)
        if (this.data.memsImg) {
          var uinfo = this.matchEvtUImg(res[i].uuid, this.data.memsImg)
          res[i].uimg = uinfo.img
          res[i].uname = uinfo.name
        }

      }
      return res
    },

    matchEvtUImg(target, arr){
      for(let i=0;i<arr.length;i++){
        if(target == arr[i].id){
          return { name: arr[i].name, img: arr[i].img }
        }
      }

      return { name: null, img: null }
    },

    currentTime () {
      const now = new Date();
      const hour = now.getHours()
      const minute = now.getMinutes()
      //var hour = 10
      //var minute = 0
      const line = timeProcessing.timeToSize(hour+":"+minute, hour+":"+minute, this.data.slotHeight)
      line.height = 1
      this.setData({
        currentLine: line
      })
      return
    },

    openDetail(e){

      var data = e.currentTarget.dataset.d

      if(!Array.isArray(data)){
        data = [e.currentTarget.dataset.d]
      }
      this.setData({
        detailOpen: true,
        currentInfo: data,
        currentInfoIndex: 0
      })
      //console.log()
    },

    closeDetail(){
      this.setData({
        detailOpen: false,
        currentInfo: []
      })
    },

    // Mutiple Event Detail Popup Controller, next and last
    lastEvt(){
      
      var cii = this.data.currentInfoIndex

      if(cii != 0){
        this.setData({
          currentInfoIndex: cii - 1
        })
      }

      return
    },

    nextEvt(){
      var cii = this.data.currentInfoIndex

      if (cii != this.data.currentInfo.length - 1) {
        this.setData({
          currentInfoIndex: cii + 1
        })
      }

      return
    },

    positionToTimeSlot () {

      var now = new Date();
      now = now.getHours()
      //now = 8
      var posi = 0
      if(now >= 0 && now < 6){
        posi = 0
      } 

      else if(now >= 6 && now < 12){
        posi = 6 * this.data.slotHeight
      }

      else if (now >= 12 && now < 18) {
        posi = 12 * this.data.slotHeight
      }

      else{
        posi = 18 * this.data.slotHeight
      }

      /*this.setData({
        scrollTopPosi: 
      })*/
      wx.pageScrollTo({
        scrollTop: posi
      })
    }

    
  },
})