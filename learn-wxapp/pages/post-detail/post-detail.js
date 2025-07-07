// pages/post-detail/post-detail.js
import postList from '../../data/data'
const app = getApp()
// 缓存 loalstorage

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: {},
    collected: false,
    isPlaying: false,
    // 不做数据绑定的加下划线
    _mgr: null,
    _pid: null,
    _postsCollecte: {
      0: false
    }
  },

  onMusic() {
    const mgr = this.data._mgr
    mgr.src = postList[this.data._pid].music.url
    mgr.title = postList[this.data._pid].music.title
    mgr.coverImgUrl = postList[this.data._pid].music.coverImg

    // 音乐状态切换
    this.setData({
      isPlaying: !this.data.isPlaying
    })
    this.data.isPlaying ? mgr.play() : mgr.pause()

    // 全局变量解决音乐播放状态初始化不正确的问题
    this.data.isPlaying ? app.gIsPlayingMusic = true : app.gIsPlayingMusic = false

    app.gIsPlayingPostId = this.data._pid
  },

  onShare() {
    wx.showActionSheet({
      itemList: ['分享到QQ', '分享到微信', "分享到朋友圈"],
      success(res) {
        console.log(res);
      }
    })
  },

  onCollect() {
    // 假设 未收藏 -->  收藏
    // 那篇文章被收藏
    // 数据结构 多篇文章是否被收藏--同步文章缓存状态

    wx.setStorageSync('posts_collected', Object.assign(this.data._postsCollecte, {
      [this.data._pid]: !this.data.collected
    }))

    this.setData({
      collected: !this.data.collected
    })
    wx.showToast({
      title: this.data.collected ? '收藏成功' : '取消收藏',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const postData = postList[options.pid]
    this.data._pid = options.pid
    const postsCollecte = wx.getStorageSync('posts_collected')
    let collected = postsCollecte[this.data._pid]
    if (!postsCollecte) {
      collected = false
    } else {
      this.data._postsCollecte = postsCollecte
    }
    this.setData(postData)
    this.setData({
      collected,
      isPlaying: this.currentPostMusicIsPlaying() // 全局变量解决音乐播放状态初始化不正确的问题
    })

    const mgr = wx.getBackgroundAudioManager()
    this.data._mgr = mgr
    mgr.onPlay(() => {
      this.setData({
        isPlaying: true
      })
      const mgr = this.data._mgr
      mgr.src = postList[this.data._pid].music.url
      mgr.title = postList[this.data._pid].music.title
      mgr.coverImgUrl = postList[this.data._pid].music.coverImg
    })
    mgr.onPause(() => {
      this.setData({
        isPlaying: false
      })
    })
  },

  currentPostMusicIsPlaying() {
    if (app.gIsPlayingMusic && app.gIsPlayingPostId === this.data._pid) {
      return true
    } else {
      return false
    }
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