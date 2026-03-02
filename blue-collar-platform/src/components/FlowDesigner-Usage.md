# FlowDesigner 流程设计器组件使用指南

## 组件简介

FlowDesigner是一个可视化的审批流程设计器组件，支持创建、编辑和管理审批流程。

## 功能特性

### 核心功能
- ✅ 可视化展示审批流程
- ✅ 支持添加审批节点
- ✅ 支持编辑节点配置
- ✅ 支持删除节点
- ✅ 支持拖拽调整节点顺序
- ✅ 支持保存流程配置

### 节点类型支持
- **审批节点（approval）**: 需要审批的节点
- **抄送节点（cc）**: 仅抄送通知的节点
- **条件节点（condition）**: 基于条件判断的节点

### 审批模式支持
- **或签（or）**: 任意一人审批即可
- **会签（and）**: 所有人审批通过

### 审批人类型支持
- **角色（role）**: 按角色选择审批人
- **部门（department）**: 按部门选择审批人
- **岗位（position）**: 按岗位选择审批人
- **指定用户（user）**: 指定具体用户
- **表单字段（form_field）**: 根据表单字段动态确定

## 基础用法

### 1. 引入组件

```vue
<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner.vue'
import { ref } from 'vue'
import type { FlowBasicInfo, DesignerNode } from '@/types/flow-designer'

// 流程基本信息
const flowInfo = ref<FlowBasicInfo>({
  flowName: '请假审批流程',
  flowCode: 'LEAVE_APPROVAL',
  flowType: 'LEAVE',
  flowDescription: '员工请假审批流程',
  flowStatus: 'ENABLED',
  isDefault: false,
  remark: ''
})

// 审批节点列表
const nodes = ref<DesignerNode[]>([
  {
    id: '1',
    name: '部门主管审批',
    type: 'approval',
    order: 1,
    approverType: 'position',
    approvalMode: 'or',
    isRequired: true,
    autoApprove: false,
    timeoutHours: 24,
    timeoutAction: 'remind_approver'
  },
  {
    id: '2',
    name: '人事审批',
    type: 'approval',
    order: 2,
    approverType: 'role',
    approvalMode: 'or',
    isRequired: true,
    autoApprove: false,
    timeoutHours: 24,
    timeoutAction: 'remind_approver'
  }
])

// 保存流程
const handleSave = (data: { flowInfo: FlowBasicInfo; nodes: DesignerNode[] }) => {
  console.log('保存流程:', data)
  // 调用API保存流程
}

// 取消
const handleCancel = () => {
  console.log('取消操作')
}
</script>

<template>
  <FlowDesigner
    :flow-info="flowInfo"
    :nodes="nodes"
    :editable="true"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>
```

### 2. 只读模式

```vue
<template>
  <FlowDesigner
    :flow-info="flowInfo"
    :nodes="nodes"
    :editable="false"
    :readonly="true"
  />
</template>
```

## API 文档

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| flowInfo | 流程基本信息 | FlowBasicInfo | - |
| nodes | 流程节点列表 | DesignerNode[] | [] |
| editable | 是否可编辑 | boolean | true |
| readonly | 是否只读 | boolean | false |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| save | 流程保存事件 | (data: { flowInfo: FlowBasicInfo; nodes: DesignerNode[] }) => void |
| cancel | 流程取消事件 | () => void |
| node-add | 节点添加事件 | (node: DesignerNode) => void |
| node-delete | 节点删除事件 | (nodeId: string) => void |
| node-update | 节点更新事件 | (node: DesignerNode) => void |
| node-reorder | 节点顺序变化事件 | (nodes: DesignerNode[]) => void |

### Methods

通过 ref 调用组件方法：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import FlowDesigner from '@/components/FlowDesigner.vue'
import type { FlowDesignerInstance } from '@/types/flow-designer'

const designerRef = ref<FlowDesignerInstance>()

// 添加节点
const addNode = () => {
  designerRef.value?.addNode({
    name: '新节点',
    type: 'approval',
    approverType: 'role',
    approvalMode: 'or'
  })
}

// 删除节点
const deleteNode = (nodeId: string) => {
  designerRef.value?.deleteNode(nodeId)
}

// 更新节点
const updateNode = (nodeId: string) => {
  designerRef.value?.updateNode(nodeId, {
    name: '更新后的节点名称'
  })
}

// 调整节点顺序
const reorderNodes = (nodes: DesignerNode[]) => {
  designerRef.value?.reorderNodes(nodes)
}

// 获取流程数据
const getFlowData = () => {
  const data = designerRef.value?.getFlowData()
  console.log('流程数据:', data)
}

// 验证流程配置
const validateFlow = () => {
  const result = designerRef.value?.validateFlow()
  console.log('验证结果:', result)
}
</script>

<template>
  <FlowDesigner ref="designerRef" />
</template>
```

## 类型定义

### FlowBasicInfo

```typescript
interface FlowBasicInfo {
  flowName: string           // 流程名称
  flowCode: string           // 流程编码
  flowType: string           // 流程类型
  flowDescription?: string   // 流程描述
  flowStatus?: 'ENABLED' | 'DISABLED'  // 流程状态
  isDefault?: boolean        // 是否默认流程
  remark?: string            // 备注
}
```

### DesignerNode

```typescript
interface DesignerNode {
  id: string                 // 节点ID
  name: string               // 节点名称
  type: 'approval' | 'cc' | 'condition'  // 节点类型
  order: number              // 节点顺序
  approverType: 'role' | 'department' | 'position' | 'user' | 'form_field'  // 审批人类型
  approverConfig?: string    // 审批人配置(JSON字符串)
  ccUsers?: string           // 抄送用户(JSON字符串)
  conditionConfig?: string   // 条件配置(JSON字符串)
  approvalMode?: 'or' | 'and'  // 审批模式
  isRequired?: boolean       // 是否必填
  autoApprove?: boolean     // 是否自动审批
  timeoutHours?: number     // 超时时间(小时)
  timeoutAction?: string     // 超时操作
}
```

## 完整示例

### 流程管理页面示例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import FlowDesigner from '@/components/FlowDesigner.vue'
import type { FlowBasicInfo, DesignerNode } from '@/types/flow-designer'
import { getApprovalFlowDetail, createApprovalFlow, updateApprovalFlow } from '@/api/system/flowConfigApi'

const router = useRouter()
const flowId = ref<number>()
const designerRef = ref()

const flowInfo = ref<FlowBasicInfo>({
  flowName: '',
  flowCode: '',
  flowType: '',
  flowDescription: '',
  flowStatus: 'ENABLED',
  isDefault: false,
  remark: ''
})

const nodes = ref<DesignerNode[]>([])

// 加载流程数据
const loadFlowData = async () => {
  if (flowId.value) {
    try {
      const response = await getApprovalFlowDetail(flowId.value)
      flowInfo.value = {
        flowName: response.flowName,
        flowCode: response.flowCode,
        flowType: response.flowType,
        flowDescription: response.flowDescription,
        flowStatus: response.flowStatus,
        isDefault: response.isDefault === 1,
        remark: response.remark
      }
      nodes.value = (response.nodes || []).map(node => ({
        id: node.id?.toString() || '',
        name: node.nodeName,
        type: node.nodeType.toLowerCase() as any,
        order: node.nodeOrder,
        approverType: node.approverType.toLowerCase() as any,
        approverConfig: node.approverConfig,
        ccUsers: node.ccUsers,
        conditionConfig: node.conditionConfig,
        approvalMode: node.approvalMode?.toLowerCase() as any,
        isRequired: node.isRequired === 1,
        autoApprove: node.autoApprove === 1,
        timeoutHours: node.timeoutHours,
        timeoutAction: node.timeoutAction
      }))
    } catch (error) {
      ElMessage.error('加载流程数据失败')
    }
  }
}

// 保存流程
const handleSave = async (data: { flowInfo: FlowBasicInfo; nodes: DesignerNode[] }) => {
  try {
    const formData = {
      flowName: data.flowInfo.flowName,
      flowCode: data.flowInfo.flowCode,
      flowType: data.flowInfo.flowType,
      flowDescription: data.flowInfo.flowDescription,
      flowStatus: data.flowInfo.flowStatus,
      isDefault: data.flowInfo.isDefault ? 1 : 0,
      remark: data.flowInfo.remark,
      nodes: data.nodes.map(node => ({
        nodeName: node.name,
        nodeCode: node.name.toUpperCase().replace(/\s+/g, '_'),
        nodeType: node.type.toUpperCase(),
        nodeOrder: node.order,
        approverType: node.approverType.toUpperCase(),
        approverConfig: node.approverConfig,
        ccUsers: node.ccUsers,
        conditionConfig: node.conditionConfig,
        approvalMode: node.approvalMode?.toUpperCase(),
        isRequired: node.isRequired ? 1 : 0,
        autoApprove: node.autoApprove ? 1 : 0,
        timeoutHours: node.timeoutHours,
        timeoutAction: node.timeoutAction
      }))
    }

    if (flowId.value) {
      await updateApprovalFlow(flowId.value, formData)
      ElMessage.success('流程更新成功')
    } else {
      await createApprovalFlow(formData)
      ElMessage.success('流程创建成功')
    }

    router.back()
  } catch (error) {
    ElMessage.error('保存流程失败')
  }
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadFlowData()
})
</script>

<template>
  <div class="flow-management-page">
    <FlowDesigner
      ref="designerRef"
      :flow-info="flowInfo"
      :nodes="nodes"
      :editable="true"
      @save="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.flow-management-page {
  width: 100%;
  height: 100%;
}
</style>
```

## 注意事项

1. **节点顺序**: 节点顺序通过拖拽调整，保存时会自动重新计算 order 值
2. **必填验证**: 至少需要添加一个审批节点才能保存流程
3. **节点配置**: 点击节点后可以在下方配置区域编辑节点详细信息
4. **只读模式**: 设置 readonly 为 true 时，所有编辑功能将被禁用
5. **数据转换**: 与后端交互时，需要注意节点类型和审批模式的枚举值转换

## 最佳实践

1. **流程设计**: 建议按照业务流程的审批顺序设计节点
2. **节点命名**: 使用清晰的节点名称，如"部门主管审批"、"人事审批"等
3. **超时设置**: 合理设置超时时间，避免流程长时间停滞
4. **审批模式**: 根据业务需求选择或签或会签模式
5. **审批人类型**: 根据组织架构选择合适的审批人类型

## 更新日志

### v1.0.0 (2026-02-26)
- 初始版本发布
- 支持基本的流程设计功能
- 支持三种节点类型
- 支持拖拽排序
- 支持节点配置编辑
