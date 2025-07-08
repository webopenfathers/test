import { Descriptions, Card, Button } from 'antd'
import type { DescriptionsProps } from 'antd'
import styles from './index.module.less'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { formatMoney, formatNum, formatState } from '@/utils'
import api from '@/api'
import { Dashboard } from '@/types/api'
import { useCharts } from '@/hook/useCharts'

export default function DashBoard() {
  const userInfo = useStore(state => state.userInfo)
  const [report, setReport] = useState<Dashboard.ReportData>()
  // 初始化折线图
  const [lineRef, lineChart] = useCharts()
  // 初始化饼图
  const [pieRef1, pieChart1] = useCharts()
  const [pieRef2, pieChart2] = useCharts()
  // 初始化雷达图
  const [radarRef, radarChart] = useCharts()
  useEffect(() => {
    renderLineChart()
    // 饼图
    renderPieChart1()
    // ------------------
    renderPieChart2()

    // 雷达图
    renderRadarChart()
  }, [lineChart, pieChart1, pieChart2, radarChart])

  const items: DescriptionsProps['items'] = [
    {
      label: '用户ID',
      children: userInfo.userId
    },
    {
      label: '邮箱',
      children: userInfo.userEmail
    },
    {
      label: '状态',
      children: formatState(userInfo.state)
    },
    {
      label: '手机号',
      children: userInfo.mobile
    },
    {
      label: '岗位',
      children: userInfo.job
    },
    {
      label: '部门',
      children: userInfo.deptName
    }
  ]

  // 加载折线图数据
  const renderLineChart = async () => {
    if (!lineChart) return
    const data = await api.getLineData()
    lineChart?.setOption({
      // title: {
      //   text: '订单和流水走势图'
      // },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '4%',
        right: '2%',
        bottom: '10%'
      },
      legend: {
        data: ['订单', '流水']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.label
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单',
          type: 'line',
          data: data.order
        },
        {
          name: '流水',
          type: 'line',
          data: data.money
        }
      ]
    })
  }

  // 加载饼图1
  const renderPieChart1 = async () => {
    if (!pieChart1) return
    const data = await api.getPieCityData()
    pieChart1?.setOption({
      title: {
        text: '司机城市分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '城市分布',
          type: 'pie',
          radius: '50%',
          data
        }
      ]
    })
  }

  // 加载饼图2
  const renderPieChart2 = async () => {
    if (!pieChart2) return
    const data = await api.getPieAgeData()
    pieChart2?.setOption({
      title: {
        text: '司机年龄分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: [50, 180],
          roseType: 'area',
          data
        }
      ]
    })
  }

  // 加载雷达图
  const renderRadarChart = async () => {
    if (!radarChart) return
    const data = await api.getRadarData()
    radarChart?.setOption({
      // title: {
      //   text: '司机模型诊断'
      // }
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['司机模型诊断']
      },
      radar: {
        // shape: 'circle',
        indicator: data.indicator
      },
      series: [
        {
          tooltip: {
            trigger: 'item'
          },
          name: '模型诊断',
          type: 'radar',
          data: data.data
        }
      ]
    })
  }

  // 刷新饼图
  const handleRefresh = () => {
    renderPieChart1()
    renderPieChart2()
  }

  useEffect(() => {
    getReportData()
  }, [])

  const getReportData = async () => {
    const data = await api.getReportData()
    setReport(data)
  }

  return (
    <div className={styles.dashboard}>
      {/* 用户信息 */}
      <div className={styles.userInfo}>
        {/* 头像 */}
        <img src={userInfo.userImg} className={styles.userImg} />
        {/* 个人资料 */}
        <Descriptions title='欢迎新同学每天都要开心！' items={items} />
      </div>
      {/* 卡片 */}
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>司机数量</div>
          <div className={styles.data}>{formatNum(report?.driverCount)}个</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总流水</div>
          <div className={styles.data}>{formatMoney(report?.totalMoney)}元</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总订单</div>
          <div className={styles.data}>{formatNum(report?.orderCount)}单</div>
        </div>
        <div className={styles.card}>
          <div className='title'>开通城市</div>
          <div className={styles.data}>{formatNum(report?.cityNum)}座</div>
        </div>
      </div>
      {/* echarts */}
      <div className={styles.chart}>
        <Card
          title='订单和流水走势图'
          extra={
            <Button type='primary' onClick={renderLineChart}>
              刷新
            </Button>
          }
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='司机分布'
          extra={
            <Button type='primary' onClick={handleRefresh}>
              刷新
            </Button>
          }
        >
          <div className={styles.pieChart}>
            <div ref={pieRef1} className={styles.itemPie}></div>
            <div ref={pieRef2} className={styles.itemPie}></div>
          </div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='模型诊断'
          extra={
            <Button type='primary' onClick={renderRadarChart}>
              刷新
            </Button>
          }
        >
          <div ref={radarRef} className={styles.itemChart}></div>
        </Card>
      </div>
    </div>
  )
}
