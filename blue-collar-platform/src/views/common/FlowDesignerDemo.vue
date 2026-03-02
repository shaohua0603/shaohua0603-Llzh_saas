<template>
  <div class="flow-designer-demo">
    <el-card class="demo-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">FlowDesigner 流程设计器组件演示</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <FlowDesigner
        ref="designerRef"
        :flow-info="flowInfo"
        :nodes="nodes"
        :editable="editable"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import FlowDesigner from '@/components/FlowDesigner.vue'
import type { FlowBasicInfo, DesignerNode, FlowDesignerInstance } from '@/types/flow-designer'

const router = useRouter()
const designerRef = ref<FlowDesignerInstance>()

const editable = ref(true)

const flowInfo = ref<FlowBasicInfo>({
  flowName: '请假审批流程',
  flowCode: 'LEAVE_APPROVAL',
  flowType: 'LEAVE',
  flowDescription: '员工请假审批流程，包括部门主管审批和人事审批',
  flowStatus: 'ENABLED',
  isDefault: false,
  remark: '标准请假审批流程'
})

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
  },
  {
    id: '3',
    name: '抄送通知',
    type: 'cc',
    order: 3,
    approverType: 'user',
    isRequired: false,
    autoApprove: false,
    timeoutHours: 24,
    timeoutAction: 'remind_approver'
  }
])

// 保存流程
const handleSave = (data: { flowInfo: FlowBasicInfo; nodes: DesignerNode[] }) => {
  console.log('保存流程:', data)
  ElMessage.success('流程保存成功！请查看控制台输出')
}

// 取消
const handleCancel = () => {
  ElMessage.info('已取消操作')
}

// 返回
const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.flow-designer-demo {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.demo-card {
  border-radius: 8px;
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
</style>
