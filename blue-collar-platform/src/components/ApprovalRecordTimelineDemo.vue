<template>
  <div class="approval-record-timeline-demo">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>审批记录时间线组件示例</span>
        </div>
      </template>

      <!-- 基础用法 -->
      <div class="demo-section">
        <h4>基础用法</h4>
        <ApprovalRecordTimeline :records="basicRecords" />
      </div>

      <el-divider />

      <!-- 倒序排列 -->
      <div class="demo-section">
        <h4>倒序排列（最新记录在前）</h4>
        <ApprovalRecordTimeline :records="basicRecords" :reverse-order="true" />
      </div>

      <el-divider />

      <!-- 当前节点高亮 -->
      <div class="demo-section">
        <h4>当前节点高亮</h4>
        <ApprovalRecordTimeline
          :records="recordsWithCurrent"
          current-node-id="node-3"
        />
      </div>

      <el-divider />

      <!-- 自定义标题 -->
      <div class="demo-section">
        <h4>自定义标题</h4>
        <ApprovalRecordTimeline
          :records="basicRecords"
          title="请假审批记录"
        />
      </div>

      <el-divider />

      <!-- 隐藏展开按钮 -->
      <div class="demo-section">
        <h4>隐藏展开按钮（全部展开）</h4>
        <ApprovalRecordTimeline
          :records="basicRecords"
          :show-expand-button="false"
        />
      </div>

      <el-divider />

      <!-- 默认折叠 -->
      <div class="demo-section">
        <h4>默认折叠</h4>
        <ApprovalRecordTimeline
          :records="basicRecords"
          :default-expanded="false"
        />
      </div>

      <el-divider />

      <!-- 完整示例（包含驳回、附件、抄送） -->
      <div class="demo-section">
        <h4>完整示例（包含驳回、附件、抄送）</h4>
        <ApprovalRecordTimeline
          :records="completeRecords"
          current-node-id="node-4"
          :reverse-order="true"
          @attachment-close="handleAttachmentClose"
        />
      </div>

      <el-divider />

      <!-- 动态更新 -->
      <div class="demo-section">
        <h4>动态更新</h4>
        <div class="demo-actions">
          <el-button type="primary" @click="addRecord">添加记录</el-button>
          <el-button @click="resetRecords">重置记录</el-button>
        </div>
        <ApprovalRecordTimeline :records="dynamicRecords" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ApprovalRecordTimeline from '../ApprovalRecordTimeline.vue'
import type { ApprovalRecord } from '../../types/approval-flow'

// 基础记录数据
const basicRecords = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-1',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-15 09:30:00'),
    approvalResult: 'approved',
    approvalComment: '同意请假申请，工作交接已完成。'
  },
  {
    nodeId: 'node-2',
    nodeName: '人事审批',
    approver: '李四',
    approvalTime: new Date('2024-01-15 14:20:00'),
    approvalResult: 'approved',
    approvalComment: '符合公司请假制度，批准。'
  }
])

// 带当前节点的记录
const recordsWithCurrent = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-1',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-15 09:30:00'),
    approvalResult: 'approved',
    approvalComment: '同意。'
  },
  {
    nodeId: 'node-2',
    nodeName: '人事审批',
    approver: '李四',
    approvalTime: new Date('2024-01-15 14:20:00'),
    approvalResult: 'approved',
    approvalComment: '符合制度。'
  },
  {
    nodeId: 'node-3',
    nodeName: '总经理审批',
    approver: '王五',
    approvalTime: new Date(),
    approvalResult: 'pending'
  }
])

// 完整记录数据
const completeRecords = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-1',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-15 09:30:00'),
    approvalResult: 'rejected',
    approvalComment: '工作交接未完成，请完善后再提交。',
    rejectReason: '工作交接文档不完整，缺少项目交接说明。',
    ccUsers: ['赵六', '孙七']
  },
  {
    nodeId: 'node-2',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-16 10:00:00'),
    approvalResult: 'approved',
    approvalComment: '工作交接已完成，同意请假。',
    attachments: ['工作交接文档.docx', '请假申请表.pdf'],
    ccUsers: ['赵六']
  },
  {
    nodeId: 'node-3',
    nodeName: '人事审批',
    approver: '李四',
    approvalTime: new Date('2024-01-16 15:30:00'),
    approvalResult: 'approved',
    approvalComment: '符合公司请假制度，批准。',
    attachments: ['请假审批单.pdf']
  },
  {
    nodeId: 'node-4',
    nodeName: '总经理审批',
    approver: '王五',
    approvalTime: new Date(),
    approvalResult: 'pending'
  }
])

// 动态记录数据
const dynamicRecords = ref<ApprovalRecord[]>([
  {
    nodeId: 'node-1',
    nodeName: '部门主管审批',
    approver: '张三',
    approvalTime: new Date('2024-01-15 09:30:00'),
    approvalResult: 'approved',
    approvalComment: '同意。'
  }
])

let recordCount = 2

// 添加记录
const addRecord = () => {
  const newRecord: ApprovalRecord = {
    nodeId: `node-${recordCount}`,
    nodeName: `审批节点 ${recordCount}`,
    approver: ['张三', '李四', '王五', '赵六'][recordCount % 4],
    approvalTime: new Date(),
    approvalResult: ['approved', 'rejected', 'pending'][recordCount % 3] as any,
    approvalComment: `这是第 ${recordCount} 条审批记录。`
  }

  if (newRecord.approvalResult === 'rejected') {
    newRecord.rejectReason = '驳回原因示例'
  }

  if (recordCount % 2 === 0) {
    newRecord.attachments = [`附件${recordCount}.pdf`]
  }

  if (recordCount % 3 === 0) {
    newRecord.ccUsers = ['抄送用户A', '抄送用户B']
  }

  dynamicRecords.value.push(newRecord)
  recordCount++

  ElMessage.success('添加记录成功')
}

// 重置记录
const resetRecords = () => {
  dynamicRecords.value = [
    {
      nodeId: 'node-1',
      nodeName: '部门主管审批',
      approver: '张三',
      approvalTime: new Date('2024-01-15 09:30:00'),
      approvalResult: 'approved',
      approvalComment: '同意。'
    }
  ]
  recordCount = 2

  ElMessage.success('重置记录成功')
}

// 处理附件关闭
const handleAttachmentClose = (attachment: string, recordIndex: number) => {
  ElMessage.info(`关闭附件: ${attachment} (记录索引: ${recordIndex})`)
}
</script>

<style scoped>
.approval-record-timeline-demo {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.demo-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

:deep(.el-divider) {
  margin: 30px 0;
}
</style>
