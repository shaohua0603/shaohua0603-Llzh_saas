<template>
  <div class="rules-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="规则名称">
          <el-input v-model="searchForm.ruleName" placeholder="请输入规则名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="searchForm.ruleType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="考勤" value="attendance" />
            <el-option label="人事" value="personnel" />
            <el-option label="可预支额度计算" value="advance" />
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
      </el-form>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增规则
      </el-button>
    </div>

    <!-- 表格 -->
    <CommonTable
      ref="tableRef"
      table-id="rules-management"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :showSelection="true"
      :showIndex="true"
      :showActions="true"
      :action-column-width="240"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #column-effectiveDate="{ row }">
        {{ row.effectiveDate }}
      </template>
      <template #column-status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'">
          {{ row.status === 'active' ? '生效' : '未生效' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import { Plus, Delete, Search, Refresh, Edit, View } from '@element-plus/icons-vue'

// 类型定义
interface PositionWage {
  position: string
  wage: number
  allowance: number
}

interface RuleRecord {
  id: string
  name: string
  type: string
  typeText: string
  effectiveDate: string
  description: string
  status: 'active' | 'inactive'
  factory?: string
  dailyWorkHours?: number
  overtimeMultiple?: number
  holidayMultiple?: number
  startDay?: number
  advanceRatio?: number
  positionWages?: PositionWage[]
}

// 路由
const router = useRouter()

// 表格列配置
const columns = [
  { prop: 'name', label: '规则名称', minWidth: 180, sortable: true },
  { prop: 'typeText', label: '规则类型', minWidth: 150, sortable: true },
  { prop: 'effectiveDate', label: '生效日期', minWidth: 150, sortable: true },
  { prop: 'description', label: '规则说明', minWidth: 300 },
  { prop: 'status', label: '生效状态', minWidth: 100 }
]

// 响应式数据
const tableData = ref<RuleRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<RuleRecord[]>([])
const tableRef = ref<InstanceType<typeof CommonTable> | null>(null)

const searchForm = reactive({
  ruleName: '',
  ruleType: ''
})

// Mock数据
const mockData: RuleRecord[] = [
  {
    id: '1',
    name: '考勤规则',
    type: 'attendance',
    typeText: '考勤',
    effectiveDate: '2024-01-01',
    description: '公司考勤管理制度',
    status: 'active'
  },
  {
    id: '2',
    name: '奖惩规则',
    type: 'personnel',
    typeText: '人事',
    effectiveDate: '2024-01-01',
    description: '公司奖惩管理制度',
    status: 'active'
  },
  {
    id: '3',
    name: '可预支额度计算规则',
    type: 'advance',
    typeText: '可预支额度计算',
    effectiveDate: '2024-01-01',
    description: '工人可预支生活费额度计算规则',
    status: 'active',
    factory: '南通富民劳务服务有限公司',
    dailyWorkHours: 8,
    overtimeMultiple: 1.5,
    holidayMultiple: 2,
    startDay: 7,
    advanceRatio: 80,
    positionWages: [
      { position: '普工', wage: 20, allowance: 2 },
      { position: '技工', wage: 30, allowance: 5 }
    ]
  }
]

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let filteredData = [...mockData]

    // 筛选
    if (searchForm.ruleName) {
      filteredData = filteredData.filter(item => item.name.includes(searchForm.ruleName))
    }
    if (searchForm.ruleType) {
      filteredData = filteredData.filter(item => item.type === searchForm.ruleType)
    }

    total.value = filteredData.length
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filteredData.slice(start, start + pageSize.value)
    
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.ruleName = ''
  searchForm.ruleType = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  router.push('/tenant/rules/form')
}

// 编辑
const handleEdit = (row: RuleRecord) => {
  router.push(`/tenant/rules/form/${row.id}`)
}

// 查看
const handleView = (row: RuleRecord) => {
  router.push(`/tenant/rules/${row.id}`)
}

// 删除
const handleDelete = (row: RuleRecord) => {
  ElMessageBox.confirm('确定要删除该规则吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData.splice(index, 1)
      ElMessage.success('删除成功')
      loadData()
    }
  }).catch(() => {})
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: RuleRecord[]) => {
  selectedRows.value = selection
}

// 分页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadData()
}

// 初始化数据
loadData()
</script>

<style scoped>
.rules-page {
  padding: 16px;
  background-color: #f5f7fa;
}

.search-filter-section {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
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
}
</style>