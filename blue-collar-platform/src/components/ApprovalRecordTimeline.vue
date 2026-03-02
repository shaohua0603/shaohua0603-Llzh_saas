<template>
  <div class="approval-record-timeline">
    <!-- 时间线头部 -->
    <div v-if="showHeader" class="timeline-header">
      <h4 class="timeline-title">{{ title }}</h4>
      <div v-if="showExpandAll" class="timeline-actions">
        <el-button
          :icon="allExpanded ? Fold : Expand"
          size="small"
          link
          @click="toggleExpandAll"
        >
          {{ allExpanded ? '全部折叠' : '全部展开' }}
        </el-button>
      </div>
    </div>

    <!-- 时间线内容 -->
    <el-timeline class="approval-timeline">
      <el-timeline-item
        v-for="(record, index) in sortedRecords"
        :key="index"
        :timestamp="formatDate(record.approvalTime)"
        placement="top"
        :type="getTimelineType(record.approvalResult)"
        :icon="getTimelineIcon(record.approvalResult)"
        :color="getTimelineColor(record.approvalResult)"
        :size="isCurrentRecord(record) ? 'large' : 'normal'"
        :hollow="record.approvalResult === 'pending'"
      >
        <!-- 记录内容 -->
        <div class="record-content">
          <!-- 记录头部 -->
          <div class="record-header">
            <div class="record-title">
              <el-tag
                :type="getRecordType(record.approvalResult)"
                size="small"
                class="record-type-tag"
              >
                {{ getRecordTypeText(record.approvalResult) }}
              </el-tag>
              <span class="record-node-name">{{ record.nodeName }}</span>
              <el-tag v-if="isCurrentRecord(record)" type="primary" size="small" effect="dark">
                当前节点
              </el-tag>
            </div>
            <div v-if="showExpandButton" class="record-expand">
              <el-button
                :icon="expandedRecords[index] ? ArrowUp : ArrowDown"
                size="small"
                link
                @click="toggleExpand(index)"
              >
                {{ expandedRecords[index] ? '收起' : '展开' }}
              </el-button>
            </div>
          </div>

          <!-- 记录详情 -->
          <div v-show="expandedRecords[index] || !showExpandButton" class="record-details">
            <!-- 审批人信息 -->
            <div class="record-info">
              <span class="info-label">审批人:</span>
              <span class="info-value">{{ record.approver }}</span>
            </div>

            <!-- 审批时间 -->
            <div class="record-info">
              <span class="info-label">审批时间:</span>
              <span class="info-value">{{ formatDateTime(record.approvalTime) }}</span>
            </div>

            <!-- 审批结果 -->
            <div class="record-info">
              <span class="info-label">审批结果:</span>
              <el-tag :type="getApprovalResultType(record.approvalResult)" size="small">
                {{ getApprovalResultText(record.approvalResult) }}
              </el-tag>
            </div>

            <!-- 审批意见 -->
            <div v-if="record.approvalComment" class="record-comment">
              <div class="comment-header">
                <span class="comment-label">审批意见:</span>
              </div>
              <div class="comment-content">{{ record.approvalComment }}</div>
            </div>

            <!-- 驳回原因 -->
            <div v-if="record.approvalResult === 'rejected' && record.rejectReason" class="record-reject">
              <div class="reject-header">
                <el-icon color="#f56c6c"><Warning /></el-icon>
                <span class="reject-label">驳回原因:</span>
              </div>
              <div class="reject-content">{{ record.rejectReason }}</div>
            </div>

            <!-- 附件列表 -->
            <div v-if="record.attachments && record.attachments.length > 0" class="record-attachments">
              <div class="attachments-header">
                <el-icon><Paperclip /></el-icon>
                <span class="attachments-label">附件 ({{ record.attachments.length }}):</span>
              </div>
              <div class="attachments-list">
                <el-tag
                  v-for="(attachment, idx) in record.attachments"
                  :key="idx"
                  size="small"
                  class="attachment-tag"
                  closable
                  @close="handleAttachmentClose(attachment, index)"
                >
                  <el-icon class="attachment-icon"><Document /></el-icon>
                  {{ attachment }}
                </el-tag>
              </div>
            </div>

            <!-- 抄送信息 -->
            <div v-if="record.ccUsers && record.ccUsers.length > 0" class="record-cc">
              <div class="cc-header">
                <el-icon color="#409eff"><Message /></el-icon>
                <span class="cc-label">抄送给:</span>
              </div>
              <div class="cc-list">
                <el-tag
                  v-for="(user, idx) in record.ccUsers"
                  :key="idx"
                  type="info"
                  size="small"
                  class="cc-tag"
                >
                  {{ user }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>

    <!-- 空状态 -->
    <el-empty
      v-if="!records || records.length === 0"
      description="暂无审批记录"
      :image-size="100"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ArrowDown,
  ArrowUp,
  Warning,
  Paperclip,
  Document,
  Message,
  Fold,
  Expand,
  CircleCheck,
  CircleClose,
  Clock,
  InfoFilled
} from '@element-plus/icons-vue'
import type { ApprovalRecord } from '../types/flow-config'

/**
 * 审批记录时间线组件Props
 */
interface ApprovalRecordTimelineProps {
  /** 审批记录列表 */
  records?: ApprovalRecord[]
  /** 当前节点ID */
  currentNodeId?: string
  /** 是否显示头部 */
  showHeader?: boolean
  /** 是否显示展开全部按钮 */
  showExpandAll?: boolean
  /** 是否显示展开按钮 */
  showExpandButton?: boolean
  /** 标题 */
  title?: string
  /** 默认是否展开 */
  defaultExpanded?: boolean
  /** 是否按时间倒序排列 */
  reverseOrder?: boolean
}

/**
 * 审批记录时间线组件Emits
 */
interface ApprovalRecordTimelineEmits {
  /** 附件关闭事件 */
  (e: 'attachment-close', attachment: string, recordIndex: number): void
  /** 记录点击事件 */
  (e: 'record-click', record: ApprovalRecord, index: number): void
}

// Props定义
const props = withDefaults(defineProps<ApprovalRecordTimelineProps>(), {
  records: () => [],
  showHeader: true,
  showExpandAll: true,
  showExpandButton: true,
  title: '审批记录',
  defaultExpanded: true,
  reverseOrder: false
})

// Emits定义
const emit = defineEmits<ApprovalRecordTimelineEmits>()

// 响应式数据
const expandedRecords = ref<Record<number, boolean>>({})

// 计算属性 - 是否全部展开
const allExpanded = computed(() => {
  return Object.values(expandedRecords.value).every(v => v === true)
})

// 计算属性 - 排序后的记录
const sortedRecords = computed(() => {
  const records = [...props.records]
  if (props.reverseOrder) {
    return records.reverse()
  }
  return records
})

// 判断是否为当前记录
const isCurrentRecord = (record: ApprovalRecord): boolean => {
  return props.currentNodeId === record.nodeId && record.approvalResult === 'pending'
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
    pending: Clock
  }
  return iconMap[result] || InfoFilled
}

// 获取时间线颜色
const getTimelineColor = (result: string): string => {
  const colorMap: Record<string, string> = {
    approved: '#67c23a',
    rejected: '#f56c6c',
    pending: '#909399'
  }
  return colorMap[result] || '#909399'
}

// 获取记录类型
const getRecordType = (result: string): string => {
  const typeMap: Record<string, string> = {
    approved: 'success',
    rejected: 'danger',
    pending: 'info'
  }
  return typeMap[result] || 'info'
}

// 获取记录类型文本
const getRecordTypeText = (result: string): string => {
  const textMap: Record<string, string> = {
    approved: '已通过',
    rejected: '已驳回',
    pending: '待审批'
  }
  return textMap[result] || '未知'
}

// 获取审批结果类型
const getApprovalResultType = (result: string): string => {
  const typeMap: Record<string, string> = {
    approved: 'success',
    rejected: 'danger',
    pending: 'warning'
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
  return `${year}-${month}-${day}`
}

// 格式化日期时间
const formatDateTime = (date: Date): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 切换展开/折叠
const toggleExpand = (index: number) => {
  expandedRecords.value[index] = !expandedRecords.value[index]
}

// 切换全部展开/折叠
const toggleExpandAll = () => {
  const newState = !allExpanded.value
  sortedRecords.value.forEach((_, index) => {
    expandedRecords.value[index] = newState
  })
}

// 处理附件关闭
const handleAttachmentClose = (attachment: string, recordIndex: number) => {
  emit('attachment-close', attachment, recordIndex)
}

// 初始化展开状态
const initExpandedState = () => {
  sortedRecords.value.forEach((_, index) => {
    if (expandedRecords.value[index] === undefined) {
      expandedRecords.value[index] = props.defaultExpanded
    }
  })
}

// 监听记录变化
watch(() => props.records, () => {
  initExpandedState()
}, { immediate: true, deep: true })

// 监听默认展开状态变化
watch(() => props.defaultExpanded, () => {
  initExpandedState()
})
</script>

<style scoped>
.approval-record-timeline {
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 时间线头部 */
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.timeline-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.timeline-actions {
  display: flex;
  gap: 8px;
}

/* 时间线内容 */
.approval-timeline {
  padding: 0;
}

/* 记录内容 */
.record-content {
  padding: 8px 0;
}

/* 记录头部 */
.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.record-type-tag {
  font-weight: 600;
}

.record-node-name {
  font-weight: 600;
  color: #303133;
  font-size: 15px;
}

.record-expand {
  flex-shrink: 0;
}

/* 记录详情 */
.record-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 8px;
}

.record-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.info-label {
  color: #909399;
  min-width: 70px;
  font-weight: 500;
}

.info-value {
  color: #606266;
  flex: 1;
}

/* 审批意见 */
.record-comment {
  padding: 12px;
  background-color: #fff;
  border-left: 3px solid #409eff;
  border-radius: 4px;
}

.comment-header {
  margin-bottom: 8px;
}

.comment-label {
  color: #909399;
  font-size: 14px;
  font-weight: 500;
}

.comment-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

/* 驳回原因 */
.record-reject {
  padding: 12px;
  background-color: #fef0f0;
  border-left: 3px solid #f56c6c;
  border-radius: 4px;
}

.reject-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.reject-label {
  color: #f56c6c;
  font-size: 14px;
  font-weight: 600;
}

.reject-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

/* 附件列表 */
.record-attachments {
  padding: 12px;
  background-color: #fff;
  border-left: 3px solid #67c23a;
  border-radius: 4px;
}

.attachments-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.attachments-label {
  color: #67c23a;
  font-size: 14px;
  font-weight: 500;
}

.attachments-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.attachment-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.attachment-icon {
  font-size: 14px;
}

/* 抄送信息 */
.record-cc {
  padding: 12px;
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
  border-radius: 4px;
}

.cc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.cc-label {
  color: #409eff;
  font-size: 14px;
  font-weight: 500;
}

.cc-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cc-tag {
  margin-right: 0;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .approval-record-timeline {
    padding: 12px;
  }

  .timeline-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .record-title {
    flex-wrap: wrap;
  }

  .record-details {
    padding: 10px;
  }

  .record-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-label {
    min-width: auto;
  }

  .attachments-list {
    flex-direction: column;
    gap: 6px;
  }

  .attachment-tag {
    width: 100%;
  }

  .cc-list {
    flex-direction: column;
    gap: 6px;
  }

  .cc-tag {
    width: 100%;
  }
}

/* 动画效果 */
.record-details {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Element Plus 时间线样式覆盖 */
:deep(.el-timeline-item__timestamp) {
  font-size: 13px;
  color: #909399;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 20px;
}

:deep(.el-timeline-item__icon) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-timeline-item__dot) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
