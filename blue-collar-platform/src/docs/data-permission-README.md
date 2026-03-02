# 数据权限过滤功能

## 功能概述

数据权限过滤功能为蓝领智汇SaaS系统提供了灵活的数据权限控制机制，支持多种权限类型和自定义部门选择，确保用户只能访问其权限范围内的数据。

## 核心功能

### 1. 数据权限类型

- **全部数据（ALL）**：查看所有数据
- **本部门数据（DEPARTMENT）**：仅查看本部门数据
- **本部门及以下（DEPARTMENT_AND_BELOW）**：查看本部门及下属部门数据
- **本人数据（SELF）**：仅查看本人创建/负责的数据
- **自定义（CUSTOM）**：自定义选择部门数据权限

### 2. 特殊权限配置

- **包含创建人**：可以查看本人创建的数据
- **包含负责人**：可以查看本人负责的数据
- **包含对接人**：可以查看本人对接的数据

### 3. 数据权限缓存机制

- 缓存用户数据权限配置
- 缓存部门层级结构
- 缓存用户角色和岗位信息
- 支持手动刷新缓存
- 30分钟自动过期

## 文件结构

```
src/
├── types/
│   └── data-permission.ts              # 数据权限类型定义
├── utils/
│   └── dataPermissionUtil.ts          # 数据权限工具类
├── middleware/
│   └── dataPermissionMiddleware.ts     # 数据权限中间件
├── services/
│   └── dataPermissionService.ts       # 数据权限API服务
├── composables/
│   └── useDataPermission.ts           # 数据权限Composable
├── components/
│   └── DataPermissionSelector.vue      # 数据权限选择器组件
└── views/
    └── common/
        └── DataPermission.vue          # 数据权限管理页面
```

## 使用指南

### 1. 初始化数据权限

在应用启动时初始化数据权限：

```typescript
import { useDataPermission } from '@/composables/useDataPermission'

const {
  initialize,
  refresh,
  userDataPermission,
  isAdmin
} = useDataPermission()

// 初始化数据权限
await initialize()

// 刷新数据权限
await refresh()
```

### 2. 使用数据权限中间件

在API请求拦截器中集成数据权限中间件：

```typescript
import { createDataPermissionMiddleware } from '@/middleware/dataPermissionMiddleware'
import { useDataPermission } from '@/composables/useDataPermission'

const { userDataPermission, departmentTree } = useDataPermission()

// 创建中间件实例
const middleware = createDataPermissionMiddleware({
  enabled: true,
  userId: userDataPermission.value?.userId || '',
  departmentId: userDataPermission.value?.departmentId || '',
  dataPermission: userDataPermission.value?.dataPermission || { type: 'DEPARTMENT' },
  departmentTree: departmentTree.value,
  filterPaths: ['/api/v1/workers/list', '/api/v1/recruitment/list'],
  excludePaths: ['/api/v1/public']
})

// 在axios拦截器中使用
axios.interceptors.request.use((config) => {
  return middleware.interceptRequest(config)
})
```

### 3. 在组件中使用数据权限

```vue
<template>
  <div>
    <el-button @click="handleEditPermission">编辑权限</el-button>
    <el-table :data="filteredWorkers">
      <!-- 表格内容 -->
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useDataPermission } from '@/composables/useDataPermission'

const {
  userDataPermission,
  isAdmin,
  hasPermission,
  filterData,
  generateFilter
} = useDataPermission()

// 获取数据权限过滤条件
const filter = generateFilter()

// 检查是否有权限访问某条数据
const canAccess = hasPermission(workerData)

// 过滤数据列表
const filteredWorkers = filterData(workersList)
</script>
```

### 4. 使用数据权限选择器组件

```vue
<template>
  <DataPermissionSelector
    v-model="permissionConfig"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataPermissionSelector from '@/components/DataPermissionSelector.vue'
import type { DataPermissionConfig } from '@/types/data-permission'

const permissionConfig = ref<DataPermissionConfig>({
  type: 'DEPARTMENT',
  includeCreator: false,
  includeManager: false,
  includeContact: false
})

const handleSave = (config: DataPermissionConfig) => {
  console.log('保存权限配置:', config)
}

const handleCancel = () => {
  console.log('取消操作')
}
</script>
```

### 5. 数据权限管理页面

在路由中配置数据权限管理页面：

```typescript
{
  path: '/data-permission',
  name: 'DataPermission',
  component: () => import('@/views/common/DataPermission.vue'),
  meta: {
    title: '数据权限管理',
    requiresAuth: true
  }
}
```

## API接口

### 获取用户数据权限

```
GET /api/v1/data-permission/user
```

响应：
```json
{
  "userId": "user001",
  "username": "张三",
  "departmentId": "dept001",
  "departmentName": "人力资源部",
  "positionId": "pos001",
  "positionName": "人事专员",
  "dataPermission": {
    "type": "DEPARTMENT_AND_BELOW",
    "includeCreator": false,
    "includeManager": false,
    "includeContact": false
  },
  "isAdmin": false
}
```

### 获取部门树结构

```
GET /api/v1/data-permission/departments/tree
```

响应：
```json
[
  {
    "id": "dept001",
    "name": "人力资源部",
    "parentId": "",
    "code": "HR",
    "level": 1,
    "children": [
      {
        "id": "dept001-1",
        "name": "招聘组",
        "parentId": "dept001",
        "code": "HR-REC",
        "level": 2
      }
    ]
  }
]
```

### 更新数据权限配置

```
PUT /api/v1/data-permission/update
```

请求体：
```json
{
  "type": "DEPARTMENT_AND_BELOW",
  "includeCreator": false,
  "includeManager": false,
  "includeContact": false
}
```

### 申请数据权限

```
POST /api/v1/data-permission/apply
```

请求体：
```json
{
  "permissionType": "ALL",
  "departments": ["dept001", "dept002"],
  "reason": "需要查看所有部门的数据"
}
```

### 获取申请记录

```
GET /api/v1/data-permission/applications?page=1&pageSize=10&status=pending
```

响应：
```json
{
  "list": [
    {
      "id": "app001",
      "applicantId": "user001",
      "applicantName": "张三",
      "permissionType": "ALL",
      "reason": "需要查看所有部门的数据",
      "status": "pending",
      "createdAt": "2026-02-20T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### 审批数据权限申请

```
POST /api/v1/data-permission/applications/{applicationId}/approve
```

请求体：
```json
{
  "approved": true,
  "comment": "同意"
}
```

### 撤销数据权限申请

```
POST /api/v1/data-permission/applications/{applicationId}/withdraw
```

## 权限过滤规则

### 全部数据（ALL）

- 不添加任何过滤条件
- 可以查看所有数据

### 本部门数据（DEPARTMENT）

- 添加部门ID过滤条件
- 只能查看本部门的数据

### 本部门及以下（DEPARTMENT_AND_BELOW）

- 添加部门ID及其所有子部门过滤条件
- 可以查看本部门及所有下属部门的数据

### 本人数据（SELF）

- 添加创建人ID过滤条件
- 只能查看本人创建的数据

### 自定义（CUSTOM）

- 添加用户选择的部门ID过滤条件
- 可以查看指定部门的数据

## 工具类方法

### DataPermissionUtil

```typescript
import DataPermissionUtil from '@/utils/dataPermissionUtil'

// 设置缓存
DataPermissionUtil.setCache(cache)

// 获取缓存
const cache = DataPermissionUtil.getCache()

// 清除缓存
DataPermissionUtil.clearCache()

// 生成过滤条件
const filter = DataPermissionUtil.generateFilter(
  config,
  userId,
  departmentId,
  departmentTree
)

// 获取部门及其所有子部门ID
const departmentIds = DataPermissionUtil.getDepartmentAndBelow(
  departmentId,
  departmentTree
)

// 构建部门映射表
const departmentMap = DataPermissionUtil.buildDepartmentMap(departmentTree)

// 获取部门路径
const path = DataPermissionUtil.getDepartmentPath(departmentId, departmentMap)

// 检查数据权限是否有效
const isValid = DataPermissionUtil.isValidPermission(config)

// 获取权限类型描述
const description = DataPermissionUtil.getPermissionTypeDescription(type)

// 合并多个过滤条件
const merged = DataPermissionUtil.mergeFilters([filter1, filter2])

// 将过滤条件转换为查询参数
const params = DataPermissionUtil.filterToQueryParams(filter)

// 从查询参数解析过滤条件
const filter = DataPermissionUtil.queryParamsToFilter(params)
```

## 最佳实践

### 1. 权限配置原则

- 管理员账户：配置为全部数据权限
- 部门负责人：配置为本部门及以下权限
- 普通员工：配置为本部门数据权限
- 特殊岗位：根据业务需求配置自定义权限

### 2. 性能优化

- 使用缓存机制减少API调用
- 在前端进行数据过滤，减少后端压力
- 合理设置缓存过期时间

### 3. 安全考虑

- 所有列表查询都应应用数据权限过滤
- 敏感操作需要二次验证
- 定期审计数据权限配置

### 4. 用户体验

- 提供清晰的权限类型说明
- 支持权限预览功能
- 提供权限申请流程

## 注意事项

1. **权限继承**：子部门会继承父部门的权限配置
2. **权限叠加**：特殊权限会与主权限类型叠加生效
3. **权限优先级**：管理员权限 > 自定义权限 > 部门权限 > 个人权限
4. **缓存一致性**：修改权限配置后需要刷新缓存
5. **API兼容**：确保后端API支持数据权限过滤参数

## 扩展功能

### 1. 数据权限审计

记录数据权限的变更历史，包括：
- 权限类型变更
- 部门选择变更
- 特殊权限配置变更
- 变更时间和操作人

### 2. 数据权限统计

统计数据权限的使用情况：
- 各权限类型的用户数量
- 数据访问量统计
- 权限申请通过率

### 3. 数据权限推荐

根据用户行为智能推荐合适的数据权限配置

## 常见问题

### Q: 如何切换Mock数据和真实API？

A: 在 `dataPermissionService.ts` 中修改 `useMock` 属性：

```typescript
private useMock = false // 改为false使用真实API
```

### Q: 如何自定义数据权限过滤规则？

A: 可以通过继承 `DataPermissionMiddleware` 类并重写 `generateFilter` 方法来实现自定义过滤规则。

### Q: 如何处理权限不足的情况？

A: 在中间件的 `interceptResponseError` 方法中处理403错误，给用户友好的提示。

## 技术支持

如有问题，请联系技术支持团队或查看项目文档。
