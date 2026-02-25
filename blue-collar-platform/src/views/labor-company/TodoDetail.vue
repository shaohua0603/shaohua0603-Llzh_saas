<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const todoId = ref(route.params.id)

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="todo-detail">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
      <h2>待办详情</h2>
    </div>
    <el-card class="detail-card">
      <div class="detail-content">
        <div class="detail-item">
          <span class="label">待办ID：</span>
          <span class="value">{{ todoId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">待办标题：</span>
          <span class="value">工人入职审批</span>
        </div>
        <div class="detail-item">
          <span class="label">待办描述：</span>
          <span class="value">张三的入职申请需要审批</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span class="value">2026-02-25 10:00</span>
        </div>
      </div>
      <div class="detail-actions">
        <el-button type="primary">同意</el-button>
        <el-button type="danger">拒绝</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.todo-detail {
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
