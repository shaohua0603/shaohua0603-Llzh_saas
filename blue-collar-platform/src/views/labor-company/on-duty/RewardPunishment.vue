<!-- 奖惩管理页面 -->
<template>
  <div class="reward-punishment-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="奖惩人员">
          <el-input v-model="searchForm.workerName" placeholder="请输入奖惩人员姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="奖惩类型">
          <el-select v-model="searchForm.rewardPunishmentType" placeholder="请选择" clearable style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="荣誉奖励" value="honor" />
            <el-option label="金额奖励" value="money" />
            <el-option label="其他奖励" value="other_reward" />
            <el-option label="口头惩罚" value="verbal" />
            <el-option label="金额惩罚" value="fine" />
            <el-option label="其他惩罚" value="other_punishment" />
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
        <el-form inline :model="searchForm" class="search-form">
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="奖惩日期">
            <el-date-picker
              v-model="searchForm.rewardPunishmentDate"
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
      <el-button type="success" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button type="warning" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>

    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :show-selection="true"
      :show-index="true"
      :show-actions="true"
      :stats-info="statsInfo"
      :action-column-width="200"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #column-paymentType="{ row }">
        <el-tag :type="row.paymentType === 'daily' ? 'warning' : 'success'">
          {{ row.paymentType === 'daily' ? '日结' : '月结' }}
        </el-tag>
      </template>

      <template #column-rewardPunishmentType="{ row }">
        <el-tag :type="getRewardPunishmentTypeTag(row.rewardPunishmentType)">
          {{ getRewardPunishmentTypeText(row.rewardPunishmentType) }}
        </el-tag>
      </template>
      <template #column-rewardPunishmentTime="{ row }">
        {{ formatDate(row.rewardPunishmentTime) }}
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="success" size="small" @click="handleApprove(row)">审核</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>



    <!-- 导入弹窗 -->
    <el-dialog v-model="importVisible" title="导入奖惩数据" width="500px">
      <div class="import-content">
        <el-upload
          ref="uploadRef"
          class="import-upload"
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleImportChange"
          :on-exceed="handleImportExceed"
        >
          <el-button type="primary">点击上传文件</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传xlsx/xls文件</div>
          </template>
        </el-upload>
        <div class="import-tips">
          <el-button type="text" @click="downloadTemplate">下载模板</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit" :loading="importLoading">确定导入</el-button>
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

// 类型定义
interface RewardPunishmentRecord {
  id: string
  workerName: string
  phone: string
  paymentType: 'daily' | 'monthly'
  rewardPunishmentType: 'honor' | 'money' | 'other_reward' | 'verbal' | 'fine' | 'other_punishment'
  rewardPunishmentTime: string
  content: string
  remark: string
}

// 表格列配置
const columns = [
  { prop: 'workerName', label: '奖惩人员', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'paymentType', label: '结算方式', minWidth: 100 },
  { prop: 'rewardPunishmentType', label: '奖惩类型', minWidth: 120, sortable: true },
  { prop: 'rewardPunishmentTime', label: '奖惩时间', minWidth: 160, sortable: true },
  { prop: 'content', label: '奖惩内容', minWidth: 200, showTooltip: true },
  { prop: 'remark', label: '奖惩备注', minWidth: 150, showTooltip: true }
]

// 响应式数据
const tableData = ref<RewardPunishmentRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<RewardPunishmentRecord[]>([])
const importVisible = ref(false)
const importLoading = ref(false)
const filterExpanded = ref(false)
const statsInfo = ref<Array<{ label: string; value: string }>>([])

const searchForm = reactive({
  workerName: '',
  phone: '',
  rewardPunishmentType: '',
  rewardPunishmentDate: [] as string[]
})

// Mock数据
const mockData: RewardPunishmentRecord[] = [
  {
    id: '1',
    workerName: '张三',
    phone: '13800138001',
    paymentType: 'daily',
    rewardPunishmentType: 'honor',
    rewardPunishmentTime: '2024-02-15 10:00:00',
    content: '优秀员工称号',
    remark: '年度优秀员工'
  },
  {
    id: '2',
    workerName: '李四',
    phone: '13800138002',
    paymentType: 'monthly',
    rewardPunishmentType: 'money',
    rewardPunishmentTime: '2024-02-10 09:30:00',
    content: '完成月度任务奖励',
    remark: '奖励500元'
  },
  {
    id: '3',
    workerName: '王五',
    phone: '13800138003',
    paymentType: 'daily',
    rewardPunishmentType: 'verbal',
    rewardPunishmentTime: '2024-02-08 14:00:00',
    content: '工作态度不积极',
    remark: '口头警告一次'
  },
  {
    id: '4',
    workerName: '赵六',
    phone: '13800138004',
    paymentType: 'monthly',
    rewardPunishmentType: 'fine',
    rewardPunishmentTime: '2024-02-05 16:00:00',
    content: '迟到3次',
    remark: '罚款150元'
  },
  {
    id: '5',
    workerName: '钱七',
    phone: '13800138005',
    paymentType: 'daily',
    rewardPunishmentType: 'other_reward',
    rewardPunishmentTime: '2024-02-01 11:00:00',
    content: '提出有效改进建议',
    remark: '通报表扬'
  }
]

// 获取奖惩类型标签
const getRewardPunishmentTypeTag = (type: string) => {
  const map: Record<string, string> = {
    honor: 'success',
    money: 'success',
    other_reward: 'success',
    verbal: 'warning',
    fine: 'danger',
    other_punishment: 'danger'
  }
  return map[type] || 'info'
}

// 获取奖惩类型文本
const getRewardPunishmentTypeText = (type: string) => {
  const map: Record<string, string> = {
    honor: '荣誉奖励',
    money: '金额奖励',
    other_reward: '其他奖励',
    verbal: '口头惩罚',
    fine: '金额惩罚',
    other_punishment: '其他惩罚'
  }
  return map[type] || type
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return ''
  return date.substring(0, 10)
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let filteredData = [...mockData]

    // 筛选
    if (searchForm.workerName) {
      filteredData = filteredData.filter(item => item.workerName.includes(searchForm.workerName))
    }
    if (searchForm.phone) {
      filteredData = filteredData.filter(item => item.phone.includes(searchForm.phone))
    }
    if (searchForm.rewardPunishmentType) {
      filteredData = filteredData.filter(item => item.rewardPunishmentType === searchForm.rewardPunishmentType)
    }
    if (searchForm.rewardPunishmentDate?.length === 2) {
      filteredData = filteredData.filter(item => {
        const date = item.rewardPunishmentTime.substring(0, 10)
        return date >= searchForm.rewardPunishmentDate[0] &&
               date <= searchForm.rewardPunishmentDate[1]
      })
    }

    total.value = filteredData.length
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filteredData.slice(start, start + pageSize.value)
    
    // 计算统计信息
    const rewardCount = filteredData.filter(item => ['honor', 'money', 'other_reward'].includes(item.rewardPunishmentType)).length
    const punishmentCount = filteredData.filter(item => ['verbal', 'fine', 'other_punishment'].includes(item.rewardPunishmentType)).length
    const honorCount = filteredData.filter(item => item.rewardPunishmentType === 'honor').length
    const moneyCount = filteredData.filter(item => item.rewardPunishmentType === 'money').length
    const fineCount = filteredData.filter(item => item.rewardPunishmentType === 'fine').length
    
    statsInfo.value = [
      { label: '总计奖惩记录', value: total.value.toString() },
      { label: '奖励数量', value: rewardCount.toString() },
      { label: '惩罚数量', value: punishmentCount.toString() },
      { label: '荣誉奖励', value: honorCount.toString() },
      { label: '金额奖励', value: moneyCount.toString() },
      { label: '金额惩罚', value: fineCount.toString() }
    ]
    
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
  searchForm.workerName = ''
  searchForm.phone = ''
  searchForm.rewardPunishmentType = ''
  searchForm.rewardPunishmentDate = []
  handleSearch()
}

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

// 新增
const handleAdd = () => {
  router.push('/tenant/on-duty/reward-punishment-add')
}

// 编辑
const handleEdit = (row: RewardPunishmentRecord) => {
  router.push(`/tenant/on-duty/reward-punishment-edit/${row.id}`)
}

// 详情
const handleDetail = (row: RewardPunishmentRecord) => {
  router.push(`/tenant/on-duty/reward-punishment-detail/${row.id}`)
}

// 审核
const handleApprove = (row: RewardPunishmentRecord) => {
  router.push(`/tenant/on-duty/reward-punishment-approve/${row.id}`)
}

// 删除
const handleDelete = (row: RewardPunishmentRecord) => {
  ElMessageBox.confirm('确定要删除该奖惩记录吗?', '提示', {
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

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedRows.value.map(item => item.id)
    ids.forEach(id => {
      const index = mockData.findIndex(item => item.id === id)
      if (index > -1) {
        mockData.splice(index, 1)
      }
    })
    ElMessage.success('批量删除成功')
    loadData()
  }).catch(() => {})
}

// 导入
const handleImport = () => {
  importVisible.value = true
}

// 处理导入文件变化
const handleImportChange = (file: any) => {
  console.log('import file:', file)
}

// 处理导入超出限制
const handleImportExceed = () => {
  ElMessage.warning('只能上传一个文件')
}

// 下载模板
const downloadTemplate = () => {
  ElMessage.info('模板下载功能开发中')
}

// 提交导入
const handleImportSubmit = () => {
  importLoading.value = true
  setTimeout(() => {
    ElMessage.success('导入成功')
    importLoading.value = false
    importVisible.value = false
    loadData()
  }, 1000)
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}



// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: RewardPunishmentRecord[]) => {
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

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.reward-punishment-page {
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
  gap: 12px;
  align-items: center;
}

.filter-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e4e7ed;
  animation: slideDown 0.3s ease;
}

.expand-toggle {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rotate {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.import-content {
  padding: 20px;
}

.import-upload {
  margin-bottom: 20px;
}

.import-tips {
  text-align: center;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
    width: 100% !important;
  }
}
</style>
