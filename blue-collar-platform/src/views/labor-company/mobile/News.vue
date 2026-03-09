<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Article {
  id: number
  title: string
  summary: string
  content: string
  author: string
  publishDate: string
  readCount: number
  category: string
  type: string
}

const router = useRouter()
const activeTab = ref('1')
const newsArticles = ref<Article[]>([])
const loading = ref(true)

const tabs = [
  { label: '技能提升', value: '1' },
  { label: '学历提升', value: '2' },
  { label: '岗位介绍', value: '3' },
  { label: '其他资讯', value: '4' }
]

const mockArticles: Article[] = [
  // 技能提升分类
  {
    id: 1,
    title: '制造业数字化技能培训指南',
    summary: '本指南详细介绍了制造业数字化转型中工人需要掌握的基础数字化操作技能，包括设备操作、数据分析等核心能力。',
    content: '本指南详细介绍了制造业数字化转型中工人需要掌握的基础数字化操作技能，包括设备操作、数据分析等核心能力。',
    author: '技能培训中心',
    publishDate: '2026-02-10',
    readCount: 1258,
    category: '技能提升',
    type: 'skill'
  },
  {
    id: 7,
    title: '如何成为一名优秀的电工',
    summary: '本文介绍了成为一名优秀电工需要具备的技能和素质，包括专业知识、实操能力，安全意识等方面。',
    content: '本文介绍了成为一名优秀电工需要具备的技能和素质。',
    author: '张三',
    publishDate: '2026-01-10',
    readCount: 890,
    category: '技能提升',
    type: 'skill'
  },
  {
    id: 8,
    title: '数控车床操作技巧',
    summary: '本文分享了数控车床操作的一些实用技巧，帮助工人提高操作效率和加工精度。',
    content: '本文分享了数控车床操作的一些实用技巧。',
    author: '李四',
    publishDate: '2026-01-08',
    readCount: 765,
    category: '技能提升',
    type: 'skill'
  },
  // 学历提升分类
  {
    id: 2,
    title: '2026年成人高考报名指南',
    summary: '详细介绍2026年成人高考的报名条件、考试科目、复习方法以及学历提升对职业发展的重要性。',
    content: '详细介绍2026年成人高考的报名条件、考试科目、复习方法。',
    author: '教育考试院',
    publishDate: '2026-02-08',
    readCount: 987,
    category: '学历提升',
    type: 'education'
  },
  {
    id: 10,
    title: '成人高考报名指南',
    summary: '本文详细介绍了成人高考的报名条件、报名流程、考试科目等信息，帮助工人了解学历提升的途径。',
    content: '本文详细介绍了成人高考的报名条件、报名流程、考试科目等信息。',
    author: '王五',
    publishDate: '2026-01-05',
    readCount: 523,
    category: '学历提升',
    type: 'education'
  },
  // 岗位介绍分类
  {
    id: 3,
    title: '从操作工到班组长的晋升路径',
    summary: '本文详细分析了从普通操作工晋升为班组长的必备条件、能力要求以及职业发展规划建议。',
    content: '本文详细分析了从普通操作工晋升为班组长的必备条件、能力要求。',
    author: '职业发展中心',
    publishDate: '2026-02-05',
    readCount: 756,
    category: '岗位介绍',
    type: 'career'
  },
  {
    id: 6,
    title: '班组长管理技能培训',
    summary: '针对班组长岗位的管理技能培训，包括团队管理、生产调度、质量管理等核心能力提升。',
    content: '针对班组长岗位的管理技能培训。',
    author: '企业管理培训中心',
    publishDate: '2026-01-28',
    readCount: 432,
    category: '岗位介绍',
    type: 'career'
  },
  {
    id: 12,
    title: '电子厂常见岗位介绍',
    summary: '本文详细介绍了电子厂中常见的岗位类型、工作职责、技能要求和薪资水平。',
    content: '本文详细介绍了电子厂中常见的岗位类型、工作职责、技能要求和薪资水平。',
    author: '人力资源专员',
    publishDate: '2026-01-01',
    readCount: 389,
    category: '岗位介绍',
    type: 'career'
  },
  // 其他资讯分类
  {
    id: 15,
    title: '工厂生活小贴士',
    summary: '本文分享了一些工厂生活的实用小贴士，帮助工人更好地适应工厂生活，提高生活质量。',
    content: '本文分享了一些工厂生活的实用小贴士。',
    author: '生活顾问',
    publishDate: '2025-12-20',
    readCount: 456,
    category: '其他资讯',
    type: 'other'
  },
  {
    id: 16,
    title: '如何应对工作压力',
    summary: '本文介绍了一些应对工作压力的方法和技巧，帮助工人保持心理健康，提高工作效率。',
    content: '本文介绍了一些应对工作压力的方法和技巧。',
    author: '心理专家',
    publishDate: '2025-12-15',
    readCount: 389,
    category: '其他资讯',
    type: 'other'
  },
  {
    id: 17,
    title: '蓝领工人权益保障指南',
    summary: '本文详细介绍了蓝领工人的合法权益和保障措施，帮助工人了解自己的权益，维护自身利益。',
    content: '本文详细介绍了蓝领工人的合法权益和保障措施。',
    author: '律师',
    publishDate: '2025-12-10',
    readCount: 523,
    category: '其他资讯',
    type: 'other'
  }
]

const getArticles = (type: string) => {
  loading.value = true
  setTimeout(() => {
    let filteredArticles: Article[] = []
    switch (type) {
      case '1':
        filteredArticles = mockArticles.filter(article => article.type === 'skill')
        break
      case '2':
        filteredArticles = mockArticles.filter(article => article.type === 'education')
        break
      case '3':
        filteredArticles = mockArticles.filter(article => article.type === 'career')
        break
      case '4':
        filteredArticles = mockArticles.filter(article => article.type === 'other')
        break
      default:
        filteredArticles = mockArticles
    }
    newsArticles.value = filteredArticles
    loading.value = false
  }, 500)
}

const handleTabChange = (tab: any) => {
  const value = tab.props.name
  activeTab.value = value
  getArticles(value)
}

const goToNewsDetail = (article: Article) => {
  router.push(`/tenant/news-detail/${article.id}`)
}

onMounted(() => {
  getArticles(activeTab.value)
})
</script>

<template>
  <div class="worker-news">
    <div class="page-header">
      <h2>资讯</h2>
    </div>
    
    <div class="news-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.value"
          :label="tab.label"
          :name="tab.value"
        />
      </el-tabs>
    </div>
    
    <div class="article-list">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="newsArticles.length === 0" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>暂无相关资讯</span>
      </div>
      <div v-else class="article-items">
        <div v-for="article in newsArticles" :key="article.id" class="article-item" @click="goToNewsDetail(article)">
          <div class="article-category">{{ article.category }}</div>
          <h3>{{ article.title }}</h3>
          <p class="summary">{{ article.summary }}</p>
          <div class="article-footer">
            <span class="author">{{ article.author }}</span>
            <span class="publish-date">{{ article.publishDate }}</span>
            <span class="read-count">{{ article.readCount }} 阅读</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-news {
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

.news-tabs {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 0 15px;
}

.article-list {
  padding: 0 15px 20px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.article-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-item .article-category {
  display: inline-block;
  padding: 2px 8px;
  background-color: #e6f7ff;
  color: #1890ff;
  font-size: 10px;
  border-radius: 10px;
  margin-bottom: 8px;
}

.article-item h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.summary {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.article-footer .read-count {
  flex: 1;
  text-align: right;
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .article-list {
    padding: 0 10px 20px;
  }
  
  .article-item {
    padding: 12px;
  }
  
  .article-item h3 {
    font-size: 15px;
  }
  
  .summary {
    font-size: 12px;
  }
}
</style>
