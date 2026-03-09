<template>
  <el-dialog
    v-model="dialogVisible"
    title="销假申请"
    width="500px"
  >
    <el-form :model="cancelForm" :rules="rules" ref="cancelFormRef" label-width="100px">
      <el-form-item label="销假日期" prop="cancelDate">
        <el-date-picker
          v-model="cancelForm.cancelDate"
          type="date"
          placeholder="选择销假日期"
          style="width: 100%"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="销假原因" prop="cancelReason">
        <el-input
          v-model="cancelForm.cancelReason"
          type="textarea"
          placeholder="请输入销假原因"
          rows="3"
        />
      </el-form-item>
      <el-form-item label="附件上传" v-if="requiredAttachments.length > 0">
        <div class="attachment-list">
          <div v-for="(attachment, index) in requiredAttachments" :key="index" class="attachment-item">
            <span class="attachment-name">{{ attachment.name }} <span v-if="attachment.required" class="required-mark">*</span></span>
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-success="(response, file) => handleUploadSuccess(response, file, index)"
              :on-error="handleUploadError"
              :file-list="cancelForm.attachments[index] || []"
              :accept="attachment.fileTypes.join(',')"
              :limit="1"
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                上传
              </el-button>
            </el-upload>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps, defineEmits } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  leaveInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const loading = ref(false)
const cancelFormRef = ref()
const uploadUrl = '/api/v1/upload' // 实际项目中替换为真实的上传接口

// 销假表单
const cancelForm = reactive({
  cancelDate: '',
  cancelReason: '',
  attachments: []
})

// 表单验证规则
const rules = {
  cancelDate: [
    { required: true, message: '请选择销假日期', trigger: 'change' }
  ],
  cancelReason: [
    { required: true, message: '请输入销假原因', trigger: 'blur' }
  ]
}

// 模拟附件要求（实际项目中从后端获取）
const requiredAttachments = computed(() => {
  // 根据请假类型返回不同的附件要求
  const attachmentsMap: Record<string, any[]> = {
    personal: [
      { name: '销假说明', required: true, fileTypes: ['.doc', '.docx', '.pdf'] }
    ],
    sick: [
      { name: '医生证明', required: true, fileTypes: ['.jpg', '.jpeg', '.png', '.pdf'] }
    ],
    annual: [
      { name: '销假说明', required: false, fileTypes: ['.doc', '.docx', '.pdf'] }
    ],
    marriage: [
      { name: '销假说明', required: false, fileTypes: ['.doc', '.docx', '.pdf'] }
    ],
    bereavement: [
      { name: '销假说明', required: false, fileTypes: ['.doc', '.docx', '.pdf'] }
    ],
    other: [
      { name: '销假说明', required: true, fileTypes: ['.doc', '.docx', '.pdf'] }
    ]
  }
  
  return attachmentsMap[props.leaveInfo.leaveType] || []
})

// 处理附件上传成功
const handleUploadSuccess = (response: any, file: any, index: number) => {
  if (!cancelForm.attachments[index]) {
    cancelForm.attachments[index] = []
  }
  cancelForm.attachments[index] = [file]
  ElMessage.success('附件上传成功')
}

// 处理附件上传失败
const handleUploadError = () => {
  ElMessage.error('附件上传失败，请重试')
}

// 处理提交
const handleSubmit = async () => {
  if (!cancelFormRef.value) return
  
  try {
    await cancelFormRef.value.validate()
    
    // 检查必填附件是否已上传
    const hasMissingAttachment = requiredAttachments.value.some((attachment, index) => {
      return attachment.required && (!cancelForm.attachments[index] || cancelForm.attachments[index].length === 0)
    })
    
    if (hasMissingAttachment) {
      ElMessage.warning('请上传所有必填附件')
      return
    }
    
    loading.value = true
    
    // 模拟提交
    setTimeout(() => {
      emit('submit', {
        ...cancelForm,
        leaveId: props.leaveInfo.id
      })
      dialogVisible.value = false
      loading.value = false
      ElMessage.success('销假申请提交成功')
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.attachment-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-name {
  font-size: 14px;
  font-weight: 500;
}

.required-mark {
  color: #f56c6c;
}

.upload-demo {
  width: 100%;
}
</style>