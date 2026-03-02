# PC端统一布局组件使用说明

## 组件概述

PC端统一布局组件包含以下四个核心组件：

1. **TopNavigation.vue** - 顶部导航栏组件
2. **Sidebar.vue** - 左侧侧边栏组件
3. **PageTabs.vue** - 四级导航栏（页面标签）组件
4. **PcLayout.vue** - 布局容器组件

## 组件特性

### TopNavigation.vue（顶部导航栏）

- 包含Logo和一级菜单（9个核心业务领域）
- 支持响应式调整
- 支持下拉菜单收纳超出的菜单项
- 使用Element Plus的Menu组件，mode="horizontal"
- 菜单项包含图标和文字
- 悬停效果和激活状态
- 用户信息下拉菜单（个人中心、系统设置、退出登录）
- 消息通知功能

### Sidebar.vue（左侧侧边栏）

- 包含二级/三级菜单
- 支持折叠/展开功能
- 展开状态：200px宽度，显示完整菜单结构（图标 + 文字）
- 折叠状态：60px宽度，仅显示菜单图标
- 使用Element Plus的Menu组件，mode="vertical"
- 支持点击展开/收起三级菜单
- 悬停效果和激活状态
- 折叠/展开按钮

### PageTabs.vue（四级导航栏）

- 显示当前打开的页面标签
- 支持点击标签切换页面
- 支持右键菜单操作：刷新当前页、关闭当前页、关闭其他页面、关闭全部页面
- 支持标签拖拽排序
- 固定标签（如首页）不可关闭
- 高度40px
- 自动滚动到激活的标签

### PcLayout.vue（布局容器）

- 整合顶部导航栏、侧边栏、四级导航栏和内容区域
- 实现响应式布局
- 处理菜单联动逻辑
- 自动管理页面标签
- 支持侧边栏折叠/展开

## 使用方法

### 基本使用

```vue
<template>
  <PcLayout :user-info="userInfo">
    <!-- 页面内容 -->
    <div class="page-content">
      <el-card>
        <template #header>
          <span>页面标题</span>
        </template>
        <!-- 页面内容 -->
      </el-card>
    </div>
  </PcLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PcLayout from '../components/PcLayout.vue'
import type { UserInfo } from '../types/menu'

// 用户信息
const userInfo = ref<UserInfo>({
  id: '1',
  username: 'admin',
  realName: '管理员',
  avatar: '',
  role: 'labor_company',
  department: '劳务公司'
})

// 初始化
onMounted(() => {
  // 从本地存储获取用户信息
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  }
})
</script>
```

### 单独使用组件

如果需要单独使用某个组件，可以按以下方式：

#### 使用TopNavigation

```vue
<template>
  <TopNavigation
    :user-info="userInfo"
    @menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import TopNavigation from '../components/TopNavigation.vue'
import type { UserInfo } from '../types/menu'

const userInfo = ref<UserInfo>({ /* ... */ })

const handleMenuSelect = (code: string) => {
  console.log('选中菜单:', code)
}
</script>
```

#### 使用Sidebar

```vue
<template>
  <Sidebar
    ref="sidebarRef"
    :menus="secondLevelMenus"
    :collapsed="sidebarCollapsed"
    @collapse-change="handleCollapseChange"
    @menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import type { SecondLevelMenu } from '../types/menu'

const sidebarRef = ref()
const sidebarCollapsed = ref(false)
const secondLevelMenus = ref<SecondLevelMenu[]>([
  {
    code: 'todo',
    name: '待办任务',
    icon: 'List',
    path: '/todo'
  },
  {
    code: 'messages',
    name: '消息中心',
    icon: 'Bell',
    children: [
      {
        code: 'system-message',
        name: '系统消息',
        icon: 'Message',
        path: '/messages/system'
      },
      {
        code: 'user-message',
        name: '用户消息',
        icon: 'ChatDotRound',
        path: '/messages/user'
      }
    ]
  }
])

const handleCollapseChange = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
}

const handleMenuSelect = (path: string) => {
  console.log('选中菜单:', path)
}
</script>
```

#### 使用PageTabs

```vue
<template>
  <PageTabs
    ref="pageTabsRef"
    :tabs="openTabs"
    @tab-click="handleTabClick"
    @tab-close="handleTabClose"
    @refresh="handleRefresh"
    @close-others="handleCloseOthers"
    @close-all="handleCloseAll"
    @tab-reorder="handleTabReorder"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageTabs from '../components/PageTabs.vue'
import type { PageTab } from '../types/menu'

const pageTabsRef = ref()
const openTabs = ref<PageTab[]>([
  {
    path: '/home',
    title: '首页',
    fixed: true
  },
  {
    path: '/todo',
    title: '待办任务',
    fixed: false
  }
])

const handleTabClick = (tab: PageTab) => {
  console.log('点击标签:', tab)
}

const handleTabClose = (tab: PageTab) => {
  console.log('关闭标签:', tab)
}

const handleRefresh = (tab: PageTab) => {
  console.log('刷新标签:', tab)
}

const handleCloseOthers = (tab: PageTab) => {
  console.log('关闭其他标签:', tab)
}

const handleCloseAll = () => {
  console.log('关闭所有标签')
}

const handleTabReorder = (tabs: PageTab[]) => {
  openTabs.value = tabs
}
</script>
```

## 菜单配置

### 一级菜单配置

一级菜单在TopNavigation组件中定义，包含9个核心业务领域：

```typescript
const firstLevelMenus = [
  { code: 'work-center', name: '工作中心', icon: Briefcase },
  { code: 'recruitment', name: '招聘管理', icon: ChatDotRound },
  { code: 'interview', name: '面试管理', icon: UserFilled },
  { code: 'worker', name: '工人管理', icon: User },
  { code: 'contract', name: '合同管理', icon: Document },
  { code: 'employment', name: '在职管理', icon: Management },
  { code: 'resignation', name: '离职管理', icon: RemoveFilled },
  { code: 'settlement', name: '结算管理', icon: Wallet },
  { code: 'system', name: '系统管理', icon: Tools }
]
```

### 二级/三级菜单配置

二级/三级菜单在PcLayout组件中定义，根据一级菜单动态显示：

```typescript
const menuConfig = {
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
    }
  ],
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
          path: '/labor-company/living-expense'
        },
        {
          code: 'salary',
          name: '工资管理',
          icon: 'Money',
          path: '/labor-company/salary'
        }
      ]
    }
  ]
}
```

## 类型定义

所有类型定义都在`src/types/menu.ts`文件中：

```typescript
// 一级菜单类型
export interface FirstLevelMenu {
  code: string
  name: string
  icon: string
  path?: string
}

// 二级菜单类型
export interface SecondLevelMenu {
  code: string
  name: string
  icon: string
  path?: string
  children?: ThirdLevelMenu[]
}

// 三级菜单类型
export interface ThirdLevelMenu {
  code: string
  name: string
  icon: string
  path: string
}

// 页面标签类型
export interface PageTab {
  path: string
  title: string
  fixed?: boolean
}

// 用户信息类型
export interface UserInfo {
  id: string
  username: string
  realName?: string
  avatar?: string
  role: string
  department?: string
}
```

## 样式变量

组件使用全局CSS变量，可以在`src/style.css`中自定义：

```css
:root {
  /* 布局尺寸 */
  --header-height: 60px;
  --sidebar-width: 200px;
  --sidebar-collapsed-width: 60px;
  --page-tabs-height: 40px;

  /* PC端布局特定变量 */
  --bg-color-sidebar: #ffffff;
  --bg-color-hover: #f5f7fa;
  --bg-color-active: #ecf5ff;
}
```

## 响应式设计

组件支持响应式布局，适配不同屏幕尺寸：

- **移动端** (< 768px)：侧边栏隐藏，顶部导航栏简化
- **平板** (768px - 1024px)：中等屏幕适配
- **桌面** (> 1024px)：完整布局显示
- **大屏幕** (> 1440px)：优化大屏幕显示
- **超大屏幕** (> 1920px)：优化超大屏幕显示

## 注意事项

1. **图标使用**：组件使用Element Plus Icons，需要确保已正确导入
2. **路由配置**：需要在路由配置中添加对应的路由
3. **用户信息**：需要从本地存储或API获取用户信息
4. **菜单联动**：一级菜单切换会自动更新二级菜单
5. **页面标签**：访问新页面会自动添加标签，固定标签不可关闭
6. **拖拽排序**：固定标签不支持拖拽排序

## 示例页面

完整的示例页面可以参考：`src/views/labor-company/PcLayoutDemo.vue`

## 开发规范

请遵循《蓝领智汇平台开发规范》和《PC端UI设计规范》进行开发：

- 使用Vue 3 Composition API和`<script setup>`语法
- 使用TypeScript进行类型定义
- 组件可复用性设计
- 遵循代码风格规范
- 使用中文注释
- 组件大小控制在合理范围内
