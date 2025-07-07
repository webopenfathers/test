// components/post/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    postItem: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   * 组件的方法列表
   * 组件的开发者不应该决定
   * 点击之后做什么事情 不应该
   * 组件的使用者
   * 自定义事件
   */
  methods: {
    onTap() {
      // 抛出自定义事件('自定义事件名')
      const pid = this.properties.postItem.postId
      this.triggerEvent('postTap', {
        pid,
        test: 1
      })
    },
  }
})