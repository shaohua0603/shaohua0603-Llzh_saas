/**
 * 审批流程组件类型定义
 */

/**
 * 节点类型
 */
export type NodeType = 'approval' | 'cc'

/**
 * 审批方式
 */
export type ApprovalMode = 'or' | 'and'

/**
 * 审批结果
 */
export type ApprovalResult = 'approved' | 'rejected' | 'pending' | 'transferred' | 'delegated'

/**
 * 审批节点
 */
export interface ApprovalNode {
  /** 节点ID */
  id: string
  /** 节点名称 */
  name: string
  /** 节点类型 */
  type: NodeType
  /** 审批人列表 */
  approvers: string[]
  /** 审批方式 */
  approvalMode: ApprovalMode
  /** 审批条件 */
  condition?: string
  /** 是否必填 */
  required?: boolean
}

/**
 * 审批流程配置
 */
export interface ApprovalFlowConfig {
  /** 流程ID */
  id: string
  /** 流程名称 */
  name: string
  /** 流程编码 */
  code: string
  /** 流程描述 */
  description?: string
  /** 流程状态 */
  status: 'enabled' | 'disabled'
  /** 审批节点列表 */
  nodes: ApprovalNode[]
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 审批记录
 */
export interface ApprovalRecord {
  /** 节点ID */
  nodeId: string
  /** 节点名称 */
  nodeName: string
  /** 节点类型 */
  nodeType?: NodeType
  /** 审批人 */
  approver: string
  /** 审批时间 */
  approvalTime: Date
  /** 审批结果 */
  approvalResult: ApprovalResult
  /** 审批意见 */
  approvalComment?: string
  /** 驳回原因 */
  rejectReason?: string
  /** 附件列表 */
  attachments?: any[]
  /** 抄送用户列表 */
  ccUsers?: string[]
  /** 操作类型 */
  operationType?: 'transfer' | 'delegate'
  /** 操作目标 */
  operationTarget?: string
}

/**
 * 审批表单数据
 */
export interface ApprovalFormData {
  /** 审批意见 */
  comment: string
  /** 审批结果 */
  result: ApprovalResult
  /** 驳回原因 */
  rejectReason?: string
  /** 转交人 */
  transferTo?: string
  /** 附件列表 */
  attachments?: File[]
}

/**
 * 审批状态
 */
export interface ApprovalStatus {
  /** 当前状态 */
  status: 'pending' | 'in_progress' | 'approved' | 'rejected'
  /** 当前节点ID */
  currentNodeId?: string
  /** 审批记录列表 */
  records: ApprovalRecord[]
}

/**
 * 审批流程组件Props
 */
export interface ApprovalFlowProps {
  /** 审批流程配置 */
  flowConfig?: ApprovalFlowConfig
  /** 审批状态 */
  approvalStatus?: ApprovalStatus
  /** 是否可编辑 */
  editable?: boolean
  /** 是否显示审批表单 */
  showApprovalForm?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 当前用户ID */
  currentUserId?: string
}

/**
 * 审批流程组件Emits
 */
export interface ApprovalFlowEmits {
  /** 流程配置变化 */
  (e: 'flow-change', flow: ApprovalFlowConfig): void
  /** 节点添加 */
  (e: 'node-add', node: ApprovalNode): void
  /** 节点删除 */
  (e: 'node-delete', nodeId: string): void
  /** 节点更新 */
  (e: 'node-update', node: ApprovalNode): void
  /** 节点顺序变化 */
  (e: 'node-reorder', nodes: ApprovalNode[]): void
  /** 审批提交 */
  (e: 'approve', data: ApprovalFormData): void
  /** 审批驳回 */
  (e: 'reject', data: ApprovalFormData): void
  /** 转交 */
  (e: 'transfer', data: ApprovalFormData): void
}

/**
 * 审批流程组件实例方法
 */
export interface ApprovalFlowInstance {
  /** 添加节点 */
  addNode: (node: Partial<ApprovalNode>) => void
  /** 删除节点 */
  deleteNode: (nodeId: string) => void
  /** 更新节点 */
  updateNode: (nodeId: string, node: Partial<ApprovalNode>) => void
  /** 调整节点顺序 */
  reorderNodes: (nodes: ApprovalNode[]) => void
  /** 提交审批 */
  submitApproval: (data: ApprovalFormData) => void
  /** 获取当前节点 */
  getCurrentNode: () => ApprovalNode | null
  /** 验证流程配置 */
  validateFlow: () => boolean
}
