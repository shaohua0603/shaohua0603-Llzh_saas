<template>
  <div class="admin-registration-page">
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
        <el-form-item label="活动">
          <el-select
            v-model="queryParams.activityId"
            placeholder="请选择活动"
            clearable
            filterable
            style="width: 200px"
          >
            <el-option
              v-for="activity in activityList"
              :key="activity.id"
              :label="activity.title"
              :value="activity.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select
            v-model="queryParams.auditStatus"
            placeholder="请选择审核状态"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="(label, value) in RegistrationAuditStatusText"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
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
      :show-batch-actions="true"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
      @batch-action="handleBatchAction"
    >
      <template #column-auditStatus="{ row }">
        <el-tag :type="RegistrationAuditStatusTagType[row.auditStatus]">
          {{ row.auditStatusText }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button
          type="success"
          link
          @click="handleApprove(row)"
          v-if="row.auditStatus === RegistrationAuditStatus.PENDING"
        >
          审核通过
        </el-button>
        <el-button
          type="danger"
          link
          @click="handleReject(row)"
          v-if="row.auditStatus === RegistrationAuditStatus.PENDING"
        >
          审核不通过
        </el-button>
        <el-button type="primary" link @click="handleViewDetail(row)">
          查看
        </el-button>
      </template>
    </CommonTable>

    <!-- 审核不通过对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="审核不通过" width="500px">
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="审核意见">
          <el-input
            v-model="rejectForm.auditComment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核不通过的原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRejectConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { registrationApi, activityApi } from '@/api/operations/activityApi'
import {
  RegistrationAuditStatus,
  RegistrationAuditStatusText,
  RegistrationAuditStatusTagType,
  type RegistrationInfo,
  type RegistrationQueryParams,
  type AuditParams,
} from '@/types/operations/activity'
import type { ActivityInfo } from '@/types/operations/activity'

// 表格ID
const tableId = 'admin-registration'

// 查询参数
const queryParams = reactive<RegistrationQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  activityId: undefined,
  auditStatus: undefined,
  startTime: '',
  endTime: '',
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<RegistrationInfo[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 活动列表
const activityList = ref<ActivityInfo[]>([])

// 审核不通过对话框
const rejectDialogVisible = ref(false)
const rejectForm = reactive({
  ids: [] as number[],
  auditComment: '',
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '姓名', width: 100, sortable: true },
  { prop: 'workerPhone', label: '手机号', width: 130, sortable: true },
  { prop: 'activityTitle', label: '活动/社团标题', minWidth: 180, sortable: true },
  { prop: 'auditStatus', label: '审核状态', width: 100, sortable: true },
  { prop: 'submitTime', label: '提交报名时间', width: 180, sortable: true },
  { prop: 'auditTime', label: '审核时间', width: 180, sortable: true },
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

    const response = await registrationApi.getRegistrationList(queryParams)
    tableData.value = response.data.list
    total.value = response.data.total
    currentPage.value = response.data.page
    pageSize.value = response.data.pageSize
  } catch (error) {
    console.error('加载报名数据失败:', error)
    ElMessage.error('加载报名数据失败')
  } finally {
    loading.value = false
  }
}

// 加载活动列表
const loadActivityList = async () => {
  try {
    const response = await activityApi.getActivityList({
      page: 1,
      pageSize: 1000,
    })
    activityList.value = response.data.list
  } catch (error) {
    console.error('加载活动列表失败:', error)
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
  queryParams.activityId = undefined
  queryParams.auditStatus = undefined
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

// 审核通过
const handleApprove = async (row: RegistrationInfo) => {
  try {
    await ElMessageBox.confirm('确认审核通过该报名?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await registrationApi.auditRegistration({
      ids: [row.id],
      auditStatus: RegistrationAuditStatus.APPROVED,
    })
    ElMessage.success('审核通过成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('审核通过失败:', error)
      ElMessage.error('审核通过失败')
    }
  }
}

// 审核不通过
const handleReject = (row: RegistrationInfo) => {
  rejectForm.ids = [row.id]
  rejectForm.auditComment = ''
  rejectDialogVisible.value = true
}

// 确认审核不通过
const handleRejectConfirm = async () => {
  if (!rejectForm.auditComment) {
    ElMessage.warning('请输入审核不通过的原因')
    return
  }

  try {
    await registrationApi.auditRegistration({
      ids: rejectForm.ids,
      auditStatus: RegistrationAuditStatus.REJECTED,
      auditComment: rejectForm.auditComment,
    })
    ElMessage.success('审核不通过成功')
    rejectDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('审核不通过失败:', error)
    ElMessage.error('审核不通过失败')
  }
}

// 查看
const handleViewDetail = (row: RegistrationInfo) => {
  console.log('查看:', row)
  // TODO: 跳转到详情页
}

// 批量操作
const handleBatchAction = async (selectedRows: RegistrationInfo[]) => {
  const pendingRows = selectedRows.filter(
    row => row.auditStatus === RegistrationAuditStatus.PENDING
  )

  if (pendingRows.length === 0) {
    ElMessage.warning('请选择待审核的报名记录')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认批量审核通过选中的${pendingRows.length}条报名记录?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const ids = pendingRows.map(row => row.id)
    await registrationApi.batchApproveRegistration(ids)
    ElMessage.success('批量审核通过成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量审核失败:', error)
      ElMessage.error('批量审核失败')
    }
  }
}

// 生命周期
onMounted(() => {
  loadData()
  loadActivityList()
})
</script>

<style scoped>
.admin-registration-page {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
}
</style>
