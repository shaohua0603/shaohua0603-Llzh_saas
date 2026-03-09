/**
 * 审批执行功能API接口
 * 包含提交审批、审批操作、查询审批状态、查询审批记录、撤回审批等功能
 */

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

// Mock数据
const mockApprovalRecords: ApprovalRecord[] = [
  {
    id: 1,
    approvalId: 1,
    nodeId: 1,
    nodeName: '部门经理审批',
    approverId: 'EMP001',
    approverName: '张三',
    approvalTime: new Date().toISOString(),
    approvalResult: 'approved',
    approvalComment: '同意',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    approvalId: 1,
    nodeId: 2,
    nodeName: '总经理审批',
    approverId: 'EMP002',
    approverName: '李四',
    approvalTime: new Date().toISOString(),
    approvalResult: 'approved',
    approvalComment: '同意',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockApprovalTasks = [
  {
    id: 1,
    approvalId: 1,
    taskId: 'TASK001',
    businessId: 1,
    businessCode: 'LEAVE',
    businessName: '请假申请',
    currentNodeId: 1,
    currentNodeName: '部门经理审批',
    assigneeId: 'EMP001',
    assigneeName: '张三',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
]

const mockSubmissions = [
  {
    id: 1,
    approvalId: 1,
    businessId: 1,
    businessCode: 'LEAVE',
    businessName: '请假申请',
    applicantId: 'EMP003',
    applicantName: '王五',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      approvalId: 1,
      status: 'pending',
      taskId: 'TASK001'
    } as SubmitApprovalResponse,
    timestamp: Date.now()
  } as ApiResponse<SubmitApprovalResponse>
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
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      approvalId: approvalId,
      status: 'completed',
      records: mockApprovalRecords
    } as ApprovalActionResponse,
    timestamp: Date.now()
  } as ApiResponse<ApprovalActionResponse>
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
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      approvalId: approvalId,
      status: 'rejected',
      records: mockApprovalRecords
    } as ApprovalActionResponse,
    timestamp: Date.now()
  } as ApiResponse<ApprovalActionResponse>
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
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      approvalId: approvalId,
      status: 'pending',
      records: mockApprovalRecords
    } as ApprovalActionResponse,
    timestamp: Date.now()
  } as ApiResponse<ApprovalActionResponse>
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
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      approvalId: approvalId,
      status: 'pending',
      records: mockApprovalRecords
    } as ApprovalActionResponse,
    timestamp: Date.now()
  } as ApiResponse<ApprovalActionResponse>
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
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: {
      approvalId: 1,
      businessId: businessId,
      businessCode: businessCode,
      status: 'completed',
      currentNodeId: 2,
      currentNodeName: '总经理审批',
      currentApproverId: 'EMP002',
      currentApproverName: '李四',
      records: mockApprovalRecords
    } as ApprovalStatusResponse,
    timestamp: Date.now()
  } as ApiResponse<ApprovalStatusResponse>
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
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: mockApprovalRecords,
    timestamp: Date.now()
  } as ApiResponse<ApprovalRecord[]>
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
  await delay(300)
  let filteredData = [...mockApprovalRecords]
  
  if (params.businessCode) {
    // 模拟按业务代码筛选
  }
  
  if (params.approvalResult) {
    filteredData = filteredData.filter(item => item.approvalResult === params.approvalResult)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as PageResponse<ApprovalRecord>
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
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
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
  await delay(300)
  let filteredData = [...mockApprovalTasks]
  
  if (params.taskStatus) {
    filteredData = filteredData.filter(item => item.status === params.taskStatus)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as PageResponse<any>
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
  await delay(300)
  let filteredData = [...mockSubmissions]
  
  if (params.approvalStatus) {
    filteredData = filteredData.filter(item => item.status === params.approvalStatus)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as PageResponse<any>
}

/**
 * 6.3 获取审批详情
 * GET /api/v1/approvals/{approvalId}
 * 获取审批详情信息
 */
export const getApprovalDetail = async (approvalId: number) => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: {
      id: approvalId,
      businessId: 1,
      businessCode: 'LEAVE',
      businessName: '请假申请',
      applicantId: 'EMP003',
      applicantName: '王五',
      status: 'completed',
      currentNodeId: 2,
      currentNodeName: '总经理审批',
      records: mockApprovalRecords,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    timestamp: Date.now()
  } as ApiResponse<any>
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
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: data.approvalIds.length,
      failureCount: 0
    },
    timestamp: Date.now()
  } as ApiResponse<{ successCount: number; failureCount: number }>
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
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: data.approvalIds.length,
      failureCount: 0
    },
    timestamp: Date.now()
  } as ApiResponse<{ successCount: number; failureCount: number }>
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
