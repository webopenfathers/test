import storage from '@/utils/storage'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Select, TreeSelect } from 'antd'
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'
import Upload from 'antd/es/upload/Upload'
import { useEffect, useImperativeHandle, useState } from 'react'
import { message } from '@/utils/AntdGlobal'
import { IAction, IModalProp } from '@/types/modal'
import api from '@/api'
import roleApi from '@/api/roleApi'
import { Dept, Role, User } from '@/types/api'

export default function CreateUser(props: IModalProp) {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(false)
  const [deptList, setDeptList] = useState<Dept.DeptItem[]>([])
  const [roleList, setRoleList] = useState<Role.RoleItem[]>([])

  useEffect(() => {
    getDeptList()
    getRoleList()
  }, [])

  // 获取部门列表
  const getDeptList = async () => {
    const list = await api.getDeptList()
    setDeptList(list)
  }

  // 获取角色列表
  const getRoleList = async () => {
    const list = await roleApi.getAllRoleList()
    setRoleList(list)
  }

  // 暴露子组件的open方法
  useImperativeHandle(props.mRef, () => {
    return { open }
  })
  // 调用弹框显示方法
  const open = (type: IAction, data?: User.UserItem) => {
    setAction(type)
    setVisible(true)
    if (type === 'edit' && data) {
      form.setFieldsValue(data)
      setImg(data.userImg)
    }
  }

  const handleSubmit = async () => {
    const valid = await form.validateFields()
    console.log(valid)
    if (valid) {
      const params = { ...form.getFieldsValue(), userImg: img }
      if (action === 'create') {
        await api.CreateUser(params)
        message.success('创建成功')
      } else {
        await api.editUser(params)
        message.success('修改成功')
      }
      // 关闭弹框
      handleCancel()
      // 更新表格
      props.update()
    }
  }
  const handleCancel = () => {
    setVisible(false)
    setImg('')
    form.resetFields()
  }

  // 上传之前,接口处理
  const beforeUpload = (file: RcFile): any => {
    // 判断格式
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      return message.error('只能上传png或jpeg格式的图片')
    }

    const isLt500k = file.size / 1024 / 1024 < 0.5
    if (!isLt500k) {
      return message.error('图片不能超过500k')
    }

    return isJpgOrPng && isLt500k
  }
  // 上传之后,图片处理
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    if (info.file.status === 'done') {
      setLoading(false)
      const { code, data, msg } = info.file.response
      console.log(info)
      if (code === 0) {
        setImg(data.file)
      } else {
        message.error(msg)
      }
    } else if (info.file.status === 'error') {
      message.error('服务器异常，请稍后重试')
    }
  }
  return (
    <Modal
      title={action === 'create' ? '创建用户' : '编辑用户'}
      okText='确定'
      cancelText='取消'
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
        <Form.Item name='userId' hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label='用户名称'
          name='userName'
          rules={[
            {
              required: true,
              message: '请输入用户名称'
            },
            {
              min: 5,
              max: 12,
              message: '用户名称最小5个字符，最大12个字符'
            }
          ]}
        >
          <Input placeholder='请输入用户名称'></Input>
        </Form.Item>
        <Form.Item
          label='用户邮箱'
          name='userEmail'
          rules={[
            {
              required: true,
              message: '请输入用户邮箱'
            },
            {
              type: 'email',
              message: '请输入正确的邮箱'
            },
            {
              pattern: /^\w+@mars.com$/,
              message: '邮箱必须以@mars.com结尾'
            }
          ]}
        >
          <Input placeholder='请输入用户邮箱' disabled={action === 'edit'}></Input>
        </Form.Item>
        <Form.Item
          label='手机号'
          name='mobile'
          rules={[
            { len: 11, message: '请输入11位的手机号' },
            {
              pattern: /1[1-9]\d{9}/,
              message: '请输入1开头的11位手机号'
            }
          ]}
        >
          <Input type='number' placeholder='请输入手机号'></Input>
        </Form.Item>
        <Form.Item
          label='部门'
          name='deptId'
          rules={[
            {
              required: true,
              message: '请输入部门'
            }
          ]}
        >
          <TreeSelect
            placeholder='请选择部门'
            allowClear
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={deptList}
          />
        </Form.Item>
        <Form.Item label='岗位' name='job'>
          <Input placeholder='请输入岗位'></Input>
        </Form.Item>
        <Form.Item label='状态' name='state'>
          <Select placeholder='请选择状态'>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='系统角色' name='roleList'>
          <Select>
            {roleList.map(item => {
              return (
                <Select.Option value={item._id} key={item._id}>
                  {item.roleName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label='用户头像'>
          <Upload
            listType='picture-circle'
            showUploadList={false}
            headers={{
              Authorization: 'Bearer ' + storage.get('token'),
              icode: '26B3B2903DC4FE08'
            }}
            action='/api/users/upload'
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {img ? (
              <img src={img} style={{ width: 100, borderRadius: '100%' }} />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 5 }}>上传头像</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
