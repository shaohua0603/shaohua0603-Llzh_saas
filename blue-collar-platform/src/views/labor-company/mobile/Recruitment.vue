<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const recruitments = ref<any[]>([])
const loading = ref(true)
const statusFilters = ref(['全部', '待审核', '已发布', '已结束'])
const activeStatus = ref('全部')

const getRecruitments = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    recruitments.value = [
      {
        id: 1,
        title: '操作工招聘',
        factory: '富士康科技集团',
        count: 50,
        salary: '6000-8000元/月',
        address: '深圳龙华',
        status: '已发布',
        publishDate: '2026-02-10',
        deadline: '2026-03-10'
      },
      {
        id: 2,
        title: '质检员招聘',
        factory: '华为技术有限公司',
        count: 20,
        salary: '7000-9000元/月',
        address: '东莞松山湖',
        status: '待审核',
        publishDate: '2026-02-12',
        deadline: '2026-03-12'
      },
      {
        id: 3,
        title: '仓库管理员',
        factory: '京东物流',
        count: 30,
        salary: '5000-7000元/月',
        address: '广州黄埔',
        status: '已发布',
        publishDate: '2026-02-08',
        deadline: '2026-03-08'
      },
      {
        id: 4,
        title: '叉车工招聘',
        factory: '阿里巴巴物流',
        count: 15,
        salary: '6500-8500元/月',
        address: '杭州萧山',
        status: '已结束',
        publishDate: '2026-01-20',
        deadline: '2026-02-20'
      }
    ]
  } catch (error) {
    ElMessage.error('获取招聘信息失败')
  } finally {
    loading.value = false
  }
}

const goToDetail = (item: any) => {
  router.push(`/tenant/recruitment-detail/${item.id}`)
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    '待审核': 'warning',
    '已发布': 'success',
    '已结束': 'info'
  }
  return types[status] || 'info'
}

const filteredList = () => {
  if (activeStatus.value === '全部') {
    return recruitments.value
  }
  return recruitments.value.filter(item => item.status === activeStatus.value)
}

onMounted(() => {
  getRecruitments()
})
</script>

<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>招聘需求</h2>
    </div>
    
    <div class="filter-tabs">
      <div 
        v-for="status in statusFilters" 
        :key="status"
        :class="['filter-tab', { active: activeStatus === status }]"
        @click="activeStatus = status"
      >
        {{ status }}
      </div>
    </div>
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
      
      <div v-else-if="filteredList().length === 0" class="empty-state">
        <p>暂无招聘需求</p>
      </div>
      
      <div v-else class="recruitment-list">
        <div 
          v-for="item in filteredList()" 
          :key="item.id" 
          class="recruitment-item"
          @click="goToDetail(item)"
        >
          <div class="item-header">
            <h3 class="item-title">{{ item.title }}</h3>
            <el-tag :type="getStatusType(item.status)" size="small">
              {{ item.status }}
            </el-tag>
          </div>
          
          <div class="item-info">
            <div class="info-row">
              <span class="label">招聘企业：</span>
              <span class="value">{{ item.factory }}</span>
            </div>
            <div class="info-row">
              <span class="label">招聘人数：</span>
              <span class="value">{{ item.count }}人</span>
            </div>
            <div class="info-row">
              <span class="label">薪资待遇：</span>
              <span class="value salary">{{ item.salary }}</span>
            </div>
            <div class="info-row">
              <span class="label">工作地点：</span>
              <span class="value">{{ item.address }}</span>
            </div>
          </div>
          
          <div class="item-footer">
            <span>发布日期：{{ item.publishDate }}</span>
            <span>截止日期：{{ item.deadline }}</span>
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

.filter-tabs {
  display: flex;
  background-color: #fff;
  padding: 10px 15px;
  gap: 10px;
  overflow-x: auto;
}

.filter-tab {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  white-space: nowrap;
  background-color: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab.active {
  background-color: #667eea;
  color: #fff;
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

.recruitment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recruitment-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.recruitment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.item-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  font-size: 13px;
  line-height: 1.8;
}

.info-row .label {
  color: #999;
  min-width: 70px;
}

.info-row .value {
  color: #333;
}

.info-row .salary {
  color: #f56c6c;
  font-weight: 500;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
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
  
  .recruitment-item {
    padding: 12px;
  }
  
  .item-title {
    font-size: 15px;
  }
}
</style>
