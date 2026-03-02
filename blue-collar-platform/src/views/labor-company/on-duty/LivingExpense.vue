<template>
  <div class="living-expense-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索工人姓名或手机号"
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="statusFilter"
            placeholder="申请状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
            <el-option label="已发放" value="issued" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleSearch"
          />
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.pendingCount }}</div>
          <div class="stat-label">待审核</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.approvedCount }}</div>
          <div class="stat-label">已通过</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">¥{{ stats.issuedAmount.toFixed(2) }}</div>
          <div class="stat-label">已发放金额</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalCount }}</div>
          <div class="stat-label">申请总数</div>
        </div>
      </el-card>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="living-expense-table"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :show-selection="true"
      :show-toolbar="true"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @selection-change="handleSelectionChange"
      @global-search="handleGlobalSearch"
    >
      <template #toolbar-left>
        <el-button
          type="primary"
          :disabled="selectedRows.length === 0"
          @click="handleBatchIssue"
        >
          <el-icon><Money /></el-icon>
          批量发放
        </el-button>
      </template>

      <template #toolbar-right>
        <el-button type="success" @click="handleImport">
          <el-icon><Upload /></el-icon>
          导入
        </el-button>
        <el-button type="warning" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
        <el-button type="info" @click="handleOpenConfig">
          <el-icon><Setting /></el-icon>
          规则配置
        </el-button>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-amount="{ row }">
        <span class="amount">¥{{ row.amount.toFixed(2) }}</span>
      </template>

      <template #column-applyDate="{ row }">
        {{ formatDate(row.applyDate) }}
      </template>

      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button
          v-if="row.status === 'pending'"
          type="success"
          link
          @click="handleApprove(row)"
        >
          <el-icon><Check /></el-icon>
          审核
        </el-button>
        <el-button
          v-if="row.status === 'approved'"
          type="warning"
          link
          @click="handleIssue(row)"
        >
          <el-icon><Money /></el-icon>
          发放
        </el-button>
        <el-button
          v-if="row.status === 'pending'"
          type="danger"
          link
          @click="handleDelete(row)"
        >
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </template>
    </CommonTable>

    <!-- 规则配置对话框 -->
    <el-dialog
      v-model="configDialogVisible"
      title="生活费申请规则配置"
      width="500px"
    >
      <el-form :model="configForm" label-width="150px">
        <el-form-item label="每周申请次数限制">
          <el-input-number
            v-model="configForm.weeklyLimit"
            :min="1"
            :max="10"
          />
          <span class="form-tip">次</span>
        </el-form-item>
        <el-form-item label="开发申请日期">
          <el-input-number
            v-model="configForm.daysAfterEntry"
            :min="1"
            :max="30"
          />
          <span class="form-tip">天（进厂后第几天可申请）</span>
        </el-form-item>
        <el-form-item label="单次申请上限">
          <el-input-number
            v-model="configForm.maxAmount"
            :min="0"
            :max="10000"
            :step="100"
          />
          <span class="form-tip">元（0表示不限制）</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="configForm.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveConfig">保存</el-button>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="approveDialogVisible"
      title="审核生活费申请"
      width="500px"
    >
      <el-form :model="approveForm" label-width="120px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="approveForm.result">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="approveForm.result === 'rejected'" label="驳回原因">
          <el-input
            v-model="approveForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入驳回原因"
          />
        </el-form-item>
        <el-form-item v-if="approveForm.result === 'approved'" label="备注">
          <el-input
            v-model="approveForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitApprove">确定</el-button>
      </template>
    </el-dialog>

    <!-- 发放对话框 -->
    <el-dialog
      v-model="issueDialogVisible"
      title="生活费发放"
      width="500px"
    >
      <el-form :model="issueForm" label-width="120px">
        <el-form-item label="发放金额">
          <el-input-number
            v-model="issueForm.amount"
            :min="0"
            :precision="2"
          />
          <span class="form-tip">元</span>
        </el-form-item>
        <el-form-item label="发放方式">
          <el-select v-model="issueForm.method" placeholder="请选择">
            <el-option label="现金" value="cash" />
            <el-option label="银行转账" value="bank" />
            <el-option label="微信" value="wechat" />
            <el-option label="支付宝" value="alipay" />
          </el-select>
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker
            v-model="issueForm.issueDate"
            type="datetime"
            placeholder="选择发放时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="issueForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="issueDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitIssue">确定发放</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="生活费申请详情"
      width="600px"
    >
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请人">
            {{ currentRow.workerName }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ currentRow.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="申请金额">
            ¥{{ currentRow.amount.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">
            {{ formatDate(currentRow.applyDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="申请状态">
            <el-tag :type="getStatusType(currentRow.status)">
              {{ getStatusText(currentRow.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发放时间">
            {{ currentRow.issueDate ? formatDate(currentRow.issueDate) : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="申请说明" :span="2">
            {{ currentRow.description || '-' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="currentRow.rejectReason" label="驳回原因" :span="2">
            {{ currentRow.rejectReason }}
          </el-descriptions-item>
          <el-descriptions-item v-if="currentRow.remark" label="备注" :span="2">
            {{ currentRow.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入生活费数据"
      width="500px"
    >
      <div class="import-content">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              请上传Excel文件，支持.xlsx和.xls格式
            </div>
          </template>
        </el-upload>
        <div class="download-template">
          <el-button type="info" link @click="handleDownloadTemplate">
            <el-icon><Download /></el-icon>
            下载导入模板
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitImport">确定导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Upload, Download, Setting, Money, View, Check, Delete } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'

// 类型定义
interface LivingExpenseRecord {
  id: string
  workerName: string
  phone: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'issued'
  applyDate: string
  issueDate?: string
  description?: string
  rejectReason?: string
  remark?: string
}

// 响应式数据
const searchKeyword = ref('')
const statusFilter = ref('')
const dateRange = ref<string[]>([])
const tableData = ref<LivingExpenseRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedRows = ref<LivingExpenseRecord[]>([])
const currentRow = ref<LivingExpenseRecord | null>(null)

// 对话框控制
const configDialogVisible = ref(false)
const approveDialogVisible = ref(false)
const issueDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const importDialogVisible = ref(false)

// 配置表单
const configForm = reactive({
  weeklyLimit: 3,
  daysAfterEntry: 7,
  maxAmount: 0,
  enabled: true
})

// 审核表单
const approveForm = reactive({
  result: 'approved',
  reason: '',
  comment: ''
})

// 发放表单
const issueForm = reactive({
  amount: 0,
  method: 'bank',
  issueDate: '',
  comment: ''
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '工人姓名', minWidth: 120, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'amount', label: '申请金额', minWidth: 120, sortable: true },
  { prop: 'status', label: '状态', minWidth: 100 },
  { prop: 'applyDate', label: '申请时间', minWidth: 160, sortable: true },
  { prop: 'issueDate', label: '发放时间', minWidth: 160, sortable: true }
]

// 统计数据
const stats = reactive({
  pendingCount: 0,
  approvedCount: 0,
  issuedAmount: 0,
  totalCount: 0
})

// 生成模拟数据
const generateMockData = (): LivingExpenseRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二']
  const statuses: LivingExpenseRecord['status'][] = ['pending', 'approved', 'rejected', 'issued']
  const data: LivingExpenseRecord[] = []

  for (let i = 0; i < 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const applyDate = new Date()
    applyDate.setDate(applyDate.getDate() - Math.floor(Math.random() * 30))

    data.push({
      id: `LE${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      amount: Math.floor(Math.random() * 500 + 100),
      status,
      applyDate: applyDate.toISOString().split('T')[0],
      issueDate: status === 'issued' ? new Date(applyDate.getTime() + 86400000).toISOString().split('T')[0] : undefined,
      description: '日常生活费用申请',
      rejectReason: status === 'rejected' ? '申请金额超出可发放范围' : undefined
    })
  }

  return data
}

// 所有模拟数据
const allData = ref<LivingExpenseRecord[]>([])

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    approved: 'primary',
    rejected: 'danger',
    issued: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回',
    issued: '已发放'
  }
  return textMap[status] || status
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  return dateStr
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  dateRange.value = []
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
const handleSelectionChange = (selection: LivingExpenseRecord[]) => {
  selectedRows.value = selection
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}

// 获取数据
const fetchData = () => {
  loading.value = true

  // 模拟过滤
  let filteredData = [...allData.value]

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword)
    )
  }

  if (statusFilter.value) {
    filteredData = filteredData.filter(item => item.status === statusFilter.value)
  }

  if (dateRange.value && dateRange.value.length === 2) {
    filteredData = filteredData.filter(item => {
      return item.applyDate >= dateRange.value[0] && item.applyDate <= dateRange.value[1]
    })
  }

  // 更新统计
  stats.pendingCount = filteredData.filter(item => item.status === 'pending').length
  stats.approvedCount = filteredData.filter(item => item.status === 'approved').length
  stats.issuedAmount = filteredData
    .filter(item => item.status === 'issued')
    .reduce((sum, item) => sum + item.amount, 0)
  stats.totalCount = filteredData.length

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length

  loading.value = false
}

// 打开规则配置
const handleOpenConfig = () => {
  configDialogVisible.value = true
}

// 保存规则配置
const handleSaveConfig = () => {
  // 模拟保存配置
  ElMessage.success('规则配置保存成功')
  configDialogVisible.value = false
}

// 查看详情
const handleView = (row: LivingExpenseRecord) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 审核
const handleApprove = (row: LivingExpenseRecord) => {
  currentRow.value = row
  approveForm.result = 'approved'
  approveForm.reason = ''
  approveForm.comment = ''
  approveDialogVisible.value = true
}

// 提交审核
const handleSubmitApprove = () => {
  if (!currentRow.value) return

  if (approveForm.result === 'rejected' && !approveForm.reason) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  // 更新数据
  const index = allData.value.findIndex(item => item.id === currentRow.value!.id)
  if (index > -1) {
    allData.value[index].status = approveForm.result as LivingExpenseRecord['status']
    if (approveForm.result === 'rejected') {
      allData.value[index].rejectReason = approveForm.reason
    }
  }

  ElMessage.success(approveForm.result === 'approved' ? '审核通过' : '已驳回')
  approveDialogVisible.value = false
  fetchData()
}

// 发放
const handleIssue = (row: LivingExpenseRecord) => {
  currentRow.value = row
  issueForm.amount = row.amount
  issueForm.method = 'bank'
  issueForm.issueDate = new Date().toISOString().split('T')[0] + ' 12:00:00'
  issueForm.comment = ''
  issueDialogVisible.value = true
}

// 提交发放
const handleSubmitIssue = () => {
  if (!currentRow.value) return

  // 更新数据
  const index = allData.value.findIndex(item => item.id === currentRow.value!.id)
  if (index > -1) {
    allData.value[index].status = 'issued'
    allData.value[index].issueDate = issueForm.issueDate
    allData.value[index].remark = issueForm.comment
  }

  ElMessage.success('生活费发放成功')
  issueDialogVisible.value = false
  fetchData()
}

// 删除
const handleDelete = (row: LivingExpenseRecord) => {
  ElMessageBox.confirm('确定要删除该生活费申请记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 批量发放
const handleBatchIssue = () => {
  const approvedRows = selectedRows.value.filter(row => row.status === 'approved')
  if (approvedRows.length === 0) {
    ElMessage.warning('请选择已通过审核的记录进行发放')
    return
  }

  ElMessageBox.confirm(
    `确定要发放选中的 ${approvedRows.length} 条记录吗？`,
    '批量发放',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    approvedRows.forEach(row => {
      const index = allData.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        allData.value[index].status = 'issued'
        allData.value[index].issueDate = new Date().toISOString().split('T')[0]
      }
    })
    ElMessage.success('批量发放成功')
    fetchData()
  }).catch(() => {})
}

// 导入
const handleImport = () => {
  importDialogVisible.value = true
}

// 文件变化
const handleFileChange = (file: any) => {
  console.log('选择文件:', file.name)
}

// 提交导入
const handleSubmitImport = () => {
  ElMessage.success('导入成功')
  importDialogVisible.value = false
  fetchData()
}

// 下载模板
const handleDownloadTemplate = () => {
  ElMessage.info('正在下载模板文件')
}

// 导出
const handleExport = () => {
  ElMessage.info('正在导出数据')
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchData()
})
</script>

<style scoped>
.living-expense-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.search-filter-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px 0;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.amount {
  font-weight: bold;
  color: #e6a23c;
}

.form-tip {
  margin-left: 8px;
  color: #909399;
  font-size: 14px;
}

.import-content {
  padding: 20px;
}

.download-template {
  margin-top: 16px;
}

.detail-content {
  padding: 10px;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .search-filter-section :deep(.el-row) {
    flex-direction: column;
  }

  .search-filter-section :deep(.el-col) {
    width: 100%;
    margin-bottom: 12px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
