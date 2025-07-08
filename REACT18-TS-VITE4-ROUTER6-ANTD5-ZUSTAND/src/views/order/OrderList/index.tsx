import api from '@/api/orderApi'
import { Button, Table, Form, Input, Select, Space, Modal } from 'antd'
import { useAntdTable } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { Order } from '@/types/api'
import { useRef } from 'react'
import CreateOrder from './components/CreateOrderNew'
import OrderDetail from './components/OrderDetail'
import OrderMarker from './components/OrderMarker'
import { formatDate, formatMoney } from '@/utils'
import OrderRoute from './components/OrderRoute'
import { message } from '@/utils/AntdGlobal'

export default function OrderList() {
  const [form] = Form.useForm()

  const orderRef = useRef<{
    open: () => void
  }>()

  const detailRef = useRef<{
    open: (orderId: string) => void
  }>()

  const markerRef = useRef<{
    open: (orderId: string) => void
  }>()

  const routeRef = useRef<{
    open: (orderId: string) => void
  }>()

  // formData是表单参数
  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Order.SearchParams) => {
    return api
      .getOrderList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => ({
        total: data.page.total,
        list: data.list
      }))
  }

  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultParams: [{ current: 1, pageSize: 10 }, { state: 1 }] // 初始化参数值
  })

  const columns: ColumnsType<Order.OrderItem> = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
      align: 'center',
      key: 'orderId'
    },
    {
      title: '城市名称',
      dataIndex: 'cityName',
      align: 'center',
      key: 'cityName'
    },
    {
      title: '下单地址',
      dataIndex: 'startAddress',
      align: 'center',
      key: 'startAddress',
      render(_, record) {
        return (
          <div>
            <p>开始地址：{record.startAddress}</p>
            <p>结束地址：{record.endAddress}</p>
          </div>
        )
      }
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: '订单价格',
      dataIndex: 'orderAmount',
      align: 'center',
      key: 'orderAmount',
      render(orderAmount) {
        return formatMoney(orderAmount)
      }
    },
    {
      title: '订单状态',
      dataIndex: 'state',
      align: 'center',
      key: 'state',
      render(state: number) {
        return { 1: '进行中', 2: '已完成', 3: '超时', 4: '取消' }[state]
      }
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      align: 'center',
      key: 'userName'
    },
    {
      title: '司机名称',
      dataIndex: 'driverName',
      align: 'center',
      key: 'driverName'
    },
    {
      title: '操作',
      align: 'center',
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleDetail(record.orderId)}>
              详情
            </Button>
            <Button type='text' onClick={() => handleMarker(record.orderId)}>
              打点
            </Button>
            <Button type='text' onClick={() => handleRoute(record.orderId)}>
              轨迹
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record._id)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]

  // 创建订单
  const handleCreate = () => {
    orderRef.current?.open()
  }

  // 订单详情
  const handleDetail = (orderId: string) => {
    detailRef.current?.open(orderId)
  }

  // 打点-打开弹框并传递参数
  const handleMarker = (orderId: string) => {
    markerRef.current?.open(orderId)
  }

  // 行驶轨迹
  const handleRoute = (orderId: string) => {
    routeRef.current?.open(orderId)
  }

  // 删除确认
  const handleDelete = (_id: string) => {
    Modal.confirm({
      title: '确认',
      content: <span>确认删除订单吗?</span>,
      onOk: async () => {
        await api.delOrder(_id)
        message.success('删除成功')
        search.submit()
      }
    })
  }

  // 文件导出
  const handleExport = () => {
    api.exportData(form.getFieldsValue(), '订单列表.xlsx')
  }

  return (
    <div className='OrderList'>
      <Form className='search-form' form={form} layout='inline'>
        <Form.Item name='orderId' label='订单ID'>
          <Input placeholder='请输入订单ID' />
        </Form.Item>
        <Form.Item name='userName' label='用户名称'>
          <Input placeholder='请输入用户名称' />
        </Form.Item>
        <Form.Item name='state' label='订单状态状态'>
          <Select style={{ width: 120 }}>
            <Select.Option value={1}>进行中</Select.Option>
            <Select.Option value={2}>已完成</Select.Option>
            <Select.Option value={3}>超时</Select.Option>
            <Select.Option value={4}>取消</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={search.submit}>
              搜索
            </Button>
            <Button type='default' onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>用户列表</div>
          <div className='action'>
            {/* 权限按钮 */}
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
            <Button type='primary' onClick={handleExport}>
              导出
            </Button>
          </div>
        </div>
        <Table style={{ paddingLeft: 15, paddingRight: 15 }} rowKey='_id' columns={columns} {...tableProps} />
      </div>
      {/* 创建订单组件 */}
      <CreateOrder mRef={orderRef} update={search.submit} />
      {/* 订单详情 */}
      <OrderDetail mRef={detailRef} />
      {/* 地图打点 */}
      <OrderMarker mRef={markerRef} />
      {/* 行驶轨迹 */}
      <OrderRoute mRef={routeRef} />
    </div>
  )
}
