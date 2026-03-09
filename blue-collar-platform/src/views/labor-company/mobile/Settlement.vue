<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const settlements = ref<any[]>([])
const loading = ref(true)

const getSettlements = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    settlements.value = [
      {
        id: 1,
        month: '2026-01',
        factory: '富士康科技',
        workerCount: 45,
        totalAmount: 135000,
        status: '已结算',
        settleDate: '2026-02-10'
      },
      {
        id: 2,
        month: '2026-01',
        factory: '华为技术',
        workerCount: 28,
        totalAmount: 98000,
        status: '已结算',
        settleDate: '2026-02-08'
      },
      {
        id: 3,
        month: '2026-01',
        factory: '京东物流',
        workerCount: 35,
        totalAmount: 87500,
        status: '待结算',
        settleDate: '-'
      }
    ]
  } catch (error) {
    ElMessage.error('获取结算信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (item: any) => {
  router.push(`/tenant/settlement-detail/${item.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '已结算': 'success',
    '待结算': 'warning'
  }
  return types[status] || 'info'
}

const formatMoney = (amount: number) => {
  return `¥${amount.toLocaleString()}`
}

onMounted(() => {
  getSettlements()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>结算管理</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="settlements.length === 0" class="empty-state">
        <p>暂无结算信息</p>
      </div>
      
      <div v-else class="settlement-list">
        <div 
          v-for="item in settlements" 
          :key="item.id" 
          class="settlement-item"
          @click="goToDetail(item)"
        >
          <div class="item-header">
            <div class="month-info">
              <span class="month">{{ item.month }}</span>
              <span class="factory">{{ item.factory }}</span>
            </div>
            <el-tag :type="getStatusType(item.status)" size="small">
              {{ item.status }}
            </el-tag>
          </div>
          
          <div class="item-stats">
            <div class="stat-item">
              <span class="stat-label">工人数</span>
              <span class="stat-value">{{ item.workerCount }}人</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">结算金额</span>
              <span class="stat-value amount">{{ formatMoney(item.totalAmount) }}</span>
            </div>
          </div>
          
          <div class="item-footer">
            <span>结算日期：{{ item.settleDate }}</span>
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

.settlement-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settlement-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.settlement-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.month-info {
  display: flex;
  flex-direction: column;
}

.month {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.factory {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.item-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stat-value.amount {
  color: #f56c6c;
}

.item-footer {
  font-size: 12px;
  color: #999;
  text-align: right;
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
  
  .settlement-item {
    padding: 12px;
  }
}
</style>
