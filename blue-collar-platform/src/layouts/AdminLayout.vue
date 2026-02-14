<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <header class="layout-header">
      <div class="header-left">
        <div class="logo-container">
          <img src="/src/assets/logo.png" alt="蓝领智汇" class="logo-image" />
          <span class="logo-text">- 平台管理</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <el-dropdown>
            <span class="user-name">
              {{ userInfo?.username || '管理员' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <!-- 主体内容 -->
    <div class="layout-body">
      <!-- 左侧导航栏 -->
      <aside class="layout-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
          :collapse-transition="false"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><data-line /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/admin/tenants">
            <el-icon><office-building /></el-icon>
            <span>租户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/packages">
            <el-icon><present /></el-icon>
            <span>套餐配置</span>
          </el-menu-item>
          <el-menu-item index="/admin/recruitment">
            <el-icon><position /></el-icon>
            <span>招聘管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <el-icon><user /></el-icon>
            <span>注册用户</span>
          </el-menu-item>
          <el-menu-item index="/admin/idle-workers">
            <el-icon><warning /></el-icon>
            <span>空闲工人</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <!-- 右侧内容区域 -->
      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowDown, DataLine, OfficeBuilding, Present, Position, User, Warning } from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()
const route = useRoute()

// 用户信息
const userInfo = ref<any>(null)

// 计算当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('userInfo')
  router.push('/login')
}

// 初始化
onMounted(() => {
  // 从本地存储获取用户信息
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  }
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* 顶部导航栏 */
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  background-color: #F3F1F1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}



.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  font-size: 14px;
  cursor: pointer;
  color: #303133;
}

/* 主体内容 */
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧导航栏 */
.layout-sidebar {
  width: 200px;
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 0;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 右侧内容区域 */
.layout-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .layout-sidebar {
    display: none;
  }
  
  .layout-content {
    padding: 16px;
  }
}
</style>