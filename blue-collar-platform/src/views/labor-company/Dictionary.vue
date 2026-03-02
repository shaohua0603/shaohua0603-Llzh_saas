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
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="字典名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入字典名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="字典类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择字典类型"
            style="width: 100%"
          >
            <el-option label="业务字典" value="business" />
            <el-option label="自定义字典" value="custom" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="字典编码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入字典编码（英文）"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="字典说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入字典说明"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="valuesDialogVisible"
      title="管理字典值"
      width="900px"
      :close-on-click-modal="false"
    >
      <div class="dict-values-header">
        <div class="dict-info">
          <span class="dict-name">{{ currentDictionary?.name }}</span>
          <span class="dict-code">{{ currentDictionary?.code }}</span>
        </div>
        <el-button type="primary" size="small" @click="handleAddValue">
          新增值
        </el-button>
      </div>
      
      <el-table
        :data="currentDictValues"
        border
        stripe
        style="width: 100%; margin-top: 12px"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="value" label="字典值" width="150">
          <template #default="scope">
            <el-input
              v-if="scope.row.editing"
              v-model="scope.row.value"
              size="small"
              placeholder="字典值"
            />
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="label" label="显示标签" width="150">
          <template #default="scope">
            <el-input
              v-if="scope.row.editing"
              v-model="scope.row.label"
              size="small"
              placeholder="显示标签"
            />
            <span v-else>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="120">
          <template #default="scope">
            <el-input-number
              v-if="scope.row.editing"
              v-model="scope.row.sort"
              size="small"
              :min="0"
              controls-position="right"
              style="width: 100px"
            />
            <span v-else>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'info'" size="small">
              {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <template v-if="scope.row.editing">
              <el-button size="small" type="success" link @click="handleSaveValue(scope.row)">
                保存
              </el-button>
              <el-button size="small" link @click="handleCancelValue(scope.row)">
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button size="small" type="primary" link @click="handleEditValue(scope.row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" link @click="handleDeleteValue(scope.row)">
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <el-button @click="valuesDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

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
import DictionaryService from '@/services/dictionaryService'
import type {
  Dictionary,
  DictionaryQueryParams,
  DictionaryFormData,
  DictionaryValue
} from '@/types/dictionary'

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

const dialogVisible = ref(false)
const valuesDialogVisible = ref(false)
const importDialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const importing = ref(false)
const formRef = ref()
const uploadRef = ref<UploadInstance>()
const importFile = ref<File | null>(null)

const currentDictionary = ref<Dictionary | null>(null)
const currentDictValues = ref<DictionaryValue[]>([])

const formData = reactive<DictionaryFormData>({
  id: '',
  name: '',
  type: 'business',
  code: '',
  description: '',
  values: []
})

const formRules = {
  name: [
    { required: true, message: '请输入字典名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择字典类型', trigger: 'change' }
  ],
  code: [
    { required: true, message: '请输入字典编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '字典编码只能包含字母、数字和下划线', trigger: 'blur' }
  ]
}

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
    const response = await DictionaryService.getDictionaryList(params)
    tableData.value = response.list
    total.value = response.total
  } catch (error) {
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
  dialogTitle.value = '新增字典'
  Object.assign(formData, {
    id: '',
    name: '',
    type: 'business',
    code: '',
    description: '',
    values: []
  })
  dialogVisible.value = true
}

const handleView = (row: Dictionary) => {
  dialogTitle.value = '查看字典'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    type: row.type,
    code: row.code,
    description: row.description || '',
    values: row.values || []
  })
  dialogVisible.value = true
}

const handleEdit = (row: Dictionary) => {
  dialogTitle.value = '编辑字典'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    type: row.type,
    code: row.code,
    description: row.description || '',
    values: row.values || []
  })
  dialogVisible.value = true
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

const handleDeleteValue = async (row: DictionaryValue) => {
  try {
    await ElMessageBox.confirm('确定要删除该字典值吗？', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    const index = currentDictValues.value.findIndex(v => v.id === row.id)
    if (index !== -1) {
      currentDictValues.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
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

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        if (formData.id) {
          await DictionaryService.updateDictionary(formData.id, formData)
          ElMessage.success('更新成功')
        } else {
          await DictionaryService.createDictionary(formData)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error(formData.id ? '更新失败' : '创建失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
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
}
</style>
