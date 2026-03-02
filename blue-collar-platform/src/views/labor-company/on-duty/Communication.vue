<template>
  <div class="communication-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索姓名或手机号"
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="statusFilter"
            placeholder="处理状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="completed" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleSearch"
          />
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="danger" @click="handleDeleteBatch" :disabled="selectedRows.length === 0">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.pendingCount }}</div>
          <div class="stat-label">待处理</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.processingCount }}</div>
          <div class="stat-label">处理中</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.completedCount }}</div>
          <div class="stat-label">已处理</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalCount }}</div>
          <div class="stat-label">总数</div>
        </div>
      </el-card>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="communication-table"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :show-selection="true"
      :show-toolbar="false"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @selection-change="handleSelectionChange"
      @global-search="handleGlobalSearch"
    >
      <template #toolbar-right>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增记录
        </el-button>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-difficulty="{ row }">
        <el-tooltip :content="row.difficulty" placement="top">
          <span class="text-ellipsis">{{ row.difficulty }}</span>
        </el-tooltip>
      </template>

      <template #column-helpNeeded="{ row }">
        <el-tooltip :content="row.helpNeeded" placement="top">
          <span class="text-ellipsis">{{ row.helpNeeded }}</span>
        </el-tooltip>
      </template>

      <template #column-processingRecords="{ row }">
        <el-button type="primary" link @click="viewProcessingRecords(row)">
          查看记录 ({{ row.processingRecords?.length || 0 }})
        </el-button>
      </template>

      <template #column-submitTime="{ row }">
        {{ formatDateTime(row.submitTime) }}
      </template>

      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button type="success" link @click="handleProcess(row)">
          <el-icon><Edit /></el-icon>
          处理
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="isEdit ? '编辑沟通记录' : '新增沟通记录'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="工人姓名" prop="workerName">
          <el-input v-model="formData.workerName" placeholder="请输入工人姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="遇到的困难" prop="difficulty">
          <el-input
            v-model="formData.difficulty"
            type="textarea"
            :rows="3"
            placeholder="请输入遇到的困难"
          />
        </el-form-item>
        <el-form-item label="需要的帮助" prop="helpNeeded">
          <el-input
            v-model="formData.helpNeeded"
            type="textarea"
            :rows="3"
            placeholder="请输入需要的帮助"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 处理记录对话框 -->
    <el-dialog
      v-model="processDialogVisible"
      title="填写处理记录"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="processFormRef" :model="processForm" :rules="processRules" label-width="120px">
        <el-form-item label="处理状态" prop="status">
          <el-radio-group v-model="processForm.status">
            <el-radio label="processing">处理中</el-radio>
            <el-radio label="completed">已处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明" prop="processContent">
          <el-input
            v-model="processForm.processContent"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
          />
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-input
            v-model="processForm.result"
            type="textarea"
            :rows="3"
            placeholder="请输入处理结果"
          />
        </el-form-item>
      </el-form>

      <!-- 历史处理记录 -->
      <div v-if="currentRow?.processingRecords?.length" class="history-records">
        <h4>历史处理记录</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in currentRow.processingRecords"
            :key="index"
            :timestamp="formatDateTime(record.processTime)"
            placement="top"
          >
            <el-card>
              <p><strong>处理人：</strong>{{ record.processor }}</p>
              <p><strong>处理说明：</strong>{{ record.content }}</p>
              <p v-if="record.result"><strong>处理结果：</strong>{{ record.result }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitProcess" :loading="submitLoading">提交处理</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="沟通记录详情"
      width="700px"
    >
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工人姓名">
            {{ currentRow.workerName }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ currentRow.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="遇到困难" :span="2">
            {{ currentRow.difficulty }}
          </el-descriptions-item>
          <el-descriptions-item label="需要帮助" :span="2">
            {{ currentRow.helpNeeded }}
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="getStatusType(currentRow.status)">
              {{ getStatusText(currentRow.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">
            {{ formatDateTime(currentRow.submitTime) }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 处理记录 -->
        <div v-if="currentRow.processingRecords?.length" class="processing-records">
          <h4>处理记录</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in currentRow.processingRecords"
              :key="index"
              :timestamp="formatDateTime(record.processTime)"
              placement="top"
            >
              <el-card>
                <p><strong>处理人：</strong>{{ record.processor }}</p>
                <p><strong>处理说明：</strong>{{ record.content }}</p>
                <p v-if="record.result"><strong>处理结果：</strong>{{ record.result }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 处理记录列表对话框 -->
    <el-dialog
      v-model="recordsDialogVisible"
      title="处理记录列表"
      width="700px"
    >
      <div v-if="currentRow?.processingRecords?.length">
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in currentRow.processingRecords"
            :key="index"
            :timestamp="formatDateTime(record.processTime)"
            placement="top"
          >
            <el-card>
              <p><strong>处理人：</strong>{{ record.processor }}</p>
              <p><strong>处理说明：</strong>{{ record.content }}</p>
              <p v-if="record.result"><strong>处理结果：</strong>{{ record.result }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <el-empty v-else description="暂无处理记录" />
      <template #footer>
        <el-button @click="recordsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete, Plus, View, Edit } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface ProcessingRecord {
  processTime: string
  processor: string
  content: string
  result?: string
}

interface CommunicationRecord {
  id: string
  workerName: string
  phone: string
  difficulty: string
  helpNeeded: string
  status: 'pending' | 'processing' | 'completed'
  submitTime: string
  processingRecords: ProcessingRecord[]
}

// 响应式数据
const searchKeyword = ref('')
const statusFilter = ref('')
const dateRange = ref<string[]>([])
const tableData = ref<CommunicationRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedRows = ref<CommunicationRecord[]>([])
const currentRow = ref<CommunicationRecord | null>(null)

// 对话框控制
const formDialogVisible = ref(false)
const processDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const recordsDialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const processFormRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  workerName: '',
  phone: '',
  difficulty: '',
  helpNeeded: ''
})

// 表单验证规则
const formRules: FormRules = {
  workerName: [{ required: true, message: '请输入工人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  difficulty: [{ required: true, message: '请输入遇到的困难', trigger: 'blur' }]
}

// 处理表单
const processForm = reactive({
  status: 'processing',
  processContent: '',
  result: ''
})

// 处理表单验证规则
const processRules: FormRules = {
  processContent: [{ required: true, message: '请输入处理说明', trigger: 'blur' }]
}

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '姓名', minWidth: 120, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'difficulty', label: '遇到的困难', minWidth: 200 },
  { prop: 'helpNeeded', label: '需要的帮助', minWidth: 200 },
  { prop: 'status', label: '处理状态', minWidth: 100 },
  { prop: 'processingRecords', label: '处理记录', minWidth: 120 },
  { prop: 'submitTime', label: '提交时间', minWidth: 160, sortable: true }
]

// 统计数据
const stats = reactive({
  pendingCount: 0,
  processingCount: 0,
  completedCount: 0,
  totalCount: 0
})

// 模拟数据存储
const allData = ref<CommunicationRecord[]>([])

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已处理'
  }
  return textMap[status] || status
}

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 生成模拟数据
const generateMockData = (): CommunicationRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const difficulties = [
    '工资发放不及时',
    '工作环境有问题',
    '住宿条件差',
    '饮食不习惯',
    '工作时间长',
    '加班费用问题',
    '工伤处理问题',
    '合同纠纷'
  ]
  const helpNeededList = [
    '希望尽快解决工资问题',
    '需要改善工作环境',
    '希望更换宿舍',
    '希望能调整饮食',
    '希望减少加班时间',
    '需要结算加班费',
    '需要进行工伤认定',
    '需要法律援助'
  ]
  const statuses: CommunicationRecord['status'][] = ['pending', 'processing', 'completed']
  const data: CommunicationRecord[] = []

  for (let i = 0; i < 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const submitTime = new Date()
    submitTime.setDate(submitTime.getDate() - Math.floor(Math.random() * 30))

    const processingRecords: ProcessingRecord[] = []
    if (status !== 'pending') {
      const recordCount = status === 'completed' ? Math.floor(Math.random() * 3) + 1 : 1
      for (let j = 0; j < recordCount; j++) {
        const processTime = new Date(submitTime.getTime() + (j + 1) * 86400000)
        processingRecords.push({
          processTime: processTime.toISOString(),
          processor: '管理员',
          content: `第${j + 1}次处理：已联系相关人员协调解决`,
          result: status === 'completed' ? '问题已解决' : undefined
        })
      }
    }

    data.push({
      id: `COMM${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      helpNeeded: helpNeededList[Math.floor(Math.random() * helpNeededList.length)],
      status,
      submitTime: submitTime.toISOString(),
      processingRecords
    })
  }

  return data
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  dateRange.value = []
  handleSearch()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 选择变化
const handleSelectionChange = (selection: CommunicationRecord[]) => {
  selectedRows.value = selection
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}

// 获取数据
const fetchData = () => {
  loading.value = true

  let filteredData = [...allData.value]

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword)
    )
  }

  if (statusFilter.value) {
    filteredData = filteredData.filter(item => item.status === statusFilter.value)
  }

  if (dateRange.value && dateRange.value.length === 2) {
    filteredData = filteredData.filter(item => {
      return item.submitTime >= dateRange.value[0] && item.submitTime <= dateRange.value[1]
    })
  }

  // 更新统计
  stats.pendingCount = filteredData.filter(item => item.status === 'pending').length
  stats.processingCount = filteredData.filter(item => item.status === 'processing').length
  stats.completedCount = filteredData.filter(item => item.status === 'completed').length
  stats.totalCount = filteredData.length

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length

  loading.value = false
}

// 新增记录
const handleAdd = () => {
  isEdit.value = false
  formData.workerName = ''
  formData.phone = ''
  formData.difficulty = ''
  formData.helpNeeded = ''
  formDialogVisible.value = true
}

// 编辑记录
const handleEdit = (row: CommunicationRecord) => {
  isEdit.value = true
  formData.workerName = row.workerName
  formData.phone = row.phone
  formData.difficulty = row.difficulty
  formData.helpNeeded = row.helpNeeded
  currentRow.value = row
  formDialogVisible.value = true
}

// 提交表单
const handleSubmitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate()

  submitLoading.value = true

  try {
    if (isEdit.value && currentRow.value) {
      // 编辑
      const index = allData.value.findIndex(item => item.id === currentRow.value!.id)
      if (index > -1) {
        allData.value[index] = { ...allData.value[index], ...formData }
      }
      ElMessage.success('修改成功')
    } else {
      // 新增
      const newRecord: CommunicationRecord = {
        id: `COMM${Date.now()}`,
        ...formData,
        status: 'pending',
        submitTime: new Date().toISOString(),
        processingRecords: []
      }
      allData.value.unshift(newRecord)
      ElMessage.success('新增成功')
    }

    formDialogVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

// 查看详情
const handleView = (row: CommunicationRecord) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 处理
const handleProcess = (row: CommunicationRecord) => {
  currentRow.value = row
  processForm.status = row.status === 'pending' ? 'processing' : row.status
  processForm.processContent = ''
  processForm.result = ''
  processDialogVisible.value = true
}

// 提交处理
const handleSubmitProcess = async () => {
  if (!processFormRef.value) return

  await processFormRef.value.validate()

  submitLoading.value = true

  try {
    const newRecord: ProcessingRecord = {
      processTime: new Date().toISOString(),
      processor: '管理员',
      content: processForm.processContent,
      result: processForm.result || undefined
    }

    const index = allData.value.findIndex(item => item.id === currentRow.value!.id)
    if (index > -1) {
      if (!allData.value[index].processingRecords) {
        allData.value[index].processingRecords = []
      }
      allData.value[index].processingRecords.push(newRecord)
      allData.value[index].status = processForm.status as CommunicationRecord['status']
    }

    ElMessage.success('处理记录提交成功')
    processDialogVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

// 查看处理记录
const viewProcessingRecords = (row: CommunicationRecord) => {
  currentRow.value = row
  recordsDialogVisible.value = true
}

// 删除
const handleDelete = (row: CommunicationRecord) => {
  ElMessageBox.confirm('确定要删除该沟通记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 批量删除
const handleDeleteBatch = () => {
  if (selectedRows.value.length === 0) return

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const ids = new Set(selectedRows.value.map(row => row.id))
    allData.value = allData.value.filter(item => !ids.has(item.id))
    ElMessage.success('批量删除成功')
    fetchData()
  }).catch(() => {})
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchData()
})
</script>

<style scoped>
.communication-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.search-filter-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px 0;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.text-ellipsis {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-records,
.processing-records {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.history-records h4,
.processing-records h4 {
  margin-bottom: 16px;
  color: #303133;
}

.detail-content {
  padding: 10px;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .search-filter-section :deep(.el-row) {
    flex-direction: column;
  }

  .search-filter-section :deep(.el-col) {
    width: 100%;
    margin-bottom: 12px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
