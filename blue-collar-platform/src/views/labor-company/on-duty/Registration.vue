<template>
  <div class="registration-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="姓名/手机号">
          <el-input
            v-model="filterForm.keyword"
            placeholder="请输入姓名或手机号"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="活动/社团标题">
          <el-input
            v-model="filterForm.activity"
            placeholder="搜索活动/社团标题"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select
            v-model="filterForm.status"
            placeholder="审核状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="审核中" value="processing" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <div class="expand-toggle" @click="toggleFilter">
        <el-icon :class="{ 'rotate-180': filterExpanded }"><ArrowDown /></el-icon>
        <span>{{ filterExpanded ? '收起' : '展开' }}</span>
      </div>
      <!-- 展开显示更多查询条件 -->
      <div v-if="filterExpanded" class="filter-content expanded">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="报名类型">
            <el-select
              v-model="filterForm.type"
              placeholder="报名类型"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="活动报名" value="activity" />
              <el-option label="社团报名" value="community" />
            </el-select>
          </el-form-item>
          <el-form-item label="提交日期范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 250px"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button
        type="warning"
        :disabled="selectedRows.length === 0"
        @click="handleBatchApprove"
      >
        <el-icon><Check /></el-icon>
        批量审核
      </el-button>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="registration-table"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :show-selection="true"
      :show-toolbar="true"
      :stats-info="statsInfo"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @selection-change="handleSelectionChange"
      @global-search="handleGlobalSearch"
    >

      <template #column-registrationType="{ row }">
        <el-tag :type="row.registrationType === 'activity' ? 'primary' : 'success'">
          {{ row.registrationType === 'activity' ? '活动报名' : '社团报名' }}
        </el-tag>
      </template>

      <template #column-paymentType="{ row }">
        <el-tag :type="row.paymentType === 'daily' ? 'warning' : 'success'">
          {{ row.paymentType === 'daily' ? '日结' : '月结' }}
        </el-tag>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-submitTime="{ row }">
        {{ formatDateTime(row.submitTime) }}
      </template>

      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button
          v-if="row.status === 'pending' || row.status === 'processing'"
          type="warning"
          link
          @click="handleApprove(row)"
        >
          <el-icon><Check /></el-icon>
          审核
        </el-button>
      </template>
    </CommonTable>




  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Check, Close, View, ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'
import type { FormInstance, FormRules } from 'element-plus'
import {
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval,
  getApprovalRecords,
  getApprovalStatus
} from '@/api/approvalApi'
import type { ApprovalRecord } from '@/types/approval-flow'

// 类型定义
interface RegistrationRecord {
  id: string
  workerName: string
  phone: string
  paymentType: 'daily' | 'monthly'
  registrationType: 'activity' | 'community'
  activityTitle: string
  status: 'pending' | 'processing' | 'approved' | 'rejected'
  submitTime: string
  description?: string
  rejectReason?: string
  approvalRecords?: ApprovalRecord[]
  needsApproval?: boolean
}

// 响应式数据
const router = useRouter()
const filterExpanded = ref(false)
const filterForm = reactive({
  keyword: '',
  activity: '',
  status: '',
  type: '',
  dateRange: [] as string[]
})
const tableData = ref<RegistrationRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedRows = ref<RegistrationRecord[]>([])
const currentRow = ref<RegistrationRecord | null>(null)

// 对话框控制
const detailDialogVisible = ref(false)

// 获取业务字段配置
const getBusinessFields = () => {
  return [
    { field: 'workerName', label: '姓名', type: 'text' },
    { field: 'phone', label: '手机号', type: 'text' },
    { field: 'registrationType', label: '报名类型', type: 'enum', options: [
      { label: '活动报名', value: 'activity' },
      { label: '社团报名', value: 'community' }
    ]},
    { field: 'activityTitle', label: '活动/社团标题', type: 'text' },
    { field: 'status', label: '审核状态', type: 'enum', options: [
      { label: '待审核', value: 'pending', color: 'warning' },
      { label: '审核中', value: 'processing', color: 'primary' },
      { label: '已通过', value: 'approved', color: 'success' },
      { label: '已驳回', value: 'rejected', color: 'danger' }
    ]},
    { field: 'submitTime', label: '提交时间', type: 'datetime' },
    { field: 'description', label: '报名说明', type: 'text', span: 2 }
  ]
}

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'paymentType', label: '结算方式', minWidth: 100 },
  { prop: 'registrationType', label: '报名类型', minWidth: 100 },
  { prop: 'activityTitle', label: '活动/社团标题', minWidth: 200 },
  { prop: 'status', label: '审核状态', minWidth: 100 },
  { prop: 'submitTime', label: '提交时间', minWidth: 160, sortable: true }
]

// 统计数据
const stats = reactive({
  pendingCount: 0,
  processingCount: 0,
  approvedCount: 0,
  rejectedCount: 0
})

// 统计信息字符串
const statsInfo = computed(() => {
  return `待审核: ${stats.pendingCount} | 审核中: ${stats.processingCount} | 已通过: ${stats.approvedCount} | 已驳回: ${stats.rejectedCount}`
})

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

// 模拟数据存储
const allData = ref<RegistrationRecord[]>([])

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || status
}

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 生成模拟数据
const generateMockData = (): RegistrationRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二']
  const activityTitles = [
    '周末篮球比赛',
    '中秋相亲派对',
    '技能培训班',
    '国庆文艺晚会',
    '羽毛球友谊赛',
    '读书分享会',
    '摄影外拍活动',
    '舞蹈教学课程',
    '歌手大赛',
    '趣味运动会',
    '篮球社招募',
    '足球社招募',
    '羽毛球社招募',
    '读书会社团',
    '摄影会社团'
  ]
  const types: RegistrationRecord['registrationType'][] = ['activity', 'community']
  const statuses: RegistrationRecord['status'][] = ['pending', 'processing', 'approved', 'rejected']
  const data: RegistrationRecord[] = []

  for (let i = 0; i < 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const registrationType = types[Math.floor(Math.random() * types.length)]
    const submitTime = new Date()
    submitTime.setDate(submitTime.getDate() - Math.floor(Math.random() * 15))

    // 随机决定是否需要审核
    const needsApproval = Math.random() > 0.3

    const approvalRecords: ApprovalRecord[] = []
    if (needsApproval && (status === 'approved' || status === 'rejected')) {
      const approvalTime = new Date(submitTime)
      approvalTime.setHours(approvalTime.getHours() + Math.floor(Math.random() * 48) + 1)
      approvalRecords.push({
        nodeId: 'node-1',
        nodeName: '管理员审批',
        nodeType: 'approval',
        approver: '管理员',
        approvalTime: approvalTime,
        approvalResult: status as 'approved' | 'rejected',
        approvalComment: status === 'approved' ? '材料齐全，同意通过' : '信息不完整，请补充',
        rejectReason: status === 'rejected' ? '信息不完整，请补充后再提交' : undefined
      })
    }

    data.push({
      id: `REG${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      paymentType: Math.random() > 0.5 ? 'daily' : 'monthly',
      registrationType,
      activityTitle: activityTitles[Math.floor(Math.random() * activityTitles.length)],
      status,
      submitTime: submitTime.toISOString(),
      description: registrationType === 'activity' ? '自愿报名参加此活动' : '自愿申请加入此社团',
      rejectReason: status === 'rejected' ? '信息不完整，请补充后再提交' : undefined,
      approvalRecords: needsApproval ? approvalRecords : undefined,
      needsApproval
    })
  }

  return data
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const handleReset = () => {
  filterForm.keyword = ''
  filterForm.activity = ''
  filterForm.status = ''
  filterForm.type = ''
  filterForm.dateRange = []
  handleSearch()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 选择变化
const handleSelectionChange = (selection: RegistrationRecord[]) => {
  selectedRows.value = selection
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  filterForm.keyword = keyword
  handleSearch()
}

// 获取数据
const fetchData = () => {
  loading.value = true

  let filteredData = [...allData.value]

  if (filterForm.keyword) {
    const keyword = filterForm.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword)
    )
  }

  if (filterForm.activity) {
    filteredData = filteredData.filter(item =>
      item.activityTitle.toLowerCase().includes(filterForm.activity.toLowerCase())
    )
  }

  if (filterForm.status) {
    filteredData = filteredData.filter(item => item.status === filterForm.status)
  }

  if (filterForm.type) {
    filteredData = filteredData.filter(item => item.registrationType === filterForm.type)
  }

  // 日期范围过滤
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const startDate = new Date(filterForm.dateRange[0])
    const endDate = new Date(filterForm.dateRange[1])
    endDate.setHours(23, 59, 59, 999)
    filteredData = filteredData.filter(item => {
      const submitDate = new Date(item.submitTime)
      return submitDate >= startDate && submitDate <= endDate
    })
  }

  // 更新统计
  stats.pendingCount = filteredData.filter(item => item.status === 'pending').length
  stats.processingCount = filteredData.filter(item => item.status === 'processing').length
  stats.approvedCount = filteredData.filter(item => item.status === 'approved').length
  stats.rejectedCount = filteredData.filter(item => item.status === 'rejected').length

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length

  loading.value = false
}

// 查看
const handleView = (row: RegistrationRecord) => {
  router.push({
    name: 'TenantRegistrationDetail',
    params: { id: row.id }
  })
}

// 审核通过（列表页快速操作）
const handleApprove = (row: RegistrationRecord) => {
  if (!row.needsApproval) {
    ElMessage.warning('该报名不需要审核')
    return
  }
  router.push({
    name: 'TenantRegistrationDetail',
    params: { id: row.id },
    query: { mode: 'approve' }
  })
}

// 审核驳回（列表页快速操作）
const handleReject = (row: RegistrationRecord) => {
  if (!row.needsApproval) {
    ElMessage.warning('该报名不需要审核')
    return
  }
  router.push({
    name: 'TenantRegistrationDetail',
    params: { id: row.id },
    query: { mode: 'approve' }
  })
}

// 批量审核
const handleBatchApprove = async () => {
  if (selectedRows.value.length === 0) return

  const pendingRows = selectedRows.value.filter(
    row => row.needsApproval && (row.status === 'pending' || row.status === 'processing')
  )

  if (pendingRows.length === 0) {
    ElMessage.warning('没有待审核的记录')
    return
  }

  try {
    // 让用户选择审核结果
    ElMessageBox.confirm(
      `请选择审核结果`,
      '批量审核',
      {
        confirmButtonText: '通过',
        cancelButtonText: '驳回',
        type: 'warning'
      }
    ).then(async () => {
      // 批量通过
      await approveApproval({
        businessId: pendingRows.map(row => row.id).join(','),
        businessType: 'REGISTRATION',
        result: 'approved',
        comment: '批量审核通过'
      })
      ElMessage.success('批量审核通过成功')
      fetchData()
    }).catch(async () => {
      // 批量驳回
      ElMessageBox.prompt('请输入驳回原因', '批量审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputPattern: /.{5,}/,
        inputErrorMessage: '驳回原因至少5个字符'
      }).then(async ({ value }) => {
        await rejectApproval({
          businessId: pendingRows.map(row => row.id).join(','),
          businessType: 'REGISTRATION',
          result: 'rejected',
          rejectReason: value,
          comment: '批量审核驳回'
        })
        ElMessage.success('批量驳回成功')
        fetchData()
      }).catch(() => {})
    })
  } catch (error) {
    console.error('批量审核失败:', error)
    ElMessage.error('批量审核失败')
  }
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchData()
})
</script>

<style scoped>
.registration-management {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #f5f7fa;
}

.search-filter-section {
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.filter-form {
  padding: 16px;
  padding-bottom: 0;
}

.expand-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  color: #409eff;
  border-top: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.expand-toggle:hover {
  background-color: #f5f7fa;
}

.expand-toggle .el-icon {
  margin-right: 8px;
  transition: transform 0.3s;
}

.expand-toggle .rotate-180 {
  transform: rotate(180deg);
}

.filter-content.expanded {
  padding: 16px;
  border-top: 1px solid #e4e7ed;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
}

.detail-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .registration-management {
    padding: 8px;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .filter-form :deep(.el-input),
  .filter-form :deep(.el-select),
  .filter-form :deep(.el-date-picker) {
    width: 100%;
  }

  .detail-content {
    padding: 5px;
  }
}
</style>
