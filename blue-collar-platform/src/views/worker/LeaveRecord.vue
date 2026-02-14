<template>
  <div class="worker-leave-record">
    <BackButton />
    <div class="page-header">
      <h2>请假记录</h2>
      <el-button type="primary" @click="goToLeaveApply">
        <i class="el-icon-plus"></i>
        提交请假申请
      </el-button>
    </div>
    
    <!-- 请假记录 -->
    <div class="leave-record-section">
      <div class="leave-record-card">
        <div v-if="leaveRecords.length === 0" class="empty">
          <el-icon><i class="el-icon-info"></i></el-icon>
          <span>暂无请假记录</span>
        </div>
        <div v-else class="leave-items">
          <div v-for="item in leaveRecords" :key="item.id" class="leave-item" @click="openLeaveDetail(item)">
            <div class="leave-header">
              <el-tag :type="getLeaveType(item.type)">
                {{ getLeaveTypeText(item.type) }}
              </el-tag>
              <el-tag :type="getStatusType(item.status)">
                {{ getStatusText(item.status) }}
              </el-tag>
            </div>
            <div class="leave-details">
              <p>
                <i class="el-icon-time"></i>
                开始时间: {{ item.startDate }}
              </p>
              <p>
                <i class="el-icon-time"></i>
                结束时间: {{ item.endDate }}
              </p>
              <p>
                <i class="el-icon-date"></i>
                申请时间: {{ item.applyDate }}
              </p>
            </div>
            <div class="leave-arrow">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// 模拟请假记录数据
const mockLeaveRecords = [
  {
    id: 1,
    type: 'personal',
    startDate: '2026-01-20 08:00',
    endDate: '2026-01-20 17:00',
    status: 'approved',
    applyDate: '2026-01-19 10:00',
    reason: '家中有事需要处理',
    attachments: [],
    approvalRecords: [
      {
        id: 1,
        step: '请假提交',
        operator: '张三',
        time: '2026-01-19 10:00',
        status: '已提交',
        comment: '因家中有事需要请假一天'
      },
      {
        id: 2,
        step: '组长审核',
        operator: '李四（组长）',
        time: '2026-01-19 11:30',
        status: '已批准',
        comment: '同意请假'
      },
      {
        id: 3,
        step: '文员登记',
        operator: '王五（文员）',
        time: '2026-01-19 14:20',
        status: '已登记',
        comment: '已登记请假信息'
      }
    ]
  },
  {
    id: 2,
    type: 'sick',
    startDate: '2026-01-15 08:00',
    endDate: '2026-01-16 17:00',
    status: 'approved',
    applyDate: '2026-01-14 14:00',
    reason: '身体不适需要休息',
    attachments: [],
    approvalRecords: [
      {
        id: 1,
        step: '请假提交',
        operator: '张三',
        time: '2026-01-14 14:00',
        status: '已提交',
        comment: '身体不适需要请假两天'
      },
      {
        id: 2,
        step: '组长审核',
        operator: '李四（组长）',
        time: '2026-01-14 15:45',
        status: '已批准',
        comment: '同意请假，好好休息'
      },
      {
        id: 3,
        step: '文员登记',
        operator: '王五（文员）',
        time: '2026-01-14 16:30',
        status: '已登记',
        comment: '已登记请假信息'
      }
    ]
  },
  {
    id: 3,
    type: 'personal',
    startDate: '2026-02-01 08:00',
    endDate: '2026-02-01 17:00',
    status: 'pending',
    applyDate: '2026-01-30 09:00',
    reason: '需要处理个人事务',
    attachments: [],
    approvalRecords: [
      {
        id: 1,
        step: '请假提交',
        operator: '张三',
        time: '2026-01-30 09:00',
        status: '已提交',
        comment: '需要处理个人事务，请假一天'
      }
    ]
  }
]

// 请假记录
const leaveRecords = ref<any[]>([])

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

// 获取请假记录
const fetchLeaveRecords = async () => {
  try {
    // 模拟异步请求
    setTimeout(() => {
      leaveRecords.value = mockLeaveRecords
    }, 500)
  } catch (error) {
    console.error('获取请假记录失败:', error)
    ElMessage.error('获取请假记录失败，请重试')
  }
}

// 跳转到请假申请页面
const goToLeaveApply = () => {
  router.push('/worker/leave')
}

// 跳转到请假详情页面
const openLeaveDetail = (leave: any) => {
  router.push(`/worker/leave-detail/${leave.id}`)
}

// 初始化数据
onMounted(() => {
  fetchLeaveRecords()
})
</script>

<style scoped>
.worker-leave-record {
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

.leave-record-section {
  padding: 15px;
}

.leave-record-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.leave-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leave-item {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #667eea;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.leave-item:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.leave-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
}

.leave-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.leave-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.leave-id {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.leave-details p {
  margin: 5px 0;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
}

.leave-details p i {
  margin-right: 8px;
  color: #999;
  font-size: 14px;
}

.el-button--primary {
  background-color: #667eea;
  border-color: #667eea;
}

.el-button--primary:hover {
  background-color: #5a6fe0;
  border-color: #5a6fe0;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .leave-record-section {
    padding: 12px;
  }
  

  
  .leave-record-card {
    border-radius: 8px;
    padding: 12px;
  }
  
  .leave-item {
    padding: 12px;
  }
  
  .leave-id {
    font-size: 13px;
  }
  
  .leave-details p {
    font-size: 12px;
  }
  
  .el-button {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .el-button--primary {
    padding: 10px 20px;
  }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .leave-record-section {
    padding: 10px;
  }
  
  .leave-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .leave-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .leave-details p {
    font-size: 11px;
  }
  
  .el-button {
    padding: 7px 14px;
    font-size: 12px;
  }
  
  .el-button--primary {
  padding: 9px 18px;
}
}

/* 详情弹窗样式 */
.leave-detail {
  padding: 10px 0;
}

.detail-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.detail-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.detail-item .label {
  width: 80px;
  font-weight: 500;
  color: #666;
}

.detail-item span:not(.label) {
  color: #333;
}

/* 审批记录样式 */
.approval-records {
  margin-left: 20px;
}

.approval-record {
  position: relative;
  padding-left: 30px;
  margin-bottom: 20px;
}

.approval-record::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #667eea;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #667eea;
}

.approval-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.approval-step {
  font-weight: bold;
  color: #333;
}

.approval-body {
  background-color: #fafafa;
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.approval-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.operator {
  font-weight: 500;
  color: #333;
}

.time {
  color: #999;
  font-size: 12px;
}

.approval-comment {
  margin-top: 8px;
  font-size: 13px;
}

.comment-label {
  font-weight: 500;
  color: #666;
  margin-right: 8px;
}

.approval-line {
  position: absolute;
  left: 5px;
  top: 20px;
  width: 2px;
  height: calc(100% + 10px);
  background-color: #eaeaea;
}

.empty-approval {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.empty-approval i {
  font-size: 32px;
  margin-bottom: 10px;
}

.loading-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.loading-detail i {
  font-size: 32px;
  margin-bottom: 10px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .detail-item .label {
    width: 100%;
  }
  
  .approval-records {
    margin-left: 10px;
  }
  
  .approval-record {
    padding-left: 20px;
  }
  
  .approval-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>