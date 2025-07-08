import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Switch, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import styles from './index.module.less'
import { useStore } from '@/store'
import storage from '@/utils/storage'
import BreadCrumb from './BreadCrumb'
import { useEffect } from 'react'

const NavHeader = () => {
  const { userInfo, collapsed, isDark, updateCollapsed, updateTheme } = useStore()

  useEffect(() => {
    handleSwitch(isDark)
  }, [])

  const items: MenuProps['items'] = [
    {
      key: 'email',
      label: '邮箱:' + userInfo.userEmail
    },
    {
      key: 'logout',
      label: '退出'
    }
  ]

  // 控制菜单图标关闭和展开
  const toggleCollapsed = () => {
    updateCollapsed()
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    // 退出时要拼接url地址
    if (key === 'logout') {
      storage.remove('token')
      location.href = '/login?callback=' + encodeURIComponent(location.href)
    }
  }

  // 主题切换
  const handleSwitch = (isDark: boolean) => {
    if (isDark) {
      // 深色:给html根元素添加dark类名
      document.documentElement.dataset.theme = 'dark' // 没有只是设置深色调
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.dataset.theme = 'light' // 没有只是设置深色调
      document.documentElement.classList.remove('dark')
    }
    storage.set('isDark', isDark)
    updateTheme(isDark)
  }

  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <div onClick={toggleCollapsed}> {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
        <BreadCrumb />
      </div>
      <div className='right'>
        <Switch
          checked={isDark}
          checkedChildren='暗黑'
          unCheckedChildren='默认'
          style={{ marginRight: 10 }}
          onChange={handleSwitch}
        />
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <span className={styles.nickName}>{userInfo.userName}</span>
        </Dropdown>
      </div>
    </div>
  )
}

export default NavHeader
