<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const warningId = ref(route.params.id)

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="warning-detail">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
      <h2>预警详情</h2>
    </div>
    <el-card class="detail-card">
      <div class="detail-content">
        <div class="detail-item">
          <span class="label">预警ID：</span>
          <span class="value">{{ warningId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">预警标题：</span>
          <span class="value">考勤异常预警</span>
        </div>
        <div class="detail-item">
          <span class="label">预警描述：</span>
          <span class="value">本周有5名工人考勤异常，需要及时处理</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span class="value">2026-02-25 11:00</span>
        </div>
      </div>
      <div class="detail-actions">
        <el-button type="primary">处理预警</el-button>
        <el-button>忽略</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.warning-detail {
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

.detail-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}
</style>
