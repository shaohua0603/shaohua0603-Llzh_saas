<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const route = useRoute()

const examData = ref(null)
const loading = ref(true)
const currentQuestionIndex = ref(0)
const userAnswers = ref({})
const examCompleted = ref(false)
const score = ref(0)
const isHistoryExam = ref(false)

// 模拟考试题库数据
const mockExams = [
  {
    id: 1,
    courseId: 1,
    courseTitle: '厂规厂纪培训',
    questions: [
      {
        id: 1,
        type: 'single', // 单选题
        title: '工厂的正常作息时间是？',
        options: [
          '8:00-17:00',
          '9:00-18:00',
          '10:00-19:00',
          '7:30-16:30'
        ],
        correctAnswer: '8:00-17:00'
      },
      {
        id: 2,
        type: 'multiple', // 多选题
        title: '以下哪些属于安全生产规定？（多选）',
        options: [
          '佩戴安全帽',
          '遵守操作流程',
          '随意操作设备',
          '保持车间整洁'
        ],
        correctAnswer: ['佩戴安全帽', '遵守操作流程', '保持车间整洁']
      },
      {
        id: 3,
        type: 'judgment', // 判断题
        title: '员工可以随意更改工作安排。',
        options: ['对', '错'],
        correctAnswer: '错'
      }
    ]
  },
  {
    id: 2,
    courseId: 2,
    courseTitle: '工作内容培训',
    questions: [
      {
        id: 1,
        type: 'single',
        title: '生产流程的第一步是？',
        options: [
          '原料准备',
          '生产加工',
          '质量检查',
          '包装入库'
        ],
        correctAnswer: '原料准备'
      },
      {
        id: 2,
        type: 'multiple',
        title: '操作技能包括哪些？（多选）',
        options: [
          '设备操作',
          '质量控制',
          '安全防护',
          '随意操作'
        ],
        correctAnswer: ['设备操作', '质量控制', '安全防护']
      },
      {
        id: 3,
        type: 'judgment',
        title: '质量标准是可以随意更改的。',
        options: ['对', '错'],
        correctAnswer: '错'
      }
    ]
  },
  {
    id: 3,
    courseId: 3,
    courseTitle: '安全教育培训',
    questions: [
      {
        id: 1,
        type: 'single',
        title: '消防安全的四个能力不包括？',
        options: [
          '检查消除火灾隐患能力',
          '组织扑救初起火灾能力',
          '组织人员疏散逃生能力',
          '随意使用明火能力'
        ],
        correctAnswer: '随意使用明火能力'
      },
      {
        id: 2,
        type: 'multiple',
        title: '用电安全包括哪些？（多选）',
        options: [
          '不私拉乱接电线',
          '不超负荷用电',
          '湿手操作电器',
          '定期检查电路'
        ],
        correctAnswer: ['不私拉乱接电线', '不超负荷用电', '定期检查电路']
      },
      {
        id: 3,
        type: 'judgment',
        title: '机械操作时可以不佩戴防护装备。',
        options: ['对', '错'],
        correctAnswer: '错'
      }
    ]
  }
]

// 获取当前问题
const currentQuestion = computed(() => {
  if (!examData.value || !examData.value.questions.length) return null
  return examData.value.questions[currentQuestionIndex.value]
})

// 模拟历史考试数据
const mockHistoryExams = [
  {
    id: 4,
    title: '综合知识考试',
    questions: [
      {
        id: 1,
        type: 'single',
        title: '工厂的正常作息时间是？',
        options: [
          '8:00-17:00',
          '9:00-18:00',
          '10:00-19:00',
          '7:30-16:30'
        ],
        correctAnswer: '8:00-17:00',
        userAnswer: '8:00-17:00'
      },
      {
        id: 2,
        type: 'multiple',
        title: '以下哪些属于安全生产规定？（多选）',
        options: [
          '佩戴安全帽',
          '遵守操作流程',
          '随意操作设备',
          '保持车间整洁'
        ],
        correctAnswer: ['佩戴安全帽', '遵守操作流程', '保持车间整洁'],
        userAnswer: ['佩戴安全帽', '遵守操作流程', '保持车间整洁']
      },
      {
        id: 3,
        type: 'judgment',
        title: '员工可以随意更改工作安排。',
        options: ['对', '错'],
        correctAnswer: '错',
        userAnswer: '错'
      },
      {
        id: 4,
        type: 'single',
        title: '生产流程的第一步是？',
        options: [
          '原料准备',
          '生产加工',
          '质量检查',
          '包装入库'
        ],
        correctAnswer: '原料准备',
        userAnswer: '原料准备'
      },
      {
        id: 5,
        type: 'single',
        title: '消防安全的四个能力不包括？',
        options: [
          '检查消除火灾隐患能力',
          '组织扑救初起火灾能力',
          '组织人员疏散逃生能力',
          '随意使用明火能力'
        ],
        correctAnswer: '随意使用明火能力',
        userAnswer: '随意使用明火能力'
      }
    ],
    score: 85,
    examDate: '2026-02-05'
  },
  {
    id: 5,
    title: '厂规厂纪补考',
    questions: [
      {
        id: 1,
        type: 'single',
        title: '工厂的正常作息时间是？',
        options: [
          '8:00-17:00',
          '9:00-18:00',
          '10:00-19:00',
          '7:30-16:30'
        ],
        correctAnswer: '8:00-17:00',
        userAnswer: '8:00-17:00'
      },
      {
        id: 2,
        type: 'multiple',
        title: '以下哪些属于安全生产规定？（多选）',
        options: [
          '佩戴安全帽',
          '遵守操作流程',
          '随意操作设备',
          '保持车间整洁'
        ],
        correctAnswer: ['佩戴安全帽', '遵守操作流程', '保持车间整洁'],
        userAnswer: ['佩戴安全帽', '遵守操作流程']
      },
      {
        id: 3,
        type: 'judgment',
        title: '员工可以随意更改工作安排。',
        options: ['对', '错'],
        correctAnswer: '错',
        userAnswer: '错'
      }
    ],
    score: 62,
    examDate: '2026-01-28'
  }
]

// 模拟当前考试数据
const mockCurrentExams = [
  {
    id: 1,
    title: '业务课堂综合考试',
    questions: [
      {
        id: 1,
        type: 'single',
        title: '工厂的正常作息时间是？',
        options: [
          '8:00-17:00',
          '9:00-18:00',
          '10:00-19:00',
          '7:30-16:30'
        ],
        correctAnswer: '8:00-17:00'
      },
      {
        id: 2,
        type: 'multiple',
        title: '以下哪些属于安全生产规定？（多选）',
        options: [
          '佩戴安全帽',
          '遵守操作流程',
          '随意操作设备',
          '保持车间整洁'
        ],
        correctAnswer: ['佩戴安全帽', '遵守操作流程', '保持车间整洁']
      },
      {
        id: 3,
        type: 'judgment',
        title: '员工可以随意更改工作安排。',
        options: ['对', '错'],
        correctAnswer: '错'
      },
      {
        id: 4,
        type: 'single',
        title: '生产流程的第一步是？',
        options: [
          '原料准备',
          '生产加工',
          '质量检查',
          '包装入库'
        ],
        correctAnswer: '原料准备'
      },
      {
        id: 5,
        type: 'single',
        title: '消防安全的四个能力不包括？',
        options: [
          '检查消除火灾隐患能力',
          '组织扑救初起火灾能力',
          '组织人员疏散逃生能力',
          '随意使用明火能力'
        ],
        correctAnswer: '随意使用明火能力'
      },
      // 日常培训题目
      {
        id: 6,
        type: 'single',
        title: '5S管理中的"整理"指的是？',
        options: [
          '区分必需品和非必需品，现场不放置非必需品',
          '必需品依规定定位、定方法摆放整齐有序，明确标示',
          '清除现场内的脏污、清除作业区域的物料垃圾',
          '将整理、整顿、清扫实施的做法制度化、规范化，维持其成果'
        ],
        correctAnswer: '区分必需品和非必需品，现场不放置非必需品'
      },
      {
        id: 7,
        type: 'multiple',
        title: '质量意识包括哪些内容？（多选）',
        options: [
          '质量是企业的生命线',
          '了解本岗位的质量标准和要求',
          '掌握基本的质量控制方法',
          '忽视质量问题'
        ],
        correctAnswer: ['质量是企业的生命线', '了解本岗位的质量标准和要求', '掌握基本的质量控制方法']
      },
      {
        id: 8,
        type: 'judgment',
        title: '团队合作是提高工作效率的重要因素。',
        options: ['对', '错'],
        correctAnswer: '对'
      }
    ],
    totalQuestions: 60,
    passScore: 65,
    duration: 70
  },
  {
    id: 2,
    title: '日常培训专项考试',
    questions: [
      {
        id: 1,
        type: 'single',
        title: '5S管理中的"整顿"指的是？',
        options: [
          '区分必需品和非必需品，现场不放置非必需品',
          '必需品依规定定位、定方法摆放整齐有序，明确标示',
          '清除现场内的脏污、清除作业区域的物料垃圾',
          '将整理、整顿、清扫实施的做法制度化、规范化，维持其成果'
        ],
        correctAnswer: '必需品依规定定位、定方法摆放整齐有序，明确标示'
      },
      {
        id: 2,
        type: 'single',
        title: '5S管理中的"清扫"指的是？',
        options: [
          '区分必需品和非必需品，现场不放置非必需品',
          '必需品依规定定位、定方法摆放整齐有序，明确标示',
          '清除现场内的脏污、清除作业区域的物料垃圾',
          '将整理、整顿、清扫实施的做法制度化、规范化，维持其成果'
        ],
        correctAnswer: '清除现场内的脏污、清除作业区域的物料垃圾'
      },
      {
        id: 3,
        type: 'single',
        title: '5S管理中的"清洁"指的是？',
        options: [
          '区分必需品和非必需品，现场不放置非必需品',
          '必需品依规定定位、定方法摆放整齐有序，明确标示',
          '清除现场内的脏污、清除作业区域的物料垃圾',
          '将整理、整顿、清扫实施的做法制度化、规范化，维持其成果'
        ],
        correctAnswer: '将整理、整顿、清扫实施的做法制度化、规范化，维持其成果'
      },
      {
        id: 4,
        type: 'single',
        title: '5S管理中的"素养"指的是？',
        options: [
          '区分必需品和非必需品，现场不放置非必需品',
          '必需品依规定定位、定方法摆放整齐有序，明确标示',
          '清除现场内的脏污、清除作业区域的物料垃圾',
          '人人按章操作、依规行事，养成良好的习惯'
        ],
        correctAnswer: '人人按章操作、依规行事，养成良好的习惯'
      },
      {
        id: 5,
        type: 'multiple',
        title: '有效的团队沟通包括哪些要素？（多选）',
        options: [
          '倾听',
          '表达清晰',
          '尊重他人',
          '固执己见'
        ],
        correctAnswer: ['倾听', '表达清晰', '尊重他人']
      },
      {
        id: 6,
        type: 'judgment',
        title: '质量意识只需要管理人员具备，普通员工不需要。',
        options: ['对', '错'],
        correctAnswer: '错'
      }
    ],
    totalQuestions: 30,
    passScore: 60,
    duration: 40
  }
]

// 获取考试数据
const getExamData = () => {
  loading.value = true
  try {
    const examId = parseInt(route.query.id)
    const examType = route.query.type
    
    // 判断是否是历史考试
    isHistoryExam.value = examType === 'history'
    
    let exam
    if (isHistoryExam.value) {
      // 获取历史考试数据
      exam = mockHistoryExams.find(item => item.id === examId)
      if (exam) {
        examData.value = exam
        // 设置历史考试的分数和完成状态
        score.value = exam.score
        examCompleted.value = true
        // 初始化用户答案
        exam.questions.forEach(question => {
          userAnswers.value[question.id] = question.userAnswer
        })
      }
    } else {
      // 获取当前考试数据
      exam = mockCurrentExams.find(item => item.id === examId)
      if (exam) {
        examData.value = exam
        // 初始化用户答案
        exam.questions.forEach(question => {
          userAnswers.value[question.id] = question.type === 'multiple' ? [] : ''
        })
      }
    }
    
    if (!exam) {
      ElMessage.error('考试内容不存在')
      router.push('/worker/exam-list')
    }
  } catch (error) {
    console.error('获取考试数据失败:', error)
    ElMessage.error('获取考试数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 选择答案
const selectAnswer = (option) => {
  const question = currentQuestion.value
  if (!question) return

  if (question.type === 'multiple') {
    // 多选题
    const currentAnswers = userAnswers.value[question.id] || []
    const optionIndex = currentAnswers.indexOf(option)
    if (optionIndex > -1) {
      // 取消选择
      currentAnswers.splice(optionIndex, 1)
    } else {
      // 添加选择
      currentAnswers.push(option)
    }
    userAnswers.value[question.id] = currentAnswers
  } else {
    // 单选题和判断题
    userAnswers.value[question.id] = option
  }
}

// 判断选项是否被选中
const isSelected = (option) => {
  const question = currentQuestion.value
  if (!question) return false

  const userAnswer = userAnswers.value[question.id]
  if (question.type === 'multiple') {
    return Array.isArray(userAnswer) && userAnswer.includes(option)
  } else {
    return userAnswer === option
  }
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < examData.value.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

// 上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

// 提交考试
const submitExam = () => {
  ElMessageBox.confirm('确定要提交考试吗？提交后不可修改。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 计算分数
    calculateScore()
    examCompleted.value = true
  }).catch(() => {
    // 取消提交
  })
}

// 计算分数
const calculateScore = () => {
  let totalScore = 0
  const questions = examData.value.questions
  const questionScore = 100 / questions.length

  questions.forEach(question => {
    const userAnswer = userAnswers.value[question.id]
    let isCorrect = false

    if (question.type === 'multiple') {
      // 多选题：需要全部选对
      if (Array.isArray(userAnswer) && userAnswer.length === question.correctAnswer.length) {
        isCorrect = userAnswer.every(ans => question.correctAnswer.includes(ans))
      }
    } else {
      // 单选题和判断题：答案需要完全一致
      isCorrect = userAnswer === question.correctAnswer
    }

    if (isCorrect) {
      totalScore += questionScore
    }
  })

  score.value = Math.round(totalScore)
}

// 返回培训列表
const goBackToTraining = () => {
  router.push('/worker/training')
}

// 页面加载时获取数据
onMounted(() => {
  getExamData()
})
</script>

<template>
  <div class="exam-detail">
    <BackButton />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>考试详情</h2>
    </div>
    
    <!-- 考试内容 -->
    <div class="exam-content">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="!examData" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>考试内容不存在</span>
      </div>
      <div v-else-if="examCompleted" class="exam-result">
        <div class="result-header">
          <h3>考试完成</h3>
          <el-tag :type="score >= 60 ? 'success' : 'danger'" size="large">
            {{ score >= 60 ? '通过' : '未通过' }}
          </el-tag>
        </div>
        <div class="result-body">
          <p class="course-title">培训课程: {{ examData.courseTitle }}</p>
          <div class="score-container">
            <div class="score-circle">
              <span class="score-number">{{ score }}</span>
              <span class="score-unit">分</span>
            </div>
            <p class="score-hint">{{ score >= 60 ? '恭喜您通过考试！' : '很遗憾，未通过考试，请重新学习后再考。' }}</p>
          </div>
          <div class="result-buttons">
            <el-button type="primary" @click="goBackToTraining">返回培训列表</el-button>
          </div>
        </div>
      </div>
      <div v-else class="exam-body">
        <!-- 考试信息 -->
        <div class="exam-info">
          <h3>{{ examData.courseTitle }}</h3>
          <p class="question-progress">
            第 {{ currentQuestionIndex + 1 }} 题 / 共 {{ examData.questions.length }} 题
          </p>
        </div>
        
        <!-- 问题内容 -->
        <div class="question-container">
          <div class="question-header">
            <span class="question-type">
              {{ 
                currentQuestion.type === 'single' ? '单选题' : 
                currentQuestion.type === 'multiple' ? '多选题' : '判断题' 
              }}
            </span>
            <h4>{{ currentQuestion.title }}</h4>
          </div>
          <div class="question-options">
            <div 
              v-for="(option, index) in currentQuestion.options" 
              :key="index"
              class="option-item"
              :class="{
                'selected': isSelected(option), 
                'multiple': currentQuestion.type === 'multiple',
                'correct': isHistoryExam && currentQuestion.correctAnswer === option || 
                          (isHistoryExam && Array.isArray(currentQuestion.correctAnswer) && currentQuestion.correctAnswer.includes(option)),
                'incorrect': isHistoryExam && isSelected(option) && 
                            (currentQuestion.correctAnswer !== option && 
                             (!Array.isArray(currentQuestion.correctAnswer) || !currentQuestion.correctAnswer.includes(option)))
              }"
              @click="!isHistoryExam && selectAnswer(option)"
              :style="{ cursor: isHistoryExam ? 'default' : 'pointer' }"
            >
              <div class="option-selector">
                <div v-if="currentQuestion.type === 'multiple'" class="checkbox">
                  <div v-if="isSelected(option)" class="checkbox-checked">✓</div>
                </div>
                <div v-else class="radio">
                  <div v-if="isSelected(option)" class="radio-checked"></div>
                </div>
              </div>
              <div class="option-text">{{ option }}</div>
              <div v-if="isHistoryExam" class="option-status">
                <span v-if="currentQuestion.correctAnswer === option || 
                          (Array.isArray(currentQuestion.correctAnswer) && currentQuestion.correctAnswer.includes(option))" 
                      class="status-correct">正确</span>
                <span v-else-if="isSelected(option)" 
                      class="status-incorrect">错误</span>
              </div>
            </div>
          </div>
          <div v-if="isHistoryExam" class="question-analysis">
            <div class="analysis-title">答案解析</div>
            <div class="analysis-content">
              <p><strong>正确答案：</strong>{{ Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.join('、') : currentQuestion.correctAnswer }}</p>
              <p><strong>你的答案：</strong>{{ Array.isArray(currentQuestion.userAnswer) ? currentQuestion.userAnswer.join('、') : currentQuestion.userAnswer }}</p>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="exam-actions">
          <div class="navigation-buttons">
            <el-button @click="prevQuestion" :disabled="currentQuestionIndex === 0">
              上一题
            </el-button>
            <el-button @click="nextQuestion" :disabled="currentQuestionIndex === examData.questions.length - 1">
              下一题
            </el-button>
          </div>
          <div v-if="!isHistoryExam" class="submit-button">
            <el-button type="primary" @click="submitExam">
              提交考试
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exam-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.exam-content {
  padding: 20px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.exam-body {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.exam-info {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.exam-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.question-progress {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.question-container {
  margin-bottom: 30px;
}

.question-header {
  margin-bottom: 20px;
}

.question-type {
  display: inline-block;
  padding: 4px 12px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 10px;
}

.question-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  background-color: #f0f0f0;
}

.option-item.selected {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

/* 历史考试答案样式 */
.option-item.correct {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}

.option-item.incorrect {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
}

.option-status {
  margin-left: 10px;
  flex-shrink: 0;
}

.status-correct {
  color: #52c41a;
  font-weight: bold;
  font-size: 12px;
}

.status-incorrect {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 12px;
}

/* 答案解析样式 */
.question-analysis {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
}

.analysis-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.analysis-content {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.analysis-content p {
  margin: 5px 0;
}

.option-selector {
  margin-right: 15px;
  flex-shrink: 0;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.option-item.selected .checkbox {
  background-color: #1890ff;
  border-color: #1890ff;
}

.checkbox-checked {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.radio {
  width: 18px;
  height: 18px;
  border: 2px solid #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.option-item.selected .radio {
  border-color: #1890ff;
}

.radio-checked {
  width: 10px;
  height: 10px;
  background-color: #1890ff;
  border-radius: 50%;
}

.option-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.exam-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.navigation-buttons {
  display: flex;
  gap: 10px;
}

.submit-button {
  flex-shrink: 0;
}

.exam-result {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 40px;
  text-align: center;
}

.result-header {
  margin-bottom: 30px;
}

.result-header h3 {
  margin: 0 0 15px 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.result-body {
  max-width: 500px;
  margin: 0 auto;
}

.course-title {
  margin: 0 0 30px 0;
  font-size: 16px;
  color: #666;
}

.score-container {
  margin-bottom: 40px;
}

.score-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.score-number {
  font-size: 48px;
  font-weight: bold;
  color: white;
  line-height: 1;
}

.score-unit {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-left: 5px;
}

.score-hint {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.result-buttons {
  margin-top: 30px;
}

.result-buttons .el-button {
  min-width: 120px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .exam-content {
    padding: 10px;
  }
  
  .exam-body {
    padding: 15px;
  }
  
  .exam-info h3 {
    font-size: 16px;
  }
  
  .question-header h4 {
    font-size: 15px;
  }
  
  .option-item {
    padding: 12px;
  }
  
  .exam-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .navigation-buttons {
    justify-content: space-between;
  }
  
  .submit-button {
    width: 100%;
  }
  
  .exam-result {
    padding: 20px;
  }
  
  .result-header h3 {
    font-size: 20px;
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
  }
  
  .score-number {
    font-size: 36px;
  }
  
  .score-unit {
    font-size: 18px;
  }
}
</style>