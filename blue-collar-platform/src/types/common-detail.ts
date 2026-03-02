/**
 * 通用详情组件类型定义
 */

/**
 * 字段类型
 */
export type DetailFieldType =
  | 'text'           // 文本
  | 'date'           // 日期
  | 'datetime'       // 日期时间
  | 'number'         // 数字
  | 'enum'           // 枚举
  | 'richtext'       // 富文本
  | 'file'           // 文件
  | 'image'          // 图片
  | 'link'           // 链接
  | 'tag'            // 标签
  | 'progress'       // 进度条
  | 'rate'           // 评分
  | 'avatar'         // 头像
  | 'custom'         // 自定义

/**
 * 字段配置
 */
export interface DetailFieldConfig {
  /** 字段名 */
  field: string
  /** 字段标签 */
  label: string
  /** 字段类型 */
  type: DetailFieldType
  /** 字段宽度 */
  width?: string | number
  /** 是否显示 */
  visible?: boolean | ((data: any) => boolean)
  /** 格式化函数 */
  formatter?: (value: any, data: any) => string
  /** 枚举选项（用于enum、tag类型） */
  options?: Array<{ label: string; value: any; color?: string }>
  /** 链接地址（用于link类型） */
  link?: string | ((data: any) => string)
  /** 是否新窗口打开（用于link类型） */
  target?: '_blank' | '_self'
  /** 进度条百分比（用于progress类型） */
  percentage?: number | ((data: any) => number)
  /** 进度条状态（用于progress类型） */
  status?: 'success' | 'exception' | 'warning' | ''
  /** 评分值（用于rate类型） */
  rate?: number | ((data: any) => number)
  /** 是否允许半星（用于rate类型） */
  allowHalf?: boolean
  /** 是否禁用（用于rate类型） */
  disabled?: boolean
  /** 头像大小（用于avatar类型） */
  avatarSize?: number | 'large' | 'default' | 'small'
  /** 自定义渲染函数 */
  render?: (value: any, data: any) => any
  /** 提示信息 */
  tip?: string
  /** 自定义属性 */
  [key: string]: any
}

/**
 * 信息分组配置
 */
export interface DetailGroupConfig {
  /** 分组标题 */
  title: string
  /** 分组字段 */
  fields: DetailFieldConfig[]
  /** 是否可折叠 */
  collapsible?: boolean
  /** 默认展开 */
  defaultExpanded?: boolean
  /** 分组宽度 */
  width?: string | number
  /** 列数 */
  columns?: number
  /** 栅格间距 */
  gutter?: number
}

/**
 * 操作记录
 */
export interface OperationRecord {
  /** 记录ID */
  id: string
  /** 操作人 */
  operator: string
  /** 操作人头像 */
  operatorAvatar?: string
  /** 操作时间 */
  operateTime: string
  /** 操作类型 */
  operationType: string
  /** 操作内容 */
  operationContent: string
  /** 操作状态 */
  operationStatus: 'success' | 'failed' | 'pending'
  /** 备注 */
  remark?: string
  /** 附件 */
  attachments?: Attachment[]
}

/**
 * 审核记录
 */
export interface ApprovalRecord {
  /** 节点ID */
  nodeId: string
  /** 节点名称 */
  nodeName: string
  /** 审核人 */
  approver: string
  /** 审核人头像 */
  approverAvatar?: string
  /** 审核时间 */
  approvalTime: string
  /** 审核结果 */
  approvalResult: 'approved' | 'rejected' | 'pending'
  /** 审核意见 */
  approvalComment: string
  /** 附件 */
  attachments?: Attachment[]
}

/**
 * 附件配置
 */
export interface AttachmentConfig {
  /** 附件名称 */
  name: string
  /** 附件类型 */
  type: 'image' | 'file' | 'video' | 'audio' | 'document'
  /** 附件地址 */
  url: string
  /** 附件大小 */
  size?: number
  /** 是否支持预览 */
  preview?: boolean
  /** 是否支持下载 */
  download?: boolean
  /** 自定义属性 */
  [key: string]: any
}

/**
 * 附件
 */
export interface Attachment {
  /** 附件ID */
  id: string
  /** 附件名称 */
  name: string
  /** 附件类型 */
  type: 'image' | 'file' | 'video' | 'audio' | 'document'
  /** 附件地址 */
  url: string
  /** 附件大小 */
  size: number
  /** 上传时间 */
  uploadTime: string
  /** 上传人 */
  uploader: string
  /** 备注 */
  remark?: string
}

/**
 * 操作按钮配置
 */
export interface ActionButton {
  /** 按钮类型 */
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  /** 按钮文本 */
  label: string
  /** 按钮图标 */
  icon?: string
  /** 是否显示 */
  visible?: boolean | ((data: any) => boolean)
  /** 是否禁用 */
  disabled?: boolean | ((data: any) => boolean)
  /** 确认提示 */
  confirm?: string
  /** 点击处理函数 */
  handler: (data: any) => void | Promise<void>
  /** 加载状态 */
  loading?: boolean
  /** 自定义属性 */
  [key: string]: any
}

/**
 * 详情配置
 */
export interface DetailConfig {
  /** 标题 */
  title?: string
  /** 面包屑 */
  breadcrumb?: Array<{ label: string; path: string }>
  /** 信息分组 */
  groups: DetailGroupConfig[]
  /** 操作记录 */
  operationRecords?: OperationRecord[]
  /** 审核记录 */
  approvalRecords?: ApprovalRecord[]
  /** 操作按钮 */
  actions?: ActionButton[]
  /** 附件配置 */
  attachment?: AttachmentConfig
  /** 是否显示操作记录 */
  showOperationRecords?: boolean
  /** 是否显示审核记录 */
  showApprovalRecords?: boolean
  /** 是否显示附件 */
  showAttachments?: boolean
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 加载状态 */
  loading?: boolean
}

/**
 * 详情Props
 */
export interface CommonDetailProps {
  /** 详情配置 */
  config: DetailConfig
  /** 详情数据 */
  data: any
  /** 是否加载中 */
  loading?: boolean
}

/**
 * 详情Emits
 */
export interface CommonDetailEmits {
  /** 操作按钮点击 */
  (e: 'action-click', action: ActionButton, data: any): void
  /** 附件下载 */
  (e: 'attachment-download', attachment: Attachment): void
  /** 附件预览 */
  (e: 'attachment-preview', attachment: Attachment): void
  /** 分组折叠/展开 */
  (e: 'group-toggle', group: DetailGroupConfig, expanded: boolean): void
}
