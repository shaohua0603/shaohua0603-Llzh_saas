<template>
  <div class="detail-container">
    <div class="detail-content">
      <el-card class="detail-card" v-loading="loading">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border class="mb-4">
          <el-descriptions-item label="请假人">{{ leaveData.workerName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ leaveData.phone }}</el-descriptions-item>
          <el-descriptions-item label="工厂">{{ leaveData.factory || '-' }}</el-descriptions-item>
          <el-descriptions-item label="区域">{{ leaveData.area || '-' }}</el-descriptions-item>
          <el-descriptions-item label="产线">{{ leaveData.productionLine || '-' }}</el-descriptions-item>
          <el-descriptions-item label="请假类型">
            <el-tag :type="getLeaveTypeTag(leaveData.leaveType)">
              {{ getLeaveTypeText(leaveData.leaveType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getStatusTag(leaveData.status)">
              {{ getStatusText(leaveData.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="销假状态">
            <el-tag :type="leaveData.cancelled ? 'info' : 'default'">{{ leaveData.cancelled ? '已销假' : '未销假' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="请假开始日期">{{ leaveData.startDate }}</el-descriptions-item>
          <el-descriptions-item label="请假结束日期">{{ leaveData.endDate }}</el-descriptions-item>
          <el-descriptions-item label="请假天数">{{ leaveData.days || 0 }} 天</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ leaveData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="请假原因" :span="2">{{ leaveData.reason }}</el-descriptions-item>
        </el-descriptions>
        
        <!-- 审核记录 -->
        <div class="mb-4">
          <h4 class="section-title">审核记录</h4>
          <el-timeline v-if="approvalRecords && approvalRecords.length > 0">
            <el-timeline-item
              v-for="(record, index) in approvalRecords"
              :key="index"
              :timestamp="record.approvalTime"
              placement="top"
              :type="record.approvalResult === 'approved' ? 'success' : 'danger'"
            >
              <el-card>
                <div class="approval-record">
                  <div class="record-header">
                    <span class="record-node">{{ record.nodeName }}</span>
                    <el-tag :type="record.approvalResult === 'approved' ? 'success' : 'danger'" size="small">
                      {{ record.approvalResult === 'approved' ? '通过' : '驳回' }}
                    </el-tag>
                  </div>
                  <div class="record-info">
                    <span>审批人：{{ record.approver }}</span>
                  </div>
                  <div v-if="record.approvalComment" class="record-comment">
                    <span>审批意见：{{ record.approvalComment }}</span>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="暂无审核记录" />
        </div>
      </el-card>
    </div>
    
    <!-- 底部悬浮按钮栏 -->
    <div class="detail-footer">
      <el-button @click="handleBack">
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
      <el-button
        v-if="canApprove"
        type="success"
        @click="handleApprove"
      >
        <el-icon><CircleCheck /></el-icon>
        审核
      </el-button>
      <el-button
        v-if="leaveData.status === 'approved' && !leaveData.cancelled"
        type="info"
        @click="handleCancelLeave"
      >
        <el-icon><Check /></el-icon>
        销假
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete, CircleCheck } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const businessId = route.params.id as string

// 请假数据
const leaveData = ref({
  id: '',
  leaveNo: '',
  leaveType: '',
  workerName: '',
  phone: '',
  factory: '',
  area: '',
  productionLine: '',
  startDate: '',
  endDate: '',
  days: 0,
  reason: '',
  createTime: '',
  status: '',
  rejectReason: '',
  cancelled: false
})

// 审批记录
const approvalRecords = ref<any[]>([])

// 是否可以审核
const canApprove = computed(() => {
  return leaveData.value.status === 'pending' || leaveData.value.status === 'processing'
})

// 获取请假类型标签
const getLeaveTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    personal: 'warning',
    sick: 'danger',
    annual: 'success',
    marriage: 'primary',
    bereavement: 'info',
    other: ''
  }
  return tagMap[type] || ''
}

// 获取请假类型文本
const getLeaveTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    personal: '事假',
    sick: '病假',
    annual: '年假',
    marriage: '婚假',
    bereavement: '丧假',
    other: '其他'
  }
  return textMap[type] || type
}

// 获取状态标签
const getStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return tagMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || status
}

// 获取请假详情
const fetchLeaveDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    leaveData.value = {
      id: businessId,
      leaveNo: 'LJ202602260001',
      leaveType: 'personal',
      workerName: '张三',
      phone: '13800138000',
      factory: '工厂A',
      area: '区域1',
      productionLine: '产线1',
      startDate: '2024-01-20 09:00:00',
      endDate: '2024-01-21 18:00:00',
      days: 2,
      reason: '家中有事需要处理',
      createTime: '2024-01-15 10:00:00',
      status: 'pending',
      rejectReason: '',
      cancelled: false
    }
    
    // 模拟审批记录
    approvalRecords.value = [
      {
        nodeName: '部门主管',
        approver: '管理员',
        approvalTime: '2024-01-17 09:30:00',
        approvalResult: 'approved',
        approvalComment: '情况属实，同意请假'
      }
    ]
  } catch (error) {
    ElMessage.error('获取请假详情失败')
  } finally {
    loading.value = false
  }
}

// 返回
const handleBack = () => {
  router.push('/tenant/on-duty/leave')
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/on-duty/leave-edit/${leaveData.value.id}`)
}

// 删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除该请假记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('删除成功')
    router.push('/tenant/on-duty/leave')
  } catch {
    // 用户取消
  }
}

// 审核
const handleApprove = () => {
  router.push(`/tenant/on-duty/leave-approve/${leaveData.value.id}`)
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
    leaveData.value.cancelled = true
    ElMessage.success('销假成功')
  }).catch(() => {
    // 用户取消
  })
}

// 生命周期
onMounted(() => {
  fetchLeaveDetail()
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

.detail-card {
  margin-bottom: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.approval-record {
  padding: 10px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-info {
  color: #666;
  font-size: 14px;
}

.record-comment {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
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

@media screen and (max-width: 768px) {
  .detail-content {
    padding: 12px;
    padding-bottom: 120px;
  }

  .detail-footer {
    left: 0;
    flex-direction: column;
  }

  .detail-footer .el-button {
    width: 100%;
  }
}
</style>