export type ApprovalStatus = 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'

export type ResignationStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export type ResignationReason =
  | 'VOLUNTARY'
  | 'CONTRACT_END'
  | 'DISMISSAL'
  | 'TRANSFER'
  | 'SALARY'
  | 'ENVIRONMENT'
  | 'PERSONAL'
  | 'HEALTH'
  | 'FAMILY'
  | 'OTHER'

export const RESIGNATION_REASON_OPTIONS: { label: string; value: ResignationReason }[] = [
  { label: '主动离职', value: 'VOLUNTARY' },
  { label: '合同到期', value: 'CONTRACT_END' },
  { label: '辞退', value: 'DISMISSAL' },
  { label: '转正调出', value: 'TRANSFER' },
  { label: '薪资原因', value: 'SALARY' },
  { label: '工作环境', value: 'ENVIRONMENT' },
  { label: '个人原因', value: 'PERSONAL' },
  { label: '健康原因', value: 'HEALTH' },
  { label: '家庭原因', value: 'FAMILY' },
  { label: '其他原因', value: 'OTHER' }
]

export const APPROVAL_STATUS_OPTIONS: { label: string; value: ApprovalStatus }[] = [
  { label: '未审核', value: 'PENDING' },
  { label: '审核中', value: 'IN_PROGRESS' },
  { label: '审核通过', value: 'APPROVED' },
  { label: '已驳回', value: 'REJECTED' }
]

export const RESIGNATION_STATUS_OPTIONS: { label: string; value: ResignationStatus }[] = [
  { label: '未开始', value: 'NOT_STARTED' },
  { label: '离职中', value: 'IN_PROGRESS' },
  { label: '已离职', value: 'COMPLETED' }
]

export interface Resignation {
  id: string
  resignationNo: string
  workerId: string
  workerName: string
  gender: '男' | '女'
  idCard: string
  phone: string
  laborCompanyId: string
  laborCompanyName: string
  factoryId: string
  factoryName: string
  departmentId?: string
  departmentName?: string
  position: string
  entryDate: string
  resignationDate: string
  resignationReason: ResignationReason
  resignationReasonDetail?: string
  approvalStatus: ApprovalStatus
  resignationStatus: ResignationStatus
  applicantId: string
  applicantName: string
  applicationTime: string
  approverId?: string
  approverName?: string
  approvalTime?: string
  approvalComment?: string
  settlementSalary?: number
  settlementStatus?: '已结清' | '未结清'
  handoverPersonId?: string
  handoverPersonName?: string
  handoverDate?: string
  returnItems?: string
  remark?: string
  createTime: string
  updateTime?: string
}

export interface ResignationQueryParams {
  page: number
  pageSize: number
  keyword?: string
  workerName?: string
  phone?: string
  startResignationDate?: string
  endResignationDate?: string
  approvalStatus?: ApprovalStatus
  resignationStatus?: ResignationStatus
  resignationReason?: ResignationReason
  laborCompanyId?: string
  factoryId?: string
  applicantId?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ResignationFormData {
  id?: string
  workerId: string
  workerName: string
  phone: string
  idCard: string
  factoryId: string
  factoryName: string
  position: string
  entryDate: string
  resignationDate: string
  resignationReason: ResignationReason
  resignationReasonDetail?: string
  settlementSalary?: number
  handoverPersonId?: string
  handoverPersonName?: string
  handoverDate?: string
  returnItems?: string
  remark?: string
}

export interface ResignationExportParams {
  keyword?: string
  workerName?: string
  phone?: string
  startResignationDate?: string
  endResignationDate?: string
  approvalStatus?: ApprovalStatus
  resignationStatus?: ResignationStatus
  resignationReason?: ResignationReason
  laborCompanyId?: string
  factoryId?: string
  applicantId?: string
}

export interface ApprovalFormData {
  result: 'approved' | 'rejected'
  comment?: string
}
