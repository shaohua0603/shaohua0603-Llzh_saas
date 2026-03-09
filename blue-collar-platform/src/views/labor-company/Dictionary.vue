<template>
  <div class="dictionary-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">字典管理</span>
          <el-button type="primary" @click="handleAdd">
            新增字典
          </el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="字典名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入字典名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="字典编码">
            <el-input
              v-model="searchForm.code"
              placeholder="请输入字典编码"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="字典类型">
            <el-select
              v-model="searchForm.type"
              placeholder="请选择字典类型"
              clearable
              style="width: 150px"
            >
              <el-option label="业务字典" value="business" />
              <el-option label="自定义字典" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              搜索
            </el-button>
            <el-button @click="handleReset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="action-bar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          新增字典
        </el-button>
        <el-button :icon="Upload" @click="handleImport">
          导入字典
        </el-button>
        <el-button :icon="Download" @click="handleExport">
          导出字典
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="字典名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="type" label="字典类型" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 'business'" type="success" size="small">
              业务字典
            </el-tag>
            <el-tag v-else type="warning" size="small">
              自定义字典
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="字典编码" width="150" show-overflow-tooltip />
        <el-table-column prop="values" label="字典值" min-width="300" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.values && scope.row.values.length > 0">
              {{ scope.row.values.slice(0, 3).map((v: any) => v.label).join('、') }}
              <span v-if="scope.row.values.length > 3">...（共{{ scope.row.values.length }}项）</span>
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="字典说明" min-width="200" show-overflow-tooltip />
        <el-table-column prop="creatorName" label="创建人" width="120" />
        <el-table-column prop="departmentName" label="部门" width="120" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button size="small" type="primary" link @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="primary" link @click="handleManageValues(scope.row)">
              管理值
            </el-button>
            <el-button size="small" type="danger" link @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>



    <el-dialog
      v-model="importDialogVisible"
      title="导入字典"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :limit="1"
        accept=".xlsx,.xls"
        :on-change="handleFileChange"
      >
        <el-button type="primary">选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 .xlsx 或 .xls 文件
          </div>
        </template>
      </el-upload>
      
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit" :loading="importing">
          导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type UploadInstance, type UploadUserFile } from 'element-plus'
import { Plus, Upload, Download, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import DictionaryService from '@/services/dictionaryService'
import type {
  Dictionary,
  DictionaryQueryParams,
  DictionaryFormData,
  DictionaryValue
} from '@/types/dictionary'

const router = useRouter()

const loading = ref(false)
const tableData = ref<Dictionary[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<Dictionary[]>([])

const searchForm = reactive({
  name: '',
  code: '',
  type: ''
})

const importDialogVisible = ref(false)
const importing = ref(false)
const uploadRef = ref<UploadInstance>()
const importFile = ref<File | null>(null)

const fetchData = async () => {
  loading.value = true
  try {
    const params: DictionaryQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      name: searchForm.name || undefined,
      code: searchForm.code || undefined,
      type: searchForm.type as any || undefined
    }
    console.log('Fetching dictionary list with params:', params)
    const response = await DictionaryService.getDictionaryList(params)
    console.log('Dictionary list response:', response)
    tableData.value = response.list
    total.value = response.total
  } catch (error) {
    console.error('Error fetching dictionary list:', error)
    ElMessage.error('获取字典列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.code = ''
  searchForm.type = ''
  currentPage.value = 1
  fetchData()
}

const handleSelectionChange = (selection: Dictionary[]) => {
  selectedRows.value = selection
}

const handleAdd = () => {
  router.push('/tenant/dictionary/add')
}

const handleView = (row: Dictionary) => {
  router.push(`/tenant/dictionary/view/${row.id}`)
}

const handleEdit = (row: Dictionary) => {
  router.push(`/tenant/dictionary/edit/${row.id}`)
}

const handleDelete = async (row: Dictionary) => {
  try {
    await ElMessageBox.confirm(`确定要删除字典"${row.name}"吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await DictionaryService.deleteDictionary(row.id)
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
    await ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}个字典吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    const ids = selectedRows.value.map(row => row.id)
    await DictionaryService.batchDeleteDictionaries(ids)
    ElMessage.success('批量删除成功')
    selectedRows.value = []
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleManageValues = async (row: Dictionary) => {
  currentDictionary.value = row
  currentDictValues.value = (row.values || []).map(v => ({ ...v, editing: false }))
  valuesDialogVisible.value = true
}

const handleAddValue = () => {
  const maxSort = Math.max(...currentDictValues.value.map(v => v.sort), 0)
  currentDictValues.value.push({
    id: '',
    value: '',
    label: '',
    sort: maxSort + 1,
    status: 'enabled',
    remark: '',
    editing: true,
    isNew: true
  })
}

const handleEditValue = (row: DictionaryValue) => {
  row.editing = true
  row.isNew = false
}

const handleSaveValue = (row: DictionaryValue) => {
  if (!row.value || !row.label) {
    ElMessage.warning('请输入字典值和显示标签')
    return
  }
  row.editing = false
  row.isNew = false
  ElMessage.success('保存成功')
}

const handleCancelValue = (row: DictionaryValue) => {
  if (row.isNew) {
    const index = currentDictValues.value.findIndex(v => v.id === row.id)
    if (index !== -1) {
      currentDictValues.value.splice(index, 1)
    }
  } else {
    row.editing = false
  }
}

const addDictValue = () => {
  const maxSort = Math.max(...formData.values.map(v => v.sort || 0), 0)
  formData.values.push({
    id: '',
    value: '',
    label: '',
    sort: maxSort + 1,
    status: 'enabled',
    remark: ''
  })
}

const handleImport = () => {
  importDialogVisible.value = true
}

const handleFileChange = (file: UploadUserFile) => {
  importFile.value = file.raw as File
}

const handleImportSubmit = async () => {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }
  importing.value = true
  try {
    const result = await DictionaryService.importDictionaries(importFile.value)
    ElMessage.success(`导入成功：成功${result.success}条，失败${result.failed}条`)
    importDialogVisible.value = false
    importFile.value = null
    uploadRef.value?.clearFiles()
    fetchData()
  } catch (error) {
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}

const handleExport = async () => {
  try {
    const params: DictionaryQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      name: searchForm.name || undefined,
      code: searchForm.code || undefined,
      type: searchForm.type as any || undefined
    }
    const blob = await DictionaryService.exportDictionaries(params)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `字典数据_${new Date().getTime()}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dictionary-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.search-bar {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dict-values-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom:1px solid #ebeef5;
}

.dict-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.dict-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.dict-code {
  font-size: 14px;
  color: #909399;
}

.dict-values-section {
  margin-top: 8px;
}

.add-value-button {
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
}

@media screen and (max-width: 768px) {
  .dictionary-container {
    padding: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .search-bar {
    margin-bottom: 16px;
  }
  
  .search-bar :deep(.el-form-item) {
    display: block;
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .search-bar :deep(.el-input),
  .search-bar :deep(.el-select) {
    width: 100% !important;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-bar > .el-button {
    width: 100%;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
  
  .dict-values-section :deep(.el-table) {
    font-size: 11px;
  }
  
  .dict-values-section :deep(.el-input),
  .dict-values-section :deep(.el-select),
  .dict-values-section :deep(.el-input-number) {
    width: 100% !important;
  }
}
</style>
