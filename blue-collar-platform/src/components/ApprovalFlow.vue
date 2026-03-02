<template>
  <div class="approval-flow-container">
    <!-- 审批流程配置 -->
    <div v-if="editable && flowConfig" class="flow-config">
      <div class="flow-header">
        <h3>{{ flowConfig.name }}</h3>
        <div class="flow-actions">
          <el-button :icon="Plus" type="primary" @click="handleAddNode">添加节点</el-button>
          <el-button :icon="DocumentCopy" @click="handleSaveFlow">保存流程</el-button>
        </div>
      </div>

      <!-- 节点列表 -->
      <div class="flow-nodes">
        <draggable
          v-model="flowNodes"
          item-key="id"
          @end="handleNodeReorder"
          :disabled="!editable"
        >
          <template #item="{ element: node, index }">
            <div class="flow-node" :class="{ 'is-current': isCurrentNode(node.id) }">
              <div class="node-header">
                <div class="node-title">
                  <el-tag :type="node.type === 'approval' ? 'primary' : 'info'" size="small">
                    {{ node.type === 'approval' ? '审批' : '抄送' }}
                  </el-tag>
                  <span class="node-name">{{ node.name }}</span>
                  <el-tag v-if="node.required" size="small" type="danger">必填</el-tag>
                </div>
                <div class="node-actions" v-if="editable">
                  <el-button :icon="Edit" size="small" link @click="handleEditNode(node)">编辑</el-button>
                  <el-button :icon="Delete" size="small" link type="danger" @click="handleDeleteNode(node.id)">删除</el-button>
                </div>
              </div>
              <div class="node-content">
                <div class="node-info">
                  <span class="info-label">审批人:</span>
                  <span class="info-value">{{ node.approvers.join(', ') || '未设置' }}</span>
                </div>
                <div class="node-info">
                  <span class="info-label">审批方式:</span>
                  <el-tag size="small" :type="node.approvalMode === 'or' ? 'warning' : 'success'">
                    {{ node.approvalMode === 'or' ? '或签' : '会签' }}
                  </el-tag>
                </div>
                <div v-if="node.condition" class="node-info">
                  <span class="info-label">审批条件:</span>
                  <span class="info-value">{{ node.condition }}</span>
                </div>
              </div>
              <div v-if="index < flowNodes.length - 1" class="node-arrow">
                <el-icon><ArrowDown /></el-icon>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- 审批记录时间线 -->
    <div v-if="approvalStatus && approvalStatus.records.length > 0" class="approval-records">
      <h4>审批记录</h4>
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in approvalStatus.records"
          :key="index"
          :timestamp="formatDate(record.approvalTime)"
          placement="top"
          :type="getTimelineType(record.approvalResult)"
          :icon="getTimelineIcon(record.approvalResult)"
          :color="getTimelineColor(record.approvalResult)"
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
            <div v-if="record.attachments && record.attachments.length > 0" class="record-attachments">
              <span class="attachments-label">附件:</span>
              <el-tag
                v-for="(attachment, idx) in record.attachments"
                :key="idx"
                size="small"
                class="attachment-tag"
              >
                {{ attachment }}
              </el-tag>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 审批表单 -->
    <div v-if="showApprovalForm && !readonly" class="approval-form">
      <h4>审批操作</h4>
      <el-form :model="approvalFormData" label-width="100px">
        <el-form-item label="审批结果" required>
          <el-radio-group v-model="approvalFormData.result">
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
            v-model="approvalFormData.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审批意见"
          />
        </el-form-item>

        <el-form-item v-if="approvalFormData.result === 'rejected'" label="驳回原因" required>
          <el-input
            v-model="approvalFormData.rejectReason"
            type="textarea"
            :rows="3"
            placeholder="请输入驳回原因"
          />
        </el-form-item>

        <el-form-item label="转交他人">
          <el-select
            v-model="approvalFormData.transferTo"
            placeholder="请选择转交人"
            clearable
            filterable
          >
            <el-option
              v-for="user in availableUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="附件">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            :auto-upload="false"
            multiple
            :limit="5"
          >
            <el-button :icon="Upload">上传附件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持上传最多5个文件</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Select" @click="handleSubmitApproval">
            提交审批
          </el-button>
          <el-button @click="handleResetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 节点编辑对话框 -->
    <el-dialog
      v-model="nodeEditVisible"
      :title="isEditing ? '编辑节点' : '添加节点'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="nodeForm" label-width="100px">
        <el-form-item label="节点名称" required>
          <el-input v-model="nodeForm.name" placeholder="请输入节点名称" />
        </el-form-item>

        <el-form-item label="节点类型" required>
          <el-radio-group v-model="nodeForm.type">
            <el-radio label="approval">审批节点</el-radio>
            <el-radio label="cc">抄送节点</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批人" required>
          <el-select
            v-model="nodeForm.approvers"
            multiple
            placeholder="请选择审批人"
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

        <el-form-item v-if="nodeForm.type === 'approval'" label="审批方式" required>
          <el-radio-group v-model="nodeForm.approvalMode">
            <el-radio label="or">或签（一人通过即可）</el-radio>
            <el-radio label="and">会签（所有人都需通过）</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批条件">
          <el-input
            v-model="nodeForm.condition"
            type="textarea"
            :rows="3"
            placeholder="请输入审批条件（可选）"
          />
        </el-form-item>

        <el-form-item label="是否必填">
          <el-switch v-model="nodeForm.required" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="nodeEditVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveNode">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'
import {
  Plus,
  DocumentCopy,
  Edit,
  Delete,
  ArrowDown,
  CircleCheck,
  CircleClose,
  Select,
  Upload
} from '@element-plus/icons-vue'
import type {
  ApprovalFlowProps,
  ApprovalFlowEmits,
  ApprovalFlowInstance,
  ApprovalFlowConfig,
  ApprovalNode,
  ApprovalFormData,
  ApprovalRecord
} from '../types/approval-flow'

// Props定义
const props = withDefaults(defineProps<ApprovalFlowProps>(), {
  editable: false,
  showApprovalForm: true,
  readonly: false
})

// Emits定义
const emit = defineEmits<ApprovalFlowEmits>()

// 响应式数据
const flowNodes = ref<ApprovalNode[]>([])
const nodeEditVisible = ref(false)
const isEditing = ref(false)
const editingNodeId = ref<string>('')

// 审批表单数据
const approvalFormData = ref<ApprovalFormData>({
  comment: '',
  result: 'approved',
  rejectReason: '',
  transferTo: '',
  attachments: []
})

// 节点表单
const nodeForm = ref<Partial<ApprovalNode>>({
  name: '',
  type: 'approval',
  approvers: [],
  approvalMode: 'or',
  condition: '',
  required: false
})

// 文件列表
const fileList = ref<any[]>([])

// 可用用户列表（模拟数据）
const availableUsers = ref([
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' }
])

// 计算属性 - 流程配置
const flowConfig = computed(() => props.flowConfig)

// 计算属性 - 审批状态
const approvalStatus = computed(() => props.approvalStatus)

// 判断是否为当前节点
const isCurrentNode = (nodeId: string): boolean => {
  return props.approvalStatus?.currentNodeId === nodeId
}

// 获取时间线类型
const getTimelineType = (result: string): string => {
  const typeMap: Record<string, string> = {
    approved: 'success',
    rejected: 'danger',
    pending: 'primary'
  }
  return typeMap[result] || 'primary'
}

// 获取时间线图标
const getTimelineIcon = (result: string) => {
  const iconMap: Record<string, any> = {
    approved: CircleCheck,
    rejected: CircleClose,
    pending: undefined
  }
  return iconMap[result]
}

// 获取时间线颜色
const getTimelineColor = (result: string): string => {
  const colorMap: Record<string, string> = {
    approved: '#67c23a',
    rejected: '#f56c6c',
    pending: '#409eff'
  }
  return colorMap[result] || '#409eff'
}

// 获取审批结果类型
const getApprovalResultType = (result: string): string => {
  const typeMap: Record<string, string> = {
    approved: 'success',
    rejected: 'danger',
    pending: 'info'
  }
  return typeMap[result] || 'info'
}

// 获取审批结果文本
const getApprovalResultText = (result: string): string => {
  const textMap: Record<string, string> = {
    approved: '通过',
    rejected: '驳回',
    pending: '待审批'
  }
  return textMap[result] || '未知'
}

// 格式化日期
const formatDate = (date: Date): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 添加节点
const handleAddNode = () => {
  isEditing.value = false
  editingNodeId.value = ''
  nodeForm.value = {
    name: '',
    type: 'approval',
    approvers: [],
    approvalMode: 'or',
    condition: '',
    required: false
  }
  nodeEditVisible.value = true
}

// 编辑节点
const handleEditNode = (node: ApprovalNode) => {
  isEditing.value = true
  editingNodeId.value = node.id
  nodeForm.value = { ...node }
  nodeEditVisible.value = true
}

// 保存节点
const handleSaveNode = () => {
  if (!nodeForm.value.name) {
    ElMessage.warning('请输入节点名称')
    return
  }

  if (!nodeForm.value.approvers || nodeForm.value.approvers.length === 0) {
    ElMessage.warning('请选择审批人')
    return
  }

  if (isEditing.value && editingNodeId.value) {
    // 更新节点
    const index = flowNodes.value.findIndex(n => n.id === editingNodeId.value)
    if (index > -1) {
      const updatedNode: ApprovalNode = {
        id: editingNodeId.value,
        name: nodeForm.value.name!,
        type: nodeForm.value.type!,
        approvers: nodeForm.value.approvers!,
        approvalMode: nodeForm.value.approvalMode!,
        condition: nodeForm.value.condition,
        required: nodeForm.value.required
      }
      flowNodes.value[index] = updatedNode
      emit('node-update', updatedNode)
      ElMessage.success('节点更新成功')
    }
  } else {
    // 添加节点
    const newNode: ApprovalNode = {
      id: Date.now().toString(),
      name: nodeForm.value.name!,
      type: nodeForm.value.type!,
      approvers: nodeForm.value.approvers!,
      approvalMode: nodeForm.value.approvalMode!,
      condition: nodeForm.value.condition,
      required: nodeForm.value.required
    }
    flowNodes.value.push(newNode)
    emit('node-add', newNode)
    ElMessage.success('节点添加成功')
  }

  nodeEditVisible.value = false
}

// 删除节点
const handleDeleteNode = (nodeId: string) => {
  ElMessageBox.confirm('确定要删除该节点吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = flowNodes.value.findIndex(n => n.id === nodeId)
    if (index > -1) {
      flowNodes.value.splice(index, 1)
      emit('node-delete', nodeId)
      ElMessage.success('节点删除成功')
    }
  }).catch(() => {})
}

// 节点顺序变化
const handleNodeReorder = () => {
  emit('node-reorder', flowNodes.value)
}

// 保存流程
const handleSaveFlow = () => {
  if (!validateFlow()) {
    return
  }

  if (props.flowConfig) {
    const updatedFlow: ApprovalFlowConfig = {
      ...props.flowConfig,
      nodes: flowNodes.value,
      updatedAt: new Date().toISOString()
    }
    emit('flow-change', updatedFlow)
    ElMessage.success('流程保存成功')
  }
}

// 提交审批
const handleSubmitApproval = () => {
  if (!approvalFormData.value.comment && approvalFormData.value.result === 'rejected') {
    ElMessage.warning('请输入驳回原因')
    return
  }

  // 处理附件
  approvalFormData.value.attachments = fileList.value.map(file => file.name)

  if (approvalFormData.value.transferTo) {
    // 转交
    emit('transfer', approvalFormData.value)
    ElMessage.success('已转交给他人')
  } else if (approvalFormData.value.result === 'approved') {
    // 通过
    emit('approve', approvalFormData.value)
    ElMessage.success('审批通过')
  } else {
    // 驳回
    emit('reject', approvalFormData.value)
    ElMessage.success('已驳回')
  }

  handleResetForm()
}

// 重置表单
const handleResetForm = () => {
  approvalFormData.value = {
    comment: '',
    result: 'approved',
    rejectReason: '',
    transferTo: '',
    attachments: []
  }
  fileList.value = []
}

// 验证流程配置
const validateFlow = (): boolean => {
  if (flowNodes.value.length === 0) {
    ElMessage.warning('请至少添加一个审批节点')
    return false
  }

  for (const node of flowNodes.value) {
    if (!node.name) {
      ElMessage.warning('请填写所有节点的名称')
      return false
    }
    if (!node.approvers || node.approvers.length === 0) {
      ElMessage.warning(`节点"${node.name}"需要设置审批人`)
      return false
    }
  }

  return true
}

// 获取当前节点
const getCurrentNode = (): ApprovalNode | null => {
  if (!props.approvalStatus?.currentNodeId) {
    return null
  }
  return flowNodes.value.find(n => n.id === props.approvalStatus?.currentNodeId) || null
}

// 监听props变化
watch(() => props.flowConfig, (newConfig) => {
  if (newConfig) {
    flowNodes.value = [...newConfig.nodes]
  }
}, { immediate: true })

// 暴露方法
defineExpose<ApprovalFlowInstance>({
  addNode: (node: Partial<ApprovalNode>) => {
    const newNode: ApprovalNode = {
      id: Date.now().toString(),
      name: node.name || '',
      type: node.type || 'approval',
      approvers: node.approvers || [],
      approvalMode: node.approvalMode || 'or',
      condition: node.condition,
      required: node.required
    }
    flowNodes.value.push(newNode)
    emit('node-add', newNode)
  },
  deleteNode: (nodeId: string) => {
    const index = flowNodes.value.findIndex(n => n.id === nodeId)
    if (index > -1) {
      flowNodes.value.splice(index, 1)
      emit('node-delete', nodeId)
    }
  },
  updateNode: (nodeId: string, node: Partial<ApprovalNode>) => {
    const index = flowNodes.value.findIndex(n => n.id === nodeId)
    if (index > -1) {
      flowNodes.value[index] = { ...flowNodes.value[index], ...node }
      emit('node-update', flowNodes.value[index])
    }
  },
  reorderNodes: (nodes: ApprovalNode[]) => {
    flowNodes.value = nodes
    emit('node-reorder', nodes)
  },
  submitApproval: (data: ApprovalFormData) => {
    emit('approve', data)
  },
  getCurrentNode,
  validateFlow
})

// 生命周期
onMounted(() => {
  if (props.flowConfig) {
    flowNodes.value = [...props.flowConfig.nodes]
  }
})
</script>

<style scoped>
.approval-flow-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 流程配置 */
.flow-config {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.flow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.flow-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.flow-actions {
  display: flex;
  gap: 8px;
}

/* 节点列表 */
.flow-nodes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.flow-node {
  position: relative;
  padding: 16px;
  background-color: #f5f7fa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.flow-node:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.flow-node.is-current {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.node-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-name {
  font-weight: 600;
  color: #303133;
}

.node-actions {
  display: flex;
  gap: 4px;
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.info-label {
  color: #909399;
  min-width: 70px;
}

.info-value {
  color: #606266;
}

.node-arrow {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  color: #909399;
}

/* 审批记录 */
.approval-records {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.approval-records h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
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

.record-attachments {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.attachments-label {
  color: #909399;
  font-size: 14px;
}

.attachment-tag {
  margin-right: 4px;
}

/* 审批表单 */
.approval-form {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.approval-form h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .flow-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .flow-actions {
    justify-content: stretch;
  }

  .flow-actions .el-button {
    flex: 1;
  }

  .node-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .node-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
