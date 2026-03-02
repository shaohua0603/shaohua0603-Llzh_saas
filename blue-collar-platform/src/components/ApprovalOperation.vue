<template>
  <div class="approval-operation-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="approval-loading">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 审批操作内容 -->
    <div v-else class="approval-content">
      <!-- 业务详情卡片 -->
      <el-card v-if="showBusinessDetail" class="approval-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>业务详情</span>
            <el-tag :type="getBusinessStatusType(businessData.status)">
              {{ getBusinessStatusText(businessData.status) }}
            </el-tag>
          </div>
        </template>
        <slot name="business-detail">
          <el-descriptions :column="2" border>
            <el-descriptions-item
              v-for="field in businessFields"
              :key="field.field"
              :label="field.label"
              :span="field.span || 1"
            >
              <slot
                v-if="$slots[`field-${field.field}`]"
                :name="`field-${field.field}`"
                :value="businessData[field.field]"
                :data="businessData"
                :field="field"
              ></slot>
              <span v-else>{{ formatFieldValue(field, businessData[field.field]) }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </slot>
      </el-card>

      <!-- 审批记录卡片 -->
      <el-card class="approval-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>审批记录</span>
            <el-button
              v-if="showViewHistory"
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
          @attachment-download="handleAttachmentDownload"
        />
      </el-card>

      <!-- 审批操作卡片 -->
      <el-card v-if="canApprove" class="approval-card" shadow="never">
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
      <el-card v-else class="approval-card" shadow="never">
        <div class="approval-completed">
          <el-result
            :icon="businessData.status === 'approved' ? 'success' : 'error'"
            :title="businessData.status === 'approved' ? '审批已通过' : '审批已驳回'"
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

    <!-- 转办对话框 -->
    <el-dialog
      v-model="transferVisible"
      title="转办他人"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="transferFormRef"
        :model="transferForm"
        :rules="transferRules"
        label-width="100px"
      >
        <el-form-item label="转办人" prop="toUser">
          <PersonSelect
            ref="transferPersonSelectRef"
            v-model="transferForm.toUser"
            :multiple="false"
            :source="userSource"
            :display-fields="['name', 'phone', 'department', 'position']"
            :return-fields="['id', 'name', 'phone', 'department', 'position']"
            @confirm="handleTransferPersonConfirm"
            @cancel="transferVisible = false"
          />
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
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="delegateFormRef"
        :model="delegateForm"
        :rules="delegateRules"
        label-width="100px"
      >
        <el-form-item label="委派人" prop="toUser">
          <PersonSelect
            ref="delegatePersonSelectRef"
            v-model="delegateForm.toUser"
            :multiple="false"
            :source="userSource"
            :display-fields="['name', 'phone', 'department', 'position']"
            :return-fields="['id', 'name', 'phone', 'department', 'position']"
            @confirm="handleDelegatePersonConfirm"
            @cancel="delegateVisible = false"
          />
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
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadUserFile } from 'element-plus'
import { View, CircleCheck, CircleClose, Select, Refresh, Upload, Switch, Share } from '@element-plus/icons-vue'
import ApprovalRecordTimeline from './ApprovalRecordTimeline.vue'
import PersonSelect from './PersonSelect.vue'
import type { ApprovalRecord } from '../types/approval-flow'

// Props定义
interface BusinessField {
  field: string
  label: string
  span?: number
  type?: 'text' | 'date' | 'datetime' | 'number' | 'enum'
  formatter?: (value: any, data: any) => string
  options?: Array<{ label: string; value: any; color?: string }>
}

interface Props {
  /** 业务ID */
  businessId: string
  /** 业务类型 */
  businessType: string
  /** 业务数据 */
  businessData?: any
  /** 业务字段配置 */
  businessFields?: BusinessField[]
  /** 审批记录 */
  approvalRecords?: ApprovalRecord[]
  /** 是否显示业务详情 */
  showBusinessDetail?: boolean
  /** 是否可以审批 */
  canApprove?: boolean
  /** 是否显示查看历史按钮 */
  showViewHistory?: boolean
  /** 是否显示转办按钮 */
  showTransferButton?: boolean
  /** 是否显示委派按钮 */
  showDelegateButton?: boolean
  /** 用户来源 */
  userSource?: 'worker' | 'employee' | 'all'
  /** 是否加载中 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  businessData: () => ({}),
  businessFields: () => [],
  approvalRecords: () => [],
  showBusinessDetail: true,
  canApprove: true,
  showViewHistory: true,
  showTransferButton: true,
  showDelegateButton: true,
  userSource: 'employee',
  loading: false
})

// Emits定义
const emit = defineEmits<{
  'approve': [data: any]
  'reject': [data: any]
  'transfer': [data: any]
  'delegate': [data: any]
  'view-history': []
  'view-business-detail': []
  'attachment-download': [attachment: any]
  'refresh': []
}>()

// 响应式数据
const approvalFormRef = ref<FormInstance>()
const transferFormRef = ref<FormInstance>()
const delegateFormRef = ref<FormInstance>()
const transferPersonSelectRef = ref()
const delegatePersonSelectRef = ref()

const submitting = ref(false)
const transferSubmitting = ref(false)
const delegateSubmitting = ref(false)

const transferVisible = ref(false)
const delegateVisible = ref(false)
const historyVisible = ref(false)

const fileList = ref<UploadUserFile[]>([])
const allApprovalRecords = ref<ApprovalRecord[]>([])

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
  toUserName: '',
  remark: ''
})

// 委派表单
const delegateForm = reactive({
  toUser: '',
  toUserName: '',
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

// 计算属性 - 审批记录
const computedApprovalRecords = computed(() => {
  return props.approvalRecords || []
})

// 格式化字段值
const formatFieldValue = (field: BusinessField, value: any) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (field.formatter) {
    return field.formatter(value, props.businessData)
  }

  switch (field.type) {
    case 'date':
      return formatDate(value)
    case 'datetime':
      return formatDateTime(value)
    case 'number':
      return formatNumber(value)
    case 'enum':
      return getEnumLabel(field, value)
    default:
      return value
  }
}

// 格式化日期
const formatDate = (value: any) => {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleDateString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (value: any) => {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleString('zh-CN')
}

// 格式化数字
const formatNumber = (value: any) => {
  if (value === null || value === undefined) return '-'
  return Number(value).toLocaleString()
}

// 获取枚举标签
const getEnumLabel = (field: BusinessField, value: any) => {
  const option = field.options?.find(opt => opt.value === value)
  return option?.label || value
}

// 获取业务状态类型
const getBusinessStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    in_progress: 'primary',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取业务状态文本
const getBusinessStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审批',
    in_progress: '审批中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || '未知'
}

// 获取完成提示副标题
const getCompletedSubTitle = () => {
  if (props.businessData.status === 'approved') {
    return '该业务已通过审批'
  } else {
    return `驳回原因: ${props.businessData.rejectReason || '未填写'}`
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
      businessId: props.businessId,
      businessType: props.businessType,
      result: approvalForm.result,
      comment: approvalForm.comment,
      rejectReason: approvalForm.rejectReason,
      attachments
    }

    if (approvalForm.result === 'approved') {
      emit('approve', submitData)
    } else {
      emit('reject', submitData)
    }

    ElMessage.success('审批提交成功')
    handleResetForm()
    emit('refresh')
  } catch (error) {
    console.error('审批提交失败:', error)
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

// 处理转办人员选择确认
const handleTransferPersonConfirm = (selected: any) => {
  if (selected) {
    transferForm.toUser = selected.id
    transferForm.toUserName = selected.name
  }
}

// 提交转办
const handleSubmitTransfer = async () => {
  if (!transferFormRef.value) return

  try {
    await transferFormRef.value.validate()

    transferSubmitting.value = true

    const transferData = {
      businessId: props.businessId,
      businessType: props.businessType,
      toUser: transferForm.toUser,
      toUserName: transferForm.toUserName,
      remark: transferForm.remark
    }

    emit('transfer', transferData)

    ElMessage.success('转办成功')
    transferVisible.value = false
    handleResetTransferForm()
    emit('refresh')
  } catch (error) {
    console.error('转办失败:', error)
  } finally {
    transferSubmitting.value = false
  }
}

// 重置转办表单
const handleResetTransferForm = () => {
  transferForm.toUser = ''
  transferForm.toUserName = ''
  transferForm.remark = ''
  transferFormRef.value?.clearValidate()
}

// 打开委派对话框
const handleOpenDelegate = () => {
  delegateVisible.value = true
}

// 处理委派人员选择确认
const handleDelegatePersonConfirm = (selected: any) => {
  if (selected) {
    delegateForm.toUser = selected.id
    delegateForm.toUserName = selected.name
  }
}

// 提交委派
const handleSubmitDelegate = async () => {
  if (!delegateFormRef.value) return

  try {
    await delegateFormRef.value.validate()

    delegateSubmitting.value = true

    const delegateData = {
      businessId: props.businessId,
      businessType: props.businessType,
      toUser: delegateForm.toUser,
      toUserName: delegateForm.toUserName,
      remark: delegateForm.remark
    }

    emit('delegate', delegateData)

    ElMessage.success('委派成功')
    delegateVisible.value = false
    handleResetDelegateForm()
    emit('refresh')
  } catch (error) {
    console.error('委派失败:', error)
  } finally {
    delegateSubmitting.value = false
  }
}

// 重置委派表单
const handleResetDelegateForm = () => {
  delegateForm.toUser = ''
  delegateForm.toUserName = ''
  delegateForm.remark = ''
  delegateFormRef.value?.clearValidate()
}

// 查看历史
const handleViewHistory = () => {
  // 这里应该调用API获取所有审批记录
  allApprovalRecords.value = [...props.approvalRecords]
  historyVisible.value = true
  emit('view-history')
}

// 查看业务详情
const handleViewBusinessDetail = () => {
  emit('view-business-detail')
}

// 附件下载
const handleAttachmentDownload = (attachment: any) => {
  emit('attachment-download', attachment)
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

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.approval-operation-container {
  width: 100%;
  min-height: 100%;
}

.approval-loading {
  padding: 20px;
}

.approval-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.approval-card {
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .operation-buttons {
    flex-direction: column;
  }

  .operation-buttons .el-button {
    width: 100%;
  }
}
</style>
