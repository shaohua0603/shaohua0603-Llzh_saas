<template>
  <div class="admin-registered-users-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入用户名/手机号/邮箱/姓名/身份证号"
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
      <el-button
        v-if="selectedRows.length > 0"
        type="primary"
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
    </div>

    <!-- 列表区域 -->
    <el-card class="table-card">
      <CommonTable
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        table-id="admin-registered-users"
        :loading="loading"
        :total="total"
        :current-page="queryParams.page"
        :page-size="queryParams.pageSize"
        :show-toolbar="false"
        :show-selection="true"
        :show-index="true"
        :show-actions="true"
        :action-column-width="250"
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
          <el-button
            :type="row.status === 'enabled' ? 'warning' : 'success'"
            link
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'enabled' ? '禁用' : '启用' }}
          </el-button>
          <el-button type="primary" link @click="handleResetPassword(row)">
            重置密码
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 重置密码确认对话框 -->
    <el-dialog
      v-model="resetPasswordDialogVisible"
      title="重置密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="resetPasswordForm" label-width="100px">
        <el-form-item label="用户名">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import {
  getRegisteredUserList,
  enableRegisteredUser,
  disableRegisteredUser,
  resetRegisteredUserPassword,
  batchEnableRegisteredUsers,
  batchDisableRegisteredUsers
} from '@/api/system/registeredUserApi'
import type { RegisteredUser } from '@/api/system/registeredUserApi'

// 表格引用
const tableRef = ref()

// 加载状态
const loading = ref(false)

// 表格数据
const tableData = ref<RegisteredUser[]>([])

// 总数
const total = ref(0)

// 选中的行
const selectedRows = ref<RegisteredUser[]>([])

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: ''
})

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'username', label: '用户名', width: 150 },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'email', label: '邮箱', width: 180 },
  { prop: 'name', label: '姓名', width: 100 },
  { prop: 'idCard', label: '身份证号', width: 180 },
  { prop: 'registerTime', label: '注册时间', width: 180 },
  { prop: 'lastLoginTime', label: '最后登录时间', width: 180 },
  { prop: 'status', label: '状态', width: 100, align: 'center' }
]

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
    const res = await getRegisteredUserList(queryParams)
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
const handleSelectionChange = (selection: RegisteredUser[]) => {
  selectedRows.value = selection
}

// 切换状态
const handleToggleStatus = async (row: RegisteredUser) => {
  const action = row.status === 'enabled' ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(`确认${action}该用户吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    if (row.status === 'enabled') {
      await disableRegisteredUser(row.id)
    } else {
      await enableRegisteredUser(row.id)
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
const handleResetPassword = (row: RegisteredUser) => {
  resetPasswordForm.id = row.id
  resetPasswordForm.username = row.username
  resetPasswordForm.phone = row.phone
  resetPasswordDialogVisible.value = true
}

// 确认重置密码
const handleConfirmResetPassword = async () => {
  try {
    loading.value = true
    const res = await resetRegisteredUserPassword(resetPasswordForm.id)
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
    await ElMessageBox.confirm(`确认批量启用选中的 ${selectedRows.value.length} 个用户吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const ids = selectedRows.value.map(row => row.id)
    await batchEnableRegisteredUsers(ids)
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
    await ElMessageBox.confirm(`确认批量禁用选中的 ${selectedRows.value.length} 个用户吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const ids = selectedRows.value.map(row => row.id)
    await batchDisableRegisteredUsers(ids)
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

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-registered-users-page {
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
