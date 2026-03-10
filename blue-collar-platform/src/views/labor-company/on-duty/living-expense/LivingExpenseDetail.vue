<template>
  <div class="detail-container">
    <div class="detail-content" :class="{ 'with-sidebar': workerInfoVisible }">
      <el-card class="detail-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span>生活费详情</span>
            <el-button type="primary" link @click="toggleWorkerInfo">
              <el-icon><User /></el-icon>
              查看工人信息
            </el-button>
          </div>
        </template>
        <div v-if="detailData" class="content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="申请人">
              {{ detailData.workerName }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号">
              {{ detailData.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="驻厂负责人">
              {{ detailData.factoryManager || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="驻厂负责人手机号">
              {{ detailData.factoryManagerPhone || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="文员">
              {{ detailData.clerk || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="文员手机号">
              {{ detailData.clerkPhone || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="申请金额">
              ¥{{ detailData.amount.toFixed(2) }}
            </el-descriptions-item>
            <el-descriptions-item label="申请时间">
              {{ formatDate(detailData.applyDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="申请状态">
              <el-tag :type="getStatusType(detailData.status)">
                {{ getStatusText(detailData.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="发放时间">
              {{ detailData.issueDate ? formatDate(detailData.issueDate) : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="申请说明" :span="2">
              {{ detailData.description || '-' }}
            </el-descriptions-item>
            <el-descriptions-item v-if="detailData.rejectReason" label="驳回原因" :span="2">
              {{ detailData.rejectReason }}
            </el-descriptions-item>
            <el-descriptions-item v-if="detailData.remark" label="备注" :span="2">
              {{ detailData.remark }}
            </el-descriptions-item>
          </el-descriptions>
          
          <!-- 审核组件 -->
          <ApprovalComponent
            ref="approvalComponentRef"
            :is-approval-mode="isApproveMode"
            :can-approve="canApprove"
            :approval-records="approvalRecords"
            :on-submit="handleSubmitApproval"
          />
        </div>
        <el-empty v-else description="未找到数据" />
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button 
        v-if="isApproveMode && canApprove" 
        type="primary" 
        @click="handleSubmitApprovalFromButton"
      >
        <el-icon><Check /></el-icon>
        提交审核
      </el-button>
      <el-button 
        v-else-if="detailData?.status === 'approved' " 
        type="warning" 
        @click="handleIssue"
      >
        <el-icon><Money /></el-icon>
        发放
      </el-button>
    </div>
    
    <!-- 工人信息侧边栏 -->
    <WorkerInfoSidebar
      v-model:visible="workerInfoVisible"
      :worker-name="detailData?.workerName"
      :phone="detailData?.phone"
    />
    
    <!-- 发放对话框 -->
    <el-dialog
      v-model="issueDialogVisible"
      title="生活费发放"
      width="500px"
    >
      <el-form :model="issueForm" label-width="120px">
        <el-form-item label="发放金额">
          <el-input-number
            v-model="issueForm.amount"
            :min="0"
            :precision="2"
          />
          <span class="form-tip">元</span>
        </el-form-item>
        <el-form-item label="发放方式">
          <el-select v-model="issueForm.method" placeholder="请选择">
            <el-option label="现金" value="cash" />
            <el-option label="银行转账" value="bank" />
            <el-option label="微信" value="wechat" />
            <el-option label="支付宝" value="alipay" />
          </el-select>
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker
            v-model="issueForm.issueDate"
            type="datetime"
            placeholder="选择发放时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="issueForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="issueDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitIssue">确定发放</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElDialog } from 'element-plus'
import { ArrowLeft, Check, Money, User } from '@element-plus/icons-vue'
import WorkerInfoSidebar from '@/components/WorkerInfoSidebar.vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchLivingExpenseDetail, updateLivingExpenseStatus } from '@/api/livingExpense'
import ApprovalComponent from '@/components/ApprovalComponent.vue'
import type { ApprovalRecord } from '@/types/livingExpense'

// 类型定义
interface LivingExpenseRecord {
  id: string
  workerName: string
  phone: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'issued'
  applyDate: string
  issueDate?: string
  description?: string
  rejectReason?: string
  remark?: string
  factoryManager?: string
  factoryManagerPhone?: string
  clerk?: string
  clerkPhone?: string
}

const router = useRouter()
const route = useRoute()

const loading = ref(false)

// 工人信息侧边栏
const workerInfoVisible = ref(false)
const detailData = ref<LivingExpenseRecord | null>(null)
const approvalComponentRef = ref<any>(null)

// 审核模式
const isApproveMode = computed(() => route.query.mode === 'approve')

// 是否可以审核
const canApprove = computed(() => isApproveMode.value && detailData.value?.status === 'pending')

// 审核记录
const approvalRecords = ref<ApprovalRecord[]>([])

// 审核表单
const approveForm = reactive({
  result: 'approved' as 'approved' | 'rejected',
  reason: '',
  comment: ''
})

// 发放对话框控制
const issueDialogVisible = ref(false)

// 发放表单
const issueForm = reactive({
  amount: 0,
  method: 'bank',
  issueDate: '',
  comment: ''
})

// 所有模拟数据已移至api/livingExpense.ts中

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    approved: 'primary',
    rejected: 'danger',
    issued: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回',
    issued: '已发放'
  }
  return textMap[status] || status
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  return dateStr
}

// 获取详情数据
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('缺少ID参数')
    return
  }

  loading.value = true
  try {
    const response = fetchLivingExpenseDetail(id)
    if (response.code === 200 && response.data) {
      detailData.value = response.data
      // 设置审核记录
      if (response.data.approvalRecords) {
        approvalRecords.value = response.data.approvalRecords
      }
    } else {
      ElMessage.error('未找到数据')
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 提交审核（从组件回调）
const handleSubmitApproval = async (result: 'approved' | 'rejected', reason: string, comment: string) => {
  if (!detailData.value) return false

  try {
    const data = {
      reason: reason,
      comment: comment
    }
    const response = updateLivingExpenseStatus(detailData.value.id, result, data)
    if (response.code === 200) {
      ElMessage.success(result === 'approved' ? '审核通过' : '已驳回')
      router.back()
      return true
    }
    return false
  } catch (error) {
    ElMessage.error('审核失败')
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

// 打开发放对话框
const handleIssue = () => {
  if (!detailData.value) return
  
  issueForm.amount = detailData.value.amount
  issueForm.method = 'bank'
  issueForm.issueDate = new Date().toISOString().split('T')[0] + ' 12:00:00'
  issueForm.comment = ''
  issueDialogVisible.value = true
}

// 提交发放
const handleSubmitIssue = async () => {
  if (!detailData.value) return

  try {
    const data = {
      issueDate: issueForm.issueDate,
      remark: issueForm.comment
    }
    const response = updateLivingExpenseStatus(detailData.value.id, 'issued', data)
    if (response.code === 200) {
      ElMessage.success('生活费发放成功')
      issueDialogVisible.value = false
      router.back()
    }
  } catch (error) {
    ElMessage.error('发放失败')
  }
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
  fetchDetail()
  
  // 移除自动滚动，让页面保持在顶部
  // if (isApproveMode.value) {
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
/* 详情页容器 - 使用flex布局实现内部滚动 */
.detail-container {
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
  padding: 16px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
}

.detail-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.content {
  margin-top: 16px;
}

.approve-form {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.approve-form .el-form {
  margin-top: 16px;
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
  
  .detail-card {
    max-width: 100%;
  }
}
</style>