<template>
  <div class="worker-transfer-record">
    <BackButton />
    <div class="page-header">
      <h2>调岗记录</h2>
      <el-button type="primary" @click="goToTransferApply">提交调岗申请</el-button>
    </div>
    
    <!-- 调岗记录 -->
    <div class="transfer-record-section">
      <div class="transfer-record-card">
        <div v-if="transferRecords.length === 0" class="empty">
          <el-icon><i class="el-icon-info"></i></el-icon>
          <span>暂无调岗记录</span>
        </div>
        <div v-else class="transfer-items">
          <div v-for="item in transferRecords" :key="item.id" class="transfer-item" @click="openTransferDetail(item)">
            <div class="transfer-header">
              <el-tag :type="getTransferType(item.type)">
                {{ getTransferTypeText(item.type) }}
              </el-tag>
              <el-tag :type="getStatusType(item.status)">
                {{ getStatusText(item.status) }}
              </el-tag>
            </div>
            <div class="transfer-details">
              <p>
                <i class="el-icon-s-flag"></i>
                原部门: {{ item.originalDepartment }}
              </p>
              <p>
                <i class="el-icon-s-marketing"></i>
                原岗位: {{ item.originalPosition }}
              </p>
              <p>
                <i class="el-icon-s-flag"></i>
                目标部门: {{ item.targetDepartment }}
              </p>
              <p>
                <i class="el-icon-s-marketing"></i>
                目标岗位: {{ item.targetPosition }}
              </p>
              <p>
                <i class="el-icon-time"></i>
                申请时间: {{ item.applyDate }}
              </p>
            </div>
            <div class="transfer-arrow">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// 调岗记录数据
const transferRecords = ref([
  {
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
  },
  {
    id: '2',
    type: 'internal',
    originalDepartment: '仓库管理',
    originalPosition: '仓库管理员',
    originalTeamLeader: '孙八',
    targetDepartment: '生产管理',
    targetPosition: '生产调度',
    targetTeamLeader: '周九',
    reason: '工作需要',
    expectedDate: '2026-01-20',
    status: 'rejected',
    applyDate: '2026-01-10 09:30',
    approvalRecords: [
      {
        id: 1,
        step: '调岗提交',
        operator: '张三',
        time: '2026-01-10 09:30',
        status: '已提交',
        comment: '因工作需要，申请调岗至生产管理部门'
      },
      {
        id: 2,
        step: '原部门审批',
        operator: '孙八（仓库管理组长）',
        time: '2026-01-10 11:00',
        status: '已批准',
        comment: '同意调岗申请'
      },
      {
        id: 3,
        step: '目标部门审批',
        operator: '周九（生产管理组长）',
        time: '2026-01-10 15:00',
        status: '已拒绝',
        comment: '当前部门人员充足，暂不需要新增人员'
      }
    ]
  },
  {
    id: '3',
    type: 'internal',
    originalDepartment: '质检部门',
    originalPosition: '质检员',
    originalTeamLeader: '赵六',
    targetDepartment: '组装车间',
    targetPosition: '班组长',
    targetTeamLeader: '李四',
    reason: '职业发展',
    expectedDate: '2026-03-01',
    status: 'pending',
    applyDate: '2026-02-05 14:00',
    approvalRecords: [
      {
        id: 1,
        step: '调岗提交',
        operator: '张三',
        time: '2026-02-05 14:00',
        status: '已提交',
        comment: '为了职业发展，申请调岗至组装车间担任班组长'
      },
      {
        id: 2,
        step: '原部门审批',
        operator: '赵六（质检部门组长）',
        time: '2026-02-05 16:30',
        status: '已批准',
        comment: '同意调岗申请，支持个人发展'
      }
    ]
  }
])

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

// 获取调岗记录
const fetchTransferRecords = async () => {
  try {
    // 模拟异步请求
    setTimeout(() => {
      // 数据已经在上面的mock数据中定义
    }, 500)
  } catch (error) {
    console.error('获取调岗记录失败:', error)
  }
}

// 跳转到调岗申请页面
const goToTransferApply = () => {
  router.push('/worker/transfer')
}

// 跳转到调岗详情页面
const openTransferDetail = (transfer: any) => {
  router.push(`/worker/transfer-detail/${transfer.id}`)
}

// 初始化数据
onMounted(() => {
  fetchTransferRecords()
})
</script>

<style scoped>
.worker-transfer-record {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.transfer-record-section {
  padding: 15px;
}

.transfer-record-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.transfer-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transfer-item {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #667eea;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.transfer-item:hover {
  background-color: #f0f4ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.transfer-header {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.transfer-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transfer-details p {
  margin: 0;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.transfer-details i {
  color: #667eea;
  font-size: 14px;
}

.transfer-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .transfer-record-section {
    padding: 12px;
  }
  
  .transfer-record-card {
    border-radius: 8px;
    padding: 12px;
  }
  
  .transfer-item {
    padding: 12px;
  }
  
  .transfer-details p {
    font-size: 13px;
  }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .transfer-details {
    gap: 6px;
  }
  
  .transfer-details p {
    font-size: 12px;
  }
  
  .transfer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>