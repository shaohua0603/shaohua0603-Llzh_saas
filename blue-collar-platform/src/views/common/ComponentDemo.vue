<template>
  <div class="component-demo">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 打印预览组件演示 -->
      <el-tab-pane label="打印预览组件" name="print">
        <div class="demo-section">
          <h2>打印预览组件演示</h2>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>合同打印预览</span>
                    <el-button type="primary" @click="loadPrintTemplate">加载模板</el-button>
                  </div>
                </template>

                <PrintPreview
                  v-if="showPrintPreview"
                  :template="printTemplate"
                  :data="printData"
                  :settings="printSettings"
                  @print="handlePrint"
                  @settings-change="handleSettingsChange"
                  @cancel="handleCancel"
                />
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>打印数据</span>
                </template>
                <el-form label-width="100px">
                  <el-form-item label="公司名称">
                    <el-input v-model="printFormData.companyName" />
                  </el-form-item>
                  <el-form-item label="工人姓名">
                    <el-input v-model="printFormData.workerName" />
                  </el-form-item>
                  <el-form-item label="签订日期">
                    <el-date-picker
                      v-model="printFormData.signDate"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    />
                  </el-form-item>
                  <el-form-item label="合同期限">
                    <el-input v-model="printFormData.contractPeriod" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="updatePrintData">更新数据</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>批量打印数据</span>
                </template>
                <el-button type="primary" @click="loadBatchPrintData">加载批量数据</el-button>
                <el-table
                  v-if="batchPrintData.length > 0"
                  :data="batchPrintData"
                  style="margin-top: 16px"
                  max-height="300"
                >
                  <el-table-column prop="id" label="ID" width="80" />
                  <el-table-column prop="data.workerName" label="工人姓名" />
                  <el-table-column prop="data.department" label="部门" />
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 审批流程组件演示 -->
      <el-tab-pane label="审批流程组件" name="approval">
        <div class="demo-section">
          <h2>审批流程组件演示</h2>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>审批流程配置</span>
                    <el-button-group>
                      <el-button @click="toggleEditMode">
                        {{ editable ? '只读模式' : '编辑模式' }}
                      </el-button>
                      <el-button @click="loadApprovalFlow">加载流程</el-button>
                    </el-button-group>
                  </div>
                </template>

                <ApprovalFlow
                  :flow-config="flowConfig"
                  :approval-status="approvalStatus"
                  :editable="editable"
                  :show-approval-form="showApprovalForm"
                  :current-user-id="currentUserId"
                  @flow-change="handleFlowChange"
                  @node-add="handleNodeAdd"
                  @node-delete="handleNodeDelete"
                  @node-update="handleNodeUpdate"
                  @approve="handleApprove"
                  @reject="handleReject"
                  @transfer="handleTransfer"
                />
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>审批状态控制</span>
                </template>
                <el-form label-width="120px">
                  <el-form-item label="当前状态">
                    <el-select v-model="approvalStatus.status" style="width: 100%">
                      <el-option label="待审批" value="pending" />
                      <el-option label="审批中" value="in_progress" />
                      <el-option label="已通过" value="approved" />
                      <el-option label="已驳回" value="rejected" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="当前节点">
                    <el-select v-model="approvalStatus.currentNodeId" style="width: 100%">
                      <el-option
                        v-for="node in flowConfig?.nodes"
                        :key="node.id"
                        :label="node.name"
                        :value="node.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="显示审批表单">
                    <el-switch v-model="showApprovalForm" />
                  </el-form-item>
                  <el-form-item label="当前用户ID">
                    <el-input v-model="currentUserId" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="updateApprovalStatus">更新状态</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>添加审批记录</span>
                </template>
                <el-form label-width="100px">
                  <el-form-item label="节点名称">
                    <el-input v-model="newRecord.nodeName" />
                  </el-form-item>
                  <el-form-item label="审批人">
                    <el-input v-model="newRecord.approver" />
                  </el-form-item>
                  <el-form-item label="审批结果">
                    <el-select v-model="newRecord.approvalResult" style="width: 100%">
                      <el-option label="通过" value="approved" />
                      <el-option label="驳回" value="rejected" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="审批意见">
                    <el-input
                      v-model="newRecord.approvalComment"
                      type="textarea"
                      :rows="3"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addApprovalRecord">添加记录</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import PrintPreview from '@/components/PrintPreview.vue'
import ApprovalFlow from '@/components/ApprovalFlow.vue'
import type {
  PrintTemplate,
  PrintData,
  PrintSettings
} from '@/types/print-preview'
import type {
  ApprovalFlowConfig,
  ApprovalStatus,
  ApprovalRecord
} from '@/types/approval-flow'

// Tab切换
const activeTab = ref('print')

// 打印预览相关
const showPrintPreview = ref(false)
const printTemplate = ref<PrintTemplate>()
const printData = ref<PrintData[]>([])
const printSettings = ref<Partial<PrintSettings>>({
  copies: 1,
  quality: 'medium',
  orientation: 'portrait'
})
const printFormData = ref({
  companyName: '某某劳务公司',
  workerName: '张三',
  signDate: new Date(),
  contractPeriod: '1年'
})
const batchPrintData = ref<PrintData[]>([])

// 审批流程相关
const editable = ref(false)
const showApprovalForm = ref(true)
const currentUserId = ref('user1')
const flowConfig = ref<ApprovalFlowConfig>()
const approvalStatus = ref<ApprovalStatus>({
  status: 'pending',
  currentNodeId: '',
  records: []
})
const newRecord = ref<Partial<ApprovalRecord>>({
  nodeName: '',
  approver: '',
  approvalResult: 'approved',
  approvalComment: ''
})

// 加载打印模板
const loadPrintTemplate = () => {
  printTemplate.value = {
    id: '1',
    name: '劳动合同模板',
    code: 'contract',
    content: `
      <div style="padding: 40px; font-family: 'SimSun', serif;">
        <h1 style="text-align: center; margin-bottom: 40px;">劳动合同</h1>

        <div style="margin-bottom: 30px;">
          <p><strong>甲方:</strong> {{companyName}}</p>
          <p><strong>乙方:</strong> {{workerName}}</p>
          <p><strong>签订日期:</strong> {{signDate}}</p>
          <p><strong>合同期限:</strong> {{contractPeriod}}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2>一、合同期限</h2>
          <p>本合同自签订之日起生效，有效期为{{contractPeriod}}。</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2>二、工作内容</h2>
          <p>乙方同意根据甲方工作需要，担任生产岗位工作。</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2>三、工作时间和休息休假</h2>
          <p>甲方实行标准工时制度，乙方每日工作8小时，每周工作40小时。</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2>四、劳动报酬</h2>
          <p>甲方按月支付乙方工资，工资标准不低于当地最低工资标准。</p>
        </div>

        <div style="margin-top: 60px; text-align: center;">
          <p><strong>甲方（盖章）:</strong> __________________</p>
          <p><strong>乙方（签字）:</strong> __________________</p>
          <p style="margin-top: 20px;">签订日期: __________________</p>
        </div>
      </div>
    `,
    variables: [
      { name: 'companyName', label: '公司名称', type: 'text', required: true },
      { name: 'workerName', label: '工人姓名', type: 'text', required: true },
      { name: 'signDate', label: '签订日期', type: 'date', required: true },
      { name: 'contractPeriod', label: '合同期限', type: 'text', required: true }
    ],
    createdAt: new Date().toISOString()
  }

  updatePrintData()
  showPrintPreview.value = true
  ElMessage.success('打印模板加载成功')
}

// 更新打印数据
const updatePrintData = () => {
  const signDate = printFormData.value.signDate
    ? new Date(printFormData.value.signDate).toLocaleDateString('zh-CN')
    : ''

  printData.value = [
    {
      id: '1',
      data: {
        companyName: printFormData.value.companyName,
        workerName: printFormData.value.workerName,
        signDate: signDate,
        contractPeriod: printFormData.value.contractPeriod
      },
      templateId: '1'
    }
  ]
}

// 加载批量打印数据
const loadBatchPrintData = () => {
  batchPrintData.value = [
    {
      id: '1',
      data: { workerName: '张三', department: '生产部' },
      templateId: '1'
    },
    {
      id: '2',
      data: { workerName: '李四', department: '质检部' },
      templateId: '1'
    },
    {
      id: '3',
      data: { workerName: '王五', department: '仓储部' },
      templateId: '1'
    },
    {
      id: '4',
      data: { workerName: '赵六', department: '物流部' },
      templateId: '1'
    },
    {
      id: '5',
      data: { workerName: '孙七', department: '生产部' },
      templateId: '1'
    }
  ]

  printData.value = batchPrintData.value
  ElMessage.success('批量数据加载成功')
}

// 打印事件
const handlePrint = (data: PrintData[]) => {
  console.log('打印数据:', data)
  ElMessage.success('正在打印...')
}

// 设置变化
const handleSettingsChange = (settings: PrintSettings) => {
  console.log('打印设置已更新:', settings)
  printSettings.value = settings
}

// 取消打印
const handleCancel = () => {
  showPrintPreview.value = false
  ElMessage.info('已取消打印')
}

// 切换编辑模式
const toggleEditMode = () => {
  editable.value = !editable.value
}

// 加载审批流程
const loadApprovalFlow = () => {
  flowConfig.value = {
    id: '1',
    name: '请假审批流程',
    code: 'leave-approval',
    description: '员工请假审批流程',
    status: 'enabled',
    nodes: [
      {
        id: '1',
        name: '部门主管审批',
        type: 'approval',
        approvers: ['user1', 'user2'],
        approvalMode: 'or',
        required: true
      },
      {
        id: '2',
        name: '人事审批',
        type: 'approval',
        approvers: ['user3'],
        approvalMode: 'or',
        required: true
      },
      {
        id: '3',
        name: '总经理审批',
        type: 'approval',
        approvers: ['user4'],
        approvalMode: 'or',
        required: false
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  approvalStatus.value = {
    status: 'in_progress',
    currentNodeId: '1',
    records: []
  }

  ElMessage.success('审批流程加载成功')
}

// 流程变化
const handleFlowChange = (flow: ApprovalFlowConfig) => {
  console.log('流程配置已更新:', flow)
  flowConfig.value = flow
}

// 节点添加
const handleNodeAdd = (node: any) => {
  console.log('节点已添加:', node)
}

// 节点删除
const handleNodeDelete = (nodeId: string) => {
  console.log('节点已删除:', nodeId)
}

// 节点更新
const handleNodeUpdate = (node: any) => {
  console.log('节点已更新:', node)
}

// 审批通过
const handleApprove = (data: any) => {
  console.log('审批通过:', data)
  ElMessage.success('审批通过')
}

// 审批驳回
const handleReject = (data: any) => {
  console.log('审批驳回:', data)
  ElMessage.warning('已驳回')
}

// 转交
const handleTransfer = (data: any) => {
  console.log('转交他人:', data)
  ElMessage.info('已转交')
}

// 更新审批状态
const updateApprovalStatus = () => {
  console.log('审批状态已更新:', approvalStatus.value)
  ElMessage.success('审批状态已更新')
}

// 添加审批记录
const addApprovalRecord = () => {
  if (!newRecord.value.nodeName || !newRecord.value.approver) {
    ElMessage.warning('请填写完整的审批记录信息')
    return
  }

  const record: ApprovalRecord = {
    nodeId: Date.now().toString(),
    nodeName: newRecord.value.nodeName!,
    approver: newRecord.value.approver!,
    approvalTime: new Date(),
    approvalResult: newRecord.value.approvalResult!,
    approvalComment: newRecord.value.approvalComment
  }

  approvalStatus.value.records.push(record)

  // 重置表单
  newRecord.value = {
    nodeName: '',
    approver: '',
    approvalResult: 'approved',
    approvalComment: ''
  }

  ElMessage.success('审批记录添加成功')
}
</script>

<style scoped>
.component-demo {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.demo-section {
  padding: 20px;
}

.demo-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card {
  margin-bottom: 20px;
}

:deep(.el-tabs__content) {
  padding: 20px;
}
</style>
