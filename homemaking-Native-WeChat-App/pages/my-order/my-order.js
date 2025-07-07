// pages/my-order/my-order.js

const { default: roleType } = require("../../enum/role-type");
const { default: Order } = require("../../model/order");
const { getEventParams } = require("../../utils/utils");

const order = new Order();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部订单", "待处理", "待支付", "待确认", "待评价"],
    active: 0,
    role: null,
    status: null,
    roleType: roleType,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const role = parseInt(options.role);
    const status = parseInt(options.status);
    // status:-1: 全部  0：待同意 1：待支付  2：待确认  3：待评价
    this.setData({
      active: status + 1,
      role,
    });
    this.data.status = status < 0 ? "" : status;
    this.data.role = role;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this._getOrderList();
  },

  async _getOrderList() {
    const orderList = await order
      .reset()
      .getMyOrderList(this.data.role, this.data.status);
    this.setData({
      orderList,
    });
  },

  async handleTabChange(event) {
    const index = getEventParams(event, "index");
    this.data.status = index < 1 ? "" : index - 1;
    await this._getOrderList();
  },

  // 跳转详情页
  handleNavDetail(event) {
    const order = getEventParams(event, "order");
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?role=${
        this.data.role
      }&order=${JSON.stringify(order)}`,
    });
  },

  // 联系对方

  handleChat(event) {
    const order = getEventParams(event, "order");
    const targetUserId =
      order[this.data.role === roleType.PUBLISHER ? "consumer" : "publisher"]
        .id;
    wx.navigateTo({
      url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${JSON.stringify(
        order.service_snap
      )}`,
    });
  },

  // 退款
  handleRefund(event) {
    const order = getEventParams(event, "order");
    wx.navigateTo({
      url: `/pages/refund/refund?order=${JSON.stringify(order)}`,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    await this._getOrderList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (!order.hasMoreData) {
      return;
    }
    const orderList = await order.getMyOrderList(
      this.data.role,
      this.data.status
    );
    this.setData({
      orderList,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
