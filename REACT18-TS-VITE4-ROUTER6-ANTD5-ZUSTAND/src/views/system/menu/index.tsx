import api from '@/api'
import { Menu } from '@/types/api'
import { IAction } from '@/types/modal'
import { formatDate } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import CreateMenu from './CreateMenu'

export default function MenuList() {
  const [form] = Form.useForm()
  const [data, setData] = useState<Menu.MenuItem[]>([])

  const menuRef = useRef<{
    open: (type: IAction, data?: Menu.EditParams | { parentId?: string; orderBy?: number }) => void
  }>()

  useEffect(() => {
    getMenuList()
  }, [])
  // 获取菜单列表
  const getMenuList = async () => {
    const data = await api.getMenuList(form.getFieldsValue())
    setData(data)
  }
  // 重置
  const handleReset = () => {
    form.resetFields()
    getMenuList()
  }
  // 创建菜单
  const handleCreate = () => {
    menuRef.current?.open('create', { orderBy: data.length })
  }

  const handleSubCreate = (record: Menu.MenuItem) => {
    menuRef.current?.open('create', { parentId: record._id, orderBy: record.children?.length })
  }
  // 编辑菜单
  const handleEdit = (record: Menu.MenuItem) => {
    menuRef.current?.open('edit', record)
  }

  // 删除菜单
  const handleDelete = (record: Menu.MenuItem) => {
    const text = {
      1: '菜单',
      2: '按钮',
      3: '页面'
    }[record.menuType]
    Modal.confirm({
      title: '确认',
      content: `确认删除该${text}吗?`,
      onOk() {
        handleDelSubmit(record._id)
      }
    })
  }

  // 删除提交
  const handleDelSubmit = async (_id: string) => {
    await api.deleteMenu({ _id })
    message.success('删除成功')
    getMenuList()
  }

  const columns: ColumnsType<Menu.MenuItem> = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
      align: 'center'
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center'
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      align: 'center',
      render(menuType: number) {
        return {
          1: '菜单',
          2: '按钮',
          3: '页面'
        }[menuType]
      }
    },
    {
      title: '权限标识',
      dataIndex: 'menuCode',
      key: 'menuCode',
      align: 'center'
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      align: 'center'
    },
    {
      title: '组件名称',
      dataIndex: 'component',
      key: 'component',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleSubCreate(record)}>
              新增
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Form className='search-form' layout='inline' form={form} initialValues={{ menuState: 1 }}>
        <Form.Item label='菜单名称' name='menuName'>
          <Input placeholder='菜单名称' />
        </Form.Item>
        <Form.Item label='菜单状态' name='menuState'>
          <Select style={{ width: 100 }}>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={2}>停用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type='primary' className='mr10' onClick={getMenuList}>
            搜索
          </Button>
          <Button type='default' onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>

      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>菜单列表</div>
          <div className='active'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>

        <Table
          style={{ paddingLeft: 15, paddingRight: 15 }}
          bordered
          rowKey='_id'
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
      <CreateMenu mRef={menuRef} update={getMenuList} />
    </div>
  )
}
