/**
 * 工作中心模块API服务
 */

import request from '@/utils/request'
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

// ==================== 待办任务API ====================

/**
 * 获取待办任务列表
 */
export const getTodoTaskList = (params: TodoTaskQueryParams) => {
  return request.get<TodoTaskResponse>('/api/v1/work-center/todos', { params })
}

/**
 * 获取待办任务详情
 */
export const getTodoTaskDetail = (id: number) => {
  return request.get<ApiResponse<TodoTask>>(`/api/v1/work-center/todos/${id}`)
}

/**
 * 创建待办任务
 */
export const createTodoTask = (data: TodoTaskForm) => {
  return request.post<ApiResponse<{ id: number }>>('/api/v1/work-center/todos', data)
}

/**
 * 更新待办任务
 */
export const updateTodoTask = (id: number, data: TodoTaskForm) => {
  return request.put<ApiResponse<void>>(`/api/v1/work-center/todos/${id}`, data)
}

/**
 * 删除待办任务
 */
export const deleteTodoTask = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/work-center/todos/${id}`)
}

/**
 * 批量删除待办任务
 */
export const batchDeleteTodoTasks = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/work-center/todos/batch-delete', { ids })
}

/**
 * 更新待办任务状态
 */
export const updateTodoTaskStatus = (id: number, status: string) => {
  return request.put<ApiResponse<void>>(`/api/v1/work-center/todos/${id}/status`, { status })
}

/**
 * 批量更新待办任务状态
 */
export const batchUpdateTodoTaskStatus = (ids: number[], status: string) => {
  return request.post<BatchOperationResponse>('/api/v1/work-center/todos/batch-status', {
    ids,
    status,
  })
}

/**
 * 分配待办任务
 */
export const assignTodoTask = (id: number, assigneeId: number) => {
  return request.put<ApiResponse<void>>(`/api/v1/work-center/todos/${id}/assign`, { assigneeId })
}

/**
 * 获取待办任务统计
 */
export const getTodoTaskStatistics = () => {
  return request.get<ApiResponse<TodoTaskStatistics>>('/api/v1/work-center/todos/statistics')
}

// ==================== 消息中心API ====================

/**
 * 获取消息列表
 */
export const getMessageList = (params: MessageQueryParams) => {
  return request.get<MessageResponse>('/api/v1/work-center/messages', { params })
}

/**
 * 获取消息详情
 */
export const getMessageDetail = (id: number) => {
  return request.get<ApiResponse<Message>>(`/api/v1/work-center/messages/${id}`)
}

/**
 * 标记消息为已读
 */
export const markMessageAsRead = (id: number) => {
  return request.put<ApiResponse<void>>(`/api/v1/work-center/messages/${id}/read`)
}

/**
 * 批量标记消息为已读
 */
export const batchMarkMessagesAsRead = (data: MessageReadForm) => {
  return request.post<BatchOperationResponse>('/api/v1/work-center/messages/batch-read', data)
}

/**
 * 标记消息为未读
 */
export const markMessageAsUnread = (id: number) => {
  return request.put<ApiResponse<void>>(`/api/v1/work-center/messages/${id}/unread`)
}

/**
 * 删除消息
 */
export const deleteMessage = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/work-center/messages/${id}`)
}

/**
 * 批量删除消息
 */
export const batchDeleteMessages = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/work-center/messages/batch-delete', { ids })
}

/**
 * 全部标记为已读
 */
export const markAllMessagesAsRead = () => {
  return request.put<ApiResponse<void>>('/api/v1/work-center/messages/mark-all-read')
}

/**
 * 获取消息统计
 */
export const getMessageStatistics = () => {
  return request.get<ApiResponse<MessageStatistics>>('/api/v1/work-center/messages/statistics')
}

// ==================== 预警消息API ====================

/**
 * 获取预警消息列表
 */
export const getWarningList = (params: WarningQueryParams) => {
  return request.get<WarningResponse>('/api/v1/work-center/warnings', { params })
}

/**
 * 获取预警消息详情
 */
export const getWarningDetail = (id: number) => {
  return request.get<ApiResponse<Warning>>(`/api/v1/work-center/warnings/${id}`)
}

/**
 * 处理预警消息
 */
export const handleWarning = (id: number, data: WarningHandleForm) => {
  return request.put<ApiResponse<void>>(`/api/v1/work-center/warnings/${id}/handle`, data)
}

/**
 * 批量处理预警消息
 */
export const batchHandleWarnings = (ids: number[], status: string, handleRemark?: string) => {
  return request.post<BatchOperationResponse>('/api/v1/work-center/warnings/batch-handle', {
    ids,
    status,
    handleRemark,
  })
}

/**
 * 忽略预警消息
 */
export const ignoreWarning = (id: number) => {
  return request.put<ApiResponse<void>>(`/api/v1/work-center/warnings/${id}/ignore`)
}

/**
 * 批量忽略预警消息
 */
export const batchIgnoreWarnings = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/work-center/warnings/batch-ignore', { ids })
}

/**
 * 删除预警消息
 */
export const deleteWarning = (id: number) => {
  return request.delete<ApiResponse<void>>(`/api/v1/work-center/warnings/${id}`)
}

/**
 * 批量删除预警消息
 */
export const batchDeleteWarnings = (ids: number[]) => {
  return request.post<BatchOperationResponse>('/api/v1/work-center/warnings/batch-delete', { ids })
}

/**
 * 获取预警消息统计
 */
export const getWarningStatistics = () => {
  return request.get<ApiResponse<WarningStatistics>>('/api/v1/work-center/warnings/statistics')
}
