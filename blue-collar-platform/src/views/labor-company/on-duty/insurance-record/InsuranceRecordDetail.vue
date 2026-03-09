<template>
  <div class="detail-container">
    <div class="detail-content">
      <el-card class="detail-card" v-loading="loading">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border class="mb-4">
          <el-descriptions-item label="保单编号">{{ insuranceRecord.policyNo }}</el-descriptions-item>
          <el-descriptions-item label="保单类型">{{ getPolicyTypeName(insuranceRecord.policyType) }}</el-descriptions-item>
          <el-descriptions-item label="购买日期">{{ insuranceRecord.purchaseDate }}</el-descriptions-item>
          <el-descriptions-item label="生效日期">{{ insuranceRecord.effectiveDate }}</el-descriptions-item>
          <el-descriptions-item label="失效日期">{{ insuranceRecord.expiryDate }}</el-descriptions-item>
          <el-descriptions-item label="理赔公司">{{ insuranceRecord.claimCompany }}</el-descriptions-item>
          <el-descriptions-item label="参保人数上限">{{ insuranceRecord.personCount }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ insuranceRecord.unitPrice }}</el-descriptions-item>
          <el-descriptions-item label="保费">{{ insuranceRecord.premium }}</el-descriptions-item>
        </el-descriptions>
        
        <!-- 参保人员清单 -->
        <div class="mb-4">
          <h4 class="section-title">参保人员清单</h4>
          <el-table :data="insuranceRecord.workerList" style="width: 100%">
            <el-table-column prop="name" label="姓名" min-width="100" />
            <el-table-column prop="phone" label="手机号" min-width="120" />
            <el-table-column prop="age" label="年龄" min-width="80" />
            <el-table-column prop="workerId" label="工号" min-width="100" />
            <el-table-column prop="idCard" label="证件号" min-width="150" />
            <el-table-column prop="gender" label="性别" min-width="80">
              <template #default="{ row }">
                {{ row.gender === 'male' ? '男' : '女' }}
              </template>
            </el-table-column>
            <el-table-column prop="paymentType" label="结算方式" min-width="100">
              <template #default="{ row }">
                <el-tag :type="row.paymentType === 'daily' ? 'warning' : 'success'" size="small">
                  {{ row.paymentType === 'daily' ? '日结' : '月结' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

// 初始化页面
onMounted(() => {
  fetchInsuranceRecordDetail()
})

interface WorkerItem {
  id: string;
  name: string;
  phone: string;
  age: number;
  workerId: string;
  idCard: string;
  gender: string;
  paymentType: 'daily' | 'monthly';
}

const insuranceRecord = ref({
  id: '',
  policyNo: '',
  policyType: '',
  purchaseDate: '',
  effectiveDate: '',
  expiryDate: '',
  claimCompany: '',
  personCount: 0,
  unitPrice: 0,
  premium: 0,
  workerList: [] as WorkerItem[]
})

// 获取保单类型名称
const getPolicyTypeName = (type: string) => {
  const policyTypeMap: Record<string, string> = {
    'employer_liability': '雇主责任险'
  }
  return policyTypeMap[type] || type
}



// 模拟获取参保登记详情
const fetchInsuranceRecordDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('参保登记ID不能为空')
    return
  }
  
  loading.value = true
  try {
    // 实际项目中这里应该调用 API
    // const response = await insuranceRecordService.getInsuranceRecordById(id)
    // insuranceRecord.value = response.data
    
    // 模拟数据
    insuranceRecord.value = {
      id: id,
      policyNo: 'POL202401010001',
      policyType: 'employer_liability',
      purchaseDate: '2024-01-01',
      effectiveDate: '2024-01-02',
      expiryDate: '2025-01-01',
      claimCompany: '中国平安保险',
      personCount: 5,
      unitPrice: 500,
      premium: 2500,
      workerList: [
        { id: '1', name: '张三', workerId: 'W20240101', idCard: '110101199001011234', phone: '13800138000', age: 25, gender: 'male', paymentType: 'daily' },
        { id: '2', name: '李四', workerId: 'W20240102', idCard: '110101199001011235', phone: '13800138001', age: 28, gender: 'male', paymentType: 'monthly' },
        { id: '3', name: '王五', workerId: 'W20240103', idCard: '110101199001011236', phone: '13800138002', age: 22, gender: 'female', paymentType: 'daily' },
        { id: '4', name: '赵六', workerId: 'W20240104', idCard: '110101199001011237', phone: '13800138003', age: 30, gender: 'male', paymentType: 'monthly' },
        { id: '5', name: '钱七', workerId: 'W20240105', idCard: '110101199001011238', phone: '13800138004', age: 26, gender: 'female', paymentType: 'daily' }
      ]
    }
  } catch (error) {
    ElMessage.error('获取参保登记详情失败')
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/on-duty/insurance-record/edit/${insuranceRecord.value.id}`)
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/insurance-record')
}


</script>

<style scoped>
.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.detail-card {
  margin-bottom: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
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
  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
  
  .detail-content {
    padding-bottom: 120px;
  }
}
</style>