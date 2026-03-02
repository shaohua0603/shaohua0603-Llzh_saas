<template>
  <div class="recruitment-list-container">
    <el-tabs v-model="activeTab" class="recruitment-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="我的发布" name="my" />
      <el-tab-pane label="代招需求" name="agency" />
      <el-tab-pane label="平台全部" name="all" />
    </el-tabs>

    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <div class="filter-header">
        <el-form :inline="true" :model="queryParams">
          <el-form-item label="关键词">
            <el-input
              v-model="queryParams.keyword"
              placeholder="需求标题/岗位名称"
              clearable
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button @click="handleReset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
        <el-button type="text" class="filter-toggle" @click="filterVisible = !filterVisible">
          {{ filterVisible ? '收起' : '展开' }}
          <el-icon>
            <component :is="filterVisible ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </el-button>
      </div>
      <!-- 展开后显示的全部查询条件 -->
      <el-collapse-transition>
        <div v-show="filterVisible" class="filter-expanded">
          <el-form :model="queryParams" inline>
            <el-form-item label="工厂">
              <el-select
                v-model="queryParams.factoryId"
                placeholder="请选择工厂"
                clearable
                style="width: 180px"
              >
                <el-option
                  v-for="item in factoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 280px"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button
        type="primary"
        @click="handleAdd"
      >
        <el-icon><Plus /></el-icon>
        发布招聘
      </el-button>
      <el-button
        @click="handleImport"
      >
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button
        @click="handleExport"
      >
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-dropdown
        v-if="selectedIds.length > 0"
        @command="handleBatchCommand"
      >
        <el-button>
          批量操作
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="export">批量导出</el-dropdown-item>
            <el-dropdown-item command="delete" divided>批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 招聘列表 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共发布 {{ total }} 条招聘需求，其中已发布 {{ tableData.filter(item => item.status === 'published').length }} 条，进行中 {{ tableData.filter(item => item.status === 'active').length }} 条，已完成 {{ tableData.filter(item => item.status === 'completed').length }} 条</span>
      </div>
      <CommonTable
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        :table-id="'recruitment-list'"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :default-sort="{ prop: 'createdAt', order: 'descending' }"
        :show-selection="true"
        :show-actions="true"
        @update:current-page="handlePageChange"
        @update:page-size="handleSizeChange"
        @sort-change="handleSortChange"
        @global-search="handleSearch"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, ArrowDown, ArrowUp, Delete } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

const router = useRouter()

const tableRef = ref()
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const activeTab = ref('my')
const searchKeyword = ref('')
const filterVisible = ref(false)

// 选中项
const selectedIds = ref<string[]>([])

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 查询参数
const queryParams = reactive({
  keyword: '',
  status: undefined,
  factoryId: undefined,
  startDate: undefined,
  endDate: undefined
})

// 状态选项
const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'active', label: '进行中' },
  { value: 'closed', label: '已关闭' },
  { value: 'completed', label: '已完成' }
]

// 工厂选项
const factoryOptions = ref<Array<{ value: string; label: string }>>([
  { value: '1', label: '某某电子有限公司' },
  { value: '2', label: '某某制造厂' }
])

const columns: ColumnConfig[] = [
  { prop: 'id', label: '招聘ID', width: 120, sortable: true },
  { prop: 'title', label: '招聘标题', minWidth: 150, showTooltip: true },
  { prop: 'factoryName', label: '工厂名称', width: 180, showTooltip: true },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'recruitCount', label: '需求人数', width: 100, sortable: true },
  { prop: 'salary', label: '薪资范围', width: 150, showTooltip: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'createdAt', label: '发布时间', width: 180, sortable: true }
]

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    draft: 'info',
    published: 'success',
    closed: 'danger',
    active: 'success',
    pending: 'warning',
    completed: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    closed: '已关闭',
    active: '进行中',
    pending: '待处理',
    completed: '已完成'
  }
  return textMap[status] || status
}

const handleTabChange = (tab: string) => {
  activeTab.value = tab
  currentPage.value = 1
  fetchData()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleSortChange = (sort: any) => {
  console.log('排序:', sort)
  fetchData()
}

const handleSearch = (keyword?: string) => {
  if (keyword !== undefined) {
    searchKeyword.value = keyword
  }
  currentPage.value = 1
  fetchData()
}

const handleReset = () => {
  queryParams.keyword = ''
  queryParams.status = undefined
  queryParams.factoryId = undefined
  dateRange.value = null
  queryParams.startDate = undefined
  queryParams.endDate = undefined
  searchKeyword.value = ''
  currentPage.value = 1
  fetchData()
}

const handleRefresh = () => {
  fetchData()
}

const handleAdd = () => {
  router.push('/labor-company/recruitment/add')
}

const handleView = (row: any) => {
  router.push(`/labor-company/recruitment/detail/${row.id}`)
}

const handleEdit = (row: any) => {
  router.push(`/labor-company/recruitment/edit/${row.id}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除招聘需求"${row.title}"吗？删除后不可恢复。`,
    '提示',
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

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的${selectedIds.value.length}条招聘需求吗？删除后不可恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    fetchData()
  }).catch(() => {})
}

// 导入
const handleImport = () => {
  ElMessage.info('导入功能开发中')
}

// 批量操作
const handleBatchCommand = (command: string) => {
  switch (command) {
    case 'export':
      ElMessage.info('批量导出功能开发中')
      break
    case 'delete':
      handleBatchDelete()
      break
  }
}

// 行点击
const handleRowClick = (row: any) => {
  handleView(row)
}

// 导出
const handleExport = async () => {
  try {
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    console.log('获取招聘列表:', {
      tab: activeTab.value,
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })
    tableData.value = [
      {
        id: 'REQ20240225001',
        title: '普工招聘',
        factoryName: '某某电子有限公司',
        department: '生产部',
        recruitCount: 50,
        salary: '5000-7000元/月',
        status: 'published',
        createdAt: '2024-02-20 10:00:00'
      },
      {
        id: 'REQ20240225002',
        title: '技工招聘',
        factoryName: '某某制造厂',
        department: '技术部',
        recruitCount: 20,
        salary: '7000-10000元/月',
        status: 'active',
        createdAt: '2024-02-19 10:00:00'
      }
    ]
    total.value = 2
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.recruitment-list-container {
  padding: 16px;
  background-color: #f5f7fa;
}

.recruitment-tabs {
  margin-bottom: 16px;
  background-color: #fff;
  padding: 0 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-toggle {
  color: #409eff;
}

.filter-expanded {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.filter-expanded .el-form-item {
  margin-right: 12px;
  margin-bottom: 12px;
}

/* 功能按钮区域 */
.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-stats {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
  font-size: 14px;
  color: #606266;
}

.table-stats p {
  margin: 0;
  line-height: 1.5;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-bar .el-button {
    width: 100%;
  }
}
</style>
