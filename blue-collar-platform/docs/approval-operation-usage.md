# 审批操作界面组件使用说明

## 组件概述

审批操作界面组件提供了一套完整的审批操作解决方案，包括审批记录时间线展示、审批操作表单、转办和委派功能等。

## 组件列表

### 1. ApprovalRecordTimeline.vue - 审批记录时间线组件

用于展示审批记录的时间线视图。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| records | 审批记录列表 | `ApprovalRecord[]` | `[]` |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| attachment-download | 附件下载 | `attachment: any` |

#### 使用示例

```vue
<template>
  <ApprovalRecordTimeline
    :records="approvalRecords"
    @attachment-download="handleDownload"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApprovalRecordTimeline from '@/components/ApprovalRecordTimeline.vue'
import type { ApprovalRecord } from '@/types/approval-flow'

const approvalRecords = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-001',
    nodeName: '部门主管审批',
    nodeType: 'approval',
    approver: '张主管',
    approvalTime: new Date(),
    approvalResult: 'approved',
    approvalComment: '同意'
  }
])

const handleDownload = (attachment: any) => {
  console.log('下载附件:', attachment)
}
</script>
```

---

### 2. ApprovalOperation.vue - 审批操作主组件

完整的审批操作界面组件，包含业务详情展示、审批记录时间线、审批操作表单等。

#### Props

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

#### Events

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

#### Slots

| 插槽名 | 说明 |
|--------|------|
| business-detail | 自定义业务详情内容 |
| field-{field} | 自定义字段渲染 |

#### 使用示例

```vue
<template>
  <ApprovalOperation
    :business-id="businessId"
    :business-type="businessType"
    :business-data="businessData"
    :business-fields="businessFields"
    :approval-records="approvalRecords"
    :can-approve="canApprove"
    :loading="loading"
    @approve="handleApprove"
    @reject="handleReject"
    @transfer="handleTransfer"
    @delegate="handleDelegate"
    @refresh="fetchBusinessDetail"
  >
    <!-- 自定义业务详情 -->
    <template #business-detail>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="业务编号">{{ businessData.no }}</el-descriptions-item>
        <el-descriptions-item label="业务类型">{{ businessData.type }}</el-descriptions-item>
        <!-- 更多字段... -->
      </el-descriptions>
    </template>

    <!-- 自定义字段渲染 -->
    <template #field-type="{ value }">
      <el-tag :type="getTypeTag(value)">
        {{ getTypeText(value) }}
      </el-tag>
    </template>
  </ApprovalOperation>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ApprovalOperation from '@/components/ApprovalOperation.vue'
import type { ApprovalRecord } from '@/types/approval-flow'

const businessId = ref('123')
const businessType = ref('leave')
const loading = ref(false)

const businessData = ref({
  no: 'BZ001',
  type: 'leave',
  status: 'pending'
})

const businessFields = ref([
  { field: 'no', label: '业务编号' },
  { field: 'type', label: '业务类型', type: 'enum' },
  { field: 'status', label: '状态', type: 'enum' }
])

const approvalRecords = ref<ApprovalRecord[]>([])

const canApprove = computed(() => {
  return businessData.value.status === 'pending'
})

const handleApprove = async (data: any) => {
  // 调用API审批通过
  console.log('审批通过:', data)
}

const handleReject = async (data: any) => {
  // 调用API审批驳回
  console.log('审批驳回:', data)
}

const handleTransfer = async (data: any) => {
  // 调用API转办
  console.log('转办:', data)
}

const handleDelegate = async (data: any) => {
  // 调用API委派
  console.log('委派:', data)
}

const fetchBusinessDetail = async () => {
  // 获取业务详情
}
</script>
```

---

## API 使用

### 审批相关API

```typescript
import {
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval,
  getApprovalRecords,
  getApprovalStatus,
  getApprovalHistory
} from '@/api/approvalApi'

// 审批通过
await approveApproval({
  businessId: '123',
  businessType: 'leave',
  result: 'approved',
  comment: '同意',
  attachments: [file1, file2]
})

// 审批驳回
await rejectApproval({
  businessId: '123',
  businessType: 'leave',
  result: 'rejected',
  comment: '不同意',
  rejectReason: '请假时间不合理',
  attachments: []
})

// 审批转办
await transferApproval({
  businessId: '123',
  businessType: 'leave',
  toUser: 'user-001',
  remark: '转交给李四处理'
})

// 审批委派
await delegateApproval({
  businessId: '123',
  businessType: 'leave',
  toUser: 'user-002',
  remark: '委派给王五处理'
})

// 获取审批记录
const records = await getApprovalRecords({
  businessId: '123',
  businessType: 'leave'
})

// 获取审批状态
const status = await getApprovalStatus({
  businessId: '123',
  businessType: 'leave'
})

// 获取审批历史
const history = await getApprovalHistory({
  businessId: '123',
  businessType: 'leave'
})
```

---

## 类型定义

### ApprovalRecord

```typescript
interface ApprovalRecord {
  /** 节点ID */
  nodeId: string
  /** 节点名称 */
  nodeName: string
  /** 节点类型 */
  nodeType?: 'approval' | 'cc'
  /** 审批人 */
  approver: string
  /** 审批时间 */
  approvalTime: Date
  /** 审批结果 */
  approvalResult: 'approved' | 'rejected' | 'pending' | 'transferred' | 'delegated'
  /** 审批意见 */
  approvalComment?: string
  /** 附件列表 */
  attachments?: any[]
  /** 操作类型 */
  operationType?: 'transfer' | 'delegate'
  /** 操作目标 */
  operationTarget?: string
}
```

### BusinessField

```typescript
interface BusinessField {
  /** 字段名 */
  field: string
  /** 字段标签 */
  label: string
  /** 跨列数 */
  span?: number
  /** 字段类型 */
  type?: 'text' | 'date' | 'datetime' | 'number' | 'enum'
  /** 格式化函数 */
  formatter?: (value: any, data: any) => string
  /** 枚举选项（当type为enum时使用） */
  options?: Array<{ label: string; value: any; color?: string }>
}
```

---

## 完整示例

### 请假审批详情页面

```vue
<template>
  <div class="leave-approval-detail">
    <ApprovalOperation
      :business-id="businessId"
      :business-type="businessType"
      :business-data="leaveData"
      :business-fields="businessFields"
      :approval-records="approvalRecords"
      :can-approve="canApprove"
      :loading="loading"
      @approve="handleApprove"
      @reject="handleReject"
      @transfer="handleTransfer"
      @delegate="handleDelegate"
      @refresh="fetchLeaveDetail"
    >
      <template #business-detail>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="请假编号">{{ leaveData.leaveNo }}</el-descriptions-item>
          <el-descriptions-item label="请假类型">
            <el-tag :type="getLeaveTypeTag(leaveData.leaveType)">
              {{ getLeaveTypeText(leaveData.leaveType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请人">{{ leaveData.applicant }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ leaveData.department }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ leaveData.startTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ leaveData.endTime }}</el-descriptions-item>
          <el-descriptions-item label="请假天数">{{ leaveData.leaveDays }} 天</el-descriptions-item>
          <el-descriptions-item label="请假事由" :span="2">{{ leaveData.reason }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </ApprovalOperation>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import ApprovalOperation from '@/components/ApprovalOperation.vue'
import type { ApprovalRecord } from '@/types/approval-flow'
import {
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval,
  getApprovalRecords
} from '@/api/approvalApi'

const route = useRoute()
const businessId = route.params.id as string
const businessType = 'leave'

const loading = ref(false)
const leaveData = ref<any>({})
const approvalRecords = ref<ApprovalRecord[]>([])

const businessFields = ref([
  { field: 'leaveNo', label: '请假编号' },
  { field: 'leaveType', label: '请假类型', type: 'enum' },
  { field: 'applicant', label: '申请人' },
  { field: 'department', label: '所属部门' },
  { field: 'startTime', label: '开始时间', type: 'datetime' },
  { field: 'endTime', label: '结束时间', type: 'datetime' },
  { field: 'leaveDays', label: '请假天数', type: 'number' },
  { field: 'reason', label: '请假事由', span: 2 }
])

const canApprove = computed(() => {
  return leaveData.value.status === 'pending' || leaveData.value.status === 'in_progress'
})

const fetchLeaveDetail = async () => {
  loading.value = true
  try {
    // 获取请假详情
    // const response = await getLeaveDetail(businessId)
    // leaveData.value = response.data

    // 获取审批记录
    const records = await getApprovalRecords({ businessId, businessType })
    approvalRecords.value = records.data
  } catch (error) {
    ElMessage.error('获取请假详情失败')
  } finally {
    loading.value = false
  }
}

const handleApprove = async (data: any) => {
  try {
    await approveApproval(data)
    ElMessage.success('审批通过成功')
    leaveData.value.status = 'approved'
    fetchLeaveDetail()
  } catch (error) {
    ElMessage.error('审批通过失败')
  }
}

const handleReject = async (data: any) => {
  try {
    await rejectApproval(data)
    ElMessage.success('审批驳回成功')
    leaveData.value.status = 'rejected'
    fetchLeaveDetail()
  } catch (error) {
    ElMessage.error('审批驳回失败')
  }
}

const handleTransfer = async (data: any) => {
  try {
    await transferApproval(data)
    ElMessage.success('转办成功')
    fetchLeaveDetail()
  } catch (error) {
    ElMessage.error('转办失败')
  }
}

const handleDelegate = async (data: any) => {
  try {
    await delegateApproval(data)
    ElMessage.success('委派成功')
    fetchLeaveDetail()
  } catch (error) {
    ElMessage.error('委派失败')
  }
}

// 初始化
fetchLeaveDetail()
</script>
```

---

## 注意事项

1. **表单验证**：驳回时必须填写驳回原因，组件已内置验证规则
2. **附件上传**：支持最多上传5个文件，单个文件不超过10MB
3. **权限控制**：根据业务状态动态控制审批按钮的显示
4. **响应式设计**：组件已适配移动端，在小屏幕上会自动调整布局
5. **中文友好**：所有界面元素均为中文，符合中国用户使用习惯

---

## 更新日志

### v1.0.0 (2026-02-26)

- 初始版本发布
- 实现审批记录时间线组件
- 实现审批操作主组件
- 实现审批相关API
- 提供请假审批详情页面示例
- 提供通用审批操作示例页面
