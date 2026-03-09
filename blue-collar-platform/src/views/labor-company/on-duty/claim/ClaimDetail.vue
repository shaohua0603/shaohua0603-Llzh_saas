<template>
  <div class="detail-container">
    <div class="detail-content">
      <el-card class="detail-card" v-loading="loading">
        <div v-if="detailData" class="content">
          <el-descriptions :column="1" border>
            <!-- 基本信息 -->
            <el-descriptions-item label="基本信息" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">理赔人员：</span>
                    <span class="info-value">{{ detailData.workerName }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">手机号：</span>
                    <span class="info-value">{{ detailData.phone }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">保险类型：</span>
                    <span class="info-value">{{ getInsuranceTypeText(detailData.insuranceType) }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <!-- 保单信息 -->
            <el-descriptions-item label="保单信息" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">保单编号：</span>
                    <span class="info-value">{{ detailData.policyNo }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">理赔公司：</span>
                    <span class="info-value">{{ detailData.claimCompany }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">保单已理赔金额：</span>
                    <span class="info-value amount">¥{{ detailData.policyTotalAmount.toFixed(2) }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <!-- 赔付信息 -->
            <el-descriptions-item label="赔付信息" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">已赔付员工金额：</span>
                    <span class="info-value amount">¥{{ detailData.policyPaidAmount.toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">可赔付员工金额：</span>
                    <span class="info-value amount">¥{{ detailData.payableAmount.toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">本次赔付金额：</span>
                    <span class="info-value amount highlight">¥{{ detailData.claimAmount.toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">理赔状态：</span>
                    <el-tag :type="getStatusType(detailData.status)">
                      {{ getStatusText(detailData.status) }}
                    </el-tag>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">赔付日期：</span>
                    <span class="info-value">{{ formatDate(detailData.claimDate) }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <!-- 备注信息 -->
            <el-descriptions-item label="备注信息" :span="1" v-if="detailData.remark">
              <div class="info-item">
                <span class="info-value">{{ detailData.remark }}</span>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-empty v-else description="未找到数据" />
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

// 类型定义
interface ClaimRecord {
  id: string
  workerName: string
  phone: string
  policyNo: string
  insuranceType: string
  claimCompany: string
  policyTotalAmount: number
  policyPaidAmount: number
  employeePaidAmount: number
  payableAmount: number
  claimAmount: number
  status: 'pending' | 'processing' | 'paid' | 'rejected'
  claimDate: string
  remark?: string
}

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const detailData = ref<ClaimRecord | null>(null)

// 所有模拟数据
const allData = ref<ClaimRecord[]>([])

// 生成模拟数据
const generateMockData = (): ClaimRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const companies = ['中国平安', '中国人寿', '太平洋保险', '中华保险', '阳光保险']
  const insuranceTypes = ['employer_liability', 'accident', 'work_injury']
  const statuses: ClaimRecord['status'][] = ['pending', 'processing', 'paid', 'rejected']
  const data: ClaimRecord[] = []

  for (let i = 0; i < 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const insuranceType = insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)]
    const policyTotalAmount = Math.floor(Math.random() * 50000 + 10000)
    const policyPaidAmount = Math.floor(Math.random() * policyTotalAmount * 0.5)
    const employeePaidAmount = Math.floor(Math.random() * 5000 + 1000)
    const payableAmount = Math.floor(Math.random() * 5000 + 1000)
    const claimDate = new Date()
    claimDate.setDate(claimDate.getDate() - Math.floor(Math.random() * 60))

    data.push({
      id: `CLM${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      policyNo: `POL${Date.now()}${Math.floor(Math.random() * 1000)}`,
      insuranceType,
      claimCompany: companies[Math.floor(Math.random() * companies.length)],
      policyTotalAmount,
      policyPaidAmount,
      employeePaidAmount,
      payableAmount,
      claimAmount: Math.floor(Math.random() * 3000 + 500),
      status,
      claimDate: claimDate.toISOString().split('T')[0],
      remark: status === 'rejected' ? '理赔材料不齐全' : ''
    })
  }

  return data
}

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    paid: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    paid: '已赔付',
    rejected: '已驳回'
  }
  return textMap[status] || status
}

// 获取保险类型文本
const getInsuranceTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    employer_liability: '雇主责任险',
    accident: '意外伤害险',
    work_injury: '工伤险'
  }
  return textMap[type] || type
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  return dateStr
}

// 获取详情数据
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('缺少ID参数')
    return
  }

  loading.value = true
  try {
    // 模拟获取数据
    const data = allData.value.find(item => item.id === id)
    if (data) {
      detailData.value = data
    } else {
      ElMessage.error('未找到数据')
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = () => {
  if (!detailData.value) return
  router.push(`/tenant/on-duty/claim/form/${detailData.value.id}`)
}

// 删除
const handleDelete = () => {
  if (!detailData.value) return
  
  ElMessageBox.confirm('确定要删除该理赔记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === detailData.value?.id)
    if (index > -1) {
      allData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
    router.push('/tenant/on-duty/claim')
  }).catch(() => {})
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchDetail()
})
</script>

<style scoped>
/* 详情页容器 - 使用flex布局实现内部滚动 */
.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 内容区域 - 垂直滚动 */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
}

.detail-card {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
}

.content {
  margin-top: 16px;
}

/* 信息项样式 */
.info-item {
  margin-bottom: 8px;
}

.info-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
}

.info-value {
  color: #303133;
  font-weight: 400;
}

.amount {
  font-weight: bold;
  color: #409eff;
}

.amount.highlight {
  color: #e6a23c;
  font-size: 16px;
}

/* 底部按钮栏 - 固定悬浮 */
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

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
  
  .detail-content {
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }
  
  .detail-card {
    max-width: 100%;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-label {
    margin-bottom: 4px;
  }
}
</style>