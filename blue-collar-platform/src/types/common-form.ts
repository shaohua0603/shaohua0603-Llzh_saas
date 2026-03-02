/**
 * 通用表单组件类型定义
 */

/**
 * 字段类型
 */
export type FieldType =
  | 'TEXT'           // 单行文本输入
  | 'TEXTAREA'       // 多行文本输入
  | 'NUMBER'         // 数字输入
  | 'SELECT'         // 下拉单选
  | 'RADIO'          // 单选按钮组
  | 'CHECKBOX'       // 复选框组
  | 'DATE'           // 日期选择
  | 'DATETIME'       // 日期时间选择
  | 'DATERANGE'      // 日期范围选择
  | 'PERSON'         // 人员选择
  | 'DEPARTMENT'     // 部门选择
  | 'RICHTEXT'       // 富文本
  | 'FILE'           // 文件上传
  | 'IMAGE'          // 图片上传

/**
 * 验证规则类型
 */
export type ValidationRuleType =
  | 'required'       // 必填
  | 'email'          // 邮箱
  | 'phone'          // 手机号
  | 'idcard'         // 身份证号
  | 'custom'         // 自定义验证

/**
 * 验证规则
 */
export interface ValidationRule {
  /** 规则类型 */
  type: ValidationRuleType
  /** 错误提示信息 */
  message: string
  /** 自定义验证函数 */
  validator?: (rule: any, value: any, callback: any) => void
  /** 触发方式 */
  trigger?: 'blur' | 'change'
}

/**
 * 选项配置（用于SELECT、RADIO、CHECKBOX）
 */
export interface OptionConfig {
  /** 选项值 */
  value: any
  /** 选项标签 */
  label: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义属性 */
  [key: string]: any
}

/**
 * 字段联动配置
 */
export interface FieldLinkage {
  /** 联动类型 */
  type: 'visible' | 'value' | 'options'
  /** 联动条件字段 */
  field: string
  /** 联动条件值 */
  value?: any
  /** 联动条件函数 */
  condition?: (formValue: any) => boolean
  /** 联动结果（设置值、设置选项等） */
  result?: any
  /** 联动结果函数 */
  resultFn?: (formValue: any) => any
}

/**
 * 表单字段配置
 */
export interface FormFieldConfig {
  /** 字段名 */
  field: string
  /** 字段标签 */
  label: string
  /** 字段类型 */
  type: FieldType
  /** 占位符 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 验证规则 */
  rules?: ValidationRule[]
  /** 默认值 */
  defaultValue?: any
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否显示 */
  visible?: boolean | ((formValue: any) => boolean)
  /** 字段宽度 */
  width?: string | number
  /** 字段span（栅格布局） */
  span?: number
  /** 选项配置（用于SELECT、RADIO、CHECKBOX） */
  options?: OptionConfig[]
  /** 最小值（用于NUMBER） */
  min?: number
  /** 最大值（用于NUMBER） */
  max?: number
  /** 精度（用于NUMBER） */
  precision?: number
  /** 步长（用于NUMBER） */
  step?: number
  /** 最小长度（用于TEXT、TEXTAREA） */
  minLength?: number
  /** 最大长度（用于TEXT、TEXTAREA） */
  maxLength?: number
  /** 行数（用于TEXTAREA） */
  rows?: number
  /** 自动调整大小（用于TEXTAREA） */
  autosize?: boolean | { minRows?: number; maxRows?: number }
  /** 日期格式（用于DATE、DATETIME、DATERANGE） */
  format?: string
  /** 日期值格式（用于DATE、DATETIME、DATERANGE） */
  valueFormat?: string
  /** 是否可清除 */
  clearable?: boolean
  /** 是否多选（用于SELECT、PERSON、DEPARTMENT） */
  multiple?: boolean
  /** 人员选择来源（用于PERSON） */
  personSource?: 'worker' | 'employee' | 'all'
  /** 显示字段（用于PERSON、DEPARTMENT） */
  displayFields?: string[]
  /** 返回字段（用于PERSON、DEPARTMENT） */
  returnFields?: string[]
  /** 富文本高度（用于RICHTEXT） */
  richtextHeight?: number
  /** 富文本工具栏（用于RICHTEXT） */
  richtextToolbar?: string[]
  /** 文件上传限制（用于FILE、IMAGE） */
  uploadLimit?: number
  /** 文件大小限制（用于FILE、IMAGE）单位MB */
  fileSizeLimit?: number
  /** 文件类型限制（用于FILE、IMAGE） */
  accept?: string[]
  /** 是否允许上传（用于RICHTEXT） */
  allowImage?: boolean
  /** 是否允许上传视频（用于RICHTEXT） */
  allowVideo?: boolean
  /** 是否允许上传文件（用于RICHTEXT） */
  allowFile?: boolean
  /** 字段联动 */
  linkage?: FieldLinkage[]
  /** 前缀 */
  prefix?: string
  /** 后缀 */
  suffix?: string
  /** 前缀图标 */
  prefixIcon?: string
  /** 后缀图标 */
  suffixIcon?: string
  /** 提示信息 */
  tip?: string
  /** 自定义属性 */
  [key: string]: any
}

/**
 * 表单配置
 */
export interface FormConfig {
  /** 表单字段配置 */
  fields: FormFieldConfig[]
  /** 表单标签宽度 */
  labelWidth?: string | number
  /** 表单标签位置 */
  labelPosition?: 'left' | 'right' | 'top'
  /** 表单尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 是否显示标签 */
  showLabel?: boolean
  /** 是否显示星号 */
  showStar?: boolean
  /** 是否禁用表单 */
  disabled?: boolean
  /** 栅格列数 */
  columns?: number
  /** 栅格间距 */
  gutter?: number
  /** 提交按钮文本 */
  submitText?: string
  /** 重置按钮文本 */
  resetText?: string
  /** 保存草稿按钮文本 */
  saveDraftText?: string
  /** 是否显示提交按钮 */
  showSubmit?: boolean
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 是否显示保存草稿按钮 */
  showSaveDraft?: boolean
  /** 是否自动保存草稿 */
  autoSaveDraft?: boolean
  /** 自动保存草稿间隔（毫秒） */
  autoSaveDraftInterval?: number
  /** 草稿存储键 */
  draftStorageKey?: string
  /** 按钮对齐方式 */
  buttonAlign?: 'left' | 'center' | 'right'
  /** 按钮位置 */
  buttonPosition?: 'top' | 'bottom' | 'both'
}

/**
 * 表单数据
 */
export type FormDataValue = Record<string, any>

/**
 * 表单验证结果
 */
export interface FormValidationResult {
  /** 是否验证通过 */
  valid: boolean
  /** 错误信息 */
  errors: Record<string, string>
}

/**
 * 草稿数据
 */
export interface DraftData {
  /** 表单数据 */
  formData: FormDataValue
  /** 保存时间 */
  savedAt: string
  /** 用户ID */
  userId: string
}

/**
 * 表单Props
 */
export interface CommonFormProps {
  /** 表单配置 */
  config: FormConfig
  /** 表单数据 */
  modelValue: FormDataValue
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用表单 */
  disabled?: boolean
}

/**
 * 表单Emits
 */
export interface CommonFormEmits {
  /** 表单数据变化 */
  (e: 'update:modelValue', value: FormDataValue): void
  /** 表单提交 */
  (e: 'submit', formData: FormDataValue): void
  /** 表单重置 */
  (e: 'reset', formData: FormDataValue): void
  /** 字段值变化 */
  (e: 'field-change', field: string, value: any): void
  /** 保存草稿 */
  (e: 'save-draft', draftData: DraftData): void
  /** 恢复草稿 */
  (e: 'restore-draft', draftData: DraftData): void
  /** 验证失败 */
  (e: 'validate-fail', errors: Record<string, string>): void
}

/**
 * 表单实例方法
 */
export interface CommonFormInstance {
  /** 验证表单 */
  validate: () => Promise<boolean>
  /** 验证指定字段 */
  validateField: (field: string) => Promise<boolean>
  /** 清空验证 */
  clearValidate: (fields?: string[]) => void
  /** 重置表单 */
  resetFields: () => void
  /** 清空表单 */
  clearFields: () => void
  /** 设置字段值 */
  setFieldValue: (field: string, value: any) => void
  /** 获取字段值 */
  getFieldValue: (field: string) => any
  /** 保存草稿 */
  saveDraft: () => void
  /** 恢复草稿 */
  restoreDraft: () => void
  /** 清除草稿 */
  clearDraft: () => void
  /** 获取表单数据 */
  getFormData: () => FormDataValue
  /** 设置表单数据 */
  setFormData: (data: FormDataValue) => void
}
