<!-- 调岗管理页面 -->
<template>
  <div class="transfer-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="工人姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入工人姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.approvalStatus" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="未审核" value="pending" />
            <el-option label="审核中" value="processing" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="toggleFilter" class="expand-toggle">
            <el-icon :class="{ 'rotate': filterExpanded }"><ArrowDown /></el-icon>
            <span>{{ filterExpanded ? '收起' : '展开' }}</span>
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 展开显示的更多查询条件 -->
      <div v-if="filterExpanded" class="filter-content expanded">
        <el-form inline :model="searchForm" class="search-form">
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="期望调岗日期">
            <el-date-picker
              v-model="searchForm.transferDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 240px"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
      <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
      <el-button type="success" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button type="warning" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>

    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :show-selection="true"
      :show-index="true"
      :show-actions="true"
      :stats-info="statsInfo"
      :action-column-width="280"
      table-id="transfer-table"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #column-paymentType="{ row }">
        <el-tag :type="row.paymentType === 'daily' ? 'warning' : 'success'">
          {{ row.paymentType === 'daily' ? '日结' : '月结' }}
        </el-tag>
      </template>

      <template #column-approvalStatus="{ row }">
        <el-tag :type="getApprovalStatusTag(row.approvalStatus)">
          {{ getApprovalStatusText(row.approvalStatus) }}
        </el-tag>
      </template>
      <template #column-approvalRecords="{ row }">
        <el-button link type="primary" size="small" @click="viewApprovalRecords(row)">
          查看记录 ({{ row.approvalRecords?.length || 0 }})
        </el-button>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)" :disabled="row.approvalStatus !== 'pending'">编辑</el-button>
        <el-button link type="success" size="small" @click="handleApprove(row)" :disabled="row.approvalStatus === 'approved' || row.approvalStatus === 'rejected'">审核</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)" :disabled="row.approvalStatus !== 'pending'">删除</el-button>
      </template>
    </CommonTable>


  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Upload, Download, ArrowDown } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'

// 路由
const router = useRouter()

// 类型定义
interface TransferRecord {
  id: string
  workerName: string
  phone: string
  paymentType: 'daily' | 'monthly'
  expectedTransferDate: string
  originalDepartment: string
  originalPosition: string
  originalLeader: string
  targetDepartment: string
  targetPosition: string
  targetLeader: string
  transferReason: string
  approvalStatus: 'pending' | 'processing' | 'approved' | 'rejected'
  approvalRecords: ApprovalRecord[]
}

interface ApprovalRecord {
  approver: string
  approvalTime: string
  approvalResult: 'approved' | 'rejected'
  approvalComment: string
}

// 表格列配置
const columns = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'paymentType', label: '结算方式', minWidth: 100 },
  { prop: 'expectedTransferDate', label: '期望调岗日期', minWidth: 140, sortable: true },
  { prop: 'originalDepartment', label: '原部门', minWidth: 120 },
  { prop: 'originalPosition', label: '原岗位', minWidth: 100 },
  { prop: 'originalLeader', label: '原岗位直属领导', minWidth: 130 },
  { prop: 'targetDepartment', label: '目标部门', minWidth: 120 },
  { prop: 'targetPosition', label: '目标岗位', minWidth: 100 },
  { prop: 'targetLeader', label: '目标岗位直属组长', minWidth: 130 },
  { prop: 'transferReason', label: '调岗原因', minWidth: 150, showTooltip: true },
  { prop: 'approvalStatus', label: '审核状态', minWidth: 100, sortable: true },
  { prop: 'approvalRecords', label: '审核记录', minWidth: 100 }
]

// 响应式数据
const tableData = ref<TransferRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<TransferRecord[]>([])
const filterExpanded = ref(false)
const statsInfo = ref<Array<{ label: string; value: string }>>([])

const searchForm = reactive({
  workerName: '',
  phone: '',
  approvalStatus: '',
  transferDate: [] as string[]
})

// Mock数据
const mockData: TransferRecord[] = [
  {
    id: '1',
    workerName: '张三',
    phone: '13800138001',
    paymentType: 'daily',
    expectedTransferDate: '2024-03-01',
    originalDepartment: '生产部',
    originalPosition: '操作工',
    originalLeader: '李主管',
    targetDepartment: '质检部',
    targetPosition: '质检员',
    targetLeader: '王组长',
    transferReason: '个人发展需求',
    approvalStatus: 'pending',
    approvalRecords: []
  },
  {
    id: '2',
    workerName: '李四',
    phone: '13800138002',
    paymentType: 'monthly',
    expectedTransferDate: '2024-02-15',
    originalDepartment: '包装部',
    originalPosition: '包装工',
    originalLeader: '赵主管',
    targetDepartment: '仓储部',
    targetPosition: '仓管员',
    targetLeader: '钱组长',
    transferReason: '工作表现优秀',
    approvalStatus: 'approved',
    approvalRecords: [
      { approver: '管理员', approvalTime: '2024-02-10 10:00:00', approvalResult: 'approved', approvalComment: '同意调岗' }
    ]
  },
  {
    id: '3',
    workerName: '王五',
    phone: '13800138003',
    paymentType: 'daily',
    expectedTransferDate: '2024-02-20',
    originalDepartment: '组装部',
    originalPosition: '组装工',
    originalLeader: '孙主管',
    targetDepartment: '设备部',
    targetPosition: '设备维护',
    targetLeader: '周组长',
    transferReason: '技能匹配',
    approvalStatus: 'processing',
    approvalRecords: [
      { approver: '管理员', approvalTime: '2024-02-18 09:00:00', approvalResult: 'approved', approvalComment: '初审通过' }
    ]
  },
  {
    id: '4',
    workerName: '赵六',
    phone: '13800138004',
    paymentType: 'monthly',
    expectedTransferDate: '2024-03-05',
    originalDepartment: '生产部',
    originalPosition: '操作工',
    originalLeader: '李主管',
    targetDepartment: '物流部',
    targetPosition: '配送员',
    targetLeader: '吴组长',
    transferReason: '个人原因',
    approvalStatus: 'rejected',
    approvalRecords: [
      { approver: '管理员', approvalTime: '2024-02-12 14:00:00', approvalResult: 'rejected', approvalComment: '该部门暂无空缺' }
    ]
  }
]

// 获取审核状态标签类型
const getApprovalStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

// 获取审核状态文本
const getApprovalStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return map[status] || status
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let filteredData = [...mockData]

    // 筛选
    if (searchForm.workerName) {
      filteredData = filteredData.filter(item => item.workerName.includes(searchForm.workerName))
    }
    if (searchForm.phone) {
      filteredData = filteredData.filter(item => item.phone.includes(searchForm.phone))
    }
    if (searchForm.approvalStatus) {
      filteredData = filteredData.filter(item => item.approvalStatus === searchForm.approvalStatus)
    }
    if (searchForm.transferDate?.length === 2) {
      filteredData = filteredData.filter(item => {
        return item.expectedTransferDate >= searchForm.transferDate[0] &&
               item.expectedTransferDate <= searchForm.transferDate[1]
      })
    }

    total.value = filteredData.length
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filteredData.slice(start, start + pageSize.value)
    
    // 计算统计信息
    const pendingCount = filteredData.filter(item => item.approvalStatus === 'pending').length
    const approvedCount = filteredData.filter(item => item.approvalStatus === 'approved').length
    const processingCount = filteredData.filter(item => item.approvalStatus === 'processing').length
    const rejectedCount = filteredData.filter(item => item.approvalStatus === 'rejected').length
    
    statsInfo.value = [
      { label: '总计调岗记录', value: total.value.toString() },
      { label: '待审核', value: pendingCount.toString() },
      { label: '审核中', value: processingCount.toString() },
      { label: '已通过', value: approvedCount.toString() },
      { label: '已驳回', value: rejectedCount.toString() }
    ]
    
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.workerName = ''
  searchForm.phone = ''
  searchForm.approvalStatus = ''
  searchForm.transferDate = []
  handleSearch()
}

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

// 导入
const handleImport = () => {
  ElMessage.info('导入功能开发中')
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}



// 新增
const handleAdd = () => {
  router.push('/tenant/on-duty/transfer-add')
}

// 编辑
const handleEdit = (row: TransferRecord) => {
  router.push(`/tenant/on-duty/transfer-edit/${row.id}`)
}

// 详情
const handleDetail = (row: TransferRecord) => {
  router.push(`/tenant/on-duty/transfer-detail/${row.id}`)
}

// 删除
const handleDelete = (row: TransferRecord) => {
  ElMessageBox.confirm('确定要删除该调岗记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData.splice(index, 1)
      ElMessage.success('删除成功')
      loadData()
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedRows.value.map(item => item.id)
    ids.forEach(id => {
      const index = mockData.findIndex(item => item.id === id)
      if (index > -1) {
        mockData.splice(index, 1)
      }
    })
    ElMessage.success('批量删除成功')
    loadData()
  }).catch(() => {})
}

// 查看审核记录
const viewApprovalRecords = (row: TransferRecord) => {
  // 跳转到详情页面查看审批记录
  router.push(`/tenant/on-duty/transfer-detail/${row.id}`)
}

// 审核
const handleApprove = (row: TransferRecord) => {
  router.push(`/tenant/on-duty/transfer-approve/${row.id}`)
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: TransferRecord[]) => {
  selectedRows.value = selection
}

// 分页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.transfer-page {
  padding: 16px;
  background-color: #f5f7fa;
}

.search-filter-section {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e4e7ed;
  animation: slideDown 0.3s ease;
}

.expand-toggle {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rotate {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

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

.approval-records {
  margin-top: 20px;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .search-form {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-form .el-form-item {
    width: 100%;
  }
  
  .search-form .el-input,
  .search-form .el-select,
  .search-form .el-date-picker {
    width: 100% !important;
  }
}
</style>
