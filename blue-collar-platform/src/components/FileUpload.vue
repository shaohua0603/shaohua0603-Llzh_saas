<template>
  <div class="file-upload-container">
    <!-- 模板下载区域 -->
    <div v-if="templates && templates.length > 0" class="template-area">
      <span class="template-label">模板下载：</span>
      <el-button
        v-for="template in templates"
        :key="template.url"
        link
        type="primary"
        @click="handleDownloadTemplate(template)"
      >
        <el-icon><Download /></el-icon>
        {{ template.name }}
      </el-button>
    </div>

    <!-- 上传区域 -->
    <div class="upload-area">
      <el-upload
        ref="uploadRef"
        v-model:file-list="fileList"
        :action="uploadAction"
        :headers="uploadHeaders"
        :data="uploadData"
        :multiple="multiple"
        :drag="drag"
        :accept="accept"
        :limit="limit"
        :disabled="disabled"
        :auto-upload="autoUpload"
        :list-type="listType"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="handleProgress"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :before-upload="handleBeforeUpload"
        :http-request="customRequest"
      >
        <!-- 自定义上传按钮插槽 -->
        <template #trigger>
          <slot name="trigger">
            <!-- 按钮上传区域 -->
            <el-button v-if="!drag" type="primary">
              <el-icon><Upload /></el-icon>
              {{ buttonText }}
            </el-button>
          </slot>
        </template>

        <!-- 自定义上传区域插槽 -->
        <template #default>
          <slot name="default">
            <!-- 拖拽上传区域 -->
            <div v-if="drag" class="upload-dragger">
              <el-icon class="upload-icon"><UploadFilled /></el-icon>
              <div class="upload-text">
                <p>将文件拖到此处，或<em>点击上传</em></p>
                <p class="upload-tip">{{ uploadTip }}</p>
              </div>
            </div>
          </slot>
        </template>
      </el-upload>

      <!-- 文件列表展示 -->
      <div v-if="showFileList && fileList.length > 0" class="file-list">
        <div class="file-list-header">
          <span class="file-list-title">已上传文件（{{ fileList.length }}）</span>
          <div class="file-list-actions">
            <el-button
              v-if="multiple && fileList.length > 1"
              link
              type="primary"
              size="small"
              @click="handleBatchDownload"
            >
              <el-icon><Download /></el-icon>
              批量下载
            </el-button>
            <el-button
              v-if="multiple && fileList.length > 1"
              link
              type="danger"
              size="small"
              @click="handleBatchDelete"
            >
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
          </div>
        </div>

        <div class="file-list-content">
          <div
            v-for="(file, index) in fileList"
            :key="file.uid"
            class="file-item"
            :class="{
              'file-item-success': file.status === 'success',
              'file-item-error': file.status === 'error',
              'file-item-uploading': file.status === 'uploading'
            }"
          >
            <!-- 文件图标 -->
            <div class="file-icon">
              <el-icon v-if="isImage(file)" :size="32"><Picture /></el-icon>
              <el-icon v-else-if="isVideo(file)" :size="32"><VideoPlay /></el-icon>
              <el-icon v-else-if="isAudio(file)" :size="32"><Microphone /></el-icon>
              <el-icon v-else-if="isPDF(file)" :size="32"><Document /></el-icon>
              <el-icon v-else-if="isWord(file)" :size="32"><Document /></el-icon>
              <el-icon v-else-if="isExcel(file)" :size="32"><Grid /></el-icon>
              <el-icon v-else :size="32"><Document /></el-icon>
            </div>

            <!-- 文件信息 -->
            <div class="file-info">
              <div class="file-name" :title="file.name">
                {{ file.name }}
              </div>
              <div class="file-meta">
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <span v-if="file.status === 'uploading'" class="file-progress">
                  {{ file.percentage }}%
                </span>
                <span v-if="file.status === 'success'" class="file-status success">
                  上传成功
                </span>
                <span v-if="file.status === 'error'" class="file-status error">
                  上传失败
                </span>
              </div>
              <!-- 上传进度条 -->
              <el-progress
                v-if="file.status === 'uploading'"
                :percentage="file.percentage || 0"
                :stroke-width="4"
                :show-text="false"
              />
            </div>

            <!-- 文件操作 -->
            <div class="file-actions">
              <el-button
                v-if="file.status === 'success' && isPreviewable(file)"
                link
                type="primary"
                size="small"
                @click="handlePreview(file)"
              >
                <el-icon><View /></el-icon>
                预览
              </el-button>
              <el-button
                v-if="file.status === 'success'"
                link
                type="primary"
                size="small"
                @click="handleDownload(file)"
              >
                <el-icon><Download /></el-icon>
                下载
              </el-button>
              <el-button
                v-if="file.status === 'error'"
                link
                type="warning"
                size="small"
                @click="handleRetry(file)"
              >
                <el-icon><RefreshRight /></el-icon>
                重试
              </el-button>
              <el-button
                v-if="!disabled"
                link
                type="danger"
                size="small"
                @click="handleRemove(file)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="showImagePreview"
      title="图片预览"
      width="800px"
      :close-on-click-modal="true"
      append-to-body
    >
      <div class="image-preview-container">
        <img :src="previewUrl" alt="预览" />
      </div>
    </el-dialog>

    <!-- PDF预览对话框 -->
    <el-dialog
      v-model="showPDFPreview"
      title="PDF预览"
      width="90%"
      :close-on-click-modal="true"
      append-to-body
    >
      <div class="pdf-preview-container">
        <iframe :src="previewUrl" frameborder="0"></iframe>
      </div>
    </el-dialog>

    <!-- 视频预览对话框 -->
    <el-dialog
      v-model="showVideoPreview"
      title="视频预览"
      width="800px"
      :close-on-click-modal="true"
      append-to-body
    >
      <div class="video-preview-container">
        <video :src="previewUrl" controls></video>
      </div>
    </el-dialog>

    <!-- 音频预览对话框 -->
    <el-dialog
      v-model="showAudioPreview"
      title="音频预览"
      width="600px"
      :close-on-click-modal="true"
      append-to-body
    >
      <div class="audio-preview-container">
        <audio :src="previewUrl" controls></audio>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, type UploadInstance, type UploadFile, type UploadFiles, type UploadRawFile, type UploadRequestOptions } from 'element-plus'
import {
  Upload,
  UploadFilled,
  Download,
  Delete,
  Picture,
  VideoPlay,
  Microphone,
  Document,
  Grid,
  View,
  RefreshRight
} from '@element-plus/icons-vue'

// Props定义
interface Template {
  name: string
  url: string
}

interface Props {
  /** v-model绑定的文件列表 */
  modelValue: UploadFile[]
  /** 上传地址 */
  uploadAction?: string
  /** 上传请求头 */
  uploadHeaders?: Record<string, string>
  /** 上传额外参数 */
  uploadData?: Record<string, any>
  /** 是否支持多选 */
  multiple?: boolean
  /** 是否支持拖拽 */
  drag?: boolean
  /** 接受的文件类型 */
  accept?: string
  /** 最大上传数量 */
  limit?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否自动上传 */
  autoUpload?: boolean
  /** 列表类型 */
  listType?: 'text' | 'picture' | 'picture-card'
  /** 最大文件大小（字节） */
  maxSize?: number
  /** 是否显示文件列表 */
  showFileList?: boolean
  /** 模板列表 */
  templates?: Template[]
  /** 上传按钮文字 */
  buttonText?: string
  /** 上传提示文字 */
  uploadTip?: string
  /** 自定义上传请求 */
  httpRequest?: (options: UploadRequestOptions) => Promise<any>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  uploadAction: '/api/upload',
  uploadHeaders: () => ({}),
  uploadData: () => ({}),
  multiple: true,
  drag: true,
  accept: '*',
  limit: 10,
  disabled: false,
  autoUpload: true,
  listType: 'text',
  maxSize: 100 * 1024 * 1024, // 默认100MB
  showFileList: true,
  templates: () => [],
  buttonText: '上传文件',
  uploadTip: '支持批量上传，文件大小不超过100MB'
})

// Emits定义
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

// 响应式数据
const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadFile[]>([...props.modelValue])
const showImagePreview = ref(false)
const showPDFPreview = ref(false)
const showVideoPreview = ref(false)
const showAudioPreview = ref(false)
const previewUrl = ref('')

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    fileList.value = [...newVal]
  },
  { deep: true }
)

// 监听内部值变化
watch(
  fileList,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

// 自定义上传请求
const customRequest = async (options: UploadRequestOptions) => {
  if (props.httpRequest) {
    return props.httpRequest(options)
  }

  // 默认实现：模拟上传
  const { file, onProgress, onSuccess, onError } = options
  const formData = new FormData()
  formData.append('file', file)

  // 模拟上传进度
  let progress = 0
  const timer = setInterval(() => {
    progress += 10
    onProgress({ percent: progress }, file as UploadFile)

    if (progress >= 100) {
      clearInterval(timer)
      // 模拟上传成功
      const response = {
        code: 200,
        message: '上传成功',
        data: {
          url: URL.createObjectURL(file as File),
          name: (file as File).name,
          size: (file as File).size
        }
      }
      onSuccess(response, file as UploadFile)
    }
  }, 200)
}

// 上传前验证
const handleBeforeUpload = (rawFile: UploadRawFile) => {
  // 文件大小验证
  if (props.maxSize && rawFile.size > props.maxSize) {
    ElMessage.error(`文件大小不能超过${formatFileSize(props.maxSize)}`)
    return false
  }

  // 文件类型验证
  if (props.accept && props.accept !== '*') {
    const acceptedTypes = props.accept.split(',').map(type => type.trim())
    const fileType = rawFile.type
    const fileName = rawFile.name.toLowerCase()

    const isAccepted = acceptedTypes.some(accept => {
      if (accept.startsWith('.')) {
        return fileName.endsWith(accept)
      }
      return fileType.includes(accept.replace('*', ''))
    })

    if (!isAccepted) {
      ElMessage.error(`文件类型不符合要求，仅支持${props.accept}`)
      return false
    }
  }

  return true
}

// 文件状态变化
const handleChange = (file: UploadFile, fileList: UploadFiles) => {
  emit('change', file, fileList)
}

// 文件超出限制
const handleExceed = (files: UploadFile[], fileList: UploadFiles) => {
  ElMessage.warning(`最多只能上传${props.limit}个文件`)
  emit('exceed', files, fileList)
}

// 上传进度
const handleProgress = (event: any, file: UploadFile, fileList: UploadFiles) => {
  emit('progress', event, file, fileList)
}

// 上传成功
const handleSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
  ElMessage.success(`${file.name}上传成功`)
  emit('success', response, file, fileList)
}

// 上传失败
const handleError = (error: Error, file: UploadFile, fileList: UploadFiles) => {
  ElMessage.error(`${file.name}上传失败`)
  emit('error', error, file, fileList)
}

// 预览文件
const handlePreview = (file: UploadFile) => {
  emit('preview', file)

  const url = file.url || (file.response?.data?.url)

  if (!url) {
    ElMessage.warning('文件地址不存在')
    return
  }

  previewUrl.value = url

  if (isImage(file)) {
    showImagePreview.value = true
  } else if (isPDF(file)) {
    showPDFPreview.value = true
  } else if (isVideo(file)) {
    showVideoPreview.value = true
  } else if (isAudio(file)) {
    showAudioPreview.value = true
  } else {
    ElMessage.warning('该文件类型不支持预览')
  }
}

// 删除文件
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
  emit('remove', file, fileList.value)
}

// 下载文件
const handleDownload = (file: UploadFile) => {
  const url = file.url || (file.response?.data?.url)

  if (!url) {
    ElMessage.warning('文件地址不存在')
    return
  }

  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
}

// 重试上传
const handleRetry = (file: UploadFile) => {
  uploadRef.value?.submit([file])
}

// 批量下载
const handleBatchDownload = async () => {
  const successFiles = fileList.value.filter(file => file.status === 'success')

  if (successFiles.length === 0) {
    ElMessage.warning('没有可下载的文件')
    return
  }

  // 逐个下载
  for (const file of successFiles) {
    handleDownload(file)
    // 延迟一下，避免浏览器阻止多个下载
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除所有文件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    fileList.value = []
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 下载模板
const handleDownloadTemplate = (template: Template) => {
  const link = document.createElement('a')
  link.href = template.url
  link.download = template.name
  link.click()
}

// 判断是否为图片
const isImage = (file: UploadFile): boolean => {
  return file.raw?.type?.startsWith('image/') || file.name?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
}

// 判断是否为视频
const isVideo = (file: UploadFile): boolean => {
  return file.raw?.type?.startsWith('video/') || file.name?.match(/\.(mp4|avi|mov|wmv|flv|mkv)$/i)
}

// 判断是否为音频
const isAudio = (file: UploadFile): boolean => {
  return file.raw?.type?.startsWith('audio/') || file.name?.match(/\.(mp3|wav|ogg|flac|aac)$/i)
}

// 判断是否为PDF
const isPDF = (file: UploadFile): boolean => {
  return file.raw?.type === 'application/pdf' || file.name?.match(/\.pdf$/i)
}

// 判断是否为Word
const isWord = (file: UploadFile): boolean => {
  return file.raw?.type?.includes('word') || file.raw?.type?.includes('document') ||
         file.name?.match(/\.(doc|docx)$/i)
}

// 判断是否为Excel
const isExcel = (file: UploadFile): boolean => {
  return file.raw?.type?.includes('excel') || file.raw?.type?.includes('spreadsheet') ||
         file.name?.match(/\.(xls|xlsx)$/i)
}

// 判断是否可预览
const isPreviewable = (file: UploadFile): boolean => {
  return isImage(file) || isPDF(file) || isVideo(file) || isAudio(file)
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// 手动上传
const submitUpload = () => {
  uploadRef.value?.submit()
}

// 清空文件列表
const clearFiles = () => {
  uploadRef.value?.clearFiles()
  fileList.value = []
}

// 暴露方法
defineExpose({
  submitUpload,
  clearFiles,
  uploadRef
})
</script>

<style scoped>
.file-upload-container {
  width: 100%;
}

/* 模板下载区域 */
.template-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.template-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 上传区域 */
.upload-area {
  width: 100%;
}

/* 拖拽上传区域 */
.upload-dragger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-dragger:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-text p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

.upload-text em {
  color: #409eff;
  font-style: normal;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
}

/* 文件列表 */
.file-list {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.file-list-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.file-list-actions {
  display: flex;
  gap: 8px;
}

.file-list-content {
  max-height: 400px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s;
}

.file-item:hover {
  background-color: #f5f7fa;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item-success {
  background-color: #f0f9ff;
}

.file-item-error {
  background-color: #fef0f0;
}

.file-item-uploading {
  background-color: #f5f7fa;
}

/* 文件图标 */
.file-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #909399;
}

/* 文件信息 */
.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.file-progress {
  color: #409eff;
  font-weight: 500;
}

.file-status {
  font-weight: 500;
}

.file-status.success {
  color: #67c23a;
}

.file-status.error {
  color: #f56c6c;
}

/* 文件操作 */
.file-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 预览容器 */
.image-preview-container {
  text-align: center;
}

.image-preview-container img {
  max-width: 100%;
  max-height: 600px;
  border-radius: 4px;
}

.pdf-preview-container {
  height: 600px;
}

.pdf-preview-container iframe {
  width: 100%;
  height: 100%;
}

.video-preview-container {
  text-align: center;
}

.video-preview-container video {
  max-width: 100%;
  max-height: 500px;
}

.audio-preview-container {
  text-align: center;
  padding: 20px;
}

.audio-preview-container audio {
  width: 100%;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .template-area {
    flex-direction: column;
    align-items: flex-start;
  }

  .file-list-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .file-item {
    flex-wrap: wrap;
  }

  .file-actions {
    width: 100%;
    justify-content: flex-start;
    margin-top: 8px;
  }
}
</style>
