# 流程管理模块后端API设计文档

## 文档信息

- **文档版本**: 1.0.0
- **创建日期**: 2026-02-26
- **最后更新**: 2026-02-26
- **作者**: 后端工程师
- **模块名称**: 流程管理模块

---

## 1. 接口概述

### 1.1 模块说明

流程管理模块提供审批流程的完整生命周期管理功能,包括流程的创建、查询、更新、删除等操作。该模块支持多租户、数据权限、操作日志等企业级功能。

### 1.2 接口列表

| 序号 | 接口名称 | HTTP方法 | 接口路径 | 功能说明 |
|------|----------|----------|----------|----------|
| 1 | 获取流程列表 | GET | /api/v1/approval-flows | 分页查询审批流程列表 |
| 2 | 获取流程详情 | GET | /api/v1/approval-flows/{id} | 根据ID获取流程详情 |
| 3 | 创建流程 | POST | /api/v1/approval-flows | 创建新的审批流程 |
| 4 | 更新流程 | PUT | /api/v1/approval-flows/{id} | 更新审批流程信息 |
| 5 | 删除流程 | DELETE | /api/v1/approval-flows/{id} | 删除审批流程(软删除) |

### 1.3 技术栈

- **编程语言**: TypeScript / Node.js
- **框架**: Express.js / Nest.js
- **数据库**: MySQL 8.0+
- **ORM**: TypeORM / Prisma
- **验证**: class-validator
- **日志**: Winston / Pino
- **文档**: Swagger / OpenAPI

---

## 2. 通用规范

### 2.1 统一响应格式

所有接口遵循统一的响应格式:

```typescript
/**
 * 成功响应格式
 */
interface SuccessResponse<T> {
  code: 200 | 201;           // 响应码: 200-成功, 201-创建成功
  message: string;            // 响应消息
  data: T;                    // 响应数据
  timestamp: number;          // 时间戳(毫秒)
}

/**
 * 分页响应格式
 */
interface PageResponse<T> {
  code: 200;
  message: string;
  data: {
    list: T[];                // 数据列表
    total: number;            // 总记录数
    page: number;             // 当前页码
    pageSize: number;         // 每页条数
    totalPages: number;       // 总页数
  };
  timestamp: number;
}

/**
 * 错误响应格式
 */
interface ErrorResponse {
  code: number;               // 错误码
  message: string;            // 错误消息
  errors?: ValidationError[]; // 验证错误详情
  timestamp: number;
}

/**
 * 验证错误详情
 */
interface ValidationError {
  field: string;              // 字段名
  message: string;           // 错误消息
  value?: any;               // 错误值
}
```

### 2.2 响应码定义

| 响应码 | 说明 | HTTP状态码 |
|--------|------|------------|
| 200 | 操作成功 | 200 |
| 201 | 创建成功 | 201 |
| 400 | 请求参数错误 | 400 |
| 401 | 未授权 | 401 |
| 403 | 无权限 | 403 |
| 404 | 资源不存在 | 404 |
| 409 | 数据冲突 | 409 |
| 422 | 数据验证失败 | 422 |
| 500 | 服务器错误 | 500 |

### 2.3 请求头规范

所有请求需要包含以下请求头:

```typescript
{
  'Content-Type': 'application/json;charset=UTF-8',
  'Authorization': 'Bearer {token}',        // 认证令牌
  'X-Tenant-Id': '{tenantId}',             // 租户ID(可选)
  'X-Request-Id': '{requestId}',           // 请求ID(可选)
  'X-User-Agent': '{userAgent}'            // 用户代理(可选)
}
```

### 2.4 分页参数规范

```typescript
interface PageQueryParams {
  page: number;              // 页码,从1开始
  pageSize: number;          // 每页条数,默认10,最大100
  sortField?: string;        // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方向
  keyword?: string;          // 关键字搜索
  filters?: Record<string, any>; // 高级筛选条件
}
```

### 2.5 数据权限过滤

所有列表查询接口需要自动应用数据权限过滤:

```typescript
interface DataPermissionConfig {
  type: 'ALL' | 'DEPARTMENT' | 'DEPARTMENT_AND_BELOW' | 'SELF' | 'CUSTOM';
  departments?: string[];
  includeCreator?: boolean;
  includeManager?: boolean;
  includeContact?: boolean;
}
```

---

## 3. 数据模型

### 3.1 审批流程表 (approval_flow)

```typescript
/**
 * 审批流程实体
 */
class ApprovalFlow {
  /** 审批流程ID */
  id: number;

  /** 流程名称 */
  flowName: string;

  /** 流程编码,唯一标识 */
  flowCode: string;

  /** 流程类型: LEAVE-请假, TRANSFER-调岗, RESIGNATION-离职, REGISTRATION-报名等 */
  flowType: string;

  /** 流程描述 */
  flowDescription?: string;

  /** 流程状态: ENABLED-启用, DISABLED-禁用 */
  flowStatus: 'ENABLED' | 'DISABLED';

  /** 是否默认流程: 0-否, 1-是 */
  isDefault: number;

  /** 流程版本号 */
  version: number;

  /** 租户ID */
  tenantId: number;

  /** 创建时间 */
  createTime: Date;

  /** 更新时间 */
  updateTime: Date;

  /** 创建人 */
  createBy: string;

  /** 更新人 */
  updateBy: string;

  /** 备注 */
  remark?: string;
}
```

### 3.2 审批节点表 (approval_node)

```typescript
/**
 * 审批节点实体
 */
class ApprovalNode {
  /** 审批节点ID */
  id: number;

  /** 审批流程ID */
  flowId: number;

  /** 节点名称 */
  nodeName: string;

  /** 节点编码 */
  nodeCode: string;

  /** 节点类型: APPROVAL-审批节点, CC-抄送节点, CONDITION-条件节点 */
  nodeType: 'APPROVAL' | 'CC' | 'CONDITION';

  /** 节点顺序,从小到大执行 */
  nodeOrder: number;

  /** 审批模式: OR-或签(任一人审批即可), AND-会签(所有人都需审批) */
  approvalMode?: 'OR' | 'AND';

  /** 审批人类型: ROLE-角色, DEPARTMENT-部门, POSITION-岗位, USER-指定用户, FORM_FIELD-表单字段 */
  approverType: 'ROLE' | 'DEPARTMENT' | 'POSITION' | 'USER' | 'FORM_FIELD';

  /** 审批人配置,JSON格式存储审批人ID列表或配置规则 */
  approverConfig?: string;

  /** 抄送人员,JSON格式存储用户ID列表 */
  ccUsers?: string;

  /** 条件配置,JSON格式存储节点跳转条件 */
  conditionConfig?: string;

  /** 是否必经节点: 0-否, 1-是 */
  isRequired?: number;

  /** 是否自动审批: 0-否, 1-是 */
  autoApprove?: number;

  /** 审批超时时间(小时),0表示不限制 */
  timeoutHours?: number;

  /** 超时处理: APPROVE-自动通过, REJECT-自动驳回, REMIND-发送提醒 */
  timeoutAction?: string;

  /** 租户ID */
  tenantId: number;

  /** 创建时间 */
  createTime: Date;

  /** 更新时间 */
  updateTime: Date;

  /** 创建人 */
  createBy: string;

  /** 更新人 */
  updateBy: string;

  /** 备注 */
  remark?: string;
}
```

---

## 4. 接口详细设计

### 4.1 获取流程列表

#### 4.1.1 接口信息

- **接口名称**: 获取流程列表
- **接口路径**: GET /api/v1/approval-flows
- **功能说明**: 分页查询审批流程列表,支持按流程类型、状态筛选和关键字搜索

#### 4.1.2 请求参数

```typescript
/**
 * 查询参数
 */
interface GetApprovalFlowListQuery {
  /** 页码,从1开始,默认1 */
  page: number;

  /** 每页条数,默认10,最大100 */
  pageSize: number;

  /** 流程类型筛选 */
  flowType?: 'LEAVE' | 'TRANSFER' | 'RESIGNATION' | 'REGISTRATION' | string;

  /** 流程状态筛选 */
  flowStatus?: 'ENABLED' | 'DISABLED';

  /** 关键字搜索(流程名称或流程编码) */
  keyword?: string;

  /** 排序字段,默认createTime */
  sortField?: string;

  /** 排序方向,默认desc */
  sortOrder?: 'asc' | 'desc';
}
```

#### 4.1.3 请求示例

```bash
GET /api/v1/approval-flows?page=1&pageSize=10&flowStatus=ENABLED&keyword=请假
```

#### 4.1.4 响应数据

```typescript
/**
 * 成功响应
 */
interface GetApprovalFlowListResponse {
  code: 200;
  message: string;
  data: {
    /** 流程列表 */
    list: ApprovalFlowItem[];
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页条数 */
    pageSize: number;
    /** 总页数 */
    totalPages: number;
  };
  timestamp: number;
}

/**
 * 流程列表项
 */
interface ApprovalFlowItem {
  /** 流程ID */
  id: number;

  /** 流程名称 */
  flowName: string;

  /** 流程编码 */
  flowCode: string;

  /** 流程类型 */
  flowType: string;

  /** 流程描述 */
  flowDescription?: string;

  /** 流程状态 */
  flowStatus: 'ENABLED' | 'DISABLED';

  /** 是否默认流程 */
  isDefault: number;

  /** 流程版本号 */
  version: number;

  /** 节点数量 */
  nodeCount: number;

  /** 创建时间 */
  createTime: string;

  /** 更新时间 */
  updateTime: string;

  /** 创建人 */
  createBy: string;
}
```

#### 4.1.5 响应示例

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "flowName": "请假审批流程",
        "flowCode": "LEAVE_APPROVAL",
        "flowType": "LEAVE",
        "flowDescription": "员工请假审批流程,支持多级审批",
        "flowStatus": "ENABLED",
        "isDefault": 1,
        "version": 1,
        "nodeCount": 3,
        "createTime": "2026-02-26T10:00:00.000Z",
        "updateTime": "2026-02-26T10:00:00.000Z",
        "createBy": "admin"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "timestamp": 1740547200000
}
```

#### 4.1.6 业务逻辑

1. **参数验证**:
   - 验证page和pageSize是否为有效数字
   - 验证page >= 1, pageSize >= 1且pageSize <= 100
   - 验证flowType和flowStatus是否为有效枚举值

2. **数据权限过滤**:
   - 根据当前用户的数据权限配置自动过滤数据
   - 支持全部数据、本部门数据、本人数据等权限类型

3. **查询逻辑**:
   - 构建查询条件,支持多条件组合查询
   - 支持关键字模糊搜索(flowName或flowCode)
   - 支持按字段排序
   - 应用分页逻辑

4. **性能优化**:
   - 使用索引优化查询性能
   - 避免全表扫描
   - 使用缓存减少数据库查询

#### 4.1.7 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 400 | 请求参数错误 | page或pageSize参数无效 |
| 401 | 未授权 | 用户未登录或token过期 |
| 403 | 无权限 | 用户没有查看流程的权限 |
| 500 | 服务器错误 | 查询过程中发生异常 |

#### 4.1.8 代码实现示例

```typescript
/**
 * 获取流程列表
 * @param query 查询参数
 * @returns 流程列表
 */
@Get()
@ApiOperation({ summary: '获取流程列表' })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'pageSize', required: false, type: Number })
@ApiQuery({ name: 'flowType', required: false, type: String })
@ApiQuery({ name: 'flowStatus', required: false, type: String })
@ApiQuery({ name: 'keyword', required: false, type: String })
async getApprovalFlowList(
  @Query() query: GetApprovalFlowListQuery,
  @Req() req: Request
): Promise<PageResponse<ApprovalFlowItem>> {
  try {
    // 1. 参数验证
    const validatedQuery = await this.validateQuery(query);

    // 2. 获取当前用户信息
    const currentUser = await this.getCurrentUser(req);
    const tenantId = currentUser.tenantId;

    // 3. 构建查询条件
    const queryBuilder = this.approvalFlowRepository
      .createQueryBuilder('flow')
      .where('flow.tenantId = :tenantId', { tenantId });

    // 4. 应用筛选条件
    if (validatedQuery.flowType) {
      queryBuilder.andWhere('flow.flowType = :flowType', { flowType: validatedQuery.flowType });
    }

    if (validatedQuery.flowStatus) {
      queryBuilder.andWhere('flow.flowStatus = :flowStatus', { flowStatus: validatedQuery.flowStatus });
    }

    if (validatedQuery.keyword) {
      queryBuilder.andWhere(
        '(flow.flowName LIKE :keyword OR flow.flowCode LIKE :keyword)',
        { keyword: `%${validatedQuery.keyword}%` }
      );
    }

    // 5. 应用数据权限过滤
    await this.applyDataPermission(queryBuilder, currentUser, 'flow');

    // 6. 应用排序
    const sortField = validatedQuery.sortField || 'createTime';
    const sortOrder = validatedQuery.sortOrder || 'DESC';
    queryBuilder.orderBy(`flow.${sortField}`, sortOrder);

    // 7. 应用分页
    const page = validatedQuery.page || 1;
    const pageSize = validatedQuery.pageSize || 10;
    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    // 8. 查询数据
    const [flows, total] = await queryBuilder.getManyAndCount();

    // 9. 查询节点数量
    const flowIds = flows.map(flow => flow.id);
    const nodeCounts = await this.approvalNodeRepository
      .createQueryBuilder('node')
      .select('node.flowId', 'flowId')
      .addSelect('COUNT(*)', 'count')
      .where('node.flowId IN (:...flowIds)', { flowIds })
      .groupBy('node.flowId')
      .getRawMany();

    const nodeCountMap = new Map(
      nodeCounts.map(item => [item.flowId, parseInt(item.count)])
    );

    // 10. 组装返回数据
    const list: ApprovalFlowItem[] = flows.map(flow => ({
      id: flow.id,
      flowName: flow.flowName,
      flowCode: flow.flowCode,
      flowType: flow.flowType,
      flowDescription: flow.flowDescription,
      flowStatus: flow.flowStatus,
      isDefault: flow.isDefault,
      version: flow.version,
      nodeCount: nodeCountMap.get(flow.id) || 0,
      createTime: flow.createTime.toISOString(),
      updateTime: flow.updateTime.toISOString(),
      createBy: flow.createBy
    }));

    // 11. 记录操作日志
    await this.logOperation({
      userId: currentUser.userId,
      userName: currentUser.userName,
      module: '流程管理',
      operation: '查询流程列表',
      requestParams: JSON.stringify(query),
      result: 'success'
    });

    // 12. 返回结果
    return {
      code: 200,
      message: '查询成功',
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      timestamp: Date.now()
    };
  } catch (error) {
    this.logger.error('获取流程列表失败', error);
    throw new InternalServerErrorException('获取流程列表失败');
  }
}

/**
 * 验证查询参数
 */
private async validateQuery(query: GetApprovalFlowListQuery): Promise<GetApprovalFlowListQuery> {
  const errors: ValidationError[] = [];

  // 验证page
  if (query.page !== undefined) {
    if (!Number.isInteger(query.page) || query.page < 1) {
      errors.push({
        field: 'page',
        message: '页码必须是大于等于1的整数',
        value: query.page
      });
    }
  }

  // 验证pageSize
  if (query.pageSize !== undefined) {
    if (!Number.isInteger(query.pageSize) || query.pageSize < 1 || query.pageSize > 100) {
      errors.push({
        field: 'pageSize',
        message: '每页条数必须是1-100之间的整数',
        value: query.pageSize
      });
    }
  }

  // 验证flowType
  if (query.flowType) {
    const validFlowTypes = ['LEAVE', 'TRANSFER', 'RESIGNATION', 'REGISTRATION'];
    if (!validFlowTypes.includes(query.flowType)) {
      errors.push({
        field: 'flowType',
        message: '流程类型无效',
        value: query.flowType
      });
    }
  }

  // 验证flowStatus
  if (query.flowStatus) {
    const validFlowStatuses = ['ENABLED', 'DISABLED'];
    if (!validFlowStatuses.includes(query.flowStatus)) {
      errors.push({
        field: 'flowStatus',
        message: '流程状态无效',
        value: query.flowStatus
      });
    }
  }

  // 如果有验证错误,抛出异常
  if (errors.length > 0) {
    throw new BadRequestException({
      code: 400,
      message: '请求参数错误',
      errors,
      timestamp: Date.now()
    });
  }

  return query;
}
```

---

### 4.2 获取流程详情

#### 4.2.1 接口信息

- **接口名称**: 获取流程详情
- **接口路径**: GET /api/v1/approval-flows/{id}
- **功能说明**: 根据流程ID获取流程详细信息,包括审批节点列表

#### 4.2.2 路径参数

```typescript
/**
 * 路径参数
 */
interface GetApprovalFlowDetailParams {
  /** 流程ID */
  id: number;
}
```

#### 4.2.3 请求示例

```bash
GET /api/v1/approval-flows/1
```

#### 4.2.4 响应数据

```typescript
/**
 * 成功响应
 */
interface GetApprovalFlowDetailResponse {
  code: 200;
  message: string;
  data: ApprovalFlowDetail;
  timestamp: number;
}

/**
 * 流程详情
 */
interface ApprovalFlowDetail {
  /** 流程ID */
  id: number;

  /** 流程名称 */
  flowName: string;

  /** 流程编码 */
  flowCode: string;

  /** 流程类型 */
  flowType: string;

  /** 流程描述 */
  flowDescription?: string;

  /** 流程状态 */
  flowStatus: 'ENABLED' | 'DISABLED';

  /** 是否默认流程 */
  isDefault: number;

  /** 流程版本号 */
  version: number;

  /** 审批节点列表 */
  nodes: ApprovalNodeDetail[];

  /** 创建时间 */
  createTime: string;

  /** 更新时间 */
  updateTime: string;

  /** 创建人 */
  createBy: string;

  /** 更新人 */
  updateBy: string;

  /** 备注 */
  remark?: string;
}

/**
 * 审批节点详情
 */
interface ApprovalNodeDetail {
  /** 节点ID */
  id: number;

  /** 流程ID */
  flowId: number;

  /** 节点名称 */
  nodeName: string;

  /** 节点编码 */
  nodeCode: string;

  /** 节点类型 */
  nodeType: 'APPROVAL' | 'CC' | 'CONDITION';

  /** 节点顺序 */
  nodeOrder: number;

  /** 审批模式 */
  approvalMode?: 'OR' | 'AND';

  /** 审批人类型 */
  approverType: 'ROLE' | 'DEPARTMENT' | 'POSITION' | 'USER' | 'FORM_FIELD';

  /** 审批人配置 */
  approverConfig?: string;

  /** 抄送人员 */
  ccUsers?: string;

  /** 条件配置 */
  conditionConfig?: string;

  /** 是否必经节点 */
  isRequired?: number;

  /** 是否自动审批 */
  autoApprove?: number;

  /** 审批超时时间 */
  timeoutHours?: number;

  /** 超时处理 */
  timeoutAction?: string;

  /** 创建时间 */
  createTime: string;

  /** 更新时间 */
  updateTime: string;

  /** 创建人 */
  createBy: string;

  /** 备注 */
  remark?: string;
}
```

#### 4.2.5 响应示例

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 1,
    "flowName": "请假审批流程",
    "flowCode": "LEAVE_APPROVAL",
    "flowType": "LEAVE",
    "flowDescription": "员工请假审批流程,支持多级审批",
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
        "createTime": "2026-02-26T10:00:00.000Z",
        "updateTime": "2026-02-26T10:00:00.000Z",
        "createBy": "admin"
      },
      {
        "id": 2,
        "flowId": 1,
        "nodeName": "人事审批",
        "nodeCode": "LEAVE_NODE_2",
        "nodeType": "APPROVAL",
        "nodeOrder": 2,
        "approvalMode": "OR",
        "approverType": "POSITION",
        "approverConfig": "{\"position_code\":\"HR_MANAGER\"}",
        "isRequired": 1,
        "autoApprove": 0,
        "createTime": "2026-02-26T10:00:00.000Z",
        "updateTime": "2026-02-26T10:00:00.000Z",
        "createBy": "admin"
      }
    ],
    "createTime": "2026-02-26T10:00:00.000Z",
    "updateTime": "2026-02-26T10:00:00.000Z",
    "createBy": "admin",
    "updateBy": "admin"
  },
  "timestamp": 1740547200000
}
```

#### 4.2.6 业务逻辑

1. **参数验证**:
   - 验证id是否为有效数字
   - 验证id > 0

2. **数据权限检查**:
   - 检查用户是否有权限查看该流程
   - 根据数据权限配置过滤数据

3. **查询逻辑**:
   - 根据ID查询流程基本信息
   - 查询流程的所有审批节点
   - 按节点顺序排序

4. **数据组装**:
   - 组装流程详情数据
   - 包含节点列表

#### 4.2.7 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 400 | 请求参数错误 | id参数无效 |
| 401 | 未授权 | 用户未登录或token过期 |
| 403 | 无权限 | 用户没有查看该流程的权限 |
| 404 | 流程不存在 | 指定ID的流程不存在 |
| 500 | 服务器错误 | 查询过程中发生异常 |

#### 4.2.8 代码实现示例

```typescript
/**
 * 获取流程详情
 * @param id 流程ID
 * @param req 请求对象
 * @returns 流程详情
 */
@Get(':id')
@ApiOperation({ summary: '获取流程详情' })
@ApiParam({ name: 'id', type: Number })
async getApprovalFlowDetail(
  @Param('id') id: number,
  @Req() req: Request
): Promise<SuccessResponse<ApprovalFlowDetail>> {
  try {
    // 1. 参数验证
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException({
        code: 400,
        message: '流程ID无效',
        timestamp: Date.now()
      });
    }

    // 2. 获取当前用户信息
    const currentUser = await this.getCurrentUser(req);
    const tenantId = currentUser.tenantId;

    // 3. 查询流程基本信息
    const flow = await this.approvalFlowRepository.findOne({
      where: { id, tenantId }
    });

    if (!flow) {
      throw new NotFoundException({
        code: 404,
        message: '流程不存在',
        timestamp: Date.now()
      });
    }

    // 4. 数据权限检查
    const hasPermission = await this.checkDataPermission(currentUser, flow);
    if (!hasPermission) {
      throw new ForbiddenException({
        code: 403,
        message: '无权限查看该流程',
        timestamp: Date.now()
      });
    }

    // 5. 查询审批节点
    const nodes = await this.approvalNodeRepository.find({
      where: { flowId: id },
      order: { nodeOrder: 'ASC' }
    });

    // 6. 组装返回数据
    const data: ApprovalFlowDetail = {
      id: flow.id,
      flowName: flow.flowName,
      flowCode: flow.flowCode,
      flowType: flow.flowType,
      flowDescription: flow.flowDescription,
      flowStatus: flow.flowStatus,
      isDefault: flow.isDefault,
      version: flow.version,
      nodes: nodes.map(node => ({
        id: node.id,
        flowId: node.flowId,
        nodeName: node.nodeName,
        nodeCode: node.nodeCode,
        nodeType: node.nodeType,
        nodeOrder: node.nodeOrder,
        approvalMode: node.approvalMode,
        approverType: node.approverType,
        approverConfig: node.approverConfig,
        ccUsers: node.ccUsers,
        conditionConfig: node.conditionConfig,
        isRequired: node.isRequired,
        autoApprove: node.autoApprove,
        timeoutHours: node.timeoutHours,
        timeoutAction: node.timeoutAction,
        createTime: node.createTime.toISOString(),
        updateTime: node.updateTime.toISOString(),
        createBy: node.createBy,
        remark: node.remark
      })),
      createTime: flow.createTime.toISOString(),
      updateTime: flow.updateTime.toISOString(),
      createBy: flow.createBy,
      updateBy: flow.updateBy,
      remark: flow.remark
    };

    // 7. 记录操作日志
    await this.logOperation({
      userId: currentUser.userId,
      userName: currentUser.userName,
      module: '流程管理',
      operation: '查询流程详情',
      requestParams: JSON.stringify({ id }),
      result: 'success'
    });

    // 8. 返回结果
    return {
      code: 200,
      message: '查询成功',
      data,
      timestamp: Date.now()
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    this.logger.error('获取流程详情失败', error);
    throw new InternalServerErrorException('获取流程详情失败');
  }
}
```

---

### 4.3 创建流程

#### 4.3.1 接口信息

- **接口名称**: 创建流程
- **接口路径**: POST /api/v1/approval-flows
- **功能说明**: 创建新的审批流程,包括流程基本信息和审批节点

#### 4.3.2 请求体

```typescript
/**
 * 创建流程请求体
 */
interface CreateApprovalFlowRequest {
  /** 流程名称,必填 */
  flowName: string;

  /** 流程编码,必填,唯一 */
  flowCode: string;

  /** 流程类型,必填 */
  flowType: 'LEAVE' | 'TRANSFER' | 'RESIGNATION' | 'REGISTRATION' | string;

  /** 流程描述,可选 */
  flowDescription?: string;

  /** 流程状态,默认ENABLED */
  flowStatus?: 'ENABLED' | 'DISABLED';

  /** 是否默认流程,默认0 */
  isDefault?: number;

  /** 审批节点列表 */
  nodes?: CreateApprovalNodeRequest[];

  /** 备注 */
  remark?: string;
}

/**
 * 创建审批节点请求体
 */
interface CreateApprovalNodeRequest {
  /** 节点名称,必填 */
  nodeName: string;

  /** 节点编码,必填 */
  nodeCode: string;

  /** 节点类型,必填 */
  nodeType: 'APPROVAL' | 'CC' | 'CONDITION';

  /** 节点顺序,必填 */
  nodeOrder: number;

  /** 审批模式,可选 */
  approvalMode?: 'OR' | 'AND';

  /** 审批人类型,必填 */
  approverType: 'ROLE' | 'DEPARTMENT' | 'POSITION' | 'USER' | 'FORM_FIELD';

  /** 审批人配置,可选 */
  approverConfig?: string;

  /** 抄送人员,可选 */
  ccUsers?: string;

  /** 条件配置,可选 */
  conditionConfig?: string;

  /** 是否必经节点,默认1 */
  isRequired?: number;

  /** 是否自动审批,默认0 */
  autoApprove?: number;

  /** 审批超时时间,可选 */
  timeoutHours?: number;

  /** 超时处理,可选 */
  timeoutAction?: string;

  /** 备注 */
  remark?: string;
}
```

#### 4.3.3 请求示例

```bash
POST /api/v1/approval-flows
Content-Type: application/json

{
  "flowName": "请假审批流程",
  "flowCode": "LEAVE_APPROVAL",
  "flowType": "LEAVE",
  "flowDescription": "员工请假审批流程,支持多级审批",
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
      "isRequired": 1
    },
    {
      "nodeName": "人事审批",
      "nodeCode": "LEAVE_NODE_2",
      "nodeType": "APPROVAL",
      "nodeOrder": 2,
      "approvalMode": "OR",
      "approverType": "POSITION",
      "approverConfig": "{\"position_code\":\"HR_MANAGER\"}",
      "isRequired": 1
    }
  ]
}
```

#### 4.3.4 响应数据

```typescript
/**
 * 成功响应
 */
interface CreateApprovalFlowResponse {
  code: 201;
  message: string;
  data: {
    /** 流程ID */
    id: number;
  };
  timestamp: number;
}
```

#### 4.3.5 响应示例

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 1
  },
  "timestamp": 1740547200000
}
```

#### 4.3.6 业务逻辑

1. **参数验证**:
   - 验证必填字段是否填写
   - 验证字段格式是否正确
   - 验证枚举值是否有效
   - 验证流程编码唯一性

2. **业务规则验证**:
   - 检查流程编码是否已存在
   - 检查节点配置是否有效
   - 检查节点顺序是否连续

3. **数据创建**:
   - 创建流程基本信息
   - 创建审批节点
   - 使用事务保证数据一致性

4. **版本管理**:
   - 新流程版本号为1
   - 记录创建人和创建时间

#### 4.3.7 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 400 | 请求参数错误 | 请求体参数验证失败 |
| 401 | 未授权 | 用户未登录或token过期 |
| 403 | 无权限 | 用户没有创建流程的权限 |
| 409 | 流程编码已存在 | 流程编码重复 |
| 500 | 服务器错误 | 创建过程中发生异常 |

#### 4.3.8 代码实现示例

```typescript
/**
 * 创建流程
 * @param request 创建流程请求
 * @param req 请求对象
 * @returns 创建结果
 */
@Post()
@ApiOperation({ summary: '创建流程' })
@ApiBody({ type: CreateApprovalFlowRequest })
async createApprovalFlow(
  @Body() request: CreateApprovalFlowRequest,
  @Req() req: Request
): Promise<SuccessResponse<{ id: number }>> {
  try {
    // 1. 参数验证
    const errors = await this.validateCreateRequest(request);
    if (errors.length > 0) {
      throw new BadRequestException({
        code: 400,
        message: '请求参数错误',
        errors,
        timestamp: Date.now()
      });
    }

    // 2. 获取当前用户信息
    const currentUser = await this.getCurrentUser(req);
    const tenantId = currentUser.tenantId;

    // 3. 检查流程编码唯一性
    const existingFlow = await this.approvalFlowRepository.findOne({
      where: { flowCode: request.flowCode, tenantId }
    });

    if (existingFlow) {
      throw new ConflictException({
        code: 409,
        message: '流程编码已存在',
        errors: [
          {
            field: 'flowCode',
            message: '流程编码已存在',
            value: request.flowCode
          }
        ],
        timestamp: Date.now()
      });
    }

    // 4. 验证节点配置
    if (request.nodes && request.nodes.length > 0) {
      await this.validateNodes(request.nodes);
    }

    // 5. 使用事务创建流程
    const result = await this.dataSource.transaction(async (transactionalEntityManager) => {
      // 5.1 创建流程基本信息
      const flow = new ApprovalFlow();
      flow.flowName = request.flowName;
      flow.flowCode = request.flowCode;
      flow.flowType = request.flowType;
      flow.flowDescription = request.flowDescription;
      flow.flowStatus = request.flowStatus || 'ENABLED';
      flow.isDefault = request.isDefault || 0;
      flow.version = 1;
      flow.tenantId = tenantId;
      flow.createBy = currentUser.userName;
      flow.updateBy = currentUser.userName;
      flow.remark = request.remark;

      const savedFlow = await transactionalEntityManager.save(flow);

      // 5.2 创建审批节点
      if (request.nodes && request.nodes.length > 0) {
        const nodes = request.nodes.map(node => {
          const approvalNode = new ApprovalNode();
          approvalNode.flowId = savedFlow.id;
          approvalNode.nodeName = node.nodeName;
          approvalNode.nodeCode = node.nodeCode;
          approvalNode.nodeType = node.nodeType;
          approvalNode.nodeOrder = node.nodeOrder;
          approvalNode.approvalMode = node.approvalMode;
          approvalNode.approverType = node.approverType;
          approvalNode.approverConfig = node.approverConfig;
          approvalNode.ccUsers = node.ccUsers;
          approvalNode.conditionConfig = node.conditionConfig;
          approvalNode.isRequired = node.isRequired ?? 1;
          approvalNode.autoApprove = node.autoApprove ?? 0;
          approvalNode.timeoutHours = node.timeoutHours;
          approvalNode.timeoutAction = node.timeoutAction;
          approvalNode.tenantId = tenantId;
          approvalNode.createBy = currentUser.userName;
          approvalNode.updateBy = currentUser.userName;
          approvalNode.remark = node.remark;
          return approvalNode;
        });

        await transactionalEntityManager.save(nodes);
      }

      return savedFlow;
    });

    // 6. 记录操作日志
    await this.logOperation({
      userId: currentUser.userId,
      userName: currentUser.userName,
      module: '流程管理',
      operation: '创建流程',
      requestParams: JSON.stringify(request),
      result: 'success'
    });

    // 7. 返回结果
    return {
      code: 201,
      message: '创建成功',
      data: { id: result.id },
      timestamp: Date.now()
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    this.logger.error('创建流程失败', error);
    throw new InternalServerErrorException('创建流程失败');
  }
}

/**
 * 验证创建请求
 */
private async validateCreateRequest(
  request: CreateApprovalFlowRequest
): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];

  // 验证flowName
  if (!request.flowName || request.flowName.trim().length === 0) {
    errors.push({
      field: 'flowName',
      message: '流程名称不能为空'
    });
  } else if (request.flowName.length > 100) {
    errors.push({
      field: 'flowName',
      message: '流程名称长度不能超过100个字符',
      value: request.flowName
    });
  }

  // 验证flowCode
  if (!request.flowCode || request.flowCode.trim().length === 0) {
    errors.push({
      field: 'flowCode',
      message: '流程编码不能为空'
    });
  } else if (!/^[A-Z0-9_]+$/.test(request.flowCode)) {
    errors.push({
      field: 'flowCode',
      message: '流程编码只能包含大写字母、数字和下划线',
      value: request.flowCode
    });
  } else if (request.flowCode.length > 50) {
    errors.push({
      field: 'flowCode',
      message: '流程编码长度不能超过50个字符',
      value: request.flowCode
    });
  }

  // 验证flowType
  if (!request.flowType || request.flowType.trim().length === 0) {
    errors.push({
      field: 'flowType',
      message: '流程类型不能为空'
    });
  }

  // 验证flowDescription
  if (request.flowDescription && request.flowDescription.length > 500) {
    errors.push({
      field: 'flowDescription',
      message: '流程描述长度不能超过500个字符',
      value: request.flowDescription
    });
  }

  // 验证flowStatus
  if (request.flowStatus) {
    const validFlowStatuses = ['ENABLED', 'DISABLED'];
    if (!validFlowStatuses.includes(request.flowStatus)) {
      errors.push({
        field: 'flowStatus',
        message: '流程状态无效',
        value: request.flowStatus
      });
    }
  }

  // 验证isDefault
  if (request.isDefault !== undefined) {
    if (request.isDefault !== 0 && request.isDefault !== 1) {
      errors.push({
        field: 'isDefault',
        message: '是否默认流程只能是0或1',
        value: request.isDefault
      });
    }
  }

  // 验证nodes
  if (request.nodes && request.nodes.length > 0) {
    request.nodes.forEach((node, index) => {
      if (!node.nodeName || node.nodeName.trim().length === 0) {
        errors.push({
          field: `nodes[${index}].nodeName`,
          message: '节点名称不能为空'
        });
      }

      if (!node.nodeCode || node.nodeCode.trim().length === 0) {
        errors.push({
          field: `nodes[${index}].nodeCode`,
          message: '节点编码不能为空'
        });
      }

      if (!node.nodeType) {
        errors.push({
          field: `nodes[${index}].nodeType`,
          message: '节点类型不能为空'
        });
      }

      if (!node.nodeOrder || node.nodeOrder < 1) {
        errors.push({
          field: `nodes[${index}].nodeOrder`,
          message: '节点顺序必须大于0',
          value: node.nodeOrder
        });
      }

      if (!node.approverType) {
        errors.push({
          field: `nodes[${index}].approverType`,
          message: '审批人类型不能为空'
        });
      }
    });
  }

  return errors;
}

/**
 * 验证节点配置
 */
private async validateNodes(nodes: CreateApprovalNodeRequest[]): Promise<void> {
  // 检查节点编码是否重复
  const nodeCodes = nodes.map(node => node.nodeCode);
  const duplicateCodes = nodeCodes.filter((code, index) => nodeCodes.indexOf(code) !== index);

  if (duplicateCodes.length > 0) {
    throw new BadRequestException({
      code: 400,
      message: '节点编码重复',
      errors: duplicateCodes.map(code => ({
        field: 'nodeCode',
        message: `节点编码${code}重复`,
        value: code
      })),
      timestamp: Date.now()
    });
  }

  // 检查节点顺序是否连续
  const sortedOrders = [...new Set(nodes.map(node => node.nodeOrder))].sort((a, b) => a - b);
  for (let i = 0; i < sortedOrders.length; i++) {
    if (sortedOrders[i] !== i + 1) {
      throw new BadRequestException({
        code: 400,
        message: '节点顺序必须从1开始连续',
        timestamp: Date.now()
      });
    }
  }
}
```

---

### 4.4 更新流程

#### 4.4.1 接口信息

- **接口名称**: 更新流程
- **接口路径**: PUT /api/v1/approval-flows/{id}
- **功能说明**: 更新审批流程信息,包括流程基本信息和审批节点

#### 4.4.2 路径参数

```typescript
/**
 * 路径参数
 */
interface UpdateApprovalFlowParams {
  /** 流程ID */
  id: number;
}
```

#### 4.4.3 请求体

```typescript
/**
 * 更新流程请求体
 */
interface UpdateApprovalFlowRequest {
  /** 流程名称 */
  flowName?: string;

  /** 流程编码 */
  flowCode?: string;

  /** 流程类型 */
  flowType?: 'LEAVE' | 'TRANSFER' | 'RESIGNATION' | 'REGISTRATION' | string;

  /** 流程描述 */
  flowDescription?: string;

  /** 流程状态 */
  flowStatus?: 'ENABLED' | 'DISABLED';

  /** 是否默认流程 */
  isDefault?: number;

  /** 审批节点列表 */
  nodes?: UpdateApprovalNodeRequest[];

  /** 备注 */
  remark?: string;
}

/**
 * 更新审批节点请求体
 */
interface UpdateApprovalNodeRequest {
  /** 节点ID(更新时必填,新增时不填) */
  id?: number;

  /** 节点名称 */
  nodeName?: string;

  /** 节点编码 */
  nodeCode?: string;

  /** 节点类型 */
  nodeType?: 'APPROVAL' | 'CC' | 'CONDITION';

  /** 节点顺序 */
  nodeOrder?: number;

  /** 审批模式 */
  approvalMode?: 'OR' | 'AND';

  /** 审批人类型 */
  approverType?: 'ROLE' | 'DEPARTMENT' | 'POSITION' | 'USER' | 'FORM_FIELD';

  /** 审批人配置 */
  approverConfig?: string;

  /** 抄送人员 */
  ccUsers?: string;

  /** 条件配置 */
  conditionConfig?: string;

  /** 是否必经节点 */
  isRequired?: number;

  /** 是否自动审批 */
  autoApprove?: number;

  /** 审批超时时间 */
  timeoutHours?: number;

  /** 超时处理 */
  timeoutAction?: string;

  /** 备注 */
  remark?: string;
}
```

#### 4.4.4 请求示例

```bash
PUT /api/v1/approval-flows/1
Content-Type: application/json

{
  "flowName": "请假审批流程(更新)",
  "flowDescription": "员工请假审批流程,支持多级审批,已更新",
  "flowStatus": "ENABLED",
  "nodes": [
    {
      "id": 1,
      "nodeName": "部门主管审批",
      "nodeCode": "LEAVE_NODE_1",
      "nodeType": "APPROVAL",
      "nodeOrder": 1,
      "approvalMode": "OR",
      "approverType": "POSITION",
      "approverConfig": "{\"position_code\":\"DEPT_MANAGER\"}",
      "isRequired": 1
    },
    {
      "id": 2,
      "nodeName": "人事审批",
      "nodeCode": "LEAVE_NODE_2",
      "nodeType": "APPROVAL",
      "nodeOrder": 2,
      "approvalMode": "OR",
      "approverType": "POSITION",
      "approverConfig": "{\"position_code\":\"HR_MANAGER\"}",
      "isRequired": 1
    },
    {
      "nodeName": "总经理审批",
      "nodeCode": "LEAVE_NODE_3",
      "nodeType": "APPROVAL",
      "nodeOrder": 3,
      "approvalMode": "OR",
      "approverType": "POSITION",
      "approverConfig": "{\"position_code\":\"GENERAL_MANAGER\"}",
      "isRequired": 0
    }
  ]
}
```

#### 4.4.5 响应数据

```typescript
/**
 * 成功响应
 */
interface UpdateApprovalFlowResponse {
  code: 200;
  message: string;
  data: ApprovalFlowDetail;
  timestamp: number;
}
```

#### 4.4.6 响应示例

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "flowName": "请假审批流程(更新)",
    "flowCode": "LEAVE_APPROVAL",
    "flowType": "LEAVE",
    "flowDescription": "员工请假审批流程,支持多级审批,已更新",
    "flowStatus": "ENABLED",
    "isDefault": 1,
    "version": 2,
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
        "createTime": "2026-02-26T10:00:00.000Z",
        "updateTime": "2026-02-26T11:00:00.000Z",
        "createBy": "admin"
      }
    ],
    "createTime": "2026-02-26T10:00:00.000Z",
    "updateTime": "2026-02-26T11:00:00.000Z",
    "createBy": "admin",
    "updateBy": "admin"
  },
  "timestamp": 1740550800000
}
```

#### 4.4.7 业务逻辑

1. **参数验证**:
   - 验证id是否为有效数字
   - 验证请求体参数格式
   - 验证枚举值是否有效

2. **数据检查**:
   - 检查流程是否存在
   - 检查流程编码唯一性(排除自己)
   - 检查流程是否被使用

3. **数据权限检查**:
   - 检查用户是否有权限更新该流程

4. **数据更新**:
   - 更新流程基本信息
   - 更新审批节点(增删改)
   - 使用事务保证数据一致性

5. **版本管理**:
   - 流程版本号自动递增
   - 记录更新人和更新时间

#### 4.4.8 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 400 | 请求参数错误 | 请求体参数验证失败 |
| 401 | 未授权 | 用户未登录或token过期 |
| 403 | 无权限 | 用户没有更新该流程的权限 |
| 404 | 流程不存在 | 指定ID的流程不存在 |
| 409 | 流程编码已存在 | 流程编码重复 |
| 500 | 服务器错误 | 更新过程中发生异常 |

#### 4.4.9 代码实现示例

```typescript
/**
 * 更新流程
 * @param id 流程ID
 * @param request 更新流程请求
 * @param req 请求对象
 * @returns 更新结果
 */
@Put(':id')
@ApiOperation({ summary: '更新流程' })
@ApiParam({ name: 'id', type: Number })
@ApiBody({ type: UpdateApprovalFlowRequest })
async updateApprovalFlow(
  @Param('id') id: number,
  @Body() request: UpdateApprovalFlowRequest,
  @Req() req: Request
): Promise<SuccessResponse<ApprovalFlowDetail>> {
  try {
    // 1. 参数验证
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException({
        code: 400,
        message: '流程ID无效',
        timestamp: Date.now()
      });
    }

    const errors = await this.validateUpdateRequest(request);
    if (errors.length > 0) {
      throw new BadRequestException({
        code: 400,
        message: '请求参数错误',
        errors,
        timestamp: Date.now()
      });
    }

    // 2. 获取当前用户信息
    const currentUser = await this.getCurrentUser(req);
    const tenantId = currentUser.tenantId;

    // 3. 查询流程
    const flow = await this.approvalFlowRepository.findOne({
      where: { id, tenantId }
    });

    if (!flow) {
      throw new NotFoundException({
        code: 404,
        message: '流程不存在',
        timestamp: Date.now()
      });
    }

    // 4. 数据权限检查
    const hasPermission = await this.checkDataPermission(currentUser, flow);
    if (!hasPermission) {
      throw new ForbiddenException({
        code: 403,
        message: '无权限更新该流程',
        timestamp: Date.now()
      });
    }

    // 5. 检查流程编码唯一性
    if (request.flowCode && request.flowCode !== flow.flowCode) {
      const existingFlow = await this.approvalFlowRepository.findOne({
        where: { flowCode: request.flowCode, tenantId }
      });

      if (existingFlow) {
        throw new ConflictException({
          code: 409,
          message: '流程编码已存在',
          errors: [
            {
              field: 'flowCode',
              message: '流程编码已存在',
              value: request.flowCode
            }
          ],
          timestamp: Date.now()
        });
      }
    }

    // 6. 检查流程是否被使用
    const isUsed = await this.checkFlowInUse(id);
    if (isUsed) {
      throw new BadRequestException({
        code: 400,
        message: '流程正在使用中,无法修改',
        timestamp: Date.now()
      });
    }

    // 7. 验证节点配置
    if (request.nodes && request.nodes.length > 0) {
      await this.validateNodes(request.nodes);
    }

    // 8. 使用事务更新流程
    const updatedFlow = await this.dataSource.transaction(async (transactionalEntityManager) => {
      // 8.1 更新流程基本信息
      if (request.flowName) flow.flowName = request.flowName;
      if (request.flowCode) flow.flowCode = request.flowCode;
      if (request.flowType) flow.flowType = request.flowType;
      if (request.flowDescription !== undefined) flow.flowDescription = request.flowDescription;
      if (request.flowStatus) flow.flowStatus = request.flowStatus;
      if (request.isDefault !== undefined) flow.isDefault = request.isDefault;
      if (request.remark !== undefined) flow.remark = request.remark;
      flow.version += 1;
      flow.updateBy = currentUser.userName;

      const savedFlow = await transactionalEntityManager.save(flow);

      // 8.2 更新审批节点
      if (request.nodes && request.nodes.length > 0) {
        // 获取现有节点
        const existingNodes = await transactionalEntityManager.find(ApprovalNode, {
          where: { flowId: id }
        });

        // 删除不在请求中的节点
        const requestNodeIds = request.nodes.filter(n => n.id).map(n => n.id);
        const nodesToDelete = existingNodes.filter(n => !requestNodeIds.includes(n.id));

        if (nodesToDelete.length > 0) {
          await transactionalEntityManager.remove(nodesToDelete);
        }

        // 更新或创建节点
        for (const nodeRequest of request.nodes) {
          if (nodeRequest.id) {
            // 更新现有节点
            const existingNode = existingNodes.find(n => n.id === nodeRequest.id);
            if (existingNode) {
              if (nodeRequest.nodeName) existingNode.nodeName = nodeRequest.nodeName;
              if (nodeRequest.nodeCode) existingNode.nodeCode = nodeRequest.nodeCode;
              if (nodeRequest.nodeType) existingNode.nodeType = nodeRequest.nodeType;
              if (nodeRequest.nodeOrder) existingNode.nodeOrder = nodeRequest.nodeOrder;
              if (nodeRequest.approvalMode) existingNode.approvalMode = nodeRequest.approvalMode;
              if (nodeRequest.approverType) existingNode.approverType = nodeRequest.approverType;
              if (nodeRequest.approverConfig !== undefined) existingNode.approverConfig = nodeRequest.approverConfig;
              if (nodeRequest.ccUsers !== undefined) existingNode.ccUsers = nodeRequest.ccUsers;
              if (nodeRequest.conditionConfig !== undefined) existingNode.conditionConfig = nodeRequest.conditionConfig;
              if (nodeRequest.isRequired !== undefined) existingNode.isRequired = nodeRequest.isRequired;
              if (nodeRequest.autoApprove !== undefined) existingNode.autoApprove = nodeRequest.autoApprove;
              if (nodeRequest.timeoutHours !== undefined) existingNode.timeoutHours = nodeRequest.timeoutHours;
              if (nodeRequest.timeoutAction) existingNode.timeoutAction = nodeRequest.timeoutAction;
              if (nodeRequest.remark !== undefined) existingNode.remark = nodeRequest.remark;
              existingNode.updateBy = currentUser.userName;

              await transactionalEntityManager.save(existingNode);
            }
          } else {
            // 创建新节点
            const newNode = new ApprovalNode();
            newNode.flowId = savedFlow.id;
            newNode.nodeName = nodeRequest.nodeName;
            newNode.nodeCode = nodeRequest.nodeCode;
            newNode.nodeType = nodeRequest.nodeType;
            newNode.nodeOrder = nodeRequest.nodeOrder;
            newNode.approvalMode = nodeRequest.approvalMode;
            newNode.approverType = nodeRequest.approverType;
            newNode.approverConfig = nodeRequest.approverConfig;
            newNode.ccUsers = nodeRequest.ccUsers;
            newNode.conditionConfig = nodeRequest.conditionConfig;
            newNode.isRequired = nodeRequest.isRequired ?? 1;
            newNode.autoApprove = nodeRequest.autoApprove ?? 0;
            newNode.timeoutHours = nodeRequest.timeoutHours;
            newNode.timeoutAction = nodeRequest.timeoutAction;
            newNode.tenantId = tenantId;
            newNode.createBy = currentUser.userName;
            newNode.updateBy = currentUser.userName;
            newNode.remark = nodeRequest.remark;

            await transactionalEntityManager.save(newNode);
          }
        }
      }

      return savedFlow;
    });

    // 9. 查询更新后的流程详情
    const nodes = await this.approvalNodeRepository.find({
      where: { flowId: id },
      order: { nodeOrder: 'ASC' }
    });

    // 10. 组装返回数据
    const data: ApprovalFlowDetail = {
      id: updatedFlow.id,
      flowName: updatedFlow.flowName,
      flowCode: updatedFlow.flowCode,
      flowType: updatedFlow.flowType,
      flowDescription: updatedFlow.flowDescription,
      flowStatus: updatedFlow.flowStatus,
      isDefault: updatedFlow.isDefault,
      version: updatedFlow.version,
      nodes: nodes.map(node => ({
        id: node.id,
        flowId: node.flowId,
        nodeName: node.nodeName,
        nodeCode: node.nodeCode,
        nodeType: node.nodeType,
        nodeOrder: node.nodeOrder,
        approvalMode: node.approvalMode,
        approverType: node.approverType,
        approverConfig: node.approverConfig,
        ccUsers: node.ccUsers,
        conditionConfig: node.conditionConfig,
        isRequired: node.isRequired,
        autoApprove: node.autoApprove,
        timeoutHours: node.timeoutHours,
        timeoutAction: node.timeoutAction,
        createTime: node.createTime.toISOString(),
        updateTime: node.updateTime.toISOString(),
        createBy: node.createBy,
        remark: node.remark
      })),
      createTime: updatedFlow.createTime.toISOString(),
      updateTime: updatedFlow.updateTime.toISOString(),
      createBy: updatedFlow.createBy,
      updateBy: updatedFlow.updateBy,
      remark: updatedFlow.remark
    };

    // 11. 记录操作日志
    await this.logOperation({
      userId: currentUser.userId,
      userName: currentUser.userName,
      module: '流程管理',
      operation: '更新流程',
      requestParams: JSON.stringify({ id, ...request }),
      result: 'success'
    });

    // 12. 返回结果
    return {
      code: 200,
      message: '更新成功',
      data,
      timestamp: Date.now()
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    this.logger.error('更新流程失败', error);
    throw new InternalServerErrorException('更新流程失败');
  }
}

/**
 * 验证更新请求
 */
private async validateUpdateRequest(
  request: UpdateApprovalFlowRequest
): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];

  // 验证flowName
  if (request.flowName !== undefined) {
    if (request.flowName.trim().length === 0) {
      errors.push({
        field: 'flowName',
        message: '流程名称不能为空'
      });
    } else if (request.flowName.length > 100) {
      errors.push({
        field: 'flowName',
        message: '流程名称长度不能超过100个字符',
        value: request.flowName
      });
    }
  }

  // 验证flowCode
  if (request.flowCode !== undefined) {
    if (request.flowCode.trim().length === 0) {
      errors.push({
        field: 'flowCode',
        message: '流程编码不能为空'
      });
    } else if (!/^[A-Z0-9_]+$/.test(request.flowCode)) {
      errors.push({
        field: 'flowCode',
        message: '流程编码只能包含大写字母、数字和下划线',
        value: request.flowCode
      });
    } else if (request.flowCode.length > 50) {
      errors.push({
        field: 'flowCode',
        message: '流程编码长度不能超过50个字符',
        value: request.flowCode
      });
    }
  }

  // 验证flowType
  if (request.flowType !== undefined && request.flowType.trim().length === 0) {
    errors.push({
      field: 'flowType',
      message: '流程类型不能为空'
    });
  }

  // 验证flowDescription
  if (request.flowDescription !== undefined && request.flowDescription.length > 500) {
    errors.push({
      field: 'flowDescription',
      message: '流程描述长度不能超过500个字符',
      value: request.flowDescription
    });
  }

  // 验证flowStatus
  if (request.flowStatus !== undefined) {
    const validFlowStatuses = ['ENABLED', 'DISABLED'];
    if (!validFlowStatuses.includes(request.flowStatus)) {
      errors.push({
        field: 'flowStatus',
        message: '流程状态无效',
        value: request.flowStatus
      });
    }
  }

  // 验证isDefault
  if (request.isDefault !== undefined) {
    if (request.isDefault !== 0 && request.isDefault !== 1) {
      errors.push({
        field: 'isDefault',
        message: '是否默认流程只能是0或1',
        value: request.isDefault
      });
    }
  }

  return errors;
}

/**
 * 检查流程是否被使用
 */
private async checkFlowInUse(flowId: number): Promise<boolean> {
  // 检查是否有正在进行的审批
  const inProgressCount = await this.businessApprovalStatusRepository.count({
    where: {
      flowId,
      approvalStatus: In(['PENDING', 'IN_PROGRESS'])
    }
  });

  return inProgressCount > 0;
}
```

---

### 4.5 删除流程

#### 4.5.1 接口信息

- **接口名称**: 删除流程
- **接口路径**: DELETE /api/v1/approval-flows/{id}
- **功能说明**: 删除审批流程(软删除),验证流程是否被使用

#### 4.5.2 路径参数

```typescript
/**
 * 路径参数
 */
interface DeleteApprovalFlowParams {
  /** 流程ID */
  id: number;
}
```

#### 4.5.3 请求示例

```bash
DELETE /api/v1/approval-flows/1
```

#### 4.5.4 响应数据

```typescript
/**
 * 成功响应
 */
interface DeleteApprovalFlowResponse {
  code: 200;
  message: string;
  data: {
    /** 删除的流程ID */
    id: number;
  };
  timestamp: number;
}
```

#### 4.5.5 响应示例

```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "id": 1
  },
  "timestamp": 1740547200000
}
```

#### 4.5.6 业务逻辑

1. **参数验证**:
   - 验证id是否为有效数字
   - 验证id > 0

2. **数据检查**:
   - 检查流程是否存在
   - 检查流程是否被使用(有正在进行的审批)
   - 检查流程是否为默认流程

3. **数据权限检查**:
   - 检查用户是否有权限删除该流程

4. **数据删除**:
   - 执行软删除操作
   - 删除相关的审批节点(级联删除)
   - 记录删除人和删除时间

#### 4.5.7 错误处理

| 错误码 | 错误消息 | 说明 |
|--------|----------|------|
| 400 | 请求参数错误 | id参数无效 |
| 401 | 未授权 | 用户未登录或token过期 |
| 403 | 无权限 | 用户没有删除该流程的权限 |
| 404 | 流程不存在 | 指定ID的流程不存在 |
| 409 | 流程正在使用中 | 流程有正在进行的审批,无法删除 |
| 500 | 服务器错误 | 删除过程中发生异常 |

#### 4.5.8 代码实现示例

```typescript
/**
 * 删除流程
 * @param id 流程ID
 * @param req 请求对象
 * @returns 删除结果
 */
@Delete(':id')
@ApiOperation({ summary: '删除流程' })
@ApiParam({ name: 'id', type: Number })
async deleteApprovalFlow(
  @Param('id') id: number,
  @Req() req: Request
): Promise<SuccessResponse<{ id: number }>> {
  try {
    // 1. 参数验证
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException({
        code: 400,
        message: '流程ID无效',
        timestamp: Date.now()
      });
    }

    // 2. 获取当前用户信息
    const currentUser = await this.getCurrentUser(req);
    const tenantId = currentUser.tenantId;

    // 3. 查询流程
    const flow = await this.approvalFlowRepository.findOne({
      where: { id, tenantId }
    });

    if (!flow) {
      throw new NotFoundException({
        code: 404,
        message: '流程不存在',
        timestamp: Date.now()
      });
    }

    // 4. 数据权限检查
    const hasPermission = await this.checkDataPermission(currentUser, flow);
    if (!hasPermission) {
      throw new ForbiddenException({
        code: 403,
        message: '无权限删除该流程',
        timestamp: Date.now()
      });
    }

    // 5. 检查流程是否为默认流程
    if (flow.isDefault === 1) {
      throw new BadRequestException({
        code: 400,
        message: '默认流程不能删除',
        timestamp: Date.now()
      });
    }

    // 6. 检查流程是否被使用
    const isUsed = await this.checkFlowInUse(id);
    if (isUsed) {
      throw new ConflictException({
        code: 409,
        message: '流程正在使用中,无法删除',
        timestamp: Date.now()
      });
    }

    // 7. 执行软删除
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // 删除审批节点(级联删除)
      await transactionalEntityManager.delete(ApprovalNode, { flowId: id });

      // 删除流程
      await transactionalEntityManager.delete(ApprovalFlow, { id });
    });

    // 8. 记录操作日志
    await this.logOperation({
      userId: currentUser.userId,
      userName: currentUser.userName,
      module: '流程管理',
      operation: '删除流程',
      requestParams: JSON.stringify({ id }),
      result: 'success'
    });

    // 9. 返回结果
    return {
      code: 200,
      message: '删除成功',
      data: { id },
      timestamp: Date.now()
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    this.logger.error('删除流程失败', error);
    throw new InternalServerErrorException('删除流程失败');
  }
}
```

---

## 5. 辅助功能

### 5.1 数据权限过滤

```typescript
/**
 * 应用数据权限过滤
 * @param queryBuilder 查询构建器
 * @param currentUser 当前用户
 * @param alias 表别名
 */
private async applyDataPermission(
  queryBuilder: SelectQueryBuilder<any>,
  currentUser: any,
  alias: string
): Promise<void> {
  const dataPermission = currentUser.dataPermission;

  switch (dataPermission.type) {
    case 'ALL':
      // 全部数据,不添加过滤条件
      break;

    case 'DEPARTMENT':
      // 本部门数据
      queryBuilder.andWhere(`${alias}.createBy IN (
        SELECT username FROM user WHERE department_id = :departmentId
      )`, { departmentId: currentUser.departmentId });
      break;

    case 'DEPARTMENT_AND_BELOW':
      // 本部门及下属部门数据
      queryBuilder.andWhere(`${alias}.createBy IN (
        SELECT username FROM user
        WHERE department_id IN (
          SELECT id FROM department
          WHERE id = :departmentId OR parent_id = :departmentId
        )
      )`, { departmentId: currentUser.departmentId });
      break;

    case 'SELF':
      // 本人数据
      queryBuilder.andWhere(`${alias}.createBy = :username`, {
        username: currentUser.username
      });
      break;

    case 'CUSTOM':
      // 自定义部门数据
      if (dataPermission.departments && dataPermission.departments.length > 0) {
        queryBuilder.andWhere(`${alias}.createBy IN (
          SELECT username FROM user WHERE department_id IN (:...departmentIds)
        )`, { departmentIds: dataPermission.departments });
      }
      break;
  }
}

/**
 * 检查数据权限
 * @param currentUser 当前用户
 * @param flow 流程数据
 * @returns 是否有权限
 */
private async checkDataPermission(
  currentUser: any,
  flow: ApprovalFlow
): Promise<boolean> {
  const dataPermission = currentUser.dataPermission;

  switch (dataPermission.type) {
    case 'ALL':
      return true;

    case 'DEPARTMENT':
    case 'DEPARTMENT_AND_BELOW':
    case 'CUSTOM':
      // 需要查询创建人所属部门
      const creator = await this.userRepository.findOne({
        where: { username: flow.createBy }
      });
      if (!creator) return false;

      if (dataPermission.type === 'DEPARTMENT') {
        return creator.departmentId === currentUser.departmentId;
      } else if (dataPermission.type === 'DEPARTMENT_AND_BELOW') {
        // 检查是否为本部门或下属部门
        return await this.isDepartmentOrBelow(creator.departmentId, currentUser.departmentId);
      } else {
        // 自定义部门
        return dataPermission.departments?.includes(creator.departmentId) || false;
      }

    case 'SELF':
      return flow.createBy === currentUser.username;

    default:
      return false;
  }
}

/**
 * 检查是否为本部门或下属部门
 */
private async isDepartmentOrBelow(
  departmentId: number,
  currentDepartmentId: number
): Promise<boolean> {
  if (departmentId === currentDepartmentId) return true;

  const department = await this.departmentRepository.findOne({
    where: { id: departmentId }
  });

  if (!department || !department.parentId) return false;

  return await this.isDepartmentOrBelow(department.parentId, currentDepartmentId);
}
```

### 5.2 操作日志记录

```typescript
/**
 * 记录操作日志
 * @param log 日志信息
 */
private async logOperation(log: {
  userId: number;
  userName: string;
  module: string;
  operation: string;
  requestParams?: string;
  result: string;
}): Promise<void> {
  try {
    const operationLog = new OperationLog();
    operationLog.userId = log.userId;
    operationLog.userName = log.userName;
    operationLog.module = log.module;
    operationLog.operation = log.operation;
    operationLog.requestParams = log.requestParams;
    operationLog.responseResult = log.result;
    operationLog.ipAddress = this.getClientIp();
    operationLog.userAgent = this.getClientUserAgent();
    operationLog.status = 'success';
    operationLog.tenantId = this.getCurrentTenantId();

    await this.operationLogRepository.save(operationLog);
  } catch (error) {
    this.logger.error('记录操作日志失败', error);
    // 不抛出异常,避免影响主流程
  }
}
```

### 5.3 获取当前用户信息

```typescript
/**
 * 获取当前用户信息
 * @param req 请求对象
 * @returns 用户信息
 */
private async getCurrentUser(req: Request): Promise<any> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new UnauthorizedException({
      code: 401,
      message: '未授权',
      timestamp: Date.now()
    });
  }

  // 解析token获取用户信息
  const userInfo = await this.jwtService.verify(token);

  // 查询用户详细信息
  const user = await this.userRepository.findOne({
    where: { id: userInfo.userId },
    relations: ['department', 'position', 'roles']
  });

  if (!user) {
    throw new UnauthorizedException({
      code: 401,
      message: '用户不存在',
      timestamp: Date.now()
    });
  }

  return {
    userId: user.id,
    username: user.username,
    realName: user.realName,
    tenantId: user.tenantId,
    departmentId: user.departmentId,
    positionId: user.positionId,
    roles: user.roles,
    dataPermission: user.dataPermission
  };
}
```

---

## 6. 数据库索引优化

### 6.1 推荐索引

```sql
-- 审批流程表索引
CREATE INDEX idx_approval_flow_tenant_status ON approval_flow(tenant_id, flow_status);
CREATE INDEX idx_approval_flow_tenant_type ON approval_flow(tenant_id, flow_type);
CREATE INDEX idx_approval_flow_tenant_code ON approval_flow(tenant_id, flow_code);

-- 审批节点表索引
CREATE INDEX idx_approval_node_flow_order ON approval_node(flow_id, node_order);
CREATE INDEX idx_approval_node_tenant_type ON approval_node(tenant_id, node_type);

-- 业务审批状态表索引
CREATE INDEX idx_business_status_tenant_status ON business_approval_status(tenant_id, approval_status);
CREATE INDEX idx_business_status_business ON business_approval_status(business_code, business_id);
```

### 6.2 查询优化建议

1. **使用索引**: 确保查询条件使用索引字段
2. **避免SELECT ***: 只查询需要的字段
3. **使用分页**: 避免一次性查询大量数据
4. **使用缓存**: 对热点数据使用缓存
5. **优化JOIN**: 减少不必要的JOIN操作

---

## 7. 安全性考虑

### 7.1 SQL注入防护

- 使用参数化查询
- 使用ORM框架
- 避免拼接SQL语句

### 7.2 XSS防护

- 对用户输入进行过滤
- 对输出进行转义
- 使用CSP策略

### 7.3 CSRF防护

- 使用CSRF Token
- 验证Referer头
- 使用SameSite Cookie

### 7.4 权限控制

- 基于角色的访问控制(RBAC)
- 基于数据的访问控制
- 接口级别的权限验证

---

## 8. 性能优化

### 8.1 数据库优化

- 合理使用索引
- 优化SQL查询
- 使用连接池
- 读写分离

### 8.2 缓存策略

- Redis缓存热点数据
- 缓存流程配置
- 缓存用户权限

### 8.3 异步处理

- 使用消息队列处理耗时操作
- 异步记录操作日志
- 异步发送通知

---

## 9. 测试用例

### 9.1 单元测试

```typescript
describe('ApprovalFlowController', () => {
  let controller: ApprovalFlowController;
  let service: ApprovalFlowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApprovalFlowController],
      providers: [ApprovalFlowService],
    }).compile();

    controller = module.get<ApprovalFlowController>(ApprovalFlowController);
    service = module.get<ApprovalFlowService>(ApprovalFlowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getApprovalFlowList', () => {
    it('should return flow list', async () => {
      const result = await controller.getApprovalFlowList({
        page: 1,
        pageSize: 10
      }, mockRequest);

      expect(result.code).toBe(200);
      expect(result.data.list).toBeInstanceOf(Array);
    });
  });
});
```

### 9.2 集成测试

```typescript
describe('ApprovalFlowController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/approval-flows (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/approval-flows?page=1&pageSize=10')
      .expect(200)
      .expect(res => {
        expect(res.body.code).toBe(200);
        expect(res.body.data).toHaveProperty('list');
        expect(res.body.data).toHaveProperty('total');
      });
  });
});
```

---

## 10. 部署说明

### 10.1 环境要求

- Node.js >= 16.0.0
- MySQL >= 8.0
- Redis >= 6.0

### 10.2 环境变量

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=blue_collar_platform

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 服务配置
PORT=3000
NODE_ENV=production
```

### 10.3 部署步骤

1. 安装依赖: `npm install`
2. 构建项目: `npm run build`
3. 初始化数据库: `npm run migration:run`
4. 启动服务: `npm run start:prod`

---

## 11. 附录

### 11.1 错误码对照表

| 错误码 | 说明 | HTTP状态码 |
|--------|------|------------|
| 200 | 操作成功 | 200 |
| 201 | 创建成功 | 201 |
| 400 | 请求参数错误 | 400 |
| 401 | 未授权 | 401 |
| 403 | 无权限 | 403 |
| 404 | 资源不存在 | 404 |
| 409 | 数据冲突 | 409 |
| 422 | 数据验证失败 | 422 |
| 500 | 服务器错误 | 500 |

### 11.2 流程类型枚举

| 流程类型 | 流程编码 | 说明 |
|----------|----------|------|
| 请假管理 | LEAVE | 员工请假审批 |
| 调岗管理 | TRANSFER | 员工调岗审批 |
| 离职管理 | RESIGNATION | 员工离职审批 |
| 报名管理 | REGISTRATION | 活动报名审批 |

### 11.3 流程状态枚举

| 流程状态 | 流程编码 | 说明 |
|----------|----------|------|
| 启用 | ENABLED | 流程可用 |
| 禁用 | DISABLED | 流程不可用 |

### 11.4 节点类型枚举

| 节点类型 | 节点编码 | 说明 |
|----------|----------|------|
| 审批节点 | APPROVAL | 需要审批的节点 |
| 抄送节点 | CC | 仅抄送,不需要审批 |
| 条件节点 | CONDITION | 根据条件判断是否进入 |

### 11.5 审批模式枚举

| 审批模式 | 审批编码 | 说明 |
|----------|----------|------|
| 或签 | OR | 任一人审批即可 |
| 会签 | AND | 所有人都需要审批 |

### 11.6 审批人类型枚举

| 审批人类型 | 审批编码 | 说明 |
|------------|----------|------|
| 角色 | ROLE | 指定角色审批 |
| 部门 | DEPARTMENT | 指定部门审批 |
| 岗位 | POSITION | 指定岗位审批 |
| 指定用户 | USER | 指定用户审批 |
| 表单字段 | FORM_FIELD | 根据表单字段动态确定审批人 |

---

## 12. 更新日志

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|----------|------|
| 1.0.0 | 2026-02-26 | 初始版本,完成5个核心接口设计 | 后端工程师 |

---

## 13. 联系方式

- **文档维护**: 后端工程师
- **技术支持**: tech-support@example.com
- **问题反馈**: issues@example.com

---

**文档结束**
