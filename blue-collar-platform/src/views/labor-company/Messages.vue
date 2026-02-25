<template>
  <div class="labor-company-messages">
    <h3 class="page-title">消息通知</h3>
    <el-card class="messages-card">
      <el-empty v-if="messageList.length === 0" description="暂无消息通知" />
      <div v-else class="message-list">
        <div v-for="(item, index) in messageList" :key="index" class="message-item" @click="viewMessageDetail(item.id)">
          <div class="message-icon">
            <el-tag type="info" size="small">消息</el-tag>
          </div>
          <div class="message-content">
            <div class="message-title">{{ item.title }}</div>
            <div class="message-desc">{{ item.content }}</div>
            <div class="message-time">{{ item.time }}</div>
          </div>
          <div class="message-action">
            <el-button size="small">查看</el-button>
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
const messageList = ref([
  {
    id: 1,
    title: '系统通知',
    content: '您有新的系统消息，请及时查看',
    time: '2026-02-25 08:00'
  },
  {
    id: 2,
    title: '工人消息',
    content: '李四提交了请假申请',
    time: '2026-02-24 17:30'
  }
])

const viewMessageDetail = (id: number) => {
  console.log('查看消息详情:', id)
  router.push(`/labor-company/message-detail/${id}`)
}

onMounted(() => {
  // 这里可以添加获取消息列表的逻辑
})
</script>

<style scoped>
.labor-company-messages {
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

.messages-card {
  min-height: 400px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 16px;
}

.message-item:hover {
  background-color: #e9ecef;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-icon {
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #303133;
}

.message-desc {
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

.message-time {
  font-size: 12px;
  color: #909399;
}

.message-action {
  flex-shrink: 0;
}
</style>