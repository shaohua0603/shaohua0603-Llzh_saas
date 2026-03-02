<template>
  <div class="commission-detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">佣金信息</span>
            <el-tag :type="getStatusType(detailData.status)">
              {{ getStatusText(detailData.status) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="被介绍人">{{ detailData.workerName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ detailData.idCard }}</el-descriptions-item>
          <el-descriptions-item label="工厂">{{ detailData.factory }}</el-descriptions-item>
          <el-descriptions-item label="岗位">{{ detailData.position }}</el-descriptions-item>
          <el-descriptions-item label="进厂日期">{{ detailData.entryDate }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 介绍人信息 -->
      <el-card class="mt-4">
        <template #header>
          <span class="card-title">介绍人信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="介绍人姓名">{{ detailData.referrerName }}</el-descriptions-item>
          <el-descriptions-item label="介绍人手机号">{{ detailData.referrerPhone }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 佣金明细 -->
      <el-card class="mt-4">
        <template #header>
          <span class="card-title">佣金明细</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工作天数">{{ detailData.workDays }}天</el-descriptions-item>
          <el-descriptions-item label="应发佣金">{{ detailData.totalAmount }}元</el-descriptions-item>
          <el-descriptions-item label="已发佣金">{{ detailData.paidAmount }}元</el-descriptions-item>
          <el-descriptions-item label="待发佣金">{{ detailData.pendingAmount }}元</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 发放记录 -->
      <el-card class="mt-4">
        <template #header>
          <div class="card-header">
            <span class="card-title">发放记录</span>
          </div>
        </template>
        <el-table :data="issueRecords" border stripe>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="issueDate" label="发放日期" min-width="160" />
          <el-table-column prop="amount" label="发放金额(元)" min-width="120" />
          <el-table-column prop="issueType" label="发放方式" min-width="120">
            <template #default="{ row }">
              {{ getIssueTypeText(row.issueType) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="150" />
          <el-table-column prop="operator" label="操作人" min-width="100" />
        </el-table>
      </el-card>
    </div>

    <!-- 底部悬浮操作栏 -->
    <div class="detail-footer">
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button type="primary" @click="handleIssue" v-if="detailData.status === 'pending'">
        <el-icon><Money /></el-icon>
        发放佣金
      </el-button>
    </div>

    <!-- 发放对话框 -->
    <el-dialog
      v-model="issueDialogVisible"
      title="佣金发放"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="issueForm" label-width="100px">
        <el-form-item label="被介绍人">
          <span>{{ detailData.workerName }}</span>
        </el-form-item>
        <el-form-item label="介绍人">
          <span>{{ detailData.referrerName }}</span>
        </el-form-item>
        <el-form-item label="待发金额">
          <span style="color: #e6a23c; font-weight: 600">{{ detailData.pendingAmount }}元</span>
        </el-form-item>
        <el-form-item label="发放金额" required>
          <el-input-number
            v-model="issueForm.amount"
            :min="0"
            :max="detailData.pendingAmount || 0"
            :precision="2"
            style="width: 200px"
          />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="发放方式" required>
          <el-select v-model="issueForm.issueType" placeholder="请选择发放方式" style="width: 100%">
            <el-option label="银行卡转账" value="bank_transfer" />
            <el-option label="微信转账" value="wechat" />
            <el-option label="支付宝转账" value="alipay" />
            <el-option label="现金" value="cash" />
          </el-select>
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker
            v-model="issueForm.issueDate"
            type="datetime"
            placeholder="请选择发放时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="issueForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="issueDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitIssue">确定发放</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Money } from '@element-plus/icons-vue'

// 路由
const route = useRoute()
const router = useRouter()

// 详情数据
const detailData = reactive({
  id: '',
  workerName: '',
  phone: '',
  idCard: '',
  factory: '',
  position: '',
  entryDate: '',
  referrerName: '',
  referrerPhone: '',
  workDays: 0,
  totalAmount: 0,
  paidAmount: 0,
  pendingAmount: 0,
  status: ''
})

// 发放记录
const issueRecords = ref<any[]>([])

// 发放对话框
const issueDialogVisible = ref(false)
const issueForm = reactive({
  amount: 0,
  issueType: '',
  issueDate: '',
  remark: ''
})

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    issued: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待发放',
    issued: '已发放'
  }
  return textMap[status] || status
}

// 获取发放方式文本
const getIssueTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    bank_transfer: '银行卡转账',
    wechat: '微信转账',
    alipay: '支付宝转账',
    cash: '现金'
  }
  return textMap[type] || type
}

// 导出
const handleExport = () => {
  ElMessageBox.confirm('确定要导出该佣金记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('导出成功')
  }).catch(() => {})
}

// 发放
const handleIssue = () => {
  issueForm.amount = detailData.pendingAmount
  issueForm.issueType = ''
  issueForm.issueDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
  issueForm.remark = ''
  issueDialogVisible.value = true
}

// 提交发放
const handleSubmitIssue = () => {
  if (!issueForm.issueType) {
    ElMessage.warning('请选择发放方式')
    return
  }
  if (!issueForm.issueDate) {
    ElMessage.warning('请选择发放时间')
    return
  }
  if (issueForm.amount <= 0) {
    ElMessage.warning('请输入正确的发放金额')
    return
  }

  ElMessage.success('发放成功')
  issueDialogVisible.value = false
  loadData()
}

// 加载数据
const loadData = async () => {
  const id = route.params.id as string

  // 模拟加载数据
  const mockData = {
    id: id || '1',
    workerName: '张三',
    phone: '13800138001',
    idCard: '110101199001011234',
    factory: '富士康科技集团',
    position: '操作工',
    entryDate: '2026-01-20',
    referrerName: '李四',
    referrerPhone: '13800138002',
    workDays: 35,
    totalAmount: 1000,
    paidAmount: 500,
    pendingAmount: 500,
    status: 'pending'
  }
  Object.assign(detailData, mockData)

  // 模拟发放记录
  issueRecords.value = [
    {
      issueDate: '2026-02-20 10:00:00',
      amount: 500,
      issueType: 'bank_transfer',
      remark: '第一次发放-进厂30天',
      operator: '管理员'
    }
  ]
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.commission-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
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

.mt-4 {
  margin-top: 16px;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width, 210px);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left 0.3s;
}
</style>
