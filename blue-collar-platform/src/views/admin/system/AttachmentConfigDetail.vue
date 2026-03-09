<template>
  <el-dialog
    :model-value="visible"
    title="附件配置详情"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
    @update:model-value="(value) => emit('update:visible', value)"
  >
    <el-scrollbar max-height="600px">
      <div v-loading="loading" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="附件名称">
            {{ configData.attachmentName }}
          </el-descriptions-item>
          <el-descriptions-item label="附件类型">
            <el-tag
              v-for="type in (configData.attachmentTypes || [])"
              :key="type"
              :type="getAttachmentTypeTag(type)"
              size="small"
              style="margin-right: 4px"
            >
              {{ AttachmentTypeConfig[type as AttachmentType]?.label || type }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="关联菜单">
            {{ configData.menuName }}
          </el-descriptions-item>
          <el-descriptions-item label="菜单路径">
            {{ configData.menuPath }}
          </el-descriptions-item>
          <el-descriptions-item label="大小限制">
            {{ configData.maxSize ? `${configData.maxSize}MB` : '不限制' }}
          </el-descriptions-item>
          <el-descriptions-item label="是否必传">
            <el-tag :type="configData.required ? 'danger' : 'info'" size="small">
              {{ configData.required ? '必传' : '可选' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="允许类型">
            {{ configData.allowedTypes?.join(', ') || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="批量上传">
            <el-tag :type="configData.allowBatchUpload ? 'success' : 'info'" size="small">
              {{ configData.allowBatchUpload ? '支持' : '不支持' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="文件预览">
            <el-tag :type="configData.allowPreview ? 'success' : 'info'" size="small">
              {{ configData.allowPreview ? '支持' : '不支持' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="configData.status === 'enabled' ? 'success' : 'info'" size="small">
              {{ configData.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排序">
            {{ configData.sort }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人">
            {{ configData.createdBy }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(configData.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新人">
            {{ configData.updatedBy }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(configData.updatedAt) }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>附件模板</el-divider>
        <div v-if="configData.templateFileId" class="template-info">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="模板名称">
              {{ configData.templateFileName }}
            </el-descriptions-item>
            <el-descriptions-item label="模板文件">
              <el-button type="primary" link @click="handleDownloadTemplate">
                <el-icon><Download /></el-icon>
                下载模板
              </el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-else class="template-info">
          <el-empty description="未配置附件模板" :image-size="80" />
        </div>

        <el-divider>附件说明</el-divider>
        <div class="description-content">
          {{ configData.description || '暂无说明' }}
        </div>

        <el-divider>操作记录</el-divider>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in operationRecords"
            :key="index"
            :timestamp="formatDate(record.timestamp)"
            placement="top"
          >
            <el-card>
              <h4>{{ record.operation }}</h4>
              <p>操作人：{{ record.operator }}</p>
              <p v-if="record.remark">备注：{{ record.remark }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-scrollbar>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Edit } from '@element-plus/icons-vue'
import { attachmentConfigApi } from '@/api/attachmentConfigApi'
import { AttachmentType, AttachmentTypeConfig, type AttachmentConfig } from '@/types/attachment'

interface Props {
  visible: boolean
  configId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'edit': [config: AttachmentConfig]
}>()

const loading = ref(false)
const configData = ref<AttachmentConfig>({
  id: '',
  menuId: '',
  menuName: '',
  menuPath: '',
  attachmentName: '',
  attachmentTypes: [AttachmentType.IMAGE],
  maxSize: 0,
  required: false,
  templateFileId: '',
  templateFileName: '',
  templateFileUrl: '',
  allowedTypes: [],
  allowBatchUpload: false,
  allowPreview: false,
  description: '',
  status: 'enabled',
  sort: 0,
  createdBy: '',
  createdAt: new Date(),
  updatedBy: '',
  updatedAt: new Date()
})

const operationRecords = ref<any[]>([
  {
    operation: '创建配置',
    operator: '张三',
    timestamp: new Date('2024-01-01 10:00:00'),
    remark: '初始创建'
  },
  {
    operation: '更新配置',
    operator: '李四',
    timestamp: new Date('2024-01-15 14:30:00'),
    remark: '修改文件大小限制'
  }
])

const getAttachmentTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    [AttachmentType.IMAGE]: 'success',
    [AttachmentType.FILE]: 'primary',
    [AttachmentType.VIDEO]: 'warning',
    [AttachmentType.AUDIO]: 'danger',
    [AttachmentType.DOCUMENT]: 'info'
  }
  return tags[type] || 'info'
}

const formatDate = (date: Date | string) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const fetchConfigDetail = async () => {
  if (!props.configId) return

  loading.value = true
  try {
    const { data } = await attachmentConfigApi.getAttachmentConfigDetail(props.configId)
    configData.value = data
  } catch (error) {
    ElMessage.error('获取配置详情失败')
  } finally {
    loading.value = false
  }
}

const handleDownloadTemplate = () => {
  if (!configData.value.templateFileUrl) {
    ElMessage.warning('模板文件不存在')
    return
  }

  const link = document.createElement('a')
  link.href = configData.value.templateFileUrl
  link.download = configData.value.templateFileName || '模板'
  link.click()
}

const handleEdit = () => {
  emit('edit', configData.value)
  handleClose()
}

const handleClose = () => {
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.configId) {
      fetchConfigDetail()
    }
  }
)
</script>

<style scoped>
.detail-content {
  padding: 20px;
}

.template-info {
  padding: 20px 0;
}

.description-content {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 80px;
  line-height: 1.6;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
  width: 120px;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 0;
}

:deep(.el-card) {
  margin-bottom: 10px;
}

:deep(.el-card__body) {
  padding: 12px;
}

:deep(.el-card h4) {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-card p) {
  margin: 4px 0;
  font-size: 13px;
  color: #606266;
}
</style>
