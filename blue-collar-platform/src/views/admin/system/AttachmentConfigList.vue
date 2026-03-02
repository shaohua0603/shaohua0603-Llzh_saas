<template>
  <div class="attachment-config-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>附件配置管理</span>
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
            v-model="searchForm.menuName"
            placeholder="菜单名称"
            prefix-icon="Search"
            clearable
            style="width: 200px; margin-right: 12px"
            @input="handleSearch"
          />
          <el-input
            v-model="searchForm.attachmentName"
            placeholder="附件名称"
            prefix-icon="Search"
            clearable
            style="width: 200px; margin-right: 12px"
            @input="handleSearch"
          />
          <el-select
            v-model="searchForm.attachmentType"
            placeholder="附件类型"
            clearable
            style="width: 150px; margin-right: 12px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="图片" value="IMAGE" />
            <el-option label="文件" value="FILE" />
            <el-option label="视频" value="VIDEO" />
            <el-option label="音频" value="AUDIO" />
            <el-option label="文档" value="DOCUMENT" />
          </el-select>
          <el-select
            v-model="searchForm.required"
            placeholder="是否必传"
            clearable
            style="width: 120px; margin-right: 12px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="必传" :value="true" />
            <el-option label="可选" :value="false" />
          </el-select>
          <el-select
            v-model="searchForm.status"
            placeholder="状态"
            clearable
            style="width: 120px; margin-right: 12px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
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
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
          <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </template>

        <template #column-attachmentType="{ row }">
          <el-tag :type="getAttachmentTypeTag(row.attachmentType)" size="small">
            {{ AttachmentTypeConfig[row.attachmentType]?.label || row.attachmentType }}
          </el-tag>
        </template>

        <template #column-maxSize="{ row }">
          {{ row.maxSize ? `${row.maxSize}MB` : '不限制' }}
        </template>

        <template #column-required="{ row }">
          <el-tag :type="row.required ? 'danger' : 'info'" size="small">
            {{ row.required ? '必传' : '可选' }}
          </el-tag>
        </template>

        <template #column-allowBatchUpload="{ row }">
          <el-tag :type="row.allowBatchUpload ? 'success' : 'info'" size="small">
            {{ row.allowBatchUpload ? '支持' : '不支持' }}
          </el-tag>
        </template>

        <template #column-allowPreview="{ row }">
          <el-tag :type="row.allowPreview ? 'success' : 'info'" size="small">
            {{ row.allowPreview ? '支持' : '不支持' }}
          </el-tag>
        </template>

        <template #column-status="{ row }">
          <el-tag :type="row.status === 'enabled' ? 'success' : 'info'" size="small">
            {{ row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <template #column-actions="{ row }">
          <el-button size="small" type="primary" link @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button
            size="small"
            :type="row.status === 'enabled' ? 'warning' : 'success'"
            link
            @click="handleToggleStatus(row)"
          >
            <el-icon><Switch /></el-icon>
            {{ row.status === 'enabled' ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="primary" link @click="handleView(row)">
            <el-icon><View /></el-icon>
            详情
          </el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <AttachmentConfigForm
      v-model:visible="formVisible"
      :form-data="formData"
      :menu-list="menuList"
      :template-list="templateList"
      @submit="handleSubmit"
    />

    <AttachmentConfigDetail
      v-model:visible="detailVisible"
      :config-id="currentConfigId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Edit,
  Switch,
  View
} from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import AttachmentConfigForm from './AttachmentConfigForm.vue'
import AttachmentConfigDetail from './AttachmentConfigDetail.vue'
import { attachmentConfigApi } from '@/api/attachmentConfigApi'
import { AttachmentType, AttachmentTypeConfig, type AttachmentConfig } from '@/types/attachment'
import type { ColumnConfig } from '@/types/common-table'

const tableRef = ref()
const loading = ref(false)
const tableData = ref<AttachmentConfig[]>([])
const selectedRows = ref<AttachmentConfig[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  menuName: '',
  attachmentName: '',
  attachmentType: '',
  required: '',
  status: ''
})

const formVisible = ref(false)
const detailVisible = ref(false)
const currentConfigId = ref('')
const formData = ref<Partial<AttachmentConfig>>({})

const menuList = ref<any[]>([
  { id: '1', name: '请假管理', path: '/leave' },
  { id: '2', name: '调岗管理', path: '/transfer' },
  { id: '3', name: '离职管理', path: '/resignation' },
  { id: '4', name: '报名管理', path: '/registration' },
  { id: '5', name: '工人入职', path: '/worker-onboarding' },
  { id: '6', name: '合同签订', path: '/contract' },
  { id: '7', name: '简历管理', path: '/resume' }
])

const templateList = ref<any[]>([
  { id: '1', name: '身份证模板.pdf' },
  { id: '2', name: '体检表模板.doc' },
  { id: '3', name: '劳动合同模板.pdf' }
])

const columns: ColumnConfig[] = [
  { field: 'menuName', label: '菜单名称', width: 150, sortable: true },
  { field: 'attachmentName', label: '附件名称', width: 150, sortable: true },
  { field: 'attachmentType', label: '附件类型', width: 100, sortable: true },
  { field: 'maxSize', label: '大小限制', width: 100, sortable: true },
  { field: 'required', label: '必传', width: 80, sortable: true },
  { field: 'allowedTypes', label: '允许类型', width: 150 },
  { field: 'allowBatchUpload', label: '批量上传', width: 100 },
  { field: 'allowPreview', label: '支持预览', width: 100 },
  { field: 'status', label: '状态', width: 80, sortable: true },
  { field: 'sort', label: '排序', width: 80, sortable: true },
  { field: 'createdAt', label: '创建时间', width: 150, sortable: true },
  { field: 'actions', label: '操作', width: 280, fixed: 'right' }
]

const getAttachmentTypeTag = (type: AttachmentType) => {
  const tags: Record<AttachmentType, string> = {
    [AttachmentType.IMAGE]: 'success',
    [AttachmentType.FILE]: 'primary',
    [AttachmentType.VIDEO]: 'warning',
    [AttachmentType.AUDIO]: 'danger',
    [AttachmentType.DOCUMENT]: 'info'
  }
  return tags[type] || 'info'
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    }
    const { data } = await attachmentConfigApi.getAttachmentConfigList(params)
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
    menuName: '',
    attachmentName: '',
    attachmentType: '',
    required: '',
    status: ''
  })
  currentPage.value = 1
  fetchData()
}

const handleAdd = () => {
  formData.value = {
    attachmentType: AttachmentType.IMAGE,
    maxSize: 10,
    required: false,
    allowedTypes: ['jpg', 'jpeg', 'png'],
    allowBatchUpload: true,
    allowPreview: true,
    sort: 0,
    status: 'enabled'
  }
  formVisible.value = true
}

const handleEdit = (row: AttachmentConfig) => {
  formData.value = { ...row }
  formVisible.value = true
}

const handleView = (row: AttachmentConfig) => {
  currentConfigId.value = row.id
  detailVisible.value = true
}

const handleDelete = async (row: AttachmentConfig) => {
  try {
    await ElMessageBox.confirm(`确定要删除附件配置"${row.attachmentName}"吗？`, '提示', {
      type: 'warning'
    })
    await attachmentConfigApi.deleteAttachmentConfig(row.id)
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
    await ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}条配置吗？`, '提示', {
      type: 'warning'
    })
    const ids = selectedRows.value.map(row => row.id)
    await attachmentConfigApi.batchDeleteAttachmentConfig(ids)
    ElMessage.success('批量删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleToggleStatus = async (row: AttachmentConfig) => {
  try {
    const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
    await attachmentConfigApi.updateAttachmentConfigStatus(row.id, newStatus)
    ElMessage.success(`${newStatus === 'enabled' ? '启用' : '禁用'}成功`)
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleSubmit = async () => {
  formVisible.value = false
  fetchData()
}

const handleSelectionChange = (selection: AttachmentConfig[]) => {
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
.attachment-config-container {
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
