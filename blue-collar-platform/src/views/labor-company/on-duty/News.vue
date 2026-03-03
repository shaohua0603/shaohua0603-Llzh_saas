<template>
  <div class="news-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="资讯标题">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索资讯标题"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="资讯类型">
          <el-select
            v-model="filterForm.type"
            placeholder="资讯类型"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="技能提升" value="skill" />
            <el-option label="学历提升" value="education" />
            <el-option label="岗位介绍" value="job" />
            <el-option label="其他资讯" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select
            v-model="filterForm.status"
            placeholder="发布状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="未发布" value="unpublished" />
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
      <div class="expand-toggle" @click="toggleFilter">
        <el-icon :class="{ 'rotate-180': filterExpanded }"><ArrowDown /></el-icon>
        <span>{{ filterExpanded ? '收起' : '展开' }}</span>
      </div>
      <!-- 展开显示更多查询条件 -->
      <div v-if="filterExpanded" class="filter-content expanded">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="创建日期范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 250px"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增资讯
      </el-button>
      <el-button type="warning" @click="handleBatchPublish" :disabled="true">
        <el-icon><Upload /></el-icon>
        批量发布
      </el-button>
      <el-button type="info" @click="handleBatchUnpublish" :disabled="true">
        <el-icon><Download /></el-icon>
        批量取消发布
      </el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="true">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
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
      :show-selection="true"
      :show-toolbar="true"
      :stats-info="statsInfo"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @selection-change="handleSelectionChange"
      @global-search="handleGlobalSearch"
    >

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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, View, Edit, Delete, Upload, Download, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import RichTextEditor from '../../../components/RichTextEditor.vue'
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
const filterExpanded = ref(false)
const filterForm = reactive({
  keyword: '',
  type: '',
  status: '',
  dateRange: [] as string[]
})
const tableData = ref<NewsRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const currentRow = ref<NewsRecord | null>(null)
const selectedRows = ref<NewsRecord[]>([])

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

// 统计信息字符串
const statsInfo = computed(() => {
  return `资讯总数: ${stats.totalCount} | 已发布: ${stats.publishedCount} | 未发布: ${stats.unpublishedCount} | 技能提升: ${stats.skillCount}`
})

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

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
  filterForm.keyword = ''
  filterForm.type = ''
  filterForm.status = ''
  filterForm.dateRange = []
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
const handleSelectionChange = (selection: NewsRecord[]) => {
  selectedRows.value = selection
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  filterForm.keyword = keyword
  handleSearch()
}

// 获取数据
const fetchData = () => {
  loading.value = true

  let filteredData = [...allData.value]

  if (filterForm.keyword) {
    filteredData = filteredData.filter(item =>
      item.title.toLowerCase().includes(filterForm.keyword.toLowerCase())
    )
  }

  if (filterForm.type) {
    filteredData = filteredData.filter(item => item.newsType === filterForm.type)
  }

  if (filterForm.status) {
    filteredData = filteredData.filter(item => item.status === filterForm.status)
  }

  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    filteredData = filteredData.filter(item => {
      return item.createTime >= filterForm.dateRange[0] && item.createTime <= filterForm.dateRange[1]
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

// 查看
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

// 批量发布
const handleBatchPublish = async () => {
  if (selectedRows.value.length === 0) return

  const unpublishedRows = selectedRows.value.filter(row => row.status === 'unpublished')

  if (unpublishedRows.length === 0) {
    ElMessage.warning('没有未发布的资讯')
    return
  }

  try {
    ElMessageBox.confirm(
      `确定要发布选中的 ${unpublishedRows.length} 条资讯吗？`,
      '批量发布',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      unpublishedRows.forEach(row => {
        const index = allData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          allData.value[index].status = 'published'
          allData.value[index].publishTime = new Date().toISOString()
        }
      })
      ElMessage.success('批量发布成功')
      fetchData()
    }).catch(() => {})
  } catch (error) {
    console.error('批量发布失败:', error)
    ElMessage.error('批量发布失败')
  }
}

// 批量取消发布
const handleBatchUnpublish = async () => {
  if (selectedRows.value.length === 0) return

  const publishedRows = selectedRows.value.filter(row => row.status === 'published')

  if (publishedRows.length === 0) {
    ElMessage.warning('没有已发布的资讯')
    return
  }

  try {
    ElMessageBox.confirm(
      `确定要取消发布选中的 ${publishedRows.length} 条资讯吗？`,
      '批量取消发布',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      publishedRows.forEach(row => {
        const index = allData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          allData.value[index].status = 'unpublished'
        }
      })
      ElMessage.success('批量取消发布成功')
      fetchData()
    }).catch(() => {})
  } catch (error) {
    console.error('批量取消发布失败:', error)
    ElMessage.error('批量取消发布失败')
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return

  try {
    ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条资讯吗？`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      selectedRows.value.forEach(row => {
        const index = allData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          allData.value.splice(index, 1)
        }
      })
      ElMessage.success('批量删除成功')
      fetchData()
    }).catch(() => {})
  } catch (error) {
    console.error('批量删除失败:', error)
    ElMessage.error('批量删除失败')
  }
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchData()
})
</script>

<style scoped>
.news-management {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #f5f7fa;
}

.search-filter-section {
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.filter-form {
  padding: 16px;
  padding-bottom: 0;
}

.expand-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  color: #409eff;
  border-top: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.expand-toggle:hover {
  background-color: #f5f7fa;
}

.expand-toggle .el-icon {
  margin-right: 8px;
  transition: transform 0.3s;
}

.expand-toggle .rotate-180 {
  transform: rotate(180deg);
}

.filter-content.expanded {
  padding: 16px;
  border-top: 1px solid #e4e7ed;
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

.detail-content {
  padding: 10px;
}

.news-content {
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .news-management {
    padding: 8px;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .filter-form :deep(.el-input),
  .filter-form :deep(.el-select),
  .filter-form :deep(.el-date-picker) {
    width: 100%;
  }

  .detail-content {
    padding: 5px;
  }
}
</style>
