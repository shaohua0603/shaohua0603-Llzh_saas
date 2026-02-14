<template>
  <div class="not-found">
    <div class="not-found-content">
      <el-result
        icon="warning"
        title="404"
        sub-title="页面不存在"
      >
        <template #extra>
          <el-button type="primary" @click="navigateToHome">返回首页</el-button>
          <el-button @click="goBack">返回上一页</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()

// 返回首页
const navigateToHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.not-found-content {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>