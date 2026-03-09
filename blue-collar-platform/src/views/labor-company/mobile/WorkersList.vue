<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const workers = ref<any[]>([])
const loading = ref(true)

const getWorkers = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    workers.value = [
      {
        id: 1,
        name: '张三',
        gender: '男',
        age: 28,
        phone: '138****1234',
        idCard: '320***********1234',
        factory: '富士康科技',
        position: '操作工',
        status: '在职',
        paymentType: '月结',
        entryDate: '2025-08-15',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ID%20photo%20of%20a%20Chinese%20male%20worker%2C%20young%20adult%2C%20simple%20background%2C%20professional%20style&image_size=square'
      },
      {
        id: 2,
        name: '李四',
        gender: '女',
        age: 25,
        phone: '139****5678',
        idCard: '320***********5678',
        factory: '华为技术',
        position: '质检员',
        status: '在职',
        paymentType: '日结',
        entryDate: '2025-09-20',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ID%20photo%20of%20a%20Chinese%20female%20worker%2C%20young%20adult%2C%20simple%20background%2C%20professional%20style&image_size=square'
      },
      {
        id: 3,
        name: '王五',
        gender: '男',
        age: 32,
        phone: '137****9012',
        idCard: '320***********9012',
        factory: '京东物流',
        position: '仓库管理员',
        status: '离职',
        paymentType: '月结',
        entryDate: '2025-06-10',
        exitDate: '2026-01-15',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ID%20photo%20of%20a%20Chinese%20male%20worker%2C%20middle-aged%2C%20simple%20background%2C%20professional%20style&image_size=square'
      },
      {
        id: 4,
        name: '赵六',
        gender: '女',
        age: 23,
        phone: '136****3456',
        idCard: '320***********3456',
        factory: '富士康科技',
        position: '操作工',
        status: '在职',
        paymentType: '日结',
        entryDate: '2026-01-05',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ID%20photo%20of%20a%20Chinese%20female%20worker%2C%20young%20adult%2C%20simple%20background%2C%20professional%20style&image_size=square'
      }
    ]
  } catch (error) {
    ElMessage.error('获取工人信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (worker: any) => {
  router.push(`/tenant/worker-detail/${worker.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '在职': 'success',
    '离职': 'info',
    '待入职': 'warning'
  }
  return types[status] || 'info'
}

onMounted(() => {
  getWorkers()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>工人信息</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="workers.length === 0" class="empty-state">
        <p>暂无工人信息</p>
      </div>
      
      <div v-else class="worker-list">
        <div 
          v-for="worker in workers" 
          :key="worker.id" 
          class="worker-item"
          @click="goToDetail(worker)"
        >
          <div class="worker-avatar">
            <img :src="worker.avatar" :alt="worker.name">
          </div>
          
          <div class="worker-info">
            <div class="worker-header">
              <h3 class="worker-name">{{ worker.name }}</h3>
              <el-tag :type="getStatusType(worker.status)" size="small">
                {{ worker.status }}
              </el-tag>
            </div>
            
            <div class="worker-details">
              <span>{{ worker.gender }}</span>
              <span class="divider">|</span>
              <span>{{ worker.age }}岁</span>
              <span class="divider">|</span>
              <span>{{ worker.phone }}</span>
            </div>
            
            <div class="worker-tags">
              <span class="tag">{{ worker.factory }}</span>
              <span class="tag">{{ worker.position }}</span>
              <span :class="['tag', worker.paymentType === '日结' ? 'tag-daily' : 'tag-monthly']">
                {{ worker.paymentType }}
              </span>
            </div>
            
            <div class="worker-date">
              <span v-if="worker.status === '在职'">入职日期：{{ worker.entryDate }}</span>
              <span v-else>离职日期：{{ worker.exitDate }}</span>
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

.worker-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.worker-item {
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.worker-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.worker-avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 15px;
}

.worker-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.worker-info {
  flex: 1;
  min-width: 0;
}

.worker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.worker-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.worker-details {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.divider {
  margin: 0 8px;
  color: #ddd;
}

.worker-tags {
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

.tag-daily {
  background-color: #fff7e6;
  color: #e6a23c;
}

.tag-monthly {
  background-color: #f0f9eb;
  color: #67c23a;
}

.worker-date {
  font-size: 12px;
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
  
  .worker-item {
    padding: 12px;
  }
  
  .worker-avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
