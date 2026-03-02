<template>
  <div class="news-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索资讯标题"
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="typeFilter"
            placeholder="资讯类型"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="技能提升" value="skill" />
            <el-option label="学历提升" value="education" />
            <el-option label="岗位介绍" value="job" />
            <el-option label="其他资讯" value="other" />
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
        <el-col :span="6">
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
          <div class="stat-label">资讯总数</div>
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
          <div class="stat-number">{{ stats.unpublishedCount }}</div>
          <div class="stat-label">未发布</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.skillCount }}</div>
          <div class="stat-label">技能提升</div>
        </div>
      </el-card>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="news-table"
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
          新增资讯
        </el-button>
      </template>

      <template #column-newsType="{ row }">
        <el-tag>{{ getTypeText(row.newsType) }}</el-tag>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="row.status === 'published' ? 'success' : 'info'">
          {{ row.status === 'published' ? '已发布' : '未发布' }}
        </el-tag>
      </template>

      <template #column-publishTime="{ row }">
        {{ row.publishTime ? formatDateTime(row.publishTime) : '-' }}
      </template>

      <template #column-createTime="{ row }">
        {{ formatDateTime(row.createTime) }}
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
          v-if="row.status === 'published'"
          type="info"
          link
          @click="handleUnpublish(row)"
        >
          <el-icon><Download /></el-icon>
          取消发布
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="isEdit ? '编辑资讯' : '新增资讯'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入资讯标题" />
        </el-form-item>
        <el-form-item label="资讯类型" prop="newsType">
          <el-select v-model="formData.newsType" placeholder="请选择资讯类型">
            <el-option label="技能提升" value="skill" />
            <el-option label="学历提升" value="education" />
            <el-option label="岗位介绍" value="job" />
            <el-option label="其他资讯" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="资讯摘要" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="2"
            placeholder="请输入资讯摘要"
          />
        </el-form-item>
        <el-form-item label="资讯内容" prop="content">
          <RichTextEditor v-model="formData.content" :height="'350px'" />
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
      title="资讯详情"
      width="800px"
    >
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="资讯标题" :span="2">
            {{ currentRow.title }}
          </el-descriptions-item>
          <el-descriptions-item label="资讯类型">
            <el-tag>{{ getTypeText(currentRow.newsType) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布状态">
            <el-tag :type="currentRow.status === 'published' ? 'success' : 'info'">
              {{ currentRow.status === 'published' ? '已发布' : '未发布' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="资讯摘要" :span="2">
            {{ currentRow.summary }}
          </el-descriptions-item>
          <el-descriptions-item label="发布时间">
            {{ currentRow.publishTime ? formatDateTime(currentRow.publishTime) : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(currentRow.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="资讯内容" :span="2">
            <div v-html="currentRow.content" class="news-content"></div>
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
import { Search, Refresh, Plus, View, Edit, Delete, Upload, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import RichTextEditor from '../../components/RichTextEditor.vue'
import type { ColumnConfig } from '../../types/common-table'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface NewsRecord {
  id: string
  title: string
  newsType: 'skill' | 'education' | 'job' | 'other'
  summary: string
  content: string
  status: 'published' | 'unpublished'
  publishTime?: string
  createTime: string
}

// 响应式数据
const searchKeyword = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const dateRange = ref<string[]>([])
const tableData = ref<NewsRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const currentRow = ref<NewsRecord | null>(null)

// 对话框控制
const formDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  title: '',
  newsType: '' as NewsRecord['newsType'] | '',
  summary: '',
  content: ''
})

// 表单验证规则
const formRules: FormRules = {
  title: [{ required: true, message: '请输入资讯标题', trigger: 'blur' }],
  newsType: [{ required: true, message: '请选择资讯类型', trigger: 'change' }],
  summary: [{ required: true, message: '请输入资讯摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入资讯内容', trigger: 'blur' }]
}

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'title', label: '资讯标题', minWidth: 250, sortable: true },
  { prop: 'newsType', label: '资讯类型', minWidth: 120 },
  { prop: 'summary', label: '资讯摘要', minWidth: 300 },
  { prop: 'status', label: '发布状态', minWidth: 100 },
  { prop: 'publishTime', label: '发布时间', minWidth: 160, sortable: true },
  { prop: 'createTime', label: '创建时间', minWidth: 160, sortable: true }
]

// 统计数据
const stats = reactive({
  totalCount: 0,
  publishedCount: 0,
  unpublishedCount: 0,
  skillCount: 0
})

// 模拟数据存储
const allData = ref<NewsRecord[]>([])

// 获取资讯类型文本
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    skill: '技能提升',
    education: '学历提升',
    job: '岗位介绍',
    other: '其他资讯'
  }
  return typeMap[type] || type
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
const generateMockData = (): NewsRecord[] => {
  const titles = [
    '电工技能提升培训课程',
    '焊工实操技能训练',
    '数控机床操作指南',
    '叉车驾驶技能培训',
    '安全生产知识讲座',
    '职业健康防护指南',
    '最新岗位招聘信息',
    '工厂普工岗位介绍',
    '技术工种薪资待遇分析',
    '如何提升职业技能',
    '成人高考学历提升指南',
    '网络教育学历提升',
    '技能证书考取指南',
    '职业发展规划建议',
    '工厂生活指南'
  ]
  const summaries = [
    '提供专业的技能培训，帮助工人提升职业技能水平',
    '系统化的培训课程，让学员快速掌握实用技能',
    '理论与实践相结合，提升实际操作能力',
    '专业的师资团队，提供一对一指导服务',
    '最新岗位信息，待遇优厚，福利完善'
  ]
  const types: NewsRecord['newsType'][] = ['skill', 'education', 'job', 'other']
  const statuses: NewsRecord['status'][] = ['published', 'unpublished']
  const data: NewsRecord[] = []

  for (let i = 0; i < 30; i++) {
    const newsType = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createTime = new Date()
    createTime.setDate(createTime.getDate() - Math.floor(Math.random() * 30))
    const publishTime = status === 'published' ? new Date(createTime.getTime() + 86400000) : undefined

    data.push({
      id: `NEWS${String(i + 1).padStart(6, '0')}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i / titles.length) + 1}` : ''),
      newsType,
      summary: summaries[i % summaries.length],
      content: `<h2>${titles[i % titles.length]}</h2><p>${summaries[i % summaries.length]}</p><p>详细内容...</p>`,
      status,
      publishTime: publishTime ? publishTime.toISOString() : undefined,
      createTime: createTime.toISOString()
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
    filteredData = filteredData.filter(item => item.newsType === typeFilter.value)
  }

  if (statusFilter.value) {
    filteredData = filteredData.filter(item => item.status === statusFilter.value)
  }

  if (dateRange.value && dateRange.value.length === 2) {
    filteredData = filteredData.filter(item => {
      return item.createTime >= dateRange.value[0] && item.createTime <= dateRange.value[1]
    })
  }

  // 更新统计
  stats.totalCount = filteredData.length
  stats.publishedCount = filteredData.filter(item => item.status === 'published').length
  stats.unpublishedCount = filteredData.filter(item => item.status === 'unpublished').length
  stats.skillCount = filteredData.filter(item => item.newsType === 'skill').length

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
  formData.newsType = ''
  formData.summary = ''
  formData.content = ''
  formDialogVisible.value = true
}

// 编辑
const handleEdit = (row: NewsRecord) => {
  isEdit.value = true
  currentRow.value = row
  formData.title = row.title
  formData.newsType = row.newsType
  formData.summary = row.summary
  formData.content = row.content
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
      const newRecord: NewsRecord = {
        id: `NEWS${Date.now()}`,
        title: formData.title,
        newsType: formData.newsType as NewsRecord['newsType'],
        summary: formData.summary,
        content: formData.content,
        status: 'unpublished',
        createTime: new Date().toISOString()
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
const handleView = (row: NewsRecord) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 删除
const handleDelete = (row: NewsRecord) => {
  ElMessageBox.confirm('确定要删除该资讯吗？', '提示', {
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
const handlePublish = (row: NewsRecord) => {
  ElMessageBox.confirm('确定要发布该资讯吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value[index].status = 'published'
      allData.value[index].publishTime = new Date().toISOString()
    }
    ElMessage.success('发布成功')
    fetchData()
  }).catch(() => {})
}

// 取消发布
const handleUnpublish = (row: NewsRecord) => {
  ElMessageBox.confirm('确定要取消发布该资讯吗？', '提示', {
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

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchData()
})
</script>

<style scoped>
.news-management {
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

.news-content {
  max-height: 400px;
  overflow-y: auto;
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
