<template>
  <div class="flow-management-form-container">
    <!-- FlowDesigner组件 -->
    <FlowDesigner
      ref="flowDesignerRef"
      :flow-info="flowInfo"
      :nodes="flowNodes"
      :editable="true"
      :readonly="false"
      @save="handleSave"
      @cancel="handleBack"
      @node-add="handleNodeAdd"
      @node-delete="handleNodeDelete"
      @node-update="handleNodeUpdate"
      @node-reorder="handleNodeReorder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import FlowDesigner from '@/components/FlowDesigner.vue'
import type {
  FlowBasicInfo,
  DesignerNode,
  FlowDesignerInstance
} from '@/types/flow-designer'
import {
  getApprovalFlowDetail,
  createApprovalFlow,
  updateApprovalFlow,
  checkFlowCode
} from '@/api/system/flowConfigApi'
import type { ApprovalFlow, ApprovalFlowForm } from '@/types/flow-config'
import { FlowStatus } from '@/types/flow-config'

// 路由
const router = useRouter()
const route = useRoute()

// FlowDesigner组件引用
const flowDesignerRef = ref<FlowDesignerInstance>()

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 流程ID
const flowId = computed(() => Number(route.params.id))

// 流程基本信息
const flowInfo = reactive<FlowBasicInfo>({
  flowName: '',
  flowCode: '',
  flowType: '',
  flowDescription: '',
  flowStatus: 'ENABLED',
  isDefault: false,
  remark: ''
})

// 流程节点列表
const flowNodes = ref<DesignerNode[]>([])

// 获取流程详情
const fetchDetail = async () => {
  try {
    const response: ApprovalFlow = await getApprovalFlowDetail(flowId.value)
    
    // 更新流程基本信息
    Object.assign(flowInfo, {
      flowName: response.flowName,
      flowCode: response.flowCode,
      flowType: response.flowType,
      flowDescription: response.flowDescription || '',
      flowStatus: response.flowStatus || 'ENABLED',
      isDefault: !!response.isDefault,
      remark: response.remark || ''
    })
    
    // 更新流程节点
    if (response.nodes && response.nodes.length > 0) {
      flowNodes.value = response.nodes.map((node, index) => ({
        id: String(node.id || index),
        name: node.nodeName,
        type: node.nodeType.toLowerCase() as any,
        order: node.nodeOrder,
        approverType: node.approverType.toLowerCase() as any,
        approvalMode: node.approvalMode?.toLowerCase() as any,
        isRequired: !!node.isRequired,
        autoApprove: !!node.autoApprove,
        timeoutHours: node.timeoutHours || 24,
        timeoutAction: node.timeoutAction || 'remind_approver'
      }))
    }
  } catch (error) {
    ElMessage.error('获取流程详情失败')
    console.error(error)
    handleBack()
  }
}

// 处理保存
const handleSave = async (data: { flowInfo: FlowBasicInfo; nodes: DesignerNode[] }) => {
  try {
    // 检查流程编码唯一性
    const isCodeUnique = await checkFlowCode(data.flowInfo.flowCode, isEdit.value ? flowId.value : undefined)
    if (!isCodeUnique) {
      ElMessage.error('流程编码已存在，请更换')
      return
    }
    
    // 检查至少有一个审批节点
    const approvalNodes = data.nodes.filter(node => node.type === 'approval')
    if (approvalNodes.length === 0) {
      ElMessage.warning('请至少添加一个审批节点')
      return
    }
    
    // 构建表单数据
    const formData: ApprovalFlowForm = {
      flowName: data.flowInfo.flowName,
      flowCode: data.flowInfo.flowCode,
      flowType: data.flowInfo.flowType,
      flowDescription: data.flowInfo.flowDescription,
      flowStatus: data.flowInfo.flowStatus as FlowStatus,
      isDefault: data.flowInfo.isDefault ? 1 : 0,
      remark: data.flowInfo.remark,
      nodes: data.nodes.map((node, index) => ({
        nodeName: node.name,
        nodeCode: `NODE_${index + 1}`,
        nodeType: node.type.toUpperCase() as any,
        nodeOrder: index + 1,
        approverType: node.approverType.toUpperCase() as any,
        approvalMode: node.approvalMode?.toUpperCase() as any,
        isRequired: node.isRequired ? 1 : 0,
        autoApprove: node.autoApprove ? 1 : 0,
        timeoutHours: node.timeoutHours,
        timeoutAction: node.timeoutAction
      }))
    }
    
    if (isEdit.value) {
      await updateApprovalFlow(flowId.value, formData)
      ElMessage.success('更新成功')
    } else {
      await createApprovalFlow(formData)
      ElMessage.success('创建成功')
    }
    
    handleBack()
  } catch (error: any) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    console.error(error)
  }
}

// 处理节点添加
const handleNodeAdd = (node: DesignerNode) => {
  console.log('节点添加:', node)
}

// 处理节点删除
const handleNodeDelete = (nodeId: string) => {
  console.log('节点删除:', nodeId)
}

// 处理节点更新
const handleNodeUpdate = (node: DesignerNode) => {
  console.log('节点更新:', node)
}

// 处理节点重排
const handleNodeReorder = (nodes: DesignerNode[]) => {
  console.log('节点重排:', nodes)
}

// 返回
const handleBack = () => {
  router.back()
}

// 初始化
onMounted(() => {
  if (isEdit.value) {
    fetchDetail()
  }
})
</script>

<style scoped>
.flow-management-form-container {
  width: 100%;
  min-height: calc(100vh - 60px);
}
</style>
