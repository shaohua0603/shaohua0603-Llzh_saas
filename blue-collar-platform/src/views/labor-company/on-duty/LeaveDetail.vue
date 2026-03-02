<template>
  <div class="leave-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 详情内容 -->
    <div v-else class="detail-content">
      <!-- 业务详情卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>请假信息</span>
            <el-tag :type="getStatusTag(leaveData.status)">
              {{ getStatusText(leaveData.status) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="请假编号">{{ leaveData.leaveNo }}</el-descriptions-item>
          <el-descriptions-item label="请假类型">
            <el-tag :type="getLeaveTypeTag(leaveData.leaveType)">
              {{ getLeaveTypeText(leaveData.leaveType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请人">{{ leaveData.workerName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ leaveData.phone }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ leaveData.startDate }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ leaveData.endDate }}</el-descriptions-item>
          <el-descriptions-item label="请假天数">{{ leaveData.days || 0 }} 天</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ leaveData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="请假原因" :span="2">{{ leaveData.reason }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 审批记录卡片 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>审批记录</span>
            <el-button
              v-if="approvalRecords.length > 0"
              type="primary"
              link
              size="small"
              @click="handleViewHistory"
            >
              <el-icon><View /></el-icon>
              查看历史
            </el-button>
          </div>
        </template>
        <ApprovalRecordTimeline
          :records="approvalRecords"
          :current-node-id="currentNodeId"
          @attachment-download="handleAttachmentDownload"
        />
      </el-card>

      <!-- 审批操作卡片 -->
      <el-card v-if="canApprove" class="detail-card" shadow="never">
        <template #header>
          <span>审批操作</span>
        </template>
        <el-form
          ref="approvalFormRef"
          :model="approvalForm"
          :rules="approvalRules"
          label-width="100px"
        >
          <!-- 审批结果 -->
          <el-form-item label="审批结果" prop="result">
            <el-radio-group v-model="approvalForm.result" @change="handleResultChange">
              <el-radio label="approved">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                通过
              </el-radio>
              <el-radio label="rejected">
                <el-icon color="#f56c6c"><CircleClose /></el-icon>
                驳回
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 审批意见 -->
          <el-form-item label="审批意见" prop="comment">
            <el-input
              v-model="approvalForm.comment"
              type="textarea"
              :rows="4"
              placeholder="请输入审批意见（选填）"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <!-- 驳回原因 -->
          <el-form-item
            v-if="approvalForm.result === 'rejected'"
            label="驳回原因"
            prop="rejectReason"
            required
          >
            <el-input
              v-model="approvalForm.rejectReason"
              type="textarea"
              :rows="3"
              placeholder="请输入驳回原因（必填）"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <!-- 附件上传 -->
          <el-form-item label="附件" prop="attachments">
            <el-upload
              v-model:file-list="fileList"
              action="#"
              :auto-upload="false"
              multiple
              :limit="5"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
            >
              <el-button :icon="Upload">上传附件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传最多5个文件，单个文件不超过10MB
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <!-- 操作按钮 -->
          <el-form-item>
            <div class="operation-buttons">
              <el-button
                type="primary"
                :icon="Select"
                :loading="submitting"
                @click="handleSubmitApproval"
              >
                提交审批
              </el-button>
              <el-button :icon="Refresh" @click="handleResetForm">
                重置
              </el-button>
              <el-button
                v-if="showTransferButton"
                :icon="Switch"
                @click="handleOpenTransfer"
              >
                转办他人
              </el-button>
              <el-button
                v-if="showDelegateButton"
                :icon="Share"
                @click="handleOpenDelegate"
              >
                委派他人
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 已完成提示 -->
      <el-card v-else class="detail-card" shadow="never">
        <div class="approval-completed">
          <el-result
            :icon="leaveData.status === 'approved' ? 'success' : 'error'"
            :title="leaveData.status === 'approved' ? '审批已通过' : '审批已驳回'"
            :sub-title="getCompletedSubTitle()"
          >
            <template #extra>
              <el-button type="primary" @click="handleViewBusinessDetail">
                查看业务详情
              </el-button>
            </template>
          </el-result>
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
    </div>

    <!-- 转办对话框 -->
    <el-dialog
      v-model="transferVisible"
      title="转办他人"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="transferFormRef"
        :model="transferForm"
        :rules="transferRules"
        label-width="100px"
      >
        <el-form-item label="转办人" prop="toUser">
          <el-input v-model="transferForm.toUser" placeholder="请选择转办人" />
        </el-form-item>
        <el-form-item label="转办说明" prop="remark">
          <el-input
            v-model="transferForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入转办说明（选填）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transferVisible = false">取消</el-button>
        <el-button type="primary" :loading="transferSubmitting" @click="handleSubmitTransfer">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 委派对话框 -->
    <el-dialog
      v-model="delegateVisible"
      title="委派他人"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="delegateFormRef"
        :model="delegateForm"
        :rules="delegateRules"
        label-width="100px"
      >
        <el-form-item label="委派人" prop="toUser">
          <el-input v-model="delegateForm.toUser" placeholder="请选择委派人" />
        </el-form-item>
        <el-form-item label="委派说明" prop="remark">
          <el-input
            v-model="delegateForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入委派说明（选填）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="delegateVisible = false">取消</el-button>
        <el-button type="primary" :loading="delegateSubmitting" @click="handleSubmitDelegate">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 审批历史对话框 -->
    <el-dialog
      v-model="historyVisible"
      title="审批历史"
      width="800px"
      :close-on-click-modal="false"
    >
      <ApprovalRecordTimeline
        :records="allApprovalRecords"
        @attachment-download="handleAttachmentDownload"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadUserFile } from 'element-plus'
import {
  ArrowLeft,
  View,
  CircleCheck,
  CircleClose,
  Select,
  Refresh,
  Upload,
  Switch,
  Share,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import ApprovalRecordTimeline from '@/components/ApprovalRecordTimeline.vue'
import {
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval,
  getApprovalRecords
} from '@/api/approvalExecutionApi'
import type { ApprovalRecord as FlowConfigApprovalRecord } from '@/types/flow-config'
import type { ApprovalRecord } from '@/types/approval-flow'

const route = useRoute()
const router = useRouter()
const businessId = route.query.id as string
const businessCode = 'LEAVE'

// 加载状态
const loading = ref(false)

// 请假数据
const leaveData = ref<any>({
  id: '1',
  leaveNo: 'LJ202602260001',
  leaveType: 'personal',
  workerName: '张三',
  phone: '13800138000',
  startDate: '2024-01-20 09:00:00',
  endDate: '2024-01-21 18:00:00',
  days: 2,
  reason: '家中有事需要处理',
  createTime: '2024-01-15 10:00:00',
  status: 'pending',
  rejectReason: ''
})

// 审批记录
const approvalRecords = ref<ApprovalRecord[]>([])
const allApprovalRecords = ref<ApprovalRecord[]>([])
const currentNodeId = ref('')

// 是否可以审批
const canApprove = computed(() => {
  return leaveData.value.status === 'pending' || leaveData.value.status === 'in_progress'
})

// 是否显示转办按钮
const showTransferButton = computed(() => {
  return canApprove.value
})

// 是否显示委派按钮
const showDelegateButton = computed(() => {
  return canApprove.value
})

// 表单引用
const approvalFormRef = ref<FormInstance>()
const transferFormRef = ref<FormInstance>()
const delegateFormRef = ref<FormInstance>()

const submitting = ref(false)
const transferSubmitting = ref(false)
const delegateSubmitting = ref(false)

const transferVisible = ref(false)
const delegateVisible = ref(false)
const historyVisible = ref(false)

const fileList = ref<UploadUserFile[]>([])

// 审批表单
const approvalForm = reactive({
  result: 'approved',
  comment: '',
  rejectReason: '',
  attachments: [] as File[]
})

// 转办表单
const transferForm = reactive({
  toUser: '',
  remark: ''
})

// 委派表单
const delegateForm = reactive({
  toUser: '',
  remark: ''
})

// 表单验证规则
const approvalRules: FormRules = {
  result: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  rejectReason: [
    { required: true, message: '请输入驳回原因', trigger: 'blur' },
    { min: 5, message: '驳回原因至少5个字符', trigger: 'blur' }
  ]
}

const transferRules: FormRules = {
  toUser: [{ required: true, message: '请选择转办人', trigger: 'change' }]
}

const delegateRules: FormRules = {
  toUser: [{ required: true, message: '请选择委派人', trigger: 'change' }]
}

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
    in_progress: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return tagMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    in_progress: '审核中',
    approved: '审核通过',
    rejected: '已驳回'
  }
  return textMap[status] || status
}

// 获取完成提示副标题
const getCompletedSubTitle = () => {
  if (leaveData.value.status === 'approved') {
    return '该请假申请已通过审批'
  } else {
    return `驳回原因: ${leaveData.value.rejectReason || '未填写'}`
  }
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
    // const response = await getApprovalRecords(Number(businessId), businessCode)
    // approvalRecords.value = response.data

    // 模拟数据
    approvalRecords.value = [
      {
        nodeId: 'node-001',
        nodeName: '部门主管审批',
        nodeType: 'approval',
        approver: '张主管',
        approvalTime: new Date('2024-01-15T10:30:00Z'),
        approvalResult: 'pending',
        approvalComment: ''
      }
    ]
    currentNodeId.value = 'node-001'
  } catch (error) {
    ElMessage.error('获取审批记录失败')
  }
}

// 审批结果变化
const handleResultChange = (value: string) => {
  if (value === 'rejected') {
    approvalForm.comment = ''
  }
}

// 提交审批
const handleSubmitApproval = async () => {
  if (!approvalFormRef.value) return

  try {
    await approvalFormRef.value.validate()

    // 驳回时必须填写驳回原因
    if (approvalForm.result === 'rejected' && !approvalForm.rejectReason) {
      ElMessage.warning('请输入驳回原因')
      return
    }

    submitting.value = true

    // 处理附件
    const attachments = fileList.value.map(file => file.raw).filter(Boolean) as File[]

    const submitData = {
      approvalComment: approvalForm.comment,
      attachments
    }

    if (approvalForm.result === 'approved') {
      await approveApproval(Number(businessId), submitData)
      ElMessage.success('审批通过成功')
      leaveData.value.status = 'approved'
    } else {
      await rejectApproval(Number(businessId), {
        ...submitData,
        rejectReason: approvalForm.rejectReason
      })
      ElMessage.success('审批驳回成功')
      leaveData.value.status = 'rejected'
      leaveData.value.rejectReason = approvalForm.rejectReason
    }

    handleResetForm()
    await fetchApprovalRecords()
  } catch (error) {
    ElMessage.error('审批提交失败')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const handleResetForm = () => {
  approvalForm.result = 'approved'
  approvalForm.comment = ''
  approvalForm.rejectReason = ''
  fileList.value = []
  approvalFormRef.value?.clearValidate()
}

// 打开转办对话框
const handleOpenTransfer = () => {
  transferVisible.value = true
}

// 提交转办
const handleSubmitTransfer = async () => {
  if (!transferFormRef.value) return

  try {
    await transferFormRef.value.validate()

    transferSubmitting.value = true

    const transferData = {
      toUser: transferForm.toUser,
      transferComment: transferForm.remark
    }

    await transferApproval(Number(businessId), transferData)
    ElMessage.success('转办成功')
    transferVisible.value = false
    handleResetTransferForm()
    await fetchApprovalRecords()
  } catch (error) {
    ElMessage.error('转办失败')
  } finally {
    transferSubmitting.value = false
  }
}

// 重置转办表单
const handleResetTransferForm = () => {
  transferForm.toUser = ''
  transferForm.remark = ''
  transferFormRef.value?.clearValidate()
}

// 打开委派对话框
const handleOpenDelegate = () => {
  delegateVisible.value = true
}

// 提交委派
const handleSubmitDelegate = async () => {
  if (!delegateFormRef.value) return

  try {
    await delegateFormRef.value.validate()

    delegateSubmitting.value = true

    const delegateData = {
      toUser: delegateForm.toUser,
      delegateComment: delegateForm.remark
    }

    await delegateApproval(Number(businessId), delegateData)
    ElMessage.success('委派成功')
    delegateVisible.value = false
    handleResetDelegateForm()
    await fetchApprovalRecords()
  } catch (error) {
    ElMessage.error('委派失败')
  } finally {
    delegateSubmitting.value = false
  }
}

// 重置委派表单
const handleResetDelegateForm = () => {
  delegateForm.toUser = ''
  delegateForm.remark = ''
  delegateFormRef.value?.clearValidate()
}

// 查看历史
const handleViewHistory = () => {
  allApprovalRecords.value = [...approvalRecords.value]
  historyVisible.value = true
}

// 查看业务详情
const handleViewBusinessDetail = () => {
  ElMessage.info('查看业务详情')
}

// 附件下载
const handleAttachmentDownload = (attachment: any) => {
  ElMessage.success(`下载附件: ${attachment}`)
}

// 文件超出限制
const handleExceed = () => {
  ElMessage.warning('最多只能上传5个文件')
}

// 上传前验证
const beforeUpload = (file: File) => {
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  return true
}

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push({
    path: '/labor-company/on-duty/leave',
    query: { action: 'edit', id: businessId }
  })
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
    router.back()
  } catch {
    // 用户取消
  }
}

// 审核
const handleApprove = () => {
  // 触发审批操作
  approvalForm.result = 'approved'
  approvalForm.comment = ''
  approvalForm.rejectReason = ''
}

// 生命周期
onMounted(() => {
  fetchLeaveDetail()
})
</script>

<style scoped>
.leave-detail-page {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  padding-bottom: 80px;
  background-color: #f5f7fa;
}

.loading-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.operation-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.approval-completed {
  padding: 20px 0;
}

/* 底部悬浮按钮栏 */
.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width, 200px);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left 0.3s ease;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .leave-detail-page {
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

  .operation-buttons {
    flex-direction: column;
  }

  .operation-buttons .el-button {
    width: 100%;
  }
}
</style>
