import { Order, ResultData } from '@/types/api'
import request from '@/utils/request'

export default {
  // 获取订单列表
  getOrderList(params: Order.Params) {
    return request.get<ResultData<Order.OrderItem>>('/order/list', params)
  },

  // 获取城市列表
  getCityList() {
    return request.get<Order.DictItem[]>('/order/cityList')
  },

  // 获取车型列表
  getVehicleList() {
    return request.get<Order.DictItem[]>('/order/vehicleList')
  },

  // 创建订单
  CreateOrder(params: Order.CreateParams) {
    return request.post('/order/create', params)
  },

  // 获取订单详情
  getOrderDetail(orderId: string) {
    return request.get<Order.OrderItem>(`/order/detail/${orderId}`)
  },

  // 更新订单信息
  updateOrderInfo(params: Order.OrderRoute) {
    return request.post('/order/edit', params)
  },

  // 删除订单
  delOrder(orderId: string) {
    return request.post('/order/delete', { _id: orderId })
  },

  exportData(params: Order.SearchParams, fileName: string) {
    return request.downloadFile('/order/orderExport', params, fileName)
  },

  // 获取城市聚合数据
  getCityData(cityId: number) {
    return request.get<Array<{ lng: string; lat: string }>>(`/order/cluster/${cityId}`)
  },

  // 获取司机列表
  getDriverList(params: Order.DriverParams) {
    return request.get<ResultData<Order.DriverItem>>('/order/driver/list', params)
  }
}
