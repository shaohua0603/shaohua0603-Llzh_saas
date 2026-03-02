import request from '@/utils/request'
import type {
  JobReferral,
  JobReferralQueryParams,
  CommissionPayment,
  CommissionPaymentQueryParams,
  CommissionPaymentFormData,
  ReferralReward,
  ReferralRewardQueryParams,
  ReferralRewardFormData,
  CommissionRule,
  CommissionRuleFormData
} from '@/types/settlementTypes'
import type { PageResponse } from '@/types/response'

/**
 * 获取工作转介绍列表
 * @param params 查询参数
 */
export const getJobReferralList = (params: JobReferralQueryParams) => {
  return request.get<PageResponse<JobReferral>>('/settlement/job-referral', { params })
}

/**
 * 获取工作转介绍详情
 * @param id 转介绍记录ID
 */
export const getJobReferralDetail = (id: string) => {
  return request.get<JobReferral>(`/settlement/job-referral/${id}`)
}

/**
 * 获取佣金发放列表
 * @param params 查询参数
 */
export const getCommissionPaymentList = (params: CommissionPaymentQueryParams) => {
  return request.get<PageResponse<CommissionPayment>>('/settlement/commission-payment', { params })
}

/**
 * 获取佣金发放详情
 * @param id 发放记录ID
 */
export const getCommissionPaymentDetail = (id: string) => {
  return request.get<CommissionPayment>(`/settlement/commission-payment/${id}`)
}

/**
 * 发放佣金
 * @param data 发放数据
 */
export const payCommission = (data: CommissionPaymentFormData) => {
  return request.post<void>('/settlement/commission-payment/pay', data)
}

/**
 * 批量发放佣金
 * @param data 批量发放数据
 */
export const batchPayCommission = (data: CommissionPaymentFormData) => {
  return request.post<void>('/settlement/commission-payment/batch-pay', data)
}

/**
 * 获取拉新奖励列表
 * @param params 查询参数
 */
export const getReferralRewardList = (params: ReferralRewardQueryParams) => {
  return request.get<PageResponse<ReferralReward>>('/settlement/referral-reward', { params })
}

/**
 * 获取拉新奖励详情
 * @param id 奖励记录ID
 */
export const getReferralRewardDetail = (id: string) => {
  return request.get<ReferralReward>(`/settlement/referral-reward/${id}`)
}

/**
 * 发放拉新奖励
 * @param data 发放数据
 */
export const payReferralReward = (data: ReferralRewardFormData) => {
  return request.post<void>('/settlement/referral-reward/pay', data)
}

/**
 * 批量发放拉新奖励
 * @param data 批量发放数据
 */
export const batchPayReferralReward = (data: ReferralRewardFormData) => {
  return request.post<void>('/settlement/referral-reward/batch-pay', data)
}

/**
 * 获取佣金规则配置
 */
export const getCommissionRule = () => {
  return request.get<CommissionRule>('/settlement/commission-rule')
}

/**
 * 更新佣金规则配置
 * @param data 规则配置数据
 */
export const updateCommissionRule = (data: CommissionRuleFormData) => {
  return request.put<CommissionRule>('/settlement/commission-rule', data)
}
