// component/titlebar/titlebar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mode: {
      type: String,
      value: "center"
    },
    // home, back and none
    nav: {
      type: String,
      value: "none"
    },
    position: {
      type: String,
      value: "fixed"
    },
    color: {
      type: String,
      value: "#fafafa"
    },
    heightOffset:{
      type: Number,
      value: 0
    },
    topOffset: {
      type: Number,
      value: 0
    }
  },

  ready: function () {
    const h = wx.getSystemInfoSync().windowHeight
    this.setData({
      heightOffset: this.data.heightOffset < 40 ? this.data.heightOffset : 40,
      titlePaddingTop: (Math.ceil(h * 0.12315)) - this.data.topOffset
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    titlePaddingTop: 30
  },

  /**
   * 组件的方法列表
   */
  methods: {

    toBack(){
      wx.navigateBack()
    },

    toHome(){
      wx.switchTab({
        url: '/pages/calmain/calmain',
      })
    }
  }
})
