<template>
  <div class="factory-dashboard">
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
  padding: var(--spacing-xl);
  background-color: var(--color-bg-page);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxxl);
}

.stat-card {
  height: 140px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-lighter);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 1;
}

.stat-number {
  font-size: 36px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all var(--transition-base);
}

.stat-card:hover .stat-number {
  transform: scale(1.1);
}

.stat-label {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.5px;
}

/* 章节 */
.section {
  margin-bottom: var(--spacing-xxxl);
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.section-title {
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
  letter-spacing: 0.5px;
  position: relative;
  padding-left: var(--spacing-lg);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border-radius: var(--radius-sm);
}

/* 表格 */
:deep(.el-table) {
  margin-top: var(--spacing-lg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-lighter);
}

:deep(.el-table th.el-table__cell) {
  background: linear-gradient(180deg, var(--color-bg-page) 0%, #f0f2f5 100%);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 2px solid var(--color-border-light);
}

:deep(.el-table td.el-table__cell) {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-lighter);
  transition: background-color var(--transition-fast);
}

:deep(.el-table tr:hover > td.el-table__cell) {
  background-color: var(--bg-color-hover) !important;
}

:deep(.el-table .el-table__row) {
  transition: all var(--transition-fast);
}

:deep(.el-table .el-table__row:hover) {
  transform: scale(1.005);
  box-shadow: var(--shadow-xs);
}

/* 标签样式优化 */
:deep(.el-tag) {
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  padding: 4px 12px;
  height: 28px;
  line-height: 20px;
  transition: all var(--transition-fast);
}

:deep(.el-tag:hover) {
  transform: scale(1.05);
  box-shadow: var(--shadow-sm);
}

/* 响应式设计 */
/* 移动端适配 (<768px) */
@media screen and (max-width: 768px) {
  .factory-dashboard {
    padding: var(--spacing-lg);
  }

  .page-title,
  .section-title {
    padding-left: var(--spacing-md);
    font-size: var(--font-size-large);
  }

  .page-title::before,
  .section-title::before {
    height: 18px;
    width: 3px;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }

  .stat-card {
    height: 120px;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-label {
    font-size: var(--font-size-small);
  }

  :deep(.el-table) {
    font-size: var(--font-size-small);
  }

  :deep(.el-table th.el-table__cell),
  :deep(.el-table td.el-table__cell) {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  /* 表格横向滚动 */
  :deep(.el-table__body-wrapper) {
    overflow-x: auto;
  }

  /* 隐藏非关键列 */
  :deep(.el-table .el-table__cell:nth-child(6)),
  :deep(.el-table .el-table__cell:nth-child(7)) {
    display: none;
  }

  :deep(.el-tag) {
    padding: 2px 8px;
    height: 24px;
    font-size: var(--font-size-extra-small);
  }
}

/* 超小屏幕适配 (<480px) */
@media screen and (max-width: 480px) {
  .factory-dashboard {
    padding: var(--spacing-md);
  }

  .page-title,
  .section-title {
    font-size: var(--font-size-medium);
    padding-left: var(--spacing-sm);
  }

  .page-title::before,
  .section-title::before {
    height: 16px;
    width: 2px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .stat-card {
    height: 100px;
  }

  .stat-number {
    font-size: 24px;
  }

  .stat-label {
    font-size: var(--font-size-extra-small);
  }

  :deep(.el-table) {
    font-size: var(--font-size-extra-small);
  }

  :deep(.el-table th.el-table__cell),
  :deep(.el-table td.el-table__cell) {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  /* 更多列隐藏 */
  :deep(.el-table .el-table__cell:nth-child(4)),
  :deep(.el-table .el-table__cell:nth-child(5)),
  :deep(.el-table .el-table__cell:nth-child(6)),
  :deep(.el-table .el-table__cell:nth-child(7)) {
    display: none;
  }

  :deep(.el-tag) {
    padding: 2px 6px;
    height: 22px;
    font-size: 10px;
  }
}

/* 平板设备适配 (768px - 1024px) */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }

  .stat-card {
    height: 130px;
  }

  .stat-number {
    font-size: 32px;
  }

  :deep(.el-table) {
    font-size: var(--font-size-small);
  }

  :deep(.el-table th.el-table__cell),
  :deep(.el-table td.el-table__cell) {
    padding: var(--spacing-sm) var(--spacing-lg);
  }

  :deep(.el-tag) {
    padding: 3px 10px;
    height: 26px;
    font-size: var(--font-size-small);
  }
}

/* 大屏幕优化 (>1440px) */
@media screen and (min-width: 1440px) {
  .factory-dashboard {
    padding: var(--spacing-xxl);
  }

  .page-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 20px;
  }

  .stats-cards {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-xxl);
  }

  .stat-card {
    height: 160px;
  }

  .stat-number {
    font-size: 40px;
  }

  .stat-label {
    font-size: var(--font-size-large);
  }

  :deep(.el-table) {
    font-size: var(--font-size-base);
  }

  :deep(.el-table th.el-table__cell),
  :deep(.el-table td.el-table__cell) {
    padding: var(--spacing-lg) var(--spacing-xxl);
  }

  :deep(.el-tag) {
    padding: 4px 14px;
    height: 30px;
    font-size: var(--font-size-base);
  }
}

/* 超大屏幕优化 (>1920px) */
@media screen and (min-width: 1920px) {
  .factory-dashboard {
    padding: var(--spacing-xxxl);
  }

  .page-title {
    font-size: 26px;
  }

  .section-title {
    font-size: 22px;
  }

  .stats-cards {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-xxxl);
  }

  .stat-card {
    height: 180px;
  }

  .stat-number {
    font-size: 48px;
  }

  .stat-label {
    font-size: var(--font-size-large);
  }

  :deep(.el-table th.el-table__cell),
  :deep(.el-table td.el-table__cell) {
    padding: var(--spacing-xl) var(--spacing-xxxl);
  }

  :deep(.el-tag) {
    padding: 5px 16px;
    height: 32px;
    font-size: var(--font-size-large);
  }
}
</style>