// component/tasklist/tasklist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tasksData: {
      type: Array,
      value: []
    }
  },

  observers: {
    "tasksData": function (val) {
      //console.log(val)

      this.processData(val)

    },
  },

  ready: function(){
    this.setData({
      todayDate: this.today(),
      screenHeight: wx.getSystemInfoSync().windowHeight
    })

  },

  /**
   * 组件的初始数据
   */
  data: {
    doing: [],
    done: [],
    formDes: "",
    formEndDate: "",
    todayDate: "",
    expandState: false,
    screenHeight: 0,
    aniSpeed: 900,
    tasksNewOpen: false,
    selectedDate: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {

    today(){
      var d = new Date()
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    },

    processData(data){
      var doing = []
      var done = []

      for(let i=0;i<data.length;i++){
        if(data[i].state == 0){
         doing.push(data[i])
        } else {
          done.push(data[i])
        }
        
      }

      this.setData({
        doing: doing,
        done: done
      })
      
    },

    expandDone(){

      var arrow = [270, 360]
      var areaHeight = [0, '100%']
      var areaOpa = [0, 1]

      if (this.data.expandState){
        arrow = [360, 270]
        areaHeight = ['100%', 0]
        areaOpa = [1, 0]
      } 

      this.animate('#expand', [
        { rotate: arrow[0], ease: "ease-in-out" },
        { rotate: arrow[1], ease: "ease-in-out" },
      ], 200, function () {
          this.clearAnimation('#expand', {}, function () {
        })
      }.bind(this))

      this.animate('#tasks-done', [
        { opacity: areaOpa[0], height: areaHeight[0], ease: "ease-in-out" },
        { opacity: areaOpa[1], height: areaHeight[0], ease: "ease-in-out" },
      ], 200, function () {
        this.clearAnimation('#expand', {}, function () {
        })
      }.bind(this))

      this.setData({
        expandState: !this.data.expandState
      })

    },

    openTaskWindow(e) {


      const aniSpeed = this.data.aniSpeed

      this.setData({
        tasksNewOpen: true,
      })

      this.animate('#tasks-new', [
        { opacity: 0, bottom: "-2000px", ease: "ease-in-out" },
        { opacity: 1, scale: [0.96, 0.96], bottom: "0px", ease: "ease-in-out" },
        { scale: [1, 1], ease: "ease-in-out" },
      ], aniSpeed, function () {
          this.clearAnimation('#tasks-new', {}, function () {

        })
      }.bind(this))

      this.animate('#tasks-cover', [
        { opacity: 0, ease: "ease-in-out" },
        { opacity: 1, ease: "ease-in-out" },
      ], aniSpeed, function () {
          this.clearAnimation('#tasks-cover', {}, function () {

        })
      }.bind(this))

      //console.log()
    },

    closeTaskWindow() {

      const aniSpeed = this.data.aniSpeed

      this.animate('#tasks-new', [
        { scale: [1, 1], ease: "ease-in-out" },
        { opacity: 1, scale: [0.96, 0.96], bottom: "0px", ease: "ease-in-out" },
        { opacity: 0, bottom: "-2000px", ease: "ease-in-out" },
      ], aniSpeed, function () {
          this.clearAnimation('#tasks-new', {}, function () {

        })
      }.bind(this))

      this.animate('#tasks-cover', [
        { opacity: 1, ease: "ease-in-out" },
        { opacity: 0, ease: "ease-in-out" },
      ], aniSpeed, function () {
          this.clearAnimation('#tasks-cover', {}, function () {

        })
      }.bind(this))

      setTimeout(() => {
        this.setData({
          tasksNewOpen: false,
        })
      }, aniSpeed + 10)
    },

    newTaskName(e){
      this.setData({
        formDes: e.detail.value
      })
    },

    newDate(e){
      this.setData({
        formEndDate: e.detail.value
      })
    }

  }
})
