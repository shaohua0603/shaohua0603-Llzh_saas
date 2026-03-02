/**
 * 数据权限类型定义
 */

/**
 * 数据权限类型
 */
export type DataPermissionType = 'ALL' | 'DEPARTMENT' | 'DEPARTMENT_AND_BELOW' | 'SELF' | 'CUSTOM'

/**
 * 数据权限配置
 */
export interface DataPermissionConfig {
  /** 权限类型 */
  type: DataPermissionType
  /** 自定义部门ID列表 */
  departments?: string[]
  /** 包含创建人 */
  includeCreator?: boolean
  /** 包含负责人 */
  includeManager?: boolean
  /** 包含对接人 */
  includeContact?: boolean
}

/**
 * 部门信息
 */
export interface Department {
  /** 部门ID */
  id: string
  /** 部门名称 */
  name: string
  /** 父部门ID */
  parentId?: string
  /** 部门编码 */
  code?: string
  /** 部门层级 */
  level?: number
  /** 子部门列表 */
  children?: Department[]
}

/**
 * 用户数据权限信息
 */
export interface UserDataPermission {
  /** 用户ID */
  userId: string
  /** 用户名 */
  username: string
  /** 部门ID */
  departmentId: string
  /** 部门名称 */
  departmentName: string
  /** 岗位ID */
  positionId: string
  /** 岗位名称 */
  positionName: string
  /** 数据权限配置 */
  dataPermission: DataPermissionConfig
  /** 是否是管理员 */
  isAdmin: boolean
}

/**
 * 数据权限过滤条件
 */
export interface DataPermissionFilter {
  /** 部门ID列表 */
  departmentIds?: string[]
  /** 创建人ID */
  creatorId?: string
  /** 负责人ID */
  managerId?: string
  /** 对接人ID */
  contactId?: string
}

/**
 * 数据权限申请记录
 */
export interface DataPermissionApplication {
  /** 申请ID */
  id: string
  /** 申请人ID */
  applicantId: string
  /** 申请人姓名 */
  applicantName: string
  /** 申请的权限类型 */
  permissionType: DataPermissionType
  /** 自定义部门ID列表 */
  departments?: string[]
  /** 申请原因 */
  reason: string
  /** 申请状态 */
  status: 'pending' | 'approved' | 'rejected'
  /** 审批人ID */
  approverId?: string
  /** 审批人姓名 */
  approverName?: string
  /** 审批时间 */
  approvalTime?: Date
  /** 审批意见 */
  approvalComment?: string
  /** 申请时间 */
  createdAt: Date
}

/**
 * 数据权限统计信息
 */
export interface DataPermissionStatistics {
  /** 总数据量 */
  total: number
  /** 可查看数据量 */
  accessible: number
  /** 权限类型 */
  permissionType: DataPermissionType
  /** 权限描述 */
  description: string
}

/**
 * 数据权限缓存信息
 */
export interface DataPermissionCache {
  /** 用户数据权限 */
  userDataPermission: UserDataPermission
  /** 部门树结构 */
  departmentTree: Department[]
  /** 部门映射表 */
  departmentMap: Map<string, Department>
  /** 缓存时间 */
  cacheTime: number
}
