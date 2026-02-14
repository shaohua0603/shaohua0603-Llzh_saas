<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon } from 'element-plus'
import { Warning, InfoFilled, Calendar, Check, Close, ArrowRight } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// 分类选项
const categories = ref([
  { label: '全部', value: 'all' },
  { label: '一般情况', value: 'general' },
  { label: '工伤事故', value: 'work_injury' }
])

const selectedCategory = ref('all')

// 模拟特殊情况数据
const specialCases = ref([
  {
    id: 1,
    title: '工作场所滑倒',
    type: 'work_injury',
    date: '2026-02-01',
    status: '处理中',
    description: '在车间行走时因地面湿滑不慎滑倒，导致轻微擦伤',
    handlingMethod: '已送医检查，安排休息',
    result: '待进一步观察'
  },
  {
    id: 2,
    title: '设备故障导致延误',
    type: 'general',
    date: '2026-01-25',
    status: '已解决',
    description: '操作的机器出现故障，导致生产任务延误',
    handlingMethod: '联系维修人员及时修复',
    result: '设备已恢复正常，任务已完成'
  },
  {
    id: 3,
    title: '原材料质量问题',
    type: 'general',
    date: '2026-01-20',
    status: '已解决',
    description: '收到的原材料存在质量缺陷，影响生产',
    handlingMethod: '联系供应商更换合格原材料',
    result: '已收到新的原材料，生产正常进行'
  },
  {
    id: 4,
    title: '操作时手指轻微受伤',
    type: 'work_injury',
    date: '2026-01-15',
    status: '已解决',
    description: '操作机器时不小心被零件划伤手指',
    handlingMethod: '及时消毒处理，包扎伤口',
    result: '伤口已愈合，无大碍'
  }
])

// 过滤后的特殊情况
const filteredCases = ref([])

// 过滤特殊情况
const filterCases = () => {
  if (selectedCategory.value === 'all') {
    filteredCases.value = [...specialCases.value]
  } else {
    filteredCases.value = specialCases.value.filter(caseItem => caseItem.type === selectedCategory.value)
  }
}

// 跳转到特殊情况详情页
const goToSpecialCaseDetail = (caseItem) => {
  router.push(`/worker/special-case-detail/${caseItem.id}`)
}

onMounted(() => {
  filterCases()
})
</script>

<template>
  <div class="worker-special-cases">
    <BackButton />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>特殊情况</h2>
    </div>
    
    <!-- 分类筛选 -->
    <div class="category-filter">
      <div class="filter-content">
        <div 
          v-for="category in categories" 
          :key="category.value"
          class="filter-item"
          :class="{ active: selectedCategory === category.value }"
          @click="selectedCategory = category.value; filterCases()"
        >
          {{ category.label }}
        </div>
      </div>
    </div>
    
    <!-- 特殊情况列表 -->
    <div class="special-cases-list">
      <div v-if="filteredCases.length === 0" class="empty">
        <el-icon><InfoFilled /></el-icon>
        <span>暂无特殊情况记录</span>
      </div>
      <div v-else class="special-cases-items">
        <div 
          v-for="caseItem in filteredCases" 
          :key="caseItem.id" 
          class="special-case-item"
          :class="{ 'work-injury': caseItem.type === 'work_injury' }"
          @click="goToSpecialCaseDetail(caseItem)"
        >
          <!-- 特殊情况类型图标 -->
          <div class="case-icon">
            <el-icon v-if="caseItem.type === 'work_injury'" class="warning-icon"><Warning /></el-icon>
            <el-icon v-else class="info-icon"><InfoFilled /></el-icon>
          </div>
          
          <!-- 特殊情况信息 -->
          <div class="case-info">
            <div class="case-header">
              <h3 class="case-title">{{ caseItem.title }}</h3>
              <span class="case-type">{{ caseItem.type === 'work_injury' ? '工伤事故' : '一般情况' }}</span>
            </div>
            <p class="case-description">{{ caseItem.description }}</p>
            <div class="case-meta">
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ caseItem.date }}</span>
              </div>
              <div class="meta-item status">
            <el-icon v-if="caseItem.status === '已解决'" class="status-success"><Check /></el-icon>
            <el-icon v-else class="status-warning"><Close /></el-icon>
            <span :class="{ 'status-success': caseItem.status === '已解决', 'status-warning': caseItem.status === '处理中' }">{{ caseItem.status }}</span>
          </div>
            </div>
          </div>
          
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-special-cases {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #007bff;
  color: #fff;
  padding: 20px 15px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.category-filter {
  background-color: #fff;
  margin: 15px;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-content {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.filter-item {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-item:hover {
  background-color: #e9ecef;
}

.filter-item.active {
  background-color: #007bff;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.special-cases-list {
  padding: 20px 15px 20px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #007bff;
}

.empty span {
  font-size: 14px;
  color: #666;
}

.special-cases-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.special-case-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #e9ecef;
  cursor: pointer;
}

.special-case-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #007bff;
}

.special-case-item.work-injury {
  border-left: 4px solid #dc3545;
}

.case-icon {
  margin-right: 16px;
  flex-shrink: 0;
}

.case-icon i {
  font-size: 24px;
}

.warning-icon {
  color: #dc3545;
}

.info-icon {
  color: #007bff;
}

.case-info {
  flex: 1;
  min-width: 0;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.case-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
}

.case-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.special-case-item.work-injury .case-type {
  background-color: #f8d7da;
  color: #dc3545;
}

.special-case-item:not(.work-injury) .case-type {
  background-color: #e3f2fd;
  color: #007bff;
}

.case-description {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.case-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.meta-item i {
  margin-right: 6px;
  font-size: 12px;
  flex-shrink: 0;
}

.status-success {
  color: #28a745;
}

.status-warning {
  color: #ffc107;
}

.arrow-icon {
  font-size: 16px;
  color: #999;
  margin-left: 12px;
  flex-shrink: 0;
  margin-top: 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 15px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .category-filter {
    margin: 10px 15px;
    padding: 12px;
  }
  
  .filter-content {
    gap: 8px;
  }
  
  .filter-item {
    padding: 6px 14px;
    font-size: 13px;
  }
  
  .special-cases-list {
    padding: 0 15px 15px;
  }
  
  .empty {
    padding: 40px 15px;
  }
  
  .empty i {
    font-size: 40px;
  }
  
  .special-cases-items {
    gap: 12px;
  }
  
  .special-case-item {
    padding: 14px;
  }
  
  .case-icon {
    margin-right: 12px;
  }
  
  .case-icon i {
    font-size: 20px;
  }
  
  .case-title {
    font-size: 15px;
  }
  
  .case-description {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .meta-item {
    font-size: 11px;
  }
}
</style>