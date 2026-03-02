<template>
  <div class="sidebar-container">
    <!-- 收起展开按钮 -->
    <div
      class="sidebar-toggle"
      :class="{ collapsed: isCollapsed }"
      @click="toggleCollapse"
    >
      <el-icon>
        <ArrowLeft v-if="!isCollapsed" />
        <ArrowRight v-else />
      </el-icon>
    </div>

    <!-- 左侧侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="defaultOpeneds"
        mode="vertical"
        class="sidebar-menu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        @select="handleMenuSelect"
      >
        <template v-for="menu in secondLevelMenus" :key="menu.code">
          <!-- 有子菜单的情况 -->
          <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.code">
            <template #title>
              <el-icon class="menu-icon">
                <component :is="menu.icon" />
              </el-icon>
              <span class="menu-text">{{ menu.name }}</span>
            </template>
            <!-- 三级菜单 -->
            <el-menu-item
              v-for="submenu in menu.children"
              :key="submenu.code"
              :index="submenu.path"
              class="submenu-item"
            >
              <el-icon class="submenu-icon">
                <component :is="submenu.icon" />
              </el-icon>
              <span class="submenu-text">{{ submenu.name }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单的情况 -->
          <el-menu-item v-else :index="menu.path || menu.code" class="menu-item">
            <el-icon class="menu-icon">
              <component :is="menu.icon" />
            </el-icon>
            <span class="menu-text">{{ menu.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import type { SecondLevelMenu } from '../types/menu'

// Props
interface Props {
  menus: SecondLevelMenu[]
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

// Emits
const emit = defineEmits<{
  collapseChange: [collapsed: boolean]
  menuSelect: [path: string]
}>()

// 路由实例
const router = useRouter()
const route = useRoute()

// 折叠状态
const isCollapsed = ref(props.collapsed)

// 默认展开的子菜单
const defaultOpeneds = ref<string[]>([])

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  emit('collapseChange', isCollapsed.value)
}

// 处理菜单选择
const handleMenuSelect = (path: string) => {
  emit('menuSelect', path)
  router.push(path)
}

// 监听外部折叠状态变化
watch(
  () => props.collapsed,
  (newVal) => {
    isCollapsed.value = newVal
  }
)

// 监听路由变化，自动展开对应的子菜单
watch(
  () => route.path,
  (newPath) => {
    // 根据当前路径找到对应的二级菜单并展开
    const currentMenu = props.menus.find(menu => {
      if (menu.path === newPath) return true
      if (menu.children) {
        return menu.children.some(submenu => submenu.path === newPath)
      }
      return false
    })

    if (currentMenu && currentMenu.code) {
      if (!defaultOpeneds.value.includes(currentMenu.code)) {
        defaultOpeneds.value.push(currentMenu.code)
      }
    }
  },
  { immediate: true }
)

// 暴露方法
defineExpose({
  toggleCollapse,
  setCollapse: (collapsed: boolean) => {
    isCollapsed.value = collapsed
    emit('collapseChange', collapsed)
  }
})
</script>

<style scoped>
.sidebar-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  background: linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%);
  border-right: 1px solid var(--color-border-light, #e4e7ed);
  transition: all var(--transition-base, 0.3s);
}

.sidebar {
  width: var(--sidebar-width, 200px);
  background-color: var(--bg-color-sidebar, #ffffff);
  transition: all var(--transition-base, 0.3s);
  overflow: hidden;
  min-height: calc(100vh - var(--header-height, 60px) - var(--page-tabs-height, 40px));
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width, 60px);
}

.sidebar-menu {
  border-right: none;
  height: 100%;
  padding-top: var(--spacing-xl, 20px);
  background-color: transparent;
}

/* 一级菜单项 */
.sidebar-menu :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: var(--spacing-xs, 4px) var(--spacing-md, 12px);
  border-radius: var(--radius-md, 6px);
  transition: all var(--transition-fast, 0.2s);
  color: var(--color-text-regular, #606266);
  font-weight: var(--font-weight-medium, 500);
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: var(--bg-color-hover, #f5f7fa);
  color: var(--color-primary, #409eff);
  transform: translateX(4px);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, var(--bg-color-active, #ecf5ff) 0%, #d9ecff 100%);
  color: var(--color-primary, #409eff);
  font-weight: var(--font-weight-bold, 600);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

/* 子菜单 */
.sidebar-menu :deep(.el-sub-menu) {
  margin: var(--spacing-xs, 4px) var(--spacing-md, 12px);
  border-radius: var(--radius-md, 6px);
}

.sidebar-menu :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  padding: 0 var(--spacing-md, 12px);
  border-radius: var(--radius-md, 6px);
  transition: all var(--transition-fast, 0.2s);
  color: var(--color-text-regular, #606266);
  font-weight: var(--font-weight-medium, 500);
}

.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: var(--bg-color-hover, #f5f7fa);
  color: var(--color-primary, #409eff);
}

.sidebar-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  background: linear-gradient(135deg, var(--bg-color-active, #ecf5ff) 0%, #d9ecff 100%);
  color: var(--color-primary, #409eff);
  font-weight: var(--font-weight-bold, 600);
}

/* 三级菜单项 */
.submenu-item {
  padding-left: 48px !important;
}

.submenu-item :deep(.el-menu-item__content) {
  padding-left: 0 !important;
}

/* 菜单图标 */
.menu-icon,
.submenu-icon {
  font-size: 16px;
  margin-right: var(--spacing-md, 12px);
  transition: transform var(--transition-fast, 0.2s);
}

.sidebar-menu :deep(.el-menu-item:hover .menu-icon),
.sidebar-menu :deep(.el-menu-item:hover .submenu-icon),
.sidebar-menu :deep(.el-sub-menu__title:hover .menu-icon) {
  transform: scale(1.1);
}

/* 菜单文字 */
.menu-text,
.submenu-text {
  font-size: var(--font-size-base, 14px);
}

/* 折叠状态样式 */
.sidebar.collapsed .sidebar-menu :deep(.el-menu-item) {
  justify-content: center;
  padding: 0;
  margin: var(--spacing-xs, 4px) var(--spacing-sm, 8px);
}

.sidebar.collapsed .sidebar-menu :deep(.el-menu-item__content) {
  justify-content: center;
  padding: 0;
}

.sidebar.collapsed .sidebar-menu :deep(.el-menu-item .menu-icon) {
  margin-right: 0;
  font-size: 20px;
}

.sidebar.collapsed .sidebar-menu :deep(.el-menu-item .menu-text),
.sidebar.collapsed .sidebar-menu :deep(.el-menu-item .submenu-text) {
  display: none;
}

.sidebar.collapsed .sidebar-menu :deep(.el-sub-menu) {
  margin: var(--spacing-xs, 4px) var(--spacing-sm, 8px);
}

.sidebar.collapsed .sidebar-menu :deep(.el-sub-menu__title) {
  justify-content: center;
  padding: 0;
}

.sidebar.collapsed .sidebar-menu :deep(.el-sub-menu__title .menu-icon) {
  margin-right: 0;
  font-size: 20px;
}

.sidebar.collapsed .sidebar-menu :deep(.el-sub-menu__title .menu-text) {
  display: none;
}

.sidebar.collapsed .sidebar-menu :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  display: none;
}

/* 折叠状态下的悬停效果 */
.sidebar.collapsed .sidebar-menu :deep(.el-menu-item:hover) {
  transform: none;
  background-color: var(--bg-color-hover, #f5f7fa);
}

.sidebar.collapsed .sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, var(--bg-color-active, #ecf5ff) 0%, #d9ecff 100%);
}

/* 收起展开按钮 */
.sidebar-toggle {
  position: absolute;
  top: var(--spacing-xl, 20px);
  right: -12px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: white;
  border-radius: var(--radius-round, 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: var(--z-index-dropdown, 1050);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transition: all var(--transition-base, 0.3s);
}

.sidebar-toggle:hover {
  transform: scale(1.15) rotate(180deg);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.sidebar-toggle:active {
  transform: scale(1.05) rotate(180deg);
}

.sidebar-toggle.collapsed {
  right: -12px;
}

.sidebar-toggle :deep(.el-icon) {
  font-size: 14px;
  line-height: 1;
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--color-border-base, #dcdfe6);
  border-radius: var(--radius-round, 50%);
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary, #909399);
}

/* 响应式设计 */
@media screen and (max-width: 1440px) {
  .sidebar-menu :deep(.el-menu-item),
  .sidebar-menu :deep(.el-sub-menu__title) {
    height: 44px;
    line-height: 44px;
  }
}

@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: var(--header-height, 60px);
    left: 0;
    z-index: var(--z-index-fixed, 1000);
    height: calc(100vh - var(--header-height, 60px));
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
  }

  .sidebar-toggle {
    display: none;
  }
}
</style>
