<template>
  <div class="system-parameter">
    <h1>系统参数</h1>
    <el-card>
      <el-table :data="parameterList">
        <el-table-column prop="name" label="参数名称" width="180" />
        <el-table-column prop="key" label="参数键" width="150" />
        <el-table-column prop="value" label="参数值" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="addParameter">新增参数</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const parameterList = ref([
  { name: '系统名称', key: 'system_name', value: '蓝领智汇' },
  { name: '系统版本', key: 'system_version', value: '1.0.0' }
])

const addParameter = () => {
  ElMessage.success('新增参数')
}
</script>

<style scoped>
.system-parameter {
  padding: 20px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>