<!-- 考试管理表单页面 -->
<template>
  <div class="exam-form-container">
    <div class="form-content">
      <el-card shadow="hover">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="考卷名称" prop="examName">
                <el-input v-model="formData.examName" placeholder="请输入考卷名称" style="width: 40%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="总分数" prop="totalScore" label-width="120px">
                <el-input-number v-model="formData.totalScore" :min="1" :max="200" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考试通过分数" prop="passScore" label-width="120px">
                <el-input-number v-model="formData.passScore" :min="1" :max="200" style="width: 150px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="总时长" prop="totalTime" label-width="120px">
                <div style="display: flex; align-items: center; gap: 8px">
                  <el-input-number v-model="formData.totalTime" :min="1" :max="180" style="width: 150px" />
                  <span>分钟</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总题数" prop="totalQuestions" label-width="120px">
                <el-input-number v-model="formData.totalQuestions" :min="0" :max="100" style="width: 150px" disabled />
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
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
        <el-icon><Check /></el-icon>
        保存
      </el-button>
    </div>
  </div>

    <!-- 从题库选择题目弹窗 -->
    <el-dialog
      v-model="questionBankDialogVisible"
      title="从题库选择题目"
      width="80%"
    >
      <div class="question-bank-dialog">
        <!-- 搜索筛选 -->
        <el-form inline :model="questionBankSearchForm" class="search-form">
          <el-form-item label="题干">
            <el-input v-model="questionBankSearchForm.question" placeholder="请输入题干" clearable style="width: 300px" />
          </el-form-item>
          <el-form-item label="答题类型">
            <el-select v-model="questionBankSearchForm.answerType" placeholder="请选择" clearable style="width: 150px">
              <el-option label="全部" value="" />
              <el-option label="单选题" value="single" />
              <el-option label="多选题" value="multiple" />
              <el-option label="判断题" value="true_false" />
              <el-option label="填空题" value="fill" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuestionBankSearch">搜索</el-button>
            <el-button @click="handleQuestionBankReset">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 题库列表 -->
        <el-table
          v-loading="questionBankLoading"
          :data="questionBankTableData"
          border
          style="width: 100%; margin-top: 16px"
          @selection-change="handleQuestionBankSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="questionType" label="题库类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getQuestionTypeTag(row.questionType)">
                {{ getQuestionTypeText(row.questionType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="answerType" label="答题类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getAnswerTypeTag(row.answerType)">
                {{ getAnswerTypeText(row.answerType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="question" label="题干" min-width="400">
            <template #default="{ row }">
              <el-text truncated style="max-width: 400px">{{ row.question }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="分值" width="80" />
          <el-table-column prop="publishStatus" label="发布状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.publishStatus === 'published' ? 'success' : 'info'">
                {{ row.publishStatus === 'published' ? '已发布' : '未发布' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 16px">
          <el-pagination
            v-model:current-page="questionBankCurrentPage"
            v-model:page-size="questionBankPageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="questionBankTotal"
            @size-change="handleQuestionBankSizeChange"
            @current-change="handleQuestionBankCurrentChange"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="questionBankDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmQuestionSelection">确认选择</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowLeft, Check, Plus } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

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
  passScore: number
  totalTime: number
  totalQuestions: number
  startTime: string
  endTime: string
  questions: ExamQuestion[]
  publishStatus: 'published' | 'unpublished'
  createTime: string
}

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

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const formData = reactive<ExamRecord>({
  id: '',
  examName: '',
  totalScore: 100,
  passScore: 60,
  totalTime: 60,
  totalQuestions: 0,
  startTime: '',
  endTime: '',
  questions: [],
  publishStatus: 'unpublished',
  createTime: ''
})

const formRules: FormRules = {
  examName: [{ required: true, message: '请输入考卷名称', trigger: 'blur' }],
  totalScore: [{ required: true, message: '请输入总分数', trigger: 'blur' }],
  passScore: [{ required: true, message: '请输入通过分值', trigger: 'blur' }],
  totalTime: [{ required: true, message: '请输入总时长', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择报考开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择报考结束时间', trigger: 'change' }]
}

// 题库弹窗相关数据
const questionBankDialogVisible = ref(false)
const questionBankLoading = ref(false)
const questionBankTableData = ref<QuestionBank[]>([])
const questionBankTotal = ref(0)
const questionBankCurrentPage = ref(1)
const questionBankPageSize = ref(10)
const questionBankSelectedRows = ref<QuestionBank[]>([])
const questionBankSearchForm = reactive({
  question: '',
  answerType: ''
})

// Mock数据
const mockData: ExamRecord[] = [
  {
    id: '1',
    examName: '安全生产知识测试',
    totalScore: 100,
    passScore: 60,
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
    passScore: 60,
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
    passScore: 48,
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

// 题库Mock数据
const questionBankMockData: QuestionBank[] = [
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
  },
  {
    id: '6',
    questionType: 'daily',
    answerType: 'multiple',
    question: '以下哪些是火灾逃生的正确方法？',
    content: '<p>A. 用湿毛巾捂住口鼻</p><p>B. 乘坐电梯逃生</p><p>C. 低姿匍匐前进</p><p>D. 跳楼逃生</p>',
    correctAnswer: 'A,C',
    score: 5,
    analysis: '火灾逃生时应使用湿毛巾捂住口鼻，低姿匍匐前进，避免乘坐电梯和跳楼。',
    publishStatus: 'published',
    createTime: '2024-02-15 14:00:00'
  },
  {
    id: '7',
    questionType: 'pre_job',
    answerType: 'true_false',
    question: '在工作场所吸烟是安全的。',
    content: '<p>正确</p><p>错误</p>',
    correctAnswer: '错误',
    score: 3,
    analysis: '在工作场所吸烟可能引发火灾，是不安全的行为。',
    publishStatus: 'published',
    createTime: '2024-02-20 09:00:00'
  },
  {
    id: '8',
    questionType: 'pre_job',
    answerType: 'fill',
    question: '安全生产的方针是：安全第一、___、综合治理。',
    content: '',
    correctAnswer: '预防为主',
    score: 8,
    analysis: '安全生产的方针是：安全第一、预防为主、综合治理。',
    publishStatus: 'published',
    createTime: '2024-02-25 10:00:00'
  }
]

// 加载数据
const loadData = () => {
  const id = route.params.id as string
  if (id) {
    const exam = mockData.find(item => item.id === id)
    if (exam) {
      Object.assign(formData, JSON.parse(JSON.stringify(exam)))
    }
  }
}

// 添加题目
const handleAddQuestion = () => {
  // 打开题库选择弹窗
  questionBankDialogVisible.value = true
  // 加载题库数据
  loadQuestionBankData()
}

// 加载题库数据
const loadQuestionBankData = () => {
  questionBankLoading.value = true
  setTimeout(() => {
    let filteredData = [...questionBankMockData]

    // 筛选
    if (questionBankSearchForm.question) {
      filteredData = filteredData.filter(item => item.question.includes(questionBankSearchForm.question))
    }
    if (questionBankSearchForm.answerType) {
      filteredData = filteredData.filter(item => item.answerType === questionBankSearchForm.answerType)
    }

    questionBankTotal.value = filteredData.length
    // 分页
    const start = (questionBankCurrentPage.value - 1) * questionBankPageSize.value
    questionBankTableData.value = filteredData.slice(start, start + questionBankPageSize.value)
    questionBankLoading.value = false
  }, 300)
}

// 题库搜索
const handleQuestionBankSearch = () => {
  questionBankCurrentPage.value = 1
  loadQuestionBankData()
}

// 题库重置
const handleQuestionBankReset = () => {
  questionBankSearchForm.question = ''
  questionBankSearchForm.answerType = ''
  handleQuestionBankSearch()
}

// 题库分页变化
const handleQuestionBankSizeChange = (size: number) => {
  questionBankPageSize.value = size
  loadQuestionBankData()
}

const handleQuestionBankCurrentChange = (page: number) => {
  questionBankCurrentPage.value = page
  loadQuestionBankData()
}

// 题库选择变化
const handleQuestionBankSelectionChange = (selection: QuestionBank[]) => {
  questionBankSelectedRows.value = selection
}

// 确认选择题目
const handleConfirmQuestionSelection = () => {
  if (questionBankSelectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一道题目')
    return
  }

  // 将选择的题目添加到考试表单
  questionBankSelectedRows.value.forEach(question => {
    formData.questions.push({
      questionType: question.answerType,
      answerType: question.answerType,
      question: question.question,
      score: question.score
    })
  })

  // 更新总题数
  formData.totalQuestions = formData.questions.length

  // 关闭弹窗
  questionBankDialogVisible.value = false
  ElMessage.success(`成功添加 ${questionBankSelectedRows.value.length} 道题目`)
}

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
        router.push('/tenant/on-duty/exam')
      }, 500)
    }
  })
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/exam')
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.exam-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.form-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
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

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .form-footer {
    left: 0;
    flex-direction: column;
  }
  
  .form-footer .el-button {
    width: 100%;
  }
  
  .form-content {
    padding-bottom: 120px;
  }
}
</style>