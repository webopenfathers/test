import Http from "../utils/http";
import Base from "./base";

class Service extends Base {
  // 继承 子类 ， 父类

  /**
   *
   * @param {分类id} category_id
   * @param {服务类型} type
   */
  async getSrviceList(category_id = null, type = null) {
    if (!this.hasMoreData) {
      return this.data;
    }
    // 发起网络请求，获取数据
    const serviceList = await Http.request({
      url: "v1/service/list",
      data: {
        page: this.page,
        count: this.count,
        category_id: category_id || "",
        type: type || "",
      },
    });
    this.data = this.data.concat(serviceList.data);
    this.hasMoreData = !(this.page === serviceList.last_page);
    this.page++;
    return this.data;
  }

  static getServiceById(serviceId) {
    return Http.request({
      url: `v1/service/${serviceId}`,
    });
  }

  static updateServiceStatus(serviceId, action) {
    return Http.request({
      url: `v1/service/${serviceId}`,
      data: {
        action,
      },
      method: "POST",
    });
  }

  static publishService(formData) {
    return Http.request({
      url: "v1/service",
      data: formData,
      method: "POST",
    });
  }

  static editService(serviceId, formData) {
    return Http.request({
      url: `v1/service/${serviceId}`,
      data: formData,
      method: "PUT",
    });
  }

  // 我的-获取服务状态
  static getServiceStatus(type) {
    return Http.request({
      url: `v1/service/count?type=${type}`,
    });
  }

  // 获取我的服务
  async getMyService(type, status) {
    if (!this.hasMoreData) {
      return;
    }
    const serviceList = await Http.request({
      url: "v1/service/my",
      data: {
        page: this.page,
        count: this.count,
        type:parseInt(type),
        status:parseInt(status),
      },
    });
    this.data = this.data.concat(serviceList.data);
    this.hasMoreData = this.page !== serviceList.last_page;
    this.page++;
    return this.data;
  }
}

export default Service;
