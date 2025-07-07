import cache from "../../enum/cache";
import serviceAction from "../../enum/service-action";
import serviceStatus from "../../enum/service-status";
import serviceType from "../../enum/service-type";
import Rating from "../../model/rating";
import Service from "../../model/service";
import User from "../../model/user";
import { getEventParams } from "../../utils/utils";
const rating = new Rating();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    service: null,
    serviceId: null,
    isPublisher: false,
    ratingList: [],
    serviceTypeEnum: serviceType,
    serviceStatusEnum: serviceStatus,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 在这个生命周期中接收传递过来的参数
    this.data.serviceId = options.service_id;
    await this._getService();
    await this._getServiceRatingList();
    this._checkRole();
    this.setData({
      loading: false,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  // 获取服务信息
  async _getService() {
    const service = await Service.getServiceById(this.data.serviceId);
    this.setData({
      service,
    });
  },

  // 获取评价列表
  async _getServiceRatingList() {
    if (this.data.service.type === serviceType.SEEK) {
      return;
    }
    const ratingList = await rating
      .reset()
      .getServiceRatingList(this.data.serviceId);
    console.log(ratingList);
    this.setData({
      ratingList,
    });
  },

  // 更新操作
  async handleUpdateStatus(e) {
    const action = getEventParams(e, "action");
    const content = this._generateModalContent(action);
    const res = await wx.showModal({
      title: "注意",
      content,
      showCancel: true,
    });
    if (!res.confirm) {
      return;
    }

    await Service.updateServiceStatus(this.data.serviceId, action);
    await this._getService();
    console.log(res);
  },

  // 编辑操作
  handleEditService() {
    // 通过路径传参的方式，传递参数
    const service = JSON.stringify(this.data.service);
    wx.navigateTo({
      url: `/pages/service-edit/service-edit?service=${service}`,
    });
  },

  // 联系对方
  handleChat() {
    // 用户ID
    const targetUserId = this.data.service.publisher.id;
    // 服务
    const service = JSON.stringify(this.data.service);
    wx.navigateTo({
      url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${service}`,
    });
  },

  // 立即预约
  handleOrder() {
    console.log(4);
    // 没有登陆，跳转登录
    if (!wx.getStorageSync(cache.TOKEN)) {
      wx.navigateTo({
        url: "/pages/login/login",
        // 监听到登陆事件以后重新检查操作栏
        events: {
          // 箭头函数改变this指向
          login: () => {
            this._checkRole();
          },
        },
      });
      return;
    }

    // 登陆了，跳转下单页面
    const service = JSON.stringify(this.data.service);
    wx.navigateTo({
      url: `/pages/order/order?service=${service}`,
    });
  },

  _generateModalContent(action) {
    let content;
    switch (action) {
      case serviceAction.PAUSE:
        content =
          "暂停后服务状态变为“待发布”，" +
          "可在个人中心操作重新发布上线，" +
          "是否确认暂停发布该服务？";
        break;
      case serviceAction.PUBLISH:
        content = "发布后即可在广场页面中被浏览到，是否确认发布？";
        break;
      case serviceAction.CANCEL:
        content =
          "取消后不可恢复，需要重新发布并提交审核；" +
          "已关联该服务的订单且订单状态正在进行中的，仍需正常履约；" +
          "是否确认取消该服务？";
        break;
    }

    return content;
  },

  // 检查角色
  _checkRole() {
    const userInfo = User.getUserInfoByLocal();
    if (userInfo && userInfo.id === this.data.service.publisher.id) {
      this.setData({
        isPublisher: true,
      });
    }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (!rating.hasMoreData) {
      return;
    }

    const ratingList = await rating.getServiceRatingList(this.data.serviceId);

    this.setData({
      ratingList,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
