# ApprovalRecordTimeline 快速入门

## 30秒快速开始

### 1. 引入组件

```vue
<script setup lang="ts">
import ApprovalRecordTimeline from '@/components/ApprovalRecordTimeline.vue'
import type { ApprovalRecord } from '@/types/approval-flow'
</script>
```

### 2. 准备数据

```typescript
const records = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-1',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-15 09:30:00'),
    approvalResult: 'approved',
    approvalComment: '同意。'
  }
])
```

### 3. 使用组件

```vue
<template>
  <ApprovalRecordTimeline :records="records" />
</template>
```

## 常用场景

### 场景1: 详情页展示审批记录

```vue
<template>
  <el-card>
    <ApprovalRecordTimeline
      :records="approvalRecords"
      :reverse-order="true"
    />
  </el-card>
</template>
```

### 场景2: 突出显示当前节点

```vue
<template>
  <ApprovalRecordTimeline
    :records="records"
    current-node-id="node-3"
  />
</template>
```

### 场景3: 紧凑展示（默认折叠）

```vue
<template>
  <ApprovalRecordTimeline
    :records="records"
    :default-expanded="false"
    :show-expand-button="true"
  />
</template>
```

## 数据格式

### 最小数据

```typescript
{
  nodeId: 'node-1',
  nodeName: '部门主管审批',
  approver: '张三',
  approvalTime: new Date(),
  approvalResult: 'approved'
}
```

### 完整数据

```typescript
{
  nodeId: 'node-1',
  nodeName: '部门主管审批',
  approver: '张三',
  approvalTime: new Date(),
  approvalResult: 'rejected',
  approvalComment: '审批意见',
  rejectReason: '驳回原因',
  attachments: ['文件1.pdf', '文件2.docx'],
  ccUsers: ['抄送人A', '抄送人B']
}
```

## 审批结果类型

| 值 | 说明 | 图标颜色 |
|------|------|----------|
| `approved` | 已通过 | 绿色 |
| `rejected` | 已驳回 | 红色 |
| `pending` | 待审批 | 灰色 |

## Props 快速参考

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `records` | `ApprovalRecord[]` | `[]` | 审批记录列表 |
| `currentNodeId` | `string` | - | 当前节点ID |
| `reverseOrder` | `boolean` | `false` | 是否倒序（最新在前） |
| `defaultExpanded` | `boolean` | `true` | 默认是否展开 |
| `showHeader` | `boolean` | `true` | 是否显示头部 |
| `showExpandButton` | `boolean` | `true` | 是否显示展开按钮 |
| `title` | `string` | `'审批记录'` | 标题 |

## 常见配置

### 最新记录在前

```vue
<ApprovalRecordTimeline :records="records" :reverse-order="true" />
```

### 自定义标题

```vue
<ApprovalRecordTimeline :records="records" title="请假审批记录" />
```

### 隐藏头部

```vue
<ApprovalRecordTimeline :records="records" :show-header="false" />
```

### 全部展开（无展开按钮）

```vue
<ApprovalRecordTimeline :records="records" :show-expand-button="false" />
```

### 全部折叠

```vue
<ApprovalRecordTimeline :records="records" :default-expanded="false" />
```

## 事件处理

### 附件关闭

```vue
<ApprovalRecordTimeline
  :records="records"
  @attachment-close="handleAttachmentClose"
/>

<script setup>
const handleAttachmentClose = (attachment, recordIndex) => {
  console.log('关闭附件:', attachment)
}
</script>
```

## 样式调整

### 修改背景色

```css
.approval-record-timeline {
  background-color: #f5f7fa;
}
```

### 修改时间线颜色

```css
:deep(.el-timeline-item__dot) {
  background-color: #409eff;
}
```

## 完整示例

```vue
<template>
  <el-card>
    <template #header>
      <span>请假审批记录</span>
    </template>
    <ApprovalRecordTimeline
      :records="records"
      current-node-id="node-3"
      :reverse-order="true"
      title="审批流程"
      @attachment-close="handleAttachmentClose"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ApprovalRecordTimeline from '@/components/ApprovalRecordTimeline.vue'
import type { ApprovalRecord } from '@/types/approval-flow'

const records = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-1',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-15 09:30:00'),
    approvalResult: 'approved',
    approvalComment: '同意请假申请。',
    attachments: ['请假申请表.pdf']
  },
  {
    nodeId: 'node-2',
    nodeName: '人事审批',
    approver: '李四',
    approvalTime: new Date('2024-01-15 14:20:00'),
    approvalResult: 'approved',
    approvalComment: '符合公司请假制度。',
    ccUsers: ['王五']
  },
  {
    nodeId: 'node-3',
    nodeName: '总经理审批',
    approver: '王五',
    approvalTime: new Date(),
    approvalResult: 'pending'
  }
])

const handleAttachmentClose = (attachment: string) => {
  ElMessage.info(`关闭附件: ${attachment}`)
}
</script>
```

## 下一步

- 查看 [完整文档](./ApprovalRecordTimeline-README.md)
- 查看 [示例代码](./ApprovalRecordTimelineDemo.vue)
- 查看 [项目规范](../project_rules.md)

## 需要帮助?

遇到问题?请查看:
1. [完整文档](./ApprovalRecordTimeline-README.md) - 详细的 API 文档
2. [示例代码](./ApprovalRecordTimelineDemo.vue) - 完整的使用示例
3. [项目规范](../project_rules.md) - 开发规范说明
