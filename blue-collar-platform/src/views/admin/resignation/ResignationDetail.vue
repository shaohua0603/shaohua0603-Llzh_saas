<template>
  <div class="resignation-detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">基本信息</span>
            <el-tag :type="getApprovalType(detailData.approvalStatus)">
              {{ getApprovalText(detailData.approvalStatus) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="离职编号">{{ detailData.resignationNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="工人姓名">{{ detailData.workerName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ detailData.gender || '-' }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ detailData.idCard || '-' }}</el-descriptions-item>
          <el-descriptions-item label="劳务公司">{{ detailData.laborCompanyName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="工厂">{{ detailData.factoryName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ detailData.departmentName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="岗位">{{ detailData.position }}</el-descriptions-item>
          <el-descriptions-item label="入职日期">{{ detailData.entryDate || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 离职信息 -->
      <el-card class="mt-4">
        <template #header>
          <span class="card-title">离职信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="离职日期">{{ detailData.resignationDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="离职原因">{{ getResignationReasonText(detailData.resignationReason) }}</el-descriptions-item>
          <el-descriptions-item label="离职原因详情" :span="2">{{ detailData.resignationReasonDetail || '-' }}</el-descriptions-item>
          <el-descriptions-item label="结算工资">{{ detailData.settlementSalary ? `¥${detailData.settlementSalary}` : '-' }}</el-descriptions-item>
          <el-descriptions-item label="结清状态">
            <el-tag v-if="detailData.settlementStatus" :type="detailData.settlementStatus === '已结清' ? 'success' : 'warning'">
              {{ detailData.settlementStatus }}
            </el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="工作交接人">{{ detailData.handoverPersonName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="交接日期">{{ detailData.handoverDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="归还物品" :span="2">{{ detailData.returnItems || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="离职状态">
            <el-tag :type="getResignationStatusType(detailData.resignationStatus)">
              {{ getResignationStatusText(detailData.resignationStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ detailData.applicationTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 审核信息 -->
      <el-card class="mt-4">
        <template #header>
          <span class="card-title">审核信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getApprovalType(detailData.approvalStatus)">
              {{ getApprovalText(detailData.approvalStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核人">{{ detailData.approverName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ detailData.approvalTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核意见">{{ detailData.approvalComment || '-' }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ detailData.applicantName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 审核记录 -->
      <el-card class="mt-4">
        <template #header>
          <span class="card-title">审核记录</span>
        </template>
        <el-timeline v-if="approvalRecords.length > 0">
          <el-timeline-item
            v-for="(record, index) in approvalRecords"
            :key="index"
            :timestamp="record.approvalTime"
            placement="top"
            :type="getTimelineType(record.approvalResult)"
          >
            <div class="record-content">
              <div class="record-header">
                <span class="record-node">{{ record.nodeName }}</span>
                <el-tag :type="getApprovalType(record.approvalResult)" size="small">
                  {{ getApprovalText(record.approvalResult) }}
                </el-tag>
              </div>
              <div class="record-info">
                <span>审批人: {{ record.approver }}</span>
              </div>
              <div v-if="record.approvalComment" class="record-comment">
                <span>审批意见: {{ record.approvalComment }}</span>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无审核记录" />
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit" v-if="detailData.approvalStatus === 'PENDING' || detailData.approvalStatus === 'REJECTED'">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete" v-if="detailData.approvalStatus === 'PENDING'">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
      <el-button type="success" @click="handleApproval" v-if="detailData.approvalStatus === 'IN_PROGRESS'">
        <el-icon><CircleCheck /></el-icon>
        审核
      </el-button>
      <el-button type="warning" @click="handleComplete" v-if="detailData.approvalStatus === 'APPROVED' && detailData.resignationStatus !== 'COMPLETED'">
        <el-icon><Check /></el-icon>
        办理完成
      </el-button>
      <el-button type="info" @click="handlePrint" v-if="detailData.approvalStatus === 'APPROVED' || detailData.resignationStatus === 'COMPLETED'">
        <el-icon><Printer /></el-icon>
        打印
      </el-button>
    </div>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="approvalDialogVisible"
      title="离职审核"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="审核结果" required>
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
        <el-form-item label="审核意见">
          <el-input
            v-model="approvalForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitApproval">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete, CircleCheck, CircleClose, Printer, Check } from '@element-plus/icons-vue'
import { RESIGNATION_REASON_OPTIONS, type Resignation, type ApprovalStatus, type ResignationStatus } from '@/types/resignationTypes'
import { getResignationDetail, deleteResignation, approveResignation, completeResignation } from '@/api/resignationApi'

const router = useRouter()
const route = useRoute()

const detailData = reactive<Resignation>({
  id: '',
  resignationNo: '',
  workerId: '',
  workerName: '',
  gender: '男',
  idCard: '',
  phone: '',
  laborCompanyId: '',
  laborCompanyName: '',
  factoryId: '',
  factoryName: '',
  departmentName: '',
  position: '',
  entryDate: '',
  resignationDate: '',
  resignationReason: 'OTHER',
  approvalStatus: 'PENDING',
  resignationStatus: 'NOT_STARTED',
  applicantId: '',
  applicantName: '',
  applicationTime: '',
  createTime: ''
})

const approvalRecords = ref<any[]>([])

const approvalDialogVisible = ref(false)
const approvalForm = reactive({
  result: 'approved' as 'approved' | 'rejected',
  comment: ''
})

const getApprovalType = (status: ApprovalStatus | string) => {
  const typeMap: Record<string, string> = {
    PENDING: 'info',
    IN_PROGRESS: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger'
  }
  return typeMap[status] || 'info'
}

const getApprovalText = (status: ApprovalStatus | string) => {
  const textMap: Record<string, string> = {
    PENDING: '未审核',
    IN_PROGRESS: '审核中',
    APPROVED: '审核通过',
    REJECTED: '已驳回'
  }
  return textMap[status] || status
}

const getResignationReasonText = (reason: string) => {
  const reasonItem = RESIGNATION_REASON_OPTIONS.find(r => r.value === reason)
  return reasonItem?.label || reason || '-'
}

const getResignationStatusType = (status: ResignationStatus | string) => {
  const typeMap: Record<string, string> = {
    NOT_STARTED: 'info',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success'
  }
  return typeMap[status] || 'info'
}

const getResignationStatusText = (status: ResignationStatus | string) => {
  const textMap: Record<string, string> = {
    NOT_STARTED: '未开始',
    IN_PROGRESS: '离职中',
    COMPLETED: '已离职'
  }
  return textMap[status] || status
}

const getTimelineType = (result: string) => {
  const typeMap: Record<string, string> = {
    approved: 'success',
    rejected: 'danger',
    pending: 'primary'
  }
  return typeMap[result] || 'primary'
}

const handleBack = () => {
  router.back()
}

const handleEdit = () => {
  router.push({ name: 'AdminResignationEdit', params: { id: detailData.id } })
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该离职记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteResignation(detailData.id)
      ElMessage.success('删除成功')
      router.push({ name: 'AdminResignation' })
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleApproval = () => {
  approvalForm.result = 'approved'
  approvalForm.comment = ''
  approvalDialogVisible.value = true
}

const handleSubmitApproval = async () => {
  if (approvalForm.result === 'rejected' && !approvalForm.comment) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  try {
    await approveResignation(detailData.id, {
      result: approvalForm.result,
      comment: approvalForm.comment
    })
    ElMessage.success(approvalForm.result === 'approved' ? '审核通过' : '已驳回')
    approvalDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleComplete = async () => {
  try {
    await ElMessageBox.confirm('确定要完成离职手续吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await completeResignation(detailData.id)
    ElMessage.success('离职手续已办理完成')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handlePrint = () => {
  ElMessage.info('打印功能开发中')
}

const loadData = async () => {
  const id = route.params.id as string
  try {
    const res = await getResignationDetail(id)
    if (res.data) {
      Object.assign(detailData, res.data)
      
      approvalRecords.value = []
      if (detailData.approverName) {
        approvalRecords.value.push({
          nodeName: '离职审核',
          approver: detailData.approverName,
          approvalTime: detailData.approvalTime || '',
          approvalResult: detailData.approvalStatus === 'APPROVED' ? 'approved' : detailData.approvalStatus === 'REJECTED' ? 'rejected' : 'pending',
          approvalComment: detailData.approvalComment
        })
      }
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.resignation-detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.mt-4 {
  margin-top: 16px;
}

.record-content {
  padding: 8px 0;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-node {
  font-weight: 600;
  color: #303133;
}

.record-info {
  margin-bottom: 4px;
  color: #606266;
  font-size: 14px;
}

.record-comment {
  color: #606266;
  font-size: 14px;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width, 200px);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base, 0.3s);
}
</style>
