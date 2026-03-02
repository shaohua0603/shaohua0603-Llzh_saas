<template>
  <div class="entertainment-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索活动标题"
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="typeFilter"
            placeholder="活动类型"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="文体活动" value="sports" />
            <el-option label="相亲活动" value="dating" />
            <el-option label="技能提升" value="skill" />
            <el-option label="社团活动" value="community" />
            <el-option label="其他活动" value="other" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="statusFilter"
            placeholder="发布状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="未发布" value="unpublished" />
            <el-option label="进行中" value="ongoing" />
            <el-option label="已结束" value="ended" />
          </el-select>
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
        </el-col>
      </el-row>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalCount }}</div>
          <div class="stat-label">活动总数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.publishedCount }}</div>
          <div class="stat-label">已发布</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.ongoingCount }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.endedCount }}</div>
          <div class="stat-label">已结束</div>
        </div>
      </el-card>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="entertainment-table"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :show-selection="false"
      :show-toolbar="false"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @global-search="handleGlobalSearch"
    >
      <template #toolbar-right>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增活动
        </el-button>
      </template>

      <template #column-activityType="{ row }">
        <el-tag>{{ getTypeText(row.activityType) }}</el-tag>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-isApprovalRequired="{ row }">
        <el-tag :type="row.isApprovalRequired ? 'warning' : 'success'">
          {{ row.isApprovalRequired ? '需要审核' : '无需审核' }}
        </el-tag>
      </template>

      <template #column-registrationPeriod="{ row }">
        {{ row.registrationStartDate }} ~ {{ row.registrationEndDate }}
      </template>

      <template #column-activityTime="{ row }">
        {{ row.activityStartTime }} ~ {{ row.activityEndTime }}
      </template>

      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button type="success" link @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
        <el-button
          v-if="row.status === 'unpublished'"
          type="warning"
          link
          @click="handlePublish(row)"
        >
          <el-icon><Upload /></el-icon>
          发布
        </el-button>
        <el-button
          v-if="row.status === 'published' || row.status === 'ongoing'"
          type="info"
          link
          @click="handleUnpublish(row)"
        >
          <el-icon><Download /></el-icon>
          取消发布
        </el-button>
        <el-button
          v-if="row.status === 'unpublished' && !row.isStarted"
          type="success"
          link
          @click="handleStartEarly(row)"
        >
          <el-icon><VideoPlay /></el-icon>
          提前开始
        </el-button>
        <el-button
          v-if="row.status === 'ongoing'"
          type="danger"
          link
          @click="handleEndEarly(row)"
        >
          <el-icon><VideoPause /></el-icon>
          提前结束
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="isEdit ? '编辑文娱活动' : '新增文娱活动'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动类型" prop="activityType">
          <el-select v-model="formData.activityType" placeholder="请选择活动类型">
            <el-option label="文体活动" value="sports" />
            <el-option label="相亲活动" value="dating" />
            <el-option label="技能提升" value="skill" />
            <el-option label="社团活动" value="community" />
            <el-option label="其他活动" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.activityType === 'community'"
          label="选择社团"
          prop="communityId"
        >
          <el-select v-model="formData.communityId" placeholder="请选择社团">
            <el-option
              v-for="community in communityOptions"
              :key="community.id"
              :label="community.name"
              :value="community.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否报名审核" prop="isApprovalRequired">
          <el-switch
            v-model="formData.isApprovalRequired"
            active-text="需要审核"
            inactive-text="无需审核"
          />
        </el-form-item>
        <el-form-item label="报名开始日期" prop="registrationStartDate">
          <el-date-picker
            v-model="formData.registrationStartDate"
            type="date"
            placeholder="选择报名开始日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="报名截止日期" prop="registrationEndDate">
          <el-date-picker
            v-model="formData.registrationEndDate"
            type="date"
            placeholder="选择报名截止日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="活动地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入活动地址" />
        </el-form-item>
        <el-form-item label="活动简介" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="2"
            placeholder="请输入活动简介"
          />
        </el-form-item>
        <el-form-item label="活动详情" prop="content">
          <RichTextEditor v-model="formData.content" :height="'300px'" />
        </el-form-item>
        <el-form-item label="活动开始时间" prop="activityStartTime">
          <el-date-picker
            v-model="formData.activityStartTime"
            type="datetime"
            placeholder="选择活动开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="活动结束时间" prop="activityEndTime">
          <el-date-picker
            v-model="formData.activityEndTime"
            type="datetime"
            placeholder="选择活动结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="文娱活动详情"
      width="800px"
    >
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="活动标题">
            {{ currentRow.title }}
          </el-descriptions-item>
          <el-descriptions-item label="活动类型">
            <el-tag>{{ getTypeText(currentRow.activityType) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否报名审核">
            <el-tag :type="currentRow.isApprovalRequired ? 'warning' : 'success'">
              {{ currentRow.isApprovalRequired ? '需要审核' : '无需审核' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布状态">
            <el-tag :type="getStatusType(currentRow.status)">
              {{ getStatusText(currentRow.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="报名时间" :span="2">
            {{ currentRow.registrationStartDate }} ~ {{ currentRow.registrationEndDate }}
          </el-descriptions-item>
          <el-descriptions-item label="活动地址" :span="2">
            {{ currentRow.address }}
          </el-descriptions-item>
          <el-descriptions-item label="活动简介" :span="2">
            {{ currentRow.summary }}
          </el-descriptions-item>
          <el-descriptions-item label="活动时间" :span="2">
            {{ currentRow.activityStartTime }} ~ {{ currentRow.activityEndTime }}
          </el-descriptions-item>
          <el-descriptions-item label="活动详情" :span="2">
            <div v-html="currentRow.content"></div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, View, Edit, Delete, Upload, Download, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import RichTextEditor from '../../components/RichTextEditor.vue'
import type { ColumnConfig } from '../../types/common-table'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface EntertainmentRecord {
  id: string
  title: string
  activityType: 'sports' | 'dating' | 'skill' | 'community' | 'other'
  communityId?: string
  isApprovalRequired: boolean
  registrationStartDate: string
  registrationEndDate: string
  address: string
  summary: string
  content: string
  activityStartTime: string
  activityEndTime: string
  status: 'unpublished' | 'published' | 'ongoing' | 'ended'
  isStarted: boolean
  createdAt: string
}

interface Community {
  id: string
  name: string
}

// 响应式数据
const searchKeyword = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const tableData = ref<EntertainmentRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const currentRow = ref<EntertainmentRecord | null>(null)
const communityOptions = ref<Community[]>([])

// 对话框控制
const formDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  title: '',
  activityType: '' as EntertainmentRecord['activityType'] | '',
  communityId: '',
  isApprovalRequired: true,
  registrationStartDate: '',
  registrationEndDate: '',
  address: '',
  summary: '',
  content: '',
  activityStartTime: '',
  activityEndTime: ''
})

// 表单验证规则
const formRules: FormRules = {
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  communityId: [
    {
      required: true,
      message: '请选择社团',
      trigger: 'change',
      validator: (_rule: any, value: any, callback: any) => {
        if (formData.activityType === 'community' && !value) {
          callback(new Error('请选择社团'))
        } else {
          callback()
        }
      }
    }
  ],
  registrationStartDate: [{ required: true, message: '请选择报名开始日期', trigger: 'change' }],
  registrationEndDate: [{ required: true, message: '请选择报名截止日期', trigger: 'change' }],
  address: [{ required: true, message: '请输入活动地址', trigger: 'blur' }],
  activityStartTime: [{ required: true, message: '请选择活动开始时间', trigger: 'change' }],
  activityEndTime: [{ required: true, message: '请选择活动结束时间', trigger: 'change' }]
}

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'title', label: '活动标题', minWidth: 200, sortable: true },
  { prop: 'activityType', label: '活动类型', minWidth: 120 },
  { prop: 'isApprovalRequired', label: '是否报名审核', minWidth: 120 },
  { prop: 'registrationPeriod', label: '报名时间', minWidth: 220 },
  { prop: 'address', label: '活动地址', minWidth: 150 },
  { prop: 'activityTime', label: '活动时间', minWidth: 220 },
  { prop: 'status', label: '发布状态', minWidth: 100 }
]

// 统计数据
const stats = reactive({
  totalCount: 0,
  publishedCount: 0,
  ongoingCount: 0,
  endedCount: 0
})

// 模拟数据存储
const allData = ref<EntertainmentRecord[]>([])

// 获取活动类型文本
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    sports: '文体活动',
    dating: '相亲活动',
    skill: '技能提升',
    community: '社团活动',
    other: '其他活动'
  }
  return typeMap[type] || type
}

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    unpublished: 'info',
    published: 'success',
    ongoing: 'primary',
    ended: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    unpublished: '未发布',
    published: '已发布',
    ongoing: '进行中',
    ended: '已结束'
  }
  return textMap[status] || status
}

// 社团选项
const getCommunityOptions = (): Community[] => {
  return [
    { id: 'C001', name: '篮球社' },
    { id: 'C002', name: '足球社' },
    { id: 'C003', name: '羽毛球社' },
    { id: 'C004', name: '读书会' },
    { id: 'C005', name: '摄影社' },
    { id: 'C006', name: '舞蹈社' }
  ]
}

// 生成模拟数据
const generateMockData = (): EntertainmentRecord[] => {
  const titles = [
    '周末篮球比赛',
    '中秋相亲派对',
    '技能培训班',
    '国庆文艺晚会',
    '羽毛球友谊赛',
    '读书分享会',
    '摄影外拍活动',
    '舞蹈教学课程',
    '歌手大赛',
    '趣味运动会'
  ]
  const types: EntertainmentRecord['activityType'][] = ['sports', 'dating', 'skill', 'community', 'other']
  const statuses: EntertainmentRecord['status'][] = ['unpublished', 'published', 'ongoing', 'ended']
  const data: EntertainmentRecord[] = []

  for (let i = 0; i < 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const activityType = types[Math.floor(Math.random() * types.length)]
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 10)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 10) + 1)
    const activityStart = new Date(startDate)
    activityStart.setHours(9 + Math.floor(Math.random() * 8), 0, 0)
    const activityEnd = new Date(activityStart)
    activityEnd.setHours(activityStart.getHours() + Math.floor(Math.random() * 4) + 2)

    data.push({
      id: `ENT${String(i + 1).padStart(6, '0')}`,
      title: titles[i % titles.length] + (i > 9 ? ` ${i + 1}` : ''),
      activityType,
      communityId: activityType === 'community' ? `C00${(i % 6) + 1}` : undefined,
      isApprovalRequired: Math.random() > 0.5,
      registrationStartDate: startDate.toISOString().split('T')[0],
      registrationEndDate: endDate.toISOString().split('T')[0],
      address: `活动中心${(i % 5) + 1}号场地`,
      summary: `精彩纷呈的${getTypeText(activityType)}，欢迎大家积极参与`,
      content: `<p>欢迎参加本次${titles[i % titles.length]}活动！</p><p>活动详情内容...</p>`,
      activityStartTime: activityStart.toISOString().replace('T', ' ').split('.')[0],
      activityEndTime: activityEnd.toISOString().replace('T', ' ').split('.')[0],
      status,
      isStarted: status === 'ongoing' || status === 'ended',
      createdAt: new Date().toISOString()
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
  typeFilter.value = ''
  statusFilter.value = ''
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
    filteredData = filteredData.filter(item =>
      item.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  if (typeFilter.value) {
    filteredData = filteredData.filter(item => item.activityType === typeFilter.value)
  }

  if (statusFilter.value) {
    filteredData = filteredData.filter(item => item.status === statusFilter.value)
  }

  // 更新统计
  stats.totalCount = filteredData.length
  stats.publishedCount = filteredData.filter(item =>
    item.status === 'published' || item.status === 'ongoing'
  ).length
  stats.ongoingCount = filteredData.filter(item => item.status === 'ongoing').length
  stats.endedCount = filteredData.filter(item => item.status === 'ended').length

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length

  loading.value = false
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  formData.title = ''
  formData.activityType = ''
  formData.communityId = ''
  formData.isApprovalRequired = true
  formData.registrationStartDate = ''
  formData.registrationEndDate = ''
  formData.address = ''
  formData.summary = ''
  formData.content = ''
  formData.activityStartTime = ''
  formData.activityEndTime = ''
  formDialogVisible.value = true
}

// 编辑
const handleEdit = (row: EntertainmentRecord) => {
  isEdit.value = true
  currentRow.value = row
  formData.title = row.title
  formData.activityType = row.activityType
  formData.communityId = row.communityId || ''
  formData.isApprovalRequired = row.isApprovalRequired
  formData.registrationStartDate = row.registrationStartDate
  formData.registrationEndDate = row.registrationEndDate
  formData.address = row.address
  formData.summary = row.summary
  formData.content = row.content
  formData.activityStartTime = row.activityStartTime
  formData.activityEndTime = row.activityEndTime
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
      const newRecord: EntertainmentRecord = {
        id: `ENT${Date.now()}`,
        ...formData,
        status: 'unpublished',
        isStarted: false,
        createdAt: new Date().toISOString()
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
const handleView = (row: EntertainmentRecord) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 删除
const handleDelete = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
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

// 发布
const handlePublish = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要发布该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value[index].status = 'published'
    }
    ElMessage.success('发布成功')
    fetchData()
  }).catch(() => {})
}

// 取消发布
const handleUnpublish = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要取消发布该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value[index].status = 'unpublished'
    }
    ElMessage.success('取消发布成功')
    fetchData()
  }).catch(() => {})
}

// 提前开始
const handleStartEarly = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要提前开始该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value[index].status = 'ongoing'
      allData.value[index].isStarted = true
    }
    ElMessage.success('活动已开始')
    fetchData()
  }).catch(() => {})
}

// 提前结束
const handleEndEarly = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要提前结束该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value[index].status = 'ended'
    }
    ElMessage.success('活动已结束')
    fetchData()
  }).catch(() => {})
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  communityOptions.value = getCommunityOptions()
  fetchData()
})
</script>

<style scoped>
.entertainment-management {
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
