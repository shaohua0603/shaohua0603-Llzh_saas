<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ElIcon } from 'element-plus'
import { Money, Notification, InfoFilled, Reading, Operation, Document, Grid, Bell, Warning } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('1')
const todos = ref<any[]>([])
const notifications = ref<any[]>([])
const loading = ref(true)

const tabs = [
  { label: '待办事项', value: '1' },
  { label: '消息通知', value: '2' }
]

const getTodos = async () => {
  loading.value = true
  try {
    todos.value = [
      {
        id: 1,
        title: '新工人入职接待',
        content: '工人张三已通过面试，将于明日入职，请做好接待准备。',
        status: 'pending',
        deadline: '2026-02-20',
        type: 'worker'
      },
      {
        id: 2,
        title: '考勤异常处理',
        content: '今日有5条考勤异常待处理，请及时核实。',
        status: 'processing',
        submitDate: '2026-02-15',
        type: 'attendance'
      },
      {
        id: 3,
        title: '合同到期提醒',
        content: '3份劳动合同即将到期，请及时续签。',
        status: 'pending',
        deadline: '2026-02-28',
        type: 'contract'
      }
    ]
  } catch (error) {
    console.error('获取待办事项失败:', error)
    ElMessage.error('获取待办事项失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const mockNotifications = [
  {
    id: 1,
    title: '新工人入职通知',
    content: '工人张三已通过面试，将于明日入职，请做好接待准备。',
    status: '未读',
    createTime: '2026-02-15 10:30'
  },
  {
    id: 2,
    title: '考勤异常提醒',
    content: '工人李四2026年2月14日考勤异常，请及时核实处理。',
    status: '未读',
    createTime: '2026-02-14 16:20'
  },
  {
    id: 3,
    title: '合同即将到期',
    content: '工人王五的劳动合同将于2026年2月28日到期，请及时处理续签事宜。',
    status: '已读',
    createTime: '2026-02-13 14:10'
  },
  {
    id: 4,
    title: '招聘需求审核通过',
    content: '您提交的招聘需求"操作工20人"已审核通过，已对外发布。',
    status: '已读',
    createTime: '2026-02-12 11:00'
  },
  {
    id: 5,
    title: '工资条已发放',
    content: '2026年1月份工资条已全部发放，请通知工人及时查看。',
    status: '已读',
    createTime: '2026-02-10 09:30'
  }
]

const getNotifications = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    notifications.value = mockNotifications
  } catch (error) {
    console.error('获取消息通知失败:', error)
    ElMessage.error('获取消息通知失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleTabChange = (value: string) => {
  activeTab.value = value
  if (value === '1') {
    getTodos()
  } else {
    getNotifications()
  }
}

const markAsCompleted = (todo: any) => {
  todo.status = 'completed'
  ElMessage.success('待办事项已标记为完成')
}

const goToMessageDetail = (message: any) => {
  router.push(`/tenant/message-detail/${message.id}`)
}

const goToTodoDetail = (todo: any) => {
  router.push(`/tenant/todo-detail/${todo.id}`)
}

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
    <div class="page-header">
      <h2>消息</h2>
    </div>
    
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
                <ElIcon v-if="todo.type === 'worker'" :size="20"><Operation /></ElIcon>
                <ElIcon v-else-if="todo.type === 'attendance'" :size="20"><Warning /></ElIcon>
                <ElIcon v-else-if="todo.type === 'contract'" :size="20"><Document /></ElIcon>
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
              <div v-if="notification.title.includes('工资')" class="notification-icon salary-icon">
                <el-icon :size="20"><Money /></el-icon>
              </div>
              <div v-else-if="notification.title.includes('招聘')" class="notification-icon">
                <el-icon :size="20"><Grid /></el-icon>
              </div>
              <div v-else-if="notification.title.includes('考勤')" class="notification-icon">
                <el-icon :size="20"><Warning /></el-icon>
              </div>
              <div v-else class="notification-icon">
                <el-icon :size="20"><InfoFilled /></el-icon>
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
  cursor: pointer;
  transition: all 0.3s ease;
}

.todo-item:hover,
.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.salary-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
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
  .notification-title h3 {
    font-size: 15px;
  }
  
  .todo-body p,
  .notification-body p {
    font-size: 12px;
  }
}
</style>
