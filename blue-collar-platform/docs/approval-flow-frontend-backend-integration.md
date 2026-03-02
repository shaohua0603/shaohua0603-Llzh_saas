# 流程管理模块前后端集成指南

## 文档信息

- **文档版本**: 1.0.0
- **创建日期**: 2026-02-26
- **最后更新**: 2026-02-26
- **作者**: 后端工程师

---

## 1. 概述

本文档说明如何将流程管理模块的后端API设计与现有的前端代码集成。前端项目使用Vue 3 + TypeScript + Element Plus,后端API设计遵循RESTful规范。

---

## 2. 前端API接口文件

### 2.1 现有API文件

项目已经存在流程配置API接口文件:

- **文件路径**: `e:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\api\system\flowConfigApi.ts`
- **功能**: 定义流程管理相关的API接口方法

### 2.2 API接口方法说明

现有API文件已经包含了以下接口方法:

```typescript
// 流程管理接口
getApprovalFlowList(params: ApprovalFlowQueryParams)
getApprovalFlowDetail(id: number)
createApprovalFlow(data: ApprovalFlowForm)
updateApprovalFlow(id: number, data: ApprovalFlowForm)
deleteApprovalFlow(id: number)
updateApprovalFlowStatus(id: number, flowStatus: string)
checkFlowCode(flowCode: string, id?: number)
```

### 2.3 与后端API的对应关系

| 前端方法 | 后端接口 | HTTP方法 | 说明 |
|----------|----------|----------|------|
| getApprovalFlowList | /api/v1/approval-flows | GET | 获取流程列表 |
| getApprovalFlowDetail | /api/v1/approval-flows/{id} | GET | 获取流程详情 |
| createApprovalFlow | /api/v1/approval-flows | POST | 创建流程 |
| updateApprovalFlow | /api/v1/approval-flows/{id} | PUT | 更新流程 |
| deleteApprovalFlow | /api/v1/approval-flows/{id} | DELETE | 删除流程 |
| updateApprovalFlowStatus | /api/v1/approval-flows/{id}/status | PUT | 更新流程状态 |
| checkFlowCode | /api/v1/approval-flows/check-code | GET | 检查流程编码 |

---

## 3. 类型定义文件

### 3.1 现有类型定义

项目已经存在流程配置类型定义文件:

- **文件路径**: `e:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\types\flow-config.ts`
- **功能**: 定义流程管理相关的TypeScript类型

### 3.2 类型定义说明

类型定义文件包含了以下类型:

```typescript
// 枚举类型
FlowStatus          // 流程状态
NodeType            // 节点类型
ApprovalMode        // 审批模式
ApproverType        // 审批人类型
ApprovalResult      // 审批结果
BusinessApprovalStatus  // 业务审批状态
TaskType            // 任务类型
TaskStatus          // 任务状态
Priority            // 优先级

// 接口类型
ApprovalFlow        // 审批流程
ApprovalFlowQueryParams  // 流程查询参数
ApprovalFlowForm    // 流程表单
ApprovalNode        // 审批节点
FlowBusinessConfig  // 流程配置
ApprovalRecord      // 审批记录
TodoTask            // 待办任务
```

### 3.3 与后端数据模型的对应关系

| 前端类型 | 后端实体 | 说明 |
|----------|----------|------|
| ApprovalFlow | ApprovalFlow | 审批流程 |
| ApprovalNode | ApprovalNode | 审批节点 |
| ApprovalFlowQueryParams | GetApprovalFlowListQuery | 查询参数 |
| ApprovalFlowForm | CreateApprovalFlowRequest | 创建请求 |
| ApprovalFlowForm | UpdateApprovalFlowRequest | 更新请求 |

---

## 4. Mock数据文件

### 4.1 现有Mock数据

项目已经存在流程配置Mock数据文件:

- **文件路径**: `e:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\mock\flowConfigMock.ts`
- **功能**: 模拟API接口的响应数据

### 4.2 Mock数据说明

Mock数据文件包含了以下数据:

```typescript
// Mock数据
approvalFlows          // 审批流程列表
approvalNodes          // 审批节点列表
flowBusinessConfigs    // 流程配置列表
approvalRecords        // 审批记录列表
businessApprovalStatuses  // 业务审批状态列表
todoTasks              // 待办任务列表
businessCodes          // 业务代码列表
```

### 4.3 Mock接口配置

Mock数据文件已经配置了以下Mock接口:

```typescript
// 流程管理接口
Mock.mock('/api/approval-flows', 'get', ...)
Mock.mock(/\/api\/approval-flows\/\d+/, 'get', ...)
Mock.mock('/api/approval-flows', 'post', ...)
Mock.mock(/\/api\/approval-flows\/\d+/, 'put', ...)
Mock.mock(/\/api\/approval-flows\/\d+/, 'delete', ...)
Mock.mock(/\/api\/approval-flows\/\d+\/status/, 'put', ...)
```

---

## 5. 前后端集成步骤

### 5.1 步骤1: 确认API路径

确保前端API接口的路径与后端API设计一致:

```typescript
// 前端API接口路径
'/approval-flows'           // 对应后端: /api/v1/approval-flows
'/approval-flows/:id'       // 对应后端: /api/v1/approval-flows/{id}
'/approval-flows/:id/status' // 对应后端: /api/v1/approval-flows/{id}/status
'/approval-flows/check-code' // 对应后端: /api/v1/approval-flows/check-code
```

### 5.2 步骤2: 确认请求参数

确保前端请求的参数与后端API设计一致:

```typescript
// 获取流程列表
interface ApprovalFlowQueryParams {
  page: number;
  pageSize: number;
  flowType?: string;
  flowStatus?: FlowStatus;
  keyword?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// 创建流程
interface ApprovalFlowForm {
  id?: number;
  flowName: string;
  flowCode: string;
  flowType: string;
  flowDescription?: string;
  flowStatus?: FlowStatus;
  isDefault?: number;
  nodes?: ApprovalNode[];
  remark?: string;
}
```

### 5.3 步骤3: 确认响应数据

确保前端响应数据的结构与后端API设计一致:

```typescript
// 分页响应
interface PageResponse<T> {
  code: number;
  message: string;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  timestamp: number;
}

// 成功响应
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}
```

### 5.4 步骤4: 确认错误处理

确保前端错误处理与后端API设计一致:

```typescript
// 错误响应
interface ErrorResponse {
  code: number;
  message: string;
  errors?: ValidationError[];
  timestamp: number;
}

// 验证错误
interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

### 5.5 步骤5: 更新Mock数据

根据后端API设计更新Mock数据,确保Mock数据与后端响应格式一致:

```typescript
// 获取流程列表Mock
Mock.mock('/api/approval-flows', 'get', (options) => {
  const { page = 1, pageSize = 10, flowType, flowStatus, keyword } = JSON.parse(options.body || '{}');

  let filteredFlows = [...approvalFlows];

  if (flowType) {
    filteredFlows = filteredFlows.filter(flow => flow.flowType === flowType);
  }
  if (flowStatus) {
    filteredFlows = filteredFlows.filter(flow => flow.flowStatus === flowStatus);
  }
  if (keyword) {
    filteredFlows = filteredFlows.filter(flow =>
      flow.flowName.includes(keyword) || flow.flowCode.includes(keyword)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredFlows.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredFlows.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredFlows.length / pageSize)
    },
    timestamp: Date.now()
  };
});
```

---

## 6. 前端组件集成

### 6.1 流程列表页面

```vue
<template>
  <div class="approval-flow-list">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="流程类型">
          <el-select v-model="queryParams.flowType" placeholder="请选择" clearable>
            <el-option label="请假管理" value="LEAVE" />
            <el-option label="调岗管理" value="TRANSFER" />
            <el-option label="离职管理" value="RESIGNATION" />
            <el-option label="报名管理" value="REGISTRATION" />
          </el-select>
        </el-form-item>
        <el-form-item label="流程状态">
          <el-select v-model="queryParams.flowStatus" placeholder="请选择" clearable>
            <el-option label="启用" value="ENABLED" />
            <el-option label="禁用" value="DISABLED" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="queryParams.keyword" placeholder="流程名称/编码" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleCreate">新增流程</el-button>
    </div>

    <!-- 流程列表 -->
    <el-card>
      <el-table :data="flowList" v-loading="loading">
        <el-table-column prop="flowName" label="流程名称" />
        <el-table-column prop="flowCode" label="流程编码" />
        <el-table-column prop="flowType" label="流程类型">
          <template #default="{ row }">
            {{ getFlowTypeName(row.flowType) }}
          </template>
        </el-table-column>
        <el-table-column prop="flowDescription" label="流程描述" show-overflow-tooltip />
        <el-table-column prop="flowStatus" label="流程状态">
          <template #default="{ row }">
            <el-tag :type="row.flowStatus === 'ENABLED' ? 'success' : 'info'">
              {{ row.flowStatus === 'ENABLED' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="nodeCount" label="节点数量" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getApprovalFlowList, deleteApprovalFlow } from '@/api/system/flowConfigApi'
import type { ApprovalFlow, ApprovalFlowQueryParams } from '@/types/flow-config'

const router = useRouter()

// 查询参数
const queryParams = reactive<ApprovalFlowQueryParams>({
  page: 1,
  pageSize: 10,
  flowType: undefined,
  flowStatus: undefined,
  keyword: undefined
})

// 流程列表
const flowList = ref<ApprovalFlow[]>([])
const total = ref(0)
const loading = ref(false)

// 获取流程列表
const fetchFlowList = async () => {
  loading.value = true
  try {
    const response = await getApprovalFlowList(queryParams)
    flowList.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('获取流程列表失败')
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  queryParams.page = 1
  fetchFlowList()
}

// 重置
const handleReset = () => {
  queryParams.flowType = undefined
  queryParams.flowStatus = undefined
  queryParams.keyword = undefined
  handleSearch()
}

// 新增
const handleCreate = () => {
  router.push('/system/flow-management/create')
}

// 查看
const handleView = (row: ApprovalFlow) => {
  router.push(`/system/flow-management/detail/${row.id}`)
}

// 编辑
const handleEdit = (row: ApprovalFlow) => {
  router.push(`/system/flow-management/edit/${row.id}`)
}

// 删除
const handleDelete = async (row: ApprovalFlow) => {
  try {
    await ElMessageBox.confirm('确定要删除该流程吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteApprovalFlow(row.id!)
    ElMessage.success('删除成功')
    fetchFlowList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 获取流程类型名称
const getFlowTypeName = (flowType: string) => {
  const typeMap: Record<string, string> = {
    LEAVE: '请假管理',
    TRANSFER: '调岗管理',
    RESIGNATION: '离职管理',
    REGISTRATION: '报名管理'
  }
  return typeMap[flowType] || flowType
}

// 初始化
onMounted(() => {
  fetchFlowList()
})
</script>

<style scoped lang="scss">
.approval-flow-list {
  .search-card {
    margin-bottom: 20px;
  }

  .action-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
```

### 6.2 流程表单页面

```vue
<template>
  <div class="approval-flow-form">
    <el-card>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="流程名称" prop="flowName">
          <el-input v-model="formData.flowName" placeholder="请输入流程名称" />
        </el-form-item>

        <el-form-item label="流程编码" prop="flowCode">
          <el-input
            v-model="formData.flowCode"
            placeholder="请输入流程编码(大写字母、数字、下划线)"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="流程类型" prop="flowType">
          <el-select v-model="formData.flowType" placeholder="请选择流程类型">
            <el-option label="请假管理" value="LEAVE" />
            <el-option label="调岗管理" value="TRANSFER" />
            <el-option label="离职管理" value="RESIGNATION" />
            <el-option label="报名管理" value="REGISTRATION" />
          </el-select>
        </el-form-item>

        <el-form-item label="流程描述">
          <el-input
            v-model="formData.flowDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入流程描述"
          />
        </el-form-item>

        <el-form-item label="流程状态">
          <el-radio-group v-model="formData.flowStatus">
            <el-radio label="ENABLED">启用</el-radio>
            <el-radio label="DISABLED">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否默认">
          <el-switch v-model="formData.isDefault" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="审批节点">
          <el-button type="primary" @click="handleAddNode">添加节点</el-button>
        </el-form-item>

        <el-form-item>
          <el-table :data="formData.nodes" border>
            <el-table-column prop="nodeName" label="节点名称" />
            <el-table-column prop="nodeCode" label="节点编码" />
            <el-table-column prop="nodeOrder" label="节点顺序" />
            <el-table-column label="操作" width="150">
              <template #default="{ $index }">
                <el-button link type="primary" @click="handleEditNode($index)">编辑</el-button>
                <el-button link type="danger" @click="handleDeleteNode($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getApprovalFlowDetail, createApprovalFlow, updateApprovalFlow } from '@/api/system/flowConfigApi'
import type { ApprovalFlowForm, ApprovalNode } from '@/types/flow-config'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const isEdit = ref(false)

// 表单数据
const formData = reactive<ApprovalFlowForm>({
  flowName: '',
  flowCode: '',
  flowType: '',
  flowDescription: '',
  flowStatus: 'ENABLED',
  isDefault: 0,
  nodes: [],
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  flowName: [
    { required: true, message: '请输入流程名称', trigger: 'blur' }
  ],
  flowCode: [
    { required: true, message: '请输入流程编码', trigger: 'blur' },
    { pattern: /^[A-Z0-9_]+$/, message: '流程编码只能包含大写字母、数字和下划线', trigger: 'blur' }
  ],
  flowType: [
    { required: true, message: '请选择流程类型', trigger: 'change' }
  ]
}

// 获取流程详情
const fetchFlowDetail = async (id: number) => {
  try {
    const response = await getApprovalFlowDetail(id)
    Object.assign(formData, response.data)
  } catch (error) {
    ElMessage.error('获取流程详情失败')
  }
}

// 添加节点
const handleAddNode = () => {
  formData.nodes!.push({
    nodeName: '',
    nodeCode: '',
    nodeType: 'APPROVAL',
    nodeOrder: formData.nodes!.length + 1,
    approverType: 'POSITION',
    isRequired: 1
  })
}

// 编辑节点
const handleEditNode = (index: number) => {
  // 打开节点编辑对话框
}

// 删除节点
const handleDeleteNode = (index: number) => {
  formData.nodes!.splice(index, 1)
  // 重新排序
  formData.nodes!.forEach((node, i) => {
    node.nodeOrder = i + 1
  })
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (isEdit.value) {
      await updateApprovalFlow(formData.id!, formData)
      ElMessage.success('更新成功')
    } else {
      await createApprovalFlow(formData)
      ElMessage.success('创建成功')
    }

    router.back()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  }
}

// 取消
const handleCancel = () => {
  router.back()
}

// 初始化
onMounted(() => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    fetchFlowDetail(parseInt(id))
  }
})
</script>

<style scoped lang="scss">
.approval-flow-form {
  padding: 20px;
}
</style>
```

---

## 7. 数据权限集成

### 7.1 数据权限服务

前端项目已经存在数据权限服务:

- **文件路径**: `e:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\services\dataPermissionService.ts`
- **功能**: 处理数据权限相关逻辑

### 7.2 数据权限使用

```typescript
import { useDataPermission } from '@/composables/useDataPermission'

const { hasDataPermission, applyDataPermission } = useDataPermission()

// 检查数据权限
if (hasDataPermission('ALL')) {
  // 有全部数据权限
}

// 应用数据权限过滤
const filteredData = applyDataPermission(dataList, dataPermission)
```

---

## 8. 错误处理集成

### 8.1 错误处理器

前端项目已经存在错误处理器:

- **文件路径**: `e:\三鼎\蓝领智汇 SaaS系统\blue-collar-platform\src\utils\errorHandler.ts`
- **功能**: 统一处理API错误

### 8.2 错误处理使用

```typescript
import { useErrorHandler } from '@/composables/useErrorHandler'

const { handleError } = useErrorHandler()

try {
  await getApprovalFlowList(queryParams)
} catch (error) {
  handleError(error)
}
```

---

## 9. 测试集成

### 9.1 单元测试

```typescript
import { describe, it, expect, vi } from 'vitest'
import { getApprovalFlowList } from '@/api/system/flowConfigApi'

describe('flowConfigApi', () => {
  it('should get approval flow list', async () => {
    const mockData = {
      code: 200,
      message: 'success',
      data: {
        list: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      },
      timestamp: Date.now()
    }

    vi.mock('@/utils/request', () => ({
      default: {
        get: vi.fn().mockResolvedValue(mockData)
      }
    }))

    const result = await getApprovalFlowList({ page: 1, pageSize: 10 })
    expect(result.code).toBe(200)
  })
})
```

### 9.2 集成测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ApprovalFlowList from '@/views/system/flow-management/ApprovalFlowList.vue'

describe('ApprovalFlowList', () => {
  it('should render correctly', () => {
    const wrapper = mount(ApprovalFlowList)
    expect(wrapper.find('.approval-flow-list').exists()).toBe(true)
  })
})
```

---

## 10. 部署集成

### 10.1 环境变量配置

```env
# API基础URL
VITE_API_BASE_URL=/api/v1

# 是否启用Mock
VITE_ENABLE_MOCK=true
```

### 10.2 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

---

## 11. 注意事项

### 11.1 接口版本管理

- 所有API接口都应该包含版本号(v1)
- 接口路径格式: `/api/v{version}/{resource}`
- 版本升级时保持向后兼容

### 11.2 数据格式一致性

- 前后端使用统一的日期格式(ISO 8601)
- 数字类型使用Number而不是String
- 布尔值使用true/false而不是0/1

### 11.3 错误处理一致性

- 前后端使用统一的错误码
- 错误消息使用中文
- 错误详情包含字段名和错误信息

### 11.4 数据权限一致性

- 前后端使用相同的数据权限类型
- 数据权限配置格式一致
- 数据权限过滤逻辑一致

---

## 12. 常见问题

### 12.1 如何处理跨域问题?

使用Vite的代理配置:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 12.2 如何处理Token过期?

在request拦截器中处理Token过期:

```typescript
// src/utils/request.ts
request.interceptors.response.use(
  (response) => {
    const { code, message } = response.data

    if (code === 401) {
      ElMessage.error('登录已过期,请重新登录')
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(new Error(message))
    }

    return response.data
  },
  (error) => {
    // 处理错误
    return Promise.reject(error)
  }
)
```

### 12.3 如何处理大数据量分页?

使用虚拟滚动和懒加载:

```vue
<template>
  <el-table
    :data="flowList"
    v-loading="loading"
    :height="600"
    :row-key="id"
  >
    <!-- 表格列 -->
  </el-table>
</template>
```

---

## 13. 更新日志

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|----------|------|
| 1.0.0 | 2026-02-26 | 初始版本,完成前后端集成指南 | 后端工程师 |

---

## 14. 联系方式

- **文档维护**: 后端工程师
- **技术支持**: tech-support@example.com
- **问题反馈**: issues@example.com

---

**文档结束**
