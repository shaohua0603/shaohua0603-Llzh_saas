# 蓝领智汇平台 API 文档

## 文档说明

本文档描述了蓝领智汇平台的所有API接口，包括请求方法、请求参数、响应格式、错误码等。

### 基础信息

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json;charset=UTF-8`
- **认证方式**: Bearer Token
- **字符编码**: UTF-8

### 统一响应格式

所有接口都遵循统一的响应格式：

```typescript
{
  code: number,        // 响应码
  message: string,     // 提示信息
  data: any,          // 响应数据
  timestamp: number    // 时间戳
}
```

### 响应码说明

| 响应码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 201 | 创建成功 |
| 204 | 操作成功，无返回内容 |
| 400 | 请求参数错误 |
| 401 | 未授权，请重新登录 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

### 分页参数

所有分页查询接口都支持以下参数：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码，从1开始 |
| pageSize | number | 是 | 每页条数 |
| sortField | string | 否 | 排序字段 |
| sortOrder | string | 否 | 排序方向：asc升序，desc降序 |
| keyword | string | 否 | 关键词搜索 |
| filters | object | 否 | 筛选条件 |

### 分页响应格式

```typescript
{
  code: number,
  message: string,
  data: {
    list: any[],      // 数据列表
    total: number,    // 总记录数
    page: number,     // 当前页
    pageSize: number, // 每页条数
    totalPages: number // 总页数
  },
  timestamp: number
}
```

---

## 1. 认证接口

### 1.1 用户登录

**接口地址**: `POST /auth/login`

**请求参数**:

```typescript
{
  username: string,  // 用户名
  password: string,  // 密码
  userType: string  // 用户类型：worker/labor_company/factory/admin
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "userId": 1,
      "username": "admin",
      "realName": "管理员",
      "phone": "13800138000",
      "email": "admin@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "userType": "admin",
      "tenantId": null,
      "tenantName": null,
      "departmentId": 1,
      "departmentName": "平台管理部",
      "positionId": 1,
      "positionName": "系统管理员",
      "roles": [
        {
          "roleId": 1,
          "roleName": "超级管理员",
          "roleCode": "super_admin"
        }
      ],
      "permissions": [
        "system:user:view",
        "system:user:add",
        "system:user:edit",
        "system:user:delete"
      ],
      "dataPermission": "ALL"
    }
  },
  "timestamp": 1672531200000
}
```

### 1.2 刷新Token

**接口地址**: `POST /auth/refresh`

**请求参数**:

```typescript
{
  refreshToken: string  // 刷新令牌
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": 1672531200000
}
```

### 1.3 用户登出

**接口地址**: `POST /auth/logout`

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "登出成功",
  "data": null,
  "timestamp": 1672531200000
}
```

### 1.4 获取当前用户信息

**接口地址**: `GET /auth/userinfo`

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "userId": 1,
    "username": "admin",
    "realName": "管理员",
    "phone": "13800138000",
    "email": "admin@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "userType": "admin",
    "tenantId": null,
    "tenantName": null,
    "departmentId": 1,
    "departmentName": "平台管理部",
    "positionId": 1,
    "positionName": "系统管理员",
    "roles": [
      {
        "roleId": 1,
        "roleName": "超级管理员",
        "roleCode": "super_admin"
      }
    ],
    "permissions": [
      "system:user:view",
      "system:user:add",
      "system:user:edit",
      "system:user:delete"
    ],
    "dataPermission": "ALL"
  },
  "timestamp": 1672531200000
}
```

---

## 2. 工作中心接口

### 2.1 获取待办任务列表

**接口地址**: `GET /admin/todos`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| type | string | 否 | 任务类型：tenant_audit/package_audit/activity_audit/expense_audit/other |
| priority | string | 否 | 优先级：high/medium/low |
| status | string | 否 | 状态：pending/processing/completed/cancelled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "审核租户申请 - 三鼎劳务有限公司",
        "type": "tenant_audit",
        "priority": "high",
        "status": "pending",
        "businessType": "tenant",
        "businessId": 1,
        "description": "审核租户申请信息",
        "assigneeId": 1,
        "assigneeName": "管理员",
        "deadline": "2024-01-31 18:00:00",
        "completedAt": null,
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "timestamp": 1672531200000
}
```

### 2.2 获取待办任务详情

**接口地址**: `GET /admin/todos/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "title": "审核租户申请 - 三鼎劳务有限公司",
    "type": "tenant_audit",
    "priority": "high",
    "status": "pending",
    "businessType": "tenant",
    "businessId": 1,
    "description": "审核租户申请信息",
    "assigneeId": 1,
    "assigneeName": "管理员",
    "deadline": "2024-01-31 18:00:00",
    "completedAt": null,
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 2.3 完成待办任务

**接口地址**: `PUT /admin/todos/{id}/complete`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "任务已完成",
  "data": null,
  "timestamp": 1672531200000
}
```

### 2.4 获取消息列表

**接口地址**: `GET /admin/messages`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| type | string | 否 | 消息类型：system/notification/announcement/other |
| priority | string | 否 | 优先级：high/medium/low |
| status | string | 否 | 状态：unread/read/archived |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "系统通知",
        "type": "system",
        "priority": "high",
        "status": "unread",
        "content": "系统将于2024-01-31 22:00-23:00进行维护升级",
        "senderId": null,
        "senderName": "系统",
        "receiverId": 1,
        "receiverName": "管理员",
        "isBroadcast": true,
        "readAt": null,
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 20,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  },
  "timestamp": 1672531200000
}
```

### 2.5 获取消息详情

**接口地址**: `GET /admin/messages/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "title": "系统通知",
    "type": "system",
    "priority": "high",
    "status": "unread",
    "content": "系统将于2024-01-31 22:00-23:00进行维护升级",
    "senderId": null,
    "senderName": "系统",
    "receiverId": 1,
    "receiverName": "管理员",
    "isBroadcast": true,
    "readAt": null,
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 2.6 标记消息为已读

**接口地址**: `PUT /admin/messages/{id}/read`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "标记成功",
  "data": null,
  "timestamp": 1672531200000
}
```

### 2.7 批量标记消息为已读

**接口地址**: `PUT /admin/messages/batch/read`

**请求参数**:

```typescript
{
  ids: number[]  // 消息ID列表
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "批量标记成功",
  "data": {
    "successCount": 5,
    "failureCount": 0,
    "successIds": [1, 2, 3, 4, 5],
    "failureIds": [],
    "errors": []
  },
  "timestamp": 1672531200000
}
```

### 2.8 获取预警消息列表

**接口地址**: `GET /admin/warnings`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| type | string | 否 | 预警类型：system/business/security/other |
| level | string | 否 | 预警级别：critical/high/medium/low |
| status | string | 否 | 状态：pending/processing/resolved/ignored |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "租户套餐即将到期",
        "type": "business",
        "level": "high",
        "status": "pending",
        "content": "租户三鼎劳务有限公司的套餐将于2024-01-31到期",
        "warningTemplateId": 1,
        "businessType": "tenant",
        "businessId": 1,
        "handlerId": 1,
        "handlerName": "管理员",
        "resolvedAt": null,
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  },
  "timestamp": 1672531200000
}
```

### 2.9 获取预警消息详情

**接口地址**: `GET /admin/warnings/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "title": "租户套餐即将到期",
    "type": "business",
    "level": "high",
    "status": "pending",
    "content": "租户三鼎劳务有限公司的套餐将于2024-01-31到期",
    "warningTemplateId": 1,
    "businessType": "tenant",
    "businessId": 1,
    "handlerId": 1,
    "handlerName": "管理员",
    "resolvedAt": null,
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 2.10 处理预警消息

**接口地址**: `PUT /admin/warnings/{id}/handle`

**请求参数**:

```typescript
{
  status: 'resolved' | 'ignored',  // 处理状态
  handlerComment: string              // 处理意见
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "处理成功",
  "data": null,
  "timestamp": 1672531200000
}
```

---

## 3. 招聘管理接口

### 3.1 获取招聘需求列表

**接口地址**: `GET /admin/recruitment/demands`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| factoryId | number | 否 | 工厂ID |
| status | string | 否 | 状态：draft/published/recruiting/completed/cancelled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "demandNo": "RD202401010001",
        "factoryId": 1,
        "factoryName": "某某电子厂",
        "positionName": "普工",
        "positionType": "production",
        "education": "初中",
        "experience": "不限",
        "ageRange": "18-45",
        "gender": "不限",
        "salaryMin": 4000.00,
        "salaryMax": 6000.00,
        "recruitCount": 50,
        "workLocation": "广东省深圳市",
        "workTime": "8:00-17:00",
        "jobDescription": "负责生产线上的产品组装工作",
        "jobRequirements": "身体健康，吃苦耐劳",
        "welfare": "包吃包住，五险一金",
        "status": "published",
        "publishTime": "2024-01-01 10:00:00",
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 30,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3
  },
  "timestamp": 1672531200000
}
```

### 3.2 获取招聘需求详情

**接口地址**: `GET /admin/recruitment/demands/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "demandNo": "RD202401010001",
    "factoryId": 1,
    "factoryName": "某某电子厂",
    "positionName": "普工",
    "positionType": "production",
    "education": "初中",
    "experience": "不限",
    "ageRange": "18-45",
    "gender": "不限",
    "salaryMin": 4000.00,
    "salaryMax": 6000.00,
    "recruitCount": 50,
    "workLocation": "广东省深圳市",
    "workTime": "8:00-17:00",
    "jobDescription": "负责生产线上的产品组装工作",
    "jobRequirements": "身体健康，吃苦耐劳",
    "welfare": "包吃包住，五险一金",
    "status": "published",
    "publishTime": "2024-01-01 10:00:00",
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 3.3 创建招聘需求

**接口地址**: `POST /admin/recruitment/demands`

**请求参数**:

```typescript
{
  factoryId: number,
  factoryName: string,
  positionName: string,
  positionType: string,
  education: string,
  experience: string,
  ageRange: string,
  gender: string,
  salaryMin: number,
  salaryMax: number,
  recruitCount: number,
  workLocation: string,
  workTime: string,
  jobDescription: string,
  jobRequirements: string,
  welfare: string
}
```

**响应示例**:

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1,
    "demandNo": "RD202401010001"
  },
  "timestamp": 1672531200000
}
```

### 3.4 更新招聘需求

**接口地址**: `PUT /admin/recruitment/demands/{id}`

**请求参数**: 路径参数 id，请求体同创建接口

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": null,
  "timestamp": 1672531200000
}
```

### 3.5 删除招聘需求

**接口地址**: `DELETE /admin/recruitment/demands/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "deletedCount": 1,
    "deletedIds": [1]
  },
  "timestamp": 1672531200000
}
```

### 3.6 发布招聘需求

**接口地址**: `PUT /admin/recruitment/demands/{id}/publish`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "发布成功",
  "data": null,
  "timestamp": 1672531200000
}
```

### 3.7 获取简历列表

**接口地址**: `GET /admin/recruitment/resumes`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| workerId | number | 否 | 工人ID |
| status | string | 否 | 状态：draft/submitted/viewed/interviewed/hired/rejected |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "resumeNo": "RS202401010001",
        "workerId": 1,
        "workerName": "张三",
        "gender": "男",
        "age": 25,
        "phone": "13800138000",
        "education": "高中",
        "experience": "2年",
        "expectedSalary": 5000.00,
        "expectedLocation": "广东省深圳市",
        "selfIntroduction": "吃苦耐劳，有责任心",
        "skills": "熟练操作生产线设备",
        "workExperience": "2021-2023年在某某电子厂工作",
        "educationExperience": "2015-2018年在某某高中学习",
        "status": "submitted",
        "submitTime": "2024-01-01 10:00:00",
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  },
  "timestamp": 1672531200000
}
```

### 3.8 获取简历详情

**接口地址**: `GET /admin/recruitment/resumes/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "resumeNo": "RS202401010001",
    "workerId": 1,
    "workerName": "张三",
    "gender": "男",
    "age": 25,
    "phone": "13800138000",
    "education": "高中",
    "experience": "2年",
    "expectedSalary": 5000.00,
    "expectedLocation": "广东省深圳市",
    "selfIntroduction": "吃苦耐劳，有责任心",
    "skills": "熟练操作生产线设备",
    "workExperience": "2021-2023年在某某电子厂工作",
    "educationExperience": "2015-2018年在某某高中学习",
    "status": "submitted",
    "submitTime": "2024-01-01 10:00:00",
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

---

## 4. 结算管理接口

### 4.1 获取转介绍记录列表

**接口地址**: `GET /admin/settlement/referrals`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| referrerId | number | 否 | 介绍人ID |
| status | string | 否 | 状态：pending/confirmed/completed/cancelled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "referralNo": "RF202401010001",
        "referrerId": 1,
        "referrerName": "李四",
        "referrerPhone": "13900139000",
        "refereeId": 2,
        "refereeName": "王五",
        "refereePhone": "13700137000",
        "refereeCompanyId": 1,
        "refereeCompanyName": "三鼎劳务有限公司",
        "refereePosition": "普工",
        "refereeEntryDate": "2024-01-15",
        "commissionRate": 5.00,
        "commissionAmount": 200.00,
        "status": "confirmed",
        "confirmTime": "2024-01-15 10:00:00",
        "completeTime": null,
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-15 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3
  },
  "timestamp": 1672531200000
}
```

### 4.2 获取转介绍记录详情

**接口地址**: `GET /admin/settlement/referrals/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "referralNo": "RF202401010001",
    "referrerId": 1,
    "referrerName": "李四",
    "referrerPhone": "13900139000",
    "refereeId": 2,
    "refereeName": "王五",
    "refereePhone": "13700137000",
    "refereeCompanyId": 1,
    "refereeCompanyName": "三鼎劳务有限公司",
    "refereePosition": "普工",
    "refereeEntryDate": "2024-01-15",
    "commissionRate": 5.00,
    "commissionAmount": 200.00,
    "status": "confirmed",
    "confirmTime": "2024-01-15 10:00:00",
    "completeTime": null,
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-15 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 4.3 获取佣金发放记录列表

**接口地址**: `GET /admin/settlement/commissions`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| commissionType | string | 否 | 佣金类型：referral/pull_new/other |
| status | string | 否 | 状态：pending/paid/failed/cancelled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "recordNo": "CM202401010001",
        "commissionType": "referral",
        "commissionRuleId": 1,
        "receiverId": 1,
        "receiverName": "李四",
        "receiverPhone": "13900139000",
        "commissionAmount": 200.00,
        "businessType": "referral",
        "businessId": 1,
        "paymentMethod": "bank_transfer",
        "paymentAccount": "6222021234567890123",
        "paymentTime": null,
        "status": "pending",
        "payTime": null,
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 40,
    "page": 1,
    "pageSize": 10,
    "totalPages": 4
  },
  "timestamp": 1672531200000
}
```

### 4.4 获取佣金发放记录详情

**接口地址**: `GET /admin/settlement/commissions/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "recordNo": "CM202401010001",
    "commissionType": "referral",
    "commissionRuleId": 1,
    "receiverId": 1,
    "receiverName": "李四",
    "receiverPhone": "13900139000",
    "commissionAmount": 200.00,
    "businessType": "referral",
    "businessId": 1,
    "paymentMethod": "bank_transfer",
    "paymentAccount": "6222021234567890123",
    "paymentTime": null,
    "status": "pending",
    "payTime": null,
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 4.5 支付佣金

**接口地址**: `PUT /admin/settlement/commissions/{id}/pay`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "支付成功",
  "data": null,
  "timestamp": 1672531200000
}
```

### 4.6 获取拉新奖励记录列表

**接口地址**: `GET /admin/settlement/pull-new-rewards`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| referrerId | number | 否 | 邀请人ID |
| newUserType | string | 否 | 新用户类型：worker/labor_company/factory |
| rewardStatus | string | 否 | 奖励状态：pending/confirmed/completed/cancelled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "rewardNo": "PN202401010001",
        "referrerId": 1,
        "referrerName": "李四",
        "referrerPhone": "13900139000",
        "newUserId": 2,
        "newUserName": "王五",
        "newUserPhone": "13700137000",
        "newUserType": "worker",
        "newUserCompanyId": 1,
        "newUserCompanyName": "三鼎劳务有限公司",
        "rewardAmount": 100.00,
        "rewardRuleId": 1,
        "rewardStatus": "confirmed",
        "confirmTime": "2024-01-15 10:00:00",
        "completeTime": null,
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-15 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 35,
    "page": 1,
    "pageSize": 10,
    "totalPages": 4
  },
  "timestamp": 1672531200000
}
```

### 4.7 获取拉新奖励记录详情

**接口地址**: `GET /admin/settlement/pull-new-rewards/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "rewardNo": "PN202401010001",
    "referrerId": 1,
    "referrerName": "李四",
    "referrerPhone": "13900139000",
    "newUserId": 2,
    "newUserName": "王五",
    "newUserPhone": "13700137000",
    "newUserType": "worker",
    "newUserCompanyId": 1,
    "newUserCompanyName": "三鼎劳务有限公司",
    "rewardAmount": 100.00,
    "rewardRuleId": 1,
    "rewardStatus": "confirmed",
    "confirmTime": "2024-01-15 10:00:00",
    "completeTime": null,
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-15 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

---

## 5. 系统管理接口

### 5.1 获取套餐列表

**接口地址**: `GET /admin/packages`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| type | string | 否 | 套餐类型：worker/labor_company/factory |
| status | string | 否 | 状态：enabled/disabled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "packageName": "基础版",
        "packageCode": "BASIC",
        "type": "labor_company",
        "price": 999.00,
        "duration": 365,
        "features": [
          "工人管理",
          "招聘管理",
          "合同管理",
          "考勤管理"
        ],
        "workerLimit": 100,
        "companyLimit": 10,
        "storageLimit": 10737418240,
        "description": "适合小型劳务公司",
        "isDefault": true,
        "sortOrder": 1,
        "status": "enabled",
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "timestamp": 1672531200000
}
```

### 5.2 获取套餐详情

**接口地址**: `GET /admin/packages/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "packageName": "基础版",
    "packageCode": "BASIC",
    "type": "labor_company",
    "price": 999.00,
    "duration": 365,
    "features": [
      "工人管理",
      "招聘管理",
      "合同管理",
      "考勤管理"
    ],
    "workerLimit": 100,
    "companyLimit": 10,
    "storageLimit": 10737418240,
    "description": "适合小型劳务公司",
    "isDefault": true,
    "sortOrder": 1,
    "status": "enabled",
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 5.3 创建套餐

**接口地址**: `POST /admin/packages`

**请求参数**:

```typescript
{
  packageName: string,
  packageCode: string,
  type: 'worker' | 'labor_company' | 'factory',
  price: number,
  duration: number,
  features: string[],
  workerLimit: number,
  companyLimit: number,
  storageLimit: number,
  description: string,
  isDefault: boolean,
  sortOrder: number
}
```

**响应示例**:

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1,
    "packageCode": "BASIC"
  },
  "timestamp": 1672531200000
}
```

### 5.4 更新套餐

**接口地址**: `PUT /admin/packages/{id}`

**请求参数**: 路径参数 id，请求体同创建接口

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": null,
  "timestamp": 1672531200000
}
```

### 5.5 删除套餐

**接口地址**: `DELETE /admin/packages/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "deletedCount": 1,
    "deletedIds": [1]
  },
  "timestamp": 1672531200000
}
```

### 5.6 获取租户列表

**接口地址**: `GET /admin/tenants`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| tenantType | string | 否 | 租户类型：labor_company/factory |
| status | string | 否 | 状态：pending/active/suspended/expired |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "tenantName": "三鼎劳务有限公司",
        "tenantCode": "LD202401010001",
        "tenantType": "labor_company",
        "contactPerson": "张三",
        "contactPhone": "13800138000",
        "contactEmail": "zhangsan@example.com",
        "address": "广东省深圳市",
        "businessLicense": "https://example.com/license.jpg",
        "packageId": 1,
        "expireDate": "2024-12-31 23:59:59",
        "workerCount": 50,
        "companyCount": 5,
        "storageUsed": 5368709120,
        "status": "active",
        "tags": ["优质客户", "长期合作"],
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 20,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  },
  "timestamp": 1672531200000
}
```

### 5.7 获取租户详情

**接口地址**: `GET /admin/tenants/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "tenantName": "三鼎劳务有限公司",
    "tenantCode": "LD202401010001",
    "tenantType": "labor_company",
    "contactPerson": "张三",
    "contactPhone": "13800138000",
    "contactEmail": "zhangsan@example.com",
    "address": "广东省深圳市",
    "businessLicense": "https://example.com/license.jpg",
    "packageId": 1,
    "expireDate": "2024-12-31 23:59:59",
    "workerCount": 50,
    "companyCount": 5,
    "storageUsed": 5368709120,
    "status": "active",
    "tags": ["优质客户", "长期合作"],
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 5.8 审核租户

**接口地址**: `PUT /admin/tenants/{id}/audit`

**请求参数**:

```typescript
{
  auditResult: 'approved' | 'rejected',  // 审核结果
  auditComment: string                    // 审核意见
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "审核成功",
  "data": null,
  "timestamp": 1672531200000
}
```

### 5.9 获取活动列表

**接口地址**: `GET /admin/activities`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| activityType | string | 否 | 活动类型 |
| status | string | 否 | 状态：draft/published/ongoing/ended/cancelled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "activityName": "春节联欢晚会",
        "activityCode": "ACT202401010001",
        "activityType": "entertainment",
        "activityCategory": "文娱活动",
        "coverImage": "https://example.com/cover.jpg",
        "activityDescription": "春节联欢晚会，欢迎大家参加",
        "activityContent": "<p>春节联欢晚会，欢迎大家参加</p>",
        "startTime": "2024-02-10 18:00:00",
        "endTime": "2024-02-10 22:00:00",
        "location": "公司大礼堂",
        "maxParticipants": 200,
        "currentParticipants": 50,
        "registrationStartTime": "2024-01-20 10:00:00",
        "registrationEndTime": "2024-02-09 18:00:00",
        "needApproval": false,
        "rewardPoints": 100,
        "rewardCoins": 50,
        "status": "published",
        "publishTime": "2024-01-20 10:00:00",
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-20 10:00:00",
        "updatedAt": "2024-01-20 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  },
  "timestamp": 1672531200000
}
```

### 5.10 获取活动详情

**接口地址**: `GET /admin/activities/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "activityName": "春节联欢晚会",
    "activityCode": "ACT202401010001",
    "activityType": "entertainment",
    "activityCategory": "文娱活动",
    "coverImage": "https://example.com/cover.jpg",
    "activityDescription": "春节联欢晚会，欢迎大家参加",
    "activityContent": "<p>春节联欢晚会，欢迎大家参加</p>",
    "startTime": "2024-02-10 18:00:00",
    "endTime": "2024-02-10 22:00:00",
    "location": "公司大礼堂",
    "maxParticipants": 200,
    "currentParticipants": 50,
    "registrationStartTime": "2024-01-20 10:00:00",
    "registrationEndTime": "2024-02-09 18:00:00",
    "needApproval": false,
    "rewardPoints": 100,
    "rewardCoins": 50,
    "status": "published",
    "publishTime": "2024-01-20 10:00:00",
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-20 10:00:00",
    "updatedAt": "2024-01-20 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

### 5.11 获取报名记录列表

**接口地址**: `GET /admin/activities/{activityId}/registrations`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| activityId | number | 是 | 活动ID（路径参数） |
| status | string | 否 | 状态：registered/approved/rejected/attended/cancelled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "registrationNo": "RG202401200001",
        "activityId": 1,
        "activityName": "春节联欢晚会",
        "userId": 1,
        "userName": "张三",
        "userPhone": "13800138000",
        "userType": "worker",
        "registrationTime": "2024-01-20 10:00:00",
        "checkInTime": null,
        "checkOutTime": null,
        "attendanceStatus": null,
        "approvalStatus": null,
        "approvalTime": null,
        "approvalComment": null,
        "rewardPoints": 100,
        "rewardCoins": 50,
        "pointsGranted": false,
        "coinsGranted": false,
        "status": "registered",
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-20 10:00:00",
        "updatedAt": "2024-01-20 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  },
  "timestamp": 1672531200000
}
```

### 5.12 获取费用记录列表

**接口地址**: `GET /admin/expenses`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| expenseType | string | 否 | 费用类型 |
| status | string | 否 | 状态：pending/approved/paid/rejected/cancelled |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "expenseNo": "EX202401010001",
        "expenseType": "activity",
        "expenseCategory": "活动费用",
        "expenseAmount": 5000.00,
        "expenseDate": "2024-01-01",
        "payerId": 1,
        "payerName": "张三",
        "payeeId": 2,
        "payeeName": "李四",
        "paymentMethod": "bank_transfer",
        "paymentAccount": "6222021234567890123",
        "businessType": "activity",
        "businessId": 1,
        "description": "春节联欢晚会费用",
        "attachmentIds": ["1", "2"],
        "status": "pending",
        "approvalStatus": "pending",
        "payTime": null,
        "creatorId": 1,
        "departmentId": 1,
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "deletedAt": null,
        "deletedBy": null,
        "remark": null
      }
    ],
    "total": 30,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3
  },
  "timestamp": 1672531200000
}
```

### 5.13 获取费用记录详情

**接口地址**: `GET /admin/expenses/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "expenseNo": "EX202401010001",
    "expenseType": "activity",
    "expenseCategory": "活动费用",
    "expenseAmount": 5000.00,
    "expenseDate": "2024-01-01",
    "payerId": 1,
    "payerName": "张三",
    "payeeId": 2,
    "payeeName": "李四",
    "paymentMethod": "bank_transfer",
    "paymentAccount": "6222021234567890123",
    "businessType": "activity",
    "businessId": 1,
    "description": "春节联欢晚会费用",
    "attachmentIds": ["1", "2"],
    "status": "pending",
    "approvalStatus": "pending",
    "payTime": null,
    "creatorId": 1,
    "departmentId": 1,
    "createdAt": "2024-01-01 10:00:00",
    "updatedAt": "2024-01-01 10:00:00",
    "deletedAt": null,
    "deletedBy": null,
    "remark": null
  },
  "timestamp": 1672531200000
}
```

---

## 6. 文件上传接口

### 6.1 上传文件

**接口地址**: `POST /admin/upload`

**请求参数**: FormData

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 文件 |
| businessType | string | 否 | 业务类型 |
| businessId | number | 否 | 业务ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "1",
    "fileName": "example.jpg",
    "filePath": "/uploads/2024/01/01/example.jpg",
    "fileSize": 102400,
    "fileType": "image/jpeg",
    "url": "https://example.com/uploads/2024/01/01/example.jpg"
  },
  "timestamp": 1672531200000
}
```

### 6.2 批量上传文件

**接口地址**: `POST /admin/upload/batch`

**请求参数**: FormData

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| files | File[] | 是 | 文件列表 |
| businessType | string | 否 | 业务类型 |
| businessId | number | 否 | 业务ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": [
    {
      "fileId": "1",
      "fileName": "example1.jpg",
      "filePath": "/uploads/2024/01/01/example1.jpg",
      "fileSize": 102400,
      "fileType": "image/jpeg",
      "url": "https://example.com/uploads/2024/01/01/example1.jpg"
    },
    {
      "fileId": "2",
      "fileName": "example2.jpg",
      "filePath": "/uploads/2024/01/01/example2.jpg",
      "fileSize": 204800,
      "fileType": "image/jpeg",
      "url": "https://example.com/uploads/2024/01/01/example2.jpg"
    }
  ],
  "timestamp": 1672531200000
}
```

---

## 7. 字典接口

### 7.1 获取字典数据

**接口地址**: `GET /admin/dictionaries/{dictType}`

**请求参数**: 路径参数 dictType（字典类型）

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "dictLabel": "男",
      "dictValue": "male",
      "dictSort": 1,
      "cssClass": "primary",
      "listClass": "default",
      "isDefault": true
    },
    {
      "dictLabel": "女",
      "dictValue": "female",
      "dictSort": 2,
      "cssClass": "success",
      "listClass": "default",
      "isDefault": false
    }
  ],
  "timestamp": 1672531200000
}
```

---

## 8. 菜单接口

### 8.1 获取菜单树

**接口地址**: `GET /admin/menus/tree`

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "parentId": 0,
      "menuName": "工作中心",
      "menuCode": "work_center",
      "menuType": "directory",
      "menuLevel": 1,
      "path": "/work-center",
      "component": null,
      "icon": "Work",
      "permissionCode": null,
      "sortOrder": 1,
      "visible": true,
      "status": "enabled",
      "children": [
        {
          "id": 11,
          "parentId": 1,
          "menuName": "待办任务",
          "menuCode": "work_center_todos",
          "menuType": "menu",
          "menuLevel": 2,
          "path": "/work-center/todos",
          "component": "admin/work-center/Todo",
          "icon": "List",
          "permissionCode": "work_center:todos:view",
          "sortOrder": 1,
          "visible": true,
          "status": "enabled",
          "children": []
        }
      ]
    }
  ],
  "timestamp": 1672531200000
}
```

---

## 9. 部门接口

### 9.1 获取部门树

**接口地址**: `GET /admin/departments/tree`

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "parentId": 0,
      "deptName": "平台管理部",
      "deptCode": "PLATFORM_ADMIN",
      "deptLevel": 1,
      "leaderId": 1,
      "leaderName": "管理员",
      "phone": "13800138000",
      "email": "admin@example.com",
      "address": "广东省深圳市",
      "sortOrder": 1,
      "status": "enabled",
      "children": [
        {
          "id": 11,
          "parentId": 1,
          "deptName": "运营组",
          "deptCode": "PLATFORM_ADMIN_OPERATION",
          "deptLevel": 2,
          "leaderId": 2,
          "leaderName": "运营经理",
          "phone": "13900139000",
          "email": "operation@example.com",
          "address": "广东省深圳市",
          "sortOrder": 1,
          "status": "enabled",
          "children": []
        }
      ]
    }
  ],
  "timestamp": 1672531200000
}
```

---

## 10. 统计数据接口

### 10.1 获取统计数据

**接口地址**: `GET /admin/statistics/{type}`

**请求参数**: 路径参数 type（统计类型）

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 1000,
    "today": 50,
    "week": 300,
    "month": 800,
    "year": 1000,
    "trend": [
      {
        "date": "2024-01-01",
        "value": 50
      },
      {
        "date": "2024-01-02",
        "value": 60
      }
    ]
  },
  "timestamp": 1672531200000
}
```

### 10.2 获取图表数据

**接口地址**: `GET /admin/statistics/{type}/chart`

**请求参数**: 路径参数 type（统计类型）

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "categories": ["一月", "二月", "三月", "四月", "五月", "六月"],
    "series": [
      {
        "name": "招聘需求",
        "data": [120, 132, 101, 134, 90, 230],
        "color": "#409EFF"
      },
      {
        "name": "简历投递",
        "data": [220, 182, 191, 234, 290, 330],
        "color": "#67C23A"
      }
    ]
  },
  "timestamp": 1672531200000
}
```

---

## 11. 操作日志接口

### 11.1 获取操作日志列表

**接口地址**: `GET /admin/operation-logs`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| module | string | 否 | 模块 |
| operation | string | 否 | 操作 |
| status | string | 否 | 状态：success/failure |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "module": "用户管理",
      "operation": "新增用户",
      "method": "POST",
      "requestUrl": "/api/v1/admin/users",
      "requestParams": "{\"username\":\"test\",\"password\":\"123456\"}",
      "responseResult": "{\"code\":200,\"message\":\"创建成功\"}",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "userId": 1,
      "userName": "管理员",
      "tenantId": null,
      "executionTime": 100,
      "status": "success",
      "errorMessage": null,
      "createdAt": "2024-01-01 10:00:00"
    }
  ],
  "timestamp": 1672531200000
}
```

---

## 12. 审批记录接口

### 12.1 获取审批记录列表

**接口地址**: `GET /admin/approval-records`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| businessType | string | 否 | 业务类型 |
| businessId | number | 否 | 业务ID |
| approvalResult | string | 否 | 审批结果：approved/rejected/pending |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "businessType": "expense",
      "businessId": 1,
      "flowName": "费用审批流程",
      "nodeName": "部门经理审批",
      "nodeType": "approval",
      "approverId": 1,
      "approverName": "管理员",
      "approvalTime": "2024-01-01 10:00:00",
      "approvalResult": "approved",
      "approvalComment": "同意",
      "createdAt": "2024-01-01 10:00:00"
    }
  ],
  "timestamp": 1672531200000
}
```

---

## 13. 附件接口

### 13.1 获取附件列表

**接口地址**: `GET /admin/attachments`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| businessType | string | 否 | 业务类型 |
| businessId | number | 否 | 业务ID |
| keyword | string | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "fileName": "example.jpg",
      "filePath": "/uploads/2024/01/01/example.jpg",
      "fileSize": 102400,
      "fileType": "image/jpeg",
      "fileExtension": "jpg",
      "fileMd5": "d41d8cd98f00b204e9800998ecf8427e",
      "businessType": "activity",
      "businessId": 1,
      "uploadUserId": 1,
      "uploadUserName": "管理员",
      "createdAt": "2024-01-01 10:00:00"
    }
  ],
  "timestamp": 1672531200000
}
```

### 13.2 获取附件详情

**接口地址**: `GET /admin/attachments/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "fileName": "example.jpg",
    "filePath": "/uploads/2024/01/01/example.jpg",
    "fileSize": 102400,
    "fileType": "image/jpeg",
    "fileExtension": "jpg",
    "fileMd5": "d41d8cd98f00b204e9800998ecf8427e",
    "businessType": "activity",
    "businessId": 1,
    "uploadUserId": 1,
    "uploadUserName": "管理员",
    "previewUrl": "https://example.com/preview/1",
    "downloadUrl": "https://example.com/download/1",
    "createdAt": "2024-01-01 10:00:00"
  },
  "timestamp": 1672531200000
}
```

### 13.3 删除附件

**接口地址**: `DELETE /admin/attachments/{id}`

**请求参数**: 路径参数 id

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "deletedCount": 1,
    "deletedIds": [1]
  },
  "timestamp": 1672531200000
}
```

---

## 附录

### A. 错误码说明

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 请求参数错误 | 检查请求参数是否正确 |
| 401 | 未授权，请重新登录 | 重新登录获取新的Token |
| 403 | 无权限访问 | 检查用户权限 |
| 404 | 资源不存在 | 检查请求的资源是否存在 |
| 422 | 数据验证失败 | 检查数据是否符合验证规则 |
| 500 | 服务器内部错误 | 联系系统管理员 |
| 503 | 服务暂时不可用 | 稍后重试 |

### B. 常见问题

**Q: 如何获取访问令牌？**

A: 通过登录接口 `/auth/login` 获取访问令牌，将令牌放在请求头的 `Authorization` 字段中，格式为 `Bearer {token}`。

**Q: 如何处理分页？**

A: 所有分页查询接口都支持 `page` 和 `pageSize` 参数，`page` 从1开始，`pageSize` 默认为10。

**Q: 如何处理排序？**

A: 通过 `sortField` 和 `sortOrder` 参数进行排序，`sortOrder` 可选值为 `asc`（升序）和 `desc`（降序）。

**Q: 如何处理搜索？**

A: 通过 `keyword` 参数进行关键词搜索，支持模糊匹配。

**Q: 如何处理筛选？**

A: 通过 `filters` 参数进行筛选，`filters` 是一个对象，包含多个筛选条件。

**Q: 如何处理数据权限？**

A: 系统会根据用户角色的数据权限自动过滤数据，无需手动处理。

---

**文档版本**: v1.0
**创建日期**: 2026-02-26
**最后更新**: 2026-02-26
