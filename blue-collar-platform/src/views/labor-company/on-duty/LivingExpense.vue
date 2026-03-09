<template>
  <div class="living-expense-management">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-default">
        <div class="filter-toggle-container">
          <el-form :model="searchForm" inline>
            <el-form-item label="工人姓名/手机号">
              <el-input
                v-model="searchForm.keyword"
                placeholder="请输入工人姓名或手机号"
                clearable
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="申请状态">
              <el-select
                v-model="searchForm.status"
                placeholder="申请状态"
                clearable
                style="width: 150px"
              >
                <el-option label="全部" value="" />
                <el-option label="待审核" value="pending" />
                <el-option label="已通过" value="approved" />
                <el-option label="已驳回" value="rejected" />
                <el-option label="已发放" value="issued" />
              </el-select>
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
          <el-button type="text" class="filter-toggle" @click="filterVisible = !filterVisible">
            {{ filterVisible ? '收起' : '展开' }}
            <el-icon>
              <component :is="filterVisible ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
          </el-button>
        </div>
      </div>
      <!-- 展开后显示的全部查询条件 -->
      <el-collapse-transition>
        <div v-show="filterVisible" class="filter-expanded">
          <el-form :model="searchForm" inline>
            <el-form-item label="申请日期">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 240px"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" :disabled="selectedRows.length === 0" @click="handleBatchIssue">
        <el-icon><Money /></el-icon>
        批量发放
      </el-button>
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
    </div>

    <!-- 生活费申请信息 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共 {{ stats.totalCount }} 笔申请，其中待审核 {{ stats.pendingCount }} 笔，已通过 {{ stats.approvedCount }} 笔，已发放金额 ¥{{ stats.issuedAmount.toFixed(2) }}</span>
      </div>
      <CommonTable
        :data="tableData"
        :columns="tableColumns"
        table-id="living-expense-table"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :loading="loading"
        :show-selection="true"
        :show-actions="true"
        @update:current-page="handleCurrentChange"
        @update:page-size="handleSizeChange"
        @sort-change="handleSortChange"
        @global-search="handleGlobalSearch"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
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

        <template #column-issueDate="{ row }">
          {{ row.issueDate ? formatDate(row.issueDate) : '-' }}
        </template>

        <template #column-paymentType="{ row }">
          <el-tag :type="row.paymentType === '日结' ? 'warning' : 'success'">
            {{ row.paymentType }}
          </el-tag>
        </template>

        <template #actions="{ row }">
          <el-button
            size="small"
            type="primary"
            link
            @click="handleView(row)"
          >
            <el-icon><View /></el-icon>
            查看
          </el-button>
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="success"
            link
            @click="handleApprove(row)"
          >
            <el-icon><Check /></el-icon>
            审核
          </el-button>
          <el-button
            v-if="row.status === 'approved'"
            size="small"
            type="warning"
            link
            @click="handleIssue(row)"
          >
            <el-icon><Money /></el-icon>
            发放
          </el-button>
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="danger"
            link
            @click="handleDelete(row)"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

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
        <el-form-item label="开放申请日期">
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
import { useRouter } from 'vue-router'
import { Search, RefreshLeft, Upload, Download, Setting, Money, View, Check, Delete, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'
import { fetchLivingExpenseList, updateLivingExpenseStatus, deleteLivingExpense, batchUpdateLivingExpenseStatus } from '@/api/livingExpense'

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
  paymentType: '日结' | '月结'
}

// 响应式数据
const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: [] as string[]
})
const filterVisible = ref(false)
const tableData = ref<LivingExpenseRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedRows = ref<LivingExpenseRecord[]>([])
const currentRow = ref<LivingExpenseRecord | null>(null)

// 路由实例
const router = useRouter()

// 对话框控制
const configDialogVisible = ref(false)
const approveDialogVisible = ref(false)
const issueDialogVisible = ref(false)
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
const tableColumns = [
  { prop: 'workerName', label: '工人姓名', width: 120, sortable: true },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'paymentType', label: '结算方式', width: 100, sortable: true },
  { prop: 'amount', label: '申请金额', width: 120, sortable: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'applyDate', label: '申请时间', width: 160, sortable: true },
  { prop: 'issueDate', label: '发放时间', width: 160, sortable: true }
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
    const paymentType = Math.random() > 0.5 ? '日结' : '月结'

    data.push({
      id: `LE${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      amount: Math.floor(Math.random() * 500 + 100),
      status,
      applyDate: applyDate.toISOString().split('T')[0],
      issueDate: status === 'issued' ? new Date(applyDate.getTime() + 86400000).toISOString().split('T')[0] : undefined,
      description: '日常生活费用申请',
      rejectReason: status === 'rejected' ? '申请金额超出可发放范围' : undefined,
      paymentType
    })
  }

  return data
}

// 所有模拟数据已移至api/livingExpense.ts中

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
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 分页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 排序变化
const handleSortChange = (sort: any) => {
  // 排序逻辑
  console.log('排序变化:', sort)
  fetchData()
}

// 行点击
const handleRowClick = (row: LivingExpenseRecord) => {
  // 行点击逻辑
  console.log('行点击:', row)
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
  searchForm.keyword = keyword
  handleSearch()
}



// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.keyword,
      status: searchForm.status,
      dateRange: searchForm.dateRange
    }
    const response = fetchLivingExpenseList(params)
    if (response.code === 200) {
      tableData.value = response.data.list
      total.value = response.data.total
      
      // 更新统计
      stats.totalCount = response.data.total
      // 这里可以根据需要从API获取统计数据，现在暂时使用前端计算
      stats.pendingCount = tableData.value.filter(item => item.status === 'pending').length
      stats.approvedCount = tableData.value.filter(item => item.status === 'approved').length
      stats.issuedAmount = tableData.value
        .filter(item => item.status === 'issued')
        .reduce((sum, item) => sum + item.amount, 0)
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
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

// 查看
const handleView = (row: LivingExpenseRecord) => {
  router.push(`/tenant/on-duty/living-expense/detail/${row.id}`)
}

// 审核
const handleApprove = (row: LivingExpenseRecord) => {
  router.push({
    path: `/tenant/on-duty/living-expense/detail/${row.id}`,
    query: { mode: 'approve' }
  })
}

// 提交审核
const handleSubmitApprove = async () => {
  if (!currentRow.value) return

  if (approveForm.result === 'rejected' && !approveForm.reason) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  try {
    const data = {
      reason: approveForm.reason,
      comment: approveForm.comment
    }
    const response = updateLivingExpenseStatus(currentRow.value.id, approveForm.result as LivingExpenseRecord['status'], data)
    if (response.code === 200) {
      ElMessage.success(approveForm.result === 'approved' ? '审核通过' : '已驳回')
      approveDialogVisible.value = false
      fetchData()
    }
  } catch (error) {
    ElMessage.error('审核失败')
  }
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
const handleSubmitIssue = async () => {
  if (!currentRow.value) return

  try {
    const data = {
      issueDate: issueForm.issueDate,
      remark: issueForm.comment
    }
    const response = updateLivingExpenseStatus(currentRow.value.id, 'issued', data)
    if (response.code === 200) {
      ElMessage.success('生活费发放成功')
      issueDialogVisible.value = false
      fetchData()
    }
  } catch (error) {
    ElMessage.error('发放失败')
  }
}

// 删除
const handleDelete = (row: LivingExpenseRecord) => {
  ElMessageBox.confirm('确定要删除该生活费申请记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response = deleteLivingExpense(row.id)
      if (response.code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
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
  ).then(async () => {
    try {
      const ids = approvedRows.map(row => row.id)
      const data = {
        issueDate: new Date().toISOString().split('T')[0]
      }
      const response = batchUpdateLivingExpenseStatus(ids, 'issued', data)
      if (response.code === 200) {
        ElMessage.success('批量发放成功')
        fetchData()
      }
    } catch (error) {
      ElMessage.error('批量发放失败')
    }
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
  fetchData()
})
</script>

<style scoped>
.living-expense-management {
  padding: 16px;
  background-color: #f5f7fa;
}

.filter-card {
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-default {
  margin-bottom: 12px;
}

.filter-toggle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-toggle {
  white-space: nowrap;
}

.filter-expanded {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e4e7ed;
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
  color: #f56c6c;
}

.table-stats p {
  margin: 0;
  line-height: 1.5;
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

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .filter-toggle-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-bar .el-button {
    width: 100%;
  }
}
</style>
