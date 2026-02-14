<template>
  <div class="factory-dashboard">
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
          <div class="stat-number">{{ stats.trainingCount }}</div>
          <div class="stat-label">培训课程</div>
        </div>
      </el-card>
    </div>
    
    <!-- 最近招聘 -->
    <div class="section">
      <h3 class="section-title">最近招聘</h3>
      <el-table :data="recentRecruitments" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="招聘标题" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="requiredWorkers" label="需求人数" width="100" />
        <el-table-column prop="salary" label="薪资范围" width="150" />
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
    
    <!-- 培训课程 -->
    <div class="section">
      <h3 class="section-title">培训课程</h3>
      <el-table :data="trainingCourses" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="课程名称" />
        <el-table-column prop="type" label="课程类型" width="120">
          <template #default="scope">
            <el-tag :type="getCourseType(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始时间" width="180" />
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
  trainingCount: 0
})

// 最近招聘
const recentRecruitments = ref<any[]>([])

// 培训课程
const trainingCourses = ref<any[]>([])

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

// 获取课程类型
const getCourseType = (type: string) => {
  const typeMap: Record<string, string> = {
    'required': 'danger',
    'elective': 'primary'
  }
  return typeMap[type] || 'default'
}

// 初始化数据
onMounted(async () => {
  try {
    // 获取统计数据
    const statsResponse = await axios.get('/api/factory/stats')
    stats.value = statsResponse.data
    
    // 获取最近招聘
    const recruitmentResponse = await axios.get('/api/factory/recruitments?limit=5')
    recentRecruitments.value = recruitmentResponse.data
    
    // 获取培训课程
    const trainingResponse = await axios.get('/api/factory/training-courses?limit=5')
    trainingCourses.value = trainingResponse.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})
</script>

<style scoped>
.factory-dashboard {
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
  .factory-dashboard {
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