/**
 * 套餐状态枚举
 */
export enum PackageStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled'
}

/**
 * 到期频率枚举
 */
export enum ExpiryFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

/**
 * 租户类型枚举
 */
export enum TenantType {
  LABOR_COMPANY = 'labor_company',
  FACTORY = 'factory'
}

/**
 * 套餐信息接口
 */
export interface Package {
  id: string
  packageName: string
  packageDescription: string
  tenantType: TenantType
  amount: number
  expiryFrequency: ExpiryFrequency
  employeeAccountCount: number
  backgroundCheckWorkerCount: number
  status: PackageStatus
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  menuIds?: number[]
  menus?: any[]
}

/**
 * 套餐查询参数接口
 */
export interface PackageQueryParams {
  page: number
  pageSize: number
  packageName?: string
  tenantType?: TenantType
  status?: PackageStatus
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 套餐表单数据接口
 */
export interface PackageFormData {
  id?: string
  packageName: string
  packageDescription: string
  tenantType: TenantType
  amount: number
  expiryFrequency: ExpiryFrequency
  employeeAccountCount: number
  backgroundCheckWorkerCount: number
  status: PackageStatus
  menuIds?: number[]
}

/**
 * 套餐详情接口
 */
export interface PackageDetail extends Package {
  tenantTypeName?: string
  expiryFrequencyName?: string
}

/**
 * 套餐状态选项接口
 */
export interface PackageStatusOption {
  label: string
  value: PackageStatus
  color: string
}

/**
 * 到期频率选项接口
 */
export interface ExpiryFrequencyOption {
  label: string
  value: ExpiryFrequency
  description: string
}

/**
 * 租户类型选项接口
 */
export interface TenantTypeOption {
  label: string
  value: TenantType
  color: string
}

/**
 * 套餐状态字典
 */
export const PackageStatusDict: Record<PackageStatus, PackageStatusOption> = {
  [PackageStatus.ENABLED]: { label: '启用', value: PackageStatus.ENABLED, color: 'success' },
  [PackageStatus.DISABLED]: { label: '禁用', value: PackageStatus.DISABLED, color: 'info' }
}

/**
 * 到期频率字典
 */
export const ExpiryFrequencyDict: Record<ExpiryFrequency, ExpiryFrequencyOption> = {
  [ExpiryFrequency.MONTHLY]: { label: '月度', value: ExpiryFrequency.MONTHLY, description: '按月计费' },
  [ExpiryFrequency.QUARTERLY]: { label: '季度', value: ExpiryFrequency.QUARTERLY, description: '按季度计费' },
  [ExpiryFrequency.YEARLY]: { label: '年度', value: ExpiryFrequency.YEARLY, description: '按年计费' }
}

/**
 * 租户类型字典
 */
export const TenantTypeDict: Record<TenantType, TenantTypeOption> = {
  [TenantType.LABOR_COMPANY]: { label: '劳务公司', value: TenantType.LABOR_COMPANY, color: 'primary' },
  [TenantType.FACTORY]: { label: '工厂', value: TenantType.FACTORY, color: 'warning' }
}
