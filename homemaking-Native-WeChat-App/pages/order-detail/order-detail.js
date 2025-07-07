const { default: orderAction } = require("../../enum/order-action");
const { default: orderStatus } = require("../../enum/order-status");
const { default: roleType } = require("../../enum/role-type");
const { default: Order } = require("../../model/order");
const { default: Rating } = require("../../model/rating");
const { getEventParams } = require("../../utils/utils");

// pages/order-detail/order-detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    oreder: null,
    role: null,
    rating: null,
    orderStatus: orderStatus,
    roleType: roleType,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const order = JSON.parse(options.order);
    const role = parseInt(options.role);
    this.setData({
      order,
      role,
    });
    if (order.status === orderStatus.COMPLETED) {
      this._getRating(order.id);
    }
  },

  async _getRating(orderId) {
    const rating = await Rating.getRatingByOrderId(orderId);
    this.setData({
      rating,
    });
  },

  // 联系对方
  handleToChat(event) {
    const targetUserId = getEventParams(event, "targetUserId");
    wx.navigateTo({
      url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${JSON.stringify(
        this.data.order.service_snap
      )}`,
    });
  },

  // 跳转退款页面
  handleRefund() {
    wx.navigateTo({
      url: `/pages/refund/refund?order=${JSON.stringify(this.data.order)}`,
    });
  },

  // 评价页面
  handleRating() {
    wx.navigateTo({
      url: `/pages/rating/rating?order=${JSON.stringify(this.data.order)}`,
      events:{
         rating:()=>{
            this._getOrderById()
            this._getRating(this.data.order.id)
         } 
      }
    });
  },

  async _getOrderById() {
    const order = await Order.getOrderById(this.data.order.id);
    this.setData({
      order,
    });
  },

  // 支付处理
  async handlePay() {
    const res = await wx.showModal({
      title: "注意",
      content: `您即将支付该费用：${this.data.order.price}元，是否确认支付`,
    });

    if (!res.confirm) {
      return;
    }

    await Order.updateOrderStatus(this.data.order.id, orderAction.PAY);
    wx.navigateTo({
      url: "/pages/pay-success/pay-success",
    });
  },

  async handleUpdateOrderStatus(event) {
    const action = getEventParams(event, "action");
    const content = this._generateModalContent(action);
    const res = await wx.showModal({
      title: "注意",
      content,
    });

    if (!res.confirm) {
      return;
    }
    wx.showLoading({
      title: "正在提交",
      mask: true,
    });

    await Order.updateOrderStatus(this.data.order.id, action);
    wx.hideLoading();
    this._getOrderById();
  },

  _generateModalContent(action) {
    let content;
    switch (action) {
      case orderAction.AGREE:
        content = "是否确认同意本次服务预约，同意后不可以撤销。";
        break;
      case orderAction.DENY:
        content = "是否确认拒绝本次服务预约，同意后不可以撤销。";
        break;
      case orderAction.CONFIRM:
        content = "是否确认本次服务已完成？";
        break;
      case orderAction.CANCEL:
        content = "是否确认取消本次服务订单，确认取消后不可以撤销。";
        break;
    }

    return content;
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
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

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
