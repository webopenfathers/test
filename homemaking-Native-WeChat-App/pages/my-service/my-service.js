const { default: Service } = require("../../model/service");
const { getEventParams, getDataSet } = require("../../utils/utils");

const service = new Service();

// pages/my-service/my-service.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部服务", "待审核", "待发布", "已发布"],
    serviceList: [],
    active: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const status = parseInt(options.status);
    const type = parseInt(options.type);
    this.setData({
      active: status + 1,
    });

    this.data.status = status < 0 ? "" : status;
    this.data.type = type;
    this._getServiceList();
  },

  handleTabChange(event) {
    const index = getEventParams(event, "index");
    this.data.status = index < 1 ? "" : index - 1;
    this._getServiceList();
  },

  async _getServiceList() {
    const serviceList = await service
      .reset()
      .getMyService(this.data.type, this.data.status);
    this.setData({
      serviceList,
    });
  },

  handleSelect(event) {
    const service = getDataSet(event, "service");
    wx.navigateTo({
      url: `/pages/service-detail/service-detail?service_id=${service.id}`,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    await this._getServiceList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (!service.hasMoreData) {
      return;
    }
    const serviceList = await service.getMyService(
      this.data.type,
      this.data.service
    );
    this.setData({
      serviceList,
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
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
