/**
 * 审批执行功能API接口
 * 包含提交审批、审批操作、查询审批状态、查询审批记录、撤回审批等功能
 */

import request from '@/utils/request'
import type {
  SubmitApprovalRequest,
  SubmitApprovalResponse,
  ApprovalActionRequest,
  ApprovalActionResponse,
  ApprovalStatusResponse,
  ApprovalRecord,
  WithdrawApprovalRequest
} from '@/types/flow-config'
import type { ApiResponse, PageResponse } from '@/types/response'

// ============================================
// 1. 提交审批接口
// ============================================

/**
 * 1.1 提交审批
 * POST /api/v1/approvals/submit
 * 业务提交时触发审批流程
 * 查询流程配置，判断是否需要审批
 * 创建审批状态记录
 * 生成第一个节点的待办任务
 * 返回审批状态和待办任务信息
 */
export const submitApproval = (data: SubmitApprovalRequest) => {
  return request.post<ApiResponse<SubmitApprovalResponse>>('/approvals/submit', data)
}

// ============================================
// 2. 审批操作接口
// ============================================

/**
 * 2.1 审批通过
 * POST /api/v1/approvals/{approvalId}/approve
 * 支持审批通过操作
 * 验证审批人权限
 * 记录审批操作历史
 * 根据审批结果更新审批状态
 * 如果通过且不是最后一个节点，生成下一节点待办任务
 * 如果通过且是最后一个节点，完成审批流程
 * 返回更新后的审批状态和审批记录
 */
export const approveApproval = (approvalId: number, data: ApprovalActionRequest) => {
  return request.post<ApiResponse<ApprovalActionResponse>>(`/approvals/${approvalId}/approve`, data)
}

/**
 * 2.2 审批驳回
 * POST /api/v1/approvals/{approvalId}/reject
 * 支持审批驳回操作
 * 验证审批人权限
 * 记录审批操作历史
 * 根据审批结果更新审批状态
 * 驳回时终止审批流程
 * 返回更新后的审批状态和审批记录
 */
export const rejectApproval = (approvalId: number, data: ApprovalActionRequest) => {
  return request.post<ApiResponse<ApprovalActionResponse>>(`/approvals/${approvalId}/reject`, data)
}

/**
 * 2.3 审批转交
 * POST /api/v1/approvals/{approvalId}/transfer
 * 支持审批转交操作
 * 验证审批人权限
 * 记录审批操作历史
 * 将审批任务转交给其他审批人
 * 返回更新后的审批状态和审批记录
 */
export const transferApproval = (approvalId: number, data: ApprovalActionRequest) => {
  return request.post<ApiResponse<ApprovalActionResponse>>(`/approvals/${approvalId}/transfer`, data)
}

/**
 * 2.4 审批委派
 * POST /api/v1/approvals/{approvalId}/delegate
 * 支持审批委派操作
 * 验证审批人权限
 * 记录审批操作历史
 * 将审批任务委派给其他审批人
 * 返回更新后的审批状态和审批记录
 */
export const delegateApproval = (approvalId: number, data: ApprovalActionRequest) => {
  return request.post<ApiResponse<ApprovalActionResponse>>(`/approvals/${approvalId}/delegate`, data)
}

// ============================================
// 3. 查询审批状态接口
// ============================================

/**
 * 3.1 查询审批状态
 * GET /api/v1/approvals/status/{businessId}
 * 查询业务的审批状态
 * 返回审批状态信息，包括当前节点、当前审批人、审批记录列表
 */
export const getApprovalStatus = (businessId: number, businessCode: string) => {
  return request.get<ApiResponse<ApprovalStatusResponse>>('/approvals/status', {
    params: { businessId, businessCode }
  })
}

// ============================================
// 4. 查询审批记录接口
// ============================================

/**
 * 4.1 查询审批记录
 * GET /api/v1/approvals/records/{businessId}
 * 查询业务的审批记录
 * 支持分页查询
 * 返回审批记录列表
 */
export const getApprovalRecords = (businessId: number, businessCode: string) => {
  return request.get<ApiResponse<ApprovalRecord[]>>('/approvals/records', {
    params: { businessId, businessCode }
  })
}

/**
 * 4.2 分页查询审批记录
 * GET /api/v1/approvals/records
 * 支持分页查询审批记录
 * 支持按业务代码、审批结果等条件筛选
 */
export const getApprovalRecordsPage = (params: {
  page: number
  pageSize: number
  businessCode?: string
  approvalResult?: string
  approverId?: number
}) => {
  return request.get<PageResponse<ApprovalRecord>>('/approvals/records', { params })
}

// ============================================
// 5. 撤回审批接口
// ============================================

/**
 * 5.1 撤回审批
 * POST /api/v1/approvals/{approvalId}/withdraw
 * 申请人撤回审批申请
 * 验证申请人权限
 * 更新审批状态为已撤回
 * 删除待办任务
 * 返回撤回结果
 */
export const withdrawApproval = (approvalId: number, data: WithdrawApprovalRequest) => {
  return request.post<ApiResponse<void>>(`/approvals/${approvalId}/withdraw`, data)
}

// ============================================
// 6. 辅助接口
// ============================================

/**
 * 6.1 获取我的待办审批列表
 * GET /api/v1/approvals/my-tasks
 * 获取当前用户的待办审批任务列表
 */
export const getMyApprovalTasks = (params: {
  page: number
  pageSize: number
  taskStatus?: string
}) => {
  return request.get<PageResponse<any>>('/approvals/my-tasks', { params })
}

/**
 * 6.2 获取我提交的审批列表
 * GET /api/v1/approvals/my-submissions
 * 获取当前用户提交的审批申请列表
 */
export const getMySubmissions = (params: {
  page: number
  pageSize: number
  approvalStatus?: string
}) => {
  return request.get<PageResponse<any>>('/approvals/my-submissions', { params })
}

/**
 * 6.3 获取审批详情
 * GET /api/v1/approvals/{approvalId}
 * 获取审批详情信息
 */
export const getApprovalDetail = (approvalId: number) => {
  return request.get<ApiResponse<any>>(`/approvals/${approvalId}`)
}

/**
 * 6.4 批量审批
 * POST /api/v1/approvals/batch-approve
 * 批量审批通过
 */
export const batchApprove = (data: {
  approvalIds: number[]
  approvalComment?: string
}) => {
  return request.post<ApiResponse<{ successCount: number; failureCount: number }>>('/approvals/batch-approve', data)
}

/**
 * 6.5 批量驳回
 * POST /api/v1/approvals/batch-reject
 * 批量审批驳回
 */
export const batchReject = (data: {
  approvalIds: number[]
  approvalComment?: string
}) => {
  return request.post<ApiResponse<{ successCount: number; failureCount: number }>>('/approvals/batch-reject', data)
}

// ============================================
// 导出所有接口
// ============================================

export default {
  // 提交审批
  submitApproval,

  // 审批操作
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval,

  // 查询审批状态
  getApprovalStatus,

  // 查询审批记录
  getApprovalRecords,
  getApprovalRecordsPage,

  // 撤回审批
  withdrawApproval,

  // 辅助接口
  getMyApprovalTasks,
  getMySubmissions,
  getApprovalDetail,
  batchApprove,
  batchReject
}
