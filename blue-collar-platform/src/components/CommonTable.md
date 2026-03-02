# CommonTable 通用表格组件使用文档

## 组件简介

CommonTable 是一个基于 Element Plus Table 组件封装的通用表格组件，提供了丰富的功能，包括排序、搜索、列宽调整、悬浮提示、文本截断、分页、多选、自定义列表等功能。

## 功能特性

### 1. 排序功能
- 支持点击表头字段进行排序
- 包含升序、降序和默认排序
- 支持多字段排序配置

### 2. 搜索功能
- 集成表格搜索功能
- 支持全局搜索
- 支持按列搜索（通过插槽自定义）

### 3. 列宽调整
- 支持拉伸字段宽度展示更多信息
- 保存用户自定义列宽到本地存储

### 4. 悬浮提示
- 鼠标移入悬浮显示值的全部信息
- 支持自定义提示内容（通过 `showTooltip` 配置）

### 5. 文本截断
- 值显示不全的情况下以...的信息展示
- 支持自定义截断长度（通过列宽控制）

### 6. 分页功能
- 集成分页控件
- 支持自定义每页显示条数
- 支持跳转到指定页

### 7. 多选功能
- 支持行多选
- 支持批量操作

### 8. 全选/反选
- 支持一键全选
- 支持一键反选

### 9. 加载状态
- 显示数据加载状态
- 空数据提示

### 10. 自定义列表功能
- 支持用户自定义表格列表
- 包括创建、编辑、删除自定义列表

### 11. 字段展示设置
- 支持用户设置列表展示的字段
- 包括字段的显示/隐藏
- 支持顺序调整

### 12. 账号绑定
- 用户的自定义列表和字段展示设置与登录账号绑定
- 确保用户在不同设备上登录时保持一致的设置

### 13. 默认列表
- 为每个表格提供默认的标准列表配置
- 作为用户自定义的基础

### 14. 列表管理
- 提供统一的列表管理界面
- 允许用户查看和管理所有自定义列表

## 安装使用

### 1. 引入组件

```vue
<script setup lang="ts">
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig, SortConfig, CustomList } from '@/types/common-table'
</script>
```

### 2. 基础使用

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
import type { ColumnConfig } from '@/types/common-table'

const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

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
    width: 130
  }
]
</script>
```

## Props 配置

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 表格数据 | Array | [] |
| columns | 列配置 | ColumnConfig[] | [] |
| tableId | 表格ID(用于保存设置) | String | - |
| border | 是否显示边框 | Boolean | true |
| stripe | 是否显示斑马纹 | Boolean | true |
| height | 表格高度 | String/Number | - |
| maxHeight | 最大高度 | String/Number | - |
| rowKey | 行数据的Key | String | 'id' |
| defaultSort | 默认排序 | Object | - |
| showToolbar | 是否显示工具栏 | Boolean | true |
| showGlobalSearch | 是否显示全局搜索 | Boolean | true |
| showListManagement | 是否显示列表管理 | Boolean | true |
| showColumnSetting | 是否显示列设置 | Boolean | true |
| showSelection | 是否显示多选 | Boolean | true |
| showIndex | 是否显示序号 | Boolean | true |
| showActions | 是否显示操作列 | Boolean | true |
| actionColumnWidth | 操作列宽度 | Number | 200 |
| actionFixed | 操作列固定 | Boolean/String | 'right' |
| showPagination | 是否显示分页 | Boolean | true |
| showBatchActions | 是否显示批量操作 | Boolean | true |
| pageSizes | 分页大小选项 | Number[] | [10, 20, 50, 100] |
| paginationLayout | 分页布局 | String | 'total, sizes, prev, pager, next, jumper' |
| total | 总条数 | Number | 0 |
| currentPage | 当前页 | Number | 1 |
| pageSize | 每页条数 | Number | 10 |
| loading | 加载状态 | Boolean | false |

## ColumnConfig 列配置

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| prop | 字段名 | String | - |
| label | 列标题 | String | - |
| width | 列宽度 | Number | - |
| minWidth | 最小列宽 | Number | - |
| fixed | 固定列 | Boolean/String | - |
| sortable | 是否可排序 | Boolean | false |
| align | 对齐方式 | String | 'left' |
| showTooltip | 是否显示悬浮提示 | Boolean | true |
| resizable | 是否可调整宽度 | Boolean | true |
| required | 是否必选列(不可隐藏) | Boolean | false |
| formatter | 格式化函数 | Function | - |

## Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:currentPage | 当前页变化 | (page: number) |
| update:pageSize | 每页条数变化 | (size: number) |
| sort-change | 排序变化 | (sort: { prop, order }) |
| selection-change | 选择变化 | (selection: any[]) |
| row-click | 行点击 | (row, column, event) |
| global-search | 全局搜索 | (keyword: string) |
| batch-action | 批量操作 | (selectedRows: any[]) |
| save-list | 保存列表 | (list: CustomList) |
| apply-list | 应用列表 | (list: CustomList) |
| reset-list | 重置列表 | - |

## Slots 插槽

| 插槽名 | 说明 |
|--------|------|
| toolbar-left | 工具栏左侧内容 |
| toolbar-right | 工具栏右侧内容 |
| column-{prop} | 自定义列内容，{prop} 为列的 prop 值 |
| actions | 操作列内容 |
| pagination-left | 分页左侧内容 |

## Methods 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelection | 清空选择 | - |
| toggleRowSelection | 切换行选择 | (row, selected?) |
| toggleAllSelection | 切换全选 | - |
| toggleRowExpansion | 切换行展开 | (row, expanded?) |
| setCurrentRow | 设置当前行 | (row) |
| clearSort | 清空排序 | - |
| sort | 排序 | (prop, order) |

## 完整示例

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
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @global-search="handleGlobalSearch"
      @batch-action="handleBatchAction"
    >
      <!-- 工具栏左侧插槽 -->
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

      <!-- 自定义姓名列 -->
      <template #column-name="{ row }">
        <div class="worker-name">
          <el-avatar :size="32" :src="row.avatar" />
          <span>{{ row.name }}</span>
        </div>
      </template>

      <!-- 自定义状态列 -->
      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <!-- 自定义操作列 -->
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

      <!-- 分页左侧插槽 -->
      <template #pagination-left="{ selectedRows }">
        <span v-if="selectedRows.length > 0" class="selected-tip">
          已选择 {{ selectedRows.length }} 条数据
        </span>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig, SortConfig } from '@/types/common-table'

// 表格引用
const tableRef = ref()

// 数据状态
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<any[]>([])

// 排序配置
const defaultSort = ref<SortConfig>({ prop: 'hireDate', order: 'descending' })
const currentSort = ref<SortConfig>({ prop: 'hireDate', order: 'descending' })

// 列配置
const columns: ColumnConfig[] = [
  {
    prop: 'name',
    label: '姓名',
    width: 150,
    sortable: true,
    align: 'center',
    required: true
  },
  {
    prop: 'idCard',
    label: '身份证号',
    width: 180,
    align: 'center',
    showTooltip: true
  },
  {
    prop: 'phone',
    label: '手机号',
    width: 130,
    align: 'center'
  },
  {
    prop: 'department',
    label: '部门',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    prop: 'position',
    label: '职位',
    width: 120,
    align: 'center'
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    prop: 'hireDate',
    label: '入职日期',
    width: 150,
    sortable: true,
    align: 'center',
    formatter: (value) => {
      if (!value) return '-'
      return new Date(value).toLocaleDateString('zh-CN')
    }
  }
]

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    'active': 'success',
    'inactive': 'danger',
    'pending': 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'active': '在职',
    'inactive': '离职',
    'pending': '待入职'
  }
  return textMap[status] || status
}

// 页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

// 排序变化
const handleSortChange = (sort: SortConfig) => {
  currentSort.value = sort
  fetchData()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  currentPage.value = 1
  fetchData()
}

// 批量操作
const handleBatchAction = (rows: any[]) => {
  ElMessageBox.confirm(
    `确定要对选中的 ${rows.length} 条数据进行批量操作吗?`,
    '批量操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('批量操作成功')
    tableRef.value?.clearSelection()
  }).catch(() => {})
}

// 新增
const handleAdd = () => {
  ElMessage.info('点击了新增按钮')
}

// 导出
const handleExport = () => {
  ElMessage.success('导出成功')
}

// 查看
const handleView = (row: any) => {
  ElMessage.info(`查看: ${row.name}`)
}

// 编辑
const handleEdit = (row: any) => {
  ElMessage.info(`编辑: ${row.name}`)
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.name} 吗?`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 调用API获取数据
    const response = await api.getWorkers({
      page: currentPage.value,
      pageSize: pageSize.value,
      sort: currentSort.value
    })
    tableData.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.worker-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.worker-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-tip {
  color: #409eff;
  font-size: 14px;
}
</style>
```

## 注意事项

1. **tableId 唯一性**：每个表格实例需要唯一的 tableId，用于保存用户的自定义设置。

2. **账号绑定**：组件会自动从 localStorage 中读取用户信息，实现设置与账号绑定。

3. **本地存储**：列设置和自定义列表会保存到 localStorage 中，清除浏览器数据会丢失设置。

4. **响应式设计**：组件已实现响应式设计，适配移动端、平板和桌面端。

5. **性能优化**：对于大数据量表格，建议使用虚拟滚动或分页加载。

6. **插槽使用**：通过插槽可以自定义列内容、工具栏和操作列，实现高度定制化。

## 技术栈

- Vue 3 Composition API
- TypeScript
- Element Plus
- LocalStorage

## 更新日志

### v1.0.0 (2026-02-25)
- 初始版本发布
- 实现所有核心功能
- 支持自定义列表和列设置
- 支持账号绑定和数据持久化
