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
    path: '/tenant/todo',
    title: '待办任务',
    fixed: true
  },
  {
    path: '/tenant/on-duty/entertainment/add',
    title: '新增文娱活动',
    fixed: false
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
      path: '/tenant/todo'
    },
    {
      code: 'messages',
      name: '消息中心',
      icon: 'Bell',
      path: '/tenant/messages'
    },
    {
      code: 'warnings',
      name: '预警信息',
      icon: 'Warning',
      path: '/tenant/warnings'
    }
  ],
  // 招聘管理
  'recruitment': [
    {
      code: 'recruitment-requirement',
      name: '招聘需求',
      icon: 'Document',
      path: '/tenant/recruitment-requirement'
    },
    {
      code: 'resume-management',
      name: '简历管理',
      icon: 'DocumentCopy',
      path: '/tenant/resume-management'
    }
  ],
  // 面试管理
  'interview': [
    {
      code: 'pickup-management',
      name: '接送管理',
      icon: 'Van',
      path: '/tenant/pickup-management'
    },
    {
      code: 'preliminary-interview',
      name: '初步面试',
      icon: 'ChatDotRound',
      path: '/tenant/preliminary-interview'
    },
    {
      code: 'interview-invitation',
      name: '面试邀约',
      icon: 'Message',
      path: '/tenant/interview-invitation'
    },
    {
      code: 'factory-interview',
      name: '工厂面试',
      icon: 'OfficeBuilding',
      path: '/tenant/factory-interview'
    }
  ],
  // 工人管理
  'worker': [
    {
      code: 'worker-info',
      name: '工人信息',
      icon: 'User',
      path: '/tenant/worker-info'
    }
  ],
  // 合同管理
  'contract': [
    {
      code: 'sign-contract',
      name: '签订合同',
      icon: 'EditPen',
      path: '/tenant/sign-contract'
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
          path: '/tenant/on-duty/living-expense'
        },
        {
          code: 'salary',
          name: '工资管理',
          icon: 'Money',
          path: '/tenant/on-duty/salary'
        },
        {
          code: 'claim-management',
          name: '理赔管理',
          icon: 'DocumentChecked',
          path: '/tenant/on-duty/claim'
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
          path: '/tenant/on-duty/communication'
        },
        {
          code: 'entertainment',
          name: '文娱活动',
          icon: 'Trophy',
          path: '/tenant/on-duty/entertainment'
        },
        {
          code: 'registration',
          name: '报名管理',
          icon: 'Edit',
          path: '/tenant/on-duty/registration'
        },
        {
          code: 'publish-news',
          name: '发布资讯',
          icon: 'Promotion',
          path: '/tenant/on-duty/news'
        },
        {
          code: 'club-management',
          name: '社团管理',
          icon: 'UserFilled',
          path: '/tenant/on-duty/community'
        }
      ]
    },
    {
      code: 'special-case',
      name: '特殊情况',
      icon: 'WarningFilled',
      path: '/tenant/special-case'
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
          path: '/tenant/insurance-management'
        },
        {
          code: 'claim-registration',
          name: '参保登记',
          icon: 'EditPen',
          path: '/tenant/claim-registration'
        }
      ]
    },
    {
      code: 'attendance',
      name: '考勤管理',
      icon: 'Clock',
      path: '/tenant/attendance'
    },
    {
      code: 'leave',
      name: '请假管理',
      icon: 'Calendar',
      path: '/tenant/leave'
    },
    {
      code: 'transfer',
      name: '调岗管理',
      icon: 'Sort',
      path: '/tenant/transfer'
    },
    {
      code: 'reward-punishment',
      name: '奖惩管理',
      icon: 'Medal',
      path: '/tenant/reward-punishment'
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
          path: '/tenant/learning-materials'
        },
        {
          code: 'question-bank',
          name: '题库管理',
          icon: 'Notebook',
          path: '/tenant/question-bank'
        },
        {
          code: 'learning-time',
          name: '学习时长管理',
          icon: 'Clock',
          path: '/tenant/learning-time'
        },
        {
          code: 'exam-management',
          name: '考试管理',
          icon: 'EditPen',
          path: '/tenant/exam-management'
        },
        {
          code: 'exam-results',
          name: '考试成绩',
          icon: 'DataAnalysis',
          path: '/tenant/exam-results'
        }
      ]
    },
    {
      code: 'complaint-suggestion',
      name: '投诉/建议',
      icon: 'ChatDotRound',
      path: '/tenant/complaint-suggestion'
    }
  ],
  // 离职管理
  'resignation': [
    {
      code: 'resignation-management',
      name: '离职管理',
      icon: 'RemoveFilled',
      path: '/tenant/resignation-management'
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
          path: '/tenant/referral'
        },
        {
          code: 'commission',
          name: '佣金发放',
          icon: 'Wallet',
          path: '/tenant/commission'
        }
      ]
    },
    {
      code: 'settlement',
      name: '结算管理',
      icon: 'Money',
      path: '/tenant/settlement'
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
          path: '/tenant/company-culture'
        },
        {
          code: 'position-culture',
          name: '岗位文化介绍',
          icon: 'Briefcase',
          path: '/tenant/position-culture'
        }
      ]
    },
    {
      code: 'department',
      name: '部门管理',
      icon: 'FolderOpened',
      path: '/tenant/department'
    },
    {
      code: 'employee',
      name: '正式员工',
      icon: 'UserFilled',
      path: '/tenant/employee'
    },
    {
      code: 'position',
      name: '岗位管理',
      icon: 'Briefcase',
      path: '/tenant/position'
    },
    {
      code: 'rule',
      name: '规则配置',
      icon: 'Setting',
      path: '/tenant/rule'
    },
    {
      code: 'menu',
      name: '菜单配置',
      icon: 'Menu',
      path: '/tenant/menu'
    },
    {
      code: 'dictionary',
      name: '字典管理',
      icon: 'Notebook',
      path: '/tenant/dictionary'
    },
    {
      code: 'system-parameter',
      name: '系统参数',
      icon: 'Tools',
      path: '/tenant/system-parameter'
    },
    {
      code: 'process',
      name: '流程管理',
      icon: 'Connection',
      children: [
        {
          code: 'process-custom',
          name: '流程自定义',
          icon: 'Edit',
          path: '/tenant/process'
        },
        {
          code: 'process-config',
          name: '流程配置',
          icon: 'Operation',
          path: '/tenant/process-config'
        }
      ]
    },
    {
      code: 'attachment',
      name: '附件管理',
      icon: 'Paperclip',
      path: '/tenant/attachment'
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
          path: '/tenant/template-config'
        },
        {
          code: 'print-config',
          name: '打印配置',
          icon: 'Printer',
          path: '/tenant/print-config'
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
  // 从路径中提取基本路径（去除查询参数）
  const basePath = path.split('?')[0]
  console.log('=== 添加或更新标签 ===')
  console.log('原始路径:', path)
  console.log('基本路径:', basePath)
  
  const existingTab = openTabs.value.find(tab => tab.path === basePath)
  console.log('是否存在标签:', existingTab)
  if (existingTab) {
    console.log('现有标签标题:', existingTab.title)
  }

  // 直接使用getPageTitle函数获取标题
  let title = getPageTitle(basePath)
  console.log('从getPageTitle获取到的标题:', title)
  
  // 强制设置文娱活动相关页面的标题
  if (basePath === '/tenant/on-duty/entertainment/add') {
    title = '新增文娱活动'
  } else if (basePath.includes('/tenant/on-duty/entertainment/edit/')) {
    title = '编辑文娱活动'
  } else if (basePath.includes('/tenant/on-duty/entertainment/detail/')) {
    title = '文娱活动详情'
  } else if (basePath === '/tenant/on-duty/entertainment') {
    title = '文娱活动'
  }
  console.log('强制设置后的标题:', title)

  if (existingTab) {
    // 标签已存在，更新标题
    // 使用新对象替换旧对象，确保Vue能够检测到变化
    const index = openTabs.value.findIndex(tab => tab.path === basePath)
    if (index > -1) {
      console.log('更新标签标题:', title)
      openTabs.value.splice(index, 1, {
        ...existingTab,
        title
      })
    }
    return
  }

  // 添加新标签
  console.log('添加新标签:', basePath, title)
  openTabs.value.push({
    path: basePath,
    title,
    fixed: false
  })
  console.log('openTabs数组:', openTabs.value)

  // 滚动到新标签
  setTimeout(() => {
    pageTabsRef.value?.scrollToActiveTab()
  }, 100)
}

// 根据路径获取页面标题
const getPageTitle = (path: string): string => {
  console.log('=== 获取页面标题 ===')
  console.log('路径:', path)
  console.log('是否包含 entertainment/add:', path.includes('entertainment/add'))
  console.log('是否包含 entertainment:', path.includes('entertainment'))
  
  // 处理文娱活动路径
  if (path.includes('entertainment/add')) {
    console.log('返回: 新增文娱活动')
    return '新增文娱活动'
  } else if (path.includes('entertainment/edit/')) {
    console.log('返回: 编辑文娱活动')
    return '编辑文娱活动'
  } else if (path.includes('entertainment/detail/')) {
    console.log('返回: 文娱活动详情')
    return '文娱活动详情'
  } else if (path.includes('entertainment')) {
    console.log('返回: 文娱活动')
    return '文娱活动'
  }
  
  // 特殊处理：常见详情页面
  if (path.includes('/on-duty/living-expense/detail/')) {
    console.log('匹配生活费详情页面')
    return '生活费申请详情'
  } else if (path.includes('/recruitment/detail/')) {
    return '招聘需求详情'
  } else if (path.includes('/recruitment/resume/')) {
    return '简历详情'
  } else if (path.includes('/interview/pickup/')) {
    return '接送详情'
  } else if (path.includes('/interview/initial-interview/')) {
    return '初步面试详情'
  } else if (path.includes('/interview/invitation/')) {
    return '面试邀约详情'
  } else if (path.includes('/interview/factory-interview/')) {
    return '工厂面试详情'
  } else if (path.includes('/contract/')) {
    if (path.includes('/add')) {
      return '新增合同'
    } else if (path.includes('/edit/')) {
      return '编辑合同'
    } else if (path.includes('/detail/')) {
      return '合同详情'
    }
  } else if (path.includes('/workers/')) {
    if (path.includes('/create')) {
      return '新增工人'
    } else if (path.includes('/edit/')) {
      return '编辑工人'
    } else if (path.includes('/transfer')) {
      return '岗位调动'
    } else if (path.includes('/detail/')) {
      return '工人信息详情'
    }
  } else if (path.includes('/on-duty/salary/')) {
    return '工资详情'
  } else if (path.includes('/on-duty/claim/')) {
    return '理赔详情'
  } else if (path.includes('/on-duty/special-case/')) {
    if (path.includes('/form') && !path.includes('/detail/')) {
      if (path.includes('/form/')) {
        return '编辑特殊情况'
      } else {
        return '新增特殊情况'
      }
    } else if (path.includes('/detail/')) {
      return '特殊情况详情'
    } else {
      return '特殊情况管理'
    }
  } else if (path.includes('/on-duty/leave/')) {
    return '请假详情'
  } else if (path.includes('/on-duty/transfer/')) {
    return '调岗详情'
  } else if (path.includes('/on-duty/reward-punishment/')) {
    return '奖惩详情'
  } else if (path.includes('/on-duty/learning-material/')) {
    return '学习材料详情'
  } else if (path.includes('/on-duty/question-bank/')) {
    return '题库详情'
  } else if (path.includes('/on-duty/exam/')) {
    return '考试详情'
  } else if (path.includes('/on-duty/exam-result/')) {
    return '考试成绩详情'
  } else if (path.includes('/on-duty/abnormal/')) {
    return '异常详情'
  } else if (path.includes('/on-duty/complaint/')) {
    return '投诉/建议详情'
  } else if (path.includes('/on-duty/communication/')) {
    return '沟通详情'
  } else if (path.includes('/on-duty/registration/')) {
    return '报名详情'
  } else if (path.includes('/on-duty/news/')) {
    return '资讯详情'
  } else if (path.includes('/on-duty/community/')) {
    return '社团详情'
  } else if (path.includes('/on-duty/insurance/')) {
    if (path.includes('/form') && !path.includes('/detail/')) {
      if (path.includes('/form/')) {
        return '编辑保险'
      } else {
        return '新增保险'
      }
    } else if (path.includes('/detail/')) {
      return '保险详情'
    } else {
      return '保险管理'
    }
  } else if (path.includes('/resignation/')) {
    if (path.includes('/add')) {
      return '新增离职'
    } else if (path.includes('/edit/')) {
      return '编辑离职'
    } else if (path.includes('/detail/')) {
      return '离职详情'
    }
  } else if (path.includes('/settlement/')) {
    if (path.includes('/add')) {
      return '新建结算'
    } else if (path.includes('/edit/')) {
      return '编辑结算'
    } else if (path.includes('/detail/')) {
      return '结算详情'
    }
  } else if (path.includes('/referral/')) {
    if (path.includes('/add')) {
      return '新增转介绍'
    } else if (path.includes('/edit/')) {
      return '编辑转介绍'
    } else if (path.includes('/detail/')) {
      return '转介绍详情'
    }
  } else if (path.includes('/commission/')) {
    return '佣金详情'
  } else if (path.includes('/departments/')) {
    if (path.includes('/add')) {
      return '新增部门'
    } else if (path.includes('/edit/')) {
      return '编辑部门'
    } else if (path.includes('/detail/')) {
      return '部门详情'
    }
  } else if (path.includes('/employees/')) {
    if (path.includes('/add')) {
      return '新增员工'
    } else if (path.includes('/edit/')) {
      return '编辑员工'
    } else if (path.includes('/detail/')) {
      return '员工详情'
    }
  }
  
  // 直接遍历所有路由，找到匹配的路由
  const allRoutes = router.getRoutes()
  
  for (const route of allRoutes) {
    console.log('检查路由:', route.path, '是否匹配:', path)
    // 处理精确匹配
    if (route.path === path) {
      console.log('精确匹配:', route.path)
      if (route.meta?.title) {
        console.log('返回路由标题:', route.meta.title)
        return route.meta.title as string
      }
    }
    // 处理带参数的路由
    if (route.path.includes(':')) {
      // 构建正则表达式
      const pathPattern = route.path.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^${pathPattern}$`)
      if (regex.test(path)) {
        console.log('带参数匹配:', route.path)
        if (route.meta?.title) {
          console.log('返回路由标题:', route.meta.title)
          return route.meta.title as string
        }
      }
    }
  }

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

  return '页面'
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
        router.push('/tenant/todo')
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
  router.push('/tenant/todo')
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
console.log('设置路由监听')
watch(
  () => route.fullPath,
  (newPath) => {
    console.log('路由变化:', newPath)
    // 始终更新或添加标签，确保标题正确
    addOrUpdateTab(newPath)
  },
  { immediate: true }
)

// 手动调用一次，确保标签标题正确
setTimeout(() => {
  console.log('手动调用addOrUpdateTab')
  addOrUpdateTab(route.fullPath)
}, 1000)

// 立即调用一次
console.log('立即调用addOrUpdateTab')
addOrUpdateTab(route.fullPath)

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
