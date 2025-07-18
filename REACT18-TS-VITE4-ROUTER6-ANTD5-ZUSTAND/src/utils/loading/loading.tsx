import { Spin } from 'antd'
import './loading.less'

export default function loading({ tip = 'Loading' }: { tip?: string }) {
  return (
    <Spin tip={tip} size='large' className='request-loading'>
      loading
    </Spin>
  )
}
