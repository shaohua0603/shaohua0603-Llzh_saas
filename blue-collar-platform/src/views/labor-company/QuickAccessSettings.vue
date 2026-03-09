<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElIcon } from 'element-plus'
import {
  UserFilled,
  Timer,
  Money,
  OfficeBuilding,
  Key,
  Setting,
  Document,
  Promotion,
  Ticket,
  Coin,
  FirstAidKit,
  Phone,
  Film,
  Calendar,
  Notebook,
  Collection,
  Star,
  AlarmClock,
  SetUp,
  Trophy,
  Reading,
  Postcard,
  Warning,
  ChatLineSquare
} from '@element-plus/icons-vue'

const router = useRouter()
const selectedItems = ref<string[]>([])
const loading = ref(true)

const availableFunctions = [
  // 招聘管理
  {
    id: 'recruitment-demand',
    title: '招聘需求',
    icon: Promotion,
    path: '/tenant-mobile/recruitment'
  },
  {
    id: 'resume-management',
    title: '简历管理',
    icon: Document,
    path: '/tenant-mobile/resume'
  },
  // 面试管理
  {
    id: 'pickup-management',
    title: '接送管理',
    icon: UserFilled,
    path: '/tenant-mobile/interview/pickup'
  },
  {
    id: 'initial-interview',
    title: '初步面试',
    icon: UserFilled,
    path: '/tenant-mobile/interview/initial-interview'
  },
  {
    id: 'interview-invitation',
    title: '面试邀约',
    icon: Ticket,
    path: '/tenant-mobile/interview/invitation'
  },
  {
    id: 'factory-interview',
    title: '工厂面试',
    icon: OfficeBuilding,
    path: '/tenant-mobile/interview/factory-interview'
  },
  // 工人管理
  {
    id: 'workers-info',
    title: '工人信息',
    icon: UserFilled,
    path: '/tenant-mobile/workers-list'
  },
  // 合同管理
  {
    id: 'sign-contract',
    title: '签订合同',
    icon: Document,
    path: '/tenant-mobile/contract'
  },
  // 在职管理
  {
    id: 'living-expense',
    title: '生活费管理',
    icon: Coin,
    path: '/tenant/on-duty/living-expense'
  },
  {
    id: 'salary-management',
    title: '工资管理',
    icon: Money,
    path: '/tenant/on-duty/salary'
  },
  {
    id: 'claim-management',
    title: '理赔管理',
    icon: FirstAidKit,
    path: '/tenant/on-duty/claim'
  },
  {
    id: 'communication-management',
    title: '沟通管理',
    icon: Phone,
    path: '/tenant/on-duty/communication'
  },
  {
    id: 'entertainment-activity',
    title: '文娱活动',
    icon: Film,
    path: '/tenant/on-duty/entertainment'
  },
  {
    id: 'registration-management',
    title: '报名管理',
    icon: Calendar,
    path: '/tenant/on-duty/registration'
  },
  {
    id: 'publish-news',
    title: '发布资讯',
    icon: Notebook,
    path: '/tenant/on-duty/news'
  },
  {
    id: 'community-management',
    title: '社团管理',
    icon: Collection,
    path: '/tenant/on-duty/community'
  },
  {
    id: 'special-case',
    title: '特殊情况',
    icon: Star,
    path: '/tenant/on-duty/special-case'
  },
  {
    id: 'insurance-management',
    title: '保险管理',
    icon: FirstAidKit,
    path: '/tenant/on-duty/insurance'
  },
  {
    id: 'insurance-record',
    title: '参保登记',
    icon: Document,
    path: '/tenant/on-duty/insurance-record'
  },
  {
    id: 'attendance-management',
    title: '考勤管理',
    icon: Timer,
    path: '/tenant-mobile/attendance'
  },
  {
    id: 'leave-management',
    title: '请假管理',
    icon: AlarmClock,
    path: '/tenant-mobile/on-duty/leave'
  },
  {
    id: 'transfer-management',
    title: '调岗管理',
    icon: SetUp,
    path: '/tenant/on-duty/transfer'
  },
  {
    id: 'reward-punishment',
    title: '奖惩管理',
    icon: Trophy,
    path: '/tenant/on-duty/reward-punishment'
  },
  {
    id: 'learning-material',
    title: '学习材料',
    icon: Reading,
    path: '/tenant/on-duty/learning-material'
  },
  {
    id: 'question-bank',
    title: '题库管理',
    icon: Notebook,
    path: '/tenant/on-duty/question-bank'
  },
  {
    id: 'learning-time',
    title: '学习时长',
    icon: Timer,
    path: '/tenant/on-duty/learning-time'
  },
  {
    id: 'exam-management',
    title: '考试管理',
    icon: Postcard,
    path: '/tenant/on-duty/exam'
  },
  {
    id: 'exam-result',
    title: '考试成绩',
    icon: Star,
    path: '/tenant/on-duty/exam-result'
  },
  {
    id: 'abnormal-management',
    title: '异常管理',
    icon: Warning,
    path: '/tenant/on-duty/abnormal'
  },
  {
    id: 'complaint-suggestion',
    title: '投诉/建议',
    icon: ChatLineSquare,
    path: '/tenant/on-duty/complaint'
  },
  // 离职管理
  {
    id: 'resignation-management',
    title: '离职管理',
    icon: UserFilled,
    path: '/tenant-mobile/resignation'
  },
  // 结算管理
  {
    id: 'referral',
    title: '工作转介绍',
    icon: Promotion,
    path: '/tenant/referral'
  },
  {
    id: 'commission',
    title: '佣金发放',
    icon: Coin,
    path: '/tenant/commission'
  },
  {
    id: 'settlement-management',
    title: '结算管理',
    icon: Money,
    path: '/tenant-mobile/settlement'
  },
  // 系统管理
  {
    id: 'departments',
    title: '部门管理',
    icon: OfficeBuilding,
    path: '/tenant/departments'
  },
  {
    id: 'roles',
    title: '角色管理',
    icon: Key,
    path: '/tenant/roles'
  }
]

const selectedCount = computed(() => {
  return selectedItems.value.length
})

const isMaxSelected = computed(() => {
  return selectedItems.value.length >= 8
})

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

const loadSavedSettings = () => {
  try {
    const savedSettings = localStorage.getItem('laborCompanyQuickAccessSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      selectedItems.value = settings.selectedItems && settings.selectedItems.length > 0 ? settings.selectedItems : availableFunctions.slice(0, 8).map(item => item.id)
    } else {
      selectedItems.value = availableFunctions.slice(0, 8).map(item => item.id)
    }
  } catch (error) {
    console.error('加载设置失败:', error)
    selectedItems.value = availableFunctions.slice(0, 8).map(item => item.id)
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
    localStorage.setItem('laborCompanyQuickAccessSettings', JSON.stringify(settings))
    ElMessage.success('设置保存成功')
    router.push('/tenant/home')
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败，请稍后重试')
  }
}

const cancelSettings = () => {
  router.push('/tenant/home')
}

onMounted(() => {
  loadSavedSettings()
})
</script>

<template>
  <div class="quick-access-settings">
    <div class="page-header">
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
        <span>请选择最多8个常用功能作为首页快捷入口</span>
        <div class="selected-count">
          已选择: {{ selectedCount }}/8
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
