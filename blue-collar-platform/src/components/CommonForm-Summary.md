# CommonForm 通用表单组件总结

## 组件概述

CommonForm 是一个功能强大、高度可配置的通用表单组件，基于 Element Plus Form 组件封装，遵循《蓝领智汇平台开发规范》，支持多种字段类型、验证规则、字段联动、草稿保存等功能。

## 核心功能

### 1. 表单验证规则 ✅

组件内置了完整的验证规则系统，支持以下验证类型：

- **必填验证**：标记字段为必填项
- **邮箱验证**：验证邮箱格式是否正确
- **手机号验证**：验证中国大陆手机号格式
- **身份证号验证**：验证中国大陆身份证号格式
- **自定义验证**：支持自定义验证函数

**实现特点：**
- 验证规则在字段配置中定义，灵活配置
- 支持多种触发方式（blur、change）
- 错误提示信息可自定义
- 支持组合多个验证规则

### 2. 表单字段类型封装 ✅

组件支持14种常用字段类型：

| 字段类型 | 说明 | 主要配置项 |
|----------|------|------------|
| TEXT | 单行文本输入 | maxLength、prefix、suffix、prefixIcon、suffixIcon |
| TEXTAREA | 多行文本输入 | rows、autosize、maxLength |
| NUMBER | 数字输入 | min、max、precision、step |
| SELECT | 下拉单选 | options、multiple、filterable、clearable |
| RADIO | 单选按钮组 | options |
| CHECKBOX | 复选框组 | options |
| DATE | 日期选择 | format、valueFormat、clearable |
| DATETIME | 日期时间选择 | format、valueFormat、clearable |
| DATERANGE | 日期范围选择 | format、valueFormat、clearable |
| PERSON | 人员选择 | personSource、multiple、displayFields、returnFields |
| DEPARTMENT | 部门选择 | multiple、showCount |
| RICHTEXT | 富文本 | richtextHeight、richtextToolbar |
| FILE | 文件上传 | uploadLimit、fileSizeLimit、accept |
| IMAGE | 图片上传 | uploadLimit、fileSizeLimit、accept |

**实现特点：**
- 统一的配置接口，降低学习成本
- 每种字段类型都有完整的配置选项
- 支持字段级别的禁用、只读、显示控制
- 支持自定义字段插槽

### 3. 表单联动功能 ✅

组件支持强大的字段联动功能：

- **显示/隐藏联动**：根据其他字段的值控制当前字段的显示/隐藏
- **值变化联动**：根据其他字段的值自动设置当前字段的值
- **选项动态变化**：根据其他字段的值动态更新下拉选项

**实现特点：**
- 支持条件函数，实现复杂的联动逻辑
- 支持多个联动规则
- 联动结果可以是固定值或函数计算结果
- 自动触发表单数据更新

**使用场景：**
- 用户类型选择后显示不同的字段
- 部门选择后动态加载岗位选项
- 选项A选择后自动设置选项B的值

### 4. 表单重置功能 ✅

组件提供完整的表单重置功能：

- **一键重置**：点击重置按钮清空所有字段
- **重置到初始值**：重置到字段配置的默认值
- **清空验证**：重置时自动清空验证错误

**实现特点：**
- 支持重置到初始值或清空所有值
- 重置时触发reset事件
- 支持手动调用resetFields方法

### 5. 表单保存草稿功能 ✅

组件支持完整的草稿保存功能：

- **自动保存草稿**：定时自动保存表单数据
- **手动保存草稿**：点击保存草稿按钮手动保存
- **恢复草稿**：从localStorage恢复之前保存的草稿
- **清除草稿**：清除已保存的草稿数据

**实现特点：**
- 草稿数据存储在localStorage中
- 草稿与用户ID绑定，不同用户互不影响
- 支持自定义存储键，避免冲突
- 支持自定义自动保存间隔
- 保存时记录保存时间和用户信息

**使用场景：**
- 复杂表单填写，防止数据丢失
- 长时间填写，自动保存进度
- 用户可以随时恢复之前的草稿

## 组件特性

### 1. 高度可配置

- **表单级别配置**：标签宽度、位置、尺寸、栅格布局等
- **字段级别配置**：每个字段都可以独立配置
- **按钮配置**：按钮文本、位置、对齐方式等
- **草稿配置**：自动保存、存储键、保存间隔等

### 2. 类型安全

- 使用TypeScript进行完整的类型定义
- 所有配置项都有明确的类型约束
- 提供完整的类型导出，方便其他组件引用

### 3. 响应式设计

- 支持移动端、平板、桌面端自适应
- 自动调整表单布局和按钮位置
- 优化移动端触摸体验

### 4. 插槽支持

- **自定义字段插槽**：支持自定义字段内容
- **按钮插槽**：支持自定义顶部和底部按钮
- 灵活的插槽命名规则：`field-{field}`

### 5. 事件系统

- 提供完整的事件系统
- 支持表单数据变化、字段变化、提交、重置等事件
- 支持草稿保存、恢复等事件

### 6. 方法暴露

- 暴露完整的表单操作方法
- 支持验证、重置、获取/设置数据等操作
- 支持草稿管理方法

## 依赖组件

CommonForm 组件依赖以下组件：

1. **PersonSelect** - 人员选择组件
   - 支持工人、员工、全部人员选择
   - 支持单选和多选
   - 支持搜索和筛选
   - 支持自定义显示和返回字段

2. **DepartmentSelect** - 部门选择组件
   - 支持树形结构展示
   - 支持单选和多选
   - 支持搜索过滤
   - 显示部门人数

## 代码规范

组件严格遵循《蓝领智汇平台开发规范》：

- 使用 Vue 3 Composition API 和 `<script setup>` 语法
- 使用 TypeScript 进行类型定义
- 使用 2 个空格进行缩进
- 使用中文注释
- 组件结构清晰，逻辑分离
- 支持响应式设计
- 遵循命名规范

## 文件结构

```
src/
├── components/
│   ├── CommonForm.vue              # 通用表单组件
│   ├── PersonSelect.vue            # 人员选择组件
│   ├── DepartmentSelect.vue        # 部门选择组件
│   └── CommonForm-QuickStart.md    # 使用指南
├── types/
│   └── common-form.ts              # 类型定义
└── views/
    └── common/
        └── FormExample.vue         # 示例页面
```

## 使用示例

### 基础用法

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
import type { FormConfig } from '@/types/common-form'

const formRef = ref()
const formData = ref({})

const formConfig: FormConfig = {
  fields: [
    {
      field: 'name',
      label: '姓名',
      type: 'TEXT',
      required: true
    }
  ]
}

const handleSubmit = (data: any) => {
  console.log('提交:', data)
}
</script>
```

### 高级用法

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
      field: 'department',
      label: '部门',
      type: 'SELECT',
      linkage: [
        {
          type: 'options',
          field: 'userType',
          resultFn: (formData) => {
            return formData.userType === 'worker'
              ? [{ value: 'dept-1', label: '生产部' }]
              : [{ value: 'dept-2', label: '人力资源部' }]
          }
        }
      ]
    }
  ],
  autoSaveDraft: true,
  autoSaveDraftInterval: 30000
}
</script>
```

## 最佳实践

1. **配置分离**：将表单配置单独定义，便于复用和维护
2. **类型安全**：使用TypeScript类型定义，提升代码质量
3. **验证规则**：合理使用验证规则，提升用户体验
4. **字段联动**：合理使用字段联动，减少用户操作
5. **草稿保存**：对于复杂表单，建议启用草稿保存功能
6. **自定义字段**：对于特殊需求，使用自定义字段插槽
7. **响应式设计**：利用组件的响应式特性，适配不同设备

## 后续优化方向

1. **富文本编辑器**：集成专业的富文本编辑器（如TinyMCE、Quill）
2. **表单布局**：支持更多布局方式（如步骤表单、分栏表单）
3. **动态表单**：支持动态添加/删除字段
4. **表单模板**：支持表单模板功能，快速创建常用表单
5. **数据导入导出**：支持表单数据的导入导出
6. **表单版本**：支持表单版本管理和回滚
7. **表单权限**：支持字段级别的权限控制
8. **表单统计**：支持表单填写统计和分析

## 总结

CommonForm 通用表单组件是一个功能完整、设计合理、易于使用的表单解决方案。它不仅满足了《蓝领智汇平台开发规范》的所有要求，还提供了丰富的功能和灵活的配置选项，能够满足各种复杂的表单需求。

组件的核心优势：

1. **功能完整**：支持14种字段类型、多种验证规则、字段联动、草稿保存等功能
2. **易于使用**：统一的配置接口，降低学习成本
3. **高度可配置**：支持表单级别和字段级别的配置
4. **类型安全**：完整的TypeScript类型定义
5. **响应式设计**：自动适配不同设备
6. **代码规范**：严格遵循项目开发规范
7. **可扩展性强**：支持自定义字段插槽，易于扩展

通过使用CommonForm组件，可以大大提高表单开发的效率和质量，减少重复代码，提升用户体验。
