<template>
  <div class="admin-platform-account-page">
    <div class="page-header">
      <h2 class="page-title">平台账号管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增账号</el-button>
      </div>
    </div>
    
    <el-card class="table-card">
      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="搜索账号/姓名/手机号" clearable style="width: 200px; margin-right: 10px;">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 150px; margin-right: 10px;">
          <el-option label="全部" value="" />
          <el-option label="正常" value="normal" />
          <el-option label="禁用" value="disabled" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="username" label="账号名称" width="150" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号" width="180" />
        <el-table-column prop="registerTime" label="注册时间" width="180" />
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'">
              {{ row.status === 'normal' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button :type="row.status === 'normal' ? 'warning' : 'success'" link @click="handleToggleStatus(row)">
              {{ row.status === 'normal' ? '禁用' : '启用' }}
            </el-button>
            <el-button type="warning" link @click="handleResetPassword(row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="账号名称" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号名称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
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
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新增账号')
const formRef = ref<FormInstance>()

const form = reactive({
  username: '',
  phone: '',
  email: '',
  name: '',
  idCard: ''
})

const rules = {
  username: [{ required: true, message: '请输入账号名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
}

const tableData = ref([
  { id: 1, username: 'admin', phone: '13800138000', email: 'admin@example.com', name: '张三', idCard: '110101199001011234', registerTime: '2024-01-01 10:00:00', lastLoginTime: '2024-01-15 09:30:00', status: 'normal' },
  { id: 2, username: 'operator1', phone: '13800138001', email: 'op1@example.com', name: '李四', idCard: '110101199002021234', registerTime: '2024-01-05 15:30:00', lastLoginTime: '2024-01-14 18:20:00', status: 'normal' },
  { id: 3, username: 'operator2', phone: '13800138002', email: 'op2@example.com', name: '王五', idCard: '110101199003031234', registerTime: '2024-01-10 09:20:00', lastLoginTime: '2024-01-13 10:15:00', status: 'disabled' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

const handleSearch = () => {
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '新增账号'
  form.username = ''
  form.phone = ''
  form.email = ''
  form.name = ''
  form.idCard = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑账号'
  form.username = row.username
  form.phone = row.phone
  form.email = row.email
  form.name = row.name
  form.idCard = row.idCard
  dialogVisible.value = true
}

const handleToggleStatus = async (row: any) => {
  const action = row.status === 'normal' ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(`确认${action}该账号?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    row.status = row.status === 'normal' ? 'disabled' : 'normal'
    ElMessage.success(`${action}成功`)
  } catch {}
}

const handleResetPassword = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认重置该账号密码?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('密码已重置为123456')
  } catch {}
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  ElMessage.success('保存成功')
  dialogVisible.value = false
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadData()
}

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}
</script>

<style scoped>
.admin-platform-account-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.table-card {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
