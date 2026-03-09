/**
 * 工作流配置类型定义
 */

// 工作流状态
export enum FlowStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

// 工作流类型
export enum FlowType {
  APPROVAL = 'APPROVAL',
  BUSINESS = 'BUSINESS'
}

// 工作流列表项
export interface WorkflowItem {
  id: number
  flowName: string
  flowCode: string
  flowType: string
  flowStatus: string
  flowDescription?: string
  createTime: string
  updateTime: string
}

// 工作流详情
export interface WorkflowDetail extends WorkflowItem {
  xmlData: string
}

// 工作流表单
export interface WorkflowForm {
  flowName: string
  flowCode: string
  flowType: string
  flowStatus: string
  flowDescription?: string
  xmlData: string
}

// 工作流查询参数
export interface WorkflowQueryParams {
  page: number
  pageSize: number
  flowName?: string
  flowType?: string
  flowStatus?: string
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 工作流列表响应
export type WorkflowListResponse = PageResponse<WorkflowItem>
