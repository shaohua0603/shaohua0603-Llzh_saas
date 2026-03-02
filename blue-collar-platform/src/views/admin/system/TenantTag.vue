<template>
  <div class="admin-tenant-tag-page">
    <div class="page-header">
      <h2 class="page-title">租户标签</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增标签</el-button>
      </div>
    </div>
    
    <el-card class="table-card">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="name" label="标签名称" width="200" />
        <el-table-column prop="description" label="描述" min-width="300" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="最后更新时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
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
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增标签')
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
}

const tableData = ref([
  { id: 1, name: '优质租户', description: '信誉良好，合作稳定的租户', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 2, name: '新签约租户', description: '新签约的租户', createTime: '2024-01-05 15:30:00', updateTime: '2024-01-05 15:30:00' },
  { id: 3, name: '重点关注', description: '需要重点关注的租户', createTime: '2024-01-10 09:20:00', updateTime: '2024-01-10 09:20:00' }
])

const handleAdd = () => {
  dialogTitle.value = '新增标签'
  form.name = ''
  form.description = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑标签'
  form.name = row.name
  form.description = row.description
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该标签?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('删除成功')
  } catch {}
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  ElMessage.success('保存成功')
  dialogVisible.value = false
}
</script>

<style scoped>
.admin-tenant-tag-page {
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
</style>
