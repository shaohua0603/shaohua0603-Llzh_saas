<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon } from 'element-plus'
import { Star, User, Calendar, MapLocation, ArrowRight, Plus } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// 模拟社团数据
const myCommunities = ref([
  {
    id: 1,
    name: '篮球社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=basketball%20club%20logo%20with%20basketball%20icon%2C%20simple%20design%2C%20blue%20and%20orange%20colors&image_size=square',
    description: '热爱篮球的工友们的聚集地，每周定期组织比赛和训练',
    members: 28,
    lastActivity: '2026-02-10 19:00',
    nextActivity: '2026-02-17 19:00',
    activityLocation: '公司篮球场'
  },
  {
    id: 2,
    name: '书法社',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20calligraphy%20club%20logo%20with%20brush%20stroke%20icon%2C%20elegant%20design%2C%20black%20and%20red%20colors&image_size=square',
    description: '传承中华传统文化，提升书法技艺，修身养性',
    members: 15,
    lastActivity: '2026-02-08 18:30',
    nextActivity: '2026-02-15 18:30',
    activityLocation: '员工活动中心'
  }
])

// 跳转到社团详情页
const goToCommunityDetail = (community) => {
  router.push(`/worker/community-detail/${community.id}`)
}

// 跳转到所有社团页面
const goToAllCommunities = () => {
  router.push('/worker/communities')
}

onMounted(() => {
  // 页面加载时的逻辑
})
</script>

<template>
  <div class="worker-community">
    <BackButton />
    
    <!-- 页面标题和查看所有社团按钮 -->
    <div class="page-header">
      <h2>我的社团</h2>
      <div class="view-all-button" @click="goToAllCommunities">
        <span>查看所有社团</span>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>
    </div>
    
    <!-- 我的社团列表 -->
    <div class="community-list">
      <div v-if="myCommunities.length === 0" class="empty">
        <el-icon><Star /></el-icon>
        <span>暂无加入的社团</span>
        <button class="join-community-button" @click="goToAllCommunities">
          <el-icon><Plus /></el-icon>
          <span>加入社团</span>
        </button>
      </div>
      <div v-else class="community-items">
        <div 
          v-for="community in myCommunities" 
          :key="community.id" 
          class="community-item"
          @click="goToCommunityDetail(community)"
        >
          <!-- 社团logo -->
          <div class="community-logo">
            <img :src="community.logo" :alt="community.name" />
          </div>
          
          <!-- 社团信息 -->
          <div class="community-info">
            <h3 class="community-name">{{ community.name }}</h3>
            <p class="community-description">{{ community.description }}</p>
            <div class="community-meta">
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>{{ community.members }}人</span>
              </div>
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>下次活动: {{ community.nextActivity }}</span>
              </div>
              <div class="meta-item">
                <el-icon><MapLocation /></el-icon>
                <span>{{ community.activityLocation }}</span>
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
.worker-community {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.view-all-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.view-all-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.view-all-button span {
  color: #fff;
}

.arrow-icon {
  font-size: 16px;
  color: #fff;
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
  margin-bottom: 20px;
}

.join-community-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.join-community-button:hover {
  background-color: #0069d9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
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
  cursor: pointer;
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

.community-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 15px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .view-all-button {
    margin: 10px 15px;
    padding: 12px;
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
  
  .community-item {
    padding: 14px;
  }
  
  .community-logo {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }
  
  .community-name {
    font-size: 15px;
    margin-bottom: 6px;
  }
  
  .community-description {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .meta-item {
    font-size: 11px;
  }
}
</style>