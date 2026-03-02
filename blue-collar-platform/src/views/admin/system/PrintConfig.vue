<template>
  <div class="print-config-container">
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="print-config-list"
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
          新增配置
        </el-button>
        <el-button @click="handleBatchEnable" :disabled="!selectedRows.length">
          <el-icon><Check /></el-icon>
          批量启用
        </el-button>
        <el-button @click="handleBatchDisable" :disabled="!selectedRows.length">
          <el-icon><Close /></el-icon>
          批量禁用
        </el-button>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusColor(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button size="small" type="primary" link @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button
          size="small"
          type="success"
          link
          @click="handleEnable(row)"
          v-if="row.status === 'disabled'"
        >
          启用
        </el-button>
        <el-button
          size="small"
          type="warning"
          link
          @click="handleDisable(row)"
          v-if="row.status === 'enabled'"
        >
          禁用
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
            <el-form-item label="业务代码" prop="businessCode">
              <el-select
                v-model="formData.businessCode"
                placeholder="请选择业务代码"
                style="width: 100%"
                filterable
                @change="handleBusinessCodeChange"
              >
                <el-option
                  v-for="business in businessList"
                  :key="business.code"
                  :label="`${business.name} (${business.code})`"
                  :value="business.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务名称" prop="businessName">
              <el-input
                v-model="formData.businessName"
                placeholder="业务名称"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="打印模版" prop="templateId">
              <el-select
                v-model="formData.templateId"
                placeholder="请选择打印模版"
                style="width: 100%"
                filterable
                @change="handleTemplateChange"
              >
                <el-option
                  v-for="template in templateList"
                  :key="template.id"
                  :label="template.templateName"
                  :value="template.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="formData.status"
                active-value="enabled"
                inactive-value="disabled"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="数据映射">
          <div class="data-mapping-container">
            <div class="mapping-header">
              <span>业务字段</span>
              <span>映射到变量</span>
              <span>操作</span>
            </div>
            <div v-for="(mapping, index) in formData.dataMapping.mappings" :key="index" class="mapping-row">
              <el-select
                v-model="mapping.businessField"
                placeholder="选择业务字段"
                style="width: 35%"
                filterable
              >
                <el-option
                  v-for="field in businessFields"
                  :key="field.fieldName"
                  :label="field.fieldLabel"
                  :value="field.fieldName"
                />
              </el-select>
              <span class="mapping-arrow">→</span>
              <el-select
                v-model="mapping.templateVariable"
                placeholder="选择模版变量"
                style="width: 35%"
                filterable
              >
                <el-option
                  v-for="variable in templateVariables"
                  :key="variable.variableName"
                  :label="variable.variableLabel"
                  :value="variable.variableName"
                />
              </el-select>
              <el-select
                v-model="mapping.mappingType"
                placeholder="映射类型"
                style="width: 15%"
              >
                <el-option label="直接映射" value="direct" />
                <el-option label="表达式" value="expression" />
                <el-option label="常量" value="constant" />
              </el-select>
              <el-button
                type="danger"
                link
                @click="removeMapping(index)"
              >
                删除
              </el-button>
            </div>
            <el-button type="primary" link @click="addMapping">
              <el-icon><Plus /></el-icon>
              添加映射
            </el-button>
          </div>
        </el-form-item>

        <el-divider>打印设置</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="打印方向" label-width="100px">
              <el-select v-model="formData.printSettings.orientation" style="width: 100%">
                <el-option label="纵向" value="portrait" />
                <el-option label="横向" value="landscape" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纸张大小" label-width="100px">
              <el-select v-model="formData.printSettings.paperSize" style="width: 100%">
                <el-option label="A4" value="A4" />
                <el-option label="A3" value="A3" />
                <el-option label="B4" value="B4" />
                <el-option label="B5" value="B5" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="打印份数" label-width="100px">
              <el-input-number
                v-model="formData.printSettings.copies"
                :min="1"
                :max="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打印质量" label-width="100px">
              <el-select v-model="formData.printSettings.quality" style="width: 100%">
                <el-option label="低" value="low" />
                <el-option label="中" value="medium" />
                <el-option label="高" value="high" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Check, Close } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'
import type { PrintConfig, ConfigStatus, BusinessField, Variable } from '@/types/print-management'

const tableRef = ref()
const loading = ref(false)
const tableData = ref<PrintConfig[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const defaultSort = ref({ prop: 'createdAt', order: 'descending' })
const selectedRows = ref<PrintConfig[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

const businessList = ref<any[]>([])
const templateList = ref<any[]>([])
const businessFields = ref<BusinessField[]>([])
const templateVariables = ref<Variable[]>([])

const formData = reactive({
  id: '',
  businessCode: '',
  businessName: '',
  templateId: '',
  templateName: '',
  dataMapping: {
    mappings: [] as any[]
  },
  printSettings: {
    copies: 1,
    quality: 'medium',
    orientation: 'portrait',
    paperSize: 'A4'
  },
  status: 'enabled' as ConfigStatus
})

const formRules = {
  businessCode: [
    { required: true, message: '请选择业务代码', trigger: 'change' }
  ],
  templateId: [
    { required: true, message: '请选择打印模版', trigger: 'change' }
  ]
}

const columns: ColumnConfig[] = [
  {
    prop: 'businessCode',
    label: '业务代码',
    width: 150,
    sortable: true
  },
  {
    prop: 'businessName',
    label: '业务名称',
    width: 180,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'templateName',
    label: '打印模版',
    minWidth: 180,
    showTooltip: true,
    formatter: (value) => value || '-'
  },
  {
    prop: 'dataMapping',
    label: '数据映射',
    minWidth: 200,
    showTooltip: true,
    formatter: (value) => {
      if (!value || !value.mappings || value.mappings.length === 0) return '-'
      const mappings = value.mappings.slice(0, 3).map((m: any) => `${m.businessField}→${m.templateVariable}`).join('、')
      return value.mappings.length > 3 ? `${mappings}...` : mappings
    }
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    sortable: true
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
    const response = await fetch('/api/v1/print-configs', {
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

const fetchBusinessList = async () => {
  try {
    const response = await fetch('/api/v1/print/business-codes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      businessList.value = result.data
    }
  } catch (error) {
    console.error('获取业务列表失败:', error)
  }
}

const fetchTemplateList = async () => {
  try {
    const response = await fetch('/api/v1/print-templates?status=published', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      templateList.value = result.data.list
    }
  } catch (error) {
    console.error('获取模版列表失败:', error)
  }
}

const fetchBusinessFields = async (businessCode: string) => {
  try {
    const response = await fetch(`/api/v1/print-configs/business-fields/${businessCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      businessFields.value = result.data.fields
    }
  } catch (error) {
    console.error('获取业务字段失败:', error)
  }
}

const handleSearch = (keyword: string) => {
  currentPage.value = 1
  fetchData()
}

const handleAdd = () => {
  dialogTitle.value = '新增打印配置'
  Object.assign(formData, {
    id: '',
    businessCode: '',
    businessName: '',
    templateId: '',
    templateName: '',
    dataMapping: {
      mappings: []
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    status: 'enabled'
  })
  businessFields.value = []
  templateVariables.value = []
  dialogVisible.value = true
}

const handleEdit = (row: PrintConfig) => {
  dialogTitle.value = '编辑打印配置'
  Object.assign(formData, {
    id: row.id,
    businessCode: row.businessCode,
    businessName: row.businessName,
    templateId: row.templateId,
    templateName: row.templateName,
    dataMapping: row.dataMapping || { mappings: [] },
    printSettings: row.printSettings,
    status: row.status
  })
  fetchBusinessFields(row.businessCode)
  fetchTemplateVariables(row.templateId)
  dialogVisible.value = true
}

const handleBusinessCodeChange = async (code: string) => {
  const business = businessList.value.find(b => b.code === code)
  if (business) {
    formData.businessName = business.name
  }
  await fetchBusinessFields(code)
}

const handleTemplateChange = async (templateId: string) => {
  const template = templateList.value.find(t => t.id == templateId)
  if (template) {
    formData.templateName = template.templateName
  }
  await fetchTemplateVariables(templateId)
}

const fetchTemplateVariables = async (templateId: string) => {
  try {
    const response = await fetch(`/api/v1/print-templates/${templateId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      templateVariables.value = result.data.variables || []
    }
  } catch (error) {
    console.error('获取模版变量失败:', error)
  }
}

const addMapping = () => {
  formData.dataMapping.mappings.push({
    businessField: '',
    templateVariable: '',
    mappingType: 'direct'
  })
}

const removeMapping = (index: number) => {
  formData.dataMapping.mappings.splice(index, 1)
}

const handleEnable = async (row: PrintConfig) => {
  try {
    const response = await fetch(`/api/v1/print-configs/${row.id}/enable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('启用成功')
      fetchData()
    } else {
      ElMessage.error(result.message || '启用失败')
    }
  } catch (error) {
    console.error('启用失败:', error)
    ElMessage.error('启用失败')
  }
}

const handleDisable = async (row: PrintConfig) => {
  try {
    const response = await fetch(`/api/v1/print-configs/${row.id}/disable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('禁用成功')
      fetchData()
    } else {
      ElMessage.error(result.message || '禁用失败')
    }
  } catch (error) {
    console.error('禁用失败:', error)
    ElMessage.error('禁用失败')
  }
}

const handleBatchEnable = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要启用的配置')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要启用选中的${selectedRows.value.length}个配置吗？`, '提示', {
      type: 'warning'
    })
    let successCount = 0
    for (const row of selectedRows.value) {
      try {
        const response = await fetch(`/api/v1/print-configs/${row.id}/enable`, {
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
        console.error('启用失败:', error)
      }
    }
    ElMessage.success(`成功启用${successCount}个配置`)
    fetchData()
  } catch {
  }
}

const handleBatchDisable = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要禁用的配置')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要禁用选中的${selectedRows.value.length}个配置吗？`, '提示', {
      type: 'warning'
    })
    let successCount = 0
    for (const row of selectedRows.value) {
      try {
        const response = await fetch(`/api/v1/print-configs/${row.id}/disable`, {
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
        console.error('禁用失败:', error)
      }
    }
    ElMessage.success(`成功禁用${successCount}个配置`)
    fetchData()
  } catch {
  }
}

const handleDelete = async (row: PrintConfig) => {
  try {
    await ElMessageBox.confirm(`确定要删除该打印配置吗？`, '提示', {
      type: 'warning'
    })
    const response = await fetch(`/api/v1/print-configs/${row.id}`, {
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

const handleBatchAction = (rows: PrintConfig[]) => {
  selectedRows.value = rows
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        const url = formData.id ? `/api/v1/print-configs/${formData.id}` : '/api/v1/print-configs'
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

const getStatusColor = (status: ConfigStatus) => {
  const colorMap: Record<ConfigStatus, string> = {
    enabled: 'success',
    disabled: 'info'
  }
  return colorMap[status] || 'info'
}

const getStatusText = (status: ConfigStatus) => {
  const textMap: Record<ConfigStatus, string> = {
    enabled: '启用',
    disabled: '禁用'
  }
  return textMap[status] || '禁用'
}

onMounted(() => {
  fetchData()
  fetchBusinessList()
  fetchTemplateList()
})
</script>

<style scoped>
.print-config-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.data-mapping-container {
  width: 100%;
}

.mapping-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #606266;
}

.mapping-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.mapping-arrow {
  margin: 0 12px;
  color: #909399;
  font-size: 16px;
}

@media screen and (max-width: 768px) {
  .print-config-container {
    padding: 16px;
  }

  .mapping-row {
    flex-wrap: wrap;
  }

  .mapping-row > * {
    margin-bottom: 8px;
  }
}
</style>
