<template>
  <div class="attachment-template-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>附件模板管理</span>
        </div>
      </template>

      <CommonTable
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        :show-selection="true"
        :show-index="true"
        :show-toolbar="true"
        :show-column-setting="true"
        :show-list-management="true"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #toolbar-left>
          <el-input
            v-model="searchForm.templateName"
            placeholder="模板名称"
            prefix-icon="Search"
            clearable
            style="width: 200px; margin-right: 12px"
            @input="handleSearch"
          />
          <el-select
            v-model="searchForm.fileType"
            placeholder="文件类型"
            clearable
            style="width: 150px; margin-right: 12px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="图片" value="image" />
            <el-option label="文档" value="document" />
            <el-option label="压缩包" value="archive" />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </template>

        <template #toolbar-right>
          <el-button type="primary" @click="handleUpload">
            <el-icon><Upload /></el-icon>
            上传模板
          </el-button>
          <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </template>

        <template #column-fileSize="{ row }">
          {{ formatFileSize(row.fileSize) }}
        </template>

        <template #column-downloadCount="{ row }">
          <el-tag type="info" size="small">
            {{ row.downloadCount }}次
          </el-tag>
        </template>

        <template #column-actions="{ row }">
          <el-button size="small" type="primary" link @click="handlePreview(row)">
            <el-icon><View /></el-icon>
            预览
          </el-button>
          <el-button size="small" type="primary" link @click="handleDownload(row)">
            <el-icon><Download /></el-icon>
            下载
          </el-button>
          <el-button size="small" type="primary" link @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <AttachmentTemplateUpload
      v-model:visible="uploadVisible"
      @submit="handleSubmit"
    />

    <AttachmentTemplateEdit
      v-model:visible="editVisible"
      :template-data="currentTemplate"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Upload,
  Delete,
  View,
  Download,
  Edit
} from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import AttachmentTemplateUpload from './AttachmentTemplateUpload.vue'
import AttachmentTemplateEdit from './AttachmentTemplateEdit.vue'
import { attachmentTemplateApi } from '@/api/attachmentTemplateApi'
import type { AttachmentTemplate } from '@/types/attachment'
import type { ColumnConfig } from '@/types/common-table'

const tableRef = ref()
const loading = ref(false)
const tableData = ref<AttachmentTemplate[]>([])
const selectedRows = ref<AttachmentTemplate[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  templateName: '',
  fileType: ''
})

const uploadVisible = ref(false)
const editVisible = ref(false)
const currentTemplate = ref<AttachmentTemplate | null>(null)

const columns: ColumnConfig[] = [
  { field: 'templateName', label: '模板名称', width: 200, sortable: true },
  { field: 'fileName', label: '文件名称', width: 200, sortable: true },
  { field: 'fileType', label: '文件类型', width: 120, sortable: true },
  { field: 'fileSize', label: '文件大小', width: 120, sortable: true },
  { field: 'downloadCount', label: '下载次数', width: 120, sortable: true },
  { field: 'createdBy', label: '创建人', width: 120 },
  { field: 'createdAt', label: '创建时间', width: 160, sortable: true },
  { field: 'actions', label: '操作', width: 280, fixed: 'right' }
]

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    }
    const { data } = await attachmentTemplateApi.getTemplateList(params)
    tableData.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    templateName: '',
    fileType: ''
  })
  currentPage.value = 1
  fetchData()
}

const handleUpload = () => {
  uploadVisible.value = true
}

const handleEdit = (row: AttachmentTemplate) => {
  currentTemplate.value = row
  editVisible.value = true
}

const handlePreview = async (row: AttachmentTemplate) => {
  try {
    const { data } = await attachmentTemplateApi.previewTemplate(row.id)
    if (data.previewUrl) {
      window.open(data.previewUrl, '_blank')
    }
  } catch (error) {
    ElMessage.error('预览失败')
  }
}

const handleDownload = async (row: AttachmentTemplate) => {
  try {
    const blob = await attachmentTemplateApi.downloadTemplate(row.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = row.fileName || row.templateName
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('下载成功')
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

const handleDelete = async (row: AttachmentTemplate) => {
  try {
    await ElMessageBox.confirm(`确定要删除模板"${row.templateName}"吗？`, '提示', {
      type: 'warning'
    })
    await attachmentTemplateApi.deleteTemplate(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}个模板吗？`, '提示', {
      type: 'warning'
    })
    const ids = selectedRows.value.map(row => row.id)
    await attachmentTemplateApi.batchDeleteTemplate(ids)
    ElMessage.success('批量删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleSubmit = () => {
  uploadVisible.value = false
  editVisible.value = false
  fetchData()
}

const handleSelectionChange = (selection: AttachmentTemplate[]) => {
  selectedRows.value = selection
}

const handleSortChange = () => {
  fetchData()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.attachment-template-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}
</style>
