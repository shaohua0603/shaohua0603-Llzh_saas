/**
 * 数据权限工具类
 * 提供数据权限过滤、缓存、查询等功能
 */

import type {
  DataPermissionConfig,
  DataPermissionFilter,
  DataPermissionType,
  Department,
  UserDataPermission,
  DataPermissionCache,
  DataPermissionStatistics
} from '../types/data-permission'

/**
 * 数据权限工具类
 */
class DataPermissionUtil {
  private static cache: DataPermissionCache | null = null
  private static CACHE_EXPIRE_TIME = 30 * 60 * 1000 // 30分钟缓存过期

  /**
   * 设置数据权限缓存
   */
  static setCache(cache: DataPermissionCache): void {
    this.cache = {
      ...cache,
      cacheTime: Date.now()
    }
    localStorage.setItem('dataPermissionCache', JSON.stringify(this.cache))
  }

  /**
   * 获取数据权限缓存
   */
  static getCache(): DataPermissionCache | null {
    // 检查内存缓存
    if (this.cache && Date.now() - this.cache.cacheTime < this.CACHE_EXPIRE_TIME) {
      return this.cache
    }

    // 检查本地存储
    const cached = localStorage.getItem('dataPermissionCache')
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as DataPermissionCache
        // 检查缓存是否过期
        if (Date.now() - parsed.cacheTime < this.CACHE_EXPIRE_TIME) {
          this.cache = parsed
          return parsed
        }
      } catch (error) {
        console.error('解析数据权限缓存失败:', error)
      }
    }

    return null
  }

  /**
   * 清除数据权限缓存
   */
  static clearCache(): void {
    this.cache = null
    localStorage.removeItem('dataPermissionCache')
  }

  /**
   * 刷新数据权限缓存
   */
  static async refreshCache(): Promise<void> {
    this.clearCache()
    // 这里可以调用API重新获取数据权限配置
  }

  /**
   * 根据数据权限配置生成过滤条件
   */
  static generateFilter(
    config: DataPermissionConfig,
    userId: string,
    departmentId: string,
    departmentTree: Department[]
  ): DataPermissionFilter {
    const filter: DataPermissionFilter = {}

    switch (config.type) {
      case 'ALL':
        // 全部数据，不添加任何过滤条件
        break

      case 'DEPARTMENT':
        // 本部门数据
        filter.departmentIds = [departmentId]
        break

      case 'DEPARTMENT_AND_BELOW':
        // 本部门及以下
        filter.departmentIds = this.getDepartmentAndBelow(departmentId, departmentTree)
        break

      case 'SELF':
        // 本人数据
        filter.creatorId = userId
        break

      case 'CUSTOM':
        // 自定义部门
        if (config.departments && config.departments.length > 0) {
          filter.departmentIds = config.departments
        }
        break
    }

    // 处理特殊权限 - 这些权限会与主权限叠加
    // 如果配置了特殊权限，需要使用OR逻辑
    if (config.includeCreator || config.includeManager || config.includeContact) {
      // 如果主权限类型是SELF，则不需要添加创建人过滤（因为已经包含了）
      if (config.type !== 'SELF') {
        // 对于非SELF类型，特殊权限需要单独处理
        // 这里我们只是标记，实际过滤逻辑在中间件中处理
      }
    }

    return filter
  }

  /**
   * 生成完整的过滤条件（包括特殊权限）
   */
  static generateCompleteFilter(
    config: DataPermissionConfig,
    userId: string,
    departmentId: string,
    departmentTree: Department[]
  ): DataPermissionFilter & { hasSpecialPermission: boolean } {
    const baseFilter = this.generateFilter(config, userId, departmentId, departmentTree)
    
    return {
      ...baseFilter,
      hasSpecialPermission: config.includeCreator || config.includeManager || config.includeContact
    }
  }

  /**
   * 获取部门及其所有子部门ID
   */
  static getDepartmentAndBelow(departmentId: string, departmentTree: Department[]): string[] {
    const result: string[] = []
    const findAndCollect = (departments: Department[]): void => {
      for (const dept of departments) {
        if (dept.id === departmentId) {
          result.push(dept.id)
          if (dept.children) {
            this.collectAllChildren(dept.children, result)
          }
          break
        }
        if (dept.children) {
          findAndCollect(dept.children)
        }
      }
    }
    findAndCollect(departmentTree)
    return result
  }

  /**
   * 收集所有子部门ID
   */
  private static collectAllChildren(departments: Department[], result: string[]): void {
    for (const dept of departments) {
      result.push(dept.id)
      if (dept.children) {
        this.collectAllChildren(dept.children, result)
      }
    }
  }

  /**
   * 构建部门映射表
   */
  static buildDepartmentMap(departmentTree: Department[]): Map<string, Department> {
    const map = new Map<string, Department>()
    const buildMap = (departments: Department[]): void => {
      for (const dept of departments) {
        map.set(dept.id, dept)
        if (dept.children) {
          buildMap(dept.children)
        }
      }
    }
    buildMap(departmentTree)
    return map
  }

  /**
   * 获取部门路径
   */
  static getDepartmentPath(departmentId: string, departmentMap: Map<string, Department>): string[] {
    const path: string[] = []
    let current = departmentMap.get(departmentId)
    while (current) {
      path.unshift(current.name)
      current = current.parentId ? departmentMap.get(current.parentId) : undefined
    }
    return path
  }

  /**
   * 检查数据权限是否有效
   */
  static isValidPermission(config: DataPermissionConfig): boolean {
    if (!config.type) {
      return false
    }

    // 自定义权限必须选择部门
    if (config.type === 'CUSTOM' && (!config.departments || config.departments.length === 0)) {
      return false
    }

    return true
  }

  /**
   * 获取权限类型描述
   */
  static getPermissionTypeDescription(type: DataPermissionType): string {
    const descriptions: Record<DataPermissionType, string> = {
      ALL: '全部数据',
      DEPARTMENT: '本部门数据',
      DEPARTMENT_AND_BELOW: '本部门及以下数据',
      SELF: '本人数据',
      CUSTOM: '自定义部门数据'
    }
    return descriptions[type] || type
  }

  /**
   * 生成数据权限统计信息
   */
  static generateStatistics(
    total: number,
    accessible: number,
    permissionType: DataPermissionType
  ): DataPermissionStatistics {
    return {
      total,
      accessible,
      permissionType,
      description: this.getPermissionTypeDescription(permissionType)
    }
  }

  /**
   * 合并多个过滤条件
   */
  static mergeFilters(filters: DataPermissionFilter[]): DataPermissionFilter {
    const merged: DataPermissionFilter = {}
    const departmentIdsSet = new Set<string>()

    for (const filter of filters) {
      if (filter.departmentIds) {
        filter.departmentIds.forEach(id => departmentIdsSet.add(id))
      }
      if (filter.creatorId && !merged.creatorId) {
        merged.creatorId = filter.creatorId
      }
      if (filter.managerId && !merged.managerId) {
        merged.managerId = filter.managerId
      }
      if (filter.contactId && !merged.contactId) {
        merged.contactId = filter.contactId
      }
    }

    if (departmentIdsSet.size > 0) {
      merged.departmentIds = Array.from(departmentIdsSet)
    }

    return merged
  }

  /**
   * 将过滤条件转换为查询参数
   */
  static filterToQueryParams(filter: DataPermissionFilter): Record<string, any> {
    const params: Record<string, any> = {}

    if (filter.departmentIds && filter.departmentIds.length > 0) {
      params.departmentIds = filter.departmentIds.join(',')
    }
    if (filter.creatorId) {
      params.creatorId = filter.creatorId
    }
    if (filter.managerId) {
      params.managerId = filter.managerId
    }
    if (filter.contactId) {
      params.contactId = filter.contactId
    }

    return params
  }

  /**
   * 从查询参数解析过滤条件
   */
  static queryParamsToFilter(params: Record<string, any>): DataPermissionFilter {
    const filter: DataPermissionFilter = {}

    if (params.departmentIds) {
      filter.departmentIds = params.departmentIds.split(',')
    }
    if (params.creatorId) {
      filter.creatorId = params.creatorId
    }
    if (params.managerId) {
      filter.managerId = params.managerId
    }
    if (params.contactId) {
      filter.contactId = params.contactId
    }

    return filter
  }
}

export default DataPermissionUtil
