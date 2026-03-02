import request from '@/utils/request'
import type { Tenant, TenantQueryParams, TenantFormData, TenantDetail } from '@/types/system/tenantTypes'

/**
 * 获取租户列表
 * @param params 查询参数
 */
export const getTenantList = (params: TenantQueryParams) => {
  return request.get('/system/tenants', { params })
}

/**
 * 获取租户详情
 * @param id 租户ID
 */
export const getTenantDetail = (id: string) => {
  return request.get<TenantDetail>(`/system/tenants/${id}`)
}

/**
 * 创建租户
 * @param data 租户表单数据
 */
export const createTenant = (data: TenantFormData) => {
  return request.post<Tenant>('/system/tenants', data)
}

/**
 * 更新租户
 * @param id 租户ID
 * @param data 租户表单数据
 */
export const updateTenant = (id: string, data: TenantFormData) => {
  return request.put<Tenant>(`/system/tenants/${id}`, data)
}

/**
 * 删除租户
 * @param id 租户ID
 */
export const deleteTenant = (id: string) => {
  return request.delete<void>(`/system/tenants/${id}`)
}

/**
 * 批量删除租户
 * @param ids 租户ID数组
 */
export const batchDeleteTenants = (ids: string[]) => {
  return request.delete<void>('/system/tenants/batch', { data: { ids } })
}

/**
 * 导出租户列表
 * @param params 查询参数
 */
export const exportTenants = (params: TenantQueryParams) => {
  return request.get('/system/tenants/export', { params, responseType: 'blob' })
}

/**
 * 启用租户
 * @param id 租户ID
 */
export const enableTenant = (id: string) => {
  return request.put<Tenant>(`/system/tenants/${id}/enable`)
}

/**
 * 禁用租户
 * @param id 租户ID
 */
export const disableTenant = (id: string) => {
  return request.put<Tenant>(`/system/tenants/${id}/disable`)
}

/**
 * 检查租户名称是否重复
 * @param tenantName 租户名称
 * @param id 租户ID(编辑时传入)
 */
export const checkTenantName = (tenantName: string, id?: string) => {
  return request.get<boolean>('/system/tenants/check-name', {
    params: { tenantName, id }
  })
}

/**
 * 检查统一社会信用代码是否重复
 * @param creditCode 统一社会信用代码
 * @param id 租户ID(编辑时传入)
 */
export const checkCreditCode = (creditCode: string, id?: string) => {
  return request.get<boolean>('/system/tenants/check-credit-code', {
    params: { creditCode, id }
  })
}

/**
 * 获取套餐下拉选项
 */
export const getPackageOptions = () => {
  return request.get('/system/packages/options')
}
