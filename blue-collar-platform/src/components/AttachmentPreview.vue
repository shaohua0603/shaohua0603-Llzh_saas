<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="`${fileName} - 预览`"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading" class="preview-container">
      <div v-if="fileType === 'IMAGE'" class="image-preview">
        <el-image
          :src="previewUrl"
          :preview-src-list="[previewUrl]"
          fit="contain"
          style="width: 100%; height: 100%"
        >
          <template #error>
            <div class="image-error">
              <el-icon><Picture /></el-icon>
              <span>图片加载失败</span>
            </div>
          </template>
        </el-image>
      </div>

      <div v-else-if="fileType === 'VIDEO'" class="video-preview">
        <video
          ref="videoRef"
          :src="previewUrl"
          controls
          style="width: 100%; height: 100%"
          @error="handleVideoError"
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <div v-else-if="fileType === 'AUDIO'" class="audio-preview">
        <audio
          ref="audioRef"
          :src="previewUrl"
          controls
          style="width: 100%"
          @error="handleAudioError"
        >
          您的浏览器不支持音频播放
        </audio>
      </div>

      <div v-else-if="fileType === 'DOCUMENT'" class="document-preview">
        <iframe
          v-if="previewUrl"
          :src="previewUrl"
          frameborder="0"
          style="width: 100%; height: 600px"
          @error="handleIframeError"
        />
        <div v-else class="preview-error">
          <el-icon><Document /></el-icon>
          <span>文档预览暂不支持</span>
          <el-button type="primary" link @click="handleDownload">
            下载文件
          </el-button>
        </div>
      </div>

      <div v-else class="file-preview">
        <div class="preview-error">
          <el-icon><Document /></el-icon>
          <span>该文件类型不支持预览</span>
          <el-button type="primary" link @click="handleDownload">
            下载文件
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="preview-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleDownload">
          <el-icon><Download /></el-icon>
          下载
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Document, Download } from '@element-plus/icons-vue'
import { attachmentApi } from '@/api/attachmentApi'
import type { AttachmentRecord } from '@/types/attachment'

interface Props {
  visible: boolean
  file: AttachmentRecord | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
}>()

const loading = ref(false)
const previewUrl = ref('')
const videoRef = ref()
const audioRef = ref()

const fileName = computed(() => props.file?.fileName || '')
const fileType = computed(() => {
  if (!props.file) return ''
  const type = props.file.fileType.toUpperCase()
  if (['JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'WEBP'].includes(type)) {
    return 'IMAGE'
  } else if (['MP4', 'AVI', 'MOV', 'WMV', 'FLV', 'MKV'].includes(type)) {
    return 'VIDEO'
  } else if (['MP3', 'WAV', 'OGG', 'FLAC', 'AAC'].includes(type)) {
    return 'AUDIO'
  } else if (['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'TXT'].includes(type)) {
    return 'DOCUMENT'
  }
  return 'FILE'
})

const fetchPreviewUrl = async () => {
  if (!props.file) return

  loading.value = true
  try {
    const { data } = await attachmentApi.getAttachmentPreview(props.file.id)
    previewUrl.value = data.previewUrl || ''
  } catch (error) {
    ElMessage.error('获取预览地址失败')
  } finally {
    loading.value = false
  }
}

const handleVideoError = () => {
  ElMessage.error('视频加载失败')
}

const handleAudioError = () => {
  ElMessage.error('音频加载失败')
}

const handleIframeError = () => {
  ElMessage.error('文档预览加载失败')
}

const handleDownload = async () => {
  if (!props.file) return

  try {
    const blob = await attachmentApi.downloadAttachment(props.file.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = props.file.fileName
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('下载成功')
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

const handleClose = () => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
  if (audioRef.value) {
    audioRef.value.pause()
  }
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.file) {
      fetchPreviewUrl()
    }
  }
)
</script>

<style scoped>
.preview-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview,
.video-preview,
.audio-preview,
.document-preview,
.file-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-error,
.preview-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
}

.image-error .el-icon,
.preview-error .el-icon {
  font-size: 48px;
  color: #c0c4cc;
}

.preview-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-image__inner) {
  max-height: 600px;
}
</style>
