import request from '@/utils/request'

/**
 * 租户标签查询参数
 */
export interface TenantTagQueryParams {
  page: number
  pageSize: number
  keyword?: string
}

/**
 * 租户标签信息
 */
export interface TenantTag {
  id: string
  name: string
  description?: string
  createTime: string
  updateTime: string
}

/**
 * 租户标签表单数据
 */
export interface TenantTagFormData {
  name: string
  description?: string
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 获取租户标签列表
 * @param params 查询参数
 */
export const getTenantTagList = (params: TenantTagQueryParams) => {
  return request.get<PageResponse<TenantTag>>('/system/tenant-tags', { params })
}

/**
 * 获取租户标签详情
 * @param id 标签ID
 */
export const getTenantTagDetail = (id: string) => {
  return request.get<TenantTag>(`/system/tenant-tags/${id}`)
}

/**
 * 创建租户标签
 * @param data 标签表单数据
 */
export const createTenantTag = (data: TenantTagFormData) => {
  return request.post<TenantTag>('/system/tenant-tags', data)
}

/**
 * 更新租户标签
 * @param id 标签ID
 * @param data 标签表单数据
 */
export const updateTenantTag = (id: string, data: TenantTagFormData) => {
  return request.put<TenantTag>(`/system/tenant-tags/${id}`, data)
}

/**
 * 删除租户标签
 * @param id 标签ID
 */
export const deleteTenantTag = (id: string) => {
  return request.delete<void>(`/system/tenant-tags/${id}`)
}

/**
 * 批量删除租户标签
 * @param ids 标签ID数组
 */
export const batchDeleteTenantTags = (ids: string[]) => {
  return request.delete<void>('/system/tenant-tags/batch', { data: { ids } })
}

/**
 * 检查标签名称是否重复
 * @param name 标签名称
 * @param id 标签ID(编辑时传入)
 */
export const checkTenantTagName = (name: string, id?: string) => {
  return request.get<boolean>('/system/tenant-tags/check-name', {
    params: { name, id }
  })
}
