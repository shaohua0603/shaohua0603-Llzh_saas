<template>
  <div class="factory-todo">
    <h3 class="page-title">待办任务</h3>
    <el-card class="todo-card">
      <el-empty v-if="todoList.length === 0" description="暂无待办事项" />
      <div v-else class="task-list">
        <div v-for="(item, index) in todoList" :key="index" class="task-item" @click="handleTodoItem(item.id)">
          <div class="task-icon">
            <el-tag type="warning" size="small">待办</el-tag>
          </div>
          <div class="task-content">
            <div class="task-title">{{ item.title }}</div>
            <div class="task-desc">{{ item.description }}</div>
            <div class="task-time">{{ item.time }}</div>
          </div>
          <div class="task-action">
            <el-button size="small" type="primary">处理</el-button>
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
const todoList = ref([
  {
    id: 1,
    title: '工人入职审批',
    description: '王五的入职申请需要审批',
    time: '2026-02-25 10:00'
  },
  {
    id: 2,
    title: '生产计划确认',
    description: '确认3月份生产计划',
    time: '2026-02-25 09:00'
  },
  {
    id: 3,
    title: '设备采购审批',
    description: '审批新设备采购申请',
    time: '2026-02-24 16:00'
  }
])

const handleTodoItem = (id: number) => {
  console.log('处理待办事项:', id)
  router.push(`/factory/todo-detail/${id}`)
}

onMounted(() => {
  // 这里可以添加获取待办任务列表的逻辑
})
</script>

<style scoped>
.factory-todo {
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

.todo-card {
  min-height: 400px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 16px;
}

.task-item:hover {
  background-color: #e9ecef;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-icon {
  flex-shrink: 0;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #303133;
}

.task-desc {
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

.task-time {
  font-size: 12px;
  color: #909399;
}

.task-action {
  flex-shrink: 0;
}
</style>