<template>
  <div class="commission-container">
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
          <el-form-item label="发放状态">
            <el-select v-model="searchForm.status" placeholder="请选择发放状态" clearable>
              <el-option label="待发放" value="pending" />
              <el-option label="已发放" value="issued" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleBatchIssue" :disabled="selectedRows.length === 0">
        <el-icon><Money /></el-icon>
        批量发放 ({{ selectedRows.length }})
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
      table-id="commission-list"
      show-selection
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #column-status="{ row }">
        <el-tag :type="row.status === 'pending' ? 'warning' : 'success'">
          {{ row.status === 'pending' ? '待发放' : '已发放' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleIssue(row)" v-if="row.status === 'pending'">发放</el-button>
        <el-button type="primary" link @click="handleView(row)">详情</el-button>
      </template>
    </CommonTable>

    <!-- 发放对话框 -->
    <el-dialog
      v-model="issueDialogVisible"
      title="佣金发放"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="issueForm" label-width="100px">
        <el-form-item label="被介绍人">
          <span>{{ currentIssueRow?.workerName }}</span>
        </el-form-item>
        <el-form-item label="介绍人">
          <span>{{ currentIssueRow?.referrerName }}</span>
        </el-form-item>
        <el-form-item label="发放金额">
          <el-input-number
            v-model="issueForm.amount"
            :min="0"
            :max="currentIssueRow?.pendingAmount || 0"
            :precision="2"
            style="width: 200px"
          />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="发放方式">
          <el-select v-model="issueForm.issueType" placeholder="请选择发放方式" style="width: 100%">
            <el-option label="银行卡转账" value="bank_transfer" />
            <el-option label="微信转账" value="wechat" />
            <el-option label="支付宝转账" value="alipay" />
            <el-option label="现金" value="cash" />
          </el-select>
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker
            v-model="issueForm.issueDate"
            type="datetime"
            placeholder="请选择发放时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="issueForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="issueDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitIssue">确定发放</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Money, Download, ArrowDown, Search, Refresh } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

// 路由
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  workerName: '',
  phone: '',
  referrerName: '',
  status: ''
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
  { prop: 'workerName', label: '被介绍人', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120 },
  { prop: 'factory', label: '工厂', minWidth: 150 },
  { prop: 'position', label: '岗位', minWidth: 100 },
  { prop: 'entryDate', label: '进厂日期', minWidth: 120, sortable: true },
  { prop: 'referrerName', label: '介绍人', minWidth: 100 },
  { prop: 'referrerPhone', label: '介绍人手机号', minWidth: 120 },
  { prop: 'workDays', label: '工作天数', minWidth: 100, sortable: true },
  { prop: 'pendingAmount', label: '待发佣金(元)', minWidth: 120, sortable: true },
  { prop: 'paidAmount', label: '已发佣金(元)', minWidth: 120, sortable: true },
  { prop: 'totalAmount', label: '应发佣金(元)', minWidth: 120, sortable: true },
  {
    prop: 'status',
    label: '发放状态',
    minWidth: 100,
    formatter: (value: string) => {
      return value === 'pending' ? '待发放' : '已发放'
    }
  }
]

// 发放对话框
const issueDialogVisible = ref(false)
const currentIssueRow = ref<any>(null)
const issueForm = reactive({
  amount: 0,
  issueType: '',
  issueDate: '',
  remark: ''
})

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
        factory: '富士康科技集团',
        position: '操作工',
        entryDate: '2026-01-20',
        referrerName: '李四',
        referrerPhone: '13800138002',
        workDays: 35,
        pendingAmount: 500,
        paidAmount: 500,
        totalAmount: 1000,
        status: 'pending'
      },
      {
        id: 2,
        workerName: '王五',
        phone: '13800138003',
        factory: '华为技术有限公司',
        position: '质检员',
        entryDate: '2026-01-25',
        referrerName: '赵六',
        referrerPhone: '13800138004',
        workDays: 30,
        pendingAmount: 300,
        paidAmount: 200,
        totalAmount: 500,
        status: 'pending'
      },
      {
        id: 3,
        workerName: '孙七',
        phone: '13800138005',
        factory: '比亚迪股份有限公司',
        position: '装配工',
        entryDate: '2026-02-10',
        referrerName: '周八',
        referrerPhone: '13800138006',
        workDays: 15,
        pendingAmount: 200,
        paidAmount: 0,
        totalAmount: 200,
        status: 'pending'
      },
      {
        id: 4,
        workerName: '吴九',
        phone: '13800138007',
        factory: '特斯拉上海工厂',
        position: '生产操作员',
        entryDate: '2026-01-15',
        referrerName: '郑十',
        referrerPhone: '13800138008',
        workDays: 40,
        pendingAmount: 0,
        paidAmount: 1500,
        totalAmount: 1500,
        status: 'issued'
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
    if (searchForm.status) {
      filteredData = filteredData.filter(item => item.status === searchForm.status)
    }

    tableData.value = filteredData
    total.value = filteredData.length
    
    // 计算统计信息
    const pendingCount = filteredData.filter(item => item.status === 'pending').length
    const issuedCount = filteredData.filter(item => item.status === 'issued').length
    const totalPendingAmount = filteredData.reduce((sum, item) => sum + (item.pendingAmount || 0), 0)
    const totalPaidAmount = filteredData.reduce((sum, item) => sum + (item.paidAmount || 0), 0)
    const totalAmount = filteredData.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
    
    statsInfo.value = [
      { label: '总记录数', value: total.value.toString() },
      { label: '待发放', value: pendingCount.toString() },
      { label: '已发放', value: issuedCount.toString() },
      { label: '待发佣金', value: totalPendingAmount.toFixed(2) + '元' },
      { label: '已发佣金', value: totalPaidAmount.toFixed(2) + '元' },
      { label: '总佣金', value: totalAmount.toFixed(2) + '元' }
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
  searchForm.status = ''
  handleSearch()
}

// 发放
const handleIssue = (row: any) => {
  currentIssueRow.value = row
  issueForm.amount = row.pendingAmount
  issueForm.issueType = ''
  issueForm.issueDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
  issueForm.remark = ''
  issueDialogVisible.value = true
}

// 批量发放
const handleBatchIssue = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要发放的记录')
    return
  }

  const totalAmount = selectedRows.value.reduce((sum, row) => sum + (row.pendingAmount || 0), 0)

  ElMessageBox.confirm(
    `已选择 ${selectedRows.value.length} 条记录，待发放佣金合计 ${totalAmount} 元，确定要批量发放吗？`,
    '批量发放确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('批量发放成功')
    loadData()
  }).catch(() => {})
}

// 提交发放
const handleSubmitIssue = () => {
  if (!issueForm.issueType) {
    ElMessage.warning('请选择发放方式')
    return
  }
  if (!issueForm.issueDate) {
    ElMessage.warning('请选择发放时间')
    return
  }
  if (issueForm.amount <= 0) {
    ElMessage.warning('请输入正确的发放金额')
    return
  }

  ElMessage.success('发放成功')
  issueDialogVisible.value = false
  loadData()
}

// 详情
const handleView = (row: any) => {
  router.push({ name: 'LaborCompanyCommissionDetail', params: { id: row.id } })
}

// 导出
const handleExport = () => {
  ElMessageBox.confirm('确定要导出佣金发放记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('导出成功')
  }).catch(() => {})
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string }) => {
  console.log('排序变化:', sort)
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
.commission-container {
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
