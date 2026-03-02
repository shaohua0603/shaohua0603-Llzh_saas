# 调岗管理审批流程集成说明

## 概述

本文档说明调岗管理模块如何集成审批流程功能。

## 集成内容

### 1. 创建调岗管理详情页面

**文件位置**: `src/views/labor-company/on-duty/TransferDetail.vue`

**功能特性**:
- 展示调岗基本信息（姓名、手机号、期望调岗日期、原部门、原岗位、原岗位直属领导、目标部门、目标岗位、目标岗位直属组长、调岗原因）
- 集成ApprovalOperation组件，展示审批记录时间线
- 支持审批操作（通过、驳回、转办、委派）
- 根据审批状态动态显示审批按钮
- 响应式设计，适配不同屏幕尺寸

### 2. 修改调岗管理列表页面

**文件位置**: `src/views/labor-company/on-duty/Transfer.vue`

**修改内容**:
- 添加"提交审批"按钮，仅在待审核状态下可用
- 将"详情"按钮改为跳转到详情页面
- 移除原有的详情弹窗、审核弹窗和审核记录弹窗
- 移除审核功能，改为在详情页面进行审批
- 编辑和删除按钮仅在待审核状态下可用

### 3. 添加路由配置

**文件位置**: `src/router/index.ts`

**新增路由**:
```typescript
{
  path: 'on-duty/transfer/detail/:id',
  name: 'LaborCompanyTransferDetail',
  component: () => import('../views/labor-company/on-duty/TransferDetail.vue'),
  meta: { title: '调岗详情' }
}
```

### 4. 修复ApprovalOperation组件

**文件位置**: `src/components/ApprovalOperation.vue`

**修改内容**:
- 将PersonSelectDialog替换为PersonSelect组件
- 添加转办人员和委派人员选择确认处理函数
- 修复表单数据结构，添加toUserName字段
- 移除不必要的对话框状态变量

## 业务代码

- **业务类型**: `TRANSFER`
- **业务名称**: 调岗管理

## 审批字段

调岗管理的审批字段包括：
1. 姓名 (workerName)
2. 手机号 (phone)
3. 期望调岗日期 (expectedTransferDate)
4. 原部门 (originalDepartment)
5. 原岗位 (originalPosition)
6. 原岗位直属领导 (originalLeader)
7. 目标部门 (targetDepartment)
8. 目标岗位 (targetPosition)
9. 目标岗位直属组长 (targetLeader)
10. 调岗原因 (transferReason)

## 审批状态

调岗管理的审批状态包括：
- **PENDING** (未审核): 待提交审批
- **IN_PROGRESS** (审核中): 已提交审批，正在审批流程中
- **APPROVED** (审核通过): 审批流程已完成并通过
- **REJECTED** (已驳回): 审批流程已完成但被驳回

## 审批流程

### 提交审批

1. 用户在调岗管理列表页面点击"提交审批"按钮
2. 系统弹出确认对话框
3. 用户确认后，状态从PENDING变为IN_PROGRESS
4. 进入审批流程

### 审批操作

1. 审批人点击"详情"按钮进入调岗详情页面
2. 查看调岗基本信息和审批记录时间线
3. 在审批操作区域选择审批结果：
   - **通过**: 填写审批意见（选填），点击"提交审批"
   - **驳回**: 填写驳回原因（必填），点击"提交审批"
   - **转办**: 选择转办人，填写转办说明（选填），点击"转办他人"
   - **委派**: 选择委派人，填写委派说明（选填），点击"委派他人"
4. 系统更新审批状态和审批记录

### 审批记录

- 使用ApprovalRecordTimeline组件展示审批记录
- 支持展开/折叠查看详细信息
- 显示审批人、审批时间、审批结果、审批意见
- 支持附件和抄送信息展示

## API接口

### 审批相关接口

```typescript
// 审批通过
approveApproval(data: ApprovalFormData)

// 审批驳回
rejectApproval(data: ApprovalFormData)

// 审批转办
transferApproval(data: TransferFormData)

// 审批委派
delegateApproval(data: DelegateFormData)

// 获取审批记录
getApprovalRecords(params: ApprovalRecordsQuery)

// 获取审批状态
getApprovalStatus(params: ApprovalStatusQuery)
```

### 接口定义

详见 `src/api/approvalApi.ts`

## 组件使用

### ApprovalOperation组件

```vue
<ApprovalOperation
  :business-id="transferDetail.id"
  business-type="TRANSFER"
  :business-data="transferDetail"
  :business-fields="businessFields"
  :approval-records="approvalRecords"
  :can-approve="canApprove"
  :show-business-detail="false"
  :loading="approvalLoading"
  @approve="handleApprove"
  @reject="handleReject"
  @transfer="handleTransfer"
  @delegate="handleDelegate"
  @refresh="handleRefresh"
/>
```

### ApprovalRecordTimeline组件

```vue
<ApprovalRecordTimeline
  :records="approvalRecords"
  :current-node-id="currentNodeId"
  :show-header="true"
  :show-expand-all="true"
  :show-expand-button="true"
  :default-expanded="true"
  :reverse-order="false"
/>
```

## 响应式设计

- PC端: 完整展示所有信息，支持多列布局
- 平板: 适当调整布局，保持信息完整性
- 移动端: 单列布局，优化触控操作

## 用户提示

- 提交审批前弹出确认对话框
- 审批操作成功后显示成功提示
- 审批操作失败后显示错误提示
- 表单验证失败时显示验证错误提示

## 权限控制

- 只有待审核状态的调岗记录可以编辑和删除
- 只有待审核和审核中状态的调岗记录可以审批
- 审批权限根据用户角色和岗位配置

## 注意事项

1. 调岗详情页面需要传入正确的业务ID
2. 审批记录需要从后端API获取
3. 业务字段配置需要与后端数据结构一致
4. 审批状态变更需要同步更新列表页面
5. 转办和委派功能需要PersonSelect组件支持

## 测试建议

1. 测试提交审批功能
2. 测试审批通过功能
3. 测试审批驳回功能
4. 测试转办功能
5. 测试委派功能
6. 测试审批记录展示
7. 测试响应式布局
8. 测试权限控制

## 后续优化

1. 集成真实的后端API
2. 添加审批流程配置功能
3. 支持批量审批操作
4. 添加审批提醒功能
5. 优化移动端体验
