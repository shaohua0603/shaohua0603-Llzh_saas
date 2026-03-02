/**
 * 消息通知模块Mock数据
 * 用于模拟消息通知、消息模板、站内信、邮件、短信等API接口
 */

import Mock from 'mockjs'

// 模拟数据配置
Mock.setup({
  timeout: '200-600'
})

// ============================================
// 1. 消息通知记录Mock数据
// ============================================

const notificationRecords = Mock.mock({
  'list|20': [{
    'id|+1': 1,
    'notificationType|1': ['system', 'approval', 'business', 'warning', 'reminder', 'announcement'],
    'notificationTypeName': function() {
      const typeNames = {
        system: '系统通知',
        approval: '审批通知',
        business: '业务通知',
        warning: '预警通知',
        reminder: '提醒通知',
        announcement: '公告通知'
      }
      return typeNames[this.notificationType]
    },
    'channel|1': ['inbox', 'email', 'sms'],
    'channelName': function() {
      const channelNames = {
        inbox: '站内信',
        email: '邮件',
        sms: '短信'
      }
      return channelNames[this.channel]
    },
    'receiverId|1-100': 1,
    'receiverName': '@cname',
    'title': '@ctitle(10, 20)',
    'content': '@cparagraph(2, 5)',
    'priority|1': ['urgent', 'high', 'medium', 'low'],
    'priorityName': function() {
      const priorityNames = {
        urgent: '紧急',
        high: '高',
        medium: '中',
        low: '低'
      }
      return priorityNames[this.priority]
    },
    'status|1': ['pending', 'sending', 'success', 'failed', 'cancelled'],
    'statusName': function() {
      const statusNames = {
        pending: '待发送',
        sending: '发送中',
        success: '发送成功',
        failed: '发送失败',
        cancelled: '已取消'
      }
      return statusNames[this.status]
    },
    'sendCount|0-3': 0,
    'maxRetryCount': 3,
    'sendTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'successTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'failureReason': '@csentence',
    'businessType|1': ['leave', 'transfer', 'resignation', 'training', 'exam'],
    'businessId|1-1000': 1,
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'updateTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
  }]
}).list

// ============================================
// 2. 消息模板Mock数据
// ============================================

const messageTemplates = [
  {
    id: 1,
    templateCode: 'approval_todo',
    templateName: '审批待办',
    description: '审批流程待办任务通知',
    templateType: 'approval',
    channels: ['inbox', 'email', 'sms'],
    title: '您有一个新的审批待办任务',
    content: '尊敬的{{receiverName}}，您有一个新的审批待办任务：\n\n任务标题：{{title}}\n提交人：{{submitterName}}\n提交时间：{{submitTime}}\n\n请及时处理。',
    variables: [
      {
        name: 'receiverName',
        description: '接收人姓名',
        type: 'string',
        required: true,
        example: '张三'
      },
      {
        name: 'title',
        description: '任务标题',
        type: 'string',
        required: true,
        example: '请假申请审批'
      },
      {
        name: 'submitterName',
        description: '提交人姓名',
        type: 'string',
        required: true,
        example: '李四'
      },
      {
        name: 'submitTime',
        description: '提交时间',
        type: 'date',
        required: true,
        example: '2026-02-26 10:00:00'
      }
    ],
    enabled: true,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 2,
    templateCode: 'approval_approved',
    templateName: '审批通过',
    description: '审批流程通过通知',
    templateType: 'approval',
    channels: ['inbox', 'email', 'sms'],
    title: '您的申请已审批通过',
    content: '尊敬的{{receiverName}}，您的申请已审批通过。\n\n申请标题：{{title}}\n审批人：{{approverName}}\n审批时间：{{approvalTime}}\n审批意见：{{approvalComment}}',
    variables: [
      {
        name: 'receiverName',
        description: '接收人姓名',
        type: 'string',
        required: true,
        example: '张三'
      },
      {
        name: 'title',
        description: '申请标题',
        type: 'string',
        required: true,
        example: '请假申请'
      },
      {
        name: 'approverName',
        description: '审批人姓名',
        type: 'string',
        required: true,
        example: '李四'
      },
      {
        name: 'approvalTime',
        description: '审批时间',
        type: 'date',
        required: true,
        example: '2026-02-26 10:00:00'
      },
      {
        name: 'approvalComment',
        description: '审批意见',
        type: 'string',
        required: false,
        example: '同意'
      }
    ],
    enabled: true,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 3,
    templateCode: 'approval_rejected',
    templateName: '审批驳回',
    description: '审批流程驳回通知',
    templateType: 'approval',
    channels: ['inbox', 'email', 'sms'],
    title: '您的申请已被驳回',
    content: '尊敬的{{receiverName}}，您的申请已被驳回。\n\n申请标题：{{title}}\n审批人：{{approverName}}\n审批时间：{{approvalTime}}\n驳回原因：{{rejectReason}}',
    variables: [
      {
        name: 'receiverName',
        description: '接收人姓名',
        type: 'string',
        required: true,
        example: '张三'
      },
      {
        name: 'title',
        description: '申请标题',
        type: 'string',
        required: true,
        example: '请假申请'
      },
      {
        name: 'approverName',
        description: '审批人姓名',
        type: 'string',
        required: true,
        example: '李四'
      },
      {
        name: 'approvalTime',
        description: '审批时间',
        type: 'date',
        required: true,
        example: '2026-02-26 10:00:00'
      },
      {
        name: 'rejectReason',
        description: '驳回原因',
        type: 'string',
        required: true,
        example: '请假时间不符合规定'
      }
    ],
    enabled: true,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  }
]

// ============================================
// 3. 站内信Mock数据
// ============================================

const inboxMessages = Mock.mock({
  'list|30': [{
    'id|+1': 1,
    'type|1': ['system', 'approval', 'business', 'warning', 'reminder', 'announcement'],
    'typeName': function() {
      const typeNames = {
        system: '系统通知',
        approval: '审批通知',
        business: '业务通知',
        warning: '预警通知',
        reminder: '提醒通知',
        announcement: '公告通知'
      }
      return typeNames[this.type]
    },
    'title': '@ctitle(10, 20)',
    'content': '@cparagraph(2, 5)',
    'senderId|1-10': 1,
    'senderName': '@cname',
    'receiverId|1-100': 1,
    'receiverName': '@cname',
    'priority|1': ['urgent', 'high', 'medium', 'low'],
    'priorityName': function() {
      const priorityNames = {
        urgent: '紧急',
        high: '高',
        medium: '中',
        low: '低'
      }
      return priorityNames[this.priority]
    },
    'readStatus|1': [true, false],
    'readTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'businessType|1': ['leave', 'transfer', 'resignation', 'training', 'exam'],
    'businessId|1-1000': 1,
    'sendTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'updateTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
  }]
}).list

// ============================================
// 4. 邮件通知Mock数据
// ============================================

const emailNotifications = Mock.mock({
  'list|20': [{
    'id|+1': 1,
    'notificationId|1-1000': 1,
    'toEmail': '@email',
    'toName': '@cname',
    'ccEmails|0-3': ['@email'],
    'bccEmails|0-2': ['@email'],
    'subject': '@ctitle(10, 20)',
    'content': '@cparagraph(3, 8)',
    'contentType|1': ['text', 'html'],
    'status|1': ['pending', 'sending', 'success', 'failed', 'cancelled'],
    'sendCount|0-3': 0,
    'maxRetryCount': 3,
    'sendTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'successTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'failureReason': '@csentence',
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'updateTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
  }]
}).list

// ============================================
// 5. 短信通知Mock数据
// ============================================

const smsNotifications = Mock.mock({
  'list|20': [{
    'id|+1': 1,
    'notificationId|1-1000': 1,
    'toPhone': /^1[3-9]\d{9}$/,
    'toName': '@cname',
    'content': '@cparagraph(1, 3)',
    'signature': '蓝领智汇',
    'templateId': '@string("number", 10)',
    'smsType|1': ['verification', 'notification', 'marketing'],
    'status|1': ['pending', 'sending', 'success', 'failed', 'cancelled'],
    'sendCount|0-3': 0,
    'maxRetryCount': 3,
    'sendTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'successTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'failureReason': '@csentence',
    'provider|1': ['aliyun', 'tencent', 'custom'],
    'smsId': '@string("number", 20)',
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'updateTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
  }]
}).list

// ============================================
// 6. 消息队列任务Mock数据
// ============================================

const notificationQueueTasks = Mock.mock({
  'list|15': [{
    'id|+1': 1,
    'notificationId|1-1000': 1,
    'taskType|1': ['inbox', 'email', 'sms'],
    'status|1': ['pending', 'sending', 'success', 'failed', 'cancelled'],
    'priority|1': ['urgent', 'high', 'medium', 'low'],
    'retryCount|0-3': 0,
    'maxRetryCount': 3,
    'nextExecuteTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'executeTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'errorMessage': '@csentence',
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'updateTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
  }]
}).list

// ============================================
// 7. Mock API接口
// ============================================

// 发送消息通知
Mock.mock(/\/api\/v1\/notifications\/send/, 'post', () => {
  return {
    code: 200,
    message: '发送成功',
    data: {
      notificationId: Mock.Random.integer(1000, 9999),
      status: 'success',
      results: [
        {
          channel: 'inbox',
          status: 'success',
          recordId: Mock.Random.integer(1, 1000)
        },
        {
          channel: 'email',
          status: 'success',
          recordId: Mock.Random.integer(1, 1000)
        },
        {
          channel: 'sms',
          status: 'success',
          recordId: Mock.Random.integer(1, 1000)
        }
      ]
    },
    timestamp: Date.now()
  }
})

// 获取消息通知列表
Mock.mock(/\/api\/v1\/notifications/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = notificationRecords.slice(start, end)

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: notificationRecords.length,
      page,
      pageSize,
      totalPages: Math.ceil(notificationRecords.length / pageSize)
    },
    timestamp: Date.now()
  }
})

// 获取消息通知统计
Mock.mock(/\/api\/v1\/notifications\/statistics/, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      total: notificationRecords.length,
      pending: notificationRecords.filter(r => r.status === 'pending').length,
      sending: notificationRecords.filter(r => r.status === 'sending').length,
      success: notificationRecords.filter(r => r.status === 'success').length,
      failed: notificationRecords.filter(r => r.status === 'failed').length,
      cancelled: notificationRecords.filter(r => r.status === 'cancelled').length,
      byChannel: [
        {
          channel: 'inbox',
          channelName: '站内信',
          total: notificationRecords.filter(r => r.channel === 'inbox').length,
          success: notificationRecords.filter(r => r.channel === 'inbox' && r.status === 'success').length,
          failed: notificationRecords.filter(r => r.channel === 'inbox' && r.status === 'failed').length
        },
        {
          channel: 'email',
          channelName: '邮件',
          total: notificationRecords.filter(r => r.channel === 'email').length,
          success: notificationRecords.filter(r => r.channel === 'email' && r.status === 'success').length,
          failed: notificationRecords.filter(r => r.channel === 'email' && r.status === 'failed').length
        },
        {
          channel: 'sms',
          channelName: '短信',
          total: notificationRecords.filter(r => r.channel === 'sms').length,
          success: notificationRecords.filter(r => r.channel === 'sms' && r.status === 'success').length,
          failed: notificationRecords.filter(r => r.channel === 'sms' && r.status === 'failed').length
        }
      ],
      byType: [
        {
          type: 'system',
          typeName: '系统通知',
          total: notificationRecords.filter(r => r.notificationType === 'system').length,
          success: notificationRecords.filter(r => r.notificationType === 'system' && r.status === 'success').length,
          failed: notificationRecords.filter(r => r.notificationType === 'system' && r.status === 'failed').length
        },
        {
          type: 'approval',
          typeName: '审批通知',
          total: notificationRecords.filter(r => r.notificationType === 'approval').length,
          success: notificationRecords.filter(r => r.notificationType === 'approval' && r.status === 'success').length,
          failed: notificationRecords.filter(r => r.notificationType === 'approval' && r.status === 'failed').length
        }
      ],
      byDate: [
        {
          date: '2026-02-26',
          total: 10,
          success: 8,
          failed: 2
        },
        {
          date: '2026-02-25',
          total: 15,
          success: 14,
          failed: 1
        }
      ]
    },
    timestamp: Date.now()
  }
})

// 获取消息模板列表
Mock.mock(/\/api\/v1\/notification-templates/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = messageTemplates.slice(start, end)

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: messageTemplates.length,
      page,
      pageSize,
      totalPages: Math.ceil(messageTemplates.length / pageSize)
    },
    timestamp: Date.now()
  }
})

// 获取站内信列表
Mock.mock(/\/api\/v1\/inbox-messages/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = inboxMessages.slice(start, end)

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: inboxMessages.length,
      page,
      pageSize,
      totalPages: Math.ceil(inboxMessages.length / pageSize)
    },
    timestamp: Date.now()
  }
})

// 获取站内信统计
Mock.mock(/\/api\/v1\/inbox-messages\/statistics/, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      total: inboxMessages.length,
      unread: inboxMessages.filter(m => !m.readStatus).length,
      read: inboxMessages.filter(m => m.readStatus).length,
      urgent: inboxMessages.filter(m => m.priority === 'urgent').length,
      high: inboxMessages.filter(m => m.priority === 'high').length
    },
    timestamp: Date.now()
  }
})

// 获取邮件通知列表
Mock.mock(/\/api\/v1\/email-notifications/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = emailNotifications.slice(start, end)

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: emailNotifications.length,
      page,
      pageSize,
      totalPages: Math.ceil(emailNotifications.length / pageSize)
    },
    timestamp: Date.now()
  }
})

// 获取短信通知列表
Mock.mock(/\/api\/v1\/sms-notifications/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = smsNotifications.slice(start, end)

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: smsNotifications.length,
      page,
      pageSize,
      totalPages: Math.ceil(smsNotifications.length / pageSize)
    },
    timestamp: Date.now()
  }
})

// 获取消息队列任务列表
Mock.mock(/\/api\/v1\/notification-queue-tasks/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = notificationQueueTasks.slice(start, end)

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: notificationQueueTasks.length,
      page,
      pageSize,
      totalPages: Math.ceil(notificationQueueTasks.length / pageSize)
    },
    timestamp: Date.now()
  }
})

// 导出Mock数据
export default {
  notificationRecords,
  messageTemplates,
  inboxMessages,
  emailNotifications,
  smsNotifications,
  notificationQueueTasks
}
