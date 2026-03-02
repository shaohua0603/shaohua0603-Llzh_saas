import request from '@/utils/request'

/**
 * 注册用户查询参数
 */
export interface RegisteredUserQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}

/**
 * 注册用户信息
 */
export interface RegisteredUser {
  id: string
  username: string
  phone: string
  email?: string
  name?: string
  idCard?: string
  registerTime: string
  lastLoginTime?: string
  status: 'enabled' | 'disabled'
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
 * 获取注册用户列表
 * @param params 查询参数
 */
export const getRegisteredUserList = (params: RegisteredUserQueryParams) => {
  return request.get<PageResponse<RegisteredUser>>('/system/registered-users', { params })
}

/**
 * 启用用户
 * @param id 用户ID
 */
export const enableRegisteredUser = (id: string) => {
  return request.put<RegisteredUser>(`/system/registered-users/${id}/enable`)
}

/**
 * 禁用用户
 * @param id 用户ID
 */
export const disableRegisteredUser = (id: string) => {
  return request.put<RegisteredUser>(`/system/registered-users/${id}/disable`)
}

/**
 * 重置用户密码
 * @param id 用户ID
 */
export const resetRegisteredUserPassword = (id: string) => {
  return request.put<{ newPassword: string }>(`/system/registered-users/${id}/reset-password`)
}

/**
 * 批量启用用户
 * @param ids 用户ID数组
 */
export const batchEnableRegisteredUsers = (ids: string[]) => {
  return request.put<void>('/system/registered-users/batch-enable', { ids })
}

/**
 * 批量禁用用户
 * @param ids 用户ID数组
 */
export const batchDisableRegisteredUsers = (ids: string[]) => {
  return request.put<void>('/system/registered-users/batch-disable', { ids })
}
