var util = require('../../utils/util.js')
var request = require('../../utils/request.js')
// component/tasklist/tasklist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gid:{
      type: Number,
      value: 0
    }
  },


  ready: function(){

    // Get Cached Tasks Data
    var tryGetGTasks = util.getGTTasks(this.data.gid)
    if (tryGetGTasks) {
      this.processData(tryGetGTasks)
    }

    this.setData({
      todayDate: this.today(),
      screenHeight: wx.getSystemInfoSync().windowHeight
    })

    this.getTasksData()

  },

  /**
   * 组件的初始数据
   */
  data: {
    api_all: "/tasks/all",
    api_add: "/tasks/add",
    api_edit: "/tasks/update",
    api_del: "/tasks/del",
    api_upState: '/tasks/updatestate',
    doing: [],
    done: [],
    editId: "",
    formDes: "",
    formEndDate: false,
    formColor: false,
    formCanSubmit: false,
    limit: 100,
    todayDate: "",
    expandState: true,
    screenHeight: 0,
    aniSpeed: 500,
    tasksNewOpen: false,
    selectedDate: "",
    selectedLabel: "",
    submitMode: "new",
    labelColors: [
      "#F24C4C",
      "#FF7A00",
      "#1DDB8B",
      "#603BF4",
      "#F90279",
      "#0277F9",
      "#25FFCB"
    ],
    btn_able: "#0277F9",
    btn_disable: "#999999",
  },

  /**
   * 组件的方法列表
   */
  methods: {

    today(){
      var d = new Date()
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    },

    getTasksData() {
      var that = this
      var postData = {
        gid: this.data.gid
      }


      request.genPost(this.data.api_all, postData, (res) => {
        if (res.status) {

          this.processData(res.data.data)

          var getData = wx.setStorageSync('data_gta_' + this.data.gid, res.data.data)
        }
      })
    },

    processData(data){
      var doing = []
      var done = []

      for(let i=0;i<data.length;i++){
        
        data[i].startDate = data[i].startDate ? data[i].startDate.substr(0, 10) : null
        data[i].endDate = data[i].endDate ? data[i].endDate.substr(0, 10) : null
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

    editTask(e){
      const target = e.currentTarget.dataset.s
      this.setData({
        editId: target.id,
        formDes: target.des,
        formColor: target.color ? true : false,
        formEndDate: target.endDate ? true : false,
        formCanSubmit: target.des.length > 1 ? true : false,
        selectedDate: target.endDate,
        selectedLabel: target.color,
        submitMode: "edit"
      })
      this.openTaskWindow()
    },

    submitNew(){

      if(this.data.formDes == "" || this.data.formDes.length < 1 || this.data.formDes.length > 30){
        wx.showToast({
          title: '任务描述字数限制2-30',
          icon: 'none'
        })
        return
      }

      wx.showLoading({
        title: '正在保存',
      })

      var api = this.data.submitMode == "new" ? this.data.api_add : this.data.api_edit
      
      var postReady = {
        gid: this.data.gid,
        des: this.data.formDes,
        end: this.data.formEndDate ? this.data.selectedDate : "",
        color: this.data.formColor ? this.data.selectedLabel : "",
        state: 0
      }

      if(this.data.submitMode == "edit"){
        postReady.id = this.data.editId
      }

      request.genPost(api, postReady, (res)=>{

        wx.hideLoading()

        if(res.status){

          wx.showToast({
            title: '保存成功',
            icon: 'success'
          })

          this.closeTaskWindow()
          this.getTasksData()
        } else {

          wx.showToast({
            title: '网络错误',
            icon: "none"
          })

        }
      })

    },

    delTask(e){
      
      //React first than post
      this.setData({
        done: this.sliceFromArr(this.data.done, e.currentTarget.dataset.i)
      })
      

      const postReady = {
        id: e.currentTarget.dataset.id
      }

      request.genPost(this.data.api_del, postReady, (res)=>{

        if(res.status){
          console.log("delete successful")
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }

        this.getTasksData()
        
      })

    },

    toDone(e){
      var that = this
      const id = e.currentTarget.dataset.id
      const idx = e.currentTarget.dataset.i
      const upAniDis = e.currentTarget.dataset.e ? -110 : -75

      const others = this.constructOthers(this.data.doing, '.doing-', idx)
      
      this.animate('.doing-' + idx, [
        { translateX: 0, opacity: 0.5, backgroundColor: '#ffffff', ease: "ease-in-out" },
        { translateX: 800, opacity: 1, backgroundColor: '#1DDB8B', ease: "ease-in-out" },
      ], 500, function () {
          this.clearAnimation('.doing-' + idx, function () {

            console.log("doing ani finished")

            var res = that.moveToArr(that.data.doing, that.data.done, idx)
            that.setData({
              doing: res.f,
              done: res.t
            })

        })
      }.bind(this))

      for(let i=0;i<others.length;i++){
        this.animate(others[i], [
          { translateY: 0, ease: "ease-in-out" },
          { translateY: upAniDis, ease: "ease-in-out" },
        ], 500, function () {
          this.clearAnimation(others[i], function () {

            console.log("doing others ani finished")

          })
        }.bind(this))
      }

      

      this.updateState(true, id)

    },

    

    toDoing(e){

      var that = this

      const id = e.currentTarget.dataset.id
      const idx = e.currentTarget.dataset.i
      const upAniDis = e.currentTarget.dataset.e ? -110 : -75

      const others = this.constructOthers(this.data.doing, '.done-', idx)

      this.animate('.done-' + idx, [
        { translateX: 0, opacity: 0.5, backgroundColor: '#ffffff', ease: "ease-in-out" },
        { translateX: -800, opacity: 1, backgroundColor: '#FF7A00', ease: "ease-in-out" },
      ], 500, function () {
          this.clearAnimation('.done-' + idx, function () {

          var res = that.moveToArr(that.data.done, that.data.doing, e.currentTarget.dataset.i)
          that.setData({
            doing: res.t,
            done: res.f
          })

        })
      }.bind(this))

      for (let i = 0; i < others.length; i++) {
        this.animate(others[i], [
          { translateY: 0, ease: "ease-in-out" },
          { translateY: upAniDis, ease: "ease-in-out" },
        ], 500, function () {
          this.clearAnimation(others[i], function () {

            console.log("done others ani finished")

          })
        }.bind(this))
      }


      this.updateState(false, id)
    },

    updateState(finish, id){

      const postReady = {
        id: id,
        state: finish ? 1 : 0
      }

      request.genPost(this.data.api_upState, postReady, (res)=>{
        if(res.status){
          console.log("update state successful")
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      })
    },

    clearForm () {
      this.setData({
        editId: "",
        formDes: "",
        formColor: false,
        formEndDate: false,
        formCanSubmit: false,
        selectedDate: "",
        selectedLabel: "",
        submitMode: "new"
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

      // Test if exceed limit
      const doingLen = this.data.doing.length
      const doneLen = this.data.done.length
      if (doingLen + doneLen >= this.data.limit && this.data.submitMode == "new") {
        wx.showModal({
          title: '任务超过限制',
          content: '小组任务数量限制' + this.data.limit + '条, 请删除已完成的任务',
        })
        return
      }


      const aniSpeed = this.data.aniSpeed

      this.setData({
        tasksNewOpen: true,
      })

      this.animate('#tasks-new', [
        { opacity: 0, bottom: "-1000px", ease: "ease-in-out" },
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

    },

    closeTaskWindow() {

      const aniSpeed = this.data.aniSpeed

      this.animate('#tasks-new', [
        { scale: [1, 1], ease: "ease-in-out" },
        { opacity: 1, scale: [0.96, 0.96], bottom: "0px", ease: "ease-in-out" },
        { opacity: 0, bottom: "-1000px", ease: "ease-in-out" },
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

      this.clearForm()

      setTimeout(() => {
        this.setData({
          tasksNewOpen: false,
        })
      }, aniSpeed + 10)
    },

    newTaskName(e){

      this.setData({
        formCanSubmit: e.detail.value.length > 1 ? true : false,
        formDes: e.detail.value
      })

    },

    newDate(e){
      this.setData({
        formEndDate: true,
        selectedDate: e.detail.value
      })
    },

    newColor(e){
      this.setData({
        formColor: true
      })
    },

    selectLabel(e){
      this.setData({
        selectedLabel: e.currentTarget.dataset.c
      })
    },

    constructOthers(arr, word, idx) {
      var res = []
      for (let i = 0; i < arr.length; i++) {
        if (i > idx) {
          res.push(word + i)
        }
      }
      return res
    },

    sliceFromArr(arr, index){
      arr.splice(index, 1)
      return arr
    },

    moveToArr(arr, toArr, idx){
      toArr.unshift(arr[idx])
      var a = toArr
      var b = this.sliceFromArr(arr, idx)
      return {f: b, t: a}
    },

    indexObjInArr (arr, obj, key) {
      for (let i = 0; i < arr.length; i++) {
        //console.log(obj[key], arr[i][key])
        if (obj == arr[i][key]) {
          //console.log(i)
          return i
        }
      }
    }

  }
})
