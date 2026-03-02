# 流程配置模块后端API接口设计文档

## 文档信息
- **版本**: 1.0.0
- **创建日期**: 2026-02-26
- **项目**: 蓝领智汇 SaaS系统
- **模块**: 系统管理 > 流程配置

---

## 一、接口概述

### 1.1 接口分类

| 接口分类 | 接口数量 | 说明 |
|----------|----------|------|
| 流程管理接口 | 7个 | 审批流程的增删改查和状态管理 |
| 流程配置接口 | 5个 | 业务与流程的关联配置管理 |
| 审批执行接口 | 4个 | 审批流程的提交、通过、驳回和记录查询 |
| 待办任务接口 | 1个 | 待办任务的查询和管理 |
| 辅助接口 | 4个 | 流程验证、业务代码查询等 |

### 1.2 基础URL

```
开发环境: http://localhost:3000/api/v1
生产环境: https://api.bluecollar.com/api/v1
```

### 1.3 统一响应格式

所有接口返回统一的响应格式：

```typescript
interface ApiResponse<T> {
  code: number        // 响应码：200-成功，201-创建成功，400-参数错误，401-未授权，403-无权限，404-不存在，500-服务器错误
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

**接口地址**: `GET /api/v1/approval-flows`

**功能描述**: 分页查询审批流程列表，支持按流程类型、状态、关键词筛选

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码，默认1 |
| pageSize | number | 是 | 每页条数，默认10 |
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

**实现要点**:
- 支持分页查询
- 支持多条件筛选
- 返回节点数量统计
- 按租户ID隔离数据

---

### 2.2 获取流程详情

**接口地址**: `GET /api/v1/approval-flows/{id}`

**功能描述**: 根据流程ID获取流程详细信息，包括节点配置

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
        "autoApprove": 0,
        "tenantId": 1,
        "createTime": "2026-02-26 10:00:00",
        "updateBy": "admin"
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

**实现要点**:
- 返回流程基本信息
- 返回节点配置列表
- 节点按nodeOrder排序
- 流程不存在时返回404

---

### 2.3 创建流程

**接口地址**: `POST /api/v1/approval-flows`

**功能描述**: 创建新的审批流程，包括流程基本信息和节点配置

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

**实现要点**:
- 验证流程编码唯一性
- 验证流程名称非空
- 验证节点配置完整性
- 创建流程和节点记录
- 记录创建人和创建时间
- 返回新创建的流程ID

**错误响应**:

```json
{
  "code": 400,
  "message": "流程编码已存在",
  "data": null,
  "timestamp": 1708917600000
}
```

---

### 2.4 更新流程

**接口地址**: `PUT /api/v1/approval-flows/{id}`

**功能描述**: 更新审批流程信息，包括流程基本信息和节点配置

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

**实现要点**:
- 验证流程是否存在
- 验证流程编码唯一性（排除自己）
- 更新流程基本信息
- 更新或创建节点配置
- 版本号自动递增
- 记录更新人和更新时间

---

### 2.5 删除流程

**接口地址**: `DELETE /api/v1/approval-flows/{id}`

**功能描述**: 删除指定的审批流程

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

**实现要点**:
- 验证流程是否存在
- 检查流程是否被配置使用
- 检查流程是否有进行中的审批
- 删除流程和关联的节点
- 支持软删除

**错误响应**:

```json
{
  "code": 400,
  "message": "该流程已被配置使用，无法删除",
  "data": null,
  "timestamp": 1708917600000
}
```

---

### 2.6 启用/停用流程

**接口地址**: `PUT /api/v1/approval-flows/{id}/status`

**功能描述**: 修改流程的启用状态

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

**实现要点**:
- 验证流程是否存在
- 更新流程状态
- 记录更新人和更新时间
- 停用时检查是否有进行中的审批

---

### 2.7 检查流程编码是否重复

**接口地址**: `GET /api/v1/approval-flows/check-code`

**功能描述**: 检查流程编码是否已存在，用于前端实时验证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| flowCode | string | 是 | 流程编码 |
| id | number | 否 | 流程ID（更新时传入，排除自己） |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": true,
  "timestamp": 1708917600000
}
```

**实现要点**:
- 检查流程编码唯一性
- 更新时排除当前流程
- 返回布尔值表示是否重复

---

## 三、流程配置接口

### 3.1 获取流程配置列表

**接口地址**: `GET /api/v1/flow-configs`

**功能描述**: 分页查询流程配置列表，支持按业务代码、启用状态筛选

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码，默认1 |
| pageSize | number | 是 | 每页条数，默认10 |
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

**实现要点**:
- 支持分页查询
- 支持多条件筛选
- 返回关联的流程名称
- 按租户ID隔离数据

---

### 3.2 创建流程配置

**接口地址**: `POST /api/v1/flow-configs`

**功能描述**: 为业务模块关联审批流程

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

**实现要点**:
- 验证业务代码唯一性
- 验证流程是否存在
- 验证流程是否启用
- 创建配置记录
- 记录创建人和创建时间
- 返回新创建的配置ID

**错误响应**:

```json
{
  "code": 400,
  "message": "该业务已配置流程，请勿重复配置",
  "data": null,
  "timestamp": 1708917600000
}
```

---

### 3.3 更新流程配置

**接口地址**: `PUT /api/v1/flow-configs/{id}`

**功能描述**: 修改流程与业务的关联关系

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

**实现要点**:
- 验证配置是否存在
- 验证流程是否存在
- 验证流程是否启用
- 更新配置信息
- 记录更新人和更新时间

---

### 3.4 删除流程配置

**接口地址**: `DELETE /api/v1/flow-configs/{id}`

**功能描述**: 删除流程与业务的关联配置

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

**实现要点**:
- 验证配置是否存在
- 检查配置是否被使用
- 检查配置是否启用
- 支持软删除
- 记录删除人和删除时间

**错误响应**:

```json
{
  "code": 400,
  "message": "该配置已启用，请先禁用后再删除",
  "data": null,
  "timestamp": 1708917600000
}
```

---

### 3.5 获取流程配置详情

**接口地址**: `GET /api/v1/flow-configs/{id}`

**功能描述**: 根据配置ID获取配置详细信息，包括关联的流程信息和节点配置

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 配置ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
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
    "updateBy": "admin",
    "flowInfo": {
      "id": 1,
      "flowName": "请假审批流程",
      "flowCode": "LEAVE_APPROVAL",
      "flowType": "LEAVE",
      "flowDescription": "员工请假申请审批流程，支持多级审批",
      "flowStatus": "ENABLED",
      "version": 1
    },
    "flowNodes": [
      {
        "id": 1,
        "nodeName": "部门主管审批",
        "nodeCode": "LEAVE_NODE_1",
        "nodeType": "APPROVAL",
        "nodeOrder": 1,
        "approvalMode": "OR",
        "approverType": "POSITION",
        "approverConfig": "{\"position_code\":\"DEPT_MANAGER\"}"
      }
    ]
  },
  "timestamp": 1708917600000
}
```

**实现要点**:
- 返回配置基本信息
- 返回关联的流程信息
- 返回流程的节点配置
- 配置不存在时返回404

---

### 3.6 根据业务代码获取流程配置

**接口地址**: `GET /api/v1/flow-configs/business/{businessCode}`

**功能描述**: 根据业务代码获取流程配置，用于业务模块查询是否配置了审批流程

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| businessCode | string | 是 | 业务代码 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
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
  },
  "timestamp": 1708917600000
}
```

**实现要点**:
- 根据业务代码查询配置
- 检查配置是否启用
- 检查生效日期和失效日期
- 未找到配置时返回404

---

## 四、辅助接口

### 4.1 获取可用的审批流程列表

**接口地址**: `GET /api/v1/approval-flows/available`

**功能描述**: 获取所有启用的审批流程，用于流程配置选择

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

**实现要点**:
- 只返回启用状态的流程
- 支持按流程类型筛选
- 返回流程基本信息

---

### 4.2 获取业务代码列表

**接口地址**: `GET /api/v1/flow-configs/business-codes`

**功能描述**: 获取所有可配置审批流程的业务代码列表

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

**实现要点**:
- 返回所有可配置的业务代码
- 返回业务名称
- 用于前端下拉选择

---

### 4.3 获取流程节点列表

**接口地址**: `GET /api/v1/approval-flows/{id}/nodes`

**功能描述**: 根据流程ID获取节点配置列表

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

**实现要点**:
- 返回流程的所有节点
- 节点按nodeOrder排序
- 流程不存在时返回404

---

### 4.4 验证流程配置

**接口地址**: `POST /api/v1/approval-flows/validate`

**功能描述**: 验证流程配置的有效性，返回验证结果和错误信息

**请求体**:

```json
{
  "flowName": "请假审批流程",
  "flowCode": "LEAVE_APPROVAL",
  "flowType": "LEAVE",
  "flowDescription": "员工请假申请审批流程",
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
  ]
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "valid": true,
    "errors": []
  },
  "timestamp": 1708917600000
}
```

**错误响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "valid": false,
    "errors": [
      "流程名称不能为空",
      "流程编码只能包含大写字母和下划线",
      "至少需要配置一个审批节点",
      "第1个节点审批人类型不能为空"
    ]
  },
  "timestamp": 1708917600000
}
```

**实现要点**:
- 验证流程名称非空
- 验证流程编码格式（大写字母和下划线）
- 验证流程类型非空
- 验证节点配置完整性
- 验证节点审批人配置
- 返回详细的错误信息

---

## 五、数据权限控制

### 5.1 数据权限类型

| 权限类型 | 编码 | 说明 |
|----------|------|------|
| 全部数据 | ALL | 查看所有数据 |
| 本部门数据 | DEPARTMENT | 仅查看本部门数据 |
| 本部门及以下 | DEPARTMENT_AND_BELOW | 查看本部门及下属部门数据 |
| 本人数据 | SELF | 仅查看本人创建/负责的数据 |
| 自定义 | CUSTOM | 自定义选择部门数据权限 |

### 5.2 数据权限应用

数据权限通过请求头传递：

```http
Authorization: Bearer {token}
X-Data-Permission-Type: ALL
X-Data-Permission-Departments: [1,2,3]
X-User-Id: 1001
X-User-Department-Id: 1
```

### 5.3 数据权限实现

所有列表查询接口都支持数据权限过滤：

```javascript
function applyDataPermission(query, dataPermission) {
  const { type, departments, includeCreator, includeManager, includeContact } = dataPermission

  switch (type) {
    case 'ALL':
      // 不添加过滤条件
      break
    case 'DEPARTMENT':
      query.where({ departmentId: userDepartmentId })
      break
    case 'DEPARTMENT_AND_BELOW':
      query.where({ departmentId: { [Op.in]: getAllChildDepartments(userDepartmentId) } })
      break
    case 'SELF':
      query.where({ createBy: userId })
      break
    case 'CUSTOM':
      query.where({ departmentId: { [Op.in]: departments } })
      break
  }

  // 特殊权限
  if (includeCreator) {
    query.or({ createBy: userId })
  }
  if (includeManager) {
    query.or({ managerId: userId })
  }
  if (includeContact) {
    query.or({ contactId: userId })
  }
}
```

---

## 六、错误码说明

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

## 七、操作日志记录

### 7.1 操作日志内容

所有增删改操作都需要记录操作日志：

```javascript
interface OperationLog {
  id: number
  operationType: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT'
  module: 'APPROVAL_FLOW' | 'FLOW_CONFIG' | 'APPROVAL_RECORD'
  businessCode: string
  businessId: number
  operationContent: string
  operatorId: number
  operatorName: string
  operatorDepartment: string
  ip: string
  userAgent: string
  operationTime: Date
  tenantId: number
}
```

### 7.2 操作日志记录时机

| 操作类型 | 记录时机 |
|----------|----------|
| 创建流程 | 流程创建成功后 |
| 更新流程 | 流程更新成功后 |
| 删除流程 | 流程删除成功后 |
| 启用/停用流程 | 状态更新成功后 |
| 创建配置 | 配置创建成功后 |
| 更新配置 | 配置更新成功后 |
| 删除配置 | 配置删除成功后 |

---

## 八、性能优化

### 8.1 数据库优化

- 为所有查询字段建立索引
- 使用联合索引优化多条件查询
- 使用覆盖索引减少回表
- 优化分页查询性能

### 8.2 缓存策略

- 缓存流程配置数据
- 缓存业务代码列表
- 缓存可用流程列表
- 设置合理的缓存过期时间

### 8.3 查询优化

- 避免N+1查询
- 使用批量查询
- 使用分页查询
- 使用延迟加载

---

## 九、安全设计

### 9.1 数据验证

- 所有输入参数进行验证
- 防止SQL注入
- 防止XSS攻击
- 防止CSRF攻击

### 9.2 权限控制

- 基于角色的访问控制
- 数据权限过滤
- 操作权限验证
- 租户数据隔离

### 9.3 审计日志

- 记录所有操作日志
- 记录操作人信息
- 记录操作时间
- 记录操作IP

---

## 十、使用示例

### 10.1 前端调用示例

```typescript
import {
  getFlowConfigList,
  createFlowConfig,
  updateFlowConfig,
  deleteFlowConfig,
  getFlowConfigDetail,
  validateFlowConfig
} from '@/api/system/flowConfigApi'

// 获取流程配置列表
const fetchConfigs = async () => {
  const response = await getFlowConfigList({
    page: 1,
    pageSize: 10,
    businessCode: 'LEAVE',
    isEnabled: 1
  })
  console.log(response.data.list)
}

// 创建流程配置
const createConfig = async () => {
  const response = await createFlowConfig({
    businessCode: 'LEAVE',
    businessName: '请假管理',
    flowId: 1,
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    configDescription: '请假管理启用审批流程'
  })
  console.log(response.data.id)
}

// 更新流程配置
const updateConfig = async () => {
  const response = await updateFlowConfig(1, {
    flowId: 2,
    isEnabled: 1
  })
  console.log(response.data)
}

// 删除流程配置
const deleteConfig = async () => {
  await deleteFlowConfig(1)
}

// 获取流程配置详情
const fetchConfigDetail = async () => {
  const response = await getFlowConfigDetail(1)
  console.log(response.data)
}

// 验证流程配置
const validateConfig = async () => {
  const response = await validateFlowConfig({
    flowName: '请假审批流程',
    flowCode: 'LEAVE_APPROVAL',
    flowType: 'LEAVE',
    nodes: [...]
  })
  console.log(response.data.valid, response.data.errors)
}
```

---

## 十一、注意事项

1. **租户隔离**: 所有数据都按租户ID隔离，确保多租户数据安全
2. **数据权限**: 列表查询自动应用数据权限过滤
3. **审批流程**: 未配置审批流的业务默认不需要审批
4. **节点顺序**: 审批节点按nodeOrder顺序执行
5. **审批模式**: 支持或签（OR）和会签（AND）两种模式
6. **版本管理**: 流程支持版本管理，更新时自动递增版本号
7. **软删除**: 删除操作使用软删除，保留数据用于审计
8. **操作日志**: 所有增删改操作都需要记录操作日志

---

**文档结束**
