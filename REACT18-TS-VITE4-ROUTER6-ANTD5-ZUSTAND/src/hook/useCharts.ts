import * as echarts from 'echarts'
import { useEffect, useRef, useState, RefObject } from 'react'

export const useCharts = (): [RefObject<HTMLDivElement>, echarts.EChartsType | undefined] => {
  const chartRef = useRef(null)
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType>()
  useEffect(() => {
    const chart = echarts.init(chartRef.current)
    setChartInstance(chart)
  }, [])

  return [chartRef, chartInstance]
}
