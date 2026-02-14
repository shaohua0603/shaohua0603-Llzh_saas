<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElIcon } from 'element-plus'
import BackButton from '../../components/BackButton.vue'
import { Reading, Operation, Document } from '@element-plus/icons-vue'

interface Todo {
  id: number
  title: string
  content: string
  status: 'pending' | 'processing' | 'completed'
  deadline?: string
  submitDate?: string
  type: string
  createTime: string
}

const route = useRoute()
const router = useRouter()
const todo = ref<Todo | null>(null)
const loading = ref(true)
const surveyAnswers = ref({
  question1: '',
  question2: '',
  question3: '',
  question4: '',
  question5: '',
  suggestion: ''
})

// 模拟待办事项数据
const mockTodos = [
  {
    id: 1,
    title: '完成业务课堂',
    content: '请在3天内完成富士康科技集团的业务课堂课程',
    status: 'pending' as const,
    deadline: '2026-01-30',
    type: 'training',
    createTime: '2026-01-20 10:00:00'
  },
  {
    id: 2,
    title: '提交请假申请',
    content: '您的请假申请需要劳务公司审核，请耐心等待',
    status: 'processing' as const,
    submitDate: '2026-01-25',
    type: 'leave',
    createTime: '2026-01-25 09:00:00'
  },
  {
    id: 3,
    title: '填写工作满意度调查',
    content: '请在2月15日前完成工作满意度调查',
    status: 'pending' as const,
    deadline: '2026-02-15',
    type: 'survey',
    createTime: '2026-02-01 10:00:00'
  }
]

// 获取待办事项详情
const getTodoDetail = async () => {
  loading.value = true
  try {
    const todoId = parseInt(route.params.id as string)
    // 模拟异步请求
    setTimeout(() => {
      const foundTodo = mockTodos.find(t => t.id === todoId)
      if (foundTodo) {
        todo.value = foundTodo
      } else {
        ElMessage.error('待办事项不存在')
        router.push('/worker/messages')
      }
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取待办事项详情失败:', error)
    ElMessage.error('获取待办事项详情失败，请稍后重试')
    loading.value = false
  }
}

// 标记为已完成
const markAsCompleted = () => {
  if (todo.value) {
    todo.value.status = 'completed' as const
    ElMessage.success('待办事项已标记为完成')
  }
}

// 提交调查
const submitSurvey = () => {
  // 检查是否所有问题都已回答
  if (!surveyAnswers.value.question1 || !surveyAnswers.value.question2 || 
      !surveyAnswers.value.question3 || !surveyAnswers.value.question4 || 
      !surveyAnswers.value.question5) {
    ElMessage.warning('请完成所有调查问题')
    return
  }
  
  // 模拟提交调查
  setTimeout(() => {
    if (todo.value) {
      todo.value.status = 'completed' as const
      ElMessage.success('调查提交成功，感谢您的参与！')
    }
  }, 500)
}

// 返回消息列表
const goBack = () => {
  router.push('/worker/messages')
}

// 页面加载时获取数据
onMounted(() => {
  getTodoDetail()
})
</script>

<template>
  <div class="worker-todo-detail">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button type="text" @click="goBack">
          <i class="el-icon-arrow-left"></i>
        </el-button>
        <h2>待办详情</h2>
      </div>
    </div>
    
    <!-- 待办内容 -->
    <div class="todo-content">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="!todo" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>待办事项不存在</span>
      </div>
      <div v-else class="todo-detail">
        <div class="todo-header">
          <div class="todo-title">
            <div class="todo-icon">
              <ElIcon v-if="todo.type === 'training'" :size="20"><Reading /></ElIcon>
              <ElIcon v-else-if="todo.type === 'leave'" :size="20"><Operation /></ElIcon>
              <ElIcon v-else :size="20"><Document /></ElIcon>
            </div>
            <h3>{{ todo.title }}</h3>
          </div>
          <div class="todo-meta">
            <span class="todo-time">{{ todo.createTime }}</span>
            <el-tag :type="todo.status === 'pending' ? 'warning' : todo.status === 'processing' ? 'info' : 'success'">
              {{ todo.status === 'pending' ? '待处理' : todo.status === 'processing' ? '处理中' : '已完成' }}
            </el-tag>
          </div>
        </div>
        <div class="todo-body">
            <p>{{ todo.content }}</p>
            <p class="todo-deadline">
              <i class="el-icon-time"></i>
              {{ todo.deadline ? `截止日期: ${todo.deadline}` : `提交日期: ${todo.submitDate}` }}
            </p>
            
            <!-- 调查类型待办事项的特殊处理 -->
            <div v-if="todo.type === 'survey'" class="survey-section">
              <h4>工作满意度调查</h4>
              <div class="survey-questions">
                <div class="survey-question">
                  <p>1. 您对当前工作环境满意度如何？</p>
                  <div class="survey-options">
                    <el-radio v-model="surveyAnswers.question1" label="1">非常不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question1" label="2">不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question1" label="3">一般</el-radio>
                    <el-radio v-model="surveyAnswers.question1" label="4">满意</el-radio>
                    <el-radio v-model="surveyAnswers.question1" label="5">非常满意</el-radio>
                  </div>
                </div>
                <div class="survey-question">
                  <p>2. 您对当前薪资待遇满意度如何？</p>
                  <div class="survey-options">
                    <el-radio v-model="surveyAnswers.question2" label="1">非常不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question2" label="2">不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question2" label="3">一般</el-radio>
                    <el-radio v-model="surveyAnswers.question2" label="4">满意</el-radio>
                    <el-radio v-model="surveyAnswers.question2" label="5">非常满意</el-radio>
                  </div>
                </div>
                <div class="survey-question">
                  <p>3. 您对当前工作内容满意度如何？</p>
                  <div class="survey-options">
                    <el-radio v-model="surveyAnswers.question3" label="1">非常不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question3" label="2">不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question3" label="3">一般</el-radio>
                    <el-radio v-model="surveyAnswers.question3" label="4">满意</el-radio>
                    <el-radio v-model="surveyAnswers.question3" label="5">非常满意</el-radio>
                  </div>
                </div>
                <div class="survey-question">
                  <p>4. 您对公司管理满意度如何？</p>
                  <div class="survey-options">
                    <el-radio v-model="surveyAnswers.question4" label="1">非常不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question4" label="2">不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question4" label="3">一般</el-radio>
                    <el-radio v-model="surveyAnswers.question4" label="4">满意</el-radio>
                    <el-radio v-model="surveyAnswers.question4" label="5">非常满意</el-radio>
                  </div>
                </div>
                <div class="survey-question">
                  <p>5. 您对公司福利满意度如何？</p>
                  <div class="survey-options">
                    <el-radio v-model="surveyAnswers.question5" label="1">非常不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question5" label="2">不满意</el-radio>
                    <el-radio v-model="surveyAnswers.question5" label="3">一般</el-radio>
                    <el-radio v-model="surveyAnswers.question5" label="4">满意</el-radio>
                    <el-radio v-model="surveyAnswers.question5" label="5">非常满意</el-radio>
                  </div>
                </div>
                <div class="survey-question">
                  <p>6. 您对工作中有什么建议？</p>
                  <el-input
                    v-model="surveyAnswers.suggestion"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入您的建议"
                  ></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="todo-footer">
            <el-button v-if="todo.type === 'survey' && todo.status !== 'completed'" type="primary" @click="submitSurvey">
              提交调查
            </el-button>
            <el-button v-else-if="todo.status !== 'completed'" type="primary" @click="markAsCompleted">
              标记完成
            </el-button>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-todo-detail {
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

.header-left {
  display: flex;
  align-items: center;
}

.header-left h2 {
  margin: 0 0 0 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.todo-content {
  padding: 15px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.todo-detail {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.todo-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

.todo-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.todo-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.todo-icon {
  font-size: 18px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-time {
  font-size: 12px;
  color: #999;
}

.todo-body {
  margin-bottom: 20px;
  line-height: 1.6;
}

.todo-body p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}

.todo-deadline {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
}

.todo-deadline i {
  margin-right: 5px;
}

.todo-footer {
  display: flex;
  justify-content: flex-end;
}

/* 调查部分样式 */
.survey-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.survey-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.survey-questions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.survey-question {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.survey-question p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.survey-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.survey-options .el-radio {
  margin-right: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .header-left h2 {
    font-size: 16px;
  }
  
  .todo-content {
    padding: 10px;
  }
  
  .todo-detail {
    padding: 15px;
  }
  
  .todo-header h3 {
    font-size: 16px;
  }
  
  .todo-body p {
    font-size: 13px;
  }
  
  .survey-options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .survey-options .el-radio {
    margin-right: 0;
    margin-bottom: 5px;
  }
}
</style>