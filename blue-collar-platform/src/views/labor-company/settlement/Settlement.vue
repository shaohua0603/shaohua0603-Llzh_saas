<template>
  <div class="settlement-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="发放年月">
          <el-date-picker
            v-model="searchForm.issueMonth"
            type="month"
            placeholder="请选择发放年月"
            value-format="YYYY-MM"
          />
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker
            v-model="searchForm.issueDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="工厂">
          <el-input v-model="searchForm.factory" placeholder="请输入工厂名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar-section">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新建结算
      </el-button>
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入发放明细
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>

    <!-- 表格区域 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      table-id="settlement-list"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">详情</el-button>
        <el-button type="primary" link @click="handleGenerateList(row)">生成发放清单</el-button>
        <el-button type="primary" link @click="handleBatchIssue(row)">批量发放</el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

// 路由
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  issueMonth: '',
  issueDate: [] as string[],
  factory: ''
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<any[]>([])

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'issueMonth', label: '发放年月', minWidth: 100, sortable: true },
  { prop: 'factory', label: '工厂', minWidth: 150 },
  { prop: 'issueDate', label: '发放时间', minWidth: 120, sortable: true },
  { prop: 'workerCount', label: '人数', minWidth: 80, sortable: true },
  { prop: 'totalAmount', label: '发放总额(元)', minWidth: 120, sortable: true },
  { prop: 'issueDescription', label: '发放说明', minWidth: 200, showTooltip: true },
  {
    prop: 'status',
    label: '状态',
    minWidth: 100,
    formatter: (value: string) => {
      const statusMap: Record<string, { text: string; type: string }> = {
        pending: { text: '待发放', type: 'warning' },
        partial: { text: '部分发放', type: 'warning' },
        completed: { text: '已发放完成', type: 'success' }
      }
      return statusMap[value] || value
    }
  },
  { prop: 'createTime', label: '创建时间', minWidth: 160, sortable: true }
]

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟数据
    const mockData = [
      {
        id: 1,
        issueMonth: '2026-01',
        factory: '富士康科技集团',
        issueDate: '2026-02-05',
        issueDescription: '2026年1月份工资结算',
        workerCount: 150,
        totalAmount: 825000,
        status: 'completed',
        createTime: '2026-02-01 10:00:00'
      },
      {
        id: 2,
        issueMonth: '2026-01',
        factory: '华为技术有限公司',
        issueDate: '2026-02-08',
        issueDescription: '2026年1月份工资结算',
        workerCount: 80,
        totalAmount: 520000,
        status: 'completed',
        createTime: '2026-02-03 14:30:00'
      },
      {
        id: 3,
        issueMonth: '2026-02',
        factory: '比亚迪股份有限公司',
        issueDate: '2026-03-05',
        issueDescription: '2026年2月份工资结算',
        workerCount: 120,
        totalAmount: 680000,
        status: 'pending',
        createTime: '2026-02-20 09:15:00'
      },
      {
        id: 4,
        issueMonth: '2026-02',
        factory: '特斯拉上海工厂',
        issueDate: '',
        issueDescription: '2026年2月份工资结算',
        workerCount: 60,
        totalAmount: 450000,
        status: 'pending',
        createTime: '2026-02-22 16:45:00'
      }
    ]

    // 筛选
    let filteredData = [...mockData]
    if (searchForm.issueMonth) {
      filteredData = filteredData.filter(item => item.issueMonth === searchForm.issueMonth)
    }
    if (searchForm.factory) {
      filteredData = filteredData.filter(item => item.factory.includes(searchForm.factory))
    }

    tableData.value = filteredData
    total.value = filteredData.length
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.issueMonth = ''
  searchForm.issueDate = []
  searchForm.factory = ''
  handleSearch()
}

// 新建结算
const handleAdd = () => {
  router.push({ name: 'LaborCompanySettlementAdd' })
}

// 详情
const handleView = (row: any) => {
  router.push({ name: 'LaborCompanySettlementDetail', params: { id: row.id } })
}

// 生成发放清单
const handleGenerateList = (row: any) => {
  ElMessageBox.confirm('确定要生成该结算记录的发放清单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 模拟生成清单
    ElMessage.success('生成发放清单成功，清单已发送到打印机')
  }).catch(() => {})
}

// 批量发放
const handleBatchIssue = (row: any) => {
  ElMessageBox.confirm('确定要批量发放该结算记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量发放成功')
    loadData()
  }).catch(() => {})
}

// 导入
const handleImport = () => {
  ElMessage.info('导入发放明细功能开发中')
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string }) => {
  console.log('排序变化:', sort)
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.settlement-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.search-section {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toolbar-section {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
</style>
