<!-- 参保登记页面 -->
<template>
  <div class="insurance-record-page">
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
        <el-form-item label="工人姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入工人姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
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
      action-column-width="200"
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
        <el-button type="warning" @click="handleImport">
          <el-icon><Upload /></el-icon>
          导入
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
      <template #column-workerList="{ row }">
        <el-button link type="primary" size="small" @click="viewWorkers(row)">
          查看 ({{ row.workerList?.length || 0 }})
        </el-button>
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
      width="900px"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
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
        </el-tab-pane>
        <el-tab-pane label="参保人员清单" name="workers">
          <div class="worker-list-toolbar">
            <el-button type="primary" size="small" @click="addWorker">
              <el-icon><Plus /></el-icon>
              添加人员
            </el-button>
            <el-button type="danger" size="small" :disabled="selectedWorkers.length === 0" @click="removeSelectedWorkers">
              批量删除
            </el-button>
          </div>
          <el-table :data="formData.workerList" style="width: 100%" @selection-change="handleWorkerSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="姓名" min-width="100">
              <template #default="{ row, $index }">
                <el-input v-model="row.name" size="small" placeholder="请输入姓名" />
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.phone" size="small" placeholder="请输入手机号" />
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" min-width="80">
              <template #default="{ row }">
                <el-input-number v-model="row.age" size="small" :min="18" :max="65" />
              </template>
            </el-table-column>
            <el-table-column prop="education" label="学历" min-width="100">
              <template #default="{ row }">
                <el-select v-model="row.education" size="small" placeholder="请选择">
                  <el-option label="初中及以下" value="middle_school" />
                  <el-option label="高中" value="high_school" />
                  <el-option label="大专" value="college" />
                  <el-option label="本科" value="bachelor" />
                  <el-option label="硕士及以上" value="master" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="position" label="岗位意向" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.position" size="small" placeholder="请输入岗位" />
              </template>
            </el-table-column>
            <el-table-column prop="expectedSalary" label="期望薪资" min-width="100">
              <template #default="{ row }">
                <el-input-number v-model="row.expectedSalary" size="small" :min="0" :precision="0" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="removeWorker($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="参保登记详情" width="900px">
      <el-tabs v-model="detailTab">
        <el-tab-pane label="基本信息" name="basic">
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
        </el-tab-pane>
        <el-tab-pane label="参保人员清单" name="workers">
          <el-table :data="currentRow.workerList || []" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="姓名" min-width="100" />
            <el-table-column prop="phone" label="手机号" min-width="120" />
            <el-table-column prop="age" label="年龄" min-width="80" />
            <el-table-column prop="education" label="学历" min-width="100">
              <template #default="{ row }">
                {{ getEducationText(row.education) }}
              </template>
            </el-table-column>
            <el-table-column prop="position" label="岗位意向" min-width="120" />
            <el-table-column prop="expectedSalary" label="期望薪资" min-width="100">
              <template #default="{ row }">
                {{ row.expectedSalary }} 元/月
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="导入参保人员" width="500px">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Upload, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

// 搜索表单
const searchForm = reactive({
  policyNo: '',
  policyType: '',
  claimCompany: '',
  workerName: '',
  phone: ''
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
  { prop: 'effectiveDate', label: '生效日期', minWidth: 120 },
  { prop: 'expiryDate', label: '失效日期', minWidth: 120 },
  { prop: 'claimCompany', label: '理赔公司', minWidth: 150 },
  { prop: 'personCount', label: '购买人数', minWidth: 100 },
  { prop: 'unitPrice', label: '单价', minWidth: 100 },
  { prop: 'insuranceAmount', label: '保险金额', minWidth: 120 },
  { prop: 'premium', label: '保费', minWidth: 100 },
  { prop: 'workerList', label: '参保人员', minWidth: 120 }
]

// 表格引用
const tableRef = ref()

// 弹窗控制
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const importDialogVisible = ref(false)
const dialogTitle = ref('新增参保登记')
const submitLoading = ref(false)
const importLoading = ref(false)
const formRef = ref()
const uploadRef = ref()
const currentRow = ref<any>({})
const activeTab = ref('basic')
const detailTab = ref('basic')
const selectedWorkers = ref<any[]>([])
const importFile = ref()

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
  premium: 0,
  workerList: [] as any[]
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

// 获取学历文本
const getEducationText = (value: string) => {
  const textMap: Record<string, string> = {
    middle_school: '初中及以下',
    high_school: '高中',
    college: '大专',
    bachelor: '本科',
    master: '硕士及以上'
  }
  return textMap[value] || value
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
  searchForm.workerName = ''
  searchForm.phone = ''
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
        personCount: 5,
        unitPrice: 500,
        insuranceAmount: 100000,
        premium: 2500,
        workerList: [
          { name: '张三', phone: '13800138000', age: 25, education: 'college', position: '操作工', expectedSalary: 6000 },
          { name: '李四', phone: '13800138001', age: 28, education: 'high_school', position: '搬运工', expectedSalary: 5500 },
          { name: '王五', phone: '13800138002', age: 22, education: 'bachelor', position: '技术员', expectedSalary: 7000 },
          { name: '赵六', phone: '13800138003', age: 30, education: 'middle_school', position: '包装工', expectedSalary: 5000 },
          { name: '钱七', phone: '13800138004', age: 26, education: 'college', position: '质检员', expectedSalary: 6500 }
        ]
      },
      {
        id: '2',
        policyNo: 'POL202401150002',
        policyType: 'employer_liability',
        purchaseDate: '2024-01-15',
        effectiveDate: '2024-01-16',
        expiryDate: '2025-01-15',
        claimCompany: '中国人寿保险',
        personCount: 3,
        unitPrice: 600,
        insuranceAmount: 150000,
        premium: 1800,
        workerList: [
          { name: '孙八', phone: '13800138005', age: 24, education: 'college', position: '操作工', expectedSalary: 5800 },
          { name: '周九', phone: '13800138006', age: 27, education: 'high_school', position: '叉车工', expectedSalary: 6200 },
          { name: '吴十', phone: '13800138007', age: 29, education: 'bachelor', position: '班组长', expectedSalary: 8000 }
        ]
      }
    ]
    total.value = 2
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
  dialogTitle.value = '新增参保登记'
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
  formData.workerList = []
  activeTab.value = 'basic'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑参保登记'
  Object.assign(formData, JSON.parse(JSON.stringify(row)))
  activeTab.value = 'basic'
  dialogVisible.value = true
}

// 详情
const handleDetail = (row: any) => {
  currentRow.value = row
  detailTab.value = 'basic'
  detailDialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条参保登记记录吗？', '提示', {
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
        ElMessage.success(dialogTitle.value === '新增参保登记' ? '新增成功' : '修改成功')
        dialogVisible.value = false
        submitLoading.value = false
        fetchData()
      }, 500)
    }
  })
}

// 添加人员
const addWorker = () => {
  formData.workerList.push({
    name: '',
    phone: '',
    age: 20,
    education: '',
    position: '',
    expectedSalary: 0
  })
}

// 删除人员
const removeWorker = (index: number) => {
  formData.workerList.splice(index, 1)
}

// 人员选择变化
const handleWorkerSelectionChange = (selection: any[]) => {
  selectedWorkers.value = selection
}

// 批量删除人员
const removeSelectedWorkers = () => {
  formData.workerList = formData.workerList.filter(
    worker => !selectedWorkers.value.includes(worker)
  )
  selectedWorkers.value = []
}

// 查看参保人员
const viewWorkers = (row: any) => {
  currentRow.value = row
  detailTab.value = 'workers'
  detailDialogVisible.value = true
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

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.insurance-record-page {
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

.worker-list-toolbar {
  margin-bottom: 16px;
}

.import-content {
  padding: 20px;
}

.download-template {
  margin-top: 20px;
  text-align: center;
}
</style>
