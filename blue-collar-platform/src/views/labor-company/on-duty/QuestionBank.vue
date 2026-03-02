<!-- 题库管理页面 -->
<template>
  <div class="question-bank-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="题干">
          <el-input v-model="searchForm.question" placeholder="请输入题干" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="题库类型">
          <el-select v-model="searchForm.questionType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="岗前培训" value="pre_job" />
            <el-option label="日常培训" value="daily" />
          </el-select>
        </el-form-item>
        <el-form-item label="答题类型">
          <el-select v-model="searchForm.answerType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="true_false" />
            <el-option label="填空题" value="fill" />
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
      action-column-width="200"
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

      <template #column-questionType="{ row }">
        <el-tag :type="getQuestionTypeTag(row.questionType)">
          {{ getQuestionTypeText(row.questionType) }}
        </el-tag>
      </template>
      <template #column-answerType="{ row }">
        <el-tag :type="getAnswerTypeTag(row.answerType)">
          {{ getAnswerTypeText(row.answerType) }}
        </el-tag>
      </template>
      <template #column-question="{ row }">
        <el-text truncated style="max-width: 300px">{{ row.question }}</el-text>
      </template>
      <template #column-publishStatus="{ row }">
        <el-switch
          v-model="row.publishStatus"
          active-value="published"
          inactive-value="unpublished"
          @change="handlePublishStatusChange(row)"
        />
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
            <el-form-item label="题库类型" prop="questionType">
              <el-select v-model="formData.questionType" placeholder="请选择题库类型" style="width: 100%">
                <el-option label="岗前培训" value="pre_job" />
                <el-option label="日常培训" value="daily" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="答题类型" prop="answerType">
              <el-select v-model="formData.answerType" placeholder="请选择答题类型" style="width: 100%">
                <el-option label="单选题" value="single" />
                <el-option label="多选题" value="multiple" />
                <el-option label="判断题" value="true_false" />
                <el-option label="填空题" value="fill" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="题干" prop="question">
          <el-input v-model="formData.question" type="textarea" :rows="3" placeholder="请输入题干" />
        </el-form-item>
        <el-form-item label="题库内容" prop="content">
          <RichTextEditor v-model="formData.content" placeholder="请输入题库内容（如选项等）" />
        </el-form-item>
        <el-form-item label="正确答案" prop="correctAnswer">
          <el-input v-model="formData.correctAnswer" type="textarea" :rows="2" placeholder="请输入正确答案，多个答案用逗号分隔" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分值" prop="score">
              <el-input-number v-model="formData.score" :min="1" :max="100" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="解析" prop="analysis">
              <el-input v-model="formData.analysis" type="textarea" :rows="2" placeholder="请输入解析" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="题库详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="题库类型">
          <el-tag :type="getQuestionTypeTag(currentRow?.questionType)">
            {{ getQuestionTypeText(currentRow?.questionType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="答题类型">
          <el-tag :type="getAnswerTypeTag(currentRow?.answerType)">
            {{ getAnswerTypeText(currentRow?.answerType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="分值">{{ currentRow?.score }}分</el-descriptions-item>
        <el-descriptions-item label="发布状态">
          <el-tag :type="currentRow?.publishStatus === 'published' ? 'success' : 'info'">
            {{ currentRow?.publishStatus === 'published' ? '已发布' : '未发布' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="题干" :span="2">{{ currentRow?.question }}</el-descriptions-item>
        <el-descriptions-item label="正确答案" :span="2">{{ currentRow?.correctAnswer }}</el-descriptions-item>
        <el-descriptions-item label="解析" :span="2">{{ currentRow?.analysis || '无' }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">题库内容</el-divider>
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
interface QuestionBank {
  id: string
  questionType: 'pre_job' | 'daily'
  answerType: 'single' | 'multiple' | 'true_false' | 'fill'
  question: string
  content: string
  correctAnswer: string
  score: number
  analysis: string
  publishStatus: 'published' | 'unpublished'
  createTime: string
}

// 表格列配置
const columns = [
  { prop: 'question', label: '题干', minWidth: 300 },
  { prop: 'questionType', label: '题库类型', minWidth: 120, sortable: true },
  { prop: 'answerType', label: '答题类型', minWidth: 100, sortable: true },
  { prop: 'score', label: '分值', minWidth: 80, sortable: true },
  { prop: 'publishStatus', label: '发布状态', minWidth: 100, sortable: true },
  { prop: 'createTime', label: '创建时间', minWidth: 160, sortable: true }
]

// 响应式数据
const tableData = ref<QuestionBank[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<QuestionBank[]>([])
const dialogVisible = ref(false)
const detailVisible = ref(false)
const submitLoading = ref(false)
const dialogTitle = ref('新增题库')
const currentRow = ref<QuestionBank | null>(null)

const searchForm = reactive({
  question: '',
  questionType: '',
  answerType: ''
})

const formData = reactive<QuestionBank>({
  id: '',
  questionType: 'pre_job',
  answerType: 'single',
  question: '',
  content: '',
  correctAnswer: '',
  score: 5,
  analysis: '',
  publishStatus: 'unpublished',
  createTime: ''
})

const formRef = ref<FormInstance>()

const formRules: FormRules = {
  questionType: [{ required: true, message: '请选择题库类型', trigger: 'change' }],
  answerType: [{ required: true, message: '请选择答题类型', trigger: 'change' }],
  question: [{ required: true, message: '请输入题干', trigger: 'blur' }],
  correctAnswer: [{ required: true, message: '请输入正确答案', trigger: 'blur' }],
  score: [{ required: true, message: '请输入分值', trigger: 'blur' }]
}

// Mock数据
const mockData: QuestionBank[] = [
  {
    id: '1',
    questionType: 'pre_job',
    answerType: 'single',
    question: '安全生产中的"三违"是指什么？',
    content: '<p>A. 违章指挥、违章操作、违反劳动纪律</p><p>B. 违章作业、违反规定、违反制度</p><p>C. 违法、违规、违纪</p><p>D. 违规操作、违章建设、违抗命令</p>',
    correctAnswer: 'A',
    score: 5,
    analysis: '"三违"是指违章指挥、违章操作、违反劳动纪律，是安全生产中的常见违规行为。',
    publishStatus: 'published',
    createTime: '2024-01-15 10:00:00'
  },
  {
    id: '2',
    questionType: 'pre_job',
    answerType: 'multiple',
    question: '以下哪些属于个人防护用品？',
    content: '<p>A. 安全帽</p><p>B. 防护手套</p><p>C. 工作服</p><p>D. 防护眼镜</p>',
    correctAnswer: 'A,B,D',
    score: 5,
    analysis: '个人防护用品包括安全帽、防护手套、防护眼镜、安全鞋等，工作服属于一般工作服装。',
    publishStatus: 'published',
    createTime: '2024-01-20 14:30:00'
  },
  {
    id: '3',
    questionType: 'daily',
    answerType: 'true_false',
    question: '发现火灾时，应该首先拨打119报警。',
    content: '<p>正确</p><p>错误</p>',
    correctAnswer: '正确',
    score: 3,
    analysis: '发现火灾时应首先拨打119报警，同时尽量扑灭初期火灾。',
    publishStatus: 'published',
    createTime: '2024-02-01 09:00:00'
  },
  {
    id: '4',
    questionType: 'pre_job',
    answerType: 'fill',
    question: '安全操作规程的"四懂"包括：懂原理、懂性能、懂___、懂___。',
    content: '',
    correctAnswer: '懂结构、懂工艺',
    score: 10,
    analysis: '安全操作规程的"四懂"是懂原理、懂性能、懂结构、懂工艺。',
    publishStatus: 'unpublished',
    createTime: '2024-02-05 16:00:00'
  },
  {
    id: '5',
    questionType: 'daily',
    answerType: 'single',
    question: '下列哪种灭火器适用于电气火灾？',
    content: '<p>A. 泡沫灭火器</p><p>B. 干粉灭火器</p><p>C. 水基型灭火器</p><p>D. 清水灭火器</p>',
    correctAnswer: 'B',
    score: 5,
    analysis: '干粉灭火器适用于电气火灾，泡沫和水基型灭火器可能引起触电危险。',
    publishStatus: 'published',
    createTime: '2024-02-10 11:00:00'
  }
]

// 获取题库类型标签
const getQuestionTypeTag = (type: string) => {
  const map: Record<string, string> = {
    pre_job: 'success',
    daily: 'primary'
  }
  return map[type] || 'info'
}

// 获取题库类型文本
const getQuestionTypeText = (type: string) => {
  const map: Record<string, string> = {
    pre_job: '岗前培训',
    daily: '日常培训'
  }
  return map[type] || type
}

// 获取答题类型标签
const getAnswerTypeTag = (type: string) => {
  const map: Record<string, string> = {
    single: 'primary',
    multiple: 'success',
    true_false: 'warning',
    fill: 'info'
  }
  return map[type] || 'info'
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
    if (searchForm.question) {
      filteredData = filteredData.filter(item => item.question.includes(searchForm.question))
    }
    if (searchForm.questionType) {
      filteredData = filteredData.filter(item => item.questionType === searchForm.questionType)
    }
    if (searchForm.answerType) {
      filteredData = filteredData.filter(item => item.answerType === searchForm.answerType)
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
  searchForm.question = ''
  searchForm.questionType = ''
  searchForm.answerType = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增题库'
  Object.assign(formData, {
    id: '',
    questionType: 'pre_job',
    answerType: 'single',
    question: '',
    content: '',
    correctAnswer: '',
    score: 5,
    analysis: '',
    publishStatus: 'unpublished',
    createTime: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: QuestionBank) => {
  dialogTitle.value = '编辑题库'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 详情
const handleDetail = (row: QuestionBank) => {
  currentRow.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = (row: QuestionBank) => {
  ElMessageBox.confirm('确定要删除该题库吗?', '提示', {
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
const handlePublish = (row: QuestionBank) => {
  ElMessageBox.confirm('确定要发布该题库吗?', '提示', {
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
const handleUnpublish = (row: QuestionBank) => {
  ElMessageBox.confirm('确定要取消发布该题库吗?', '提示', {
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
const handlePublishStatusChange = (row: QuestionBank) => {
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
const handleSelectionChange = (selection: QuestionBank[]) => {
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
.question-bank-page {
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
  min-height: 150px;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
}
</style>
