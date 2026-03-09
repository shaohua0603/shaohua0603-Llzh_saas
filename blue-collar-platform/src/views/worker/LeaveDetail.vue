<template>
  <div class="worker-leave-detail">
    <BackButton />
    <div class="page-header">
      <h2>请假详情</h2>
    </div>
    
    <!-- 请假详情 -->
    <div class="leave-detail-section">
      <div v-if="leaveDetail" class="leave-detail-card">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3>基本信息</h3>
          <div class="detail-item">
            <span class="label">工厂:</span>
            <span>{{ leaveDetail.factory || '无' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">区域:</span>
            <span>{{ leaveDetail.area || '无' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">产线:</span>
            <span>{{ leaveDetail.productionLine || '无' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">请假类型:</span>
            <el-tag :type="getLeaveType(leaveDetail.type)">{{ getLeaveTypeText(leaveDetail.type) }}</el-tag>
          </div>
          <div class="detail-item">
            <span class="label">请假原因:</span>
            <span>{{ leaveDetail.reason || '无' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">开始时间:</span>
            <span>{{ leaveDetail.startDate }}</span>
          </div>
          <div class="detail-item">
            <span class="label">结束时间:</span>
            <span>{{ leaveDetail.endDate }}</span>
          </div>
          <div class="detail-item">
            <span class="label">申请时间:</span>
            <span>{{ leaveDetail.applyDate }}</span>
          </div>
          <div class="detail-item">
            <span class="label">状态:</span>
            <el-tag :type="getStatusType(leaveDetail.status)">{{ getStatusText(leaveDetail.status) }}</el-tag>
          </div>
          <div class="detail-item">
            <span class="label">销假状态:</span>
            <el-tag :type="leaveDetail.cancelled ? 'info' : 'default'">{{ leaveDetail.cancelled ? '已销假' : '未销假' }}</el-tag>
          </div>
        </div>
        
        <!-- 审批记录 -->
        <div class="detail-section">
          <h3>审批记录</h3>
          <div v-if="leaveDetail.approvalRecords && leaveDetail.approvalRecords.length > 0" class="approval-records">
            <div v-for="(record, index) in leaveDetail.approvalRecords" :key="record.id" class="approval-record">
              <div class="approval-header">
                <div class="approval-step">{{ record.step }}</div>
                <el-tag :type="record.status === '已批准' || record.status === '已提交' || record.status === '已登记' ? 'success' : 'danger'">
                  {{ record.status }}
                </el-tag>
              </div>
              <div class="approval-body">
                <div class="approval-info">
                  <span class="operator">{{ record.operator }}</span>
                  <span class="time">{{ record.time }}</span>
                </div>
                <div class="approval-comment" v-if="record.comment">
                  <span class="comment-label">备注:</span>
                  <span>{{ record.comment }}</span>
                </div>
              </div>
              <div class="approval-line" v-if="index < leaveDetail.approvalRecords.length - 1"></div>
            </div>
          </div>
          <div v-else class="empty-approval">
            <el-icon><i class="el-icon-info"></i></el-icon>
            <span>暂无审批记录</span>
          </div>
        </div>
      </div>
      <div v-else class="loading-detail">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
    </div>
    
    <!-- 底部按钮 -->
    <div class="detail-footer" v-if="leaveDetail">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button 
        v-if="leaveDetail.status === 'approved' && !leaveDetail.cancelled" 
        type="success" 
        @click="handleCancelLeave"
      >
        <el-icon><Check /></el-icon>
        销假
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '../../components/BackButton.vue'
import { ArrowLeft, Check } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const leaveDetail = ref<any>(null)

// 模拟请假详情数据
const mockLeaveDetail = {
  id: '1',
  factory: '工厂A',
  area: '区域1',
  productionLine: '产线1',
  type: 'personal',
  reason: '家中有事需要处理',
  startDate: '2024-01-15 08:00',
  endDate: '2024-01-17 18:00',
  applyDate: '2024-01-10 14:30',
  status: 'approved',
  cancelled: false,
  approvalRecords: [
    {
      id: '1',
      step: '1',
      operator: '张三',
      time: '2024-01-10 16:00',
      status: '已批准',
      comment: '同意请假'
    },
    {
      id: '2',
      step: '2',
      operator: '李四',
      time: '2024-01-11 09:30',
      status: '已批准',
      comment: '同意'
    }
  ]
}

// 获取请假类型标签
const getLeaveType = (type: string) => {
  const typeMap: Record<string, string> = {
    'personal': 'primary',
    'sick': 'warning',
    'marriage': 'success',
    'maternity': 'info',
    'other': 'default'
  }
  return typeMap[type] || 'default'
}

// 获取请假类型文本
const getLeaveTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    'personal': '事假',
    'sick': '病假',
    'marriage': '婚假',
    'maternity': '产假',
    'other': '其他'
  }
  return textMap[type] || type
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'pending': '待审批',
    'approved': '已批准',
    'rejected': '已拒绝'
  }
  return textMap[status] || status
}

// 获取请假详情
const fetchLeaveDetail = async () => {
  try {
    const id = route.params.id as string
    // 模拟异步请求
    setTimeout(() => {
      // 这里应该根据id从API获取详情，现在使用模拟数据
      leaveDetail.value = mockLeaveDetail
    }, 500)
  } catch (error) {
    console.error('获取请假详情失败:', error)
  }
}

// 处理销假
const handleCancelLeave = () => {
  // 模拟销假操作
  ElMessage.confirm('确定要销假吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 标记为已销假
    leaveDetail.value.cancelled = true
    ElMessage.success('销假成功')
  }).catch(() => {
    // 用户取消
  })
}

// 返回
const goBack = () => {
  router.push('/worker/leave-record')
}

// 初始化数据
onMounted(() => {
  fetchLeaveDetail()
})
</script>

<style scoped>
.worker-leave-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.leave-detail-section {
  margin-top: 20px;
}

.leave-detail-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.detail-item .label {
  width: 100px;
  font-weight: 500;
  color: #606266;
}

.approval-records {
  margin-top: 10px;
}

.approval-record {
  margin-bottom: 20px;
  position: relative;
}

.approval-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.approval-step {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 10px;
}

.approval-body {
  margin-left: 34px;
}

.approval-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.operator {
  font-weight: 500;
}

.time {
  color: #909399;
  font-size: 12px;
}

.approval-comment {
  margin-top: 5px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.comment-label {
  font-weight: 500;
  margin-right: 5px;
}

.approval-line {
  position: absolute;
  left: 11px;
  top: 24px;
  bottom: -20px;
  width: 2px;
  background: #e4e7ed;
}

.empty-approval {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.loading-detail {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}

.loading-detail .is-loading {
  font-size: 24px;
  margin-right: 10px;
}

/* 底部按钮 */
.detail-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 20px;
  margin-top: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.detail-footer .el-button {
  padding: 10px 20px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .worker-leave-detail {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .page-header h2 {
    font-size: 20px;
  }

  .leave-detail-card {
    padding: 15px;
  }

  .detail-section h3 {
    font-size: 16px;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .detail-item .label {
    width: 100%;
    margin-bottom: 5px;
  }

  .approval-body {
    margin-left: 24px;
  }

  .approval-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .detail-footer {
    flex-direction: column;
  }

  .detail-footer .el-button {
    width: 100%;
  }
}
</style>