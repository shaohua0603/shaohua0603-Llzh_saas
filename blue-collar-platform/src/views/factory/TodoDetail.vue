<template>
  <div class="factory-todo-detail">
    <div class="detail-container">
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
        <ApprovalFlow
          :flow-config="flowConfig"
          :approval-status="approvalStatus"
          :show-approval-form="canApprove"
          :readonly="!canApprove"
          @approve="handleApprove"
          @reject="handleReject"
          @transfer="handleTransfer"
        />
      </el-card>

      <!-- 操作按钮 -->
      <div v-if="canApprove" class="action-buttons">
        <el-button type="primary" size="large" @click="handleQuickApprove">
          <el-icon><Select /></el-icon>
          审批通过
        </el-button>
        <el-button type="danger" size="large" @click="handleQuickReject">
          <el-icon><Close /></el-icon>
          审批驳回
        </el-button>
        <el-button size="large" @click="handleTransfer">
          <el-icon><Switch /></el-icon>
          转交他人
        </el-button>
      </div>
      <div v-else class="action-buttons">
        <el-button size="large" @click="handleViewBusinessDetail">
          <el-icon><View /></el-icon>
          查看业务详情
        </el-button>
      </div>
    </div>

    <!-- 快速审批对话框 -->
    <el-dialog
      v-model="quickApproveVisible"
      title="快速审批"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="审批结果" required>
          <el-radio-group v-model="approvalForm.result">
            <el-radio label="approved">
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
              通过
            </el-radio>
            <el-radio label="rejected">
              <el-icon color="#f56c6c"><CircleClose /></el-icon>
              驳回
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input
            v-model="approvalForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审批意见"
          />
        </el-form-item>
        <el-form-item v-if="approvalForm.result === 'rejected'" label="驳回原因" required>
          <el-input
            v-model="approvalForm.rejectReason"
            type="textarea"
            :rows="3"
            placeholder="请输入驳回原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="quickApproveVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitApproval">提交</el-button>
      </template>
    </el-dialog>

    <!-- 转交对话框 -->
    <el-dialog
      v-model="transferVisible"
      title="转交他人"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="transferForm" label-width="100px">
        <el-form-item label="转交人" required>
          <el-select
            v-model="transferForm.toUser"
            placeholder="请选择转交人"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="user in availableUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转交说明">
          <el-input
            v-model="transferForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入转交说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transferVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitTransfer">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download,
  Select,
  Close,
  Switch,
  Back,
  View,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'
import ApprovalFlow from '@/components/ApprovalFlow.vue'
import type {
  ApprovalFlowConfig,
  ApprovalStatus,
  ApprovalFormData
} from '@/types/approval-flow'

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
  content: '因家中有事,申请请假3天,从2026-02-26至2026-02-28。',
  remark: '请假期间工作已交接给李四',
  attachments: [
    { name: '请假申请表.pdf', url: '#' },
    { name: '相关证明材料.jpg', url: '#' }
  ]
})

// 审批流程配置
const flowConfig = ref<ApprovalFlowConfig>({
  id: 'flow-001',
  name: '请假审批流程',
  code: 'leave-approval',
  description: '员工请假审批流程',
  status: 'enabled',
  nodes: [
    {
      id: 'node-001',
      name: '部门主管审批',
      type: 'approval',
      approvers: ['user-001', 'user-002'],
      approvalMode: 'or',
      required: true
    },
    {
      id: 'node-002',
      name: '人事审批',
      type: 'approval',
      approvers: ['user-003'],
      approvalMode: 'or',
      required: true
    }
  ],
  createdAt: '2026-02-25T09:00:00Z',
  updatedAt: '2026-02-25T09:00:00Z'
})

// 审批状态
const approvalStatus = ref<ApprovalStatus>({
  status: 'pending',
  currentNodeId: 'node-001',
  records: [
    {
      nodeId: 'node-001',
      nodeName: '部门主管审批',
      approver: '张主管',
      approvalTime: new Date('2026-02-25T10:00:00Z'),
      approvalResult: 'pending',
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

// 快速审批对话框
const quickApproveVisible = ref(false)

// 转交对话框
const transferVisible = ref(false)

// 审批表单
const approvalForm = reactive<ApprovalFormData>({
  comment: '',
  result: 'approved',
  rejectReason: '',
  transferTo: '',
  attachments: []
})

// 转交表单
const transferForm = reactive({
  toUser: '',
  remark: ''
})

// 返回
const goBack = () => {
  router.back()
}

// 下载附件
const handleDownload = (file: any) => {
  ElMessage.info(`下载附件: ${file.name}`)
}

// 快速审批通过
const handleQuickApprove = () => {
  approvalForm.result = 'approved'
  approvalForm.comment = ''
  approvalForm.rejectReason = ''
  quickApproveVisible.value = true
}

// 快速审批驳回
const handleQuickReject = () => {
  approvalForm.result = 'rejected'
  approvalForm.comment = ''
  approvalForm.rejectReason = ''
  quickApproveVisible.value = true
}

// 转交他人
const handleTransfer = () => {
  transferVisible.value = true
}

// 提交审批
const handleSubmitApproval = () => {
  if (approvalForm.result === 'rejected' && !approvalForm.rejectReason) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  ElMessageBox.confirm('确定要提交审批吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('审批提交成功')
      quickApproveVisible.value = false
      // 更新状态
      if (approvalForm.result === 'approved') {
        todoDetail.value.status = 'approved'
      } else {
        todoDetail.value.status = 'rejected'
      }
      // 添加审批记录
      approvalStatus.value.records.push({
        nodeId: approvalStatus.value.currentNodeId!,
        nodeName: '部门主管审批',
        approver: '当前用户',
        approvalTime: new Date(),
        approvalResult: approvalForm.result as any,
        approvalComment: approvalForm.comment
      })
    }, 500)
  }).catch(() => {})
}

// 审批通过
const handleApprove = (data: ApprovalFormData) => {
  ElMessage.success('审批通过')
  todoDetail.value.status = 'approved'
  approvalStatus.value.records.push({
    nodeId: approvalStatus.value.currentNodeId!,
    nodeName: '部门主管审批',
    approver: '当前用户',
    approvalTime: new Date(),
    approvalResult: 'approved',
    approvalComment: data.comment
  })
}

// 审批驳回
const handleReject = (data: ApprovalFormData) => {
  ElMessage.success('已驳回')
  todoDetail.value.status = 'rejected'
  approvalStatus.value.records.push({
    nodeId: approvalStatus.value.currentNodeId!,
    nodeName: '部门主管审批',
    approver: '当前用户',
    approvalTime: new Date(),
    approvalResult: 'rejected',
    approvalComment: data.comment
  })
}

// 提交转交
const handleSubmitTransfer = () => {
  if (!transferForm.toUser) {
    ElMessage.warning('请选择转交人')
    return
  }

  ElMessageBox.confirm('确定要转交给他人吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('转交成功')
      transferVisible.value = false
      goBack()
    }, 500)
  }).catch(() => {})
}

// 查看业务详情
const handleViewBusinessDetail = () => {
  // 根据任务类型跳转到对应的业务详情页
  const businessType = todoDetail.value.type
  const businessId = todoDetail.value.businessId || todoDetail.value.id

  switch (businessType) {
    case 'leave':
      router.push(`/factory/leave-detail/${businessId}`)
      break
    case 'transfer':
      router.push(`/factory/transfer-detail/${businessId}`)
      break
    case 'resignation':
      router.push(`/factory/resignation-detail/${businessId}`)
      break
    case 'contract':
      router.push(`/factory/contract-detail/${businessId}`)
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
.factory-todo-detail {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  margin-bottom: 0;
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

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .factory-todo-detail {
    padding: 10px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
