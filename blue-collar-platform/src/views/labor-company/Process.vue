<template>
  <div class="process">
    <h1>流程管理</h1>
    <el-card>
      <el-table :data="processList">
        <el-table-column prop="name" label="流程名称" width="180" />
        <el-table-column prop="type" label="流程类型" width="150" />
        <el-table-column prop="description" label="流程描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'info'">
              {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="addProcess">新增流程</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const processList = ref([
  { name: '请假流程', type: '人事', description: '员工请假审批流程', status: 'enabled' },
  { name: '报销流程', type: '财务', description: '费用报销审批流程', status: 'enabled' }
])

const addProcess = () => {
  ElMessage.success('新增流程')
}
</script>

<style scoped>
.process {
  padding: 20px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>