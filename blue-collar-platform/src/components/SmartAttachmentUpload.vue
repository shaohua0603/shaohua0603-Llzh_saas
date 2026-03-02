<template>
  <div class="smart-attachment-upload">
    <FileUpload
      ref="uploadRef"
      v-model="fileList"
      :upload-action="uploadAction"
      :upload-headers="uploadHeaders"
      :upload-data="uploadData"
      :multiple="config?.allowBatchUpload"
      :drag="true"
      :accept="accept"
      :limit="limit"
      :max-size="maxSize"
      :show-file-list="showFileList"
      :templates="templates"
      :button-text="buttonText"
      :upload-tip="uploadTip"
      :http-request="httpRequest"
      @change="handleChange"
      @success="handleSuccess"
      @error="handleError"
      @preview="handlePreview"
      @remove="handleRemove"
      @progress="handleProgress"
      @exceed="handleExceed"
    >
      <template #trigger>
        <slot name="trigger"></slot>
      </template>
      <template #default>
        <slot name="default"></slot>
      </template>
    </FileUpload>

    <AttachmentPreview
      v-model:visible="previewVisible"
      :file="previewFile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import FileUpload from '@/components/FileUpload.vue'
import AttachmentPreview from '@/components/AttachmentPreview.vue'
import { attachmentConfigApi } from '@/api/attachmentConfigApi'
import { attachmentApi } from '@/api/attachmentApi'
import { uploadAttachmentWithChunk } from '@/utils/chunkedUploader'
import type { AttachmentConfig, AttachmentUploadParams } from '@/types/attachment'
import type { UploadFile, UploadFiles, UploadRequestOptions } from 'element-plus'

interface Props {
  modelValue: UploadFile[]
  configId: string
  businessId: string
  businessType: string
  uploadAction?: string
  uploadHeaders?: Record<string, string>
  showFileList?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  uploadAction: '/api/v1/attachments/upload',
  uploadHeaders: () => ({}),
  showFileList: true
})

const emit = defineEmits<{
  'update:modelValue': [files: UploadFile[]]
  'change': [file: UploadFile, fileList: UploadFiles]
  'preview': [file: UploadFile]
  'remove': [file: UploadFile, fileList: UploadFiles]
  'success': [response: any, file: UploadFile, fileList: UploadFiles]
  'error': [error: Error, file: UploadFile, fileList: UploadFiles]
  'progress': [event: any, file: UploadFile, fileList: UploadFiles]
  'exceed': [files: UploadFile[], fileList: UploadFiles]
}>()

const uploadRef = ref()
const fileList = ref<UploadFile[]>([...props.modelValue])
const config = ref<AttachmentConfig | null>(null)
const loading = ref(false)
const previewVisible = ref(false)
const previewFile = ref<UploadFile | null>(null)

watch(
  () => props.modelValue,
  (newVal) => {
    fileList.value = [...newVal]
  },
  { deep: true }
)

watch(
  fileList,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

watch(
  () => props.configId,
  (newConfigId) => {
    if (newConfigId) {
      fetchConfig()
    }
  },
  { immediate: true }
)

const fetchConfig = async () => {
  if (!props.configId) return

  loading.value = true
  try {
    const { data } = await attachmentConfigApi.getAttachmentConfigDetail(props.configId)
    config.value = data
  } catch (error) {
    ElMessage.error('获取附件配置失败')
  } finally {
    loading.value = false
  }
}

const accept = computed(() => {
  if (!config.value || !config.value.allowedTypes || config.value.allowedTypes.length === 0) {
    return '*'
  }
  return config.value.allowedTypes.map(ext => `.${ext}`).join(',')
})

const maxSize = computed(() => {
  if (!config.value || !config.value.maxSize) {
    return 100 * 1024 * 1024
  }
  return config.value.maxSize * 1024 * 1024
})

const limit = computed(() => {
  if (!config.value || !config.value.allowBatchUpload) {
    return 1
  }
  return 10
})

const uploadData = computed(() => ({
  configId: props.configId,
  businessId: props.businessId,
  businessType: props.businessType
}))

const buttonText = computed(() => {
  return '上传文件'
})

const uploadTip = computed(() => {
  if (!config.value) {
    return '支持批量上传，文件大小不超过100MB'
  }
  const typeText = config.value.allowBatchUpload ? '支持批量上传' : '单文件上传'
  const sizeText = config.value.maxSize ? `文件大小不超过${config.value.maxSize}MB` : '文件大小不限制'
  const typeText2 = config.value.allowedTypes?.length > 0
    ? `仅支持${config.value.allowedTypes.join(', ')}格式`
    : '支持所有文件格式'
  return `${typeText}，${sizeText}，${typeText2}`
})

const templates = computed(() => {
  if (!config.value || !config.value.templateFileId || !config.value.templateFileUrl) {
    return []
  }
  return [{
    name: config.value.templateFileName || '下载模板',
    url: config.value.templateFileUrl
  }]
})

const httpRequest = async (options: UploadRequestOptions) => {
  const { file, onProgress, onSuccess, onError } = options
  const fileSize = (file as File).size
  const CHUNK_THRESHOLD = 10 * 1024 * 1024

  try {
    const params: AttachmentUploadParams = {
      file: file as File,
      configId: props.configId,
      businessId: props.businessId,
      businessType: props.businessType,
      onProgress: (progress) => {
        if (onProgress) {
          onProgress({ percent: progress }, file as UploadFile)
        }
      }
    }

    let response
    if (fileSize > CHUNK_THRESHOLD) {
      response = await uploadAttachmentWithChunk(params)
    } else {
      response = await attachmentApi.uploadAttachment(params)
    }

    onSuccess(response, file as UploadFile)
  } catch (error) {
    onError(error as Error, file as UploadFile)
  }
}

const handleChange = (file: UploadFile, fileList: UploadFiles) => {
  emit('change', file, fileList)
}

const handleSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
  ElMessage.success(`${file.name}上传成功`)
  emit('success', response, file, fileList)
}

const handleError = (error: Error, file: UploadFile, fileList: UploadFiles) => {
  ElMessage.error(`${file.name}上传失败`)
  emit('error', error, file, fileList)
}

const handlePreview = (file: UploadFile) => {
  previewFile.value = file
  previewVisible.value = true
  emit('preview', file)
}

const handleRemove = (file: UploadFile) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
  emit('remove', file, fileList.value)
}

const handleProgress = (event: any, file: UploadFile, fileList: UploadFiles) => {
  emit('progress', event, file, fileList)
}

const handleExceed = (files: UploadFile[], fileList: UploadFiles) => {
  ElMessage.warning(`最多只能上传${limit.value}个文件`)
  emit('exceed', files, fileList)
}

const submitUpload = () => {
  uploadRef.value?.submitUpload()
}

const clearFiles = () => {
  uploadRef.value?.clearFiles()
  fileList.value = []
}

defineExpose({
  submitUpload,
  clearFiles,
  uploadRef
})
</script>

<style scoped>
.smart-attachment-upload {
  width: 100%;
}
</style>
