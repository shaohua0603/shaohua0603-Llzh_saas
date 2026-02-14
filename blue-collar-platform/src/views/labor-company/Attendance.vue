<template>
  <div class="labor-company-attendance">
    <h2 class="page-title">考勤管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-input
        v-model="searchQuery"
        placeholder="搜索工人姓名或身份证号"
        prefix-icon="Search"
        style="width: 300px; margin-right: 16px"
      />
      <el-date-picker
        v-model="attendanceDate"
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
        <el-option label="出勤" value="present" />
        <el-option label="缺勤" value="absent" />
        <el-option label="请假" value="leave" />
        <el-option label="迟到" value="late" />
        <el-option label="早退" value="early" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
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
    <el-table :data="attendanceList" style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="id" label="考勤ID" width="100" />
      <el-table-column prop="workerName" label="工人姓名" width="120" />
      <el-table-column prop="idCard" label="身份证号" width="180" />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="checkInTime" label="上班时间" width="150" />
      <el-table-column prop="checkOutTime" label="下班时间" width="150" />
      <el-table-column prop="workHours" label="工作时长" width="100" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleViewAttendance(scope.row)">
            查看
          </el-button>
          <el-button size="small" type="success" @click="handleEditAttendance(scope.row)">
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
.labor-company-attendance {
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

/* 考勤统计 */
.attendance-stats {
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
  .labor-company-attendance {
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
  
  .attendance-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-title {
    font-size: 20px;
  }
}
</style>