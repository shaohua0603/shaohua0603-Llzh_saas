<template>
  <div class="worker-transfer-container">
    <!-- 岗位调动表单 -->
    <el-card class="transfer-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">岗位调动申请</span>
          <el-tag v-if="transferStatus" :type="getStatusType(transferStatus.status)">
            {{ getStatusText(transferStatus.status) }}
          </el-tag>
        </div>
      </template>

      <CommonForm
        ref="formRef"
        :config="formConfig"
        v-model="formData"
        :loading="formLoading"
        @submit="handleSubmit"
        @field-change="handleFieldChange"
      >
        <template #field-workerId>
          <el-button @click="handleSelectWorker" :disabled="formData.workerId">
            {{ getWorkerText() }}
          </el-button>
        </template>

        <template #field-targetDepartment>
          <el-button @click="handleSelectDepartment">
            {{ getDepartmentText() }}
          </el-button>
        </template>

        <template #field-targetPosition>
          <el-select
            v-model="formData.targetPosition"
            placeholder="请选择目标岗位"
            clearable
            filterable
            :disabled="!formData.targetDepartment"
            @change="handlePositionChange"
          >
            <el-option
              v-for="position in targetPositionOptions"
              :key="position.id"
              :label="position.name"
              :value="position.id"
            />
          </el-select>
        </template>

        <template #field-targetLeader>
          <el-select
            v-model="formData.targetLeader"
            placeholder="请选择目标岗位直属组长"
            clearable
            filterable
            :disabled="!formData.targetPosition"
          >
            <el-option
              v-for="leader in leaderOptions"
              :key="leader.id"
              :label="leader.name"
              :value="leader.id"
            />
          </el-select>
        </template>
      </CommonForm>
    </el-card>

    <!-- 审批流程 -->
    <el-card v-if="transferStatus && transferStatus.records.length > 0" class="approval-card">
      <template #header>
        <span class="card-title">审批记录</span>
      </template>

      <ApprovalFlow
        :flow-config="flowConfig"
        :approval-status="transferStatus"
        :readonly="true"
      />
    </el-card>

    <!-- 审批操作 -->
    <el-card v-if="showApprovalForm" class="approval-action-card">
      <template #header>
        <span class="card-title">审批操作</span>
      </template>

      <ApprovalFlow
        :flow-config="flowConfig"
        :approval-status="transferStatus"
        :show-approval-form="true"
        @approve="handleApprove"
        @reject="handleReject"
      />
    </el-card>

    <!-- 岗位调动记录 -->
    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">岗位调动记录</span>
          <el-button type="primary" size="small" @click="handleRefreshRecords">
            刷新
          </el-button>
        </div>
      </template>

      <CommonTable
        ref="tableRef"
        :data="transferRecords"
        :columns="tableColumns"
        table-id="worker-transfer-records"
        :loading="tableLoading"
        :total="totalRecords"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @sort-change="handleSortChange"
        @global-search="handleGlobalSearch"
      >
        <template #column-workerName="{ row }">
          <el-link type="primary" @click="handleViewDetail(row)">
            {{ row.workerName }}
          </el-link>
        </template>

        <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>

        <template #actions="{ row }">
          <el-button size="small" type="primary" link @click="handleViewDetail(row)">
            查看
          </el-button>
          <el-button
            v-if="row.status === 'pending' && canApprove(row)"
            size="small"
            type="success"
            link
            @click="handleApproveTransfer(row)"
          >
            审批
          </el-button>
          <el-button
            v-if="row.status === 'pending' && canEdit(row)"
            size="small"
            type="warning"
            link
            @click="handleEditTransfer(row)"
          >
            编辑
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 人员选择对话框 -->
    <el-dialog
      v-model="workerSelectVisible"
      title="选择工人"
      width="800px"
      :close-on-click-modal="false"
    >
      <PersonSelect
        v-if="workerSelectVisible"
        source="worker"
        :multiple="false"
        :display-fields="['name', 'phone', 'department', 'position']"
        :return-fields="['id', 'name', 'phone', 'department', 'position', 'departmentId', 'positionId', 'leader']"
        @confirm="handleWorkerSelectConfirm"
        @cancel="workerSelectVisible = false"
      />
    </el-dialog>

    <!-- 部门选择对话框 -->
    <el-dialog
      v-model="departmentSelectVisible"
      title="选择目标部门"
      width="600px"
      :close-on-click-modal="false"
    >
      <DepartmentSelect
        v-if="departmentSelectVisible"
        :multiple="false"
        @confirm="handleDepartmentSelectConfirm"
        @cancel="departmentSelectVisible = false"
      />
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="岗位调动详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="currentTransfer" class="transfer-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工人姓名">
            {{ currentTransfer.workerName }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ currentTransfer.workerPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="期望调岗日期">
            {{ currentTransfer.transferDate }}
          </el-descriptions-item>
          <el-descriptions-item label="调岗状态">
            <el-tag :type="getStatusType(currentTransfer.status)">
              {{ getStatusText(currentTransfer.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="原部门">
            {{ currentTransfer.originalDepartment }}
          </el-descriptions-item>
          <el-descriptions-item label="原岗位">
            {{ currentTransfer.originalPosition }}
          </el-descriptions-item>
          <el-descriptions-item label="原岗位直属领导">
            {{ currentTransfer.originalLeader }}
          </el-descriptions-item>
          <el-descriptions-item label="目标部门">
            {{ currentTransfer.targetDepartment }}
          </el-descriptions-item>
          <el-descriptions-item label="目标岗位">
            {{ currentTransfer.targetPosition }}
          </el-descriptions-item>
          <el-descriptions-item label="目标岗位直属组长">
            {{ currentTransfer.targetLeader }}
          </el-descriptions-item>
          <el-descriptions-item label="调岗原因" :span="2">
            {{ currentTransfer.reason }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间" :span="2">
            {{ formatDateTime(currentTransfer.createdAt) }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 审批记录 -->
        <div v-if="currentTransfer.approvalRecords && currentTransfer.approvalRecords.length > 0" class="approval-records">
          <h4>审批记录</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in currentTransfer.approvalRecords"
              :key="index"
              :timestamp="formatDateTime(record.approvalTime)"
              placement="top"
              :type="getTimelineType(record.approvalResult)"
            >
              <div class="record-content">
                <div class="record-header">
                  <span class="record-node">{{ record.nodeName }}</span>
                  <el-tag :type="getApprovalResultType(record.approvalResult)" size="small">
                    {{ getApprovalResultText(record.approvalResult) }}
                  </el-tag>
                </div>
                <div class="record-info">
                  <span class="record-approver">审批人: {{ record.approver }}</span>
                </div>
                <div v-if="record.approvalComment" class="record-comment">
                  <span class="comment-label">审批意见:</span>
                  <span class="comment-text">{{ record.approvalComment }}</span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonForm from '@/components/CommonForm.vue'
import CommonTable from '@/components/CommonTable.vue'
import ApprovalFlow from '@/components/ApprovalFlow.vue'
import PersonSelect from '@/components/PersonSelect.vue'
import DepartmentSelect from '@/components/DepartmentSelect.vue'
import type { FormConfig, ColumnConfig } from '@/types'
import type { ApprovalFlowConfig, ApprovalStatus } from '@/types/approval-flow'

// 表单数据
const formData = reactive({
  workerId: '',
  workerName: '',
  workerPhone: '',
  transferDate: '',
  originalDepartment: '',
  originalPosition: '',
  originalLeader: '',
  targetDepartment: '',
  targetPosition: '',
  targetLeader: '',
  reason: ''
})

// 响应式数据
const formRef = ref()
const tableRef = ref()
const formLoading = ref(false)
const tableLoading = ref(false)
const workerSelectVisible = ref(false)
const departmentSelectVisible = ref(false)
const detailVisible = ref(false)
const currentTransfer = ref<any>(null)

// 选项数据
const targetPositionOptions = ref<any[]>([])
const leaderOptions = ref<any[]>([])

// 表格数据
const transferRecords = ref<any[]>([])
const totalRecords = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 审批状态
const transferStatus = ref<ApprovalStatus | null>(null)
const showApprovalForm = ref(false)

// 表格列配置
const tableColumns: ColumnConfig[] = [
  { prop: 'workerName', label: '工人姓名', width: 120, sortable: true },
  { prop: 'workerPhone', label: '手机号', width: 120 },
  { prop: 'transferDate', label: '期望调岗日期', width: 150, sortable: true },
  { prop: 'originalDepartment', label: '原部门', width: 120 },
  { prop: 'originalPosition', label: '原岗位', width: 120 },
  { prop: 'targetDepartment', label: '目标部门', width: 120 },
  { prop: 'targetPosition', label: '目标岗位', width: 120 },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'createdAt', label: '申请时间', width: 180, sortable: true }
]

// 表单配置
const formConfig: FormConfig = {
  fields: [
    {
      field: 'workerId',
      label: '工人',
      type: 'PERSON',
      required: true,
      disabled: true
    },
    {
      field: 'transferDate',
      label: '期望调岗日期',
      type: 'DATE',
      required: true,
      placeholder: '请选择期望调岗日期'
    },
    {
      field: 'originalDepartment',
      label: '原部门',
      type: 'TEXT',
      required: true,
      disabled: true,
      placeholder: '自动填充'
    },
    {
      field: 'originalPosition',
      label: '原岗位',
      type: 'TEXT',
      required: true,
      disabled: true,
      placeholder: '自动填充'
    },
    {
      field: 'originalLeader',
      label: '原岗位直属领导',
      type: 'TEXT',
      required: true,
      disabled: true,
      placeholder: '自动填充'
    },
    {
      field: 'targetDepartment',
      label: '目标部门',
      type: 'DEPARTMENT',
      required: true,
      placeholder: '请选择目标部门'
    },
    {
      field: 'targetPosition',
      label: '目标岗位',
      type: 'SELECT',
      required: true,
      options: [],
      placeholder: '请选择目标岗位'
    },
    {
      field: 'targetLeader',
      label: '目标岗位直属组长',
      type: 'SELECT',
      required: true,
      options: [],
      placeholder: '请选择目标岗位直属组长'
    },
    {
      field: 'reason',
      label: '调岗原因',
      type: 'TEXTAREA',
      required: true,
      rows: 4,
      placeholder: '请输入调岗原因'
    }
  ],
  labelWidth: '140px',
  columns: 2,
  buttonPosition: 'bottom',
  submitText: '提交申请',
  showReset: true,
  showSaveDraft: false
}

// 审批流程配置
const flowConfig: ApprovalFlowConfig = {
  id: 'transfer-flow',
  name: '岗位调动审批流程',
  code: 'WORKER_TRANSFER',
  description: '工人岗位调动审批流程',
  status: 'enabled',
  nodes: [
    {
      id: 'node-1',
      name: '部门主管审批',
      type: 'approval',
      approvers: ['manager-1'],
      approvalMode: 'or',
      required: true
    },
    {
      id: 'node-2',
      name: '人事审批',
      type: 'approval',
      approvers: ['hr-1'],
      approvalMode: 'or',
      required: true
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// 获取工人文本
const getWorkerText = () => {
  if (formData.workerName) {
    return `${formData.workerName} (${formData.workerPhone})`
  }
  return '请选择工人'
}

// 获取部门文本
const getDepartmentText = () => {
  if (formData.targetDepartment) {
    return formData.targetDepartment
  }
  return '请选择目标部门'
}

// 选择工人
const handleSelectWorker = () => {
  workerSelectVisible.value = true
}

// 工人选择确认
const handleWorkerSelectConfirm = (selected: any) => {
  formData.workerId = selected.id
  formData.workerName = selected.name
  formData.workerPhone = selected.phone
  formData.originalDepartment = selected.department
  formData.originalPosition = selected.position
  formData.originalLeader = selected.leader || ''
  workerSelectVisible.value = false
}

// 选择部门
const handleSelectDepartment = () => {
  departmentSelectVisible.value = true
}

// 部门选择确认
const handleDepartmentSelectConfirm = (selected: any) => {
  formData.targetDepartment = selected.name
  formData.targetPosition = ''
  formData.targetLeader = ''
  targetPositionOptions.value = []
  leaderOptions.value = []

  // 加载目标部门下的岗位
  loadTargetPositions(selected.id)
  departmentSelectVisible.value = false
}

// 加载目标岗位
const loadTargetPositions = async (departmentId: string) => {
  try {
    // TODO: 调用实际API
    // const response = await axios.get(`/api/departments/${departmentId}/positions`)
    // targetPositionOptions.value = response.data

    // 模拟数据
    targetPositionOptions.value = [
      { id: 'pos-1', name: '岗位A' },
      { id: 'pos-2', name: '岗位B' },
      { id: 'pos-3', name: '岗位C' }
    ]
  } catch (error) {
    ElMessage.error('加载岗位列表失败')
  }
}

// 岗位变化
const handlePositionChange = (positionId: string) => {
  formData.targetLeader = ''
  leaderOptions.value = []
  if (positionId) {
    loadLeaders(positionId)
  }
}

// 加载组长
const loadLeaders = async (positionId: string) => {
  try {
    // TODO: 调用实际API
    // const response = await axios.get(`/api/positions/${positionId}/leaders`)
    // leaderOptions.value = response.data

    // 模拟数据
    leaderOptions.value = [
      { id: 'leader-1', name: '组长A' },
      { id: 'leader-2', name: '组长B' },
      { id: 'leader-3', name: '组长C' }
    ]
  } catch (error) {
    ElMessage.error('加载组长列表失败')
  }
}

// 字段变化
const handleFieldChange = (field: string, value: any) => {
  // 处理字段联动逻辑
}

// 提交表单
const handleSubmit = async (data: any) => {
  formLoading.value = true
  try {
    // TODO: 调用实际API
    // await axios.post('/api/worker-transfers', data)

    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('岗位调动申请提交成功')

    // 重置表单
    Object.assign(formData, {
      workerId: '',
      workerName: '',
      workerPhone: '',
      transferDate: '',
      originalDepartment: '',
      originalPosition: '',
      originalLeader: '',
      targetDepartment: '',
      targetPosition: '',
      targetLeader: '',
      reason: ''
    })

    // 刷新列表
    await loadTransferRecords()
  } catch (error) {
    ElMessage.error('提交失败')
  } finally {
    formLoading.value = false
  }
}

// 审批通过
const handleApprove = async (data: any) => {
  try {
    // TODO: 调用实际API
    // await axios.post(`/api/worker-transfers/${currentTransfer.value.id}/approve`, data)

    ElMessage.success('审批通过')
    showApprovalForm.value = false
    await loadTransferRecords()
  } catch (error) {
    ElMessage.error('审批失败')
  }
}

// 审批驳回
const handleReject = async (data: any) => {
  try {
    // TODO: 调用实际API
    // await axios.post(`/api/worker-transfers/${currentTransfer.value.id}/reject`, data)

    ElMessage.success('已驳回')
    showApprovalForm.value = false
    await loadTransferRecords()
  } catch (error) {
    ElMessage.error('驳回失败')
  }
}

// 加载调动记录
const loadTransferRecords = async () => {
  tableLoading.value = true
  try {
    // TODO: 调用实际API
    // const response = await axios.get('/api/worker-transfers', {
    //   params: {
    //     page: currentPage.value,
    //     pageSize: pageSize.value
    //   }
    // })
    // transferRecords.value = response.data.list
    // totalRecords.value = response.data.total

    // 模拟数据
    transferRecords.value = [
      {
        id: '1',
        workerName: '张三',
        workerPhone: '13800138001',
        transferDate: '2026-03-01',
        originalDepartment: '生产部',
        originalPosition: '操作工',
        originalLeader: '李四',
        targetDepartment: '质检部',
        targetPosition: '质检员',
        targetLeader: '王五',
        reason: '个人发展需要',
        status: 'pending',
        createdAt: '2026-02-26 10:00:00',
        approvalRecords: []
      },
      {
        id: '2',
        workerName: '李四',
        workerPhone: '13800138002',
        transferDate: '2026-03-05',
        originalDepartment: '质检部',
        originalPosition: '质检员',
        originalLeader: '王五',
        targetDepartment: '生产部',
        targetPosition: '操作工',
        targetLeader: '张三',
        reason: '工作调整',
        status: 'approved',
        createdAt: '2026-02-25 15:30:00',
        approvalRecords: [
          {
            nodeId: 'node-1',
            nodeName: '部门主管审批',
            approver: '赵六',
            approvalTime: new Date('2026-02-25 16:00:00'),
            approvalResult: 'approved',
            approvalComment: '同意'
          },
          {
            nodeId: 'node-2',
            nodeName: '人事审批',
            approver: '钱七',
            approvalTime: new Date('2026-02-25 16:30:00'),
            approvalResult: 'approved',
            approvalComment: '同意调动'
          }
        ]
      }
    ]
    totalRecords.value = 2
  } catch (error) {
    ElMessage.error('加载调动记录失败')
  } finally {
    tableLoading.value = false
  }
}

// 刷新记录
const handleRefreshRecords = () => {
  loadTransferRecords()
}

// 排序变化
const handleSortChange = (sort: any) => {
  console.log('排序变化:', sort)
  loadTransferRecords()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  console.log('全局搜索:', keyword)
  loadTransferRecords()
}

// 查看
const handleViewDetail = (row: any) => {
  currentTransfer.value = row
  transferStatus.value = {
    status: row.status,
    records: row.approvalRecords || []
  }
  detailVisible.value = true
}

// 审批调动
const handleApproveTransfer = (row: any) => {
  currentTransfer.value = row
  transferStatus.value = {
    status: row.status,
    records: row.approvalRecords || []
  }
  showApprovalForm.value = true
}

// 编辑调动
const handleEditTransfer = (row: any) => {
  // 填充表单数据
  Object.assign(formData, {
    workerId: row.workerId,
    workerName: row.workerName,
    workerPhone: row.workerPhone,
    transferDate: row.transferDate,
    originalDepartment: row.originalDepartment,
    originalPosition: row.originalPosition,
    originalLeader: row.originalLeader,
    targetDepartment: row.targetDepartment,
    targetPosition: row.targetPosition,
    targetLeader: row.targetLeader,
    reason: row.reason
  })

  ElMessage.info('请修改后重新提交')
}

// 判断是否可以审批
const canApprove = (row: any) => {
  // TODO: 根据当前用户权限判断
  return true
}

// 判断是否可以编辑
const canEdit = (row: any) => {
  // TODO: 根据当前用户权限判断
  return true
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'pending': 'warning',
    'in_progress': 'primary',
    'approved': 'success',
    'rejected': 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'pending': '待审批',
    'in_progress': '审批中',
    'approved': '已通过',
    'rejected': '已驳回'
  }
  return textMap[status] || status
}

// 获取时间线类型
const getTimelineType = (result: string) => {
  const typeMap: Record<string, string> = {
    'approved': 'success',
    'rejected': 'danger',
    'pending': 'primary'
  }
  return typeMap[result] || 'primary'
}

// 获取审批结果类型
const getApprovalResultType = (result: string) => {
  const typeMap: Record<string, string> = {
    'approved': 'success',
    'rejected': 'danger',
    'pending': 'info'
  }
  return typeMap[result] || 'info'
}

// 获取审批结果文本
const getApprovalResultText = (result: string) => {
  const textMap: Record<string, string> = {
    'approved': '通过',
    'rejected': '驳回',
    'pending': '待审批'
  }
  return textMap[result] || '未知'
}

// 格式化日期时间
const formatDateTime = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadTransferRecords()
})
</script>

<style scoped>
.worker-transfer-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

/* 卡片样式 */
.transfer-card,
.approval-card,
.approval-action-card,
.record-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* 详情对话框 */
.transfer-detail {
  padding: 16px;
}

.approval-records {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

.approval-records h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
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
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.record-comment {
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
}

.comment-label {
  color: #909399;
  margin-right: 8px;
}

.comment-text {
  color: #606266;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .worker-transfer-container {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
