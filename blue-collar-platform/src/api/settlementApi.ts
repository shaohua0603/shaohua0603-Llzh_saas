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

// Mock数据
const mockJobReferrals: JobReferral[] = [
  {
    id: '1',
    workerId: 'W001',
    workerName: '张三',
    phone: '13800138001',
    idCard: '110101199001011234',
    gender: '男',
    age: 28,
    education: '高中/中专',
    factoryId: 'F001',
    factoryName: '富士康科技集团',
    position: '操作工',
    referralDate: '2026-01-15',
    expectedEntryDate: '2026-01-20',
    entryDate: '2026-01-20',
    salaryType: 'monthly',
    workDays: 35,
    referrerId: 'W002',
    referrerName: '李四',
    referrerPhone: '13800138002',
    remark: '介绍老乡入职',
    commissionRule: '月结规则-进厂30天发放500元，进厂60天发放500元，进厂90天发放500元',
    totalCommission: 1500,
    paidCommission: 500,
    commissionStatus: 'partial',
    createTime: '2026-01-15 10:00:00'
  },
  {
    id: '2',
    workerId: 'W003',
    workerName: '王五',
    phone: '13800138003',
    idCard: '110101199003031234',
    gender: '男',
    age: 25,
    education: '大专',
    factoryId: 'F002',
    factoryName: '华为技术有限公司',
    position: '质检员',
    referralDate: '2026-01-18',
    expectedEntryDate: '2026-01-25',
    entryDate: '2026-01-25',
    salaryType: 'monthly',
    workDays: 30,
    referrerId: 'W004',
    referrerName: '赵六',
    referrerPhone: '13800138004',
    remark: '朋友介绍',
    commissionRule: '月结规则-进厂30天发放300元，进厂60天发放300元',
    totalCommission: 600,
    paidCommission: 0,
    commissionStatus: 'pending',
    createTime: '2026-01-18 14:30:00'
  }
]

const mockCommissionPayments: CommissionPayment[] = [
  {
    id: '1',
    workerId: 'W001',
    workerName: '张三',
    phone: '13800138001',
    factoryId: 'F001',
    factoryName: '富士康科技集团',
    position: '操作工',
    entryDate: '2026-01-20',
    referrerId: 'W002',
    referrerName: '李四',
    referrerPhone: '13800138002',
    workDays: 35,
    pendingAmount: 500,
    paidAmount: 500,
    totalAmount: 1000,
    status: 'pending',
    createTime: '2026-01-15 10:00:00'
  }
]

const mockReferralRewards: ReferralReward[] = [
  {
    id: '1',
    referrerId: 'W002',
    referrerName: '李四',
    referrerPhone: '13800138002',
    newWorkerCount: 5,
    totalReward: 500,
    paidReward: 500,
    status: 'completed',
    period: '2026-01',
    createTime: '2026-02-01 10:00:00'
  }
]

const mockCommissionRule: CommissionRule = {
  daily: {
    requiredDays: 30,
    firstAmount: 300,
    secondAmount: 300,
    thirdAmount: 300,
    subsequentAmount: 200,
    intervalDays: 30
  },
  monthly: {
    requiredDays: 30,
    firstAmount: 500,
    secondAmount: 500,
    thirdAmount: 500,
    subsequentAmount: 300,
    intervalDays: 30
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取工作转介绍列表
 * @param params 查询参数
 */
export const getJobReferralList = async (params: JobReferralQueryParams) => {
  await delay(300)
  let filteredData = [...mockJobReferrals]
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword) ||
        item.referrerName.toLowerCase().includes(keyword)
    )
  }
  
  if (params.workerName) {
    filteredData = filteredData.filter(item => item.workerName.includes(params.workerName!))
  }
  
  if (params.referrerName) {
    filteredData = filteredData.filter(item => item.referrerName.includes(params.referrerName!))
  }
  
  if (params.factoryId) {
    filteredData = filteredData.filter(item => item.factoryId === params.factoryId)
  }
  
  if (params.commissionStatus) {
    filteredData = filteredData.filter(item => item.commissionStatus === params.commissionStatus)
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
  } as PageResponse<JobReferral>
}

/**
 * 获取工作转介绍详情
 * @param id 转介绍记录ID
 */
export const getJobReferralDetail = async (id: string) => {
  await delay(200)
  const item = mockJobReferrals.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '转介绍记录不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  }
}

/**
 * 获取佣金发放列表
 * @param params 查询参数
 */
export const getCommissionPaymentList = async (params: CommissionPaymentQueryParams) => {
  await delay(300)
  let filteredData = [...mockCommissionPayments]
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword) ||
        item.referrerName.toLowerCase().includes(keyword)
    )
  }
  
  if (params.workerName) {
    filteredData = filteredData.filter(item => item.workerName.includes(params.workerName!))
  }
  
  if (params.referrerName) {
    filteredData = filteredData.filter(item => item.referrerName.includes(params.referrerName!))
  }
  
  if (params.factoryId) {
    filteredData = filteredData.filter(item => item.factoryId === params.factoryId)
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
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
  } as PageResponse<CommissionPayment>
}

/**
 * 获取佣金发放详情
 * @param id 发放记录ID
 */
export const getCommissionPaymentDetail = async (id: string) => {
  await delay(200)
  const item = mockCommissionPayments.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '佣金发放记录不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  }
}

/**
 * 发放佣金
 * @param data 发放数据
 */
export const payCommission = async (data: CommissionPaymentFormData) => {
  await delay(300)
  return {
    code: 200,
    message: '发放成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 批量发放佣金
 * @param data 批量发放数据
 */
export const batchPayCommission = async (data: CommissionPaymentFormData) => {
  await delay(300)
  return {
    code: 200,
    message: '批量发放成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 获取拉新奖励列表
 * @param params 查询参数
 */
export const getReferralRewardList = async (params: ReferralRewardQueryParams) => {
  await delay(300)
  let filteredData = [...mockReferralRewards]
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.referrerName.toLowerCase().includes(keyword) ||
        item.referrerPhone.includes(keyword)
    )
  }
  
  if (params.referrerName) {
    filteredData = filteredData.filter(item => item.referrerName.includes(params.referrerName!))
  }
  
  if (params.period) {
    filteredData = filteredData.filter(item => item.period === params.period)
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
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
  } as PageResponse<ReferralReward>
}

/**
 * 获取拉新奖励详情
 * @param id 奖励记录ID
 */
export const getReferralRewardDetail = async (id: string) => {
  await delay(200)
  const item = mockReferralRewards.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '拉新奖励记录不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  }
}

/**
 * 发放拉新奖励
 * @param data 发放数据
 */
export const payReferralReward = async (data: ReferralRewardFormData) => {
  await delay(300)
  return {
    code: 200,
    message: '发放成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 批量发放拉新奖励
 * @param data 批量发放数据
 */
export const batchPayReferralReward = async (data: ReferralRewardFormData) => {
  await delay(300)
  return {
    code: 200,
    message: '批量发放成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 获取佣金规则配置
 */
export const getCommissionRule = async () => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: mockCommissionRule,
    timestamp: Date.now()
  }
}

/**
 * 更新佣金规则配置
 * @param data 规则配置数据
 */
export const updateCommissionRule = async (data: CommissionRuleFormData) => {
  await delay(300)
  return {
    code: 200,
    message: '保存成功',
    data: mockCommissionRule,
    timestamp: Date.now()
  }
}
