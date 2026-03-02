/**
 * 打印管理模块类型定义
 */

/**
 * 模版状态
 */
export type TemplateStatus = 'draft' | 'published'

/**
 * 模版类型
 */
export type TemplateType = 'contract' | 'proof' | 'form' | 'certificate' | 'other'

/**
 * 纸张大小
 */
export type PaperSize = 'A4' | 'A3' | 'B4' | 'B5'

/**
 * 打印方向
 */
export type PrintOrientation = 'portrait' | 'landscape'

/**
 * 打印质量
 */
export type PrintQuality = 'low' | 'medium' | 'high'

/**
 * 配置状态
 */
export type ConfigStatus = 'enabled' | 'disabled'

/**
 * 打印状态
 */
export type PrintStatus = 'success' | 'failed'

/**
 * 映射类型
 */
export type MappingType = 'direct' | 'expression' | 'constant'

/**
 * 页边距
 */
export interface PageMargin {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * 页眉页脚配置
 */
export interface HeaderFooterConfig {
  showHeader: boolean
  showFooter: boolean
  headerText?: string
  footerText?: string
  showPageNumber: boolean
}

/**
 * 页面设置
 */
export interface PageSettings {
  orientation: PrintOrientation
  paperSize: PaperSize
  margin: PageMargin
  headerFooter: HeaderFooterConfig
}

/**
 * 模版变量
 */
export interface Variable {
  variableName: string
  variableLabel: string
  variableType: 'text' | 'date' | 'number' | 'image'
  defaultValue?: any
  required: boolean
  description?: string
}

/**
 * 打印模版
 */
export interface PrintTemplate {
  id: string
  tenantId: string
  templateName: string
  templateCode: string
  templateType: TemplateType
  templateContent: string
  variables: Variable[]
  pageSettings: PageSettings
  status: TemplateStatus
  isDefault: boolean
  description: string
  tags: string[]
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
}

/**
 * 字段映射
 */
export interface FieldMapping {
  businessField: string
  templateVariable: string
  mappingType: MappingType
  expression?: string
  constantValue?: any
}

/**
 * 数据映射
 */
export interface DataMapping {
  mappings: FieldMapping[]
}

/**
 * 打印设置
 */
export interface PrintSettings {
  defaultPrinter?: string
  copies: number
  quality: PrintQuality
  orientation: PrintOrientation
  paperSize: PaperSize
}

/**
 * 打印配置
 */
export interface PrintConfig {
  id: string
  tenantId: string
  businessCode: string
  businessName: string
  templateId: string
  templateName: string
  dataMapping: DataMapping
  printSettings: PrintSettings
  status: ConfigStatus
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
}

/**
 * 打印历史
 */
export interface PrintHistory {
  id: string
  tenantId: string
  businessCode: string
  businessId: string
  templateId: string
  templateName: string
  printData: Record<string, any>
  printSettings: PrintSettings
  printStatus: PrintStatus
  errorMessage?: string
  printedBy: string
  printedAt: Date
  ipAddress?: string
}

/**
 * 业务字段
 */
export interface BusinessField {
  fieldName: string
  fieldLabel: string
  fieldType: 'text' | 'date' | 'number' | 'boolean' | 'select'
  fieldDescription?: string
}

/**
 * 业务代码
 */
export interface BusinessCode {
  code: string
  name: string
  description: string
}

/**
 * 打印统计
 */
export interface PrintStatistics {
  totalCount: number
  templateStats: TemplateStat[]
  userStats: UserStat[]
  trend: TrendData[]
}

/**
 * 模版统计
 */
export interface TemplateStat {
  templateId: string
  templateName: string
  count: number
}

/**
 * 用户统计
 */
export interface UserStat {
  userId: string
  userName: string
  count: number
}

/**
 * 趋势数据
 */
export interface TrendData {
  date: string
  count: number
}

/**
 * 模版列表查询参数
 */
export interface TemplateQueryParams {
  page: number
  pageSize: number
  templateName?: string
  templateCode?: string
  templateType?: TemplateType
  status?: TemplateStatus
}

/**
 * 打印配置列表查询参数
 */
export interface ConfigQueryParams {
  page: number
  pageSize: number
  businessCode?: string
  templateId?: string
  status?: ConfigStatus
}

/**
 * 打印历史查询参数
 */
export interface HistoryQueryParams {
  page: number
  pageSize: number
  businessCode?: string
  templateId?: string
  printedBy?: string
  startTime?: Date
  endTime?: Date
}

/**
 * 打印预览请求
 */
export interface PrintPreviewRequest {
  businessCode: string
  businessId: string
  templateId?: string
}

/**
 * 批量打印预览请求
 */
export interface BatchPrintPreviewRequest {
  businessCode: string
  businessIds: string[]
  templateId?: string
}

/**
 * 打印预览响应
 */
export interface PrintPreviewResponse {
  template: PrintTemplate
  data: Record<string, any>
  html: string
}

/**
 * 批量打印预览响应
 */
export interface BatchPrintPreviewResponse {
  items: Array<{
    businessId: string
    data: Record<string, any>
    html: string
  }>
}

/**
 * 提取变量请求
 */
export interface ExtractVariablesRequest {
  content: string
}

/**
 * 提取变量响应
 */
export interface ExtractVariablesResponse {
  variables: Variable[]
}

/**
 * 验证模版请求
 */
export interface ValidateTemplateRequest {
  content: string
}

/**
 * 验证模版响应
 */
export interface ValidateTemplateResponse {
  valid: boolean
  errors: string[]
}

/**
 * 验证映射请求
 */
export interface ValidateMappingRequest {
  businessCode: string
  templateId: string
  dataMapping: DataMapping
}

/**
 * 验证映射响应
 */
export interface ValidateMappingResponse {
  valid: boolean
  errors: string[]
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * API响应
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}
