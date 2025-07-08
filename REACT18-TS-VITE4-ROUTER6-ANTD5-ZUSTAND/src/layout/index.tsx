import React, { useEffect } from 'react'
import { Layout, Watermark } from 'antd'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import SideMenu from '@/components/Menu'
import { Navigate, Outlet, useLocation, useRouteLoaderData } from 'react-router-dom'
import styles from './index.module.less'
import api from '@/api'
import { useStore } from '@/store'
import { IAuthLoader } from '@/router/AuthLoader'
import { searchRoute } from '@/utils'
import { router } from '@/router'
import TabsFC from '@/components/Tabs'

const { Sider } = Layout

const App: React.FC = () => {
  const { updateUserInfo, userInfo, collapsed } = useStore()

  const { pathname } = useLocation()

  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    const data = await api.getUserInfo()
    updateUserInfo(data)
  }

  const data = useRouteLoaderData('layout') as IAuthLoader
  // 递归找出---某路由既不需要menuPathList又不需要staticPath中也可以直接访问的页面。依据meta.auth
  const route = searchRoute(pathname, router)
  if (route && route.meta?.auth === false) {
    // 继续执行
  } else {
    // 权限判断
    // 某些静态页面用户可以访问的
    const staticPath = ['/welcome', '/403', '/404']
    // 不在menuPathList和staticPath里面跳403
    if (!data.menuPathList.includes(pathname) && !staticPath.includes(pathname)) {
      return <Navigate to='/403' />
    }
  }

  return (
    // 水印使用包裹layout即可
    <Watermark content={'React'}>
      {userInfo._id ? (
        <Layout>
          <Sider collapsed={collapsed}>
            <SideMenu />
          </Sider>
          <Layout>
            <NavHeader />
            <TabsFC />
            <div className={styles.content}>
              <div className={styles.wrapper}>
                {/* 加载不同组件---类似于 router-view */}
                <Outlet />
              </div>
              <NavFooter />
            </div>
          </Layout>
        </Layout>
      ) : null}
    </Watermark>
  )
}

export default App
