import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { showLoading, hideLoading } from './loading'
import storage from './storage'
import env from '@/config'
import { Result } from '@/types/api'
import { message } from './AntdGlobal'

// 创建实例
const instance = axios.create({
  timeout: 8000,
  timeoutErrorMessage: '请求超时,请稍后再试',
  withCredentials: true,
  // 慕课网 icode
  headers: {
    icode: '44DD6C0746CB66FE'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 显示loading
    if (config.showLoading) showLoading()
    const token = storage.get('token')
    if (token) {
      // 写 Bearer 原因 通过jwt认证固定格式 必须写bearer
      config.headers.Authorization = 'Bearer ' + token
    }

    // 方法一；根据设置的环境变量process.env --判断mock是否开启
    // 方法二：依据 src/config 根据域名来判断什么环境判断mock是否开启---推荐
    if (env.mock) {
      // 开启使用mock地址
      config.baseURL = env.mockApi
    } else {
      // 不使用mock使用真实接口
      config.baseURL = env.baseApi
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    const data: Result = response.data
    // 隐藏loading
    hideLoading()
    if (response.config.responseType === 'blob') return response
    // 登录失效
    if (data.code === 500001) {
      message.error(data.msg)
      storage.remove('token')
      location.href = '/login?callback=' + encodeURIComponent(location.href)
    } else if (data.code != 0) {
      if (!response.config.showError) {
        return Promise.resolve(data)
      } else {
        // 响应失败
        message.error(data.msg)
        return Promise.reject(data)
      }
    }

    return data.data
  },
  (error: AxiosError) => {
    // 隐藏loading
    hideLoading()
    message.error(error.message)
    return Promise.reject(error.message)
  }
)

interface IConfig extends AxiosRequestConfig {
  showLoading?: boolean
  showError?: boolean
}

export default {
  get<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.get(url, { params, ...options })
  },

  post<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.post(url, params, options)
  },

  // 二进制文件流blob下载封装
  downloadFile(url: string, data: any, fileName = 'fileName.xlsx') {
    instance({
      url,
      data,
      method: 'post',
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data], {
        type: response.data.type
      })
      const name = response.headers['file-name'] || fileName // 文件名称一般从响应头或者自己传
      const link = document.createElement('a') // 创建a标签
      link.download = decodeURIComponent(name) // 文件名
      link.href = URL.createObjectURL(blob) // 将blob对象转成url链接
      document.body.append(link) // 追加到body
      link.click() // 模拟点击下载
      document.body.removeChild(link) // 移除a标签
      window.URL.revokeObjectURL(link.href) // 释放blob对象
    })
  }
}
