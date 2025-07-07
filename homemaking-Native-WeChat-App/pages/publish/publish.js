import cache from "../../enum/cache";
import Service from "../../model/service";

import { getEventParams } from "../../utils/utils";
import { setTabBarBadge } from "../../utils/wx";
// pages/publish/publish.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      type: null,
      title: "",
      category_id: null,
      cover_image: null,
      description: "",
      designated_place: false,
      begin_date: "",
      end_date: "",
      price: "",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  async handleSubmit(e) {
    const res = await wx.showModal({
      title: "提示",
      content: "是否确认申请发布该服务",
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
      await Service.publishService(formData);
      this._resetForm();
      wx.navigateTo({
        url: `/pages/publisher-success/publisher-success?type=${formData.type}`,
      });
    } catch (e) {
      console.log(e);
    }
    wx.hideLoading();
  },

  _resetForm() {
    const formData = {
      type: null,
      title: "",
      category_id: null,
      cover_image: null,
      description: "",
      designated_place: false,
      begin_date: "",
      end_date: "",
      price: "",
    };
    this.setData({
      formData,
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
