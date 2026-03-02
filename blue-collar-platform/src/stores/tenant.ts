import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as tenantApi from '@/api/system/tenantApi'
import type { Tenant, TenantQueryParams, TenantFormData, TenantDetail } from '@/types/system/tenantTypes'
import { ElMessage } from 'element-plus'

export const useTenantStore = defineStore('tenant', () => {
  // 状态
  const tenantList = ref<Tenant[]>([])
  const currentTenant = ref<TenantDetail | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const packageOptions = ref<Array<{ label: string; value: string }>>([])

  // 计算属性
  const hasData = computed(() => tenantList.value.length > 0)

  /**
   * 获取租户列表
   * @param params 查询参数
   */
  const fetchTenantList = async (params: TenantQueryParams) => {
    loading.value = true
    try {
      const response = await tenantApi.getTenantList(params)
      tenantList.value = response.data.list || []
      total.value = response.data.total || 0
    } catch (error) {
      console.error('获取租户列表失败:', error)
      ElMessage.error('获取租户列表失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取租户详情
   * @param id 租户ID
   */
  const fetchTenantDetail = async (id: string) => {
    loading.value = true
    try {
      const response = await tenantApi.getTenantDetail(id)
      currentTenant.value = response.data
      return response.data
    } catch (error) {
      console.error('获取租户详情失败:', error)
      ElMessage.error('获取租户详情失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建租户
   * @param data 租户表单数据
   */
  const createTenant = async (data: TenantFormData) => {
    loading.value = true
    try {
      const response = await tenantApi.createTenant(data)
      ElMessage.success('创建成功')
      return response.data
    } catch (error) {
      console.error('创建租户失败:', error)
      ElMessage.error('创建租户失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新租户
   * @param id 租户ID
   * @param data 租户表单数据
   */
  const updateTenant = async (id: string, data: TenantFormData) => {
    loading.value = true
    try {
      const response = await tenantApi.updateTenant(id, data)
      ElMessage.success('更新成功')
      return response.data
    } catch (error) {
      console.error('更新租户失败:', error)
      ElMessage.error('更新租户失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除租户
   * @param id 租户ID
   */
  const deleteTenant = async (id: string) => {
    loading.value = true
    try {
      await tenantApi.deleteTenant(id)
      ElMessage.success('删除成功')
    } catch (error) {
      console.error('删除租户失败:', error)
      ElMessage.error('删除租户失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量删除租户
   * @param ids 租户ID数组
   */
  const batchDeleteTenants = async (ids: string[]) => {
    loading.value = true
    try {
      await tenantApi.batchDeleteTenants(ids)
      ElMessage.success('批量删除成功')
    } catch (error) {
      console.error('批量删除租户失败:', error)
      ElMessage.error('批量删除租户失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 导出租户列表
   * @param params 查询参数
   */
  const exportTenants = async (params: TenantQueryParams) => {
    loading.value = true
    try {
      const blob = await tenantApi.exportTenants(params)
      return blob
    } catch (error) {
      console.error('导出租户列表失败:', error)
      ElMessage.error('导出租户列表失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 启用租户
   * @param id 租户ID
   */
  const enableTenant = async (id: string) => {
    loading.value = true
    try {
      const response = await tenantApi.enableTenant(id)
      ElMessage.success('启用成功')
      return response.data
    } catch (error) {
      console.error('启用租户失败:', error)
      ElMessage.error('启用租户失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 禁用租户
   * @param id 租户ID
   */
  const disableTenant = async (id: string) => {
    loading.value = true
    try {
      const response = await tenantApi.disableTenant(id)
      ElMessage.success('禁用成功')
      return response.data
    } catch (error) {
      console.error('禁用租户失败:', error)
      ElMessage.error('禁用租户失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 检查租户名称是否重复
   * @param tenantName 租户名称
   * @param id 租户ID(编辑时传入)
   */
  const checkTenantName = async (tenantName: string, id?: string) => {
    try {
      const response = await tenantApi.checkTenantName(tenantName, id)
      return response.data
    } catch (error) {
      console.error('检查租户名称失败:', error)
      throw error
    }
  }

  /**
   * 检查统一社会信用代码是否重复
   * @param creditCode 统一社会信用代码
   * @param id 租户ID(编辑时传入)
   */
  const checkCreditCode = async (creditCode: string, id?: string) => {
    try {
      const response = await tenantApi.checkCreditCode(creditCode, id)
      return response.data
    } catch (error) {
      console.error('检查统一社会信用代码失败:', error)
      throw error
    }
  }

  /**
   * 获取套餐下拉选项
   */
  const fetchPackageOptions = async () => {
    try {
      const response = await tenantApi.getPackageOptions()
      packageOptions.value = response.data || []
      return response.data
    } catch (error) {
      console.error('获取套餐选项失败:', error)
      ElMessage.error('获取套餐选项失败')
      throw error
    }
  }

  /**
   * 重置状态
   */
  const resetState = () => {
    tenantList.value = []
    currentTenant.value = null
    total.value = 0
    loading.value = false
    packageOptions.value = []
  }

  return {
    // 状态
    tenantList,
    currentTenant,
    total,
    loading,
    packageOptions,
    // 计算属性
    hasData,
    // 方法
    fetchTenantList,
    fetchTenantDetail,
    createTenant,
    updateTenant,
    deleteTenant,
    batchDeleteTenants,
    exportTenants,
    enableTenant,
    disableTenant,
    checkTenantName,
    checkCreditCode,
    fetchPackageOptions,
    resetState
  }
})
