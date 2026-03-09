<template>
  <div class="detail-container">
    <div class="detail-content">
      <el-card>
        <el-skeleton v-if="loading" :rows="10" animated />
        
        <div v-else class="detail-info">
          <div class="info-section">
            <div class="section-title">基本信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="关联菜单">
                {{ detailData.menuName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="菜单路径">
                {{ detailData.menuPath || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="附件名称">
                {{ detailData.attachmentName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="附件类型">
                <el-tag
                  v-for="type in (detailData.attachmentTypes || [])"
                  :key="type"
                  :type="getAttachmentTypeTag(type)"
                  size="small"
                  style="margin-right: 4px"
                >
                  {{ getAttachmentTypeLabel(type) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="大小限制">
                {{ detailData.maxSize }} MB
              </el-descriptions-item>
              <el-descriptions-item label="是否必传">
                <el-tag :type="detailData.required ? 'danger' : 'info'" size="small">
                  {{ detailData.required ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="允许类型">
                {{ (detailData.allowedTypes || []).map((t: string) => t.toUpperCase()).join(', ') || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="排序">
                {{ detailData.sort || 0 }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="info-section">
            <div class="section-title">功能配置</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="批量上传">
                <el-tag :type="detailData.allowBatchUpload ? 'success' : 'info'" size="small">
                  {{ detailData.allowBatchUpload ? '支持' : '不支持' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="文件预览">
                <el-tag :type="detailData.allowPreview ? 'success' : 'info'" size="small">
                  {{ detailData.allowPreview ? '支持' : '不支持' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="detailData.status === 'enabled' ? 'success' : 'info'" size="small">
                  {{ detailData.status === 'enabled' ? '启用' : '禁用' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="附件模板">
                <div v-if="detailData.templateFileName" class="template-file">
                  <el-icon><Document /></el-icon>
                  <span class="template-name">{{ detailData.templateFileName }}</span>
                  <el-button 
                    v-if="detailData.templateFileUrl" 
                    type="primary" 
                    link 
                    size="small"
                    @click="handlePreview"
                  >
                    预览
                  </el-button>
                </div>
                <span v-else>-</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="info-section">
            <div class="section-title">其他信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="附件说明" :span="2">
                {{ detailData.description || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="创建人">
                {{ detailData.createdBy || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ formatDate(detailData.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="更新人">
                {{ detailData.updatedBy || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                {{ formatDate(detailData.updatedAt) }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-card>
    </div>

    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Document, View } from '@element-plus/icons-vue'
import { attachmentConfigApi } from '@/api/attachmentConfigApi'
import { getAttachmentTypeLabel, getAttachmentTypeTag, formatDate } from '@/utils/attachment'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const detailData = reactive<any>({})

const id = String(route.query.id || '')

const loadData = async () => {
  if (!id) {
    ElMessage.error('缺少附件配置ID')
    router.back()
    return
  }

  try {
    const response = await attachmentConfigApi.getAttachmentConfigDetail(id)
    if (response.data) {
      Object.assign(detailData, response.data)
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push({
    path: '/admin/attachment-config-edit',
    query: { id }
  })
}

const handlePreview = () => {
  if (detailData.templateFileUrl) {
    window.open(detailData.templateFileUrl, '_blank')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding-left: 12px;
  border-left: 3px solid #409eff;
}

.template-file {
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-name {
  color: #409eff;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: 200px;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
}
</style>
