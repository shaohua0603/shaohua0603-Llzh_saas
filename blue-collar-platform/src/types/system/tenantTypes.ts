/**
 * 租户状态枚举
 */
export enum TenantStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled'
}

/**
 * 租户类型枚举
 */
export enum TenantType {
  LABOR_COMPANY = 'labor_company',
  FACTORY = 'factory'
}

/**
 * 租户信息接口
 */
export interface Tenant {
  id: string
  tenantName: string
  creditCode: string
  businessLicense: string
  adminName: string
  adminPhone: string
  contactName: string
  contactPhone: string
  packageId: string
  packageName: string
  tenantType: TenantType
  status: TenantStatus
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

/**
 * 租户查询参数接口
 */
export interface TenantQueryParams {
  page: number
  pageSize: number
  keyword?: string
  packageId?: string
  status?: TenantStatus
  tenantType?: TenantType
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 租户表单数据接口
 */
export interface TenantFormData {
  id?: string
  tenantName: string
  creditCode: string
  businessLicense: string
  adminName: string
  adminPhone: string
  contactName: string
  contactPhone: string
  packageId: string
  tenantType: TenantType
  status: TenantStatus
}

/**
 * 租户详情接口
 */
export interface TenantDetail extends Tenant {
  tenantTypeName?: string
  statusName?: string
}

/**
 * 租户状态选项接口
 */
export interface TenantStatusOption {
  label: string
  value: TenantStatus
  color: string
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
 * 租户状态字典
 */
export const TenantStatusDict: Record<TenantStatus, TenantStatusOption> = {
  [TenantStatus.ENABLED]: { label: '启用', value: TenantStatus.ENABLED, color: 'success' },
  [TenantStatus.DISABLED]: { label: '禁用', value: TenantStatus.DISABLED, color: 'info' }
}

/**
 * 租户类型字典
 */
export const TenantTypeDict: Record<TenantType, TenantTypeOption> = {
  [TenantType.LABOR_COMPANY]: { label: '劳务公司', value: TenantType.LABOR_COMPANY, color: 'primary' },
  [TenantType.FACTORY]: { label: '工厂', value: TenantType.FACTORY, color: 'warning' }
}
