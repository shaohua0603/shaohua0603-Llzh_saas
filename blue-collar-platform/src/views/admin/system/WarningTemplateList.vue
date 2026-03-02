<template>
  <div class="admin-warning-template-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入模版名称/内容"
            clearable
            style="width: 300px"
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增模版
      </el-button>
      <el-button
        v-if="selectedRows.length > 0"
        type="danger"
        @click="handleBatchDelete"
      >
        批量删除 ({{ selectedRows.length }})
      </el-button>
    </div>

    <!-- 列表区域 -->
    <el-card class="table-card">
      <CommonTable
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        table-id="admin-warning-templates"
        :loading="loading"
        :total="total"
        :current-page="queryParams.page"
        :page-size="queryParams.pageSize"
        :show-toolbar="false"
        :show-selection="true"
        :show-index="true"
        :show-actions="true"
        :action-column-width="200"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #column-content="{ row }">
          <div class="template-content">
            {{ row.content }}
          </div>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="info" link @click="handlePreview(row)">
            预览
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="模版名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入模版名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="模版内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入模版内容，支持变量替换，如：{租户名称}、{套餐名称}、{到期日期}"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="变量说明">
          <div class="variable-tips">
            <el-tag
              v-for="variable in availableVariables"
              :key="variable"
              size="small"
              style="margin-right: 8px; margin-bottom: 8px;"
            >
              {{ variable }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="模版预览"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="模版名称">
          <span>{{ previewForm.name }}</span>
        </el-form-item>
        <el-form-item label="原始内容">
          <div class="preview-content">{{ previewForm.content }}</div>
        </el-form-item>
        <el-form-item label="替换后内容">
          <div class="preview-content preview-result">{{ previewForm.result }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="previewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import {
  getWarningTemplateList,
  createWarningTemplate,
  updateWarningTemplate,
  deleteWarningTemplate,
  batchDeleteWarningTemplates,
  previewWarningTemplate
} from '@/api/system/warningTemplateApi'
import type { WarningTemplate, WarningTemplateFormData } from '@/api/system/warningTemplateApi'

// 表格引用
const tableRef = ref()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 表格数据
const tableData = ref<WarningTemplate[]>([])

// 总数
const total = ref(0)

// 选中的行
const selectedRows = ref<WarningTemplate[]>([])

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: ''
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'name', label: '模版名称', width: 200 },
  { prop: 'content', label: '模版内容', minWidth: 400 },
  { prop: 'createTime', label: '创建时间', width: 180 },
  { prop: 'updateTime', label: '最后更新时间', width: 180 }
]

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增模版')
const isEdit = ref(false)
const currentId = ref('')

// 表单数据
const form = reactive<WarningTemplateFormData>({
  name: '',
  content: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入模版名称', trigger: 'blur' },
    { min: 2, max: 100, message: '模版名称长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入模版内容', trigger: 'blur' },
    { min: 5, max: 500, message: '模版内容长度在 5 到 500 个字符', trigger: 'blur' }
  ]
}

// 可用变量
const availableVariables = [
  '{租户名称}',
  '{套餐名称}',
  '{到期日期}',
  '{联系人}',
  '{手机号}',
  '{预警类型}',
  '{预警时间}',
  '{预警内容}'
]

// 预览对话框
const previewDialogVisible = ref(false)
const previewForm = reactive({
  name: '',
  content: '',
  result: ''
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getWarningTemplateList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.page = 1
  loadData()
}

// 页码变化
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadData()
}

// 每页条数变化
const handlePageSizeChange = (pageSize: number) => {
  queryParams.pageSize = pageSize
  queryParams.page = 1
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: WarningTemplate[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增模版'
  isEdit.value = false
  form.name = ''
  form.content = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: WarningTemplate) => {
  dialogTitle.value = '编辑模版'
  isEdit.value = true
  currentId.value = row.id
  form.name = row.name
  form.content = row.content
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: WarningTemplate) => {
  try {
    await ElMessageBox.confirm('确认删除该模版吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    await deleteWarningTemplate(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  } finally {
    loading.value = false
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认批量删除选中的 ${selectedRows.value.length} 个模版吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const ids = selectedRows.value.map(row => row.id)
    await batchDeleteWarningTemplates(ids)
    ElMessage.success('批量删除成功')
    tableRef.value?.clearSelection()
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  } finally {
    loading.value = false
  }
}

// 预览
const handlePreview = async (row: WarningTemplate) => {
  previewForm.name = row.name
  previewForm.content = row.content
  // 模拟变量替换
  previewForm.result = row.content
    .replace(/{租户名称}/g, '示例租户')
    .replace(/{套餐名称}/g, '基础套餐')
    .replace(/{到期日期}/g, '2024-12-31')
    .replace(/{联系人}/g, '张三')
    .replace(/{手机号}/g, '13800138000')
    .replace(/{预警类型}/g, '套餐到期')
    .replace(/{预警时间}/g, '2024-12-25 10:00:00')
    .replace(/{预警内容}/g, '您的套餐即将到期')
  previewDialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        if (isEdit.value) {
          await updateWarningTemplate(currentId.value, form)
          ElMessage.success('更新成功')
        } else {
          await createWarningTemplate(form)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-warning-template-page {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-card {
  margin-bottom: 20px;
}

.template-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.variable-tips {
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.preview-content {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
  word-break: break-all;
}

.preview-result {
  color: #409eff;
  font-weight: 500;
}
</style>
