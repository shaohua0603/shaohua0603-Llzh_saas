<template>
  <div class="contract-detail-page">
    <div class="detail-content">
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">基本信息</span>
            <el-tag :type="getStatusType(contractDetail.contractStatus)">
              {{ getStatusText(contractDetail.contractStatus) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">
            {{ contractDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ contractDetail.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="证件号">
            {{ contractDetail.idCard }}
          </el-descriptions-item>
          <el-descriptions-item label="签订日期">
            {{ contractDetail.signDate || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="结算方式">
            {{ getSettlementMethodText(contractDetail.settlementMethod) }}
          </el-descriptions-item>
          <el-descriptions-item label="负责人">
            {{ contractDetail.responsiblePerson }}
          </el-descriptions-item>
          <el-descriptions-item label="群号">
            {{ contractDetail.groupId }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card v-if="contractDetail.attachments && contractDetail.attachments.length > 0" class="info-card" shadow="never">
        <template #header>
          <span class="card-title">合同附件</span>
        </template>
        <div class="attachment-list">
          <div
            v-for="(file, index) in contractDetail.attachments"
            :key="index"
            class="attachment-item"
          >
            <el-icon class="attachment-icon"><Document /></el-icon>
            <span class="attachment-name">{{ file.name }}</span>
            <div class="attachment-actions">
              <el-button link type="primary" size="small" @click="handlePreview(file)">
                预览
              </el-button>
              <el-button link type="primary" size="small" @click="handleDownload(file)">
                下载
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="info-card" shadow="never">
        <template #header>
          <span class="card-title">操作记录</span>
        </template>
        <el-timeline v-if="operationRecords.length > 0">
          <el-timeline-item
            v-for="(record, index) in operationRecords"
            :key="index"
            :timestamp="record.createTime"
            placement="top"
          >
            <div class="record-content">
              <div class="record-action">{{ record.actionText }}</div>
              <div class="record-operator">操作人：{{ record.operatorName }}</div>
              <div v-if="record.remark" class="record-remark">备注：{{ record.remark }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无操作记录" />
      </el-card>
    </div>

    <div class="detail-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button
        v-if="contractDetail.contractStatus === 'UNSIGNED' || contractDetail.contractStatus === 'SIGNING'"
        @click="handleEdit"
      >
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button
        v-if="contractDetail.contractStatus === 'UNSIGNED' || contractDetail.contractStatus === 'SIGNING'"
        type="danger"
        @click="handleDelete"
      >
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
      <el-button @click="handlePrint">
        <el-icon><Printer /></el-icon>
        打印
      </el-button>
    </div>

    <el-dialog
      v-model="showPreview"
      title="文件预览"
      width="800px"
      :close-on-click-modal="true"
    >
      <div class="preview-container">
        <img v-if="isImage(previewFile)" :src="previewFile.url" alt="预览" />
        <iframe v-else-if="isPDF(previewFile)" :src="previewFile.url" frameborder="0"></iframe>
        <div v-else class="preview-placeholder">
          <el-icon :size="64"><Document /></el-icon>
          <p>该文件类型不支持预览</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete, Printer, Document } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const contractDetail = reactive({
  id: '',
  name: '',
  phone: '',
  idCard: '',
  signDate: '',
  settlementMethod: '',
  responsiblePerson: '',
  groupId: '',
  attachments: [],
  contractStatus: ''
})

interface ContractRecord {
  id: string
  contractId: string
  action: string
  actionText: string
  operatorId: string
  operatorName: string
  createTime: string
  remark: string
}

const operationRecords = ref<ContractRecord[]>([])
const showPreview = ref(false)
const previewFile = ref<any>(null)

const ContractStatusConfig = {
  UNSIGNED: { code: 'UNSIGNED', name: '未签订', color: 'info' },
  SIGNING: { code: 'SIGNING', name: '签订中', color: 'warning' },
  SIGNED: { code: 'SIGNED', name: '已签订', color: 'success' },
  CANCELLED: { code: 'CANCELLED', name: '已取消', color: 'danger' }
}

const SettlementMethodConfig = {
  DAILY: { code: 'DAILY', name: '日结' },
  MONTHLY: { code: 'MONTHLY', name: '月结' }
}

const getStatusType = (status: string) => {
  const config = Object.values(ContractStatusConfig).find(c => c.code === status)
  return config?.color || 'info'
}

const getStatusText = (status: string) => {
  const config = Object.values(ContractStatusConfig).find(c => c.code === status)
  return config?.name || status
}

const getSettlementMethodText = (method: string) => {
  const config = Object.values(SettlementMethodConfig).find(c => c.code === method)
  return config?.name || method
}

// 模拟合同数据
const mockContractDetail = {
  id: '1',
  name: '张三',
  phone: '138****8001',
  idCard: '410101199005151234',
  signDate: '2024-01-15',
  settlementMethod: 'MONTHLY',
  responsiblePerson: '李四',
  groupId: '10086',
  attachments: [
    {
      name: '身份证复印件.pdf',
      url: 'https://example.com/files/id-card.pdf'
    },
    {
      name: '体检报告.jpg',
      url: 'https://example.com/files/medical-report.jpg'
    }
  ],
  contractStatus: 'SIGNED'
}

// 模拟操作记录
const mockOperationRecords: ContractRecord[] = [
  {
    id: '1',
    contractId: '1',
    action: 'CREATE',
    actionText: '创建合同',
    operatorId: '1',
    operatorName: '管理员',
    createTime: '2024-01-10 10:00:00',
    remark: '创建新合同'
  },
  {
    id: '2',
    contractId: '1',
    action: 'UPDATE',
    actionText: '更新合同',
    operatorId: '1',
    operatorName: '管理员',
    createTime: '2024-01-15 14:00:00',
    remark: '更新合同状态为已签订'
  },
  {
    id: '3',
    contractId: '1',
    action: 'APPROVE',
    actionText: '审核通过',
    operatorId: '2',
    operatorName: '审批人',
    createTime: '2024-01-15 14:30:00',
    remark: '审核通过合同'
  }
]

const loadContractDetail = async (id: string) => {
  loading.value = true
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 使用模拟数据
    Object.assign(contractDetail, mockContractDetail)
    operationRecords.value = mockOperationRecords
  } catch (error) {
    console.error('加载合同详情失败:', error)
    ElMessage.error('加载合同详情失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push({ name: 'LaborCompanyContractEdit', params: { id: contractDetail.id } })
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该合同吗？删除后无法恢复', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      ElMessage.success('删除成功')
      router.push({ name: 'LaborCompanyContract' })
    } catch (error) {
      console.error(error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handlePrint = () => {
  window.print()
}

const handlePreview = (file: any) => {
  previewFile.value = file
  showPreview.value = true
}

const handleDownload = (file: any) => {
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name
  link.click()
}

const isImage = (file: any) => {
  return file.name?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
}

const isPDF = (file: any) => {
  return file.name?.match(/\.pdf$/i)
}

const handleBack = () => {
  router.push({ name: 'LaborCompanyContract' })
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadContractDetail(id)
  } else {
    ElMessage.error('合同ID不存在')
    router.push({ name: 'LaborCompanyContract' })
  }
})
</script>

<style scoped>
.contract-detail-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.info-card {
  margin-bottom: 16px;
}

.info-card:last-child {
  margin-bottom: 0;
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

.amount-text {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
}

.contract-content {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 200px;
  line-height: 1.8;
}

.contract-content :deep(p) {
  margin-bottom: 12px;
}

.contract-content :deep(strong) {
  color: #303133;
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
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: all 0.3s;
}

.attachment-item:hover {
  background-color: #e6f7ff;
}

.attachment-icon {
  font-size: 24px;
  color: #909399;
}

.attachment-name {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.attachment-actions {
  display: flex;
  gap: 8px;
}

.record-content {
  padding: 8px 0;
}

.record-action {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.record-operator {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.record-remark {
  font-size: 12px;
  color: #606266;
}

.preview-container {
  text-align: center;
  min-height: 400px;
}

.preview-container img {
  max-width: 100%;
  max-height: 600px;
  border-radius: 4px;
}

.preview-container iframe {
  width: 100%;
  height: 600px;
  border: none;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #909399;
}

.preview-placeholder .el-icon {
  margin-bottom: 16px;
}

.preview-placeholder p {
  margin: 0;
  font-size: 14px;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
}

@media screen and (max-width: 768px) {
  .detail-content {
    padding: 12px;
  }

  :deep(.el-descriptions) {
    --el-descriptions-table-border: 1px solid #ebeef5;
  }

  :deep(.el-descriptions__cell) {
    padding: 8px;
  }

  .detail-footer {
    left: 0;
    flex-direction: column;
  }

  .detail-footer .el-button {
    width: 100%;
  }
}

@media print {
  .detail-footer {
    display: none !important;
  }

  .info-card {
    box-shadow: none !important;
    border: 1px solid #ebeef5 !important;
  }
}
</style>
