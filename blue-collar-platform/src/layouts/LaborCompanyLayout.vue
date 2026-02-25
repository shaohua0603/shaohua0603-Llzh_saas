<template>
  <div class="labor-company-layout">
    <!-- 顶部导航栏 -->
    <header class="layout-header">
      <div class="header-left">
        <!-- 移动端汉堡菜单按钮 -->
        <div class="mobile-menu-toggle" @click="toggleMobileMenu" v-if="isMobile">
          <el-icon>
            <Menu />
          </el-icon>
        </div>

        <div class="logo-container">
          <img src="/assets/logo.jpg" alt="蓝领智汇" class="logo-image" />
        </div>

        <!-- 顶部一级菜单 -->
        <div class="top-menu-container" v-show="!isMobile">
          <el-menu
            :default-active="activeFirstMenu"
            class="top-menu"
            mode="horizontal"
            @select="handleFirstMenuSelect"
            :collapse="!showMenuText"
          >
            <el-menu-item index="work-center">
              <el-icon><Bell /></el-icon>
              <span>工作中心</span>
            </el-menu-item>
            <el-menu-item index="recruitment">
              <el-icon><Position /></el-icon>
              <span>招聘管理</span>
            </el-menu-item>
            <el-menu-item index="workers">
              <el-icon><User /></el-icon>
              <span>工人管理</span>
            </el-menu-item>
            <el-menu-item index="attendance">
              <el-icon><Timer /></el-icon>
              <span>考勤管理</span>
            </el-menu-item>
            <el-menu-item index="salary">
              <el-icon><Money /></el-icon>
              <span>结算管理</span>
            </el-menu-item>
            <el-menu-item index="departments">
              <el-icon><OfficeBuilding /></el-icon>
              <span>部门管理</span>
            </el-menu-item>
            <el-menu-item index="roles">
              <el-icon><Key /></el-icon>
              <span>角色管理</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <el-dropdown>
            <span class="user-name">
              {{ userInfo?.companyName || '劳务公司' }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
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

    <!-- 移动端抽屉菜单 -->
    <el-drawer
      v-model="mobileMenuVisible"
      direction="ltr"
      size="280px"
      :with-header="false"
      class="mobile-drawer"
    >
      <div class="mobile-menu-content">
        <div class="mobile-menu-header">
          <div class="logo-container">
            <img src="/src/assets/logo.png" alt="蓝领智汇" class="logo-image" />
            <span class="logo-text">蓝领智汇</span>
          </div>
          <div class="close-btn" @click="toggleMobileMenu">
            <el-icon><Close /></el-icon>
          </div>
        </div>

        <!-- 移动端一级菜单 -->
        <div class="mobile-first-menu">
          <div
            v-for="menu in firstMenus"
            :key="menu.key"
            class="mobile-menu-item"
            :class="{ 'active': activeFirstMenu === menu.key }"
            @click="handleMobileFirstMenu(menu.key)"
          >
            <el-icon>
              <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.label }}</span>
          </div>
        </div>

        <!-- 移动端二级菜单 -->
        <div class="mobile-second-menu" v-if="activeFirstMenu">
          <div class="mobile-menu-title">二级菜单</div>
          <div
            v-for="item in getCurrentSecondMenus()"
            :key="item.path"
            class="mobile-menu-item"
            :class="{ 'active': route.path === item.path }"
            @click="handleMobileSecondMenu(item.path)"
          >
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
    
    <!-- 主体内容 -->
    <div class="layout-body">
      <!-- 左侧导航栏 (二级和三级菜单) -->
      <div class="sidebar-container">
        <!-- 收起展开按钮 (位于菜单栏外面) -->
        <div class="sidebar-toggle" @click="toggleSidebar" :class="{ 'collapsed': isSidebarCollapsed }">
          <el-icon>
            <ArrowLeft v-if="!isSidebarCollapsed" />
            <ArrowRight v-else />
          </el-icon>
        </div>
        <aside class="layout-sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
        <el-menu
          :default-active="activeSubMenu"
          class="sidebar-menu"
          router
          :collapse-transition="false"
          :collapse="isSidebarCollapsed"
          @select="handleMenuSelect"
        >
          <!-- 工作中心二级菜单 -->
          <template v-if="activeFirstMenu === 'work-center'">
            <el-menu-item index="/labor-company/todo">
              <el-icon><Bell /></el-icon>
              <span>待办任务</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/messages">
              <el-icon><Bell /></el-icon>
              <span>消息通知</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/warnings">
              <el-icon><Bell /></el-icon>
              <span>预警消息</span>
            </el-menu-item>
          </template>
          
          <!-- 招聘管理二级菜单 -->
          <template v-if="activeFirstMenu === 'recruitment'">
            <el-menu-item index="/labor-company/recruitment">
              <el-icon><Connection /></el-icon>
              <span>招聘需求</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/recruitment/applications">
              <el-icon><Document /></el-icon>
              <span>申请管理</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/recruitment/history">
              <el-icon><Timer /></el-icon>
              <span>招聘历史</span>
            </el-menu-item>
          </template>
          
          <!-- 工人管理二级菜单 -->
          <template v-if="activeFirstMenu === 'workers'">
            <el-menu-item index="/labor-company/workers">
              <el-icon><List /></el-icon>
              <span>工人列表</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/workers/profile">
              <el-icon><Avatar /></el-icon>
              <span>工人档案</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/workers/transfer">
              <el-icon><SwitchButton /></el-icon>
              <span>调动管理</span>
            </el-menu-item>
          </template>
          
          <!-- 考勤管理二级菜单 -->
          <template v-if="activeFirstMenu === 'attendance'">
            <el-menu-item index="/labor-company/attendance">
              <el-icon><Check /></el-icon>
              <span>考勤记录</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/attendance/statistics">
              <el-icon><DataAnalysis /></el-icon>
              <span>考勤统计</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/attendance/leave">
              <el-icon><Calendar /></el-icon>
              <span>请假管理</span>
            </el-menu-item>
          </template>
          
          <!-- 结算管理二级菜单 -->
          <template v-if="activeFirstMenu === 'salary'">
            <el-menu-item index="/labor-company/salary">
              <el-icon><Coin /></el-icon>
              <span>工资结算</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/salary/history">
              <el-icon><DocumentCopy /></el-icon>
              <span>结算历史</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/salary/settings">
              <el-icon><Setting /></el-icon>
              <span>结算设置</span>
            </el-menu-item>
          </template>
          
          <!-- 部门管理二级菜单 -->
          <template v-if="activeFirstMenu === 'departments'">
            <el-menu-item index="/labor-company/departments">
              <el-icon><Grid /></el-icon>
              <span>部门列表</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/departments/create">
              <el-icon><Plus /></el-icon>
              <span>创建部门</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/departments/staff">
              <el-icon><UserFilled /></el-icon>
              <span>部门人员</span>
            </el-menu-item>
          </template>
          
          <!-- 角色管理二级菜单 -->
          <template v-if="activeFirstMenu === 'roles'">
            <el-menu-item index="/labor-company/roles">
              <el-icon><Position /></el-icon>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/roles/create">
              <el-icon><Edit /></el-icon>
              <span>创建角色</span>
            </el-menu-item>
            <el-menu-item index="/labor-company/roles/permissions">
              <el-icon><Lock /></el-icon>
              <span>权限管理</span>
            </el-menu-item>
          </template>
        </el-menu>
        </aside>
      </div>
      
      <!-- 右侧内容区域 -->
      <div class="content-container">
        <!-- 四级导航栏 (页面标签) -->
        <div class="page-tabs">
          <div class="page-tabs-scroll">
            <div 
              v-for="tab in openTabs" 
              :key="tab.path"
              class="page-tab" 
              :class="{ 'active': tab.path === currentPath }"
              @click="switchTab(tab)"
              @contextmenu.prevent="openContextMenu($event, tab)"
            >
              <span class="tab-title">{{ tab.title }}</span>
              <span v-if="!tab.fixed" class="tab-close" @click.stop="closeTab(tab)">×</span>
            </div>
          </div>
        </div>
        
        <!-- 内容区域 -->
        <main class="layout-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
        
        <!-- 右键菜单 -->
        <div 
          class="context-menu" 
          v-if="showContextMenu"
          :style="{ top: contextMenuTop + 'px', left: contextMenuLeft + 'px' }"
          @click.stop
        >
          <div class="menu-item" @click="refreshCurrentTab">
            <el-icon><Refresh /></el-icon>
            <span>刷新</span>
          </div>
          <div class="menu-divider" v-if="!currentTab.fixed"></div>
          <div class="menu-item" @click="closeCurrentTab" v-if="!currentTab.fixed">
            <el-icon><Close /></el-icon>
            <span>关闭</span>
          </div>
          <div class="menu-item" @click="closeOtherTabs" v-if="!currentTab.fixed">
            <el-icon><Close /></el-icon>
            <span>关闭其他</span>
          </div>
          <div class="menu-item" @click="closeAllTabs" v-if="!currentTab.fixed">
            <el-icon><Close /></el-icon>
            <span>关闭全部</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowDown,
  Position,
  User,
  Timer,
  Money,
  OfficeBuilding,
  Key,
  ArrowLeft,
  ArrowRight,
  Connection,
  Document,
  List,
  Avatar,
  SwitchButton,
  Check,
  DataAnalysis,
  Calendar,
  Coin,
  DocumentCopy,
  Setting,
  Grid,
  Plus,
  UserFilled,
  Edit,
  Lock,
  Refresh,
  Close,
  Menu,
  More,
  House,
  HomeFilled,
  Bell
} from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()
const route = useRoute()

// 用户信息
const userInfo = ref<any>(null)

// 响应式状态
const showMenuText = ref(true)
const headerWidth = ref(0)
const isSidebarCollapsed = ref(false)
const isMobile = ref(false)
const mobileMenuVisible = ref(false)
const selectedFirstMenu = ref('work-center')

// 一级菜单配置
const firstMenus = [
  { key: 'work-center', label: '工作中心', icon: Bell },
  { key: 'recruitment', label: '招聘管理', icon: Position },
  { key: 'workers', label: '工人管理', icon: User },
  { key: 'attendance', label: '考勤管理', icon: Timer },
  { key: 'salary', label: '结算管理', icon: Money },
  { key: 'departments', label: '部门管理', icon: OfficeBuilding },
  { key: 'roles', label: '角色管理', icon: Key }
]

// 二级菜单配置
const secondMenus = {
  'work-center': [
    { path: '/labor-company/todo', label: '待办任务', icon: Bell },
    { path: '/labor-company/messages', label: '消息通知', icon: Bell },
    { path: '/labor-company/warnings', label: '预警消息', icon: Bell }
  ],
  home: [
    { path: '/labor-company/home', label: '首页', icon: HomeFilled }
  ],
  recruitment: [
    { path: '/labor-company/recruitment', label: '招聘需求', icon: Connection },
    { path: '/labor-company/recruitment/applications', label: '申请管理', icon: Document },
    { path: '/labor-company/recruitment/history', label: '招聘历史', icon: Timer }
  ],
  workers: [
    { path: '/labor-company/workers', label: '工人列表', icon: List },
    { path: '/labor-company/workers/profile', label: '工人档案', icon: Avatar },
    { path: '/labor-company/workers/transfer', label: '调动管理', icon: SwitchButton }
  ],
  attendance: [
    { path: '/labor-company/attendance', label: '考勤记录', icon: Check },
    { path: '/labor-company/attendance/statistics', label: '考勤统计', icon: DataAnalysis },
    { path: '/labor-company/attendance/leave', label: '请假管理', icon: Calendar }
  ],
  salary: [
    { path: '/labor-company/salary', label: '工资结算', icon: Coin },
    { path: '/labor-company/salary/history', label: '结算历史', icon: DocumentCopy },
    { path: '/labor-company/salary/settings', label: '结算设置', icon: Setting }
  ],
  departments: [
    { path: '/labor-company/departments', label: '部门列表', icon: Grid },
    { path: '/labor-company/departments/create', label: '创建部门', icon: Plus },
    { path: '/labor-company/departments/staff', label: '部门人员', icon: UserFilled }
  ],
  roles: [
    { path: '/labor-company/roles', label: '角色列表', icon: Position },
    { path: '/labor-company/roles/create', label: '创建角色', icon: Edit },
    { path: '/labor-company/roles/permissions', label: '权限管理', icon: Lock }
  ]
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}

// 处理移动端一级菜单点击
const handleMobileFirstMenu = (key: string) => {
  activeFirstMenu.value = key
}

// 处理移动端二级菜单点击
const handleMobileSecondMenu = (path: string) => {
  router.push(path)
  mobileMenuVisible.value = false
}

// 获取当前二级菜单
const getCurrentSecondMenus = () => {
  return secondMenus[activeFirstMenu.value] || []
}

// 检测屏幕尺寸
const checkScreenSize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768

  const headerElement = document.querySelector('.layout-header')
  if (headerElement) {
    headerWidth.value = headerElement.clientWidth
    // 计算所需的最小宽度(每个菜单项约120px,7个菜单项)
    const minRequiredWidth = 7 * 120 + 200 // 菜单项宽度 + logo宽度
    showMenuText.value = headerWidth.value >= minRequiredWidth && !isMobile.value
  }
}

// 检测导航栏宽度并更新菜单显示状态
const checkHeaderWidth = () => {
  const headerElement = document.querySelector('.layout-header')
  if (headerElement) {
    headerWidth.value = headerElement.clientWidth
    // 计算所需的最小宽度(每个菜单项约120px,7个菜单项)
    const minRequiredWidth = 7 * 120 + 200 // 菜单项宽度 + logo宽度
    showMenuText.value = headerWidth.value >= minRequiredWidth && !isMobile.value
  }
}

// 计算当前激活的一级菜单
const activeFirstMenu = computed(() => {
  // 根据路径自动匹配，确保路由变化时菜单能正确切换
  const path = route.path
  if (path.includes('/todo') || path.includes('/messages') || path.includes('/warnings') || path.includes('/home')) return 'work-center'
  if (path.includes('/recruitment')) return 'recruitment'
  if (path.includes('/workers')) return 'workers'
  if (path.includes('/attendance')) return 'attendance'
  if (path.includes('/salary')) return 'salary'
  if (path.includes('/departments')) return 'departments'
  if (path.includes('/roles')) return 'roles'
  return 'work-center'
})

// 计算当前激活的二级/三级菜单
const activeSubMenu = computed(() => {
  return route.path
})

// 切换侧边栏收起展开状态
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 处理一级菜单选择
const handleFirstMenuSelect = (key: string) => {
  // 更新选中的一级菜单，联动左侧菜单栏
  selectedFirstMenu.value = key
  // 保持当前页面不变，不跳转内容页
}

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

  // 初始化检测屏幕尺寸
  checkScreenSize()
  // 监听窗口大小变化
  window.addEventListener('resize', checkScreenSize)
})

// 页面标签相关状态
const openTabs = ref([
  {
    path: '/labor-company/home',
    title: '首页',
    fixed: true
  }
])

// 当前路径
const currentPath = computed(() => {
  return route.path
})

// 右键菜单状态
const showContextMenu = ref(false)
const contextMenuTop = ref(0)
const contextMenuLeft = ref(0)
const currentTab = ref(null)

// 处理菜单选择，添加页面标签
const handleMenuSelect = (key) => {
  const path = key
  const title = getTabTitle(path)
  
  // 检查标签是否已存在
  const existingTab = openTabs.value.find(tab => tab.path === path)
  if (!existingTab) {
    openTabs.value.push({
      path,
      title
    })
  }
}

// 根据路径获取页面标题
const getTabTitle = (path) => {
  const titleMap = {
    '/labor-company/home': '首页',
    '/labor-company/todo': '待办任务',
    '/labor-company/messages': '消息通知',
    '/labor-company/warnings': '预警消息',
    '/labor-company/recruitment': '招聘需求',
    '/labor-company/recruitment/applications': '申请管理',
    '/labor-company/recruitment/history': '招聘历史',
    '/labor-company/workers': '工人列表',
    '/labor-company/workers/profile': '工人档案',
    '/labor-company/workers/transfer': '调动管理',
    '/labor-company/attendance': '考勤记录',
    '/labor-company/attendance/statistics': '考勤统计',
    '/labor-company/attendance/leave': '请假管理',
    '/labor-company/salary': '工资结算',
    '/labor-company/salary/history': '结算历史',
    '/labor-company/salary/settings': '结算设置',
    '/labor-company/departments': '部门列表',
    '/labor-company/departments/create': '创建部门',
    '/labor-company/departments/staff': '部门人员',
    '/labor-company/roles': '角色列表',
    '/labor-company/roles/create': '创建角色',
    '/labor-company/roles/permissions': '权限管理'
  }
  return titleMap[path] || '页面'
}

// 切换页面标签
const switchTab = (tab) => {
  router.push(tab.path)
}

// 关闭页面标签
const closeTab = (tab) => {
  // 固定标签（首页）不能关闭
  if (tab.fixed) {
    return
  }
  
  const index = openTabs.value.findIndex(t => t.path === tab.path)
  if (index > -1) {
    openTabs.value.splice(index, 1)
    
    // 如果关闭的是当前页面，切换到其他页面
    if (tab.path === currentPath.value) {
      if (openTabs.value.length > 0) {
        router.push(openTabs.value[Math.max(0, index - 1)].path)
      } else {
        router.push('/labor-company/home')
      }
    }
  }
}

// 打开右键菜单
const openContextMenu = (event, tab) => {
  currentTab.value = tab
  showContextMenu.value = true
  contextMenuTop.value = event.clientY
  contextMenuLeft.value = event.clientX
  
  // 点击其他地方关闭右键菜单
  setTimeout(() => {
    document.addEventListener('click', closeContextMenu)
  }, 0)
}

// 关闭右键菜单
const closeContextMenu = () => {
  showContextMenu.value = false
  document.removeEventListener('click', closeContextMenu)
}

// 刷新当前页
const refreshCurrentTab = () => {
  // 重新加载当前页面
  router.go(0)
  closeContextMenu()
}

// 关闭当前页
const closeCurrentTab = () => {
  if (currentTab.value) {
    closeTab(currentTab.value)
  }
  closeContextMenu()
}

// 关闭除当前页面外的页面
const closeOtherTabs = () => {
  if (currentTab.value) {
    // 保留固定标签（首页）和当前标签
    openTabs.value = openTabs.value.filter(tab => tab.fixed || tab.path === currentTab.value.path)
  }
  closeContextMenu()
}

// 关闭所有页面
const closeAllTabs = () => {
  // 只保留固定标签（首页）
  openTabs.value = openTabs.value.filter(tab => tab.fixed)
  router.push('/labor-company/home')
  closeContextMenu()
}

// 监听路由变化，确保通过快捷导航跳转时能正确更新4级导航栏和菜单
watch(() => route.path, (newPath) => {
  // 路由变化时，添加页面标签
  const title = getTabTitle(newPath)
  
  // 检查标签是否已存在
  const existingTab = openTabs.value.find(tab => tab.path === newPath)
  if (!existingTab) {
    openTabs.value.push({
      path: newPath,
      title
    })
  }
})

// 组件卸载时清理监听器
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.labor-company-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #FFFFFF;
}

/* 顶部导航栏 */
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding: 0 var(--spacing-xl);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: var(--shadow-sm);
  z-index: var(--z-index-fixed);
  border-bottom: 1px solid var(--color-border-lighter);
  transition: all var(--transition-base);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  flex: 1;
}

/* 顶部菜单容器 */
.top-menu-container {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* 移动端汉堡菜单按钮 */
.mobile-menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-primary);
}

.mobile-menu-toggle:hover {
  background-color: var(--bg-color-hover);
  color: var(--color-primary);
}

.mobile-menu-toggle :deep(.el-icon) {
  font-size: 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.logo-image {
  height: 48px;
  width: auto;
  transition: all var(--transition-fast);
}

.logo-container:hover .logo-image {
  transform: scale(1.05);
}

.logo-text {
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 顶部一级菜单 */
.top-menu {
  background-color: transparent !important;
  border-bottom: none !important;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.top-menu::-webkit-scrollbar {
  display: none;
}

.top-menu {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.top-menu :deep(.el-menu-item) {
  height: var(--header-height);
  line-height: var(--header-height);
  margin: 0 var(--spacing-xs);
  padding: 0 var(--spacing-lg);
  color: var(--color-text-regular);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
}

.top-menu :deep(.el-menu-item::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  transition: width var(--transition-base);
}

.top-menu :deep(.el-menu-item:hover) {
  background-color: var(--bg-color-hover);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.top-menu :deep(.el-menu-item:hover::after) {
  width: 60%;
}

.top-menu :deep(.el-menu-item.is-active) {
  background-color: var(--bg-color-active) !important;
  color: var(--color-primary) !important;
  font-weight: var(--font-weight-bold);
}

.top-menu :deep(.el-menu-item.is-active::after) {
  width: 80%;
}

.top-menu :deep(.el-menu-item .el-icon) {
  margin-right: var(--spacing-sm);
  font-size: 18px;
  transition: transform var(--transition-fast);
}

.top-menu :deep(.el-menu-item:hover .el-icon) {
  transform: scale(1.1);
}

.user-info {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-page);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.user-info:hover {
  background-color: var(--bg-color-hover);
  box-shadow: var(--shadow-sm);
}

.user-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.user-name :deep(.el-icon) {
  transition: transform var(--transition-fast);
}

.user-name:hover :deep(.el-icon) {
  transform: rotate(180deg);
}

/* 主体内容 */
.layout-body {
  display: flex;
  flex: 1;
  background-color: var(--color-bg-page);
}

/* 侧边栏容器 */
.sidebar-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  background: linear-gradient(180deg, var(--color-bg-page) 0%, #f0f2f5 100%);
}

/* 左侧导航栏 */
.layout-sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-color-sidebar);
  border-right: 1px solid var(--color-border-light);
  overflow-y: auto;
  overflow-x: hidden;
  transition: all var(--transition-base);
  min-height: 100%;
  box-shadow: var(--shadow-xs);
}

.layout-sidebar::-webkit-scrollbar {
  width: 4px;
}

.layout-sidebar::-webkit-scrollbar-thumb {
  background: var(--color-border-base);
  border-radius: var(--radius-round);
}

/* 收起状态 */
.layout-sidebar.collapsed {
  width: 60px;
}

/* 收起展开按钮 (位于菜单栏外面) */
.sidebar-toggle {
  position: absolute;
  top: var(--spacing-xl);
  right: -12px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: var(--z-index-dropdown);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.sidebar-toggle:hover {
  transform: scale(1.15) rotate(180deg);
  box-shadow: var(--shadow-lg);
}

.sidebar-toggle:active {
  transform: scale(1.05) rotate(180deg);
}

/* 调整收起状态下的按钮位置 */
.sidebar-toggle.collapsed {
  right: -12px;
  left: auto;
}

/* 调整图标大小和位置 */
.sidebar-toggle :deep(.el-icon) {
  font-size: 14px;
  line-height: 1;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
  padding-top: var(--spacing-xxxl);
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  margin: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  color: var(--color-text-regular);
  font-weight: var(--font-weight-medium);
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: var(--bg-color-hover);
  color: var(--color-primary);
  transform: translateX(4px);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, var(--bg-color-active) 0%, var(--color-primary-extra-light) 100%);
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-sm);
}

.sidebar-menu :deep(.el-menu-item .el-icon),
.sidebar-menu :deep(.el-sub-menu__title .el-icon) {
  margin-right: var(--spacing-md);
  font-size: 16px;
  transition: transform var(--transition-fast);
}

.sidebar-menu :deep(.el-menu-item:hover .el-icon),
.sidebar-menu :deep(.el-sub-menu__title:hover .el-icon) {
  transform: scale(1.1);
}

/* 收起状态下的菜单样式 */
.layout-sidebar.collapsed .sidebar-menu :deep(.el-menu-item) {
  justify-content: center;
  padding: 0;
  margin: var(--spacing-xs) 8px;
}

.layout-sidebar.collapsed .sidebar-menu :deep(.el-menu-item__content) {
  justify-content: center;
  padding: 0;
}

.layout-sidebar.collapsed .sidebar-menu :deep(.el-menu-item__content span) {
  display: none;
}

.layout-sidebar.collapsed .sidebar-menu :deep(.el-menu-item .el-icon) {
  margin-right: 0;
  font-size: 20px;
}

.layout-sidebar.collapsed .sidebar-menu :deep(.el-menu-item:hover) {
  transform: none;
  background-color: var(--bg-color-hover);
}

.layout-sidebar.collapsed .sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, var(--bg-color-active) 0%, var(--color-primary-extra-light) 100%);
}

/* 确保收起状态下的侧边栏有足够空间显示图标 */
.layout-sidebar.collapsed {
  overflow: hidden;
}

.layout-sidebar.collapsed .sidebar-menu {
  padding-top: var(--spacing-xxxl);
}

.layout-sidebar.collapsed .sidebar-menu :deep(.el-menu) {
  width: 100%;
}

/* 内容容器 */
.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-page);
  overflow: hidden;
}

/* 四级导航栏 (页面标签) */
.page-tabs {
  height: var(--page-tabs-height);
  background: linear-gradient(180deg, #ffffff 0%, var(--color-bg-page) 100%);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.page-tabs-scroll {
  display: flex;
  align-items: center;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: var(--spacing-sm);
}

.page-tabs-scroll::-webkit-scrollbar {
  display: none;
}

/* 页面标签 */
.page-tab {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--spacing-lg);
  height: 32px;
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-regular);
  top: 1px;
}

.page-tab:hover {
  background-color: var(--bg-color-hover);
  border-color: var(--color-primary-light);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.page-tab.active {
  background: linear-gradient(135deg, #ffffff 0%, var(--color-bg-page) 100%);
  border-color: var(--color-primary);
  border-bottom-color: #ffffff;
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-sm);
}

.tab-title {
  margin-right: var(--spacing-sm);
  font-size: var(--font-size-small);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

.tab-close {
  font-size: 16px;
  line-height: 1;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 2px;
  border-radius: var(--radius-round);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.tab-close:hover {
  background-color: var(--color-danger);
  color: #ffffff;
  transform: rotate(90deg) scale(1.1);
}

/* 内容区域 */
.layout-content {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
  background-color: var(--color-bg-page);
}

.layout-content::-webkit-scrollbar {
  width: 8px;
}

.layout-content::-webkit-scrollbar-track {
  background: var(--color-bg-page);
}

.layout-content::-webkit-scrollbar-thumb {
  background: var(--color-border-base);
  border-radius: var(--radius-round);
}

.layout-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: 
    var(--shadow-md),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  z-index: var(--z-index-popover);
  min-width: 160px;
  overflow: hidden;
  animation: contextMenuFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  background-color: rgba(255, 255, 255, 0.98);
}

/* 菜单淡入动画 */
@keyframes contextMenuFadeIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 菜单项 */
.menu-item {
  display: flex;
  align-items: center;
  padding: 12px var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-primary);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  transform: scaleY(0);
  transition: transform var(--transition-base);
}

.menu-item:hover {
  background: linear-gradient(90deg, var(--bg-color-active) 0%, var(--color-primary-extra-light) 100%);
  color: var(--color-primary);
  padding-left: 20px;
}

.menu-item:hover::before {
  transform: scaleY(1);
}

/* 菜单图标 */
.menu-item :deep(.el-icon) {
  margin-right: var(--spacing-md);
  font-size: 16px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.menu-item:hover :deep(.el-icon) {
  color: var(--color-primary);
  transform: scale(1.1) rotate(5deg);
}

/* 菜单分隔线 */
.menu-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--color-border-light) 20%, 
    var(--color-border-light) 80%, 
    transparent 100%
  );
  margin: var(--spacing-sm) var(--spacing-md);
  opacity: 0.8;
}

/* 菜单文本 */
.menu-item span {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  line-height: var(--line-height-base);
}

/* 响应式设计 */
/* 移动端适配 (<768px) */
@media screen and (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }

  .layout-sidebar {
    display: none;
  }

  .layout-content {
    padding: var(--spacing-lg);
  }

  .context-menu {
    min-width: 140px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
  }

  .menu-item {
    padding: 10px var(--spacing-md);
    font-size: var(--font-size-small);
  }

  .menu-item:hover {
    padding-left: 16px;
  }

  .menu-item :deep(.el-icon) {
    font-size: 14px;
    width: 16px;
    height: 16px;
    margin-right: var(--spacing-sm);
  }

  .top-menu :deep(.el-menu-item) {
    padding: 0 var(--spacing-md);
    margin: 0 2px;
  }

  .top-menu :deep(.el-menu-item span) {
    display: none;
  }

  .page-tabs {
    padding: 0 var(--spacing-sm);
  }

  .page-tab {
    padding: 0 var(--spacing-md);
    height: 28px;
    font-size: var(--font-size-extra-small);
  }

  .tab-title {
    max-width: 80px;
  }

  .tab-close {
    width: 16px;
    height: 16px;
    font-size: 14px;
  }
}

/* 平板设备适配 (768px - 1024px) */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .context-menu {
    min-width: 150px;
  }

  .menu-item {
    padding: 11px var(--spacing-md);
  }

  .top-menu :deep(.el-menu-item) {
    padding: 0 var(--spacing-md);
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-tab {
    padding: 0 var(--spacing-md);
  }

  .tab-title {
    max-width: 100px;
  }
}

/* 大屏幕优化 (>1440px) */
@media screen and (min-width: 1440px) {
  .layout-header {
    padding: 0 var(--spacing-xxl);
  }

  .logo-text {
    font-size: 20px;
  }

  .top-menu :deep(.el-menu-item) {
    padding: 0 var(--spacing-xl);
  }

  .sidebar-menu :deep(.el-menu-item),
  .sidebar-menu :deep(.el-sub-menu__title) {
    height: 52px;
    line-height: 52px;
    font-size: var(--font-size-medium);
  }

  .page-tabs {
    padding: 0 var(--spacing-xl);
  }

  .page-tab {
    padding: 0 var(--spacing-xl);
    height: 36px;
    font-size: var(--font-size-base);
  }

  .tab-title {
    max-width: 150px;
  }

  .layout-content {
    padding: var(--spacing-xxl);
  }
}

/* 超大屏幕优化 (>1920px) */
@media screen and (min-width: 1920px) {
  .layout-header {
    height: 70px;
  }

  .sidebar-menu :deep(.el-menu-item),
  .sidebar-menu :deep(.el-sub-menu__title) {
    height: 56px;
    line-height: 56px;
  }

  .page-tabs {
    height: 45px;
  }

  .page-tab {
    height: 38px;
  }
}

/* 移动端抽屉菜单样式 */
.mobile-drawer :deep(.el-drawer__body) {
  padding: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.mobile-menu-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.mobile-menu-header .logo-container {
  gap: var(--spacing-sm);
}

.mobile-menu-header .logo-text {
  font-size: var(--font-size-large);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
}

.close-btn:hover {
  background-color: var(--bg-color-hover);
  color: var(--color-primary);
}

.close-btn :deep(.el-icon) {
  font-size: 18px;
}

.mobile-first-menu,
.mobile-second-menu {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.mobile-menu-title {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-xs);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-regular);
  font-weight: var(--font-weight-medium);
}

.mobile-menu-item:hover {
  background-color: var(--bg-color-hover);
  color: var(--color-primary);
  transform: translateX(4px);
}

.mobile-menu-item.active {
  background: linear-gradient(135deg, var(--bg-color-active) 0%, var(--color-primary-extra-light) 100%);
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}

.mobile-menu-item :deep(.el-icon) {
  margin-right: var(--spacing-md);
  font-size: 18px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu-item span {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 深色模式支持(预留) */
@media (prefers-color-scheme: dark) {
  .layout-header {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-bottom-color: #404040;
  }
  
  .layout-sidebar {
    background-color: #1a1a1a;
    border-right-color: #404040;
  }
  
  .sidebar-container {
    background: linear-gradient(180deg, #1a1a1a 0%, #252525 100%);
  }
}
</style>