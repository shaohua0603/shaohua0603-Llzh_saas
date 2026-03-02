<template>
  <div class="admin-education-position-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入学历等级/岗位名称"
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
        新增配置
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
        table-id="admin-education-positions"
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
        <template #column-educationLevel="{ row }">
          <el-tag type="info">{{ row.educationLevel }}</el-tag>
        </template>
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
        <el-form-item label="学历等级" prop="educationLevel">
          <el-select
            v-model="form.educationLevel"
            placeholder="请选择学历等级"
            style="width: 100%"
          >
            <el-option
              v-for="option in educationLevelOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位名称" prop="jobName">
          <el-input
            v-model="form.jobName"
            type="textarea"
            :rows="4"
            placeholder="请输入岗位名称，多个岗位用逗号分隔，如：普工、操作工、包装工"
            maxlength="500"
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
  getEducationPositionList,
  createEducationPosition,
  updateEducationPosition,
  deleteEducationPosition,
  batchDeleteEducationPositions,
  getEducationLevelOptions
} from '@/api/system/educationPositionApi'
import type { EducationPosition, EducationPositionFormData } from '@/api/system/educationPositionApi'

// 表格引用
const tableRef = ref()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 表格数据
const tableData = ref<EducationPosition[]>([])

// 总数
const total = ref(0)

// 选中的行
const selectedRows = ref<EducationPosition[]>([])

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: ''
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'educationLevel', label: '学历等级', width: 150 },
  { prop: 'jobName', label: '岗位名称', minWidth: 300 },
  { prop: 'createTime', label: '创建时间', width: 180 },
  { prop: 'updateTime', label: '最后更新时间', width: 180 }
]

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增配置')
const isEdit = ref(false)
const currentId = ref('')

// 表单数据
const form = reactive<EducationPositionFormData>({
  educationLevel: '',
  jobName: ''
})

// 表单验证规则
const rules: FormRules = {
  educationLevel: [
    { required: true, message: '请选择学历等级', trigger: 'change' }
  ],
  jobName: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
    { min: 2, max: 500, message: '岗位名称长度在 2 到 500 个字符', trigger: 'blur' }
  ]
}

// 学历等级选项
const educationLevelOptions = getEducationLevelOptions()

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getEducationPositionList(queryParams)
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
const handleSelectionChange = (selection: EducationPosition[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增配置'
  isEdit.value = false
  form.educationLevel = ''
  form.jobName = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: EducationPosition) => {
  dialogTitle.value = '编辑配置'
  isEdit.value = true
  currentId.value = row.id
  form.educationLevel = row.educationLevel
  form.jobName = row.jobName
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: EducationPosition) => {
  try {
    await ElMessageBox.confirm('确认删除该配置吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    await deleteEducationPosition(row.id)
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
    await ElMessageBox.confirm(`确认批量删除选中的 ${selectedRows.value.length} 个配置吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const ids = selectedRows.value.map(row => row.id)
    await batchDeleteEducationPositions(ids)
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
          await updateEducationPosition(currentId.value, form)
          ElMessage.success('更新成功')
        } else {
          await createEducationPosition(form)
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
.admin-education-position-page {
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
