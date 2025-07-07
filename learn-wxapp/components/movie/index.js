// components/movie/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    movie: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGoToDetail() {
      // 对象的解构赋值，以及重命名
      let {
        title,
        id: mid
      } = this.properties.movie
      wx.navigateTo({
        url: `/pages/movie-detail/movie-detail?mid=${mid}&title=${title}`,
      })
    }
  }
})