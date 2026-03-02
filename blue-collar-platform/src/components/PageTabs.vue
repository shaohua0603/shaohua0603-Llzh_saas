<template>
  <div class="page-tabs">
    <div class="tabs-scroll" ref="tabsScrollRef">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        class="tab-item"
        :class="{ active: tab.path === activePath, fixed: tab.fixed }"
        :draggable="!tab.fixed"
        @click="handleTabClick(tab)"
        @contextmenu.prevent="handleContextMenu($event, tab)"
        @dragstart="handleDragStart($event, tab)"
        @dragover="handleDragOver($event, tab)"
        @drop="handleDrop($event, tab)"
        @dragend="handleDragEnd"
      >
        <el-icon v-if="tab.fixed" class="tab-icon">
          <Lock />
        </el-icon>
        <span class="tab-title">{{ tab.title }}</span>
        <span
          v-if="!tab.fixed"
          class="tab-close"
          @click.stop="handleTabClose(tab)"
        >
          <el-icon><Close /></el-icon>
        </span>
      </div>
    </div>

    <!-- 右键菜单 -->
    <teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="context-menu"
        :style="contextMenuStyle"
        @click.stop
      >
        <div
          v-for="item in contextMenuItems"
          :key="item.action"
          class="context-menu-item"
          :class="{ disabled: item.disabled }"
          @click="handleContextMenuItem(item)"
        >
          <el-icon class="menu-item-icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Lock, Close, Refresh, Remove, CircleClose } from '@element-plus/icons-vue'
import type { PageTab } from '../types/menu'

// Props
interface Props {
  tabs: PageTab[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  tabClick: [tab: PageTab]
  tabClose: [tab: PageTab]
  refresh: [tab: PageTab]
  closeOthers: [tab: PageTab]
  closeAll: []
  tabReorder: [tabs: PageTab[]]
}>()

// 路由实例
const router = useRouter()
const route = useRoute()

// 滚动容器引用
const tabsScrollRef = ref<HTMLElement>()

// 当前激活的路径
const activePath = computed(() => {
  return route.path
})

// 右键菜单状态
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const currentTab = ref<PageTab | null>(null)

// 右键菜单样式
const contextMenuStyle = computed(() => {
  return {
    left: `${contextMenuPosition.value.x}px`,
    top: `${contextMenuPosition.value.y}px`
  }
})

// 右键菜单项
const contextMenuItems = computed(() => {
  const items = [
    {
      label: '刷新',
      icon: Refresh,
      action: 'refresh',
      disabled: false
    }
  ]

  if (currentTab.value && !currentTab.value.fixed) {
    items.push(
      {
        label: '关闭',
        icon: Close,
        action: 'close',
        disabled: false
      },
      {
        label: '关闭其他',
        icon: Remove,
        action: 'closeOthers',
        disabled: false
      },
      {
        label: '关闭全部',
        icon: CircleClose,
        action: 'closeAll',
        disabled: false
      }
    )
  }

  return items
})

// 拖拽状态
const draggedTab = ref<PageTab | null>(null)

// 处理标签点击
const handleTabClick = (tab: PageTab) => {
  emit('tabClick', tab)
  router.push(tab.path)
}

// 处理标签关闭
const handleTabClose = (tab: PageTab) => {
  emit('tabClose', tab)
}

// 打开右键菜单
const handleContextMenu = (event: MouseEvent, tab: PageTab) => {
  currentTab.value = tab
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true

  // 点击其他地方关闭右键菜单
  setTimeout(() => {
    document.addEventListener('click', closeContextMenu)
  }, 0)
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false
  document.removeEventListener('click', closeContextMenu)
}

// 处理右键菜单项点击
const handleContextMenuItem = (item: any) => {
  if (item.disabled || !currentTab.value) return

  switch (item.action) {
    case 'refresh':
      emit('refresh', currentTab.value)
      router.go(0)
      break
    case 'close':
      emit('tabClose', currentTab.value)
      break
    case 'closeOthers':
      emit('closeOthers', currentTab.value)
      break
    case 'closeAll':
      emit('closeAll')
      break
  }

  closeContextMenu()
}

// 拖拽开始
const handleDragStart = (event: DragEvent, tab: PageTab) => {
  draggedTab.value = tab
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

// 拖拽经过
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

// 拖拽放下
const handleDrop = (event: DragEvent, targetTab: PageTab) => {
  event.preventDefault()

  if (!draggedTab.value || draggedTab.value.path === targetTab.path) {
    return
  }

  const newTabs = [...props.tabs]
  const draggedIndex = newTabs.findIndex(tab => tab.path === draggedTab.value?.path)
  const targetIndex = newTabs.findIndex(tab => tab.path === targetTab.path)

  if (draggedIndex > -1 && targetIndex > -1) {
    // 移动拖拽的标签到目标位置
    newTabs.splice(draggedIndex, 1)
    newTabs.splice(targetIndex, 0, draggedTab.value)
    emit('tabReorder', newTabs)
  }

  draggedTab.value = null
}

// 拖拽结束
const handleDragEnd = () => {
  draggedTab.value = null
}

// 滚动到激活的标签
const scrollToActiveTab = () => {
  if (!tabsScrollRef.value) return

  const activeTab = tabsScrollRef.value.querySelector('.tab-item.active')
  if (activeTab) {
    activeTab.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }
}

// 监听路由变化，滚动到激活的标签
onMounted(() => {
  scrollToActiveTab()
})

// 组件卸载时清理监听器
onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
})

// 暴露方法
defineExpose({
  scrollToActiveTab
})
</script>

<style scoped>
.page-tabs {
  height: var(--page-tabs-height, 40px);
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid var(--color-border-light, #e4e7ed);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md, 12px);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.tabs-scroll {
  display: flex;
  align-items: center;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: var(--spacing-sm, 8px);
  flex: 1;
}

.tabs-scroll::-webkit-scrollbar {
  display: none;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--spacing-md, 12px);
  height: 32px;
  background-color: var(--color-bg-page, #f5f7fa);
  border: 1px solid var(--color-border-light, #e4e7ed);
  border-radius: var(--radius-md, 6px) var(--radius-md, 6px) 0 0;
  cursor: pointer;
  transition: all var(--transition-fast, 0.2s);
  position: relative;
  font-size: var(--font-size-small, 13px);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-regular, #606266);
  top: 1px;
  user-select: none;
}

.tab-item:hover {
  background-color: var(--bg-color-hover, #ecf5ff);
  border-color: var(--color-primary-light, #a0cfff);
  color: var(--color-primary, #409eff);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

.tab-item.active {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-color: var(--color-primary, #409eff);
  border-bottom-color: #ffffff;
  color: var(--color-primary, #409eff);
  font-weight: var(--font-weight-bold, 600);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.15);
}

.tab-item.fixed {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-color: var(--color-primary-light, #a0cfff);
}

.tab-icon {
  font-size: 12px;
  margin-right: var(--spacing-xs, 4px);
  color: var(--color-primary, #409eff);
}

.tab-title {
  margin-right: var(--spacing-sm, 8px);
  font-size: var(--font-size-small, 13px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

.tab-close {
  font-size: 14px;
  line-height: 1;
  color: var(--color-text-secondary, #909399);
  cursor: pointer;
  padding: 2px;
  border-radius: var(--radius-round, 50%);
  transition: all var(--transition-fast, 0.2s);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.tab-close:hover {
  background-color: var(--color-danger, #f56c6c);
  color: #ffffff;
  transform: rotate(90deg) scale(1.1);
}

/* 右键菜单 - 紧凑型卡片样式 */
.page-tabs .context-menu {
  position: fixed !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  border: 1px solid var(--color-border-light, #e4e7ed) !important;
  border-radius: var(--radius-sm, 4px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.12) !important;
  z-index: var(--z-index-popover, 2000) !important;
  min-width: 130px !important;
  overflow: hidden !important;
  animation: contextMenuFadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
  backdrop-filter: blur(8px) !important;
  background-color: rgba(255, 255, 255, 0.98) !important;
  border-top: 2px solid var(--color-primary, #409eff) !important;
}

@keyframes contextMenuFadeIn {
  from {
    opacity: 0;
    transform: scale(0.98) translateY(-2px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.page-tabs .context-menu-item {
  display: flex !important;
  align-items: center !important;
  padding: 3px var(--spacing-md, 12px) !important;
  font-size: 11px !important;
  font-weight: var(--font-weight-medium, 500) !important;
  cursor: pointer !important;
  transition: all var(--transition-fast, 0.15s) !important;
  color: var(--color-text-primary, #303133) !important;
  position: relative !important;
  overflow: hidden !important;
  height: 22px !important;
  min-height: 22px !important;
  max-height: 22px !important;
}

.page-tabs .context-menu-item::before {
  content: '' !important;
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  height: 100% !important;
  width: 2px !important;
  background: var(--color-primary, #409eff) !important;
  transform: scaleY(0) !important;
  transition: transform var(--transition-base, 0.2s) !important;
}

.page-tabs .context-menu-item:hover:not(.disabled) {
  background-color: #ecf5ff !important;
  color: var(--color-primary, #409eff) !important;
  padding-left: 14px !important;
}

.page-tabs .context-menu-item:hover:not(.disabled)::before {
  transform: scaleY(1) !important;
}

.page-tabs .context-menu-item.disabled {
  color: var(--color-text-placeholder, #c0c4cc) !important;
  cursor: not-allowed !important;
}

.page-tabs .menu-item-icon {
  margin-right: var(--spacing-sm, 8px) !important;
  font-size: 11px !important;
  width: 13px !important;
  height: 13px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: var(--color-text-secondary, #909399) !important;
  transition: all var(--transition-fast, 0.15s) !important;
  flex-shrink: 0 !important;
}

.page-tabs .context-menu-item:hover:not(.disabled) .menu-item-icon {
  color: var(--color-primary, #409eff) !important;
  transform: scale(1.1) !important;
}

/* 菜单项分隔线 */
.page-tabs .context-menu-item.divider {
  height: 1px !important;
  padding: 0 !important;
  margin: 2px 0 !important;
  background-color: var(--color-border-light, #e4e7ed) !important;
  cursor: default !important;
}

.page-tabs .context-menu-item.divider:hover {
  background-color: var(--color-border-light, #e4e7ed) !important;
  padding-left: var(--spacing-md, 12px) !important;
}

.page-tabs .context-menu-item.divider::before {
  display: none !important;
}

/* 拖拽样式 */
.tab-item[draggable="true"]:active {
  cursor: grabbing;
}

.tab-item[draggable="true"]:hover {
  cursor: grab;
}

/* 响应式设计 */
@media screen and (max-width: 1440px) {
  .tab-title {
    max-width: 100px;
  }
}

@media screen and (max-width: 768px) {
  .page-tabs {
    padding: 0 var(--spacing-sm, 8px);
  }

  .tab-item {
    padding: 0 var(--spacing-sm, 8px);
    height: 28px;
    font-size: var(--font-size-extra-small, 12px);
  }

  .tab-title {
    max-width: 80px;
    font-size: var(--font-size-extra-small, 12px);
  }

  .tab-close {
    width: 16px;
    height: 16px;
    font-size: 12px;
  }

  .context-menu {
    min-width: 120px;
    border-radius: var(--radius-sm, 4px);
  }

  .context-menu-item {
    padding: 4px var(--spacing-sm, 8px);
    font-size: 10px;
    height: 20px;
  }

  .context-menu-item:hover:not(.disabled) {
    padding-left: 10px;
  }

  .menu-item-icon {
    margin-right: var(--spacing-xs, 4px);
    font-size: 10px;
    width: 12px;
    height: 12px;
  }
}
</style>
