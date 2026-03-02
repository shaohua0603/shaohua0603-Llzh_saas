import request from '@/utils/request'

/**
 * 学历对应岗位查询参数
 */
export interface EducationPositionQueryParams {
  page: number
  pageSize: number
  keyword?: string
}

/**
 * 学历对应岗位信息
 */
export interface EducationPosition {
  id: string
  educationLevel: string
  jobName: string
  createTime: string
  updateTime: string
}

/**
 * 学历对应岗位表单数据
 */
export interface EducationPositionFormData {
  educationLevel: string
  jobName: string
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
 * 获取学历对应岗位列表
 * @param params 查询参数
 */
export const getEducationPositionList = (params: EducationPositionQueryParams) => {
  return request.get<PageResponse<EducationPosition>>('/system/education-positions', { params })
}

/**
 * 获取学历对应岗位详情
 * @param id 岗位ID
 */
export const getEducationPositionDetail = (id: string) => {
  return request.get<EducationPosition>(`/system/education-positions/${id}`)
}

/**
 * 创建学历对应岗位
 * @param data 岗位表单数据
 */
export const createEducationPosition = (data: EducationPositionFormData) => {
  return request.post<EducationPosition>('/system/education-positions', data)
}

/**
 * 更新学历对应岗位
 * @param id 岗位ID
 * @param data 岗位表单数据
 */
export const updateEducationPosition = (id: string, data: EducationPositionFormData) => {
  return request.put<EducationPosition>(`/system/education-positions/${id}`, data)
}

/**
 * 删除学历对应岗位
 * @param id 岗位ID
 */
export const deleteEducationPosition = (id: string) => {
  return request.delete<void>(`/system/education-positions/${id}`)
}

/**
 * 批量删除学历对应岗位
 * @param ids 岗位ID数组
 */
export const batchDeleteEducationPositions = (ids: string[]) => {
  return request.delete<void>('/system/education-positions/batch', { data: { ids } })
}

/**
 * 学历等级选项
 */
export const educationLevelOptions = [
  { label: '初中及以下', value: '初中及以下' },
  { label: '高中/中专', value: '高中/中专' },
  { label: '大专', value: '大专' },
  { label: '本科', value: '本科' },
  { label: '硕士及以上', value: '硕士及以上' }
]

/**
 * 获取学历等级选项
 */
export const getEducationLevelOptions = () => {
  return educationLevelOptions
}
