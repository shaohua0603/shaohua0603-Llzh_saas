import request from '@/utils/request'
import type {
  Recruitment,
  RecruitmentDetail,
  RecruitmentQueryParams,
  RecruitmentFormData,
  Resume,
  ResumeDetail,
  ResumeQueryParams,
  ResumeFormData
} from '@/types/recruitmentTypes'
import type { PageResponse } from '@/types/response'

/**
 * 获取招聘需求列表
 * @param params 查询参数
 */
export const getRecruitmentList = (params: RecruitmentQueryParams) => {
  return request.get<PageResponse<Recruitment>>('/recruitment/requirements', { params })
}

/**
 * 获取招聘需求详情
 * @param id 招聘需求ID
 */
export const getRecruitmentDetail = (id: string) => {
  return request.get<RecruitmentDetail>(`/recruitment/requirements/${id}`)
}

/**
 * 创建招聘需求
 * @param data 招聘需求数据
 */
export const createRecruitment = (data: RecruitmentFormData) => {
  return request.post<Recruitment>('/recruitment/requirements', data)
}

/**
 * 更新招聘需求
 * @param id 招聘需求ID
 * @param data 招聘需求数据
 */
export const updateRecruitment = (id: string, data: RecruitmentFormData) => {
  return request.put<Recruitment>(`/recruitment/requirements/${id}`, data)
}

/**
 * 删除招聘需求
 * @param id 招聘需求ID
 */
export const deleteRecruitment = (id: string) => {
  return request.delete<void>(`/recruitment/requirements/${id}`)
}

/**
 * 批量删除招聘需求
 * @param ids 招聘需求ID数组
 */
export const batchDeleteRecruitments = (ids: string[]) => {
  return request.delete<void>('/recruitment/requirements/batch', { data: { ids } })
}

/**
 * 发布招聘需求
 * @param id 招聘需求ID
 */
export const publishRecruitment = (id: string) => {
  return request.put<Recruitment>(`/recruitment/requirements/${id}/publish`)
}

/**
 * 暂停招聘需求
 * @param id 招聘需求ID
 */
export const pauseRecruitment = (id: string) => {
  return request.put<Recruitment>(`/recruitment/requirements/${id}/pause`)
}

/**
 * 恢复招聘需求
 * @param id 招聘需求ID
 */
export const resumeRecruitment = (id: string) => {
  return request.put<Recruitment>(`/recruitment/requirements/${id}/resume`)
}

/**
 * 完成招聘需求
 * @param id 招聘需求ID
 */
export const completeRecruitment = (id: string) => {
  return request.put<Recruitment>(`/recruitment/requirements/${id}/complete`)
}

/**
 * 取消招聘需求
 * @param id 招聘需求ID
 */
export const cancelRecruitment = (id: string) => {
  return request.put<Recruitment>(`/recruitment/requirements/${id}/cancel`)
}

/**
 * 导出招聘需求列表
 * @param params 查询参数
 */
export const exportRecruitments = (params: RecruitmentQueryParams) => {
  return request.get('/recruitment/requirements/export', { params, responseType: 'blob' })
}

/**
 * 获取简历列表
 * @param params 查询参数
 */
export const getResumeList = (params: ResumeQueryParams) => {
  return request.get<PageResponse<Resume>>('/recruitment/resumes', { params })
}

/**
 * 获取简历详情
 * @param id 简历ID
 */
export const getResumeDetail = (id: string) => {
  return request.get<ResumeDetail>(`/recruitment/resumes/${id}`)
}

/**
 * 创建简历
 * @param data 简历数据
 */
export const createResume = (data: ResumeFormData) => {
  return request.post<Resume>('/recruitment/resumes', data)
}

/**
 * 更新简历
 * @param id 简历ID
 * @param data 简历数据
 */
export const updateResume = (id: string, data: ResumeFormData) => {
  return request.put<Resume>(`/recruitment/resumes/${id}`, data)
}

/**
 * 删除简历
 * @param id 简历ID
 */
export const deleteResume = (id: string) => {
  return request.delete<void>(`/recruitment/resumes/${id}`)
}

/**
 * 批量删除简历
 * @param ids 简历ID数组
 */
export const batchDeleteResumes = (ids: string[]) => {
  return request.delete<void>('/recruitment/resumes/batch', { data: { ids } })
}

/**
 * 审核简历
 * @param id 简历ID
 * @param data 审核数据
 */
export const reviewResume = (id: string, data: {
  status: 'approved' | 'rejected';
  reviewComment?: string;
}) => {
  return request.put<Resume>(`/recruitment/resumes/${id}/review`, data)
}

/**
 * 安排面试
 * @param id 简历ID
 * @param data 面试数据
 */
export const scheduleInterview = (id: string, data: {
  interviewType: string;
  interviewTime: string;
  interviewer: string;
  interviewLocation?: string;
  remark?: string;
}) => {
  return request.post<void>(`/recruitment/resumes/${id}/interview`, data)
}

/**
 * 录用简历
 * @param id 简历ID
 * @param data 录用数据
 */
export const hireResume = (id: string, data: {
  hireDate: string;
  salary?: string;
  remark?: string;
}) => {
  return request.put<Resume>(`/recruitment/resumes/${id}/hire`, data)
}

/**
 * 拒绝简历
 * @param id 简历ID
 * @param data 拒绝数据
 */
export const rejectResume = (id: string, data: {
  rejectReason: string;
}) => {
  return request.put<Resume>(`/recruitment/resumes/${id}/reject`, data)
}

/**
 * 导出简历列表
 * @param params 查询参数
 */
export const exportResumes = (params: ResumeQueryParams) => {
  return request.get('/recruitment/resumes/export', { params, responseType: 'blob' })
}

/**
 * 获取工厂下拉选项
 */
export const getFactoryOptions = () => {
  return request.get('/system/factories/options')
}

/**
 * 获取劳务公司下拉选项
 */
export const getLaborCompanyOptions = () => {
  return request.get('/system/labor-companies/options')
}

/**
 * 获取岗位下拉选项
 */
export const getPositionOptions = () => {
  return request.get('/system/positions/options')
}
