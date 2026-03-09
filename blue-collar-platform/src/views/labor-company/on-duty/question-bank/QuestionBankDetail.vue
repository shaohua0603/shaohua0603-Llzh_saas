<!-- 题库详情页面 -->
<template>
  <div class="question-bank-detail">
    <div class="detail-container">
      <!-- 内容区域 -->
      <div class="detail-content">
        <el-card shadow="hover">
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
        </el-card>
      </div>
      
      <!-- 底部按钮栏 -->
      <div class="detail-footer">
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

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

const router = useRouter()
const route = useRoute()

// 响应式数据
const currentRow = ref<QuestionBank | null>(null)

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
  const id = route.params.id as string
  if (id) {
    const item = mockData.find(item => item.id === id)
    if (item) {
      currentRow.value = item
    }
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/question-bank')
}

// 编辑
const handleEdit = () => {
  const id = route.params.id as string
  if (id) {
    router.push(`/tenant/on-duty/question-bank/form/${id}`)
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.question-bank-detail {
  width: 100%;
  height: 100%;
}

.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.detail-footer {
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

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
  
  .detail-content {
    padding-bottom: 120px;
  }
  
  .content-view {
    padding: 12px;
  }
}
</style>