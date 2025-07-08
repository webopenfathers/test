import { IDetailProp } from '@/types/modal'
import { Modal } from 'antd'
import { useImperativeHandle, useState } from 'react'
import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { message } from '@/utils/AntdGlobal'

export default function OrderMarker(props: IDetailProp) {
  const [visible, setVisible] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [markers, setMarkers] = useState<{ lng: string; lat: string; id: number }[]>([])

  useImperativeHandle(props.mRef, () => ({
    open
  }))

  // 弹框
  const open = async (orderId: string) => {
    setOrderId(orderId)
    setVisible(true)
    const detail = await api.getOrderDetail(orderId)
    renderMap(detail)
  }

  // 渲染地图
  const renderMap = (detail: Order.OrderItem) => {
    // 创建地图
    const map = new window.BMapGL.Map('markerMap')
    // 设置地图中心点和缩放等级
    map.centerAndZoom(detail.cityName, 12)
    // 添加比例尺
    const scaleCtrl = new window.BMapGL.ScaleControl() // 添加比例尺控件
    map.addControl(scaleCtrl)
    const zoomCtrl = new window.BMapGL.ZoomControl() // 添加缩放控件
    map.addControl(zoomCtrl)
    map.enableScrollWheelZoom() // 启用滚轮缩放

    // 渲染打点--循环创建
    detail.route?.map(item => {
      createMarker(map, item.lng, item.lat)
    })

    // 地图绑定事件
    map.addEventListener('click', (e: any) => {
      console.log(e)
      // lng:经度  lat:纬度
      createMarker(map, e.latlng.lng, e.latlng.lat)
    })
  }

  // 创建marker--打点  lng:经度  lat:纬度
  const createMarker = (map: any, lng: string, lat: string) => {
    const id = Math.random()
    // 创建点
    const point = new window.BMapGL.Point(lng, lat)
    // 依据点 ===> 创建marker
    const marker = new window.BMapGL.Marker(point)
    // 记录添加的marker
    markers.push({ lng, lat, id })
    marker.id = id
    // 删除marker
    const markerMenu = new window.BMapGL.ContextMenu()
    // 右键菜单
    markerMenu.addItem(
      new window.BMapGL.MenuItem('删除', () => {
        map.removeOverlay(marker)
        // 找到删除的marker
        const index = markers.findIndex(item => item.id === marker.id)
        markers.splice(index, 1)
        // 删除---重新设置marker
        setMarkers([...markers])
      })
    )

    // 创建---重新设置marker
    setMarkers([...markers])
    marker.addContextMenu(markerMenu)
    // 删除marker

    // 添加marker
    map.addOverlay(marker)
  }

  // 更新打点
  const handleOk = async () => {
    await api.updateOrderInfo({
      orderId,
      route: markers
    })
    message.success('打点成功')
    handleCancel()
  }

  // 关闭弹框
  const handleCancel = () => {
    setVisible(false)
    // 清空marker
    setMarkers([])
  }

  return (
    <Modal
      title='地图打点'
      width={1100}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div id='markerMap' style={{ height: 500 }}></div>
    </Modal>
  )
}
