<template>
  <div class="admin-warning-template-page">
    <div class="page-header">
      <h2 class="page-title">预警消息模版</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增模版</el-button>
      </div>
    </div>
    
    <el-card class="table-card">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="name" label="模版名称" width="200" />
        <el-table-column prop="content" label="模版内容" min-width="400" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.content }}</span>
          </template>
        </el-table-column>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="模版名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模版名称" />
        </el-form-item>
        <el-form-item label="模版内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入模版内容，支持变量替换，如：{租户名称}、{到期日期}" />
        </el-form-item>
        <el-form-item label="变量说明">
          <div class="variable-tips">
            <span>可用变量：{租户名称}、{套餐名称}、{到期日期}、{联系人}、{手机号}</span>
          </div>
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
const dialogTitle = ref('新增模版')
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  content: ''
})

const rules = {
  name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
  content: [{ required: true, message: '请输入模版内容', trigger: 'blur' }]
}

const tableData = ref([
  { id: 1, name: '套餐到期提醒', content: '尊敬的{租户名称}，您的套餐{套餐名称}将于{到期日期}到期，请及时续费。', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 2, name: '新用户入驻提醒', content: '新租户{租户名称}已入驻平台，联系人：{联系人}，手机号：{手机号}。', createTime: '2024-01-05 15:30:00', updateTime: '2024-01-05 15:30:00' }
])

const handleAdd = () => {
  dialogTitle.value = '新增模版'
  form.name = ''
  form.content = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑模版'
  form.name = row.name
  form.content = row.content
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该模版?', '提示', {
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
.admin-warning-template-page {
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

.variable-tips {
  color: var(--color-text-secondary);
  font-size: 12px;
}
</style>
