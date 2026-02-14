<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElIcon, ElMessage } from 'element-plus'
import { Star, User, Calendar, MapLocation, Check, Close, Phone, ChatLineRound } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const community = ref(null)
const loading = ref(true)
const isJoined = ref(false)

// 模拟社团数据
const mockCommunities = [
  {
    id: 1,
    name: '篮球社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=basketball%20club%20logo%20with%20basketball%20icon%2C%20simple%20design%2C%20blue%20and%20orange%20colors&image_size=square',
    description: '热爱篮球的工友们的聚集地，每周定期组织比赛和训练。我们欢迎所有热爱篮球的同事加入，无论水平高低，只为享受篮球带来的快乐和友谊。',
    members: 28,
    category: '体育类',
    activityTime: '每周二、四晚上 19:00-21:00',
    activityLocation: '公司篮球场',
    contactPerson: '张教练',
    contactPhone: '13800138001',
    contactWechat: 'basketball_coach',
    joinRequirements: '1. 热爱篮球运动\n2. 遵守社团纪律\n3. 积极参加社团活动\n4. 按时缴纳社费',
    recentActivities: [
      {
        id: 1,
        title: '周末友谊赛',
        date: '2026-02-15',
        time: '14:00-16:00',
        location: '公司篮球场',
        description: '与兄弟公司篮球队进行友谊赛'
      },
      {
        id: 2,
        title: '常规训练',
        date: '2026-02-13',
        time: '19:00-21:00',
        location: '公司篮球场',
        description: '基础技术训练和战术演练'
      }
    ],
    joined: true
  },
  {
    id: 2,
    name: '书法社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20calligraphy%20club%20logo%20with%20brush%20stroke%20icon%2C%20elegant%20design%2C%20black%20and%20red%20colors&image_size=square',
    description: '传承中华传统文化，提升书法技艺，修身养性。我们致力于为书法爱好者提供一个交流学习的平台，共同提高书法水平。',
    members: 15,
    category: '文化类',
    activityTime: '每周三晚上 18:30-20:30',
    activityLocation: '员工活动中心',
    contactPerson: '王老师',
    contactPhone: '13800138002',
    contactWechat: 'calligraphy_teacher',
    joinRequirements: '1. 对书法有兴趣\n2. 能够坚持练习\n3. 遵守社团活动时间\n4. 自备基础书法工具',
    recentActivities: [
      {
        id: 1,
        title: '书法展览',
        date: '2026-02-18',
        time: '10:00-16:00',
        location: '员工活动中心',
        description: '社团成员书法作品展览'
      },
      {
        id: 2,
        title: '书法讲座',
        date: '2026-02-10',
        time: '18:30-20:30',
        location: '员工活动中心',
        description: '邀请专业书法老师进行讲座'
      }
    ],
    joined: true
  },
  {
    id: 3,
    name: '瑜伽社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yoga%20club%20logo%20with%20lotus%20flower%20icon%2C%20serene%20design%2C%20purple%20and%20white%20colors&image_size=square',
    description: '放松身心，增强体质，提升专注力和平衡能力。我们提供专业的瑜伽指导，适合各个水平的参与者。',
    members: 22,
    category: '体育类',
    activityTime: '每周一、五晚上 18:00-19:30',
    activityLocation: '员工活动中心',
    contactPerson: '李教练',
    contactPhone: '13800138003',
    contactWechat: 'yoga_coach',
    joinRequirements: '1. 对瑜伽有兴趣\n2. 穿着舒适运动服装\n3. 自备瑜伽垫\n4. 遵守课堂纪律',
    recentActivities: [
      {
        id: 1,
        title: '瑜伽公开课',
        date: '2026-02-20',
        time: '18:00-19:30',
        location: '员工活动中心',
        description: '面向全体员工的瑜伽公开课'
      },
      {
        id: 2,
        title: '常规瑜伽课',
        date: '2026-02-15',
        time: '18:00-19:30',
        location: '员工活动中心',
        description: '社团常规瑜伽课程'
      }
    ],
    joined: false
  }
]

// 获取社团详情
const getCommunityDetail = () => {
  loading.value = true
  const id = Number(route.params.id)
  
  // 模拟异步请求
  setTimeout(() => {
    const foundCommunity = mockCommunities.find(c => c.id === id)
    if (foundCommunity) {
      community.value = foundCommunity
      isJoined.value = foundCommunity.joined
    } else {
      ElMessage.error('社团不存在')
      router.push('/worker/community')
    }
    loading.value = false
  }, 500)
}

// 加入/退出社团
const toggleJoinCommunity = () => {
  isJoined.value = !isJoined.value
  if (isJoined.value) {
    ElMessage.success(`成功加入${community.value.name}`)
    community.value.members += 1
  } else {
    ElMessage.info(`已退出${community.value.name}`)
    community.value.members -= 1
  }
}

// 返回社团列表
const goBack = () => {
  router.push('/worker/community')
}

onMounted(() => {
  getCommunityDetail()
})
</script>

<template>
  <div class="worker-community-detail">
    <BackButton />
    
    <!-- 加载中 -->
    <div v-if="loading" class="loading">
      <el-icon class="is-loading"><Star /></el-icon>
      <span>加载中...</span>
    </div>
    
    <!-- 社团详情 -->
    <div v-else-if="community" class="community-detail">
      <!-- 社团头部信息 -->
      <div class="community-header">
        <div class="community-logo">
          <img :src="community.logo" :alt="community.name" />
        </div>
        <div class="community-info">
          <h1 class="community-name">{{ community.name }}</h1>
          <span class="community-category">{{ community.category }}</span>
          <p class="community-description">{{ community.description }}</p>
        </div>
      </div>
      
      <!-- 社团基本信息 -->
      <div class="community-meta">
        <div class="meta-item">
          <el-icon><User /></el-icon>
          <span>{{ community.members }}人已加入</span>
        </div>
        <div class="meta-item">
          <el-icon><Calendar /></el-icon>
          <span>{{ community.activityTime }}</span>
        </div>
        <div class="meta-item">
          <el-icon><MapLocation /></el-icon>
          <span>{{ community.activityLocation }}</span>
        </div>
      </div>
      
      <!-- 社团要求 -->
      <div class="community-section">
        <h3 class="section-title">加入要求</h3>
        <ul class="requirement-list">
          <li v-for="(requirement, index) in community.joinRequirements.split('\n')" :key="index">
            <el-icon class="requirement-icon"><Check /></el-icon>
            <span>{{ requirement }}</span>
          </li>
        </ul>
      </div>
      
      <!-- 近期活动 -->
      <div class="community-section">
        <h3 class="section-title">近期活动</h3>
        <div class="activity-list">
          <div v-for="(activity, index) in community.recentActivities" :key="index" class="activity-item">
            <div class="activity-date">
              <span class="date">{{ activity.date }}</span>
              <span class="time">{{ activity.time }}</span>
            </div>
            <div class="activity-info">
              <h4 class="activity-title">{{ activity.title }}</h4>
              <p class="activity-description">{{ activity.description }}</p>
              <div class="activity-location">
                <el-icon><MapLocation /></el-icon>
                <span>{{ activity.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 联系方式 -->
      <div class="community-section">
        <h3 class="section-title">联系方式</h3>
        <div class="contact-info">
          <div class="contact-item">
            <el-icon><User /></el-icon>
            <span>{{ community.contactPerson }}</span>
          </div>
          <div class="contact-item">
            <el-icon><Phone /></el-icon>
            <span>{{ community.contactPhone }}</span>
          </div>
          <div class="contact-item">
            <el-icon><ChatLineRound /></el-icon>
            <span>{{ community.contactWechat }}</span>
          </div>
        </div>
      </div>
      
      <!-- 底部操作按钮 -->
      <div class="bottom-actions">
        <button 
          v-if="!isJoined" 
          class="join-button"
          @click="toggleJoinCommunity"
        >
          <el-icon><Check /></el-icon>
          <span>加入社团</span>
        </button>
        <button 
          v-else 
          class="cancel-button"
          @click="toggleJoinCommunity"
        >
          <el-icon><Close /></el-icon>
          <span>退出社团</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-community-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #999;
}

.loading i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #007bff;
}

/* 社团头部信息 */
.community-header {
  background-color: #fff;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.community-logo {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.community-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.community-info {
  flex: 1;
}

.community-name {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.community-category {
  display: inline-block;
  background-color: #e3f2fd;
  color: #007bff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
}

.community-description {
  margin: 0;
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

/* 社团基本信息 */
.community-meta {
  background-color: #fff;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #475569;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-item i {
  margin-right: 12px;
  color: #007bff;
  font-size: 18px;
  flex-shrink: 0;
}

/* 社团段落样式 */
.community-section {
  background-color: #fff;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: bold;
  color: #1e293b;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #007bff;
  padding-bottom: 12px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #007bff;
  border-radius: 2px;
  margin-right: 12px;
}

/* 要求列表样式 */
.requirement-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.requirement-list li {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.requirement-list li:last-child {
  margin-bottom: 0;
}

.requirement-icon {
  margin-right: 12px;
  color: #28a745;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 活动列表样式 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.activity-date {
  flex-shrink: 0;
  text-align: center;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  min-width: 100px;
}

.activity-date .date {
  display: block;
  font-weight: bold;
  font-size: 14px;
}

.activity-date .time {
  display: block;
  font-size: 12px;
  margin-top: 4px;
}

.activity-info {
  flex: 1;
}

.activity-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.activity-description {
  margin: 0 0 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.activity-location {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
}

.activity-location i {
  margin-right: 8px;
  color: #007bff;
}

/* 联系方式样式 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #475569;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.contact-item i {
  margin-right: 12px;
  color: #007bff;
  font-size: 18px;
  flex-shrink: 0;
}

/* 底部操作按钮 */
.bottom-actions {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20px 24px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  z-index: 1000;
  border-top: 1px solid #e9ecef;
}

.join-button {
  width: 100%;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.join-button:hover {
  background-color: #0069d9;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.cancel-button {
  width: 100%;
  background-color: #fff;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 25px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.cancel-button:hover {
  background-color: #dc3545;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .community-header {
    padding: 20px 16px;
    gap: 16px;
  }
  
  .community-logo {
    width: 80px;
    height: 80px;
  }
  
  .community-name {
    font-size: 20px;
    margin-bottom: 8px;
  }
  
  .community-description {
    font-size: 14px;
  }
  
  .community-meta {
    padding: 16px;
    gap: 12px;
  }
  
  .meta-item {
    font-size: 14px;
  }
  
  .community-section {
    padding: 20px 16px;
  }
  
  .section-title {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .requirement-list li {
    font-size: 13px;
    padding: 10px;
  }
  
  .activity-item {
    padding: 12px;
    gap: 12px;
  }
  
  .activity-date {
    min-width: 80px;
    padding: 8px;
  }
  
  .activity-date .date {
    font-size: 12px;
  }
  
  .activity-date .time {
    font-size: 10px;
  }
  
  .activity-title {
    font-size: 14px;
  }
  
  .activity-description {
    font-size: 13px;
  }
  
  .contact-item {
    font-size: 14px;
    padding: 10px;
  }
  
  .bottom-actions {
    bottom: 55px;
    padding: 16px;
  }
  
  .join-button,
  .cancel-button {
    padding: 14px;
    font-size: 15px;
  }
}
</style>