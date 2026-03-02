/**
 * 打印预览组件类型定义
 */

/**
 * 打印方向
 */
export type PrintOrientation = 'portrait' | 'landscape'

/**
 * 打印质量
 */
export type PrintQuality = 'low' | 'medium' | 'high'

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
 * 打印设置
 */
export interface PrintSettings {
  /** 打印份数 */
  copies: number
  /** 打印质量 */
  quality: PrintQuality
  /** 页边距 */
  margin: PageMargin
  /** 页眉页脚 */
  headerFooter: HeaderFooterConfig
  /** 打印方向 */
  orientation: PrintOrientation
}

/**
 * 变量配置
 */
export interface VariableConfig {
  /** 变量名 */
  name: string
  /** 变量标签 */
  label: string
  /** 变量类型 */
  type: 'text' | 'date' | 'number' | 'image'
  /** 默认值 */
  defaultValue?: any
  /** 是否必填 */
  required?: boolean
}

/**
 * 打印模板
 */
export interface PrintTemplate {
  /** 模板ID */
  id: string
  /** 模板名称 */
  name: string
  /** 模板编码 */
  code: string
  /** 模板内容 */
  content: string
  /** 变量列表 */
  variables: VariableConfig[]
  /** 是否默认模板 */
  isDefault?: boolean
  /** 创建时间 */
  createdAt: string
}

/**
 * 打印数据
 */
export interface PrintData {
  /** 数据ID */
  id: string
  /** 数据对象 */
  data: Record<string, any>
  /** 模板ID */
  templateId: string
}

/**
 * 打印进度
 */
export interface PrintProgress {
  /** 总数 */
  total: number
  /** 已完成 */
  completed: number
  /** 当前打印项 */
  current: string
  /** 是否正在打印 */
  printing: boolean
}

/**
 * 打印预览组件Props
 */
export interface PrintPreviewProps {
  /** 打印模板 */
  template?: PrintTemplate
  /** 打印数据 */
  data?: PrintData[]
  /** 打印设置 */
  settings?: Partial<PrintSettings>
  /** 是否显示打印设置 */
  showSettings?: boolean
  /** 是否显示批量打印 */
  showBatchPrint?: boolean
  /** 是否显示变量预览 */
  showVariablePreview?: boolean
  /** 缩放比例 */
  scale?: number
}

/**
 * 打印预览组件Emits
 */
export interface PrintPreviewEmits {
  /** 打印 */
  (e: 'print', data: PrintData[]): void
  /** 设置变化 */
  (e: 'settings-change', settings: PrintSettings): void
  /** 模板变化 */
  (e: 'template-change', template: PrintTemplate): void
  /** 取消 */
  (e: 'cancel'): void
}

/**
 * 打印预览组件实例方法
 */
export interface PrintPreviewInstance {
  /** 打印 */
  print: () => void
  /** 预览 */
  preview: () => void
  /** 重置设置 */
  resetSettings: () => void
  /** 替换变量 */
  replaceVariables: (content: string, data: Record<string, any>) => string
}
