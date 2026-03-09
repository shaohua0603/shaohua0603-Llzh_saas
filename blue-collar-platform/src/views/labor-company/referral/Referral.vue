<template>
  <div class="referral-container">
    <!-- 搜索区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="请输入被介绍人姓名/手机号/介绍人姓名" clearable style="width: 180px" />
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
          <el-form-item label="被介绍人">
            <el-input v-model="searchForm.workerName" placeholder="请输入被介绍人姓名" clearable />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
          </el-form-item>
          <el-form-item label="介绍人">
            <el-input v-model="searchForm.referrerName" placeholder="请输入介绍人姓名" clearable />
          </el-form-item>
          <el-form-item label="介绍日期">
            <el-date-picker
              v-model="searchForm.referralDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增转介绍
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button @click="handleRuleConfig">
        <el-icon><Setting /></el-icon>
        佣金规则配置
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
      table-id="referral-list"
      :stats-info="statsInfo"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">详情</el-button>
        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Setting, ArrowDown, Search, Refresh } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

// 路由
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  workerName: '',
  phone: '',
  referralDate: [] as string[],
  referrerName: ''
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
const statsInfo = ref<{ label: string; value: string }[]>([])

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '被介绍人', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'idCard', label: '身份证号', minWidth: 180 },
  { prop: 'factory', label: '工厂', minWidth: 150 },
  { prop: 'position', label: '岗位', minWidth: 100 },
  { prop: 'referralDate', label: '介绍日期', minWidth: 120, sortable: true },
  { prop: 'entryDate', label: '进厂日期', minWidth: 120, sortable: true },
  { prop: 'referrerName', label: '介绍人', minWidth: 100 },
  { prop: 'referrerPhone', label: '介绍人手机号', minWidth: 120 },
  {
    prop: 'commissionStatus',
    label: '佣金状态',
    minWidth: 100,
    formatter: (value: string) => {
      const statusMap: Record<string, { text: string; type: string }> = {
        pending: { text: '待发放', type: 'info' },
        partial: { text: '部分发放', type: 'warning' },
        completed: { text: '已发放完成', type: 'success' }
      }
      const status = statusMap[value]
      if (status) {
        return `<el-tag type="${status.type}">${status.text}</el-tag>`
      }
      return value
    },
    showTooltip: true
  },
  { prop: 'totalCommission', label: '已发佣金(元)', minWidth: 120, sortable: true }
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
        workerName: '张三',
        phone: '13800138001',
        idCard: '110101199001011234',
        factory: '富士康科技集团',
        position: '操作工',
        referralDate: '2026-01-15',
        entryDate: '2026-01-20',
        referrerName: '李四',
        referrerPhone: '13800138002',
        commissionStatus: 'completed',
        totalCommission: 1500
      },
      {
        id: 2,
        workerName: '王五',
        phone: '13800138003',
        idCard: '110101199003031234',
        factory: '华为技术有限公司',
        position: '质检员',
        referralDate: '2026-01-18',
        entryDate: '2026-01-25',
        referrerName: '赵六',
        referrerPhone: '13800138004',
        commissionStatus: 'partial',
        totalCommission: 500
      },
      {
        id: 3,
        workerName: '孙七',
        phone: '13800138005',
        idCard: '110101199005051234',
        factory: '比亚迪股份有限公司',
        position: '装配工',
        referralDate: '2026-02-01',
        entryDate: '2026-02-10',
        referrerName: '周八',
        referrerPhone: '13800138006',
        commissionStatus: 'pending',
        totalCommission: 0
      },
      {
        id: 4,
        workerName: '吴九',
        phone: '13800138007',
        idCard: '110101199007071234',
        factory: '特斯拉上海工厂',
        position: '生产操作员',
        referralDate: '2026-02-05',
        entryDate: '2026-02-15',
        referrerName: '郑十',
        referrerPhone: '13800138008',
        commissionStatus: 'partial',
        totalCommission: 300
      }
    ]

    // 筛选
    let filteredData = [...mockData]
    if (searchForm.keyword) {
      const keyword = searchForm.keyword.toLowerCase()
      filteredData = filteredData.filter(item => 
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword) ||
        item.referrerName.toLowerCase().includes(keyword)
      )
    } else {
      if (searchForm.workerName) {
        filteredData = filteredData.filter(item => item.workerName.includes(searchForm.workerName))
      }
      if (searchForm.phone) {
        filteredData = filteredData.filter(item => item.phone.includes(searchForm.phone))
      }
      if (searchForm.referrerName) {
        filteredData = filteredData.filter(item => item.referrerName.includes(searchForm.referrerName))
      }
    }
    if (searchForm.referralDate && searchForm.referralDate.length === 2) {
      filteredData = filteredData.filter(item => {
        return item.referralDate >= searchForm.referralDate[0] && item.referralDate <= searchForm.referralDate[1]
      })
    }

    tableData.value = filteredData
    total.value = filteredData.length
    
    // 计算统计信息
    const totalCount = filteredData.length
    const pendingCount = filteredData.filter(item => item.commissionStatus === 'pending').length
    const partialCount = filteredData.filter(item => item.commissionStatus === 'partial').length
    const completedCount = filteredData.filter(item => item.commissionStatus === 'completed').length
    const totalCommission = filteredData.reduce((sum, item) => sum + item.totalCommission, 0)
    
    statsInfo.value = [
      { label: '总记录数', value: totalCount.toString() },
      { label: '待发放', value: pendingCount.toString() },
      { label: '部分发放', value: partialCount.toString() },
      { label: '已发放完成', value: completedCount.toString() },
      { label: '总佣金', value: totalCommission.toFixed(2) + '元' }
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
  searchForm.workerName = ''
  searchForm.phone = ''
  searchForm.referrerName = ''
  searchForm.referralDate = []
  handleSearch()
}

// 新增
const handleAdd = () => {
  router.push({ name: 'TenantReferralAdd' })
}

// 编辑
const handleEdit = (row: any) => {
  router.push({ name: 'TenantReferralEdit', params: { id: row.id } })
}

// 详情
const handleView = (row: any) => {
  router.push({ name: 'TenantReferralDetail', params: { id: row.id } })
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该转介绍记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 佣金规则配置
const handleRuleConfig = () => {
  router.push({ name: 'TenantCommissionRule' })
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
.referral-container {
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
