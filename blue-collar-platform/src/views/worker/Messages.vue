<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ElIcon } from 'element-plus'
import { Money, Notification, InfoFilled, Reading, Operation, Document, Grid } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('1')
const todos = ref([])
const notifications = ref([])
const loading = ref(true)

// 标签页配置
const tabs = [
  {
    label: '个人待办',
    value: '1'
  },
  {
    label: '消息通知',
    value: '2'
  }
]

// 获取待办事项
const getTodos = async () => {
  loading.value = true
  try {
    // 模拟待办事项数据
    todos.value = [
      {
        id: 1,
        title: '完成岗前培训',
        content: '请在3天内完成富士康科技集团的岗前培训课程',
        status: 'pending',
        deadline: '2026-01-30',
        type: 'training'
      },
      {
        id: 2,
        title: '提交请假申请',
        content: '您的请假申请需要劳务公司审核，请耐心等待',
        status: 'processing',
        submitDate: '2026-01-25',
        type: 'leave'
      }
    ]
  } catch (error) {
    console.error('获取待办事项失败:', error)
    ElMessage.error('获取待办事项失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 模拟消息通知数据
const mockNotifications = [
  {
    id: 1,
    title: '工资条已发放',
    content: '2026年1月份工资条已发放，请查看。',
    status: '未读',
    createTime: '2026-02-05 09:00:00'
  },
  {
    id: 2,
    title: '新招聘信息',
    content: '有3个新的招聘职位发布，适合您的技能水平，请查看。',
    status: '已读',
    createTime: '2026-01-15 14:00:00'
  }
]

// 获取消息通知
const getNotifications = async () => {
  loading.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    // 使用Mock数据
    notifications.value = mockNotifications
  } catch (error) {
    console.error('获取消息通知失败:', error)
    ElMessage.error('获取消息通知失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 切换标签页
const handleTabChange = (value: string) => {
  activeTab.value = value
  if (value === '1') {
    getTodos()
  } else {
    getNotifications()
  }
}

// 标记待办事项为已完成
const markAsCompleted = (todo: any) => {
  todo.status = 'completed'
  ElMessage.success('待办事项已标记为完成')
}

// 跳转到消息详情页面
const goToMessageDetail = (message: any) => {
  router.push(`/worker/message-detail/${message.id}`)
}

// 跳转到待办事项详情页面
const goToTodoDetail = (todo: any) => {
  router.push(`/worker/todo-detail/${todo.id}`)
}

// 页面加载时获取数据
onMounted(() => {
  if (activeTab.value === '1') {
    getTodos()
  } else {
    getNotifications()
  }
})
</script>

<template>
  <div class="worker-messages">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>消息</h2>
    </div>
    
    <!-- 标签页 -->
    <div class="message-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.value"
          :label="tab.label"
          :name="tab.value"
        />
      </el-tabs>
    </div>
    
    <!-- 个人待办 -->
    <div v-if="activeTab === '1'" class="todo-list">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="todos.length === 0" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>暂无待办事项</span>
      </div>
      <div v-else class="todo-items">
        <div v-for="todo in todos" :key="todo.id" class="todo-item" @click="goToTodoDetail(todo)">
          <div class="todo-header">
            <div class="todo-title">
              <div class="todo-icon">
                <ElIcon v-if="todo.type === 'training'" :size="20"><Reading /></ElIcon>
                <ElIcon v-else-if="todo.type === 'leave'" :size="20"><Operation /></ElIcon>
                <ElIcon v-else :size="20"><Document /></ElIcon>
              </div>
              <h3>{{ todo.title }}</h3>
            </div>
            <el-tag :type="todo.status === 'pending' ? 'warning' : todo.status === 'processing' ? 'info' : 'success'">
              {{ todo.status === 'pending' ? '待处理' : todo.status === 'processing' ? '处理中' : '已完成' }}
            </el-tag>
          </div>
          <div class="todo-body">
            <p>{{ todo.content }}</p>
            <p class="todo-date">
              <i class="el-icon-time"></i>
              {{ todo.deadline ? `截止日期: ${todo.deadline}` : `提交日期: ${todo.submitDate}` }}
            </p>
          </div>
          <div v-if="todo.status !== 'completed'" class="todo-footer">
            <el-button type="primary" size="small" @click.stop="markAsCompleted(todo)">
              标记完成
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 消息通知 -->
    <div v-else class="notification-list">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="notifications.length === 0" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>暂无消息通知</span>
      </div>
      <div v-else class="notification-items">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item" @click="goToMessageDetail(notification)">
          <div class="notification-header">
            <div class="notification-title">
              <div v-if="notification.title.includes('工资条')" class="notification-icon salary-icon">
                <img src="../../assets/coin-design/gold_coin_new.svg" alt="金币" class="coin-icon">
              </div>
              <div v-else-if="notification.title.includes('招聘')" class="notification-icon">
                <ElIcon :size="20"><Grid /></ElIcon>
              </div>
              <div v-else class="notification-icon">
                <ElIcon :size="20"><InfoFilled /></ElIcon>
              </div>
              <h3>{{ notification.title }}</h3>
            </div>
            <span class="notification-time">{{ notification.createTime }}</span>
          </div>
          <div class="notification-body">
            <p>{{ notification.content }}</p>
          </div>
          <div class="notification-footer">
            <el-tag :type="notification.status === '未读' ? 'danger' : 'success'">
              {{ notification.status }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-messages {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.message-tabs {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 0 15px;
}

.todo-list,
.notification-list {
  padding: 0 15px 20px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.todo-items,
.notification-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.todo-item,
.notification-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.todo-header,
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.notification-title,
.todo-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.todo-header h3,
.notification-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.notification-icon,
.todo-icon {
  font-size: 18px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.salary-icon {
  animation: pulse 2s infinite;
}

.coin-icon {
  width: 20px;
  height: 20px;
  display: block;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.notification-time {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  margin-left: 10px;
}

.todo-body,
.notification-body {
  margin-bottom: 10px;
}

.todo-body p,
.notification-body p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.todo-date {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
}

.todo-date i {
  margin-right: 5px;
}

.todo-footer,
.notification-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .todo-list,
  .notification-list {
    padding: 0 10px 20px;
  }
  
  .todo-item,
  .notification-item {
    padding: 12px;
  }
  
  .todo-header h3,
  .notification-header h3 {
    font-size: 15px;
  }
  
  .todo-body p,
  .notification-body p {
    font-size: 12px;
  }
}
</style>