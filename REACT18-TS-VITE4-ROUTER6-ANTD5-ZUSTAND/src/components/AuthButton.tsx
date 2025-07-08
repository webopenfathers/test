import { IAuthLoader } from '@/router/AuthLoader'
import { Button } from 'antd'
import { useRouteLoaderData } from 'react-router-dom'
import { useStore } from '@/store'

export default function AuthButton(props: any) {
  const data = useRouteLoaderData('layout') as IAuthLoader
  // 判断是否是管理员，如果是也原路返回
  const role = useStore(state => state.userInfo.role)
  // 如果没有auth属性直接原路返回
  if (!props.auth) return <Button {...props}>{props.children}</Button>

  // 如果有auth属性并且在buttonList中，且，为管理员角色直接原路返回
  if (data.buttonList.includes(props.auth) || role == 1) {
    return <Button {...props}>{props.children}</Button>
  }

  // 否则返回空
  return <></>
}
