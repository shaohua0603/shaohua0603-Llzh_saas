<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const currentExams = ref([])
const historyExams = ref([])
const loading = ref(true)

// 模拟考试数据
const mockExams = [
  {
    id: 1,
    title: '业务课堂综合考试',
    description: '包含厂规厂纪、工作内容、安全教育和日常培训所有题目',
    totalQuestions: 60,
    passScore: 65,
    duration: 70,
    status: 'current', // current 或 history
    score: null,
    examDate: null,
    createdAt: '2026-02-10'
  },
  {
    id: 2,
    title: '日常培训专项考试',
    description: '包含5S管理、质量意识、团队合作等日常培训题目',
    totalQuestions: 30,
    passScore: 60,
    duration: 40,
    status: 'current',
    score: null,
    examDate: null,
    createdAt: '2026-02-08'
  },
  {
    id: 3,
    title: '岗前培训综合考试',
    description: '包含厂规厂纪、工作内容、安全教育所有题目',
    totalQuestions: 50,
    passScore: 65,
    duration: 60,
    status: 'history',
    score: 85,
    examDate: '2026-02-05',
    createdAt: '2026-02-01'
  },
  {
    id: 4,
    title: '厂规厂纪补考',
    description: '厂规厂纪补考',
    totalQuestions: 20,
    passScore: 60,
    duration: 30,
    status: 'history',
    score: 62,
    examDate: '2026-01-28',
    createdAt: '2026-01-25'
  }
]

// 获取考试列表
const getExams = async () => {
  loading.value = true
  try {
    // 模拟异步请求
    setTimeout(() => {
      // 区分当前考试和历史考试
      currentExams.value = mockExams.filter(exam => exam.status === 'current')
      historyExams.value = mockExams.filter(exam => exam.status === 'history')
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取考试列表失败:', error)
    ElMessage.error('获取考试列表失败，请稍后重试')
    loading.value = false
  }
}

// 进入考试详情页
const goToExamDetail = (exam) => {
  router.push({
    path: '/worker/training/exam',
    query: { id: exam.id, type: exam.status }
  })
}

// 页面加载时获取数据
onMounted(() => {
  getExams()
})
</script>

<template>
  <div class="worker-exam-list">
    <BackButton />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>考试列表</h2>
    </div>
    
    <!-- 考试列表 -->
    <div class="exam-list">
      <!-- 当前考试 -->
      <div class="exam-section">
        <h3 class="section-title">当前考试</h3>
        <div v-if="loading" class="loading">
          <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
          <span>加载中...</span>
        </div>
        <div v-else-if="currentExams.length === 0" class="empty">
          <el-icon><i class="el-icon-info"></i></el-icon>
          <span>暂无当前考试</span>
        </div>
        <div v-else class="exam-items">
          <div v-for="exam in currentExams" :key="exam.id" class="exam-item current">
            <div class="exam-header">
              <h4>{{ exam.title }}</h4>
            </div>
            <div class="exam-body">
              <p class="description">{{ exam.description }}</p>
              <div class="exam-info">
                <span class="info-item">
                  <i class="el-icon-document"></i>
                  {{ exam.totalQuestions }}题
                </span>
                <span class="info-item">
                  <i class="el-icon-data-analysis"></i>
                  及格分: {{ exam.passScore }}分
                </span>
                <span class="info-item">
                  <i class="el-icon-time"></i>
                  {{ exam.duration }}分钟
                </span>
              </div>
            </div>
            <div class="exam-footer">
              <el-button type="primary" @click="goToExamDetail(exam)">
                开始考试
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 历次考试 -->
      <div class="exam-section">
        <h3 class="section-title">历次考试</h3>
        <div v-if="historyExams.length === 0" class="empty">
          <el-icon><i class="el-icon-info"></i></el-icon>
          <span>暂无历次考试</span>
        </div>
        <div v-else class="exam-items">
          <div v-for="exam in historyExams" :key="exam.id" class="exam-item history">
            <div class="exam-header">
              <h4>{{ exam.title }}</h4>
              <span class="exam-score" :class="{ 'pass': exam.score >= exam.passScore, 'fail': exam.score < exam.passScore }">
                {{ exam.score }}分
              </span>
            </div>
            <div class="exam-body">
              <p class="description">{{ exam.description }}</p>
              <div class="exam-info">
                <span class="info-item">
                  <i class="el-icon-document"></i>
                  {{ exam.totalQuestions }}题
                </span>
                <span class="info-item">
                  <i class="el-icon-data-analysis"></i>
                  及格分: {{ exam.passScore }}分
                </span>
                <span class="info-item">
                  <i class="el-icon-time"></i>
                  考试时间: {{ exam.examDate }}
                </span>
              </div>
            </div>
            <div class="exam-footer">
              <el-button type="info" @click="goToExamDetail(exam)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-exam-list {
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

.exam-list {
  padding: 0 15px 20px;
}

.exam-section {
  margin-top: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
  padding-left: 8px;
  border-left: 4px solid #667eea;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
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

.exam-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.exam-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.exam-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.exam-item.current {
  border-left: 4px solid #409eff;
}

.exam-item.history {
  border-left: 4px solid #67c23a;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.exam-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.exam-score {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
}

.exam-score.pass {
  background-color: #f0f9eb;
  color: #67c23a;
}

.exam-score.fail {
  background-color: #fef0f0;
  color: #f56c6c;
}

.exam-body {
  margin-bottom: 15px;
}

.description {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.exam-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.info-item {
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
}

.info-item i {
  margin-right: 8px;
  font-size: 14px;
}

.exam-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.exam-footer .el-button {
  min-width: 100px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .exam-list {
    padding: 0 10px 20px;
  }
  
  .exam-section {
    margin-top: 15px;
  }
  
  .section-title {
    font-size: 15px;
    margin-bottom: 12px;
  }
  
  .exam-item {
    padding: 12px;
  }
  
  .exam-header h4 {
    font-size: 15px;
  }
  
  .description {
    font-size: 13px;
  }
  
  .exam-info {
    gap: 10px;
  }
  
  .info-item {
    font-size: 12px;
  }
  
  .exam-footer .el-button {
    min-width: 80px;
    font-size: 13px;
  }
}
</style>