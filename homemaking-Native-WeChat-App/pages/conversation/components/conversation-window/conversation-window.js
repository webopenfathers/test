import { storeBindingsBehavior } from "mobx-miniprogram-bindings";

import { timStore } from "../../../../store/tim";
import { getEventParams } from "../../../../utils/utils";
import TIM from "tim-wx-sdk-ws";
import Tim from "../../../../model/tim";
import cache from "../../../../enum/cache";

Component({
  behaviors: [storeBindingsBehavior],
  properties: {
    targetUserId: String,
    service: Object,
  },
  data: {
    text: "",
    screenHeight: 0,
  },
  storeBindings: {
    store: timStore,
    fields: ["messageList", "intoView", "isCompleted"],
    actions: [
      "getMessageList",
      "setTargetUserId",
      "scrollMessageList",
      "pushMessage",
    ],
  },
  lifetimes: {
    async attached() {
      this._setNavigationBarTitle();
      this._setScrollHeight();
      this.setTargetUserId(this.data.targetUserId);
      const currentConversation = await Tim.getInstance().getConversationProfile(
        this.targetUserId
      );
      const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT);

      const newUnreadCount = unreadCount - currentConversation.unreadCount;

      wx.setStorageSync(cache.UNREAD_COUNT, newUnreadCount);

      await this.getMessageList();
      if (this.data.service) {
        const message = Tim.getInstance().createMessage(
          TIM.TYPES.MSG_CUSTOM,
          this.data.service,
          this.data.targetUserId,
          "link"
        );
        console.log("message", message);
        this.pushMessage(message);
      }
    },
  },
  methods: {
    async _setNavigationBarTitle() {
      const res = await Tim.getInstance().getUserProfile(
        this.data.targetUserId
      );
      console.log("昵称", res);

      wx.setNavigationBarTitle({
        title: res[0].nick || "慕慕到家",
      });
    },

    handleSendLink(event) {
      const service = getEventParams(event, "service");
      this.triggerEvent("sendmessage", {
        type: TIM.TYPES.MSG_CUSTOM,
        content: service,
      });
    },

    handleSelect(event) {
      const service = getEventParams(event, "service");
      wx.navigateTo({
        url: `/pages/service-detail/service-detail?service_id=${service.id}`,
      });
    },

    async handleSendImage() {
      const chooseImage = await wx.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
      });

      this.triggerEvent("sendmessage", {
        type: TIM.TYPES.MSG_IMAGE,
        content: chooseImage,
      });
    },

    handleInput(event) {
      this.data.text = getEventParams(event, "value");
    },

    handleSend() {
      const text = this.data.text.trim();
      if (text === "") {
        return;
      }
      this.triggerEvent("sendmessage", {
        type: TIM.TYPES.MSG_TEXT,
        content: text,
      });
      this.setData({
        text: "",
      });
    },

    async handleScrolltoupper() {
      if (this.data.isCompleted) {
        return;
      }
      wx.showLoading({
        title: "正在加载...",
        mask: true,
      });
      await this.scrollMessageList();
      setTimeout(() => {
        wx.hideLoading();
      }, 1000);
    },

    /**
     * @returns {void}
     */
    async _setScrollHeight() {
      const systemInfo = await wx.getSystemInfo();
      const scrollHeight =
        systemInfo.windowHeight -
        (systemInfo.screenHeight - systemInfo.safeArea.bottom) -
        95;
      this.setData({
        scrollHeight,
      });
    },
  },
});
