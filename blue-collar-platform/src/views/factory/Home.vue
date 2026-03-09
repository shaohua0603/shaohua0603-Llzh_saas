<template>
  <div class="factory-home">
    <div class="home-content">
      <div style="display: flex; gap: 20px; align-items: flex-start; width: 100%;">
        <div style="flex: 1; min-width: 0;">
          <h3 class="section-title">最新资讯</h3>
          <el-card class="news-card">
            <div class="news-list">
              <div v-for="(news, index) in newsList" :key="index" class="news-item" @click="viewNewsDetail(news.id)">
                <div class="news-header">
                  <h4 class="news-title">{{ news.title }}</h4>
                  <span class="news-date">{{ news.date }}</span>
                </div>
                <p class="news-content">{{ news.content }}</p>
              </div>
            </div>
          </el-card>
        </div>

        <div style="width: 400px;">
          <div class="section-header">
            <h3 class="section-title">快捷导航</h3>
            <el-button type="text" @click="goToQuickAccessSettings">
              <el-icon><Setting /></el-icon>
              <span>自定义</span>
            </el-button>
          </div>
          <div class="quick-nav-grid">
            <el-card class="quick-nav-item" v-for="item in quickNavItems" :key="item.id" @click="navigateTo(item.path)">
              <div class="nav-icon">
                <el-icon :size="20"><component :is="item.icon" /></el-icon>
              </div>
              <div class="nav-text">{{ item.title }}</div>
            </el-card>
          </div>
        </div>
      </div>

      <div class="tasks-section">
        <h3 class="section-title">通知中心</h3>
        <el-card class="tasks-card">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="待办事项" name="todo">
              <template #label>
                <div class="tab-with-badge">
                  <span>待办事项</span>
                  <el-badge v-if="todoList.length > 0" :value="todoList.length" type="danger" />
                </div>
              </template>
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
            </el-tab-pane>
            <el-tab-pane label="消息通知" name="message">
              <template #label>
                <div class="tab-with-badge">
                  <span>消息通知</span>
                  <el-badge v-if="messageList.length > 0" :value="messageList.length" type="danger" />
                </div>
              </template>
              <el-empty v-if="messageList.length === 0" description="暂无消息通知" />
              <div v-else class="task-list">
                <div v-for="(item, index) in messageList" :key="index" class="task-item" @click="viewMessageDetail(item.id)">
                  <div class="task-icon">
                    <el-tag type="info" size="small">消息</el-tag>
                  </div>
                  <div class="task-content">
                    <div class="task-title">{{ item.title }}</div>
                    <div class="task-desc">{{ item.content }}</div>
                    <div class="task-time">{{ item.time }}</div>
                  </div>
                  <div class="task-action">
                    <el-button size="small">查看</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="预警信息" name="warning">
              <template #label>
                <div class="tab-with-badge">
                  <span>预警信息</span>
                  <el-badge v-if="warningList.length > 0" :value="warningList.length" type="danger" />
                </div>
              </template>
              <el-empty v-if="warningList.length === 0" description="暂无预警信息" />
              <div v-else class="task-list">
                <div v-for="(item, index) in warningList" :key="index" class="task-item" @click="handleWarning(item.id)">
                  <div class="task-icon">
                    <el-tag type="danger" size="small">预警</el-tag>
                  </div>
                  <div class="task-content">
                    <div class="task-title">{{ item.title }}</div>
                    <div class="task-desc">{{ item.description }}</div>
                    <div class="task-time">{{ item.time }}</div>
                  </div>
                  <div class="task-action">
                    <el-button size="small" type="danger">处理</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled, Reading, Money, OfficeBuilding, Key, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('todo')
const quickNavItems = ref<any[]>([])

const availableFunctions = [
  {
    id: 'recruitment',
    title: '招聘管理',
    icon: UserFilled,
    path: '/factory/recruitment'
  },
  {
    id: 'workers',
    title: '工人管理',
    icon: UserFilled,
    path: '/factory/workers'
  },
  {
    id: 'training',
    title: '岗前培训',
    icon: Reading,
    path: '/factory/training'
  },
  {
    id: 'salary',
    title: '结算管理',
    icon: Money,
    path: '/factory/salary'
  },
  {
    id: 'departments',
    title: '部门管理',
    icon: OfficeBuilding,
    path: '/factory/departments'
  },
  {
    id: 'roles',
    title: '角色管理',
    icon: Key,
    path: '/factory/roles'
  }
]

const loadQuickNavSettings = () => {
  try {
    const savedSettings = localStorage.getItem('factoryQuickAccessSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      let selectedItems = settings.selectedItems || []
      selectedItems = selectedItems.filter(itemId => availableFunctions.find(f => f.id === itemId))
      quickNavItems.value = selectedItems.map(itemId => availableFunctions.find(f => f.id === itemId)).filter(Boolean)
    } else {
      quickNavItems.value = availableFunctions.slice(0, 6)
    }
  } catch (error) {
    console.error('加载快捷导航设置失败:', error)
    quickNavItems.value = availableFunctions.slice(0, 6)
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

const goToQuickAccessSettings = () => {
  router.push('/factory/quick-access-settings')
}

const newsList = ref([
  {
    id: 1,
    title: '新的生产计划发布',
    content: '关于2026年3月份的生产计划已发布，请各部门及时查看并做好准备。',
    date: '2026-02-25'
  },
  {
    id: 2,
    title: '设备维护通知',
    content: '下周末将进行设备例行维护，请各车间提前做好安排。',
    date: '2026-02-20'
  },
  {
    id: 3,
    title: '安全培训通知',
    content: '本月安全培训计划已安排，请各部门组织员工参加。',
    date: '2026-02-15'
  }
])

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

const messageList = ref([
  {
    id: 1,
    title: '系统通知',
    content: '您有新的系统消息，请及时查看',
    time: '2026-02-25 08:00'
  },
  {
    id: 2,
    title: '劳务公司消息',
    content: '劳务公司已提交新的工人名单',
    time: '2026-02-24 17:30'
  }
])

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

const viewNewsDetail = (id: number) => {
  console.log('查看资讯详情:', id)
}

const handleTodoItem = (id: number) => {
  console.log('处理待办事项:', id)
  router.push(`/factory/todo-detail/${id}`)
}

const viewMessageDetail = (id: number) => {
  console.log('查看消息详情:', id)
  router.push(`/factory/message-detail/${id}`)
}

const handleWarning = (id: number) => {
  console.log('处理预警信息:', id)
  router.push(`/factory/warning-detail/${id}`)
}

onMounted(() => {
  loadQuickNavSettings()
})
</script>

<style scoped>
.factory-home {
  padding: 20px;
}

.home-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.top-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.quick-nav-section {
  flex: 0 0 400px;
  min-width: 0;
}

.news-section {
  flex: 1;
  min-width: 0;
  max-width: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #303133;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
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

.quick-nav-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 400px;
  width: 100%;
}

.quick-nav-item {
  flex: 0 0 calc(33.333% - 8px);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  padding: 16px 8px;
}

.quick-nav-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  margin-bottom: 8px;
  color: #409eff;
  display: flex;
  justify-content: center;
}

.nav-text {
  font-size: 13px;
  color: #303133;
}

.news-card {
  height: 100%;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  padding: 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-item:hover {
  background-color: #e9ecef;
  transform: translateX(4px);
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.news-title {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 250px;
}

.news-date {
  font-size: 12px;
  color: #909399;
}

.news-content {
  font-size: 13px;
  color: #606266;
  margin: 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tasks-section {
  flex: 1;
}

.tasks-card {
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

@media screen and (max-width: 1200px) {
  .top-row {
    flex-direction: column;
  }

  .quick-nav-section {
    flex: 1;
    width: 100%;
  }

  .quick-nav-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .factory-home {
    padding: 16px;
  }

  .quick-nav-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .section-title {
    font-size: 16px;
  }
}

.tab-with-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>