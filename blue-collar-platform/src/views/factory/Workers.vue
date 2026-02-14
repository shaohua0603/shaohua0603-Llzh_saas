<template>
  <div class="factory-workers">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>工人管理</span>
          <el-input v-model="searchQuery" placeholder="搜索工人姓名或手机号" style="width: 300px" prefix-icon="Search" />
        </div>
      </template>
      
      <el-table :data="filteredWorkers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="工人信息" min-width="200">
          <template #default="scope">
            <div class="worker-info">
              <el-avatar :size="40" :src="scope.row.avatar" />
              <div class="worker-details">
                <div class="worker-name">{{ scope.row.name }}</div>
                <div class="worker-phone">{{ scope.row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="laborCompany" label="劳务公司" width="180" />
        <el-table-column prop="section" label="部门/组别" width="120" />
        <el-table-column prop="position" label="岗位" width="120" />
        <el-table-column prop="employmentType" label="用工类型" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="entryDate" label="入职日期" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewWorkerDetails(scope.row)">查看详情</el-button>
            <el-button size="small" type="primary" @click="manageWorker(scope.row)">管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="workers.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 工人列表数据
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

// 过滤后的工人列表
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

// 查看工人详情
const viewWorkerDetails = (row: any) => {
  console.log('查看工人详情:', row)
}

// 管理工人
const manageWorker = (row: any) => {
  console.log('管理工人:', row)
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
.factory-workers {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.worker-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.worker-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.worker-name {
  font-weight: 500;
}

.worker-phone {
  font-size: 12px;
  color: #606266;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>