<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const resignations = ref<any[]>([])
const loading = ref(true)

const getResignations = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    resignations.value = [
      {
        id: 1,
        workerName: '王五',
        factory: '京东物流',
        position: '仓库管理员',
        entryDate: '2025-06-10',
        resignationDate: '2026-01-15',
        reason: '个人发展原因',
        status: '已离职',
        handoverStatus: '已完成'
      },
      {
        id: 2,
        workerName: '赵六',
        factory: '富士康科技',
        position: '操作工',
        entryDate: '2025-08-20',
        resignationDate: '2026-02-20',
        reason: '回家照顾老人',
        status: '审批中',
        handoverStatus: '待交接'
      }
    ]
  } catch (error) {
    ElMessage.error('获取离职信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (item: any) => {
  router.push(`/tenant/resignation-detail/${item.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '已离职': 'success',
    '审批中': 'warning',
    '待审批': 'warning'
  }
  return types[status] || 'info'
}

onMounted(() => {
  getResignations()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>离职管理</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="resignations.length === 0" class="empty-state">
        <p>暂无离职信息</p>
      </div>
      
      <div v-else class="list">
        <div 
          v-for="item in resignations" 
          :key="item.id" 
          class="item-card"
          @click="goToDetail(item)"
        >
          <div class="item-header">
            <h3 class="worker-name">{{ item.workerName }}</h3>
            <el-tag :type="getStatusType(item.status)" size="small">
              {{ item.status }}
            </el-tag>
          </div>
          
          <div class="item-info">
            <div class="info-row">
              <span class="label">用工企业：</span>
              <span class="value">{{ item.factory }}</span>
            </div>
            <div class="info-row">
              <span class="label">工作岗位：</span>
              <span class="value">{{ item.position }}</span>
            </div>
            <div class="info-row">
              <span class="label">入职日期：</span>
              <span class="value">{{ item.entryDate }}</span>
            </div>
            <div class="info-row">
              <span class="label">离职日期：</span>
              <span class="value">{{ item.resignationDate }}</span>
            </div>
            <div class="info-row">
              <span class="label">离职原因：</span>
              <span class="value">{{ item.reason }}</span>
            </div>
            <div class="info-row">
              <span class="label">交接状态：</span>
              <span class="value">{{ item.handoverStatus }}</span>
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

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.worker-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
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
  
  .item-card {
    padding: 12px;
  }
}
</style>
