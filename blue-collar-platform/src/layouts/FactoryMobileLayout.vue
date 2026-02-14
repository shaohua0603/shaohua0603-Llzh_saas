<template>
  <div class="factory-mobile-layout">
    <!-- 顶部导航栏 -->
    <header class="mobile-header">
      <h1 class="header-title">{{ currentTitle }}</h1>
    </header>
    
    <!-- 主体内容 -->
    <main class="mobile-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- 底部导航栏 -->
    <footer class="mobile-footer">
      <el-tabbar v-model="activeTab" class="footer-tabbar">
        <el-tabbar-item :to="'/factory-mobile/home'" icon="HomeFilled" label="首页">
          首页
        </el-tabbar-item>
        <el-tabbar-item :to="'/factory-mobile/workers'" icon="UserFilled" label="工人">
          工人
        </el-tabbar-item>
        <el-tabbar-item :to="'/factory-mobile/training'" icon="ReadingFilled" label="培训">
          培训
        </el-tabbar-item>
        <el-tabbar-item :to="'/factory-mobile/profile'" icon="SettingFilled" label="我的">
          我的
        </el-tabbar-item>
      </el-tabbar>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 路由实例
const route = useRoute()
const router = useRouter()

// 当前激活的标签
const activeTab = ref('home')

// 当前页面标题
const currentTitle = computed(() => {
  return route.meta.title as string || '工厂'
})

// 监听路由变化，更新激活的标签
watch(() => route.path, (newPath) => {
  if (newPath.includes('home')) {
    activeTab.value = 'home'
  } else if (newPath.includes('workers')) {
    activeTab.value = 'workers'
  } else if (newPath.includes('training')) {
    activeTab.value = 'training'
  } else if (newPath.includes('profile')) {
    activeTab.value = 'profile'
  }
}, { immediate: true })
</script>

<style scoped>
.factory-mobile-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.mobile-header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

/* 主体内容 */
.mobile-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 底部导航栏 */
.mobile-footer {
  height: 56px;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.footer-tabbar {
  height: 100%;
}

.footer-tabbar :deep(.el-tabbar__item) {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-tabbar :deep(.el-tabbar__item.is-active) {
  color: #409eff;
}
</style>