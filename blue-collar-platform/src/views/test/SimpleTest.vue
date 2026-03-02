<template>
  <div class="simple-test">
    <h1>简单测试页面</h1>
    <el-button type="primary" @click="testApi">测试API</el-button>
    <div v-if="response" style="margin-top: 20px;">
      <h3>API响应:</h3>
      <pre>{{ response }}</pre>
    </div>
    <div v-if="error" style="margin-top: 20px; color: red;">
      <h3>错误信息:</h3>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const response = ref('')
const error = ref('')

const testApi = async () => {
  try {
    console.log('开始测试API...')
    const res = await axios.get('http://localhost:3000/api/interview/pickups', {
      params: { page: 1, pageSize: 10 }
    })
    console.log('API响应:', res)
    response.value = JSON.stringify(res, null, 2)
    error.value = ''
  } catch (err: any) {
    console.error('API错误:', err)
    error.value = JSON.stringify(err, null, 2)
    response.value = ''
  }
}
</script>

<style scoped>
.simple-test {
  padding: 20px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>