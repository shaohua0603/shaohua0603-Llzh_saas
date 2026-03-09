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

      <template #column-premium="{ row }">
        {{ formatMoney(row.premium) }} 元
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>


  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download, Search, Refresh, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  { prop: 'personCount', label: '参保人数上限', minWidth: 120 },
  { prop: 'unitPrice', label: '单价', minWidth: 100 },
  { prop: 'premium', label: '保费', minWidth: 100 }
]

// 表格引用
const tableRef = ref()



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
          premium: 25000,
          insuranceAmountList: [
            {
              insuranceType: 'accident',
              amount: 50000
            },
            {
              insuranceType: 'medical',
              amount: 30000
            },
            {
              insuranceType: 'death_disability',
              amount: 20000
            }
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
          personCount: 30,
          unitPrice: 600,
          premium: 18000,
          insuranceAmountList: [
            {
              insuranceType: 'accident',
              amount: 70000
            },
            {
              insuranceType: 'medical',
              amount: 50000
            },
            {
              insuranceType: 'death_disability',
              amount: 30000
            }
          ]
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
          premium: 9000,
          insuranceAmountList: [
            {
              insuranceType: 'accident',
              amount: 40000
            },
            {
              insuranceType: 'medical',
              amount: 30000
            },
            {
              insuranceType: 'death_disability',
              amount: 10000
            }
          ]
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
  router.push('/tenant/on-duty/insurance/form')
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/tenant/on-duty/insurance/form/${row.id}`)
}

// 详情
const handleDetail = (row: any) => {
  router.push(`/tenant/on-duty/insurance/detail/${row.id}`)
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
