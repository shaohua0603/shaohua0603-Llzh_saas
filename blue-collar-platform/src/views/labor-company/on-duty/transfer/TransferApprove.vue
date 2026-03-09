<template>
  <div class="detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-form label-width="120px" :disabled="true">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="调岗编号">
                <el-input v-model="transferData.code" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工人姓名">
                <el-input v-model="transferData.workerName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号">
                <el-input v-model="transferData.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="申请日期">
                <el-input v-model="transferData.applyDate" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核状态">
                <el-tag :type="getStatusType(transferData.status)">
                  {{ getStatusText(transferData.status) }}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 原岗位信息 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>原岗位信息</span>
          </div>
        </template>
        <el-form label-width="120px" :disabled="true">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="原部门">
                <el-input v-model="transferData.originalDepartment" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原岗位">
                <el-input v-model="transferData.originalPosition" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原薪资">
                <el-input v-model="transferData.originalSalary" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 目标岗位信息 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>目标岗位信息</span>
          </div>
        </template>
        <el-form label-width="120px" :disabled="true">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="目标部门">
                <el-input v-model="transferData.targetDepartment" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目标岗位">
                <el-input v-model="transferData.targetPosition" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目标薪资">
                <el-input v-model="transferData.targetSalary" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 调岗原因 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>调岗原因</span>
          </div>
        </template>
        <el-form label-width="120px" :disabled="true">
          <el-form-item label="调岗原因">
            <el-input v-model="transferData.reason" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 审核记录 -->
      <el-card class="mb-4" v-if="approvalRecords.length > 0">
        <template #header>
          <div class="card-header">
            <span>审核记录</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in approvalRecords"
            :key="index"
            :type="record.result === 'approved' ? 'success' : 'danger'"
            :timestamp="record.time"
          >
            <div class="approval-record">
              <div class="record-title">
                {{ record.result === 'approved' ? '审核通过' : '审核驳回' }}
              </div>
              <div class="record-content">
                <p><strong>审核人：</strong>{{ record.approver }}</p>
                <p><strong>备注：</strong>{{ record.comment }}</p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- 审核表单 -->
      <div class="approval-component">
        <el-card v-if="canApprove">
        <template #header>
          <div class="card-header">
            <span>审核操作</span>
          </div>
        </template>
        <el-form :model="approvalForm" :rules="approvalRules" ref="approvalFormRef" label-width="120px">
          <el-form-item label="审核结果" prop="result">
            <el-radio-group v-model="approvalForm.result">
              <el-radio label="approved">通过</el-radio>
              <el-radio label="rejected">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核备注" prop="comment">
            <el-input v-model="approvalForm.comment" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="驳回原因" prop="reason" v-if="approvalForm.result === 'rejected'">
            <el-input v-model="approvalForm.reason" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
        </el-card>
      </div>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmitApproval" v-if="canApprove">
        <el-icon><Check /></el-icon>
        提交审核
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const approvalFormRef = ref<any>(null)

// 调岗数据
const transferData = ref({
  id: 1,
  code: 'TG202401001',
  workerName: '张三',
  phone: '13800138000',
  applyDate: '2024-01-15',
  status: 'PENDING',
  originalDepartment: '生产部',
  originalPosition: '操作工',
  originalSalary: '5000',
  targetDepartment: '质检部',
  targetPosition: '质检员',
  targetSalary: '5500',
  reason: '个人职业发展规划，希望从事质检工作，提升专业技能。'
})

// 审核表单
const approvalForm = ref({
  result: 'approved' as 'approved' | 'rejected',
  comment: '',
  reason: ''
})

// 审核规则
const approvalRules = ref({
  result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
  reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }]
})

// 审核记录
const approvalRecords = ref([
  {
    id: 1,
    approver: '李四',
    result: 'approved',
    comment: '同意调岗',
    time: '2024-01-16 10:30:00'
  }
])

// 是否可以审核
const canApprove = ref(true)

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap = {
    PENDING: 'info',
    IN_PROGRESS: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger'
  }
  return statusMap[status as keyof typeof statusMap] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap = {
    PENDING: '未审核',
    IN_PROGRESS: '审核中',
    APPROVED: '审核通过',
    REJECTED: '已驳回'
  }
  return statusMap[status as keyof typeof statusMap] || '未知状态'
}

// 提交审核
const handleSubmitApproval = async () => {
  if (!approvalFormRef.value) return
  
  try {
    await approvalFormRef.value.validate()
    
    // 模拟审核提交
    ElMessage.success('审核提交成功')
    router.push('/tenant/on-duty/transfer')
  } catch (error) {
    console.error('审核表单验证失败', error)
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  // 这里可以根据路由参数获取调岗记录详情
  const id = route.params.id
  console.log('调岗审核ID:', id)
  
  // 模拟获取数据
  // 在实际应用中，这里应该调用API获取调岗记录详情
  
  // 自动滚动到审核组件
  setTimeout(() => {
    const approvalElement = document.querySelector('.approval-component')
    if (approvalElement) {
      approvalElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 500)
})
</script>

<style scoped>
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.approval-record {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.record-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.record-content p {
  margin: 4px 0;
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