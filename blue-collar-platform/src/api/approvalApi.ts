/**
 * 审批相关API
 */

import type { ApprovalRecord, ApprovalStatus } from '@/types/approval-flow'

/**
 * 审批表单数据
 */
export interface ApprovalFormData {
  /** 业务ID */
  businessId: string
  /** 业务类型 */
  businessType: string
  /** 审批结果 */
  result: 'approved' | 'rejected'
  /** 审批意见 */
  comment?: string
  /** 驳回原因 */
  rejectReason?: string
  /** 附件列表 */
  attachments?: File[]
}

/**
 * 转办表单数据
 */
export interface TransferFormData {
  /** 业务ID */
  businessId: string
  /** 业务类型 */
  businessType: string
  /** 转办人ID */
  toUser: string
  /** 转办说明 */
  remark?: string
}

/**
 * 委派表单数据
 */
export interface DelegateFormData {
  /** 业务ID */
  businessId: string
  /** 业务类型 */
  businessType: string
  /** 委派人ID */
  toUser: string
  /** 委派说明 */
  remark?: string
}

/**
 * 审批记录查询参数
 */
export interface ApprovalRecordsQuery {
  /** 业务ID */
  businessId: string
  /** 业务类型 */
  businessType: string
}

/**
 * 审批状态查询参数
 */
export interface ApprovalStatusQuery {
  /** 业务ID */
  businessId: string
  /** 业务类型 */
  businessType: string
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockApprovalRecords: ApprovalRecord[] = [
  {
    nodeId: '1',
    nodeName: '部门经理审批',
    approver: '张三',
    approvalTime: '2024-01-01 10:00:00',
    approvalResult: 'approved',
    approvalComment: '同意'
  },
  {
    nodeId: '2',
    nodeName: '总经理审批',
    approver: '李四',
    approvalTime: '2024-01-01 11:00:00',
    approvalResult: 'approved',
    approvalComment: '同意'
  }
]

const mockApprovalStatus: ApprovalStatus = {
  status: 'approved',
  currentNode: '总经理审批',
  nextNodes: [],
  history: mockApprovalRecords
}

const mockPendingApprovals = [
  {
    id: '1',
    businessId: 'REQ001',
    businessType: 'leave',
    title: '请假申请',
    applicant: '王五',
    applyTime: '2024-01-01 09:00:00',
    currentNode: '部门经理审批',
    status: 'pending'
  },
  {
    id: '2',
    businessId: 'REQ002',
    businessType: 'transfer',
    title: '调岗申请',
    applicant: '赵六',
    applyTime: '2024-01-01 09:30:00',
    currentNode: '部门经理审批',
    status: 'pending'
  }
]

const mockApprovedApprovals = [
  {
    id: '3',
    businessId: 'REQ003',
    businessType: 'leave',
    title: '请假申请',
    applicant: '孙七',
    applyTime: '2023-12-31 10:00:00',
    approveTime: '2023-12-31 11:00:00',
    status: 'approved'
  }
]

/**
 * 审批通过
 * @param data 审批表单数据
 */
export const approveApproval = async (data: ApprovalFormData) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 审批驳回
 * @param data 审批表单数据
 */
export const rejectApproval = async (data: ApprovalFormData) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 审批转办
 * @param data 转办表单数据
 */
export const transferApproval = async (data: TransferFormData) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 审批委派
 * @param data 委派表单数据
 */
export const delegateApproval = async (data: DelegateFormData) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 获取审批记录
 * @param params 查询参数
 */
export const getApprovalRecords = async (params: ApprovalRecordsQuery) => {
  await delay(300)
  return {
    code: 200,
    message: '成功',
    data: mockApprovalRecords,
    timestamp: Date.now()
  }
}

/**
 * 获取审批状态
 * @param params 查询参数
 */
export const getApprovalStatus = async (params: ApprovalStatusQuery) => {
  await delay(300)
  return {
    code: 200,
    message: '成功',
    data: mockApprovalStatus,
    timestamp: Date.now()
  }
}

/**
 * 获取审批历史
 * @param params 查询参数
 */
export const getApprovalHistory = async (params: ApprovalRecordsQuery) => {
  await delay(300)
  return {
    code: 200,
    message: '成功',
    data: mockApprovalRecords,
    timestamp: Date.now()
  }
}

/**
 * 撤回审批
 * @param businessId 业务ID
 * @param businessType 业务类型
 */
export const withdrawApproval = async (businessId: string, businessType: string) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 获取待审批列表
 * @param params 查询参数
 */
export const getPendingApprovalList = async (params?: any) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: {
      list: mockPendingApprovals,
      total: mockPendingApprovals.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 10
    },
    timestamp: Date.now()
  }
}

/**
 * 获取已审批列表
 * @param params 查询参数
 */
export const getApprovedApprovalList = async (params?: any) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: {
      list: mockApprovedApprovals,
      total: mockApprovedApprovals.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 10
    },
    timestamp: Date.now()
  }
}

/**
 * 批量审批
 * @param data 批量审批数据
 */
export const batchApprove = async (data: {
  businessIds: string[]
  businessType: string
  comment?: string
}) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 批量驳回
 * @param data 批量驳回数据
 */
export const batchReject = async (data: {
  businessIds: string[]
  businessType: string
  rejectReason: string
  comment?: string
}) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}
