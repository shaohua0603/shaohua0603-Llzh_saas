<template>
  <div class="pc-layout">
    <!-- 顶部导航栏 -->
    <TopNavigation
      :user-info="userInfo"
      @menu-select="handleFirstLevelMenuSelect"
    />

    <!-- 主体内容 -->
    <div class="layout-body">
      <!-- 左侧侧边栏 -->
      <Sidebar
        ref="sidebarRef"
        :menus="currentSecondLevelMenus"
        :collapsed="sidebarCollapsed"
        @collapse-change="handleSidebarCollapseChange"
        @menu-select="handleSecondLevelMenuSelect"
      />

      <!-- 右侧内容区域 -->
      <div class="content-container">
        <!-- 四级导航栏 (页面标签) -->
        <PageTabs
          ref="pageTabsRef"
          :tabs="openTabs"
          @tab-click="handleTabClick"
          @tab-close="handleTabClose"
          @refresh="handleTabRefresh"
          @close-others="handleCloseOtherTabs"
          @close-all="handleCloseAllTabs"
          @tab-reorder="handleTabReorder"
        />

        <!-- 内容区域 -->
        <main class="layout-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TopNavigation from './TopNavigation.vue'
import Sidebar from './Sidebar.vue'
import PageTabs from './PageTabs.vue'
import type { FirstLevelMenu, SecondLevelMenu, PageTab, UserInfo } from '../types/menu'

// Props
interface Props {
  userInfo?: UserInfo
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: undefined
})

// 路由实例
const router = useRouter()
const route = useRoute()

// 组件引用
const sidebarRef = ref<InstanceType<typeof Sidebar>>()
const pageTabsRef = ref<InstanceType<typeof PageTabs>>()

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 当前选中的一级菜单
const currentFirstLevelMenu = ref<string>('work-center')

// 打开的页面标签
const openTabs = ref<PageTab[]>([
  {
    path: '/labor-company/todo',
    title: '待办任务',
    fixed: true
  }
])

// 菜单配置
const menuConfig = ref<Record<string, SecondLevelMenu[]>>({
  // 工作中心
  'work-center': [
    {
      code: 'todo',
      name: '待办任务',
      icon: 'List',
      path: '/labor-company/todo'
    },
    {
      code: 'messages',
      name: '消息中心',
      icon: 'Bell',
      path: '/labor-company/messages'
    },
    {
      code: 'warnings',
      name: '预警信息',
      icon: 'Warning',
      path: '/labor-company/warnings'
    }
  ],
  // 招聘管理
  'recruitment': [
    {
      code: 'recruitment-requirement',
      name: '招聘需求',
      icon: 'Document',
      path: '/labor-company/recruitment-requirement'
    },
    {
      code: 'resume-management',
      name: '简历管理',
      icon: 'DocumentCopy',
      path: '/labor-company/resume-management'
    }
  ],
  // 面试管理
  'interview': [
    {
      code: 'pickup-management',
      name: '接送管理',
      icon: 'Van',
      path: '/labor-company/pickup-management'
    },
    {
      code: 'preliminary-interview',
      name: '初步面试',
      icon: 'ChatDotRound',
      path: '/labor-company/preliminary-interview'
    },
    {
      code: 'interview-invitation',
      name: '面试邀约',
      icon: 'Message',
      path: '/labor-company/interview-invitation'
    },
    {
      code: 'factory-interview',
      name: '工厂面试',
      icon: 'OfficeBuilding',
      path: '/labor-company/factory-interview'
    }
  ],
  // 工人管理
  'worker': [
    {
      code: 'worker-info',
      name: '工人信息',
      icon: 'User',
      path: '/labor-company/worker-info'
    }
  ],
  // 合同管理
  'contract': [
    {
      code: 'sign-contract',
      name: '签订合同',
      icon: 'EditPen',
      path: '/labor-company/sign-contract'
    }
  ],
  // 在职管理
  'employment': [
    {
      code: 'work-and-life',
      name: '工作与生活',
      icon: 'Coffee',
      children: [
        {
          code: 'living-expense',
          name: '生活费管理',
          icon: 'Wallet',
          path: '/labor-company/on-duty/living-expense'
        },
        {
          code: 'salary',
          name: '工资管理',
          icon: 'Money',
          path: '/labor-company/on-duty/salary'
        },
        {
          code: 'claim-management',
          name: '理赔管理',
          icon: 'DocumentChecked',
          path: '/labor-company/on-duty/claim'
        }
      ]
    },
    {
      code: 'management-and-care',
      name: '管理与关怀',
      icon: 'Management',
      children: [
        {
          code: 'communication',
          name: '沟通管理',
          icon: 'ChatLineSquare',
          path: '/labor-company/communication'
        },
        {
          code: 'entertainment',
          name: '文娱活动',
          icon: 'Trophy',
          path: '/labor-company/entertainment'
        },
        {
          code: 'registration',
          name: '报名管理',
          icon: 'Edit',
          path: '/labor-company/registration'
        },
        {
          code: 'publish-news',
          name: '发布资讯',
          icon: 'Promotion',
          path: '/labor-company/publish-news'
        },
        {
          code: 'club-management',
          name: '社团管理',
          icon: 'UserFilled',
          path: '/labor-company/club-management'
        }
      ]
    },
    {
      code: 'special-case',
      name: '特殊情况',
      icon: 'WarningFilled',
      path: '/labor-company/special-case'
    },
    {
      code: 'insurance',
      name: '保险管理',
      icon: 'Document',
      children: [
        {
          code: 'insurance-management',
          name: '保险管理',
          icon: 'Document',
          path: '/labor-company/insurance-management'
        },
        {
          code: 'claim-registration',
          name: '参保登记',
          icon: 'EditPen',
          path: '/labor-company/claim-registration'
        }
      ]
    },
    {
      code: 'attendance',
      name: '考勤管理',
      icon: 'Clock',
      path: '/labor-company/attendance'
    },
    {
      code: 'leave',
      name: '请假管理',
      icon: 'Calendar',
      path: '/labor-company/leave'
    },
    {
      code: 'transfer',
      name: '调岗管理',
      icon: 'Sort',
      path: '/labor-company/transfer'
    },
    {
      code: 'reward-punishment',
      name: '奖惩管理',
      icon: 'Medal',
      path: '/labor-company/reward-punishment'
    },
    {
      code: 'business-classroom',
      name: '业务课堂',
      icon: 'Reading',
      children: [
        {
          code: 'learning-materials',
          name: '学习材料',
          icon: 'Document',
          path: '/labor-company/learning-materials'
        },
        {
          code: 'question-bank',
          name: '题库管理',
          icon: 'Notebook',
          path: '/labor-company/question-bank'
        },
        {
          code: 'learning-time',
          name: '学习时长管理',
          icon: 'Clock',
          path: '/labor-company/learning-time'
        },
        {
          code: 'exam-management',
          name: '考试管理',
          icon: 'EditPen',
          path: '/labor-company/exam-management'
        },
        {
          code: 'exam-results',
          name: '考试成绩',
          icon: 'DataAnalysis',
          path: '/labor-company/exam-results'
        }
      ]
    },
    {
      code: 'complaint-suggestion',
      name: '投诉/建议',
      icon: 'ChatDotRound',
      path: '/labor-company/complaint-suggestion'
    }
  ],
  // 离职管理
  'resignation': [
    {
      code: 'resignation-management',
      name: '离职管理',
      icon: 'RemoveFilled',
      path: '/labor-company/resignation-management'
    }
  ],
  // 结算管理
  'settlement': [
    {
      code: 'work-referral',
      name: '工作转介绍',
      icon: 'Share',
      children: [
        {
          code: 'referral',
          name: '工作转介绍',
          icon: 'Share',
          path: '/labor-company/referral'
        },
        {
          code: 'commission',
          name: '佣金发放',
          icon: 'Wallet',
          path: '/labor-company/commission'
        }
      ]
    },
    {
      code: 'settlement',
      name: '结算管理',
      icon: 'Money',
      path: '/labor-company/settlement'
    }
  ],
  // 系统管理
  'system': [
    {
      code: 'company-intro',
      name: '企业介绍',
      icon: 'OfficeBuilding',
      children: [
        {
          code: 'company-culture',
          name: '企业文化介绍',
          icon: 'Reading',
          path: '/labor-company/company-culture'
        },
        {
          code: 'position-culture',
          name: '岗位文化介绍',
          icon: 'Briefcase',
          path: '/labor-company/position-culture'
        }
      ]
    },
    {
      code: 'department',
      name: '部门管理',
      icon: 'FolderOpened',
      path: '/labor-company/department'
    },
    {
      code: 'employee',
      name: '正式员工',
      icon: 'UserFilled',
      path: '/labor-company/employee'
    },
    {
      code: 'position',
      name: '岗位管理',
      icon: 'Briefcase',
      path: '/labor-company/position'
    },
    {
      code: 'rule',
      name: '规则配置',
      icon: 'Setting',
      path: '/labor-company/rule'
    },
    {
      code: 'menu',
      name: '菜单配置',
      icon: 'Menu',
      path: '/labor-company/menu'
    },
    {
      code: 'dictionary',
      name: '字典管理',
      icon: 'Notebook',
      path: '/labor-company/dictionary'
    },
    {
      code: 'system-parameter',
      name: '系统参数',
      icon: 'Tools',
      path: '/labor-company/system-parameter'
    },
    {
      code: 'process',
      name: '流程管理',
      icon: 'Connection',
      path: '/labor-company/process'
    },
    {
      code: 'process-config',
      name: '流程配置',
      icon: 'Operation',
      path: '/labor-company/process-config'
    },
    {
      code: 'attachment',
      name: '附件管理',
      icon: 'Paperclip',
      path: '/labor-company/attachment'
    },
    {
      code: 'print',
      name: '打印管理',
      icon: 'Printer',
      children: [
        {
          code: 'template-config',
          name: '模版配置',
          icon: 'Document',
          path: '/labor-company/template-config'
        },
        {
          code: 'print-config',
          name: '打印配置',
          icon: 'Printer',
          path: '/labor-company/print-config'
        }
      ]
    }
  ]
})

// 当前二级菜单
const currentSecondLevelMenus = computed(() => {
  return menuConfig.value[currentFirstLevelMenu.value] || []
})

// 处理一级菜单选择
const handleFirstLevelMenuSelect = (code: string) => {
  currentFirstLevelMenu.value = code

  // 切换到该一级菜单下的第一个页面
  const menus = menuConfig.value[code]
  if (menus && menus.length > 0) {
    const firstMenu = menus[0]
    const path = firstMenu.path || (firstMenu.children && firstMenu.children[0]?.path)
    if (path) {
      router.push(path)
    }
  }
}

// 处理二级菜单选择
const handleSecondLevelMenuSelect = (path: string) => {
  // 添加或更新页面标签
  addOrUpdateTab(path)
}

// 添加或更新页面标签
const addOrUpdateTab = (path: string) => {
  const existingTab = openTabs.value.find(tab => tab.path === path)

  if (existingTab) {
    // 标签已存在，不需要添加
    return
  }

  // 根据路径获取页面标题
  const title = getPageTitle(path)

  // 添加新标签
  openTabs.value.push({
    path,
    title,
    fixed: false
  })

  // 滚动到新标签
  setTimeout(() => {
    pageTabsRef.value?.scrollToActiveTab()
  }, 100)
}

// 根据路径获取页面标题
const getPageTitle = (path: string): string => {
  // 处理详情页面路径（如 /path/id）
  const pathParts = path.split('/')
  if (pathParts.length > 2) {
    // 检查是否是详情页面（路径最后部分是数字ID或包含detail）
    const lastPart = pathParts[pathParts.length - 1]
    if (!isNaN(lastPart) || lastPart === 'detail') {
      const parentPath = pathParts.slice(0, -1).join('/')
      const detailPath = `${parentPath}/detail`
      
      // 遍历菜单配置查找详情页面标题
      for (const firstLevelCode in menuConfig.value) {
        const menus = menuConfig.value[firstLevelCode]
        for (const menu of menus) {
          if (menu.path === detailPath) {
            return menu.name
          }
          if (menu.children) {
            for (const submenu of menu.children) {
              if (submenu.path === detailPath) {
                return submenu.name
              }
            }
          }
        }
      }
    }
  }

  // 遍历所有菜单配置
  for (const firstLevelCode in menuConfig.value) {
    const menus = menuConfig.value[firstLevelCode]
    for (const menu of menus) {
      // 精确匹配
      if (menu.path === path) {
        return menu.name
      }
      // 处理带参数的路径（如 /path/:id）
      if (menu.path.includes(':')) {
        const pathPattern = menu.path.replace(/:\w+/g, '[^/]+')
        const regex = new RegExp(`^${pathPattern}$`)
        if (regex.test(path)) {
          return menu.name
        }
      }
      // 处理子菜单
      if (menu.children) {
        for (const submenu of menu.children) {
          // 精确匹配
          if (submenu.path === path) {
            return submenu.name
          }
          // 处理带参数的子菜单路径
          if (submenu.path.includes(':')) {
            const pathPattern = submenu.path.replace(/:\w+/g, '[^/]+')
            const regex = new RegExp(`^${pathPattern}$`)
            if (regex.test(path)) {
              return submenu.name
            }
          }
        }
      }
    }
  }

  // 从路由元信息获取标题
  const matchedRoute = router.getRoutes().find(r => {
    if (r.path === path) {
      return true
    }
    // 处理带参数的路由
    if (r.path.includes(':')) {
      const pathPattern = r.path.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^${pathPattern}$`)
      return regex.test(path)
    }
    return false
  })
  return matchedRoute?.meta?.title as string || '页面'
}

// 处理标签点击
const handleTabClick = (tab: PageTab) => {
  router.push(tab.path)
}

// 处理标签关闭
const handleTabClose = (tab: PageTab) => {
  // 固定标签不能关闭
  if (tab.fixed) {
    return
  }

  const index = openTabs.value.findIndex(t => t.path === tab.path)
  if (index > -1) {
    openTabs.value.splice(index, 1)

    // 如果关闭的是当前页面，切换到其他页面
    if (tab.path === route.path) {
      if (openTabs.value.length > 0) {
        const nextTab = openTabs.value[Math.max(0, index - 1)]
        router.push(nextTab.path)
      } else {
        // 如果没有其他标签，跳转到首页
        router.push('/labor-company/todo')
      }
    }
  }
}

// 处理标签刷新
const handleTabRefresh = (tab: PageTab) => {
  if (tab.path === route.path) {
    router.go(0)
  }
}

// 关闭其他标签
const handleCloseOtherTabs = (tab: PageTab) => {
  // 保留固定标签和当前标签
  openTabs.value = openTabs.value.filter(t => t.fixed || t.path === tab.path)
}

// 关闭所有标签
const handleCloseAllTabs = () => {
  // 只保留固定标签
  openTabs.value = openTabs.value.filter(tab => tab.fixed)
  router.push('/labor-company/todo')
}

// 处理标签重新排序
const handleTabReorder = (tabs: PageTab[]) => {
  openTabs.value = tabs
}

// 处理侧边栏折叠状态变化
const handleSidebarCollapseChange = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
}

// 监听路由变化，自动添加标签
watch(
  () => route.path,
  (newPath) => {
    // 检查是否需要添加标签
    const existingTab = openTabs.value.find(tab => tab.path === newPath)
    if (!existingTab) {
      addOrUpdateTab(newPath)
    }
  },
  { immediate: true }
)

// 初始化
onMounted(() => {
  // 根据当前路由设置一级菜单
  const path = route.path
  if (path.includes('/todo') || path.includes('/messages') || path.includes('/warnings')) {
    currentFirstLevelMenu.value = 'work-center'
  } else if (path.includes('/recruitment-requirement') || path.includes('/resume-management')) {
    currentFirstLevelMenu.value = 'recruitment'
  } else if (path.includes('/pickup-management') || path.includes('/preliminary-interview') || path.includes('/interview-invitation') || path.includes('/factory-interview')) {
    currentFirstLevelMenu.value = 'interview'
  } else if (path.includes('/worker-info')) {
    currentFirstLevelMenu.value = 'worker'
  } else if (path.includes('/sign-contract')) {
    currentFirstLevelMenu.value = 'contract'
  } else if (path.includes('/on-duty') || path.includes('/communication') || path.includes('/entertainment') || path.includes('/registration') || path.includes('/publish-news') || path.includes('/club-management') || path.includes('/special-case') || path.includes('/insurance-management') || path.includes('/claim-registration') || path.includes('/attendance') || path.includes('/leave') || path.includes('/transfer') || path.includes('/reward-punishment') || path.includes('/learning-materials') || path.includes('/question-bank') || path.includes('/learning-time') || path.includes('/exam-management') || path.includes('/exam-results') || path.includes('/complaint-suggestion')) {
    currentFirstLevelMenu.value = 'employment'
  } else if (path.includes('/resignation-management')) {
    currentFirstLevelMenu.value = 'resignation'
  } else if (path.includes('/referral') || path.includes('/commission') || path.includes('/settlement')) {
    currentFirstLevelMenu.value = 'settlement'
  } else if (path.includes('/company-culture') || path.includes('/position-culture') || path.includes('/department') || path.includes('/employee') || path.includes('/position') || path.includes('/rule') || path.includes('/menu') || path.includes('/dictionary') || path.includes('/system-parameter') || path.includes('/process') || path.includes('/process-config') || path.includes('/attachment') || path.includes('/template-config') || path.includes('/print-config')) {
    currentFirstLevelMenu.value = 'system'
  }
})

// 暴露方法
defineExpose({
  toggleSidebar: () => {
    sidebarRef.value?.toggleCollapse()
  },
  setSidebarCollapsed: (collapsed: boolean) => {
    sidebarRef.value?.setCollapse(collapsed)
  }
})
</script>

<style scoped>
.pc-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  background-color: var(--color-bg-page, #f5f7fa);
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-bg-page, #f5f7fa);
}

.layout-content {
  flex: 1;
  padding: var(--spacing-xl, 20px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--color-bg-page, #f5f7fa);
}

.layout-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.layout-content::-webkit-scrollbar-track {
  background: var(--color-bg-page, #f5f7fa);
}

.layout-content::-webkit-scrollbar-thumb {
  background: var(--color-border-base, #dcdfe6);
  border-radius: var(--radius-round, 50%);
}

.layout-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary, #909399);
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式设计 */
@media screen and (max-width: 1440px) {
  .layout-content {
    padding: var(--spacing-lg, 16px);
  }
}

@media screen and (max-width: 768px) {
  .layout-content {
    padding: var(--spacing-md, 12px);
  }
}
</style>
