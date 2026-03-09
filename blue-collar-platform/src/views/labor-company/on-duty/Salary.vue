<template>
  <div class="salary-management">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-default">
        <div class="filter-toggle-container">
          <el-form :model="filterForm" inline>
            <el-form-item label="工人姓名/手机号">
              <el-input
                v-model="filterForm.keyword"
                placeholder="请输入工人姓名或手机号"
                clearable
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="发放月份">
              <el-date-picker
                v-model="filterForm.salaryMonth"
                type="month"
                placeholder="选择发放月份"
                value-format="YYYY-MM"
                style="width: 150px"
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
          <el-form :model="filterForm" inline>
            <el-form-item label="发放状态">
              <el-select
                v-model="filterForm.status"
                placeholder="发放状态"
                clearable
                style="width: 150px"
              >
                <el-option label="全部" value="" />
                <el-option label="待发放" value="pending" />
                <el-option label="已发放" value="issued" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleOpenIssueDialog">
        <el-icon><Plus /></el-icon>
        新增发放
      </el-button>
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入明细
      </el-button>
      <el-button @click="handleGenerateList">
        <el-icon><Document /></el-icon>
        生成清单
      </el-button>
      <el-button
        v-if="selectedRows.length > 0"
        type="success"
        @click="handleBatchIssue"
      >
        <el-icon><Money /></el-icon>
        批量发放 ({{ selectedRows.length }})
      </el-button>
    </div>

    <!-- 工资发放信息 -->
    <el-card class="table-card" shadow="never">
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
        :show-actions="true"
        :stats-info="statsInfo"
        @update:current-page="handlePageChange"
        @update:page-size="handleSizeChange"
        @selection-change="handleSelectionChange"
        @global-search="handleGlobalSearch"
      >
      <template #column-basicSalary="{ row }">
        <span class="amount">¥{{ row.basicSalary.toFixed(2) }}</span>
      </template>

      <template #column-performanceBonus="{ row }">
        <span class="amount">¥{{ (row.performanceBonus || 0).toFixed(2) }}</span>
      </template>

      <template #column-regularOvertimePay="{ row }">
        <span class="amount">¥{{ (row.regularOvertimePay || 0).toFixed(2) }}</span>
      </template>

      <template #column-holidayOvertimePay="{ row }">
        <span class="amount">¥{{ (row.holidayOvertimePay || 0).toFixed(2) }}</span>
      </template>

      <template #column-deduction="{ row }">
        <span class="amount deduction">¥{{ row.deduction.toFixed(2) }}</span>
      </template>

      <template #column-workDays="{ row }">
        <span>{{ row.workDays }}天</span>
      </template>

      <template #column-mealAllowance="{ row }">
        <span class="amount">¥{{ row.mealAllowance.toFixed(2) }}</span>
      </template>

      <template #column-socialInsurancePersonal="{ row }">
        <span class="amount deduction">¥{{ row.socialInsurancePersonal.toFixed(2) }}</span>
      </template>

      <template #column-housingFundPersonal="{ row }">
        <span class="amount deduction">¥{{ row.housingFundPersonal.toFixed(2) }}</span>
      </template>

      <template #column-otherPostTaxDeductions="{ row }">
        <span class="amount deduction">¥{{ (row.otherPostTaxDeductions || 0).toFixed(2) }}</span>
      </template>

      <template #column-totalSalary="{ row }">
        <span class="amount total">¥{{ row.totalSalary.toFixed(2) }}</span>
      </template>

      <template #column-settlementType="{ row }">
        <el-tag :type="row.settlementType === 'daily' ? 'info' : 'success'">
          {{ row.settlementType === 'daily' ? '日结' : '月结' }}
        </el-tag>
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
    </el-card>

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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshLeft, Upload, Document, Money, View, Edit, Download, ArrowUp, ArrowDown, Plus } from '@element-plus/icons-vue'
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
  positionName: string
  settlementType: 'daily' | 'monthly'
  basicSalary: number
  performanceBonus: number
  supervisorAllowance: number
  positionAllowance: number
  regularOvertimePay: number
  holidayOvertimePay: number
  nationalHolidayOvertimePay: number
  seniorityBonus: number
  attendanceBonus: number
  mealAllowance: number
  nightShiftAllowance: number
  referralBonus: number
  bonus1: number
  bonus2: number
  trainingAllowance: number
  highTemperatureAllowance: number
  otherAdditions: number
  negativeSalaryAdjustment: number
  miscarriageLeaveHours: number
  maternityLeaveHours: number
  personalLeaveHours: number
  absenteeismHours: number
  preTaxLeaveDeductions: number
  sickLeaveHours: number
  preTaxSickLeaveDeductions: number
  previousMonthNegativeSalary: number
  socialInsurancePersonal: number
  housingFundPersonal: number
  otherPostTaxDeductions: number
  postTaxMealDeductions: number
  postTaxDormitoryDeductions: number
  deduction: number
  totalSalary: number
  workDays: number
  status: 'pending' | 'issued'
  salaryMonth: string
  issueDate?: string
  description?: string
}

// 响应式数据
const router = useRouter()
const filterVisible = ref(false)
const filterForm = reactive({
  keyword: '',
  salaryMonth: '',
  status: ''
})
const tableData = ref<SalaryRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedRows = ref<SalaryRecord[]>([])

// 对话框控制
const importDialogVisible = ref(false)

// 工资信息
const salaryInfo = reactive({
  salaryMonth: '',
  issueDate: '',
  description: ''
})

// 统计数据
const stats = reactive({
  workerCount: 0,
  totalAmount: 0,
  pendingCount: 0,
  issuedCount: 0
})

// 统计信息字符串
const statsInfo = computed(() => {
  return `共 ${stats.workerCount} 名工人，发放总额 ¥${stats.totalAmount.toFixed(2)}，其中待发放 ${stats.pendingCount} 人，已发放 ${stats.issuedCount} 人`
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '工人姓名', minWidth: 100, sortable: true },
  { prop: 'idCard', label: '身份证号', minWidth: 160, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120 },
  { prop: 'factoryName', label: '所在工厂', minWidth: 120 },
  { prop: 'positionName', label: '岗位名称', minWidth: 120 },
  { prop: 'settlementType', label: '结算类型', minWidth: 100 },
  { prop: 'workDays', label: '工作天数', minWidth: 100, sortable: true },
  { prop: 'basicSalary', label: '基本薪资', minWidth: 100, sortable: true },
  { prop: 'performanceBonus', label: '绩效奖金', minWidth: 100, sortable: true },
  { prop: 'regularOvertimePay', label: '平时加班费', minWidth: 100, sortable: true },
  { prop: 'holidayOvertimePay', label: '假日加班费', minWidth: 100, sortable: true },
  { prop: 'mealAllowance', label: '餐费补助', minWidth: 100, sortable: true },
  { prop: 'socialInsurancePersonal', label: '社保个人', minWidth: 100, sortable: true },
  { prop: 'housingFundPersonal', label: '公积金个人', minWidth: 100, sortable: true },
  { prop: 'otherPostTaxDeductions', label: '其他扣款', minWidth: 100, sortable: true },
  { prop: 'deduction', label: '总扣除', minWidth: 80, sortable: true },
  { prop: 'totalSalary', label: '实发工资', minWidth: 120, sortable: true },
  { prop: 'status', label: '状态', minWidth: 100 },
  { prop: 'salaryMonth', label: '发放月份', minWidth: 100, sortable: true }
]

// 生成模拟数据
const generateMockData = (): SalaryRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二']
  const factories = ['深圳电子厂', '东莞制造厂', '广州服装厂', '佛山五金厂', '惠州电子厂']
  const positions = ['普工', '技术工', '质检员', '班组长', '主管']
  const settlementTypes = ['daily', 'monthly']
  const data: SalaryRecord[] = []

  for (let i = 0; i < 80; i++) {
    const status = Math.random() > 0.3 ? 'issued' : 'pending'
    const basicSalary = Math.floor(Math.random() * 3000 + 2000)
    const performanceBonus = Math.floor(Math.random() * 500)
    const regularOvertimePay = Math.floor(Math.random() * 500)
    const holidayOvertimePay = Math.floor(Math.random() * 300)
    const mealAllowance = 450
    const socialInsurancePersonal = 27.38
    const housingFundPersonal = 15
    const otherPostTaxDeductions = 115.24
    const deduction = socialInsurancePersonal + housingFundPersonal + otherPostTaxDeductions
    const workDays = Math.floor(Math.random() * 5) + 25
    const salaryMonth = `${2026}-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}`

    data.push({
      id: `SAL${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      idCard: `${Math.floor(Math.random() * 100000 + 100000)}${Math.floor(Math.random() * 10000000000)}`,
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      bankCard: `62${Math.floor(Math.random() * 10000000000000000)}`,
      factoryName: factories[Math.floor(Math.random() * factories.length)],
      positionName: positions[Math.floor(Math.random() * positions.length)],
      settlementType: settlementTypes[Math.floor(Math.random() * settlementTypes.length)] as 'daily' | 'monthly',
      basicSalary,
      performanceBonus,
      regularOvertimePay,
      holidayOvertimePay,
      mealAllowance,
      socialInsurancePersonal,
      housingFundPersonal,
      otherPostTaxDeductions,
      deduction,
      totalSalary: basicSalary + performanceBonus + regularOvertimePay + holidayOvertimePay + mealAllowance - deduction,
      workDays,
      status,
      salaryMonth,
      issueDate: status === 'issued' ? '2026-02-15 10:00:00' : undefined,
      description: `${salaryMonth}月工资`
    })
  }

  return data
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
  filterForm.keyword = ''
  filterForm.salaryMonth = ''
  filterForm.status = ''
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

  if (filterForm.salaryMonth) {
    filteredData = filteredData.filter(item => item.salaryMonth === filterForm.salaryMonth)
  }

  if (filterForm.status) {
    filteredData = filteredData.filter(item => item.status === filterForm.status)
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

// 打开发放页面
const handleOpenIssueDialog = () => {
  router.push({
    path: '/tenant/on-duty/salary/form',
    query: { mode: 'add' }
  })
}

// 查看
const handleView = (row: SalaryRecord) => {
  router.push({
    path: `/tenant/on-duty/salary/detail/${row.id}`
  })
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
  router.push({
    path: '/tenant/on-duty/salary/form',
    query: { mode: 'edit', id: row.id }
  })
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
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  filterForm.salaryMonth = currentMonth
  salaryInfo.salaryMonth = currentMonth
  salaryInfo.issueDate = now.toISOString().replace('T', ' ').slice(0, 19)

  allData.value = generateMockData()
  fetchData()
})
</script>

<style scoped>
.salary-management {
  padding: 16px;
  background-color: #f5f7fa;
}

.filter-card,
.table-card {
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
  color: #409eff;
}

.filter-expanded {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e4e7ed;
}

/* 功能按钮区域 */
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

.table-stats {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
  font-size: 14px;
  color: #f56c6c;
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
  
  :deep(.el-form--inline .el-form-item) {
    display: block;
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  :deep(.el-form-item__content) {
    width: 100%;
  }
  
  :deep(.el-select),
  :deep(.el-input),
  :deep(.el-date-picker) {
    width: 100% !important;
  }
}
</style>
