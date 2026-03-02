<template>
  <div class="template-config">
    <h1>模版配置</h1>
    <el-card>
      <el-table :data="templateList">
        <el-table-column prop="name" label="模版名称" width="180" />
        <el-table-column prop="code" label="模版编码" width="150" />
        <el-table-column prop="type" label="模版类型" width="120" />
        <el-table-column prop="description" label="模版描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="addTemplate">新增模版</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const templateList = ref([
  { name: '合同模版', code: 'contract', type: '文档', description: '劳动合同模版' },
  { name: '请假申请表', code: 'leave', type: '表单', description: '员工请假申请表' }
])

const addTemplate = () => {
  ElMessage.success('新增模版')
}
</script>

<style scoped>
.template-config {
  padding: 20px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>