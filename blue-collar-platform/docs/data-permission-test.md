# 数据权限测试文档

## 测试环境

- 项目路径: `E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform`
- 测试时间: 2026-02-26
- 测试人员: 前端开发工程师

## 测试目标

验证流程管理、流程配置和待办任务三个页面的数据权限过滤功能是否正常工作。

## 测试场景

### 1. 管理员账户测试

**测试账号**: 平台管理员
**预期结果**: 可以查看所有数据,不受数据权限限制

**测试步骤**:
1. 使用管理员账号登录系统
2. 访问流程管理页面 (`/admin/system/flow-management`)
3. 访问流程配置页面 (`/admin/system/flow-config`)
4. 访问待办任务页面 (`/admin/work-center/todo`)
5. 验证所有数据都能正常显示

**验证点**:
- ✅ 流程列表显示所有流程
- ✅ 流程配置列表显示所有配置
- ✅ 待办任务列表显示所有任务
- ✅ 数据权限过滤条件为空或不生效

### 2. 本部门数据权限测试

**测试账号**: 劳务公司正式员工(数据权限: 本部门数据)
**预期结果**: 只能查看本部门创建的数据

**测试步骤**:
1. 使用本部门数据权限账号登录系统
2. 访问流程管理页面
3. 访问流程配置页面
4. 访问待办任务页面
5. 验证只显示本部门的数据

**验证点**:
- ✅ 流程列表只显示本部门创建的流程
- ✅ 流程配置列表只显示本部门的配置
- ✅ 待办任务列表只显示本部门的任务
- ✅ 查询参数中包含 `departmentIds`

### 3. 本部门及以下数据权限测试

**测试账号**: 劳务公司部门经理(数据权限: 本部门及以下)
**预期结果**: 可以查看本部门及下属部门的数据

**测试步骤**:
1. 使用本部门及以下数据权限账号登录系统
2. 访问流程管理页面
3. 访问流程配置页面
4. 访问待办任务页面
5. 验证显示本部门及下属部门的数据

**验证点**:
- ✅ 流程列表显示本部门及下属部门的流程
- ✅ 流程配置列表显示本部门及下属部门的配置
- ✅ 待办任务列表显示本部门及下属部门的任务
- ✅ 查询参数中包含多个 `departmentIds`

### 4. 本人数据权限测试

**测试账号**: 劳务公司普通员工(数据权限: 本人数据)
**预期结果**: 只能查看自己创建的数据

**测试步骤**:
1. 使用本人数据权限账号登录系统
2. 访问流程管理页面
3. 访问流程配置页面
4. 访问待办任务页面
5. 验证只显示自己创建的数据

**验证点**:
- ✅ 流程列表只显示自己创建的流程
- ✅ 流程配置列表只显示自己创建的配置
- ✅ 待办任务列表只显示自己创建的任务
- ✅ 查询参数中包含 `creatorId`

### 5. 自定义部门数据权限测试

**测试账号**: 劳务公司跨部门员工(数据权限: 自定义部门)
**预期结果**: 只能查看指定部门的数据

**测试步骤**:
1. 使用自定义部门数据权限账号登录系统
2. 访问流程管理页面
3. 访问流程配置页面
4. 访问待办任务页面
5. 验证只显示指定部门的数据

**验证点**:
- ✅ 流程列表只显示指定部门的流程
- ✅ 流程配置列表只显示指定部门的配置
- ✅ 待办任务列表只显示指定部门的任务
- ✅ 查询参数中包含自定义的 `departmentIds`

## 测试代码示例

### 测试流程管理页面数据权限

```typescript
// 在浏览器控制台中执行
import { useDataPermission } from '@/composables/useDataPermission'

const { initialize, generateFilter, isAdmin } = useDataPermission()

// 初始化数据权限
await initialize()

// 生成过滤条件
const filter = generateFilter()
console.log('数据权限过滤条件:', filter)

// 检查是否是管理员
console.log('是否是管理员:', isAdmin.value)
```

### 测试流程配置页面数据权限

```typescript
// 在浏览器控制台中执行
import { useDataPermission } from '@/composables/useDataPermission'

const { initialize, generateFilter, isAdmin, currentDataPermission } = useDataPermission()

// 初始化数据权限
await initialize()

// 查看当前数据权限配置
console.log('当前数据权限配置:', currentDataPermission.value)

// 生成过滤条件
const filter = generateFilter()
console.log('数据权限过滤条件:', filter)
```

### 测试待办任务页面数据权限

```typescript
// 在浏览器控制台中执行
import { useDataPermission } from '@/composables/useDataPermission'

const { initialize, generateFilter, isAdmin, hasSpecialPermission } = useDataPermission()

// 初始化数据权限
await initialize()

// 检查是否有特殊权限
console.log('是否有特殊权限:', hasSpecialPermission.value)

// 生成过滤条件
const filter = generateFilter()
console.log('数据权限过滤条件:', filter)
```

## 测试结果记录

### 流程管理页面测试结果

| 测试场景 | 测试结果 | 备注 |
|---------|---------|------|
| 管理员账户 | ⏳ 待测试 | |
| 本部门数据权限 | ⏳ 待测试 | |
| 本部门及以下数据权限 | ⏳ 待测试 | |
| 本人数据权限 | ⏳ 待测试 | |
| 自定义部门数据权限 | ⏳ 待测试 | |

### 流程配置页面测试结果

| 测试场景 | 测试结果 | 备注 |
|---------|---------|------|
| 管理员账户 | ⏳ 待测试 | |
| 本部门数据权限 | ⏳ 待测试 | |
| 本部门及以下数据权限 | ⏳ 待测试 | |
| 本人数据权限 | ⏳ 待测试 | |
| 自定义部门数据权限 | ⏳ 待测试 | |

### 待办任务页面测试结果

| 测试场景 | 测试结果 | 备注 |
|---------|---------|------|
| 管理员账户 | ⏳ 待测试 | |
| 本部门数据权限 | ⏳ 待测试 | |
| 本部门及以下数据权限 | ⏳ 待测试 | |
| 本人数据权限 | ⏳ 待测试 | |
| 自定义部门数据权限 | ⏳ 待测试 | |

## 已知问题

暂无已知问题。

## 测试总结

### 测试完成度

- 流程管理页面: 0/5 测试场景完成
- 流程配置页面: 0/5 测试场景完成
- 待办任务页面: 0/5 测试场景完成

### 测试结论

待测试完成后填写。

## 附录

### 相关文件

- 流程管理页面: [FlowManagement.vue](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\views\admin\system\FlowManagement.vue)
- 流程配置页面: [FlowConfigList.vue](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\views\admin\system\FlowConfigList.vue)
- 待办任务页面: [Todo.vue](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\views\admin\work-center\Todo.vue)
- 数据权限Composable: [useDataPermission.ts](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\composables\useDataPermission.ts)
- 数据权限工具类: [dataPermissionUtil.ts](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\utils\dataPermissionUtil.ts)

### API接口文档

- 流程管理API: [flowConfigApi.ts](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\api\system\flowConfigApi.ts)
- 工作中心API: [workCenterApi.ts](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\api\workCenterApi.ts)

### 类型定义

- 流程配置类型: [flow-config.ts](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\types\flow-config.ts)
- 工作中心类型: [work-center.ts](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\types\work-center.ts)
- 数据权限类型: [data-permission.ts](file:///E:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\types\data-permission.ts)
