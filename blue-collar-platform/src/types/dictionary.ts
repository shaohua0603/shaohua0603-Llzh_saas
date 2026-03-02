/**
 * 字典管理类型定义
 */

/**
 * 字典类型
 */
export type DictionaryType = 'system' | 'business' | 'custom'

/**
 * 字典值状态
 */
export type DictionaryValueStatus = 'enabled' | 'disabled'

/**
 * 字典值
 */
export interface DictionaryValue {
  /** 字典值ID */
  id: string
  /** 字典值 */
  value: string
  /** 字典标签 */
  label: string
  /** 排序 */
  sort: number
  /** 状态 */
  status: DictionaryValueStatus
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
}

/**
 * 字典
 */
export interface Dictionary {
  /** 字典ID */
  id: string
  /** 字典名称 */
  name: string
  /** 字典类型 */
  type: DictionaryType
  /** 字典编码 */
  code: string
  /** 字典值列表 */
  values: DictionaryValue[]
  /** 字典说明 */
  description?: string
  /** 创建人ID */
  creatorId?: string
  /** 创建人姓名 */
  creatorName?: string
  /** 部门ID */
  departmentId?: string
  /** 部门名称 */
  departmentName?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt?: string
}

/**
 * 字典查询参数
 */
export interface DictionaryQueryParams {
  /** 当前页 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 字典名称 */
  name?: string
  /** 字典编码 */
  code?: string
  /** 字典类型 */
  type?: DictionaryType
  /** 排序字段 */
  sortField?: string
  /** 排序方式 */
  sortOrder?: 'asc' | 'desc'
  /** 数据权限过滤 */
  dataPermissionFilter?: {
    /** 部门ID列表 */
    departmentIds?: string[]
    /** 创建人ID */
    creatorId?: string
  }
}

/**
 * 字典响应
 */
export interface DictionaryResponse {
  /** 字典列表 */
  list: Dictionary[]
  /** 总条数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 字典值查询参数
 */
export interface DictionaryValueQueryParams {
  /** 当前页 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 字典ID */
  dictionaryId: string
  /** 字典值 */
  value?: string
  /** 字典标签 */
  label?: string
  /** 状态 */
  status?: DictionaryValueStatus
  /** 排序字段 */
  sortField?: string
  /** 排序方式 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 字典值响应
 */
export interface DictionaryValueResponse {
  /** 字典值列表 */
  list: DictionaryValue[]
  /** 总条数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 字典表单数据
 */
export interface DictionaryFormData {
  /** 字典ID（编辑时需要） */
  id?: string
  /** 字典名称 */
  name: string
  /** 字典类型 */
  type: DictionaryType
  /** 字典编码 */
  code: string
  /** 字典说明 */
  description?: string
  /** 字典值列表 */
  values: DictionaryValueFormData[]
}

/**
 * 字典值表单数据
 */
export interface DictionaryValueFormData {
  /** 字典值ID（编辑时需要） */
  id?: string
  /** 字典值 */
  value: string
  /** 字典标签 */
  label: string
  /** 排序 */
  sort: number
  /** 状态 */
  status: DictionaryValueStatus
  /** 备注 */
  remark?: string
}

/**
 * 字典导入数据
 */
export interface DictionaryImportData {
  /** 字典名称 */
  name: string
  /** 字典类型 */
  type: DictionaryType
  /** 字典编码 */
  code: string
  /** 字典说明 */
  description?: string
  /** 字典值列表 */
  values: {
    /** 字典值 */
    value: string
    /** 字典标签 */
    label: string
    /** 排序 */
    sort: number
    /** 状态 */
    status: DictionaryValueStatus
    /** 备注 */
    remark?: string
  }[]
}

/**
 * 字典导出数据
 */
export interface DictionaryExportData {
  /** 字典列表 */
  dictionaries: Dictionary[]
  /** 导出时间 */
  exportTime: string
  /** 导出人 */
  exporter: string
}

/**
 * 字典统计数据
 */
export interface DictionaryStatistics {
  /** 字典总数 */
  totalDictionaries: number
  /** 系统字典数 */
  systemDictionaries: number
  /** 业务字典数 */
  businessDictionaries: number
  /** 自定义字典数 */
  customDictionaries: number
  /** 字典值总数 */
  totalValues: number
  /** 启用字典值数 */
  enabledValues: number
  /** 禁用字典值数 */
  disabledValues: number
}

/**
 * 字典操作日志
 */
export interface DictionaryOperationLog {
  /** 日志ID */
  id: string
  /** 字典ID */
  dictionaryId: string
  /** 字典名称 */
  dictionaryName: string
  /** 操作类型 */
  operationType: 'create' | 'update' | 'delete' | 'import' | 'export'
  /** 操作内容 */
  operationContent: string
  /** 操作人ID */
  operatorId: string
  /** 操作人姓名 */
  operatorName: string
  /** 操作时间 */
  operationTime: string
  /** IP地址 */
  ipAddress?: string
}
