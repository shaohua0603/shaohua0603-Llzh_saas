<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const interviews = ref<any[]>([])
const loading = ref(true)

const getInterviews = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    interviews.value = [
      {
        id: 1,
        workerName: '张三',
        factory: '富士康科技',
        position: '操作工',
        pickupTime: '2026-02-15 08:00',
        pickupAddress: '劳务公司门口',
        contact: '李经理 138****1234',
        status: '待接送',
        type: '接送'
      },
      {
        id: 2,
        workerName: '李四',
        factory: '华为技术',
        position: '质检员',
        pickupTime: '2026-02-15 09:00',
        pickupAddress: '人才市场',
        contact: '王经理 139****5678',
        status: '已接送',
        type: '接送'
      },
      {
        id: 3,
        workerName: '王五',
        factory: '京东物流',
        position: '仓库管理员',
        pickupTime: '2026-02-16 08:30',
        pickupAddress: '劳务公司门口',
        contact: '张经理 137****9012',
        status: '待接送',
        type: '接送'
      }
    ]
  } catch (error) {
    ElMessage.error('获取接送信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (item: any) => {
  router.push(`/tenant/interview/pickup-detail/${item.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '待接送': 'warning',
    '已接送': 'success',
    '已面试': 'info'
  }
  return types[status] || 'info'
}

onMounted(() => {
  getInterviews()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>接送管理</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="interviews.length === 0" class="empty-state">
        <p>暂无接送安排</p>
      </div>
      
      <div v-else class="interview-list">
        <div 
          v-for="item in interviews" 
          :key="item.id" 
          class="interview-item"
          @click="goToDetail(item)"
        >
          <div class="item-header">
            <div class="worker-info">
              <span class="worker-name">{{ item.workerName }}</span>
              <span class="interview-type">{{ item.type }}</span>
            </div>
            <el-tag :type="getStatusType(item.status)" size="small">
              {{ item.status }}
            </el-tag>
          </div>
          
          <div class="item-info">
            <div class="info-row">
              <span class="label">面试企业：</span>
              <span class="value">{{ item.factory }}</span>
            </div>
            <div class="info-row">
              <span class="label">应聘岗位：</span>
              <span class="value">{{ item.position }}</span>
            </div>
            <div class="info-row">
              <span class="label">接送时间：</span>
              <span class="value">{{ item.pickupTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">接送地点：</span>
              <span class="value">{{ item.pickupAddress }}</span>
            </div>
            <div class="info-row">
              <span class="label">联系人：</span>
              <span class="value contact">{{ item.contact }}</span>
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

.interview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.interview-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.interview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.worker-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.worker-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.interview-type {
  padding: 2px 8px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  font-size: 12px;
}

.item-info {
  margin-bottom: 0;
}

.info-row {
  display: flex;
  font-size: 13px;
  line-height: 1.8;
}

.info-row .label {
  color: #999;
  min-width: 70px;
}

.info-row .value {
  color: #333;
}

.info-row .contact {
  color: #667eea;
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
  
  .interview-item {
    padding: 12px;
  }
}
</style>
