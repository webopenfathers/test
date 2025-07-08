import api from '@/api'
import { Menu } from '@/types/api'
import { getMenuPath } from '@/utils'

export interface IAuthLoader {
  buttonList: string[]
  menuList: Menu.MenuItem[]
  menuPathList: string[]
}

export default async function AuthLoader() {
  const data = await api.getPermissionList()
  const menuPathList = getMenuPath(data.menuList)
  // 返回值
  return {
    buttonList: data.buttonList,
    menuList: data.menuList,
    menuPathList
  }
}
