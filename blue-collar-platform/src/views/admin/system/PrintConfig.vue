<template>
  <div class="print-config-layout">
    <!-- 左侧菜单树 -->
    <div class="left-panel">
      <el-card class="menu-tree-card">
        <template #header>
          <div class="card-header">
            <span>菜单列表</span>
            <el-input
              v-model="menuSearchKeyword"
              placeholder="搜索菜单"
              prefix-icon="Search"
              clearable
              size="small"
              style="width: 120px"
              @input="handleMenuSearch"
            />
          </div>
        </template>
        <el-tree
          ref="menuTreeRef"
          :data="menuTreeData"
          :props="treeProps"
          :filter-node-method="filterMenuNode"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          :default-expand-all="true"
          @node-click="handleMenuNodeClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <el-icon v-if="data.icon">
                <component :is="data.icon" />
              </el-icon>
              <span class="menu-label">{{ node.label }}</span>
              <el-tag v-if="data.printConfigCount" size="small" type="info">
                {{ data.printConfigCount }}
              </el-tag>
            </span>
          </template>
        </el-tree>
      </el-card>
    </div>

    <!-- 右侧打印配置 -->
    <div class="right-panel">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>{{ selectedMenuName ? `【${selectedMenuName}】打印配置` : '请在左侧选择菜单' }}</span>
          </div>
        </template>

        <!-- 功能按钮 -->
        <div class="action-bar" v-if="selectedMenuId">
          <el-button type="primary" :disabled="!selectedMenuId" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增配置
          </el-button>
          <el-button @click="handleBatchEnable" :disabled="selectedRows.length === 0">
            <el-icon><Check /></el-icon>批量启用
          </el-button>
          <el-button @click="handleBatchDisable" :disabled="selectedRows.length === 0">
            <el-icon><Close /></el-icon>批量禁用
          </el-button>
        </div>

        <!-- 表格 -->
        <el-table
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
          v-if="selectedMenuId"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="businessCode" label="业务代码" width="150" />
          <el-table-column prop="businessName" label="业务名称" width="180" />
          <el-table-column prop="templateName" label="打印模版" min-width="180">
            <template #default="{ row }">
              {{ row.templateName || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="dataMapping" label="数据映射" min-width="200">
            <template #default="{ row }">
              {{ formatDataMapping(row.dataMapping) }}
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
          </el-table-column>
        </el-table>

        <!-- 空状态提示 -->
        <el-empty v-if="!selectedMenuId" description="请在左侧选择菜单" />
        <el-empty v-if="selectedMenuId && tableData.length === 0 && !loading" description="暂无打印配置" />

        <!-- 分页 -->
        <div class="pagination" v-if="selectedMenuId && tableData.length > 0">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Check, Close, Search, Refresh } from '@element-plus/icons-vue'
import type { PrintConfig, ConfigStatus, BusinessField, Variable } from '@/types/print-management'
import { getMenuTree } from '@/api/system/menuApi'

const menuSearchKeyword = ref('')
const menuTreeRef = ref()
const menuTreeData = ref<any[]>([])
const selectedMenuId = ref<string>('')
const selectedMenuName = ref<string>('')

const treeProps = {
  children: 'children',
  label: 'menuName',
  value: 'id'
}

const loading = ref(false)
const tableData = ref<PrintConfig[]>([])
const selectedRows = ref<PrintConfig[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

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

const loadMenuTree = async () => {
  try {
    const response = await getMenuTree({ menuStatus: 'enabled' })
    if (response.data) {
      const processMenu = (menus: any[]): any[] => {
        return menus.map(menu => ({
          ...menu,
          children: menu.children ? processMenu(menu.children) : undefined
        })).filter(item => item.menuType !== 'button')
      }
      menuTreeData.value = processMenu(response.data)
    }
  } catch (error) {
    ElMessage.error('加载菜单失败')
  }
}

const handleMenuNodeClick = (data: any) => {
  selectedMenuId.value = String(data.id)
  selectedMenuName.value = data.menuName
  currentPage.value = 1
  fetchPrintConfigList()
}

const handleMenuSearch = () => {
  menuTreeRef.value?.filter(menuSearchKeyword.value)
}

const filterMenuNode = (value: string, data: any) => {
  if (!value) return true
  return data.menuName?.includes(value)
}

const fetchPrintConfigList = async () => {
  if (!selectedMenuId.value) {
    tableData.value = []
    return
  }
  
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      menuId: selectedMenuId.value
    }
    const response = await fetch(`/api/v1/print-configs?menuId=${selectedMenuId.value}&page=${currentPage.value}&pageSize=${pageSize.value}`, {
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
    console.error('获取打印配置失败:', error)
    ElMessage.error('获取打印配置失败')
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
      fetchPrintConfigList()
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
      fetchPrintConfigList()
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
    fetchPrintConfigList()
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
    fetchPrintConfigList()
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
      fetchPrintConfigList()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

const handleSelectionChange = (selection: PrintConfig[]) => {
  selectedRows.value = selection
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        const url = formData.id ? `/api/v1/print-configs/${formData.id}` : '/api/v1/print-configs'
        const method = formData.id ? 'PUT' : 'POST'
        const data = {
          ...formData,
          menuId: selectedMenuId.value,
          menuName: selectedMenuName.value
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
          fetchPrintConfigList()
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
  fetchPrintConfigList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchPrintConfigList()
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

const formatDataMapping = (dataMapping: any) => {
  if (!dataMapping || !dataMapping.mappings || dataMapping.mappings.length === 0) return '-'
  const mappings = dataMapping.mappings.slice(0, 3).map((m: any) => `${m.businessField}→${m.templateVariable}`).join('、')
  return dataMapping.mappings.length > 3 ? `${mappings}...` : mappings
}

onMounted(() => {
  loadMenuTree()
  fetchBusinessList()
  fetchTemplateList()
})
</script>

<style scoped>
.print-config-layout {
  display: flex;
  gap: 16px;
  padding: 16px;
  height: calc(100vh - 140px);
  background-color: #f5f7fa;
}

.left-panel {
  width: 300px;
  flex-shrink: 0;
}

.menu-tree-card {
  height: 100%;
}

.menu-tree-card :deep(.el-card__body) {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 12px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding-right: 8px;
}

.menu-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-panel {
  flex: 1;
  min-width: 0;
}

.right-panel :deep(.el-card__body) {
  padding: 16px;
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

@media screen and (max-width: 1200px) {
  .left-panel {
    width: 260px;
  }
}

@media screen and (max-width: 768px) {
  .print-config-layout {
    flex-direction: column;
    height: auto;
  }

  .left-panel {
    width: 100%;
    max-height: 300px;
  }

  .right-panel {
    width: 100%;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .mapping-row {
    flex-wrap: wrap;
  }

  .mapping-row > * {
    margin-bottom: 8px;
  }
}
</style>
