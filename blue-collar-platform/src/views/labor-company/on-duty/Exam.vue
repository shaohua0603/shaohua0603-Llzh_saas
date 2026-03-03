<!-- 考试管理页面 -->
<template>
  <div class="exam-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="考卷名称">
          <el-input v-model="searchForm.examName" placeholder="请输入考卷名称" clearable style="width: 200px" />
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
          <el-button type="text" @click="toggleFilter" class="expand-toggle">
            <el-icon :class="{ 'rotate': filterExpanded }"><ArrowDown /></el-icon>
            <span>{{ filterExpanded ? '收起' : '展开' }}</span>
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 展开显示的更多查询条件 -->
      <div v-if="filterExpanded" class="filter-content expanded">
        <el-form inline :model="searchForm" class="search-form">
          <el-form-item label="发布状态">
            <el-select v-model="searchForm.publishStatus" placeholder="请选择" clearable style="width: 150px">
              <el-option label="全部" value="" />
              <el-option label="已发布" value="published" />
              <el-option label="未发布" value="unpublished" />
            </el-select>
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
      :showSelection="true"
      :showIndex="true"
      :showActions="true"
      action-column-width="200"
      :stats-info="statsInfo"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #column-totalScore="{ row }">
        {{ row.totalScore }}分
      </template>
      <template #column-totalTime="{ row }">
        {{ row.totalTime }}分钟
      </template>
      <template #column-totalQuestions="{ row }">
        {{ row.totalQuestions }}道
      </template>
      <template #column-publishStatus="{ row }">
        <el-tag :type="row.publishStatus === 'published' ? 'success' : 'info'">
          {{ row.publishStatus === 'published' ? '已发布' : '未发布' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">
          <el-icon><View /></el-icon>
          详情
        </el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
        <el-button link type="success" size="small" v-if="row.publishStatus === 'unpublished'" @click="handlePublish(row)">
          <el-icon><Check /></el-icon>
          发布
        </el-button>
        <el-button link type="warning" size="small" v-else @click="handleUnpublish(row)">
          <el-icon><Close /></el-icon>
          取消发布
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="考卷名称" prop="examName">
              <el-input v-model="formData.examName" placeholder="请输入考卷名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总分数" prop="totalScore">
              <el-input-number v-model="formData.totalScore" :min="1" :max="200" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总时长(分钟)" prop="totalTime">
              <el-input-number v-model="formData.totalTime" :min="1" :max="180" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报考开始时间" prop="startTime">
              <el-date-picker
                v-model="formData.startTime"
                type="datetime"
                placeholder="选择报考开始时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报考结束时间" prop="endTime">
              <el-date-picker
                v-model="formData.endTime"
                type="datetime"
                placeholder="选择报考结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">试卷题目</el-divider>
        <div class="questions-section">
          <div class="questions-header">
            <el-button type="primary" size="small" @click="handleAddQuestion">
              <el-icon><Plus /></el-icon>
              添加题目
            </el-button>
            <el-button type="success" size="small" @click="handleDistributeScore">
              <el-icon><Plus /></el-icon>
              平均分配分数
            </el-button>
          </div>
          <el-table :data="formData.questions" border style="width: 100%; margin-top: 10px">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="questionType" label="题目类型" width="100">
              <template #default="{ row }">
                <el-select v-model="row.questionType" placeholder="请选择" size="small">
                  <el-option label="单选题" value="single" />
                  <el-option label="多选题" value="multiple" />
                  <el-option label="判断题" value="true_false" />
                  <el-option label="填空题" value="fill" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="answerType" label="答题类型" width="100">
              <template #default="{ row }">
                <el-select v-model="row.answerType" placeholder="请选择" size="small">
                  <el-option label="单选题" value="single" />
                  <el-option label="多选题" value="multiple" />
                  <el-option label="判断题" value="true_false" />
                  <el-option label="填空题" value="fill" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="question" label="题干" min-width="200">
              <template #default="{ row }">
                <el-input v-model="row.question" placeholder="请输入题干" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="score" label="分数" width="80">
              <template #default="{ row }">
                <el-input-number v-model="row.score" :min="1" :max="100" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="handleRemoveQuestion($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="考试详情" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="考卷名称">{{ currentRow?.examName }}</el-descriptions-item>
        <el-descriptions-item label="总分数">{{ currentRow?.totalScore }}分</el-descriptions-item>
        <el-descriptions-item label="总时长">{{ currentRow?.totalTime }}分钟</el-descriptions-item>
        <el-descriptions-item label="总题数">{{ currentRow?.totalQuestions }}道</el-descriptions-item>
        <el-descriptions-item label="报考开始时间">{{ currentRow?.startTime }}</el-descriptions-item>
        <el-descriptions-item label="报考结束时间">{{ currentRow?.endTime }}</el-descriptions-item>
        <el-descriptions-item label="发布状态">
          <el-tag :type="currentRow?.publishStatus === 'published' ? 'success' : 'info'">
            {{ currentRow?.publishStatus === 'published' ? '已发布' : '未发布' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">试卷题目</el-divider>
      <el-table :data="currentRow?.questions || []" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="questionType" label="题目类型" width="100">
          <template #default="{ row }">
            {{ getQuestionTypeText(row.questionType) }}
          </template>
        </el-table-column>
        <el-table-column prop="answerType" label="答题类型" width="100">
          <template #default="{ row }">
            {{ getAnswerTypeText(row.answerType) }}
          </template>
        </el-table-column>
        <el-table-column prop="question" label="题干" min-width="200" show-overflow-tooltip />
        <el-table-column prop="score" label="分数" width="80" />
      </el-table>
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
import { Plus, Delete, ArrowDown, Search, Refresh, View, Edit, Check, Close } from '@element-plus/icons-vue'

// 类型定义
interface ExamQuestion {
  questionType: 'single' | 'multiple' | 'true_false' | 'fill'
  answerType: 'single' | 'multiple' | 'true_false' | 'fill'
  question: string
  score: number
}

interface ExamRecord {
  id: string
  examName: string
  totalScore: number
  totalTime: number
  totalQuestions: number
  startTime: string
  endTime: string
  questions: ExamQuestion[]
  publishStatus: 'published' | 'unpublished'
  createTime: string
}

// 表格列配置
const columns = [
  { prop: 'examName', label: '考卷名称', minWidth: 200, sortable: true },
  { prop: 'totalScore', label: '总分数', minWidth: 100, sortable: true },
  { prop: 'totalTime', label: '总时长', minWidth: 100, sortable: true },
  { prop: 'totalQuestions', label: '总题数', minWidth: 100, sortable: true },
  { prop: 'startTime', label: '报考开始时间', minWidth: 160 },
  { prop: 'endTime', label: '报考结束时间', minWidth: 160 },
  { prop: 'publishStatus', label: '发布状态', minWidth: 100 }
]

// 响应式数据
const tableData = ref<ExamRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<ExamRecord[]>([])
const dialogVisible = ref(false)
const detailVisible = ref(false)
const submitLoading = ref(false)
const dialogTitle = ref('新增考试')
const currentRow = ref<ExamRecord | null>(null)
const filterExpanded = ref(false)
const statsInfo = ref<Array<{ label: string; value: string }>>([])
const tableRef = ref<InstanceType<typeof CommonTable> | null>(null)

const searchForm = reactive({
  examName: '',
  publishStatus: ''
})

const formData = reactive<ExamRecord>({
  id: '',
  examName: '',
  totalScore: 100,
  totalTime: 60,
  totalQuestions: 0,
  startTime: '',
  endTime: '',
  questions: [],
  publishStatus: 'unpublished',
  createTime: ''
})

const formRef = ref<FormInstance>()

const formRules: FormRules = {
  examName: [{ required: true, message: '请输入考卷名称', trigger: 'blur' }],
  totalScore: [{ required: true, message: '请输入总分数', trigger: 'blur' }],
  totalTime: [{ required: true, message: '请输入总时长', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择报考开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择报考结束时间', trigger: 'change' }]
}

// Mock数据
const mockData: ExamRecord[] = [
  {
    id: '1',
    examName: '安全生产知识测试',
    totalScore: 100,
    totalTime: 60,
    totalQuestions: 20,
    startTime: '2024-02-01 00:00:00',
    endTime: '2024-02-28 23:59:59',
    questions: [
      { questionType: 'single', answerType: 'single', question: '安全生产中的"三违"是指什么？', score: 5 },
      { questionType: 'multiple', answerType: 'multiple', question: '以下哪些属于个人防护用品？', score: 5 },
      { questionType: 'true_false', answerType: 'true_false', question: '发现火灾时，应该首先拨打119报警。', score: 3 }
    ],
    publishStatus: 'published',
    createTime: '2024-01-15 10:00:00'
  },
  {
    id: '2',
    examName: '岗位技能考核',
    totalScore: 100,
    totalTime: 90,
    totalQuestions: 25,
    startTime: '2024-02-10 00:00:00',
    endTime: '2024-02-20 23:59:59',
    questions: [
      { questionType: 'single', answerType: 'single', question: '岗位操作规程的第一步是什么？', score: 4 },
      { questionType: 'fill', answerType: 'fill', question: '设备维护的"三懂"是懂原理、懂性能、懂___。', score: 10 }
    ],
    publishStatus: 'unpublished',
    createTime: '2024-01-20 14:30:00'
  },
  {
    id: '3',
    examName: '职业健康培训测试',
    totalScore: 80,
    totalTime: 45,
    totalQuestions: 15,
    startTime: '2024-02-05 00:00:00',
    endTime: '2024-02-15 23:59:59',
    questions: [
      { questionType: 'single', answerType: 'single', question: '职业病危害因素包括哪些？', score: 5 },
      { questionType: 'multiple', answerType: 'multiple', question: '个人防护用品的正确使用方法？', score: 5 }
    ],
    publishStatus: 'published',
    createTime: '2024-02-01 09:00:00'
  }
]

// 获取题目类型文本
const getQuestionTypeText = (type: string) => {
  const map: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    true_false: '判断题',
    fill: '填空题'
  }
  return map[type] || type
}

// 获取答题类型文本
const getAnswerTypeText = (type: string) => {
  const map: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    true_false: '判断题',
    fill: '填空题'
  }
  return map[type] || type
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let filteredData = [...mockData]

    // 筛选
    if (searchForm.examName) {
      filteredData = filteredData.filter(item => item.examName.includes(searchForm.examName))
    }
    if (searchForm.publishStatus) {
      filteredData = filteredData.filter(item => item.publishStatus === searchForm.publishStatus)
    }

    total.value = filteredData.length
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filteredData.slice(start, start + pageSize.value)
    
    // 计算统计信息
    const publishedCount = mockData.filter(item => item.publishStatus === 'published').length
    const totalExams = mockData.length
    statsInfo.value = [
      { label: '考试总数', value: totalExams.toString() },
      { label: '已发布', value: publishedCount.toString() },
      { label: '未发布', value: (totalExams - publishedCount).toString() }
    ]
    
    loading.value = false
  }, 500)
}

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

// 发布
const handlePublish = (row: ExamRecord) => {
  if (row.publishStatus === 'published') return
  ElMessageBox.confirm('确定要发布该考试吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    row.publishStatus = 'published'
    ElMessage.success('发布成功')
    loadData()
  }).catch(() => {})
}

// 取消发布
const handleUnpublish = (row: ExamRecord) => {
  if (row.publishStatus === 'unpublished') return
  ElMessageBox.confirm('确定要取消发布该考试吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.publishStatus = 'unpublished'
    ElMessage.success('取消发布成功')
    loadData()
  }).catch(() => {})
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.examName = ''
  searchForm.publishStatus = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增考试'
  Object.assign(formData, {
    id: '',
    examName: '',
    totalScore: 100,
    totalTime: 60,
    totalQuestions: 0,
    startTime: '',
    endTime: '',
    questions: [],
    publishStatus: 'unpublished',
    createTime: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ExamRecord) => {
  dialogTitle.value = '编辑考试'
  Object.assign(formData, JSON.parse(JSON.stringify(row)))
  dialogVisible.value = true
}

// 详情
const handleDetail = (row: ExamRecord) => {
  currentRow.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = (row: ExamRecord) => {
  ElMessageBox.confirm('确定要删除该考试记录吗?', '提示', {
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

// 添加题目
const handleAddQuestion = () => {
  formData.questions.push({
    questionType: 'single',
    answerType: 'single',
    question: '',
    score: 5
  })
  formData.totalQuestions = formData.questions.length
}

// 删除题目
const handleRemoveQuestion = (index: number) => {
  formData.questions.splice(index, 1)
  formData.totalQuestions = formData.questions.length
}

// 平均分配分数
const handleDistributeScore = () => {
  if (formData.questions.length === 0) {
    ElMessage.warning('请先添加题目')
    return
  }
  const avgScore = Math.floor(formData.totalScore / formData.questions.length)
  formData.questions.forEach(q => {
    q.score = avgScore
  })
  ElMessage.success('分数已平均分配')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // 更新总题数
      formData.totalQuestions = formData.questions.length
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

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: ExamRecord[]) => {
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
.exam-page {
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

.questions-section {
  margin-top: 10px;
}

.questions-header {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

:deep(.el-icon) {
  transition: transform 0.3s ease;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .filter-footer .el-button {
    width: 100%;
  }
}
</style>
