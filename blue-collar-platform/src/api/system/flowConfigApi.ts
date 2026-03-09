/**
 * 工作流配置API
 */

import axios from 'axios'
import type { WorkflowListResponse, WorkflowDetail, WorkflowForm, WorkflowQueryParams } from '@/types/flow-config'

const mockAxios = axios.create({
  baseURL: '',
  timeout: 30000
})

/**
 * 获取工作流列表
 * @param params 查询参数
 * @returns 工作流列表响应
 */
export const getWorkflowList = async (params: WorkflowQueryParams): Promise<WorkflowListResponse> => {
  const response = await mockAxios.get('/api/v1/workflows', {
    params
  })
  return response.data
}

/**
 * 获取工作流详情
 * @param id 工作流ID
 * @returns 工作流详情
 */
export const getWorkflowDetail = async (id: number): Promise<WorkflowDetail> => {
  const response = await mockAxios.get(`/api/v1/workflows/${id}`)
  return response.data
}

/**
 * 创建工作流
 * @param data 工作流数据
 * @returns 创建结果
 */
export const createWorkflow = async (data: WorkflowForm): Promise<WorkflowDetail> => {
  const response = await mockAxios.post('/api/v1/workflows', data)
  return response.data
}

/**
 * 更新工作流
 * @param id 工作流ID
 * @param data 工作流数据
 * @returns 更新结果
 */
export const updateWorkflow = async (id: number, data: WorkflowForm): Promise<WorkflowDetail> => {
  const response = await mockAxios.put(`/api/v1/workflows/${id}`, data)
  return response.data
}

/**
 * 删除工作流
 * @param id 工作流ID
 * @returns 删除结果
 */
export const deleteWorkflow = async (id: number): Promise<void> => {
  await mockAxios.delete(`/api/v1/workflows/${id}`)
}

/**
 * 复制工作流
 * @param id 工作流ID
 * @returns 复制结果
 */
export const copyWorkflow = async (id: number): Promise<WorkflowDetail> => {
  const response = await mockAxios.post(`/api/v1/workflows/${id}/copy`)
  return response.data
}

/**
 * 启用/禁用工作流
 * @param id 工作流ID
 * @param enabled 是否启用
 * @returns 更新结果
 */
export const toggleWorkflowStatus = async (id: number, enabled: boolean): Promise<WorkflowDetail> => {
  const response = await mockAxios.patch(`/api/v1/workflows/${id}/status`, {
    flowStatus: enabled ? 'ENABLED' : 'DISABLED'
  })
  return response.data
}
