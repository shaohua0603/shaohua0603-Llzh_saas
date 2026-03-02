<template>
  <div class="settlement-detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">基本信息</span>
            <el-tag :type="getStatusType(detailData.status)">
              {{ getStatusText(detailData.status) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="发放年月">{{ detailData.issueMonth }}</el-descriptions-item>
          <el-descriptions-item label="工厂">{{ detailData.factory }}</el-descriptions-item>
          <el-descriptions-item label="发放时间">{{ detailData.issueDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="发放说明" :span="3">{{ detailData.issueDescription }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="发放人数">{{ detailData.workerCount }}人</el-descriptions-item>
          <el-descriptions-item label="发放总额">{{ detailData.totalAmount }}元</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 发放工资人员清单 -->
      <el-card class="mt-4">
        <template #header>
          <div class="card-header">
            <span class="card-title">发放工资人员清单</span>
            <el-button type="primary" size="small" @click="handleExportList">导出清单</el-button>
          </div>
        </template>
        <el-table :data="workerList" border stripe show-summary>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="workerName" label="姓名" min-width="100" />
          <el-table-column prop="phone" label="手机号" min-width="120" />
          <el-table-column prop="idCard" label="身份证号" min-width="180" />
          <el-table-column prop="bankName" label="开户行" min-width="150" />
          <el-table-column prop="bankAccount" label="银行账号" min-width="180" />
          <el-table-column prop="workDays" label="工作天数" min-width="100" />
          <el-table-column prop="baseSalary" label="基本工资(元)" min-width="120" />
          <el-table-column prop="overtimePay" label="加班费(元)" min-width="100" />
          <el-table-column prop="performanceBonus" label="绩效奖(元)" min-width="100" />
          <el-table-column prop="allowance" label="补贴(元)" min-width="100" />
          <el-table-column prop="deductions" label="扣款(元)" min-width="100" />
          <el-table-column prop="netSalary" label="实发工资(元)" min-width="120" />
          <el-table-column prop="status" label="发放状态" min-width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'issued' ? 'success' : 'warning'">
                {{ row.status === 'issued' ? '已发放' : '待发放' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 底部悬浮操作栏 -->
    <div class="detail-footer">
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button @click="handlePrint">
        <el-icon><Printer /></el-icon>
        打印
      </el-button>
      <el-button type="primary" @click="handleBatchIssue">
        <el-icon><Money /></el-icon>
        批量发放
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Download, Printer, Money } from '@element-plus/icons-vue'

// 路由
const router = useRouter()
const route = useRoute()

// 详情数据
const detailData = reactive({
  id: '',
  issueMonth: '',
  factory: '',
  issueDate: '',
  issueDescription: '',
  workerCount: 0,
  totalAmount: 0,
  status: '',
  createTime: ''
})

// 工人清单
const workerList = ref<any[]>([])

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    partial: 'warning',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待发放',
    partial: '部分发放',
    completed: '已发放完成'
  }
  return textMap[status] || status
}

// 返回
const handleBack = () => {
  router.back()
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 打印
const handlePrint = () => {
  ElMessage.info('打印功能开发中')
}

// 批量发放
const handleBatchIssue = () => {
  ElMessageBox.confirm('确定要批量发放该结算记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量发放成功')
  }).catch(() => {})
}

// 导出清单
const handleExportList = () => {
  ElMessageBox.confirm('确定要导出该结算记录的发放清单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('导出清单成功')
  }).catch(() => {})
}

// 加载数据
const loadData = async () => {
  const id = route.params.id as string
  // 模拟加载数据
  const mockData = {
    id: id || '1',
    issueMonth: '2026-01',
    factory: '富士康科技集团',
    issueDate: '2026-02-05',
    issueDescription: '2026年1月份工资结算',
    workerCount: 150,
    totalAmount: 825000,
    status: 'completed',
    createTime: '2026-02-01 10:00:00'
  }
  Object.assign(detailData, mockData)

  // 模拟工人清单数据
  workerList.value = [
    {
      workerName: '张三',
      phone: '13800138001',
      idCard: '110101199001011234',
      bankName: '中国工商银行',
      bankAccount: '6222021234567890',
      workDays: 30,
      baseSalary: 4000,
      overtimePay: 800,
      performanceBonus: 500,
      allowance: 300,
      deductions: 200,
      netSalary: 5400,
      status: 'issued'
    },
    {
      workerName: '李四',
      phone: '13800138002',
      idCard: '110101199002021234',
      bankName: '中国农业银行',
      bankAccount: '6222021234567891',
      workDays: 28,
      baseSalary: 3800,
      overtimePay: 600,
      performanceBonus: 400,
      allowance: 200,
      deductions: 150,
      netSalary: 4850,
      status: 'issued'
    },
    {
      workerName: '王五',
      phone: '13800138003',
      idCard: '110101199003031234',
      bankName: '中国建设银行',
      bankAccount: '6222021234567892',
      workDays: 31,
      baseSalary: 4200,
      overtimePay: 900,
      performanceBonus: 600,
      allowance: 300,
      deductions: 180,
      netSalary: 5820,
      status: 'issued'
    }
  ]
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.settlement-detail-container {
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-section .el-card {
  border-radius: 4px;
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
