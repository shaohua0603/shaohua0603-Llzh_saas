# 审批流程执行引擎使用指南

## 概述

审批流程执行引擎是蓝领智汇平台的核心组件,负责处理审批流程的初始化、流转、完成和异常处理。本文档提供了详细的使用指南和示例。

## 核心功能

### 1. 流程初始化

当业务数据提交时,引擎会自动初始化审批流程:

```typescript
import ApprovalExecutionEngine from '@/services/approvalExecutionEngine'

const engine = ApprovalExecutionEngine.getInstance()

// 提交审批
const result = await engine.submitApproval({
  businessCode: 'LEAVE',           // 业务代码
  businessId: 123,                  // 业务数据ID
  submitterId: 1,                   // 提交人ID
  submitterName: '张三'            // 提交人姓名
})

console.log('审批ID:', result.approvalId)
console.log('当前节点:', result.currentNode)
```

### 2. 节点流转

#### 2.1 审批通过

```typescript
// 审批通过
const result = await engine.approve({
  businessCode: 'LEAVE',
  businessId: 123,
  nodeId: 1,                        // 当前节点ID
  approverId: 2,                    // 审批人ID
  approverName: '李四',             // 审批人姓名
  approvalComment: '同意'           // 审批意见
})

console.log('是否完成:', result.isCompleted)
console.log('审批状态:', result.approvalStatus)
```

#### 2.2 审批驳回

```typescript
// 审批驳回
const result = await engine.reject({
  businessCode: 'LEAVE',
  businessId: 123,
  nodeId: 1,
  approverId: 2,
  approverName: '李四',
  approvalComment: '不同意',
  rejectReason: '请假理由不充分'     // 驳回原因
})

console.log('是否完成:', result.isCompleted)
```

#### 2.3 审批转交

```typescript
// 审批转交
const result = await engine.transfer({
  businessCode: 'LEAVE',
  businessId: 123,
  nodeId: 1,
  approverId: 2,
  approverName: '李四',
  transferToId: 3,                  // 转交给谁
  transferToName: '王五',           // 转交给谁
  approvalComment: '转交给王五处理'
})
```

#### 2.4 审批委派

```typescript
// 审批委派
const result = await engine.delegate({
  businessCode: 'LEAVE',
  businessId: 123,
  nodeId: 1,
  approverId: 2,
  approverName: '李四',
  delegateToId: 3,                 // 委派给谁
  delegateToName: '王五',          // 委派给谁
  approvalComment: '委派给王五处理'
})
```

### 3. 流程完成

当所有节点审批通过后,引擎会自动完成审批流程:

```typescript
// 流程完成由引擎自动处理,无需手动调用
// 引擎会执行以下操作:
// 1. 更新审批状态为已通过
// 2. 记录完成时间
// 3. 发送消息通知给申请人
// 4. 更新业务数据状态
// 5. 删除所有待办任务
```

### 4. 异常处理

#### 4.1 处理审批人离职

```typescript
// 当审批人离职时,自动转交待办任务
await engine.handleApproverResignation(userId)

// 引擎会执行以下操作:
// 1. 查找该用户的所有待办任务
// 2. 转交待办任务给上级或备用审批人
// 3. 发送通知给新的审批人
```

#### 4.2 处理审批超时

```typescript
// 处理审批超时任务
await engine.handleApprovalTimeout(taskId)

// 引擎会根据节点配置的超时处理方式执行:
// - APPROVE: 自动通过
// - REJECT: 自动驳回
// - REMIND: 发送提醒
```

#### 4.3 处理流程配置错误

```typescript
// 处理流程配置错误
await engine.handleFlowConfigError(flowId)

// 引擎会执行以下操作:
// 1. 暂停所有使用该流程的审批
// 2. 发送错误通知给管理员
// 3. 记录错误日志
```

#### 4.4 处理并发审批冲突

```typescript
// 处理并发审批冲突
await engine.handleConcurrentApproval(request)

// 引擎会执行以下操作:
// 1. 使用乐观锁检查版本号
// 2. 检查是否已被其他审批人处理
// 3. 使用事务保证数据一致性
```

### 5. 流程状态管理

#### 5.1 撤回审批

```typescript
// 撤回审批
await engine.withdrawApproval(approvalId, {
  userId: 1,                        // 申请人ID
  userName: '张三',                 // 申请人姓名
  cancelReason: '需要修改申请'      // 撤回原因
})

// 引擎会执行以下操作:
// 1. 验证申请人权限
// 2. 更新审批状态为已撤回
// 3. 删除所有待办任务
// 4. 发送撤回通知
```

## API接口使用

### 提交审批

```typescript
import { submitApproval } from '@/api/approvalExecutionApiImpl'

const result = await submitApproval({
  businessCode: 'LEAVE',
  businessId: 123,
  submitterId: 1,
  submitterName: '张三'
})
```

### 审批操作

```typescript
import {
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval
} from '@/api/approvalExecutionApiImpl'

// 审批通过
await approveApproval(approvalId, {
  businessCode: 'LEAVE',
  businessId: 123,
  nodeId: 1,
  approverId: 2,
  approverName: '李四',
  approvalComment: '同意'
})

// 审批驳回
await rejectApproval(approvalId, {
  businessCode: 'LEAVE',
  businessId: 123,
  nodeId: 1,
  approverId: 2,
  approverName: '李四',
  approvalComment: '不同意',
  rejectReason: '请假理由不充分'
})

// 审批转交
await transferApproval(approvalId, {
  businessCode: 'LEAVE',
  businessId: 123,
  nodeId: 1,
  approverId: 2,
  approverName: '李四',
  transferToId: 3,
  transferToName: '王五'
})

// 审批委派
await delegateApproval(approvalId, {
  businessCode: 'LEAVE',
  businessId: 123,
  nodeId: 1,
  approverId: 2,
  approverName: '李四',
  delegateToId: 3,
  delegateToName: '王五'
})
```

### 查询审批状态

```typescript
import { getApprovalStatus } from '@/api/approvalExecutionApiImpl'

// 查询审批状态
const status = await getApprovalStatus(businessId, 'LEAVE')
console.log('审批状态:', status.approvalStatus)
console.log('当前节点:', status.currentNodeName)
```

### 查询审批记录

```typescript
import { getApprovalRecords } from '@/api/approvalExecutionApiImpl'

// 查询审批记录
const records = await getApprovalRecords(businessId, 'LEAVE')
records.forEach(record => {
  console.log('节点:', record.nodeName)
  console.log('审批人:', record.approverName)
  console.log('审批结果:', record.approvalResult)
  console.log('审批时间:', record.approvalTime)
})
```

### 撤回审批

```typescript
import { withdrawApproval } from '@/api/approvalExecutionApiImpl'

// 撤回审批
await withdrawApproval(approvalId, {
  userId: 1,
  userName: '张三',
  cancelReason: '需要修改申请'
})
```

### 批量审批

```typescript
import { batchApprove, batchReject } from '@/api/approvalExecutionApiImpl'

// 批量审批通过
const result1 = await batchApprove({
  approvalIds: [1, 2, 3],
  approvalComment: '批量通过'
})

// 批量审批驳回
const result2 = await batchReject({
  approvalIds: [4, 5, 6],
  approvalComment: '批量驳回'
})

console.log('成功数量:', result1.data.successCount)
console.log('失败数量:', result1.data.failureCount)
```

## 业务集成示例

### 请假管理集成

```typescript
// 在请假申请提交时触发审批流程
async function submitLeaveApplication(leaveData: any) {
  // 1. 保存请假申请
  const savedLeave = await saveLeaveApplication(leaveData)

  // 2. 提交审批
  const approvalResult = await submitApproval({
    businessCode: 'LEAVE',
    businessId: savedLeave.id,
    submitterId: leaveData.userId,
    submitterName: leaveData.userName
  })

  // 3. 更新请假申请的审批ID
  await updateLeaveApprovalId(savedLeave.id, approvalResult.data.approvalId)

  return savedLeave
}

// 在审批通过后更新请假状态
async function handleLeaveApprovalComplete(approvalId: number) {
  // 1. 获取审批详情
  const approval = await getApprovalDetail(approvalId)

  // 2. 更新请假状态为已通过
  await updateLeaveStatus(approval.data.businessId, 'APPROVED')

  // 3. 发送通知给申请人
  await sendNotification(approval.data.submitterId, '您的请假申请已通过')
}
```

### 调岗管理集成

```typescript
// 在调岗申请提交时触发审批流程
async function submitTransferApplication(transferData: any) {
  // 1. 保存调岗申请
  const savedTransfer = await saveTransferApplication(transferData)

  // 2. 提交审批
  const approvalResult = await submitApproval({
    businessCode: 'TRANSFER',
    businessId: savedTransfer.id,
    submitterId: transferData.userId,
    submitterName: transferData.userName
  })

  // 3. 更新调岗申请的审批ID
  await updateTransferApprovalId(savedTransfer.id, approvalResult.data.approvalId)

  return savedTransfer
}
```

### 离职管理集成

```typescript
// 在离职申请提交时触发审批流程
async function submitResignationApplication(resignationData: any) {
  // 1. 保存离职申请
  const savedResignation = await saveResignationApplication(resignationData)

  // 2. 提交审批
  const approvalResult = await submitApproval({
    businessCode: 'RESIGNATION',
    businessId: savedResignation.id,
    submitterId: resignationData.userId,
    submitterName: resignationData.userName
  })

  // 3. 更新离职申请的审批ID
  await updateResignationApprovalId(savedTransfer.id, approvalResult.data.approvalId)

  return savedResignation
}
```

## 错误处理

### 基本错误处理

```typescript
try {
  const result = await engine.submitApproval(request)
  console.log('审批提交成功:', result)
} catch (error) {
  console.error('审批提交失败:', error)

  // 根据错误类型进行不同处理
  if (error.message === '未找到流程配置') {
    // 处理流程配置不存在的情况
    console.error('请先配置审批流程')
  } else if (error.message === '流程中没有审批节点') {
    // 处理流程中没有审批节点的情况
    console.error('请检查流程配置')
  } else {
    // 处理其他错误
    console.error('未知错误:', error)
  }
}
```

### 权限验证错误处理

```typescript
try {
  const result = await engine.approve(request)
} catch (error) {
  if (error.message === '无审批权限') {
    // 处理权限验证失败的情况
    console.error('您没有权限进行此操作')
    // 可以提示用户联系管理员
  }
}
```

### 并发冲突错误处理

```typescript
try {
  const result = await engine.approve(request)
} catch (error) {
  if (error.message === '该节点已被其他审批人处理') {
    // 处理并发冲突的情况
    console.error('该审批任务已被其他审批人处理')
    // 可以提示用户刷新页面查看最新状态
  }
}
```

## 最佳实践

### 1. 使用单例模式

```typescript
// 始终使用单例实例
const engine = ApprovalExecutionEngine.getInstance()
```

### 2. 异步操作使用try-catch

```typescript
try {
  const result = await engine.submitApproval(request)
} catch (error) {
  console.error('操作失败:', error)
  // 处理错误
}
```

### 3. 事务处理

```typescript
// 引擎内部使用事务保证数据一致性
// 在业务代码中不需要额外处理事务
```

### 4. 日志记录

```typescript
// 引擎内部会记录详细的日志
// 可以通过日志追踪审批流程的执行情况
```

### 5. 消息通知

```typescript
// 引擎会自动发送消息通知
// 包括审批通知、驳回通知、转交通知等
```

## 总结

审批流程执行引擎提供了完整的审批流程管理功能,包括:

1. **流程初始化**: 自动创建审批状态和待办任务
2. **节点流转**: 支持审批通过、驳回、转交、委派等操作
3. **流程完成**: 自动完成审批流程并更新业务数据
4. **异常处理**: 处理审批人离职、审批超时、配置错误等异常情况
5. **状态管理**: 支持撤回审批等状态管理操作

通过使用审批流程执行引擎,可以简化审批流程的开发,提高系统的可维护性和可扩展性。
