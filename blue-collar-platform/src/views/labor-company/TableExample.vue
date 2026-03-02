<template>
  <div class="table-example">
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
      @save-list="handleSaveList"
      @apply-list="handleApplyList"
      @reset-list="handleResetList"
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig, SortConfig, CustomList } from '@/types/common-table'

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

// 搜索关键词
const searchKeyword = ref('')

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
  },
  {
    prop: 'address',
    label: '地址',
    minWidth: 200,
    align: 'left',
    showTooltip: true
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

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟数据
    const mockData = Array.from({ length: pageSize.value }, (_, index) => ({
      id: `${currentPage.value}-${index + 1}`,
      name: `工人${(currentPage.value - 1) * pageSize.value + index + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
      idCard: `11010119900101${String(index).padStart(4, '0')}`,
      phone: `138${String(index).padStart(8, '0')}`,
      department: ['生产部', '质检部', '物流部'][index % 3],
      position: ['操作工', '质检员', '仓管员'][index % 3],
      status: ['active', 'inactive', 'pending'][index % 3],
      hireDate: new Date(2023, index % 12, (index % 28) + 1).toISOString(),
      address: `北京市朝阳区某某街道${index + 1}号`
    }))

    // 模拟排序
    if (currentSort.value.order) {
      mockData.sort((a, b) => {
        const aValue = a[currentSort.value.prop]
        const bValue = b[currentSort.value.prop]
        if (currentSort.value.order === 'ascending') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    // 模拟搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      const filteredData = mockData.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.idCard.includes(keyword) ||
        item.phone.includes(keyword)
      )
      tableData.value = filteredData
      total.value = filteredData.length
    } else {
      tableData.value = mockData
      total.value = 100 // 模拟总数
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchTableData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTableData()
}

// 排序变化
const handleSortChange = (sort: SortConfig) => {
  currentSort.value = sort
  fetchTableData()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  searchKeyword.value = keyword
  currentPage.value = 1
  fetchTableData()
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
    fetchTableData()
  }).catch(() => {})
}

// 保存列表
const handleSaveList = (list: CustomList) => {
  console.log('保存列表:', list)
}

// 应用列表
const handleApplyList = (list: CustomList) => {
  console.log('应用列表:', list)
}

// 重置列表
const handleResetList = () => {
  console.log('重置列表')
}

// 初始化
onMounted(() => {
  fetchTableData()
})
</script>

<style scoped>
.table-example {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .table-example {
    padding: 16px;
  }
}
</style>
