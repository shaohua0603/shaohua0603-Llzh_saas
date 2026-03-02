<template>
  <div class="labor-company-message-detail">
    <div class="detail-container">
      <!-- 基本信息 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <el-tag :type="getTypeType(messageDetail.type)">
              {{ getTypeText(messageDetail.type) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="消息编号">{{ messageDetail.messageNo }}</el-descriptions-item>
          <el-descriptions-item label="消息类型">
            <el-tag :type="getTypeType(messageDetail.type)">
              {{ getTypeText(messageDetail.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="消息标题" :span="2">{{ messageDetail.title }}</el-descriptions-item>
          <el-descriptions-item label="发送人">{{ messageDetail.sender }}</el-descriptions-item>
          <el-descriptions-item label="发送时间">{{ messageDetail.sendTime }}</el-descriptions-item>
          <el-descriptions-item label="阅读状态">
            <el-tag :type="messageDetail.readStatus === 'unread' ? 'danger' : 'info'">
              {{ messageDetail.readStatus === 'unread' ? '未读' : '已读' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="阅读时间">{{ messageDetail.readTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 消息内容 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <span>消息内容</span>
        </template>
        <div class="message-content">
          <p>{{ messageDetail.content }}</p>
        </div>
      </el-card>

      <!-- 附件 -->
      <el-card v-if="messageDetail.attachments && messageDetail.attachments.length > 0" class="detail-card" shadow="never">
        <template #header>
          <span>附件</span>
        </template>
        <el-space wrap>
          <el-button
            v-for="(file, index) in messageDetail.attachments"
            :key="index"
            type="primary"
            link
            @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
            {{ file.name }}
          </el-button>
        </el-space>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          v-if="messageDetail.readStatus === 'unread'"
          type="success"
          size="large"
          @click="handleMarkRead"
        >
          <el-icon><Check /></el-icon>
          标为已读
        </el-button>
        <el-button
          v-if="messageDetail.businessType && messageDetail.businessId"
          type="primary"
          size="large"
          @click="handleViewBusinessDetail"
        >
          <el-icon><View /></el-icon>
          查看业务详情
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download, Check, View, Back } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const messageId = route.params.id as string

// 消息详情
const messageDetail = ref<any>({
  id: 1,
  messageNo: 'MSG202602250001',
  title: '系统维护通知',
  type: 'system',
  sender: '系统管理员',
  readStatus: 'unread',
  sendTime: '2026-02-25 08:00:00',
  readTime: '',
  content: '系统将于2026-02-26 02:00-04:00进行维护,请提前做好相关准备。维护期间系统将无法访问,请合理安排工作时间。如有疑问,请联系技术支持。',
  businessType: '',
  businessId: '',
  attachments: []
})

// 返回
const goBack = () => {
  router.back()
}

// 下载附件
const handleDownload = (file: any) => {
  ElMessage.info(`下载附件: ${file.name}`)
}

// 标记为已读
const handleMarkRead = () => {
  // 模拟API调用
  messageDetail.value.readStatus = 'read'
  messageDetail.value.readTime = new Date().toLocaleString('zh-CN')
  ElMessage.success('已标记为已读')
}

// 查看业务详情
const handleViewBusinessDetail = () => {
  // 根据业务类型跳转到对应的业务详情页
  const businessType = messageDetail.value.businessType
  const businessId = messageDetail.value.businessId

  switch (businessType) {
    case 'leave':
      router.push(`/labor-company/leave-detail/${businessId}`)
      break
    case 'transfer':
      router.push(`/labor-company/transfer-detail/${businessId}`)
      break
    case 'resignation':
      router.push(`/labor-company/resignation-detail/${businessId}`)
      break
    case 'contract':
      router.push(`/labor-company/contract-detail/${businessId}`)
      break
    case 'worker':
      router.push(`/labor-company/workers`)
      break
    case 'warning':
      router.push(`/labor-company/warning-detail/${businessId}`)
      break
    default:
      ElMessage.info('暂无业务详情页')
  }
}

// 获取类型类型
const getTypeType = (type: string) => {
  const typeMap: Record<string, string> = {
    system: 'info',
    business: 'primary',
    approval: 'success',
    warning: 'danger'
  }
  return typeMap[type] || 'info'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    system: '系统通知',
    business: '业务通知',
    approval: '审批通知',
    warning: '预警通知'
  }
  return textMap[type] || '未知'
}

// 获取消息详情
const fetchMessageDetail = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 实际项目中这里应该调用API获取详情数据
  } catch (error) {
    ElMessage.error('获取消息详情失败')
  }
}

// 生命周期
onMounted(() => {
  fetchMessageDetail()
})
</script>

<style scoped>
.labor-company-message-detail {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.message-content {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.8;
  color: #606266;
}

.message-content p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .labor-company-message-detail {
    padding: 10px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
