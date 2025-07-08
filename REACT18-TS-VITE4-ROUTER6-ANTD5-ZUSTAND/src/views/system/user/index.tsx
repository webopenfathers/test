import api from '@/api'
import { User } from '@/types/api'
import { IAction } from '@/types/modal'
import { formatDate } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import { useAntdTable } from 'ahooks'
import { Button, Table, Form, Input, Select, Space, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef, useState } from 'react'
import CreateUser from './CreateUser'
// 按钮权限组件
import AuthButton from '@/components/AuthButton'
import SearchForm from '@/components/SearchForm'

export default function UserList() {
  const [form] = Form.useForm()
  const [userIds, setUserIds] = useState<number[]>([])
  // 分页-当前页和每页条数
  const userRef = useRef<{
    open: (type: IAction, data?: User.UserItem) => void
  }>()

  // formData是表单参数
  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: User.Params) => {
    return api
      .getUserList({
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

  // 创建用户
  const handleCreate = () => {
    userRef.current?.open('create')
  }

  // 编辑用户
  const handleEdit = (record: User.UserItem) => {
    userRef.current?.open('edit', record)
  }

  // 删除用户
  const handleDel = (userId: number) => {
    Modal.confirm({
      title: '删除确认',
      content: <span>确认删除该用户吗?</span>,
      onOk: () => {
        handleUserDelSubmit([userId])
      }
    })
  }

  // 批量删除确认
  const handlePatchConfirm = () => {
    if (userIds.length === 0) {
      return message.error('请选择要删除的用户')
    }

    Modal.confirm({
      title: '删除确认',
      content: <span>确认删除该批用户吗?</span>,
      onOk: () => {
        handleUserDelSubmit(userIds)
      }
    })
  }

  // 公共删除用户接口
  const handleUserDelSubmit = async (ids: number[]) => {
    try {
      await api.delUser({ userIds: ids })
      message.success('删除成功')
      // 重置表单
      search.reset()
    } catch (error: any) {
      console.log(error)
    } finally {
      setUserIds([])
    }
  }

  const columns: ColumnsType<User.UserItem> = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '用户邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      render(role: number) {
        return {
          0: '超级管理员',
          1: '管理员',
          2: '体验管理员',
          3: '普通用户'
        }[role]
      }
    },
    {
      title: '用户状态',
      dataIndex: 'state',
      key: 'state',
      render(state: number) {
        return {
          1: '在职',
          2: '离职',
          3: '试用期'
        }[state]
      }
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作列',
      key: 'address',
      render(record: User.UserItem) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type='text' danger onClick={() => handleDel(record.userId)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div className='user-list'>
      {/* 封装的search表单 */}
      <SearchForm form={form} initialValues={{ state: 1 }} submit={search.submit} reset={search.reset}>
        <Form.Item name='userId' label='用户ID'>
          <Input placeholder='请输入用户ID' />
        </Form.Item>
        <Form.Item name='userName' label='用户名称'>
          <Input placeholder='请输入用户名称' />
        </Form.Item>
        <Form.Item name='state' label='状态'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>用户列表</div>
          <div className='action'>
            {/* 权限按钮 */}
            <AuthButton auth='user@create' type='primary' onClick={handleCreate}>
              新增
            </AuthButton>
            <Button type='primary' danger onClick={handlePatchConfirm}>
              批量删除
            </Button>
          </div>
        </div>
        <Table
          style={{ paddingLeft: 15, paddingRight: 15 }}
          rowKey='userId'
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: userIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setUserIds(selectedRowKeys as number[])
            }
          }}
          columns={columns}
          {...tableProps}
        />
      </div>
      <CreateUser
        mRef={userRef}
        update={() => {
          search.reset()
        }}
      />
    </div>
  )
}
