# ApprovalRecordTimeline 审批记录时间线组件

## 组件简介

ApprovalRecordTimeline 是一个用于展示审批流程记录的时间线组件,以直观的时间线形式展示审批过程中的所有节点记录,包括审批人、审批时间、审批结果、审批意见、驳回原因、附件和抄送信息等。

## 功能特性

### 核心功能
- ✅ 时间线形式展示审批记录
- ✅ 支持三种审批状态:待审批、已通过、已驳回
- ✅ 显示审批人、审批时间、审批结果
- ✅ 支持展开/折叠查看详细信息
- ✅ 支持显示抄送记录
- ✅ 支持显示驳回原因
- ✅ 支持附件展示
- ✅ 当前节点高亮显示
- ✅ 支持正序/倒序排列
- ✅ 响应式设计,适配移动端

### 状态标识
- 🟢 **已通过**: 绿色图标 + 绿色标签
- 🔴 **已驳回**: 红色图标 + 红色标签
- ⚪ **待审批**: 灰色时钟图标 + 灰色标签
- 🔵 **抄送**: 蓝色标签

## 组件 Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| records | 审批记录列表 | `ApprovalRecord[]` | `[]` | 否 |
| currentNodeId | 当前节点ID | `string` | - | 否 |
| showHeader | 是否显示头部 | `boolean` | `true` | 否 |
| showExpandAll | 是否显示展开全部按钮 | `boolean` | `true` | 否 |
| showExpandButton | 是否显示展开按钮 | `boolean` | `true` | 否 |
| title | 标题 | `string` | `'审批记录'` | 否 |
| defaultExpanded | 默认是否展开 | `boolean` | `true` | 否 |
| reverseOrder | 是否按时间倒序排列 | `boolean` | `false` | 否 |

## 组件 Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| attachment-close | 附件关闭事件 | `(attachment: string, recordIndex: number)` |
| record-click | 记录点击事件 | `(record: ApprovalRecord, index: number)` |

## ApprovalRecord 类型定义

```typescript
interface ApprovalRecord {
  /** 节点ID */
  nodeId: string
  /** 节点名称 */
  nodeName: string
  /** 审批人 */
  approver: string
  /** 审批时间 */
  approvalTime: Date
  /** 审批结果 */
  approvalResult: 'approved' | 'rejected' | 'pending'
  /** 审批意见 */
  approvalComment?: string
  /** 驳回原因 */
  rejectReason?: string
  /** 附件列表 */
  attachments?: string[]
  /** 抄送用户列表 */
  ccUsers?: string[]
}
```

## 使用示例

### 基础用法

```vue
<template>
  <ApprovalRecordTimeline :records="records" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApprovalRecordTimeline from '@/components/ApprovalRecordTimeline.vue'
import type { ApprovalRecord } from '@/types/approval-flow'

const records = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-1',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-15 09:30:00'),
    approvalResult: 'approved',
    approvalComment: '同意请假申请。'
  },
  {
    nodeId: 'node-2',
    nodeName: '人事审批',
    approver: '李四',
    approvalTime: new Date('2024-01-15 14:20:00'),
    approvalResult: 'approved',
    approvalComment: '符合公司请假制度。'
  }
])
</script>
```

### 倒序排列（最新记录在前）

```vue
<template>
  <ApprovalRecordTimeline :records="records" :reverse-order="true" />
</template>
```

### 当前节点高亮

```vue
<template>
  <ApprovalRecordTimeline
    :records="records"
    current-node-id="node-3"
  />
</template>
```

### 自定义标题

```vue
<template>
  <ApprovalRecordTimeline
    :records="records"
    title="请假审批记录"
  />
</template>
```

### 隐藏展开按钮（全部展开）

```vue
<template>
  <ApprovalRecordTimeline
    :records="records"
    :show-expand-button="false"
  />
</template>
```

### 默认折叠

```vue
<template>
  <ApprovalRecordTimeline
    :records="records"
    :default-expanded="false"
  />
</template>
```

### 完整示例（包含驳回、附件、抄送）

```vue
<template>
  <ApprovalRecordTimeline
    :records="records"
    current-node-id="node-4"
    :reverse-order="true"
    @attachment-close="handleAttachmentClose"
  />
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
    approvalResult: 'rejected',
    approvalComment: '工作交接未完成,请完善后再提交。',
    rejectReason: '工作交接文档不完整,缺少项目交接说明。',
    ccUsers: ['赵六', '孙七']
  },
  {
    nodeId: 'node-2',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-16 10:00:00'),
    approvalResult: 'approved',
    approvalComment: '工作交接已完成,同意请假。',
    attachments: ['工作交接文档.docx', '请假申请表.pdf'],
    ccUsers: ['赵六']
  },
  {
    nodeId: 'node-3',
    nodeName: '人事审批',
    approver: '李四',
    approvalTime: new Date('2024-01-16 15:30:00'),
    approvalResult: 'approved',
    approvalComment: '符合公司请假制度,批准。',
    attachments: ['请假审批单.pdf']
  },
  {
    nodeId: 'node-4',
    nodeName: '总经理审批',
    approver: '王五',
    approvalTime: new Date(),
    approvalResult: 'pending'
  }
])

const handleAttachmentClose = (attachment: string, recordIndex: number) => {
  ElMessage.info(`关闭附件: ${attachment}`)
}
</script>
```

## 在详情页面中使用

```vue
<template>
  <el-card>
    <template #header>
      <span>审批记录</span>
    </template>
    <ApprovalRecordTimeline
      :records="approvalRecords"
      :current-node-id="currentNodeId"
      :reverse-order="true"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getApprovalRecords } from '@/api/approval'
import ApprovalRecordTimeline from '@/components/ApprovalRecordTimeline.vue'
import type { ApprovalRecord } from '@/types/approval-flow'

const approvalRecords = ref<ApprovalRecord[]>([])
const currentNodeId = ref<string>('')

// 获取审批记录
const fetchApprovalRecords = async (businessId: string) => {
  try {
    const response = await getApprovalRecords(businessId)
    approvalRecords.value = response.records
    currentNodeId.value = response.currentNodeId
  } catch (error) {
    console.error('获取审批记录失败:', error)
  }
}

onMounted(() => {
  fetchApprovalRecords('business-123')
})
</script>
```

## 样式定制

组件使用了 scoped 样式,如需自定义样式,可以通过以下方式:

### 1. 使用全局样式覆盖

```css
/* 覆盖时间线头部样式 */
.approval-record-timeline .timeline-header {
  border-bottom: 2px solid #409eff;
}

/* 覆盖记录详情样式 */
.approval-record-timeline .record-details {
  background-color: #fafafa;
}
```

### 2. 使用深度选择器

```vue
<style scoped>
:deep(.approval-record-timeline .record-details) {
  background-color: #fafafa;
}
</style>
```

## 响应式设计

组件内置了响应式设计,在不同屏幕尺寸下会自动调整布局:

- **桌面端 (> 768px)**: 横向布局,信息在一行显示
- **移动端 (≤ 768px)**: 纵向布局,信息分多行显示

## 注意事项

1. **日期格式**: `approvalTime` 必须是 `Date` 类型,组件内部会自动格式化
2. **审批结果**: `approvalResult` 必须是 `'approved' | 'rejected' | 'pending'` 之一
3. **空状态**: 当 `records` 为空时,会显示空状态提示
4. **附件关闭**: 附件标签支持关闭操作,会触发 `attachment-close` 事件
5. **性能优化**: 对于大量记录,建议使用 `reverseOrder` 设置为 `true` 以最新记录在前

## 常见问题

### Q: 如何隐藏头部?

A: 设置 `showHeader` 为 `false`:

```vue
<ApprovalRecordTimeline :records="records" :show-header="false" />
```

### Q: 如何让所有记录默认折叠?

A: 设置 `defaultExpanded` 为 `false`:

```vue
<ApprovalRecordTimeline :records="records" :default-expanded="false" />
```

### Q: 如何监听记录点击事件?

A: 使用 `@record-click` 事件:

```vue
<ApprovalRecordTimeline
  :records="records"
  @record-click="handleRecordClick"
/>

<script setup>
const handleRecordClick = (record, index) => {
  console.log('点击记录:', record, index)
}
</script>
```

### Q: 如何自定义时间线颜色?

A: 可以通过 CSS 覆盖:

```css
:deep(.el-timeline-item__dot) {
  background-color: #custom-color;
}
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- Element Plus Timeline 组件

## 更新日志

### v1.0.0 (2024-01-15)
- ✨ 初始版本发布
- ✨ 支持基础时间线展示
- ✨ 支持审批状态标识
- ✨ 支持展开/折叠
- ✨ 支持附件和抄送
- ✨ 支持驳回原因展示
- ✨ 支持响应式设计

## 组件文件位置

```
src/
├── components/
│   ├── ApprovalRecordTimeline.vue          # 主组件
│   └── ApprovalRecordTimelineDemo.vue      # 示例组件
└── types/
    └── approval-flow.ts                    # 类型定义
```

## 相关文档

- [Element Plus Timeline 组件](https://element-plus.org/zh-CN/component/timeline.html)
- [审批流程组件](./ApprovalFlow.md)
- [项目开发规范](./project_rules.md)
