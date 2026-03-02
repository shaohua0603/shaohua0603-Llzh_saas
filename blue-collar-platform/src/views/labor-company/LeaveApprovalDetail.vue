<template>
  <div class="leave-approval-detail">
    <ApprovalOperation
      :business-id="businessId"
      :business-type="businessType"
      :business-data="leaveData"
      :business-fields="businessFields"
      :approval-records="approvalRecords"
      :can-approve="canApprove"
      :loading="loading"
      @approve="handleApprove"
      @reject="handleReject"
      @transfer="handleTransfer"
      @delegate="handleDelegate"
      @view-history="handleViewHistory"
      @view-business-detail="handleViewBusinessDetail"
      @attachment-download="handleAttachmentDownload"
      @refresh="fetchLeaveDetail"
    >
      <!-- 自定义业务详情 -->
      <template #business-detail>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="请假编号">{{ leaveData.leaveNo }}</el-descriptions-item>
          <el-descriptions-item label="请假类型">
            <el-tag :type="getLeaveTypeTag(leaveData.leaveType)">
              {{ getLeaveTypeText(leaveData.leaveType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请人">{{ leaveData.applicant }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ leaveData.department }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ leaveData.startTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ leaveData.endTime }}</el-descriptions-item>
          <el-descriptions-item label="请假天数">{{ leaveData.leaveDays }} 天</el-descriptions-item>
          <el-descriptions-item label="请假事由" :span="2">{{ leaveData.reason }}</el-descriptions-item>
          <el-descriptions-item label="工作交接" :span="2">
            {{ leaveData.handover || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ leaveData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="审批状态">
            <el-tag :type="getStatusTag(leaveData.status)">
              {{ getStatusText(leaveData.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </template>

      <!-- 自定义字段 -->
      <template #field-leaveType="{ value }">
        <el-tag :type="getLeaveTypeTag(value)">
          {{ getLeaveTypeText(value) }}
        </el-tag>
      </template>
    </ApprovalOperation>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import ApprovalOperation from '@/components/ApprovalOperation.vue'
import type { ApprovalRecord } from '@/types/approval-flow'
import {
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval,
  getApprovalRecords
} from '@/api/approvalApi'

const route = useRoute()
const businessId = route.params.id as string
const businessType = 'leave'

// 加载状态
const loading = ref(false)

// 请假数据
const leaveData = ref<any>({
  id: '1',
  leaveNo: 'LJ202602260001',
  leaveType: 'personal',
  applicant: '张三',
  department: '生产部',
  startTime: '2026-02-26 09:00:00',
  endTime: '2026-02-28 18:00:00',
  leaveDays: 3,
  reason: '家中有事，需要请假处理',
  handover: '工作已交接给李四，相关文档已发送至邮箱',
  createTime: '2026-02-25 10:00:00',
  status: 'pending',
  rejectReason: ''
})

// 业务字段配置
const businessFields = ref([
  { field: 'leaveNo', label: '请假编号' },
  { field: 'leaveType', label: '请假类型', type: 'enum' },
  { field: 'applicant', label: '申请人' },
  { field: 'department', label: '所属部门' },
  { field: 'startTime', label: '开始时间', type: 'datetime' },
  { field: 'endTime', label: '结束时间', type: 'datetime' },
  { field: 'leaveDays', label: '请假天数', type: 'number' },
  { field: 'reason', label: '请假事由', span: 2 },
  { field: 'handover', label: '工作交接', span: 2 },
  { field: 'createTime', label: '申请时间', type: 'datetime' }
])

// 审批记录
const approvalRecords = ref<ApprovalRecord[]>([])

// 是否可以审批
const canApprove = computed(() => {
  return leaveData.value.status === 'pending' || leaveData.value.status === 'in_progress'
})

// 获取请假类型标签
const getLeaveTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    annual: 'success',
    sick: 'warning',
    personal: 'info',
    marriage: 'primary',
    maternity: 'danger',
    bereavement: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取请假类型文本
const getLeaveTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    annual: '年假',
    sick: '病假',
    personal: '事假',
    marriage: '婚假',
    maternity: '产假',
    bereavement: '丧假'
  }
  return textMap[type] || '其他'
}

// 获取状态标签
const getStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    in_progress: 'primary',
    approved: 'success',
    rejected: 'danger'
  }
  return tagMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审批',
    in_progress: '审批中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || '未知'
}

// 获取请假详情
const fetchLeaveDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 实际项目中这里应该调用API获取详情数据
    // const response = await getLeaveDetail(businessId)
    // leaveData.value = response.data

    // 获取审批记录
    await fetchApprovalRecords()
  } catch (error) {
    ElMessage.error('获取请假详情失败')
  } finally {
    loading.value = false
  }
}

// 获取审批记录
const fetchApprovalRecords = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    // 实际项目中这里应该调用API获取审批记录
    // const response = await getApprovalRecords({ businessId, businessType })
    // approvalRecords.value = response.data

    // 模拟数据
    approvalRecords.value = [
      {
        nodeId: 'node-001',
        nodeName: '部门主管审批',
        nodeType: 'approval',
        approver: '张主管',
        approvalTime: new Date('2026-02-25T10:30:00Z'),
        approvalResult: 'pending',
        approvalComment: ''
      }
    ]
  } catch (error) {
    ElMessage.error('获取审批记录失败')
  }
}

// 审批通过
const handleApprove = async (data: any) => {
  try {
    await approveApproval(data)
    ElMessage.success('审批通过成功')
    // 更新状态
    leaveData.value.status = 'approved'
  } catch (error) {
    ElMessage.error('审批通过失败')
  }
}

// 审批驳回
const handleReject = async (data: any) => {
  try {
    await rejectApproval(data)
    ElMessage.success('审批驳回成功')
    // 更新状态
    leaveData.value.status = 'rejected'
    leaveData.value.rejectReason = data.rejectReason
  } catch (error) {
    ElMessage.error('审批驳回失败')
  }
}

// 转办
const handleTransfer = async (data: any) => {
  try {
    await transferApproval(data)
    ElMessage.success('转办成功')
  } catch (error) {
    ElMessage.error('转办失败')
  }
}

// 委派
const handleDelegate = async (data: any) => {
  try {
    await delegateApproval(data)
    ElMessage.success('委派成功')
  } catch (error) {
    ElMessage.error('委派失败')
  }
}

// 查看历史
const handleViewHistory = () => {
  ElMessage.info('查看审批历史')
}

// 查看业务详情
const handleViewBusinessDetail = () => {
  ElMessage.info('查看业务详情')
}

// 附件下载
const handleAttachmentDownload = (attachment: any) => {
  ElMessage.success(`下载附件: ${attachment.name}`)
}

// 生命周期
onMounted(() => {
  fetchLeaveDetail()
})
</script>

<style scoped>
.leave-approval-detail {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
