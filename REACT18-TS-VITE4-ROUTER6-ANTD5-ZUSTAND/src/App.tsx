import { RouterProvider } from 'react-router-dom'
// 自定义主题颜色
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import Router from './router'
import AntdGlobal from './utils/AntdGlobal'
import './App.less'
import './styles/theme.less'
import { useStore } from './store'

function App() {
  const isDark = useStore(state => state.isDark)
  // 组件路由
  // return (
  //   <BrowserRouter>
  //     <Router></Router>
  //   </BrowserRouter>
  // )

  // API路由---推荐
  // ConfigProvider 自定义主题颜色
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ed6c00'
        },
        // 预值算法---主题切换
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <AntdApp>
        <AntdGlobal />
        <RouterProvider router={Router} />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
