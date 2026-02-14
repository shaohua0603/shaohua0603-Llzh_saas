<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'
import { Loading, InfoFilled, Timer, Money } from '@element-plus/icons-vue'

const router = useRouter()

const attendanceData = ref([])
const loading = ref(true)
const currentMonth = ref(new Date().toISOString().slice(0, 7)) // 格式：YYYY-MM

// 模拟考勤数据
const mockAttendanceData = [
  {
    id: 1,
    workerId: 1,
    workerName: '张三',
    date: '2026-02-01',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    hours: 8
  },
  {
    id: 2,
    workerId: 1,
    workerName: '张三',
    date: '2026-02-02',
    status: '正常',
    checkInTime: '08:05',
    checkOutTime: '17:00',
    hours: 8
  },
  {
    id: 3,
    workerId: 1,
    workerName: '张三',
    date: '2026-02-03',
    status: '迟到',
    checkInTime: '08:30',
    checkOutTime: '17:00',
    hours: 7.5
  },
  {
    id: 4,
    workerId: 1,
    workerName: '张三',
    date: '2026-02-04',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '18:00',
    hours: 10
  },
  {
    id: 5,
    workerId: 1,
    workerName: '张三',
    date: '2026-02-05',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    hours: 8
  },
  {
    id: 6,
    workerId: 1,
    workerName: '张三',
    date: '2026-02-08',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    hours: 8
  },
  {
    id: 7,
    workerId: 1,
    workerName: '张三',
    date: '2026-02-09',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    hours: 8
  },
  {
    id: 8,
    workerId: 1,
    workerName: '张三',
    date: '2026-02-10',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    hours: 8
  }
]

// 获取考勤数据
const getAttendanceData = async () => {
  loading.value = true
  try {
    // 模拟异步请求
    setTimeout(() => {
      // 筛选当前月份的考勤数据
      const filteredData = mockAttendanceData.filter(item => {
        return item.date.startsWith(currentMonth.value)
      })
      attendanceData.value = filteredData
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取考勤数据失败:', error)
    ElMessage.error('获取考勤数据失败，请稍后重试')
    loading.value = false
  }
}

// 计算考勤统计
const getAttendanceStats = () => {
  const totalDays = attendanceData.value.length
  const normalDays = attendanceData.value.filter(item => item.status === '正常').length
  const lateDays = attendanceData.value.filter(item => item.status === '迟到').length
  const absentDays = attendanceData.value.filter(item => item.status === '缺勤').length
  const totalHours = attendanceData.value.reduce((sum, item) => sum + item.hours, 0)
  
  return {
    totalDays,
    normalDays,
    lateDays,
    absentDays,
    totalHours
  }
}

// 页面加载时获取数据
onMounted(() => {
  getAttendanceData()
})
</script>

<template>
  <div class="worker-attendance">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>考勤</h2>
      <el-button type="primary" @click="router.push('/worker/leave')">请假</el-button>
    </div>
    
    <!-- 月份选择 -->
    <div class="month-selector">
      <el-date-picker
        v-model="currentMonth"
        type="month"
        placeholder="选择月份"
        format="YYYY 年 MM 月"
        value-format="YYYY-MM"
        @change="getAttendanceData"
      />
    </div>
    
    <!-- 考勤统计 -->
    <div class="attendance-stats">
      <div class="stat-item">
        <div class="stat-value">{{ getAttendanceStats().totalDays }}</div>
        <div class="stat-label">总天数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ getAttendanceStats().normalDays }}</div>
        <div class="stat-label">正常</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ getAttendanceStats().lateDays }}</div>
        <div class="stat-label">迟到</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ getAttendanceStats().totalHours }}</div>
        <div class="stat-label">总工时</div>
      </div>
    </div>
    
    <!-- 考勤列表 -->
    <div class="attendance-list">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="attendanceData.length === 0" class="empty">
        <el-icon><InfoFilled /></el-icon>
        <span>暂无考勤记录</span>
      </div>
      <div v-else class="attendance-items">
        <div v-for="item in attendanceData" :key="item.id" class="attendance-item">
          <div class="attendance-date">
            <span class="date">{{ item.date }}</span>
            <el-tag :type="item.status === '正常' ? 'success' : item.status === '迟到' ? 'warning' : 'danger'">
              {{ item.status }}
            </el-tag>
          </div>
          <div class="attendance-time">
            <p>
              <el-icon><Timer /></el-icon>
              上班: {{ item.checkInTime }}
            </p>
            <p>
              <el-icon><Timer /></el-icon>
              下班: {{ item.checkOutTime }}
            </p>
            <p>
              <el-icon><Money /></el-icon>
              工时: {{ item.hours }}小时
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-attendance {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.month-selector {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.attendance-stats {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
  border-radius: 10px;
  margin: 0 15px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.attendance-list {
  padding: 0 15px 20px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.attendance-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attendance-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.attendance-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.date {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.attendance-time p {
  margin: 5px 0;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
}

.attendance-time p i {
  margin-right: 8px;
  color: #999;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .month-selector {
    padding: 12px 15px;
  }
  
  .attendance-stats {
    margin: 0 10px 10px;
    padding: 12px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .attendance-list {
    padding: 0 10px 20px;
  }
  
  .attendance-item {
    padding: 12px;
  }
  
  .date {
    font-size: 13px;
  }
  
  .attendance-time p {
    font-size: 12px;
  }
}
</style>