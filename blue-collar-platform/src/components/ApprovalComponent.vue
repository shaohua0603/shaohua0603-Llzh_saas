<template>
  <div class="approval-component">
    <!-- 审核记录 -->
    <div class="approval-records card-background">
      <el-divider content-position="left">审核记录</el-divider>
      <el-timeline v-if="approvalRecords && approvalRecords.length > 0">
        <el-timeline-item
          v-for="(record, index) in approvalRecords"
          :key="index"
          :timestamp="formatDate(record.approvalTime)"
          :type="record.approvalResult === 'approved' ? 'success' : 'danger'"
        >
          <div class="approval-record-item">
            <div class="record-header">
              <span class="record-approver">{{ record.approver }}</span>
              <el-tag :type="record.approvalResult === 'approved' ? 'success' : 'danger'" size="small">
                {{ record.approvalResult === 'approved' ? '通过' : '驳回' }}
              </el-tag>
            </div>
            <div class="record-content" v-if="record.approvalComment">
              <strong>备注：</strong>{{ record.approvalComment }}
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <div v-else class="no-records">
        <el-empty description="暂无审核记录" />
      </div>
    </div>

    <!-- 审核表单 -->
    <div v-if="isApprovalMode && canApprove" class="approval-form card-background">
      <el-divider content-position="left">审核</el-divider>
      <el-form :model="approvalForm" label-width="120px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="approvalForm.result">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="approvalForm.result === 'rejected'" label="驳回原因">
          <el-input
            v-model="approvalForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入驳回原因"
          />
        </el-form-item>
        <el-form-item v-if="approvalForm.result === 'approved'" label="备注">
          <el-input
            v-model="approvalForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
        <!-- 提交按钮已移至页面底部 -->
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import type { ApprovalRecord } from '@/types/livingExpense'

// 类型定义已移至 types/livingExpense.ts

// Props
const props = defineProps<{
  isApprovalMode: boolean
  canApprove: boolean
  approvalRecords: ApprovalRecord[]
  onSubmit: (result: 'approved' | 'rejected', reason: string, comment: string) => Promise<boolean>
}>()

// 审核表单
const approvalForm = reactive({
  result: 'approved' as 'approved' | 'rejected',
  reason: '',
  comment: ''
})

const submitting = ref(false)

// 暴露方法给父组件
defineExpose({
  getFormData: () => {
    return {
      result: approvalForm.result,
      reason: approvalForm.reason,
      comment: approvalForm.comment
    }
  },
  validateForm: () => {
    if (approvalForm.result === 'rejected' && !approvalForm.reason) {
      ElMessage.warning('请输入驳回原因')
      return false
    }
    return true
  }
})

// 格式化日期
const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  return dateStr
}

// 提交审核的逻辑已移至页面底部的按钮处理
</script>

<style scoped>
.approval-component {
  margin-top: 16px;
}

.card-background {
  padding: 12px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}

.approval-form {
  border-left: 4px solid #409eff;
}

.approval-records {
  margin-bottom: 12px;
}

.no-records {
  padding: 16px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.approval-record-item {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 6px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.record-content {
  margin-top: 6px;
  line-height: 1.5;
}
</style>
