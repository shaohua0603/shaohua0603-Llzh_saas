<template>
  <div class="test-pickup">
    <h1>测试接送管理 API</h1>
    <el-button type="primary" @click="testPickupApi">测试接送列表 API</el-button>
    <div v-if="responseData">
      <h2>响应数据：</h2>
      <pre>{{ responseData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import request from '@/utils/request'

const responseData = ref('')

const testPickupApi = async () => {
  try {
    console.log('开始测试接送列表 API...')
    const response = await request.get('/api/interview/pickups', {
      params: {
        page: 1,
        pageSize: 10
      }
    })
    console.log('API 响应:', response)
    responseData.value = JSON.stringify(response, null, 2)
  } catch (error) {
    console.error('API 调用错误:', error)
    responseData.value = JSON.stringify(error, null, 2)
  }
}
</script>

<style scoped>
.test-pickup {
  padding: 20px;
}

pre {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>