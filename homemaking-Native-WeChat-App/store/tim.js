import { observable, action } from "mobx-miniprogram";
import Tim from "../model/tim";
import TIM from "tim-wx-sdk-ws";
import User from "../model/user";
import { setTabBarBadge } from "../utils/wx";

export const timStore = observable({
  // 数据字段
  sdkReady: false,
  messageList: [],
  _targetUserId: null,
  intoView: 0,
  isCompleted: false,
  conversationList: [],

  // actions

  login: action(function () {
    this._runListener();
    Tim.getInstance().login();
  }),

  logout: action(function () {
    Tim.getInstance().logout();
  }),

  resetMessage: action(function () {
    this.messageList = []
    this._targetUserId = null
    this.intoView = 0
    this.isCompleted = false
}),

  _runListener() {
    // 获取SDK
    const sdk = Tim.getInstance().getSDK();
    // 监听 已经ready
    sdk.on(TIM.EVENT.SDK_READY, this._handleSDKReady, this);
    // 监听no ready
    sdk.on(TIM.EVENT.SDK_NOT_READY, this._handleSDKNotReady, this);
    // 监听踢出
    sdk.on(TIM.EVENT.KICKED_OUT, this._handleSDKNotReady, this);
    // 事件监听 消息接收
    sdk.on(TIM.EVENT.MESSAGE_RECEIVED, this._handleMessageReceived, this);
    // 监听会话列表更新
    sdk.on(
      TIM.EVENT.CONVERSATION_LIST_UPDATED,
      this._handleConversationListUpdate,
      this
    );
  },

  // 主动的拉取数据
  getMessageList: action(async function () {
    if (!this._targetUserId) {
      throw Error("未指定目标用户 id");
    }
    this.messageList = await Tim.getInstance()
      .reset()
      .getMessageList(this._targetUserId);
    this.intoView = this.messageList.length - 1;
    await Tim.getInstance().setMessageRead(this._targetUserId);
  }),

  async _handleMessageReceived(event) {
    if (!this._targetUserId) {
      return;
    }

    const currentConversationMessage = event.data.filter((item) => {
      return item.from === this._targetUserId;
    });

    if (currentConversationMessage.length) {
      this.messageList = this.messageList.concat(currentConversationMessage);
      this.intoView = this.messageList.length - 1;
      await Tim.getInstance().setMessageRead(this._targetUserId);
    }
  },

  _handleConversationListUpdate(event) {
    if (!event.data.length) {
      return;
    }
    this.conversationList = event.data;
    const unreadCount = event.data.reduce((sum, item) => {
      return sum + item.unreadCount;
    }, 0);

    setTabBarBadge(unreadCount);
  },

  getConversationList: action(async function () {
    this.conversationList = await Tim.getInstance().getConversationList();
  }),

  // 设置目标的userId

  setTargetUserId: action(function (targetUserId) {
    this._targetUserId = targetUserId;
  }),

  // 消息上屏
  pushMessage: action(function (message) {
    this.messageList = this.messageList.concat([message]);
    this.intoView = this.messageList.length - 1;
  }),

  // 获取历史数据
  scrollMessageList: action(async function () {
    const messageList = await Tim.getInstance().getMessageList(
      this._targetUserId
    );
    this.intoView = messageList.length - 2;
    this.isCompleted = Tim.getInstance().isCompleted;
    /**
     * tips
     * 1. MobX 中属性的值是 Array 的时候，他是一个被包装过的 Array，并非原生 Array，它是一个响应式对象
     * 2. 经过包装的 Array 同样具备大多数原生 Array 所具备的方法。
     * 3. 想把响应式的对象数组变成普通数组，可以调用slice()函数遍历所有对象元素生成一个新的普通数组
     */
    this.messageList = messageList.concat(this.messageList.slice());
  }),

  _handleSDKReady() {
    this.sdkReady = true;
    const userInfo = User.getUserInfoByLocal();
    Tim.getInstance().updateUserProfile(userInfo);
  },
  _handleSDKNotReady() {
    this.sdkReady = false;
  },
});
