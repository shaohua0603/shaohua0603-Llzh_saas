<template>
  <div class="flow-designer-container">
    <!-- 流程基本信息区域 -->
    <el-card class="flow-info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">流程基本信息</span>
        </div>
      </template>
      <el-form
        ref="flowInfoFormRef"
        :model="flowInfo"
        :rules="flowInfoRules"
        label-width="100px"
        :disabled="readonly"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="流程名称" prop="flowName">
              <el-input
                v-model="flowInfo.flowName"
                placeholder="请输入流程名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程编码" prop="flowCode">
              <el-input
                v-model="flowInfo.flowCode"
                placeholder="请输入流程编码"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="流程类型" prop="flowType">
              <el-select
                v-model="flowInfo.flowType"
                placeholder="请选择流程类型"
                style="width: 100%"
              >
                <el-option label="请假审批" value="LEAVE" />
                <el-option label="调岗审批" value="TRANSFER" />
                <el-option label="离职审批" value="RESIGNATION" />
                <el-option label="报销审批" value="EXPENSE" />
                <el-option label="其他审批" value="OTHER" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程状态" prop="flowStatus">
              <el-radio-group v-model="flowInfo.flowStatus">
                <el-radio label="ENABLED">启用</el-radio>
                <el-radio label="DISABLED">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="流程描述" prop="flowDescription">
          <el-input
            v-model="flowInfo.flowDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入流程描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="flowInfo.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 节点列表区域 -->
    <el-card class="flow-nodes-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">审批节点配置</span>
          <div class="header-actions" v-if="editable && !readonly">
            <el-button :icon="Plus" type="primary" @click="handleAddNode">
              添加节点
            </el-button>
            <el-button :icon="Sort" @click="handleSortNodes">
              排序
            </el-button>
          </div>
        </div>
      </template>

      <!-- 节点列表 -->
      <div class="nodes-container">
        <draggable
          v-model="flowNodes"
          item-key="id"
          @end="handleNodeReorder"
          :disabled="!editable || readonly"
          class="node-list"
        >
          <template #item="{ element: node, index }">
            <div
              class="node-item"
              :class="{
                'is-selected': selectedNodeId === node.id,
                'is-approval': node.type === 'approval',
                'is-cc': node.type === 'cc',
                'is-condition': node.type === 'condition'
              }"
              @click="handleNodeClick(node)"
            >
              <!-- 节点头部 -->
              <div class="node-header">
                <div class="node-left">
                  <div class="node-icon">
                    <el-icon v-if="node.type === 'approval'"><User /></el-icon>
                    <el-icon v-else-if="node.type === 'cc'"><Message /></el-icon>
                    <el-icon v-else-if="node.type === 'condition'"><Switch /></el-icon>
                  </div>
                  <div class="node-title">
                    <span class="node-name">{{ node.name }}</span>
                    <el-tag
                      :type="getNodeTypeTagType(node.type)"
                      size="small"
                      class="node-type-tag"
                    >
                      {{ getNodeTypeText(node.type) }}
                    </el-tag>
                    <el-tag v-if="node.isRequired" size="small" type="danger">
                      必填
                    </el-tag>
                  </div>
                </div>
                <div class="node-actions" v-if="editable && !readonly">
                  <el-button
                    :icon="Edit"
                    size="small"
                    link
                    @click.stop="handleEditNode(node)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    :icon="Delete"
                    size="small"
                    link
                    type="danger"
                    @click.stop="handleDeleteNode(node.id)"
                  >
                    删除
                  </el-button>
                </div>
              </div>

              <!-- 节点内容 -->
              <div class="node-content">
                <div class="node-info">
                  <span class="info-label">审批人类型:</span>
                  <span class="info-value">{{ getApproverTypeText(node.approverType) }}</span>
                </div>
                <div v-if="node.approvalMode" class="node-info">
                  <span class="info-label">审批模式:</span>
                  <el-tag size="small" :type="node.approvalMode === 'or' ? 'warning' : 'success'">
                    {{ node.approvalMode === 'or' ? '或签' : '会签' }}
                  </el-tag>
                </div>
                <div v-if="node.timeoutHours" class="node-info">
                  <span class="info-label">超时时间:</span>
                  <span class="info-value">{{ node.timeoutHours }}小时</span>
                </div>
              </div>

              <!-- 节点箭头 -->
              <div v-if="index < flowNodes.length - 1" class="node-arrow">
                <el-icon><ArrowDown /></el-icon>
              </div>
            </div>
          </template>
        </draggable>

        <!-- 空状态 -->
        <el-empty
          v-if="flowNodes.length === 0"
          description="暂无审批节点，请点击添加节点"
          :image-size="100"
        />
      </div>
    </el-card>

    <!-- 节点配置区域 -->
    <el-card
      v-if="selectedNode && (editable || !readonly)"
      class="node-config-card"
      shadow="never"
    >
      <template #header>
        <div class="card-header">
          <span class="card-title">节点配置 - {{ selectedNode.name }}</span>
          <el-button
            :icon="Close"
            size="small"
            link
            @click="selectedNodeId = ''"
          >
            关闭
          </el-button>
        </div>
      </template>
      <el-form
        ref="nodeFormRef"
        :model="nodeForm"
        :rules="nodeFormRules"
        label-width="120px"
        :disabled="readonly"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="节点名称" prop="name">
              <el-input
                v-model="nodeForm.name"
                placeholder="请输入节点名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点类型" prop="type">
              <el-select
                v-model="nodeForm.type"
                placeholder="请选择节点类型"
                style="width: 100%"
                :disabled="!!selectedNode"
              >
                <el-option label="审批节点" value="approval" />
                <el-option label="抄送节点" value="cc" />
                <el-option label="条件节点" value="condition" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审批人类型" prop="approverType">
              <el-select
                v-model="nodeForm.approverType"
                placeholder="请选择审批人类型"
                style="width: 100%"
              >
                <el-option label="角色" value="role" />
                <el-option label="部门" value="department" />
                <el-option label="岗位" value="position" />
                <el-option label="指定用户" value="user" />
                <el-option label="表单字段" value="form_field" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="nodeForm.type === 'approval'">
            <el-form-item label="审批模式" prop="approvalMode">
              <el-radio-group v-model="nodeForm.approvalMode">
                <el-radio label="or">或签</el-radio>
                <el-radio label="and">会签</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="是否必填">
          <el-switch v-model="nodeForm.isRequired" />
          <span class="form-tip">开启后，该节点必须完成审批</span>
        </el-form-item>

        <el-form-item label="自动审批">
          <el-switch v-model="nodeForm.autoApprove" />
          <span class="form-tip">开启后，满足条件自动通过</span>
        </el-form-item>

        <el-form-item label="超时时间">
          <el-input-number
            v-model="nodeForm.timeoutHours"
            :min="1"
            :max="720"
            :step="1"
            controls-position="right"
          />
          <span class="form-tip">小时，超过此时间将执行超时操作</span>
        </el-form-item>

        <el-form-item label="超时操作">
          <el-select
            v-model="nodeForm.timeoutAction"
            placeholder="请选择超时操作"
            style="width: 200px"
          >
            <el-option label="自动通过" value="auto_approve" />
            <el-option label="自动驳回" value="auto_reject" />
            <el-option label="转交上级" value="transfer_to_supervisor" />
            <el-option label="提醒审批人" value="remind_approver" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="editable && !readonly"
            type="primary"
            @click="handleSaveNodeConfig"
          >
            保存配置
          </el-button>
          <el-button @click="selectedNodeId = ''">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <div class="action-bar" v-if="editable && !readonly">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :icon="Check" @click="handleSave">
        保存流程
      </el-button>
    </div>

    <!-- 节点编辑对话框 -->
    <el-dialog
      v-model="nodeEditVisible"
      :title="isEditing ? '编辑节点' : '添加节点'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="nodeEditFormRef"
        :model="nodeEditForm"
        :rules="nodeEditFormRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="节点名称" prop="name">
              <el-input
                v-model="nodeEditForm.name"
                placeholder="请输入节点名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点类型" prop="type">
              <el-select
                v-model="nodeEditForm.type"
                placeholder="请选择节点类型"
                style="width: 100%"
              >
                <el-option label="审批节点" value="approval" />
                <el-option label="抄送节点" value="cc" />
                <el-option label="条件节点" value="condition" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审批人类型" prop="approverType">
              <el-select
                v-model="nodeEditForm.approverType"
                placeholder="请选择审批人类型"
                style="width: 100%"
              >
                <el-option label="角色" value="role" />
                <el-option label="部门" value="department" />
                <el-option label="岗位" value="position" />
                <el-option label="指定用户" value="user" />
                <el-option label="表单字段" value="form_field" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="nodeEditForm.type === 'approval'">
            <el-form-item label="审批模式" prop="approvalMode">
              <el-radio-group v-model="nodeEditForm.approvalMode">
                <el-radio label="or">或签</el-radio>
                <el-radio label="and">会签</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="是否必填">
          <el-switch v-model="nodeEditForm.isRequired" />
        </el-form-item>

        <el-form-item label="自动审批">
          <el-switch v-model="nodeEditForm.autoApprove" />
        </el-form-item>

        <el-form-item label="超时时间">
          <el-input-number
            v-model="nodeEditForm.timeoutHours"
            :min="1"
            :max="720"
            :step="1"
            controls-position="right"
          />
          <span class="form-tip">小时</span>
        </el-form-item>

        <el-form-item label="超时操作">
          <el-select
            v-model="nodeEditForm.timeoutAction"
            placeholder="请选择超时操作"
            style="width: 200px"
          >
            <el-option label="自动通过" value="auto_approve" />
            <el-option label="自动驳回" value="auto_reject" />
            <el-option label="转交上级" value="transfer_to_supervisor" />
            <el-option label="提醒审批人" value="remind_approver" />
          </el-select>
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
import { ref, computed, watch, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'
import {
  Plus,
  Sort,
  Edit,
  Delete,
  Close,
  Check,
  User,
  Message,
  Switch,
  ArrowDown
} from '@element-plus/icons-vue'
import type {
  FlowDesignerProps,
  FlowDesignerEmits,
  FlowDesignerInstance,
  FlowBasicInfo,
  DesignerNode,
  NodeFormData
} from '@/types/flow-designer'

// Props定义
const props = withDefaults(defineProps<FlowDesignerProps>(), {
  editable: true,
  readonly: false
})

// Emits定义
const emit = defineEmits<FlowDesignerEmits>()

// 响应式数据
const flowInfoFormRef = ref()
const nodeFormRef = ref()
const nodeEditFormRef = ref()

const flowInfo = reactive<FlowBasicInfo>({
  flowName: '',
  flowCode: '',
  flowType: '',
  flowDescription: '',
  flowStatus: 'ENABLED',
  isDefault: false,
  remark: ''
})

const flowNodes = ref<DesignerNode[]>([])
const selectedNodeId = ref('')
const nodeEditVisible = ref(false)
const isEditing = ref(false)
const editingNodeId = ref('')

// 节点配置表单
const nodeForm = reactive<NodeFormData>({
  name: '',
  type: 'approval',
  approverType: 'role',
  approvalMode: 'or',
  isRequired: false,
  autoApprove: false,
  timeoutHours: 24,
  timeoutAction: 'remind_approver'
})

// 节点编辑表单
const nodeEditForm = reactive<NodeFormData>({
  name: '',
  type: 'approval',
  approverType: 'role',
  approvalMode: 'or',
  isRequired: false,
  autoApprove: false,
  timeoutHours: 24,
  timeoutAction: 'remind_approver'
})

// 表单验证规则
const flowInfoRules = {
  flowName: [
    { required: true, message: '请输入流程名称', trigger: 'blur' }
  ],
  flowCode: [
    { required: true, message: '请输入流程编码', trigger: 'blur' }
  ],
  flowType: [
    { required: true, message: '请选择流程类型', trigger: 'change' }
  ]
}

const nodeFormRules = {
  name: [
    { required: true, message: '请输入节点名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择节点类型', trigger: 'change' }
  ],
  approverType: [
    { required: true, message: '请选择审批人类型', trigger: 'change' }
  ],
  approvalMode: [
    { required: true, message: '请选择审批模式', trigger: 'change' }
  ]
}

const nodeEditFormRules = {
  name: [
    { required: true, message: '请输入节点名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择节点类型', trigger: 'change' }
  ],
  approverType: [
    { required: true, message: '请选择审批人类型', trigger: 'change' }
  ],
  approvalMode: [
    { required: true, message: '请选择审批模式', trigger: 'change' }
  ]
}

// 计算属性 - 选中的节点
const selectedNode = computed(() => {
  return flowNodes.value.find(node => node.id === selectedNodeId.value)
})

// 获取节点类型标签类型
const getNodeTypeTagType = (type: string): string => {
  const typeMap: Record<string, string> = {
    approval: 'primary',
    cc: 'info',
    condition: 'warning'
  }
  return typeMap[type] || 'info'
}

// 获取节点类型文本
const getNodeTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    approval: '审批',
    cc: '抄送',
    condition: '条件'
  }
  return textMap[type] || '未知'
}

// 获取审批人类型文本
const getApproverTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    role: '角色',
    department: '部门',
    position: '岗位',
    user: '指定用户',
    form_field: '表单字段'
  }
  return textMap[type] || '未知'
}

// 点击节点
const handleNodeClick = (node: DesignerNode) => {
  selectedNodeId.value = node.id
  // 更新节点配置表单
  Object.assign(nodeForm, {
    name: node.name,
    type: node.type,
    approverType: node.approverType,
    approvalMode: node.approvalMode,
    isRequired: node.isRequired,
    autoApprove: node.autoApprove,
    timeoutHours: node.timeoutHours,
    timeoutAction: node.timeoutAction
  })
}

// 添加节点
const handleAddNode = () => {
  isEditing.value = false
  editingNodeId.value = ''
  Object.assign(nodeEditForm, {
    name: '',
    type: 'approval',
    approverType: 'role',
    approvalMode: 'or',
    isRequired: false,
    autoApprove: false,
    timeoutHours: 24,
    timeoutAction: 'remind_approver'
  })
  nodeEditVisible.value = true
}

// 编辑节点
const handleEditNode = (node: DesignerNode) => {
  isEditing.value = true
  editingNodeId.value = node.id
  Object.assign(nodeEditForm, {
    name: node.name,
    type: node.type,
    approverType: node.approverType,
    approvalMode: node.approvalMode,
    isRequired: node.isRequired,
    autoApprove: node.autoApprove,
    timeoutHours: node.timeoutHours,
    timeoutAction: node.timeoutAction
  })
  nodeEditVisible.value = true
}

// 保存节点
const handleSaveNode = async () => {
  try {
    await nodeEditFormRef.value.validate()

    if (isEditing.value && editingNodeId.value) {
      // 更新节点
      const index = flowNodes.value.findIndex(n => n.id === editingNodeId.value)
      if (index > -1) {
        const updatedNode: DesignerNode = {
          ...flowNodes.value[index],
          name: nodeEditForm.name,
          type: nodeEditForm.type,
          approverType: nodeEditForm.approverType,
          approvalMode: nodeEditForm.approvalMode,
          isRequired: nodeEditForm.isRequired,
          autoApprove: nodeEditForm.autoApprove,
          timeoutHours: nodeEditForm.timeoutHours,
          timeoutAction: nodeEditForm.timeoutAction
        }
        flowNodes.value[index] = updatedNode
        emit('node-update', updatedNode)
        ElMessage.success('节点更新成功')
      }
    } else {
      // 添加节点
      const newNode: DesignerNode = {
        id: Date.now().toString(),
        name: nodeEditForm.name,
        type: nodeEditForm.type,
        approverType: nodeEditForm.approverType,
        order: flowNodes.value.length + 1,
        approvalMode: nodeEditForm.approvalMode,
        isRequired: nodeEditForm.isRequired,
        autoApprove: nodeEditForm.autoApprove,
        timeoutHours: nodeEditForm.timeoutHours,
        timeoutAction: nodeEditForm.timeoutAction
      }
      flowNodes.value.push(newNode)
      emit('node-add', newNode)
      ElMessage.success('节点添加成功')
    }

    nodeEditVisible.value = false
  } catch (error) {
    console.error('保存节点失败:', error)
  }
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
      // 重新排序
      flowNodes.value.forEach((node, idx) => {
        node.order = idx + 1
      })
      emit('node-delete', nodeId)
      ElMessage.success('节点删除成功')
    }
  }).catch(() => {})
}

// 保存节点配置
const handleSaveNodeConfig = async () => {
  if (!selectedNodeId.value) {
    return
  }

  try {
    await nodeFormRef.value.validate()

    const index = flowNodes.value.findIndex(n => n.id === selectedNodeId.value)
    if (index > -1) {
      const updatedNode: DesignerNode = {
        ...flowNodes.value[index],
        name: nodeForm.name,
        type: nodeForm.type,
        approverType: nodeForm.approverType,
        approvalMode: nodeForm.approvalMode,
        isRequired: nodeForm.isRequired,
        autoApprove: nodeForm.autoApprove,
        timeoutHours: nodeForm.timeoutHours,
        timeoutAction: nodeForm.timeoutAction
      }
      flowNodes.value[index] = updatedNode
      emit('node-update', updatedNode)
      ElMessage.success('节点配置保存成功')
      selectedNodeId.value = ''
    }
  } catch (error) {
    console.error('保存节点配置失败:', error)
  }
}

// 节点顺序变化
const handleNodeReorder = () => {
  // 重新排序
  flowNodes.value.forEach((node, idx) => {
    node.order = idx + 1
  })
  emit('node-reorder', flowNodes.value)
}

// 排序节点
const handleSortNodes = () => {
  ElMessage.info('拖拽节点可调整顺序')
}

// 保存流程
const handleSave = async () => {
  try {
    await flowInfoFormRef.value.validate()

    if (flowNodes.value.length === 0) {
      ElMessage.warning('请至少添加一个审批节点')
      return
    }

    const result = validateFlow()
    if (!result.valid) {
      ElMessage.warning(result.errors.join('\n'))
      return
    }

    emit('save', {
      flowInfo: { ...flowInfo },
      nodes: [...flowNodes.value]
    })
  } catch (error) {
    console.error('保存流程失败:', error)
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
}

// 验证流程配置
const validateFlow = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (flowNodes.value.length === 0) {
    errors.push('请至少添加一个审批节点')
  }

  for (const node of flowNodes.value) {
    if (!node.name) {
      errors.push(`节点${node.order}的名称不能为空`)
    }
    if (!node.approverType) {
      errors.push(`节点${node.order}的审批人类型不能为空`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// 获取流程数据
const getFlowData = () => {
  return {
    flowInfo: { ...flowInfo },
    nodes: [...flowNodes.value]
  }
}

// 监听props变化
watch(() => props.flowInfo, (newInfo) => {
  if (newInfo) {
    Object.assign(flowInfo, newInfo)
  }
}, { immediate: true, deep: true })

watch(() => props.nodes, (newNodes) => {
  if (newNodes) {
    flowNodes.value = [...newNodes]
  }
}, { immediate: true, deep: true })

// 暴露方法
defineExpose<FlowDesignerInstance>({
  addNode: (node: Partial<DesignerNode>) => {
    const newNode: DesignerNode = {
      id: Date.now().toString(),
      name: node.name || '',
      type: node.type || 'approval',
      approverType: node.approverType || 'role',
      order: flowNodes.value.length + 1,
      approvalMode: node.approvalMode || 'or',
      isRequired: node.isRequired || false,
      autoApprove: node.autoApprove || false,
      timeoutHours: node.timeoutHours || 24,
      timeoutAction: node.timeoutAction || 'remind_approver'
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
  updateNode: (nodeId: string, node: Partial<DesignerNode>) => {
    const index = flowNodes.value.findIndex(n => n.id === nodeId)
    if (index > -1) {
      flowNodes.value[index] = { ...flowNodes.value[index], ...node }
      emit('node-update', flowNodes.value[index])
    }
  },
  reorderNodes: (nodes: DesignerNode[]) => {
    flowNodes.value = nodes
    emit('node-reorder', nodes)
  },
  getFlowData,
  validateFlow
})
</script>

<style scoped>
.flow-designer-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 卡片样式 */
.flow-info-card,
.flow-nodes-card,
.node-config-card {
  border-radius: 8px;
  border: none;
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

.header-actions {
  display: flex;
  gap: 8px;
}

/* 节点列表 */
.nodes-container {
  min-height: 200px;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.node-item {
  position: relative;
  padding: 16px;
  background-color: #fff;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.node-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.node-item.is-selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.node-item.is-approval {
  border-left: 4px solid #409eff;
}

.node-item.is-cc {
  border-left: 4px solid #909399;
}

.node-item.is-condition {
  border-left: 4px solid #e6a23c;
}

/* 节点头部 */
.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.node-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.node-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 50%;
  color: #409eff;
  font-size: 20px;
}

.node-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-name {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.node-type-tag {
  font-size: 12px;
}

.node-actions {
  display: flex;
  gap: 4px;
}

/* 节点内容 */
.node-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 52px;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.info-label {
  color: #909399;
  min-width: 80px;
}

.info-value {
  color: #606266;
}

/* 节点箭头 */
.node-arrow {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  color: #909399;
  font-size: 20px;
}

/* 操作按钮栏 */
.action-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

/* 表单提示 */
.form-tip {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .flow-designer-container {
    padding: 10px;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: stretch;
  }

  .header-actions .el-button {
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

  .node-content {
    padding-left: 0;
  }

  .action-bar {
    flex-direction: column;
  }

  .action-bar .el-button {
    width: 100%;
  }
}
</style>
