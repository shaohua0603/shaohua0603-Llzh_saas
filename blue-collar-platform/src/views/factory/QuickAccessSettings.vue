<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElIcon } from 'element-plus'
import {
  UserFilled,
  Reading,
  Money,
  OfficeBuilding,
  Key,
  Setting
} from '@element-plus/icons-vue'

const router = useRouter()
const selectedItems = ref<string[]>([])
const loading = ref(true)

const availableFunctions = [
  {
    id: 'recruitment',
    title: '招聘管理',
    icon: UserFilled,
    path: '/factory/recruitment'
  },
  {
    id: 'workers',
    title: '工人管理',
    icon: UserFilled,
    path: '/factory/workers'
  },
  {
    id: 'training',
    title: '岗前培训',
    icon: Reading,
    path: '/factory/training'
  },
  {
    id: 'salary',
    title: '结算管理',
    icon: Money,
    path: '/factory/salary'
  },
  {
    id: 'departments',
    title: '部门管理',
    icon: OfficeBuilding,
    path: '/factory/departments'
  },
  {
    id: 'roles',
    title: '角色管理',
    icon: Key,
    path: '/factory/roles'
  }
]

const selectedCount = computed(() => {
  return selectedItems.value.length
})

const isMaxSelected = computed(() => {
  return selectedItems.value.length >= 6
})

const handleItemChange = (itemId: string, checked: boolean) => {
  if (checked) {
    if (selectedItems.value.length < 6) {
      selectedItems.value.push(itemId)
    } else {
      ElMessage.warning('最多只能选择6个快捷入口')
    }
  } else {
    selectedItems.value = selectedItems.value.filter(id => id !== itemId)
  }
}

const loadSavedSettings = () => {
  try {
    const savedSettings = localStorage.getItem('factoryQuickAccessSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      selectedItems.value = settings.selectedItems && settings.selectedItems.length > 0 ? settings.selectedItems : availableFunctions.slice(0, 6).map(item => item.id)
    } else {
      selectedItems.value = availableFunctions.slice(0, 6).map(item => item.id)
    }
  } catch (error) {
    console.error('加载设置失败:', error)
    selectedItems.value = availableFunctions.slice(0, 6).map(item => item.id)
  } finally {
    loading.value = false
  }
}

const saveSettings = () => {
  try {
    const settings = {
      selectedItems: selectedItems.value,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem('factoryQuickAccessSettings', JSON.stringify(settings))
    ElMessage.success('设置保存成功')
    router.push('/factory/home')
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败，请稍后重试')
  }
}

const cancelSettings = () => {
  router.push('/factory/home')
}

onMounted(() => {
  loadSavedSettings()
})
</script>

<template>
  <div class="quick-access-settings">
    <div class="page-header">
      <div class="header-left" @click="cancelSettings">
        <el-icon><Setting /></el-icon>
        <h2>首页快捷入口设置</h2>
      </div>
      <div class="header-right">
        <div class="action-buttons">
          <el-button @click="cancelSettings">取消</el-button>
          <el-button type="primary" @click="saveSettings">保存</el-button>
        </div>
      </div>
    </div>

    <div class="tip-section">
      <div class="tip-content">
        <el-icon><Setting /></el-icon>
        <span>请选择最多6个常用功能作为首页快捷入口</span>
        <div class="selected-count">
          已选择: {{ selectedCount }}/6
        </div>
      </div>
    </div>

    <div v-if="!loading" class="function-list">
      <div
        v-for="item in availableFunctions"
        :key="item.id"
        :class="['function-item', { 'selected': selectedItems.includes(item.id) }]"
      >
        <div class="function-checkbox">
          <el-checkbox
            :checked="selectedItems.includes(item.id)"
            @change="(val) => handleItemChange(item.id, val)"
            :disabled="isMaxSelected && !selectedItems.includes(item.id)"
          />
        </div>
        <div class="function-icon">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
        </div>
        <span class="function-title">{{ item.title }}</span>
      </div>
    </div>
    <div v-else class="loading-section">
      <el-icon class="loading-icon"><Setting /></el-icon>
      <span>加载中...</span>
    </div>
  </div>
</template>

<style scoped>
.quick-access-settings {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
}

.header-left el-icon {
  font-size: 18px;
  color: #666;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons .el-button {
  padding: 8px 16px;
  border-radius: 6px;
}

.tip-section {
  padding: 16px 20px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  margin: 20px;
  border-radius: 8px;
  position: sticky;
  top: 80px;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tip-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-content el-icon {
  color: #ffc107;
  font-size: 16px;
}

.tip-content span {
  flex: 1;
  color: #856404;
  font-size: 14px;
}

.selected-count {
  font-weight: bold;
  color: #856404;
  font-size: 14px;
  background-color: rgba(255, 193, 7, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.function-list {
  background-color: #fff;
  margin: 0 20px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.function-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.function-item:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

.function-item:last-child {
  border-bottom: none;
}

.function-checkbox {
  margin-right: 16px;
}

.function-checkbox .el-checkbox {
  --el-checkbox-size: 18px;
}

.function-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.function-icon el-icon {
  font-size: 20px;
  color: #667eea;
}

.function-title {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.function-item.selected {
  background-color: #f0f4ff;
}

.function-item.selected .function-icon {
  background-color: #667eea;
}

.function-item.selected .function-icon el-icon {
  color: #fff;
}

.function-item.selected .function-title {
  color: #667eea;
  font-weight: 600;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: #fff;
  margin: 0 20px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.loading-icon {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 16px;
  animation: spin 1.5s linear infinite;
}

.loading-section span {
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 14px 16px;
  }

  .header-left h2 {
    font-size: 16px;
  }

  .tip-section {
    margin: 16px;
    padding: 14px 16px;
  }

  .function-list {
    margin: 0 16px 16px;
  }

  .function-item {
    padding: 14px 16px;
  }

  .function-checkbox {
    margin-right: 12px;
  }

  .function-icon {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }

  .function-icon el-icon {
    font-size: 18px;
  }

  .function-title {
    font-size: 14px;
  }
}
</style>
