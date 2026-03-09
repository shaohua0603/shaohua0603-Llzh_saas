<!-- 考试管理详情页面 -->
<template>
  <div class="exam-detail-container">
    <div class="detail-content">
      <el-card shadow="hover">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
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
  totalTime: number
  totalQuestions: number
  startTime: string
  endTime: string
  questions: ExamQuestion[]
  publishStatus: 'published' | 'unpublished'
  createTime: string
}

const router = useRouter()
const route = useRoute()
const currentRow = ref<ExamRecord | null>(null)

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
  const id = route.params.id as string
  if (id) {
    const exam = mockData.find(item => item.id === id)
    if (exam) {
      currentRow.value = exam
    }
  }
}

// 编辑
const handleEdit = () => {
  if (currentRow.value) {
    router.push(`/tenant/on-duty/exam/form/${currentRow.value.id}`)
  }
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
.exam-detail-container {
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
}
</style>