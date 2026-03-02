<template>
  <div class="labor-company-warning-detail">
    <div class="detail-container">
      <!-- 基本信息 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <div class="status-tags">
              <el-tag :type="getLevelType(warningDetail.level)">
                {{ getLevelText(warningDetail.level) }}
              </el-tag>
              <el-tag :type="getStatusType(warningDetail.status)">
                {{ getStatusText(warningDetail.status) }}
              </el-tag>
            </div>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="预警编号">{{ warningDetail.warningNo }}</el-descriptions-item>
          <el-descriptions-item label="预警类型">
            <el-tag type="info">{{ getTypeText(warningDetail.type) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="预警标题" :span="2">{{ warningDetail.title }}</el-descriptions-item>
          <el-descriptions-item label="预警级别">
            <el-tag :type="getLevelType(warningDetail.level)">
              {{ getLevelText(warningDetail.level) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="getStatusType(warningDetail.status)">
              {{ getStatusText(warningDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="涉及部门">{{ warningDetail.department }}</el-descriptions-item>
          <el-descriptions-item label="预警时间">{{ warningDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ warningDetail.processor || '-' }}</el-descriptions-item>
          <el-descriptions-item label="处理时间">{{ warningDetail.processTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 预警内容 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <span>预警内容</span>
        </template>
        <div class="warning-content">
          <p>{{ warningDetail.content }}</p>
        </div>
      </el-card>

      <!-- 处理记录 -->
      <el-card v-if="warningDetail.status !== 'pending'" class="detail-card" shadow="never">
        <template #header>
          <span>处理记录</span>
        </template>
        <el-timeline>
          <el-timeline-item
            :timestamp="warningDetail.createTime"
            placement="top"
            type="primary"
          >
            <div class="record-content">
              <div class="record-title">预警生成</div>
              <div class="record-desc">系统自动生成预警</div>
            </div>
          </el-timeline-item>
          <el-timeline-item
            v-if="warningDetail.status !== 'pending'"
            :timestamp="warningDetail.processTime"
            placement="top"
            type="success"
          >
            <div class="record-content">
              <div class="record-title">预警处理</div>
              <div class="record-desc">处理人: {{ warningDetail.processor }}</div>
              <div v-if="warningDetail.processRemark" class="record-desc">处理说明: {{ warningDetail.processRemark }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- 操作按钮 -->
      <div v-if="canProcess" class="action-buttons">
        <el-button type="primary" size="large" @click="handleProcess">
          <el-icon><Check /></el-icon>
          处理预警
        </el-button>
        <el-button
          v-if="warningDetail.status === 'pending'"
          type="warning"
          size="large"
          @click="handleIgnore"
        >
          <el-icon><Close /></el-icon>
          忽略预警
        </el-button>
        <el-button
          v-if="warningDetail.businessType && warningDetail.businessId"
          type="success"
          size="large"
          @click="handleViewBusinessDetail"
        >
          <el-icon><View /></el-icon>
          查看业务详情
        </el-button>
      </div>
      <div v-else class="action-buttons">
        <el-button
          v-if="warningDetail.businessType && warningDetail.businessId"
          type="primary"
          size="large"
          @click="handleViewBusinessDetail"
        >
          <el-icon><View /></el-icon>
          查看业务详情
        </el-button>
      </div>
    </div>

    <!-- 处理预警对话框 -->
    <el-dialog
      v-model="processVisible"
      title="处理预警"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="processForm" label-width="100px">
        <el-form-item label="处理结果" required>
          <el-radio-group v-model="processForm.result">
            <el-radio label="resolved">
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
              已处理
            </el-radio>
            <el-radio label="processing">
              <el-icon color="#e6a23c"><Warning /></el-icon>
              处理中
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明" required>
          <el-input
            v-model="processForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitProcess">提交</el-button>
      </template>
    </el-dialog>

    <!-- 忽略预警对话框 -->
    <el-dialog
      v-model="ignoreVisible"
      title="忽略预警"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="ignoreForm" label-width="100px">
        <el-form-item label="忽略原因" required>
          <el-input
            v-model="ignoreForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入忽略原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ignoreVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitIgnore">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Check,
  Close,
  Back,
  View,
  CircleCheck,
  Warning
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const warningId = route.params.id as string

// 预警详情
const warningDetail = ref<any>({
  id: 1,
  warningNo: 'WRN202602250001',
  title: '生产部工人数量不足',
  type: 'worker_count',
  level: 'critical',
  status: 'pending',
  department: '生产部',
  createTime: '2026-02-25 08:00:00',
  processTime: '',
  processor: '',
  processRemark: '',
  content: '生产部当前工人数量为50人,低于最低配置60人,请及时补充工人。当前生产任务较重,工人短缺可能影响生产进度,建议尽快招聘或调配工人。',
  businessType: 'worker',
  businessId: '1'
})

// 是否可以处理
const canProcess = computed(() => {
  return warningDetail.value.status === 'pending' || warningDetail.value.status === 'processing'
})

// 处理预警对话框
const processVisible = ref(false)

// 忽略预警对话框
const ignoreVisible = ref(false)

// 处理表单
const processForm = reactive({
  result: 'resolved',
  remark: ''
})

// 忽略表单
const ignoreForm = reactive({
  reason: ''
})

// 返回
const goBack = () => {
  router.back()
}

// 处理预警
const handleProcess = () => {
  processForm.result = 'resolved'
  processForm.remark = ''
  processVisible.value = true
}

// 忽略预警
const handleIgnore = () => {
  ignoreForm.reason = ''
  ignoreVisible.value = true
}

// 提交处理
const handleSubmitProcess = () => {
  if (!processForm.remark) {
    ElMessage.warning('请输入处理说明')
    return
  }

  ElMessageBox.confirm('确定要提交处理结果吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      warningDetail.value.status = processForm.result
      warningDetail.value.processTime = new Date().toLocaleString('zh-CN')
      warningDetail.value.processor = '当前用户'
      warningDetail.value.processRemark = processForm.remark
      ElMessage.success('处理成功')
      processVisible.value = false
    }, 500)
  }).catch(() => {})
}

// 提交忽略
const handleSubmitIgnore = () => {
  if (!ignoreForm.reason) {
    ElMessage.warning('请输入忽略原因')
    return
  }

  ElMessageBox.confirm('确定要忽略这条预警吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      warningDetail.value.status = 'ignored'
      warningDetail.value.processTime = new Date().toLocaleString('zh-CN')
      warningDetail.value.processor = '当前用户'
      warningDetail.value.processRemark = ignoreForm.reason
      ElMessage.success('已忽略该预警')
      ignoreVisible.value = false
    }, 500)
  }).catch(() => {})
}

// 查看业务详情
const handleViewBusinessDetail = () => {
  // 根据业务类型跳转到对应的业务详情页
  const businessType = warningDetail.value.businessType
  const businessId = warningDetail.value.businessId

  switch (businessType) {
    case 'worker':
      router.push(`/labor-company/workers`)
      break
    case 'contract':
      router.push(`/labor-company/contract-detail/${businessId}`)
      break
    case 'attendance':
      router.push(`/labor-company/attendance`)
      break
    case 'production':
      router.push(`/labor-company/production`)
      break
    default:
      ElMessage.info('暂无业务详情页')
  }
}

// 获取级别类型
const getLevelType = (level: string) => {
  const typeMap: Record<string, string> = {
    critical: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'info'
  }
  return typeMap[level] || 'info'
}

// 获取级别文本
const getLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    critical: '紧急',
    high: '重要',
    medium: '一般',
    low: '提示'
  }
  return textMap[level] || '未知'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'danger',
    processing: 'warning',
    resolved: 'success',
    ignored: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '未处理',
    processing: '处理中',
    resolved: '已处理',
    ignored: '已忽略'
  }
  return textMap[status] || '未知'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    worker_count: '工人数量预警',
    contract_expire: '合同到期预警',
    attendance_abnormal: '考勤异常预警',
    production_progress: '生产进度预警',
    other: '其他预警'
  }
  return textMap[type] || '未知'
}

// 获取预警详情
const fetchWarningDetail = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 实际项目中这里应该调用API获取详情数据
  } catch (error) {
    ElMessage.error('获取预警详情失败')
  }
}

// 生命周期
onMounted(() => {
  fetchWarningDetail()
})
</script>

<style scoped>
.labor-company-warning-detail {
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

.status-tags {
  display: flex;
  gap: 8px;
}

.warning-content {
  padding: 16px;
  background-color: #fef0f0;
  border-left: 4px solid #f56c6c;
  border-radius: 4px;
  line-height: 1.8;
  color: #606266;
}

.warning-content p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.record-content {
  padding: 8px 0;
}

.record-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.record-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
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
  .labor-company-warning-detail {
    padding: 10px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
