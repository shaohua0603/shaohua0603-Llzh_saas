<template>
  <el-dialog
    :model-value="visible"
    title="上传附件模板"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
    @update:model-value="(value) => emit('update:visible', value)"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="模板名称" prop="templateName">
        <el-input
          v-model="formData.templateName"
          placeholder="请输入模板名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="模板文件" prop="file">
        <FileUpload
          ref="uploadRef"
          v-model="fileList"
          :upload-action="uploadAction"
          :upload-headers="uploadHeaders"
          :upload-data="uploadData"
          :multiple="false"
          :drag="true"
          :accept="accept"
          :max-size="maxSize"
          :show-file-list="true"
          :button-text="'选择文件'"
          :upload-tip="uploadTip"
          @change="handleFileChange"
          @success="handleUploadSuccess"
          @error="handleUploadError"
        >
          <template #trigger>
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              选择文件
            </el-button>
          </template>
        </FileUpload>
      </el-form-item>

      <el-form-item label="模板说明" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入模板说明"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import FileUpload from '@/components/FileUpload.vue'
import { attachmentTemplateApi } from '@/api/attachmentTemplateApi'
import type { UploadFile } from 'element-plus'

interface Props {
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'submit': []
}>()

const formRef = ref()
const uploadRef = ref()
const submitting = ref(false)
const fileList = ref<UploadFile[]>([])

const formData = reactive({
  templateName: '',
  description: ''
})

const formRules = {
  templateName: [
    { required: true, message: '请输入模板名称', trigger: 'blur' },
    { min: 2, max: 50, message: '模板名称长度在2-50个字符', trigger: 'blur' }
  ]
}

const uploadAction = '/api/v1/attachment-templates/upload'
const uploadHeaders = {}
const maxSize = 100 * 1024 * 1024
const accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z'

const uploadData = computed(() => ({
  templateName: formData.templateName,
  description: formData.description
}))

const uploadTip = computed(() => {
  return '支持PDF、Word、Excel、PPT、压缩包等格式,文件大小不超过100MB'
})

const handleFileChange = (file: UploadFile) => {
  if (file.status === 'success' && file.response) {
    formData.templateName = formData.templateName || file.name
  }
}

const handleUploadSuccess = (response: any, file: UploadFile) => {
  ElMessage.success(`${file.name}上传成功`)
}

const handleUploadError = (error: Error, file: UploadFile) => {
  ElMessage.error(`${file.name}上传失败`)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  if (fileList.value.length === 0) {
    ElMessage.warning('请选择模板文件')
    return
  }

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        const file = fileList.value[0].raw
        if (!file) {
          ElMessage.warning('请选择模板文件')
          return
        }

        await attachmentTemplateApi.uploadTemplate({
          file,
          templateName: formData.templateName,
          description: formData.description
        })

        ElMessage.success('上传成功')
        emit('submit')
        handleClose()
      } catch (error) {
        ElMessage.error('上传失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleClose = () => {
  formRef.value?.resetFields()
  fileList.value = []
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      Object.assign(formData, {
        templateName: '',
        description: ''
      })
      fileList.value = []
    }
  }
)
</script>

<style scoped>
:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
}
</style>
