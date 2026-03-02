# ApprovalFlow 审批流程组件

## 功能概述

审批流程组件是一个完整的审批解决方案，支持审批流程配置、审批节点管理、审批记录展示、审批表单等功能。

## 基础用法

### 审批流程配置

```vue
<template>
  <ApprovalFlow
    :flow-config="flowConfig"
    :editable="true"
    @flow-change="handleFlowChange"
    @node-add="handleNodeAdd"
    @node-delete="handleNodeDelete"
    @node-update="handleNodeUpdate"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApprovalFlow from '@/components/ApprovalFlow.vue'
import type { ApprovalFlowConfig } from '@/types/approval-flow'

const flowConfig = ref<ApprovalFlowConfig>({
  id: '1',
  name: '请假审批流程',
  code: 'leave-approval',
  description: '员工请假审批流程',
  status: 'enabled',
  nodes: [
    {
      id: '1',
      name: '部门主管审批',
      type: 'approval',
      approvers: ['user1', 'user2'],
      approvalMode: 'or',
      required: true
    },
    {
      id: '2',
      name: '人事审批',
      type: 'approval',
      approvers: ['user3'],
      approvalMode: 'or',
      required: true
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const handleFlowChange = (flow: ApprovalFlowConfig) => {
  console.log('流程配置已更新:', flow)
}

const handleNodeAdd = (node) => {
  console.log('节点已添加:', node)
}

const handleNodeDelete = (nodeId: string) => {
  console.log('节点已删除:', nodeId)
}

const handleNodeUpdate = (node) => {
  console.log('节点已更新:', node)
}
</script>
```

### 审批记录展示

```vue
<template>
  <ApprovalFlow
    :approval-status="approvalStatus"
    :readonly="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ApprovalStatus } from '@/types/approval-flow'

const approvalStatus = ref<ApprovalStatus>({
  status: 'approved',
  currentNodeId: '2',
  records: [
    {
      nodeId: '1',
      nodeName: '部门主管审批',
      approver: '张三',
      approvalTime: new Date('2024-01-01 10:00:00'),
      approvalResult: 'approved',
      approvalComment: '同意请假'
    },
    {
      nodeId: '2',
      nodeName: '人事审批',
      approver: '李四',
      approvalTime: new Date('2024-01-01 14:00:00'),
      approvalResult: 'approved',
      approvalComment: '审批通过'
    }
  ]
})
</script>
```

### 审批表单

```vue
<template>
  <ApprovalFlow
    :approval-status="approvalStatus"
    :show-approval-form="true"
    :current-user-id="currentUserId"
    @approve="handleApprove"
    @reject="handleReject"
    @transfer="handleTransfer"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ApprovalStatus, ApprovalFormData } from '@/types/approval-flow'

const currentUserId = ref('user1')

const approvalStatus = ref<ApprovalStatus>({
  status: 'in_progress',
  currentNodeId: '1',
  records: []
})

const handleApprove = (data: ApprovalFormData) => {
  console.log('审批通过:', data)
}

const handleReject = (data: ApprovalFormData) => {
  console.log('审批驳回:', data)
}

const handleTransfer = (data: ApprovalFormData) => {
  console.log('转交他人:', data)
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| flowConfig | 审批流程配置 | `ApprovalFlowConfig` | - |
| approvalStatus | 审批状态 | `ApprovalStatus` | - |
| editable | 是否可编辑 | `boolean` | `false` |
| showApprovalForm | 是否显示审批表单 | `boolean` | `true` |
| readonly | 是否只读 | `boolean` | `false` |
| currentUserId | 当前用户ID | `string` | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| flow-change | 流程配置变化 | `(flow: ApprovalFlowConfig) => void` |
| node-add | 节点添加 | `(node: ApprovalNode) => void` |
| node-delete | 节点删除 | `(nodeId: string) => void` |
| node-update | 节点更新 | `(node: ApprovalNode) => void` |
| node-reorder | 节点顺序变化 | `(nodes: ApprovalNode[]) => void` |
| approve | 审批通过 | `(data: ApprovalFormData) => void` |
| reject | 审批驳回 | `(data: ApprovalFormData) => void` |
| transfer | 转交 | `(data: ApprovalFormData) => void` |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| addNode | 添加节点 | `(node: Partial<ApprovalNode>) => void` |
| deleteNode | 删除节点 | `(nodeId: string) => void` |
| updateNode | 更新节点 | `(nodeId: string, node: Partial<ApprovalNode>) => void` |
| reorderNodes | 调整节点顺序 | `(nodes: ApprovalNode[]) => void` |
| submitApproval | 提交审批 | `(data: ApprovalFormData) => void` |
| getCurrentNode | 获取当前节点 | `() => ApprovalNode \| null` |
| validateFlow | 验证流程配置 | `() => boolean` |

### 类型定义

#### ApprovalFlowConfig

```typescript
interface ApprovalFlowConfig {
  id: string
  name: string
  code: string
  description?: string
  status: 'enabled' | 'disabled'
  nodes: ApprovalNode[]
  createdAt: string
  updatedAt: string
}
```

#### ApprovalNode

```typescript
interface ApprovalNode {
  id: string
  name: string
  type: 'approval' | 'cc'
  approvers: string[]
  approvalMode: 'or' | 'and'
  condition?: string
  required?: boolean
}
```

#### ApprovalStatus

```typescript
interface ApprovalStatus {
  status: 'pending' | 'in_progress' | 'approved' | 'rejected'
  currentNodeId?: string
  records: ApprovalRecord[]
}
```

#### ApprovalFormData

```typescript
interface ApprovalFormData {
  comment: string
  result: 'approved' | 'rejected' | 'pending'
  rejectReason?: string
  transferTo?: string
  attachments?: File[]
}
```

## 使用场景

1. **请假审批** - 员工请假申请审批流程
2. **调岗审批** - 员工调岗申请审批流程
3. **离职审批** - 员工离职申请审批流程
4. **报销审批** - 费用报销审批流程
5. **采购审批** - 物资采购审批流程

## 注意事项

1. 审批节点支持拖拽排序（需要安装 vuedraggable）
2. 审批人列表需要从用户服务获取
3. 审批记录会完整保存所有审批历史
4. 当前节点会高亮显示
5. 审批表单支持附件上传
6. 支持审批转交功能

## 依赖安装

```bash
npm install vuedraggable@next
```

或

```bash
yarn add vuedraggable@next
```
