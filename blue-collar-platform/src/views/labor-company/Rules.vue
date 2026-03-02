<template>
  <div class="rules">
    <h1>规则配置</h1>
    <el-card>
      <el-table :data="rulesList">
        <el-table-column prop="name" label="规则名称" width="180" />
        <el-table-column prop="type" label="规则类型" width="180" />
        <el-table-column prop="description" label="规则描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="addRule">新增规则</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const rulesList = ref([
  { name: '考勤规则', type: '考勤', description: '公司考勤管理制度' },
  { name: '奖惩规则', type: '人事', description: '公司奖惩管理制度' }
])

const addRule = () => {
  ElMessage.success('新增规则')
}
</script>

<style scoped>
.rules {
  padding: 20px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>