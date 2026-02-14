<template>
  <div class="worker-transfer-detail">
    <BackButton />
    <div class="page-header">
      <h2>调岗详情</h2>
    </div>
    
    <!-- 调岗详情 -->
    <div class="transfer-detail-section">
      <div v-if="transferDetail" class="transfer-detail-card">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3>基本信息</h3>
          <div class="detail-item">
            <span class="label">调岗类型:</span>
            <el-tag :type="getTransferType(transferDetail.type)">{{ getTransferTypeText(transferDetail.type) }}</el-tag>
          </div>
          <div class="detail-item">
            <span class="label">原部门:</span>
            <span>{{ transferDetail.originalDepartment }}</span>
          </div>
          <div class="detail-item">
            <span class="label">原岗位:</span>
            <span>{{ transferDetail.originalPosition }}</span>
          </div>
          <div class="detail-item">
            <span class="label">原组长:</span>
            <span>{{ transferDetail.originalTeamLeader }}</span>
          </div>
          <div class="detail-item">
            <span class="label">目标部门:</span>
            <span>{{ transferDetail.targetDepartment }}</span>
          </div>
          <div class="detail-item">
            <span class="label">目标岗位:</span>
            <span>{{ transferDetail.targetPosition }}</span>
          </div>
          <div class="detail-item">
            <span class="label">目标组长:</span>
            <span>{{ transferDetail.targetTeamLeader }}</span>
          </div>
          <div class="detail-item">
            <span class="label">调岗原因:</span>
            <span>{{ transferDetail.reason || '无' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">期望到岗时间:</span>
            <span>{{ transferDetail.expectedDate }}</span>
          </div>
          <div class="detail-item">
            <span class="label">申请时间:</span>
            <span>{{ transferDetail.applyDate }}</span>
          </div>
          <div class="detail-item">
            <span class="label">状态:</span>
            <el-tag :type="getStatusType(transferDetail.status)">{{ getStatusText(transferDetail.status) }}</el-tag>
          </div>
        </div>
        
        <!-- 审批记录 -->
        <div class="detail-section">
          <h3>审批记录</h3>
          <div v-if="transferDetail.approvalRecords && transferDetail.approvalRecords.length > 0" class="approval-records">
            <div v-for="(record, index) in transferDetail.approvalRecords" :key="record.id" class="approval-record">
              <div class="approval-header">
                <div class="approval-step">{{ record.step }}</div>
                <el-tag :type="record.status === '已批准' || record.status === '已提交' ? 'success' : 'danger'">
                  {{ record.status }}
                </el-tag>
              </div>
              <div class="approval-body">
                <div class="approval-info">
                  <span class="operator">{{ record.operator }}</span>
                  <span class="time">{{ record.time }}</span>
                </div>
                <div class="approval-comment" v-if="record.comment">
                  <span class="comment-label">备注:</span>
                  <span>{{ record.comment }}</span>
                </div>
              </div>
              <div class="approval-line" v-if="index < transferDetail.approvalRecords.length - 1"></div>
            </div>
          </div>
          <div v-else class="empty-approval">
            <el-icon><i class="el-icon-info"></i></el-icon>
            <span>暂无审批记录</span>
          </div>
        </div>
      </div>
      <div v-else class="loading-detail">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BackButton from '../../components/BackButton.vue'

interface ApprovalRecord {
  id: number
  step: string
  operator: string
  time: string
  status: string
  comment?: string
}

interface TransferDetail {
  id: string
  type: string
  originalDepartment: string
  originalPosition: string
  originalTeamLeader: string
  targetDepartment: string
  targetPosition: string
  targetTeamLeader: string
  reason?: string
  expectedDate: string
  status: string
  applyDate: string
  approvalRecords: ApprovalRecord[]
}

const transferDetail = ref<TransferDetail | null>(null)

// 模拟调岗详情数据
const mockTransferDetail = {
  id: '1',
  type: 'internal',
  originalDepartment: '组装车间',
  originalPosition: '流水线操作员',
  originalTeamLeader: '张三',
  targetDepartment: '质检部门',
  targetPosition: '质检员',
  targetTeamLeader: '赵六',
  reason: '个人职业发展需求',
  expectedDate: '2026-02-15',
  status: 'approved',
  applyDate: '2026-02-01 10:00',
  approvalRecords: [
    {
      id: 1,
      step: '调岗提交',
      operator: '张三',
      time: '2026-02-01 10:00',
      status: '已提交',
      comment: '因个人职业发展需求，申请调岗至质检部门'
    },
    {
      id: 2,
      step: '原部门审批',
      operator: '张三（组装车间组长）',
      time: '2026-02-01 14:30',
      status: '已批准',
      comment: '同意调岗申请'
    },
    {
      id: 3,
      step: '目标部门审批',
      operator: '赵六（质检部门组长）',
      time: '2026-02-02 09:15',
      status: '已批准',
      comment: '同意接收'
    },
    {
      id: 4,
      step: '人事审批',
      operator: '人事部门',
      time: '2026-02-02 16:00',
      status: '已批准',
      comment: '同意调岗，薪资待遇不变'
    }
  ]
}

// 获取调岗类型标签
const getTransferType = (type: string) => {
  const typeMap: Record<string, string> = {
    'internal': 'primary',
    'promotion': 'success',
    'demotion': 'warning',
    'other': 'default'
  }
  return typeMap[type] || 'default'
}

// 获取调岗类型文本
const getTransferTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    'internal': '内部调岗',
    'promotion': '晋升',
    'demotion': '降职',
    'other': '其他'
  }
  return textMap[type] || type
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'pending': '待审批',
    'approved': '已批准',
    'rejected': '已拒绝'
  }
  return textMap[status] || status
}

// 获取调岗详情
const fetchTransferDetail = async () => {
  try {
    // 模拟异步请求
    setTimeout(() => {
      // 这里应该根据id从API获取详情，现在使用模拟数据
      transferDetail.value = mockTransferDetail
    }, 500)
  } catch (error) {
    console.error('获取调岗详情失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  fetchTransferDetail()
})
</script>

<style scoped>
.worker-transfer-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.transfer-detail-section {
  margin-top: 20px;
}

.transfer-detail-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.detail-item .label {
  width: 100px;
  font-weight: 500;
  color: #606266;
}

.approval-records {
  margin-top: 10px;
}

.approval-record {
  margin-bottom: 20px;
  position: relative;
}

.approval-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.approval-step {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 10px;
}

.approval-body {
  margin-left: 34px;
}

.approval-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.operator {
  font-weight: 500;
}

.time {
  color: #909399;
  font-size: 12px;
}

.approval-comment {
  margin-top: 5px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.comment-label {
  font-weight: 500;
  margin-right: 5px;
}

.approval-line {
  position: absolute;
  left: 11px;
  top: 24px;
  bottom: -20px;
  width: 2px;
  background: #e4e7ed;
}

.empty-approval {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.loading-detail {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}

.loading-detail .is-loading {
  font-size: 24px;
  margin-right: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .worker-transfer-detail {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .page-header h2 {
    font-size: 20px;
  }

  .transfer-detail-card {
    padding: 15px;
  }

  .detail-section h3 {
    font-size: 16px;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .detail-item .label {
    width: 100%;
    margin-bottom: 5px;
  }

  .approval-body {
    margin-left: 24px;
  }

  .approval-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>