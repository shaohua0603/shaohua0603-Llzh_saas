<template>
  <div class="settlement-container">
    <!-- 搜索区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="请输入工厂名称" clearable style="width: 180px" />
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
          <el-button type="text" @click="toggleSearch" class="expand-toggle">
            <el-icon :class="{ 'rotate': searchExpanded }"><ArrowDown /></el-icon>
            <span>{{ searchExpanded ? '收起' : '展开' }}</span>
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 展开显示的更多查询条件 -->
      <div v-if="searchExpanded" class="filter-content expanded">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="结算年月">
            <el-date-picker
              v-model="searchForm.issueMonth"
              type="month"
              placeholder="请选择结算年月"
              value-format="YYYY-MM"
            />
          </el-form-item>
          <el-form-item label="结算时间">
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
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新建结算
      </el-button>
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入结算明细
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
      :stats-info="statsInfo"
      table-id="settlement-list"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @batch-action="handleBatchAction"
    >
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">详情</el-button>
        <el-button type="primary" link @click="handleBatchSettlement(row)">批量结算</el-button>
      </template>
      <template #pagination-left="{ selectedRows }">
        <el-button
          v-if="selectedRows.length > 0"
          type="primary"
          @click="handleBatchAction"
        >
          批量结算 ({{ selectedRows.length }})
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, ArrowDown, Search, Refresh } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

// 路由
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  issueMonth: '',
  issueDate: [] as string[],
  factory: ''
})

// 搜索区域展开状态
const searchExpanded = ref(false)

// 切换搜索区域展开状态
const toggleSearch = () => {
  searchExpanded.value = !searchExpanded.value
}

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<any[]>([])
const tableRef = ref<any>(null)
const statsInfo = ref<{ label: string; value: string }[]>([])

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'issueMonth', label: '结算年月', minWidth: 100, sortable: true },
  { prop: 'factory', label: '工厂', minWidth: 150 },
  { prop: 'issueDate', label: '结算时间', minWidth: 120, sortable: true },
  { prop: 'workerCount', label: '人数', minWidth: 80, sortable: true },
  { prop: 'totalAmount', label: '结算总额(元)', minWidth: 120, sortable: true },
  { prop: 'issueDescription', label: '结算说明', minWidth: 200, showTooltip: true },
  {
    prop: 'status',
    label: '状态',
    minWidth: 100,
    formatter: (value: string) => {
      const statusMap: Record<string, { text: string; type: string }> = {
        pending: { text: '待结算', type: 'warning' },
        partial: { text: '部分结算', type: 'warning' },
        completed: { text: '已结算完成', type: 'success' }
      }
      const status = statusMap[value]
      if (status) {
        return `<el-tag type="${status.type}">${status.text}</el-tag>`
      }
      return value
    },
    showTooltip: true
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
    if (searchForm.keyword) {
      const keyword = searchForm.keyword.toLowerCase()
      filteredData = filteredData.filter(item => 
        item.factory.toLowerCase().includes(keyword)
      )
    } else {
      if (searchForm.issueMonth) {
        filteredData = filteredData.filter(item => item.issueMonth === searchForm.issueMonth)
      }
      if (searchForm.factory) {
        filteredData = filteredData.filter(item => item.factory.includes(searchForm.factory))
      }
    }
    if (searchForm.issueDate && searchForm.issueDate.length === 2) {
      filteredData = filteredData.filter(item => {
        if (!item.issueDate) return false
        return item.issueDate >= searchForm.issueDate[0] && item.issueDate <= searchForm.issueDate[1]
      })
    }

    tableData.value = filteredData
    total.value = filteredData.length
    
    // 计算统计信息
    const pendingCount = filteredData.filter(item => item.status === 'pending').length
    const partialCount = filteredData.filter(item => item.status === 'partial').length
    const completedCount = filteredData.filter(item => item.status === 'completed').length
    const totalWorkerCount = filteredData.reduce((sum, item) => sum + (item.workerCount || 0), 0)
    const totalAmount = filteredData.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
    
    statsInfo.value = [
      { label: '总记录数', value: total.value.toString() },
      { label: '待结算', value: pendingCount.toString() },
      { label: '部分结算', value: partialCount.toString() },
      { label: '已结算完成', value: completedCount.toString() },
      { label: '总人数', value: totalWorkerCount.toString() },
      { label: '结算总额', value: totalAmount.toFixed(2) + '元' }
    ]
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
  searchForm.keyword = ''
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



// 批量结算
const handleBatchSettlement = (row: any) => {
  ElMessageBox.confirm('确定要批量结算该结算记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量结算成功')
    loadData()
  }).catch(() => {})
}

// 导入结算明细
const handleImport = () => {
  // 模拟导入功能
  ElMessageBox.confirm('请上传Excel格式的结算明细文件', '导入结算明细', {
    confirmButtonText: '上传文件',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 实际项目中这里会打开文件选择对话框
    ElMessage.success('导入成功，已生成结算记录')
    loadData()
  }).catch(() => {})
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 批量结算
const handleBatchAction = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要结算的记录')
    return
  }
  
  ElMessageBox.confirm(`确定要批量结算选中的 ${selectedRows.value.length} 条记录吗？`, '批量结算', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量结算成功')
    loadData()
  }).catch(() => {})
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

.filter-content {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
}

.expand-toggle {
  color: #409eff;
}

.rotate {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

:deep(.el-icon) {
  transition: transform 0.3s ease;
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
    width: 100%;
  }
  
  .search-form .el-input,
  .search-form .el-select,
  .search-form .el-date-picker {
    width: 100%;
  }
}
</style>
