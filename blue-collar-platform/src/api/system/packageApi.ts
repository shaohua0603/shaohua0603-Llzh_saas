import request from '@/utils/request'
import type { Package, PackageQueryParams, PackageFormData, PackageDetail } from '@/types/system/packageTypes'

/**
 * 获取套餐列表
 * @param params 查询参数
 */
export const getPackageList = (params: PackageQueryParams) => {
  return request.get('/system/packages', { params })
}

/**
 * 获取套餐详情
 * @param id 套餐ID
 */
export const getPackageDetail = (id: string) => {
  return request.get<PackageDetail>(`/system/packages/${id}`)
}

/**
 * 创建套餐
 * @param data 套餐表单数据
 */
export const createPackage = (data: PackageFormData) => {
  return request.post<Package>('/system/packages', data)
}

/**
 * 更新套餐
 * @param id 套餐ID
 * @param data 套餐表单数据
 */
export const updatePackage = (id: string, data: PackageFormData) => {
  return request.put<Package>(`/system/packages/${id}`, data)
}

/**
 * 删除套餐
 * @param id 套餐ID
 */
export const deletePackage = (id: string) => {
  return request.delete<void>(`/system/packages/${id}`)
}

/**
 * 批量删除套餐
 * @param ids 套餐ID数组
 */
export const batchDeletePackages = (ids: string[]) => {
  return request.delete<void>('/system/packages/batch', { data: { ids } })
}

/**
 * 导出套餐列表
 * @param params 查询参数
 */
export const exportPackages = (params: PackageQueryParams) => {
  return request.get('/system/packages/export', { params, responseType: 'blob' })
}

/**
 * 启用套餐
 * @param id 套餐ID
 */
export const enablePackage = (id: string) => {
  return request.put<Package>(`/system/packages/${id}/enable`)
}

/**
 * 禁用套餐
 * @param id 套餐ID
 */
export const disablePackage = (id: string) => {
  return request.put<Package>(`/system/packages/${id}/disable`)
}

/**
 * 检查套餐名称是否重复
 * @param packageName 套餐名称
 * @param id 套餐ID(编辑时传入)
 */
export const checkPackageName = (packageName: string, id?: string) => {
  return request.get<boolean>('/system/packages/check-name', {
    params: { packageName, id }
  })
}
