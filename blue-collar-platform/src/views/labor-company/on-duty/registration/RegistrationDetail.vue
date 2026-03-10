<template>
  <div class="registration-detail">
    <div class="detail-content" :class="{ 'with-sidebar': workerInfoVisible }">
      <!-- 业务基本信息 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <div class="header-actions">
              <el-tag :type="getStatusType(registrationData.status)">
                {{ getStatusText(registrationData.status) }}
              </el-tag>
              <el-button type="primary" link @click="toggleWorkerInfo">
                <el-icon><User /></el-icon>
                查看工人信息
              </el-button>
            </div>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">
            {{ registrationData.workerName }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ registrationData.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="报名类型">
            <el-tag :type="registrationData.registrationType === 'activity' ? 'primary' : 'success'">
              {{ registrationData.registrationType === 'activity' ? '活动报名' : '社团报名' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="活动/社团标题">
            {{ registrationData.activityTitle }}
          </el-descriptions-item>
          <el-descriptions-item label="提交报名时间">
            {{ formatDateTime(registrationData.submitTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="是否需要审核">
            <el-tag :type="registrationData.needsApproval ? 'warning' : 'info'">
              {{ registrationData.needsApproval ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="报名说明" :span="2">
            {{ registrationData.description || '-' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="registrationData.rejectReason" label="驳回原因" :span="2">
            {{ registrationData.rejectReason }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 统一审核组件 -->
      <el-card class="detail-card" shadow="never">
        <ApprovalComponent
          ref="approvalComponentRef"
          :is-approval-mode="isApprovalMode"
          :can-approve="canApprove"
          :approval-records="registrationData.approvalRecords || []"
          :on-submit="handleSubmitApproval"
        />
      </el-card>
    </div>
    
    <!-- 工人信息侧边栏 -->
    <WorkerInfoSidebar
      v-model:visible="workerInfoVisible"
      :worker-name="registrationData.workerName"
      :phone="registrationData.phone"
    />
    
    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button
        v-if="isApprovalMode && canApprove"
        type="primary"
        @click="handleSubmitApprovalFromButton"
      >
        <el-icon><Check /></el-icon>
        提交审核
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check, User } from '@element-plus/icons-vue'
import WorkerInfoSidebar from '@/components/WorkerInfoSidebar.vue'
import { useRoute, useRouter } from 'vue-router'
import ApprovalComponent from '@/components/ApprovalComponent.vue'
import type { ApprovalRecord } from '@/types/approval-flow'
import {
  approveApproval,
  rejectApproval,
  getApprovalRecords
} from '@/api/approvalApi'

// 类型定义
interface RegistrationRecord {
  id: string
  workerName: string
  phone: string
  registrationType: 'activity' | 'community'
  activityTitle: string
  status: 'pending' | 'processing' | 'approved' | 'rejected'
  submitTime: string
  description?: string
  rejectReason?: string
  approvalRecords?: ApprovalRecord[]
  needsApproval?: boolean
}

// 响应式数据
const route = useRoute()
const router = useRouter()

// 工人信息侧边栏
const workerInfoVisible = ref(false)
const registrationData = ref<RegistrationRecord>({
  id: '',
  workerName: '',
  phone: '',
  registrationType: 'activity',
  activityTitle: '',
  status: 'pending',
  submitTime: '',
  description: '',
  needsApproval: false
})
const loading = ref(false)
const approvalComponentRef = ref<any>(null)

// 计算属性
const isApprovalMode = computed(() => route.query.mode === 'approve')
const canApprove = computed(() => {
  return registrationData.value.needsApproval && 
    (registrationData.value.status === 'pending' || registrationData.value.status === 'processing')
})

// 获取业务字段配置
const getBusinessFields = () => {
  return [
    { field: 'workerName', label: '姓名', type: 'text' },
    { field: 'phone', label: '手机号', type: 'text' },
    { field: 'registrationType', label: '报名类型', type: 'enum', options: [
      { label: '活动报名', value: 'activity' },
      { label: '社团报名', value: 'community' }
    ]},
    { field: 'activityTitle', label: '活动/社团标题', type: 'text' },
    { field: 'status', label: '审核状态', type: 'enum', options: [
      { label: '待审核', value: 'pending', color: 'warning' },
      { label: '审核中', value: 'processing', color: 'primary' },
      { label: '已通过', value: 'approved', color: 'success' },
      { label: '已驳回', value: 'rejected', color: 'danger' }
    ]},
    { field: 'submitTime', label: '提交时间', type: 'datetime' },
    { field: 'description', label: '报名说明', type: 'text', span: 2 }
  ]
}

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || status
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

// 加载报名数据
const loadRegistrationData = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('缺少报名ID')
    router.back()
    return
  }

  loading.value = true
  try {
    // 模拟数据
    const mockData = {
      id,
      workerName: '张三',
      phone: '13812345678',
      registrationType: 'activity' as const,
      activityTitle: '周末篮球比赛',
      status: 'pending' as const,
      submitTime: new Date().toISOString(),
      description: '自愿报名参加此活动',
      needsApproval: true,
      approvalRecords: []
    }
    registrationData.value = mockData

    // 加载审批记录
    if (mockData.needsApproval) {
      await loadApprovalRecords(id)
    }
  } catch (error) {
    console.error('加载报名数据失败:', error)
    ElMessage.error('加载报名数据失败')
  } finally {
    loading.value = false
  }
}

// 加载审批记录
const loadApprovalRecords = async (businessId: string) => {
  try {
    const response = await getApprovalRecords({
      businessId,
      businessType: 'REGISTRATION'
    })
    if (response.data) {
      registrationData.value.approvalRecords = response.data
    }
  } catch (error) {
    console.error('加载审批记录失败:', error)
    ElMessage.error('加载审批记录失败')
  }
}

// 提交审核
const handleSubmitApproval = async (result: 'approved' | 'rejected', reason: string, comment: string) => {
  try {
    const businessId = registrationData.value.id
    const businessType = 'REGISTRATION'
    
    if (result === 'approved') {
      await approveApproval({
        businessId,
        businessType,
        result,
        comment,
        rejectReason: '',
        attachments: []
      })
      ElMessage.success('审批通过成功')
    } else {
      await rejectApproval({
        businessId,
        businessType,
        result,
        comment,
        rejectReason: reason,
        attachments: []
      })
      ElMessage.success('审批驳回成功')
    }
    
    await loadApprovalRecords(businessId)
    await loadRegistrationData()
    return true
  } catch (error) {
    console.error('审批失败:', error)
    ElMessage.error('审批失败')
    return false
  }
}

// 从底部按钮提交审核
const handleSubmitApprovalFromButton = async () => {
  if (!approvalComponentRef.value) return
  
  // 验证表单
  if (!approvalComponentRef.value.validateForm()) {
    return
  }
  
  // 获取表单数据
  const formData = approvalComponentRef.value.getFormData()
  
  // 提交审核
  await handleSubmitApproval(formData.result, formData.reason, formData.comment)
}

// 返回
const goBack = () => {
  router.back()
}

// 切换工人信息侧边栏
const toggleWorkerInfo = () => {
  workerInfoVisible.value = !workerInfoVisible.value
}

// 生命周期
onMounted(() => {
  loadRegistrationData()
  
  // 移除自动滚动，让页面保持在顶部
  // if (isApprovalMode.value) {
  //   setTimeout(() => {
  //     const approvalElement = document.querySelector('.approval-component')
  //     if (approvalElement) {
  //       approvalElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  //     }
  //   }, 500)
  // }
})
</script>

<style scoped>
.registration-detail {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
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