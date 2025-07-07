const {
  appointWithMeGrid,
  myAppointGrid,
  myProvideGird,
  mySeekGrid,
} = require("../../config/grid");
const { default: cache } = require("../../enum/cache");
const { default: roleType } = require("../../enum/role-type");
const { default: serviceType } = require("../../enum/service-type");
const { default: Order } = require("../../model/order");
const { default: Service } = require("../../model/service");
const { default: Token } = require("../../model/token");
const { default: User } = require("../../model/user");
const { getEventParams } = require("../../utils/utils");
const { setTabBarBadge } = require("../../utils/wx");

// pages/my/my.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname: "点击授权登录",
      avatar: "../../images/logo.png",
    },
    // 宫格配置
    // 预约我的宫格
    appointWithMeGrid: appointWithMeGrid,
    // 我的预约宫格
    myAppointGrid: myAppointGrid,
    // 我在提供宫格
    myProvideGird: myProvideGird,
    // 正在找宫格
    mySeekGrid: mySeekGrid,
    appointWithMeStatus: null,
    myAppointStatus: null,
    provideServiceStatus: null,
    seekServiceStatus: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT);
    setTabBarBadge(unreadCount);
    const verifyToken = await Token.verifyToken();
    if (verifyToken.valid) {
      const userInfo = User.getUserInfoByLocal();
      this.setData({
        userInfo,
      });
    }
    this._getOrderStatus();
    this._getServiceStatus();
  },

  // 获取订单状态
  async _getOrderStatus() {
    const appointWithMeStatus = Order.getOrderStatus(roleType.PUBLISHER);
    const myAppointStatus = Order.getOrderStatus(roleType.CONSUMER);

    this.setData({
      appointWithMeStatus: await appointWithMeStatus,
      myAppointStatus: await myAppointStatus,
    });
  },

  // 获取服务状态
  async _getServiceStatus() {
    const provideServiceStatus = Service.getServiceStatus(serviceType.PROVIDE);
    const seekServiceStatus = Service.getServiceStatus(serviceType.SEEK);
    this.setData({
      provideServiceStatus: await provideServiceStatus,
      seekServiceStatus: await seekServiceStatus,
    });
  },

  handleNavToMyService(event) {
    const { type, status } = getEventParams(event, "cell");
    wx.navigateTo({
      url: `/pages/my-service/my-service?tye=${type}&status=${status}`,
    });
  },

  handleNavToOrder(event) {
    const cell = getEventParams(event, "cell");
    if (!("status" in cell)) {
      wx.navigateTo({
        url: `/pages/refund-list/refund-list?role=${cell.role}`,
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/my-order/my-order?role=${cell.role}&status=${cell.status}`,
    });
  },

  handleToLogin() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },

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
