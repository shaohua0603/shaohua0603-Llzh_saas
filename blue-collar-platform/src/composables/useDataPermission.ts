/**
 * 数据权限Composable
 * 提供数据权限的状态管理和操作方法
 */

import { ref, computed, watch } from 'vue'
import type { DataPermissionConfig, DataPermissionFilter, UserDataPermission, Department, DataPermissionCache } from '../types/data-permission'
import DataPermissionUtil from '../utils/dataPermissionUtil'
import dataPermissionService from '../services/dataPermissionService'

/**
 * 数据权限Composable
 */
export function useDataPermission() {
  /**
   * 用户数据权限
   */
  const userDataPermission = ref<UserDataPermission | null>(null)

  /**
   * 部门树结构
   */
  const departmentTree = ref<Department[]>([])

  /**
   * 部门映射表
   */
  const departmentMap = ref<Map<string, Department>>(new Map())

  /**
   * 加载状态
   */
  const loading = ref(false)

  /**
   * 错误信息
   */
  const error = ref<string | null>(null)

  /**
   * 是否已初始化
   */
  const initialized = ref(false)

  /**
   * 是否是管理员
   */
  const isAdmin = computed(() => userDataPermission.value?.isAdmin || false)

  /**
   * 当前用户ID
   */
  const currentUserId = computed(() => userDataPermission.value?.userId || '')

  /**
   * 当前部门ID
   */
  const currentDepartmentId = computed(() => userDataPermission.value?.departmentId || '')

  /**
   * 当前数据权限配置
   */
  const currentDataPermission = computed(() => userDataPermission.value?.dataPermission || null)

  /**
   * 权限类型描述
   */
  const permissionTypeDescription = computed(() => {
    if (!currentDataPermission.value) return ''
    return DataPermissionUtil.getPermissionTypeDescription(currentDataPermission.value.type)
  })

  /**
   * 是否有特殊权限
   */
  const hasSpecialPermission = computed(() => {
    const config = currentDataPermission.value
    return config?.includeCreator || config?.includeManager || config?.includeContact
  })

  /**
   * 初始化数据权限
   */
  const initialize = async () => {
    if (initialized.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      // 尝试从缓存获取
      const cache = DataPermissionUtil.getCache()
      if (cache) {
        userDataPermission.value = cache.userDataPermission
        departmentTree.value = cache.departmentTree
        departmentMap.value = cache.departmentMap
        initialized.value = true
        return
      }

      // 从API获取
      await loadFromAPI()

      initialized.value = true
    } catch (err) {
      console.error('初始化数据权限失败:', err)
      error.value = '初始化数据权限失败'
    } finally {
      loading.value = false
    }
  }

  /**
   * 从API加载数据
   */
  const loadFromAPI = async () => {
    const [userPermission, deptTree] = await Promise.all([
      dataPermissionService.getUserDataPermission(),
      dataPermissionService.getDepartmentTree()
    ])

    userDataPermission.value = userPermission
    departmentTree.value = deptTree
    departmentMap.value = DataPermissionUtil.buildDepartmentMap(deptTree)

    // 设置缓存
    DataPermissionUtil.setCache({
      userDataPermission: userPermission,
      departmentTree: deptTree,
      departmentMap: departmentMap.value,
      cacheTime: Date.now()
    })
  }

  /**
   * 刷新数据权限
   */
  const refresh = async () => {
    loading.value = true
    error.value = null

    try {
      // 清除缓存
      DataPermissionUtil.clearCache()

      // 重新加载数据
      await loadFromAPI()
    } catch (err) {
      console.error('刷新数据权限失败:', err)
      error.value = '刷新数据权限失败'
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新数据权限配置
   */
  const updateDataPermission = async (config: DataPermissionConfig) => {
    loading.value = true
    error.value = null

    try {
      await dataPermissionService.updateDataPermission(config)

      // 更新本地数据
      if (userDataPermission.value) {
        userDataPermission.value.dataPermission = config
      }

      // 更新缓存
      const cache = DataPermissionUtil.getCache()
      if (cache) {
        cache.userDataPermission = userDataPermission.value!
        DataPermissionUtil.setCache(cache)
      }
    } catch (err) {
      console.error('更新数据权限失败:', err)
      error.value = '更新数据权限失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 生成数据权限过滤条件
   */
  const generateFilter = (): DataPermissionFilter => {
    if (!userDataPermission.value || !currentDataPermission.value) {
      return {}
    }

    return DataPermissionUtil.generateFilter(
      currentDataPermission.value,
      currentUserId.value,
      currentDepartmentId.value,
      departmentTree.value
    )
  }

  /**
   * 检查是否有权限访问数据
   */
  const hasPermission = (data: any): boolean => {
    if (isAdmin.value) {
      return true
    }

    const filter = generateFilter()

    // 检查部门权限
    if (filter.departmentIds && filter.departmentIds.length > 0) {
      if (!data.departmentId || !filter.departmentIds.includes(data.departmentId)) {
        return false
      }
    }

    // 检查创建人权限
    if (filter.creatorId) {
      if (!data.creatorId || data.creatorId !== currentUserId.value) {
        return false
      }
    }

    // 检查负责人权限
    if (filter.managerId) {
      if (!data.managerId || data.managerId !== currentUserId.value) {
        return false
      }
    }

    // 检查对接人权限
    if (filter.contactId) {
      if (!data.contactId || data.contactId !== currentUserId.value) {
        return false
      }
    }

    return true
  }

  /**
   * 过滤数据列表
   */
  const filterData = <T extends Record<string, any>>(dataList: T[]): T[] => {
    if (isAdmin.value) {
      return dataList
    }

    return dataList.filter(item => hasPermission(item))
  }

  /**
   * 获取部门路径
   */
  const getDepartmentPath = (departmentId: string): string[] => {
    return DataPermissionUtil.getDepartmentPath(departmentId, departmentMap.value)
  }

  /**
   * 获取部门名称
   */
  const getDepartmentName = (departmentId: string): string => {
    const dept = departmentMap.value.get(departmentId)
    return dept?.name || ''
  }

  /**
   * 获取子部门列表
   */
  const getChildDepartments = (departmentId: string): Department[] => {
    const dept = departmentMap.value.get(departmentId)
    return dept?.children || []
  }

  /**
   * 获取所有子部门ID
   */
  const getAllChildDepartmentIds = (departmentId: string): string[] => {
    return DataPermissionUtil.getDepartmentAndBelow(departmentId, departmentTree.value)
  }

  /**
   * 监听用户登录状态变化
   */
  const watchUserLogin = (callback: () => void) => {
    watch(() => userDataPermission.value, callback)
  }

  return {
    // 状态
    userDataPermission,
    departmentTree,
    departmentMap,
    loading,
    error,
    initialized,

    // 计算属性
    isAdmin,
    currentUserId,
    currentDepartmentId,
    currentDataPermission,
    permissionTypeDescription,
    hasSpecialPermission,

    // 方法
    initialize,
    refresh,
    updateDataPermission,
    generateFilter,
    hasPermission,
    filterData,
    getDepartmentPath,
    getDepartmentName,
    getChildDepartments,
    getAllChildDepartmentIds,
    watchUserLogin
  }
}

export default useDataPermission
