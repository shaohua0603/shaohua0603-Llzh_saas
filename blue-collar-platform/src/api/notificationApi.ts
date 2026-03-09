/**
 * 消息通知模块API服务
 * 包含消息通知、消息模板、站内信、邮件、短信等API接口
 */

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

// Mock数据
const mockNotifications: NotificationRecord[] = [
  {
    id: 1,
    title: '测试消息',
    content: '这是一条测试消息',
    type: 'system',
    channel: 'inbox',
    status: 'sent',
    priority: 'normal',
    recipientId: 'USER001',
    recipientName: '张三',
    senderId: 'SYSTEM',
    senderName: '系统',
    templateCode: 'TEST_TEMPLATE',
    variables: { name: '张三' },
    sendTime: new Date().toISOString(),
    readTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: '审批通知',
    content: '您的请假申请已通过',
    type: 'approval',
    channel: 'inbox',
    status: 'sent',
    priority: 'high',
    recipientId: 'USER001',
    recipientName: '张三',
    senderId: 'SYSTEM',
    senderName: '系统',
    templateCode: 'APPROVAL_TEMPLATE',
    variables: { name: '张三', type: '请假' },
    sendTime: new Date().toISOString(),
    readTime: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockMessageTemplates: MessageTemplateConfig[] = [
  {
    id: 1,
    code: 'TEST_TEMPLATE',
    name: '测试模板',
    type: 'system',
    channel: 'inbox',
    subject: '测试消息',
    content: '您好，{name}，这是一条测试消息',
    status: 'enabled',
    variables: ['name'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    code: 'APPROVAL_TEMPLATE',
    name: '审批模板',
    type: 'approval',
    channel: 'inbox',
    subject: '审批通知',
    content: '您好，{name}，您的{type}申请已处理',
    status: 'enabled',
    variables: ['name', 'type'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockInboxMessages: InboxMessage[] = [
  {
    id: 1,
    title: '系统通知',
    content: '系统将于明天进行维护',
    type: 'system',
    status: 'read',
    priority: 'normal',
    senderId: 'SYSTEM',
    senderName: '系统',
    recipientId: 'USER001',
    recipientName: '张三',
    sendTime: new Date().toISOString(),
    readTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: '审批通知',
    content: '您的请假申请已通过',
    type: 'approval',
    status: 'unread',
    priority: 'high',
    senderId: 'SYSTEM',
    senderName: '系统',
    recipientId: 'USER001',
    recipientName: '张三',
    sendTime: new Date().toISOString(),
    readTime: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockEmailNotifications: EmailNotificationRecord[] = [
  {
    id: 1,
    recipient: 'zhangsan@example.com',
    subject: '测试邮件',
    content: '这是一封测试邮件',
    status: 'sent',
    sendTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockSmsNotifications: SmsNotificationRecord[] = [
  {
    id: 1,
    recipient: '13800138001',
    content: '您的验证码是123456',
    status: 'sent',
    sendTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockQueueTasks: NotificationQueueTask[] = [
  {
    id: 1,
    type: 'email',
    status: 'completed',
    priority: 'normal',
    payload: { recipient: 'zhangsan@example.com', subject: '测试邮件' },
    executeTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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
export const sendNotification = async (data: NotificationRequest) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      notificationId: 1,
      status: 'sent'
    } as SendNotificationResponse,
    timestamp: Date.now()
  } as ApiResponse<SendNotificationResponse>
}

/**
 * 批量发送消息通知
 * POST /api/v1/notifications/batch-send
 * 批量发送消息通知
 * 返回发送结果统计
 */
export const batchSendNotifications = async (data: NotificationRequest[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: data.length,
      success: data.length,
      failed: 0
    } as BatchSendResponse,
    timestamp: Date.now()
  } as ApiResponse<BatchSendResponse>
}

/**
 * 获取消息通知列表
 * GET /api/v1/notifications
 * 支持分页查询
 * 支持按类型、渠道、状态、优先级等条件筛选
 */
export const getNotificationList = async (params: NotificationRecordQueryParams) => {
  await delay(300)
  let filteredData = [...mockNotifications]
  
  if (params.type) {
    filteredData = filteredData.filter(item => item.type === params.type)
  }
  
  if (params.channel) {
    filteredData = filteredData.filter(item => item.channel === params.channel)
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  if (params.priority) {
    filteredData = filteredData.filter(item => item.priority === params.priority)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as NotificationResponse
}

/**
 * 获取消息通知详情
 * GET /api/v1/notifications/{id}
 * 获取消息通知的详细信息
 */
export const getNotificationDetail = async (id: number) => {
  await delay(200)
  const item = mockNotifications.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '消息通知不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<NotificationRecord>
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as ApiResponse<NotificationRecord>
}

/**
 * 重新发送消息通知
 * POST /api/v1/notifications/{id}/resend
 * 重新发送失败的消息通知
 * 支持重试次数限制
 */
export const resendNotification = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量重新发送消息通知
 * POST /api/v1/notifications/batch-resend
 * 批量重新发送失败的消息通知
 */
export const batchResendNotifications = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 取消消息通知
 * POST /api/v1/notifications/{id}/cancel
 * 取消待发送的消息通知
 */
export const cancelNotification = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量取消消息通知
 * POST /api/v1/notifications/batch-cancel
 * 批量取消待发送的消息通知
 */
export const batchCancelNotifications = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 删除消息通知
 * DELETE /api/v1/notifications/{id}
 * 删除消息通知记录
 */
export const deleteNotification = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除消息通知
 * POST /api/v1/notifications/batch-delete
 * 批量删除消息通知记录
 */
export const batchDeleteNotifications = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 获取消息通知统计
 * GET /api/v1/notifications/statistics
 * 获取消息通知的统计数据
 * 包括总数、成功数、失败数等
 */
export const getNotificationStatistics = async (params?: {
  startDate?: string
  endDate?: string
}) => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: {
      total: mockNotifications.length,
      success: mockNotifications.filter(item => item.status === 'sent').length,
      failed: mockNotifications.filter(item => item.status === 'failed').length,
      pending: mockNotifications.filter(item => item.status === 'pending').length
    } as NotificationStatistics,
    timestamp: Date.now()
  } as ApiResponse<NotificationStatistics>
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
export const getMessageTemplateList = async (params: MessageTemplateQueryParams) => {
  await delay(300)
  let filteredData = [...mockMessageTemplates]
  
  if (params.type) {
    filteredData = filteredData.filter(item => item.type === params.type)
  }
  
  if (params.channel) {
    filteredData = filteredData.filter(item => item.channel === params.channel)
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as MessageTemplateResponse
}

/**
 * 获取消息模板详情
 * GET /api/v1/notification-templates/{id}
 * 获取消息模板的详细信息
 */
export const getMessageTemplateDetail = async (id: number) => {
  await delay(200)
  const item = mockMessageTemplates.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '消息模板不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<MessageTemplateConfig>
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as ApiResponse<MessageTemplateConfig>
}

/**
 * 创建消息模板
 * POST /api/v1/notification-templates
 * 创建新的消息模板
 */
export const createMessageTemplate = async (data: MessageTemplateForm) => {
  await delay(300)
  const newId = mockMessageTemplates.length + 1
  return {
    code: 200,
    message: 'success',
    data: { id: newId },
    timestamp: Date.now()
  } as ApiResponse<{ id: number }>
}

/**
 * 更新消息模板
 * PUT /api/v1/notification-templates/{id}
 * 更新消息模板信息
 */
export const updateMessageTemplate = async (id: number, data: MessageTemplateForm) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 删除消息模板
 * DELETE /api/v1/notification-templates/{id}
 * 删除消息模板
 */
export const deleteMessageTemplate = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除消息模板
 * POST /api/v1/notification-templates/batch-delete
 * 批量删除消息模板
 */
export const batchDeleteMessageTemplates = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 启用消息模板
 * POST /api/v1/notification-templates/{id}/enable
 * 启用消息模板
 */
export const enableMessageTemplate = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 禁用消息模板
 * POST /api/v1/notification-templates/{id}/disable
 * 禁用消息模板
 */
export const disableMessageTemplate = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 预览消息模板
 * POST /api/v1/notification-templates/preview
 * 预览消息模板的渲染效果
 */
export const previewMessageTemplate = async (data: {
  templateCode: string
  variables: Record<string, any>
}) => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: {
      subject: '测试消息',
      content: '您好，张三，这是一条测试消息'
    } as MessageTemplatePreviewResponse,
    timestamp: Date.now()
  } as ApiResponse<MessageTemplatePreviewResponse>
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
export const getInboxMessageList = async (params: InboxMessageQueryParams) => {
  await delay(300)
  let filteredData = [...mockInboxMessages]
  
  if (params.type) {
    filteredData = filteredData.filter(item => item.type === params.type)
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  if (params.priority) {
    filteredData = filteredData.filter(item => item.priority === params.priority)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as InboxMessageResponse
}

/**
 * 获取站内信详情
 * GET /api/v1/inbox-messages/{id}
 * 获取站内信的详细信息
 */
export const getInboxMessageDetail = async (id: number) => {
  await delay(200)
  const item = mockInboxMessages.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '站内信不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<InboxMessage>
  }
  return {
    code: 200,
    message: 'success',
    data: item,
       timestamp: Date.now()
  } as ApiResponse<InboxMessage>
}

/**
 * 标记站内信为已读
 * POST /api/v1/inbox-messages/{id}/read
 * 标记站内信为已读状态
 */
export const markInboxMessageAsRead = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量标记站内信为已读
 * POST /api/v1/inbox-messages/batch-read
 * 批量标记站内信为已读状态
 */
export const batchMarkInboxMessagesAsRead = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 标记站内信为未读
 * POST /api/v1/inbox-messages/{id}/unread
 * 标记站内信为未读状态
 */
export const markInboxMessageAsUnread = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 删除站内信
 * DELETE /api/v1/inbox-messages/{id}
 * 删除站内信
 */
export const deleteInboxMessage = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除站内信
 * POST /api/v1/inbox-messages/batch-delete
 * 批量删除站内信
 */
export const batchDeleteInboxMessages = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 全部标记为已读
 * POST /api/v1/inbox-messages/mark-all-read
 * 将所有站内信标记为已读状态
 */
export const markAllInboxMessagesAsRead = async () => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 获取站内信统计
 * GET /api/v1/inbox-messages/statistics
 * 获取站内信的统计数据
 * 包括总数、未读数、已读数等
 */
export const getInboxMessageStatistics = async () => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: {
      total: mockInboxMessages.length,
      unread: mockInboxMessages.filter(item => item.status === 'unread').length,
      read: mockInboxMessages.filter(item => item.status === 'read').length
    } as InboxMessageStatistics,
    timestamp: Date.now()
  } as ApiResponse<InboxMessageStatistics>
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
export const getEmailNotificationList = async (params: EmailNotificationQueryParams) => {
  await delay(300)
  let filteredData = [...mockEmailNotifications]
  
  if (params.recipient) {
    filteredData = filteredData.filter(item => item.recipient.includes(params.recipient))
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as EmailNotificationResponse
}

/**
 * 获取邮件通知详情
 * GET /api/v1/email-notifications/{id}
 * 获取邮件通知的详细信息
 */
export const getEmailNotificationDetail = async (id: number) => {
  await delay(200)
  const item = mockEmailNotifications.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '邮件通知不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<EmailNotificationRecord>
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as ApiResponse<EmailNotificationRecord>
}

/**
 * 重新发送邮件通知
 * POST /api/v1/email-notifications/{id}/resend
 * 重新发送失败的邮件通知
 */
export const resendEmailNotification = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量重新发送邮件通知
 * POST /api/v1/email-notifications/batch-resend
 * 批量重新发送失败的邮件通知
 */
export const batchResendEmailNotifications = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 删除邮件通知
 * DELETE /api/v1/email-notifications/{id}
 * 删除邮件通知记录
 */
export const deleteEmailNotification = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除邮件通知
 * POST /api/v1/email-notifications/batch-delete
 * 批量删除邮件通知记录
 */
export const batchDeleteEmailNotifications = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
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
export const getSmsNotificationList = async (params: SmsNotificationQueryParams) => {
  await delay(300)
  let filteredData = [...mockSmsNotifications]
  
  if (params.recipient) {
    filteredData = filteredData.filter(item => item.recipient.includes(params.recipient))
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as SmsNotificationResponse
}

/**
 * 获取短信通知详情
 * GET /api/v1/sms-notifications/{id}
 * 获取短信通知的详细信息
 */
export const getSmsNotificationDetail = async (id: number) => {
  await delay(200)
  const item = mockSmsNotifications.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '短信通知不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<SmsNotificationRecord>
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as ApiResponse<SmsNotificationRecord>
}

/**
 * 重新发送短信通知
 * POST /api/v1/sms-notifications/{id}/resend
 * 重新发送失败的短信通知
 */
export const resendSmsNotification = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量重新发送短信通知
 * POST /api/v1/sms-notifications/batch-resend
 * 批量重新发送失败的短信通知
 */
export const batchResendSmsNotifications = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 删除短信通知
 * DELETE /api/v1/sms-notifications/{id}
 * 删除短信通知记录
 */
export const deleteSmsNotification = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除短信通知
 * POST /api/v1/sms-notifications/batch-delete
 * 批量删除短信通知记录
 */
export const batchDeleteSmsNotifications = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
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
export const getNotificationQueueTaskList = async (params: NotificationQueueTaskQueryParams) => {
  await delay(300)
  let filteredData = [...mockQueueTasks]
  
  if (params.type) {
    filteredData = filteredData.filter(item => item.type === params.type)
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  if (params.priority) {
    filteredData = filteredData.filter(item => item.priority === params.priority)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as NotificationQueueTaskResponse
}

/**
 * 获取消息队列任务详情
 * GET /api/v1/notification-queue-tasks/{id}
 * 获取消息队列任务的详细信息
 */
export const getNotificationQueueTaskDetail = async (id: number) => {
  await delay(200)
  const item = mockQueueTasks.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '消息队列任务不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<NotificationQueueTask>
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as ApiResponse<NotificationQueueTask>
}

/**
 * 手动执行消息队列任务
 * POST /api/v1/notification-queue-tasks/{id}/execute
 * 手动执行消息队列任务
 */
export const executeNotificationQueueTask = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量手动执行消息队列任务
 * POST /api/v1/notification-queue-tasks/batch-execute
 * 批量手动执行消息队列任务
 */
export const batchExecuteNotificationQueueTasks = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 删除消息队列任务
 * DELETE /api/v1/notification-queue-tasks/{id}
 * 删除消息队列任务
 */
export const deleteNotificationQueueTask = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除消息队列任务
 * POST /api/v1/notification-queue-tasks/batch-delete
 * 批量删除消息队列任务
 */
export const batchDeleteNotificationQueueTasks = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      total: ids.length,
      success: ids.length,
      failed: 0
    },
    timestamp: Date.now()
  } as BatchOperationResponse
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
