App({
  global: 2,
  test: 1,
  gIsPlayingMusic: false,
  gIsPlayingPostId: -1,
  gBaseUrl: 'http://t.talelin.com/v2/movie/',
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch() {
    console.log('小程序启动');
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError(msg) {

  }
})