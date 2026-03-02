import request from '@/utils/request'

/**
 * 预警消息模版查询参数
 */
export interface WarningTemplateQueryParams {
  page: number
  pageSize: number
  keyword?: string
}

/**
 * 预警消息模版信息
 */
export interface WarningTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  createTime: string
  updateTime: string
}

/**
 * 预警消息模版表单数据
 */
export interface WarningTemplateFormData {
  name: string
  content: string
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
 * 获取预警消息模版列表
 * @param params 查询参数
 */
export const getWarningTemplateList = (params: WarningTemplateQueryParams) => {
  return request.get<PageResponse<WarningTemplate>>('/system/warning-templates', { params })
}

/**
 * 获取预警消息模版详情
 * @param id 模版ID
 */
export const getWarningTemplateDetail = (id: string) => {
  return request.get<WarningTemplate>(`/system/warning-templates/${id}`)
}

/**
 * 创建预警消息模版
 * @param data 模版表单数据
 */
export const createWarningTemplate = (data: WarningTemplateFormData) => {
  return request.post<WarningTemplate>('/system/warning-templates', data)
}

/**
 * 更新预警消息模版
 * @param id 模版ID
 * @param data 模版表单数据
 */
export const updateWarningTemplate = (id: string, data: WarningTemplateFormData) => {
  return request.put<WarningTemplate>(`/system/warning-templates/${id}`, data)
}

/**
 * 删除预警消息模版
 * @param id 模版ID
 */
export const deleteWarningTemplate = (id: string) => {
  return request.delete<void>(`/system/warning-templates/${id}`)
}

/**
 * 批量删除预警消息模版
 * @param ids 模版ID数组
 */
export const batchDeleteWarningTemplates = (ids: string[]) => {
  return request.delete<void>('/system/warning-templates/batch', { data: { ids } })
}

/**
 * 检查模版名称是否重复
 * @param name 模版名称
 * @param id 模版ID(编辑时传入)
 */
export const checkWarningTemplateName = (name: string, id?: string) => {
  return request.get<boolean>('/system/warning-templates/check-name', {
    params: { name, id }
  })
}

/**
 * 预览模版内容
 * @param id 模版ID
 * @param variables 变量数据
 */
export const previewWarningTemplate = (id: string, variables: Record<string, any>) => {
  return request.post<{ content: string }>(`/system/warning-templates/${id}/preview`, { variables })
}
