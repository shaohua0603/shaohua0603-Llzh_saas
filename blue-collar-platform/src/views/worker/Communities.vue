<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon, ElMessage } from 'element-plus'
import { Star, User, Calendar, MapLocation, Check, Plus } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// 模拟社团数据
const communities = ref([
  {
    id: 1,
    name: '篮球社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=basketball%20club%20logo%20with%20basketball%20icon%2C%20simple%20design%2C%20blue%20and%20orange%20colors&image_size=square',
    description: '热爱篮球的工友们的聚集地，每周定期组织比赛和训练',
    members: 28,
    category: '体育类',
    activityTime: '每周二、四晚上 19:00-21:00',
    activityLocation: '公司篮球场',
    joined: true
  },
  {
    id: 2,
    name: '书法社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20calligraphy%20club%20logo%20with%20brush%20stroke%20icon%2C%20elegant%20design%2C%20black%20and%20red%20colors&image_size=square',
    description: '传承中华传统文化，提升书法技艺，修身养性',
    members: 15,
    category: '文化类',
    activityTime: '每周三晚上 18:30-20:30',
    activityLocation: '员工活动中心',
    joined: true
  },
  {
    id: 3,
    name: '瑜伽社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yoga%20club%20logo%20with%20lotus%20flower%20icon%2C%20serene%20design%2C%20purple%20and%20white%20colors&image_size=square',
    description: '放松身心，增强体质，提升专注力和平衡能力',
    members: 22,
    category: '体育类',
    activityTime: '每周一、五晚上 18:00-19:30',
    activityLocation: '员工活动中心',
    joined: false
  },
  {
    id: 4,
    name: '摄影社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=photography%20club%20logo%20with%20camera%20icon%2C%20modern%20design%2C%20black%20and%20yellow%20colors&image_size=square',
    description: '记录美好瞬间，分享摄影技巧，捕捉生活点滴',
    members: 18,
    category: '兴趣类',
    activityTime: '每周六上午 9:00-11:00',
    activityLocation: '户外或公司活动中心',
    joined: false
  },
  {
    id: 5,
    name: '读书会',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20club%20logo%20with%20open%20book%20icon%2C%20intellectual%20design%2C%20brown%20and%20green%20colors&image_size=square',
    description: '分享读书心得，拓展知识面，培养阅读习惯',
    members: 12,
    category: '文化类',
    activityTime: '每周日下午 14:00-16:00',
    activityLocation: '员工活动中心',
    joined: false
  },
  {
    id: 6,
    name: '足球社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=football%20club%20logo%20with%20soccer%20ball%20icon%2C%20dynamic%20design%2C%20green%20and%20white%20colors&image_size=square',
    description: '挥洒汗水，享受足球乐趣，增强团队合作精神',
    members: 30,
    category: '体育类',
    activityTime: '每周六下午 15:00-17:00',
    activityLocation: '公司足球场',
    joined: false
  }
])

// 分类选项
const categories = ref([
  { label: '全部', value: 'all' },
  { label: '体育类', value: '体育类' },
  { label: '文化类', value: '文化类' },
  { label: '兴趣类', value: '兴趣类' }
])

const selectedCategory = ref('all')

// 加入/退出社团
const toggleJoinCommunity = (community) => {
  community.joined = !community.joined
  if (community.joined) {
    ElMessage.success(`成功加入${community.name}`)
    community.members += 1
  } else {
    ElMessage.info(`已退出${community.name}`)
    community.members -= 1
  }
}

// 跳转到社团详情页
const goToCommunityDetail = (community) => {
  router.push(`/worker/community-detail/${community.id}`)
}

// 过滤社团
const filteredCommunities = ref([])

const filterCommunities = () => {
  if (selectedCategory.value === 'all') {
    filteredCommunities.value = [...communities.value]
  } else {
    filteredCommunities.value = communities.value.filter(community => community.category === selectedCategory.value)
  }
}

onMounted(() => {
  filterCommunities()
})
</script>

<template>
  <div class="worker-communities">
    <BackButton />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>社团列表</h2>
    </div>
    
    <!-- 分类筛选 -->
    <div class="category-filter">
      <div class="filter-content">
        <div 
          v-for="category in categories" 
          :key="category.value"
          class="filter-item"
          :class="{ active: selectedCategory === category.value }"
          @click="selectedCategory = category.value; filterCommunities()"
        >
          {{ category.label }}
        </div>
      </div>
    </div>
    
    <!-- 社团列表 -->
    <div class="community-list">
      <div v-if="filteredCommunities.length === 0" class="empty">
        <el-icon><Star /></el-icon>
        <span>暂无社团信息</span>
      </div>
      <div v-else class="community-items">
        <div 
          v-for="community in filteredCommunities" 
          :key="community.id" 
          class="community-item"
          @click="goToCommunityDetail(community)"
          style="cursor: pointer"
        >
          <!-- 社团logo -->
          <div class="community-logo">
            <img :src="community.logo" :alt="community.name" />
          </div>
          
          <!-- 社团信息 -->
          <div class="community-info">
            <div class="community-header">
              <h3 class="community-name">{{ community.name }}</h3>
              <span class="community-category">{{ community.category }}</span>
            </div>
            <p class="community-description">{{ community.description }}</p>
            <div class="community-meta">
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>{{ community.members }}人</span>
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
          </div>
          
          <!-- 操作按钮 -->
          <div class="community-actions">
            <button 
              class="action-button" 
              :class="{ joined: community.joined }"
              @click.stop="toggleJoinCommunity(community)"
            >
              <template v-if="community.joined">
                <el-icon><Check /></el-icon>
                <span>已加入</span>
              </template>
              <template v-else>
                <el-icon><Plus /></el-icon>
                <span>加入</span>
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-communities {
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

.community-list {
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

.community-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.community-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.community-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #007bff;
}

.community-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.community-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.community-info {
  flex: 1;
  min-width: 0;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.community-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
}

.community-category {
  font-size: 12px;
  color: #007bff;
  background-color: #e3f2fd;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.community-description {
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

.community-meta {
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
  color: #007bff;
  font-size: 12px;
  flex-shrink: 0;
}

.community-actions {
  margin-left: 16px;
  flex-shrink: 0;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.action-button:hover {
  background-color: #0069d9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

.action-button.joined {
  background-color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.action-button.joined:hover {
  background-color: #218838;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.action-button i {
  font-size: 14px;
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
  
  .community-list {
    padding: 0 15px 15px;
  }
  
  .empty {
    padding: 40px 15px;
  }
  
  .empty i {
    font-size: 40px;
  }
  
  .community-items {
    gap: 12px;
  }
  
  .community-item {
    padding: 14px;
  }
  
  .community-logo {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }
  
  .community-header {
    margin-bottom: 6px;
  }
  
  .community-name {
    font-size: 15px;
  }
  
  .community-description {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .meta-item {
    font-size: 11px;
  }
  
  .community-actions {
    margin-left: 12px;
  }
  
  .action-button {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .action-button i {
    font-size: 12px;
  }
}
</style>