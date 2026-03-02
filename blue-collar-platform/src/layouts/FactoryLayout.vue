<template>
  <div class="factory-layout">
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
      </div>
      <div class="header-right">
        <div class="user-info">
          <el-dropdown>
            <span class="user-name">
              {{ userInfo?.factoryName || '工厂' }}
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
            <span class="logo-text">- 工厂管理</span>
          </div>
          <div class="close-btn" @click="toggleMobileMenu">
            <el-icon><Close /></el-icon>
          </div>
        </div>

        <!-- 移动端菜单 -->
        <div class="mobile-menu-list">
          <div
            v-for="menu in menuItems"
            :key="menu.path"
            class="mobile-menu-item"
            :class="{ 'active': route.path === menu.path }"
            @click="handleMobileMenuClick(menu.path)"
          >
            <el-icon>
              <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.label }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
    
    <!-- 主体内容 -->
    <div class="layout-body">
      <!-- 左侧导航栏 -->
      <div class="sidebar-container">
        <!-- 收起展开按钮 -->
        <div class="sidebar-toggle" @click="toggleSidebar" :class="{ 'collapsed': isSidebarCollapsed }">
          <el-icon>
            <ArrowLeft v-if="!isSidebarCollapsed" />
            <ArrowRight v-else />
          </el-icon>
        </div>
        <aside class="layout-sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
          <el-menu
            :default-active="activeMenu"
            class="sidebar-menu"
            router
            :collapse-transition="false"
            :collapse="isSidebarCollapsed"
            @select="handleMenuSelect"
          >
            <el-menu-item index="/factory/home">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/factory/todo">
              <el-icon><Bell /></el-icon>
              <span>待办任务</span>
            </el-menu-item>
            <el-menu-item index="/factory/messages">
              <el-icon><Bell /></el-icon>
              <span>消息通知</span>
            </el-menu-item>
            <el-menu-item index="/factory/warnings">
              <el-icon><Bell /></el-icon>
              <span>预警消息</span>
            </el-menu-item>
            <el-menu-item index="/factory/recruitment">
              <el-icon><Position /></el-icon>
              <span>招聘管理</span>
            </el-menu-item>
            <el-menu-item index="/factory/workers">
              <el-icon><User /></el-icon>
              <span>工人管理</span>
            </el-menu-item>
            <el-menu-item index="/factory/training">
              <el-icon><Reading /></el-icon>
              <span>岗前培训</span>
            </el-menu-item>
            <el-menu-item index="/factory/salary">
              <el-icon><Money /></el-icon>
              <span>结算管理</span>
            </el-menu-item>
            <el-sub-menu index="system">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>系统管理</span>
              </template>
              <el-sub-menu index="company-introduction">
                <template #title>
                  <el-icon><OfficeBuilding /></el-icon>
                  <span>企业介绍</span>
                </template>
                <el-menu-item index="/factory/company-culture">
                  <el-icon><Document /></el-icon>
                  <span>企业文化介绍</span>
                </el-menu-item>
                <el-menu-item index="/factory/position-culture">
                  <el-icon><Position /></el-icon>
                  <span>岗位文化介绍</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item index="/factory/departments">
                <el-icon><OfficeBuilding /></el-icon>
                <span>部门管理</span>
              </el-menu-item>
              <el-menu-item index="/factory/employees">
                <el-icon><UserFilled /></el-icon>
                <span>正式员工</span>
              </el-menu-item>
              <el-menu-item index="/factory/positions">
                <el-icon><Position /></el-icon>
                <span>岗位管理</span>
              </el-menu-item>
              <el-menu-item index="/factory/rules">
                <el-icon><Document /></el-icon>
                <span>规则配置</span>
              </el-menu-item>
              <el-menu-item index="/factory/menu-config">
                <el-icon><Menu /></el-icon>
                <span>菜单配置</span>
              </el-menu-item>
              <el-menu-item index="/factory/dictionary">
                <el-icon><Notebook /></el-icon>
                <span>字典管理</span>
              </el-menu-item>
              <el-menu-item index="/factory/system-params">
                <el-icon><Cpu /></el-icon>
                <span>系统参数</span>
              </el-menu-item>
              <el-menu-item index="/factory/processes">
                <el-icon><RefreshLeft /></el-icon>
                <span>流程管理</span>
              </el-menu-item>
              <el-menu-item index="/factory/process-config">
                <el-icon><Operation /></el-icon>
                <span>流程配置</span>
              </el-menu-item>
              <el-menu-item index="/factory/attachments">
                <el-icon><Paperclip /></el-icon>
                <span>附件管理</span>
              </el-menu-item>
              <el-menu-item index="/factory/print">
                <el-icon><Printer /></el-icon>
                <span>打印管理</span>
              </el-menu-item>
              <el-menu-item index="/factory/roles">
                <el-icon><Key /></el-icon>
                <span>角色管理</span>
              </el-menu-item>
            </el-sub-menu>
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
import { ArrowDown, Position, User, Reading, Money, OfficeBuilding, Key, ArrowLeft, ArrowRight, Refresh, Close, Menu, House, HomeFilled, Bell, Setting, Document, UserFilled, Notebook, Cpu, RefreshLeft, Operation, Paperclip, Printer } from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()
const route = useRoute()

// 用户信息
const userInfo = ref<any>(null)

// 响应式状态
const isSidebarCollapsed = ref(false)
const isMobile = ref(false)
const mobileMenuVisible = ref(false)
const selectedFirstMenu = ref('work-center')

// 菜单项配置
const menuItems = [
  { path: '/factory/home', label: '首页', icon: HomeFilled },
  { path: '/factory/todo', label: '待办任务', icon: Bell },
  { path: '/factory/messages', label: '消息通知', icon: Bell },
  { path: '/factory/warnings', label: '预警消息', icon: Bell },
  { path: '/factory/recruitment', label: '招聘管理', icon: Position },
  { path: '/factory/workers', label: '工人管理', icon: User },
  { path: '/factory/training', label: '岗前培训', icon: Reading },
  { path: '/factory/salary', label: '结算管理', icon: Money },
  { path: '/factory/company-culture', label: '企业文化介绍', icon: Document },
  { path: '/factory/position-culture', label: '岗位文化介绍', icon: Position },
  { path: '/factory/departments', label: '部门管理', icon: OfficeBuilding },
  { path: '/factory/employees', label: '正式员工', icon: UserFilled },
  { path: '/factory/positions', label: '岗位管理', icon: Position },
  { path: '/factory/rules', label: '规则配置', icon: Document },
  { path: '/factory/menu-config', label: '菜单配置', icon: Menu },
  { path: '/factory/dictionary', label: '字典管理', icon: Notebook },
  { path: '/factory/system-params', label: '系统参数', icon: Cpu },
  { path: '/factory/processes', label: '流程管理', icon: RefreshLeft },
  { path: '/factory/process-config', label: '流程配置', icon: Operation },
  { path: '/factory/attachments', label: '附件管理', icon: Paperclip },
  { path: '/factory/print', label: '打印管理', icon: Printer },
  { path: '/factory/roles', label: '角色管理', icon: Key }
]

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}

// 处理移动端菜单点击
const handleMobileMenuClick = (path: string) => {
  // 移动端菜单点击仍然跳转到对应页面
  router.push(path)
  mobileMenuVisible.value = false
}

// 处理一级菜单选择
const handleFirstMenuSelect = (key: string) => {
  // 更新选中的一级菜单，联动左侧菜单栏
  selectedFirstMenu.value = key
  // 保持当前页面不变，不跳转内容页
}

// 检测屏幕尺寸
const checkScreenSize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
}

// 切换侧边栏收起展开状态
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 计算当前激活的一级菜单
const activeFirstMenu = computed(() => {
  // 优先使用手动选择的一级菜单
  if (selectedFirstMenu.value) return selectedFirstMenu.value
  
  // 否则根据路径自动匹配
  const path = route.path
  if (path.includes('/todo') || path.includes('/messages') || path.includes('/warnings') || path.includes('/home')) return 'work-center'
  if (path.includes('/recruitment')) return 'recruitment'
  if (path.includes('/workers')) return 'workers'
  if (path.includes('/training')) return 'training'
  if (path.includes('/salary')) return 'salary'
  if (path.includes('/departments')) return 'departments'
  if (path.includes('/roles')) return 'roles'
  return 'work-center'
})

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

  // 初始化检测屏幕尺寸
  checkScreenSize()
  // 监听窗口大小变化
  window.addEventListener('resize', checkScreenSize)
})

// 页面标签相关状态
const openTabs = ref([
  {
    path: '/factory/home',
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

// 处理菜单选择,添加页面标签
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
    '/factory/home': '首页',
    '/factory/todo': '待办任务',
    '/factory/messages': '消息通知',
    '/factory/warnings': '预警消息',
    '/factory/recruitment': '招聘管理',
    '/factory/recruitment/detail': '招聘需求详情',
    '/factory/workers': '工人管理',
    '/factory/workers/detail': '工人详情',
    '/factory/training': '岗前培训',
    '/factory/training/detail': '培训详情',
    '/factory/salary': '结算管理',
    '/factory/salary/detail': '结算详情',
    '/factory/company-culture': '企业文化介绍',
    '/factory/position-culture': '岗位文化介绍',
    '/factory/departments': '部门管理',
    '/factory/departments/detail': '部门详情',
    '/factory/employees': '正式员工',
    '/factory/employees/detail': '员工详情',
    '/factory/positions': '岗位管理',
    '/factory/positions/detail': '岗位详情',
    '/factory/rules': '规则配置',
    '/factory/menu-config': '菜单配置',
    '/factory/dictionary': '字典管理',
    '/factory/system-params': '系统参数',
    '/factory/processes': '流程管理',
    '/factory/processes/detail': '流程详情',
    '/factory/process-config': '流程配置',
    '/factory/attachments': '附件管理',
    '/factory/print': '打印管理',
    '/factory/roles': '角色管理',
    '/factory/roles/detail': '角色详情'
  }
  
  // 首先尝试精确匹配
  if (titleMap[path]) {
    return titleMap[path]
  }
  
  // 处理带动态参数的路径
  for (const key in titleMap) {
    if (key.includes(':')) {
      const pathPattern = key.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^${pathPattern}$`)
      if (regex.test(path)) {
        return titleMap[key]
      }
    }
  }
  
  // 处理详情页面路径（如 /path/id）
  const pathParts = path.split('/')
  if (pathParts.length > 2) {
    // 首先尝试匹配父路径 + /detail
    const parentPath = pathParts.slice(0, -1).join('/')
    const detailPath = `${parentPath}/detail`
    if (titleMap[detailPath]) {
      return titleMap[detailPath]
    }
    
    // 检查是否是详情页面（路径最后部分是数字ID或包含detail）
    const lastPart = pathParts[pathParts.length - 1]
    if (!isNaN(lastPart) || lastPart === 'detail') {
      // 尝试从titleMap中找到对应的详情页面标题
      for (const key in titleMap) {
        if (key.includes('/detail')) {
          const keyParentPath = key.substring(0, key.lastIndexOf('/detail'))
          if (parentPath === keyParentPath) {
            return titleMap[key]
          }
        }
      }
    }
    
    // 尝试匹配父路径
    if (titleMap[parentPath]) {
      return titleMap[parentPath]
    }
  }
  
  return '页面'
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
    
    // 如果关闭的是当前页面,切换到其他页面
    if (tab.path === currentPath.value) {
      if (openTabs.value.length > 0) {
        router.push(openTabs.value[Math.max(0, index - 1)].path)
      } else {
        router.push('/factory/home')
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
  router.push('/factory/home')
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
  document.removeEventListener('click', closeContextMenu)
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.factory-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #FFFFFF;
  overflow: hidden;
}

/* 顶部导航栏 */
.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
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
  margin-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
  overflow: hidden;
  background-color: var(--color-bg-page);
}

/* 侧边栏容器 */
.sidebar-container {
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  z-index: var(--z-index-fixed);
  display: flex;
  align-items: flex-start;
  background: linear-gradient(180deg, var(--color-bg-page) 0%, #f0f2f5 100%);
}

/* 左侧导航栏 */
.layout-sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background-color: var(--bg-color-sidebar);
  border-right: 1px solid var(--color-border-light);
  overflow-y: auto;
  overflow-x: hidden;
  transition: all var(--transition-base);
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

/* 收起展开按钮 */
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
  z-index: 9999;
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

.sidebar-toggle.collapsed {
  right: -12px;
  left: auto;
}

.sidebar-toggle :deep(.el-icon) {
  font-size: 14px;
  line-height: 1;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
  padding-top: var(--spacing-xxxl);
}

.sidebar-menu :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  color: var(--color-text-regular);
  font-weight: var(--font-weight-medium);
}

.sidebar-menu :deep(.el-menu-item:hover) {
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

.sidebar-menu :deep(.el-menu-item .el-icon) {
  margin-right: var(--spacing-md);
  font-size: 16px;
  transition: transform var(--transition-fast);
}

.sidebar-menu :deep(.el-menu-item:hover .el-icon) {
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
  margin-left: var(--sidebar-width);
  margin-top: var(--page-tabs-height);
  min-height: calc(100% - var(--page-tabs-height));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-bg-page);
  transition: margin-left var(--transition-base);
}

/* 四级导航栏 (页面标签) */
.page-tabs {
  position: fixed;
  top: var(--header-height);
  left: var(--sidebar-width);
  right: 0;
  z-index: var(--z-index-dropdown);
  height: var(--page-tabs-height);
  background: linear-gradient(180deg, #ffffff 0%, var(--color-bg-page) 100%);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: left var(--transition-base);
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
  background-color: var(--color-bg-page);
}

/* 侧边栏收起时的内容容器 */
.layout-sidebar.collapsed ~ .content-container {
  margin-left: 60px;
}

/* 侧边栏收起时的页面标签栏 */
.layout-sidebar.collapsed ~ .content-container .page-tabs {
  left: 60px;
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

  .sidebar-menu :deep(.el-menu-item) {
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

  .sidebar-menu :deep(.el-menu-item) {
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

.mobile-menu-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
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