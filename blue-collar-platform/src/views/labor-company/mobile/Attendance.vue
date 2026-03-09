<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const records = ref<any[]>([])
const loading = ref(true)

const getRecords = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    records.value = [
      {
        id: 1,
        workerName: '张三',
        factory: '富士康科技',
        date: '2026-02-15',
        checkInTime: '08:55',
        checkOutTime: '18:05',
        workHours: 9,
        status: '正常',
        type: '出勤'
      },
      {
        id: 2,
        workerName: '李四',
        factory: '华为技术',
        date: '2026-02-15',
        checkInTime: '09:15',
        checkOutTime: '18:00',
        workHours: 8.5,
        status: '迟到',
        type: '出勤'
      },
      {
        id: 3,
        workerName: '王五',
        factory: '京东物流',
        date: '2026-02-15',
        checkInTime: '-',
        checkOutTime: '-',
        workHours: 0,
        status: '缺勤',
        type: '出勤'
      },
      {
        id: 4,
        workerName: '赵六',
        factory: '富士康科技',
        date: '2026-02-15',
        checkInTime: '08:50',
        checkOutTime: '17:50',
        workHours: 8.5,
        status: '正常',
        type: '出勤'
      }
    ]
  } catch (error) {
    ElMessage.error('获取考勤记录失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (record: any) => {
  router.push(`/tenant/attendance-detail/${record.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '正常': 'success',
    '迟到': 'warning',
    '早退': 'warning',
    '缺勤': 'danger'
  }
  return types[status] || 'info'
}

onMounted(() => {
  getRecords()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>考勤管理</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="records.length === 0" class="empty-state">
        <p>暂无考勤记录</p>
      </div>
      
      <div v-else class="record-list">
        <div 
          v-for="record in records" 
          :key="record.id" 
          class="record-item"
          @click="goToDetail(record)"
        >
          <div class="item-header">
            <div class="worker-info">
              <span class="worker-name">{{ record.workerName }}</span>
              <span class="record-type">{{ record.type }}</span>
            </div>
            <el-tag :type="getStatusType(record.status)" size="small">
              {{ record.status }}
            </el-tag>
          </div>
          
          <div class="item-info">
            <div class="info-row">
              <span class="label">用工企业：</span>
              <span class="value">{{ record.factory }}</span>
            </div>
            <div class="info-row">
              <span class="label">考勤日期：</span>
              <span class="value">{{ record.date }}</span>
            </div>
            <div class="info-row">
              <span class="label">上班时间：</span>
              <span class="value">{{ record.checkInTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">下班时间：</span>
              <span class="value">{{ record.checkOutTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">工作时长：</span>
              <span class="value">{{ record.workHours }}小时</span>
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

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.record-item:hover {
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

.record-type {
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

.info-row .Label {
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
  
  .record-item {
    padding: 12px;
  }
}
</style>
