/**
 * 消息通知模块类型定义
 */

import type { PageQueryParams, PageResponse } from '@/types/response'

// ============================================
// 1. 通知渠道枚举
// ============================================

/**
 * 通知渠道类型
 */
export enum NotificationChannel {
  /** 站内信 */
  INBOX = 'inbox',
  /** 邮件 */
  EMAIL = 'email',
  /** 短信 */
  SMS = 'sms',
  /** 微信 */
  WECHAT = 'wechat',
  /** APP推送 */
  PUSH = 'push',
}

/**
 * 通知渠道名称映射
 */
export const NotificationChannelName: Record<NotificationChannel, string> = {
  [NotificationChannel.INBOX]: '站内信',
  [NotificationChannel.EMAIL]: '邮件',
  [NotificationChannel.SMS]: '短信',
  [NotificationChannel.WECHAT]: '微信',
  [NotificationChannel.PUSH]: 'APP推送',
}

// ============================================
// 2. 通知类型枚举
// ============================================

/**
 * 通知类型
 */
export enum NotificationType {
  /** 系统通知 */
  SYSTEM = 'system',
  /** 审批通知 */
  APPROVAL = 'approval',
  /** 业务通知 */
  BUSINESS = 'business',
  /** 预警通知 */
  WARNING = 'warning',
  /** 提醒通知 */
  REMINDER = 'reminder',
  /** 公告通知 */
  ANNOUNCEMENT = 'announcement',
}

/**
 * 通知类型名称映射
 */
export const NotificationTypeName: Record<NotificationType, string> = {
  [NotificationType.SYSTEM]: '系统通知',
  [NotificationType.APPROVAL]: '审批通知',
  [NotificationType.BUSINESS]: '业务通知',
  [NotificationType.WARNING]: '预警通知',
  [NotificationType.REMINDER]: '提醒通知',
  [NotificationType.ANNOUNCEMENT]: '公告通知',
}

// ============================================
// 3. 通知优先级枚举
// ============================================

/**
 * 通知优先级
 */
export enum NotificationPriority {
  /** 紧急 */
  URGENT = 'urgent',
  /** 高 */
  HIGH = 'high',
  /** 中 */
  MEDIUM = 'medium',
  /** 低 */
  LOW = 'low',
}

/**
 * 通知优先级名称映射
 */
export const NotificationPriorityName: Record<NotificationPriority, string> = {
  [NotificationPriority.URGENT]: '紧急',
  [NotificationPriority.HIGH]: '高',
  [NotificationPriority.MEDIUM]: '中',
  [NotificationPriority.LOW]: '低',
}

/**
 * 通知优先级权重（用于排序）
 */
export const NotificationPriorityWeight: Record<NotificationPriority, number> = {
  [NotificationPriority.URGENT]: 4,
  [NotificationPriority.HIGH]: 3,
  [NotificationPriority.MEDIUM]: 2,
  [NotificationPriority.LOW]: 1,
}

// ============================================
// 4. 通知状态枚举
// ============================================

/**
 * 通知状态
 */
export enum NotificationStatus {
  /** 待发送 */
  PENDING = 'pending',
  /** 发送中 */
  SENDING = 'sending',
  /** 发送成功 */
  SUCCESS = 'success',
  /** 发送失败 */
  FAILED = 'failed',
  /** 已取消 */
  CANCELLED = 'cancelled',
}

/**
 * 通知状态名称映射
 */
export const NotificationStatusName: Record<NotificationStatus, string> = {
  [NotificationStatus.PENDING]: '待发送',
  [NotificationStatus.SENDING]: '发送中',
  [NotificationStatus.SUCCESS]: '发送成功',
  [NotificationStatus.FAILED]: '发送失败',
  [NotificationStatus.CANCELLED]: '已取消',
}

// ============================================
// 5. 消息模板类型枚举
// ============================================

/**
 * 消息模板类型
 */
export enum MessageTemplateType {
  /** 审批待办 */
  APPROVAL_TODO = 'approval_todo',
  /** 审批通过 */
  APPROVAL_APPROVED = 'approval_approved',
  /** 审批驳回 */
  APPROVAL_REJECTED = 'approval_rejected',
  /** 审批转交 */
  APPROVAL_TRANSFER = 'approval_transfer',
  /** 审批委派 */
  APPROVAL_DELEGATE = 'approval_delegate',
  /** 审批撤回 */
  APPROVAL_WITHDRAW = 'approval_withdraw',
  /** 审批完成 */
  APPROVAL_COMPLETE = 'approval_complete',
  /** 系统公告 */
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  /** 业务提醒 */
  BUSINESS_REMINDER = 'business_reminder',
  /** 预警通知 */
  WARNING_NOTIFICATION = 'warning_notification',
}

/**
 * 消息模板类型名称映射
 */
export const MessageTemplateTypeName: Record<MessageTemplateType, string> = {
  [MessageTemplateType.APPROVAL_TODO]: '审批待办',
  [MessageTemplateType.APPROVAL_APPROVED]: '审批通过',
  [MessageTemplateType.APPROVAL_REJECTED]: '审批驳回',
  [MessageTemplateType.APPROVAL_TRANSFER]: '审批转交',
  [MessageTemplateType.APPROVAL_DELEGATE]: '审批委派',
  [MessageTemplateType.APPROVAL_WITHDRAW]: '审批撤回',
  [MessageTemplateType.APPROVAL_COMPLETE]: '审批完成',
  [MessageTemplateType.SYSTEM_ANNOUNCEMENT]: '系统公告',
  [MessageTemplateType.BUSINESS_REMINDER]: '业务提醒',
  [MessageTemplateType.WARNING_NOTIFICATION]: '预警通知',
}

// ============================================
// 6. 消息模板相关接口
// ============================================

/**
 * 消息模板变量
 */
export interface MessageTemplateVariable {
  /** 变量名称 */
  name: string
  /** 变量描述 */
  description: string
  /** 变量类型 */
  type: 'string' | 'number' | 'date' | 'boolean'
  /** 是否必填 */
  required: boolean
  /** 默认值 */
  defaultValue?: any
  /** 示例值 */
  example?: string
}

/**
 * 消息模板配置
 */
export interface MessageTemplateConfig {
  /** 模板ID */
  id: number
  /** 模板编码 */
  templateCode: MessageTemplateType
  /** 模板名称 */
  templateName: string
  /** 模板描述 */
  description?: string
  /** 模板类型 */
  templateType: NotificationType
  /** 通知渠道 */
  channels: NotificationChannel[]
  /** 模板标题 */
  title: string
  /** 模板内容 */
  content: string
  /** 模板变量 */
  variables: MessageTemplateVariable[]
  /** 是否启用 */
  enabled: boolean
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 消息模板查询参数
 */
export interface MessageTemplateQueryParams extends PageQueryParams {
  /** 模板编码 */
  templateCode?: MessageTemplateType
  /** 模板类型 */
  templateType?: NotificationType
  /** 通知渠道 */
  channel?: NotificationChannel
  /** 是否启用 */
  enabled?: boolean
  /** 关键词 */
  keyword?: string
}

/**
 * 消息模板表单
 */
export interface MessageTemplateForm {
  /** 模板ID */
  id?: number
  /** 模板编码 */
  templateCode: MessageTemplateType
  /** 模板名称 */
  templateName: string
  /** 模板描述 */
  description?: string
  /** 模板类型 */
  templateType: NotificationType
  /** 通知渠道 */
  channels: NotificationChannel[]
  /** 模板标题 */
  title: string
  /** 模板内容 */
  content: string
  /** 模板变量 */
  variables: MessageTemplateVariable[]
  /** 是否启用 */
  enabled: boolean
}

// ============================================
// 7. 消息通知相关接口
// ============================================

/**
 * 消息通知请求
 */
export interface NotificationRequest {
  /** 通知类型 */
  notificationType: NotificationType
  /** 通知渠道 */
  channels: NotificationChannel[]
  /** 接收人ID列表 */
  receiverIds: number[]
  /** 接收人列表 */
  receivers?: NotificationReceiver[]
  /** 消息模板编码 */
  templateCode?: MessageTemplateType
  /** 消息标题 */
  title: string
  /** 消息内容 */
  content: string
  /** 消息变量 */
  variables?: Record<string, any>
  /** 通知优先级 */
  priority: NotificationPriority
  /** 业务类型 */
  businessType?: string
  /** 业务ID */
  businessId?: number
  /** 附件列表 */
  attachments?: NotificationAttachment[]
  /** 延迟发送时间 */
  delayTime?: string
  /** 过期时间 */
  expireTime?: string
  /** 发送人ID */
  senderId?: number
  /** 发送人名称 */
  senderName?: string
}

/**
 * 消息通知接收人
 */
export interface NotificationReceiver {
  /** 接收人ID */
  userId: number
  /** 接收人姓名 */
  userName: string
  /** 接收人手机号 */
  phone?: string
  /** 接收人邮箱 */
  email?: string
  /** 接收人微信OpenID */
  wechatOpenId?: string
  /** 接收人设备Token */
  deviceToken?: string
}

/**
 * 消息通知附件
 */
export interface NotificationAttachment {
  /** 附件ID */
  id: number
  /** 附件名称 */
  name: string
  /** 附件URL */
  url: string
  /** 附件大小 */
  size: number
  /** 附件类型 */
  type: string
}

/**
 * 消息通知记录
 */
export interface NotificationRecord {
  /** 通知ID */
  id: number
  /** 通知类型 */
  notificationType: NotificationType
  /** 通知类型名称 */
  notificationTypeName: string
  /** 通知渠道 */
  channel: NotificationChannel
  /** 通知渠道名称 */
  channelName: string
  /** 接收人ID */
  receiverId: number
  /** 接收人姓名 */
  receiverName: string
  /** 消息标题 */
  title: string
  /** 消息内容 */
  content: string
  /** 通知优先级 */
  priority: NotificationPriority
  /** 优先级名称 */
  priorityName: string
  /** 通知状态 */
  status: NotificationStatus
  /** 状态名称 */
  statusName: string
  /** 发送次数 */
  sendCount: number
  /** 最大重试次数 */
  maxRetryCount: number
  /** 发送时间 */
  sendTime?: string
  /** 成功时间 */
  successTime?: string
  /** 失败原因 */
  failureReason?: string
  /** 业务类型 */
  businessType?: string
  /** 业务ID */
  businessId?: number
  /** 附件列表 */
  attachments?: NotificationAttachment[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 消息通知查询参数
 */
export interface NotificationRecordQueryParams extends PageQueryParams {
  /** 通知类型 */
  notificationType?: NotificationType
  /** 通知渠道 */
  channel?: NotificationChannel
  /** 接收人ID */
  receiverId?: number
  /** 通知状态 */
  status?: NotificationStatus
  /** 通知优先级 */
  priority?: NotificationPriority
  /** 业务类型 */
  businessType?: string
  /** 业务ID */
  businessId?: number
  /** 关键词 */
  keyword?: string
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
}

// ============================================
// 8. 站内信相关接口
// ============================================

/**
 * 站内信消息
 */
export interface InboxMessage {
  /** 消息ID */
  id: number
  /** 消息类型 */
  type: NotificationType
  /** 类型名称 */
  typeName: string
  /** 消息标题 */
  title: string
  /** 消息内容 */
  content: string
  /** 发送人ID */
  senderId?: number
  /** 发送人名称 */
  senderName?: string
  /** 接收人ID */
  receiverId: number
  /** 接收人姓名 */
  receiverName: string
  /** 消息优先级 */
  priority: NotificationPriority
  /** 优先级名称 */
  priorityName: string
  /** 阅读状态 */
  readStatus: boolean
  /** 阅读时间 */
  readTime?: string
  /** 业务类型 */
  businessType?: string
  /** 业务ID */
  businessId?: number
  /** 附件列表 */
  attachments?: NotificationAttachment[]
  /** 发送时间 */
  sendTime: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 站内信查询参数
 */
export interface InboxMessageQueryParams extends PageQueryParams {
  /** 消息类型 */
  type?: NotificationType
  /** 阅读状态 */
  readStatus?: boolean
  /** 消息优先级 */
  priority?: NotificationPriority
  /** 业务类型 */
  businessType?: string
  /** 业务ID */
  businessId?: number
  /** 关键词 */
  keyword?: string
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
}

/**
 * 站内信统计
 */
export interface InboxMessageStatistics {
  /** 总数 */
  total: number
  /** 未读数 */
  unread: number
  /** 已读数 */
  read: number
  /** 紧急数 */
  urgent: number
  /** 高优先级数 */
  high: number
}

// ============================================
// 9. 邮件通知相关接口
// ============================================

/**
 * 邮件通知记录
 */
export interface EmailNotificationRecord {
  /** 邮件ID */
  id: number
  /** 通知ID */
  notificationId: number
  /** 收件人邮箱 */
  toEmail: string
  /** 收件人姓名 */
  toName: string
  /** 抄送邮箱列表 */
  ccEmails?: string[]
  /** 密送邮箱列表 */
  bccEmails?: string[]
  /** 邮件主题 */
  subject: string
  /** 邮件内容 */
  content: string
  /** 邮件类型 */
  contentType: 'text' | 'html'
  /** 附件列表 */
  attachments?: NotificationAttachment[]
  /** 发送状态 */
  status: NotificationStatus
  /** 发送次数 */
  sendCount: number
  /** 最大重试次数 */
  maxRetryCount: number
  /** 发送时间 */
  sendTime?: string
  /** 成功时间 */
  successTime?: string
  /** 失败原因 */
  failureReason?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 邮件通知查询参数
 */
export interface EmailNotificationQueryParams extends PageQueryParams {
  /** 收件人邮箱 */
  toEmail?: string
  /** 发送状态 */
  status?: NotificationStatus
  /** 关键词 */
  keyword?: string
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
}

// ============================================
// 10. 短信通知相关接口
// ============================================

/**
 * 短信通知记录
 */
export interface SmsNotificationRecord {
  /** 短信ID */
  id: number
  /** 通知ID */
  notificationId: number
  /** 收件人手机号 */
  toPhone: string
  /** 收件人姓名 */
  toName: string
  /** 短信内容 */
  content: string
  /** 短信签名 */
  signature?: string
  /** 短信模板ID */
  templateId?: string
  /** 短信类型 */
  smsType: 'verification' | 'notification' | 'marketing'
  /** 发送状态 */
  status: NotificationStatus
  /** 发送次数 */
  sendCount: number
  /** 最大重试次数 */
  maxRetryCount: number
  /** 发送时间 */
  sendTime?: string
  /** 成功时间 */
  successTime?: string
  /** 失败原因 */
  failureReason?: string
  /** 短信服务商 */
  provider?: string
  /** 短信ID（服务商返回） */
  smsId?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 短信通知查询参数
 */
export interface SmsNotificationQueryParams extends PageQueryParams {
  /** 收件人手机号 */
  toPhone?: string
  /** 发送状态 */
  status?: NotificationStatus
  /** 短信类型 */
  smsType?: string
  /** 关键词 */
  keyword?: string
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
}

// ============================================
// 11. 消息队列相关接口
// ============================================

/**
 * 消息队列任务
 */
export interface NotificationQueueTask {
  /** 任务ID */
  id: number
  /** 通知ID */
  notificationId: number
  /** 任务类型 */
  taskType: NotificationChannel
  /** 任务状态 */
  status: NotificationStatus
  /** 任务优先级 */
  priority: NotificationPriority
  /** 重试次数 */
  retryCount: number
  /** 最大重试次数 */
  maxRetryCount: number
  /** 下次执行时间 */
  nextExecuteTime?: string
  /** 执行时间 */
  executeTime?: string
  /** 错误信息 */
  errorMessage?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 消息队列任务查询参数
 */
export interface NotificationQueueTaskQueryParams extends PageQueryParams {
  /** 任务类型 */
  taskType?: NotificationChannel
  /** 任务状态 */
  status?: NotificationStatus
  /** 任务优先级 */
  priority?: NotificationPriority
  /** 关键词 */
  keyword?: string
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
}

// ============================================
// 12. 消息通知统计相关接口
// ============================================

/**
 * 消息通知统计
 */
export interface NotificationStatistics {
  /** 总数 */
  total: number
  /** 待发送数 */
  pending: number
  /** 发送中数 */
  sending: number
  /** 成功数 */
  success: number
  /** 失败数 */
  failed: number
  /** 取消数 */
  cancelled: number
  /** 按渠道统计 */
  byChannel: {
    channel: NotificationChannel
    channelName: string
    total: number
    success: number
    failed: number
  }[]
  /** 按类型统计 */
  byType: {
    type: NotificationType
    typeName: string
    total: number
    success: number
    failed: number
  }[]
  /** 按日期统计 */
  byDate: {
    date: string
    total: number
    success: number
    failed: number
  }[]
}

// ============================================
// 13. 响应类型定义
// ============================================

/**
 * 消息通知响应
 */
export type NotificationResponse = PageResponse<NotificationRecord>

/**
 * 站内信响应
 */
export type InboxMessageResponse = PageResponse<InboxMessage>

/**
 * 邮件通知响应
 */
export type EmailNotificationResponse = PageResponse<EmailNotificationRecord>

/**
 * 短信通知响应
 */
export type SmsNotificationResponse = PageResponse<SmsNotificationRecord>

/**
 * 消息模板响应
 */
export type MessageTemplateResponse = PageResponse<MessageTemplateConfig>

/**
 * 消息队列任务响应
 */
export type NotificationQueueTaskResponse = PageResponse<NotificationQueueTask>

/**
 * 批量发送响应
 */
export interface BatchSendResponse {
  /** 成功数量 */
  successCount: number
  /** 失败数量 */
  failureCount: number
  /** 成功的接收人ID列表 */
  successReceiverIds: number[]
  /** 失败的接收人ID列表 */
  failureReceiverIds: number[]
  /** 失败原因 */
  errors: {
    receiverId: number
    receiverName: string
    error: string
  }[]
}

/**
 * 发送通知响应
 */
export interface SendNotificationResponse {
  /** 通知ID */
  notificationId: number
  /** 发送状态 */
  status: NotificationStatus
  /** 发送结果 */
  results: {
    channel: NotificationChannel
    status: NotificationStatus
    recordId?: number
    error?: string
  }[]
}

/**
 * 消息模板预览响应
 */
export interface MessageTemplatePreviewResponse {
  /** 模板ID */
  templateId: number
  /** 预览标题 */
  title: string
  /** 预览内容 */
  content: string
  /** 预览变量 */
  variables: Record<string, any>
}
