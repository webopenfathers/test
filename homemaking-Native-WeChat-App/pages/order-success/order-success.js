import orderStatus from "../../enum/order-status"
import roleType from "../../enum/role-type"

// pages/order-success/order-success.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    // 查看订单状态
    handleCheckOrder(){
        wx.navigateTo({
          url: `/pages/my-order/my-order?role=${roleType.CONSUMER}&status=${orderStatus.UNAPPROVED}`,
        })
    },


    // 返回首页
    handleNavToHome(){
        wx.switchTab({
          url: '/pages/home/home',
        })
    },




    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})