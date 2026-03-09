<template>
  <div class="factory-mobile-workers">
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索工人姓名或手机号" prefix-icon="Search" />
    </div>
    
    <div class="worker-list">
      <el-card shadow="hover" v-for="worker in filteredWorkers" :key="worker.id" class="worker-card">
        <div class="worker-info">
          <el-avatar :size="50" :src="worker.avatar" />
          <div class="worker-details">
            <div class="worker-name">{{ worker.name }}</div>
            <div class="worker-meta">
              <span class="worker-phone">{{ worker.phone }}</span>
              <span class="worker-labor-company">{{ worker.laborCompany }}</span>
            </div>
            <div class="worker-job">
              <span class="worker-section">{{ worker.section }}</span>
              <span class="worker-position">{{ worker.position }}</span>
            </div>
          </div>
          <div class="worker-tags">
            <el-tag :type="getStatusType(worker.status)">{{ worker.status }}</el-tag>
            <el-tag :type="getPaymentType(worker.employmentType)">{{ worker.employmentType }}</el-tag>
          </div>
        </div>
        <div class="worker-actions">
          <el-button size="small" @click="viewWorkerDetails(worker)">查看</el-button>
          <el-button size="small" type="primary" @click="manageWorker(worker)">管理</el-button>
        </div>
      </el-card>
    </div>
    
    <div class="pagination" v-if="filteredWorkers.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        :total="workers.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        small
      />
    </div>
    
    <div class="empty-state" v-else>
      <el-empty description="暂无工人数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 工人信息数据
const workers = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138001',
    avatar: 'https://via.placeholder.com/150',
    laborCompany: '三鼎劳务有限公司',
    section: '生产一部',
    position: '操作工',
    employmentType: '月结',
    status: '在职',
    entryDate: '2025-12-01'
  },
  {
    id: 2,
    name: '李四',
    phone: '13800138002',
    avatar: 'https://via.placeholder.com/150',
    laborCompany: '三鼎劳务有限公司',
    section: '生产二部',
    position: '质检员',
    employmentType: '月结',
    status: '在职',
    entryDate: '2025-11-15'
  },
  {
    id: 3,
    name: '王五',
    phone: '13800138003',
    avatar: 'https://via.placeholder.com/150',
    laborCompany: '诚信劳务服务有限公司',
    section: '生产一部',
    position: '装配工',
    employmentType: '日结',
    status: '在职',
    entryDate: '2026-01-01'
  },
  {
    id: 4,
    name: '赵六',
    phone: '13800138004',
    avatar: 'https://via.placeholder.com/150',
    laborCompany: '诚信劳务服务有限公司',
    section: '生产三部',
    position: '操作工',
    employmentType: '月结',
    status: '离职',
    entryDate: '2025-10-01',
    leaveDate: '2025-12-31'
  }
])

// 搜索查询
const searchQuery = ref('')

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)

// 过滤后的工人信息
const filteredWorkers = computed(() => {
  let result = workers.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(worker => 
      worker.name.toLowerCase().includes(query) || 
      worker.phone.includes(query)
    )
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '在职':
      return 'success'
    case '离职':
      return 'info'
    default:
      return ''
  }
}

// 获取支付类型
const getPaymentType = (paymentType: string) => {
  return paymentType === '日结' ? 'warning' : 'success'
}

// 查看工人详情
const viewWorkerDetails = (worker: any) => {
  console.log('查看工人详情:', worker)
}

// 管理工人
const manageWorker = (worker: any) => {
  console.log('管理工人:', worker)
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
}
</script>

<style scoped>
.factory-mobile-workers {
  padding: 16px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.search-bar {
  margin-bottom: 16px;
}

.worker-list {
  margin-bottom: 16px;
}

.worker-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.worker-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.worker-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.worker-details {
  flex: 1;
}

.worker-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.worker-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 4px;
  font-size: 12px;
  color: #606266;
}

.worker-job {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}

.worker-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.pagination {
  margin-top: 16px;
  padding: 0 16px;
}

.empty-state {
  margin-top: 40px;
  text-align: center;
}
</style>