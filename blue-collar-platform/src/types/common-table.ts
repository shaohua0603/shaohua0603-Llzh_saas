/**
 * 通用表格组件类型定义
 */

/**
 * 列配置
 */
export interface ColumnConfig {
  /** 字段名 */
  prop: string
  /** 列标题 */
  label: string
  /** 列宽度 */
  width?: number
  /** 最小列宽 */
  minWidth?: number
  /** 固定列 */
  fixed?: boolean | 'left' | 'right'
  /** 是否可排序 */
  sortable?: boolean
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否显示悬浮提示 */
  showTooltip?: boolean
  /** 是否可调整宽度 */
  resizable?: boolean
  /** 是否必选列(不可隐藏) */
  required?: boolean
  /** 格式化函数 */
  formatter?: (value: any, row: any) => string
}

/**
 * 表格配置
 */
export interface TableConfig {
  /** 表格ID(用于保存设置) */
  tableId: string
  /** 列配置 */
  columns: ColumnConfig[]
  /** 默认排序 */
  defaultSort?: { prop: string; order: 'ascending' | 'descending' | null }
}

/**
 * 自定义列表
 */
export interface CustomList {
  /** 列表ID */
  id: string
  /** 列表名称 */
  name: string
  /** 是否默认列表 */
  isDefault: boolean
  /** 可见列 */
  visibleColumns: string[]
  /** 列顺序 */
  columnOrder: string[]
  /** 用户ID */
  userId: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 排序配置
 */
export interface SortConfig {
  /** 排序字段 */
  prop: string
  /** 排序方式 */
  order: 'ascending' | 'descending' | null
}

/**
 * 分页配置
 */
export interface PaginationConfig {
  /** 当前页 */
  currentPage: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
  /** 每页条数选项 */
  pageSizes: number[]
}

/**
 * 表格数据
 */
export interface TableData {
  /** 数据列表 */
  list: any[]
  /** 总条数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 列表设置
 */
export interface ListSettings {
  /** 可见列 */
  visibleColumns: string[]
  /** 列顺序 */
  columnOrder: string[]
}

/**
 * 表格Props
 */
export interface CommonTableProps {
  /** 表格数据 */
  data: any[]
  /** 列配置 */
  columns: ColumnConfig[]
  /** 表格ID */
  tableId: string
  /** 是否显示边框 */
  border?: boolean
  /** 是否显示斑马纹 */
  stripe?: boolean
  /** 表格高度 */
  height?: string | number
  /** 最大高度 */
  maxHeight?: string | number
  /** 行数据的Key */
  rowKey?: string
  /** 默认排序 */
  defaultSort?: { prop: string; order: 'ascending' | 'descending' | null }
  /** 是否显示工具栏 */
  showToolbar?: boolean
  /** 是否显示全局搜索 */
  showGlobalSearch?: boolean
  /** 是否显示列表管理 */
  showListManagement?: boolean
  /** 是否显示列设置 */
  showColumnSetting?: boolean
  /** 是否显示多选 */
  showSelection?: boolean
  /** 是否显示序号 */
  showIndex?: boolean
  /** 是否显示操作列 */
  showActions?: boolean
  /** 操作列宽度 */
  actionColumnWidth?: number
  /** 操作列固定 */
  actionFixed?: boolean | 'left' | 'right'
  /** 是否显示分页 */
  showPagination?: boolean
  /** 是否显示批量操作 */
  showBatchActions?: boolean
  /** 分页大小选项 */
  pageSizes?: number[]
  /** 分页布局 */
  paginationLayout?: string
  /** 总条数 */
  total?: number
  /** 当前页 */
  currentPage?: number
  /** 每页条数 */
  pageSize?: number
  /** 加载状态 */
  loading?: boolean
}

/**
 * 表格Emits
 */
export interface CommonTableEmits {
  /** 当前页变化 */
  (e: 'update:currentPage', value: number): void
  /** 每页条数变化 */
  (e: 'update:pageSize', value: number): void
  /** 排序变化 */
  (e: 'sort-change', sort: { prop: string; order: string | null }): void
  /** 选择变化 */
  (e: 'selection-change', selection: any[]): void
  /** 行点击 */
  (e: 'row-click', row: any, column: any, event: Event): void
  /** 全局搜索 */
  (e: 'global-search', keyword: string): void
  /** 批量操作 */
  (e: 'batch-action', selectedRows: any[]): void
  /** 保存列表 */
  (e: 'save-list', list: CustomList): void
  /** 应用列表 */
  (e: 'apply-list', list: CustomList): void
  /** 重置列表 */
  (e: 'reset-list'): void
}

/**
 * 表格实例方法
 */
export interface CommonTableInstance {
  /** 清空选择 */
  clearSelection: () => void
  /** 切换行选择 */
  toggleRowSelection: (row: any, selected?: boolean) => void
  /** 切换全选 */
  toggleAllSelection: () => void
  /** 切换行展开 */
  toggleRowExpansion: (row: any, expanded?: boolean) => void
  /** 设置当前行 */
  setCurrentRow: (row: any) => void
  /** 清空排序 */
  clearSort: () => void
  /** 排序 */
  sort: (prop: string, order: string) => void
}
