import DataPermissionUtil from '@/utils/dataPermissionUtil'
import { PermissionUtil } from '@/utils/permissionUtil'

export interface DataPermissionFilter {
  departmentIds?: string[]
  creatorId?: string
  managerId?: string
  contactId?: string
}

export class DataPermissionService {
  static applyDataPermission(params: Record<string, any> = {}): Record<string, any> {
    const permission = PermissionUtil.getUserPermission()
    if (!permission || !permission.dataPermission) {
      return params
    }

    const dataPermission = permission.dataPermission
    const userId = permission.userId
    const departmentId = permission.departmentId || ''
    const departmentPath = permission.departmentPath || []

    const filter = DataPermissionUtil.generateFilter(
      dataPermission,
      userId,
      departmentId,
      departmentPath.map(id => ({ id, name: '', children: [] }))
    )

    const queryParams = DataPermissionUtil.filterToQueryParams(filter)
    
    return {
      ...params,
      ...queryParams
    }
  }

  static checkDataPermission(data: Record<string, any>): boolean {
    return DataPermissionUtil.isDataInScope(data)
  }

  static getPermissionType(): string {
    const permission = PermissionUtil.getUserPermission()
    if (!permission || !permission.dataPermission) {
      return 'ALL'
    }
    return DataPermissionUtil.getPermissionTypeDescription(permission.dataPermission.type)
  }

  static canEdit(data: Record<string, any>): boolean {
    const permission = PermissionUtil.getUserPermission()
    if (!permission) return false
    
    if (permission.role === 'platform_admin') return true
    
    if (permission.role === 'labor_company' || permission.role === 'factory') {
      return this.checkDataPermission(data)
    }
    
    return false
  }

  static canDelete(data: Record<string, any>): boolean {
    return this.canEdit(data)
  }

  static filterDataByPermission<T extends Record<string, any>>(dataList: T[]): T[] {
    const permission = PermissionUtil.getUserPermission()
    if (!permission) return []
    
    if (permission.role === 'platform_admin') return dataList
    
    return dataList.filter(item => this.checkDataPermission(item))
  }

  static getAccessibleDepartments(): string[] {
    const permission = PermissionUtil.getUserPermission()
    if (!permission || !permission.dataPermission) {
      return []
    }

    const dataPermission = permission.dataPermission
    const userId = permission.userId
    const departmentId = permission.departmentId || ''
    const departmentPath = permission.departmentPath || []

    const filter = DataPermissionUtil.generateFilter(
      dataPermission,
      userId,
      departmentId,
      departmentPath.map(id => ({ id, name: '', children: [] }))
    )

    return filter.departmentIds || []
  }

  static hasFullAccess(): boolean {
    const permission = PermissionUtil.getUserPermission()
    if (!permission || !permission.dataPermission) {
      return false
    }
    return permission.dataPermission.type === 'ALL'
  }

  static hasDepartmentAccess(): boolean {
    const permission = PermissionUtil.getUserPermission()
    if (!permission || !permission.dataPermission) {
      return false
    }
    return permission.dataPermission.type === 'DEPARTMENT' || 
           permission.dataPermission.type === 'DEPARTMENT_AND_BELOW'
  }

  static hasSelfAccess(): boolean {
    const permission = PermissionUtil.getUserPermission()
    if (!permission || !permission.dataPermission) {
      return false
    }
    return permission.dataPermission.type === 'SELF'
  }

  // Mock方法：获取用户数据权限
  static async getUserDataPermission() {
    return {
      userId: 'USER001',
      departmentId: 'DEPT001',
      isAdmin: true,
      dataPermission: {
        type: 'ALL',
        departments: [],
        includeCreator: false,
        includeManager: false,
        includeContact: false
      }
    }
  }

  // Mock方法：获取部门树
  static async getDepartmentTree() {
    return [
      {
        id: 'DEPT001',
        name: '总部门',
        children: [
          {
            id: 'DEPT002',
            name: '销售部',
            children: []
          },
          {
            id: 'DEPT003',
            name: '技术部',
            children: []
          }
        ]
      }
    ]
  }
}

export default DataPermissionService
