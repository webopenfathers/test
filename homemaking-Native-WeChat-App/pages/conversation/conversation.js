import Tim from "../../model/tim";
import TIM from "tim-wx-sdk-ws";
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { timStore } from "../../store/tim";
// pages/conversation/conversation.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    targetUserId: null,
    service: null,
    isSend: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options", options);
    this.storeBindings = createStoreBindings(this, {
      store: timStore,
      fields: ["sdkReady"],
      actions: ["pushMessage",'resetMessage', "getConversationList"],
    });

    const targetUserId = options.targetUserId;
    // const targetUserId='zbw'
    this.setData({
      targetUserId: targetUserId,
      service: options.service ? JSON.parse(options.service) : null,
    });
  },

  handleSendMessage(event) {
    const { type, content } = event.detail;
    const message = Tim.getInstance().createMessage(
      type,
      content,
      this.data.targetUserId
    );
    this.pushMessage(message);
    Tim.getInstance().sendMessage(message);
    this.data.isSend = true;
    // this.getOpenerEventChannel().emit("sendMessage");
  },

  handleLogin: function () {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if (!this.data.isSend) {
      this.getConversationList();
    }
    this.resetMessage()
    this.storeBindings.destroyStoreBindings();
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
