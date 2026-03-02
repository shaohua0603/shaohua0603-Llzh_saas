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

export enum ContractStatus {
  UNSIGNED = 'UNSIGNED',
  SIGNING = 'SIGNING',
  SIGNED = 'SIGNED',
  CANCELLED = 'CANCELLED'
}

export const ContractStatusConfig = {
  UNSIGNED: {
    code: 'UNSIGNED',
    name: '未签订',
    color: 'info',
    icon: 'Document'
  },
  SIGNING: {
    code: 'SIGNING',
    name: '签订中',
    color: 'warning',
    icon: 'Edit'
  },
  SIGNED: {
    code: 'SIGNED',
    name: '已签订',
    color: 'success',
    icon: 'Check'
  },
  CANCELLED: {
    code: 'CANCELLED',
    name: '已取消',
    color: 'danger',
    icon: 'Close'
  }
}

export enum SettlementMethod {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY'
}

export const SettlementMethodConfig = {
  DAILY: {
    code: 'DAILY',
    name: '日结'
  },
  MONTHLY: {
    code: 'MONTHLY',
    name: '月结'
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

export interface DataPermissionFilter {
  type: 'ALL' | 'DEPARTMENT' | 'DEPARTMENT_AND_BELOW' | 'SELF' | 'CUSTOM'
  userId: string
  departmentId?: string
  departments?: string[]
  includeCreator?: boolean
  includeManager?: boolean
  includeContact?: boolean
}