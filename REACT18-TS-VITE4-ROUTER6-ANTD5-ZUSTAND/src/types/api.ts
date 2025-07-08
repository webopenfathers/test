// 接口类型定义
export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

// 通用分页列表
export interface ResultData<T = any> {
  list: T[]
  page: {
    pageNum: number
    pageSize: number
    total: number | 0
  }
}

export interface PageParams {
  pageNum: number
  pageSize?: number
}

export namespace Login {
  export interface params {
    username: string
    usePwd: string
  }
}

// 用户管理
export namespace User {
  export interface Params extends PageParams {
    userId?: number
    useName?: string
    state?: number
  }

  export interface UserItem {
    createId: number
    deptId: string
    deptName: string
    job: string
    mobile: string
    role: number
    roleList: string
    state: number
    userEmail: string
    userId: number
    userImg: string
    userName: string
    _id: string
  }

  export interface CreateParams {
    userName: string
    userEmail: string
    mobile?: number
    deptId: string
    job?: string
    state?: number
    roleList: string[]
    userImg: string
  }

  export interface EditParams extends CreateParams {
    userId: number
  }
}

// 部门管理
export namespace Dept {
  // 搜索参数
  export interface params {
    deptName?: string
  }
  // 创建参数
  export interface CreateParams {
    deptName: string
    parentId?: string
    userName: string
  }
  // 编辑参数
  export interface EditParams extends CreateParams {
    _id: string
  }

  // 删除参数
  export interface DelParams {
    _id: string
  }

  // 列表参数
  export interface DeptItem {
    _id: string
    createTime: string
    updateTime: string
    deptName: string
    parentId: string
    userName: string
    children: DeptItem[]
  }
}

// 菜单管理
export namespace Menu {
  // 菜单参数
  export interface Params {
    menuName: string
    menuState: number
  }

  // 菜单创建
  export interface CreateParams {
    menuName: string // 菜单名称
    icon: string // 菜单图表
    menuType: number // 1.菜单 2.按钮 3.页面
    menuState: number // 1.正常 2.停用
    menuCode?: string // 按钮权限标识
    parentId?: string // 父级菜单ID
    path?: string // 菜单路径
    component?: string // 组件名称
    orderBy: number // 菜单排序
  }

  // 菜单列表
  export interface MenuItem extends CreateParams {
    _id: string
    createTime: string
    buttons?: MenuItem[]
    children?: MenuItem[]
  }

  // 编辑参数
  export interface EditParams extends CreateParams {
    _id: string
  }

  // 删除参数
  export interface DelParams {
    _id: string
  }
}

// 看板数据统计
export namespace Dashboard {
  export interface ReportData {
    driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: number
  }

  export interface LineData {
    label: string[]
    order: number[]
    money: number
  }

  export interface PieData {
    value: number
    name: string
  }

  export interface RadarData {
    indicator: Array<{ name: string; max: number }>
    data: {
      name: string
      value: number[]
    }
  }
}

// 角色管理
export namespace Role {
  export interface Params extends PageParams {
    roleName?: string
  }

  export interface CreateParams {
    roleName: string
    remark?: string
  }

  export interface RoleItem extends CreateParams {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
    updateTime: string
    createTime: string
  }

  export interface EditParams extends CreateParams {
    _id: string
  }

  export interface Permission {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
  }
}

// 订单列表
export namespace Order {
  export enum IState {
    doing = 1,
    done = 2,
    timeout = 3,
    cance = 4
  }

  export interface CreateParams {
    cityName: string
    userName: string
    mobile: number
    startAddress: string //下单开始地址
    endAddress: string //下单结束地址
    orderAmount: number //订单金额
    userPayAmount: number //支付金额
    driverAmount: number //支付金额
    // 1: 微信 2：支付宝
    payType: number //支付方式
    driverName: string //司机名称
    vehicleName: string //订单车型
    // 1: 进行中 2：已完成 3：超时 4：取消
    state: IState // 订单状态
    // 用车时间
    useTime: string
    // 订单结束时间
    endTime: string
  }

  export interface OrderItem extends CreateParams {
    _id: string
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }> //行驶轨迹
    createTime: string //创建时间
    remark: string //备注
  }

  export interface SearchParams {
    orderId?: string
    userName?: string
    state?: IState
  }
  export interface Params extends PageParams {
    orderId?: string
    userName?: string
    state?: IState
  }
  export interface DictItem {
    id: string
    name: string
  }
  export interface OrderRoute {
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }>
  }

  // 司机列表
  export interface DriverParams {
    driverName?: string
    accountStatus?: number
  }
  export enum DriverStatus {
    auth = 0, // 待认证
    normal = 1, //正常
    temp = 2, // 暂时拉黑
    always = 3, // 永久拉黑
    stop = 4 //停止推送
  }
  export interface DriverItem {
    driverName: string // 司机名称
    driverId: number // 司机ID
    driverPhone: string // 司机手机号
    cityName: string // 城市名称
    grade: boolean // 会员等级
    driverLevel: number // 司机等级
    accountStatus: DriverStatus // 司机状态
    carNo: string // 车牌号
    vehicleBrand: string // 车辆品牌
    vehicleName: string // 车辆名称
    onlineTime: number // 昨日在线时长
    driverAmount: number // 昨日司机流水
    rating: number // 司机评分
    driverScore: number // 司机行为分
    pushOrderCount: number // 昨日推单数
    orderCompleteCount: number // 昨日完单数
    createTime: string // 创建时间
  }
}
