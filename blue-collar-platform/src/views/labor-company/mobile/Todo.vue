<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const todos = ref<any[]>([])
const loading = ref(true)

const getTodos = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    todos.value = [
      {
        id: 1,
        title: '新工人入职接待',
        content: '工人张三已通过面试，明天入职',
        time: '2026-02-20',
        type: '入职',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 2,
        title: '考勤异常处理',
        content: '今日有5条考勤异常待处理',
        time: '今天',
        type: '考勤',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 3,
        title: '合同到期提醒',
        content: '3份劳动合同即将到期',
        time: '本周',
        type: '合同',
        status: 'pending',
        priority: 'low'
      },
      {
        id: 4,
        title: '请假审批',
        content: '工人李四提交了3天事假申请',
        time: '今天',
        type: '请假',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 5,
        title: '工资条确认',
        content: '1月份工资条需要确认发放',
        time: '明天',
        type: '工资',
        status: 'pending',
        priority: 'high'
      }
    ]
  } catch (error) {
    ElMessage.error('获取待办事项失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (todo: any) => {
  router.push(`/tenant/todo-detail/${todo.id}`)
}

const handleComplete = (todo: any, event: Event) => {
  event.stopPropagation()
  todo.status = 'completed'
  ElMessage.success('标记完成')
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    high: '#f56c6c',
    medium: '#e6a23c',
    low: '#909399'
  }
  return colors[priority] || '#909399'
}

const getStatusText = (status: string) => {
  return status === 'pending' ? '待处理' : '已完成'
}

onMounted(() => {
  getTodos()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>待办任务</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="todos.length === 0" class="empty-state">
        <p>暂无待办任务</p>
      </div>
      
      <div v-else class="todo-list">
        <div 
          v-for="todo in todos" 
          :key="todo.id" 
          class="todo-item"
          :class="{ completed: todo.status === 'completed' }"
          @click="goToDetail(todo)"
        >
          <div class="todo-header">
            <div class="todo-type" :style="{ background: getPriorityColor(todo.priority) }">
              {{ todo.type }}
            </div>
            <el-tag :type="todo.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ getStatusText(todo.status) }}
            </el-tag>
          </div>
          
          <h3 class="todo-title">{{ todo.title }}</h3>
          <p class="todo-content">{{ todo.content }}</p>
          
          <div class="todo-footer">
            <span class="todo-time">{{ todo.time }}</span>
            <el-button 
              v-if="todo.status === 'pending'" 
              type="primary" 
              size="small" 
              @click="handleComplete(todo, $event)"
            >
              标记完成
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-page {
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

.page-content {
  padding: 15px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.todo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.todo-type {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
}

.todo-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.todo-content {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.todo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-time {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .page-content {
    padding: 10px;
  }
  
  .todo-item {
    padding: 12px;
  }
  
  .todo-title {
    font-size: 15px;
  }
  
  .todo-content {
    font-size: 13px;
  }
}
</style>
