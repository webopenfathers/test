const { default: Rating } = require("../../model/rating");
const { getEventParams } = require("../../utils/utils");

// pages/rating/rating.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      score: 0,
      content: "",
    },
    rules: [
      {
        name: "score",
        rules: [{ required: true, message: "请为该服务评分" }],
      },
      {
        name: "content",
        rules: [
          { required: true, message: "评价内容不能为空" },
          { minlength: 10, message: "评价内容不能少于 10 个字" },
        ],
      },
    ],
    illustration: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const order = JSON.parse(options.order);
    this.setData({
      order,
    });
  },

  handleSubmit() {
    this.selectComponent("#form").validate(async (valid, errors) => {
      if (!valid) {
        const errMsg = errors.map((error) => error.message);
        this.setData({
          error: errMsg.join(";"),
        });
        return;
      }
      wx.showLoading({
        title: "正在提交",
        mask: true,
      });
      const illustration = this.data.illustration.map((item) => item.url);
      await Rating.createRating(
        this.data.order.id,
        this.data.formData.score,
        this.data.formData.content,
        illustration
      );
      wx.hideLoading();

      this.getOpenerEventChannel().emit('rating')
      await wx.showModal({
        title: "提示",
        content: "评价成功，点击确定返回订单详情",
        showCancel: false,
      });
      wx.navigateBack();
    });
  },

  handleRating(event) {
    const score = getEventParams(event, "rating");
    this.setData({
      ["formData.score"]: score,
    });
  },

  handleInputChange(event) {
    const value = getEventParams(event, "value");
    this.setData({
      ["formData.content"]: value,
    });
  },

  handleUploadSuccess(event) {
    this.data.illustration = getEventParams(event, "files");
  },

  handleUploadDelete(event) {
    const deleteIndex = this.data.illustration.findIndex(
      (item) => item.key === event.detail.item.key
    );
    this.data.illustration.splice(deleteIndex, 1);
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
