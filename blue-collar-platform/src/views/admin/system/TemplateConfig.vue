<template>
  <div class="template-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>模板配置</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索模板"
            prefix-icon="Search"
            clearable
            size="small"
            style="width: 200px"
            @input="handleSearch"
          />
        </div>
      </template>

      <!-- 功能按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增模板
        </el-button>
        <el-button @click="handleBatchDelete" :disabled="selectedRows.length === 0">
          <el-icon><Delete /></el-icon>批量删除
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="templateCode" label="模板编码" width="150" />
        <el-table-column prop="templateName" label="模板名称" min-width="180" />
        <el-table-column prop="templateType" label="模板类型" width="120">
          <template #default="{ row }">
            {{ getTemplateTypeText(row.templateType) }}
          </template>
        </el-table-column>
        <el-table-column prop="variables" label="变量数量" width="100">
          <template #default="{ row }">
            {{ row.variables ? row.variables.length : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              size="small"
              type="success"
              link
              @click="handlePublish(row)"
              v-if="row.status === 'draft'"
            >
              发布
            </el-button>
            <el-button
              size="small"
              type="warning"
              link
              @click="handleUnpublish(row)"
              v-if="row.status === 'published'"
            >
              取消发布
            </el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" v-if="tableData.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>

      <!-- 空状态提示 -->
      <el-empty v-if="tableData.length === 0 && !loading" description="暂无模板" />
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模板名称" prop="templateName">
              <el-input
                v-model="formData.templateName"
                placeholder="请输入模板名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编码" prop="templateCode">
              <el-input
                v-model="formData.templateCode"
                placeholder="请输入模板编码"
                :disabled="!!formData.id"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模板类型" prop="templateType">
              <el-select
                v-model="formData.templateType"
                placeholder="请选择模板类型"
                style="width: 100%"
              >
                <el-option label="合同类" value="contract" />
                <el-option label="证明类" value="proof" />
                <el-option label="表单类" value="form" />
                <el-option label="证书类" value="certificate" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="formData.status"
                active-value="published"
                inactive-value="draft"
                active-text="已发布"
                inactive-text="草稿"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="模板描述">
          <el-input
            v-model="formData.description"
            placeholder="请输入模板描述"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <el-form-item label="模板内容" prop="templateContent">
          <RichTextEditor
            v-model="formData.templateContent"
            :height="'400px'"
            :variables="formatVariablesForEditor"
            :auto-save="true"
            :draft-storage-key="`template-${formData.id || 'new'}`"
          />
        </el-form-item>

        <el-form-item label="变量定义">
          <div class="variables-container">
            <el-button type="primary" link @click="addVariable">
              <el-icon><Plus /></el-icon>添加变量
            </el-button>
            <el-table :data="formData.variables" style="margin-top: 10px">
              <el-table-column prop="variableName" label="变量名称" width="150">
                <template #default="{ row }">
                  <el-input v-model="row.variableName" placeholder="变量名称" />
                </template>
              </el-table-column>
              <el-table-column prop="variableCode" label="变量编码" width="150">
                <template #default="{ row }">
                  <el-input v-model="row.variableCode" placeholder="变量编码" />
                </template>
              </el-table-column>
              <el-table-column prop="variableType" label="变量类型" width="120">
                <template #default="{ row }">
                  <el-select v-model="row.variableType" style="width: 100%">
                    <el-option label="文本" value="text" />
                    <el-option label="日期" value="date" />
                    <el-option label="数字" value="number" />
                    <el-option label="图片" value="image" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="变量描述" min-width="200">
                <template #default="{ row }">
                  <el-input v-model="row.description" placeholder="变量描述" />
                </template>
              </el-table-column>
              <el-table-column prop="required" label="必填" width="80">
                <template #default="{ row }">
                  <el-switch v-model="row.required" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ $index }">
                  <el-button size="small" type="danger" link @click="removeVariable($index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search } from '@element-plus/icons-vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { PrintTemplate } from '@/types/print-management'

const searchKeyword = ref('')
const loading = ref(false)
const tableData = ref<PrintTemplate[]>([])
const selectedRows = ref<PrintTemplate[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

const formData = reactive({
  id: '',
  templateName: '',
  templateCode: '',
  templateType: 'form',
  templateContent: '',
  variables: [] as any[],
  status: 'draft',
  description: ''
})

const formRules = {
  templateName: [
    { required: true, message: '请输入模板名称', trigger: 'blur' }
  ],
  templateCode: [
    { required: true, message: '请输入模板编码', trigger: 'blur' }
  ],
  templateContent: [
    { required: true, message: '请输入模板内容', trigger: 'blur' }
  ]
}

// 格式化变量列表以供编辑器使用
const formatVariablesForEditor = computed(() => {
  return formData.variables.map(variable => ({
    variableName: variable.variableCode,
    variableLabel: variable.variableName || variable.variableCode,
    variableType: variable.variableType,
    required: variable.required || false
  }))
})

const fetchTemplateList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    }
    const response = await fetch(`/api/v1/print-templates?page=${currentPage.value}&pageSize=${pageSize.value}&keyword=${searchKeyword.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      tableData.value = result.data.list
      total.value = result.data.total
    } else {
      ElMessage.error(result.message || '获取失败')
    }
  } catch (error) {
    console.error('获取模板列表失败:', error)
    ElMessage.error('获取模板列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchTemplateList()
}

const handleAdd = () => {
  dialogTitle.value = '新增模板'
  Object.assign(formData, {
    id: '',
    templateName: '',
    templateCode: '',
    templateType: 'form',
    templateContent: '',
    variables: [],
    status: 'draft',
    description: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: PrintTemplate) => {
  dialogTitle.value = '编辑模板'
  Object.assign(formData, {
    id: row.id,
    templateName: row.templateName,
    templateCode: row.templateCode,
    templateType: row.templateType,
    templateContent: row.templateContent,
    variables: row.variables || [],
    status: row.status,
    description: row.description
  })
  dialogVisible.value = true
}

const handlePublish = async (row: PrintTemplate) => {
  try {
    const response = await fetch(`/api/v1/print-templates/${row.id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('发布成功')
      fetchTemplateList()
    } else {
      ElMessage.error(result.message || '发布失败')
    }
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败')
  }
}

const handleUnpublish = async (row: PrintTemplate) => {
  try {
    const response = await fetch(`/api/v1/print-templates/${row.id}/unpublish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('取消发布成功')
      fetchTemplateList()
    } else {
      ElMessage.error(result.message || '取消发布失败')
    }
  } catch (error) {
    console.error('取消发布失败:', error)
    ElMessage.error('取消发布失败')
  }
}

const handleDelete = async (row: PrintTemplate) => {
  try {
    await ElMessageBox.confirm(`确定要删除模板 ${row.templateName} 吗？`, '提示', {
      type: 'warning'
    })
    const response = await fetch(`/api/v1/print-templates/${row.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('删除成功')
      fetchTemplateList()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的模板')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}个模板吗？`, '提示', {
      type: 'warning'
    })
    let successCount = 0
    for (const row of selectedRows.value) {
      try {
        const response = await fetch(`/api/v1/print-templates/${row.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await response.json()
        if (result.code === 200) {
          successCount++
        }
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
    ElMessage.success(`成功删除${successCount}个模板`)
    fetchTemplateList()
  } catch {
  }
}

const handleSelectionChange = (selection: PrintTemplate[]) => {
  selectedRows.value = selection
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        const url = formData.id ? `/api/v1/print-templates/${formData.id}` : '/api/v1/print-templates'
        const method = formData.id ? 'PUT' : 'POST'
        const data = {
          ...formData
        }
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const result = await response.json()
        if (result.code === 200) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          fetchTemplateList()
        } else {
          ElMessage.error(result.message || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchTemplateList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTemplateList()
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    published: 'success',
    draft: 'info'
  }
  return colorMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    published: '已发布',
    draft: '草稿'
  }
  return textMap[status] || '草稿'
}

const getTemplateTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    contract: '合同类',
    proof: '证明类',
    form: '表单类',
    certificate: '证书类',
    other: '其他'
  }
  return typeMap[type] || '其他'
}

const addVariable = () => {
  formData.variables.push({
    variableName: '',
    variableCode: '',
    variableType: 'text',
    description: '',
    required: false
  })
}

const removeVariable = (index: number) => {
  formData.variables.splice(index, 1)
}

onMounted(() => {
  fetchTemplateList()
})
</script>

<style scoped>
.template-config {
  padding: 16px;
  background-color: #f5f7fa;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.editor-container {
  position: relative;
}

.editor-tools {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.variables-container {
  margin-top: 10px;
}
</style>