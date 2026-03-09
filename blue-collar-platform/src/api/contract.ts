import type { PageResponse } from '@/types/response'

export interface Contract {
  id: string
  contractNo: string
  partyA: string
  partyAId: string
  partyB: string
  partyBId: string
  partyBName: string
  partyBPhone: string
  settlementMethod: string
  settlementMethodText: string
  contractStatus: string
  contractStatusText: string
  contractSignDate: string
  contractEffectiveDate: string
  contractExpiryDate: string
  contractAmount: number
  contractContent: string
  attachments: Array<{
    name: string
    url: string
    size: number
  }>
  approvalStatus: string
  approvalStatusText: string
  dataScope: string
  departmentId: string
  departmentName: string
  tenantId: string
  tenantName: string
  creatorId: string
  creatorName: string
  createTime: string
  updaterId: string
  updaterName: string
  updateTime: string
  remark?: string
}

export interface ContractQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  contractNo?: string
  partyBName?: string
  partyBPhone?: string
  settlementMethod?: string
  contractStatus?: string
  contractSignDateStart?: string
  contractSignDateEnd?: string
  contractEffectiveDateStart?: string
  contractEffectiveDateEnd?: string
  contractExpiryDateStart?: string
  contractExpiryDateEnd?: string
  dataScope?: string
  departmentId?: string
}

export interface ContractFormData {
  contractNo: string
  partyA: string
  partyAId?: string
  partyBId?: string
  partyB?: any
  settlementMethod: string
  contractStatus: string
  contractSignDate: string
  contractEffectiveDate: string
  contractExpiryDate: string
  contractAmount: number
  contractContent: string
  attachments?: any[]
  remark?: string
}

export interface ContractRecord {
  id: string
  contractId: string
  action: string
  actionText: string
  operatorId: string
  operatorName: string
  remark: string
  createTime: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockContracts: Contract[] = [
  {
    id: '1',
    contractNo: 'HT2024010001',
    partyA: '深圳富士康科技有限公司',
    partyAId: 'F001',
    partyB: '张三',
    partyBId: 'W001',
    partyBName: '张三',
    partyBPhone: '13800138001',
    settlementMethod: 'MONTHLY',
    settlementMethodText: '月结',
    contractStatus: 'SIGNED',
    contractStatusText: '已签订',
    contractSignDate: '2024-01-01',
    contractEffectiveDate: '2024-01-01',
    contractExpiryDate: '2024-12-31',
    contractAmount: 5000,
    contractContent: '劳动合同内容',
    attachments: [],
    approvalStatus: 'APPROVED',
    approvalStatusText: '审核通过',
    dataScope: 'ALL',
    departmentId: 'D001',
    departmentName: '生产部',
    tenantId: 'T001',
    tenantName: '蓝天劳务公司',
    creatorId: 'U001',
    creatorName: '管理员',
    createTime: '2024-01-01 09:00:00',
    updaterId: 'U001',
    updaterName: '管理员',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: '2',
    contractNo: 'HT2024010002',
    partyA: '华为技术有限公司',
    partyAId: 'F002',
    partyB: '李四',
    partyBId: 'W002',
    partyBName: '李四',
    partyBPhone: '13800138002',
    settlementMethod: 'MONTHLY',
    settlementMethodText: '月结',
    contractStatus: 'SIGNED',
    contractStatusText: '已签订',
    contractSignDate: '2024-01-02',
    contractEffectiveDate: '2024-01-02',
    contractExpiryDate: '2024-12-31',
    contractAmount: 6000,
    contractContent: '劳动合同内容',
    attachments: [],
    approvalStatus: 'APPROVED',
    approvalStatusText: '审核通过',
    dataScope: 'ALL',
    departmentId: 'D001',
    departmentName: '生产部',
    tenantId: 'T001',
    tenantName: '蓝天劳务公司',
    creatorId: 'U001',
    creatorName: '管理员',
    createTime: '2024-01-02 09:00:00',
    updaterId: 'U001',
    updaterName: '管理员',
    updateTime: '2024-01-02 10:00:00'
  },
  {
    id: '3',
    contractNo: 'HT2024010003',
    partyA: '比亚迪股份有限公司',
    partyAId: 'F003',
    partyB: '王五',
    partyBId: 'W003',
    partyBName: '王五',
    partyBPhone: '13800138003',
    settlementMethod: 'MONTHLY',
    settlementMethodText: '月结',
    contractStatus: 'UNSIGNED',
    contractStatusText: '未签订',
    contractSignDate: '',
    contractEffectiveDate: '2024-01-03',
    contractExpiryDate: '2024-12-31',
    contractAmount: 5500,
    contractContent: '劳动合同内容',
    attachments: [],
    approvalStatus: 'PENDING',
    approvalStatusText: '待审核',
    dataScope: 'ALL',
    departmentId: 'D001',
    departmentName: '生产部',
    tenantId: 'T001',
    tenantName: '蓝天劳务公司',
    creatorId: 'U001',
    creatorName: '管理员',
    createTime: '2024-01-03 09:00:00',
    updaterId: 'U001',
    updaterName: '管理员',
    updateTime: '2024-01-03 10:00:00'
  }
]

const mockContractRecords: ContractRecord[] = [
  {
    id: '1',
    contractId: '1',
    action: 'CREATE',
    actionText: '创建合同',
    operatorId: 'U001',
    operatorName: '管理员',
    remark: '',
    createTime: '2024-01-01 09:00:00'
  },
  {
    id: '2',
    contractId: '1',
    action: 'SUBMIT',
    actionText: '提交审核',
    operatorId: 'U001',
    operatorName: '管理员',
    remark: '',
    createTime: '2024-01-01 09:30:00'
  },
  {
    id: '3',
    contractId: '1',
    action: 'APPROVE',
    actionText: '审核通过',
    operatorId: 'U002',
    operatorName: '审批人',
    remark: '同意',
    createTime: '2024-01-01 10:00:00'
  }
]

const mockAvailableWorkers = [
  {
    id: 'W004',
    name: '赵六',
    phone: '13800138004',
    idCard: '110101199004041234',
    age: 25,
    gender: '男',
    education: '高中',
    jobIntention: '普工',
    expectedSalary: 5000,
    expectedWorkAddress: '深圳',
    materialsComplete: true,
    interviewStatus: 'PASSED',
    contractStatus: 'UNSIGNED'
  },
  {
    id: 'W005',
    name: '孙七',
    phone: '13800138005',
    idCard: '110101199005051234',
    age: 23,
    gender: '女',
    education: '中专',
    jobIntention: '质检员',
    expectedSalary: 5500,
    expectedWorkAddress: '深圳',
    materialsComplete: true,
    interviewStatus: 'PASSED',
    contractStatus: 'UNSIGNED'
  }
]

export const getContractList = async (params: ContractQueryParams) => {
  await delay(500)
  let filteredContracts = [...mockContracts]
  
  // 过滤逻辑
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredContracts = filteredContracts.filter(contract => 
      contract.contractNo.toLowerCase().includes(keyword) ||
      contract.partyBName.toLowerCase().includes(keyword) ||
      contract.partyBPhone.includes(keyword)
    )
  }
  
  if (params.contractStatus) {
    filteredContracts = filteredContracts.filter(contract => 
      contract.contractStatus === params.contractStatus
    )
  }
  
  // 排序逻辑
  if (params.sortField && params.sortOrder) {
    filteredContracts.sort((a, b) => {
      const aVal = (a as any)[params.sortField!]
      const bVal = (b as any)[params.sortField!]
      if (params.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })
  }
  
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    code: 200,
    message: '成功',
    data: {
      list: filteredContracts.slice(start, end),
      total: filteredContracts.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
}

export const getContractDetail = async (id: string | number) => {
  await delay(300)
  const contract = mockContracts.find(c => c.id === id.toString())
  if (!contract) {
    return {
      code: 404,
      message: '合同不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: '成功',
    data: contract,
    timestamp: Date.now()
  }
}

export const createContract = async (data: ContractFormData) => {
  await delay(500)
  const newContract: Contract = {
    id: (mockContracts.length + 1).toString(),
    contractNo: data.contractNo,
    partyA: data.partyA,
    partyAId: data.partyAId || 'F001',
    partyB: data.partyB?.name || '',
    partyBId: data.partyBId || data.partyB?.id || '',
    partyBName: data.partyB?.name || '',
    partyBPhone: data.partyB?.phone || '',
    settlementMethod: data.settlementMethod,
    settlementMethodText: data.settlementMethod === 'MONTHLY' ? '月结' : '周结',
    contractStatus: data.contractStatus,
    contractStatusText: data.contractStatus === 'SIGNED' ? '已签订' : '未签订',
    contractSignDate: data.contractSignDate,
    contractEffectiveDate: data.contractEffectiveDate,
    contractExpiryDate: data.contractExpiryDate,
    contractAmount: data.contractAmount,
    contractContent: data.contractContent,
    attachments: data.attachments || [],
    approvalStatus: 'PENDING',
    approvalStatusText: '待审核',
    dataScope: 'ALL',
    departmentId: 'D001',
    departmentName: '生产部',
    tenantId: 'T001',
    tenantName: '蓝天劳务公司',
    creatorId: 'U001',
    creatorName: '管理员',
    createTime: new Date().toISOString(),
    updaterId: 'U001',
    updaterName: '管理员',
    updateTime: new Date().toISOString(),
    remark: data.remark
  }
  mockContracts.push(newContract)
  return {
    code: 200,
    message: '成功',
    data: { id: newContract.id },
    timestamp: Date.now()
  }
}

export const updateContract = async (id: string | number, data: Partial<ContractFormData>) => {
  await delay(500)
  const index = mockContracts.findIndex(c => c.id === id.toString())
  if (index === -1) {
    return {
      code: 404,
      message: '合同不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockContracts[index] = {
    ...mockContracts[index],
    ...data,
    settlementMethodText: data.settlementMethod === 'MONTHLY' ? '月结' : '周结',
    contractStatusText: data.contractStatus === 'SIGNED' ? '已签订' : '未签订',
    updaterId: 'U001',
    updaterName: '管理员',
    updateTime: new Date().toISOString()
  }
  return {
    code: 200,
    message: '成功',
    data: mockContracts[index],
    timestamp: Date.now()
  }
}

export const deleteContract = async (id: string | number) => {
  await delay(300)
  const index = mockContracts.findIndex(c => c.id === id.toString())
  if (index === -1) {
    return {
      code: 404,
      message: '合同不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockContracts.splice(index, 1)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

export const batchDeleteContracts = async (ids: string[]) => {
  await delay(500)
  let successCount = 0
  for (const id of ids) {
    const index = mockContracts.findIndex(c => c.id === id)
    if (index !== -1) {
      mockContracts.splice(index, 1)
      successCount++
    }
  }
  return {
    code: 200,
    message: '成功',
    data: { successCount, failCount: ids.length - successCount },
    timestamp: Date.now()
  }
}

export const updateContractStatus = async (id: string | number, status: string) => {
  await delay(300)
  const index = mockContracts.findIndex(c => c.id === id.toString())
  if (index === -1) {
    return {
      code: 404,
      message: '合同不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockContracts[index].contractStatus = status
  mockContracts[index].contractStatusText = status === 'SIGNED' ? '已签订' : '未签订'
  mockContracts[index].updaterId = 'U001'
  mockContracts[index].updaterName = '管理员'
  mockContracts[index].updateTime = new Date().toISOString()
  return {
    code: 200,
    message: '成功',
    data: mockContracts[index],
    timestamp: Date.now()
  }
}

export const submitContract = async (id: string | number) => {
  await delay(300)
  const index = mockContracts.findIndex(c => c.id === id.toString())
  if (index === -1) {
    return {
      code: 404,
      message: '合同不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockContracts[index].approvalStatus = 'IN_PROGRESS'
  mockContracts[index].approvalStatusText = '审核中'
  mockContracts[index].updaterId = 'U001'
  mockContracts[index].updaterName = '管理员'
  mockContracts[index].updateTime = new Date().toISOString()
  return {
    code: 200,
    message: '成功',
    data: mockContracts[index],
    timestamp: Date.now()
  }
}

export const approveContract = async (id: string | number, data?: { comment?: string }) => {
  await delay(300)
  const index = mockContracts.findIndex(c => c.id === id.toString())
  if (index === -1) {
    return {
      code: 404,
      message: '合同不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockContracts[index].approvalStatus = 'APPROVED'
  mockContracts[index].approvalStatusText = '审核通过'
  mockContracts[index].updaterId = 'U001'
  mockContracts[index].updaterName = '管理员'
  mockContracts[index].updateTime = new Date().toISOString()
  return {
    code: 200,
    message: '成功',
    data: mockContracts[index],
    timestamp: Date.now()
  }
}

export const rejectContract = async (id: string | number, data?: { comment?: string }) => {
  await delay(300)
  const index = mockContracts.findIndex(c => c.id === id.toString())
  if (index === -1) {
    return {
      code: 404,
      message: '合同不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockContracts[index].approvalStatus = 'REJECTED'
  mockContracts[index].approvalStatusText = '审核驳回'
  mockContracts[index].updaterId = 'U001'
  mockContracts[index].updaterName = '管理员'
  mockContracts[index].updateTime = new Date().toISOString()
  return {
    code: 200,
    message: '成功',
    data: mockContracts[index],
    timestamp: Date.now()
  }
}

export const getContractRecords = async (id: string | number) => {
  await delay(300)
  const records = mockContractRecords.filter(r => r.contractId === id.toString())
  return {
    code: 200,
    message: '成功',
    data: records,
    timestamp: Date.now()
  }
}

export const exportContracts = async (filters?: any, fields?: string[]) => {
  await delay(500)
  // 模拟导出文件
  const blob = new Blob(['导出数据'], { type: 'application/vnd.ms-excel' })
  return blob
}

export const importContracts = async (file: File) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: { successCount: 10, failCount: 0 },
    timestamp: Date.now()
  }
}

export interface AvailableWorker {
  id: string
  name: string
  phone: string
  idCard: string
  age: number
  gender: string
  education: string
  jobIntention: string
  expectedSalary: number
  expectedWorkAddress: string
  materialsComplete: boolean
  interviewStatus: string
  contractStatus: string
}

export const getAvailableWorkers = async (params: { page: number; pageSize: number; keyword?: string }) => {
  await delay(500)
  let filteredWorkers = [...mockAvailableWorkers]
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredWorkers = filteredWorkers.filter(worker => 
      worker.name.toLowerCase().includes(keyword) ||
      worker.phone.includes(keyword)
    )
  }
  
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    code: 200,
    message: '成功',
    data: {
      list: filteredWorkers.slice(start, end),
      total: filteredWorkers.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
}

export const generateContractNo = async () => {
  await delay(300)
  const contractNo = `HT${new Date().getFullYear()}${(mockContracts.length + 1).toString().padStart(6, '0')}`
  return {
    code: 200,
    message: '成功',
    data: { contractNo },
    timestamp: Date.now()
  }
}
