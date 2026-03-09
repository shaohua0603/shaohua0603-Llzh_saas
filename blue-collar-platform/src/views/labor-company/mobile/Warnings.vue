<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const warnings = ref<any[]>([])
const loading = ref(true)

const getWarnings = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    warnings.value = [
      {
        id: 1,
        title: '考勤异常预警',
        content: '工人张三今日上班打卡迟到超过30分钟',
        time: '2026-02-15 09:35',
        type: '考勤',
        level: 'warning',
        status: 'pending'
      },
      {
        id: 2,
        title: '合同到期预警',
        content: '工人李四的劳动合同将于7天后到期',
        time: '2026-02-14 10:00',
        type: '合同',
        level: 'danger',
        status: 'pending'
      },
      {
        id: 3,
        title: '工资发放预警',
        content: '本月工资核算已完成，请确认发放',
        time: '2026-02-13 15:30',
        type: '工资',
        level: 'info',
        status: 'resolved'
      },
      {
        id: 4,
        title: '保险到期预警',
        content: '工人王五的商业保险将于15天后到期',
        time: '2026-02-12 14:20',
        type: '保险',
        level: 'warning',
        status: 'pending'
      },
      {
        id: 5,
        title: '证件过期预警',
        content: '工人赵六的身份证将于30天后过期',
        time: '2026-02-11 11:00',
        type: '证件',
        level: 'danger',
        status: 'pending'
      }
    ]
  } catch (error) {
    ElMessage.error('获取预警信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (warning: any) => {
  router.push(`/tenant/warning-detail/${warning.id}`)
}

const handleIgnore = (warning: any, event: Event) => {
  event.stopPropagation()
  warning.status = 'ignored'
  ElMessage.success('已忽略')
}

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    danger: '#f56c6c',
    warning: '#e6a23c',
    info: '#409eff'
  }
  return colors[level] || '#909399'
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '考勤': '#e6a23c',
    '合同': '#f56c6c',
    '工资': '#67c23a',
    '保险': '#409eff',
    '证件': '#909399'
  }
  return colors[type] || '#909399'
}

onMounted(() => {
  getWarnings()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>预警信息</h2>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="warnings.length === 0" class="empty-state">
        <p>暂无预警信息</p>
      </div>
      
      <div v-else class="warning-list">
        <div 
          v-for="warning in warnings" 
          :key="warning.id" 
          class="warning-item"
          :class="{ ignored: warning.status === 'ignored' }"
          @click="goToDetail(warning)"
        >
          <div class="warning-header">
            <div class="warning-type" :style="{ background: getTypeColor(warning.type) }">
              {{ warning.type }}
            </div>
            <div class="warning-level" :style="{ color: getLevelColor(warning.level) }">
              <span class="level-dot" :style="{ background: getLevelColor(warning.level) }"></span>
              {{ warning.level === 'danger' ? '紧急' : warning.level === 'warning' ? '重要' : '一般' }}
            </div>
          </div>
          
          <h3 class="warning-title">{{ warning.title }}</h3>
          <p class="warning-content">{{ warning.content }}</p>
          
          <div class="warning-footer">
            <span class="warning-time">{{ warning.time }}</span>
            <el-button 
              v-if="warning.status === 'pending'" 
              size="small" 
              @click="handleIgnore(warning, $event)"
            >
              忽略
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.page-content {
  padding: 15px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #e6a23c;
}

.warning-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.warning-item.ignored {
  opacity: 0.5;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.warning-type {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
}

.warning-level {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
}

.level-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.warning-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.warning-content {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.warning-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-time {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .page-content {
    padding: 10px;
  }
  
  .warning-item {
    padding: 12px;
  }
  
  .warning-title {
    font-size: 15px;
  }
  
  .warning-content {
    font-size: 13px;
  }
}
</style>
