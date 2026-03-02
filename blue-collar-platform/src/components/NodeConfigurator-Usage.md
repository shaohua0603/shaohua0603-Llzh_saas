# NodeConfigurator 组件使用指南

## 组件简介

NodeConfigurator（节点配置器）是一个用于配置审批流程中节点信息的组件。它提供了完整的节点配置功能，包括节点基本信息、审批配置、抄送配置、条件配置、超时配置和自动审批配置。

## 功能特性

### 1. 节点基本信息配置
- 节点名称：支持文本输入，最大长度50字符
- 节点类型：支持审批节点、抄送节点、条件节点三种类型

### 2. 审批配置（仅审批节点）
- 审批模式：支持或签（一人通过即可）和会签（所有人都需通过）
- 审批人类型：支持角色、部门、岗位、指定用户、表单字段五种类型
- 审批人列表：支持多选，根据审批人类型动态加载选项

### 3. 抄送配置（仅抄送节点）
- 抄送人类型：支持角色、部门、岗位、指定用户、表单字段五种类型
- 抄送人列表：支持多选，根据抄送人类型动态加载选项

### 4. 条件配置（仅条件节点）
- 条件表达式：支持使用表单字段和逻辑运算符

### 5. 超时配置
- 超时时间：支持1-720小时的可配置范围
- 超时处理方式：支持自动通过、自动驳回、提醒审批人三种方式

### 6. 自动审批配置（仅审批节点）
- 启用自动审批：开关控制
- 自动审批结果：支持通过和驳回两种结果

## 组件使用

### 基础用法

```vue
<template>
  <div>
    <NodeConfigurator
      :node="nodeData"
      @save="handleSave"
      @cancel="handleCancel"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NodeConfigurator from '@/components/NodeConfigurator.vue'
import type { ApprovalNode } from '@/types/flow-config'

const nodeData = ref<Partial<ApprovalNode>>({
  nodeName: '部门经理审批',
  nodeType: 'APPROVAL',
  approvalMode: 'OR',
  approverType: 'ROLE',
  approvers: ['role_manager'],
  timeoutHours: 24,
  timeoutAction: 'remind',
  autoApprove: false
})

const handleSave = (node: Partial<ApprovalNode>) => {
  console.log('保存节点配置:', node)
  // 保存到后端或更新状态
}

const handleCancel = () => {
  console.log('取消配置')
}

const handleUpdate = (node: Partial<ApprovalNode>) => {
  console.log('节点配置更新:', node)
}
</script>
```

### 只读模式

```vue
<template>
  <NodeConfigurator
    :node="nodeData"
    :readonly="true"
  />
</template>
```

### 与ApprovalFlow组件集成

```vue
<template>
  <el-dialog
    v-model="dialogVisible"
    title="配置节点"
    width="800px"
    :close-on-click-modal="false"
  >
    <NodeConfigurator
      ref="nodeConfiguratorRef"
      :node="currentNode"
      @save="handleSaveNode"
      @cancel="dialogVisible = false"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NodeConfigurator from '@/components/NodeConfigurator.vue'
import type { ApprovalNode } from '@/types/flow-config'

const dialogVisible = ref(false)
const currentNode = ref<Partial<ApprovalNode>>({})
const nodeConfiguratorRef = ref()

const openNodeConfig = (node?: ApprovalNode) => {
  if (node) {
    currentNode.value = { ...node }
  } else {
    currentNode.value = {
      nodeName: '',
      nodeType: 'APPROVAL',
      approvalMode: 'OR',
      approverType: 'ROLE',
      approvers: [],
      timeoutHours: 24,
      timeoutAction: 'remind',
      autoApprove: false
    }
  }
  dialogVisible.value = true
}

const handleSaveNode = (node: Partial<ApprovalNode>) => {
  console.log('保存节点:', node)
  dialogVisible.value = false
  // 更新ApprovalFlow组件中的节点数据
}
</script>
```

## Props 参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| node | `Partial<ApprovalNode>` | - | 节点数据对象 |
| readonly | `boolean` | `false` | 是否只读模式 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update | `(node: Partial<ApprovalNode>)` | 节点配置更新时触发 |
| save | `(node: Partial<ApprovalNode>)` | 点击保存按钮时触发 |
| cancel | - | 点击取消按钮时触发 |

## 暴露方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| getFormData | - | `Partial<ApprovalNode>` | 获取当前表单数据 |
| validate | - | `Promise<boolean>` | 验证表单 |
| reset | - | `void` | 重置表单 |

## 数据类型

### ApprovalNode

```typescript
interface ApprovalNode {
  id?: number
  flowId?: number
  nodeName: string
  nodeCode: string
  nodeType: NodeType
  nodeOrder: number
  approvalMode?: ApprovalMode
  approverType: ApproverType
  approverConfig?: string
  ccUsers?: string
  conditionConfig?: string
  isRequired?: number
  autoApprove?: number
  timeoutHours?: number
  timeoutAction?: string
  tenantId?: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  remark?: string
}
```

### NodeType

```typescript
enum NodeType {
  APPROVAL = 'APPROVAL',    // 审批节点
  CC = 'CC',                // 抄送节点
  CONDITION = 'CONDITION'   // 条件节点
}
```

### ApprovalMode

```typescript
enum ApprovalMode {
  OR = 'OR',   // 或签
  AND = 'AND'  // 会签
}
```

### ApproverType

```typescript
enum ApproverType {
  ROLE = 'ROLE',              // 角色
  DEPARTMENT = 'DEPARTMENT',  // 部门
  POSITION = 'POSITION',      // 岗位
  USER = 'USER',              // 指定用户
  FORM_FIELD = 'FORM_FIELD'   // 表单字段
}
```

## 表单验证规则

### 节点名称
- 必填
- 长度：2-50个字符

### 节点类型
- 必填

### 审批模式
- 必填（仅审批节点）

### 审批人类型
- 必填（仅审批节点和抄送节点）

### 审批人列表
- 必填（仅审批节点和抄送节点）
- 至少选择一个审批人

### 条件表达式
- 必填（仅条件节点）

## 样式定制

组件使用 scoped 样式，如需自定义样式，可以通过以下方式：

```vue
<template>
  <NodeConfigurator class="custom-configurator" />
</template>

<style>
.custom-configurator {
  /* 自定义样式 */
}
</style>
```

## 注意事项

1. **审批人选项加载**：组件内部使用模拟数据加载审批人选项，实际使用时应替换为真实的API调用。

2. **条件表达式**：条件节点的条件表达式需要根据实际业务需求进行验证，确保表达式的正确性。

3. **超时配置**：超时时间的单位是小时，最大值为720小时（30天）。

4. **自动审批**：自动审批功能需要谨慎使用，建议仅在明确的业务场景下启用。

5. **表单验证**：组件内置了完善的表单验证规则，确保数据的完整性和正确性。

## 示例场景

### 场景1：配置审批节点

```typescript
const approvalNode = {
  nodeName: '部门经理审批',
  nodeType: 'APPROVAL',
  approvalMode: 'OR',
  approverType: 'ROLE',
  approvers: ['role_manager'],
  timeoutHours: 24,
  timeoutAction: 'remind',
  autoApprove: false
}
```

### 场景2：配置抄送节点

```typescript
const ccNode = {
  nodeName: '抄送人事部',
  nodeType: 'CC',
  approverType: 'DEPARTMENT',
  approvers: ['dept_hr'],
  timeoutHours: 0,
  timeoutAction: ''
}
```

### 场景3：配置条件节点

```typescript
const conditionNode = {
  nodeName: '金额判断',
  nodeType: 'CONDITION',
  conditionConfig: 'amount > 10000 && department == "财务部"'
}
```

## 更新日志

### v1.0.0 (2026-02-26)
- 初始版本发布
- 支持节点基本信息配置
- 支持审批配置、抄送配置、条件配置
- 支持超时配置和自动审批配置
- 完善的表单验证规则
- 响应式设计支持
