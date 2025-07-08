import api from '@/api/roleApi'
import { Role } from '@/types/api'
import { IAction } from '@/types/modal'
import { formatDate } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import { useAntdTable } from 'ahooks'
import { Button, Form, Input, Modal, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useRef } from 'react'
import CreateRole from './CreateRole'
import SetPermission from './SetPermission'

export default function RoleList() {
  const [form] = Form.useForm()
  const roleRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()
  const permissionRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()
  // formData是表单参数
  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Role.Params) => {
    return api
      .getRoleList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => ({
        total: data.page.total,
        list: data.list
      }))
  }

  const { tableProps, search } = useAntdTable(getTableData, { form })

  const columns: ColumnsType<Role.RoleItem> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
      key: 'roleName'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      key: 'updateTime',
      render(updateTime: string) {
        return formatDate(updateTime)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作列',
      align: 'center',
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type='text' onClick={() => handleSetPermission(record)}>
              设置权限
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record._id)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]

  // 创建角色
  const handleCreate = () => {
    roleRef.current?.open('create')
  }

  // 编辑角色
  const handleEdit = (data: Role.RoleItem) => {
    roleRef.current?.open('edit', data)
  }

  // 删除确认
  const handleDelete = (_id: string) => {
    Modal.confirm({
      title: '确认',
      content: '确认删除该角色吗？',
      async onOk() {
        await api.delRole({ _id })
        message.success('删除成功')
        // 删除成功刷新页面
        search.submit()
      }
    })
  }

  // 设置权限
  const handleSetPermission = (record: Role.RoleItem) => {
    permissionRef.current?.open('edit', record)
  }

  return (
    <div className='role-wrap'>
      <Form form={form} className='search-form' layout='inline'>
        <Form.Item name='roleName' label='角色名称'>
          <Input placeholder='请输入角色名称' />
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
          <div className='title'>角色列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table style={{ paddingLeft: 15, paddingRight: 15 }} rowKey='_id' columns={columns} {...tableProps} />
      </div>
      {/* 创建角色组件弹框 */}
      <CreateRole mRef={roleRef} update={search.submit} />
      {/* 设置权限 */}
      <SetPermission mRef={permissionRef} update={search.submit} />
    </div>
  )
}
