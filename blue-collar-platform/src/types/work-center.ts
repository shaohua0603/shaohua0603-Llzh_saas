/**
 * 工作中心模块类型定义
 */

import type { PageQueryParams, PageResponse } from '@/types/response'

/**
 * 待办任务类型枚举
 */
export enum TaskType {
  TENANT_AUDIT = 'tenant_audit', // 租户审核
  WARNING_HANDLE = 'warning_handle', // 预警处理
  ACTIVITY_AUDIT = 'activity_audit', // 活动审核
  COMPLAINT_HANDLE = 'complaint_handle', // 投诉处理
  COMMISSION_RULE_AUDIT = 'commission_rule_audit', // 佣金规则审核
  SYSTEM_NOTICE = 'system_notice', // 系统通知
  APPROVAL = 'approval', // 审批任务
}

/**
 * 任务优先级枚举
 */
export enum TaskPriority {
  URGENT = 'urgent', // 紧急
  HIGH = 'high', // 高
  MEDIUM = 'medium', // 中
  LOW = 'low', // 低
}

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  PENDING = 'pending', // 待处理
  IN_PROGRESS = 'in_progress', // 处理中
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled', // 已取消
}

/**
 * 消息类型枚举
 */
export enum MessageType {
  SYSTEM = 'system', // 系统通知
  FEATURE = 'feature', // 功能通知
  POLICY = 'policy', // 政策通知
  TRAINING = 'training', // 培训通知
  BUSINESS = 'business', // 业务通知
}

/**
 * 消息优先级枚举
 */
export enum MessagePriority {
  HIGH = 'high', // 高
  MEDIUM = 'medium', // 中
  LOW = 'low', // 低
}

/**
 * 消息状态枚举
 */
export enum MessageStatus {
  UNREAD = 'unread', // 未读
  READ = 'read', // 已读
}

/**
 * 预警类型枚举
 */
export enum WarningType {
  TURNOVER_RATE = 'turnover_rate', // 离职率异常
  COMPLAINT_RATE = 'complaint_rate', // 投诉率异常
  SYSTEM_PERFORMANCE = 'system_performance', // 系统性能
  DATA_SECURITY = 'data_security', // 数据安全
  BUSINESS = 'business', // 业务预警
}

/**
 * 预警级别枚举
 */
export enum WarningLevel {
  URGENT = 'urgent', // 紧急
  HIGH = 'high', // 高
  MEDIUM = 'medium', // 中
  LOW = 'low', // 低
}

/**
 * 预警状态枚举
 */
export enum WarningStatus {
  UNHANDLED = 'unhandled', // 未处理
  HANDLED = 'handled', // 已处理
  IGNORED = 'ignored', // 已忽略
}

/**
 * 待办任务
 */
export interface TodoTask {
  id: number
  title: string
  type: TaskType
  typeName: string
  priority: TaskPriority
  priorityName: string
  status: TaskStatus
  statusName: string
  content?: string
  applicant?: string
  applyTime?: string
  deadline?: string
  completeTime?: string
  createTime: string
  updateTime?: string
  // 审批相关字段
  businessCode?: string
  businessId?: number
  nodeId?: number
  nodeName?: string
  assigneeId?: number
  assigneeName?: string
}

/**
 * 待办任务查询参数
 */
export interface TodoTaskQueryParams extends PageQueryParams {
  type?: TaskType
  priority?: TaskPriority
  status?: TaskStatus
  keyword?: string
  startDate?: string
  endDate?: string
}

/**
 * 待办任务表单
 */
export interface TodoTaskForm {
  id?: number
  title: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  content?: string
  deadline?: string
}

/**
 * 消息
 */
export interface Message {
  id: number
  title: string
  type: MessageType
  typeName: string
  content: string
  sender: string
  senderId?: number
  priority: MessagePriority
  priorityName: string
  status: MessageStatus
  statusName: string
  sendTime: string
  readTime?: string
  createTime: string
  updateTime?: string
}

/**
 * 消息查询参数
 */
export interface MessageQueryParams extends PageQueryParams {
  type?: MessageType
  status?: MessageStatus
  priority?: MessagePriority
  keyword?: string
  startDate?: string
  endDate?: string
}

/**
 * 消息标记已读表单
 */
export interface MessageReadForm {
  ids: number[]
}

/**
 * 预警消息
 */
export interface Warning {
  id: number
  title: string
  type: WarningType
  typeName: string
  level: WarningLevel
  levelName: string
  content: string
  target?: string
  targetId?: number
  warningTime: string
  status: WarningStatus
  statusName: string
  handleTime?: string
  handler?: string
  handlerId?: number
  handleRemark?: string
  createTime: string
  updateTime?: string
}

/**
 * 预警消息查询参数
 */
export interface WarningQueryParams extends PageQueryParams {
  type?: WarningType
  level?: WarningLevel
  status?: WarningStatus
  keyword?: string
  startDate?: string
  endDate?: string
}

/**
 * 预警处理表单
 */
export interface WarningHandleForm {
  id: number
  status: WarningStatus
  handleRemark?: string
}

/**
 * 待办任务响应
 */
export type TodoTaskResponse = PageResponse<TodoTask>

/**
 * 消息响应
 */
export type MessageResponse = PageResponse<Message>

/**
 * 预警消息响应
 */
export type WarningResponse = PageResponse<Warning>

/**
 * 待办任务统计
 */
export interface TodoTaskStatistics {
  total: number
  pending: number
  inProgress: number
  completed: number
  urgent: number
  high: number
}

/**
 * 消息统计
 */
export interface MessageStatistics {
  total: number
  unread: number
  read: number
  highPriority: number
}

/**
 * 预警消息统计
 */
export interface WarningStatistics {
  total: number
  unhandled: number
  handled: number
  urgent: number
  high: number
}
