import APIConfig from "../config/api";
import exceptionMessage from "../config/exception-message";
import cache from "../enum/cache";
import User from "../model/user";
import wxToPromise from "./wx";
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { timStore } from "../store/tim";

class Http {
  // 设置静态方法，调用时不需要实例化
  // url:imooc.com
  //  /token
  static async request({ url, data, method = "GET", refetch = true }) {
    let res;
    try {
      res = await wxToPromise("request", {
        url: APIConfig.baseURL + url,
        data,
        method,
        header: {
          token: wx.getStorageSync(cache.TOKEN),
        },
      });
    } catch (e) {
      Http._showError(-1);
      throw new Error(e.errMsg);
    }

    // 全局统一响应，异常处理
    // 请求成功
    if (res.statusCode < 400) {
      return res.data.data;
    }

    // 请求失败
    if (res.statusCode === 401) {
      this.storeBindings = createStoreBindings(this, {
        store: timStore,
        fields: ["sdkReady"],
        actions: { timLogout: "logout" },
      });
      //令牌相关操作
      if (res.data.error_code === 10001) {
        if (this.sdkReady) {
          this.timLogout();
        }
        wx.navigateTo({
          url: "/pages/login/login",
        });
        // 跳转以后需要中断当前页面的业务逻辑，抛出异常
        throw Error("请求未携带令牌");
      }

      if (refetch) {
        return await Http._refetch({ url, data, method, refetch });
      }
      if (this.sdkReady) {
        this.timLogout();
      }
    }

    Http._showError(res.data.error_code, res.data.message);

    // 抛出异常
    const error = Http._generateMessage(res.data.message);
    throw Error(error);
  }

  // 令牌过期刷新令牌
  static async _refetch(data) {
    await User.login();
    data.refetch = false;
    return await Http.request(data);
  }

  static _showError(errorCode, message) {
    let title = "";
    const errorMessage = exceptionMessage[errorCode];
    title = errorMessage || message || "未知异常";

    title = Http._generateMessage(title);
    wx.showToast({
      title,
      icon: "none",
      duration: 3000,
    });
  }

  static _generateMessage(message) {
    return typeof message === "object"
      ? Object.values(message).join(";")
      : message;
  }
}

export default Http;
