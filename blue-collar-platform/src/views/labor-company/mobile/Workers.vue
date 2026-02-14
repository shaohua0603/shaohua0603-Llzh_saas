<template>
  <div class="labor-company-mobile-workers">
    <h2 class="page-title">工人管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-input
        v-model="searchQuery"
        placeholder="搜索工人姓名或身份证号"
        prefix-icon="Search"
        style="margin-bottom: 16px"
      />
      <el-select
        v-model="statusFilter"
        placeholder="筛选状态"
        style="margin-bottom: 16px"
      >
        <el-option label="全部" value="" />
        <el-option label="在职" value="active" />
        <el-option label="离职" value="inactive" />
        <el-option label="待入职" value="pending" />
      </el-select>
      <el-button type="primary" @click="handleSearch" style="width: 100%">搜索</el-button>
    </div>
    
    <!-- 工人列表 -->
    <div class="workers-list">
      <el-card 
        v-for="worker in workersList" 
        :key="worker.id" 
        class="worker-card"
      >
        <div class="worker-info">
          <div class="worker-name">{{ worker.name }}</div>
          <div class="worker-details">
            <div class="detail-item">
              <span class="detail-label">身份证号：</span>
              <span class="detail-value">{{ worker.idCard }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">手机号：</span>
              <span class="detail-value">{{ worker.phone }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">部门：</span>
              <span class="detail-value">{{ worker.department }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">职位：</span>
              <span class="detail-value">{{ worker.position }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">状态：</span>
              <el-tag :type="getStatusType(worker.status)">
                {{ getStatusText(worker.status) }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">入职日期：</span>
              <span class="detail-value">{{ worker.hireDate }}</span>
            </div>
          </div>
          <div class="worker-actions">
            <el-button size="small" type="primary" @click="handleViewWorker(worker)">
              查看
            </el-button>
            <el-button size="small" type="success" @click="handleEditWorker(worker)">
              编辑
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 分页 -->
    <div class="pagination" style="margin-top: 16px">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        :total="totalWorkers"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalWorkers = ref(0)

// 工人列表
const workersList = ref<any[]>([])

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'active': 'success',
    'inactive': 'danger',
    'pending': 'warning'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'active': '在职',
    'inactive': '离职',
    'pending': '待入职'
  }
  return textMap[status] || status
}

// 搜索
const handleSearch = async () => {
  currentPage.value = 1
  await fetchWorkers()
}

// 查看工人
const handleViewWorker = (worker: any) => {
  console.log('查看工人:', worker)
  // 这里可以跳转到工人详情页
}

// 编辑工人
const handleEditWorker = (worker: any) => {
  console.log('编辑工人:', worker)
  // 这里可以跳转到编辑工人页面
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchWorkers()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  fetchWorkers()
}

// 获取工人列表
const fetchWorkers = async () => {
  try {
    const response = await axios.get('/api/labor-company/workers', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
        status: statusFilter.value
      }
    })
    workersList.value = response.data.items
    totalWorkers.value = response.data.total
  } catch (error) {
    console.error('获取工人列表失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  fetchWorkers()
})
</script>

<style scoped>
.labor-company-mobile-workers {
  padding: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

/* 搜索和筛选 */
.search-filter {
  margin-bottom: 20px;
}

/* 工人列表 */
.workers-list {
  margin-bottom: 20px;
}

.worker-card {
  margin-bottom: 16px;
}

.worker-info {
  display: flex;
  flex-direction: column;
}

.worker-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #303133;
}

.worker-details {
  margin-bottom: 16px;
}

.detail-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-label {
  color: #606266;
  margin-right: 8px;
}

.detail-value {
  color: #303133;
}

.worker-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .worker-actions {
    flex-direction: column;
  }
  
  .worker-actions .el-button {
    width: 100%;
  }
}
</style>