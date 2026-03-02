/**
 * 消息通知模块API服务
 * 包含消息通知、消息模板、站内信、邮件、短信等API接口
 */

import request from '@/utils/request'
import type {
  NotificationRequest,
  NotificationRecord,
  NotificationRecordQueryParams,
  NotificationResponse,
  NotificationStatistics,
  SendNotificationResponse,
  BatchSendResponse,
  MessageTemplateConfig,
  MessageTemplateForm,
  MessageTemplateQueryParams,
  MessageTemplateResponse,
  MessageTemplatePreviewResponse,
  InboxMessage,
  InboxMessageQueryParams,
  InboxMessageResponse,
  InboxMessageStatistics,
  EmailNotificationRecord,
  EmailNotificationQueryParams,
  EmailNotificationResponse,
  SmsNotificationRecord,
  SmsNotificationQueryParams,
  SmsNotificationResponse,
  NotificationQueueTask,
  NotificationQueueTaskQueryParams,
  NotificationQueueTaskResponse,
} from '@/types/notification'
import type { ApiResponse, BatchOperationResponse } from '@/types/response'

// ============================================
// 1. 消息通知API
// ============================================

/**
 * 发送消息通知
 * POST /api/v1/notifications/send
 * 发送单条或多条消息通知
 * 支持多种通知渠道
 * 支持消息模板
 * 支持消息优先级
 * 支持延迟发送
 */
export const sendNotification = (data: NotificationRequest) => {
  return request.post<ApiResponse<SendNotificationResponse>>('/api/v1/notifications/send', data)
}

/**
 * 批量发送消息通知
 * POST /api/v1/notifications/batch-send
 * 批量发送消息通知
 * 返回发送结果统计
 */
export const batchSendNotifications = (data: NotificationRequest[]) => {
  return request.post<ApiResponse<BatchSendResponse>>('/api/v1/notifications/batch-send', data)
}

/**
 * 获取消息通知列表
 * GET /api/v1/notifications
 * 支持分页查询
 * 支持按类型、渠道、状态、优先级等条件筛选
 */
export const getNotificationList = (params: NotificationRecordQueryParams) => {
  return request.get<NotificationResponse>('/api/v1/notifications', { params })
}

/**
 * 获取消息通知详情
 * GET /api/v1/notifications/{id}
 * 获取消息通知的详细信息
 */
export const getNotificationDetail = (id: number) => {
  return request.get<ApiResponse<NotificationRecord>>(`/api/v1/notifications/${id}`)
}

/**
 * 重新发送消息通知
 * POST /api/v1/notifications/{id}/resend
 * 重新发送失败的消息通知
 * 支持重试次数限制
 */
export const resendNotification = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/notifications/${id}/resend`)
}

/**
 * 批量重新发送消息通知
 * POST /api/v1/notifications/batch-resend
 * 批量重新发送失败的消息通知
 */
export const batchResendNotifications = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/notifications/batch-resend', { ids })
}

/**
 * 取消消息通知
 * POST /api/v1/notifications/{id}/cancel
 * 取消待发送的消息通知
 */
export const cancelNotification = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/notifications/${id}/cancel`)
}

/**
 * 批量取消消息通知
 * POST /api/v1/notifications/batch-cancel
 * 批量取消待发送的消息通知
 */
export const batchCancelNotifications = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/notifications/batch-cancel', { ids })
}

/**
 * 删除消息通知
 * DELETE /api/v1/notifications/{id}
 * 删除消息通知记录
 */
export const deleteNotification = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/notifications/${id}`)
}

/**
 * 批量删除消息通知
 * POST /api/v1/notifications/batch-delete
 * 批量删除消息通知记录
 */
export const batchDeleteNotifications = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/notifications/batch-delete', { ids })
}

/**
 * 获取消息通知统计
 * GET /api/v1/notifications/statistics
 * 获取消息通知的统计数据
 * 包括总数、成功数、失败数等
 */
export const getNotificationStatistics = (params?: {
  startDate?: string
  endDate?: string
}) => {
  return request.get<ApiResponse<NotificationStatistics>>('/api/v1/notifications/statistics', { params })
}

// ============================================
// 2. 消息模板API
// ============================================

/**
 * 获取消息模板列表
 * GET /api/v1/notification-templates
 * 支持分页查询
 * 支持按类型、渠道等条件筛选
 */
export const getMessageTemplateList = (params: MessageTemplateQueryParams) => {
  return request.get<MessageTemplateResponse>('/api/v1/notification-templates', { params })
}

/**
 * 获取消息模板详情
 * GET /api/v1/notification-templates/{id}
 * 获取消息模板的详细信息
 */
export const getMessageTemplateDetail = (id: number) => {
  return request.get<ApiResponse<MessageTemplateConfig>>(`/api/v1/notification-templates/${id}`)
}

/**
 * 创建消息模板
 * POST /api/v1/notification-templates
 * 创建新的消息模板
 */
export const createMessageTemplate = (data: MessageTemplateForm) => {
  return request.post<ApiResponse<{ id: number }>>('/api/v1/notification-templates', data)
}

/**
 * 更新消息模板
 * PUT /api/v1/notification-templates/{id}
 * 更新消息模板信息
 */
export const updateMessageTemplate = (id: number, data: MessageTemplateForm) => {
  return request.put<ApiResponse<void>>(`/api/v1/notification-templates/${id}`, data)
}

/**
 * 删除消息模板
 * DELETE /api/v1/notification-templates/{id}
 * 删除消息模板
 */
export const deleteMessageTemplate = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/notification-templates/${id}`)
}

/**
 * 批量删除消息模板
 * POST /api/v1/notification-templates/batch-delete
 * 批量删除消息模板
 */
export const batchDeleteMessageTemplates = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/notification-templates/batch-delete', { ids })
}

/**
 * 启用消息模板
 * POST /api/v1/notification-templates/{id}/enable
 * 启用消息模板
 */
export const enableMessageTemplate = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/notification-templates/${id}/enable`)
}

/**
 * 禁用消息模板
 * POST /api/v1/notification-templates/{id}/disable
 * 禁用消息模板
 */
export const disableMessageTemplate = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/notification-templates/${id}/disable`)
}

/**
 * 预览消息模板
 * POST /api/v1/notification-templates/preview
 * 预览消息模板的渲染效果
 */
export const previewMessageTemplate = (data: {
  templateCode: string
  variables: Record<string, any>
}) => {
  return request.post<ApiResponse<MessageTemplatePreviewResponse>>('/api/v1/notification-templates/preview', data)
}

// ============================================
// 3. 站内信API
// ============================================

/**
 * 获取站内信列表
 * GET /api/v1/inbox-messages
 * 支持分页查询
 * 支持按类型、阅读状态、优先级等条件筛选
 */
export const getInboxMessageList = (params: InboxMessageQueryParams) => {
  return request.get<InboxMessageResponse>('/api/v1/inbox-messages', { params })
}

/**
 * 获取站内信详情
 * GET /api/v1/inbox-messages/{id}
 * 获取站内信的详细信息
 */
export const getInboxMessageDetail = (id: number) => {
  return request.get<ApiResponse<InboxMessage>>(`/api/v1/inbox-messages/${id}`)
}

/**
 * 标记站内信为已读
 * POST /api/v1/inbox-messages/{id}/read
 * 标记站内信为已读状态
 */
export const markInboxMessageAsRead = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/inbox-messages/${id}/read`)
}

/**
 * 批量标记站内信为已读
 * POST /api/v1/inbox-messages/batch-read
 * 批量标记站内信为已读状态
 */
export const batchMarkInboxMessagesAsRead = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/inbox-messages/batch-read', { ids })
}

/**
 * 标记站内信为未读
 * POST /api/v1/inbox-messages/{id}/unread
 * 标记站内信为未读状态
 */
export const markInboxMessageAsUnread = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/inbox-messages/${id}/unread`)
}

/**
 * 删除站内信
 * DELETE /api/v1/inbox-messages/{id}
 * 删除站内信
 */
export const deleteInboxMessage = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/inbox-messages/${id}`)
}

/**
 * 批量删除站内信
 * POST /api/v1/inbox-messages/batch-delete
 * 批量删除站内信
 */
export const batchDeleteInboxMessages = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/inbox-messages/batch-delete', { ids })
}

/**
 * 全部标记为已读
 * POST /api/v1/inbox-messages/mark-all-read
 * 将所有站内信标记为已读状态
 */
export const markAllInboxMessagesAsRead = () => {
  return request.post<ApiResponse<void>>('/api/v1/inbox-messages/mark-all-read')
}

/**
 * 获取站内信统计
 * GET /api/v1/inbox-messages/statistics
 * 获取站内信的统计数据
 * 包括总数、未读数、已读数等
 */
export const getInboxMessageStatistics = () => {
  return request.get<ApiResponse<InboxMessageStatistics>>('/api/v1/inbox-messages/statistics')
}

// ============================================
// 4. 邮件通知API
// ============================================

/**
 * 获取邮件通知列表
 * GET /api/v1/email-notifications
 * 支持分页查询
 * 支持按收件人、状态等条件筛选
 */
export const getEmailNotificationList = (params: EmailNotificationQueryParams) => {
  return request.get<EmailNotificationResponse>('/api/v1/email-notifications', { params })
}

/**
 * 获取邮件通知详情
 * GET /api/v1/email-notifications/{id}
 * 获取邮件通知的详细信息
 */
export const getEmailNotificationDetail = (id: number) => {
  return request.get<ApiResponse<EmailNotificationRecord>>(`/api/v1/email-notifications/${id}`)
}

/**
 * 重新发送邮件通知
 * POST /api/v1/email-notifications/{id}/resend
 * 重新发送失败的邮件通知
 */
export const resendEmailNotification = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/email-notifications/${id}/resend`)
}

/**
 * 批量重新发送邮件通知
 * POST /api/v1/email-notifications/batch-resend
 * 批量重新发送失败的邮件通知
 */
export const batchResendEmailNotifications = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/email-notifications/batch-resend', { ids })
}

/**
 * 删除邮件通知
 * DELETE /api/v1/email-notifications/{id}
 * 删除邮件通知记录
 */
export const deleteEmailNotification = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/email-notifications/${id}`)
}

/**
 * 批量删除邮件通知
 * POST /api/v1/email-notifications/batch-delete
 * 批量删除邮件通知记录
 */
export const batchDeleteEmailNotifications = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/email-notifications/batch-delete', { ids })
}

// ============================================
// 5. 短信通知API
// ============================================

/**
 * 获取短信通知列表
 * GET /api/v1/sms-notifications
 * 支持分页查询
 * 支持按收件人、状态、类型等条件筛选
 */
export const getSmsNotificationList = (params: SmsNotificationQueryParams) => {
  return request.get<SmsNotificationResponse>('/api/v1/sms-notifications', { params })
}

/**
 * 获取短信通知详情
 * GET /api/v1/sms-notifications/{id}
 * 获取短信通知的详细信息
 */
export const getSmsNotificationDetail = (id: number) => {
  return request.get<ApiResponse<SmsNotificationRecord>>(`/api/v1/sms-notifications/${id}`)
}

/**
 * 重新发送短信通知
 * POST /api/v1/sms-notifications/{id}/resend
 * 重新发送失败的短信通知
 */
export const resendSmsNotification = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/sms-notifications/${id}/resend`)
}

/**
 * 批量重新发送短信通知
 * POST /api/v1/sms-notifications/batch-resend
 * 批量重新发送失败的短信通知
 */
export const batchResendSmsNotifications = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/sms-notifications/batch-resend', { ids })
}

/**
 * 删除短信通知
 * DELETE /api/v1/sms-notifications/{id}
 * 删除短信通知记录
 */
export const deleteSmsNotification = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/sms-notifications/${id}`)
}

/**
 * 批量删除短信通知
 * POST /api/v1/sms-notifications/batch-delete
 * 批量删除短信通知记录
 */
export const batchDeleteSmsNotifications = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/sms-notifications/batch-delete', { ids })
}

// ============================================
// 6. 消息队列API
// ============================================

/**
 * 获取消息队列任务列表
 * GET /api/v1/notification-queue-tasks
 * 支持分页查询
 * 支持按类型、状态、优先级等条件筛选
 */
export const getNotificationQueueTaskList = (params: NotificationQueueTaskQueryParams) => {
  return request.get<NotificationQueueTaskResponse>('/api/v1/notification-queue-tasks', { params })
}

/**
 * 获取消息队列任务详情
 * GET /api/v1/notification-queue-tasks/{id}
 * 获取消息队列任务的详细信息
 */
export const getNotificationQueueTaskDetail = (id: number) => {
  return request.get<ApiResponse<NotificationQueueTask>>(`/api/v1/notification-queue-tasks/${id}`)
}

/**
 * 手动执行消息队列任务
 * POST /api/v1/notification-queue-tasks/{id}/execute
 * 手动执行消息队列任务
 */
export const executeNotificationQueueTask = (id: number) => {
  return request.post<ApiResponse<void>>(`/api/v1/notification-queue-tasks/${id}/execute`)
}

/**
 * 批量手动执行消息队列任务
 * POST /api/v1/notification-queue-tasks/batch-execute
 * 批量手动执行消息队列任务
 */
export const batchExecuteNotificationQueueTasks = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/notification-queue-tasks/batch-execute', { ids })
}

/**
 * 删除消息队列任务
 * DELETE /api/v1/notification-queue-tasks/{id}
 * 删除消息队列任务
 */
export const deleteNotificationQueueTask = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/notification-queue-tasks/${id}`)
}

/**
 * 批量删除消息队列任务
 * POST /api/v1/notification-queue-tasks/batch-delete
 * 批量删除消息队列任务
 */
export const batchDeleteNotificationQueueTasks = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/notification-queue-tasks/batch-delete', { ids })
}

// ============================================
// 7. 导出所有接口
// ============================================

export default {
  // 消息通知
  sendNotification,
  batchSendNotifications,
  getNotificationList,
  getNotificationDetail,
  resendNotification,
  batchResendNotifications,
  cancelNotification,
  batchCancelNotifications,
  deleteNotification,
  batchDeleteNotifications,
  getNotificationStatistics,

  // 消息模板
  getMessageTemplateList,
  getMessageTemplateDetail,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
  batchDeleteMessageTemplates,
  enableMessageTemplate,
  disableMessageTemplate,
  previewMessageTemplate,

  // 站内信
  getInboxMessageList,
  getInboxMessageDetail,
  markInboxMessageAsRead,
  batchMarkInboxMessagesAsRead,
  markInboxMessageAsUnread,
  deleteInboxMessage,
  batchDeleteInboxMessages,
  markAllInboxMessagesAsRead,
  getInboxMessageStatistics,

  // 邮件通知
  getEmailNotificationList,
  getEmailNotificationDetail,
  resendEmailNotification,
  batchResendEmailNotifications,
  deleteEmailNotification,
  batchDeleteEmailNotifications,

  // 短信通知
  getSmsNotificationList,
  getSmsNotificationDetail,
  resendSmsNotification,
  batchResendSmsNotifications,
  deleteSmsNotification,
  batchDeleteSmsNotifications,

  // 消息队列
  getNotificationQueueTaskList,
  getNotificationQueueTaskDetail,
  executeNotificationQueueTask,
  batchExecuteNotificationQueueTasks,
  deleteNotificationQueueTask,
  batchDeleteNotificationQueueTasks,
}
