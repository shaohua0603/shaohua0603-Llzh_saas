/**
 * 流程配置功能API接口
 * 包含流程管理、流程配置、审批执行、待办任务四类共14个接口
 */

import request from '@/utils/request'
import type {
  ApprovalFlow,
  ApprovalFlowQueryParams,
  ApprovalFlowForm,
  FlowBusinessConfig,
  FlowConfigQueryParams,
  FlowConfigForm,
  ApprovalRecord,
  ApprovalRecordQueryParams,
  TodoTask,
  TodoTaskQueryParams,
  SubmitApprovalRequest,
  SubmitApprovalResponse,
  ApprovalActionRequest,
  ApprovalActionResponse,
  ApiResponse,
  PageResponse,
  ApprovalFlowListResponse,
  ApprovalFlowDetailResponse,
  FlowConfigListResponse,
  ApprovalRecordsResponse,
  TodoTaskListResponse,
  ApprovalStatusResponse
} from '@/types/flow-config'

// ============================================
// 1. 流程管理接口（6个）
// ============================================

/**
 * 1.1 获取流程列表
 * GET /api/v1/approval-flows
 */
export const getApprovalFlowList = (params: ApprovalFlowQueryParams) => {
  return request.get<PageResponse<ApprovalFlow>>('/approval-flows', { params })
}

/**
 * 1.2 获取流程详情
 * GET /api/v1/approval-flows/{id}
 */
export const getApprovalFlowDetail = (id: number) => {
  return request.get<ApprovalFlow>(`/approval-flows/${id}`)
}

/**
 * 1.3 创建流程
 * POST /api/v1/approval-flows
 */
export const createApprovalFlow = (data: ApprovalFlowForm) => {
  return request.post<ApprovalFlow>('/approval-flows', data)
}

/**
 * 1.4 更新流程
 * PUT /api/v1/approval-flows/{id}
 */
export const updateApprovalFlow = (id: number, data: ApprovalFlowForm) => {
  return request.put<ApprovalFlow>(`/approval-flows/${id}`, data)
}

/**
 * 1.5 删除流程
 * DELETE /api/v1/approval-flows/{id}
 */
export const deleteApprovalFlow = (id: number) => {
  return request.delete<void>(`/approval-flows/${id}`)
}

/**
 * 1.6 启用/停用流程
 * PUT /api/v1/approval-flows/{id}/status
 */
export const updateApprovalFlowStatus = (id: number, flowStatus: string) => {
  return request.put<void>(`/approval-flows/${id}/status`, { flowStatus })
}

/**
 * 检查流程编码是否重复
 * GET /api/v1/approval-flows/check-code
 */
export const checkFlowCode = (flowCode: string, id?: number) => {
  return request.get<boolean>('/approval-flows/check-code', {
    params: { flowCode, id }
  })
}

// ============================================
// 2. 流程配置接口（4个）
// ============================================

/**
 * 2.1 获取流程配置列表
 * GET /api/v1/flow-configs
 */
export const getFlowConfigList = (params: FlowConfigQueryParams) => {
  return request.get<PageResponse<FlowBusinessConfig>>('/flow-configs', { params })
}

/**
 * 2.2 创建流程配置
 * POST /api/v1/flow-configs
 */
export const createFlowConfig = (data: FlowConfigForm) => {
  return request.post<FlowBusinessConfig>('/flow-configs', data)
}

/**
 * 2.3 更新流程配置
 * PUT /api/v1/flow-configs/{id}
 */
export const updateFlowConfig = (id: number, data: FlowConfigForm) => {
  return request.put<FlowBusinessConfig>(`/flow-configs/${id}`, data)
}

/**
 * 2.4 删除流程配置
 * DELETE /api/v1/flow-configs/{id}
 */
export const deleteFlowConfig = (id: number) => {
  return request.delete<void>(`/flow-configs/${id}`)
}

/**
 * 根据业务代码获取流程配置
 * GET /api/v1/flow-configs/business/{businessCode}
 */
export const getFlowConfigByBusiness = (businessCode: string) => {
  return request.get<FlowBusinessConfig>(`/flow-configs/business/${businessCode}`)
}

// ============================================
// 3. 审批执行接口（4个）
// ============================================

/**
 * 3.1 提交审批
 * POST /api/v1/approvals/submit
 */
export const submitApproval = (data: SubmitApprovalRequest) => {
  return request.post<SubmitApprovalResponse>('/approvals/submit', data)
}

/**
 * 3.2 审批通过
 * POST /api/v1/approvals/approve
 */
export const approveApproval = (data: ApprovalActionRequest) => {
  return request.post<ApprovalActionResponse>('/approvals/approve', data)
}

/**
 * 3.3 审批驳回
 * POST /api/v1/approvals/reject
 */
export const rejectApproval = (data: ApprovalActionRequest) => {
  return request.post<ApprovalActionResponse>('/approvals/reject', data)
}

/**
 * 3.4 获取审批记录
 * GET /api/v1/approvals/records
 */
export const getApprovalRecords = (params: ApprovalRecordQueryParams) => {
  return request.get<ApprovalRecord[]>('/approvals/records', { params })
}

/**
 * 获取业务审批状态
 * GET /api/v1/approvals/status
 */
export const getApprovalStatus = (businessCode: string, businessId: number) => {
  return request.get<any>('/approvals/status', {
    params: { businessCode, businessId }
  })
}

/**
 * 审批转办
 * POST /api/v1/approvals/transfer
 */
export const transferApproval = (data: ApprovalActionRequest) => {
  return request.post<ApprovalActionResponse>('/approvals/transfer', data)
}

/**
 * 审批委派
 * POST /api/v1/approvals/delegate
 */
export const delegateApproval = (data: ApprovalActionRequest) => {
  return request.post<ApprovalActionResponse>('/approvals/delegate', data)
}

/**
 * 取消审批
 * POST /api/v1/approvals/cancel
 */
export const cancelApproval = (businessCode: string, businessId: number, cancelReason: string) => {
  return request.post<void>('/approvals/cancel', {
    businessCode,
    businessId,
    cancelReason
  })
}

// ============================================
// 4. 待办任务接口（1个）
// ============================================

/**
 * 4.1 获取待办任务列表
 * GET /api/v1/todo-tasks
 */
export const getTodoTaskList = (params: TodoTaskQueryParams) => {
  return request.get<PageResponse<TodoTask>>('/todo-tasks', { params })
}

/**
 * 获取待办任务统计
 * GET /api/v1/todo-tasks/statistics
 */
export const getTodoTaskStatistics = () => {
  return request.get<any>('/todo-tasks/statistics')
}

/**
 * 标记任务为已读
 * PUT /api/v1/todo-tasks/{id}/read
 */
export const markTaskAsRead = (id: number) => {
  return request.put<void>(`/todo-tasks/${id}/read`)
}

/**
 * 批量标记任务为已读
 * PUT /api/v1/todo-tasks/batch-read
 */
export const batchMarkTasksAsRead = (ids: number[]) => {
  return request.put<void>('/todo-tasks/batch-read', { ids })
}

/**
 * 完成任务
 * PUT /api/v1/todo-tasks/{id}/complete
 */
export const completeTask = (id: number) => {
  return request.put<void>(`/todo-tasks/${id}/complete`)
}

// ============================================
// 5. 辅助接口
// ============================================

/**
 * 获取可用的审批流程列表（用于流程配置选择）
 * GET /api/v1/approval-flows/available
 */
export const getAvailableApprovalFlows = (flowType?: string) => {
  return request.get<ApprovalFlow[]>('/approval-flows/available', {
    params: { flowType }
  })
}

/**
 * 获取业务代码列表（用于流程配置）
 * GET /api/v1/flow-configs/business-codes
 */
export const getBusinessCodes = () => {
  return request.get<any[]>('/flow-configs/business-codes')
}

/**
 * 获取流程节点列表
 * GET /api/v1/approval-flows/{id}/nodes
 */
export const getFlowNodes = (flowId: number) => {
  return request.get<any[]>(`/approval-flows/${flowId}/nodes`)
}

/**
 * 验证流程配置
 * POST /api/v1/approval-flows/validate
 */
export const validateFlowConfig = (data: ApprovalFlowForm) => {
  return request.post<{ valid: boolean; errors?: string[] }>('/approval-flows/validate', data)
}

// ============================================
// 导出所有接口
// ============================================

export default {
  // 流程管理
  getApprovalFlowList,
  getApprovalFlowDetail,
  createApprovalFlow,
  updateApprovalFlow,
  deleteApprovalFlow,
  updateApprovalFlowStatus,
  checkFlowCode,

  // 流程配置
  getFlowConfigList,
  createFlowConfig,
  updateFlowConfig,
  deleteFlowConfig,
  getFlowConfigByBusiness,

  // 审批执行
  submitApproval,
  approveApproval,
  rejectApproval,
  getApprovalRecords,
  getApprovalStatus,
  transferApproval,
  delegateApproval,
  cancelApproval,

  // 待办任务
  getTodoTaskList,
  getTodoTaskStatistics,
  markTaskAsRead,
  batchMarkTasksAsRead,
  completeTask,

  // 辅助接口
  getAvailableApprovalFlows,
  getBusinessCodes,
  getFlowNodes,
  validateFlowConfig
}
