// pages/posts/posts.js

import postData from '../../data/data'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: []
  },
  onJumpToDetail(event) {
    // 自定义属性的获取方式：event.currentTarget.dataset.参数名
    // 自定义事件传递的参数获取方式：event.detail.参数名
    // 页面路径传递的参数获取方式：options.参数名
    const pid = event.currentTarget.dataset.postId || event.detail.pid
    wx.navigateTo({
      url: '/pages/post-detail/post-detail?pid=' + pid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 同步操作设置缓存
    // wx.setStorageSync('flag', true)
    // 同步修改缓存
    // wx.setStorageSync('flag', false)
    // 同步删除缓存
    // wx.removeStorageSync('flag')
    // 同步获取小程序的缓存
    // const flag = wx.getStorageSync('flag')
    // console.log(flag);

    this.setData({
      postData
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