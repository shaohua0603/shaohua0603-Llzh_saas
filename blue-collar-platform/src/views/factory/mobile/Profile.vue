<template>
  <div class="factory-mobile-profile">
    <div class="profile-header">
      <el-card shadow="hover" class="profile-card">
        <div class="factory-info">
          <el-avatar :size="80" :src="factoryInfo.avatar" />
          <div class="factory-details">
            <div class="factory-name">{{ factoryInfo.name }}</div>
            <div class="factory-contact">{{ factoryInfo.contact }}</div>
            <div class="factory-address">{{ factoryInfo.address }}</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="function-menu">
      <el-card shadow="hover" class="menu-card">
        <template #header>
          <div class="menu-header">工厂管理</div>
        </template>
        <div class="menu-list">
          <div class="menu-item" @click="navigateTo('recruitment')">
            <div class="menu-icon">
              <el-icon><i-ep-position /></el-icon>
            </div>
            <div class="menu-text">招聘管理</div>
            <div class="menu-arrow">
              <el-icon><i-ep-arrow-right /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="navigateTo('workers')">
            <div class="menu-icon">
              <el-icon><i-ep-user /></el-icon>
            </div>
            <div class="menu-text">工人管理</div>
            <div class="menu-arrow">
              <el-icon><i-ep-arrow-right /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="navigateTo('training')">
            <div class="menu-icon">
              <el-icon><i-ep-document /></el-icon>
            </div>
            <div class="menu-text">岗前培训</div>
            <div class="menu-arrow">
              <el-icon><i-ep-arrow-right /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="navigateTo('salary')">
            <div class="menu-icon">
              <el-icon><i-ep-money /></el-icon>
            </div>
            <div class="menu-text">结算管理</div>
            <div class="menu-arrow">
              <el-icon><i-ep-arrow-right /></el-icon>
            </div>
          </div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="menu-card mt-4">
        <template #header>
          <div class="menu-header">系统设置</div>
        </template>
        <div class="menu-list">
          <div class="menu-item" @click="handleSettings('account')">
            <div class="menu-icon">
              <el-icon><i-ep-setting /></el-icon>
            </div>
            <div class="menu-text">账户设置</div>
            <div class="menu-arrow">
              <el-icon><i-ep-arrow-right /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="handleSettings('security')">
            <div class="menu-icon">
              <el-icon><i-ep-lock /></el-icon>
            </div>
            <div class="menu-text">安全设置</div>
            <div class="menu-arrow">
              <el-icon><i-ep-arrow-right /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="handleSettings('about')">
            <div class="menu-icon">
              <el-icon><i-ep-info /></el-icon>
            </div>
            <div class="menu-text">关于系统</div>
            <div class="menu-arrow">
              <el-icon><i-ep-arrow-right /></el-icon>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="logout-section">
      <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 工厂信息
const factoryInfo = ref({
  name: '富士康科技集团',
  contact: '王总 13800138011',
  address: '深圳市龙华区富士康科技园区',
  avatar: 'https://via.placeholder.com/150'
})

// 导航到功能页面
const navigateTo = (path: string) => {
  router.push(`/factory-mobile/${path}`)
}

// 处理设置项
const handleSettings = (setting: string) => {
  console.log('处理设置:', setting)
}

// 退出登录
const handleLogout = () => {
  // 清除本地存储的用户信息
  localStorage.removeItem('userInfo')
  // 跳转到登录页面
  router.push('/login')
}
</script>

<style scoped>
.factory-mobile-profile {
  padding: 16px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.profile-header {
  margin-bottom: 16px;
}

.profile-card {
  border-radius: 8px;
}

.factory-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.factory-details {
  flex: 1;
}

.factory-name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
}

.factory-contact {
  font-size: 14px;
  color: #606266;
  margin-bottom: 2px;
}

.factory-address {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.function-menu {
  margin-bottom: 16px;
}

.menu-card {
  border-radius: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.menu-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.menu-list {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #409EFF;
}

.menu-text {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.menu-arrow {
  color: #c0c4cc;
}

.logout-section {
  margin-top: 32px;
  padding: 0 16px;
}
</style>