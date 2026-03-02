<!-- 保险管理页面 -->
<template>
  <div class="insurance-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="保单编号">
          <el-input v-model="searchForm.policyNo" placeholder="请输入保单编号" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="保单类型">
          <el-select v-model="searchForm.policyType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="雇主责任险" value="employer_liability" />
          </el-select>
        </el-form-item>
        <el-form-item label="理赔公司">
          <el-input v-model="searchForm.claimCompany" placeholder="请输入理赔公司" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="购买日期">
          <el-date-picker
            v-model="searchForm.purchaseDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :showToolbar="true"
      :showSelection="true"
      :showIndex="true"
      :showActions="true"
      action-column-width="180"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar-right>
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
      </template>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download, Setting } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

// 搜索表单
const searchForm = reactive({
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
  searchForm.policyNo = ''
  searchForm.policyType = ''
  searchForm.claimCompany = ''
  searchForm.purchaseDate = []
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
  padding: 20px;
}

.search-filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 10px;
}
</style>
