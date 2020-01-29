const request = require('../../utils/request.js')
const util = require('../../utils/util.js')

// pages/searchuser/searchuser.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    state: {
      type: Boolean,
      value: false
    },
    searchUserRes: {
      type: Number,
      value: null,
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    sVal: "",
    allResult: [],
    api: "/user/search"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sVal: function(e){
      this.setData({
        sVal: e.detail.value,
        allResult: []
      })
    },

    search: function(){
      
      if (this.data.sVal.length >= 5 && util.checkInputNumOnly(this.data.sVal)){
        

        var postReady = {
          q: this.data.sVal
        }

        request.genPost(this.data.api, postReady, (res)=>{
          console.log(res)
          if(res.status){
            if(res.data.data.length < 1){
              wx.showToast({
                title: '没找到用户',
                icon: "none"
              })
            } else {
              this.setData({
                allResult: res.data.data
              })
            }
            
          } else {
            wx.showToast({
              title: '没找到用户',
              icon: "none"
            })
            
          }
        })
      } else {
        wx.showToast({
          title: '请输入5位以上学号',
          icon: "none"
        })
      }
    },

    close: function (){
      this.triggerEvent('close', false);
    },

    select: function (e) {
      var obj = {
        id: e.currentTarget.dataset.id,
        name: e.currentTarget.dataset.n,
        img: e.currentTarget.dataset.img
      }
      this.triggerEvent('selected', { res: obj });

    }
  }
})
