<template>
  <div class="admin-activity-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" :inline="true" label-width="auto">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="搜索活动标题"
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择活动类型"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="(label, value) in ActivityTypeText"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="(label, value) in ActivityStatusText"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
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

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增活动
      </el-button>
    </div>

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
      <template #column-type="{ row }">
        <el-tag :type="ActivityTypeTagType[row.type]">
          {{ row.typeText }}
        </el-tag>
      </template>
      <template #column-needAudit="{ row }">
        <el-tag :type="row.needAudit ? 'warning' : 'success'">
          {{ row.needAudit ? '需要审核' : '无需审核' }}
        </el-tag>
      </template>
      <template #column-status="{ row }">
        <el-tag :type="ActivityStatusTagType[row.status]">
          {{ row.statusText }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleDetail(row)">
          查看详情
        </el-button>
        <el-button type="primary" link @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">
          删除
        </el-button>
        <el-button
          type="success"
          link
          @click="handleStartEarly(row)"
          v-if="row.status === ActivityStatus.DRAFT || row.status === ActivityStatus.NOT_STARTED"
        >
          提前开始
        </el-button>
        <el-button
          type="warning"
          link
          @click="handleEndEarly(row)"
          v-if="row.status === ActivityStatus.ONGOING"
        >
          提前结束
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  RefreshLeft,
  Plus,
} from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { activityApi } from '@/api/operations/activityApi'
import {
  ActivityType,
  ActivityTypeText,
  ActivityTypeTagType,
  ActivityStatus,
  ActivityStatusText,
  ActivityStatusTagType,
  type ActivityInfo,
  type ActivityQueryParams,
} from '@/types/operations/activity'

const router = useRouter()

// 表格ID
const tableId = 'admin-activity'

// 查询参数
const queryParams = reactive<ActivityQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  type: undefined,
  status: undefined,
  startTime: '',
  endTime: '',
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<ActivityInfo[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'title', label: '活动标题', minWidth: 180, sortable: true },
  { prop: 'type', label: '活动类型', width: 120, sortable: true },
  { prop: 'needAudit', label: '报名审核', width: 100 },
  { prop: 'registerStartTime', label: '报名开始日期', width: 120, sortable: true },
  { prop: 'registerEndTime', label: '报名截止日期', width: 120, sortable: true },
  { prop: 'address', label: '活动地址', width: 150, showTooltip: true },
  { prop: 'startTime', label: '活动开始时间', width: 180, sortable: true },
  { prop: 'endTime', label: '活动结束时间', width: 180, sortable: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
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

    const response = await activityApi.getActivityList(queryParams)
    tableData.value = response.data.list
    total.value = response.data.total
    currentPage.value = response.data.page
    pageSize.value = response.data.pageSize
  } catch (error) {
    console.error('加载活动数据失败:', error)
    ElMessage.error('加载活动数据失败')
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
  queryParams.type = undefined
  queryParams.status = undefined
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

// 新增
const handleAdd = () => {
  router.push('/admin/operations-management/activity-management/activity-info/add')
}

// 查看详情
const handleDetail = (row: ActivityInfo) => {
  router.push(`/admin/operations-management/activity-management/activity-info/${row.id}`)
}

// 编辑
const handleEdit = (row: ActivityInfo) => {
  router.push(`/admin/operations-management/activity-management/activity-info/edit/${row.id}`)
}

// 删除
const handleDelete = async (row: ActivityInfo) => {
  try {
    await ElMessageBox.confirm('确认删除该活动?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await activityApi.deleteActivity(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提前开始
const handleStartEarly = async (row: ActivityInfo) => {
  try {
    await ElMessageBox.confirm('确认提前开始该活动?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await activityApi.startActivityEarly(row.id)
    ElMessage.success('活动已开始')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('提前开始失败:', error)
      ElMessage.error('提前开始失败')
    }
  }
}

// 提前结束
const handleEndEarly = async (row: ActivityInfo) => {
  try {
    await ElMessageBox.confirm('确认提前结束该活动?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await activityApi.endActivityEarly(row.id)
    ElMessage.success('活动已结束')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('提前结束失败:', error)
      ElMessage.error('提前结束失败')
    }
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-activity-page {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
