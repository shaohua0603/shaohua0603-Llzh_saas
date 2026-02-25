<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const messageId = ref(route.params.id)

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="message-detail">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
      <h2>消息详情</h2>
    </div>
    <el-card class="detail-card">
      <div class="detail-content">
        <div class="detail-item">
          <span class="label">消息ID：</span>
          <span class="value">{{ messageId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">消息标题：</span>
          <span class="value">系统通知</span>
        </div>
        <div class="detail-item">
          <span class="label">消息内容：</span>
          <span class="value">您有新的系统消息，请及时查看</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span class="value">2026-02-25 08:00</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.message-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.detail-card {
  max-width: 800px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.detail-item .label {
  font-weight: bold;
  color: #606266;
  min-width: 100px;
}

.detail-item .value {
  color: #303133;
  flex: 1;
}
</style>
