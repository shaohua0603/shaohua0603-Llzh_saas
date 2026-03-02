/**
 * 流程配置功能类型定义
 * 基于数据库表结构：approval_flow, approval_node, flow_business_config, approval_record, business_approval_status, todo_task
 */

import type { ApiResponse, PageResponse } from './system/menuTypes'

// ============================================
// 枚举类型定义
// ============================================

/**
 * 流程状态
 */
export enum FlowStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

/**
 * 节点类型
 */
export enum NodeType {
  APPROVAL = 'APPROVAL',
  CC = 'CC',
  CONDITION = 'CONDITION'
}

/**
 * 审批模式
 */
export enum ApprovalMode {
  OR = 'OR',
  AND = 'AND'
}

/**
 * 审批人类型
 */
export enum ApproverType {
  ROLE = 'ROLE',
  DEPARTMENT = 'DEPARTMENT',
  POSITION = 'POSITION',
  USER = 'USER',
  FORM_FIELD = 'FORM_FIELD'
}

/**
 * 审批结果
 */
export enum ApprovalResult {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  TRANSFER = 'TRANSFER',
  DELEGATE = 'DELEGATE'
}

/**
 * 业务审批状态
 */
export enum BusinessApprovalStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

/**
 * 任务类型
 */
export enum TaskType {
  APPROVAL = 'APPROVAL',
  NOTICE = 'NOTICE',
  REMIND = 'REMIND',
  WARNING = 'WARNING'
}

/**
 * 任务状态
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * 优先级
 */
export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// ============================================
// 审批流程相关类型
// ============================================

/**
 * 审批节点
 */
export interface ApprovalNode {
  id?: number
  flowId?: number
  nodeName: string
  nodeCode: string
  nodeType: NodeType
  nodeOrder: number
  approvalMode?: ApprovalMode
  approverType: ApproverType
  approverConfig?: string
  ccUsers?: string
  conditionConfig?: string
  isRequired?: number
  autoApprove?: number
  timeoutHours?: number
  timeoutAction?: string
  tenantId?: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  remark?: string
}

/**
 * 审批流程
 */
export interface ApprovalFlow {
  id?: number
  flowName: string
  flowCode: string
  flowType: string
  flowDescription?: string
  flowStatus?: FlowStatus
  isDefault?: number
  version?: number
  tenantId?: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  remark?: string
  nodes?: ApprovalNode[]
  nodeCount?: number
}

/**
 * 审批流程查询参数
 */
export interface ApprovalFlowQueryParams {
  page: number
  pageSize: number
  flowType?: string
  flowStatus?: FlowStatus
  keyword?: string
}

/**
 * 审批流程表单
 */
export interface ApprovalFlowForm {
  id?: number
  flowName: string
  flowCode: string
  flowType: string
  flowDescription?: string
  flowStatus?: FlowStatus
  isDefault?: number
  nodes?: ApprovalNode[]
  remark?: string
}

// ============================================
// 流程配置相关类型
// ============================================

/**
 * 流程配置
 */
export interface FlowBusinessConfig {
  id?: number
  businessCode: string
  businessName: string
  flowId: number
  flowName?: string
  isEnabled?: number
  effectiveDate?: string
  expiryDate?: string
  configDescription?: string
  tenantId?: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  remark?: string
}

/**
 * 流程配置查询参数
 */
export interface FlowConfigQueryParams {
  page: number
  pageSize: number
  businessCode?: string
  isEnabled?: number
}

/**
 * 流程配置表单
 */
export interface FlowConfigForm {
  id?: number
  businessCode: string
  businessName: string
  flowId: number
  isEnabled?: number
  effectiveDate?: string
  expiryDate?: string
  configDescription?: string
  remark?: string
}

// ============================================
// 审批记录相关类型
// ============================================

/**
 * 审批记录
 */
export interface ApprovalRecord {
  id?: number
  businessCode: string
  businessId: number
  flowId: number
  flowName?: string
  nodeId: number
  nodeName: string
  approverId: number
  approverName?: string
  approverDept?: string
  approvalResult?: ApprovalResult
  approvalComment?: string
  approvalTime?: string
  transferToId?: number
  transferToName?: string
  delegateToId?: number
  delegateToName?: string
  attachmentIds?: string
  isCurrent?: number
  tenantId?: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  remark?: string
  // 扩展字段,用于时间线显示
  attachments?: string[]
  ccUsers?: string[]
  rejectReason?: string
}

/**
 * 审批记录查询参数
 */
export interface ApprovalRecordQueryParams {
  businessId: number
  businessCode: string
}

// ============================================
// 业务审批状态相关类型
// ============================================

/**
 * 业务审批状态
 */
export interface BusinessApprovalStatus {
  id?: number
  businessCode: string
  businessId: number
  flowId: number
  flowName?: string
  currentNodeId?: number
  currentNodeName?: string
  approvalStatus?: BusinessApprovalStatus
  submitterId: number
  submitterName?: string
  submitTime: string
  completeTime?: string
  totalNodes?: number
  currentNodeOrder?: number
  rejectReason?: string
  cancelReason?: string
  tenantId?: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  remark?: string
}

// ============================================
// 待办任务相关类型
// ============================================

/**
 * 待办任务
 */
export interface TodoTask {
  id?: number
  taskType: TaskType
  taskTitle: string
  taskContent?: string
  taskSource?: string
  businessCode: string
  businessId: number
  taskStatus?: TaskStatus
  priority?: Priority
  assigneeId: number
  assigneeName?: string
  assigneeDept?: string
  senderId?: number
  senderName?: string
  dueDate?: string
  completeTime?: string
  readStatus?: number
  readTime?: string
  approvalRecordId?: number
  taskUrl?: string
  attachmentIds?: string
  tenantId?: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  remark?: string
}

/**
 * 待办任务查询参数
 */
export interface TodoTaskQueryParams {
  page: number
  pageSize: number
  taskStatus?: TaskStatus
  taskType?: TaskType
  priority?: Priority
  keyword?: string
}

// ============================================
// 审批执行相关类型
// ============================================

/**
 * 提交审批请求
 */
export interface SubmitApprovalRequest {
  businessCode: string
  businessId: number
  submitterId: number
  submitterName: string
}

/**
 * 提交审批响应
 */
export interface SubmitApprovalResponse {
  approvalId: number
  currentNode: string
  currentNodeId: number
}

/**
 * 审批操作请求
 */
export interface ApprovalActionRequest {
  businessCode: string
  businessId: number
  nodeId: number
  approverId: number
  approverName: string
  approvalComment?: string
  transferToId?: number
  transferToName?: string
  delegateToId?: number
  delegateToName?: string
  attachmentIds?: string
}

/**
 * 审批操作响应
 */
export interface ApprovalActionResponse {
  nextNode?: string
  nextNodeId?: number
  isCompleted: boolean
  approvalStatus: BusinessApprovalStatus
}

/**
 * 撤回审批请求
 */
export interface WithdrawApprovalRequest {
  userId: number
  userName: string
  cancelReason?: string
}

// ============================================
// 数据权限相关类型
// ============================================

/**
 * 数据权限类型
 */
export enum DataPermissionType {
  ALL = 'ALL',
  DEPARTMENT = 'DEPARTMENT',
  DEPARTMENT_AND_BELOW = 'DEPARTMENT_AND_BELOW',
  SELF = 'SELF',
  CUSTOM = 'CUSTOM'
}

/**
 * 数据权限配置
 */
export interface DataPermissionConfig {
  type: DataPermissionType
  departments?: string[]
  includeCreator?: boolean
  includeManager?: boolean
  includeContact?: boolean
}

// ============================================
// API响应类型
// ============================================

export type ApprovalFlowListResponse = PageResponse<ApprovalFlow>
export type ApprovalFlowDetailResponse = ApprovalFlow
export type FlowConfigListResponse = PageResponse<FlowBusinessConfig>
export type ApprovalRecordsResponse = ApprovalRecord[]
export type TodoTaskListResponse = PageResponse<TodoTask>
export type ApprovalStatusResponse = BusinessApprovalStatus
