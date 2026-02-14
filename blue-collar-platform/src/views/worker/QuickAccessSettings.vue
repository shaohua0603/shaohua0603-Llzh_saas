<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'
import { ElMessage, ElIcon } from 'element-plus'
import {
  User,
  Timer,
  Money,
  Reading,
  SwitchButton,
  Document,
  Grid,
  Operation,
  Warning,
  ChatLineSquare,
  Flag,
  Promotion,
  Setting
} from '@element-plus/icons-vue'

const router = useRouter()
const selectedItems = ref<string[]>([])
const allFunctions = ref<any[]>([])
const loading = ref(true)

// 所有可用的功能入口（与工作台保持一致）
const availableFunctions = [
  {
    id: 'personal-info',
    title: '个人信息',
    icon: User,
    path: '/worker/profile'
  },
  {
    id: 'attendance',
    title: '考勤请假',
    icon: Timer,
    path: '/worker/attendance'
  },
  {
    id: 'salary',
    title: '工资条',
    icon: Money,
    path: '/worker/salary'
  },
  {
    id: 'training',
    title: '业务课堂',
    icon: Reading,
    path: '/worker/training'
  },
  {
    id: 'resignation',
    title: '离职申请',
    icon: SwitchButton,
    path: '/worker/resignation'
  },
  {
    id: 'transfer',
    title: '调岗申请',
    icon: Grid,
    path: '/worker/transfer'
  },
  {
    id: 'reward-punishment',
    title: '我的奖惩',
    icon: Document,
    path: '/worker/reward-punishment'
  },
  {
    id: 'special-cases',
    title: '特殊情况',
    icon: Warning,
    path: '/worker/special-cases'
  },
  {
    id: 'living-expense',
    title: '生活费申请',
    icon: Money,
    path: '/worker/living-expense'
  },
  {
    id: 'complaint-suggestion',
    title: '投诉/建议',
    icon: ChatLineSquare,
    path: '/worker/complaint-suggestion'
  },
  {
    id: 'entertainment',
    title: '文娱活动',
    icon: Operation,
    path: '/worker/entertainment'
  },
  {
    id: 'community',
    title: '我的社团',
    icon: Flag,
    path: '/worker/community'
  },
  {
    id: 'recruitment',
    title: '找工作',
    icon: Grid,
    path: '/worker/recruitment'
  },
  {
    id: 'referral',
    title: '工作转介绍',
    icon: Promotion,
    path: '/worker/referral'
  },
  {
    id: 'resume',
    title: '个人简历',
    icon: Document,
    path: '/worker/resume'
  }
]

// 计算属性：已选择的数量
const selectedCount = computed(() => {
  return selectedItems.value.length
})

// 计算属性：是否达到选择上限
const isMaxSelected = computed(() => {
  return selectedItems.value.length >= 8
})

// 处理选项变更
const handleItemChange = (itemId: string, checked: boolean) => {
  if (checked) {
    if (selectedItems.value.length < 8) {
      selectedItems.value.push(itemId)
    } else {
      ElMessage.warning('最多只能选择8个快捷入口')
    }
  } else {
    selectedItems.value = selectedItems.value.filter(id => id !== itemId)
  }
}

// 页面加载时获取已保存的设置
const loadSavedSettings = () => {
  try {
    const savedSettings = localStorage.getItem('quickAccessSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      // 确保 selectedItems 不为空，至少选择前8个功能
      selectedItems.value = settings.selectedItems && settings.selectedItems.length > 0 ? settings.selectedItems : availableFunctions.slice(0, 8).map(item => item.id)
    } else {
      // 默认选择前8个功能
      selectedItems.value = availableFunctions.slice(0, 8).map(item => item.id)
    }
  } catch (error) {
    console.error('加载设置失败:', error)
    // 加载失败时使用默认设置
    selectedItems.value = availableFunctions.slice(0, 8).map(item => item.id)
  } finally {
    loading.value = false
  }
}

// 保存设置
const saveSettings = () => {
  try {
    const settings = {
      selectedItems: selectedItems.value,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem('quickAccessSettings', JSON.stringify(settings))
    ElMessage.success('设置保存成功')
    router.push('/worker/dashboard')
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败，请稍后重试')
  }
}

// 取消设置
const cancelSettings = () => {
  router.push('/worker/dashboard')
}

// 页面加载时获取设置
onMounted(() => {
  loadSavedSettings()
})
</script>

<template>
  <div class="quick-access-settings">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left" @click="cancelSettings">
        <i class="el-icon-arrow-left"></i>
        <h2>首页快捷入口设置</h2>
      </div>
      <div class="header-right">
        <div class="action-buttons">
          <el-button @click="cancelSettings">取消</el-button>
          <el-button type="primary" @click="saveSettings">保存</el-button>
        </div>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tip-section">
      <div class="tip-content">
        <el-icon><Warning /></el-icon>
        <span>请选择最多8个常用功能作为首页快捷入口</span>
        <div class="selected-count">
          已选择: {{ selectedCount }}/8
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
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

.header-left i {
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

/* 选中状态样式 */
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

/* 加载状态 */
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

/* 响应式设计 */
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

@media (max-width: 480px) {
  .page-header {
    padding: 12px 14px;
  }

  .header-left h2 {
    font-size: 15px;
  }

  .action-buttons {
    gap: 8px;
  }

  .action-buttons .el-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  .tip-section {
    margin: 12px;
    padding: 12px 14px;
  }

  .function-list {
    margin: 0 12px 12px;
  }

  .function-item {
    padding: 12px 14px;
  }
}
</style>