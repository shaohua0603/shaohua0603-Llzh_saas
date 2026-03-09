<template>
  <div class="news-detail">
    <div class="detail-content">
      <!-- 业务基本信息 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>资讯详情</span>
            <el-tag :type="getStatusType(newsData.status)">
              {{ getStatusText(newsData.status) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="资讯标题" :span="2">
            {{ newsData.title }}
          </el-descriptions-item>
          <el-descriptions-item label="资讯类型">
            <el-tag>{{ getTypeText(newsData.newsType) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布状态">
            <el-tag :type="newsData.status === 'published' ? 'success' : 'info'">
              {{ newsData.status === 'published' ? '已发布' : '未发布' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="资讯摘要" :span="2">
            {{ newsData.summary }}
          </el-descriptions-item>
          <el-descriptions-item label="发布时间">
            {{ newsData.publishTime ? formatDateTime(newsData.publishTime) : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(newsData.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="资讯内容" :span="2">
            <div v-html="newsData.content" class="news-content"></div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <ShareComponent 
        v-if="newsData.id"
        :title="newsData.title"
        :id="newsData.id"
        type="news"
      />
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import ShareComponent from '@/components/ShareComponent.vue'

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

// 响应式数据
const route = useRoute()
const router = useRouter()
const newsData = ref<NewsRecord>({
  id: '',
  title: '',
  newsType: 'skill',
  summary: '',
  content: '',
  status: 'unpublished',
  createTime: ''
})
const loading = ref(false)

// 模拟数据存储
const allData = ref<NewsRecord[]>([])

// 生成模拟数据
const generateMockData = (): NewsRecord[] => {
  const titles = [
    '电工技能提升培训课程',
    '焊工实操技能训练',
    '数控机床操作指南',
    '叉车驾驶技能培训',
    '安全生产知识讲座',
    '职业健康防护指南',
    '最新岗位招聘信息',
    '工厂普工岗位介绍',
    '技术工种薪资待遇分析',
    '如何提升职业技能',
    '成人高考学历提升指南',
    '网络教育学历提升',
    '技能证书考取指南',
    '职业发展规划建议',
    '工厂生活指南'
  ]
  const summaries = [
    '提供专业的技能培训，帮助工人提升职业技能水平',
    '系统化的培训课程，让学员快速掌握实用技能',
    '理论与实践相结合，提升实际操作能力',
    '专业的师资团队，提供一对一指导服务',
    '最新岗位信息，待遇优厚，福利完善'
  ]
  const types: NewsRecord['newsType'][] = ['skill', 'education', 'job', 'other']
  const statuses: NewsRecord['status'][] = ['published', 'unpublished']
  const data: NewsRecord[] = []

  for (let i = 0; i < 30; i++) {
    const newsType = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createTime = new Date()
    createTime.setDate(createTime.getDate() - Math.floor(Math.random() * 30))
    const publishTime = status === 'published' ? new Date(createTime.getTime() + 86400000) : undefined

    data.push({
      id: `NEWS${String(i + 1).padStart(6, '0')}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i / titles.length) + 1}` : ''),
      newsType,
      summary: summaries[i % summaries.length],
      content: `<h2>${titles[i % titles.length]}</h2><p>${summaries[i % summaries.length]}</p><p>详细内容...</p>`,
      status,
      publishTime: publishTime ? publishTime.toISOString() : undefined,
      createTime: createTime.toISOString()
    })
  }

  return data
}

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

// 获取状态类型
const getStatusType = (status: string): string => {
  return status === 'published' ? 'success' : 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  return status === 'published' ? '已发布' : '未发布'
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
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 加载资讯数据
const loadNewsData = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('缺少资讯ID')
    router.back()
    return
  }

  loading.value = true
  try {
    // 生成模拟数据
    allData.value = generateMockData()
    
    // 查找对应ID的数据
    let newsRecord = allData.value.find(item => item.id === id)
    
    // 如果找不到，尝试将数字id转换为模拟数据格式
    if (!newsRecord && /^\d+$/.test(id)) {
      const formattedId = `NEWS${String(parseInt(id)).padStart(6, '0')}`
      newsRecord = allData.value.find(item => item.id === formattedId)
    }
    
    // 如果还是找不到，使用第一条数据作为默认
    if (!newsRecord) {
      newsRecord = allData.value[0]
    }
    
    if (newsRecord) {
      newsData.value = newsRecord
    } else {
      ElMessage.error('资讯不存在')
      router.back()
    }
  } catch (error) {
    console.error('加载资讯数据失败:', error)
    ElMessage.error('加载资讯数据失败')
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/on-duty/news/edit/${newsData.value.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该资讯吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === newsData.value.id)
    if (index > -1) {
      allData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
    router.push('/tenant/on-duty/news')
  }).catch(() => {})
}

// 生命周期
onMounted(() => {
  loadNewsData()
})
</script>

<style scoped>
.news-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.news-content {
  max-height: 400px;
  overflow-y: auto;
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
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
  
  .detail-content {
    padding-bottom: 120px;
  }
}
</style>