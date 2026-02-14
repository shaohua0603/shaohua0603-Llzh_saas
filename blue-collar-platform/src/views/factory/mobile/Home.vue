<template>
  <div class="factory-mobile-home">
    <!-- 工厂信息卡片 -->
    <el-card class="factory-card">
      <div class="factory-info">
        <div class="factory-name">{{ factoryInfo.factoryName }}</div>
        <div class="factory-address">{{ factoryInfo.address }}</div>
      </div>
    </el-card>
    
    <!-- 快捷功能 -->
    <div class="quick-functions">
      <el-grid :cols="4" :gap="16" class="function-grid">
        <el-grid-item>
          <div class="function-item" @click="navigateTo('/factory/dashboard')">
            <div class="function-icon dashboard-icon">
              <i class="el-icon-data-line"></i>
            </div>
            <div class="function-label">仪表盘</div>
          </div>
        </el-grid-item>
        <el-grid-item>
          <div class="function-item" @click="navigateTo('/factory/recruitment')">
            <div class="function-icon recruitment-icon">
              <i class="el-icon-position"></i>
            </div>
            <div class="function-label">招聘管理</div>
          </div>
        </el-grid-item>
        <el-grid-item>
          <div class="function-item" @click="navigateTo('/factory/workers')">
            <div class="function-icon worker-icon">
              <i class="el-icon-user-filled"></i>
            </div>
            <div class="function-label">工人管理</div>
          </div>
        </el-grid-item>
        <el-grid-item>
          <div class="function-item" @click="navigateTo('/factory/training')">
            <div class="function-icon training-icon">
              <i class="el-icon-reading"></i>
            </div>
            <div class="function-label">岗前培训</div>
          </div>
        </el-grid-item>
      </el-grid>
    </div>
    
    <!-- 统计数据 -->
    <el-card class="stats-card">
      <h3 class="card-title">运营数据</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ stats.totalWorkers }}</div>
          <div class="stat-label">总工人</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.activeWorkers }}</div>
          <div class="stat-label">在职</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.recruitmentCount }}</div>
          <div class="stat-label">招聘需求</div>
        </div>
      </div>
    </el-card>
    
    <!-- 最近消息 -->
    <el-card class="messages-card">
      <h3 class="card-title">最近消息</h3>
      <div class="message-list">
        <div 
          v-for="message in recentMessages" 
          :key="message.id" 
          class="message-item"
        >
          <div class="message-content">{{ message.content }}</div>
          <div class="message-time">{{ message.createdAt }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 路由实例
const router = useRouter()

// 工厂信息
const factoryInfo = ref({
  factoryName: '工厂名称',
  address: '工厂地址'
})

// 统计数据
const stats = ref({
  totalWorkers: 0,
  activeWorkers: 0,
  recruitmentCount: 0
})

// 最近消息
const recentMessages = ref<any[]>([])

// 导航到指定页面
const navigateTo = (path: string) => {
  router.push(path)
}

// 初始化数据
onMounted(async () => {
  try {
    // 获取工厂信息
    const factoryResponse = await axios.get('/api/factory/info')
    factoryInfo.value = factoryResponse.data
    
    // 获取统计数据
    const statsResponse = await axios.get('/api/factory/stats')
    stats.value = statsResponse.data
    
    // 获取最近消息
    const messagesResponse = await axios.get('/api/factory/messages?limit=3')
    recentMessages.value = messagesResponse.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})
</script>

<style scoped>
.factory-mobile-home {
  padding: 16px;
}

/* 工厂信息卡片 */
.factory-card {
  margin-bottom: 16px;
}

.factory-info {
  text-align: center;
}

.factory-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.factory-address {
  font-size: 14px;
  color: #606266;
}

/* 快捷功能 */
.quick-functions {
  margin-bottom: 16px;
}

.function-grid {
  margin-top: 16px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
}

.function-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 24px;
}

.dashboard-icon {
  background-color: #ecf5ff;
  color: #409eff;
}

.recruitment-icon {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.worker-icon {
  background-color: #f0f9eb;
  color: #67c23a;
}

.training-icon {
  background-color: #fef0f0;
  color: #f56c6c;
}

.function-label {
  font-size: 12px;
  color: #606266;
  margin-top: 4px;
}

/* 统计数据卡片 */
.stats-card {
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #303133;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #606266;
}

/* 消息卡片 */
.messages-card {
  margin-bottom: 16px;
}

.message-list {
  padding: 0 8px;
}

.message-item {
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.message-item:last-child {
  border-bottom: none;
}

.message-content {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.message-time {
  font-size: 12px;
  color: #909399;
}
</style>