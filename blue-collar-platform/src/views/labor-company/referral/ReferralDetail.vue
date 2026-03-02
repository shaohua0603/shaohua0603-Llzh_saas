<template>
  <div class="referral-detail-container">
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <div class="header-actions">
        <el-button @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <!-- 被介绍人信息 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">被介绍人信息</span>
            <el-tag :type="getCommissionStatusType(detailData.commissionStatus)">
              {{ getCommissionStatusText(detailData.commissionStatus) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="被介绍人姓名">{{ detailData.workerName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ detailData.idCard }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ detailData.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ detailData.age }}</el-descriptions-item>
          <el-descriptions-item label="学历">{{ detailData.education }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 工作信息 -->
      <el-card class="mt-4">
        <template #header>
          <span class="card-title">工作信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工厂">{{ detailData.factory }}</el-descriptions-item>
          <el-descriptions-item label="岗位">{{ detailData.position }}</el-descriptions-item>
          <el-descriptions-item label="介绍日期">{{ detailData.referralDate }}</el-descriptions-item>
          <el-descriptions-item label="预计进厂日期">{{ detailData.expectedEntryDate }}</el-descriptions-item>
          <el-descriptions-item label="实际进厂日期">{{ detailData.entryDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="薪资模式">{{ getSalaryTypeText(detailData.salaryType) }}</el-descriptions-item>
          <el-descriptions-item label="工作天数">{{ detailData.workDays || 0 }}天</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
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
          <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 佣金信息 -->
      <el-card class="mt-4">
        <template #header>
          <span class="card-title">佣金信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="佣金规则">{{ detailData.commissionRule || '-' }}</el-descriptions-item>
          <el-descriptions-item label="应发佣金">{{ detailData.totalCommission || 0 }}元</el-descriptions-item>
          <el-descriptions-item label="已发佣金">{{ detailData.paidCommission || 0 }}元</el-descriptions-item>
          <el-descriptions-item label="待发佣金">{{ (detailData.totalCommission || 0) - (detailData.paidCommission || 0) }}元</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 佣金发放记录 -->
      <el-card class="mt-4" v-if="commissionRecords.length > 0">
        <template #header>
          <span class="card-title">佣金发放记录</span>
        </template>
        <el-table :data="commissionRecords" border stripe>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="amount" label="发放金额(元)" min-width="120" />
          <el-table-column prop="issueDate" label="发放日期" min-width="120" />
          <el-table-column prop="issueType" label="发放类型" min-width="100" />
          <el-table-column prop="remark" label="备注" min-width="150" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

// 路由
const router = useRouter()
const route = useRoute()

// 详情数据
const detailData = reactive({
  id: '',
  workerName: '',
  phone: '',
  idCard: '',
  gender: '',
  age: 0,
  education: '',
  factory: '',
  position: '',
  referralDate: '',
  expectedEntryDate: '',
  entryDate: '',
  salaryType: '',
  workDays: 0,
  createTime: '',
  referrerName: '',
  referrerPhone: '',
  remark: '',
  commissionRule: '',
  totalCommission: 0,
  paidCommission: 0,
  commissionStatus: ''
})

// 佣金发放记录
const commissionRecords = ref<any[]>([])

// 获取佣金状态类型
const getCommissionStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'info',
    partial: 'warning',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取佣金状态文本
const getCommissionStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待发放',
    partial: '部分发放',
    completed: '已发放完成'
  }
  return textMap[status] || status
}

// 获取薪资模式文本
const getSalaryTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    daily: '日结',
    monthly: '月结'
  }
  return textMap[type] || type
}

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push({ name: 'LaborCompanyReferralEdit', params: { id: detailData.id } })
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该转介绍记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.push({ name: 'LaborCompanyReferral' })
  }).catch(() => {})
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
    gender: '男',
    age: 28,
    education: '高中/中专',
    factory: '富士康科技集团',
    position: '操作工',
    referralDate: '2026-01-15',
    expectedEntryDate: '2026-01-20',
    entryDate: '2026-01-20',
    salaryType: 'monthly',
    workDays: 30,
    createTime: '2026-01-15 10:00:00',
    referrerName: '李四',
    referrerPhone: '13800138002',
    remark: '介绍老乡入职',
    commissionRule: '月结规则-进厂30天发放500元，进厂60天发放500元，进厂90天发放500元',
    totalCommission: 1500,
    paidCommission: 1000,
    commissionStatus: 'partial'
  }
  Object.assign(detailData, mockData)

  // 模拟佣金发放记录
  commissionRecords.value = [
    {
      amount: 500,
      issueDate: '2026-02-20',
      issueType: '第一次发放',
      remark: '进厂30天'
    },
    {
      amount: 500,
      issueDate: '2026-03-22',
      issueType: '第二次发放',
      remark: '进厂60天'
    }
  ]
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.referral-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
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
</style>
