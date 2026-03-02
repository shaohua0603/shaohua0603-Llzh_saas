<template>
  <div class="approval-demo">
    <el-page-header @back="goBack" class="page-header">
      <template #content>
        <div class="header-content">
          <span class="title">审批操作界面演示</span>
          <el-tag :type="getStatusTag(businessData.status)">
            {{ getStatusText(businessData.status) }}
          </el-tag>
        </div>
      </template>
    </el-page-header>

    <div class="demo-content">
      <el-card class="demo-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>演示说明</span>
          </div>
        </template>
        <div class="demo-description">
          <p>这是一个审批操作界面的演示页面，展示了以下功能：</p>
          <ul>
            <li>✅ 业务详情展示</li>
            <li>✅ 审批记录时间线</li>
            <li>✅ 审批操作（通过/驳回）</li>
            <li>✅ 转办功能</li>
            <li>✅ 委派功能</li>
            <li>✅ 附件上传</li>
            <li>✅ 审批历史查看</li>
          </ul>
          <el-alert
            title="提示"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <p>当前为演示模式，所有操作均为模拟，不会实际调用API。</p>
              <p>您可以通过切换业务状态来查看不同状态下的界面展示。</p>
            </template>
          </el-alert>
        </div>
      </el-card>

      <el-card class="demo-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>状态切换</span>
          </div>
        </template>
        <div class="status-switch">
          <el-radio-group v-model="businessData.status" @change="handleStatusChange">
            <el-radio-button label="pending">待审批</el-radio-button>
            <el-radio-button label="in_progress">审批中</el-radio-button>
            <el-radio-button label="approved">已通过</el-radio-button>
            <el-radio-button label="rejected">已驳回</el-radio-button>
          </el-radio-group>
        </div>
      </el-card>

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
        @refresh="handleRefresh"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ApprovalOperation from '@/components/ApprovalOperation.vue'
import type { ApprovalRecord } from '@/types/approval-flow'

const router = useRouter()

const businessId = ref('DEMO-001')
const businessType = ref('demo')
const loading = ref(false)

// 业务数据
const businessData = ref<any>({
  id: 'DEMO-001',
  businessNo: 'BZ202602260001',
  businessType: 'demo',
  applicant: '张三',
  department: '生产部',
  createTime: '2026-02-26 10:00:00',
  status: 'pending',
  content: '这是一条演示用的业务审批内容，用于展示审批操作界面的各项功能。',
  remark: '这是演示数据，仅供展示使用',
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
const approvalRecords = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-001',
    nodeName: '部门主管审批',
    nodeType: 'approval',
    approver: '张主管',
    approvalTime: new Date('2026-02-26T10:30:00Z'),
    approvalResult: 'pending',
    approvalComment: ''
  }
])

// 是否可以审批
const canApprove = computed(() => {
  return businessData.value.status === 'pending' || businessData.value.status === 'in_progress'
})

// 返回
const goBack = () => {
  router.back()
}

// 获取业务类型标签
const getBusinessTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    demo: 'primary',
    leave: 'success',
    transfer: 'warning',
    resignation: 'danger',
    contract: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取业务类型文本
const getBusinessTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    demo: '演示审批',
    leave: '请假审批',
    transfer: '调岗审批',
    resignation: '离职审批',
    contract: '合同审批'
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

// 状态变化
const handleStatusChange = (status: string) => {
  // 更新审批记录
  if (status === 'approved') {
    approvalRecords.value = [
      {
        nodeId: 'node-001',
        nodeName: '部门主管审批',
        nodeType: 'approval',
        approver: '张主管',
        approvalTime: new Date('2026-02-26T10:30:00Z'),
        approvalResult: 'approved',
        approvalComment: '同意'
      }
    ]
  } else if (status === 'rejected') {
    approvalRecords.value = [
      {
        nodeId: 'node-001',
        nodeName: '部门主管审批',
        nodeType: 'approval',
        approver: '张主管',
        approvalTime: new Date('2026-02-26T10:30:00Z'),
        approvalResult: 'rejected',
        approvalComment: '不同意',
        rejectReason: '申请理由不充分'
      }
    ]
  } else {
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
  }

  businessData.value.rejectReason = status === 'rejected' ? '申请理由不充分' : ''
  ElMessage.success(`状态已切换为：${getStatusText(status)}`)
}

// 审批通过
const handleApprove = async (data: any) => {
  ElMessage.success('审批通过（演示模式）')
  businessData.value.status = 'approved'
  // 更新审批记录
  approvalRecords.value.push({
    nodeId: 'node-001',
    nodeName: '部门主管审批',
    nodeType: 'approval',
    approver: '当前用户',
    approvalTime: new Date(),
    approvalResult: 'approved',
    approvalComment: data.comment || '同意'
  })
}

// 审批驳回
const handleReject = async (data: any) => {
  ElMessage.success('审批驳回（演示模式）')
  businessData.value.status = 'rejected'
  businessData.value.rejectReason = data.rejectReason
  // 更新审批记录
  approvalRecords.value.push({
    nodeId: 'node-001',
    nodeName: '部门主管审批',
    nodeType: 'approval',
    approver: '当前用户',
    approvalTime: new Date(),
    approvalResult: 'rejected',
    approvalComment: data.comment,
    rejectReason: data.rejectReason
  })
}

// 转办
const handleTransfer = async (data: any) => {
  ElMessage.success(`已转办给：${data.toUser}（演示模式）`)
  // 更新审批记录
  approvalRecords.value.push({
    nodeId: 'node-001',
    nodeName: '部门主管审批',
    nodeType: 'approval',
    approver: '当前用户',
    approvalTime: new Date(),
    approvalResult: 'transferred',
    approvalComment: data.remark,
    operationType: 'transfer',
    operationTarget: data.toUser
  })
}

// 委派
const handleDelegate = async (data: any) => {
  ElMessage.success(`已委派给：${data.toUser}（演示模式）`)
  // 更新审批记录
  approvalRecords.value.push({
    nodeId: 'node-001',
    nodeName: '部门主管审批',
    nodeType: 'approval',
    approver: '当前用户',
    approvalTime: new Date(),
    approvalResult: 'delegated',
    approvalComment: data.remark,
    operationType: 'delegate',
    operationTarget: data.toUser
  })
}

// 查看历史
const handleViewHistory = () => {
  ElMessage.info('查看审批历史（演示模式）')
}

// 查看业务详情
const handleViewBusinessDetail = () => {
  ElMessage.info('查看业务详情（演示模式）')
}

// 附件下载
const handleAttachmentDownload = (attachment: any) => {
  ElMessage.success(`下载附件：${attachment.name}（演示模式）`)
}

// 刷新
const handleRefresh = () => {
  ElMessage.info('刷新数据（演示模式）')
}
</script>

<style scoped>
.approval-demo {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-card {
  margin-bottom: 0;
}

.card-header {
  font-weight: 600;
  color: #303133;
}

.demo-description {
  line-height: 1.8;
}

.demo-description ul {
  margin: 12px 0;
  padding-left: 20px;
}

.demo-description li {
  margin-bottom: 8px;
  color: #606266;
}

.status-switch {
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .approval-demo {
    padding: 10px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .status-switch {
    flex-direction: column;
    gap: 8px;
  }

  .status-switch .el-radio-group {
    width: 100%;
  }

  .status-switch .el-radio-button {
    flex: 1;
  }
}
</style>
