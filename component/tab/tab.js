// component/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array,
      value: []
    },
    normalcolor: {
      type: String,
      value: "#222222"
    },
    selectedcolor: {
      type: String,
      value: "#0277F9"
    },
    defaultTab: {
      type: Number,
      value: 0
    }
  },

  ready: function(){

    this.setData({
      tabCurrent: parseInt(this.data.defaultTab)
    })
    
    console.log(this.data.tabCurrent)
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabCurrent: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select(e){

      this.setData({
        tabCurrent: e.currentTarget.dataset.i
      })

      this.triggerEvent('switchtab', { tabCurrent: this.data.tabCurrent})

    }
  }
})
