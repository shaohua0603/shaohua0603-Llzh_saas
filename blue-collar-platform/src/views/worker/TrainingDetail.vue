<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const route = useRoute()

const trainingCourse = ref(null)
const loading = ref(true)
const learningTime = ref(0) // 学习时长（秒）
const timer = ref(null)
const isPlaying = ref(false)

// 模拟培训详情数据
const mockTrainingDetails = [
  {
    id: 1,
    factory: '富士康科技集团',
    title: '厂规厂纪培训',
    content: '1. 遵守工厂作息时间\n2. 遵守安全生产规定\n3. 服从工作安排\n4. 保持车间整洁',
    duration: '2小时',
    required: true,
    materials: [
      {
        type: 'video',
        title: '厂规厂纪培训视频',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        type: 'file',
        title: '厂规厂纪手册',
        url: '#',
        fileName: '厂规厂纪手册.pdf'
      }
    ]
  },
  {
    id: 2,
    factory: '富士康科技集团',
    title: '工作内容培训',
    content: '1. 熟悉生产流程\n2. 掌握操作技能\n3. 了解质量标准\n4. 学会设备维护',
    duration: '4小时',
    required: true,
    materials: [
      {
        type: 'video',
        title: '工作内容培训视频',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        type: 'file',
        title: '操作手册',
        url: '#',
        fileName: '操作手册.pdf'
      }
    ]
  },
  {
    id: 3,
    factory: '富士康科技集团',
    title: '安全教育培训',
    content: '1. 消防安全知识\n2. 用电安全知识\n3. 机械操作安全\n4. 紧急情况处理',
    duration: '3小时',
    required: true,
    materials: [
      {
        type: 'video',
        title: '安全教育培训视频',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        type: 'file',
        title: '安全手册',
        url: '#',
        fileName: '安全手册.pdf'
      }
    ]
  },
  // 日常培训详情数据
  {
    id: 4,
    factory: '富士康科技集团',
    title: '5S管理培训',
    content: '1. 整理（SEIRI）：区分必需品和非必需品，现场不放置非必需品\n2. 整顿（SEITON）：必需品依规定定位、定方法摆放整齐有序，明确标示\n3. 清扫（SEISO）：清除现场内的脏污、清除作业区域的物料垃圾\n4. 清洁（SEIKETSU）：将整理、整顿、清扫实施的做法制度化、规范化，维持其成果\n5. 素养（SHITSUKE）：人人按章操作、依规行事，养成良好的习惯',
    duration: '1.5小时',
    required: false,
    materials: [
      {
        type: 'video',
        title: '5S管理培训视频',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        type: 'file',
        title: '5S管理手册',
        url: '#',
        fileName: '5S管理手册.pdf'
      }
    ]
  },
  {
    id: 5,
    factory: '富士康科技集团',
    title: '质量意识培训',
    content: '1. 质量的重要性：质量是企业的生命线\n2. 质量标准：了解本岗位的质量标准和要求\n3. 质量控制：掌握基本的质量控制方法\n4. 质量改进：积极参与质量改进活动',
    duration: '2小时',
    required: false,
    materials: [
      {
        type: 'video',
        title: '质量意识培训视频',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        type: 'file',
        title: '质量意识手册',
        url: '#',
        fileName: '质量意识手册.pdf'
      }
    ]
  },
  {
    id: 6,
    factory: '富士康科技集团',
    title: '团队合作培训',
    content: '1. 团队的定义和重要性\n2. 有效的沟通技巧\n3. 冲突解决方法\n4. 团队建设活动',
    duration: '1小时',
    required: false,
    materials: [
      {
        type: 'video',
        title: '团队合作培训视频',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        type: 'file',
        title: '团队合作手册',
        url: '#',
        fileName: '团队合作手册.pdf'
      }
    ]
  }
]

// 格式化学习时长
const formattedLearningTime = computed(() => {
  const hours = Math.floor(learningTime.value / 3600)
  const minutes = Math.floor((learningTime.value % 3600) / 60)
  const seconds = learningTime.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 获取培训详情
const getTrainingDetail = () => {
  loading.value = true
  try {
    const courseId = parseInt(route.query.id)
    const course = mockTrainingDetails.find(item => item.id === courseId)
    if (course) {
      trainingCourse.value = course
    } else {
      ElMessage.error('培训内容不存在')
      router.push('/worker/training')
    }
  } catch (error) {
    console.error('获取培训详情失败:', error)
    ElMessage.error('获取培训详情失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 开始学习计时
const startLearning = () => {
  if (!timer.value) {
    isPlaying.value = true
    timer.value = setInterval(() => {
      learningTime.value++
    }, 1000)
  }
}

// 暂停学习计时
const pauseLearning = () => {
  if (timer.value) {
    isPlaying.value = false
    clearInterval(timer.value)
    timer.value = null
  }
}

// 跳转到考试页面
const goToExam = () => {
  router.push({
    path: '/worker/training/exam',
    query: { id: trainingCourse.value.id }
  })
}

// 页面加载时获取数据
onMounted(() => {
  getTrainingDetail()
  startLearning()
})

// 页面卸载时清除计时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<template>
  <div class="training-detail">
    <BackButton />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>学习详情</h2>
    </div>
    
    <!-- 学习内容 -->
    <div class="learning-content">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="!trainingCourse" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>培训内容不存在</span>
      </div>
      <div v-else class="course-detail">
        <!-- 培训信息 -->
        <div class="course-info">
          <div class="course-header">
            <h3>{{ trainingCourse.title }}</h3>
            <el-tag :type="trainingCourse.required ? 'danger' : 'info'">
              {{ trainingCourse.required ? '必修' : '选修' }}
            </el-tag>
          </div>
          <div class="course-meta">
            <p class="duration">
              <i class="el-icon-time"></i>
              预计时长: {{ trainingCourse.duration }}
            </p>
            <p class="learning-time">
              <i class="el-icon-video-camera"></i>
              学习时长: {{ formattedLearningTime }}
            </p>
          </div>
        </div>
        
        <!-- 学习材料 -->
        <div class="learning-materials">
          <h4>学习材料</h4>
          <div class="materials-list">
            <div v-for="(material, index) in trainingCourse.materials" :key="index" class="material-item">
              <div v-if="material.type === 'video'" class="video-material">
                <h5>{{ material.title }}</h5>
                <div class="video-container">
                  <video 
                    controls 
                    width="100%" 
                    height="auto"
                    @play="startLearning"
                    @pause="pauseLearning"
                  >
                    <source :src="material.url" type="video/mp4">
                    您的浏览器不支持视频播放。
                  </video>
                </div>
              </div>
              <div v-else-if="material.type === 'file'" class="file-material">
                <h5>{{ material.title }}</h5>
                <a :href="material.url" class="file-link" target="_blank">
                  <i class="el-icon-document"></i>
                  {{ material.fileName }}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 培训内容 -->
        <div class="course-content">
          <h4>培训内容</h4>
          <div class="content">
            <pre>{{ trainingCourse.content }}</pre>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="success" @click="goToExam">
            开始考试
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.training-detail {
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

.learning-content {
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

.course-detail {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.course-info {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.course-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.course-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.duration,
.learning-time {
  margin: 0;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
}

.duration i,
.learning-time i {
  margin-right: 8px;
  color: #999;
  font-size: 14px;
}

.learning-materials {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.learning-materials h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.material-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.material-item h5 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.video-container {
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.file-link {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #1890ff;
  text-decoration: none;
  padding: 10px;
  background-color: #e6f7ff;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.file-link:hover {
  background-color: #bae7ff;
  text-decoration: underline;
}

.file-link i {
  margin-right: 10px;
  font-size: 16px;
}

.course-content {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.course-content h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.content {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  white-space: pre-wrap;
}

.content pre {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
}

.action-buttons {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.action-buttons .el-button {
  min-width: 120px;
  font-size: 16px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .learning-content {
    padding: 10px;
  }
  
  .course-info,
  .learning-materials,
  .course-content,
  .action-buttons {
    padding: 15px;
  }
  
  .course-header h3 {
    font-size: 16px;
  }
  
  .course-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .duration,
  .learning-time {
    font-size: 13px;
  }
  
  .learning-materials h4,
  .course-content h4 {
    font-size: 15px;
  }
  
  .content {
    font-size: 13px;
  }
}
</style>