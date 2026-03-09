// 生活费相关类型定义
export interface LivingExpenseRecord {
  id: string
  workerName: string
  phone: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'issued'
  applyDate: string
  issueDate?: string
  description?: string
  rejectReason?: string
  remark?: string
  approvalRecords?: ApprovalRecord[]
}

export interface ApprovalRecord {
  nodeId: string
  nodeName: string
  approver: string
  approvalTime: string
  approvalResult: 'approved' | 'rejected'
  approvalComment: string
}
