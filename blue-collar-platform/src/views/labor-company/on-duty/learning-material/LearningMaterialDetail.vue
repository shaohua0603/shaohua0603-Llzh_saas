<!-- 学习材料详情页面 -->
<template>
  <div class="learning-material-detail">
    <div class="detail-container">
      <!-- 内容区域 -->
      <div class="detail-content">
        <el-card shadow="hover">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="学习材料标题">{{ currentRow?.title }}</el-descriptions-item>
            <el-descriptions-item label="学习材料类型">
              <el-tag :type="getMaterialTypeTag(currentRow?.materialType)">
                {{ getMaterialTypeText(currentRow?.materialType) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="发布状态">
              <el-tag :type="currentRow?.publishStatus === 'published' ? 'success' : 'info'">
                {{ currentRow?.publishStatus === 'published' ? '已发布' : '未发布' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
            <el-descriptions-item label="学习材料摘要" :span="2">{{ currentRow?.summary }}</el-descriptions-item>
          </el-descriptions>
          <el-divider content-position="left">学习材料内容</el-divider>
          <div class="content-view" v-html="currentRow?.content"></div>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

// 类型定义
interface LearningMaterial {
  id: string
  title: string
  materialType: 'pre_job' | 'daily'
  summary: string
  content: string
  publishStatus: 'published' | 'unpublished'
  createTime: string
}

const router = useRouter()
const route = useRoute()

// 响应式数据
const currentRow = ref<LearningMaterial | null>(null)

// Mock数据
const mockData: LearningMaterial[] = [
  {
    id: '1',
    title: '安全生产基础知识',
    materialType: 'pre_job',
    summary: '本课程主要介绍安全生产的基本概念、基本原则和基本要求',
    content: '<h2>安全生产基础知识</h2><p>安全生产是指在生产过程中采取必要的措施，消除或控制危险有害因素，保障人身安全健康、设备设施免受损坏、生产活动正常进行。</p><h3>安全生产的基本原则</h3><ul><li>安全第一</li><li>预防为主</li><li>综合治理</li></ul>',
    publishStatus: 'published',
    createTime: '2024-01-15 10:00:00'
  },
  {
    id: '2',
    title: '岗位操作规程',
    materialType: 'pre_job',
    summary: '详细介绍各岗位的操作规程和注意事项',
    content: '<h2>岗位操作规程</h2><p>岗位操作规程是工人从事生产作业的基本准则，必须严格遵守。</p>',
    publishStatus: 'published',
    createTime: '2024-01-20 14:30:00'
  },
  {
    id: '3',
    title: '消防知识培训',
    materialType: 'daily',
    summary: '消防知识普及和火灾应对方法',
    content: '<h2>消防知识培训</h2><p>学习消防知识，提高火灾防范意识。</p>',
    publishStatus: 'unpublished',
    createTime: '2024-02-01 09:00:00'
  },
  {
    id: '4',
    title: '职业健康防护',
    materialType: 'daily',
    summary: '职业健康防护知识和个人防护用品使用',
    content: '<h2>职业健康防护</h2><p>了解职业病危害，掌握防护措施。</p>',
    publishStatus: 'published',
    createTime: '2024-02-05 16:00:00'
  }
]

// 获取类型标签
const getMaterialTypeTag = (type: string) => {
  const map: Record<string, string> = {
    pre_job: 'success',
    daily: 'primary'
  }
  return map[type] || 'info'
}

// 获取类型文本
const getMaterialTypeText = (type: string) => {
  const map: Record<string, string> = {
    pre_job: '岗前培训',
    daily: '日常培训'
  }
  return map[type] || type
}

// 加载数据
const loadData = () => {
  const id = route.params.id as string
  if (id) {
    const item = mockData.find(item => item.id === id)
    if (item) {
      currentRow.value = item
    }
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/learning-material')
}

// 编辑
const handleEdit = () => {
  const id = route.params.id as string
  if (id) {
    router.push(`/tenant/on-duty/learning-material/form/${id}`)
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.learning-material-detail {
  width: 100%;
  height: 100%;
}

.detail-container {
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

.content-view {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
  min-height: 200px;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
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
  
  .content-view {
    padding: 12px;
  }
}
</style>