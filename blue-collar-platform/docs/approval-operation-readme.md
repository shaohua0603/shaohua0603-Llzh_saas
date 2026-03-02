# 审批操作界面

## 简介

审批操作界面是一套完整的审批解决方案，提供审批记录展示、审批操作、转办、委派等功能，适用于各种业务场景的审批流程。

## 目录结构

```
src/
├── components/
│   ├── ApprovalRecordTimeline.vue    # 审批记录时间线组件
│   ├── ApprovalOperation.vue          # 审批操作主组件
│   └── PersonSelect.vue               # 人员选择组件（已存在）
├── api/
│   └── approvalApi.ts                 # 审批相关API
├── types/
│   └── approval-flow.ts               # 审批流程类型定义
├── views/
│   ├── labor-company/
│   │   └── LeaveApprovalDetail.vue    # 请假审批详情页面示例
│   └── common/
│       └── ApprovalOperationExample.vue # 通用审批操作示例页面
└── docs/
    ├── approval-operation-usage.md    # 组件使用说明
    └── approval-operation-summary.md  # 实现总结
```

## 快速开始

### 1. 基本使用

```vue
<template>
  <ApprovalOperation
    :business-id="businessId"
    :business-type="businessType"
    :business-data="businessData"
    :business-fields="businessFields"
    :approval-records="approvalRecords"
    :can-approve="canApprove"
    @approve="handleApprove"
    @reject="handleReject"
    @transfer="handleTransfer"
    @delegate="handleDelegate"
    @refresh="fetchBusinessDetail"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ApprovalOperation from '@/components/ApprovalOperation.vue'
import { approveApproval, rejectApproval } from '@/api/approvalApi'

const businessId = ref('123')
const businessType = ref('leave')
const businessData = ref({})
const approvalRecords = ref([])
const canApprove = computed(() => true)

const handleApprove = async (data: any) => {
  await approveApproval(data)
  // 处理成功逻辑
}

const handleReject = async (data: any) => {
  await rejectApproval(data)
  // 处理成功逻辑
}
</script>
```

### 2. 自定义业务详情

```vue
<template>
  <ApprovalOperation>
    <template #business-detail>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="业务编号">{{ businessData.no }}</el-descriptions-item>
        <el-descriptions-item label="业务类型">{{ businessData.type }}</el-descriptions-item>
        <!-- 更多字段... -->
      </el-descriptions>
    </template>
  </ApprovalOperation>
</template>
```

## 核心功能

### 1. 审批记录时间线（ApprovalRecordTimeline）

展示审批记录的时间线视图，支持多种审批结果类型。

**特性**:
- 支持多种审批结果（通过、驳回、待审批、转办、委派）
- 支持节点类型区分（审批节点、抄送节点）
- 支持审批意见和附件展示
- 支持转办和委派操作记录
- 响应式设计

### 2. 审批操作（ApprovalOperation）

完整的审批操作界面，包含业务详情、审批记录、审批表单等。

**特性**:
- 业务详情展示（支持自定义）
- 审批记录时间线展示
- 审批操作表单（通过/驳回）
- 转办功能
- 委派功能
- 附件上传
- 审批历史查看

### 3. 审批API（approvalApi）

提供完整的审批相关API接口。

**接口**:
- `approveApproval` - 审批通过
- `rejectApproval` - 审批驳回
- `transferApproval` - 审批转办
- `delegateApproval` - 审批委派
- `getApprovalRecords` - 获取审批记录
- `getApprovalStatus` - 获取审批状态
- `getApprovalHistory` - 获取审批历史
- `withdrawApproval` - 撤回审批
- `getPendingApprovalList` - 获取待审批列表
- `getApprovedApprovalList` - 获取已审批列表
- `batchApprove` - 批量审批
- `batchReject` - 批量驳回

## 组件Props

### ApprovalRecordTimeline

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| records | 审批记录列表 | `ApprovalRecord[]` | `[]` |

### ApprovalOperation

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| businessId | 业务ID | `string` | - |
| businessType | 业务类型 | `string` | - |
| businessData | 业务数据 | `any` | `{}` |
| businessFields | 业务字段配置 | `BusinessField[]` | `[]` |
| approvalRecords | 审批记录 | `ApprovalRecord[]` | `[]` |
| showBusinessDetail | 是否显示业务详情 | `boolean` | `true` |
| canApprove | 是否可以审批 | `boolean` | `true` |
| showViewHistory | 是否显示查看历史按钮 | `boolean` | `true` |
| showTransferButton | 是否显示转办按钮 | `boolean` | `true` |
| showDelegateButton | 是否显示委派按钮 | `boolean` | `true` |
| userSource | 用户来源 | `'worker' \| 'employee' \| 'all'` | `'employee'` |
| loading | 是否加载中 | `boolean` | `false` |

## 组件Events

### ApprovalRecordTimeline

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| attachment-download | 附件下载 | `attachment: any` |

### ApprovalOperation

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| approve | 审批通过 | `data: any` |
| reject | 审批驳回 | `data: any` |
| transfer | 审批转办 | `data: any` |
| delegate | 审批委派 | `data: any` |
| view-history | 查看历史 | - |
| view-business-detail | 查看业务详情 | - |
| attachment-download | 附件下载 | `attachment: any` |
| refresh | 刷新数据 | - |

## 组件Slots

### ApprovalOperation

| 插槽名 | 说明 |
|--------|------|
| business-detail | 自定义业务详情内容 |
| field-{field} | 自定义字段渲染 |

## 类型定义

### ApprovalRecord

```typescript
interface ApprovalRecord {
  nodeId: string
  nodeName: string
  nodeType?: 'approval' | 'cc'
  approver: string
  approvalTime: Date
  approvalResult: 'approved' | 'rejected' | 'pending' | 'transferred' | 'delegated'
  approvalComment?: string
  attachments?: any[]
  operationType?: 'transfer' | 'delegate'
  operationTarget?: string
}
```

### BusinessField

```typescript
interface BusinessField {
  field: string
  label: string
  span?: number
  type?: 'text' | 'date' | 'datetime' | 'number' | 'enum'
  formatter?: (value: any, data: any) => string
  options?: Array<{ label: string; value: any; color?: string }>
}
```

## 示例页面

### 1. 请假审批详情页面

路径: `src/views/labor-company/LeaveApprovalDetail.vue`

展示如何使用ApprovalOperation组件实现请假审批功能。

### 2. 通用审批操作示例页面

路径: `src/views/common/ApprovalOperationExample.vue`

展示如何使用ApprovalOperation组件实现通用审批功能。

## 文档

- [组件使用说明](./approval-operation-usage.md) - 详细的组件使用文档
- [实现总结](./approval-operation-summary.md) - 功能实现总结

## 特性

- ✅ 完整的审批操作流程
- ✅ 审批记录时间线展示
- ✅ 支持转办和委派
- ✅ 附件上传和下载
- ✅ 表单验证
- ✅ 响应式设计
- ✅ 中文友好
- ✅ 可自定义业务详情
- ✅ 可自定义字段渲染
- ✅ 遵循项目规范

## 技术栈

- Vue 3 + TypeScript
- Element Plus
- Vite

## 注意事项

1. **表单验证**: 驳回时必须填写驳回原因，组件已内置验证规则
2. **附件上传**: 支持最多上传5个文件，单个文件不超过10MB
3. **权限控制**: 根据业务状态动态控制审批按钮的显示
4. **响应式设计**: 组件已适配移动端，在小屏幕上会自动调整布局
5. **中文友好**: 所有界面元素均为中文，符合中国用户使用习惯

## 后续优化

- [ ] 性能优化（虚拟滚动、懒加载）
- [ ] 功能增强（批量审批、审批模板、审批统计）
- [ ] 用户体验（审批进度条、动画效果、快捷键）
- [ ] 测试完善（单元测试、集成测试、E2E测试）

## 许可证

MIT
