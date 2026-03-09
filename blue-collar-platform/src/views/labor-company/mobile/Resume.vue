<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const resumes = ref<any[]>([])
const loading = ref(true)

const getResumes = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    resumes.value = [
      {
        id: 1,
        name: '张三',
        gender: '男',
        age: 28,
        phone: '138****1234',
        education: '高中',
        experience: '3年',
        position: '操作工',
        status: '待面试',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ID%20photo%20of%20a%20Chinese%20male%20worker%2C%20young%20adult%2C%20simple%20background%2C%20professional%20style&image_size=square'
      },
      {
        id: 2,
        name: '李四',
        gender: '女',
        age: 25,
        phone: '139****5678',
        education: '中专',
        experience: '2年',
        position: '质检员',
        status: '已通过',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ID%20photo%20of%20a%20Chinese%20female%20worker%2C%20young%20adult%2C%20simple%20background%2C%20professional%20style&image_size=square'
      },
      {
        id: 3,
        name: '王五',
        gender: '男',
        age: 32,
        phone: '137****9012',
        education: '大专',
        experience: '5年',
        position: '叉车工',
        status: '已推荐',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ID%20photo%20of%20a%20Chinese%20male%20worker%2C%20middle-aged%2C%20simple%20background%2C%20professional%20style&image_size=square'
      },
      {
        id: 4,
        name: '赵六',
        gender: '女',
        age: 23,
        phone: '136****3456',
        education: '高中',
        experience: '1年',
        position: '仓库管理员',
        status: '待审核',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ID%20photo%20of%20a%20Chinese%20female%20worker%2C%20young%20adult%2C%20simple%20background%2C%20professional%20style&image_size=square'
      }
    ]
  } catch (error) {
    ElMessage.error('获取简历列表失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (resume: any) => {
  router.push(`/tenant/resume-detail/${resume.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '待面试': 'warning',
    '已通过': 'success',
    '已推荐': 'primary',
    '待审核': 'info'
  }
  return types[status] || 'info'
}

onMounted(() => {
  getResumes()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>简历管理</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="resumes.length === 0" class="empty-state">
        <p>暂无简历</p>
      </div>
      
      <div v-else class="resume-list">
        <div 
          v-for="resume in resumes" 
          :key="resume.id" 
          class="resume-item"
          @click="goToDetail(resume)"
        >
          <div class="resume-avatar">
            <img :src="resume.avatar" :alt="resume.name">
          </div>
          
          <div class="resume-info">
            <div class="resume-header">
              <h3 class="resume-name">{{ resume.name }}</h3>
              <el-tag :type="getStatusType(resume.status)" size="small">
                {{ resume.status }}
              </el-tag>
            </div>
            
            <div class="resume-details">
              <span>{{ resume.gender }}</span>
              <span class="divider">|</span>
              <span>{{ resume.age }}岁</span>
              <span class="divider">|</span>
              <span>{{ resume.education }}</span>
            </div>
            
            <div class="resume-tags">
              <span class="tag">经验{{ resume.experience }}</span>
              <span class="tag">应聘{{ resume.position }}</span>
            </div>
            
            <div class="resume-phone">
              {{ resume.phone }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-page {
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

.page-content {
  padding: 15px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.resume-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resume-item {
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.resume-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resume-avatar {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 15px;
}

.resume-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resume-info {
  flex: 1;
  min-width: 0;
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.resume-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.resume-details {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.divider {
  margin: 0 8px;
  color: #ddd;
}

.resume-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}

.tag {
  padding: 2px 8px;
  background-color: #f0f4ff;
  color: #667eea;
  border-radius: 10px;
  font-size: 12px;
}

.resume-phone {
  font-size: 13px;
  color: #999;
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .page-content {
    padding: 10px;
  }
  
  .resume-item {
    padding: 12px;
  }
  
  .resume-avatar {
    width: 60px;
    height: 60px;
  }
}
</style>
