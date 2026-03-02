/**
 * 活动管理模块API接口
 */
import request from '@/utils/request'
import type {
  ApiResponse,
  PageResponse,
} from '@/types/response'
import type {
  ActivityInfo,
  ActivityFormData,
  ActivityQueryParams,
  RegistrationInfo,
  RegistrationQueryParams,
  AuditParams,
} from '@/types/operations/activity'

/**
 * 活动管理API
 */
export const activityApi = {
  /**
   * 获取活动列表
   */
  getActivityList: (params: ActivityQueryParams): Promise<PageResponse<ActivityInfo>> => {
    return request.get('/api/v1/admin/operations/activity', { params })
  },

  /**
   * 获取活动详情
   */
  getActivityDetail: (id: number): Promise<ApiResponse<ActivityInfo>> => {
    return request.get(`/api/v1/admin/operations/activity/${id}`)
  },

  /**
   * 创建活动
   */
  createActivity: (data: ActivityFormData): Promise<ApiResponse<ActivityInfo>> => {
    return request.post('/api/v1/admin/operations/activity', data)
  },

  /**
   * 更新活动
   */
  updateActivity: (id: number, data: ActivityFormData): Promise<ApiResponse<ActivityInfo>> => {
    return request.put(`/api/v1/admin/operations/activity/${id}`, data)
  },

  /**
   * 删除活动
   */
  deleteActivity: (id: number): Promise<ApiResponse<void>> => {
    return request.delete(`/api/v1/admin/operations/activity/${id}`)
  },

  /**
   * 提前开始活动
   */
  startActivityEarly: (id: number): Promise<ApiResponse<void>> => {
    return request.post(`/api/v1/admin/operations/activity/${id}/start`)
  },

  /**
   * 提前结束活动
   */
  endActivityEarly: (id: number): Promise<ApiResponse<void>> => {
    return request.post(`/api/v1/admin/operations/activity/${id}/end`)
  },
}

/**
 * 报名管理API
 */
export const registrationApi = {
  /**
   * 获取报名记录列表
   */
  getRegistrationList: (params: RegistrationQueryParams): Promise<PageResponse<RegistrationInfo>> => {
    return request.get('/api/v1/admin/operations/registration', { params })
  },

  /**
   * 获取报名记录详情
   */
  getRegistrationDetail: (id: number): Promise<ApiResponse<RegistrationInfo>> => {
    return request.get(`/api/v1/admin/operations/registration/${id}`)
  },

  /**
   * 审核报名记录
   */
  auditRegistration: (data: AuditParams): Promise<ApiResponse<void>> => {
    return request.post('/api/v1/admin/operations/registration/audit', data)
  },

  /**
   * 批量审核通过
   */
  batchApproveRegistration: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.post('/api/v1/admin/operations/registration/batch-approve', { ids })
  },

  /**
   * 批量审核不通过
   */
  batchRejectRegistration: (ids: number[], comment: string): Promise<ApiResponse<void>> => {
    return request.post('/api/v1/admin/operations/registration/batch-reject', {
      ids,
      auditComment: comment
    })
  },
}
