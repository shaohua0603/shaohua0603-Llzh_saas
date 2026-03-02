<template>
  <div class="claim-management">
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
          <el-select
            v-model="statusFilter"
            placeholder="理赔状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已赔付" value="paid" />
            <el-option label="已驳回" value="rejected" />
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
          <div class="stat-label">待处理</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.processingCount }}</div>
          <div class="stat-label">处理中</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">¥{{ stats.paidAmount.toFixed(2) }}</div>
          <div class="stat-label">已赔付金额</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalCount }}</div>
          <div class="stat-label">理赔总数</div>
        </div>
      </el-card>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="claim-table"
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
      <template #toolbar-right>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增理赔
        </el-button>
        <el-button type="warning" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </template>
      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-policyTotalAmount="{ row }">
        <span class="amount">¥{{ row.policyTotalAmount.toFixed(2) }}</span>
      </template>

      <template #column-policyPaidAmount="{ row }">
        <span class="amount">¥{{ row.policyPaidAmount.toFixed(2) }}</span>
      </template>

      <template #column-payableAmount="{ row }">
        <span class="amount">¥{{ row.payableAmount.toFixed(2) }}</span>
      </template>

      <template #column-claimAmount="{ row }">
        <span class="amount highlight">¥{{ row.claimAmount.toFixed(2) }}</span>
      </template>

      <template #column-claimDate="{ row }">
        {{ formatDate(row.claimDate) }}
      </template>

      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button type="success" link @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button type="warning" link @click="handleLinkPolicy(row)">
          <el-icon><Link /></el-icon>
          关联保单
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑理赔' : '新增理赔'"
      width="700px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="理赔人员" prop="workerName">
              <el-input v-model="formData.workerName" placeholder="请输入理赔人员姓名" @focus="showWorkerSelect = true" readonly>
                <template #suffix>
                  <el-icon @click="showWorkerSelect = true" style="cursor: pointer;"><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="保单编号" prop="policyNo">
              <el-input v-model="formData.policyNo" placeholder="请输入保单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险类型">
              <el-select v-model="formData.insuranceType" placeholder="请选择保险类型" style="width: 100%">
                <el-option label="雇主责任险" value="employer_liability" />
                <el-option label="意外伤害险" value="accident" />
                <el-option label="工伤险" value="work_injury" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="理赔公司" prop="claimCompany">
              <el-input v-model="formData.claimCompany" placeholder="请输入理赔公司" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赔付日期" prop="claimDate">
              <el-date-picker
                v-model="formData.claimDate"
                type="date"
                placeholder="选择赔付日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="保单已理赔金额">
              <el-input-number
                v-model="formData.policyPaidAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赔付员工金额">
              <el-input-number
                v-model="formData.employeePaidAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="可赔付员工金额">
              <el-input-number
                v-model="formData.payableAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="本次赔付金额" prop="claimAmount">
              <el-input-number
                v-model="formData.claimAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="理赔状态">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="待处理" value="pending" />
                <el-option label="处理中" value="processing" />
                <el-option label="已赔付" value="paid" />
                <el-option label="已驳回" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="理赔详情"
      width="700px"
    >
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="理赔人员">
            {{ currentRow.workerName }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ currentRow.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="保单编号">
            {{ currentRow.policyNo }}
          </el-descriptions-item>
          <el-descriptions-item label="保险类型">
            {{ getInsuranceTypeText(currentRow.insuranceType) }}
          </el-descriptions-item>
          <el-descriptions-item label="理赔公司">
            {{ currentRow.claimCompany }}
          </el-descriptions-item>
          <el-descriptions-item label="保单已理赔金额">
            ¥{{ currentRow.policyTotalAmount.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="已赔付员工金额">
            ¥{{ currentRow.policyPaidAmount.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="可赔付员工金额">
            ¥{{ currentRow.payableAmount.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="本次赔付金额" :span="2">
            <span class="amount highlight">¥{{ currentRow.claimAmount.toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="理赔状态">
            <el-tag :type="getStatusType(currentRow.status)">
              {{ getStatusText(currentRow.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="赔付日期">
            {{ formatDate(currentRow.claimDate) }}
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

    <!-- 关联保单对话框 -->
    <el-dialog
      v-model="policyDialogVisible"
      title="关联保单"
      width="800px"
    >
      <el-table
        :data="policyList"
        @selection-change="handlePolicySelectionChange"
        max-height="400"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="policyNo" label="保单编号" min-width="150" />
        <el-table-column prop="insuranceType" label="保险类型" min-width="120">
          <template #default="{ row }">
            {{ getInsuranceTypeText(row.insuranceType) }}
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="保险公司" min-width="150" />
        <el-table-column prop="totalAmount" label="保额" min-width="100">
          <template #default="{ row }">
            ¥{{ row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已赔付" min-width="100">
          <template #default="{ row }">
            ¥{{ row.paidAmount.toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="policyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmPolicy">确定关联</el-button>
      </template>
    </el-dialog>

    <!-- 人员选择对话框 -->
    <el-dialog
      v-model="workerDialogVisible"
      title="选择理赔人员"
      width="700px"
    >
      <div class="worker-search-bar">
        <el-input
          v-model="workerKeyword"
          placeholder="搜索姓名或手机号"
          prefix-icon="Search"
          clearable
          @input="handleWorkerSearch"
          style="width: 300px"
        />
      </div>
      <el-table
        :data="workerList"
        @row-click="handleSelectWorker"
        highlight-current-row
        max-height="400"
        style="cursor: pointer;"
      >
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="idCard" label="身份证号" min-width="180" />
        <el-table-column prop="company" label="所属公司" min-width="150" />
      </el-table>
      <template #footer>
        <el-button @click="workerDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Refresh, Plus, Download, View, Edit, Link, Delete } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'

// 人员选择相关
const workerDialogVisible = ref(false)
const workerKeyword = ref('')
const workerList = ref<{ id: string; name: string; phone: string; idCard: string; company: string }[]>([])
const showWorkerSelect = ref(false)

// 生成模拟人员数据
const generateWorkerList = () => {
  const companies = ['建筑集团', '安装公司', '装饰公司', '劳务公司']
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二']
  const workers = []
  for (let i = 0; i < 20; i++) {
    workers.push({
      id: `WKR${String(i + 1).padStart(6, '0')}`,
      name: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      idCard: `11010119${String(Math.floor(Math.random() * 10000000000)).padStart(10, '0')}`,
      company: companies[Math.floor(Math.random() * companies.length)]
    })
  }
  return workers
}

const allWorkers = ref(generateWorkerList())

// 人员搜索
const handleWorkerSearch = () => {
  if (!workerKeyword.value) {
    workerList.value = allWorkers.value
    return
  }
  const keyword = workerKeyword.value.toLowerCase()
  workerList.value = allWorkers.value.filter(
    worker => worker.name.toLowerCase().includes(keyword) || worker.phone.includes(keyword)
  )
}

// 选择人员
const handleSelectWorker = (row: { id: string; name: string; phone: string; idCard: string; company: string }) => {
  formData.workerName = row.name
  formData.phone = row.phone
  workerDialogVisible.value = false
  showWorkerSelect.value = false
}

// 监听显示人员选择器
watch(showWorkerSelect, (val) => {
  if (val) {
    workerList.value = allWorkers.value
    workerKeyword.value = ''
    workerDialogVisible.value = true
  }
})

// 类型定义
interface ClaimRecord {
  id: string
  workerName: string
  phone: string
  policyNo: string
  insuranceType: string
  claimCompany: string
  policyTotalAmount: number
  policyPaidAmount: number
  employeePaidAmount: number
  payableAmount: number
  claimAmount: number
  status: 'pending' | 'processing' | 'paid' | 'rejected'
  claimDate: string
  remark?: string
}

interface PolicyRecord {
  id: string
  policyNo: string
  insuranceType: string
  companyName: string
  totalAmount: number
  paidAmount: number
}

// 响应式数据
const searchKeyword = ref('')
const statusFilter = ref('')
const dateRange = ref<string[]>([])
const tableData = ref<ClaimRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedRows = ref<ClaimRecord[]>([])
const currentRow = ref<ClaimRecord | null>(null)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 对话框控制
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const policyDialogVisible = ref(false)

// 表单数据
const formData = reactive<ClaimRecord>({
  id: '',
  workerName: '',
  phone: '',
  policyNo: '',
  insuranceType: 'employer_liability',
  claimCompany: '',
  policyTotalAmount: 0,
  policyPaidAmount: 0,
  employeePaidAmount: 0,
  payableAmount: 0,
  claimAmount: 0,
  status: 'pending',
  claimDate: '',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  workerName: [
    { required: true, message: '请输入理赔人员姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  policyNo: [
    { required: true, message: '请输入保单编号', trigger: 'blur' }
  ],
  claimCompany: [
    { required: true, message: '请输入理赔公司', trigger: 'blur' }
  ],
  claimDate: [
    { required: true, message: '请选择赔付日期', trigger: 'change' }
  ],
  claimAmount: [
    { required: true, message: '请输入本次赔付金额', trigger: 'blur' }
  ]
}

// 统计数据
const stats = reactive({
  pendingCount: 0,
  processingCount: 0,
  paidAmount: 0,
  totalCount: 0
})

// 保单列表
const policyList = ref<PolicyRecord[]>([])
const selectedPolicies = ref<PolicyRecord[]>([])

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '理赔人员', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120 },
  { prop: 'policyNo', label: '保单编号', minWidth: 150, sortable: true },
  { prop: 'insuranceType', label: '保险类型', minWidth: 120 },
  { prop: 'claimCompany', label: '理赔公司', minWidth: 150 },
  { prop: 'policyTotalAmount', label: '保单已理赔金额', minWidth: 140, sortable: true },
  { prop: 'employeePaidAmount', label: '赔付员工金额', minWidth: 140, sortable: true },
  { prop: 'payableAmount', label: '可赔付员工金额', minWidth: 140, sortable: true },
  { prop: 'claimAmount', label: '本次赔付金额', minWidth: 120, sortable: true },
  { prop: 'status', label: '状态', minWidth: 100 },
  { prop: 'claimDate', label: '赔付日期', minWidth: 120, sortable: true }
]

// 生成模拟数据
const generateMockData = (): ClaimRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const companies = ['中国平安', '中国人寿', '太平洋保险', '中华保险', '阳光保险']
  const insuranceTypes = ['employer_liability', 'accident', 'work_injury']
  const statuses: ClaimRecord['status'][] = ['pending', 'processing', 'paid', 'rejected']
  const data: ClaimRecord[] = []

  for (let i = 0; i < 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const insuranceType = insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)]
    const policyTotalAmount = Math.floor(Math.random() * 50000 + 10000)
    const policyPaidAmount = Math.floor(Math.random() * policyTotalAmount * 0.5)
    const employeePaidAmount = Math.floor(Math.random() * 5000 + 1000)
    const payableAmount = Math.floor(Math.random() * 5000 + 1000)
    const claimDate = new Date()
    claimDate.setDate(claimDate.getDate() - Math.floor(Math.random() * 60))

    data.push({
      id: `CLM${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      policyNo: `POL${Date.now()}${Math.floor(Math.random() * 1000)}`,
      insuranceType,
      claimCompany: companies[Math.floor(Math.random() * companies.length)],
      policyTotalAmount,
      policyPaidAmount,
      employeePaidAmount,
      payableAmount,
      claimAmount: Math.floor(Math.random() * 3000 + 500),
      status,
      claimDate: claimDate.toISOString().split('T')[0],
      remark: status === 'rejected' ? '理赔材料不齐全' : ''
    })
  }

  return data
}

// 生成保单列表
const generatePolicyList = (): PolicyRecord[] => {
  const companies = ['中国平安', '中国人寿', '太平洋保险', '中华保险']
  const insuranceTypes = ['employer_liability', 'accident', 'work_injury']
  const policies: PolicyRecord[] = []

  for (let i = 0; i < 20; i++) {
    policies.push({
      id: `POL${String(i + 1).padStart(6, '0')}`,
      policyNo: `POL2026${String(i + 1).padStart(6, '0')}`,
      insuranceType: insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)],
      companyName: companies[Math.floor(Math.random() * companies.length)],
      totalAmount: Math.floor(Math.random() * 50000 + 10000),
      paidAmount: Math.floor(Math.random() * 10000)
    })
  }

  return policies
}

// 所有模拟数据
const allData = ref<ClaimRecord[]>([])

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    paid: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    paid: '已赔付',
    rejected: '已驳回'
  }
  return textMap[status] || status
}

// 获取保险类型文本
const getInsuranceTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    employer_liability: '雇主责任险',
    accident: '意外伤害险',
    work_injury: '工伤险'
  }
  return textMap[type] || type
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
const handleSelectionChange = (selection: ClaimRecord[]) => {
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

  if (statusFilter.value) {
    filteredData = filteredData.filter(item => item.status === statusFilter.value)
  }

  if (dateRange.value && dateRange.value.length === 2) {
    filteredData = filteredData.filter(item => {
      return item.claimDate >= dateRange.value[0] && item.claimDate <= dateRange.value[1]
    })
  }

  // 更新统计
  stats.pendingCount = filteredData.filter(item => item.status === 'pending').length
  stats.processingCount = filteredData.filter(item => item.status === 'processing').length
  stats.paidAmount = filteredData
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.claimAmount, 0)
  stats.totalCount = filteredData.length

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length

  loading.value = false
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: '',
    workerName: '',
    phone: '',
    policyNo: '',
    insuranceType: 'employer_liability',
    claimCompany: '',
    policyTotalAmount: 0,
    policyPaidAmount: 0,
    employeePaidAmount: 0,
    payableAmount: 0,
    claimAmount: 0,
    status: 'pending',
    claimDate: '',
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ClaimRecord) => {
  isEdit.value = true
  currentRow.value = row
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (isEdit.value) {
      // 编辑
      const index = allData.value.findIndex(item => item.id === formData.id)
      if (index > -1) {
        allData.value[index] = { ...formData }
      }
      ElMessage.success('理赔信息更新成功')
    } else {
      // 新增
      const newRecord: ClaimRecord = {
        ...formData,
        id: `CLM${String(allData.value.length + 1).padStart(6, '0')}`
      }
      allData.value.unshift(newRecord)
      ElMessage.success('理赔信息添加成功')
    }

    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.log('验证失败', error)
  }
}

// 删除
const handleDelete = (row: ClaimRecord) => {
  ElMessageBox.confirm('确定要删除该理赔记录吗？', '提示', {
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

// 查看详情
const handleView = (row: ClaimRecord) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 关联保单
const handleLinkPolicy = (row: ClaimRecord) => {
  currentRow.value = row
  policyList.value = generatePolicyList()
  selectedPolicies.value = []
  policyDialogVisible.value = true
}

// 保单选择变化
const handlePolicySelectionChange = (selection: PolicyRecord[]) => {
  selectedPolicies.value = selection
}

// 确认关联保单
const handleConfirmPolicy = () => {
  if (selectedPolicies.value.length === 0) {
    ElMessage.warning('请选择要关联的保单')
    return
  }

  if (currentRow.value) {
    const policy = selectedPolicies.value[0]
    const index = allData.value.findIndex(item => item.id === currentRow.value!.id)
    if (index > -1) {
      allData.value[index].policyNo = policy.policyNo
      allData.value[index].insuranceType = policy.insuranceType
      allData.value[index].claimCompany = policy.companyName
      allData.value[index].policyTotalAmount = policy.totalAmount
      allData.value[index].policyPaidAmount = policy.paidAmount
    }
    ElMessage.success('保单关联成功')
  }

  policyDialogVisible.value = false
  fetchData()
}

// 导出
const handleExport = () => {
  ElMessage.info('正在导出数据')
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  workerList.value = allWorkers.value  // 初始化人员列表
  fetchData()
})
</script>

<style scoped>
.claim-management {
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
  color: #409eff;
}

.amount.highlight {
  color: #e6a23c;
  font-size: 16px;
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

.worker-search-bar {
  margin-bottom: 16px;
}
</style>
