<!-- 保险管理页面 -->
<template>
  <div class="insurance-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form inline :model="filterForm" class="search-form">
        <el-form-item label="保单编号">
          <el-input v-model="filterForm.policyNo" placeholder="请输入保单编号" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="保单类型">
          <el-select v-model="filterForm.policyType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="雇主责任险" value="employer_liability" />
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
        <el-form-item>
          <el-button type="text" @click="toggleFilter" class="expand-toggle">
            <el-icon :class="{ 'rotate': filterExpanded }"><ArrowDown /></el-icon>
            <span>{{ filterExpanded ? '收起' : '展开' }}</span>
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 展开显示的更多查询条件 -->
      <div v-if="filterExpanded" class="filter-content expanded">
        <el-form inline :model="filterForm" class="search-form">
          <el-form-item label="理赔公司">
            <el-input v-model="filterForm.claimCompany" placeholder="请输入理赔公司" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="购买日期">
            <el-date-picker
              v-model="filterForm.purchaseDate"
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
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="insurance-table"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :show-selection="true"
      :show-toolbar="true"
      :stats-info="statsInfo"
      @update:current-page="handleCurrentChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @global-search="handleGlobalSearch"
    >
      <template #column-policyType="{ row }">
        <el-tag type="primary">雇主责任险</el-tag>
      </template>
      <template #column-purchaseDate="{ row }">
        {{ row.purchaseDate }}
      </template>
      <template #column-effectiveDate="{ row }">
        {{ row.effectiveDate }}
      </template>
      <template #column-expiryDate="{ row }">
        {{ row.expiryDate }}
      </template>
      <template #column-insuranceAmount="{ row }">
        {{ formatMoney(row.insuranceAmount) }} 元
      </template>
      <template #column-premium="{ row }">
        {{ formatMoney(row.premium) }} 元
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="保单编号" prop="policyNo">
              <el-input v-model="formData.policyNo" placeholder="请输入保单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保单类型" prop="policyType">
              <el-select v-model="formData.policyType" placeholder="请选择保单类型" style="width: 100%">
                <el-option label="雇主责任险" value="employer_liability" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="购买日期" prop="purchaseDate">
              <el-date-picker
                v-model="formData.purchaseDate"
                type="date"
                placeholder="选择购买日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker
                v-model="formData.effectiveDate"
                type="date"
                placeholder="选择生效日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="失效日期" prop="expiryDate">
              <el-date-picker
                v-model="formData.expiryDate"
                type="date"
                placeholder="选择失效日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="理赔公司" prop="claimCompany">
              <el-input v-model="formData.claimCompany" placeholder="请输入理赔公司" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="购买人数" prop="personCount">
              <el-input-number v-model="formData.personCount" :min="0" :max="99999" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="unitPrice">
              <el-input-number v-model="formData.unitPrice" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="保险金额" prop="insuranceAmount">
              <el-input-number v-model="formData.insuranceAmount" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保费" prop="premium">
              <el-input-number v-model="formData.premium" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="保险详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="保单编号">{{ currentRow.policyNo }}</el-descriptions-item>
        <el-descriptions-item label="保单类型">
          <el-tag type="primary">雇主责任险</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="购买日期">{{ currentRow.purchaseDate }}</el-descriptions-item>
        <el-descriptions-item label="生效日期">{{ currentRow.effectiveDate }}</el-descriptions-item>
        <el-descriptions-item label="失效日期">{{ currentRow.expiryDate }}</el-descriptions-item>
        <el-descriptions-item label="理赔公司">{{ currentRow.claimCompany }}</el-descriptions-item>
        <el-descriptions-item label="购买人数">{{ currentRow.personCount }} 人</el-descriptions-item>
        <el-descriptions-item label="单价">{{ formatMoney(currentRow.unitPrice) }} 元</el-descriptions-item>
        <el-descriptions-item label="保险金额">{{ formatMoney(currentRow.insuranceAmount) }} 元</el-descriptions-item>
        <el-descriptions-item label="保费">{{ formatMoney(currentRow.premium) }} 元</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download, Search, Refresh, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

// 搜索表单
const filterExpanded = ref(false)
const filterForm = reactive({
  policyNo: '',
  policyType: '',
  claimCompany: '',
  purchaseDate: [] as string[]
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<any[]>([])

// 统计数据
const stats = reactive({
  totalCount: 0,
  totalPremium: 0
})

// 统计信息
const statsInfo = ref([
  { label: '保险总数', value: '0' },
  { label: '总保费', value: '0 元' }
])

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

// 表格列配置
const columns = [
  { prop: 'policyNo', label: '保单编号', minWidth: 150, sortable: true },
  { prop: 'policyType', label: '保单类型', minWidth: 120 },
  { prop: 'purchaseDate', label: '购买日期', minWidth: 120, sortable: true },
  { prop: 'effectiveDate', label: '生效日期', minWidth: 120, sortable: true },
  { prop: 'expiryDate', label: '失效日期', minWidth: 120, sortable: true },
  { prop: 'claimCompany', label: '理赔公司', minWidth: 150 },
  { prop: 'personCount', label: '购买人数', minWidth: 100 },
  { prop: 'unitPrice', label: '单价', minWidth: 100 },
  { prop: 'insuranceAmount', label: '保险金额', minWidth: 120 },
  { prop: 'premium', label: '保费', minWidth: 100 }
]

// 表格引用
const tableRef = ref()

// 弹窗控制
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const dialogTitle = ref('新增保险')
const submitLoading = ref(false)
const formRef = ref()
const currentRow = ref<any>({})

const formData = reactive({
  id: '',
  policyNo: '',
  policyType: 'employer_liability',
  purchaseDate: '',
  effectiveDate: '',
  expiryDate: '',
  claimCompany: '',
  personCount: 0,
  unitPrice: 0,
  insuranceAmount: 0,
  premium: 0
})

const formRules = {
  policyNo: [{ required: true, message: '请输入保单编号', trigger: 'blur' }],
  policyType: [{ required: true, message: '请选择保单类型', trigger: 'change' }],
  purchaseDate: [{ required: true, message: '请选择购买日期', trigger: 'change' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  expiryDate: [{ required: true, message: '请选择失效日期', trigger: 'change' }],
  claimCompany: [{ required: true, message: '请输入理赔公司', trigger: 'blur' }],
  personCount: [{ required: true, message: '请输入购买人数', trigger: 'blur' }],
  unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  insuranceAmount: [{ required: true, message: '请输入保险金额', trigger: 'blur' }],
  premium: [{ required: true, message: '请输入保费', trigger: 'blur' }]
}

// 格式化金额
const formatMoney = (value: number) => {
  if (!value) return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  filterForm.policyNo = ''
  filterForm.policyType = ''
  filterForm.claimCompany = ''
  filterForm.purchaseDate = []
  handleSearch()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  filterForm.policyNo = keyword
  handleSearch()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    tableData.value = [
      {
        id: '1',
        policyNo: 'POL202401010001',
        policyType: 'employer_liability',
        purchaseDate: '2024-01-01',
        effectiveDate: '2024-01-02',
        expiryDate: '2025-01-01',
        claimCompany: '中国平安保险',
        personCount: 50,
        unitPrice: 500,
        insuranceAmount: 100000,
        premium: 25000
      },
      {
        id: '2',
        policyNo: 'POL202401150002',
        policyType: 'employer_liability',
        purchaseDate: '2024-01-15',
        effectiveDate: '2024-01-16',
        expiryDate: '2025-01-15',
        claimCompany: '中国人寿保险',
        personCount: 30,
        unitPrice: 600,
        insuranceAmount: 150000,
        premium: 18000
      },
      {
        id: '3',
        policyNo: 'POL202402010003',
        policyType: 'employer_liability',
        purchaseDate: '2024-02-01',
        effectiveDate: '2024-02-02',
        expiryDate: '2025-02-01',
        claimCompany: '太平洋保险',
        personCount: 20,
        unitPrice: 450,
        insuranceAmount: 80000,
        premium: 9000
      }
    ]
    total.value = 3
    
    // 更新统计数据
    stats.totalCount = tableData.value.length
    stats.totalPremium = tableData.value.reduce((sum, item) => sum + item.premium, 0)
    
    // 更新统计信息显示
    statsInfo.value = [
      { label: '保险总数', value: stats.totalCount.toString() },
      { label: '总保费', value: stats.totalPremium.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' 元' }
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
  dialogTitle.value = '新增保险'
  formData.id = ''
  formData.policyNo = ''
  formData.policyType = 'employer_liability'
  formData.purchaseDate = ''
  formData.effectiveDate = ''
  formData.expiryDate = ''
  formData.claimCompany = ''
  formData.personCount = 0
  formData.unitPrice = 0
  formData.insuranceAmount = 0
  formData.premium = 0
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑保险'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 详情
const handleDetail = (row: any) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条保险记录吗？', '提示', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('批量删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        ElMessage.success(dialogTitle.value === '新增保险' ? '新增成功' : '修改成功')
        dialogVisible.value = false
        submitLoading.value = false
        fetchData()
      }, 500)
    }
  })
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.insurance-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-filter-section {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
}

.filter-content.expanded {
  padding: 0 20px 16px 20px;
  border-top: 1px solid #e4e7ed;
}

.expand-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
  padding: 0;
  height: 32px;
}

.expand-toggle:hover {
  color: #66b1ff;
}

.expand-toggle .el-icon {
  transition: transform 0.3s ease;
}

.expand-toggle .el-icon.rotate {
  transform: rotate(180deg);
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
    margin-bottom: 12px;
  }
}
</style>
