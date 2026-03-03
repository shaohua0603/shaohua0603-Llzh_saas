<template>
  <div class="admin-todo-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="任务类型">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择任务类型"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in taskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select
            v-model="queryParams.priority"
            placeholder="请选择优先级"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleBatchUpdateStatus('completed')">
        批量完成
      </el-button>
      <el-button type="success" @click="handleBatchUpdateStatus('in_progress')">
        批量处理中
      </el-button>
      <el-button type="danger" @click="handleBatchDelete">
        批量删除
      </el-button>
    </div>

    <!-- 表格区域 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="admin-todo"
      :loading="loading"
      :total="total"
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      @global-search="handleGlobalSearch"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 任务类型列 -->
      <template #column-type="{ row }">
        <el-tag :type="getTypeTag(row.type)">{{ row.typeName }}</el-tag>
      </template>

      <!-- 优先级列 -->
      <template #column-priority="{ row }">
        <el-tag :type="getPriorityTag(row.priority)">{{ row.priorityName }}</el-tag>
      </template>

      <!-- 状态列 -->
      <template #column-status="{ row }">
        <el-tag :type="getStatusTag(row.status)">{{ row.statusName }}</el-tag>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">查看</el-button>
        <!-- 审批任务显示审批操作按钮 -->
        <template v-if="row.type === TaskType.APPROVAL">
          <el-button type="success" link @click="handleApprove(row)">通过</el-button>
          <el-button type="danger" link @click="handleReject(row)">驳回</el-button>
          <el-button type="warning" link @click="handleTransfer(row)">转交</el-button>
          <el-button type="info" link @click="handleDelegate(row)">委派</el-button>
        </template>
        <!-- 非审批任务显示状态更新按钮 -->
        <template v-else>
          <el-button
            v-if="row.status === 'pending'"
            type="success"
            link
            @click="handleUpdateStatus(row, 'in_progress')"
          >
            处理
          </el-button>
          <el-button
            v-if="row.status === 'in_progress'"
            type="success"
            link
            @click="handleUpdateStatus(row, 'completed')"
          >
            完成
          </el-button>
        </template>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>

    <!-- 审批操作对话框 -->
    <ApprovalActionDialog
      v-if="currentApprovalTask"
      v-model="approvalDialogVisible"
      :action-type="approvalActionType"
      :business-code="currentApprovalTask.businessCode"
      :business-id="currentApprovalTask.businessId"
      :node-id="currentApprovalTask.nodeId || 0"
      :approver-id="currentApprovalTask.assigneeId"
      :approver-name="currentApprovalTask.assigneeName || ''"
      @success="handleApprovalSuccess"
    />

    <!-- 任务详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="待办任务详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentTask" :column="2" border>
        <el-descriptions-item label="任务标题">
          {{ currentTask.title }}
        </el-descriptions-item>
        <el-descriptions-item label="任务类型">
          <el-tag :type="getTypeTag(currentTask.type)">{{ currentTask.typeName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityTag(currentTask.priority)">
            {{ currentTask.priorityName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTag(currentTask.status)">
            {{ currentTask.statusName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请人" v-if="currentTask.applicant">
          {{ currentTask.applicant }}
        </el-descriptions-item>
        <el-descriptions-item label="申请时间" v-if="currentTask.applyTime">
          {{ currentTask.applyTime }}
        </el-descriptions-item>
        <el-descriptions-item label="截止时间" v-if="currentTask.deadline">
          {{ currentTask.deadline }}
        </el-descriptions-item>
        <el-descriptions-item label="完成时间" v-if="currentTask.completeTime">
          {{ currentTask.completeTime }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentTask.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="任务内容" :span="2" v-if="currentTask.content">
          {{ currentTask.content }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 审批记录时间线 -->
      <div v-if="currentTask && currentTask.type === TaskType.APPROVAL && approvalRecords.length > 0" class="approval-records-section">
        <ApprovalRecordTimeline
          :records="approvalRecords"
          :current-node-id="currentTask.nodeId?.toString()"
          :show-header="true"
          :show-expand-all="true"
          :show-expand-button="true"
          title="审批记录"
          :default-expanded="true"
          :reverse-order="true"
        />
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <!-- 审批任务显示审批操作按钮 -->
        <template v-if="currentTask && currentTask.type === TaskType.APPROVAL">
          <el-button type="success" @click="handleApprove(currentTask)">通过</el-button>
          <el-button type="danger" @click="handleReject(currentTask)">驳回</el-button>
          <el-button type="warning" @click="handleTransfer(currentTask)">转交</el-button>
          <el-button type="info" @click="handleDelegate(currentTask)">委派</el-button>
        </template>
        <!-- 非审批任务显示状态更新按钮 -->
        <template v-else-if="currentTask">
          <el-button
            v-if="currentTask.status === 'pending'"
            type="primary"
            @click="handleUpdateStatusFromDetail('in_progress')"
          >
            开始处理
          </el-button>
          <el-button
            v-if="currentTask.status === 'in_progress'"
            type="success"
            @click="handleUpdateStatusFromDetail('completed')"
          >
            完成任务
          </el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import ApprovalActionDialog from '@/components/ApprovalActionDialog.vue'
import ApprovalRecordTimeline from '@/components/ApprovalRecordTimeline.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import {
  getTodoTaskList,
  getTodoTaskDetail,
  updateTodoTaskStatus,
  batchUpdateTodoTaskStatus,
  batchDeleteTodoTasks,
} from '@/api/workCenterApi'
import {
  getApprovalRecords,
  getApprovalStatus
} from '@/api/system/flowConfigApi'
import type {
  TodoTask,
  TodoTaskQueryParams,
  TaskType,
  TaskPriority,
  TaskStatus,
} from '@/types/work-center'
import type { ApprovalRecord } from '@/types/flow-config'
import { useDataPermission } from '@/composables/useDataPermission'

const router = useRouter()

// 数据权限
const { initialize, generateFilter, isAdmin } = useDataPermission()

// 响应式数据
const tableRef = ref()
const loading = ref(false)
const tableData = ref<TodoTask[]>([])
const total = ref(0)
const selectedRows = ref<TodoTask[]>([])
const detailVisible = ref(false)
const currentTask = ref<TodoTask | null>(null)
const dateRange = ref<[string, string] | null>(null)

// 审批相关状态
const approvalDialogVisible = ref(false)
const approvalActionType = ref<'approve' | 'reject' | 'transfer' | 'delegate'>('approve')
const approvalRecords = ref<ApprovalRecord[]>([])
const currentApprovalTask = ref<TodoTask | null>(null)

// 查询参数
const queryParams = reactive<TodoTaskQueryParams>({
  page: 1,
  pageSize: 10,
  type: undefined,
  priority: undefined,
  status: undefined,
  keyword: undefined,
  sortField: undefined,
  sortOrder: undefined,
})

// 表格列配置
const columns: ColumnConfig[] = [
  {
    prop: 'title',
    label: '任务标题',
    minWidth: 200,
    sortable: true,
    showTooltip: true,
  },
  {
    prop: 'type',
    label: '任务类型',
    width: 120,
    sortable: true,
  },
  {
    prop: 'priority',
    label: '优先级',
    width: 100,
    sortable: true,
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    sortable: true,
  },
  {
    prop: 'applicant',
    label: '申请人',
    width: 120,
  },
  {
    prop: 'applyTime',
    label: '申请时间',
    width: 180,
    sortable: true,
  },
  {
    prop: 'deadline',
    label: '截止时间',
    width: 180,
    sortable: true,
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    sortable: true,
  },
]

// 任务类型选项
const taskTypeOptions = [
  { label: '租户审核', value: 'tenant_audit' as TaskType },
  { label: '预警处理', value: 'warning_handle' as TaskType },
  { label: '活动审核', value: 'activity_audit' as TaskType },
  { label: '投诉处理', value: 'complaint_handle' as TaskType },
  { label: '佣金规则审核', value: 'commission_rule_audit' as TaskType },
  { label: '系统通知', value: 'system_notice' as TaskType },
]

// 优先级选项
const priorityOptions = [
  { label: '紧急', value: 'urgent' as TaskPriority },
  { label: '高', value: 'high' as TaskPriority },
  { label: '中', value: 'medium' as TaskPriority },
  { label: '低', value: 'low' as TaskPriority },
]

// 状态选项
const statusOptions = [
  { label: '待处理', value: 'pending' as TaskStatus },
  { label: '处理中', value: 'in_progress' as TaskStatus },
  { label: '已完成', value: 'completed' as TaskStatus },
  { label: '已取消', value: 'cancelled' as TaskStatus },
]

// 获取任务类型标签类型
const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    tenant_audit: 'warning',
    warning_handle: 'danger',
    activity_audit: 'info',
    complaint_handle: 'danger',
    commission_rule_audit: 'primary',
    system_notice: 'info',
  }
  return map[type] || 'info'
}

// 获取优先级标签类型
const getPriorityTag = (priority: string) => {
  const map: Record<string, string> = {
    urgent: 'danger',
    high: 'danger',
    medium: 'warning',
    low: 'info',
  }
  return map[priority] || 'info'
}

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'info',
  }
  return map[status] || 'info'
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    // 初始化数据权限
    await initialize()

    const params = { ...queryParams }
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }

    // 集成数据权限过滤
    const dataPermissionFilter = generateFilter()
    if (!isAdmin.value && dataPermissionFilter) {
      // 将数据权限过滤条件添加到查询参数中
      Object.assign(params, dataPermissionFilter)
    }

    const response = await getTodoTaskList(params)
    if (response.code === 200) {
      tableData.value = response.data.list
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取待办任务列表失败:', error)
    ElMessage.error('获取待办任务列表失败')
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.type = undefined
  queryParams.priority = undefined
  queryParams.status = undefined
  queryParams.keyword = undefined
  dateRange.value = null
  queryParams.page = 1
  loadData()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  queryParams.keyword = keyword || undefined
  queryParams.page = 1
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: TodoTask[]) => {
  selectedRows.value = selection
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  queryParams.sortField = sort.prop
  queryParams.sortOrder = sort.order === 'ascending' ? 'asc' : sort.order === 'descending' ? 'desc' : undefined
  loadData()
}

// 查看
const handleView = async (row: TodoTask) => {
  try {
    const response = await getTodoTaskDetail(row.id)
    if (response.code === 200) {
      currentTask.value = response.data
      detailVisible.value = true

      // 如果是审批任务,加载审批记录
      if (row.type === TaskType.APPROVAL) {
        await loadApprovalRecords(row.businessCode!, row.businessId!)
      }
    }
  } catch (error) {
    console.error('获取待办任务详情失败:', error)
    ElMessage.error('获取待办任务详情失败')
  }
}

// 加载审批记录
const loadApprovalRecords = async (businessCode: string, businessId: number) => {
  try {
    const response = await getApprovalRecords({
      businessCode,
      businessId
    })
    approvalRecords.value = response.data || []
  } catch (error) {
    console.error('获取审批记录失败:', error)
    approvalRecords.value = []
  }
}

// 审批通过
const handleApprove = (row: TodoTask) => {
  currentApprovalTask.value = row
  approvalActionType.value = 'approve'
  approvalDialogVisible.value = true
}

// 审批驳回
const handleReject = (row: TodoTask) => {
  currentApprovalTask.value = row
  approvalActionType.value = 'reject'
  approvalDialogVisible.value = true
}

// 审批转交
const handleTransfer = (row: TodoTask) => {
  currentApprovalTask.value = row
  approvalActionType.value = 'transfer'
  approvalDialogVisible.value = true
}

// 审批委派
const handleDelegate = (row: TodoTask) => {
  currentApprovalTask.value = row
  approvalActionType.value = 'delegate'
  approvalDialogVisible.value = true
}

// 审批操作成功回调
const handleApprovalSuccess = () => {
  loadData()
  if (currentTask.value) {
    loadApprovalRecords(currentTask.value.businessCode, currentTask.value.businessId)
  }
}

// 更新任务状态
const handleUpdateStatus = async (row: TodoTask, status: TaskStatus) => {
  try {
    const response = await updateTodoTaskStatus(row.id, status)
    if (response.code === 200) {
      ElMessage.success('任务状态更新成功')
      loadData()
    }
  } catch (error) {
    console.error('更新任务状态失败:', error)
    ElMessage.error('更新任务状态失败')
  }
}

// 从详情页更新任务状态
const handleUpdateStatusFromDetail = async (status: TaskStatus) => {
  if (!currentTask.value) return
  await handleUpdateStatus(currentTask.value, status)
  detailVisible.value = false
}

// 批量更新任务状态
const handleBatchUpdateStatus = async (status: TaskStatus) => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要操作的任务')
    return
  }

  try {
    const ids = selectedRows.value.map(row => row.id)
    const response = await batchUpdateTodoTaskStatus(ids, status)
    if (response.code === 200) {
      ElMessage.success(`批量${status === 'completed' ? '完成' : status === 'in_progress' ? '标记为处理中' : '更新'}成功`)
      tableRef.value?.clearSelection()
      loadData()
    }
  } catch (error) {
    console.error('批量更新任务状态失败:', error)
    ElMessage.error('批量更新任务状态失败')
  }
}

// 删除任务
const handleDelete = (row: TodoTask) => {
  ElMessageBox.confirm('确定要删除该任务吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      // 这里应该调用删除API,暂时使用批量删除API
      const response = await batchDeleteTodoTasks([row.id])
      if (response.code === 200) {
        ElMessage.success('删除成功')
        loadData()
      }
    } catch (error) {
      console.error('删除任务失败:', error)
      ElMessage.error('删除任务失败')
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的任务')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}个任务吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const ids = selectedRows.value.map(row => row.id)
      const response = await batchDeleteTodoTasks(ids)
      if (response.code === 200) {
        ElMessage.success('批量删除成功')
        tableRef.value?.clearSelection()
        loadData()
      }
    } catch (error) {
      console.error('批量删除任务失败:', error)
      ElMessage.error('批量删除任务失败')
    }
  }).catch(() => {})
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-todo-page {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.approval-records-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .admin-todo-page {
    padding: 10px;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-bar .el-button {
    width: 100%;
  }
}
</style>
