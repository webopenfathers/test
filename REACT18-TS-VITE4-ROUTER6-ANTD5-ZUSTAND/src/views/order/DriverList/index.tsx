import { Order } from '@/types/api'
import { formatDate, formatMoney } from '@/utils'
import { Button, Form, Input, Select, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import api from '@/api/orderApi'

export default function DriverList() {
  const [form] = Form.useForm()
  const [data, setData] = useState<Order.DriverItem[]>([])

  useEffect(() => {
    getDriverList()
  }, [])

  // 获取司机列表
  const getDriverList = async () => {
    const data = await api.getDriverList(form.getFieldsValue())
    setData(data.list)
  }

  const columns: ColumnsType<Order.DriverItem> = [
    {
      title: '司机名称',
      dataIndex: 'driverName',
      key: 'driverName',
      align: 'center',
      fixed: 'left',
      width: 100
    },
    {
      title: '司机信息',
      key: 'driverInfo',
      fixed: 'left',
      align: 'center',
      width: 180,
      render(_, record) {
        return (
          <div>
            <p>
              <span>司机ID：</span>
              <span>{record.driverId}</span>
            </p>
            <p>
              <span>手机号码：</span>
              <span>{record.driverPhone}</span>
            </p>
            <p>
              <span>注册城市：</span>
              <span>{record.cityName}</span>
            </p>
            <p>
              <span>会员等级：</span>
              <span>{record.grade}</span>
            </p>
            <p>
              <span>司机等级：</span>
              <span>{record.driverLevel}</span>
            </p>
          </div>
        )
      }
    },
    {
      title: '司机状态',
      dataIndex: 'accountStatus',
      fixed: 'left',
      key: 'accountStatus',
      align: 'center',
      width: 100,
      render(accountStatus: Order.DriverStatus) {
        return {
          0: '待认证',
          1: '正常',
          2: '暂时拉黑',
          3: '永久拉黑',
          4: '停止推送'
        }[accountStatus]
      }
    },
    {
      title: '车辆信息',
      key: 'vehicleInfo',
      align: 'center',
      width: 260,
      render(_, record) {
        return (
          <div>
            <p>
              <span>车牌号码：</span>
              <span>{record.carNo}</span>
            </p>
            <p>
              <span>车牌品牌：</span>
              <span>{record.vehicleBrand}</span>
            </p>
            <p>
              <span>车牌名称：</span>
              <span>{record.vehicleName}</span>
            </p>
          </div>
        )
      }
    },
    {
      title: '昨日在线时长',
      dataIndex: 'onlineTime',
      align: 'center',
      key: 'onlineTime',
      width: 150
    },
    {
      title: '昨日司机流水',
      dataIndex: 'driverAmount',
      align: 'center',
      key: 'driverAmount',
      width: 120,
      render(driverAmount) {
        return formatMoney(driverAmount)
      }
    },
    {
      title: '司机评分',
      dataIndex: 'rating',
      align: 'center',
      key: 'rating',
      width: 100
    },
    {
      title: '行为分',
      dataIndex: 'driverScore',
      align: 'center',
      key: 'driverScore',
      width: 100
    },
    {
      title: '昨日推单数',
      dataIndex: 'pushOrderCount',
      align: 'center',
      key: 'pushOrderCount',
      width: 120
    },
    {
      title: '昨日完单数',
      dataIndex: 'orderCompleteCount',
      align: 'center',
      key: 'orderCompleteCount',
      width: 120
    },
    {
      title: '加入时间',
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
      width: 200,
      render(createTime) {
        return formatDate(createTime)
      }
    }
  ]

  const handleSearch = () => {
    getDriverList()
  }

  const handleReset = () => {
    form.resetFields()
    handleSearch()
  }

  return (
    <div className='driver-list'>
      <Form className='search-form' layout='inline' form={form}>
        <Form.Item name='driverName' label='司机名称'>
          <Input placeholder='请输入司机名称' />
        </Form.Item>
        <Form.Item name='accountStatus' label='司机状态'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>待认证</Select.Option>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={2}>暂时拉黑</Select.Option>
            <Select.Option value={3}>永久拉黑</Select.Option>
            <Select.Option value={4}>停止推送</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={handleSearch}>
              搜索
            </Button>
            <Button type='default' onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>司机列表</div>
        </div>
        <Table bordered rowKey='id' columns={columns} dataSource={data} pagination={false} scroll={{ x: 2000 }} />
      </div>
    </div>
  )
}
