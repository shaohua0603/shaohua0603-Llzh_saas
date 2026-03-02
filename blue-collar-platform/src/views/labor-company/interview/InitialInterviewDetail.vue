<template>
  <div class="initial-interview-detail-container">
    <div class="detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="面试编号">{{ interviewDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="面试时间">{{ interviewDetail.interviewTime }}</el-descriptions-item>
          <el-descriptions-item label="面试地点">{{ interviewDetail.interviewLocation }}</el-descriptions-item>
          <el-descriptions-item label="面试人">{{ interviewDetail.interviewer }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ interviewDetail.managerName }}</el-descriptions-item>
          <el-descriptions-item label="负责人电话">{{ interviewDetail.managerPhone }}</el-descriptions-item>
          <el-descriptions-item label="推荐等级">
            <el-tag :type="getRecommendationLevelType(interviewDetail.recommendationLevel)">
              {{ getRecommendationLevelText(interviewDetail.recommendationLevel) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="形象级别">
            <el-tag :type="getImageLevelType(interviewDetail.imageLevel)">
              {{ getImageLevelText(interviewDetail.imageLevel) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(interviewDetail.status)">
              {{ getStatusText(interviewDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="群号">{{ interviewDetail.groupNumber }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ interviewDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ interviewDetail.updateTime }}</el-descriptions-item>
        </el-descriptions>
        <div class="description-section">
          <div class="section-title">推荐理由</div>
          <div class="section-content">{{ interviewDetail.recommendationReason }}</div>
        </div>
      </el-card>

      <!-- 操作记录卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Clock /></el-icon>
            <span>操作记录</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in operationRecords"
            :key="index"
            :timestamp="record.time"
            placement="top"
          >
            <div class="record-content">
              <div class="record-operator">{{ record.operator }}</div>
              <div class="record-action">{{ record.action }}</div>
              <div class="record-remark" v-if="record.remark">{{ record.remark }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="warning" @click="handleEdit" v-permission="['interview:initial:update']">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete" v-permission="['interview:initial:delete']">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, InfoFilled, Clock, ArrowLeft } from '@element-plus/icons-vue'
import { getInitialInterviewDetail, deleteInitialInterview, type InitialInterviewDetail } from '@/api/interviewApi'
import { useDataPermission } from '@/composables/useDataPermission'

// 路由实例
const router = useRouter()
const route = useRoute()

// 数据权限
const { hasPermission } = useDataPermission()

// 面试详情数据
const interviewDetail = ref<InitialInterviewDetail>({
  id: '',
  interviewTime: '',
  interviewLocation: '',
  interviewer: '',
  managerId: '',
  managerName: '',
  managerPhone: '',
  recommendationLevel: 'NORMAL',
  imageLevel: 'NORMAL',
  recommendationReason: '',
  groupNumber: '',
  tenantId: '',
  departmentId: '',
  creatorId: '',
  creatorName: '',
  createTime: '',
  updateTime: '',
  status: 'PENDING',
  operationRecords: []
})

// 操作记录
const operationRecords = ref<any[]>([])

// 加载状态
const loading = ref(false)

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push(`/labor-company/interview/initial-interview/edit/${interviewDetail.value.id}`)
}

// 删除
const handleDelete = async () => {
  ElMessageBox.confirm('确定要删除该面试信息吗？删除后不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteInitialInterview(interviewDetail.value.id)
      ElMessage.success('删除成功')
      router.back()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('API调用错误:', error)
    }
  }).catch(() => {})
}

// 获取推荐等级类型
const getRecommendationLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    PRIORITY: 'success',
    NORMAL: 'info',
    NOT_RECOMMENDED: 'danger'
  }
  return typeMap[level] || 'info'
}

// 获取推荐等级文本
const getRecommendationLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    PRIORITY: '优先推荐',
    NORMAL: '一般',
    NOT_RECOMMENDED: '不建议'
  }
  return textMap[level] || level
}

// 获取形象级别类型
const getImageLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    EXCELLENT: 'success',
    NORMAL: 'info',
    OTHER: 'warning'
  }
  return typeMap[level] || 'info'
}

// 获取形象级别文本
const getImageLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    EXCELLENT: '优秀',
    NORMAL: '一般',
    OTHER: '其他'
  }
  return textMap[level] || level
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    PENDING: 'info',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    PENDING: '待面试',
    IN_PROGRESS: '面试中',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  }
  return textMap[status] || status
}

// 加载面试详情
const loadInterviewDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('面试ID不存在')
    return
  }
  
  loading.value = true
  try {
    const response = await getInitialInterviewDetail(id)
    interviewDetail.value = response.data
    operationRecords.value = response.data.operationRecords || []
  } catch (error) {
    ElMessage.error('获取面试详情失败')
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(async () => {
  await loadInterviewDetail()
})
</script>

<style scoped>
/* 详情页容器 - 使用flex布局实现内部滚动 */
.initial-interview-detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 内容区域 - 垂直滚动 */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 底部按钮栏 - 固定悬浮 */
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

.info-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.description-section {
  margin-top: 16px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.section-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  white-space: pre-wrap;
}

.record-content {
  padding: 8px 0;
}

.record-operator {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.record-action {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.record-remark {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .detail-content {
    padding: 12px;
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }

  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }
}
</style>
