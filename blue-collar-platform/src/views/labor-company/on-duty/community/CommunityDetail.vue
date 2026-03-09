<template>
  <div class="community-detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <div class="detail-section">
        <div class="basic-info-card">
          <div class="card-header">
            <span>社团基本信息</span>
          </div>
          <div class="basic-info">
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">社团标题：</span>
                <span class="info-value">{{ communityData.title }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">社团类型：</span>
                <el-tag>{{ getTypeText(communityData.communityType) }}</el-tag>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">是否团员限制：</span>
                <el-tag :type="communityData.isMemberLimit ? 'warning' : 'success'">
                  {{ communityData.isMemberLimit ? `限${communityData.memberLimit}人` : '不限人数' }}
                </el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">是否报名审核：</span>
                <el-tag :type="communityData.isApprovalRequired ? 'warning' : 'success'">
                  {{ communityData.isApprovalRequired ? '需要审核' : '无需审核' }}
                </el-tag>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item full-width">
                <span class="info-label">社团简介：</span>
                <span class="info-value">{{ communityData.summary || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item full-width">
                <span class="info-label">社团活动地址：</span>
                <span class="info-value">{{ communityData.activityAddress || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item full-width">
                <span class="info-label">社团活动时间：</span>
                <span class="info-value">{{ communityData.activityTime || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item full-width">
                <span class="info-label">加入社团要求：</span>
                <span class="info-value">{{ communityData.requirements || '-' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">创建时间：</span>
                <span class="info-value">{{ formatDateTime(communityData.createTime) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">更新时间：</span>
                <span class="info-value">{{ formatDateTime(communityData.updateTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>社团介绍</span>
            </div>
          </template>
          <div v-html="communityData.introduction" class="community-intro"></div>
        </el-card>
      </div>


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
        v-if="communityData.id"
        :title="communityData.title" 
        :id="communityData.id" 
        type="community" 
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete } from '@element-plus/icons-vue'
import ShareComponent from '@/components/ShareComponent.vue'

// 路由实例
const route = useRoute()
const router = useRouter()

// 社团数据
const communityData = ref({
  id: '',
  title: '',
  communityType: 'sports' as 'sports' | 'culture' | 'interest',
  isMemberLimit: false,
  memberLimit: 0,
  isApprovalRequired: false,
  summary: '',
  activityAddress: '',
  activityTime: '',
  requirements: '',
  introduction: '',
  createTime: '',
  updateTime: ''
})

// 加载状态
const loading = ref(false)

// 获取社团类型文本
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    sports: '体育类',
    culture: '文化类',
    interest: '兴趣类'
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
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 获取社团数据
const fetchCommunityData = () => {
  loading.value = true
  
  try {
    // 模拟数据
    const mockData = {
      id: route.params.id as string,
      title: '篮球社',
      communityType: 'sports' as const,
      isMemberLimit: true,
      memberLimit: 50,
      isApprovalRequired: true,
      summary: '强身健体，结交球友',
      activityAddress: '活动中心1号场地',
      activityTime: '每周六下午3点',
      requirements: '热爱运动，积极参与',
      introduction: '<h3>篮球社介绍</h3><p>篮球社是一个以篮球运动为核心的社团，旨在为热爱篮球的同学提供一个交流和锻炼的平台。</p><p>我们每周六下午3点在活动中心1号场地进行训练和比赛，欢迎所有对篮球感兴趣的同学加入！</p>',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    
    communityData.value = mockData
  } catch (error) {
    console.error('获取社团数据失败:', error)
    ElMessage.error('获取社团数据失败')
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/community')
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/on-duty/community/edit/${communityData.value.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该社团吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.push('/tenant/on-duty/community')
  }).catch(() => {})
}

// 生命周期
onMounted(() => {
  fetchCommunityData()
})
</script>

<style scoped>
.community-detail-container {
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

.detail-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.community-intro {
  line-height: 1.6;
  min-height: 200px;
}

.basic-info-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 20px;
}

.basic-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.info-item {
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item.full-width {
  flex: 100%;
  min-width: 100%;
}

.info-label {
  font-weight: 500;
  color: var(--color-text-regular);
  min-width: 120px;
}

.info-value {
  flex: 1;
  color: var(--color-text-primary);
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