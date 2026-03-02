<template>
  <div class="process-config">
    <h1>流程配置</h1>
    <el-card>
      <el-form label-width="120px">
        <el-form-item label="流程名称">
          <el-input placeholder="请输入流程名称" v-model="processName" />
        </el-form-item>
        <el-form-item label="流程类型">
          <el-select placeholder="请选择流程类型" v-model="processType">
            <el-option label="人事" value="personnel" />
            <el-option label="财务" value="finance" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="流程描述">
          <el-input type="textarea" :rows="4" placeholder="请输入流程描述" v-model="processDescription" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const processName = ref('')
const processType = ref('')
const processDescription = ref('')

const save = () => {
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.process-config {
  padding: 20px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>