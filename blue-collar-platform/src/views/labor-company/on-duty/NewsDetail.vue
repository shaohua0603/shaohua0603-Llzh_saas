<template>
  <div class="news-detail">
    <div class="detail-container">
      <!-- 内容区域 -->
      <div class="detail-content" v-if="newsDetail">
        <div class="news-header">
          <h1 class="news-title">{{ newsDetail.title }}</h1>
          <div class="news-meta">
            <span class="news-type">
              <el-tag>{{ getTypeText(newsDetail.newsType) }}</el-tag>
            </span>
            <span class="news-status">
              <el-tag :type="newsDetail.status === 'published' ? 'success' : 'info'">
                {{ newsDetail.status === 'published' ? '已发布' : '未发布' }}
              </el-tag>
            </span>
            <span class="news-time">
              <el-icon><Timer /></el-icon>
              {{ formatDateTime(newsDetail.createTime) }}
            </span>
          </div>
        </div>
        
        <div class="news-summary">
          <h3>摘要</h3>
          <p>{{ newsDetail.summary }}</p>
        </div>
        
        <div class="news-body">
          <h3>内容</h3>
          <div v-html="newsDetail.content" class="news-content"></div>
        </div>
      </div>
      
      <el-empty v-else description="资讯不存在" />
      
      <!-- 底部按钮栏 -->
      <div class="detail-footer">
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Timer } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const newsDetail = ref<any>(null)

// 类型定义
interface NewsRecord {
  id: string
  title: string
  newsType: 'skill' | 'education' | 'job' | 'other'
  summary: string
  content: string
  status: 'published' | 'unpublished'
  publishTime?: string
  createTime: string
}

// 模拟数据
const mockNewsData: NewsRecord[] = [
  {
    id: '1',
    title: '电工技能提升培训课程',
    newsType: 'skill',
    summary: '提供专业的电工技能培训，帮助工人提升职业技能水平',
    content: `<h2>电工技能提升培训课程</h2>
              <p>本课程旨在帮助电工提升专业技能，包括理论知识和实际操作训练。</p>
              <h3>课程内容</h3>
              <ul>
                <li>电气安全知识</li>
                <li>电路原理</li>
                <li>电气设备维护</li>
                <li>故障排除</li>
              </ul>
              <h3>培训时间</h3>
              <p>每周一至周五，上午9:00-12:00，下午14:00-17:00</p>
              <h3>培训地点</h3>
              <p>公司培训中心</p>`,
    status: 'published',
    publishTime: '2026-02-20 10:00:00',
    createTime: '2026-02-15 10:00:00'
  },
  {
    id: '2',
    title: '最新岗位招聘信息',
    newsType: 'job',
    summary: '最新岗位信息，待遇优厚，福利完善',
    content: `<h2>最新岗位招聘信息</h2>
              <p>我公司现招聘以下岗位，欢迎有意者应聘：</p>
              <h3>招聘岗位</h3>
              <ul>
                <li>电工：5名，月薪6000-8000元</li>
                <li>焊工：3名，月薪7000-9000元</li>
                <li>数控机床操作员：2名，月薪8000-10000元</li>
              </ul>
              <h3>任职要求</h3>
              <ul>
                <li>身体健康，吃苦耐劳</li>
                <li>有相关工作经验优先</li>
                <li>持有相关技能证书优先</li>
              </ul>
              <h3>联系方式</h3>
              <p>联系人：张经理</p>
              <p>电话：13800138000</p>`,
    status: 'published',
    publishTime: '2026-02-18 14:00:00',
    createTime: '2026-02-15 14:00:00'
  },
  {
    id: '3',
    title: '成人高考学历提升指南',
    newsType: 'education',
    summary: '成人高考学历提升的详细指南和备考建议',
    content: `<h2>成人高考学历提升指南</h2>
              <p>成人高考是提升学历的重要途径，以下是详细指南：</p>
              <h3>报名条件</h3>
              <ul>
                <li>年满18周岁</li>
                <li>具有高中或中专学历</li>
              </ul>
              <h3>报名时间</h3>
              <p>每年8-9月份</p>
              <h3>考试时间</h3>
              <p>每年10月份</p>
              <h3>备考建议</h3>
              <ul>
                <li>提前准备，制定学习计划</li>
                <li>参加考前辅导</li>
                <li>模拟考试，熟悉题型</li>
              </ul>`,
    status: 'published',
    publishTime: '2026-02-10 09:00:00',
    createTime: '2026-02-05 09:00:00'
  }
]

// 获取资讯类型文本
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    skill: '技能提升',
    education: '学历提升',
    job: '岗位介绍',
    other: '其他资讯'
  }
  return typeMap[type] || type
}

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 获取资讯详情
const getNewsDetail = () => {
  const id = route.params.id as string
  if (id) {
    // 模拟API调用
    setTimeout(() => {
      const news = mockNewsData.find(item => item.id === id)
      newsDetail.value = news
      // 设置页面标题为资讯详情
      document.title = '资讯详情 - 蓝领智汇'
    }, 500)
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  getNewsDetail()
})
</script>

<style scoped>
.news-detail {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
}

.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
}

.news-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.news-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #303133;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.news-type,
.news-status {
  flex-shrink: 0;
}

.news-time {
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.news-summary {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.news-summary h3,
.news-body h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #303133;
}

.news-summary p {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin: 0;
}

.news-body {
  margin-bottom: 30px;
}

.news-content {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
}

.news-content h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0 16px;
  color: #303133;
}

.news-content h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 16px 0 12px;
  color: #303133;
}

.news-content p {
  margin: 12px 0;
}

.news-content ul {
  margin: 12px 0;
  padding-left: 20px;
}

.news-content li {
  margin: 4px 0;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .detail-footer {
    left: 0;
  }
  
  .detail-content {
    padding: 16px;
    padding-bottom: 120px;
  }
  
  .news-title {
    font-size: 20px;
  }
  
  .news-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>