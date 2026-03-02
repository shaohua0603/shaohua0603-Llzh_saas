<template>
  <div class="admin-tenant-tag-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入标签名称/描述"
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
        新增标签
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
        table-id="admin-tenant-tags"
        :loading="loading"
        :total="total"
        :current-page="queryParams.page"
        :page-size="queryParams.pageSize"
        :show-toolbar="false"
        :show-selection="true"
        :show-index="true"
        :show-actions="true"
        :action-column-width="150"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #actions="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
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
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入标签名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
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
  getTenantTagList,
  createTenantTag,
  updateTenantTag,
  deleteTenantTag,
  batchDeleteTenantTags
} from '@/api/system/tenantTagApi'
import type { TenantTag, TenantTagFormData } from '@/api/system/tenantTagApi'

// 表格引用
const tableRef = ref()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 表格数据
const tableData = ref<TenantTag[]>([])

// 总数
const total = ref(0)

// 选中的行
const selectedRows = ref<TenantTag[]>([])

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: ''
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'name', label: '标签名称', width: 200 },
  { prop: 'description', label: '描述', minWidth: 300 },
  { prop: 'createTime', label: '创建时间', width: 180 },
  { prop: 'updateTime', label: '最后更新时间', width: 180 }
]

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增标签')
const isEdit = ref(false)
const currentId = ref('')

// 表单数据
const form = reactive<TenantTagFormData>({
  name: '',
  description: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 50, message: '标签名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述长度不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getTenantTagList(queryParams)
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
const handleSelectionChange = (selection: TenantTag[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增标签'
  isEdit.value = false
  form.name = ''
  form.description = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: TenantTag) => {
  dialogTitle.value = '编辑标签'
  isEdit.value = true
  currentId.value = row.id
  form.name = row.name
  form.description = row.description || ''
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: TenantTag) => {
  try {
    await ElMessageBox.confirm('确认删除该标签吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    await deleteTenantTag(row.id)
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
    await ElMessageBox.confirm(`确认批量删除选中的 ${selectedRows.value.length} 个标签吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const ids = selectedRows.value.map(row => row.id)
    await batchDeleteTenantTags(ids)
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

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        if (isEdit.value) {
          await updateTenantTag(currentId.value, form)
          ElMessage.success('更新成功')
        } else {
          await createTenantTag(form)
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
.admin-tenant-tag-page {
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
</style>
