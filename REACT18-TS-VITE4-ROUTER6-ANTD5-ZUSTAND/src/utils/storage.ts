/**
 * localStorage模块封装
 */

export default {
  /**
   * storage存储
   * @param key string 参数名称
   * @param value any 写入的值
   */
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  /**
   * storage读取
   * @param key string 参数名称
   * @returns storage 值
   */
  get(key: string) {
    const value = localStorage.getItem(key)
    if (!value) return ''

    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  },
  // 删除localStorage值
  remove(key: string) {
    localStorage.removeItem(key)
  },
  // 清空所有
  clear() {
    localStorage.clear()
  }
}
