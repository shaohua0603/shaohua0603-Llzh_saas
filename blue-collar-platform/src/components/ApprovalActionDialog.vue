<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
    @update:model-value="(value) => visible = value"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <!-- 审批意见 -->
      <el-form-item label="审批意见" prop="approvalComment">
        <el-input
          v-model="formData.approvalComment"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 转交/委派人员选择 -->
      <el-form-item
        v-if="actionType === 'transfer' || actionType === 'delegate'"
        :label="actionType === 'transfer' ? '转交人员' : '委派人员'"
        prop="targetUserId"
      >
        <PersonSelectDialog
          v-model="formData.targetUserId"
          :multiple="false"
          :placeholder="actionType === 'transfer' ? '请选择转交人员' : '请选择委派人员'"
        />
      </el-form-item>

      <!-- 附件上传 -->
      <el-form-item label="附件" prop="attachmentIds">
        <SmartAttachmentUpload
          v-model="formData.attachmentIds"
          :max-count="5"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确认{{ actionText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import PersonSelectDialog from '@/components/PersonSelectDialog.vue'
import SmartAttachmentUpload from '@/components/SmartAttachmentUpload.vue'
import {
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval
} from '@/api/approvalExecutionApi'
import type { ApprovalActionRequest } from '@/types/flow-config'

/**
 * 审批操作类型
 */
type ApprovalActionType = 'approve' | 'reject' | 'transfer' | 'delegate'

/**
 * 组件Props
 */
interface Props {
  modelValue: boolean
  actionType: ApprovalActionType
  businessCode: string
  businessId: number
  nodeId: number
  approverId: number
  approverName: string
}

/**
 * 组件Emits
 */
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()

// 对话框可见性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 加载状态
const loading = ref(false)

// 表单数据
const formData = ref<ApprovalActionRequest>({
  businessCode: props.businessCode,
  businessId: props.businessId,
  nodeId: props.nodeId,
  approverId: props.approverId,
  approverName: props.approverName,
  approvalComment: '',
  transferToId: undefined,
  transferToName: '',
  delegateToId: undefined,
  delegateToName: '',
  attachmentIds: ''
})

// 表单验证规则
const formRules: FormRules = {
  approvalComment: [
    { required: true, message: '请输入审批意见', trigger: 'blur' }
  ],
  targetUserId: [
    { required: true, message: `请选择${actionType.value === 'transfer' ? '转交' : '委派'}人员`, trigger: 'change' }
  ]
}

// 对话框标题
const dialogTitle = computed(() => {
  const titles: Record<ApprovalActionType, string> = {
    approve: '审批通过',
    reject: '审批驳回',
    transfer: '审批转交',
    delegate: '审批委派'
  }
  return titles[props.actionType]
})

// 操作文本
const actionText = computed(() => {
  const texts: Record<ApprovalActionType, string> = {
    approve: '通过',
    reject: '驳回',
    transfer: '转交',
    delegate: '委派'
  }
  return texts[props.actionType]
})

// 监听props变化,更新表单数据
watch(() => props, (newProps) => {
  formData.value = {
    businessCode: newProps.businessCode,
    businessId: newProps.businessId,
    nodeId: newProps.nodeId,
    approverId: newProps.approverId,
    approverName: newProps.approverName,
    approvalComment: '',
    transferToId: undefined,
    transferToName: '',
    delegateToId: undefined,
    delegateToName: '',
    attachmentIds: ''
  }
}, { deep: true })

// 监听目标用户变化
watch(() => formData.value.targetUserId, (newUserId) => {
  if (props.actionType === 'transfer') {
    formData.value.transferToId = newUserId
  } else if (props.actionType === 'delegate') {
    formData.value.delegateToId = newUserId
  }
})

/**
 * 关闭对话框
 */
const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

/**
 * 提交审批操作
 */
const handleSubmit = async () => {
  try {
    // 验证表单
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true

    // 根据操作类型调用不同的API
    let response
    switch (props.actionType) {
      case 'approve':
        response = await approveApproval(formData.value)
        break
      case 'reject':
        response = await rejectApproval(formData.value)
        break
      case 'transfer':
        response = await transferApproval(formData.value)
        break
      case 'delegate':
        response = await delegateApproval(formData.value)
        break
      default:
        throw new Error('未知的审批操作类型')
    }

    ElMessage.success(`${actionText.value}成功`)
    emit('success')
    handleClose()
  } catch (error: any) {
    console.error('审批操作失败:', error)
    ElMessage.error(error.message || `${actionText.value}失败`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.el-form {
  padding: 20px 0;
}
</style>
