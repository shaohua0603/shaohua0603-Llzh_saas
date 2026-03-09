<!-- 参保登记页面 -->
<template>
  <div class="insurance-record-page">
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
        <el-form inline :model="filterForm" class="search-form">
          <el-form-item label="理赔公司">
            <el-input v-model="filterForm.claimCompany" placeholder="请输入理赔公司" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="工人姓名">
            <el-input v-model="filterForm.workerName" placeholder="请输入工人姓名" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="filterForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
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
    </div>

    <!-- 表格区域 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :showSelection="true"
      :showIndex="true"
      :showActions="true"
      :action-column-width="200"
      :statsInfo="statsInfo"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
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
import { Plus, Delete, Upload, Download, ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import CommonTable from '@/components/CommonTable.vue'

const router = useRouter()

// 搜索表单
const filterExpanded = ref(false)
const filterForm = reactive({
  policyNo: '',
  policyType: '',
  claimCompany: '',
  workerName: '',
  phone: '',
  purchaseDate: [] as string[]
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<any[]>([])

// 统计信息
const stats = reactive({
  totalCount: 0,
  totalPremium: 0,
  totalUninsured: 0
})

const statsInfo = ref([
  { label: '参保登记总数', value: '0' },
  { label: '未参保总数', value: '0' },
  { label: '总保费', value: '0 元' }
])

// 表格列配置
const columns = [
  { prop: 'policyNo', label: '保单编号', minWidth: 150, sortable: true },
  { prop: 'policyType', label: '保单类型', minWidth: 120 },
  { prop: 'purchaseDate', label: '购买日期', minWidth: 120, sortable: true },
  { prop: 'effectiveDate', label: '生效日期', minWidth: 120 },
  { prop: 'expiryDate', label: '失效日期', minWidth: 120 },
  { prop: 'claimCompany', label: '理赔公司', minWidth: 150 },
  { prop: 'personCount', label: '参保人数上限', minWidth: 100 },
  { prop: 'unitPrice', label: '单价', minWidth: 100 },
  { prop: 'premium', label: '保费', minWidth: 100 },
  { prop: 'workerList', label: '参保人员', minWidth: 120 }
]

// 表格引用
const tableRef = ref()

// 弹窗控制
const importDialogVisible = ref(false)
const importLoading = ref(false)
const uploadRef = ref()
const importFile = ref()

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

// 获取保险类型名称
const getInsuranceTypeName = (type: string) => {
  const insuranceTypeMap: Record<string, string> = {
    'accident': '意外伤害',
    'medical': '医疗费用',
    'death_disability': '身故/伤残'
  }
  return insuranceTypeMap[type] || type
}

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
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
  filterForm.workerName = ''
  filterForm.phone = ''
  filterForm.purchaseDate = []
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
        insuranceAmountList: [
          { type: 'accident', amount: 50000 },
          { type: 'medical', amount: 30000 },
          { type: 'death_disability', amount: 100000 }
        ],
        premium: 2500,
        workerList: [
          { name: '张三', phone: '13800138000', age: 25, education: 'college', position: '操作工', expectedSalary: 6000, paymentType: 'daily' },
          { name: '李四', phone: '13800138001', age: 28, education: 'high_school', position: '搬运工', expectedSalary: 5500, paymentType: 'monthly' },
          { name: '王五', phone: '13800138002', age: 22, education: 'bachelor', position: '技术员', expectedSalary: 7000, paymentType: 'daily' },
          { name: '赵六', phone: '13800138003', age: 30, education: 'middle_school', position: '包装工', expectedSalary: 5000, paymentType: 'monthly' },
          { name: '钱七', phone: '13800138004', age: 26, education: 'college', position: '质检员', expectedSalary: 6500, paymentType: 'daily' }
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
        insuranceAmountList: [
          { type: 'accident', amount: 60000 },
          { type: 'medical', amount: 40000 },
          { type: 'death_disability', amount: 150000 }
        ],
        premium: 1800,
        workerList: [
          { name: '孙八', phone: '13800138005', age: 24, education: 'college', position: '操作工', expectedSalary: 5800, paymentType: 'monthly' },
          { name: '周九', phone: '13800138006', age: 27, education: 'high_school', position: '叉车工', expectedSalary: 6200, paymentType: 'daily' },
          { name: '吴十', phone: '13800138007', age: 29, education: 'bachelor', position: '班组长', expectedSalary: 8000, paymentType: 'monthly' }
        ]
      }
    ]
    total.value = 2
    
    // 计算统计信息
    stats.totalCount = tableData.value.length
    stats.totalPremium = tableData.value.reduce((sum, item) => sum + item.premium, 0)
    
    // 计算未参保总数：参保人数上限总和 - 实际参保人数总和
    const totalPersonCount = tableData.value.reduce((sum, item) => sum + item.personCount, 0)
    const totalInsuredCount = tableData.value.reduce((sum, item) => sum + (item.workerList?.length || 0), 0)
    stats.totalUninsured = totalPersonCount - totalInsuredCount
    
    // 更新统计信息显示
    statsInfo.value = [
      { label: '参保登记总数', value: stats.totalCount.toString() },
      { label: '未参保总数', value: stats.totalUninsured.toString() },
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
  router.push('/tenant/on-duty/insurance-record/add')
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/tenant/on-duty/insurance-record/edit/${row.id}`)
}

// 详情
const handleDetail = (row: any) => {
  router.push(`/tenant/on-duty/insurance-record/detail/${row.id}`)
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

// 查看参保人员
const viewWorkers = (row: any) => {
  router.push(`/tenant/on-duty/insurance-record/detail/${row.id}?tab=workers`)
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
