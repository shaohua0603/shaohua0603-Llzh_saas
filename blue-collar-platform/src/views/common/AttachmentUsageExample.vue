<template>
  <div class="attachment-usage-example">
    <el-card>
      <template #header>
        <span>附件上传使用示例</span>
      </template>

      <el-form :model="formData" label-width="120px">
        <el-form-item label="附件配置ID">
          <el-input v-model="formData.configId" placeholder="请输入附件配置ID" />
        </el-form-item>
        <el-form-item label="业务数据ID">
          <el-input v-model="formData.businessId" placeholder="请输入业务数据ID" />
        </el-form-item>
        <el-form-item label="业务类型">
          <el-input v-model="formData.businessType" placeholder="请输入业务类型" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>附件上传</span>
      </template>

      <SmartAttachmentUpload
        ref="uploadRef"
        v-model="fileList"
        :config-id="formData.configId"
        :business-id="formData.businessId"
        :business-type="formData.businessType"
        @change="handleChange"
        @success="handleSuccess"
        @error="handleError"
        @preview="handlePreview"
        @remove="handleRemove"
        @progress="handleProgress"
      >
        <template #trigger>
          <el-button type="success">
            <el-icon><Upload /></el-icon>
            选择文件
          </el-button>
        </template>
      </SmartAttachmentUpload>

      <div class="upload-actions">
        <el-button type="primary" @click="handleSubmit">
          <el-icon><Check /></el-icon>
          提交
        </el-button>
        <el-button @click="handleClear">
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>已上传文件</span>
      </template>

      <el-table :data="fileList" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="文件名" min-width="200" />
        <el-table-column prop="size" label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'success'" type="success" size="small">
              上传成功
            </el-tag>
            <el-tag v-else-if="row.status === 'uploading'" type="warning" size="small">
              上传中
            </el-tag>
            <el-tag v-else-if="row.status === 'error'" type="danger" size="small">
              上传失败
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'success'"
              size="small"
              type="primary"
              link
              @click="handlePreview(row)"
            >
              预览
            </el-button>
            <el-button
              v-if="row.status === 'success'"
              size="small"
              type="primary"
              link
              @click="handleDownload(row)"
            >
              下载
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="handleRemove(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Check, Delete } from '@element-plus/icons-vue'
import SmartAttachmentUpload from '@/components/SmartAttachmentUpload.vue'
import type { UploadFile, UploadFiles } from 'element-plus'

const uploadRef = ref()
const fileList = ref<UploadFile[]>([])

const formData = reactive({
  configId: '1',
  businessId: 'worker-001',
  businessType: 'worker'
})

const handleChange = (file: UploadFile, fileList: UploadFiles) => {
  console.log('文件状态变化', file, fileList)
}

const handleSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
  console.log('上传成功', response, file, fileList)
}

const handleError = (error: Error, file: UploadFile, fileList: UploadFiles) => {
  console.error('上传失败', error, file, fileList)
}

const handlePreview = (file: UploadFile) => {
  console.log('预览文件', file)
}

const handleRemove = (file: UploadFile) => {
  console.log('删除文件', file)
}

const handleProgress = (event: any, file: UploadFile, fileList: UploadFiles) => {
  console.log('上传进度', event, file, fileList)
}

const handleSubmit = () => {
  const successFiles = fileList.value.filter(file => file.status === 'success')
  if (successFiles.length === 0) {
    ElMessage.warning('没有已上传的文件')
    return
  }

  console.log('提交文件', successFiles)
  ElMessage.success('提交成功')
}

const handleClear = () => {
  uploadRef.value?.clearFiles()
  fileList.value = []
  ElMessage.success('已清空文件列表')
}

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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped>
.attachment-usage-example {
  padding: 20px;
}

.upload-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
</style>
