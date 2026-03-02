import request from '@/utils/request'

/**
 * 平台账号查询参数
 */
export interface PlatformAccountQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}

/**
 * 平台账号信息
 */
export interface PlatformAccount {
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
 * 平台账号表单数据
 */
export interface PlatformAccountFormData {
  username: string
  phone: string
  email?: string
  name?: string
  idCard?: string
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
 * 获取平台账号列表
 * @param params 查询参数
 */
export const getPlatformAccountList = (params: PlatformAccountQueryParams) => {
  return request.get<PageResponse<PlatformAccount>>('/system/platform-accounts', { params })
}

/**
 * 获取平台账号详情
 * @param id 账号ID
 */
export const getPlatformAccountDetail = (id: string) => {
  return request.get<PlatformAccount>(`/system/platform-accounts/${id}`)
}

/**
 * 创建平台账号
 * @param data 账号表单数据
 */
export const createPlatformAccount = (data: PlatformAccountFormData) => {
  return request.post<PlatformAccount>('/system/platform-accounts', data)
}

/**
 * 更新平台账号
 * @param id 账号ID
 * @param data 账号表单数据
 */
export const updatePlatformAccount = (id: string, data: PlatformAccountFormData) => {
  return request.put<PlatformAccount>(`/system/platform-accounts/${id}`, data)
}

/**
 * 删除平台账号
 * @param id 账号ID
 */
export const deletePlatformAccount = (id: string) => {
  return request.delete<void>(`/system/platform-accounts/${id}`)
}

/**
 * 批量删除平台账号
 * @param ids 账号ID数组
 */
export const batchDeletePlatformAccounts = (ids: string[]) => {
  return request.delete<void>('/system/platform-accounts/batch', { data: { ids } })
}

/**
 * 启用平台账号
 * @param id 账号ID
 */
export const enablePlatformAccount = (id: string) => {
  return request.put<PlatformAccount>(`/system/platform-accounts/${id}/enable`)
}

/**
 * 禁用平台账号
 * @param id 账号ID
 */
export const disablePlatformAccount = (id: string) => {
  return request.put<PlatformAccount>(`/system/platform-accounts/${id}/disable`)
}

/**
 * 重置平台账号密码
 * @param id 账号ID
 */
export const resetPlatformAccountPassword = (id: string) => {
  return request.put<{ newPassword: string }>(`/system/platform-accounts/${id}/reset-password`)
}

/**
 * 批量启用平台账号
 * @param ids 账号ID数组
 */
export const batchEnablePlatformAccounts = (ids: string[]) => {
  return request.put<void>('/system/platform-accounts/batch-enable', { ids })
}

/**
 * 批量禁用平台账号
 * @param ids 账号ID数组
 */
export const batchDisablePlatformAccounts = (ids: string[]) => {
  return request.put<void>('/system/platform-accounts/batch-disable', { ids })
}

/**
 * 检查用户名是否重复
 * @param username 用户名
 * @param id 账号ID(编辑时传入)
 */
export const checkPlatformAccountUsername = (username: string, id?: string) => {
  return request.get<boolean>('/system/platform-accounts/check-username', {
    params: { username, id }
  })
}

/**
 * 检查手机号是否重复
 * @param phone 手机号
 * @param id 账号ID(编辑时传入)
 */
export const checkPlatformAccountPhone = (phone: string, id?: string) => {
  return request.get<boolean>('/system/platform-accounts/check-phone', {
    params: { phone, id }
  })
}
