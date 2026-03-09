<template>
  <div class="detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>请假基本信息</span>
          </div>
        </template>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">请假人：</span>
            <span class="info-value">{{ leaveInfo.workerName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">工号：</span>
            <span class="info-value">{{ leaveInfo.workerId || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">工厂：</span>
            <span class="info-value">{{ leaveInfo.factory || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">区域：</span>
            <span class="info-value">{{ leaveInfo.area || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">产线：</span>
            <span class="info-value">{{ leaveInfo.productionLine || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">请假类型：</span>
            <span class="info-value">{{ leaveInfo.leaveType || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">请假天数：</span>
            <span class="info-value">{{ leaveInfo.leaveDays || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">开始日期：</span>
            <span class="info-value">{{ leaveInfo.startDate || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">结束日期：</span>
            <span class="info-value">{{ leaveInfo.endDate || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">请假原因：</span>
            <span class="info-value">{{ leaveInfo.reason || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">提交时间：</span>
            <span class="info-value">{{ leaveInfo.submitTime || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">状态：</span>
            <span class="info-value">
              <el-tag :type="leaveInfo.status === 'APPROVED' ? 'success' : leaveInfo.status === 'REJECTED' ? 'danger' : 'info'">
                {{ leaveInfo.status === 'APPROVED' ? '审核通过' : leaveInfo.status === 'REJECTED' ? '已驳回' : leaveInfo.status === 'PENDING' ? '待审核' : '审核中' }}
              </el-tag>
            </span>
          </div>
        </div>
      </el-card>

      <!-- 审核组件 -->
      <div class="approval-component">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>审核</span>
            </div>
          </template>
          
          <!-- 审核记录 -->
          <div v-if="approvalRecords.length > 0" class="mb-4">
            <h3 class="section-title">审核记录</h3>
            <el-timeline>
              <el-timeline-item
                v-for="(record, index) in approvalRecords"
                :key="index"
                :type="record.approvalResult === 'approved' ? 'success' : 'danger'"
                :timestamp="record.approvalTime"
              >
                <div class="timeline-content">
                  <div class="approval-result">
                    <span :class="record.approvalResult === 'approved' ? 'text-success' : 'text-danger'">
                      {{ record.approvalResult === 'approved' ? '审核通过' : '已驳回' }}
                    </span>
                  </div>
                  <div class="approval-comment" v-if="record.approvalComment">
                    备注：{{ record.approvalComment }}
                  </div>
                  <div class="approval-reason" v-if="record.approvalResult === 'rejected' && record.reason">
                    驳回原因：{{ record.reason }}
                  </div>
                  <div class="approval-person">
                    审核人：{{ record.approver }}
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>

          <!-- 审核表单 -->
          <div v-if="canApprove" class="approval-form">
            <h3 class="section-title">审核操作</h3>
            <el-form :model="approvalForm" :rules="approvalRules" ref="approvalFormRef">
              <el-form-item label="审核结果" prop="result">
                <el-radio-group v-model="approvalForm.result">
                  <el-radio label="approved">通过</el-radio>
                  <el-radio label="rejected">驳回</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注" prop="comment" v-if="approvalForm.result === 'approved'">
                <el-input type="textarea" v-model="approvalForm.comment" placeholder="请输入备注信息" />
              </el-form-item>
              <el-form-item label="驳回原因" prop="reason" v-if="approvalForm.result === 'rejected'">
                <el-input type="textarea" v-model="approvalForm.reason" placeholder="请输入驳回原因" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button 
        v-if="canApprove" 
        type="primary" 
        @click="handleSubmitApproval"
        :loading="submitLoading"
      >
        <el-icon><Check /></el-icon>
        提交审核
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const approvalFormRef = ref<InstanceType<typeof ElForm> | null>(null)

// 请假信息
const leaveInfo = ref({
  workerName: '张三',
  workerId: 'W2024001',
  factory: '工厂A',
  area: '区域1',
  productionLine: '产线1',
  leaveType: '事假',
  leaveDays: 3,
  startDate: '2024-01-15',
  endDate: '2024-01-17',
  reason: '家中有事需要处理',
  submitTime: '2024-01-10 14:30:00',
  status: 'PENDING'
})

// 审核记录
const approvalRecords = ref([
  {
    nodeId: '1',
    nodeName: '部门主管',
    approver: '李四',
    approvalTime: '2024-01-11 10:00:00',
    approvalResult: 'approved',
    approvalComment: '同意请假'
  }
])

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

// 是否可以审核
const canApprove = ref(true)
const submitLoading = ref(false)

// 处理审核提交
const handleSubmitApproval = async () => {
  if (!approvalFormRef.value) return
  
  try {
    await approvalFormRef.value.validate()
    
    submitLoading.value = true
    // 模拟审核提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('审核提交成功')
    
    // 跳转回列表页
    router.push('/tenant/on-duty/leave')
  } catch (error) {
    console.error('审核表单验证失败', error)
  } finally {
    submitLoading.value = false
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  // 模拟获取请假详情数据
  // 在实际项目中，这里应该调用API获取数据
  
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

.mb-4 {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 500;
  margin-right: 8px;
  min-width: 100px;
  color: #606266;
}

.info-value {
  flex: 1;
  color: #303133;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #303133;
}

.timeline-content {
  padding: 8px 0;
}

.approval-result {
  font-weight: 500;
  margin-bottom: 4px;
}

.approval-comment,
.approval-reason {
  margin-bottom: 4px;
  color: #606266;
}

.approval-person {
  font-size: 14px;
  color: #909399;
}

.text-success {
  color: #67c23a;
}

.text-danger {
  color: #f56c6c;
}

.approval-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
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
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>