<template>
  <div class="approval-operation-example">
    <ApprovalOperation
      :business-id="businessId"
      :business-type="businessType"
      :business-data="businessData"
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
      @refresh="fetchBusinessDetail"
    >
      <!-- 自定义业务详情 -->
      <template #business-detail>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="业务编号">{{ businessData.businessNo }}</el-descriptions-item>
          <el-descriptions-item label="业务类型">
            <el-tag :type="getBusinessTypeTag(businessData.businessType)">
              {{ getBusinessTypeText(businessData.businessType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请人">{{ businessData.applicant }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ businessData.department }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ businessData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="审批状态">
            <el-tag :type="getStatusTag(businessData.status)">
              {{ getStatusText(businessData.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业务内容" :span="2">
            {{ businessData.content }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ businessData.remark || '无' }}
          </el-descriptions-item>
        </el-descriptions>
      </template>

      <!-- 自定义字段渲染 -->
      <template #field-businessType="{ value }">
        <el-tag :type="getBusinessTypeTag(value)">
          {{ getBusinessTypeText(value) }}
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
const businessType = route.query.type as string || 'general'

// 加载状态
const loading = ref(false)

// 业务数据
const businessData = ref<any>({
  id: '1',
  businessNo: 'BZ202602260001',
  businessType: 'general',
  applicant: '张三',
  department: '生产部',
  createTime: '2026-02-26 10:00:00',
  status: 'pending',
  content: '这是一条通用的业务审批内容',
  remark: '这是一条备注信息',
  rejectReason: ''
})

// 业务字段配置
const businessFields = ref([
  { field: 'businessNo', label: '业务编号' },
  { field: 'businessType', label: '业务类型', type: 'enum' },
  { field: 'applicant', label: '申请人' },
  { field: 'department', label: '所属部门' },
  { field: 'createTime', label: '申请时间', type: 'datetime' },
  { field: 'content', label: '业务内容', span: 2 },
  { field: 'remark', label: '备注', span: 2 }
])

// 审批记录
const approvalRecords = ref<ApprovalRecord[]>([])

// 是否可以审批
const canApprove = computed(() => {
  return businessData.value.status === 'pending' || businessData.value.status === 'in_progress'
})

// 获取业务类型标签
const getBusinessTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    leave: 'success',
    transfer: 'warning',
    resignation: 'danger',
    contract: 'primary',
    general: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取业务类型文本
const getBusinessTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    leave: '请假审批',
    transfer: '调岗审批',
    resignation: '离职审批',
    contract: '合同审批',
    general: '通用审批'
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

// 获取业务详情
const fetchBusinessDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 实际项目中这里应该调用API获取详情数据
    // const response = await getBusinessDetail(businessId, businessType)
    // businessData.value = response.data

    // 获取审批记录
    await fetchApprovalRecords()
  } catch (error) {
    ElMessage.error('获取业务详情失败')
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
        approvalTime: new Date('2026-02-26T10:30:00Z'),
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
    businessData.value.status = 'approved'
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
    businessData.value.status = 'rejected'
    businessData.value.rejectReason = data.rejectReason
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
  fetchBusinessDetail()
})
</script>

<style scoped>
.approval-operation-example {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
