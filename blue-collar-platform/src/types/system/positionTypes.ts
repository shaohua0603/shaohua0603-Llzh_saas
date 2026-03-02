export enum DataPermissionType {
  ALL = 'ALL',
  DEPARTMENT = 'DEPARTMENT',
  DEPARTMENT_AND_BELOW = 'DEPARTMENT_AND_BELOW',
  SELF = 'SELF',
  CUSTOM = 'CUSTOM'
}

export enum PositionStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled'
}

export interface Position {
  id: string
  positionName: string
  departmentId: string
  departmentName: string
  dataPermissionType: DataPermissionType
  customDepartments: string[]
  includeCreator: boolean
  includeManager: boolean
  includeContact: boolean
  menuPermissions: string[]
  description: string
  status: PositionStatus
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface PositionQueryParams {
  page: number
  pageSize: number
  positionName?: string
  departmentId?: string
  status?: PositionStatus
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PositionFormData {
  id?: string
  positionName: string
  departmentId: string
  dataPermissionType: DataPermissionType
  customDepartments: string[]
  includeCreator: boolean
  includeManager: boolean
  includeContact: boolean
  menuPermissions: string[]
  description: string
  status: PositionStatus
}

export interface PositionDetail extends Position {
  departmentPath?: string
  menuPermissionNames?: string[]
  customDepartmentNames?: string[]
}

export interface DataPermissionOption {
  label: string
  value: DataPermissionType
  color: string
}

export const DataPermissionTypeDict: Record<DataPermissionType, DataPermissionOption> = {
  [DataPermissionType.ALL]: { label: '全部数据', value: DataPermissionType.ALL, color: 'success' },
  [DataPermissionType.DEPARTMENT]: { label: '本部门数据', value: DataPermissionType.DEPARTMENT, color: 'primary' },
  [DataPermissionType.DEPARTMENT_AND_BELOW]: { label: '本部门及以下', value: DataPermissionType.DEPARTMENT_AND_BELOW, color: 'warning' },
  [DataPermissionType.SELF]: { label: '本人数据', value: DataPermissionType.SELF, color: 'info' },
  [DataPermissionType.CUSTOM]: { label: '自定义', value: DataPermissionType.CUSTOM, color: 'danger' }
}
