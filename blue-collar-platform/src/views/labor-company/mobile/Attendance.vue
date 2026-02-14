<template>
  <div class="labor-company-mobile-attendance">
    <h2 class="page-title">考勤管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-date-picker
        v-model="attendanceDate"
        type="month"
        placeholder="选择月份"
        style="margin-bottom: 16px; width: 100%"
      />
      <el-select
        v-model="statusFilter"
        placeholder="筛选状态"
        style="margin-bottom: 16px; width: 100%"
      >
        <el-option label="全部" value="" />
        <el-option label="出勤" value="present" />
        <el-option label="缺勤" value="absent" />
        <el-option label="请假" value="leave" />
        <el-option label="迟到" value="late" />
        <el-option label="早退" value="early" />
      </el-select>
      <el-input
        v-model="searchQuery"
        placeholder="搜索工人姓名"
        prefix-icon="Search"
        style="margin-bottom: 16px; width: 100%"
      />
      <el-button type="primary" @click="handleSearch" style="width: 100%">搜索</el-button>
    </div>
    
    <!-- 考勤统计 -->
    <div class="attendance-stats">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ attendanceStats.totalWorkers }}</div>
          <div class="stat-label">总人数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ attendanceStats.presentCount }}</div>
          <div class="stat-label">出勤人数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ attendanceStats.absentCount }}</div>
          <div class="stat-label">缺勤人数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ attendanceStats.attendanceRate }}%</div>
          <div class="stat-label">出勤率</div>
        </div>
      </el-card>
    </div>
    
    <!-- 考勤列表 -->
    <div class="attendance-list">
      <el-card 
        v-for="attendance in attendanceList" 
        :key="attendance.id" 
        class="attendance-card"
      >
        <div class="attendance-info">
          <div class="worker-name">{{ attendance.workerName }}</div>
          <div class="attendance-details">
            <div class="detail-item">
              <span class="detail-label">日期：</span>
              <span class="detail-value">{{ attendance.date }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">状态：</span>
              <el-tag :type="getStatusType(attendance.status)">
                {{ getStatusText(attendance.status) }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">上班时间：</span>
              <span class="detail-value">{{ attendance.checkInTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">下班时间：</span>
              <span class="detail-value">{{ attendance.checkOutTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">工作时长：</span>
              <span class="detail-value">{{ attendance.workHours }}小时</span>
            </div>
          </div>
          <div class="attendance-actions">
            <el-button size="small" type="primary" @click="handleViewAttendance(attendance)">
              查看
            </el-button>
            <el-button size="small" type="success" @click="handleEditAttendance(attendance)">
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
        :total="totalAttendance"
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
const attendanceDate = ref('')
const statusFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalAttendance = ref(0)

// 考勤统计
const attendanceStats = ref({
  totalWorkers: 0,
  presentCount: 0,
  absentCount: 0,
  attendanceRate: 0
})

// 考勤列表
const attendanceList = ref<any[]>([])

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'present': 'success',
    'absent': 'danger',
    'leave': 'warning',
    'late': 'warning',
    'early': 'warning'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'present': '出勤',
    'absent': '缺勤',
    'leave': '请假',
    'late': '迟到',
    'early': '早退'
  }
  return textMap[status] || status
}

// 搜索
const handleSearch = async () => {
  currentPage.value = 1
  await fetchAttendance()
}

// 查看考勤
const handleViewAttendance = (attendance: any) => {
  console.log('查看考勤:', attendance)
  // 这里可以跳转到考勤详情页
}

// 编辑考勤
const handleEditAttendance = (attendance: any) => {
  console.log('编辑考勤:', attendance)
  // 这里可以跳转到编辑考勤页面
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchAttendance()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  fetchAttendance()
}

// 获取考勤数据
const fetchAttendance = async () => {
  try {
    // 获取考勤统计
    const statsResponse = await axios.get('/api/labor-company/attendance-stats', {
      params: {
        date: attendanceDate.value
      }
    })
    attendanceStats.value = statsResponse.data
    
    // 获取考勤列表
    const listResponse = await axios.get('/api/labor-company/attendance', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
        date: attendanceDate.value,
        status: statusFilter.value
      }
    })
    attendanceList.value = listResponse.data.items
    totalAttendance.value = listResponse.data.total
  } catch (error) {
    console.error('获取考勤数据失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  // 设置默认月份为当前月
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  attendanceDate.value = `${year}-${month}`
  
  fetchAttendance()
})
</script>

<style scoped>
.labor-company-mobile-attendance {
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

/* 考勤统计 */
.attendance-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
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
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #606266;
}

/* 考勤列表 */
.attendance-list {
  margin-bottom: 20px;
}

.attendance-card {
  margin-bottom: 16px;
}

.attendance-info {
  display: flex;
  flex-direction: column;
}

.worker-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #303133;
}

.attendance-details {
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

.attendance-actions {
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
  .attendance-actions {
    flex-direction: column;
  }
  
  .attendance-actions .el-button {
    width: 100%;
  }
  
  .attendance-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>