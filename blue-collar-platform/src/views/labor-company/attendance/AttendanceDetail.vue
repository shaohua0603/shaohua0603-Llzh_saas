<template>
  <div class="detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>考勤基本信息</span>
          </div>
        </template>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">工人姓名：</span>
            <span class="info-value">{{ attendanceInfo.workerName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">手机号：</span>
            <span class="info-value">{{ attendanceInfo.phone || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">考勤日期：</span>
            <span class="info-value">{{ attendanceInfo.attendanceDate || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">考勤状态：</span>
            <span class="info-value">
              <el-tag :type="getStatusType(attendanceInfo.status)">
                {{ getStatusText(attendanceInfo.status) }}
              </el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">上班时间：</span>
            <span class="info-value">{{ attendanceInfo.checkInTime || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">下班时间：</span>
            <span class="info-value">{{ attendanceInfo.checkOutTime || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">工作时长：</span>
            <span class="info-value">{{ attendanceInfo.workHours ? attendanceInfo.workHours + '小时' : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">创建时间：</span>
            <span class="info-value">{{ attendanceInfo.createTime || '-' }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 考勤信息
const attendanceInfo = ref({
  workerName: '张三',
  phone: '13800138000',
  attendanceDate: '2024-01-15',
  status: 'normal',
  checkInTime: '08:30:00',
  checkOutTime: '17:30:00',
  workHours: 8,
  createTime: '2024-01-15 18:00:00'
})

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    normal: 'success',
    late: 'warning',
    early: 'warning',
    absent: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    normal: '正常',
    late: '迟到',
    early: '早退',
    absent: '缺勤'
  }
  return textMap[status] || status
}

// 编辑
const handleEdit = () => {
  router.push({
    path: `/tenant/attendance-edit/${route.params.id}`
  })
}

// 删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这条考勤记录吗？', '提示', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    goBack()
  } catch {
    // 用户取消
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/attendance')
}

// 生命周期
onMounted(() => {
  // 模拟获取考勤详情数据
  // 在实际项目中，这里应该调用API获取数据
  const id = route.params.id
  if (id) {
    // 模拟API调用
    setTimeout(() => {
      // 这里可以根据id获取具体数据
    }, 500)
  }
})
</script>

<style scoped>
.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
}

.mb-4 {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 500;
  margin-right: 8px;
  min-width: 100px;
  color: #606266;
}

.info-value {
  flex: 1;
  color: #303133;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
  
  .detail-content {
    padding-bottom: 120px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>