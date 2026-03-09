<template>
  <div class="detail-container">
    <div class="detail-content">
      <el-card class="detail-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <h2>调岗详情</h2>
          </div>
        </template>
        
        <div class="info-section">
          <h3>基本信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="工人姓名">{{ formData.workerName }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ formData.phone }}</el-descriptions-item>
            <el-descriptions-item label="期望调岗日期">{{ formData.expectedTransferDate }}</el-descriptions-item>
            <el-descriptions-item label="审核状态">
              <el-tag :type="getApprovalStatusTag(formData.approvalStatus)">
                {{ getApprovalStatusText(formData.approvalStatus) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="info-section">
          <h3>原岗位信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="原部门">{{ formData.originalDepartment }}</el-descriptions-item>
            <el-descriptions-item label="原岗位">{{ formData.originalPosition }}</el-descriptions-item>
            <el-descriptions-item label="原岗位直属领导" :span="2">{{ formData.originalLeader }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="info-section">
          <h3>目标岗位信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="目标部门">{{ formData.targetDepartment }}</el-descriptions-item>
            <el-descriptions-item label="目标岗位">{{ formData.targetPosition }}</el-descriptions-item>
            <el-descriptions-item label="目标岗位直属组长" :span="2">{{ formData.targetLeader }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="info-section">
          <h3>调岗原因</h3>
          <el-card class="reason-card">
            {{ formData.transferReason }}
          </el-card>
        </div>
        
        <div class="info-section" v-if="formData.approvalRecords && formData.approvalRecords.length > 0">
          <h3>审核记录</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in formData.approvalRecords"
              :key="index"
              :timestamp="record.approvalTime"
              :type="record.approvalResult === 'approved' ? 'success' : 'danger'"
            >
              <h4>{{ record.approver }}</h4>
              <p>{{ record.approvalResult === 'approved' ? '审核通过' : '审核驳回' }}</p>
              <p v-if="record.approvalComment" class="approval-comment">{{ record.approvalComment }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="handleCancel">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

interface TransferRecord {
  id: string
  workerName: string
  phone: string
  expectedTransferDate: string
  originalDepartment: string
  originalPosition: string
  originalLeader: string
  targetDepartment: string
  targetPosition: string
  targetLeader: string
  transferReason: string
  approvalStatus: 'pending' | 'processing' | 'approved' | 'rejected'
  approvalRecords: any[]
}

const formData = reactive<TransferRecord>({
  id: '',
  workerName: '',
  phone: '',
  expectedTransferDate: '',
  originalDepartment: '',
  originalPosition: '',
  originalLeader: '',
  targetDepartment: '',
  targetPosition: '',
  targetLeader: '',
  transferReason: '',
  approvalStatus: 'pending',
  approvalRecords: []
})

// 模拟数据
const mockData: TransferRecord[] = [
  {
    id: '1',
    workerName: '张三',
    phone: '13800138001',
    expectedTransferDate: '2024-03-01',
    originalDepartment: '生产部',
    originalPosition: '操作工',
    originalLeader: '李主管',
    targetDepartment: '质检部',
    targetPosition: '质检员',
    targetLeader: '王组长',
    transferReason: '个人发展需求',
    approvalStatus: 'pending',
    approvalRecords: []
  },
  {
    id: '2',
    workerName: '李四',
    phone: '13800138002',
    expectedTransferDate: '2024-02-15',
    originalDepartment: '包装部',
    originalPosition: '包装工',
    originalLeader: '赵主管',
    targetDepartment: '仓储部',
    targetPosition: '仓管员',
    targetLeader: '钱组长',
    transferReason: '工作表现优秀',
    approvalStatus: 'approved',
    approvalRecords: [
      { approver: '管理员', approvalTime: '2024-02-10 10:00:00', approvalResult: 'approved', approvalComment: '同意调岗' }
    ]
  }
]

// 获取调岗详情
const fetchTransferDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const record = mockData.find(item => item.id === route.params.id)
    if (record) {
      Object.assign(formData, record)
    }
  } catch (error) {
    ElMessage.error('获取调岗详情失败')
  } finally {
    loading.value = false
  }
}

// 获取审核状态标签类型
const getApprovalStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

// 获取审核状态文本
const getApprovalStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return map[status] || status
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/on-duty/transfer-edit/${formData.id}`)
}

// 取消
const handleCancel = () => {
  router.push('/tenant/on-duty/transfer')
}

// 生命周期
onMounted(() => {
  fetchTransferDetail()
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

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.info-section {
  margin-bottom: 24px;
}

.info-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 12px;
}

.reason-card {
  margin-top: 8px;
  border-left: 4px solid #e6a23c;
}

.approval-comment {
  margin-top: 8px;
  color: #606266;
  font-size: 14px;
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