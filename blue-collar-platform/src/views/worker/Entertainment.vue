<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar, User, Star, Tag, ArrowRight, Filter, MapLocation } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const activeTab = ref('ongoing') // ongoing 或 joined
const activeType = ref('all') // all, culture, dating, skill, other

// 活动类型选项
const typeOptions = [
  { label: '全部活动', value: 'all' },
  { label: '文体活动', value: 'culture' },
  { label: '相亲活动', value: 'dating' },
  { label: '技能提升', value: 'skill' },
  { label: '其他活动', value: 'other' }
]

// 模拟活动数据
const mockActivities = [
  {
    id: 1,
    title: '春季篮球友谊赛',
    type: 'culture',
    typeName: '文体活动',
    organizer: '公司工会',
    startDate: '2026-03-15',
    startTime: '14:00',
    endDate: '2026-03-15',
    endTime: '16:00',
    location: '公司篮球场',
    participants: 23,
    maxParticipants: 30,
    description: '欢迎各位篮球爱好者积极参与，展示风采，增进友谊。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=basketball%20game%20on%20outdoor%20court%20with%20workers%20playing&image_size=landscape_16_9',
    joined: true
  },
  {
    id: 6,
    title: '为期两天的技能培训',
    type: 'skill',
    typeName: '技能提升',
    organizer: '培训部',
    startDate: '2026-03-28',
    startTime: '09:00',
    endDate: '2026-03-29',
    endTime: '17:00',
    location: '公司培训中心',
    participants: 20,
    maxParticipants: 25,
    description: '为期两天的职业技能提升培训，包括理论学习和实操训练。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20training%20session%20in%20classroom%20with%20workers%20learning&image_size=landscape_16_9',
    joined: false
  },
  {
    id: 2,
    title: '单身青年交友会',
    type: 'dating',
    typeName: '相亲活动',
    organizer: '人力资源部',
    startDate: '2026-03-20',
    startTime: '19:00',
    endDate: '2026-03-20',
    endTime: '21:00',
    location: '公司活动中心',
    participants: 45,
    maxParticipants: 50,
    description: '为单身青年提供交流机会，促进员工之间的了解和友谊。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=social%20gathering%20for%20young%20people%20with%20games%20and%20activities&image_size=landscape_16_9',
    joined: false
  },
  {
    id: 3,
    title: '职业技能提升培训',
    type: 'skill',
    typeName: '技能提升',
    organizer: '培训部',
    startDate: '2026-03-10',
    startTime: '09:00',
    endDate: '2026-03-10',
    endTime: '12:00',
    location: '公司会议室A',
    participants: 18,
    maxParticipants: 25,
    description: '提升专业技能，助力职业发展。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20training%20session%20in%20classroom%20with%20workers%20learning&image_size=landscape_16_9',
    joined: true
  },
  {
    id: 4,
    title: '春日户外踏青',
    type: 'other',
    typeName: '其他活动',
    organizer: '工会',
    startDate: '2026-03-25',
    startTime: '09:00',
    endDate: '2026-03-25',
    endTime: '16:00',
    location: '城市公园',
    participants: 31,
    maxParticipants: 40,
    description: '拥抱春天，感受自然，放松身心。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=outdoor%20spring%20hiking%20trip%20with%20group%20of%20people%20in%20park&image_size=landscape_16_9',
    joined: false
  },
  {
    id: 5,
    title: '员工生日会',
    type: 'culture',
    typeName: '文体活动',
    organizer: '行政部',
    startDate: '2026-03-05',
    startTime: '17:30',
    endDate: '2026-03-05',
    endTime: '19:00',
    location: '公司餐厅',
    participants: 15,
    maxParticipants: 20,
    description: '为三月份生日的员工举办集体生日会，共度美好时光。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=birthday%20party%20celebration%20with%20cake%20and%20colleagues&image_size=landscape_16_9',
    joined: false
  }
]

const activities = ref([])

// 获取活动列表
const getActivities = () => {
  // 模拟异步请求
  setTimeout(() => {
    let filteredActivities = [...mockActivities]
    
    // 按标签过滤
    if (activeTab.value === 'joined') {
      filteredActivities = filteredActivities.filter(activity => activity.joined)
    }
    
    // 按类型过滤
    if (activeType.value !== 'all') {
      filteredActivities = filteredActivities.filter(activity => activity.type === activeType.value)
    }
    
    activities.value = filteredActivities
  }, 500)
}

// 进入活动详情页
const goToActivityDetail = (activity) => {
  router.push(`/worker/entertainment-detail/${activity.id}`)
}

// 切换标签页
const handleTabChange = (tab) => {
  activeTab.value = tab
  getActivities()
}

// 切换活动类型
const handleTypeChange = (type) => {
  activeType.value = type
  getActivities()
}

// 页面加载时获取数据
onMounted(() => {
  getActivities()
})
</script>

<template>
  <div class="worker-entertainment">
    <BackButton />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>文娱活动</h2>
    </div>
    
    <!-- 标签页 -->
    <div class="activity-tabs">
      <div class="tab-buttons">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'ongoing' }"
          @click="handleTabChange('ongoing')"
        >
          正在进行的活动
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'joined' }"
          @click="handleTabChange('joined')"
        >
          我参与的活动
        </button>
      </div>
    </div>
    
    <!-- 活动类型筛选 -->
    <div class="activity-type-filter">
      <div class="filter-content">
        <el-icon class="filter-icon"><Filter /></el-icon>
        <div class="type-buttons">
          <button 
            v-for="option in typeOptions" 
            :key="option.value"
            class="type-button"
            :class="{ active: activeType === option.value }"
            @click="handleTypeChange(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 活动列表 -->
    <div class="activity-list">
      <div v-if="activities.length === 0" class="empty">
        <el-icon><Calendar /></el-icon>
        <span>暂无活动信息</span>
      </div>
      <div v-else class="activity-items">
        <div 
          v-for="activity in activities" 
          :key="activity.id" 
          class="activity-item"
          @click="goToActivityDetail(activity)"
        >
          <!-- 活动图片 -->
          <div class="activity-image">
            <img :src="activity.image" :alt="activity.title" />
            <div class="activity-type-tag">{{ activity.typeName }}</div>
            <div v-if="activity.joined" class="joined-tag">已报名</div>
          </div>
          
          <!-- 活动信息 -->
          <div class="activity-info">
            <h3 class="activity-title">{{ activity.title }}</h3>
            <div class="activity-meta">
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span v-if="String(activity.startDate) === String(activity.endDate)">
                  {{ activity.startDate }} {{ activity.startTime }}-{{ activity.endTime }}
                </span>
                <span v-else>
                  {{ activity.startDate }} {{ activity.startTime }} 至 {{ activity.endDate }} {{ activity.endTime }}
                </span>
              </div>
              <div class="meta-item">
                <el-icon><MapLocation /></el-icon>
                <span>{{ activity.location }}</span>
              </div>
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>{{ activity.participants }}/{{ activity.maxParticipants }}人参与</span>
              </div>
            </div>
            <p class="activity-description">{{ activity.description }}</p>
            <div class="activity-footer">
              <span class="organizer">{{ activity.organizer }}</span>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-entertainment {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: #007bff;
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
  color: #fff;
}

/* 标签页样式 */
.activity-tabs {
  background-color: #fff;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-buttons {
  display: flex;
  padding: 0 15px;
}

.tab-button {
  flex: 1;
  height: 50px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #007bff;
}

.tab-button.active {
  color: #007bff;
  font-weight: bold;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  background-color: #007bff;
  border-radius: 3px;
}

/* 活动类型筛选样式 */
.activity-type-filter {
  background-color: #fff;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.filter-content {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
}

.filter-icon {
  font-size: 18px;
  color: #007bff;
  margin-right: 12px;
}

.type-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.type-button {
  padding: 6px 16px;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  background-color: #fff;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.type-button:hover {
  border-color: #007bff;
  color: #007bff;
}

.type-button.active {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

/* 活动列表样式 */
.activity-list {
  padding: 0 15px 20px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #007bff;
}

.empty span {
  font-size: 14px;
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e9ecef;
}

.activity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #007bff;
}

.activity-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #f8f9fa;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.activity-item:hover .activity-image img {
  transform: scale(1.05);
}

.activity-type-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #007bff;
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.joined-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #28a745;
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.activity-info {
  padding: 16px;
}

.activity-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
}

.meta-item i {
  margin-right: 8px;
  color: #007bff;
  font-size: 14px;
  flex-shrink: 0;
}

.activity-description {
  margin: 0 0 16px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.organizer {
  font-size: 12px;
  color: #666;
  background-color: #f8f9fa;
  padding: 3px 10px;
  border-radius: 12px;
}

.arrow-icon {
  font-size: 16px;
  color: #999;
  transition: color 0.3s ease;
}

.activity-item:hover .arrow-icon {
  color: #007bff;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 15px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .tab-button {
    font-size: 13px;
  }
  
  .filter-content {
    padding: 14px 16px;
  }
  
  .filter-icon {
    font-size: 16px;
  }
  
  .type-button {
    font-size: 12px;
    padding: 5px 14px;
  }
  
  .activity-image {
    height: 160px;
  }
  
  .activity-info {
    padding: 14px;
  }
  
  .activity-title {
    font-size: 15px;
  }
  
  .meta-item {
    font-size: 12px;
  }
  
  .activity-description {
    font-size: 12px;
  }
}
</style>