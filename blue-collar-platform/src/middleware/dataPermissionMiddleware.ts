/**
 * 数据权限中间件
 * 拦截API请求，自动添加数据权限过滤条件
 */

import type { DataPermissionConfig, DataPermissionFilter } from '../types/data-permission'
import DataPermissionUtil from '../utils/dataPermissionUtil'

/**
 * 数据权限中间件配置
 */
interface DataPermissionMiddlewareConfig {
  /** 是否启用数据权限过滤 */
  enabled: boolean
  /** 用户ID */
  userId: string
  /** 部门ID */
  departmentId: string
  /** 数据权限配置 */
  dataPermission: DataPermissionConfig
  /** 部门树结构 */
  departmentTree: any[]
  /** 需要过滤的API路径列表 */
  filterPaths: string[]
  /** 不需要过滤的API路径列表 */
  excludePaths: string[]
  /** 是否启用缓存 */
  enableCache?: boolean
  /** 缓存过期时间（毫秒） */
  cacheExpireTime?: number
}

/**
 * 数据权限中间件
 */
class DataPermissionMiddleware {
  private config: DataPermissionMiddlewareConfig
  private filterCache: Map<string, { filter: DataPermissionFilter; timestamp: number }> = new Map()
  private configVersion: number = 0

  constructor(config: DataPermissionMiddlewareConfig) {
    this.config = {
      enableCache: true,
      cacheExpireTime: 5 * 60 * 1000, // 默认5分钟缓存
      ...config
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<DataPermissionMiddlewareConfig>): void {
    this.config = { ...this.config, ...config }
    this.configVersion++
    // 清除缓存，因为配置已更新
    this.clearCache()
  }

  /**
   * 获取配置版本号
   */
  getConfigVersion(): number {
    return this.configVersion
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.filterCache.clear()
  }

  /**
   * 清除过期缓存
   */
  clearExpiredCache(): void {
    const now = Date.now()
    const expireTime = this.config.cacheExpireTime || 5 * 60 * 1000

    for (const [key, value] of this.filterCache.entries()) {
      if (now - value.timestamp > expireTime) {
        this.filterCache.delete(key)
      }
    }
  }

  /**
   * 检查是否需要过滤
   */
  private shouldFilter(path: string): boolean {
    // 检查是否启用数据权限过滤
    if (!this.config.enabled) {
      return false
    }

    // 检查是否在排除列表中
    if (this.config.excludePaths.some(excludePath => path.includes(excludePath))) {
      return false
    }

    // 检查是否在过滤列表中
    if (this.config.filterPaths.length === 0) {
      // 如果没有配置过滤列表，默认过滤所有列表查询
      return path.includes('/list') || path.includes('/query') || path.includes('/search')
    }

    return this.config.filterPaths.some(filterPath => path.includes(filterPath))
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(): string {
    const { userId, departmentId, dataPermission } = this.config
    return `${userId}_${departmentId}_${dataPermission.type}_${dataPermission.departments?.join(',') || ''}_${this.configVersion}`
  }

  /**
   * 生成过滤条件
   */
  private generateFilter(): DataPermissionFilter {
    // 检查缓存
    if (this.config.enableCache) {
      this.clearExpiredCache()
      const cacheKey = this.generateCacheKey()
      const cached = this.filterCache.get(cacheKey)
      if (cached) {
        return cached.filter
      }
    }

    // 生成新的过滤条件
    const filter = DataPermissionUtil.generateFilter(
      this.config.dataPermission,
      this.config.userId,
      this.config.departmentId,
      this.config.departmentTree
    )

    // 缓存过滤条件
    if (this.config.enableCache) {
      const cacheKey = this.generateCacheKey()
      this.filterCache.set(cacheKey, {
        filter,
        timestamp: Date.now()
      })
    }

    return filter
  }

  /**
   * 生成SQL WHERE条件
   */
  generateSQLWhereCondition(tableName?: string): string {
    const filter = this.generateFilter()
    const conditions: string[] = []

    // 处理部门ID过滤
    if (filter.departmentIds && filter.departmentIds.length > 0) {
      const deptIds = filter.departmentIds.map(id => `'${id}'`).join(',')
      const column = tableName ? `${tableName}.department_id` : 'department_id'
      conditions.push(`${column} IN (${deptIds})`)
    }

    // 处理创建人过滤
    if (filter.creatorId) {
      const column = tableName ? `${tableName}.creator_id` : 'creator_id'
      conditions.push(`${column} = '${filter.creatorId}'`)
    }

    // 处理负责人过滤
    if (filter.managerId) {
      const column = tableName ? `${tableName}.manager_id` : 'manager_id'
      conditions.push(`${column} = '${filter.managerId}'`)
    }

    // 处理对接人过滤
    if (filter.contactId) {
      const column = tableName ? `${tableName}.contact_id` : 'contact_id'
      conditions.push(`${column} = '${filter.contactId}'`)
    }

    // 处理特殊权限组合
    if (this.config.dataPermission.includeCreator || 
        this.config.dataPermission.includeManager || 
        this.config.dataPermission.includeContact) {
      const specialConditions: string[] = []

      if (this.config.dataPermission.includeCreator) {
        const column = tableName ? `${tableName}.creator_id` : 'creator_id'
        specialConditions.push(`${column} = '${this.config.userId}'`)
      }

      if (this.config.dataPermission.includeManager) {
        const column = tableName ? `${tableName}.manager_id` : 'manager_id'
        specialConditions.push(`${column} = '${this.config.userId}'`)
      }

      if (this.config.dataPermission.includeContact) {
        const column = tableName ? `${tableName}.contact_id` : 'contact_id'
        specialConditions.push(`${column} = '${this.config.userId}'`)
      }

      if (specialConditions.length > 0) {
        if (conditions.length > 0) {
          conditions.push(`(${specialConditions.join(' OR ')})`)
        } else {
          conditions.push(`(${specialConditions.join(' OR ')})`)
        }
      }
    }

    return conditions.length > 0 ? conditions.join(' AND ') : '1=1'
  }

  /**
   * 生成MongoDB查询条件
   */
  generateMongoQuery(): Record<string, any> {
    const filter = this.generateFilter()
    const query: Record<string, any> = {}

    // 处理部门ID过滤
    if (filter.departmentIds && filter.departmentIds.length > 0) {
      query.departmentId = { $in: filter.departmentIds }
    }

    // 处理创建人过滤
    if (filter.creatorId) {
      query.creatorId = filter.creatorId
    }

    // 处理负责人过滤
    if (filter.managerId) {
      query.managerId = filter.managerId
    }

    // 处理对接人过滤
    if (filter.contactId) {
      query.contactId = filter.contactId
    }

    // 处理特殊权限组合
    if (this.config.dataPermission.includeCreator || 
        this.config.dataPermission.includeManager || 
        this.config.dataPermission.includeContact) {
      const specialConditions: Record<string, any>[] = []

      if (this.config.dataPermission.includeCreator) {
        specialConditions.push({ creatorId: this.config.userId })
      }

      if (this.config.dataPermission.includeManager) {
        specialConditions.push({ managerId: this.config.userId })
      }

      if (this.config.dataPermission.includeContact) {
        specialConditions.push({ contactId: this.config.userId })
      }

      if (specialConditions.length > 0) {
        if (Object.keys(query).length > 0) {
          query.$and = [
            query,
            { $or: specialConditions }
          ]
        } else {
          query.$or = specialConditions
        }
      }
    }

    return query
  }

  /**
   * 拦截请求
   */
  interceptRequest(config: any): any {
    const url = config.url || ''

    // 检查是否需要过滤
    if (!this.shouldFilter(url)) {
      return config
    }

    // 生成过滤条件
    const filter = this.generateFilter()

    // 将过滤条件添加到请求参数中
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        ...DataPermissionUtil.filterToQueryParams(filter)
      }
    } else if (config.method === 'post' || config.method === 'put') {
      config.data = {
        ...config.data,
        dataPermissionFilter: filter
      }
    }

    return config
  }

  /**
   * 拦截响应
   */
  interceptResponse(response: any): any {
    // 可以在这里处理响应数据，比如添加权限标识
    return response
  }

  /**
   * 拦截响应错误
   */
  interceptResponseError(error: any): any {
    // 可以在这里处理权限相关的错误
    if (error.response?.status === 403) {
      console.error('数据权限不足:', error.response.data)
    }
    return Promise.reject(error)
  }

  /**
   * 获取统计信息
   */
  getStatistics(): { cacheSize: number; configVersion: number } {
    return {
      cacheSize: this.filterCache.size,
      configVersion: this.configVersion
    }
  }
}

/**
 * 创建数据权限中间件实例
 */
export function createDataPermissionMiddleware(config: DataPermissionMiddlewareConfig): DataPermissionMiddleware {
  return new DataPermissionMiddleware(config)
}

/**
 * 数据权限中间件工厂
 */
export class DataPermissionMiddlewareFactory {
  private static instance: DataPermissionMiddleware | null = null

  /**
   * 获取单例实例
   */
  static getInstance(): DataPermissionMiddleware | null {
    return this.instance
  }

  /**
   * 创建实例
   */
  static create(config: DataPermissionMiddlewareConfig): DataPermissionMiddleware {
    this.instance = new DataPermissionMiddleware(config)
    return this.instance
  }

  /**
   * 销毁实例
   */
  static destroy(): void {
    if (this.instance) {
      this.instance.clearCache()
      this.instance = null
    }
  }
}

export default DataPermissionMiddleware
