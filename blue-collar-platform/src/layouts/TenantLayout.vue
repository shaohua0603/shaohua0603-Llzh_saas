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
            :ellipsis="true"
          >
            <el-menu-item index="work-center">
              <el-icon><Bell /></el-icon>
              <span>工作中心</span>
            </el-menu-item>
            <el-menu-item index="recruitment">
              <el-icon><Position /></el-icon>
              <span>招聘管理</span>
            </el-menu-item>
            <el-menu-item index="interview">
              <el-icon><ChatDotRound /></el-icon>
              <span>面试管理</span>
            </el-menu-item>
            <el-menu-item index="workers">
              <el-icon><User /></el-icon>
              <span>工人管理</span>
            </el-menu-item>
            <el-menu-item index="contract">
              <el-icon><Document /></el-icon>
              <span>合同管理</span>
            </el-menu-item>
            <el-menu-item index="employment">
              <el-icon><Management /></el-icon>
              <span>在职管理</span>
            </el-menu-item>
            <el-menu-item index="resignation">
              <el-icon><RemoveFilled /></el-icon>
              <span>离职管理</span>
            </el-menu-item>
            <el-menu-item index="settlement">
              <el-icon><Wallet /></el-icon>
              <span>结算管理</span>
            </el-menu-item>
            <el-menu-item index="system">
              <el-icon><Tools /></el-icon>
              <span>系统管理</span>
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
      <!-- 侧边栏容器 -->
      <div class="sidebar-container" :class="{ 'collapsed': isSidebarCollapsed }">
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
          :collapse-transition="false"
          :collapse="isSidebarCollapsed"
          @select="handleMenuSelect"
        >
          <!-- 工作中心二级菜单 -->
          <template v-if="activeFirstMenu === 'work-center'">
            <el-menu-item index="/tenant/todo">
              <el-icon><Bell /></el-icon>
              <span>待办任务</span>
            </el-menu-item>
            <el-menu-item index="/tenant/messages">
              <el-icon><Bell /></el-icon>
              <span>消息通知</span>
            </el-menu-item>
            <el-menu-item index="/tenant/warnings">
              <el-icon><Bell /></el-icon>
              <span>预警消息</span>
            </el-menu-item>
          </template>
          
          <!-- 招聘管理二级菜单 -->
          <template v-if="activeFirstMenu === 'recruitment'">
            <el-menu-item index="/tenant/recruitment">
              <el-icon><Connection /></el-icon>
              <span>招聘需求</span>
            </el-menu-item>
            <el-menu-item index="/tenant/recruitment/resume">
              <el-icon><Document /></el-icon>
              <span>简历管理</span>
            </el-menu-item>
          </template>
          
          <!-- 面试管理二级菜单 -->
          <template v-if="activeFirstMenu === 'interview'">
            <el-menu-item index="/tenant/interview/pickup">
              <el-icon><Van /></el-icon>
              <span>接送管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/interview/initial-interview">
              <el-icon><ChatDotRound /></el-icon>
              <span>初步面试</span>
            </el-menu-item>
            <el-menu-item index="/tenant/interview/invitation">
              <el-icon><Bell /></el-icon>
              <span>面试邀约</span>
            </el-menu-item>
            <el-menu-item index="/tenant/interview/factory-interview">
              <el-icon><OfficeBuilding /></el-icon>
              <span>工厂面试</span>
            </el-menu-item>
          </template>
          
          <!-- 工人管理二级菜单 -->
          <template v-if="activeFirstMenu === 'workers'">
            <el-menu-item index="/tenant/workers">
              <el-icon><List /></el-icon>
              <span>工人信息</span>
            </el-menu-item>
          </template>
          
          <!-- 合同管理二级菜单 -->
          <template v-if="activeFirstMenu === 'contract'">
            <el-menu-item index="/tenant/contract">
              <el-icon><Document /></el-icon>
              <span>签订合同</span>
            </el-menu-item>
          </template>
          
          <!-- 在职管理二级菜单 -->
          <template v-if="activeFirstMenu === 'employment'">
            <el-sub-menu index="work-and-life">
              <template #title>
                <el-icon><Coffee /></el-icon>
                <span>工作与生活</span>
              </template>
              <el-menu-item index="/tenant/on-duty/living-expense">
                <el-icon><Wallet /></el-icon>
                <span>生活费管理</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/salary">
                <el-icon><Money /></el-icon>
                <span>工资管理</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/claim">
                <el-icon><DocumentChecked /></el-icon>
                <span>理赔管理</span>
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="management-and-care">
              <template #title>
                <el-icon><Management /></el-icon>
                <span>管理与关怀</span>
              </template>
              <el-menu-item index="/tenant/on-duty/communication">
                <el-icon><ChatLineSquare /></el-icon>
                <span>沟通管理</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/entertainment">
                <el-icon><Trophy /></el-icon>
                <span>文娱活动</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/registration">
                <el-icon><Edit /></el-icon>
                <span>报名管理</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/news">
                <el-icon><Promotion /></el-icon>
                <span>发布资讯</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/community">
                <el-icon><UserFilled /></el-icon>
                <span>社团管理</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/tenant/on-duty/special-case">
              <el-icon><WarningFilled /></el-icon>
              <span>特殊情况管理</span>
            </el-menu-item>
            <el-sub-menu index="insurance">
              <template #title>
                <el-icon><Document /></el-icon>
                <span>保险管理</span>
              </template>
              <el-menu-item index="/tenant/on-duty/insurance">
                <el-icon><Document /></el-icon>
                <span>保险管理</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/insurance-record">
                <el-icon><EditPen /></el-icon>
                <span>参保登记</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/tenant/attendance">
              <el-icon><Check /></el-icon>
              <span>考勤管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/on-duty/leave">
              <el-icon><Calendar /></el-icon>
              <span>请假管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/on-duty/transfer">
              <el-icon><Sort /></el-icon>
              <span>调岗管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/on-duty/reward-punishment">
              <el-icon><Medal /></el-icon>
              <span>奖惩管理</span>
            </el-menu-item>
            <el-sub-menu index="business-classroom">
              <template #title>
                <el-icon><Reading /></el-icon>
                <span>业务课堂</span>
              </template>
              <el-menu-item index="/tenant/on-duty/learning-material">
                <el-icon><Document /></el-icon>
                <span>学习材料</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/question-bank">
                <el-icon><Notebook /></el-icon>
                <span>题库管理</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/learning-time">
                <el-icon><Clock /></el-icon>
                <span>学习时长管理</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/exam">
                <el-icon><EditPen /></el-icon>
                <span>考试管理</span>
              </el-menu-item>
              <el-menu-item index="/tenant/on-duty/exam-result">
                <el-icon><DataAnalysis /></el-icon>
                <span>考试成绩</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/tenant/on-duty/abnormal">
              <el-icon><Warning /></el-icon>
              <span>异常管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/on-duty/complaint">
              <el-icon><ChatDotRound /></el-icon>
              <span>投诉/建议</span>
            </el-menu-item>
          </template>
          
          <!-- 离职管理二级菜单 -->
          <template v-if="activeFirstMenu === 'resignation'">
            <el-menu-item index="/tenant/resignation">
              <el-icon><RemoveFilled /></el-icon>
              <span>离职管理</span>
            </el-menu-item>
          </template>
          
          <!-- 结算管理二级菜单 -->
          <template v-if="activeFirstMenu === 'settlement'">
            <el-sub-menu index="work-referral">
              <template #title>
                <el-icon><Share /></el-icon>
                <span>工作转介绍</span>
              </template>
              <el-menu-item index="/tenant/referral">
                <el-icon><Share /></el-icon>
                <span>工作转介绍</span>
              </el-menu-item>
              <el-menu-item index="/tenant/commission">
                <el-icon><Wallet /></el-icon>
                <span>佣金发放</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/tenant/settlement">
              <el-icon><Money /></el-icon>
              <span>结算管理</span>
            </el-menu-item>
          </template>
          
          <!-- 系统管理二级菜单 -->
          <template v-if="activeFirstMenu === 'system'">
            <el-sub-menu index="company-introduction">
              <template #title>
                <el-icon><OfficeBuilding /></el-icon>
                <span>企业介绍</span>
              </template>
              <el-menu-item index="/tenant/company-culture">
                <el-icon><Document /></el-icon>
                <span>企业文化介绍</span>
              </el-menu-item>
              <el-menu-item index="/tenant/position-culture">
                <el-icon><PositionIcon /></el-icon>
                <span>岗位文化介绍</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/tenant/departments">
              <el-icon><FolderOpened /></el-icon>
              <span>部门管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/employees">
              <el-icon><UserSolid /></el-icon>
              <span>正式员工</span>
            </el-menu-item>
            <el-menu-item index="/tenant/positions">
              <el-icon><PositionIcon /></el-icon>
              <span>岗位管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/rules">
              <el-icon><DocumentIcon /></el-icon>
              <span>规则配置</span>
            </el-menu-item>
            <el-menu-item index="/tenant/menu-config">
              <el-icon><MenuIcon /></el-icon>
              <span>菜单配置</span>
            </el-menu-item>
            <el-menu-item index="/tenant/dictionary">
              <el-icon><ListIcon /></el-icon>
              <span>字典管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/system-parameter">
              <el-icon><Parameter /></el-icon>
              <span>系统参数</span>
            </el-menu-item>
            <el-menu-item index="/tenant/process">
              <el-icon><Operation /></el-icon>
              <span>流程管理</span>
            </el-menu-item>
            <el-menu-item index="/tenant/process-config">
              <el-icon><SettingIcon /></el-icon>
              <span>流程配置</span>
            </el-menu-item>
            <el-menu-item index="/tenant/attachment">
              <el-icon><File /></el-icon>
              <span>附件管理</span>
            </el-menu-item>
            <el-sub-menu index="print-management">
              <template #title>
                <el-icon><Printer /></el-icon>
                <span>打印管理</span>
              </template>
              <el-menu-item index="/tenant/template-config">
                <el-icon><DocumentIcon /></el-icon>
                <span>模版配置</span>
              </el-menu-item>
              <el-menu-item index="/tenant/print-config">
                <el-icon><Printer /></el-icon>
                <span>打印配置</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/tenant/roles">
              <el-icon><Key /></el-icon>
              <span>角色管理</span>
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
  Bell,
  Van,
  ChatDotRound,
  Management,
  RemoveFilled,
  Wallet,
  Tools,
  DocumentChecked,
  ChatLineSquare,
  Trophy,
  Promotion,
  WarningFilled,
  EditPen,
  Sort,
  Medal,
  Notebook,
  Clock,
  Warning,
  Share,
  FolderOpened,
  Coffee,
  Cpu,
  Reading,
  UserFilled as UserSolid,
  Position as PositionIcon,
  Document as DocumentIcon,
  Setting as SettingIcon,
  Menu as MenuIcon,
  List as ListIcon,
  Cpu as Parameter,
  Operation,
  Document as File,
  Printer
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
  { key: 'interview', label: '面试管理', icon: ChatDotRound },
  { key: 'workers', label: '工人管理', icon: User },
  { key: 'contract', label: '合同管理', icon: Document },
  { key: 'employment', label: '在职管理', icon: Management },
  { key: 'resignation', label: '离职管理', icon: RemoveFilled },
  { key: 'settlement', label: '结算管理', icon: Wallet },
  { key: 'system', label: '系统管理', icon: Tools }
]

// 二级菜单配置
const secondMenus = {
  'work-center': [
    { path: '/tenant/todo', label: '待办任务', icon: Bell },
    { path: '/tenant/messages', label: '消息通知', icon: Bell },
    { path: '/tenant/warnings', label: '预警消息', icon: Bell }
  ],
  home: [
    { path: '/tenant/home', label: '首页', icon: HomeFilled }
  ],
  recruitment: [
    { path: '/tenant/recruitment', label: '招聘需求', icon: Connection },
    { path: '/tenant/recruitment/resume', label: '简历管理', icon: Document }
  ],
  interview: [
    { path: '/tenant/interview/pickup', label: '接送管理', icon: Van },
    { path: '/tenant/interview/initial-interview', label: '初步面试', icon: ChatDotRound },
    { path: '/tenant/interview/invitation', label: '面试邀约', icon: Bell },
    { path: '/tenant/interview/factory-interview', label: '工厂面试', icon: OfficeBuilding }
  ],
  workers: [
    { path: '/tenant/workers', label: '工人信息', icon: List },
    { path: '/tenant/workers/:id', label: '工人信息详情', icon: Avatar }
  ],
  contract: [
    { path: '/tenant/contract', label: '签订合同', icon: Document }
  ],
  employment: [
    { path: '/tenant/on-duty/living-expense', label: '生活费管理', icon: Wallet },
    { path: '/tenant/on-duty/salary', label: '工资管理', icon: Money },
    { path: '/tenant/on-duty/claim', label: '理赔管理', icon: DocumentChecked },
    { path: '/tenant/on-duty/communication', label: '沟通管理', icon: ChatLineSquare },
    { path: '/tenant/on-duty/entertainment', label: '文娱活动', icon: Trophy },
    { path: '/tenant/on-duty/registration', label: '报名管理', icon: Edit },
    { path: '/tenant/on-duty/news', label: '发布资讯', icon: Promotion },
    { path: '/tenant/on-duty/community', label: '社团管理', icon: UserFilled },
    { path: '/tenant/on-duty/special-case', label: '特殊情况管理', icon: WarningFilled },
    { path: '/tenant/on-duty/insurance', label: '保险管理', icon: Document },
    { path: '/tenant/on-duty/insurance-record', label: '参保登记', icon: EditPen },
    { path: '/tenant/attendance', label: '考勤管理', icon: Check },
    { path: '/tenant/on-duty/leave', label: '请假管理', icon: Calendar },
    { path: '/tenant/on-duty/transfer', label: '调岗管理', icon: Sort },
    { path: '/tenant/on-duty/reward-punishment', label: '奖惩管理', icon: Medal },
    { path: '/tenant/on-duty/learning-material', label: '学习材料', icon: Document },
    { path: '/tenant/on-duty/question-bank', label: '题库管理', icon: Notebook },
    { path: '/tenant/on-duty/learning-time', label: '学习时长管理', icon: Clock },
    { path: '/tenant/on-duty/exam', label: '考试管理', icon: EditPen },
    { path: '/tenant/on-duty/exam-result', label: '考试成绩', icon: DataAnalysis },
    { path: '/tenant/on-duty/abnormal', label: '异常管理', icon: Warning },
    { path: '/tenant/on-duty/complaint', label: '投诉/建议', icon: ChatDotRound }
  ],
  resignation: [
    { path: '/tenant/resignation', label: '离职管理', icon: RemoveFilled }
  ],
  settlement: [
    { path: '/tenant/referral', label: '工作转介绍', icon: Share },
    { path: '/tenant/commission', label: '佣金发放', icon: Wallet },
    { path: '/tenant/settlement', label: '结算管理', icon: Money }
  ],
  system: [
    { path: '/tenant/company-culture', label: '企业文化介绍', icon: Document },
    { path: '/tenant/position-culture', label: '岗位文化介绍', icon: PositionIcon },
    { path: '/tenant/departments', label: '部门管理', icon: FolderOpened },
    { path: '/tenant/employees', label: '正式员工', icon: UserSolid },
    { path: '/tenant/positions', label: '岗位管理', icon: PositionIcon },
    { path: '/tenant/rules', label: '规则配置', icon: DocumentIcon },
    { path: '/tenant/menu-config', label: '菜单配置', icon: MenuIcon },
    { path: '/tenant/dictionary', label: '字典管理', icon: ListIcon },
    { path: '/tenant/system-parameter', label: '系统参数', icon: Parameter },
    { path: '/tenant/process', label: '流程管理', icon: Operation },
    { path: '/tenant/process-config', label: '流程配置', icon: SettingIcon },
    { path: '/tenant/attachment', label: '附件管理', icon: File },
    { path: '/tenant/template-config', label: '模版配置', icon: DocumentIcon },
    { path: '/tenant/print-config', label: '打印配置', icon: Printer },
    { path: '/tenant/roles', label: '角色管理', icon: Key }
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

  // 简化逻辑：在非移动设备上始终显示菜单文本
  // 只在移动设备上隐藏文本
  showMenuText.value = !isMobile.value

  const headerElement = document.querySelector('.layout-header')
  if (headerElement) {
    headerWidth.value = headerElement.clientWidth
  }
}

// 检测导航栏宽度并更新菜单显示状态
const checkHeaderWidth = () => {
  const headerElement = document.querySelector('.layout-header')
  if (headerElement) {
    headerWidth.value = headerElement.clientWidth
  }
}

// 计算当前激活的一级菜单
const activeFirstMenu = computed(() => {
  // 优先使用手动选择的一级菜单
  if (selectedFirstMenu.value) return selectedFirstMenu.value
  
  // 否则根据路径自动匹配，确保路由变化时菜单能正确切换
  const path = route.path
  console.log('Current path:', path)
  if (path.includes('/todo') || path.includes('/messages') || path.includes('/warnings') || path.includes('/home')) return 'work-center'
  if (path.includes('/recruitment')) return 'recruitment'
  if (path.includes('/interview')) return 'interview'
  if (path.includes('/workers')) return 'workers'
  if (path.includes('/contract')) return 'contract'
  if (path.includes('/on-duty') || path.includes('/attendance')) return 'employment'
  if (path.includes('/resignation')) return 'resignation'
  if (path.includes('/referral') || path.includes('/commission') || path.includes('/settlement')) return 'settlement'
  if (path.includes('/departments') || path.includes('/roles') || path.includes('/company-culture') || path.includes('/position-culture') || path.includes('/employees') || path.includes('/positions') || path.includes('/rules') || path.includes('/menu-config') || path.includes('/dictionary') || path.includes('/system-parameter') || path.includes('/process') || path.includes('/process-config') || path.includes('/attachment') || path.includes('/template-config') || path.includes('/print-config')) return 'system'
  console.log('Defaulting to work-center')
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
  // 设置当前选中的一级菜单
  selectedFirstMenu.value = key
  // 根据新规范：选中一级菜单时只显示对应的二级菜单，不默认展示内容页面
  // 移除导航到默认页面的逻辑
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
    path: '/tenant/home',
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

// 处理菜单选择，添加页面标签并跳转
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
  
  // 执行路由跳转
  router.push(path)
}

// 根据路径获取页面标题
const getTabTitle = (path) => {
  const titleMap = {
    '/tenant/home': '首页',
    '/tenant/todo': '待办任务',
    '/tenant/messages': '消息通知',
    '/tenant/warnings': '预警消息',
    '/tenant/recruitment': '招聘管理',
    '/tenant/recruitment/detail/:id': '招聘需求详情',
    '/tenant/recruitment/add': '新增招聘需求',
    '/tenant/recruitment/edit/:id': '编辑招聘需求',
    '/tenant/recruitment/resume': '简历管理',
    '/tenant/recruitment/resume/:id': '简历详情',
    '/tenant/interview/pickup': '接送管理',
    '/tenant/interview/pickup/add': '新增接送',
    '/tenant/interview/pickup/edit/:id': '编辑接送',
    '/tenant/interview/pickup/:id': '接送详情',
    '/tenant/interview/initial-interview': '初步面试',
    '/tenant/interview/initial-interview/add': '新增初步面试',
    '/tenant/interview/initial-interview/edit/:id': '编辑初步面试',
    '/tenant/interview/initial-interview/:id': '初步面试详情',
    '/tenant/interview/invitation': '面试邀约',
    '/tenant/interview/invitation/add': '新增面试邀约',
    '/tenant/interview/invitation/edit/:id': '编辑面试邀约',
    '/tenant/interview/invitation/:id': '面试邀约详情',
    '/tenant/interview/factory-interview': '工厂面试',
    '/tenant/interview/factory-interview/add': '新增工厂面试',
    '/tenant/interview/factory-interview/edit/:id': '编辑工厂面试',
    '/tenant/interview/factory-interview/:id': '工厂面试详情',
    '/tenant/workers': '工人管理',
    '/tenant/workers/:id': '工人信息详情',
    '/tenant/workers/:id/transfer': '岗位调动',
    '/tenant/workers/create': '新增工人',
    '/tenant/workers/:id/edit': '编辑工人',
    '/tenant/contract': '签订合同',
    '/tenant/contract/:id': '合同详情',
    '/tenant/contract/add': '新增合同',
    '/tenant/contract/edit/:id': '编辑合同',
    '/tenant/attendance': '考勤管理',
    '/tenant/attendance/statistics': '考勤统计',
    '/tenant/on-duty/living-expense': '生活费管理',
    '/tenant/on-duty/salary': '工资管理',
    '/tenant/on-duty/claim': '理赔管理',
    '/tenant/on-duty/special-case': '特殊情况管理',
    '/tenant/on-duty/insurance': '保险管理',
    '/tenant/on-duty/insurance-record': '参保登记',
    '/tenant/on-duty/leave': '请假管理',
    '/tenant/on-duty/leave-detail': '请假详情',
    '/tenant/on-duty/transfer': '调岗管理',
    '/tenant/on-duty/transfer/detail/:id': '调岗详情',
    '/tenant/on-duty/reward-punishment': '奖惩管理',
    '/tenant/on-duty/learning-material': '学习材料',
    '/tenant/on-duty/question-bank': '题库管理',
    '/tenant/on-duty/learning-time': '学习时长管理',
    '/tenant/on-duty/exam': '考试管理',
    '/tenant/on-duty/exam-result': '考试成绩',
    '/tenant/on-duty/abnormal': '异常管理',
    '/tenant/on-duty/complaint': '投诉/建议',
    '/tenant/on-duty/communication': '沟通管理',
    '/tenant/on-duty/entertainment': '文娱活动',
    '/tenant/on-duty/registration': '报名管理',
    '/tenant/on-duty/news': '发布资讯',
    '/tenant/on-duty/community': '社团管理',
    '/tenant/resignation': '离职管理',
    '/tenant/resignation/:id': '离职详情',
    '/tenant/resignation/add': '新增离职',
    '/tenant/resignation/edit/:id': '编辑离职',
    '/tenant/referral': '工作转介绍',
    '/tenant/referral/add': '新增转介绍',
    '/tenant/referral/edit/:id': '编辑转介绍',
    '/tenant/referral/:id': '转介绍详情',
    '/tenant/commission': '佣金发放',
    '/tenant/commission/:id': '佣金详情',
    '/tenant/commission/rule': '佣金规则配置',
    '/tenant/settlement': '结算管理',
    '/tenant/settlement/add': '新建结算',
    '/tenant/settlement/edit/:id': '编辑结算',
    '/tenant/settlement/:id': '结算详情',
    '/tenant/departments': '部门管理',
    '/tenant/departments/add': '新增部门',
    '/tenant/departments/edit/:id': '编辑部门',
    '/tenant/departments/:id': '部门详情',
    '/tenant/roles': '角色管理',
    '/tenant/roles/create': '创建角色',
    '/tenant/roles/permissions': '权限管理',
    '/tenant/company-culture': '企业文化介绍',
    '/tenant/position-culture': '岗位文化介绍',
    '/tenant/employees': '正式员工',
    '/tenant/employees/add': '新增员工',
    '/tenant/employees/edit/:id': '编辑员工',
    '/tenant/employees/:id': '员工详情',
    '/tenant/positions': '岗位管理',
    '/tenant/rules': '规则配置',
    '/tenant/menu-config': '菜单配置',
    '/tenant/dictionary': '字典管理',
    '/tenant/system-parameter': '系统参数',
    '/tenant/process': '流程管理',
    '/tenant/process-config': '流程配置',
    '/tenant/attachment': '附件管理',
    '/tenant/template-config': '模版配置',
    '/tenant/print-config': '打印配置',
    '/tenant/quick-access-settings': '首页快捷入口设置',
    '/tenant/todo-detail/:id': '待办详情',
    '/tenant/message-detail/:id': '消息详情',
    '/tenant/warning-detail/:id': '预警详情'
  }
  
  // 首先尝试精确匹配
  if (titleMap[path]) {
    return titleMap[path]
  }
  
  // 处理编辑页面路径
  if (path.includes('/contract/edit/')) {
    return '编辑合同'
  }
  if (path === '/tenant/contract/add') {
    return '新增合同'
  }
  if (path.includes('/contract/add')) {
    return '新增合同'
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
    
    // 如果关闭的是当前页面，切换到其他页面
    if (tab.path === currentPath.value) {
      if (openTabs.value.length > 0) {
        router.push(openTabs.value[Math.max(0, index - 1)].path)
      } else {
        router.push('/tenant/home')
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
  router.push('/tenant/home')
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
  width: 100%;
  overflow: visible;
}

.header-left {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  flex: 1;
  overflow: visible;
  min-width: 0;
}

/* 顶部菜单容器 */
.top-menu-container {
  flex: 1;
  min-width: 0;
  overflow: visible;
  display: flex;
  justify-content: center;
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
  width: auto;
  overflow: visible;
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
  margin-top: var(--header-height);
  background-color: var(--color-bg-page);
  min-height: calc(100vh - var(--header-height));
}

/* 侧边栏容器 */
.sidebar-container {
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  display: flex;
  align-items: flex-start;
  background: linear-gradient(180deg, var(--color-bg-page) 0%, #f0f2f5 100%);
  z-index: var(--z-index-fixed);
}

/* 左侧导航栏 */
.layout-sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-color-sidebar);
  border-right: 1px solid var(--color-border-light);
  overflow-y: auto;
  overflow-x: hidden;
  transition: all var(--transition-base);
  height: 100%;
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

/* 收起状态下的侧边栏有足够空间显示图标 */
.layout-sidebar.collapsed {
  overflow: hidden;
}

/* 侧边栏收起时调整内容容器的margin-left */
.sidebar-container.collapsed + .content-container {
  margin-left: 60px;
}

/* 侧边栏收起时的页面标签栏 */
.sidebar-container.collapsed + .content-container .page-tabs {
  left: 60px;
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
  margin-left: var(--sidebar-width);
  margin-top: var(--page-tabs-height);
  min-height: calc(100% - var(--page-tabs-height));
  transition: margin-left var(--transition-base);
}

/* 四级导航栏 (页面标签) */
.page-tabs {
  position: fixed;
  top: var(--header-height);
  left: var(--sidebar-width);
  right: 0;
  height: var(--page-tabs-height);
  background: linear-gradient(180deg, #ffffff 0%, var(--color-bg-page) 100%);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  z-index: var(--z-index-dropdown);
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
  padding: var(--spacing-sm);
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