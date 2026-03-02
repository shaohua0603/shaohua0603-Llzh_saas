/**
 * 流程设计器组件类型定义
 */

import type { ApprovalFlow, ApprovalNode } from '@/types/flow-config'

/**
 * 节点类型
 */
export type DesignerNodeType = 'approval' | 'cc' | 'condition'

/**
 * 审批模式
 */
export type DesignerApprovalMode = 'or' | 'and'

/**
 * 审批人类型
 */
export type DesignerApproverType = 'role' | 'department' | 'position' | 'user' | 'form_field'

/**
 * 设计器节点
 */
export interface DesignerNode {
  /** 节点ID */
  id: string
  /** 节点名称 */
  name: string
  /** 节点类型 */
  type: DesignerNodeType
  /** 节点顺序 */
  order: number
  /** 审批人类型 */
  approverType: DesignerApproverType
  /** 审批人配置(JSON字符串) */
  approverConfig?: string
  /** 抄送用户(JSON字符串) */
  ccUsers?: string
  /** 条件配置(JSON字符串) */
  conditionConfig?: string
  /** 审批模式(仅审批节点) */
  approvalMode?: DesignerApprovalMode
  /** 是否必填 */
  isRequired?: boolean
  /** 是否自动审批 */
  autoApprove?: boolean
  /** 超时时间(小时) */
  timeoutHours?: number
  /** 超时操作 */
  timeoutAction?: string
}

/**
 * 流程基本信息
 */
export interface FlowBasicInfo {
  /** 流程名称 */
  flowName: string
  /** 流程编码 */
  flowCode: string
  /** 流程类型 */
  flowType: string
  /** 流程描述 */
  flowDescription?: string
  /** 流程状态 */
  flowStatus?: 'ENABLED' | 'DISABLED'
  /** 是否默认流程 */
  isDefault?: boolean
  /** 备注 */
  remark?: string
}

/**
 * 流程设计器Props
 */
export interface FlowDesignerProps {
  /** 流程基本信息 */
  flowInfo?: FlowBasicInfo
  /** 流程节点列表 */
  nodes?: DesignerNode[]
  /** 是否可编辑 */
  editable?: boolean
  /** 是否只读 */
  readonly?: boolean
}

/**
 * 流程设计器Emits
 */
export interface FlowDesignerEmits {
  /** 流程保存 */
  (e: 'save', data: { flowInfo: FlowBasicInfo; nodes: DesignerNode[] }): void
  /** 流程取消 */
  (e: 'cancel'): void
  /** 节点添加 */
  (e: 'node-add', node: DesignerNode): void
  /** 节点删除 */
  (e: 'node-delete', nodeId: string): void
  /** 节点更新 */
  (e: 'node-update', node: DesignerNode): void
  /** 节点顺序变化 */
  (e: 'node-reorder', nodes: DesignerNode[]): void
}

/**
 * 流程设计器实例方法
 */
export interface FlowDesignerInstance {
  /** 添加节点 */
  addNode: (node: Partial<DesignerNode>) => void
  /** 删除节点 */
  deleteNode: (nodeId: string) => void
  /** 更新节点 */
  updateNode: (nodeId: string, node: Partial<DesignerNode>) => void
  /** 调整节点顺序 */
  reorderNodes: (nodes: DesignerNode[]) => void
  /** 获取流程数据 */
  getFlowData: () => { flowInfo: FlowBasicInfo; nodes: DesignerNode[] }
  /** 验证流程配置 */
  validateFlow: () => { valid: boolean; errors: string[] }
}

/**
 * 节点表单数据
 */
export interface NodeFormData {
  /** 节点名称 */
  name: string
  /** 节点类型 */
  type: DesignerNodeType
  /** 审批人类型 */
  approverType: DesignerApproverType
  /** 审批人配置 */
  approverConfig?: any
  /** 抄送用户 */
  ccUsers?: any[]
  /** 条件配置 */
  conditionConfig?: any
  /** 审批模式 */
  approvalMode?: DesignerApprovalMode
  /** 是否必填 */
  isRequired?: boolean
  /** 是否自动审批 */
  autoApprove?: boolean
  /** 超时时间 */
  timeoutHours?: number
  /** 超时操作 */
  timeoutAction?: string
}
