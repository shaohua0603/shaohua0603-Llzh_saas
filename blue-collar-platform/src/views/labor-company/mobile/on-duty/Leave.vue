<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const leaves = ref<any[]>([])
const loading = ref(true)

const getLeaves = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    leaves.value = [
      {
        id: 1,
        workerName: '张三',
        factory: '富士康科技',
        leaveType: '事假',
        startDate: '2026-02-20',
        endDate: '2026-02-22',
        days: 3,
        reason: '家中有事需要处理',
        status: '待审批',
        submitDate: '2026-02-15'
      },
      {
        id: 2,
        workerName: '李四',
        factory: '华为技术',
        leaveType: '病假',
        startDate: '2026-02-16',
        endDate: '2026-02-17',
        days: 2,
        reason: '感冒发烧需要休息',
        status: '已批准',
        submitDate: '2026-02-15'
      },
      {
        id: 3,
        workerName: '王五',
        factory: '京东物流',
        leaveType: '年假',
        startDate: '2026-03-01',
        endDate: '2026-03-05',
        days: 5,
        reason: '计划回老家探亲',
        status: '待审批',
        submitDate: '2026-02-14'
      }
    ]
  } catch (error) {
    ElMessage.error('获取请假信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (leave: any) => {
  router.push(`/tenant/on-duty/leave-detail/${leave.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '待审批': 'warning',
    '已批准': 'success',
    '已拒绝': 'danger'
  }
  return types[status] || 'info'
}

onMounted(() => {
  getLeaves()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>请假管理</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="leaves.length === 0" class="empty-state">
        <p>暂无请假信息</p>
      </div>
      
      <div v-else class="leave-list">
        <div 
          v-for="leave in leaves" 
          :key="leave.id" 
          class="leave-item"
          @click="goToDetail(leave)"
        >
          <div class="item-header">
            <div class="worker-info">
              <span class="worker-name">{{ leave.workerName }}</span>
              <span class="leave-type">{{ leave.leaveType }}</span>
            </div>
            <el-tag :type="getStatusType(leave.status)" size="small">
              {{ leave.status }}
            </el-tag>
          </div>
          
          <div class="item-info">
            <div class="info-row">
              <span class="label">用工企业：</span>
              <span class="value">{{ leave.factory }}</span>
            </div>
            <div class="info-row">
              <span class="label">请假时间：</span>
              <span class="value">{{ leave.startDate }} 至 {{ leave.endDate }}</span>
            </div>
            <div class="info-row">
              <span class="label">请假天数：</span>
              <span class="value">{{ leave.days }}天</span>
            </div>
            <div class="info-row">
              <span class="label">请假原因：</span>
              <span class="value">{{ leave.reason }}</span>
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

.leave-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leave-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.leave-item:hover {
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

.leave-type {
  padding: 2px 8px;
  background-color: #fff7e6;
  color: #fa8c16;
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
  
  .leave-item {
    padding: 12px;
  }
}
</style>
