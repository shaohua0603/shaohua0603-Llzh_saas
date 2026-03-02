# CommonForm 通用表单组件使用指南

## 组件简介

CommonForm 是一个功能强大的通用表单组件，基于 Element Plus Form 组件封装，支持多种字段类型、验证规则、字段联动、草稿保存等功能。

## 功能特性

### 1. 表单验证规则
- ✅ 必填验证
- ✅ 邮箱验证
- ✅ 手机号验证
- ✅ 身份证号验证
- ✅ 自定义验证规则

### 2. 表单字段类型
- TEXT - 单行文本输入
- TEXTAREA - 多行文本输入
- NUMBER - 数字输入
- SELECT - 下拉单选
- RADIO - 单选按钮组
- CHECKBOX - 复选框组
- DATE - 日期选择
- DATETIME - 日期时间选择
- DATERANGE - 日期范围选择
- PERSON - 人员选择
- DEPARTMENT - 部门选择
- RICHTEXT - 富文本
- FILE - 文件上传
- IMAGE - 图片上传

### 3. 表单联动功能
- ✅ 支持字段之间的联动
- ✅ 支持显示/隐藏联动
- ✅ 支持值变化联动
- ✅ 支持选项动态变化

### 4. 表单重置功能
- ✅ 支持一键重置表单
- ✅ 重置到初始值

### 5. 表单保存草稿功能
- ✅ 支持自动保存草稿
- ✅ 支持手动保存草稿
- ✅ 支持恢复草稿
- ✅ 支持清除草稿

## 基础用法

### 1. 简单表单

```vue
<template>
  <CommonForm
    ref="formRef"
    v-model="formData"
    :config="formConfig"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonForm from '@/components/CommonForm.vue'
import type { FormConfig, FormDataValue } from '@/types/common-form'

const formRef = ref()
const formData = ref<FormDataValue>({
  name: '',
  phone: '',
  email: ''
})

const formConfig: FormConfig = {
  fields: [
    {
      field: 'name',
      label: '姓名',
      type: 'TEXT',
      required: true,
      placeholder: '请输入姓名'
    },
    {
      field: 'phone',
      label: '手机号',
      type: 'TEXT',
      required: true,
      placeholder: '请输入手机号'
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'TEXT',
      required: true,
      placeholder: '请输入邮箱'
    }
  ],
  submitText: '提交',
  showSubmit: true,
  showReset: true
}

const handleSubmit = (data: FormDataValue) => {
  console.log('表单提交:', data)
}
</script>
```

### 2. 带验证规则的表单

```vue
<script setup lang="ts">
import type { ValidationRule } from '@/types/common-form'

const formConfig: FormConfig = {
  fields: [
    {
      field: 'name',
      label: '姓名',
      type: 'TEXT',
      required: true,
      rules: [
        {
          type: 'required',
          message: '请输入姓名',
          trigger: 'blur'
        }
      ]
    },
    {
      field: 'phone',
      label: '手机号',
      type: 'TEXT',
      required: true,
      rules: [
        {
          type: 'required',
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          type: 'phone',
          message: '请输入正确的手机号',
          trigger: 'blur'
        }
      ]
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'TEXT',
      required: true,
      rules: [
        {
          type: 'required',
          message: '请输入邮箱',
          trigger: 'blur'
        },
        {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'blur'
        }
      ]
    },
    {
      field: 'idCard',
      label: '身份证号',
      type: 'TEXT',
      rules: [
        {
          type: 'idcard',
          message: '请输入正确的身份证号',
          trigger: 'blur'
        }
      ]
    }
  ]
}
</script>
```

### 3. 各种字段类型示例

```vue
<script setup lang="ts">
const formConfig: FormConfig = {
  fields: [
    // 单行文本
    {
      field: 'username',
      label: '用户名',
      type: 'TEXT',
      placeholder: '请输入用户名',
      maxLength: 20
    },

    // 多行文本
    {
      field: 'remark',
      label: '备注',
      type: 'TEXTAREA',
      placeholder: '请输入备注',
      rows: 4,
      maxLength: 500
    },

    // 数字输入
    {
      field: 'age',
      label: '年龄',
      type: 'NUMBER',
      min: 18,
      max: 60,
      step: 1
    },

    // 下拉选择
    {
      field: 'gender',
      label: '性别',
      type: 'SELECT',
      placeholder: '请选择性别',
      options: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' }
      ]
    },

    // 单选按钮
    {
      field: 'status',
      label: '状态',
      type: 'RADIO',
      options: [
        { value: 'active', label: '启用' },
        { value: 'inactive', label: '禁用' }
      ]
    },

    // 复选框
    {
      field: 'hobbies',
      label: '爱好',
      type: 'CHECKBOX',
      options: [
        { value: 'reading', label: '阅读' },
        { value: 'sports', label: '运动' },
        { value: 'music', label: '音乐' }
      ]
    },

    // 日期选择
    {
      field: 'birthDate',
      label: '出生日期',
      type: 'DATE',
      placeholder: '请选择出生日期'
    },

    // 日期时间选择
    {
      field: 'createTime',
      label: '创建时间',
      type: 'DATETIME',
      placeholder: '请选择创建时间'
    },

    // 日期范围选择
    {
      field: 'dateRange',
      label: '日期范围',
      type: 'DATERANGE',
      placeholder: '请选择日期范围'
    },

    // 人员选择
    {
      field: 'manager',
      label: '负责人',
      type: 'PERSON',
      personSource: 'all',
      multiple: false
    },

    // 部门选择
    {
      field: 'department',
      label: '所属部门',
      type: 'DEPARTMENT',
      multiple: false
    },

    // 富文本
    {
      field: 'content',
      label: '内容',
      type: 'RICHTEXT',
      placeholder: '请输入内容',
      richtextHeight: 300
    },

    // 文件上传
    {
      field: 'attachments',
      label: '附件',
      type: 'FILE',
      uploadLimit: 5,
      fileSizeLimit: 10,
      accept: ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
    },

    // 图片上传
    {
      field: 'images',
      label: '图片',
      type: 'IMAGE',
      uploadLimit: 5,
      fileSizeLimit: 5
    }
  ]
}
</script>
```

### 4. 字段联动示例

```vue
<script setup lang="ts">
const formConfig: FormConfig = {
  fields: [
    {
      field: 'userType',
      label: '用户类型',
      type: 'SELECT',
      options: [
        { value: 'worker', label: '工人' },
        { value: 'employee', label: '员工' }
      ]
    },
    {
      field: 'workerId',
      label: '工人ID',
      type: 'TEXT',
      visible: (formData) => formData.userType === 'worker'
    },
    {
      field: 'employeeId',
      label: '员工ID',
      type: 'TEXT',
      visible: (formData) => formData.userType === 'employee'
    },
    {
      field: 'department',
      label: '部门',
      type: 'SELECT',
      options: [],
      linkage: [
        {
          type: 'options',
          field: 'userType',
          condition: (formData) => formData.userType === 'worker',
          resultFn: (formData) => {
            // 根据用户类型动态返回部门选项
            if (formData.userType === 'worker') {
              return [
                { value: 'dept-1', label: '生产部' },
                { value: 'dept-2', label: '质检部' }
              ]
            }
            return [
              { value: 'dept-3', label: '人力资源部' },
              { value: 'dept-4', label: '财务部' }
            ]
          }
        }
      ]
    }
  ]
}
</script>
```

### 5. 草稿保存示例

```vue
<script setup lang="ts">
const formConfig: FormConfig = {
  fields: [
    // 字段配置...
  ],
  showSaveDraft: true,
  autoSaveDraft: true,
  autoSaveDraftInterval: 30000, // 30秒自动保存一次
  draftStorageKey: 'my-form-draft'
}

// 手动保存草稿
const handleSaveDraft = () => {
  formRef.value?.saveDraft()
}

// 恢复草稿
const handleRestoreDraft = () => {
  formRef.value?.restoreDraft()
}

// 清除草稿
const handleClearDraft = () => {
  formRef.value?.clearDraft()
}
</script>
```

### 6. 自定义字段插槽

```vue
<template>
  <CommonForm
    ref="formRef"
    v-model="formData"
    :config="formConfig"
  >
    <!-- 自定义字段内容 -->
    <template #field-customField="{ field, value, model }">
      <div class="custom-field">
        <el-input v-model="model.customField" placeholder="自定义输入" />
        <el-button @click="handleCustomAction">自定义操作</el-button>
      </div>
    </template>
  </CommonForm>
</template>

<script setup lang="ts">
const formConfig: FormConfig = {
  fields: [
    {
      field: 'customField',
      label: '自定义字段',
      type: 'TEXT'
    }
  ]
}

const handleCustomAction = () => {
  console.log('自定义操作')
}
</script>
```

### 7. 表单布局配置

```vue
<script setup lang="ts">
const formConfig: FormConfig = {
  fields: [
    {
      field: 'field1',
      label: '字段1',
      type: 'TEXT',
      span: 12 // 占据一半宽度
    },
    {
      field: 'field2',
      label: '字段2',
      type: 'TEXT',
      span: 12 // 占据一半宽度
    },
    {
      field: 'field3',
      label: '字段3',
      type: 'TEXT',
      span: 24 // 占据整行
    }
  ],
  columns: 2, // 每行2列
  gutter: 20, // 列间距20px
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
  buttonAlign: 'center',
  buttonPosition: 'bottom'
}
</script>
```

## Props 参数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| config | 表单配置 | FormConfig | - |
| modelValue | 表单数据 | FormDataValue | - |
| loading | 是否加载中 | boolean | false |
| disabled | 是否禁用表单 | boolean | false |
| uploadAction | 上传地址 | string | '/api/upload' |
| uploadHeaders | 上传请求头 | Record<string, string> | {} |
| uploadData | 上传额外参数 | Record<string, any> | {} |

## Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 表单数据变化 | (value: FormDataValue) |
| submit | 表单提交 | (formData: FormDataValue) |
| reset | 表单重置 | (formData: FormDataValue) |
| field-change | 字段值变化 | (field: string, value: any) |
| save-draft | 保存草稿 | (draftData: DraftData) |
| restore-draft | 恢复草稿 | (draftData: DraftData) |
| validate-fail | 验证失败 | (errors: Record<string, string>) |

## Methods 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| validate | 验证表单 | - |
| validateField | 验证指定字段 | (field: string) |
| clearValidate | 清空验证 | (fields?: string[]) |
| resetFields | 重置表单 | - |
| clearFields | 清空表单 | - |
| setFieldValue | 设置字段值 | (field: string, value: any) |
| getFieldValue | 获取字段值 | (field: string) |
| saveDraft | 保存草稿 | - |
| restoreDraft | 恢复草稿 | - |
| clearDraft | 清除草稿 | - |
| getFormData | 获取表单数据 | - |
| setFormData | 设置表单数据 | (data: FormDataValue) |

## Slots 插槽

| 插槽名 | 说明 |
|--------|------|
| buttons-top | 顶部按钮区域 |
| buttons-bottom | 底部按钮区域 |
| field-{field} | 自定义字段内容 |

## 类型定义

### FormConfig

```typescript
interface FormConfig {
  fields: FormFieldConfig[]           // 表单字段配置
  labelWidth?: string | number        // 表单标签宽度
  labelPosition?: 'left' | 'right' | 'top'  // 表单标签位置
  size?: 'large' | 'default' | 'small'     // 表单尺寸
  showLabel?: boolean                 // 是否显示标签
  showStar?: boolean                  // 是否显示星号
  disabled?: boolean                  // 是否禁用表单
  columns?: number                   // 栅格列数
  gutter?: number                    // 栅格间距
  submitText?: string                // 提交按钮文本
  resetText?: string                 // 重置按钮文本
  saveDraftText?: string             // 保存草稿按钮文本
  showSubmit?: boolean               // 是否显示提交按钮
  showReset?: boolean                // 是否显示重置按钮
  showSaveDraft?: boolean           // 是否显示保存草稿按钮
  autoSaveDraft?: boolean            // 是否自动保存草稿
  autoSaveDraftInterval?: number    // 自动保存草稿间隔（毫秒）
  draftStorageKey?: string          // 草稿存储键
  buttonAlign?: 'left' | 'center' | 'right'  // 按钮对齐方式
  buttonPosition?: 'top' | 'bottom' | 'both' // 按钮位置
}
```

### FormFieldConfig

```typescript
interface FormFieldConfig {
  field: string                      // 字段名
  label: string                      // 字段标签
  type: FieldType                    // 字段类型
  placeholder?: string               // 占位符
  required?: boolean                 // 是否必填
  rules?: ValidationRule[]           // 验证规则
  defaultValue?: any                 // 默认值
  disabled?: boolean                 // 是否禁用
  readonly?: boolean                 // 是否只读
  visible?: boolean | ((formValue: any) => boolean)  // 是否显示
  width?: string | number            // 字段宽度
  span?: number                      // 字段span（栅格布局）
  options?: OptionConfig[]          // 选项配置
  min?: number                       // 最小值
  max?: number                       // 最大值
  precision?: number                 // 精度
  step?: number                      // 步长
  minLength?: number                // 最小长度
  maxLength?: number                // 最大长度
  rows?: number                      // 行数
  autosize?: boolean | { minRows?: number; maxRows?: number }  // 自动调整大小
  format?: string                    // 日期格式
  valueFormat?: string               // 日期值格式
  clearable?: boolean                // 是否可清除
  multiple?: boolean                 // 是否多选
  personSource?: 'worker' | 'employee' | 'all'  // 人员选择来源
  displayFields?: string[]           // 显示字段
  returnFields?: string[]            // 返回字段
  richtextHeight?: number           // 富文本高度
  richtextToolbar?: string[]        // 富文本工具栏
  uploadLimit?: number              // 文件上传限制
  fileSizeLimit?: number            // 文件大小限制
  accept?: string[]                  // 文件类型限制
  linkage?: FieldLinkage[]          // 字段联动
  prefix?: string                    // 前缀
  suffix?: string                    // 后缀
  prefixIcon?: string                // 前缀图标
  suffixIcon?: string                // 后缀图标
  tip?: string                       // 提示信息
}
```

## 注意事项

1. **表单验证**：表单验证规则需要在字段配置中定义，支持多种验证类型
2. **字段联动**：字段联动需要在字段配置中定义linkage属性，支持多种联动类型
3. **草稿保存**：草稿数据存储在localStorage中，与用户ID绑定
4. **文件上传**：文件上传需要配置uploadAction、uploadHeaders等参数
5. **自定义字段**：可以使用插槽自定义字段内容，插槽名为`field-{field}`
6. **响应式设计**：组件支持响应式设计，自动适配不同屏幕尺寸

## 最佳实践

1. **表单配置**：将表单配置单独定义，便于复用和维护
2. **验证规则**：合理使用验证规则，提升用户体验
3. **字段联动**：合理使用字段联动，减少用户操作
4. **草稿保存**：对于复杂表单，建议启用草稿保存功能
5. **自定义字段**：对于特殊需求，使用自定义字段插槽
6. **类型安全**：使用TypeScript类型定义，提升代码质量
