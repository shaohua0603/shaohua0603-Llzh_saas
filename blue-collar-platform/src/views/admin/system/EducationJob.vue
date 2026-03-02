<template>
  <div class="admin-education-job-page">
    <div class="page-header">
      <h2 class="page-title">学历对应岗位</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增配置</el-button>
      </div>
    </div>
    
    <el-card class="table-card">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="educationLevel" label="学历等级" width="150" />
        <el-table-column prop="jobName" label="岗位名称" min-width="300" />
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
        <el-form-item label="学历等级" prop="educationLevel">
          <el-select v-model="form.educationLevel" placeholder="请选择学历等级">
            <el-option label="初中及以下" value="初中及以下" />
            <el-option label="高中/中专" value="高中/中专" />
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士及以上" value="硕士及以上" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位名称" prop="jobName">
          <el-input v-model="form.jobName" placeholder="请输入岗位名称" />
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
const dialogTitle = ref('新增配置')
const formRef = ref<FormInstance>()

const form = reactive({
  educationLevel: '',
  jobName: ''
})

const rules = {
  educationLevel: [{ required: true, message: '请选择学历等级', trigger: 'change' }],
  jobName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
}

const tableData = ref([
  { id: 1, educationLevel: '初中及以下', jobName: '普工、操作工、包装工', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 2, educationLevel: '高中/中专', jobName: '技术员、质检员', createTime: '2024-01-05 15:30:00', updateTime: '2024-01-05 15:30:00' },
  { id: 3, educationLevel: '大专', jobName: '班组长、助理工程师', createTime: '2024-01-10 09:20:00', updateTime: '2024-01-10 09:20:00' },
  { id: 4, educationLevel: '本科', jobName: '工程师、主管', createTime: '2024-01-15 11:00:00', updateTime: '2024-01-15 11:00:00' }
])

const handleAdd = () => {
  dialogTitle.value = '新增配置'
  form.educationLevel = ''
  form.jobName = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑配置'
  form.educationLevel = row.educationLevel
  form.jobName = row.jobName
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该配置?', '提示', {
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
.admin-education-job-page {
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
