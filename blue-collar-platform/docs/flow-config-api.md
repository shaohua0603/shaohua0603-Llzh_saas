# 流程配置功能API接口文档

## 文档信息
- **版本**: 1.0.0
- **创建日期**: 2026-02-26
- **项目**: 蓝领智汇 SaaS系统
- **模块**: 系统管理 > 流程配置

---

## 一、接口概述

本API接口文档提供了流程配置功能的完整接口定义，包含4大类共14个核心接口，以及多个辅助接口。所有接口遵循RESTful设计规范，支持统一的响应格式和错误处理。

### 1.1 接口分类

| 接口分类 | 接口数量 | 说明 |
|----------|----------|------|
| 流程管理接口 | 6个 | 审批流程的增删改查和状态管理 |
| 流程配置接口 | 4个 | 业务与流程的关联配置管理 |
| 审批执行接口 | 4个 | 审批流程的提交、通过、驳回和记录查询 |
| 待办任务接口 | 1个 | 待办任务的查询和管理 |

### 1.2 基础URL

```
开发环境: http://localhost:3000/api/v1
生产环境: https://api.bluecollar.com/api/v1
```

### 1.3 统一响应格式

所有接口返回统一的响应格式：

```typescript
interface ApiResponse<T> {
  code: number        // 响应码：200-成功，400-参数错误，401-未授权，403-无权限，404-不存在，500-服务器错误
  message: string     // 响应消息
  data: T            // 响应数据
  timestamp: number   // 时间戳
}

interface PageResponse<T> {
  list: T[]          // 数据列表
  total: number      // 总记录数
  page: number       // 当前页码
  pageSize: number   // 每页条数
}
```

---

## 二、流程管理接口

### 2.1 获取流程列表

**接口地址**: `GET /approval-flows`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| flowType | string | 否 | 流程类型：LEAVE-请假，TRANSFER-调岗，RESIGNATION-离职，REGISTRATION-报名 |
| flowStatus | string | 否 | 流程状态：ENABLED-启用，DISABLED-停用 |
| keyword | string | 否 | 搜索关键词（流程名称或编码） |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "flowName": "请假审批流程",
        "flowCode": "LEAVE_APPROVAL",
        "flowType": "LEAVE",
        "flowDescription": "员工请假申请审批流程，支持多级审批",
        "flowStatus": "ENABLED",
        "isDefault": 1,
        "version": 1,
        "nodeCount": 3,
        "createTime": "2026-02-26 10:00:00",
        "updateTime": "2026-02-26 10:00:00",
        "createBy": "admin",
        "updateBy": "admin"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
  },
  "timestamp": 1708917600000
}
```

### 2.2 获取流程详情

**接口地址**: `GET /approval-flows/{id}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 流程ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "flowName": "请假审批流程",
    "flowCode": "LEAVE_APPROVAL",
    "flowType": "LEAVE",
    "flowDescription": "员工请假申请审批流程，支持多级审批",
    "flowStatus": "ENABLED",
    "isDefault": 1,
    "version": 1,
    "nodes": [
      {
        "id": 1,
        "flowId": 1,
        "nodeName": "部门主管审批",
        "nodeCode": "LEAVE_NODE_1",
        "nodeType": "APPROVAL",
        "nodeOrder": 1,
        "approvalMode": "OR",
        "approverType": "POSITION",
        "approverConfig": "{\"position_code\":\"DEPT_MANAGER\"}",
        "isRequired": 1,
        "autoApprove": 0
      }
    ],
    "createTime": "2026-02-26 10:00:00",
    "updateTime": "2026-02-26 10:00:00",
    "createBy": "admin",
    "updateBy": "admin"
  },
  "timestamp": 1708917600000
}
```

### 2.3 创建流程

**接口地址**: `POST /approval-flows`

**请求体**:

```json
{
  "flowName": "请假审批流程",
  "flowCode": "LEAVE_APPROVAL",
  "flowType": "LEAVE",
  "flowDescription": "员工请假申请审批流程，支持多级审批",
  "flowStatus": "ENABLED",
  "isDefault": 1,
  "nodes": [
    {
      "nodeName": "部门主管审批",
      "nodeCode": "LEAVE_NODE_1",
      "nodeType": "APPROVAL",
      "nodeOrder": 1,
      "approvalMode": "OR",
      "approverType": "POSITION",
      "approverConfig": "{\"position_code\":\"DEPT_MANAGER\"}",
      "isRequired": 1,
      "autoApprove": 0
    }
  ],
  "remark": "默认请假审批流程"
}
```

**响应示例**:

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1
  },
  "timestamp": 1708917600000
}
```

### 2.4 更新流程

**接口地址**: `PUT /approval-flows/{id}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 流程ID |

**请求体**: 同创建流程

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "flowName": "请假审批流程",
    "flowCode": "LEAVE_APPROVAL",
    "flowType": "LEAVE",
    "flowDescription": "员工请假申请审批流程，支持多级审批",
    "flowStatus": "ENABLED",
    "isDefault": 1,
    "version": 2,
    "updateTime": "2026-02-26 11:00:00",
    "updateBy": "admin"
  },
  "timestamp": 1708917600000
}
```

### 2.5 删除流程

**接口地址**: `DELETE /approval-flows/{id}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 流程ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "timestamp": 1708917600000
}
```

### 2.6 启用/停用流程

**接口地址**: `PUT /approval-flows/{id}/status`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 流程ID |

**请求体**:

```json
{
  "flowStatus": "ENABLED"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "timestamp": 1708917600000
}
```

---

## 三、流程配置接口

### 3.1 获取流程配置列表

**接口地址**: `GET /flow-configs`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| businessCode | string | 否 | 业务代码 |
| isEnabled | number | 否 | 是否启用：0-否，1-是 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "businessCode": "LEAVE",
        "businessName": "请假管理",
        "flowId": 1,
        "flowName": "请假审批流程",
        "isEnabled": 1,
        "effectiveDate": "2026-01-01 00:00:00",
        "expiryDate": null,
        "configDescription": "请假管理启用审批流程",
        "createTime": "2026-02-26 10:00:00",
        "updateTime": "2026-02-26 10:00:00",
        "createBy": "admin",
        "updateBy": "admin"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  },
  "timestamp": 1708917600000
}
```

### 3.2 创建流程配置

**接口地址**: `POST /flow-configs`

**请求体**:

```json
{
  "businessCode": "LEAVE",
  "businessName": "请假管理",
  "flowId": 1,
  "isEnabled": 1,
  "effectiveDate": "2026-01-01 00:00:00",
  "expiryDate": null,
  "configDescription": "请假管理启用审批流程",
  "remark": ""
}
```

**响应示例**:

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1
  },
  "timestamp": 1708917600000
}
```

### 3.3 更新流程配置

**接口地址**: `PUT /flow-configs/{id}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 配置ID |

**请求体**:

```json
{
  "flowId": 2,
  "isEnabled": 1
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "businessCode": "LEAVE",
    "businessName": "请假管理",
    "flowId": 2,
    "flowName": "调岗审批流程",
    "isEnabled": 1,
    "updateTime": "2026-02-26 11:00:00",
    "updateBy": "admin"
  },
  "timestamp": 1708917600000
}
```

### 3.4 删除流程配置

**接口地址**: `DELETE /flow-configs/{id}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 配置ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "timestamp": 1708917600000
}
```

---

## 四、审批执行接口

### 4.1 提交审批

**接口地址**: `POST /approvals/submit`

**请求体**:

```json
{
  "businessCode": "LEAVE",
  "businessId": 1001,
  "submitterId": 1003,
  "submitterName": "王五"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "approvalId": 1,
    "currentNode": "部门主管审批",
    "currentNodeId": 1
  },
  "timestamp": 1708917600000
}
```

### 4.2 审批通过

**接口地址**: `POST /approvals/approve`

**请求体**:

```json
{
  "businessCode": "LEAVE",
  "businessId": 1001,
  "nodeId": 1,
  "approverId": 1001,
  "approverName": "张三",
  "approvalComment": "同意请假",
  "attachmentIds": "[1,2,3]"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "审批通过",
  "data": {
    "nextNode": "人事审批",
    "nextNodeId": 2,
    "isCompleted": false,
    "approvalStatus": "IN_PROGRESS"
  },
  "timestamp": 1708917600000
}
```

### 4.3 审批驳回

**接口地址**: `POST /approvals/reject`

**请求体**:

```json
{
  "businessCode": "LEAVE",
  "businessId": 1001,
  "nodeId": 1,
  "approverId": 1001,
  "approverName": "张三",
  "approvalComment": "请假理由不充分"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "审批驳回",
  "data": {
    "isCompleted": true,
    "approvalStatus": "REJECTED"
  },
  "timestamp": 1708917600000
}
```

### 4.4 获取审批记录

**接口地址**: `GET /approvals/records`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| businessId | number | 是 | 业务ID |
| businessCode | string | 是 | 业务代码 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "businessCode": "LEAVE",
      "businessId": 1001,
      "flowId": 1,
      "flowName": "请假审批流程",
      "nodeId": 1,
      "nodeName": "部门主管审批",
      "approverId": 1001,
      "approverName": "张三",
      "approverDept": "技术部",
      "approvalResult": "APPROVED",
      "approvalComment": "同意请假",
      "approvalTime": "2026-02-26 10:30:00",
      "isCurrent": 0,
      "createTime": "2026-02-26 10:00:00",
      "updateBy": "张三"
    },
    {
      "id": 2,
      "businessCode": "LEAVE",
      "businessId": 1001,
      "flowId": 1,
      "flowName": "请假审批流程",
      "nodeId": 2,
      "nodeName": "人事审批",
      "approverId": 1002,
      "approverName": "李四",
      "approverDept": "人事部",
      "approvalResult": "PENDING",
      "approvalComment": null,
      "approvalTime": null,
      "isCurrent": 1,
      "createTime": "2026-02-26 10:00:00",
      "updateBy": "admin"
    }
  ],
  "timestamp": 1708917600000
}
```

---

## 五、待办任务接口

### 5.1 获取待办任务列表

**接口地址**: `GET /todo-tasks`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| taskStatus | string | 否 | 任务状态：PENDING-待处理，PROCESSING-处理中，COMPLETED-已完成 |
| taskType | string | 否 | 任务类型：APPROVAL-审批，NOTICE-通知，REMIND-提醒，WARNING-预警 |
| priority | string | 否 | 优先级：LOW-低，NORMAL-中，HIGH-高，URGENT-紧急 |
| keyword | string | 否 | 搜索关键词 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "taskType": "APPROVAL",
        "taskTitle": "请假申请审批",
        "taskContent": "王五申请请假3天，请审批",
        "taskSource": "LEAVE",
        "businessCode": "LEAVE",
        "businessId": 1001,
        "taskStatus": "PENDING",
        "priority": "NORMAL",
        "assigneeId": 1002,
        "assigneeName": "李四",
        "assigneeDept": "人事部",
        "senderId": 1003,
        "senderName": "王五",
        "dueDate": "2026-02-27 10:00:00",
        "completeTime": null,
        "readStatus": 0,
        "readTime": null,
        "approvalRecordId": 2,
        "taskUrl": "/labor-company/on-duty/leave/detail/1001",
        "createTime": "2026-02-26 10:00:00",
        "updateBy": "admin"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  },
  "timestamp": 1708917600000
}
```

---

## 六、辅助接口

### 6.1 获取可用审批流程列表

**接口地址**: `GET /approval-flows/available`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| flowType | string | 否 | 流程类型 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "flowName": "请假审批流程",
      "flowCode": "LEAVE_APPROVAL",
      "flowType": "LEAVE",
      "flowStatus": "ENABLED"
    }
  ],
  "timestamp": 1708917600000
}
```

### 6.2 获取业务代码列表

**接口地址**: `GET /flow-configs/business-codes`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "code": "LEAVE",
      "name": "请假管理"
    },
    {
      "code": "TRANSFER",
      "name": "调岗管理"
    },
    {
      "code": "RESIGNATION",
      "name": "离职管理"
    },
    {
      "code": "REGISTRATION",
      "name": "报名管理"
    }
  ],
  "timestamp": 1708917600000
}
```

### 6.3 获取流程节点列表

**接口地址**: `GET /approval-flows/{id}/nodes`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 流程ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "flowId": 1,
      "nodeName": "部门主管审批",
      "nodeCode": "LEAVE_NODE_1",
      "nodeType": "APPROVAL",
      "nodeOrder": 1,
      "approvalMode": "OR",
      "approverType": "POSITION",
      "approverConfig": "{\"position_code\":\"DEPT_MANAGER\"}",
      "isRequired": 1,
      "autoApprove": 0
    }
  ],
  "timestamp": 1708917600000
}
```

---

## 七、数据权限控制

所有列表查询接口都支持数据权限过滤，根据用户岗位配置的数据权限类型自动过滤数据：

### 7.1 数据权限类型

| 权限类型 | 编码 | 说明 |
|----------|------|------|
| 全部数据 | ALL | 查看所有数据 |
| 本部门数据 | DEPARTMENT | 仅查看本部门数据 |
| 本部门及以下 | DEPARTMENT_AND_BELOW | 查看本部门及下属部门数据 |
| 本人数据 | SELF | 仅查看本人创建/负责的数据 |
| 自定义 | CUSTOM | 自定义选择部门数据权限 |

### 7.2 数据权限应用

数据权限通过请求头传递：

```http
Authorization: Bearer {token}
X-Data-Permission-Type: ALL
X-Data-Permission-Departments: [1,2,3]
X-User-Id: 1001
X-User-Department-Id: 1
```

---

## 八、错误码说明

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 200 | 成功 | 正常处理 |
| 201 | 创建成功 | 正常处理 |
| 400 | 请求参数错误 | 检查请求参数 |
| 401 | 未授权 | 重新登录 |
| 403 | 无权限 | 检查用户权限 |
| 404 | 资源不存在 | 检查资源ID |
| 500 | 服务器错误 | 联系管理员 |

---

## 九、使用示例

### 9.1 前端调用示例

```typescript
import {
  getApprovalFlowList,
  createApprovalFlow,
  submitApproval,
  approveApproval,
  getTodoTaskList
} from '@/api/system/flowConfigApi'

// 获取流程列表
const fetchFlows = async () => {
  const response = await getApprovalFlowList({
    page: 1,
    pageSize: 10,
    flowType: 'LEAVE',
    flowStatus: 'ENABLED'
  })
  console.log(response.data.list)
}

// 创建流程
const createFlow = async () => {
  const response = await createApprovalFlow({
    flowName: '请假审批流程',
    flowCode: 'LEAVE_APPROVAL',
    flowType: 'LEAVE',
    flowDescription: '员工请假申请审批流程',
    flowStatus: 'ENABLED',
    nodes: [...]
  })
  console.log(response.data.id)
}

// 提交审批
const submit = async () => {
  const response = await submitApproval({
    businessCode: 'LEAVE',
    businessId: 1001,
    submitterId: 1003,
    submitterName: '王五'
  })
  console.log(response.data.currentNode)
}

// 审批通过
const approve = async () => {
  const response = await approveApproval({
    businessCode: 'LEAVE',
    businessId: 1001,
    nodeId: 1,
    approverId: 1001,
    approverName: '张三',
    approvalComment: '同意请假'
  })
  console.log(response.data.nextNode)
}

// 获取待办任务
const fetchTodos = async () => {
  const response = await getTodoTaskList({
    page: 1,
    pageSize: 10,
    taskStatus: 'PENDING',
    taskType: 'APPROVAL'
  })
  console.log(response.data.list)
}
```

### 9.2 后端实现示例

```javascript
// 获取流程列表
router.get('/approval-flows', async (ctx) => {
  const { page, pageSize, flowType, flowStatus, keyword } = ctx.query

  // 应用数据权限过滤
  const dataPermission = ctx.state.dataPermission
  const query = applyDataPermission(ApprovalFlow, dataPermission)

  // 添加查询条件
  if (flowType) query.where({ flowType })
  if (flowStatus) query.where({ flowStatus })
  if (keyword) query.where(
    sequelize.where(
      sequelize.fn('OR'),
      { flowName: { [Op.like]: `%${keyword}%` } },
      { flowCode: { [Op.like]: `%${keyword}%` } }
    )
  )

  // 分页查询
  const result = await query
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .findAll()

  const total = await query.count()

  ctx.body = {
    code: 200,
    message: 'success',
    data: {
      list: result,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    },
    timestamp: Date.now()
  }
})
```

---

## 十、注意事项

1. **租户隔离**: 所有数据都按租户ID隔离，确保多租户数据安全
2. **数据权限**: 列表查询自动应用数据权限过滤
3. **审批流程**: 未配置审批流的业务默认不需要审批
4. **节点顺序**: 审批节点按nodeOrder顺序执行
5. **审批模式**: 支持或签（OR）和会签（AND）两种模式
6. **审批转办**: 支持审批转办和委派功能
7. **超时处理**: 支持审批超时自动处理
8. **版本管理**: 流程支持版本管理，更新时自动递增版本号

---

## 十一、更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-02-26 | 初始版本，完成14个核心接口和辅助接口 |

---

**文档结束**
