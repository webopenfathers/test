import { IDetailProp } from '@/types/modal'
import { Modal } from 'antd'
import { useImperativeHandle, useState } from 'react'
import api from '@/api/orderApi'
import { message } from '@/utils/AntdGlobal'
import { Order } from '@/types/api'

export default function OrderRoute(props: IDetailProp) {
  const [visible, setVisible] = useState(false)
  const [trackAni, setTrackAni] = useState<{
    cancel: () => void
  }>()

  useImperativeHandle(props.mRef, () => ({
    open
  }))

  const open = async (orderId: string) => {
    const detail = await api.getOrderDetail(orderId)
    if (detail.route.length) {
      setVisible(true)

      setTimeout(() => {
        renderMap(detail)
      })
    } else {
      message.info('请先完成打点上报')
    }
  }

  // 渲染地图
  const renderMap = (detail: Order.OrderItem) => {
    // 创建地图
    const map = new window.BMapGL.Map('orderRouteMap')
    map.enableScrollWheelZoom() // 启用滚轮缩放
    map.centerAndZoom(detail.cityName, 17)

    // 画轨迹
    const path = detail.route || []
    const points = []
    for (let i = 0; i < path.length; i++) {
      const { lng, lat } = path[i]
      // 创建点
      const point = new window.BMapGL.Point(lng, lat)
      // 把点push进数组
      points.push(point)
    }

    // 画轨迹
    const polyline = new window.BMapGL.Polyline(points, {
      strokeWeight: '8', // 折线宽度,以像素为单位
      strokeOpacity: 0.8, // 折线透明度，取值范围0-1
      strokeColor: '#ed6c00' // 折线颜色
    })

    setTimeout(() => {
      const trackAni = new window.BMapGLLib.TrackAnimation(map, polyline, {
        overallView: true,
        tilt: 30,
        duration: 20000,
        delay: 300
      })

      trackAni.start()
      // 存储动画对象
      setTrackAni(trackAni)
    }, 1000)
  }

  const handleCancel = () => {
    setVisible(false)
    // 关闭弹框时---取消动画
    trackAni?.cancel()
  }

  return (
    <Modal title='地图打点' width={1100} open={visible} footer={false} onCancel={handleCancel}>
      <div id='orderRouteMap' style={{ height: 500 }}></div>
    </Modal>
  )
}
