/**
 * 工具函数封装
 */

import { Menu } from '@/types/api'

// 格式化金额
// 例：￥123,456,768.78
export const formatMoney = (num?: number | string) => {
  if (!num) return '0.00'
  const a = parseFloat(num.toString())
  return a.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })
}

// 格式化数字
// 例：123,456,768.78
export const formatNum = (num?: number | string) => {
  if (!num) return 0
  const a = num.toString()
  if (a.indexOf('.') > -1) return a.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  return a.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}

// 格式化日期
export const toLocalDate = (date?: Date, rule?: string) => {
  let curDate = new Date()
  if (date) curDate = date
  if (rule === 'YYYY-MM-DD') return curDate.toLocaleDateString().replaceAll('/', '-')
  if (rule === 'HH:mm:ss') return curDate.toLocaleTimeString().replaceAll('/', '-')
  return curDate.toLocaleString().replaceAll('/', '-')
}

// 格式化日期
export const formatDate = (date?: Date | string, rule?: string) => {
  let curDate = new Date()
  if (date instanceof Date) {
    curDate = date
  } else if (date) {
    curDate = new Date(date)
  }

  let fmt = rule || 'YYYY-MM-DD HH:mm:ss'
  // 处理年
  fmt = fmt.replace(/(Y+)/, curDate.getFullYear().toString())

  type OType = {
    [key: string]: number
  }

  // 处理 月 日 时 分 秒
  const O: OType = {
    'M+': curDate.getMonth() + 1,
    'D+': curDate.getDate(),
    'H+': curDate.getHours(),
    'm+': curDate.getMinutes(),
    's+': curDate.getSeconds()
  }

  for (const k in O) {
    fmt = fmt.replace(new RegExp(`(${k})`), O[k] > 9 ? O[k].toString() : '0' + O[k].toString())
  }

  return fmt
}

// 用户状态转换
export const formatState = (state: number) => {
  if (state === 1) return '在职'
  if (state === 2) return '离职'
  if (state === 3) return '试用期'
}

// 递归获取页面路径
export const getMenuPath = (list: Menu.MenuItem[]): string[] => {
  return list.reduce((result: string[], item: Menu.MenuItem) => {
    return result.concat(Array.isArray(item.children) && !item.buttons ? getMenuPath(item.children) : item.path + '')
  }, [])
}

// 递归获取路由对象
export const searchRoute: any = (path: string, routes: any = []) => {
  for (const item of routes) {
    if (item.path === path) return item
    if (item.children) {
      const result = searchRoute(path, item.children)
      if (result) return result
    }
  }

  return ''
}

/**
 * 手机号加密
 * @example
 * 17611000011 => 176****0011
 */
export const formateMobile = (mobile?: string | number) => {
  if (!mobile) return '-'
  const phone = mobile.toString()
  return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
}

// 递归查找树的路径
export const findTreeNode = (tree: Menu.MenuItem[], pathName: string, path: string[]): string[] => {
  if (!tree) return []
  for (const item of tree) {
    path.push(item.menuName)
    if (item.path === pathName) return path
    if (item.children?.length) {
      const list = findTreeNode(item.children, pathName, path)
      if (list?.length) return list
    }
    path.pop()
  }

  return []
}
