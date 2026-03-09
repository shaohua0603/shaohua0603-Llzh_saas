<template>
  <div class="admin-home">
    <!-- 页面内容 -->
    <div class="home-content">
      <!-- 快捷导航 -->
      <div class="quick-nav-section">
        <h3 class="section-title">快捷导航</h3>
        <div class="quick-nav-grid">
          <el-card class="quick-nav-item" @click="navigateTo('tenants')">
            <div class="nav-icon">
              <el-icon size="32"><OfficeBuilding /></el-icon>
            </div>
            <div class="nav-text">租户管理</div>
          </el-card>
          <el-card class="quick-nav-item" @click="navigateTo('packages')">
            <div class="nav-icon">
              <el-icon size="32"><Present /></el-icon>
            </div>
            <div class="nav-text">套餐配置</div>
          </el-card>
          <el-card class="quick-nav-item" @click="navigateTo('recruitment')">
            <div class="nav-icon">
              <el-icon size="32"><Position /></el-icon>
            </div>
            <div class="nav-text">招聘管理</div>
          </el-card>
          <el-card class="quick-nav-item" @click="navigateTo('users')">
            <div class="nav-icon">
              <el-icon size="32"><User /></el-icon>
            </div>
            <div class="nav-text">注册用户</div>
          </el-card>
          <el-card class="quick-nav-item" @click="navigateTo('idle-workers')">
            <div class="nav-icon">
              <el-icon size="32"><Warning /></el-icon>
            </div>
            <div class="nav-text">空闲工人</div>
          </el-card>
        </div>
      </div>

      <!-- 资讯板块 -->
      <div class="news-section">
        <h3 class="section-title">最新资讯</h3>
        <el-card class="news-card">
          <el-timeline>
            <el-timeline-item
              v-for="(news, index) in newsList"
              :key="index"
              :timestamp="news.date"
              placement="top"
            >
              <el-card>
                <h4 class="news-title">{{ news.title }}</h4>
                <p class="news-content">{{ news.content }}</p>
                <div class="news-footer">
                  <el-button type="text" @click="viewNewsDetail(news.id)">查看</el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </div>

      <!-- 待办/消息/预警列表 -->
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
              <el-list v-else>
                <el-list-item v-for="(item, index) in todoList" :key="index">
                  <template #prefix>
                    <el-tag type="warning" size="small">待办</el-tag>
                  </template>
                  <div class="list-item-content">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-desc">{{ item.description }}</div>
                    <div class="item-time">{{ item.time }}</div>
                  </div>
                  <template #suffix>
                    <el-button size="small" @click="handleTodoItem(item.id)">处理</el-button>
                  </template>
                </el-list-item>
              </el-list>
            </el-tab-pane>
            <el-tab-pane label="消息通知" name="message">
              <template #label>
                <div class="tab-with-badge">
                  <span>消息通知</span>
                  <el-badge v-if="messageList.length > 0" :value="messageList.length" type="danger" />
                </div>
              </template>
              <el-empty v-if="messageList.length === 0" description="暂无消息通知" />
              <el-list v-else>
                <el-list-item v-for="(item, index) in messageList" :key="index">
                  <template #prefix>
                    <el-tag type="info" size="small">消息</el-tag>
                  </template>
                  <div class="list-item-content">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-desc">{{ item.content }}</div>
                    <div class="item-time">{{ item.time }}</div>
                  </div>
                  <template #suffix>
                    <el-button size="small" @click="viewMessageDetail(item.id)">查看</el-button>
                  </template>
                </el-list-item>
              </el-list>
            </el-tab-pane>
            <el-tab-pane label="预警信息" name="warning">
              <template #label>
                <div class="tab-with-badge">
                  <span>预警信息</span>
                  <el-badge v-if="warningList.length > 0" :value="warningList.length" type="danger" />
                </div>
              </template>
              <el-empty v-if="warningList.length === 0" description="暂无预警信息" />
              <el-list v-else>
                <el-list-item v-for="(item, index) in warningList" :key="index">
                  <template #prefix>
                    <el-tag type="danger" size="small">预警</el-tag>
                  </template>
                  <div class="list-item-content">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-desc">{{ item.description }}</div>
                    <div class="item-time">{{ item.time }}</div>
                  </div>
                  <template #suffix>
                    <el-button size="small" @click="handleWarning(item.id)">处理</el-button>
                  </template>
                </el-list-item>
              </el-list>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { OfficeBuilding, Present, Position, User, Warning } from '@element-plus/icons-vue'

const router = useRouter()

// 激活的标签页
const activeTab = ref('todo')

// 快捷导航
const navigateTo = (path: string) => {
  router.push(`/admin/${path}`)
}

// 资讯列表
const newsList = ref([
  {
    id: 1,
    title: '平台系统更新',
    content: '蓝领智汇平台已更新至最新版本，新增了多项功能和优化，请各位管理员及时了解。',
    date: '2026-02-25'
  },
  {
    id: 2,
    title: '新的套餐政策',
    content: '2026年新的套餐政策已发布，请各位管理员查看并向租户传达。',
    date: '2026-02-20'
  },
  {
    id: 3,
    title: '安全培训通知',
    content: '平台安全培训计划已安排，请各管理员参加。',
    date: '2026-02-15'
  }
])

// 待办事项
const todoList = ref([
  {
    id: 1,
    title: '租户审核',
    description: '新租户注册申请需要审核',
    time: '2026-02-25 10:00'
  },
  {
    id: 2,
    title: '套餐配置更新',
    description: '更新2026年套餐配置',
    time: '2026-02-25 09:00'
  },
  {
    id: 3,
    title: '系统日志审查',
    description: '审查上周系统日志',
    time: '2026-02-24 16:00'
  }
])

// 消息通知
const messageList = ref([
  {
    id: 1,
    title: '系统通知',
    content: '您有新的系统消息，请及时查看',
    time: '2026-02-25 08:00'
  },
  {
    id: 2,
    title: '租户消息',
    content: '某租户提交了技术支持请求',
    time: '2026-02-24 17:30'
  }
])

// 预警信息
const warningList = ref([
  {
    id: 1,
    title: '系统负载预警',
    description: '系统负载较高，请关注服务器状态',
    time: '2026-02-25 11:00'
  },
  {
    id: 2,
    title: '租户异常预警',
    description: '某租户账户异常，请及时处理',
    time: '2026-02-24 14:00'
  }
])

// 查看资讯详情
const viewNewsDetail = (id: number) => {
  console.log('查看资讯详情:', id)
  // 这里可以跳转到资讯详情页
}

// 处理待办事项
const handleTodoItem = (id: number) => {
  console.log('处理待办事项:', id)
  // 这里可以跳转到待办事项处理页
}

// 查看消息详情
const viewMessageDetail = (id: number) => {
  console.log('查看消息详情:', id)
  // 这里可以跳转到消息详情页
}

// 处理预警信息
const handleWarning = (id: number) => {
  console.log('处理预警信息:', id)
  // 这里可以跳转到预警信息处理页
}
</script>

<style scoped>
.admin-home {
  padding: 20px;
}

.home-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
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

/* 快捷导航 */
.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.quick-nav-item {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  padding: 20px 0;
}

.quick-nav-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  margin-bottom: 12px;
  color: #409eff;
}

.nav-text {
  font-size: 14px;
  color: #303133;
}

/* 资讯板块 */
.news-card {
  margin-top: 8px;
}

.news-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.news-content {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.5;
}

.news-footer {
  text-align: right;
}

/* 待办/消息/预警列表 */
.tasks-card {
  margin-top: 8px;
}

.list-item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #303133;
}

.item-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
  line-height: 1.4;
}

.item-time {
  font-size: 12px;
  color: #909399;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .admin-home {
    padding: 16px;
  }

  .quick-nav-grid {
    grid-template-columns: repeat(2, 1fr);
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