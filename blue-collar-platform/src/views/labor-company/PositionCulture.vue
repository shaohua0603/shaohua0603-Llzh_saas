<template>
  <div class="position-culture-container">
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="工厂">
          <el-select
            v-model="searchForm.factoryId"
            placeholder="请选择工厂"
            clearable
            filterable
            style="width: 200px"
          >
            <el-option
              v-for="factory in factoryList"
              :key="factory.id"
              :label="factory.name"
              :value="factory.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入标题"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        新增岗位文化
      </el-button>
    </div>

    <CommonTable
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      table-id="position-culture"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #toolbar-right>
        <el-button type="primary" @click="handleAdd">
          新增岗位文化
        </el-button>
      </template>
      <template #operations="{ row }">
        <el-button size="small" type="primary" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </CommonTable>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
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
        <el-form-item label="工厂" prop="factoryId">
          <el-select
            v-model="formData.factoryId"
            placeholder="请选择工厂"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="factory in factoryList"
              :key="factory.id"
              :label="factory.name"
              :value="factory.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="岗位文化标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入岗位文化标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="岗位文化内容" prop="content">
          <RichTextEditor
            v-model="formData.content"
            placeholder="请输入岗位文化内容"
            :height="300"
            :auto-save="true"
            :draft-storage-key="'position-culture-draft'"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import RichTextEditor from '@/components/RichTextEditor.vue'
import CommonTable from '@/components/CommonTable.vue'
import { fetchPositionCultureList, savePositionCulture, deletePositionCulture, fetchFactoryListAPI } from '@/api/companyCulture'

const loading = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const searchForm = reactive({
  factoryId: '',
  title: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

const formData = reactive({
  id: '',
  factoryId: '',
  title: '',
  content: ''
})

const formRules = {
  factoryId: [
    { required: true, message: '请选择工厂', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入岗位文化标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入岗位文化内容', trigger: 'blur' }
  ]
}

const factoryList = ref<any[]>([])

const columns = [
  { prop: 'factoryName', label: '工厂名称', minWidth: 150, showTooltip: true },
  { prop: 'title', label: '岗位文化标题', minWidth: 150, showTooltip: true },
  { prop: 'content', label: '岗位文化内容', minWidth: 300, showTooltip: true },
  { prop: 'createTime', label: '创建时间', width: 180 }
]

const fetchFactoryList = async () => {
  try {
    const response = await fetchFactoryListAPI()
    if (response.code === 200) {
      factoryList.value = response.data
    }
  } catch (error) {
    ElMessage.error('获取工厂列表失败')
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const response = await fetchPositionCultureList(params)
    if (response.code === 200 && response.data) {
      tableData.value = response.data.list
      pagination.total = response.data.total
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    factoryId: '',
    title: ''
  })
  handleSearch()
}

const handleAdd = () => {
  dialogTitle.value = '新增岗位文化'
  Object.assign(formData, {
    id: '',
    factoryId: '',
    title: '',
    content: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑岗位文化'
  Object.assign(formData, {
    id: row.id,
    factoryId: row.factoryId,
    title: row.title,
    content: row.content
  })
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该岗位文化吗？', '提示', {
      type: 'warning'
    })
    const response = await deletePositionCulture(row.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch {
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        const response = await savePositionCulture(formData)
        if (response.code === 200) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          fetchData()
        } else {
          ElMessage.error(response.message || '保存失败')
        }
      } catch (error) {
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

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
}

onMounted(() => {
  fetchFactoryList()
  fetchData()
})
</script>

<style scoped>
.position-culture-container {
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

@media screen and (max-width: 768px) {
  .position-culture-container {
    padding: 12px;
  }

  .search-card :deep(.el-form) {
    flex-direction: column;
  }

  .search-card :deep(.el-form-item) {
    width: 100%;
  }

  .search-card :deep(.el-select),
  .search-card :deep(.el-input) {
    width: 100% !important;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
