<template>
  <div class="common-detail-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="detail-loading">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 详情内容 -->
    <div v-else class="detail-content">
      <!-- 面包屑 -->
      <div v-if="config.breadcrumb && config.breadcrumb.length > 0" class="detail-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in config.breadcrumb"
            :key="item.path"
            :to="item.path"
          >
            {{ item.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 标题 -->
      <div v-if="config.title" class="detail-title">
        <h2>{{ config.title }}</h2>
      </div>

      <!-- 操作按钮 -->
      <div v-if="config.showActions !== false && config.actions && config.actions.length > 0" class="detail-actions">
        <el-button
          v-for="action in visibleActions"
          :key="action.label"
          :type="action.type"
          :icon="action.icon"
          :loading="action.loading"
          :disabled="isActionDisabled(action)"
          @click="handleActionClick(action)"
        >
          {{ action.label }}
        </el-button>
      </div>

      <!-- 信息分组 -->
      <div class="detail-groups">
        <el-collapse v-model="activeGroups">
          <el-collapse-item
            v-for="group in visibleGroups"
            :key="group.title"
            :name="group.title"
            :disabled="!group.collapsible"
          >
            <template #title>
              <div class="group-title">
                <span>{{ group.title }}</span>
                <el-icon v-if="group.collapsible" class="collapse-icon">
                  <ArrowDown />
                </el-icon>
              </div>
            </template>

            <div class="group-content">
              <el-row :gutter="group.gutter || 20">
                <el-col
                  v-for="field in visibleFields(group)"
                  :key="field.field"
                  :span="field.span || (group.columns ? 24 / group.columns : 12)"
                >
                  <div class="field-item">
                    <div class="field-label">{{ field.label }}</div>
                    <div class="field-value">
                      <!-- 自定义渲染 -->
                      <slot
                        v-if="$slots[`field-${field.field}`]"
                        :name="`field-${field.field}`"
                        :value="data[field.field]"
                        :data="data"
                        :field="field"
                      ></slot>

                      <!-- 文本类型 -->
                      <span v-else-if="field.type === 'text'">
                        {{ formatFieldValue(field, data[field.field]) }}
                      </span>

                      <!-- 日期类型 -->
                      <span v-else-if="field.type === 'date'">
                        {{ formatDate(data[field.field]) }}
                      </span>

                      <!-- 日期时间类型 -->
                      <span v-else-if="field.type === 'datetime'">
                        {{ formatDateTime(data[field.field]) }}
                      </span>

                      <!-- 数字类型 -->
                      <span v-else-if="field.type === 'number'">
                        {{ formatNumber(data[field.field]) }}
                      </span>

                      <!-- 枚举类型 -->
                      <el-tag
                        v-else-if="field.type === 'enum'"
                        :type="getEnumTagType(field, data[field.field])"
                      >
                        {{ getEnumLabel(field, data[field.field]) }}
                      </el-tag>

                      <!-- 富文本类型 -->
                      <div
                        v-else-if="field.type === 'richtext'"
                        class="richtext-content"
                        v-html="data[field.field]"
                      ></div>

                      <!-- 文件类型 -->
                      <div v-else-if="field.type === 'file'" class="file-list">
                        <div
                          v-for="(file, index) in getFileList(data[field.field])"
                          :key="index"
                          class="file-item"
                        >
                          <el-icon><Document /></el-icon>
                          <span>{{ file.name }}</span>
                          <el-button
                            type="primary"
                            link
                            size="small"
                            @click="handleDownload(file)"
                          >
                            下载
                          </el-button>
                        </div>
                      </div>

                      <!-- 图片类型 -->
                      <div v-else-if="field.type === 'image'" class="image-list">
                        <el-image
                          v-for="(img, index) in getImageList(data[field.field])"
                          :key="index"
                          :src="img.url"
                          :preview-src-list="getImageList(data[field.field]).map(i => i.url)"
                          fit="cover"
                          class="detail-image"
                        />
                      </div>

                      <!-- 链接类型 -->
                      <el-link
                        v-else-if="field.type === 'link'"
                        :href="getLinkUrl(field)"
                        :target="field.target || '_blank'"
                        type="primary"
                      >
                        {{ data[field.field] || '查看详情' }}
                      </el-link>

                      <!-- 标签类型 -->
                      <el-tag
                        v-else-if="field.type === 'tag'"
                        v-for="tag in getTagList(field, data[field.field])"
                        :key="tag.value"
                        :type="tag.color"
                      >
                        {{ tag.label }}
                      </el-tag>

                      <!-- 进度条类型 -->
                      <el-progress
                        v-else-if="field.type === 'progress'"
                        :percentage="getProgressPercentage(field)"
                        :status="field.status"
                      />

                      <!-- 评分类型 -->
                      <el-rate
                        v-else-if="field.type === 'rate'"
                        v-model="getRateValue(field)"
                        :allow-half="field.allowHalf"
                        :disabled="field.disabled !== false"
                      />

                      <!-- 头像类型 -->
                      <el-avatar
                        v-else-if="field.type === 'avatar'"
                        :size="field.avatarSize || 'default'"
                        :src="data[field.field]"
                      >
                        {{ getAvatarText(data[field.field]) }}
                      </el-avatar>

                      <!-- 自定义渲染函数 -->
                      <component
                        v-else-if="field.render"
                        :is="() => field.render(data[field.field], data)"
                      />

                      <!-- 默认显示 -->
                      <span v-else>{{ data[field.field] }}</span>

                      <!-- 提示信息 -->
                      <el-tooltip v-if="field.tip" :content="field.tip" placement="top">
                        <el-icon class="field-tip-icon"><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 附件 -->
      <div v-if="config.showAttachments !== false && config.attachment" class="detail-attachments">
        <div class="section-title">
          <el-icon><Paperclip /></el-icon>
          <span>附件</span>
        </div>
        <div class="attachment-list">
          <div
            v-for="attachment in getAttachments()"
            :key="attachment.id"
            class="attachment-item"
          >
            <el-icon class="attachment-icon">
              <component :is="getAttachmentIcon(attachment.type)" />
            </el-icon>
            <div class="attachment-info">
              <div class="attachment-name">{{ attachment.name }}</div>
              <div class="attachment-meta">
                <span>{{ formatFileSize(attachment.size) }}</span>
                <span>{{ attachment.uploadTime }}</span>
              </div>
            </div>
            <div class="attachment-actions">
              <el-button
                v-if="attachment.preview !== false"
                type="primary"
                link
                size="small"
                @click="handlePreview(attachment)"
              >
                预览
              </el-button>
              <el-button
                v-if="attachment.download !== false"
                type="primary"
                link
                size="small"
                @click="handleDownload(attachment)"
              >
                下载
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 审核记录 -->
      <div v-if="config.showApprovalRecords !== false && config.approvalRecords && config.approvalRecords.length > 0" class="detail-approval-records">
        <div class="section-title">
          <el-icon><DocumentChecked /></el-icon>
          <span>审核记录</span>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in config.approvalRecords"
            :key="index"
            :timestamp="record.approvalTime"
            placement="top"
            :type="getApprovalTimelineType(record.approvalResult)"
            :color="getApprovalTimelineColor(record.approvalResult)"
          >
            <div class="approval-record">
              <div class="approval-header">
                <el-avatar :size="32" :src="record.approverAvatar">
                  {{ record.approver?.charAt(0) }}
                </el-avatar>
                <div class="approval-info">
                  <div class="approval-node">{{ record.nodeName }}</div>
                  <div class="approval-user">{{ record.approver }}</div>
                </div>
                <el-tag
                  :type="getApprovalTagType(record.approvalResult)"
                  size="small"
                >
                  {{ getApprovalResultText(record.approvalResult) }}
                </el-tag>
              </div>
              <div v-if="record.approvalComment" class="approval-comment">
                {{ record.approvalComment }}
              </div>
              <div v-if="record.attachments && record.attachments.length > 0" class="approval-attachments">
                <el-button
                  v-for="att in record.attachments"
                  :key="att.id"
                  type="primary"
                  link
                  size="small"
                  @click="handleDownload(att)"
                >
                  <el-icon><Paperclip /></el-icon>
                  {{ att.name }}
                </el-button>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 操作记录 -->
      <div v-if="config.showOperationRecords !== false && config.operationRecords && config.operationRecords.length > 0" class="detail-operation-records">
        <div class="section-title">
          <el-icon><Clock /></el-icon>
          <span>操作记录</span>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in config.operationRecords"
            :key="index"
            :timestamp="record.operateTime"
            placement="top"
            :type="getOperationTimelineType(record.operationStatus)"
            :color="getOperationTimelineColor(record.operationStatus)"
          >
            <div class="operation-record">
              <div class="operation-header">
                <el-avatar :size="32" :src="record.operatorAvatar">
                  {{ record.operator?.charAt(0) }}
                </el-avatar>
                <div class="operation-info">
                  <div class="operation-type">{{ record.operationType }}</div>
                  <div class="operation-user">{{ record.operator }}</div>
                </div>
                <el-tag
                  :type="getOperationTagType(record.operationStatus)"
                  size="small"
                >
                  {{ getOperationStatusText(record.operationStatus) }}
                </el-tag>
              </div>
              <div v-if="record.operationContent" class="operation-content">
                {{ record.operationContent }}
              </div>
              <div v-if="record.remark" class="operation-remark">
                备注: {{ record.remark }}
              </div>
              <div v-if="record.attachments && record.attachments.length > 0" class="operation-attachments">
                <el-button
                  v-for="att in record.attachments"
                  :key="att.id"
                  type="primary"
                  link
                  size="small"
                  @click="handleDownload(att)"
                >
                  <el-icon><Paperclip /></el-icon>
                  {{ att.name }}
                </el-button>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  InfoFilled,
  Document,
  Paperclip,
  DocumentChecked,
  Clock,
  Picture,
  VideoPlay,
  Headset,
  Folder
} from '@element-plus/icons-vue'
import type {
  DetailConfig,
  DetailGroupConfig,
  DetailFieldConfig,
  ActionButton,
  Attachment,
  OperationRecord,
  ApprovalRecord
} from '../types/common-detail'

// Props定义
interface Props {
  /** 详情配置 */
  config: DetailConfig
  /** 详情数据 */
  data: any
  /** 是否加载中 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits定义
const emit = defineEmits<{
  'action-click': [action: ActionButton, data: any]
  'attachment-download': [attachment: Attachment]
  'attachment-preview': [attachment: Attachment]
  'group-toggle': [group: DetailGroupConfig, expanded: boolean]
}>()

// 响应式数据
const activeGroups = ref<string[]>([])

// 计算属性 - 可见分组
const visibleGroups = computed(() => {
  return props.config.groups.filter(group => {
    if (typeof group.visible === 'function') {
      return group.visible(props.data)
    }
    return group.visible !== false
  })
})

// 计算属性 - 可见操作按钮
const visibleActions = computed(() => {
  return (props.config.actions || []).filter(action => {
    if (typeof action.visible === 'function') {
      return action.visible(props.data)
    }
    return action.visible !== false
  })
})

// 获取可见字段
const visibleFields = (group: DetailGroupConfig) => {
  return group.fields.filter(field => {
    if (typeof field.visible === 'function') {
      return field.visible(props.data)
    }
    return field.visible !== false
  })
}

// 判断操作按钮是否禁用
const isActionDisabled = (action: ActionButton) => {
  if (typeof action.disabled === 'function') {
    return action.disabled(props.data)
  }
  return action.disabled || false
}

// 处理操作按钮点击
const handleActionClick = async (action: ActionButton) => {
  if (action.confirm) {
    try {
      await ElMessageBox.confirm(action.confirm, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    } catch {
      return
    }
  }

  try {
    await action.handler(props.data)
    emit('action-click', action, props.data)
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 格式化字段值
const formatFieldValue = (field: DetailFieldConfig, value: any) => {
  if (field.formatter) {
    return field.formatter(value, props.data)
  }
  return value
}

// 格式化日期
const formatDate = (value: any) => {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleDateString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (value: any) => {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleString('zh-CN')
}

// 格式化数字
const formatNumber = (value: any) => {
  if (value === null || value === undefined) return '-'
  return Number(value).toLocaleString()
}

// 获取枚举标签
const getEnumLabel = (field: DetailFieldConfig, value: any) => {
  const option = field.options?.find(opt => opt.value === value)
  return option?.label || value
}

// 获取枚举标签类型
const getEnumTagType = (field: DetailFieldConfig, value: any) => {
  const option = field.options?.find(opt => opt.value === value)
  return option?.color || 'info'
}

// 获取文件列表
const getFileList = (value: any) => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

// 获取图片列表
const getImageList = (value: any) => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

// 获取链接地址
const getLinkUrl = (field: DetailFieldConfig) => {
  if (typeof field.link === 'function') {
    return field.link(props.data)
  }
  return field.link || '#'
}

// 获取标签列表
const getTagList = (field: DetailFieldConfig, value: any) => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map(v => {
      const option = field.options?.find(opt => opt.value === v)
      return {
        label: option?.label || v,
        value: v,
        color: option?.color || 'info'
      }
    })
  }
  const option = field.options?.find(opt => opt.value === value)
  return [{
    label: option?.label || value,
    value,
    color: option?.color || 'info'
  }]
}

// 获取进度条百分比
const getProgressPercentage = (field: DetailFieldConfig) => {
  if (typeof field.percentage === 'function') {
    return field.percentage(props.data)
  }
  return field.percentage || 0
}

// 获取评分值
const getRateValue = (field: DetailFieldConfig) => {
  if (typeof field.rate === 'function') {
    return field.rate(props.data)
  }
  return field.rate || 0
}

// 获取头像文本
const getAvatarText = (value: any) => {
  if (!value) return '?'
  return String(value).charAt(0).toUpperCase()
}

// 获取附件
const getAttachments = () => {
  if (!props.config.attachment) return []
  const attachment = props.config.attachment
  if (Array.isArray(attachment)) {
    return attachment
  }
  return [attachment]
}

// 获取附件图标
const getAttachmentIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    image: Picture,
    file: Document,
    video: VideoPlay,
    audio: Headset,
    document: Folder
  }
  return iconMap[type] || Document
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '-'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 处理附件下载
const handleDownload = (attachment: Attachment) => {
  emit('attachment-download', attachment)
  // 这里可以添加实际的下载逻辑
  ElMessage.success('开始下载: ' + attachment.name)
}

// 处理附件预览
const handlePreview = (attachment: Attachment) => {
  emit('attachment-preview', attachment)
  // 这里可以添加实际的预览逻辑
  ElMessage.success('预览: ' + attachment.name)
}

// 获取审核时间线类型
const getApprovalTimelineType = (result: string) => {
  const typeMap: Record<string, any> = {
    approved: 'success',
    rejected: 'danger',
    pending: 'warning'
  }
  return typeMap[result] || 'primary'
}

// 获取审核时间线颜色
const getApprovalTimelineColor = (result: string) => {
  const colorMap: Record<string, string> = {
    approved: '#67c23a',
    rejected: '#f56c6c',
    pending: '#e6a23c'
  }
  return colorMap[result] || '#409eff'
}

// 获取审核标签类型
const getApprovalTagType = (result: string) => {
  const typeMap: Record<string, any> = {
    approved: 'success',
    rejected: 'danger',
    pending: 'warning'
  }
  return typeMap[result] || 'info'
}

// 获取审核结果文本
const getApprovalResultText = (result: string) => {
  const textMap: Record<string, string> = {
    approved: '通过',
    rejected: '驳回',
    pending: '待审核'
  }
  return textMap[result] || result
}

// 获取操作时间线类型
const getOperationTimelineType = (status: string) => {
  const typeMap: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    pending: 'warning'
  }
  return typeMap[status] || 'primary'
}

// 获取操作时间线颜色
const getOperationTimelineColor = (status: string) => {
  const colorMap: Record<string, string> = {
    success: '#67c23a',
    failed: '#f56c6c',
    pending: '#e6a23c'
  }
  return colorMap[status] || '#409eff'
}

// 获取操作标签类型
const getOperationTagType = (status: string) => {
  const typeMap: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    pending: 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取操作状态文本
const getOperationStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    success: '成功',
    failed: '失败',
    pending: '进行中'
  }
  return textMap[status] || status
}

// 初始化
const init = () => {
  // 默认展开所有分组
  activeGroups.value = visibleGroups.value.map(group => group.title)
}

init()
</script>

<style scoped>
.common-detail-container {
  width: 100%;
  min-height: 100%;
}

/* 加载状态 */
.detail-loading {
  padding: 20px;
}

/* 详情内容 */
.detail-content {
  padding: 20px;
}

/* 面包屑 */
.detail-breadcrumb {
  margin-bottom: 20px;
}

/* 标题 */
.detail-title {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.detail-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

/* 操作按钮 */
.detail-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
}

/* 信息分组 */
.detail-groups {
  margin-bottom: 20px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.collapse-icon {
  transition: transform var(--transition-fast);
}

:deep(.el-collapse-item__header.is-active .collapse-icon) {
  transform: rotate(180deg);
}

.group-content {
  padding: 16px 0;
}

/* 字段项 */
.field-item {
  margin-bottom: 16px;
}

.field-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.field-value {
  font-size: 14px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.field-tip-icon {
  color: var(--color-info);
  cursor: help;
}

/* 富文本内容 */
.richtext-content {
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* 文件列表 */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
}

/* 图片列表 */
.image-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

/* 附件 */
.detail-attachments {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.attachment-item:hover {
  box-shadow: var(--shadow-sm);
  border-color: var(--color-primary);
}

.attachment-icon {
  font-size: 24px;
  color: var(--color-primary);
}

.attachment-info {
  flex: 1;
  min-width: 0;
}

.attachment-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.attachment-actions {
  display: flex;
  gap: 8px;
}

/* 审核记录 */
.detail-approval-records {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
}

.approval-record {
  padding: 12px;
  background-color: #fff;
  border-radius: var(--radius-md);
}

.approval-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.approval-info {
  flex: 1;
}

.approval-node {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.approval-user {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.approval-comment {
  padding: 8px 12px;
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-regular);
  margin-bottom: 8px;
}

.approval-attachments {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 操作记录 */
.detail-operation-records {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
}

.operation-record {
  padding: 12px;
  background-color: #fff;
  border-radius: var(--radius-md);
}

.operation-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.operation-info {
  flex: 1;
}

.operation-type {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.operation-user {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.operation-content {
  padding: 8px 12px;
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-regular);
  margin-bottom: 8px;
}

.operation-remark {
  padding: 8px 12px;
  background-color: #fff3e0;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: #e6a23c;
  margin-bottom: 8px;
}

.operation-attachments {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .detail-content {
    padding: 12px;
  }

  .detail-actions {
    flex-direction: column;
  }

  .detail-actions .el-button {
    width: 100%;
  }

  .field-item {
    margin-bottom: 12px;
  }

  .attachment-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .attachment-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
