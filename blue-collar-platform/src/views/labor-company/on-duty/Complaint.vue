<!-- 投诉/建议管理页面 -->
<template>
  <div class="complaint-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="投诉/建议人">
          <el-input v-model="searchForm.complainant" placeholder="请输入投诉/建议人" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="processed" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
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
      action-column-width="180"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar-right>
        <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </template>
      <template #column-status="{ row }">
        <el-tag :type="getStatusTag(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>
      <template #column-title="{ row }">
        <el-text truncated style="max-width: 200px">{{ row.title }}</el-text>
      </template>
      <template #column-content="{ row }">
        <el-text truncated style="max-width: 250px">{{ row.content }}</el-text>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">查看详情</el-button>
        <el-button link type="success" size="small" @click="handleProcess(row)" v-if="row.status === 'pending' || row.status === 'processing'">处理</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="投诉/建议详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="投诉/建议人">{{ currentRow?.complainant }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentRow?.phone }}</el-descriptions-item>
        <el-descriptions-item label="标题" :span="2">{{ currentRow?.title }}</el-descriptions-item>
        <el-descriptions-item label="内容" :span="2">{{ currentRow?.content }}</el-descriptions-item>
        <el-descriptions-item label="处理状态">
          <el-tag :type="getStatusTag(currentRow?.status)">
            {{ getStatusText(currentRow?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentRow?.submitTime }}</el-descriptions-item>
        <el-descriptions-item label="处理时间" v-if="currentRow?.processTime">{{ currentRow?.processTime }}</el-descriptions-item>
        <el-descriptions-item label="处理人" v-if="currentRow?.processor">{{ currentRow?.processor }}</el-descriptions-item>
        <el-descriptions-item label="处理意见" :span="2" v-if="currentRow?.processComment">{{ currentRow?.processComment }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleProcess(currentRow)" v-if="currentRow?.status === 'pending' || currentRow?.status === 'processing'">处理</el-button>
      </template>
    </el-dialog>

    <!-- 处理弹窗 -->
    <el-dialog v-model="processVisible" title="处理投诉/建议" width="500px">
      <el-form ref="processFormRef" :model="processForm" :rules="processRules" label-width="100px">
        <el-form-item label="处理结果">
          <el-radio-group v-model="processForm.status">
            <el-radio label="processed">处理完成</el-radio>
            <el-radio label="rejected">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理意见" prop="processComment">
          <el-input v-model="processForm.processComment" type="textarea" :rows="4" placeholder="请输入处理意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProcessSubmit" :loading="processLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

// 类型定义
interface ComplaintRecord {
  id: string
  complainant: string
  phone: string
  title: string
  content: string
  status: 'pending' | 'processing' | 'processed' | 'rejected'
  submitTime: string
  processTime?: string
  processor?: string
  processComment?: string
}

// 表格列配置
const columns = [
  { prop: 'complainant', label: '投诉/建议人', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 130, sortable: true },
  { prop: 'title', label: '标题', minWidth: 200 },
  { prop: 'content', label: '内容', minWidth: 250, showTooltip: true },
  { prop: 'status', label: '处理状态', minWidth: 100, sortable: true },
  { prop: 'submitTime', label: '提交时间', minWidth: 160, sortable: true }
]

// 响应式数据
const tableData = ref<ComplaintRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<ComplaintRecord[]>([])
const detailVisible = ref(false)
const processVisible = ref(false)
const processLoading = ref(false)
const currentRow = ref<ComplaintRecord | null>(null)

const searchForm = reactive({
  complainant: '',
  phone: '',
  status: ''
})

const processForm = reactive({
  status: 'processed',
  processComment: ''
})

const processFormRef = ref<FormInstance>()

const processRules: FormRules = {
  processComment: [{ required: true, message: '请输入处理意见', trigger: 'blur' }]
}

// Mock数据
const mockData: ComplaintRecord[] = [
  {
    id: '1',
    complainant: '张三',
    phone: '13800138001',
    title: '建议增加夜班补贴',
    content: '希望公司能够考虑增加夜班补贴，提高工人的工作积极性',
    status: 'pending',
    submitTime: '2024-02-15 10:30:00'
  },
  {
    id: '2',
    complainant: '李四',
    phone: '13800138002',
    title: '投诉宿舍环境问题',
    content: '宿舍空调经常故障，影响休息，希望尽快维修',
    status: 'processing',
    submitTime: '2024-02-10 09:00:00',
    processTime: '2024-02-11 14:00:00',
    processor: '管理员'
  },
  {
    id: '3',
    complainant: '王五',
    phone: '13800138003',
    title: '建议改善食堂菜品',
    content: '希望食堂能够增加更多素菜选择，满足不同工人的需求',
    status: 'processed',
    submitTime: '2024-02-05 15:20:00',
    processTime: '2024-02-08 10:00:00',
    processor: '管理员',
    processComment: '已将建议反馈给食堂管理方，后续会改善菜品结构'
  },
  {
    id: '4',
    complainant: '赵六',
    phone: '13800138004',
    title: '投诉工资发放延迟',
    content: '上个月工资延迟了3天发放，影响了生活安排',
    status: 'processed',
    submitTime: '2024-02-01 11:00:00',
    processTime: '2024-02-03 16:00:00',
    processor: '管理员',
    processComment: '经核实，因银行系统维护导致延迟，已向财务部门反馈'
  },
  {
    id: '5',
    complainant: '钱七',
    phone: '13800138005',
    title: '建议增加培训课程',
    content: '希望公司能够提供更多技能提升的培训课程',
    status: 'rejected',
    submitTime: '2024-01-28 14:30:00',
    processTime: '2024-01-30 09:00:00',
    processor: '管理员',
    processComment: '目前培训计划已饱和，暂不考虑增加新课程'
  },
  {
    id: '6',
    complainant: '孙八',
    phone: '13800138006',
    title: '投诉车间噪音问题',
    content: '生产车间噪音太大，长期工作对听力有影响',
    status: 'pending',
    submitTime: '2024-02-16 08:45:00'
  }
]

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    processed: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    processed: '已处理',
    rejected: '已驳回'
  }
  return map[status] || status
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let filteredData = [...mockData]

    // 筛选
    if (searchForm.complainant) {
      filteredData = filteredData.filter(item => item.complainant.includes(searchForm.complainant))
    }
    if (searchForm.phone) {
      filteredData = filteredData.filter(item => item.phone.includes(searchForm.phone))
    }
    if (searchForm.status) {
      filteredData = filteredData.filter(item => item.status === searchForm.status)
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
  searchForm.complainant = ''
  searchForm.phone = ''
  searchForm.status = ''
  handleSearch()
}

// 详情
const handleDetail = (row: ComplaintRecord) => {
  currentRow.value = row
  detailVisible.value = true
}

// 处理
const handleProcess = (row: ComplaintRecord) => {
  currentRow.value = row
  processForm.status = 'processed'
  processForm.processComment = ''
  processVisible.value = true
}

// 提交处理
const handleProcessSubmit = async () => {
  if (!processFormRef.value) return
  await processFormRef.value.validate((valid) => {
    if (valid) {
      processLoading.value = true
      setTimeout(() => {
        const index = mockData.findIndex(item => item.id === currentRow.value?.id)
        if (index > -1) {
          mockData[index].status = processForm.status as ComplaintRecord['status']
          mockData[index].processComment = processForm.processComment
          mockData[index].processTime = new Date().toLocaleString()
          mockData[index].processor = '当前用户'
        }
        ElMessage.success(processForm.status === 'processed' ? '处理完成' : '已驳回')
        processLoading.value = false
        processVisible.value = false
        detailVisible.value = false
        loadData()
      }, 500)
    }
  })
}

// 删除
const handleDelete = (row: ComplaintRecord) => {
  ElMessageBox.confirm('确定要删除该投诉/建议吗?', '提示', {
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

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: ComplaintRecord[]) => {
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
.complaint-page {
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
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}
</style>
