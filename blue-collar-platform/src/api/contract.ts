import request from '@/utils/request'
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

export const getContractList = (params: ContractQueryParams) => {
  return request.get<PageResponse<Contract>>('/api/v1/contracts', { params })
}

export const getContractDetail = (id: string | number) => {
  return request.get<ApiResponse<Contract>>(`/api/v1/contracts/${id}`)
}

export const createContract = (data: ContractFormData) => {
  return request.post<ApiResponse<{ id: string }>>('/api/v1/contracts', data)
}

export const updateContract = (id: string | number, data: Partial<ContractFormData>) => {
  return request.put<ApiResponse<Contract>>(`/api/v1/contracts/${id}`, data)
}

export const deleteContract = (id: string | number) => {
  return request.delete<ApiResponse<null>>(`/api/v1/contracts/${id}`)
}

export const batchDeleteContracts = (ids: string[]) => {
  return request.delete<ApiResponse<{ successCount: number; failCount: number }>>('/api/v1/contracts/batch', { data: { ids } })
}

export const updateContractStatus = (id: string | number, status: string) => {
  return request.patch<ApiResponse<Contract>>(`/api/v1/contracts/${id}/status`, { status })
}

export const submitContract = (id: string | number) => {
  return request.post<ApiResponse<Contract>>(`/api/v1/contracts/${id}/submit`)
}

export const approveContract = (id: string | number, data?: { comment?: string }) => {
  return request.post<ApiResponse<Contract>>(`/api/v1/contracts/${id}/approve`, data)
}

export const rejectContract = (id: string | number, data?: { comment?: string }) => {
  return request.post<ApiResponse<Contract>>(`/api/v1/contracts/${id}/reject`, data)
}

export const getContractRecords = (id: string | number) => {
  return request.get<ApiResponse<ContractRecord[]>>(`/api/v1/contracts/${id}/records`)
}

export const exportContracts = (filters?: any, fields?: string[]) => {
  return request.post('/api/v1/contracts/export', { filters, fields }, { responseType: 'blob' })
}

export const importContracts = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<ApiResponse<{ successCount: number; failCount: number; errors?: any[] }>>('/api/v1/contracts/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
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

export const getAvailableWorkers = (params: { page: number; pageSize: number; keyword?: string }) => {
  return request.get<PageResponse<AvailableWorker>>('/api/v1/workers/available', { params })
}

export const generateContractNo = () => {
  return request.get<ApiResponse<{ contractNo: string }>>('/api/v1/contracts/generate-no')
}
