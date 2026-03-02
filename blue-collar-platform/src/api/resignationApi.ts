import request from '@/utils/request'
import type {
  Resignation,
  ResignationQueryParams,
  ResignationFormData,
  ResignationExportParams,
  ApprovalFormData
} from '@/types/resignationTypes'
import type { PageResponse } from '@/types/response'

const mockData: Resignation[] = [
  {
    id: '1',
    resignationNo: 'LZ2026020001',
    workerId: 'W001',
    workerName: '张三',
    gender: '男',
    idCard: '110101199001011234',
    phone: '13800138001',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F001',
    factoryName: '深圳富士康',
    departmentName: '生产部',
    position: '普工',
    entryDate: '2024-03-15',
    resignationDate: '2026-02-20',
    resignationReason: 'VOLUNTARY',
    resignationReasonDetail: '个人发展原因',
    approvalStatus: 'APPROVED',
    resignationStatus: 'COMPLETED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-15 10:00:00',
    approverId: 'A001',
    approverName: '管理员',
    approvalTime: '2026-02-16 14:30:00',
    approvalComment: '同意离职',
    settlementSalary: 8500,
    settlementStatus: '已结清',
    handoverPersonId: 'H001',
    handoverPersonName: '李四',
    handoverDate: '2026-02-18',
    returnItems: '工牌、工具箱',
    remark: '',
    createTime: '2026-02-15 10:00:00',
    updateTime: '2026-02-20 16:00:00'
  },
  {
    id: '2',
    resignationNo: 'LZ2026020002',
    workerId: 'W002',
    workerName: '李四',
    gender: '女',
    idCard: '110101199002021234',
    phone: '13800138002',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F001',
    factoryName: '深圳富士康',
    departmentName: '品质部',
    position: '质检员',
    entryDate: '2024-05-20',
    resignationDate: '2026-02-25',
    resignationReason: 'SALARY',
    resignationReasonDetail: '薪资待遇不满意',
    approvalStatus: 'IN_PROGRESS',
    resignationStatus: 'IN_PROGRESS',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-22 09:00:00',
    createTime: '2026-02-22 09:00:00'
  },
  {
    id: '3',
    resignationNo: 'LZ2026020003',
    workerId: 'W003',
    workerName: '王五',
    gender: '男',
    idCard: '110101199003031234',
    phone: '13800138003',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F002',
    factoryName: '东莞华为',
    departmentName: '研发部',
    position: '技术员',
    entryDate: '2023-08-10',
    resignationDate: '2026-03-01',
    resignationReason: 'CONTRACT_END',
    resignationReasonDetail: '合同到期',
    approvalStatus: 'PENDING',
    resignationStatus: 'NOT_STARTED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-24 11:00:00',
    createTime: '2026-02-24 11:00:00'
  },
  {
    id: '4',
    resignationNo: 'LZ2026020004',
    workerId: 'W004',
    workerName: '赵六',
    gender: '女',
    idCard: '110101199004041234',
    phone: '13800138004',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F001',
    factoryName: '深圳富士康',
    departmentName: '生产部',
    position: '普工',
    entryDate: '2025-01-05',
    resignationDate: '2026-02-15',
    resignationReason: 'HEALTH',
    resignationReasonDetail: '身体原因需要休息',
    approvalStatus: 'REJECTED',
    resignationStatus: 'NOT_STARTED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-10 14:00:00',
    approverId: 'A001',
    approverName: '管理员',
    approvalTime: '2026-02-11 10:00:00',
    approvalComment: '建议先治疗，暂不批准离职',
    createTime: '2026-02-10 14:00:00'
  },
  {
    id: '5',
    resignationNo: 'LZ2026020005',
    workerId: 'W005',
    workerName: '孙七',
    gender: '男',
    idCard: '110101199005051234',
    phone: '13800138005',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F003',
    factoryName: '广州美的',
    departmentName: '装配车间',
    position: '装配工',
    entryDate: '2024-11-20',
    resignationDate: '2026-02-28',
    resignationReason: 'FAMILY',
    resignationReasonDetail: '家庭原因需要回家',
    approvalStatus: 'PENDING',
    resignationStatus: 'NOT_STARTED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-25 16:00:00',
    createTime: '2026-02-25 16:00:00'
  },
  {
    id: '6',
    resignationNo: 'LZ2026020006',
    workerId: 'W006',
    workerName: '周八',
    gender: '女',
    idCard: '110101199006061234',
    phone: '13800138006',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F001',
    factoryName: '深圳富士康',
    departmentName: '包装部',
    position: '包装工',
    entryDate: '2024-07-15',
    resignationDate: '2026-02-18',
    resignationReason: 'ENVIRONMENT',
    resignationReasonDetail: '工作环境不适应',
    approvalStatus: 'APPROVED',
    resignationStatus: 'COMPLETED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-12 08:00:00',
    approverId: 'A001',
    approverName: '管理员',
    approvalTime: '2026-02-13 15:00:00',
    approvalComment: '同意离职',
    settlementSalary: 7200,
    settlementStatus: '已结清',
    createTime: '2026-02-12 08:00:00',
    updateTime: '2026-02-18 12:00:00'
  },
  {
    id: '7',
    resignationNo: 'LZ2026020007',
    workerId: 'W007',
    workerName: '吴九',
    gender: '男',
    idCard: '110101199007071234',
    phone: '13800138007',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F002',
    factoryName: '东莞华为',
    departmentName: '测试部',
    position: '测试工程师',
    entryDate: '2024-02-28',
    resignationDate: '2026-03-05',
    resignationReason: 'PERSONAL',
    resignationReasonDetail: '个人原因',
    approvalStatus: 'IN_PROGRESS',
    resignationStatus: 'IN_PROGRESS',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-26 10:00:00',
    createTime: '2026-02-26 10:00:00'
  },
  {
    id: '8',
    resignationNo: 'LZ2026020008',
    workerId: 'W008',
    workerName: '郑十',
    gender: '男',
    idCard: '110101199008081234',
    phone: '13800138008',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F001',
    factoryName: '深圳富士康',
    departmentName: '生产部',
    position: '普工',
    entryDate: '2025-03-01',
    resignationDate: '2026-02-22',
    resignationReason: 'DISMISSAL',
    resignationReasonDetail: '违反公司规定被辞退',
    approvalStatus: 'APPROVED',
    resignationStatus: 'COMPLETED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-18 16:00:00',
    approverId: 'A001',
    approverName: '管理员',
    approvalTime: '2026-02-19 09:00:00',
    approvalComment: '同意离职',
    settlementSalary: 0,
    settlementStatus: '已结清',
    createTime: '2026-02-18 16:00:00',
    updateTime: '2026-02-22 10:00:00'
  },
  {
    id: '9',
    resignationNo: 'LZ2026020009',
    workerId: 'W009',
    workerName: '陈十一',
    gender: '女',
    idCard: '110101199009091234',
    phone: '13800138009',
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: 'F003',
    factoryName: '广州美的',
    departmentName: '质检部',
    position: '质检员',
    entryDate: '2024-09-10',
    resignationDate: '2026-03-10',
    resignationReason: 'TRANSFER',
    resignationReasonDetail: '转到其他公司',
    approvalStatus: 'PENDING',
    resignationStatus: 'NOT_STARTED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-27 09:00:00',
    createTime: '2026-02-27 09:00:00'
  },
  {
    id: '10',
    resignationNo: 'LZ2026020010',
    workerId: 'W010',
    workerName: '刘十二',
    gender: '男',
    idCard: '110101199010101234',
    phone: '13800138010',
    laborCompanyId: 'LC002',
    laborCompanyName: '上海蓝领劳务公司',
    factoryId: 'F001',
    factoryName: '深圳富士康',
    departmentName: '物流部',
    position: '仓库管理员',
    entryDate: '2024-06-01',
    resignationDate: '2026-02-20',
    resignationReason: 'OTHER',
    resignationReasonDetail: '其他原因',
    approvalStatus: 'APPROVED',
    resignationStatus: 'COMPLETED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: '2026-02-14 13:00:00',
    approverId: 'A001',
    approverName: '管理员',
    approvalTime: '2026-02-15 11:00:00',
    approvalComment: '同意离职',
    settlementSalary: 6800,
    settlementStatus: '已结清',
    createTime: '2026-02-14 13:00:00',
    updateTime: '2026-02-20 15:00:00'
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getResignationList = async (params: ResignationQueryParams) => {
  await delay(300)
  let filteredData = [...mockData]

  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword) ||
        item.resignationNo.toLowerCase().includes(keyword)
    )
  }

  if (params.workerName) {
    filteredData = filteredData.filter(item => item.workerName.includes(params.workerName!))
  }

  if (params.phone) {
    filteredData = filteredData.filter(item => item.phone.includes(params.phone!))
  }

  if (params.startResignationDate) {
    filteredData = filteredData.filter(
      item => item.resignationDate >= params.startResignationDate!
    )
  }

  if (params.endResignationDate) {
    filteredData = filteredData.filter(
      item => item.resignationDate <= params.endResignationDate!
    )
  }

  if (params.approvalStatus) {
    filteredData = filteredData.filter(item => item.approvalStatus === params.approvalStatus)
  }

  if (params.resignationStatus) {
    filteredData = filteredData.filter(
      item => item.resignationStatus === params.resignationStatus
    )
  }

  if (params.resignationReason) {
    filteredData = filteredData.filter(
      item => item.resignationReason === params.resignationReason
    )
  }

  if (params.laborCompanyId) {
    filteredData = filteredData.filter(
      item => item.laborCompanyId === params.laborCompanyId
    )
  }

  if (params.factoryId) {
    filteredData = filteredData.filter(item => item.factoryId === params.factoryId)
  }

  if (params.applicantId) {
    filteredData = filteredData.filter(item => item.applicantId === params.applicantId)
  }

  if (params.sortField && params.sortOrder) {
    filteredData.sort((a, b) => {
      const aVal = (a as any)[params.sortField!]
      const bVal = (b as any)[params.sortField!]
      if (params.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })
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
  } as PageResponse<Resignation>
}

export const getResignationDetail = async (id: string) => {
  await delay(200)
  const item = mockData.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '离职记录不存在',
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

export const createResignation = async (data: ResignationFormData) => {
  await delay(300)
  const newItem: Resignation = {
    id: String(mockData.length + 1),
    resignationNo: `LZ${new Date().getFullYear()}${(String(mockData.length + 1)).padStart(6, '0')}`,
    workerId: data.workerId,
    workerName: data.workerName,
    gender: '男',
    idCard: data.idCard,
    phone: data.phone,
    laborCompanyId: 'LC001',
    laborCompanyName: '北京蓝领劳务公司',
    factoryId: data.factoryId,
    factoryName: data.factoryName,
    position: data.position,
    entryDate: data.entryDate,
    resignationDate: data.resignationDate,
    resignationReason: data.resignationReason,
    resignationReasonDetail: data.resignationReasonDetail,
    approvalStatus: 'PENDING',
    resignationStatus: 'NOT_STARTED',
    applicantId: 'A001',
    applicantName: '管理员',
    applicationTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    settlementSalary: data.settlementSalary,
    handoverPersonId: data.handoverPersonId,
    handoverPersonName: data.handoverPersonName,
    handoverDate: data.handoverDate,
    returnItems: data.returnItems,
    remark: data.remark,
    createTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
  mockData.unshift(newItem)
  return {
    code: 200,
    message: '创建成功',
    data: newItem,
    timestamp: Date.now()
  }
}

export const updateResignation = async (id: string, data: ResignationFormData) => {
  await delay(300)
  const index = mockData.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '离职记录不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  const updatedItem = {
    ...mockData[index],
    workerId: data.workerId,
    workerName: data.workerName,
    phone: data.phone,
    idCard: data.idCard,
    factoryId: data.factoryId,
    factoryName: data.factoryName,
    position: data.position,
    entryDate: data.entryDate,
    resignationDate: data.resignationDate,
    resignationReason: data.resignationReason,
    resignationReasonDetail: data.resignationReasonDetail,
    settlementSalary: data.settlementSalary,
    handoverPersonId: data.handoverPersonId,
    handoverPersonName: data.handoverPersonName,
    handoverDate: data.handoverDate,
    returnItems: data.returnItems,
    remark: data.remark,
    updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
  mockData[index] = updatedItem
  return {
    code: 200,
    message: '更新成功',
    data: updatedItem,
    timestamp: Date.now()
  }
}

export const deleteResignation = async (id: string) => {
  await delay(300)
  const index = mockData.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '离职记录不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockData.splice(index, 1)
  return {
    code: 200,
    message: '删除成功',
    data: null,
    timestamp: Date.now()
  }
}

export const submitApproval = async (id: string) => {
  await delay(300)
  const index = mockData.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '离职记录不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  if (mockData[index].approvalStatus !== 'PENDING') {
    return {
      code: 400,
      message: '只有未审核状态可以提交审核',
      data: null,
      timestamp: Date.now()
    }
  }
  mockData[index].approvalStatus = 'IN_PROGRESS'
  return {
    code: 200,
    message: '提交审核成功',
    data: mockData[index],
    timestamp: Date.now()
  }
}

export const approveResignation = async (id: string, data: ApprovalFormData) => {
  await delay(300)
  const index = mockData.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '离职记录不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  if (mockData[index].approvalStatus !== 'IN_PROGRESS') {
    return {
      code: 400,
      message: '只有审核中状态可以审核',
      data: null,
      timestamp: Date.now()
    }
  }

  const approvalResult = data.result === 'approved' ? 'APPROVED' : 'REJECTED'
  mockData[index].approvalStatus = approvalResult
  mockData[index].approverId = 'A001'
  mockData[index].approverName = '管理员'
  mockData[index].approvalTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
  mockData[index].approvalComment = data.comment
  mockData[index].resignationStatus = data.result === 'approved' ? 'IN_PROGRESS' : 'NOT_STARTED'
  mockData[index].updateTime = new Date().toISOString().replace('T', ' ').slice(0, 19)

  return {
    code: 200,
    message: data.result === 'approved' ? '审核通过' : '审核驳回',
    data: mockData[index],
    timestamp: Date.now()
  }
}

export const completeResignation = async (id: string) => {
  await delay(300)
  const index = mockData.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '离职记录不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  if (mockData[index].approvalStatus !== 'APPROVED') {
    return {
      code: 400,
      message: '只有审核通过后才能完成离职',
      data: null,
      timestamp: Date.now()
    }
  }
  mockData[index].resignationStatus = 'COMPLETED'
  mockData[index].updateTime = new Date().toISOString().replace('T', ' ').slice(0, 19)

  return {
    code: 200,
    message: '离职办理完成',
    data: mockData[index],
    timestamp: Date.now()
  }
}

export const exportResignation = async (params: ResignationExportParams) => {
  await delay(500)
  let filteredData = [...mockData]

  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword) ||
        item.resignationNo.toLowerCase().includes(keyword)
    )
  }

  if (params.approvalStatus) {
    filteredData = filteredData.filter(item => item.approvalStatus === params.approvalStatus)
  }

  if (params.resignationStatus) {
    filteredData = filteredData.filter(
      item => item.resignationStatus === params.resignationStatus
    )
  }

  return {
    code: 200,
    message: '导出成功',
    data: filteredData,
    timestamp: Date.now()
  }
}

export const importResignation = async (file: File) => {
  await delay(500)
  return {
    code: 200,
    message: '导入成功',
    data: { successCount: 10, failCount: 0 },
    timestamp: Date.now()
  }
}
