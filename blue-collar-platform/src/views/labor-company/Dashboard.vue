<template>
  <div class="labor-company-dashboard">
    <h2 class="page-title">仪表盘</h2>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalWorkers }}</div>
          <div class="stat-label">总工人数量</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.activeWorkers }}</div>
          <div class="stat-label">在职工人</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.recruitmentCount }}</div>
          <div class="stat-label">招聘需求</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.attendanceRate }}%</div>
          <div class="stat-label">出勤率</div>
        </div>
      </el-card>
    </div>
    
    <!-- 最近招聘 -->
    <div class="section">
      <h3 class="section-title">最近招聘</h3>
      <el-table :data="recentRecruitments" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="招聘标题" />
        <el-table-column prop="factoryName" label="工厂名称" width="180" />
        <el-table-column prop="requiredWorkers" label="需求人数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" width="180" />
      </el-table>
    </div>
    
    <!-- 工人考勤统计 -->
    <div class="section">
      <h3 class="section-title">工人考勤统计</h3>
      <el-table :data="attendanceStats" style="width: 100%">
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="totalWorkers" label="总人数" width="100" />
        <el-table-column prop="present" label="出勤" width="100" />
        <el-table-column prop="absent" label="缺勤" width="100" />
        <el-table-column prop="leave" label="请假" width="100" />
        <el-table-column prop="rate" label="出勤率" width="120">
          <template #default="scope">
            <el-progress 
              :percentage="scope.row.rate" 
              :stroke-width="8" 
              :color="getProgressColor(scope.row.rate)"
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
  totalWorkers: 0,
  activeWorkers: 0,
  recruitmentCount: 0,
  attendanceRate: 0
})

// 最近招聘
const recentRecruitments = ref<any[]>([])

// 考勤统计
const attendanceStats = ref<any[]>([])

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'active': 'success',
    'pending': 'warning',
    'completed': 'info'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'active': '进行中',
    'pending': '待处理',
    'completed': '已完成'
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
    const statsResponse = await axios.get('/api/labor-company/stats')
    stats.value = statsResponse.data
    
    // 获取最近招聘
    const recruitmentResponse = await axios.get('/api/labor-company/recruitments?limit=5')
    recentRecruitments.value = recruitmentResponse.data
    
    // 获取考勤统计
    const attendanceResponse = await axios.get('/api/labor-company/attendance-stats')
    attendanceStats.value = attendanceResponse.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})
</script>

<style scoped>
.labor-company-dashboard {
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
  .labor-company-dashboard {
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