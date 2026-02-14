<template>
  <div class="admin-dashboard">
    <h2 class="page-title">仪表盘</h2>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalTenants }}</div>
          <div class="stat-label">总租户数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalWorkers }}</div>
          <div class="stat-label">总工人数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalRecruitments }}</div>
          <div class="stat-label">招聘需求数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.idleWorkers }}</div>
          <div class="stat-label">空闲工人数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalPackages }}</div>
          <div class="stat-label">套餐数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.activePackages }}</div>
          <div class="stat-label">活跃套餐</div>
        </div>
      </el-card>
    </div>
    
    <!-- 租户统计 -->
    <div class="section">
      <h3 class="section-title">租户统计</h3>
      <el-table :data="tenantStats" style="width: 100%">
        <el-table-column prop="type" label="租户类型" width="120" />
        <el-table-column prop="count" label="数量" width="100" />
        <el-table-column prop="activeCount" label="活跃数量" width="120" />
        <el-table-column prop="activeRate" label="活跃率" width="120">
          <template #default="scope">
            <el-progress 
              :percentage="scope.row.activeRate" 
              :stroke-width="8" 
              :color="getProgressColor(scope.row.activeRate)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 最近注册用户 -->
    <div class="section">
      <h3 class="section-title">最近注册用户</h3>
      <el-table :data="recentUsers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">
              {{ getRoleText(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerDate" label="注册时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 招聘需求统计 -->
    <div class="section">
      <h3 class="section-title">招聘需求统计</h3>
      <el-table :data="recruitmentStats" style="width: 100%">
        <el-table-column prop="department" label="部门" width="150" />
        <el-table-column prop="count" label="需求数" width="100" />
        <el-table-column prop="filledCount" label="已招人数" width="120" />
        <el-table-column prop="fillRate" label="完成率" width="120">
          <template #default="scope">
            <el-progress 
              :percentage="scope.row.fillRate" 
              :stroke-width="8" 
              :color="getProgressColor(scope.row.fillRate)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 统计数据
const stats = ref({
  totalTenants: 0,
  totalWorkers: 0,
  totalRecruitments: 0,
  idleWorkers: 0,
  totalPackages: 0,
  activePackages: 0
})

// 租户统计
const tenantStats = ref<any[]>([])

// 最近注册用户
const recentUsers = ref<any[]>([])

// 招聘需求统计
const recruitmentStats = ref<any[]>([])

// 获取角色类型
const getRoleType = (role: string) => {
  const typeMap: Record<string, string> = {
    'worker': 'primary',
    'labor_company': 'success',
    'factory': 'warning',
    'platform_admin': 'danger'
  }
  return typeMap[role] || 'default'
}

// 获取角色文本
const getRoleText = (role: string) => {
  const textMap: Record<string, string> = {
    'worker': '工人',
    'labor_company': '劳务公司',
    'factory': '工厂',
    'platform_admin': '平台管理员'
  }
  return textMap[role] || role
}

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
    'active': '活跃',
    'inactive': '非活跃',
    'pending': '待审核'
  }
  return textMap[status] || status
}

// 获取进度条颜色
const getProgressColor = (rate: number) => {
  if (rate >= 90) return '#67c23a'
  if (rate >= 80) return '#e6a23c'
  return '#f56c6c'
}

// 初始化数据
onMounted(async () => {
  try {
    // 获取统计数据
    const statsResponse = await axios.get('/api/admin/stats')
    stats.value = statsResponse.data
    
    // 获取租户统计
    const tenantResponse = await axios.get('/api/admin/tenant-stats')
    tenantStats.value = tenantResponse.data
    
    // 获取最近注册用户
    const userResponse = await axios.get('/api/admin/users?limit=5')
    recentUsers.value = userResponse.data
    
    // 获取招聘需求统计
    const recruitmentResponse = await axios.get('/api/admin/recruitment-stats')
    recruitmentStats.value = recruitmentResponse.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})
</script>

<style scoped>
.admin-dashboard {
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

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

/* 章节 */
.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #303133;
}

/* 表格 */
:deep(.el-table) {
  margin-top: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .admin-dashboard {
    padding: 16px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-number {
    font-size: 24px;
  }
}
</style>