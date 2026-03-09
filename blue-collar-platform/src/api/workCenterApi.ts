/**
 * 工作中心模块API服务
 */

import type {
  TodoTask,
  TodoTaskQueryParams,
  TodoTaskForm,
  TodoTaskResponse,
  TodoTaskStatistics,
  Message,
  MessageQueryParams,
  MessageReadForm,
  MessageResponse,
  MessageStatistics,
  Warning,
  WarningQueryParams,
  WarningHandleForm,
  WarningResponse,
  WarningStatistics,
} from '@/types/work-center'
import type { ApiResponse, BatchOperationResponse } from '@/types/response'

// Mock数据
const mockTodoTasks: TodoTask[] = [
  {
    id: 1,
    title: '审核租户申请 - 三鼎劳务有限公司',
    type: 'tenant_audit',
    typeName: '租户审核',
    priority: 'high',
    priorityName: '高',
    status: 'pending',
    statusName: '待处理',
    content: '待审核的租户申请,需要核实企业资质和经营状况',
    applicant: '张经理',
    applyTime: '2026-02-25 10:30:00',
    deadline: '2026-02-27 18:00:00',
    createTime: '2026-02-25 10:30:00'
  },
  {
    id: 2,
    title: '处理预警消息 - 工人离职率异常',
    type: 'warning_handle',
    typeName: '预警处理',
    priority: 'urgent',
    priorityName: '紧急',
    status: 'pending',
    statusName: '待处理',
    content: '某劳务公司工人离职率超过预警阈值,需要及时处理',
    source: '系统自动预警',
    warningTime: '2026-02-25 09:15:00',
    createTime: '2026-02-25 09:15:00'
  },
  {
    id: 3,
    title: '审核活动申请 - 春节招聘活动',
    type: 'activity_audit',
    typeName: '活动审核',
    priority: 'medium',
    priorityName: '中',
    status: 'in_progress',
    statusName: '处理中',
    content: '劳务公司提交的春节招聘活动申请,需要审核活动方案和预算',
    applicant: '李经理',
    applyTime: '2026-02-24 14:20:00',
    deadline: '2026-02-26 18:00:00',
    createTime: '2026-02-24 14:20:00'
  },
  {
    id: 4,
    title: '处理用户投诉 - 工资发放延迟',
    type: 'complaint_handle',
    typeName: '投诉处理',
    priority: 'high',
    priorityName: '高',
    status: 'pending',
    statusName: '待处理',
    content: '工人投诉工资发放延迟,需要调查并协调解决',
    complainant: '王工人',
    complaintTime: '2026-02-25 08:00:00',
    createTime: '2026-02-25 08:00:00'
  },
  {
    id: 5,
    title: '审核佣金发放规则 - 月结规则',
    type: 'commission_rule_audit',
    typeName: '佣金规则审核',
    priority: 'medium',
    priorityName: '中',
    status: 'completed',
    statusName: '已完成',
    content: '劳务公司提交的佣金发放规则修改申请,需要审核',
    applicant: '赵经理',
    applyTime: '2026-02-23 16:45:00',
    completeTime: '2026-02-24 10:30:00',
    createTime: '2026-02-23 16:45:00'
  },
  {
    id: 6,
    title: '审批请假申请 - 张三',
    type: 'approval',
    typeName: '审批任务',
    priority: 'medium',
    priorityName: '中',
    status: 'pending',
    statusName: '待处理',
    content: '工人张三申请事假3天,需要审批',
    applicant: '张三',
    applyTime: '2026-02-25 11:00:00',
    deadline: '2026-02-26 18:00:00',
    businessCode: 'leave_application',
    businessId: 1,
    nodeId: 1,
    nodeName: '部门主管审批',
    assigneeId: 1,
    assigneeName: '管理员',
    createTime: '2026-02-25 11:00:00'
  }
]

const mockMessages: Message[] = [
  {
    id: 1,
    title: '系统维护通知',
    type: 'system',
    typeName: '系统通知',
    content: '系统将于2026年2月28日凌晨2:00-4:00进行维护升级,届时将暂停服务,请提前做好准备。',
    sender: '系统管理员',
    sendTime: '2026-02-25 10:00:00',
    status: 'unread',
    statusName: '未读',
    priority: 'high',
    priorityName: '高',
    createTime: '2026-02-25 10:00:00'
  },
  {
    id: 2,
    title: '新功能上线通知',
    type: 'feature',
    typeName: '功能通知',
    content: '平台新增了智能推荐功能,可以根据工人技能和历史数据智能匹配岗位,提升招聘效率。',
    sender: '产品团队',
    sendTime: '2026-02-24 15:30:00',
    status: 'read',
    statusName: '已读',
    priority: 'medium',
    priorityName: '中',
    createTime: '2026-02-24 15:30:00'
  },
  {
    id: 3,
    title: '政策更新通知',
    type: 'policy',
    typeName: '政策通知',
    content: '根据最新劳动法规要求,平台更新了工人权益保障相关政策,请各租户及时了解并遵照执行。',
    sender: '法务部',
    sendTime: '2026-02-23 09:00:00',
    status: 'read',
    statusName: '已读',
    priority: 'high',
    priorityName: '高',
    createTime: '2026-02-23 09:00:00'
  },
  {
    id: 4,
    title: '培训通知',
    type: 'training',
    typeName: '培训通知',
    content: '平台将于2026年3月1日举办系统操作培训,请各租户管理员准时参加。',
    sender: '培训部',
    sendTime: '2026-02-22 14:00:00',
    status: 'unread',
    statusName: '未读',
    priority: 'medium',
    priorityName: '中',
    createTime: '2026-02-22 14:00:00'
  }
]

const mockWarnings: Warning[] = [
  {
    id: 1,
    title: '工人离职率异常预警',
    type: 'turnover_rate',
    typeName: '离职率异常',
    level: 'high',
    levelName: '高',
    content: '南通富民劳务服务有限公司本月工人离职率达到15%,超过预警阈值10%,请及时关注。',
    target: '南通富民劳务服务有限公司',
    warningTime: '2026-02-25 09:15:00',
    status: 'unhandled',
    statusName: '未处理',
    handleTime: null,
    handler: null,
    createTime: '2026-02-25 09:15:00'
  },
  {
    id: 2,
    title: '投诉率异常预警',
    type: 'complaint_rate',
    typeName: '投诉率异常',
    level: 'medium',
    levelName: '中',
    content: '三鼎劳务有限公司本月投诉率达到5%,超过预警阈值3%,需要关注服务质量。',
    target: '三鼎劳务有限公司',
    warningTime: '2026-02-24 16:30:00',
    status: 'handled',
    statusName: '已处理',
    handleTime: '2026-02-25 10:00:00',
    handler: '张管理员',
    createTime: '2026-02-24 16:30:00'
  },
  {
    id: 3,
    title: '系统性能预警',
    type: 'system_performance',
    typeName: '系统性能',
    level: 'high',
    levelName: '高',
    content: '系统响应时间超过3秒,影响用户体验,需要优化系统性能。',
    target: '系统',
    warningTime: '2026-02-24 10:00:00',
    status: 'handled',
    statusName: '已处理',
    handleTime: '2026-02-24 14:00:00',
    handler: '技术团队',
    createTime: '2026-02-24 10:00:00'
  },
  {
    id: 4,
    title: '数据安全预警',
    type: 'data_security',
    typeName: '数据安全',
    level: 'urgent',
    levelName: '紧急',
    content: '检测到异常登录行为,可能存在安全风险,需要立即处理。',
    target: '系统',
    warningTime: '2026-02-23 08:00:00',
    status: 'handled',
    statusName: '已处理',
    handleTime: '2026-02-23 09:00:00',
    handler: '安全团队',
    createTime: '2026-02-23 08:00:00'
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ==================== 待办任务API ====================

/**
 * 获取待办任务列表
 */
export const getTodoTaskList = async (params: TodoTaskQueryParams) => {
  await delay(300)
  let filteredData = [...mockTodoTasks]
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        item.content?.toLowerCase().includes(keyword)
    )
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  if (params.priority) {
    filteredData = filteredData.filter(item => item.priority === params.priority)
  }
  
  if (params.type) {
    filteredData = filteredData.filter(item => item.type === params.type)
  }
  
  // 忽略数据权限相关的过滤条件，因为在 Mock 数据中不存在这些字段
  // 实际项目中应该根据这些条件过滤数据
  
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
  } as TodoTaskResponse
}

/**
 * 获取待办任务详情
 */
export const getTodoTaskDetail = async (id: number) => {
  await delay(200)
  const item = mockTodoTasks.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '待办任务不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as ApiResponse<TodoTask>
}

/**
 * 创建待办任务
 */
export const createTodoTask = async (data: TodoTaskForm) => {
  await delay(300)
  const newId = mockTodoTasks.length + 1
  return {
    code: 201,
    message: 'created',
    data: { id: newId },
    timestamp: Date.now()
  } as ApiResponse<{ id: number }>
}

/**
 * 更新待办任务
 */
export const updateTodoTask = async (id: number, data: TodoTaskForm) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 删除待办任务
 */
export const deleteTodoTask = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除待办任务
 */
export const batchDeleteTodoTasks = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: ids.length,
      failCount: 0,
      failIds: []
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 更新待办任务状态
 */
export const updateTodoTaskStatus = async (id: number, status: string) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量更新待办任务状态
 */
export const batchUpdateTodoTaskStatus = async (ids: number[], status: string) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: ids.length,
      failCount: 0,
      failIds: []
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 分配待办任务
 */
export const assignTodoTask = async (id: number, assigneeId: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 获取待办任务统计
 */
export const getTodoTaskStatistics = async () => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: {
      total: mockTodoTasks.length,
      pending: mockTodoTasks.filter(t => t.status === 'pending').length,
      inProgress: mockTodoTasks.filter(t => t.status === 'in_progress').length,
      completed: mockTodoTasks.filter(t => t.status === 'completed').length
    },
    timestamp: Date.now()
  } as ApiResponse<TodoTaskStatistics>
}

// ==================== 消息中心API ====================

/**
 * 获取消息列表
 */
export const getMessageList = async (params: MessageQueryParams) => {
  await delay(300)
  let filteredData = [...mockMessages]
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
    )
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  if (params.type) {
    filteredData = filteredData.filter(item => item.type === params.type)
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
  } as MessageResponse
}

/**
 * 获取消息详情
 */
export const getMessageDetail = async (id: number) => {
  await delay(200)
  const item = mockMessages.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '消息不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as ApiResponse<Message>
}

/**
 * 标记消息为已读
 */
export const markMessageAsRead = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量标记消息为已读
 */
export const batchMarkMessagesAsRead = async (data: MessageReadForm) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: data.ids.length,
      failCount: 0,
      failIds: []
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 标记消息为未读
 */
export const markMessageAsUnread = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 删除消息
 */
export const deleteMessage = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除消息
 */
export const batchDeleteMessages = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: ids.length,
      failCount: 0,
      failIds: []
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 全部标记为已读
 */
export const markAllMessagesAsRead = async () => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 获取消息统计
 */
export const getMessageStatistics = async () => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: {
      total: mockMessages.length,
      unread: mockMessages.filter(m => m.status === 'unread').length,
      read: mockMessages.filter(m => m.status === 'read').length
    },
    timestamp: Date.now()
  } as ApiResponse<MessageStatistics>
}

// ==================== 预警消息API ====================

/**
 * 获取预警消息列表
 */
export const getWarningList = async (params: WarningQueryParams) => {
  await delay(300)
  let filteredData = [...mockWarnings]
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
    )
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  if (params.type) {
    filteredData = filteredData.filter(item => item.type === params.type)
  }
  
  if (params.level) {
    filteredData = filteredData.filter(item => item.level === params.level)
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
  } as WarningResponse
}

/**
 * 获取预警消息详情
 */
export const getWarningDetail = async (id: number) => {
  await delay(200)
  const item = mockWarnings.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '预警消息不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as ApiResponse<Warning>
}

/**
 * 处理预警消息
 */
export const handleWarning = async (id: number, data: WarningHandleForm) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量处理预警消息
 */
export const batchHandleWarnings = async (ids: number[], status: string, handleRemark?: string) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: ids.length,
      failCount: 0,
      failIds: []
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 忽略预警消息
 */
export const ignoreWarning = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量忽略预警消息
 */
export const batchIgnoreWarnings = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: ids.length,
      failCount: 0,
      failIds: []
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 删除预警消息
 */
export const deleteWarning = async (id: number) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

/**
 * 批量删除预警消息
 */
export const batchDeleteWarnings = async (ids: number[]) => {
  await delay(300)
  return {
    code: 200,
    message: 'success',
    data: {
      successCount: ids.length,
      failCount: 0,
      failIds: []
    },
    timestamp: Date.now()
  } as BatchOperationResponse
}

/**
 * 获取预警消息统计
 */
export const getWarningStatistics = async () => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: {
      total: mockWarnings.length,
      unhandled: mockWarnings.filter(w => w.status === 'unhandled').length,
      handled: mockWarnings.filter(w => w.status === 'handled').length,
      ignored: mockWarnings.filter(w => w.status === 'ignored').length
    },
    timestamp: Date.now()
  } as ApiResponse<WarningStatistics>
}
