import { useStore } from '@/store'
import { Menu } from 'antd'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import styles from './index.module.less'
import type { MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { Menu as IMenu } from '@/types/api'
import * as Icons from '@ant-design/icons'

const SideMenu = () => {
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const navigate = useNavigate()
  const { collapsed, isDark } = useStore(state => ({ collapsed: state.collapsed, isDark: state.isDark }))
  const data: any = useRouteLoaderData('layout')
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const { pathname } = useLocation()
  type MenuItem = Required<MenuProps>['items'][number]

  // 生成每一个菜单项
  function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children
    } as MenuItem
  }

  function createIcon(name?: string) {
    if (!name) return <></>
    const customerIcons: { [key: string]: any } = Icons
    const icon = customerIcons[name]
    if (!icon) return <></>
    return React.createElement(icon)
  }

  // 递归生成菜单
  const getTreeMenu = (menuList: IMenu.MenuItem[], treeList: MenuItem[] = []) => {
    menuList.forEach((item, index) => {
      if (item.menuType === 1 && item.menuState === 1) {
        // 有buttons的话就不需要遍历同级的children
        if (item.buttons) return treeList.push(getItem(item.menuName, item.path || index, createIcon(item.icon)))

        treeList.push(
          getItem(item.menuName, item.path || index, createIcon(item.icon), getTreeMenu(item.children || []))
        )
      }
    })
    return treeList
  }

  // 初始化，获取接口菜单列表数据
  useEffect(() => {
    const treeMenuList = getTreeMenu(data.menuList)
    setMenuList(treeMenuList)
    setSelectedKeys([pathname])
  }, [pathname])

  // logo点击
  const handleClickLogo = () => {
    navigate('/welcome')
  }

  // 菜单点击
  const handleClickMenu = ({ key }: { key: string }) => {
    setSelectedKeys([key])
    navigate(key)
  }
  return (
    <div className={styles.navSide}>
      <div className={styles.logo} onClick={handleClickLogo}>
        <img src='/imgs/logo.png' alt='' className={styles.img} />
        {collapsed ? '' : <span>慕慕货运</span>}
      </div>
      <Menu
        mode='inline'
        theme={isDark ? 'light' : 'dark'}
        style={{
          width: collapsed ? 80 : 'auto',
          height: 'calc(100vh - 50px)'
        }}
        selectedKeys={selectedKeys}
        onClick={handleClickMenu}
        items={menuList}
      />
    </div>
  )
}

export default SideMenu
