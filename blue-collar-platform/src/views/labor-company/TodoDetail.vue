<template>
  <div class="labor-company-todo-detail">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <el-tag :type="getStatusType(todoDetail.status)">
              {{ getStatusText(todoDetail.status) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务编号">{{ todoDetail.taskNo }}</el-descriptions-item>
          <el-descriptions-item label="任务类型">
            <el-tag type="info">{{ getTypeText(todoDetail.type) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="任务标题" :span="2">{{ todoDetail.title }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ todoDetail.applicant }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ todoDetail.department }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(todoDetail.priority)">
              {{ getPriorityText(todoDetail.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="截止时间">{{ todoDetail.deadline }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ todoDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ todoDetail.creator }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 任务详情 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <span>任务详情</span>
        </template>
        <div class="task-detail">
          <div class="detail-section">
            <h4>申请内容</h4>
            <p>{{ todoDetail.content }}</p>
          </div>
          <div v-if="todoDetail.attachments && todoDetail.attachments.length > 0" class="detail-section">
            <h4>附件</h4>
            <el-space wrap>
              <el-button
                v-for="(file, index) in todoDetail.attachments"
                :key="index"
                type="primary"
                link
                @click="handleDownload(file)"
              >
                <el-icon><Download /></el-icon>
                {{ file.name }}
              </el-button>
            </el-space>
          </div>
          <div v-if="todoDetail.remark" class="detail-section">
            <h4>备注</h4>
            <p>{{ todoDetail.remark }}</p>
          </div>
        </div>
      </el-card>

      <!-- 审批记录 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <span>审批记录</span>
        </template>
        <ApprovalComponent
          ref="approvalComponentRef"
          :is-approval-mode="canApprove"
          :can-approve="canApprove"
          :approval-records="approvalStatus.records"
          :on-submit="handleApprovalSubmit"
        />
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><Back /></el-icon>
        返回
      </el-button>
      <el-button v-if="canApprove" type="primary" @click="handleSubmitApprovalFromButton">
        <el-icon><Check /></el-icon>
        提交审核
      </el-button>
      <el-button v-else @click="handleViewBusinessDetail">
        <el-icon><View /></el-icon>
        查看业务详情
      </el-button>
    </div>




  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download,
  Check,
  Close,
  Back,
  View,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'
import ApprovalComponent from '@/components/ApprovalComponent.vue'
import type { ApprovalFormData } from '@/types/approval-flow'
import type { ApprovalRecord } from '@/types/livingExpense'

const route = useRoute()
const router = useRouter()
const todoId = route.params.id as string

// 待办任务详情
const todoDetail = ref<any>({
  id: 1,
  taskNo: 'TD202602250001',
  title: '张三请假申请',
  type: 'leave',
  applicant: '张三',
  department: '生产部',
  priority: 'high',
  status: 'pending',
  createTime: '2026-02-25 09:00:00',
  deadline: '2026-02-26 18:00:00',
  creator: '系统',
  content: '因家中有事，申请请假3天，从2026-02-26至2026-02-28。',
  remark: '请假期间工作已交接给李四',
  attachments: [
    { name: '请假申请表.pdf', url: '#' },
    { name: '相关证明材料.jpg', url: '#' }
  ]
})

// 审批状态
const approvalStatus = ref<{
  status: string
  currentNodeId: string
  records: ApprovalRecord[]
}>({
  status: 'pending',
  currentNodeId: 'node-001',
  records: [
    {
      nodeId: 'node-001',
      nodeName: '部门主管审批',
      approver: '张主管',
      approvalTime: '2026-02-25 10:00:00',
      approvalResult: 'approved',
      approvalComment: ''
    }
  ]
})

// 是否可以审批
const canApprove = computed(() => {
  return todoDetail.value.status === 'pending' || todoDetail.value.status === 'in_progress'
})

// 可用用户列表
const availableUsers = ref([
  { id: 'user-001', name: '李主管' },
  { id: 'user-002', name: '王经理' },
  { id: 'user-003', name: '赵人事' },
  { id: 'user-004', name: '钱总监' }
])

// ApprovalComponent 引用
const approvalComponentRef = ref<any>(null)

// 返回
const goBack = () => {
  router.back()
}

// 下载附件
const handleDownload = (file: any) => {
  ElMessage.info(`下载附件: ${file.name}`)
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
  await handleApprovalSubmit(formData.result, formData.reason, formData.comment)
}

// 审批提交处理
const handleApprovalSubmit = async (result: 'approved' | 'rejected', reason: string, comment: string) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(result === 'approved' ? '审批通过' : '已驳回')
    todoDetail.value.status = result
    
    // 添加审批记录
    const now = new Date()
    const approvalTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    
    approvalStatus.value.records.push({
      nodeId: approvalStatus.value.currentNodeId!,
      nodeName: '部门主管审批',
      approver: '当前用户',
      approvalTime: approvalTime,
      approvalResult: result,
      approvalComment: comment || reason
    })
    
    return true
  } catch (error) {
    ElMessage.error('审批失败')
    return false
  }
}



// 查看业务详情
const handleViewBusinessDetail = () => {
  // 根据任务类型跳转到对应的业务详情页
  const businessType = todoDetail.value.type
  const businessId = todoDetail.value.businessId || todoDetail.value.id

  switch (businessType) {
    case 'leave':
      router.push(`/tenant/on-duty/leave-detail/${businessId}`)
      break
    case 'transfer':
      router.push(`/tenant/on-duty/transfer-detail/${businessId}`)
      break
    case 'resignation':
      router.push(`/tenant/resignation/${businessId}`)
      break
    case 'contract':
      router.push(`/tenant/contract/${businessId}`)
      break
    default:
      ElMessage.info('暂无业务详情页')
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    in_progress: 'primary',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审批',
    in_progress: '审批中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || '未知'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    leave: '请假审批',
    transfer: '调岗审批',
    resignation: '离职审批',
    contract: '合同审批',
    other: '其他审批'
  }
  return textMap[type] || '未知'
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const typeMap: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return typeMap[priority] || 'info'
}

// 获取优先级文本
const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return textMap[priority] || '未知'
}

// 获取待办任务详情
const fetchTodoDetail = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 实际项目中这里应该调用API获取详情数据
  } catch (error) {
    ElMessage.error('获取待办任务详情失败')
  }
}

// 生命周期
onMounted(() => {
  fetchTodoDetail()
})
</script>

<style scoped>
.labor-company-todo-detail {
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

.task-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.detail-section p {
  margin: 0;
  font-size: 14px;
  color: #606266;
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
