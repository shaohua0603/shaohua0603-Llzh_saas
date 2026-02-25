<template>
  <div class="factory-warnings">
    <h3 class="page-title">预警信息</h3>
    <el-card class="warnings-card">
      <el-empty v-if="warningList.length === 0" description="暂无预警信息" />
      <div v-else class="warning-list">
        <div v-for="(item, index) in warningList" :key="index" class="warning-item" @click="handleWarning(item.id)">
          <div class="warning-icon">
            <el-tag type="danger" size="small">预警</el-tag>
          </div>
          <div class="warning-content">
            <div class="warning-title">{{ item.title }}</div>
            <div class="warning-desc">{{ item.description }}</div>
            <div class="warning-time">{{ item.time }}</div>
          </div>
          <div class="warning-action">
            <el-button size="small" type="danger">处理</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const warningList = ref([
  {
    id: 1,
    title: '生产进度预警',
    description: 'A生产线进度滞后，请及时调整',
    time: '2026-02-25 11:00'
  },
  {
    id: 2,
    title: '工人短缺预警',
    description: 'B车间工人数量不足，影响生产',
    time: '2026-02-24 14:00'
  }
])

const handleWarning = (id: number) => {
  console.log('处理预警信息:', id)
  router.push(`/factory/warning-detail/${id}`)
}

onMounted(() => {
  // 这里可以添加获取预警信息列表的逻辑
})
</script>

<style scoped>
.factory-warnings {
  padding: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
  position: relative;
  padding-left: 12px;
}

.page-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #409eff;
  border-radius: 2px;
}

.warnings-card {
  min-height: 400px;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 16px;
}

.warning-item:hover {
  background-color: #e9ecef;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.warning-icon {
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
  min-width: 0;
}

.warning-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #303133;
}

.warning-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.warning-time {
  font-size: 12px;
  color: #909399;
}

.warning-action {
  flex-shrink: 0;
}
</style>