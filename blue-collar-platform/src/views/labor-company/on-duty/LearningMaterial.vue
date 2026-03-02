<!-- 学习材料页面 -->
<template>
  <div class="learning-material-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入学习材料标题" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.materialType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="岗前培训" value="pre_job" />
            <el-option label="日常培训" value="daily" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="searchForm.publishStatus" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="未发布" value="unpublished" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
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
      action-column-width="220"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar-right>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
        <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </template>

      <template #column-materialType="{ row }">
        <el-tag :type="getMaterialTypeTag(row.materialType)">
          {{ getMaterialTypeText(row.materialType) }}
        </el-tag>
      </template>
      <template #column-publishStatus="{ row }">
        <el-switch
          v-model="row.publishStatus"
          active-value="published"
          inactive-value="unpublished"
          @change="handlePublishStatusChange(row)"
        />
      </template>
      <template #column-summary="{ row }">
        <el-text truncated style="max-width: 200px">{{ row.summary }}</el-text>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="success" size="small" @click="handlePublish(row)" v-if="row.publishStatus === 'unpublished'">发布</el-button>
        <el-button link type="warning" size="small" @click="handleUnpublish(row)" v-else>取消发布</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学习材料标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入学习材料标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学习材料类型" prop="materialType">
              <el-select v-model="formData.materialType" placeholder="请选择类型" style="width: 100%">
                <el-option label="岗前培训" value="pre_job" />
                <el-option label="日常培训" value="daily" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="学习材料摘要" prop="summary">
          <el-input v-model="formData.summary" type="textarea" :rows="3" placeholder="请输入学习材料摘要" />
        </el-form-item>
        <el-form-item label="学习材料内容" prop="content">
          <RichTextEditor v-model="formData.content" placeholder="请输入学习材料内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="学习材料详情" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="学习材料标题">{{ currentRow?.title }}</el-descriptions-item>
        <el-descriptions-item label="学习材料类型">
          <el-tag :type="getMaterialTypeTag(currentRow?.materialType)">
            {{ getMaterialTypeText(currentRow?.materialType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布状态">
          <el-tag :type="currentRow?.publishStatus === 'published' ? 'success' : 'info'">
            {{ currentRow?.publishStatus === 'published' ? '已发布' : '未发布' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="学习材料摘要" :span="2">{{ currentRow?.summary }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">学习材料内容</el-divider>
      <div class="content-view" v-html="currentRow?.content"></div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

// 类型定义
interface LearningMaterial {
  id: string
  title: string
  materialType: 'pre_job' | 'daily'
  summary: string
  content: string
  publishStatus: 'published' | 'unpublished'
  createTime: string
}

// 表格列配置
const columns = [
  { prop: 'title', label: '学习材料标题', minWidth: 200, sortable: true },
  { prop: 'materialType', label: '学习材料类型', minWidth: 120, sortable: true },
  { prop: 'summary', label: '学习材料摘要', minWidth: 200 },
  { prop: 'publishStatus', label: '发布状态', minWidth: 100, sortable: true },
  { prop: 'createTime', label: '创建时间', minWidth: 160, sortable: true }
]

// 响应式数据
const tableData = ref<LearningMaterial[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<LearningMaterial[]>([])
const dialogVisible = ref(false)
const detailVisible = ref(false)
const submitLoading = ref(false)
const dialogTitle = ref('新增学习材料')
const currentRow = ref<LearningMaterial | null>(null)

const searchForm = reactive({
  title: '',
  materialType: '',
  publishStatus: ''
})

const formData = reactive<LearningMaterial>({
  id: '',
  title: '',
  materialType: 'pre_job',
  summary: '',
  content: '',
  publishStatus: 'unpublished',
  createTime: ''
})

const formRef = ref<FormInstance>()

const formRules: FormRules = {
  title: [{ required: true, message: '请输入学习材料标题', trigger: 'blur' }],
  materialType: [{ required: true, message: '请选择学习材料类型', trigger: 'change' }],
  summary: [{ required: true, message: '请输入学习材料摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入学习材料内容', trigger: 'blur' }]
}

// Mock数据
const mockData: LearningMaterial[] = [
  {
    id: '1',
    title: '安全生产基础知识',
    materialType: 'pre_job',
    summary: '本课程主要介绍安全生产的基本概念、基本原则和基本要求',
    content: '<h2>安全生产基础知识</h2><p>安全生产是指在生产过程中采取必要的措施，消除或控制危险有害因素，保障人身安全健康、设备设施免受损坏、生产活动正常进行。</p><h3>安全生产的基本原则</h3><ul><li>安全第一</li><li>预防为主</li><li>综合治理</li></ul>',
    publishStatus: 'published',
    createTime: '2024-01-15 10:00:00'
  },
  {
    id: '2',
    title: '岗位操作规程',
    materialType: 'pre_job',
    summary: '详细介绍各岗位的操作规程和注意事项',
    content: '<h2>岗位操作规程</h2><p>岗位操作规程是工人从事生产作业的基本准则，必须严格遵守。</p>',
    publishStatus: 'published',
    createTime: '2024-01-20 14:30:00'
  },
  {
    id: '3',
    title: '消防知识培训',
    materialType: 'daily',
    summary: '消防知识普及和火灾应对方法',
    content: '<h2>消防知识培训</h2><p>学习消防知识，提高火灾防范意识。</p>',
    publishStatus: 'unpublished',
    createTime: '2024-02-01 09:00:00'
  },
  {
    id: '4',
    title: '职业健康防护',
    materialType: 'daily',
    summary: '职业健康防护知识和个人防护用品使用',
    content: '<h2>职业健康防护</h2><p>了解职业病危害，掌握防护措施。</p>',
    publishStatus: 'published',
    createTime: '2024-02-05 16:00:00'
  }
]

// 获取类型标签
const getMaterialTypeTag = (type: string) => {
  const map: Record<string, string> = {
    pre_job: 'success',
    daily: 'primary'
  }
  return map[type] || 'info'
}

// 获取类型文本
const getMaterialTypeText = (type: string) => {
  const map: Record<string, string> = {
    pre_job: '岗前培训',
    daily: '日常培训'
  }
  return map[type] || type
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let filteredData = [...mockData]

    // 筛选
    if (searchForm.title) {
      filteredData = filteredData.filter(item => item.title.includes(searchForm.title))
    }
    if (searchForm.materialType) {
      filteredData = filteredData.filter(item => item.materialType === searchForm.materialType)
    }
    if (searchForm.publishStatus) {
      filteredData = filteredData.filter(item => item.publishStatus === searchForm.publishStatus)
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
  searchForm.title = ''
  searchForm.materialType = ''
  searchForm.publishStatus = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增学习材料'
  Object.assign(formData, {
    id: '',
    title: '',
    materialType: 'pre_job',
    summary: '',
    content: '',
    publishStatus: 'unpublished',
    createTime: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: LearningMaterial) => {
  dialogTitle.value = '编辑学习材料'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 详情
const handleDetail = (row: LearningMaterial) => {
  currentRow.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = (row: LearningMaterial) => {
  ElMessageBox.confirm('确定要删除该学习材料吗?', '提示', {
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

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        if (formData.id) {
          // 编辑
          const index = mockData.findIndex(item => item.id === formData.id)
          if (index > -1) {
            mockData[index] = { ...formData }
          }
          ElMessage.success('编辑成功')
        } else {
          // 新增
          mockData.unshift({
            ...formData,
            id: Date.now().toString(),
            createTime: new Date().toLocaleString()
          })
          ElMessage.success('新增成功')
        }
        submitLoading.value = false
        dialogVisible.value = false
        loadData()
      }, 500)
    }
  })
}

// 发布
const handlePublish = (row: LearningMaterial) => {
  ElMessageBox.confirm('确定要发布该学习材料吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData[index].publishStatus = 'published'
      ElMessage.success('发布成功')
      loadData()
    }
  }).catch(() => {})
}

// 取消发布
const handleUnpublish = (row: LearningMaterial) => {
  ElMessageBox.confirm('确定要取消发布该学习材料吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData[index].publishStatus = 'unpublished'
      ElMessage.success('取消发布成功')
      loadData()
    }
  }).catch(() => {})
}

// 发布状态开关变化
const handlePublishStatusChange = (row: LearningMaterial) => {
  if (row.publishStatus === 'published') {
    handlePublish(row)
  } else {
    handleUnpublish(row)
  }
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: LearningMaterial[]) => {
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
.learning-material-page {
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

.content-view {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
  min-height: 200px;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
}
</style>
