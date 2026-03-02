<template>
  <div class="salary-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-row :gutter="16" align="middle">
        <el-col :span="5">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索工人姓名或手机号"
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="salaryMonth"
            type="month"
            placeholder="选择发放月份"
            value-format="YYYY-MM"
            @change="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="statusFilter"
            placeholder="发放状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="待发放" value="pending" />
            <el-option label="已发放" value="issued" />
          </el-select>
        </el-col>
        <el-col :span="11">
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
          <div class="stat-number">{{ stats.workerCount }}</div>
          <div class="stat-label">发放人数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">¥{{ stats.totalAmount.toFixed(2) }}</div>
          <div class="stat-label">发放总额</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.pendingCount }}</div>
          <div class="stat-label">待发放</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.issuedCount }}</div>
          <div class="stat-label">已发放</div>
        </div>
      </el-card>
    </div>

    <!-- 基本信息 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>工资发放信息</span>
          <el-button type="primary" @click="handleOpenIssueDialog">新增发放</el-button>
        </div>
      </template>
      <el-form :inline="true" :model="salaryInfo" class="info-form">
        <el-form-item label="发放年月">
          <el-date-picker
            v-model="salaryInfo.salaryMonth"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker
            v-model="salaryInfo.issueDate"
            type="datetime"
            placeholder="选择发放时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="发放说明">
          <el-input
            v-model="salaryInfo.description"
            placeholder="请输入发放说明"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="salary-table"
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
        <el-button type="primary" :disabled="selectedRows.length === 0" @click="handleBatchIssue">
          <el-icon><Money /></el-icon>
          批量发放
        </el-button>
      </template>

      <template #toolbar-right>
        <el-button type="success" @click="handleImport">
          <el-icon><Upload /></el-icon>
          导入明细
        </el-button>
        <el-button type="warning" @click="handleGenerateList">
          <el-icon><Document /></el-icon>
          生成清单
        </el-button>
      </template>
      <template #column-basicSalary="{ row }">
        <span class="amount">¥{{ row.basicSalary.toFixed(2) }}</span>
      </template>

      <template #column-overtimeSalary="{ row }">
        <span class="amount">¥{{ row.overtimeSalary.toFixed(2) }}</span>
      </template>

      <template #column-bonus="{ row }">
        <span class="amount">¥{{ row.bonus.toFixed(2) }}</span>
      </template>

      <template #column-deduction="{ row }">
        <span class="amount deduction">¥{{ row.deduction.toFixed(2) }}</span>
      </template>

      <template #column-totalSalary="{ row }">
        <span class="amount total">¥{{ row.totalSalary.toFixed(2) }}</span>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
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
          @click="handleIssue(row)"
        >
          <el-icon><Money /></el-icon>
          发放
        </el-button>
        <el-button type="warning" link @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑发放对话框 -->
    <el-dialog
      v-model="issueDialogVisible"
      :title="isEdit ? '编辑工资发放' : '新增工资发放'"
      width="800px"
    >
      <el-form :model="salaryForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发放年月" required>
              <el-date-picker
                v-model="salaryForm.salaryMonth"
                type="month"
                placeholder="选择月份"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发放时间" required>
              <el-date-picker
                v-model="salaryForm.issueDate"
                type="datetime"
                placeholder="选择发放时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="发放说明">
          <el-input
            v-model="salaryForm.description"
            type="textarea"
            :rows="2"
            placeholder="请输入发放说明"
          />
        </el-form-item>
        <el-divider>工资明细</el-divider>
        <el-form-item label="选择工人">
          <el-button type="primary" @click="handleSelectWorkers">选择工人</el-button>
          <span class="form-tip">已选择 {{ salaryForm.workers.length }} 名工人</span>
        </el-form-item>

        <!-- 工人工资明细表格 -->
        <el-table
          v-if="salaryForm.workers.length > 0"
          :data="salaryForm.workers"
          border
          stripe
          max-height="300"
        >
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="workerName" label="姓名" min-width="100" />
          <el-table-column prop="idCard" label="身份证号" min-width="160" />
          <el-table-column prop="bankCard" label="银行卡号" min-width="180" />
          <el-table-column label="基本工资" min-width="100">
            <template #default="{ row }">
              <el-input-number
                v-model="row.basicSalary"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="加班工资" min-width="100">
            <template #default="{ row }">
              <el-input-number
                v-model="row.overtimeSalary"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="奖金" min-width="100">
            <template #default="{ row }">
              <el-input-number
                v-model="row.bonus"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="扣除" min-width="100">
            <template #default="{ row }">
              <el-input-number
                v-model="row.deduction"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="实发工资" min-width="100">
            <template #default="{ row }">
              <span class="amount total">
                ¥{{ (row.basicSalary + row.overtimeSalary + row.bonus - row.deduction).toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <el-button type="danger" link @click="salaryForm.workers.splice($index, 1)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <el-button @click="issueDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitSalary">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工资发放详情"
      width="900px"
    >
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工人姓名">
            {{ currentRow.workerName }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证号">
            {{ currentRow.idCard }}
          </el-descriptions-item>
          <el-descriptions-item label="银行卡号">
            {{ currentRow.bankCard }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ currentRow.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="基本工资">
            ¥{{ currentRow.basicSalary.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="加班工资">
            ¥{{ currentRow.overtimeSalary.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="奖金">
            ¥{{ currentRow.bonus.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="扣除">
            ¥{{ currentRow.deduction.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="实发工资" :span="2">
            <span class="amount total">¥{{ currentRow.totalSalary.toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="发放状态">
            <el-tag :type="getStatusType(currentRow.status)">
              {{ getStatusText(currentRow.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发放时间">
            {{ currentRow.issueDate || '-' }}
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
      title="导入工资明细"
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

    <!-- 工人选择对话框 -->
    <el-dialog
      v-model="workerSelectVisible"
      title="选择工人"
      width="800px"
    >
      <el-table
        :data="availableWorkers"
        @selection-change="handleWorkerSelectionChange"
        max-height="400"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="workerName" label="姓名" min-width="100" />
        <el-table-column prop="idCard" label="身份证号" min-width="160" />
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="factoryName" label="所在工厂" min-width="120" />
      </el-table>
      <template #footer>
        <el-button @click="workerSelectVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmWorkerSelect">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Upload, Document, Money, View, Edit, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'

// 类型定义
interface SalaryRecord {
  id: string
  workerName: string
  idCard: string
  phone: string
  bankCard: string
  factoryName: string
  basicSalary: number
  overtimeSalary: number
  bonus: number
  deduction: number
  totalSalary: number
  status: 'pending' | 'issued'
  salaryMonth: string
  issueDate?: string
  description?: string
}

interface WorkerInfo {
  workerName: string
  idCard: string
  phone: string
  bankCard: string
  basicSalary: number
  overtimeSalary: number
  bonus: number
  deduction: number
}

// 响应式数据
const searchKeyword = ref('')
const salaryMonth = ref('')
const statusFilter = ref('')
const tableData = ref<SalaryRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedRows = ref<SalaryRecord[]>([])
const currentRow = ref<SalaryRecord | null>(null)
const isEdit = ref(false)

// 对话框控制
const issueDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const importDialogVisible = ref(false)
const workerSelectVisible = ref(false)

// 工资信息
const salaryInfo = reactive({
  salaryMonth: '',
  issueDate: '',
  description: ''
})

// 工资表单
const salaryForm = reactive({
  salaryMonth: '',
  issueDate: '',
  description: '',
  workers: [] as WorkerInfo[]
})

// 可选择的工人列表
const availableWorkers = ref<WorkerInfo[]>([])
const selectedWorkers = ref<WorkerInfo[]>([])

// 统计数据
const stats = reactive({
  workerCount: 0,
  totalAmount: 0,
  pendingCount: 0,
  issuedCount: 0
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '工人姓名', minWidth: 100, sortable: true },
  { prop: 'idCard', label: '身份证号', minWidth: 160, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120 },
  { prop: 'factoryName', label: '所在工厂', minWidth: 120 },
  { prop: 'basicSalary', label: '基本工资', minWidth: 100, sortable: true },
  { prop: 'overtimeSalary', label: '加班工资', minWidth: 100, sortable: true },
  { prop: 'bonus', label: '奖金', minWidth: 80, sortable: true },
  { prop: 'deduction', label: '扣除', minWidth: 80, sortable: true },
  { prop: 'totalSalary', label: '实发工资', minWidth: 120, sortable: true },
  { prop: 'status', label: '状态', minWidth: 100 },
  { prop: 'salaryMonth', label: '发放月份', minWidth: 100, sortable: true }
]

// 生成模拟数据
const generateMockData = (): SalaryRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二']
  const factories = ['深圳电子厂', '东莞制造厂', '广州服装厂', '佛山五金厂', '惠州电子厂']
  const data: SalaryRecord[] = []

  for (let i = 0; i < 80; i++) {
    const status = Math.random() > 0.3 ? 'issued' : 'pending'
    const basicSalary = Math.floor(Math.random() * 3000 + 2000)
    const overtimeSalary = Math.floor(Math.random() * 1000)
    const bonus = Math.floor(Math.random() * 500)
    const deduction = Math.floor(Math.random() * 200)
    const salaryMonth = `${2026}-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}`

    data.push({
      id: `SAL${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      idCard: `${Math.floor(Math.random() * 100000 + 100000)}${Math.floor(Math.random() * 10000000000)}`,
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      bankCard: `62${Math.floor(Math.random() * 10000000000000000)}`,
      factoryName: factories[Math.floor(Math.random() * factories.length)],
      basicSalary,
      overtimeSalary,
      bonus,
      deduction,
      totalSalary: basicSalary + overtimeSalary + bonus - deduction,
      status,
      salaryMonth,
      issueDate: status === 'issued' ? '2026-02-15 10:00:00' : undefined,
      description: `${salaryMonth}月工资`
    })
  }

  return data
}

// 生成可选工人数据
const generateAvailableWorkers = (): WorkerInfo[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const workers: WorkerInfo[] = []

  for (let i = 0; i < names.length; i++) {
    workers.push({
      workerName: names[i],
      idCard: `${Math.floor(Math.random() * 100000 + 100000)}${Math.floor(Math.random() * 10000000000)}`,
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      bankCard: `62${Math.floor(Math.random() * 10000000000000000)}`,
      basicSalary: Math.floor(Math.random() * 3000 + 2000),
      overtimeSalary: Math.floor(Math.random() * 1000),
      bonus: Math.floor(Math.random() * 500),
      deduction: Math.floor(Math.random() * 200)
    })
  }

  return workers
}

// 所有模拟数据
const allData = ref<SalaryRecord[]>([])

// 获取状态类型
const getStatusType = (status: string): string => {
  return status === 'issued' ? 'success' : 'warning'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  return status === 'issued' ? '已发放' : '待发放'
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
  salaryMonth.value = ''
  statusFilter.value = ''
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
const handleSelectionChange = (selection: SalaryRecord[]) => {
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

  let filteredData = [...allData.value]

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword)
    )
  }

  if (salaryMonth.value) {
    filteredData = filteredData.filter(item => item.salaryMonth === salaryMonth.value)
  }

  if (statusFilter.value) {
    filteredData = filteredData.filter(item => item.status === statusFilter.value)
  }

  // 更新统计
  stats.workerCount = filteredData.length
  stats.totalAmount = filteredData.reduce((sum, item) => sum + item.totalSalary, 0)
  stats.pendingCount = filteredData.filter(item => item.status === 'pending').length
  stats.issuedCount = filteredData.filter(item => item.status === 'issued').length

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length

  loading.value = false
}

// 打开发放对话框
const handleOpenIssueDialog = () => {
  isEdit.value = false
  salaryForm.salaryMonth = salaryInfo.salaryMonth || new Date().toISOString().slice(0, 7)
  salaryForm.issueDate = salaryInfo.issueDate || new Date().toISOString().replace('T', ' ').slice(0, 19)
  salaryForm.description = salaryInfo.description
  salaryForm.workers = []
  availableWorkers.value = generateAvailableWorkers()
  issueDialogVisible.value = true
}

// 选择工人
const handleSelectWorkers = () => {
  workerSelectVisible.value = true
}

// 工人选择变化
const handleWorkerSelectionChange = (selection: WorkerInfo[]) => {
  selectedWorkers.value = selection
}

// 确认工人选择
const handleConfirmWorkerSelect = () => {
  salaryForm.workers = [...selectedWorkers.value]
  workerSelectVisible.value = false
}

// 提交工资
const handleSubmitSalary = () => {
  if (!salaryForm.salaryMonth || !salaryForm.issueDate) {
    ElMessage.warning('请填写完整的发放信息')
    return
  }

  if (salaryForm.workers.length === 0) {
    ElMessage.warning('请选择工人')
    return
  }

  // 添加到数据中
  salaryForm.workers.forEach(worker => {
    const newRecord: SalaryRecord = {
      id: `SAL${String(allData.value.length + 1).padStart(6, '0')}`,
      workerName: worker.workerName,
      idCard: worker.idCard,
      phone: worker.phone,
      bankCard: worker.bankCard,
      factoryName: '未知工厂',
      basicSalary: worker.basicSalary,
      overtimeSalary: worker.overtimeSalary,
      bonus: worker.bonus,
      deduction: worker.deduction,
      totalSalary: worker.basicSalary + worker.overtimeSalary + worker.bonus - worker.deduction,
      status: 'pending',
      salaryMonth: salaryForm.salaryMonth,
      issueDate: salaryForm.issueDate,
      description: salaryForm.description
    }
    allData.value.unshift(newRecord)
  })

  ElMessage.success('工资发放创建成功')
  issueDialogVisible.value = false
  fetchData()
}

// 查看详情
const handleView = (row: SalaryRecord) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 发放
const handleIssue = (row: SalaryRecord) => {
  ElMessageBox.confirm('确定要发放该工人的工资吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value[index].status = 'issued'
      allData.value[index].issueDate = new Date().toISOString().replace('T', ' ').slice(0, 19)
    }
    ElMessage.success('工资发放成功')
    fetchData()
  }).catch(() => {})
}

// 编辑
const handleEdit = (row: SalaryRecord) => {
  isEdit.value = true
  currentRow.value = row
  salaryForm.salaryMonth = row.salaryMonth
  salaryForm.issueDate = row.issueDate || ''
  salaryForm.description = row.description || ''
  salaryForm.workers = [{
    workerName: row.workerName,
    idCard: row.idCard,
    phone: row.phone,
    bankCard: row.bankCard,
    basicSalary: row.basicSalary,
    overtimeSalary: row.overtimeSalary,
    bonus: row.bonus,
    deduction: row.deduction
  }]
  issueDialogVisible.value = true
}

// 批量发放
const handleBatchIssue = () => {
  const pendingRows = selectedRows.value.filter(row => row.status === 'pending')
  if (pendingRows.length === 0) {
    ElMessage.warning('请选择待发放的记录')
    return
  }

  ElMessageBox.confirm(
    `确定要发放选中的 ${pendingRows.length} 条记录吗？`,
    '批量发放',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    pendingRows.forEach(row => {
      const index = allData.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        allData.value[index].status = 'issued'
        allData.value[index].issueDate = new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
    })
    ElMessage.success('批量发放成功')
    fetchData()
  }).catch(() => {})
}

// 生成清单
const handleGenerateList = () => {
  ElMessage.info('正在生成工资发放清单')
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

// 生命周期
onMounted(() => {
  // 设置默认月份
  const now = new Date()
  salaryMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  salaryInfo.salaryMonth = salaryMonth.value
  salaryInfo.issueDate = now.toISOString().replace('T', ' ').slice(0, 19)

  allData.value = generateMockData()
  fetchData()
})
</script>

<style scoped>
.salary-management {
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

.info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-form {
  padding: 10px 0;
}

.amount {
  font-weight: bold;
  color: #409eff;
}

.amount.deduction {
  color: #f56c6c;
}

.amount.total {
  color: #e6a23c;
  font-size: 16px;
}

.form-tip {
  margin-left: 12px;
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

  .info-form :deep(.el-form-item) {
    display: block;
    margin-bottom: 12px;
  }
}
</style>
