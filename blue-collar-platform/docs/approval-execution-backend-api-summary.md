# 审批执行模块后端API开发总结

## 文档信息

- **文档版本**: 1.0.0
- **创建日期**: 2026-02-26
- **最后更新**: 2026-02-26
- **作者**: 后端工程师
- **模块名称**: 审批执行模块

---

## 1. 模块概述

### 1.1 模块说明

审批执行模块负责处理业务数据的审批流程执行，包括提交审批、审批操作、查询审批状态、查询审批记录、撤回审批等功能。该模块与流程配置模块配合，实现完整的审批流程管理。

### 1.2 技术栈

- **编程语言**: TypeScript
- **前端框架**: Vue 3
- **HTTP客户端**: Axios
- **Mock数据**: Mock.js
- **UI组件**: Element Plus

---

## 2. 接口列表

| 序号 | 接口名称 | HTTP方法 | 接口路径 | 功能说明 |
|------|----------|----------|----------|----------|
| 1 | 提交审批 | POST | /api/v1/approvals/submit | 业务提交时触发审批流程 |
| 2 | 审批通过 | POST | /api/v1/approvals/{approvalId}/approve | 审批人通过审批 |
| 3 | 审批驳回 | POST | /api/v1/approvals/{approvalId}/reject | 审批人驳回审批 |
| 4 | 审批转交 | POST | /api/v1/approvals/{approvalId}/transfer | 审批人转交审批 |
| 5 | 审批委派 | POST | /api/v1/approvals/{approvalId}/delegate | 审批人委派审批 |
| 6 | 查询审批状态 | GET | /api/v1/approvals/status | 查询业务的审批状态 |
| 7 | 查询审批记录 | GET | /api/v1/approvals/records | 查询业务的审批记录 |
| 8 | 撤回审批 | POST | /api/v1/approvals/{approvalId}/withdraw | 申请人撤回审批 |
| 9 | 获取我的待办审批列表 | GET | /api/v1/approvals/my-tasks | 获取当前用户的待办审批任务 |
| 10 | 获取我提交的审批列表 | GET | /api/v1/approvals/my-submissions | 获取当前用户提交的审批申请 |
| 11 | 获取审批详情 | GET | /api/v1/approvals/{approvalId} | 获取审批详情信息 |
| 12 | 批量审批 | POST | /api/v1/approvals/batch-approve | 批量审批通过 |
| 13 | 批量驳回 | POST | /api/v1/approvals/batch-reject | 批量审批驳回 |

---

## 3. 接口详细设计

### 3.1 提交审批接口

#### 3.1.1 接口信息

- **接口名称**: 提交审批
- **接口路径**: POST /api/v1/approvals/submit
- **功能说明**: 业务提交时触发审批流程

#### 3.1.2 请求参数

```typescript
interface SubmitApprovalRequest {
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
  /** 提交人ID */
  submitterId: number;
  /** 提交人姓名 */
  submitterName: string;
}
```

#### 3.1.3 响应数据

```typescript
interface SubmitApprovalResponse {
  /** 审批ID */
  approvalId: number;
  /** 当前节点名称 */
  currentNode: string;
  /** 当前节点ID */
  currentNodeId: number;
}
```

#### 3.1.4 业务逻辑

1. **参数验证**: 验证必填参数是否完整
2. **流程配置查询**: 根据业务代码查询流程配置
3. **流程验证**: 验证流程是否存在且启用
4. **创建审批状态**: 创建业务审批状态记录
5. **创建审批记录**: 创建第一个节点的审批记录
6. **创建待办任务**: 为第一个节点创建待办任务
7. **返回结果**: 返回审批ID和当前节点信息

#### 3.1.5 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 400 | 该业务已提交审批，请勿重复提交 | 业务已存在审批记录 |
| 404 | 未找到该业务的流程配置 | 流程配置不存在 |
| 400 | 选择的审批流程未启用 | 流程未启用 |
| 500 | 提交审批失败 | 服务器错误 |

---

### 3.2 审批通过接口

#### 3.2.1 接口信息

- **接口名称**: 审批通过
- **接口路径**: POST /api/v1/approvals/{approvalId}/approve
- **功能说明**: 审批人通过审批

#### 3.2.2 路径参数

```typescript
interface ApproveApprovalParams {
  /** 审批ID */
  approvalId: number;
}
```

#### 3.2.3 请求参数

```typescript
interface ApprovalActionRequest {
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
  /** 节点ID */
  nodeId: number;
  /** 审批人ID */
  approverId: number;
  /** 审批人姓名 */
  approverName: string;
  /** 审批意见 */
  approvalComment?: string;
  /** 附件ID列表 */
  attachmentIds?: string;
}
```

#### 3.2.4 响应数据

```typescript
interface ApprovalActionResponse {
  /** 下一个节点名称 */
  nextNode?: string;
  /** 下一个节点ID */
  nextNodeId?: number;
  /** 是否完成 */
  isCompleted: boolean;
  /** 审批状态 */
  approvalStatus: BusinessApprovalStatus;
}
```

#### 3.2.5 业务逻辑

1. **参数验证**: 验证必填参数是否完整
2. **权限验证**: 验证审批人是否有权限审批
3. **审批记录更新**: 更新当前审批记录为通过状态
4. **流程判断**: 判断是否还有下一个节点
5. **流程完成**: 如果是最后一个节点，完成审批流程
6. **流程继续**: 如果不是最后一个节点，创建下一节点审批记录和待办任务
7. **返回结果**: 返回下一个节点信息和审批状态

#### 3.2.6 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 404 | 审批不存在 | 审批记录不存在 |
| 404 | 审批记录不存在 | 当前节点审批记录不存在 |
| 403 | 无权限审批 | 审批人无权限 |
| 500 | 审批通过失败 | 服务器错误 |

---

### 3.3 审批驳回接口

#### 3.3.1 接口信息

- **接口名称**: 审批驳回
- **接口路径**: POST /api/v1/approvals/{approvalId}/reject
- **功能说明**: 审批人驳回审批

#### 3.3.2 路径参数

```typescript
interface RejectApprovalParams {
  /** 审批ID */
  approvalId: number;
}
```

#### 3.3.3 请求参数

```typescript
interface ApprovalActionRequest {
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
  /** 节点ID */
  nodeId: number;
  /** 审批人ID */
  approverId: number;
  /** 审批人姓名 */
  approverName: string;
  /** 审批意见 */
  approvalComment?: string;
  /** 附件ID列表 */
  attachmentIds?: string;
}
```

#### 3.3.4 响应数据

```typescript
interface ApprovalActionResponse {
  /** 下一个节点名称 */
  nextNode?: string;
  /** 下一个节点ID */
  nextNodeId?: number;
  /** 是否完成 */
  isCompleted: boolean;
  /** 审批状态 */
  approvalStatus: BusinessApprovalStatus;
}
```

#### 3.3.5 业务逻辑

1. **参数验证**: 验证必填参数是否完整
2. **权限验证**: 验证审批人是否有权限审批
3. **审批记录更新**: 更新当前审批记录为驳回状态
4. **审批状态更新**: 更新业务审批状态为已驳回
5. **待办任务取消**: 取消当前节点的待办任务
6. **返回结果**: 返回审批状态信息

#### 3.3.6 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 404 | 审批不存在 | 审批记录不存在 |
| 404 | 审批记录不存在 | 当前节点审批记录不存在 |
| 403 | 无权限审批 | 审批人无权限 |
| 500 | 审批驳回失败 | 服务器错误 |

---

### 3.4 查询审批状态接口

#### 3.4.1 接口信息

- **接口名称**: 查询审批状态
- **接口路径**: GET /api/v1/approvals/status
- **功能说明**: 查询业务的审批状态

#### 3.4.2 请求参数

```typescript
interface GetApprovalStatusParams {
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
}
```

#### 3.4.3 响应数据

```typescript
interface ApprovalStatusResponse {
  /** 审批ID */
  id: number;
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
  /** 流程ID */
  flowId: number;
  /** 流程名称 */
  flowName?: string;
  /** 当前节点ID */
  currentNodeId?: number;
  /** 当前节点名称 */
  currentNodeName?: string;
  /** 审批状态 */
  approvalStatus?: BusinessApprovalStatus;
  /** 提交人ID */
  submitterId: number;
  /** 提交人姓名 */
  submitterName?: string;
  /** 提交时间 */
  submitTime: string;
  /** 完成时间 */
  completeTime?: string;
  /** 总节点数 */
  totalNodes?: number;
  /** 当前节点顺序 */
  currentNodeOrder?: number;
  /** 驳回原因 */
  rejectReason?: string;
  /** 取消原因 */
  cancelReason?: string;
}
```

#### 3.4.4 业务逻辑

1. **参数验证**: 验证必填参数是否完整
2. **查询审批状态**: 根据业务代码和业务ID查询审批状态
3. **返回结果**: 返回审批状态信息

#### 3.4.5 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 404 | 未找到审批状态 | 审批状态不存在 |

---

### 3.5 查询审批记录接口

#### 3.5.1 接口信息

- **接口名称**: 查询审批记录
- **接口路径**: GET /api/v1/approvals/records
- **功能说明**: 查询业务的审批记录

#### 3.5.2 请求参数

```typescript
interface GetApprovalRecordsParams {
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
  /** 页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
  /** 审批结果 */
  approvalResult?: string;
  /** 审批人ID */
  approverId?: number;
}
```

#### 3.5.3 响应数据

```typescript
interface ApprovalRecordsResponse {
  /** 审批记录列表 */
  list: ApprovalRecord[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
}
```

#### 3.5.4 业务逻辑

1. **参数验证**: 验证必填参数是否完整
2. **查询审批记录**: 根据业务代码和业务ID查询审批记录
3. **筛选条件**: 根据审批结果、审批人等条件筛选
4. **分页处理**: 处理分页逻辑
5. **返回结果**: 返回审批记录列表

#### 3.5.5 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 400 | 请求参数错误 | 参数验证失败 |

---

### 3.6 撤回审批接口

#### 3.6.1 接口信息

- **接口名称**: 撤回审批
- **接口路径**: POST /api/v1/approvals/{approvalId}/withdraw
- **功能说明**: 申请人撤回审批申请

#### 3.6.2 路径参数

```typescript
interface WithdrawApprovalParams {
  /** 审批ID */
  approvalId: number;
}
```

#### 3.6.3 请求参数

```typescript
interface WithdrawApprovalRequest {
  /** 用户ID */
  userId: number;
  /** 用户姓名 */
  userName: string;
  /** 取消原因 */
  cancelReason?: string;
}
```

#### 3.6.4 响应数据

```typescript
interface WithdrawApprovalResponse {
  /** 是否成功 */
  success: boolean;
  /** 消息 */
  message: string;
}
```

#### 3.6.5 业务逻辑

1. **参数验证**: 验证必填参数是否完整
2. **权限验证**: 验证申请人权限
3. **状态验证**: 验证审批状态是否为审批中
4. **审批状态更新**: 更新审批状态为已撤回
5. **待办任务取消**: 取消当前节点的待办任务
6. **返回结果**: 返回撤回结果

#### 3.6.6 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 404 | 审批不存在 | 审批记录不存在 |
| 403 | 只有申请人才能撤回审批 | 权限不足 |
| 400 | 只有审批中的申请才能撤回 | 状态不正确 |
| 500 | 撤回审批失败 | 服务器错误 |

---

## 4. 数据模型

### 4.1 业务审批状态表 (business_approval_status)

```typescript
interface BusinessApprovalStatus {
  /** 审批状态ID */
  id: number;
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
  /** 流程ID */
  flowId: number;
  /** 流程名称 */
  flowName?: string;
  /** 当前节点ID */
  currentNodeId?: number;
  /** 当前节点名称 */
  currentNodeName?: string;
  /** 审批状态 */
  approvalStatus?: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  /** 提交人ID */
  submitterId: number;
  /** 提交人姓名 */
  submitterName?: string;
  /** 提交时间 */
  submitTime: string;
  /** 完成时间 */
  completeTime?: string;
  /** 总节点数 */
  totalNodes?: number;
  /** 当前节点顺序 */
  currentNodeOrder?: number;
  /** 驳回原因 */
  rejectReason?: string;
  /** 取消原因 */
  cancelReason?: string;
  /** 租户ID */
  tenantId?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 创建人 */
  createBy?: string;
  /** 更新人 */
  updateBy?: string;
  /** 备注 */
  remark?: string;
}
```

### 4.2 审批记录表 (approval_record)

```typescript
interface ApprovalRecord {
  /** 审批记录ID */
  id: number;
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
  /** 流程ID */
  flowId: number;
  /** 流程名称 */
  flowName?: string;
  /** 节点ID */
  nodeId: number;
  /** 节点名称 */
  nodeName: string;
  /** 审批人ID */
  approverId: number;
  /** 审批人姓名 */
  approverName?: string;
  /** 审批人部门 */
  approverDept?: string;
  /** 审批结果 */
  approvalResult?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'TRANSFER' | 'DELEGATE';
  /** 审批意见 */
  approvalComment?: string;
  /** 审批时间 */
  approvalTime?: string;
  /** 转办给谁（审批人ID） */
  transferToId?: number;
  /** 转办给谁（审批人姓名） */
  transferToName?: string;
  /** 委派给谁（审批人ID） */
  delegateToId?: number;
  /** 委派给谁（审批人姓名） */
  delegateToName?: string;
  /** 附件ID列表 */
  attachmentIds?: string;
  /** 是否当前节点 */
  isCurrent?: number;
  /** 租户ID */
  tenantId?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 创建人 */
  createBy?: string;
  /** 更新人 */
  updateBy?: string;
  /** 备注 */
  remark?: string;
}
```

### 4.3 待办任务表 (todo_task)

```typescript
interface TodoTask {
  /** 待办任务ID */
  id: number;
  /** 任务类型 */
  taskType: 'APPROVAL' | 'NOTICE' | 'REMIND' | 'WARNING';
  /** 任务标题 */
  taskTitle: string;
  /** 任务内容 */
  taskContent?: string;
  /** 任务来源 */
  taskSource?: string;
  /** 业务代码 */
  businessCode: string;
  /** 业务数据ID */
  businessId: number;
  /** 任务状态 */
  taskStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  /** 优先级 */
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  /** 接收人ID */
  assigneeId: number;
  /** 接收人姓名 */
  assigneeName?: string;
  /** 接收人部门 */
  assigneeDept?: string;
  /** 发送人ID */
  senderId?: number;
  /** 发送人姓名 */
  senderName?: string;
  /** 截止日期 */
  dueDate?: string;
  /** 完成时间 */
  completeTime?: string;
  /** 阅读状态 */
  readStatus?: number;
  /** 阅读时间 */
  readTime?: string;
  /** 关联的审批记录ID */
  approvalRecordId?: number;
  /** 任务跳转链接 */
  taskUrl?: string;
  /** 附件ID列表 */
  attachmentIds?: string;
  /** 租户ID */
  tenantId?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 创建人 */
  createBy?: string;
  /** 更新人 */
  updateBy?: string;
  /** 备注 */
  remark?: string;
}
```

---

## 5. 文件结构

### 5.1 API文件

```
blue-collar-platform/src/api/
├── approvalExecutionApi.ts  # 审批执行API接口
```

### 5.2 Mock文件

```
blue-collar-platform/mock/
├── approvalExecution.js  # 审批执行Mock数据
├── index.js               # Mock数据主入口（已更新）
```

### 5.3 类型定义文件

```
blue-collar-platform/src/types/
├── flow-config.ts  # 流程配置类型定义（已包含审批执行相关类型）
```

---

## 6. 使用示例

### 6.1 提交审批

```typescript
import { submitApproval } from '@/api/approvalExecutionApi'

// 提交审批
const handleSubmit = async () => {
  try {
    const response = await submitApproval({
      businessCode: 'LEAVE',
      businessId: 123,
      submitterId: 1,
      submitterName: '张三'
    })
    
    console.log('提交成功', response.data)
    // response.data.approvalId: 审批ID
    // response.data.currentNode: 当前节点名称
    // response.data.currentNodeId: 当前节点ID
  } catch (error) {
    console.error('提交失败', error)
  }
}
```

### 6.2 审批通过

```typescript
import { approveApproval } from '@/api/approvalExecutionApi'

// 审批通过
const handleApprove = async (approvalId: number) => {
  try {
    const response = await approveApproval(approvalId, {
      businessCode: 'LEAVE',
      businessId: 123,
      nodeId: 1,
      approverId: 1,
      approverName: '李四',
      approvalComment: '同意'
    })
    
    console.log('审批通过', response.data)
    // response.data.nextNode: 下一个节点名称
    // response.data.nextNodeId: 下一个节点ID
    // response.data.isCompleted: 是否完成
    // response.data.approvalStatus: 审批状态
  } catch (error) {
    console.error('审批失败', error)
  }
}
```

### 6.3 查询审批状态

```typescript
import { getApprovalStatus } from '@/api/approvalExecutionApi'

// 查询审批状态
const handleGetStatus = async () => {
  try {
    const response = await getApprovalStatus(123, 'LEAVE')
    
    console.log('审批状态', response.data)
    // response.data.approvalStatus: 审批状态
    // response.data.currentNodeName: 当前节点名称
    // response.data.currentNodeId: 当前节点ID
  } catch (error) {
    console.error('查询失败', error)
  }
}
```

### 6.4 查询审批记录

```typescript
import { getApprovalRecords } from '@/api/approvalExecutionApi'

// 查询审批记录
const handleGetRecords = async () => {
  try {
    const response = await getApprovalRecords(123, 'LEAVE')
    
    console.log('审批记录', response.data)
    // response.data: 审批记录列表
  } catch (error) {
    console.error('查询失败', error)
  }
}
```

### 6.5 撤回审批

```typescript
import { withdrawApproval } from '@/api/approvalExecutionApi'

// 撤回审批
const handleWithdraw = async (approvalId: number) => {
  try {
    const response = await withdrawApproval(approvalId, {
      userId: 1,
      userName: '张三',
      cancelReason: '申请人撤回'
    })
    
    console.log('撤回成功', response.data)
  } catch (error) {
    console.error('撤回失败', error)
  }
}
```

---

## 7. 技术要点

### 7.1 数据一致性

- 使用事务保证数据一致性
- 审批状态、审批记录、待办任务同步更新
- 避免数据不一致的情况

### 7.2 权限控制

- 审批人权限验证
- 申请人权限验证
- 数据权限过滤

### 7.3 流程管理

- 支持多级审批流程
- 支持或签和会签模式
- 支持审批转交和委派

### 7.4 错误处理

- 统一的错误处理机制
- 友好的错误提示
- 完整的错误日志

### 7.5 性能优化

- 使用索引优化查询
- 分页查询减少数据传输
- 缓存热点数据

---

## 8. 测试建议

### 8.1 单元测试

- 测试各个接口的业务逻辑
- 测试边界条件
- 测试错误处理

### 8.2 集成测试

- 测试完整的审批流程
- 测试多级审批
- 测试并发场景

### 8.3 性能测试

- 测试大数据量场景
- 测试并发审批
- 测试查询性能

---

## 9. 后续优化

### 9.1 功能优化

- 支持条件节点
- 支持并行审批
- 支持审批超时处理

### 9.2 性能优化

- 引入缓存机制
- 优化数据库查询
- 支持分布式部署

### 9.3 用户体验优化

- 实时审批状态推送
- 审批进度可视化
- 移动端适配

---

## 10. 总结

审批执行模块完成了以下功能：

1. **提交审批接口**: 支持业务提交时触发审批流程
2. **审批操作接口**: 支持审批通过、审批驳回、审批转交、审批委派
3. **查询审批状态接口**: 支持查询业务的审批状态
4. **查询审批记录接口**: 支持查询业务的审批记录
5. **撤回审批接口**: 支持申请人撤回审批申请
6. **辅助接口**: 支持获取我的待办审批列表、获取我提交的审批列表、获取审批详情、批量审批

所有接口都遵循了项目的接口设计规范，使用统一的响应格式，添加了数据验证和错误处理，支持数据权限过滤，添加了操作日志记录，使用TypeScript编写，添加了JSDoc注释。

---

**文档结束**
