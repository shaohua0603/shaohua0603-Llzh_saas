<template>
  <div class="labor-company-salary">
    <h2 class="page-title">结算管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-input
        v-model="searchQuery"
        placeholder="搜索工人姓名或身份证号"
        prefix-icon="Search"
        style="width: 300px; margin-right: 16px"
      />
      <el-date-picker
        v-model="salaryMonth"
        type="month"
        placeholder="选择月份"
        style="width: 200px; margin-right: 16px"
      />
      <el-select
        v-model="statusFilter"
        placeholder="筛选状态"
        style="width: 150px; margin-right: 16px"
      >
        <el-option label="全部" value="" />
        <el-option label="待结算" value="pending" />
        <el-option label="已结算" value="completed" />
        <el-option label="已发放" value="paid" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleGenerateSalary">生成工资单</el-button>
    </div>
    
    <!-- 结算统计 -->
    <div class="salary-stats">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ salaryStats.totalWorkers }}</div>
          <div class="stat-label">总工人数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">¥{{ salaryStats.totalAmount.toFixed(2) }}</div>
          <div class="stat-label">总金额</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ salaryStats.pendingCount }}</div>
          <div class="stat-label">待结算</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ salaryStats.completedCount }}</div>
          <div class="stat-label">已结算</div>
        </div>
      </el-card>
    </div>
    
    <!-- 工资单列表 -->
    <el-table :data="salaryList" style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="id" label="工资单ID" width="120" />
      <el-table-column prop="workerName" label="工人姓名" width="120" />
      <el-table-column prop="idCard" label="身份证号" width="180" />
      <el-table-column prop="month" label="月份" width="120" />
      <el-table-column prop="basicSalary" label="基本工资" width="120" />
      <el-table-column prop="overtimeSalary" label="加班工资" width="120" />
      <el-table-column prop="bonus" label="奖金" width="100" />
      <el-table-column prop="deduction" label="扣除" width="100" />
      <el-table-column prop="totalSalary" label="实发工资" width="120">
        <template #default="scope">
          <span style="font-weight: bold; color: #409eff">
            ¥{{ scope.row.totalSalary.toFixed(2) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleViewSalary(scope.row)">
            查看
          </el-button>
          <el-button size="small" type="success" @click="handleEditSalary(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination" style="margin-top: 16px">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSalary"
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
const salaryMonth = ref('')
const statusFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalSalary = ref(0)

// 结算统计
const salaryStats = ref({
  totalWorkers: 0,
  totalAmount: 0,
  pendingCount: 0,
  completedCount: 0
})

// 工资单列表
const salaryList = ref<any[]>([])

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'pending': 'warning',
    'completed': 'info',
    'paid': 'success'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'pending': '待结算',
    'completed': '已结算',
    'paid': '已发放'
  }
  return textMap[status] || status
}

// 搜索
const handleSearch = async () => {
  currentPage.value = 1
  await fetchSalary()
}

// 生成工资单
const handleGenerateSalary = () => {
  console.log('生成工资单')
  // 这里可以跳转到生成工资单页面
}

// 查看工资单
const handleViewSalary = (salary: any) => {
  console.log('查看工资单:', salary)
  // 这里可以跳转到工资单详情页
}

// 编辑工资单
const handleEditSalary = (salary: any) => {
  console.log('编辑工资单:', salary)
  // 这里可以跳转到编辑工资单页面
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchSalary()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  fetchSalary()
}

// 获取工资数据
const fetchSalary = async () => {
  try {
    // 获取结算统计
    const statsResponse = await axios.get('/api/labor-company/salary-stats', {
      params: {
        month: salaryMonth.value
      }
    })
    salaryStats.value = statsResponse.data
    
    // 获取工资单列表
    const listResponse = await axios.get('/api/labor-company/salary', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
        month: salaryMonth.value,
        status: statusFilter.value
      }
    })
    salaryList.value = listResponse.data.items
    totalSalary.value = listResponse.data.total
  } catch (error) {
    console.error('获取工资数据失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  // 设置默认月份为当前月
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  salaryMonth.value = `${year}-${month}`
  
  fetchSalary()
})
</script>

<style scoped>
.labor-company-salary {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #303133;
}

/* 搜索和筛选 */
.search-filter {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

/* 结算统计 */
.salary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  height: 100px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .labor-company-salary {
    padding: 16px;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-filter > * {
    margin-bottom: 12px;
    margin-right: 0 !important;
  }
  
  .el-input,
  .el-date-picker,
  .el-select {
    width: 100% !important;
  }
  
  .salary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-title {
    font-size: 20px;
  }
}
</style>