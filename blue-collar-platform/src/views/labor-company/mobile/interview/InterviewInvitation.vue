<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const invitations = ref<any[]>([])
const loading = ref(true)

const getInvitations = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    invitations.value = [
      {
        id: 1,
        workerName: '张三',
        factory: '富士康科技',
        position: '操作工',
        interviewDate: '2026-02-20',
        interviewTime: '09:00',
        address: '深圳龙华富士康南门',
        contact: '王主管 138****1234',
        status: '已邀约',
        type: '面试邀约'
      },
      {
        id: 2,
        workerName: '李四',
        factory: '华为技术',
        position: '质检员',
        interviewDate: '2026-02-21',
        interviewTime: '10:00',
        address: '东莞松山湖华为基地',
        contact: '李主管 139****5678',
        status: '待邀约',
        type: '面试邀约'
      },
      {
        id: 3,
        workerName: '王五',
        factory: '京东物流',
        position: '仓库管理员',
        interviewDate: '2026-02-22',
        interviewTime: '14:00',
        address: '广州黄埔京东物流园',
        contact: '张主管 137****9012',
        status: '已邀约',
        type: '面试邀约'
      }
    ]
  } catch (error) {
    ElMessage.error('获取面试邀约信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (item: any) => {
  router.push(`/tenant/interview/invitation-detail/${item.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '待邀约': 'warning',
    '已邀约': 'success',
    '已确认': 'primary',
    '已取消': 'info'
  }
  return types[status] || 'info'
}

onMounted(() => {
  getInvitations()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>面试邀约</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="invitations.length === 0" class="empty-state">
        <p>暂无面试邀约</p>
      </div>
      
      <div v-else class="invitation-list">
        <div 
          v-for="item in invitations" 
          :key="item.id" 
          class="invitation-item"
          @click="goToDetail(item)"
        >
          <div class="item-header">
            <div class="worker-info">
              <span class="worker-name">{{ item.workerName }}</span>
              <span class="invitation-type">{{ item.type }}</span>
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
              <span class="label">面试日期：</span>
              <span class="value">{{ item.interviewDate }} {{ item.interviewTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">面试地址：</span>
              <span class="value">{{ item.address }}</span>
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

.invitation-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.invitation-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.invitation-item:hover {
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

.invitation-type {
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

.info-row .Label {
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
  
  .invitation-item {
    padding: 12px;
  }
}
</style>
