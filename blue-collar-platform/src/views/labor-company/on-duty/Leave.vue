<!-- 请假管理页面 -->
<template>
  <div class="leave-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="工人姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入工人姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="请假类型">
          <el-select v-model="searchForm.leaveType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="事假" value="personal" />
            <el-option label="病假" value="sick" />
            <el-option label="年假" value="annual" />
            <el-option label="婚假" value="marriage" />
            <el-option label="丧假" value="bereavement" />
            <el-option label="其他" value="other" />
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
          <el-form-item label="审核状态">
            <el-select v-model="searchForm.approvalStatus" placeholder="请选择" clearable style="width: 150px">
              <el-option label="全部" value="" />
              <el-option label="未审核" value="pending" />
              <el-option label="审核中" value="processing" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
            </el-select>
          </el-form-item>
          <el-form-item label="请假日期">
            <el-date-picker
              v-model="searchForm.leaveDate"
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
      :action-column-width="320"
      table-id="leave-table"
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

      <template #column-leaveType="{ row }">
        <el-tag :type="getLeaveTypeTag(row.leaveType)">
          {{ getLeaveTypeText(row.leaveType) }}
        </el-tag>
      </template>
      <template #column-approvalStatus="{ row }">
        <el-tag :type="getApprovalStatusTag(row.approvalStatus)">
          {{ getApprovalStatusText(row.approvalStatus) }}
        </el-tag>
      </template>
      <template #column-cancelled="{ row }">
        <el-tag :type="row.cancelled ? 'info' : 'default'">
          {{ row.cancelled ? '已销假' : '未销假' }}
        </el-tag>
      </template>
      <template #column-approvalRecords="{ row }">
        <el-button link type="primary" size="small" @click="viewApprovalRecords(row)">
          查看记录 ({{ row.approvalRecords?.length || 0 }})
        </el-button>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button 
          link 
          type="primary" 
          size="small" 
          @click="handleEdit(row)"
          :disabled="row.approvalStatus === 'approved' || row.approvalStatus === 'rejected'"
        >编辑</el-button>
        <el-button
          link
          type="warning"
          size="small"
          @click="handleApprove(row)"
          v-if="row.approvalStatus === 'pending' || row.approvalStatus === 'processing'"
        >
          审核
        </el-button>
        <el-button 
          link 
          type="info" 
          size="small" 
          @click="handleCancelLeave(row)"
          v-if="row.approvalStatus === 'approved' && !row.cancelled"
        >销假</el-button>
        <el-tag v-else-if="row.cancelled" type="info" size="small">已销假</el-tag>
        <el-button 
          link 
          type="danger" 
          size="small" 
          @click="handleDelete(row)"
          :disabled="row.approvalStatus === 'approved'"
        >删除</el-button>
      </template>
    </CommonTable>

    <!-- 销假对话框 -->
    <LeaveCancelDialog
      v-model:visible="cancelDialogVisible"
      :leave-info="currentLeave"
      @submit="handleCancelLeaveSubmit"
    />

    <!-- 导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="导入考勤数据" width="500px">
      <div class="import-content">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              请上传Excel文件，支持.xls和.xlsx格式
            </div>
          </template>
        </el-upload>
        <div class="download-template">
          <el-button link type="primary" @click="downloadTemplate">
            <el-icon><Download /></el-icon>
            下载导入模板
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit" :loading="importLoading">导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, CircleCheck, CircleClose, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import LeaveCancelDialog from '@/components/LeaveCancelDialog.vue'

const router = useRouter()

// 搜索表单
const filterExpanded = ref(false)
const searchForm = reactive({
  workerName: '',
  phone: '',
  leaveType: '',
  approvalStatus: '',
  leaveDate: [] as string[]
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<any[]>([])
const statsInfo = ref<Array<{ label: string; value: string }>>([])

// 表格列配置
const columns = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'paymentType', label: '结算方式', minWidth: 100 },
  { prop: 'leaveType', label: '请假类型', minWidth: 100 },
  { prop: 'startDate', label: '开始日期', minWidth: 160, sortable: true },
  { prop: 'endDate', label: '结束日期', minWidth: 160, sortable: true },
  { prop: 'days', label: '天数', minWidth: 80 },
  { prop: 'approvalStatus', label: '审核状态', minWidth: 100 },
  { prop: 'cancelled', label: '销假状态', minWidth: 100 },
  { prop: 'createTime', label: '创建时间', minWidth: 160, sortable: true },
  { prop: 'approvalRecords', label: '审核记录', minWidth: 120 }
]

// 表格引用
const tableRef = ref()

// 弹窗控制
const importDialogVisible = ref(false)
const importLoading = ref(false)
const uploadRef = ref()
const importFile = ref()

// 销假对话框
const cancelDialogVisible = ref(false)
const currentLeave = ref({})

// 获取请假类型标签
const getLeaveTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    personal: 'warning',
    sick: 'danger',
    annual: 'success',
    marriage: 'primary',
    bereavement: 'info',
    other: ''
  }
  return tagMap[type] || ''
}

// 获取请假类型文本
const getLeaveTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    personal: '事假',
    sick: '病假',
    annual: '年假',
    marriage: '婚假',
    bereavement: '丧假',
    other: '其他'
  }
  return textMap[type] || type
}

// 获取审核状态标签
const getApprovalStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return tagMap[status] || ''
}

// 获取审核状态文本
const getApprovalStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || status
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.workerName = ''
  searchForm.phone = ''
  searchForm.leaveType = ''
  searchForm.approvalStatus = ''
  searchForm.leaveDate = []
  handleSearch()
}

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    tableData.value = [
      {
        id: '1',
        workerName: '张三',
        phone: '13800138000',
        paymentType: 'daily',
        leaveType: 'personal',
        startDate: '2024-01-20 09:00:00',
        endDate: '2024-01-21 18:00:00',
        days: 2,
        approvalStatus: 'pending',
        reason: '家中有事需要处理',
        createTime: '2024-01-15 10:00:00',
        approvalRecords: [],
        cancelled: false
      },
      {
        id: '2',
        workerName: '李四',
        phone: '13800138001',
        paymentType: 'monthly',
        leaveType: 'sick',
        startDate: '2024-01-18 14:00:00',
        endDate: '2024-01-19 18:00:00',
        days: 1.5,
        approvalStatus: 'approved',
        reason: '感冒发烧需要休息',
        createTime: '2024-01-17 08:00:00',
        approvalRecords: [
          {
            nodeName: '部门主管',
            approver: '管理员',
            approvalTime: '2024-01-17 09:30:00',
            approvalResult: 'approved',
            approvalComment: '情况属实，同意请假'
          }
        ],
        cancelled: false
      },
      {
        id: '3',
        workerName: '王五',
        phone: '13800138002',
        paymentType: 'daily',
        leaveType: 'annual',
        startDate: '2024-02-01 09:00:00',
        endDate: '2024-02-05 18:00:00',
        days: 5,
        approvalStatus: 'processing',
        reason: '安排年假休息',
        createTime: '2024-01-20 11:00:00',
        approvalRecords: [
          {
            nodeName: '部门主管',
            approver: '管理员',
            approvalTime: '2024-01-20 14:00:00',
            approvalResult: 'approved',
            approvalComment: '同意'
          }
        ],
        cancelled: false
      },
      {
        id: '4',
        workerName: '赵六',
        phone: '13800138003',
        paymentType: 'monthly',
        leaveType: 'marriage',
        startDate: '2024-03-01 09:00:00',
        endDate: '2024-03-03 18:00:00',
        days: 3,
        approvalStatus: 'rejected',
        reason: '结婚需要请假',
        createTime: '2024-01-10 09:00:00',
        approvalRecords: [
          {
            nodeName: '部门主管',
            approver: '管理员',
            approvalTime: '2024-01-10 11:00:00',
            approvalResult: 'rejected',
            approvalComment: '日期与其他工作冲突，请调整时间'
          }
        ],
        cancelled: false
      }
    ]
    total.value = 4
    
    // 计算统计信息
    const totalDays = tableData.value.reduce((sum, item) => sum + (item.days || 0), 0)
    const pendingCount = tableData.value.filter(item => item.approvalStatus === 'pending').length
    const approvedCount = tableData.value.filter(item => item.approvalStatus === 'approved').length
    
    statsInfo.value = [
      { label: '总计请假记录', value: total.value.toString() },
      { label: '总计请假天数', value: totalDays.toFixed(1) + ' 天' },
      { label: '待审核', value: pendingCount.toString() },
      { label: '已通过', value: approvedCount.toString() }
    ]
    
    loading.value = false
  }, 500)
}

// 分页
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 排序
const handleSortChange = (sort: { prop: string; order: string }) => {
  console.log('排序变化:', sort)
}

// 选择
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  router.push('/tenant/on-duty/leave-add')
}

// 编辑
const handleEdit = (row: any) => {
  router.push({
    path: `/tenant/on-duty/leave-edit/${row.id}`
  })
}

// 详情
const handleDetail = (row: any) => {
  router.push({
    path: `/tenant/on-duty/leave-detail/${row.id}`
  })
}



// 审核
const handleApprove = (row: any) => {
  router.push({
    path: `/tenant/on-duty/leave-approve/${row.id}`
  })
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条请假记录吗？', '提示', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}



// 导入
const handleImport = () => {
  importDialogVisible.value = true
}

// 文件变化
const handleFileChange = (file: any) => {
  importFile.value = file
}

// 下载模板
const downloadTemplate = () => {
  ElMessage.info('模板下载功能开发中')
}

// 提交导入
const handleImportSubmit = async () => {
  if (!importFile.value) {
    ElMessage.warning('请先选择要导入的文件')
    return
  }
  importLoading.value = true
  setTimeout(() => {
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    importLoading.value = false
    importFile.value = null
    fetchData()
  }, 1000)
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 处理销假
const handleCancelLeave = (row: any) => {
  currentLeave.value = row
  cancelDialogVisible.value = true
}

// 处理销假提交
const handleCancelLeaveSubmit = (formData: any) => {
  // 找到对应的请假记录并标记为已销假
  const index = tableData.value.findIndex(item => item.id === formData.leaveId)
  if (index !== -1) {
    tableData.value[index].cancelled = true
    // 这里可以添加销假记录的保存逻辑
    ElMessage.success('销假成功')
  }
}



onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.leave-page {
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
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.approval-record {
  padding: 10px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-info {
  color: #666;
  font-size: 14px;
}

.record-comment {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.import-content {
  padding: 20px;
}

.download-template {
  margin-top: 20px;
  text-align: center;
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
