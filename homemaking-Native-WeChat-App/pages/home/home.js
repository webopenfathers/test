// pages/home/home.js
import cache from "../../enum/cache";
import Category from "../../model/category";
import Service from "../../model/service";
import Tim from "../../model/tim";
const service = new Service();
import { throttle } from "../../utils/utils";
import { setTabBarBadge } from "../../utils/wx";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部服务", "在提供", "正在找"],
    categoryList: [],
    tabIndex: 0,
    categoryId: 0,
    loading: true, // 默认骨架屏是显示的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this._getServiceList();
    await this._getCategoryList();
    this.setData({
      loading: false,
    });
  },

  // 发起网络请求,获取服务列表的数据
  async _getServiceList() {
    // wx.request()
    // 模型：业务模型
    const serviceList = await service
      .reset()
      .getSrviceList(this.data.categoryId, this.data.tabIndex);
    console.log(serviceList);
    this.setData({
      serviceList: serviceList,
    });
  },

  // 获取服务分类
  async _getCategoryList() {
    const categoryList = await Category.getCategoryListWidthAll();
    console.log(categoryList);
    this.setData({
      categoryList,
    });
  },

  // 监听子组件发出的信息
  handleTabChange(e) {
    this.data.tabIndex = e.detail.index;
    this._getServiceList();
  },

  // 点击swipper过滤数据
  handleCategoryChange: throttle(function (e) {
    if (this.data.categoryId === e.currentTarget.dataset.id) {
      return;
    }
    this.data.categoryId = e.currentTarget.dataset.id;
    this._getServiceList();
  }),

  // 监听服务被点击
  handleSelectService(e) {
    console.log(e);
    const service = e.currentTarget.dataset.service;
    // 1.缓存。存在数据不一致
    // 2.值传递一个 id 然后跳转的目标页面根据这个id 发起一个请求获取数据

    // 路由跳转功能
    wx.navigateTo({
      url: "/pages/service-detail/service-detail?service_id=" + service.id,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT);
    setTabBarBadge(unreadCount)
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
   * 监听用户下拉动作刷新
   */
  async onPullDownRefresh() {
    // 因为 return了当前的实例对象，所以可以链式调用
    this._getServiceList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底加载更多
   */
  async onReachBottom() {
    // 获取下一页的数据并且和当前页数据合并
    // 没有更多数据时，return
    if (!service.hasMoreData) {
      return;
    }
    const serviceList = await service.getSrviceList(
      this.data.categoryId,
      this.data.tabIndex
    );
    this.setData({ serviceList });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
