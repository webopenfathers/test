// pages/movie-detail/movie-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  viewImage(event) {
    // 相册预览API
    wx.previewImage({
      urls: [this.data.movie.images.large],
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const mid = options.mid
    // 动态设置电影详情页title
    wx.setNavigationBarTitle({
      title: options.title,
    })
    wx.request({
      url: app.gBaseUrl + 'subject/' + mid,
      success: (res) => {
        this.processMovieData(res.data)
      }
    })
  },

  processMovieData(movie) {
    movie.directors = movie.directors.map(item => item.name).join(' / ')
    movie.castsName = movie.casts.map(item => item.name).join(' / ')
    // 处理影人信息
    movie.castsInfo = movie.casts.map(item => ({
      img: item.avatars.large,
      name: item.name
    }))
    movie.genres = movie.genres.join('、')
    console.log(movie);
    this.setData({
      movie
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})