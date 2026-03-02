<template>
  <el-dialog
    v-model="visible"
    title="编辑附件模板"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
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

      <el-form-item label="当前文件">
        <div class="file-info">
          <el-icon><Document /></el-icon>
          <span>{{ templateData?.fileName }}</span>
          <el-tag type="info" size="small" style="margin-left: 12px">
            {{ formatFileSize(templateData?.fileSize || 0) }}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="下载次数">
        <el-tag type="success" size="small">
          {{ templateData?.downloadCount || 0 }}次
        </el-tag>
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
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { attachmentTemplateApi } from '@/api/attachmentTemplateApi'
import type { AttachmentTemplate } from '@/types/attachment'

interface Props {
  visible: boolean
  templateData: AttachmentTemplate | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'submit': []
}>()

const formRef = ref()
const submitting = ref(false)

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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleSubmit = async () => {
  if (!formRef.value || !props.templateData) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        await attachmentTemplateApi.updateTemplate(props.templateData.id, {
          templateName: formData.templateName,
          description: formData.description
        })
        ElMessage.success('更新成功')
        emit('submit')
        handleClose()
      } catch (error) {
        ElMessage.error('更新失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleClose = () => {
  formRef.value?.resetFields()
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.templateData) {
      Object.assign(formData, {
        templateName: props.templateData.templateName,
        description: props.templateData.description || ''
      })
    }
  }
)
</script>

<style scoped>
.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-info span {
  font-size: 14px;
  color: #303133;
}
</style>
