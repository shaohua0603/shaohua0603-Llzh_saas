/**
 * 审批流程执行引擎 - API接口实现
 * 基于审批执行引擎实现RESTful API接口
 */

import request from '@/utils/request'
import ApprovalExecutionEngine from '@/services/approvalExecutionEngine'
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

// 获取审批执行引擎实例
const engine = ApprovalExecutionEngine.getInstance()

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
export const submitApproval = async (data: SubmitApprovalRequest) => {
  try {
    // 调用审批执行引擎
    const result = await engine.submitApproval(data)

    return request.post<ApiResponse<SubmitApprovalResponse>>('/approvals/submit', data)
  } catch (error) {
    console.error('提交审批失败:', error)
    throw error
  }
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
export const approveApproval = async (approvalId: number, data: ApprovalActionRequest) => {
  try {
    // 调用审批执行引擎
    const result = await engine.approve(data)

    return request.post<ApiResponse<ApprovalActionResponse>>(
      `/approvals/${approvalId}/approve`,
      data
    )
  } catch (error) {
    console.error('审批通过失败:', error)
    throw error
  }
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
export const rejectApproval = async (approvalId: number, data: ApprovalActionRequest) => {
  try {
    // 调用审批执行引擎
    const result = await engine.reject(data)

    return request.post<ApiResponse<ApprovalActionResponse>>(
      `/approvals/${approvalId}/reject`,
      data
    )
  } catch (error) {
    console.error('审批驳回失败:', error)
    throw error
  }
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
export const transferApproval = async (approvalId: number, data: ApprovalActionRequest) => {
  try {
    // 调用审批执行引擎
    const result = await engine.transfer(data)

    return request.post<ApiResponse<ApprovalActionResponse>>(
      `/approvals/${approvalId}/transfer`,
      data
    )
  } catch (error) {
    console.error('审批转交失败:', error)
    throw error
  }
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
export const delegateApproval = async (approvalId: number, data: ApprovalActionRequest) => {
  try {
    // 调用审批执行引擎
    const result = await engine.delegate(data)

    return request.post<ApiResponse<ApprovalActionResponse>>(
      `/approvals/${approvalId}/delegate`,
      data
    )
  } catch (error) {
    console.error('审批委派失败:', error)
    throw error
  }
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
export const getApprovalStatus = async (businessId: number, businessCode: string) => {
  try {
    return request.get<ApiResponse<ApprovalStatusResponse>>('/approvals/status', {
      params: { businessId, businessCode }
    })
  } catch (error) {
    console.error('查询审批状态失败:', error)
    throw error
  }
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
export const getApprovalRecords = async (businessId: number, businessCode: string) => {
  try {
    return request.get<ApiResponse<ApprovalRecord[]>>('/approvals/records', {
      params: { businessId, businessCode }
    })
  } catch (error) {
    console.error('查询审批记录失败:', error)
    throw error
  }
}

/**
 * 4.2 分页查询审批记录
 * GET /api/v1/approvals/records
 * 支持分页查询审批记录
 * 支持按业务代码、审批结果等条件筛选
 */
export const getApprovalRecordsPage = async (params: {
  page: number
  pageSize: number
  businessCode?: string
  approvalResult?: string
  approverId?: number
}) => {
  try {
    return request.get<PageResponse<ApprovalRecord>>('/approvals/records', { params })
  } catch (error) {
    console.error('分页查询审批记录失败:', error)
    throw error
  }
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
export const withdrawApproval = async (approvalId: number, data: WithdrawApprovalRequest) => {
  try {
    // 调用审批执行引擎
    await engine.withdrawApproval(approvalId, data)

    return request.post<ApiResponse<void>>(`/approvals/${approvalId}/withdraw`, data)
  } catch (error) {
    console.error('撤回审批失败:', error)
    throw error
  }
}

// ============================================
// 6. 辅助接口
// ============================================

/**
 * 6.1 获取我的待办审批列表
 * GET /api/v1/approvals/my-tasks
 * 获取当前用户的待办审批任务列表
 */
export const getMyApprovalTasks = async (params: {
  page: number
  pageSize: number
  taskStatus?: string
}) => {
  try {
    return request.get<PageResponse<any>>('/approvals/my-tasks', { params })
  } catch (error) {
    console.error('获取我的待办审批列表失败:', error)
    throw error
  }
}

/**
 * 6.2 获取我提交的审批列表
 * GET /api/v1/approvals/my-submissions
 * 获取当前用户提交的审批申请列表
 */
export const getMySubmissions = async (params: {
  page: number
  pageSize: number
  approvalStatus?: string
}) => {
  try {
    return request.get<PageResponse<any>>('/approvals/my-submissions', { params })
  } catch (error) {
    console.error('获取我提交的审批列表失败:', error)
    throw error
  }
}

/**
 * 6.3 获取审批详情
 * GET /api/v1/approvals/{approvalId}
 * 获取审批详情信息
 */
export const getApprovalDetail = async (approvalId: number) => {
  try {
    return request.get<ApiResponse<any>>(`/approvals/${approvalId}`)
  } catch (error) {
    console.error('获取审批详情失败:', error)
    throw error
  }
}

/**
 * 6.4 批量审批
 * POST /api/v1/approvals/batch-approve
 * 批量审批通过
 */
export const batchApprove = async (data: {
  approvalIds: number[]
  approvalComment?: string
}) => {
  try {
    return request.post<ApiResponse<{ successCount: number; failureCount: number }>>(
      '/approvals/batch-approve',
      data
    )
  } catch (error) {
    console.error('批量审批通过失败:', error)
    throw error
  }
}

/**
 * 6.5 批量驳回
 * POST /api/v1/approvals/batch-reject
 * 批量审批驳回
 */
export const batchReject = async (data: {
  approvalIds: number[]
  approvalComment?: string
}) => {
  try {
    return request.post<ApiResponse<{ successCount: number; failureCount: number }>>(
      '/approvals/batch-reject',
      data
    )
  } catch (error) {
    console.error('批量审批驳回失败:', error)
    throw error
  }
}

// ============================================
// 7. 异常处理接口
// ============================================

/**
 * 7.1 处理审批人离职
 * POST /api/v1/approvals/handle-resignation
 * 处理审批人离职时的待办任务转交
 */
export const handleApproverResignation = async (data: { userId: number }) => {
  try {
    await engine.handleApproverResignation(data.userId)
    return request.post<ApiResponse<void>>('/approvals/handle-resignation', data)
  } catch (error) {
    console.error('处理审批人离职失败:', error)
    throw error
  }
}

/**
 * 7.2 处理审批超时
 * POST /api/v1/approvals/handle-timeout
 * 处理审批超时任务
 */
export const handleApprovalTimeout = async (data: { taskId: number }) => {
  try {
    await engine.handleApprovalTimeout(data.taskId)
    return request.post<ApiResponse<void>>('/approvals/handle-timeout', data)
  } catch (error) {
    console.error('处理审批超时失败:', error)
    throw error
  }
}

/**
 * 7.3 处理流程配置错误
 * POST /api/v1/approvals/handle-flow-error
 * 处理流程配置错误
 */
export const handleFlowConfigError = async (data: { flowId: number }) => {
  try {
    await engine.handleFlowConfigError(data.flowId)
    return request.post<ApiResponse<void>>('/approvals/handle-flow-error', data)
  } catch (error) {
    console.error('处理流程配置错误失败:', error)
    throw error
  }
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
  batchReject,

  // 异常处理接口
  handleApproverResignation,
  handleApprovalTimeout,
  handleFlowConfigError
}
