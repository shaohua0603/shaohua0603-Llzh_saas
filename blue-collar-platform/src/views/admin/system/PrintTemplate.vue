<template>
  <div class="print-template-container">
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="print-template-list"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :default-sort="defaultSort"
      :show-selection="true"
      :show-actions="true"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
      @global-search="handleSearch"
      @batch-action="handleBatchAction"
    >
      <template #toolbar-left>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增模版
        </el-button>
        <el-button @click="handleBatchPublish" :disabled="!selectedRows.length">
          <el-icon><Upload /></el-icon>
          批量发布
        </el-button>
        <el-button @click="handleBatchUnpublish" :disabled="!selectedRows.length">
          <el-icon><Download /></el-icon>
          批量取消发布
        </el-button>
      </template>

      <template #column-templateType="{ row }">
        <el-tag :type="getTemplateTypeColor(row.templateType)">
          {{ getTemplateTypeText(row.templateType) }}
        </el-tag>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusColor(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button size="small" type="primary" link @click="handlePreview(row)">
          预览
        </el-button>
        <el-button size="small" type="primary" link @click="handleCopy(row)">
          复制
        </el-button>
        <el-button size="small" type="primary" link @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button
          size="small"
          type="primary"
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
    </CommonTable>

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
            <el-form-item label="模版名称" prop="templateName">
              <el-input
                v-model="formData.templateName"
                placeholder="请输入模版名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模版编码" prop="templateCode">
              <el-input
                v-model="formData.templateCode"
                placeholder="请输入模版编码"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模版类型" prop="templateType">
              <el-select
                v-model="formData.templateType"
                placeholder="请选择模版类型"
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
            <el-form-item label="是否默认" prop="isDefault">
              <el-switch v-model="formData.isDefault" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="模版说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入模版说明"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item label="模版内容" prop="templateContent">
          <RichTextEditor
            v-model="formData.templateContent"
            placeholder="请输入打印模版内容"
            :height="350"
          />
        </el-form-item>

        <el-form-item label="变量说明">
          <div class="variable-tips">
            <el-tag size="small" type="info">可用变量格式：{{'{'}}{{'}'}}变量名{{'}'}}</el-tag>
            <span class="tips-text">，如：{{'{'}}公司名称{{'}'}}、{{'{'}}姓名{{'}'}}、{{'{'}}身份证号{{'}'}}、{{'{'}}签订日期{{'}'}}</span>
          </div>
        </el-form-item>

        <el-form-item label="页面设置">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="打印方向" label-width="100px">
                <el-select v-model="formData.pageSettings.orientation" style="width: 100%">
                  <el-option label="纵向" value="portrait" />
                  <el-option label="横向" value="landscape" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纸张大小" label-width="100px">
                <el-select v-model="formData.pageSettings.paperSize" style="width: 100%">
                  <el-option label="A4" value="A4" />
                  <el-option label="A3" value="A3" />
                  <el-option label="B4" value="B4" />
                  <el-option label="B5" value="B5" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="页边距">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input-number
                v-model="formData.pageSettings.margin.top"
                :min="0"
                :max="50"
                label="上"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="6">
              <el-input-number
                v-model="formData.pageSettings.margin.right"
                :min="0"
                :max="50"
                label="右"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="6">
              <el-input-number
                v-model="formData.pageSettings.margin.bottom"
                :min="0"
                :max="50"
                label="下"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="6">
              <el-input-number
                v-model="formData.pageSettings.margin.left"
                :min="0"
                :max="50"
                label="左"
                style="width: 100%"
              />
            </el-col>
          </el-row>
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
      v-model="previewVisible"
      title="打印预览"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="preview-container" v-html="previewContent"></div>

      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handlePrint">
          打印
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { ColumnConfig } from '@/types/common-table'
import type { PrintTemplate, TemplateStatus, TemplateType } from '@/types/print-management'

const tableRef = ref()
const loading = ref(false)
const tableData = ref<PrintTemplate[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const defaultSort = ref({ prop: 'createdAt', order: 'descending' })
const selectedRows = ref<PrintTemplate[]>([])

const dialogVisible = ref(false)
const previewVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()
const previewContent = ref('')

const formData = reactive({
  id: '',
  templateName: '',
  templateCode: '',
  templateType: 'contract' as TemplateType,
  templateContent: '',
  description: '',
  isDefault: false,
  pageSettings: {
    orientation: 'portrait',
    paperSize: 'A4',
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  }
})

const formRules = {
  templateName: [
    { required: true, message: '请输入模版名称', trigger: 'blur' }
  ],
  templateCode: [
    { required: true, message: '请输入模版编码', trigger: 'blur' }
  ],
  templateType: [
    { required: true, message: '请选择模版类型', trigger: 'change' }
  ],
  templateContent: [
    { required: true, message: '请输入模版内容', trigger: 'blur' }
  ]
}

const columns: ColumnConfig[] = [
  {
    prop: 'templateName',
    label: '模版名称',
    width: 180,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'templateCode',
    label: '模版编码',
    width: 180,
    sortable: true
  },
  {
    prop: 'templateType',
    label: '模版类型',
    width: 120,
    sortable: true
  },
  {
    prop: 'description',
    label: '模版说明',
    minWidth: 200,
    showTooltip: true
  },
  {
    prop: 'variables',
    label: '变量数量',
    width: 100,
    formatter: (value) => value?.length || 0
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    sortable: true
  },
  {
    prop: 'isDefault',
    label: '默认模版',
    width: 100,
    formatter: (value) => value ? '是' : '否'
  },
  {
    prop: 'createdBy',
    label: '创建人',
    width: 120
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: 180,
    sortable: true
  }
]

const fetchData = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/v1/print-templates', {
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
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = (keyword: string) => {
  currentPage.value = 1
  fetchData()
}

const handleAdd = () => {
  dialogTitle.value = '新增打印模版'
  Object.assign(formData, {
    id: '',
    templateName: '',
    templateCode: '',
    templateType: 'contract',
    templateContent: '',
    description: '',
    isDefault: false,
    pageSettings: {
      orientation: 'portrait',
      paperSize: 'A4',
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
  })
  dialogVisible.value = true
}

const handleEdit = (row: PrintTemplate) => {
  dialogTitle.value = '编辑打印模版'
  Object.assign(formData, {
    id: row.id,
    templateName: row.templateName,
    templateCode: row.templateCode,
    templateType: row.templateType,
    templateContent: row.templateContent,
    description: row.description,
    isDefault: row.isDefault,
    pageSettings: row.pageSettings
  })
  dialogVisible.value = true
}

const handleCopy = async (row: PrintTemplate) => {
  try {
    const response = await fetch(`/api/v1/print-templates/${row.id}/copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('复制成功')
      fetchData()
    } else {
      ElMessage.error(result.message || '复制失败')
    }
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}

const handlePreview = (row: PrintTemplate) => {
  previewContent.value = row.templateContent
  previewVisible.value = true
}

const handlePrint = () => {
  const printContent = previewContent.value
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>打印</title>
          <style>
            body { padding: 20px; font-family: SimSun, serif; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
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
      fetchData()
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
      fetchData()
    } else {
      ElMessage.error(result.message || '取消发布失败')
    }
  } catch (error) {
    console.error('取消发布失败:', error)
    ElMessage.error('取消发布失败')
  }
}

const handleBatchPublish = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要发布的模版')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要发布选中的${selectedRows.value.length}个模版吗？`, '提示', {
      type: 'warning'
    })
    let successCount = 0
    for (const row of selectedRows.value) {
      try {
        const response = await fetch(`/api/v1/print-templates/${row.id}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await response.json()
        if (result.code === 200) {
          successCount++
        }
      } catch (error) {
        console.error('发布失败:', error)
      }
    }
    ElMessage.success(`成功发布${successCount}个模版`)
    fetchData()
  } catch {
  }
}

const handleBatchUnpublish = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要取消发布的模版')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要取消发布选中的${selectedRows.value.length}个模版吗？`, '提示', {
      type: 'warning'
    })
    let successCount = 0
    for (const row of selectedRows.value) {
      try {
        const response = await fetch(`/api/v1/print-templates/${row.id}/unpublish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await response.json()
        if (result.code === 200) {
          successCount++
        }
      } catch (error) {
        console.error('取消发布失败:', error)
      }
    }
    ElMessage.success(`成功取消发布${successCount}个模版`)
    fetchData()
  } catch {
  }
}

const handleDelete = async (row: PrintTemplate) => {
  try {
    await ElMessageBox.confirm(`确定要删除打印模版"${row.templateName}"吗？`, '提示', {
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
      fetchData()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

const handleBatchAction = (rows: PrintTemplate[]) => {
  selectedRows.value = rows
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        const url = formData.id ? `/api/v1/print-templates/${formData.id}` : '/api/v1/print-templates'
        const method = formData.id ? 'PUT' : 'POST'
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        const result = await response.json()
        if (result.code === 200) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          fetchData()
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
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleSortChange = (sort: any) => {
  console.log('排序:', sort)
  fetchData()
}

const getTemplateTypeColor = (type: TemplateType) => {
  const colorMap: Record<TemplateType, string> = {
    contract: 'primary',
    proof: 'success',
    form: 'warning',
    certificate: 'danger',
    other: 'info'
  }
  return colorMap[type] || 'info'
}

const getTemplateTypeText = (type: TemplateType) => {
  const textMap: Record<TemplateType, string> = {
    contract: '合同类',
    proof: '证明类',
    form: '表单类',
    certificate: '证书类',
    other: '其他'
  }
  return textMap[type] || '其他'
}

const getStatusColor = (status: TemplateStatus) => {
  const colorMap: Record<TemplateStatus, string> = {
    draft: 'info',
    published: 'success'
  }
  return colorMap[status] || 'info'
}

const getStatusText = (status: TemplateStatus) => {
  const textMap: Record<TemplateStatus, string> = {
    draft: '草稿',
    published: '已发布'
  }
  return textMap[status] || '草稿'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.print-template-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.variable-tips {
  display: flex;
  align-items: center;
}

.tips-text {
  margin-left: 12px;
  color: #909399;
  font-size: 13px;
}

.preview-container {
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 400px;
  background: #fff;
}

@media screen and (max-width: 768px) {
  .print-template-container {
    padding: 16px;
  }
}
</style>
