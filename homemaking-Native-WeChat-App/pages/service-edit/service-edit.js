import Service from "../../model/service";
import { getEventParams } from "../../utils/utils";


// pages/service-edit/service-edit.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const service = JSON.parse(options.service);
    this._init(service);
  },

  _init(service) {
    const formData = {
      type: service.type,
      title: service.title,
      category_id: service.category.id,
      description: service.description,
      designated_place: service.designated_place,
      cover_image: service.cover_image,
      begin_date: service.begin_date,
      end_date: service.end_date,
      price: service.price,
    };
    this.setData({
      formData,
      serviceId: service.id,
    });
  },

  async handleSubmit(e) {
    const res = await wx.showModal({
      title: "提示",
      content: "是否确认修改该服务？提交后会重新进入审核状态",
      showCancel: true,
    });

    if (!res.confirm) {
      return;
    }

    wx.showLoading({
      title: "正在发布...",
      mask: true,
    });

    const formData = getEventParams(e, "formData");
    try {
      await Service.editService(this.data.serviceId, formData);
      // 关闭当前页面，跳转指定页面
      wx.redirectTo({
        url: `/pages/publisher-success/publisher-success?type=${formData.type}`,
      });
    } catch (e) {
      console.log(e);
    }
    wx.hideLoading()
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
