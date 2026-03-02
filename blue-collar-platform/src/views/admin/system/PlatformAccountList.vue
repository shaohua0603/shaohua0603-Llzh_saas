<template>
  <div class="admin-platform-account-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入账号/姓名/手机号/邮箱"
            clearable
            style="width: 300px"
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
            @clear="handleSearch"
          >
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
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
        新增账号
      </el-button>
      <el-button
        v-if="selectedRows.length > 0"
        type="success"
        @click="handleBatchEnable"
      >
        批量启用 ({{ selectedRows.length }})
      </el-button>
      <el-button
        v-if="selectedRows.length > 0"
        type="warning"
        @click="handleBatchDisable"
      >
        批量禁用 ({{ selectedRows.length }})
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
        table-id="admin-platform-accounts"
        :loading="loading"
        :total="total"
        :current-page="queryParams.page"
        :page-size="queryParams.pageSize"
        :show-toolbar="false"
        :show-selection="true"
        :show-index="true"
        :show-actions="true"
        :action-column-width="300"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #column-status="{ row }">
          <el-tag :type="row.status === 'enabled' ? 'success' : 'danger'">
            {{ row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            :type="row.status === 'enabled' ? 'warning' : 'success'"
            link
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'enabled' ? '禁用' : '启用' }}
          </el-button>
          <el-button type="info" link @click="handleResetPassword(row)">
            重置密码
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
        <el-form-item label="账号名称" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入姓名"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="form.idCard"
            placeholder="请输入身份证号"
            maxlength="18"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码确认对话框 -->
    <el-dialog
      v-model="resetPasswordDialogVisible"
      title="重置密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px">
        <el-form-item label="账号名称">
          <span>{{ resetPasswordForm.username }}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ resetPasswordForm.phone }}</span>
        </el-form-item>
        <el-form-item label="新密码">
          <span style="color: #409eff; font-weight: bold;">{{ resetPasswordForm.newPassword }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetPasswordDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleConfirmResetPassword">确认重置</el-button>
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
  getPlatformAccountList,
  createPlatformAccount,
  updatePlatformAccount,
  deletePlatformAccount,
  enablePlatformAccount,
  disablePlatformAccount,
  resetPlatformAccountPassword,
  batchEnablePlatformAccounts,
  batchDisablePlatformAccounts,
  batchDeletePlatformAccounts
} from '@/api/system/platformAccountApi'
import type { PlatformAccount, PlatformAccountFormData } from '@/api/system/platformAccountApi'

// 表格引用
const tableRef = ref()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 表格数据
const tableData = ref<PlatformAccount[]>([])

// 总数
const total = ref(0)

// 选中的行
const selectedRows = ref<PlatformAccount[]>([])

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: ''
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'username', label: '账号名称', width: 150 },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'email', label: '邮箱', width: 180 },
  { prop: 'name', label: '姓名', width: 100 },
  { prop: 'idCard', label: '身份证号', width: 180 },
  { prop: 'registerTime', label: '注册时间', width: 180 },
  { prop: 'lastLoginTime', label: '最后登录时间', width: 180 },
  { prop: 'status', label: '状态', width: 100, align: 'center' }
]

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增账号')
const isEdit = ref(false)
const currentId = ref('')

// 表单数据
const form = reactive<PlatformAccountFormData>({
  username: '',
  phone: '',
  email: '',
  name: '',
  idCard: ''
})

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入账号名称', trigger: 'blur' },
    { min: 3, max: 50, message: '账号名称长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  idCard: [
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
  ]
}

// 重置密码对话框
const resetPasswordDialogVisible = ref(false)
const resetPasswordForm = reactive({
  id: '',
  username: '',
  phone: '',
  newPassword: '123456'
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getPlatformAccountList(queryParams)
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
  queryParams.status = ''
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
const handleSelectionChange = (selection: PlatformAccount[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增账号'
  isEdit.value = false
  form.username = ''
  form.phone = ''
  form.email = ''
  form.name = ''
  form.idCard = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: PlatformAccount) => {
  dialogTitle.value = '编辑账号'
  isEdit.value = true
  currentId.value = row.id
  form.username = row.username
  form.phone = row.phone
  form.email = row.email || ''
  form.name = row.name || ''
  form.idCard = row.idCard || ''
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: PlatformAccount) => {
  try {
    await ElMessageBox.confirm('确认删除该账号吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    await deletePlatformAccount(row.id)
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

// 切换状态
const handleToggleStatus = async (row: PlatformAccount) => {
  const action = row.status === 'enabled' ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(`确认${action}该账号吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    if (row.status === 'enabled') {
      await disablePlatformAccount(row.id)
    } else {
      await enablePlatformAccount(row.id)
    }
    ElMessage.success(`${action}成功`)
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${action}失败`)
    }
  } finally {
    loading.value = false
  }
}

// 重置密码
const handleResetPassword = (row: PlatformAccount) => {
  resetPasswordForm.id = row.id
  resetPasswordForm.username = row.username
  resetPasswordForm.phone = row.phone
  resetPasswordDialogVisible.value = true
}

// 确认重置密码
const handleConfirmResetPassword = async () => {
  try {
    loading.value = true
    const res = await resetPlatformAccountPassword(resetPasswordForm.id)
    ElMessage.success(`密码已重置为：${res.data.newPassword}`)
    resetPasswordDialogVisible.value = false
  } catch (error) {
    ElMessage.error('重置密码失败')
  } finally {
    loading.value = false
  }
}

// 批量启用
const handleBatchEnable = async () => {
  try {
    await ElMessageBox.confirm(`确认批量启用选中的 ${selectedRows.value.length} 个账号吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const ids = selectedRows.value.map(row => row.id)
    await batchEnablePlatformAccounts(ids)
    ElMessage.success('批量启用成功')
    tableRef.value?.clearSelection()
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量启用失败')
    }
  } finally {
    loading.value = false
  }
}

// 批量禁用
const handleBatchDisable = async () => {
  try {
    await ElMessageBox.confirm(`确认批量禁用选中的 ${selectedRows.value.length} 个账号吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const ids = selectedRows.value.map(row => row.id)
    await batchDisablePlatformAccounts(ids)
    ElMessage.success('批量禁用成功')
    tableRef.value?.clearSelection()
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量禁用失败')
    }
  } finally {
    loading.value = false
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认批量删除选中的 ${selectedRows.value.length} 个账号吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const ids = selectedRows.value.map(row => row.id)
    await batchDeletePlatformAccounts(ids)
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
          await updatePlatformAccount(currentId.value, form)
          ElMessage.success('更新成功')
        } else {
          await createPlatformAccount(form)
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
.admin-platform-account-page {
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
