/**
 * 审批相关API
 */

import request from '@/utils/request'
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

/**
 * 审批通过
 * @param data 审批表单数据
 */
export const approveApproval = (data: ApprovalFormData) => {
  return request({
    url: '/api/v1/approval/approve',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 审批驳回
 * @param data 审批表单数据
 */
export const rejectApproval = (data: ApprovalFormData) => {
  return request({
    url: '/api/v1/approval/reject',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 审批转办
 * @param data 转办表单数据
 */
export const transferApproval = (data: TransferFormData) => {
  return request({
    url: '/api/v1/approval/transfer',
    method: 'post',
    data
  })
}

/**
 * 审批委派
 * @param data 委派表单数据
 */
export const delegateApproval = (data: DelegateFormData) => {
  return request({
    url: '/api/v1/approval/delegate',
    method: 'post',
    data
  })
}

/**
 * 获取审批记录
 * @param params 查询参数
 */
export const getApprovalRecords = (params: ApprovalRecordsQuery) => {
  return request<ApprovalRecord[]>({
    url: '/api/v1/approval/records',
    method: 'get',
    params
  })
}

/**
 * 获取审批状态
 * @param params 查询参数
 */
export const getApprovalStatus = (params: ApprovalStatusQuery) => {
  return request<ApprovalStatus>({
    url: '/api/v1/approval/status',
    method: 'get',
    params
  })
}

/**
 * 获取审批历史
 * @param params 查询参数
 */
export const getApprovalHistory = (params: ApprovalRecordsQuery) => {
  return request<ApprovalRecord[]>({
    url: '/api/v1/approval/history',
    method: 'get',
    params
  })
}

/**
 * 撤回审批
 * @param businessId 业务ID
 * @param businessType 业务类型
 */
export const withdrawApproval = (businessId: string, businessType: string) => {
  return request({
    url: '/api/v1/approval/withdraw',
    method: 'post',
    data: { businessId, businessType }
  })
}

/**
 * 获取待审批列表
 * @param params 查询参数
 */
export const getPendingApprovalList = (params?: any) => {
  return request({
    url: '/api/v1/approval/pending',
    method: 'get',
    params
  })
}

/**
 * 获取已审批列表
 * @param params 查询参数
 */
export const getApprovedApprovalList = (params?: any) => {
  return request({
    url: '/api/v1/approval/approved',
    method: 'get',
    params
  })
}

/**
 * 批量审批
 * @param data 批量审批数据
 */
export const batchApprove = (data: {
  businessIds: string[]
  businessType: string
  comment?: string
}) => {
  return request({
    url: '/api/v1/approval/batch-approve',
    method: 'post',
    data
  })
}

/**
 * 批量驳回
 * @param data 批量驳回数据
 */
export const batchReject = (data: {
  businessIds: string[]
  businessType: string
  rejectReason: string
  comment?: string
}) => {
  return request({
    url: '/api/v1/approval/batch-reject',
    method: 'post',
    data
  })
}
