import { Select } from 'antd'
import { useEffect, useState } from 'react'
import api from '@/api/orderApi'

export default function OrderCluster() {
  const [cityId, setCityId] = useState(10001)
  useEffect(() => {
    getCityData()
  }, [cityId])

  const getCityData = async () => {
    const data = await api.getCityData(cityId)
    setTimeout(() => {
      renderMap(data)
    })
  }

  const renderMap = (data: Array<{ lng: string; lat: string }>) => {
    const map = new window.BMapGL.Map('clusterMap')
    map.enableScrollWheelZoom() // 滚轮缩放
    const zoomCtrl = new window.BMapGL.ZoomControl()
    map.addControl(zoomCtrl)
    const cityNames: { [k: number]: string } = {
      10001: '长沙',
      20001: '武汉',
      30001: '杭州',
      40001: '惠州',
      50001: '昆明'
    }
    map.centerAndZoom(cityNames[cityId], 12)

    const markers = []
    for (let i = 0; i < data.length; i++) {
      const { lng, lat } = data[i]
      // 创建坐标点
      const point = new window.BMapGL.Point(lng, lat)
      // 创建marker
      const marker = new window.BMapGL.Marker(point)
      // push进数组
      markers.push(marker)
    }

    // 生成聚合图
    if (markers.length) {
      new window.BMapLib.MarkerClusterer(map, { markers })
    }
  }

  const handleChange = (val: number) => {
    setCityId(val)
  }

  return (
    <div style={{ backgroundColor: '#fff', padding: 10 }}>
      <Select style={{ width: 100, marginBottom: 10 }} value={cityId} onChange={handleChange}>
        <Select.Option value={10001}>长沙</Select.Option>
        <Select.Option value={20001}>武汉</Select.Option>
        <Select.Option value={30001}>杭州</Select.Option>
        <Select.Option value={40001}>惠州</Select.Option>
        <Select.Option value={50001}>昆明</Select.Option>
      </Select>
      <div id='clusterMap' style={{ height: 'calc(100vh - 275px)' }}></div>
    </div>
  )
}
