<template>
  <header class="top-navigation">
    <div class="nav-left">
      <!-- Logo -->
      <div class="logo-container">
        <img src="/assets/logo.svg" alt="蓝领智汇" class="logo-image" />
        <span class="logo-text">蓝领智汇</span>
      </div>
    </div>

    <div class="nav-center">
      <!-- 一级菜单 -->
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        class="top-menu"
        :ellipsis="true"
        @select="handleMenuSelect"
      >
        <el-menu-item
          v-for="menu in firstLevelMenus"
          :key="menu.code"
          :index="menu.code"
          class="menu-item"
        >
          <el-icon class="menu-icon">
            <component :is="menu.icon" />
          </el-icon>
          <span class="menu-text">{{ menu.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="nav-right">
      <!-- 用户信息 -->
      <div class="user-info">
        <el-dropdown @command="handleUserCommand">
          <span class="user-dropdown">
            <el-avatar :size="32" :src="userInfo?.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <span class="user-name">{{ userInfo?.realName || userInfo?.username || '用户' }}</span>
            <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                <span>系统设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 消息通知 -->
      <div class="notification">
        <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
          <el-button circle class="notification-btn">
            <el-icon><Bell /></el-icon>
          </el-button>
        </el-badge>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  User,
  ArrowDown,
  Setting,
  SwitchButton,
  Bell,
  Briefcase,
  ChatDotRound,
  UserFilled,
  Document,
  Management,
  RemoveFilled,
  Wallet,
  Tools
} from '@element-plus/icons-vue'
import type { FirstLevelMenu, UserInfo } from '../types/menu'

// Props
interface Props {
  userInfo?: UserInfo
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: undefined
})

// Emits
const emit = defineEmits<{
  menuSelect: [code: string]
}>()

// 路由实例
const router = useRouter()
const route = useRoute()

// 消息通知数量
const notificationCount = ref(0)

// 一级菜单配置（9个核心业务领域）
const firstLevelMenus = ref<FirstLevelMenu[]>([
  { code: 'work-center', name: '工作中心', icon: Briefcase },
  { code: 'recruitment', name: '招聘管理', icon: ChatDotRound },
  { code: 'interview', name: '面试管理', icon: UserFilled },
  { code: 'worker', name: '工人管理', icon: User },
  { code: 'contract', name: '合同管理', icon: Document },
  { code: 'employment', name: '在职管理', icon: Management },
  { code: 'resignation', name: '离职管理', icon: RemoveFilled },
  { code: 'settlement', name: '结算管理', icon: Wallet },
  { code: 'system', name: '系统管理', icon: Tools }
])

// 当前激活的菜单
const activeMenu = computed(() => {
  const path = route.path
  // 根据路由路径判断当前激活的一级菜单
  if (path.includes('/todo') || path.includes('/messages') || path.includes('/warnings')) return 'work-center'
  if (path.includes('/recruitment-requirement') || path.includes('/resume-management')) return 'recruitment'
  if (path.includes('/pickup-management') || path.includes('/preliminary-interview') || path.includes('/interview-invitation') || path.includes('/factory-interview')) return 'interview'
  if (path.includes('/worker-info')) return 'worker'
  if (path.includes('/sign-contract')) return 'contract'
  if (path.includes('/on-duty') || path.includes('/communication') || path.includes('/entertainment') || path.includes('/registration') || path.includes('/publish-news') || path.includes('/club-management') || path.includes('/special-case') || path.includes('/insurance-management') || path.includes('/claim-registration') || path.includes('/attendance') || path.includes('/leave') || path.includes('/transfer') || path.includes('/reward-punishment') || path.includes('/learning-materials') || path.includes('/question-bank') || path.includes('/learning-time') || path.includes('/exam-management') || path.includes('/exam-results') || path.includes('/complaint-suggestion')) return 'employment'
  if (path.includes('/resignation-management')) return 'resignation'
  if (path.includes('/referral') || path.includes('/commission') || path.includes('/settlement')) return 'settlement'
  if (path.includes('/company-culture') || path.includes('/position-culture') || path.includes('/department') || path.includes('/employee') || path.includes('/position') || path.includes('/rule') || path.includes('/menu') || path.includes('/dictionary') || path.includes('/system-parameter') || path.includes('/process') || path.includes('/process-config') || path.includes('/attachment') || path.includes('/template-config') || path.includes('/print-config')) return 'system'
  return 'work-center'
})

// 处理菜单选择
const handleMenuSelect = (code: string) => {
  emit('menuSelect', code)
}

// 处理用户命令
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      // 跳转到个人中心
      break
    case 'settings':
      // 跳转到系统设置
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('userInfo')
  router.push('/login')
}

// 初始化
onMounted(() => {
  // 获取消息通知数量
  // TODO: 从API获取
})
</script>

<style scoped>
.top-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height, 60px);
  padding: 0 var(--spacing-xl, 20px);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid var(--color-border-lighter, #e4e7ed);
  position: relative;
  z-index: var(--z-index-fixed, 1000);
}

.nav-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
  cursor: pointer;
  transition: all var(--transition-fast, 0.2s);
}

.logo-container:hover {
  transform: scale(1.02);
}

.logo-image {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 20px;
  font-weight: var(--font-weight-bold, 600);
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.top-menu {
  border-bottom: none;
  background: transparent;
  flex: 1;
  max-width: 1200px;
}

.top-menu :deep(.el-menu-item) {
  height: var(--header-height, 60px);
  line-height: var(--header-height, 60px);
  padding: 0 var(--spacing-lg, 16px);
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast, 0.2s);
  font-size: var(--font-size-base, 14px);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-regular, #606266);
}

.top-menu :deep(.el-menu-item:hover) {
  background-color: var(--bg-color-hover, #f5f7fa);
  color: var(--color-primary, #409eff);
}

.top-menu :deep(.el-menu-item.is-active) {
  background-color: var(--bg-color-active, #ecf5ff);
  color: var(--color-primary, #409eff);
  border-bottom-color: var(--color-primary, #409eff);
  font-weight: var(--font-weight-bold, 600);
}

.menu-icon {
  font-size: 16px;
  margin-right: var(--spacing-xs, 4px);
}

.menu-text {
  font-size: var(--font-size-base, 14px);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 12px);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs, 4px) var(--spacing-sm, 8px);
  border-radius: var(--radius-lg, 8px);
  transition: all var(--transition-fast, 0.2s);
  cursor: pointer;
}

.user-info:hover {
  background-color: var(--bg-color-hover, #f5f7fa);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
  padding: var(--spacing-xs, 4px);
}

.user-name {
  font-size: var(--font-size-base, 14px);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-primary, #303133);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  font-size: 12px;
  color: var(--color-text-secondary, #909399);
  transition: transform var(--transition-fast, 0.2s);
}

.user-info:hover .arrow-icon {
  transform: rotate(180deg);
}

.notification {
  display: flex;
  align-items: center;
}

.notification-btn {
  border: none;
  background: transparent;
  padding: 8px;
  color: var(--color-text-regular, #606266);
  transition: all var(--transition-fast, 0.2s);
}

.notification-btn:hover {
  background-color: var(--bg-color-hover, #f5f7fa);
  color: var(--color-primary, #409eff);
}

.notification-badge :deep(.el-badge__content) {
  background-color: var(--color-danger, #f56c6c);
}

/* 响应式设计 */
@media screen and (max-width: 1440px) {
  .logo-text {
    font-size: 18px;
  }

  .menu-text {
    font-size: var(--font-size-small, 13px);
  }
}

@media screen and (max-width: 1200px) {
  .top-menu :deep(.el-menu-item) {
    padding: 0 var(--spacing-md, 12px);
  }

  .logo-text {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .top-navigation {
    padding: 0 var(--spacing-md, 12px);
  }

  .nav-center {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style>
