import User from "../../model/user";
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { timStore } from "../../store/tim";

// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
        store: timStore,
        actions:{timLogin:'login'},
      });
  },

    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.storeBindings.destroyStoreBindings()

  },

  // 登录授权
  async handleLogin() {
    const res = await wx.getUserProfile({
      desc: "完善用户信息",
    });

    // 异常，会中断后续代码的执行
    // 错误，不会中断后续代码执行
    wx.showLoading({
      title: "正在授权",
      //   遮罩
      mask: true,
    });
    try {
      await User.login();
      await User.updateUserInfo(res.userInfo);
      this.timLogin()
      const events = this.getOpenerEventChannel();
      events.emit("login");
      wx.navigateBack();
    } catch (e) {
      wx.showModal({
        title: "注意",
        content: "登陆失败，请稍后重试",
        showCancel: false,
      });
      console.log(e);
    }
    wx.hideLoading();
  },

  handleToHome() {
    wx.switchTab({
      url: "/pages/home/home",
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
