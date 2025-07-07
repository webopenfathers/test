// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  // catch与bind的区别：
  // catch：能够阻止事件向上冒泡
  // bind：不能阻止事件冒泡

  onTap() {
    // 跳转页面
    // 保留当前页面跳转到另一个页面，可以返回父页面，保存在页面栈
    // wx.navigateTo({
    //   url: '/pages/posts/posts',
    // })

    // 关闭当前页面跳转到另一个页面，不能返回，没保留在页面栈
    wx.switchTab({
      url: '/pages/posts/posts',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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