# CommonTable 通用表格组件 - 快速开始指南

## 快速开始

### 1. 基础用法

最简单的使用方式，只需要传入数据和列配置：

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    table-id="my-table"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

const tableData = ref([
  { id: 1, name: '张三', age: 25, city: '北京' },
  { id: 2, name: '李四', age: 30, city: '上海' }
])

const columns: ColumnConfig[] = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'city', label: '城市', width: 120 }
]
</script>
```

### 2. 带分页和加载状态

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    table-id="worker-list"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :page-size="pageSize"
    @update:current-page="handlePageChange"
    @update:page-size="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonTable from '@/components/CommonTable.vue'

const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const fetchData = async () => {
  loading.value = true
  try {
    // 调用API获取数据
    const response = await api.getWorkers({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    tableData.value = response.data.list
    total.value = response.data.total
  } finally {
    loading.value = false
  }
}
</script>
```

### 3. 自定义列内容

使用插槽自定义列的显示内容：

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    table-id="worker-list"
  >
    <!-- 自定义姓名列 -->
    <template #column-name="{ row }">
      <div class="worker-info">
        <el-avatar :size="32" :src="row.avatar" />
        <span>{{ row.name }}</span>
      </div>
    </template>

    <!-- 自定义状态列 -->
    <template #column-status="{ row }">
      <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? '在职' : '离职' }}
      </el-tag>
    </template>
  </CommonTable>
</template>
```

### 4. 自定义操作列

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    table-id="worker-list"
    :show-actions="true"
  >
    <template #actions="{ row }">
      <el-button size="small" type="primary" link @click="handleView(row)">
        查看
      </el-button>
      <el-button size="small" type="primary" link @click="handleEdit(row)">
        编辑
      </el-button>
      <el-button size="small" type="danger" link @click="handleDelete(row)">
        删除
      </el-button>
    </template>
  </CommonTable>
</template>
```

### 5. 排序和搜索

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    table-id="worker-list"
    :default-sort="{ prop: 'createTime', order: 'descending' }"
    @sort-change="handleSortChange"
    @global-search="handleSearch"
  />
</template>

<script setup lang="ts">
const handleSortChange = (sort) => {
  console.log('排序:', sort)
  fetchData()
}

const handleSearch = (keyword) => {
  console.log('搜索:', keyword)
  fetchData()
}
</script>
```

### 6. 批量操作

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    table-id="worker-list"
    :show-selection="true"
    :show-batch-actions="true"
    @batch-action="handleBatchAction"
  />
</template>

<script setup lang="ts">
const handleBatchAction = (selectedRows) => {
  console.log('批量操作:', selectedRows)
  // 执行批量操作逻辑
}
</script>
```

### 7. 工具栏自定义

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    table-id="worker-list"
  >
    <template #toolbar-left>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </template>

    <template #toolbar-right>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </template>
  </CommonTable>
</template>
```

### 8. 列配置详解

```typescript
const columns: ColumnConfig[] = [
  {
    prop: 'name',              // 字段名
    label: '姓名',             // 列标题
    width: 150,                // 列宽度
    minWidth: 120,             // 最小列宽
    fixed: 'left',             // 固定列
    sortable: true,            // 可排序
    align: 'center',           // 对齐方式
    showTooltip: true,         // 显示悬浮提示
    resizable: true,           // 可调整宽度
    required: true,            // 必选列(不可隐藏)
    formatter: (value) => {    // 格式化函数
      return value ? value.toUpperCase() : '-'
    }
  }
]
```

### 9. 响应式数据

```typescript
const columns: ColumnConfig[] = [
  {
    prop: 'name',
    label: '姓名',
    width: 150,
    sortable: true
  },
  {
    prop: 'phone',
    label: '手机号',
    width: 130,
    showTooltip: true
  },
  {
    prop: 'address',
    label: '地址',
    minWidth: 200,  // 使用minWidth而不是固定width
    showTooltip: true
  }
]
```

### 10. 完整示例

```vue
<template>
  <div class="worker-list">
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="worker-list"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :default-sort="defaultSort"
      :show-selection="true"
      :show-actions="true"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @global-search="handleSearch"
      @batch-action="handleBatchAction"
    >
      <template #toolbar-left>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="handleExport">导出</el-button>
      </template>

      <template #column-name="{ row }">
        <div class="worker-name">
          <el-avatar :size="32" :src="row.avatar" />
          <span>{{ row.name }}</span>
        </div>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button size="small" type="primary" link @click="handleView(row)">
          查看
        </el-button>
        <el-button size="small" type="primary" link @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button size="small" type="danger" link @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

const tableRef = ref()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const defaultSort = ref({ prop: 'createTime', order: 'descending' })

const columns: ColumnConfig[] = [
  {
    prop: 'name',
    label: '姓名',
    width: 150,
    sortable: true,
    required: true
  },
  {
    prop: 'phone',
    label: '手机号',
    width: 130
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    sortable: true
  }
]

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleSortChange = (sort) => {
  console.log('排序:', sort)
  fetchData()
}

const handleSelectionChange = (selection) => {
  console.log('选择:', selection)
}

const handleSearch = (keyword) => {
  currentPage.value = 1
  fetchData()
}

const handleBatchAction = (rows) => {
  console.log('批量操作:', rows)
}

const handleAdd = () => {
  console.log('新增')
}

const handleExport = () => {
  console.log('导出')
}

const handleView = (row) => {
  console.log('查看:', row)
}

const handleEdit = (row) => {
  console.log('编辑:', row)
}

const handleDelete = (row) => {
  console.log('删除:', row)
}

const getStatusType = (status) => {
  return status === 'active' ? 'success' : 'danger'
}

const getStatusText = (status) => {
  return status === 'active' ? '在职' : '离职'
}

const fetchData = async () => {
  loading.value = true
  try {
    // 调用API获取数据
    const response = await api.getWorkers({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    tableData.value = response.data.list
    total.value = response.data.total
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
```

## 常见问题

### Q1: 如何禁用某些功能？

```vue
<CommonTable
  :show-toolbar="false"
  :show-selection="false"
  :show-index="false"
  :show-actions="false"
  :show-pagination="false"
/>
```

### Q2: 如何自定义分页大小选项？

```vue
<CommonTable
  :page-sizes="[5, 10, 20, 50]"
/>
```

### Q3: 如何固定列？

```typescript
const columns: ColumnConfig[] = [
  {
    prop: 'name',
    label: '姓名',
    width: 150,
    fixed: 'left'  // 固定在左侧
  },
  {
    prop: 'actions',
    label: '操作',
    width: 200,
    fixed: 'right'  // 固定在右侧
  }
]
```

### Q4: 如何格式化日期？

```typescript
const columns: ColumnConfig[] = [
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    formatter: (value) => {
      if (!value) return '-'
      return new Date(value).toLocaleString('zh-CN')
    }
  }
]
```

### Q5: 如何获取表格实例？

```vue
<template>
  <CommonTable ref="tableRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableRef = ref()

// 清空选择
const clearSelection = () => {
  tableRef.value?.clearSelection()
}

// 切换行选择
const toggleRowSelection = (row) => {
  tableRef.value?.toggleRowSelection(row, true)
}
</script>
```

## 最佳实践

1. **使用 tableId**：每个表格实例应该有唯一的 tableId，用于保存用户设置
2. **响应式列宽**：对于可能内容较长的列，使用 `minWidth` 而不是固定 `width`
3. **必选列**：对于重要的列，设置 `required: true` 防止用户隐藏
4. **格式化函数**：对于需要特殊显示的数据，使用 `formatter` 函数
5. **加载状态**：在获取数据时设置 `loading: true` 提升用户体验
6. **分页加载**：对于大数据量，使用分页加载而不是一次性加载所有数据

## 下一步

- 查看 [完整文档](./CommonTable.md) 了解更多功能
- 查看 [示例代码](../views/labor-company/TableExample.vue) 了解实际应用
- 查看 [类型定义](../types/common-table.ts) 了解完整的类型定义
