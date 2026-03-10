<template>
  <div class="entertainment-detail-container">
    <!-- 内容区域 -->
    <div class="detail-content" :class="{ 'with-sidebar': workerInfoVisible }">
      <el-card shadow="never" class="detail-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ currentRecord?.title }}</span>
            <el-button type="primary" link @click="toggleWorkerInfo" v-if="currentRecord?.workerName">
              <el-icon><User /></el-icon>
              查看工人信息
            </el-button>
          </div>
        </template>
        
        <div v-if="currentRecord" class="detail-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="活动标题">
              {{ currentRecord.title }}
            </el-descriptions-item>
            <el-descriptions-item label="活动类型">
              <el-tag>{{ getTypeText(currentRecord.activityType) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="是否报名审核">
              <el-tag :type="currentRecord.isApprovalRequired ? 'warning' : 'success'">
                {{ currentRecord.isApprovalRequired ? '需要审核' : '无需审核' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="发布状态">
              <el-tag :type="getStatusType(currentRecord.status)">
                {{ getStatusText(currentRecord.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="报名时间" :span="2">
              {{ currentRecord.registrationStartDate }} ~ {{ currentRecord.registrationEndDate }}
            </el-descriptions-item>
            <el-descriptions-item label="活动地址" :span="2">
              {{ currentRecord.address }}
            </el-descriptions-item>
            <el-descriptions-item label="活动简介" :span="2">
              {{ currentRecord.summary }}
            </el-descriptions-item>
            <el-descriptions-item label="活动时间" :span="2">
              {{ currentRecord.activityStartTime }} ~ {{ currentRecord.activityEndTime }}
            </el-descriptions-item>
            <el-descriptions-item label="活动详情" :span="2">
              <div v-html="currentRecord.content" class="content-html"></div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
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
        v-if="currentRecord"
        :title="currentRecord.title"
        :id="currentRecord.id"
        type="entertainment"
      />
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
    
    <!-- 工人信息侧边栏 -->
    <WorkerInfoSidebar
      v-model:visible="workerInfoVisible"
      :worker-name="currentRecord?.workerName"
      :phone="currentRecord?.phone"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete, User } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import ShareComponent from '@/components/ShareComponent.vue'
import WorkerInfoSidebar from '@/components/WorkerInfoSidebar.vue'

// 类型定义
interface EntertainmentRecord {
  id: string
  title: string
  activityType: 'sports' | 'dating' | 'skill' | 'community' | 'other'
  communityId?: string
  isApprovalRequired: boolean
  registrationStartDate: string
  registrationEndDate: string
  address: string
  summary: string
  content: string
  activityStartTime: string
  activityEndTime: string
  status: 'unpublished' | 'published' | 'ongoing' | 'ended'
  isStarted: boolean
  createdAt: string
}

// 路由相关
const router = useRouter()

// 工人信息侧边栏
const workerInfoVisible = ref(false)
const route = useRoute()

// 响应式数据
const currentRecord = ref<EntertainmentRecord | null>(null)

// 获取活动类型文本
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    sports: '文体活动',
    dating: '相亲活动',
    skill: '技能提升',
    community: '社团活动',
    other: '其他活动'
  }
  return typeMap[type] || type
}

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    unpublished: 'info',
    published: 'success',
    ongoing: 'primary',
    ended: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    unpublished: '未发布',
    published: '已发布',
    ongoing: '进行中',
    ended: '已结束'
  }
  return textMap[status] || status
}

// 加载数据
const loadData = () => {
  const id = route.params.id
  if (id) {
    // 从localStorage获取数据（模拟）
    const allData = JSON.parse(localStorage.getItem('entertainmentData') || '[]')
    const record = allData.find((item: EntertainmentRecord) => item.id === id)
    if (record) {
      currentRecord.value = record
    }
  }
}

// 编辑
const handleEdit = () => {
  if (currentRecord.value) {
    router.push(`/tenant/on-duty/entertainment/edit/${currentRecord.value.id}`)
  }
}

// 删除
const handleDelete = () => {
  if (!currentRecord.value) return
  
  ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 从localStorage获取数据（模拟）
    let allData = JSON.parse(localStorage.getItem('entertainmentData') || '[]')
    const index = allData.findIndex((item: EntertainmentRecord) => item.id === currentRecord.value!.id)
    if (index > -1) {
      allData.splice(index, 1)
    }
    // 保存到localStorage（模拟）
    localStorage.setItem('entertainmentData', JSON.stringify(allData))
    ElMessage.success('删除成功')
    // 跳转回列表页
    router.push('/tenant/on-duty/entertainment')
  }).catch(() => {})
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/entertainment')
}

// 切换工人信息侧边栏
const toggleWorkerInfo = () => {
  workerInfoVisible.value = !workerInfoVisible.value
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.entertainment-detail-container {
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
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.detail-info {
  padding: 10px 0;
}

.content-html {
  padding: 10px;
  line-height: 1.6;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content.with-sidebar {
  margin-right: 480px;
  transition: margin-right 0.3s ease;
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
  
  .detail-content.with-sidebar {
    margin-right: 0;
  }
}
</style>