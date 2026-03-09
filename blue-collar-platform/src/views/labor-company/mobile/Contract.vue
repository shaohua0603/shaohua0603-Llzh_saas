<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const contracts = ref<any[]>([])
const loading = ref(true)

const getContracts = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    contracts.value = [
      {
        id: 1,
        workerName: '张三',
        idCard: '320***********1234',
        contractType: '劳动合同',
        factory: '富士康科技',
        startDate: '2025-08-15',
        endDate: '2026-08-14',
        status: '已签订',
        signDate: '2025-08-15'
      },
      {
        id: 2,
        workerName: '李四',
        idCard: '320***********5678',
        contractType: '劳务派遣合同',
        factory: '华为技术',
        startDate: '2025-09-20',
        endDate: '2026-09-19',
        status: '已签订',
        signDate: '2025-09-20'
      },
      {
        id: 3,
        workerName: '王五',
        idCard: '320***********9012',
        contractType: '劳动合同',
        factory: '京东物流',
        startDate: '2025-06-10',
        endDate: '2026-06-09',
        status: '已解除',
        signDate: '2025-06-10',
        endSignDate: '2026-01-15'
      },
      {
        id: 4,
        workerName: '赵六',
        idCard: '320***********3456',
        contractType: '劳动合同',
        factory: '富士康科技',
        startDate: '2026-01-05',
        endDate: '2027-01-04',
        status: '待签订',
        signDate: '-'
      }
    ]
  } catch (error) {
    ElMessage.error('获取合同信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (contract: any) => {
  router.push(`/tenant/contract-detail/${contract.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '已签订': 'success',
    '待签订': 'warning',
    '已解除': 'info'
  }
  return types[status] || 'info'
}

onMounted(() => {
  getContracts()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>签订合同</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="contracts.length === 0" class="empty-state">
        <p>暂无合同信息</p>
      </div>
      
      <div v-else class="contract-list">
        <div 
          v-for="contract in contracts" 
          :key="contract.id" 
          class="contract-item"
          @click="goToDetail(contract)"
        >
          <div class="item-header">
            <h3 class="contract-title">{{ contract.contractType }}</h3>
            <el-tag :type="getStatusType(contract.status)" size="small">
              {{ contract.status }}
            </el-tag>
          </div>
          
          <div class="item-info">
            <div class="info-row">
              <span class="label">工人姓名：</span>
              <span class="value">{{ contract.workerName }}</span>
            </div>
            <div class="info-row">
              <span class="label">身份证号：</span>
              <span class="value">{{ contract.idCard }}</span>
            </div>
            <div class="info-row">
              <span class="label">用工企业：</span>
              <span class="value">{{ contract.factory }}</span>
            </div>
            <div class="info-row">
              <span class="label">合同期限：</span>
              <span class="value">{{ contract.startDate }} 至 {{ contract.endDate }}</span>
            </div>
            <div class="info-row">
              <span class="label">签订日期：</span>
              <span class="value">{{ contract.signDate }}</span>
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

.contract-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contract-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.contract-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.contract-title {
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
  min-width: 80px;
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
  
  .contract-item {
    padding: 12px;
  }
}
</style>
