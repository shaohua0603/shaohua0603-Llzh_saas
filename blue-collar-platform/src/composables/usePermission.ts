/**
 * 权限控制 Composable
 */

import { computed } from 'vue'
import { PermissionUtil, type PermissionType, type DataPermissionConfig } from '../utils/permissionUtil'

/**
 * 使用权限
 */
export function usePermission() {
  /**
   * 是否有菜单权限
   */
  const hasMenuPermission = (path: string): boolean => {
    return PermissionUtil.hasMenuPermission(path)
  }

  /**
   * 是否有按钮权限
   */
  const hasButtonPermission = (code: string, menuPath?: string): boolean => {
    return PermissionUtil.hasButtonPermission(code, menuPath)
  }

  /**
   * 是否有指定类型的权限
   */
  const hasPermission = (type: PermissionType, menuPath?: string): boolean => {
    return PermissionUtil.hasPermission(type, menuPath)
  }

  /**
   * 是否有数据权限
   */
  const hasDataPermission = computed(() => {
    return PermissionUtil.hasDataPermission()
  })

  /**
   * 获取数据权限配置
   */
  const getDataPermission = computed((): DataPermissionConfig | null => {
    return PermissionUtil.getDataPermission()
  })

  /**
   * 是否是平台管理员
   */
  const isPlatformAdmin = computed(() => {
    return PermissionUtil.isPlatformAdmin()
  })

  /**
   * 是否是劳务公司用户
   */
  const isLaborCompany = computed(() => {
    return PermissionUtil.isLaborCompany()
  })

  /**
   * 是否是工厂用户
   */
  const isFactory = computed(() => {
    return PermissionUtil.isFactory()
  })

  /**
   * 是否是工人用户
   */
  const isWorker = computed(() => {
    return PermissionUtil.isWorker()
  })

  /**
   * 获取用户角色
   */
  const getUserRole = computed(() => {
    return PermissionUtil.getUserRole()
  })

  /**
   * 获取用户ID
   */
  const getUserId = computed(() => {
    return PermissionUtil.getUserId()
  })

  /**
   * 获取用户部门ID
   */
  const getDepartmentId = computed(() => {
    return PermissionUtil.getDepartmentId()
  })

  /**
   * 获取用户部门路径
   */
  const getDepartmentPath = computed(() => {
    return PermissionUtil.getDepartmentPath()
  })

  /**
   * 过滤可见菜单
   */
  const filterVisibleMenus = (menus: any[]): any[] => {
    return PermissionUtil.filterVisibleMenus(menus)
  }

  /**
   * 过滤可见按钮
   */
  const filterVisibleButtons = (buttons: any[], menuPath?: string): any[] => {
    return PermissionUtil.filterVisibleButtons(buttons, menuPath)
  }

  /**
   * 构建数据权限查询条件
   */
  const buildDataPermissionQuery = (): Record<string, any> => {
    return PermissionUtil.buildDataPermissionQuery()
  }

  /**
   * 检查数据是否在权限范围内
   */
  const isDataInScope = (data: Record<string, any>): boolean => {
    return PermissionUtil.isDataInScope(data)
  }

  return {
    hasMenuPermission,
    hasButtonPermission,
    hasPermission,
    hasDataPermission,
    getDataPermission,
    isPlatformAdmin,
    isLaborCompany,
    isFactory,
    isWorker,
    getUserRole,
    getUserId,
    getDepartmentId,
    getDepartmentPath,
    filterVisibleMenus,
    filterVisibleButtons,
    buildDataPermissionQuery,
    isDataInScope
  }
}
