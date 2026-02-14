<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// 跳转到学习详情页
const goToTrainingDetail = (course) => {
  router.push({
    path: '/worker/training/detail',
    query: { id: course.id }
  })
}

// 跳转到考试详情页
const goToExamDetail = (course) => {
  router.push({
    path: '/worker/training/exam',
    query: { id: course.id }
  })
}

// 跳转到考试列表页
const goToExamList = () => {
  router.push('/worker/exam-list')
}

const trainingCourses = ref([])
const loading = ref(true)

// 模拟业务课堂数据
const mockTrainingCourses = [
  // 岗前培训
  {
    id: 1,
    factory: '富士康科技集团',
    title: '厂规厂纪培训',
    content: '1. 遵守工厂作息时间\n2. 遵守安全生产规定\n3. 服从工作安排\n4. 保持车间整洁',
    duration: '2小时',
    required: true,
    category: '岗前培训'
  },
  {
    id: 2,
    factory: '富士康科技集团',
    title: '工作内容培训',
    content: '1. 熟悉生产流程\n2. 掌握操作技能\n3. 了解质量标准\n4. 学会设备维护',
    duration: '4小时',
    required: true,
    category: '岗前培训'
  },
  {
    id: 3,
    factory: '富士康科技集团',
    title: '安全教育培训',
    content: '1. 消防安全知识\n2. 用电安全知识\n3. 机械操作安全\n4. 紧急情况处理',
    duration: '3小时',
    required: true,
    category: '岗前培训'
  },
  // 日常培训
  {
    id: 4,
    factory: '富士康科技集团',
    title: '5S管理培训',
    content: '1. 整理（SEIRI）：区分必需品和非必需品，现场不放置非必需品\n2. 整顿（SEITON）：必需品依规定定位、定方法摆放整齐有序，明确标示\n3. 清扫（SEISO）：清除现场内的脏污、清除作业区域的物料垃圾\n4. 清洁（SEIKETSU）：将整理、整顿、清扫实施的做法制度化、规范化，维持其成果\n5. 素养（SHITSUKE）：人人按章操作、依规行事，养成良好的习惯',
    duration: '1.5小时',
    required: false,
    category: '日常培训'
  },
  {
    id: 5,
    factory: '富士康科技集团',
    title: '质量意识培训',
    content: '1. 质量的重要性：质量是企业的生命线\n2. 质量标准：了解本岗位的质量标准和要求\n3. 质量控制：掌握基本的质量控制方法\n4. 质量改进：积极参与质量改进活动',
    duration: '2小时',
    required: false,
    category: '日常培训'
  },
  {
    id: 6,
    factory: '富士康科技集团',
    title: '团队合作培训',
    content: '1. 团队的定义和重要性\n2. 有效的沟通技巧\n3. 冲突解决方法\n4. 团队建设活动',
    duration: '1小时',
    required: false,
    category: '日常培训'
  }
]

// 获取业务课堂内容
const getTrainingCourses = async () => {
  loading.value = true
  try {
    // 模拟异步请求
    setTimeout(() => {
      trainingCourses.value = mockTrainingCourses
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取业务课堂内容失败:', error)
    ElMessage.error('获取业务课堂内容失败，请稍后重试')
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  getTrainingCourses()
})
</script>

<template>
  <div class="worker-training">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>业务课堂</h2>
      <div class="header-actions">
        <el-button type="success" @click="goToExamList">
          考试
        </el-button>
      </div>
    </div>
    
    <!-- 培训课程列表 -->
    <div class="training-list">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="trainingCourses.length === 0" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>暂无业务课堂内容</span>
      </div>
      <div v-else>
        <!-- 按分类显示课程 -->
        <div v-for="category in ['岗前培训', '日常培训']" :key="category" class="category-section">
          <h3 class="category-title">{{ category }}</h3>
          <div class="training-items">
            <div v-for="course in trainingCourses.filter(c => c.category === category)" :key="course.id" class="training-item">
              <div class="training-header">
                <h3>{{ course.title }}</h3>
                <el-tag :type="course.required ? 'danger' : 'info'">
                  {{ course.required ? '必修' : '选修' }}
                </el-tag>
              </div>
              <div class="training-body">
                <p class="duration">
                  <i class="el-icon-time"></i>
                  时长: {{ course.duration }}
                </p>
                <div class="content">
                  <pre>{{ course.content }}</pre>
                </div>
              </div>
              <div class="training-footer">
                <el-button type="primary" @click="goToTrainingDetail(course)">
                  学习
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-training {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.training-list {
  padding: 0 15px 20px;
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

.category-section {
  margin-bottom: 25px;
}

.category-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
  padding-left: 8px;
  border-left: 4px solid #667eea;
}

.training-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.training-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.training-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.training-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.duration {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
}

.duration i {
  margin-right: 8px;
  color: #999;
  font-size: 14px;
}

.content {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  white-space: pre-wrap;
}

.content pre {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
}

.training-footer {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.training-footer .el-button {
  min-width: 80px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .training-list {
    padding: 0 10px 20px;
  }
  
  .training-item {
    padding: 12px;
  }
  
  .training-header h3 {
    font-size: 15px;
  }
  
  .duration {
    font-size: 12px;
  }
  
  .content {
    font-size: 12px;
  }
}
</style>