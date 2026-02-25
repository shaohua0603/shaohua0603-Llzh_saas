<template>
  <div class="labor-company-dashboard">
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
// 直接导入Mock.js
import '../../../mock/index.js'

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
    console.log('开始获取数据...')
    // 获取统计数据
    console.log('获取统计数据...')
    const statsResponse = await axios.get('/api/labor-company/stats')
    console.log('统计数据响应:', statsResponse)
    if (statsResponse.data && statsResponse.data.data) {
      stats.value = statsResponse.data.data
    }
    
    // 获取最近招聘
    console.log('获取最近招聘...')
    const recruitmentResponse = await axios.get('/api/labor-company/recruitments?limit=5')
    console.log('最近招聘响应:', recruitmentResponse)
    if (recruitmentResponse.data && recruitmentResponse.data.data) {
      recentRecruitments.value = recruitmentResponse.data.data
    } else {
      // 提供默认数据
      recentRecruitments.value = [
        {
          id: 1,
          title: '生产操作员',
          factoryName: '特斯拉上海工厂',
          requiredWorkers: 50,
          status: 'active',
          createdAt: '2026-01-20 10:00:00'
        },
        {
          id: 2,
          title: '质检员',
          factoryName: '华为技术有限公司',
          requiredWorkers: 20,
          status: 'active',
          createdAt: '2026-01-19 14:30:00'
        },
        {
          id: 3,
          title: '装配工',
          factoryName: '比亚迪股份有限公司',
          requiredWorkers: 30,
          status: 'pending',
          createdAt: '2026-01-18 09:15:00'
        },
        {
          id: 4,
          title: '仓库管理员',
          factoryName: '富士康科技集团',
          requiredWorkers: 15,
          status: 'active',
          createdAt: '2026-01-17 16:45:00'
        },
        {
          id: 5,
          title: '物流操作员',
          factoryName: '京东物流',
          requiredWorkers: 40,
          status: 'completed',
          createdAt: '2026-01-16 11:20:00'
        }
      ]
    }
    
    // 获取考勤统计
    console.log('获取考勤统计...')
    const attendanceResponse = await axios.get('/api/labor-company/attendance-stats')
    console.log('考勤统计响应:', attendanceResponse)
    if (attendanceResponse.data && attendanceResponse.data.data) {
      attendanceStats.value = attendanceResponse.data.data
    }
    
    console.log('数据获取完成!')
    console.log('最近招聘数据:', recentRecruitments.value)
  } catch (error) {
    console.error('获取数据失败:', error)
    // 提供默认数据
    recentRecruitments.value = [
      {
        id: 1,
        title: '生产操作员',
        factoryName: '特斯拉上海工厂',
        requiredWorkers: 50,
        status: 'active',
        createdAt: '2026-01-20 10:00:00'
      },
      {
        id: 2,
        title: '质检员',
        factoryName: '华为技术有限公司',
        requiredWorkers: 20,
        status: 'active',
        createdAt: '2026-01-19 14:30:00'
      },
      {
        id: 3,
        title: '装配工',
        factoryName: '比亚迪股份有限公司',
        requiredWorkers: 30,
        status: 'pending',
        createdAt: '2026-01-18 09:15:00'
      },
      {
        id: 4,
        title: '仓库管理员',
        factoryName: '富士康科技集团',
        requiredWorkers: 15,
        status: 'active',
        createdAt: '2026-01-17 16:45:00'
      },
      {
        id: 5,
        title: '物流操作员',
        factoryName: '京东物流',
        requiredWorkers: 40,
        status: 'completed',
        createdAt: '2026-01-16 11:20:00'
      }
    ]
  }
})
</script>

<style scoped>
.labor-company-dashboard {
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

/* 进度条样式优化 */
:deep(.el-progress) {
  width: 120px;
}

:deep(.el-progress-bar__outer) {
  background-color: var(--color-border-lighter);
  border-radius: var(--radius-round);
}

:deep(.el-progress-bar__inner) {
  border-radius: var(--radius-round);
  transition: all var(--transition-slow);
  background: linear-gradient(90deg, var(--color-success) 0%, var(--color-success-light) 100%);
}

/* 响应式设计 */
/* 移动端适配 (<768px) */
@media screen and (max-width: 768px) {
  .labor-company-dashboard {
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
  :deep(.el-table .el-table__cell:nth-child(5)),
  :deep(.el-table .el-table__cell:nth-child(6)) {
    display: none;
  }

  :deep(.el-progress) {
    width: 80px;
  }
}

/* 超小屏幕适配 (<480px) */
@media screen and (max-width: 480px) {
  .labor-company-dashboard {
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
  :deep(.el-table .el-table__cell:nth-child(6)) {
    display: none;
  }

  :deep(.el-progress) {
    width: 60px;
  }

  :deep(.el-tag) {
    padding: 2px 8px;
    height: 24px;
    font-size: var(--font-size-extra-small);
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

  :deep(.el-progress) {
    width: 100px;
  }
}

/* 大屏幕优化 (>1440px) */
@media screen and (min-width: 1440px) {
  .labor-company-dashboard {
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

  :deep(.el-progress) {
    width: 140px;
  }

  :deep(.el-tag) {
    padding: 4px 14px;
    height: 30px;
    font-size: var(--font-size-base);
  }
}

/* 超大屏幕优化 (>1920px) */
@media screen and (min-width: 1920px) {
  .labor-company-dashboard {
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

  :deep(.el-progress) {
    width: 160px;
  }
}
</style>