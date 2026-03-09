<template>
  <div class="transfer-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 详情内容 -->
    <div v-else class="detail-content">
      <!-- 调岗基本信息 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>调岗基本信息</span>
            <el-tag :type="getStatusType(transferDetail.approvalStatus)">
              {{ getStatusText(transferDetail.approvalStatus) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ transferDetail.workerName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ transferDetail.phone }}</el-descriptions-item>
          <el-descriptions-item label="期望调岗日期">{{ transferDetail.expectedTransferDate }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ transferDetail.applyTime }}</el-descriptions-item>
          <el-descriptions-item label="原部门">{{ transferDetail.originalDepartment }}</el-descriptions-item>
          <el-descriptions-item label="原岗位">{{ transferDetail.originalPosition }}</el-descriptions-item>
          <el-descriptions-item label="原岗位直属领导">{{ transferDetail.originalLeader }}</el-descriptions-item>
          <el-descriptions-item label="目标部门">{{ transferDetail.targetDepartment }}</el-descriptions-item>
          <el-descriptions-item label="目标岗位">{{ transferDetail.targetPosition }}</el-descriptions-item>
          <el-descriptions-item label="目标岗位直属组长">{{ transferDetail.targetLeader }}</el-descriptions-item>
          <el-descriptions-item label="调岗原因" :span="2">{{ transferDetail.transferReason }}</el-descriptions-item>
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
            :icon="transferDetail.approvalStatus === 'APPROVED' ? 'success' : 'error'"
            :title="transferDetail.approvalStatus === 'APPROVED' ? '审批已通过' : '审批已驳回'"
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
import type { ApprovalRecord } from '@/types/approval-flow'
import {
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval,
  getApprovalRecords
} from '@/api/approvalApi'

// 路由
const route = useRoute()
const router = useRouter()

// 类型定义
interface TransferDetail {
  id: string
  workerName: string
  phone: string
  expectedTransferDate: string
  applyTime: string
  originalDepartment: string
  originalPosition: string
  originalLeader: string
  targetDepartment: string
  targetPosition: string
  targetLeader: string
  transferReason: string
  approvalStatus: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'
  creatorId?: string
}

// 响应式数据
const loading = ref(false)
const approvalLoading = ref(false)
const transferDetail = ref<TransferDetail>({
  id: '',
  workerName: '',
  phone: '',
  expectedTransferDate: '',
  applyTime: '',
  originalDepartment: '',
  originalPosition: '',
  originalLeader: '',
  targetDepartment: '',
  targetPosition: '',
  targetLeader: '',
  transferReason: '',
  approvalStatus: 'PENDING'
})
const approvalRecords = ref<ApprovalRecord[]>([])
const allApprovalRecords = ref<ApprovalRecord[]>([])
const currentNodeId = ref('')

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

// 计算属性 - 是否可以审批
const canApprove = computed(() => {
  return transferDetail.value.approvalStatus === 'PENDING' ||
         transferDetail.value.approvalStatus === 'IN_PROGRESS'
})

// 是否显示转办按钮
const showTransferButton = computed(() => {
  return canApprove.value
})

// 是否显示委派按钮
const showDelegateButton = computed(() => {
  return canApprove.value
})

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    PENDING: 'info',
    IN_PROGRESS: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    PENDING: '未审核',
    IN_PROGRESS: '审核中',
    APPROVED: '审核通过',
    REJECTED: '已驳回'
  }
  return textMap[status] || status
}

// 获取完成提示副标题
const getCompletedSubTitle = () => {
  if (transferDetail.value.approvalStatus === 'APPROVED') {
    return '该调岗申请已通过审批'
  } else {
    return '该调岗申请已被驳回'
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push({
    path: '/tenant/on-duty/transfer',
    query: { action: 'edit', id: transferDetail.value.id }
  })
}

// 删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除该调岗记录吗？', '提示', {
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
  approvalForm.result = 'approved'
  approvalForm.comment = ''
  approvalForm.rejectReason = ''
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
      await approveApproval({ id: Number(transferDetail.value.id), ...submitData })
      ElMessage.success('审批通过成功')
      transferDetail.value.approvalStatus = 'APPROVED'
    } else {
      await rejectApproval({
        id: Number(transferDetail.value.id),
        ...submitData,
        rejectReason: approvalForm.rejectReason
      })
      ElMessage.success('审批驳回成功')
      transferDetail.value.approvalStatus = 'REJECTED'
    }

    handleResetForm()
    await loadApprovalRecords()
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
      id: Number(transferDetail.value.id),
      toUser: transferForm.toUser,
      transferComment: transferForm.remark
    }

    await transferApproval(transferData)
    ElMessage.success('转办成功')
    transferVisible.value = false
    handleResetTransferForm()
    await loadApprovalRecords()
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
      id: Number(transferDetail.value.id),
      toUser: delegateForm.toUser,
      delegateComment: delegateForm.remark
    }

    await delegateApproval(delegateData)
    ElMessage.success('委派成功')
    delegateVisible.value = false
    handleResetDelegateForm()
    await loadApprovalRecords()
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

// 加载调岗详情
const loadTransferDetail = async () => {
  const id = route.query.id as string
  if (!id) {
    ElMessage.error('缺少调岗ID')
    return
  }

  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock数据
    transferDetail.value = {
      id: id,
      workerName: '张三',
      phone: '13800138001',
      expectedTransferDate: '2026-03-01',
      applyTime: '2026-02-26 10:00:00',
      originalDepartment: '生产部',
      originalPosition: '操作工',
      originalLeader: '李主管',
      targetDepartment: '质检部',
      targetPosition: '质检员',
      targetLeader: '王组长',
      transferReason: '个人发展需求',
      approvalStatus: 'PENDING'
    }

    // 加载审批记录
    await loadApprovalRecords()
  } catch (error) {
    console.error('加载调岗详情失败:', error)
    ElMessage.error('加载调岗详情失败')
  } finally {
    loading.value = false
  }
}

// 加载审批记录
const loadApprovalRecords = async () => {
  approvalLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock数据
    approvalRecords.value = [
      {
        nodeId: 'node1',
        nodeName: '提交申请',
        approver: '张三',
        approvalTime: new Date('2026-02-26 10:00:00'),
        approvalResult: 'pending',
        approvalComment: '提交调岗申请'
      }
    ]
  } catch (error) {
    console.error('加载审批记录失败:', error)
  } finally {
    approvalLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadTransferDetail()
})
</script>

<style scoped>
.transfer-detail-page {
  padding: 20px;
  min-height: 100%;
  padding-bottom: 80px;
  background-color: #f5f7fa;
}

.loading-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  .transfer-detail-page {
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

  :deep(.el-descriptions) {
    font-size: 14px;
  }

  :deep(.el-descriptions__label) {
    width: 100px !important;
  }
}
</style>
