<template>
  <div class="admin-idle-workers-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" :inline="true" label-width="auto">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="搜索姓名、手机号"
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="queryParams.tags"
            placeholder="请选择标签"
            multiple
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="(label, value) in WorkerTagText"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <CommonTable
      :data="tableData"
      :columns="columns"
      :table-id="tableId"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
    >
      <template #column-tags="{ row }">
        <el-tag
          v-for="tag in row.tags"
          :key="tag"
          :color="WorkerTagColor[tag]"
          style="margin-right: 4px; margin-bottom: 4px;"
          size="small"
        >
          {{ WorkerTagText[tag] }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleViewDetail(row)">
          查看详情
        </el-button>
      </template>
    </CommonTable>

    <!-- 工人详情弹窗 -->
    <WorkerDetailDialog
      v-model="detailDialogVisible"
      :worker-id="selectedWorkerId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import WorkerDetailDialog from '@/components/WorkerDetailDialog.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { idleWorkerApi } from '@/api/operations/idleWorkerApi'
import {
  WorkerTag,
  WorkerTagText,
  WorkerTagColor,
  type WorkerBasicInfo,
  type IdleWorkerQueryParams,
} from '@/types/operations/idleWorker'

// 表格ID
const tableId = 'admin-idle-workers'

// 查询参数
const queryParams = reactive<IdleWorkerQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  tags: [],
  startTime: '',
  endTime: '',
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<WorkerBasicInfo[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 详情对话框
const detailDialogVisible = ref(false)
const selectedWorkerId = ref<number>()

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'name', label: '姓名', width: 100, sortable: true },
  { prop: 'phone', label: '手机号', width: 130, sortable: true },
  { prop: 'tags', label: '标签', minWidth: 300 },
  { prop: 'registerTime', label: '注册时间', width: 180, sortable: true },
  { prop: 'lastLoginTime', label: '最后登录时间', width: 180, sortable: true },
]

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.startTime = dateRange.value[0]
      queryParams.endTime = dateRange.value[1]
    } else {
      queryParams.startTime = ''
      queryParams.endTime = ''
    }

    const response = await idleWorkerApi.getIdleWorkerList(queryParams)
    tableData.value = response.data.list
    total.value = response.data.total
    currentPage.value = response.data.page
    pageSize.value = response.data.pageSize
  } catch (error) {
    console.error('加载空闲工人数据失败:', error)
    ElMessage.error('加载空闲工人数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.tags = []
  dateRange.value = null
  queryParams.page = 1
  loadData()
}

// 分页变化
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  queryParams.page = 1
  loadData()
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  queryParams.sortField = sort.prop
  queryParams.sortOrder = sort.order === 'ascending' ? 'asc' : sort.order === 'descending' ? 'desc' : undefined
  loadData()
}

// 查看详情
const handleViewDetail = (row: WorkerBasicInfo) => {
  selectedWorkerId.value = row.id
  detailDialogVisible.value = true
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-idle-workers-page {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
}
</style>
