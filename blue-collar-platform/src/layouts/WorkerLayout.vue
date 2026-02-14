<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { House, Grid, Document, Message, User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const activeIndex = ref('1')

// 导航菜单
const menuItems = [
  {
    index: '1',
    path: '/worker/home',
    title: '首页',
    icon: 'House'
  },
  {
    index: '2',
    path: '/worker/dashboard',
    title: '工作台',
    icon: 'Grid'
  },
  {
    index: '3',
    path: '/worker/skill',
    title: '资讯',
    icon: 'Document'
  },
  {
    index: '4',
    path: '/worker/messages',
    title: '消息',
    icon: 'Message'
  },
  {
    index: '5',
    path: '/worker/profile',
    title: '我的',
    icon: 'User'
  }
]

// 切换导航
const handleSelect = (key: string) => {
  activeIndex.value = key
  const menuItem = menuItems.find(item => item.index === key)
  if (menuItem) {
    router.push(menuItem.path)
  }
}

// 页面加载时设置当前激活的导航项
onMounted(() => {
  const currentPath = route.path
  const menuItem = menuItems.find(item => currentPath.includes(item.path))
  if (menuItem) {
    activeIndex.value = menuItem.index
  }
})
</script>

<template>
  <div class="worker-layout">
    <!-- 页面内容 -->
    <main class="worker-content">
      <router-view />
    </main>
    
    <!-- 底部导航栏 -->
    <footer class="worker-footer">
      <el-menu
        :default-active="activeIndex"
        class="worker-nav"
        mode="horizontal"
        @select="handleSelect"
      >
        <!-- 首页 -->
        <el-menu-item index="1" @click="router.push('/worker/home')">
          <span class="nav-item">🏠 首页</span>
        </el-menu-item>
        
        <!-- 工作台 -->
        <el-menu-item index="2" @click="router.push('/worker/dashboard')">
          <span class="nav-item">📋 工作台</span>
        </el-menu-item>
        
        <!-- 资讯 -->
        <el-menu-item index="3" @click="router.push('/worker/skill')">
          <span class="nav-item">📚 资讯</span>
        </el-menu-item>
        
        <!-- 消息 -->
        <el-menu-item index="4" @click="router.push('/worker/messages')">
          <span class="nav-item">💬 消息</span>
        </el-menu-item>
        
        <!-- 我的 -->
        <el-menu-item index="5" @click="router.push('/worker/profile')">
          <span class="nav-item">👤 我的</span>
        </el-menu-item>
      </el-menu>
    </footer>
  </div>
</template>

<style scoped>
.worker-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.worker-content {
  flex: 1;
  padding-bottom: 60px; /* 为底部导航栏留出空间 */
}

.worker-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.worker-nav {
  display: flex;
  justify-content: space-around;
  height: 60px;
  border-top: 1px solid #eaeaea;
}

.worker-nav .el-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 60px;
  min-width: 60px;
}

.worker-nav .el-menu-item .nav-icon {
  margin-bottom: 4px;
  font-size: 20px;
}

.worker-nav .el-menu-item span {
  font-size: 12px;
}

.worker-nav .el-menu-item.is-active {
  color: #667eea;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .worker-content {
    padding-bottom: 55px;
  }
  
  .worker-footer {
    height: 55px;
  }
  
  .worker-nav {
    height: 55px;
  }
  
  .worker-nav .el-menu-item {
    height: 55px;
  }
  
  .worker-nav .el-menu-item .nav-icon {
    font-size: 18px;
  }
  
  .worker-nav .el-menu-item span {
    font-size: 11px;
  }
}
</style>