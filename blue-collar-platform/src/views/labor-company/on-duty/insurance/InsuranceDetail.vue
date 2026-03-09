<template>
  <div class="detail-container">
    <div class="detail-content">
      <el-card class="detail-card" v-loading="loading">

        
        <div v-if="insuranceData" class="detail-info">
          <!-- 基本信息 -->
          <el-descriptions :column="2" border class="mb-4">
            <el-descriptions-item label="保单编号">{{ insuranceData.policyNo }}</el-descriptions-item>
            <el-descriptions-item label="保单类型">
              <el-tag type="primary">雇主责任险</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="购买日期">{{ insuranceData.purchaseDate }}</el-descriptions-item>
            <el-descriptions-item label="生效日期">{{ insuranceData.effectiveDate }}</el-descriptions-item>
            <el-descriptions-item label="失效日期">{{ insuranceData.expiryDate }}</el-descriptions-item>
            <el-descriptions-item label="理赔公司">{{ insuranceData.claimCompany }}</el-descriptions-item>
            <el-descriptions-item label="购买人数">{{ insuranceData.personCount }} 人</el-descriptions-item>
            <el-descriptions-item label="单价">{{ formatMoney(insuranceData.unitPrice) }} 元</el-descriptions-item>
            <el-descriptions-item label="保费">{{ formatMoney(insuranceData.premium) }} 元</el-descriptions-item>
          </el-descriptions>
          
          <!-- 保险金额明细 -->
          <div class="mb-4">
            <h4 class="section-title">保险金额明细</h4>
            <el-table :data="insuranceData.insuranceAmountList" style="width: 100%" border>
              <el-table-column prop="insuranceType" label="保险类型" width="180">
                <template #default="scope">
                  {{ getInsuranceTypeName(scope.row.insuranceType) }}
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="保险金额(元)">
                <template #default="scope">
                  {{ formatMoney(scope.row.amount) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-empty v-else description="暂无保险信息" class="mt-4" />
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="success" @click="handleEdit">
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
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const insuranceData = ref<any>(null)

// 类型定义
interface InsuranceAmountItem {
  insuranceType: string
  amount: number
}

interface InsuranceRecord {
  id: string
  policyNo: string
  policyType: string
  purchaseDate: string
  effectiveDate: string
  expiryDate: string
  claimCompany: string
  personCount: number
  unitPrice: number
  premium: number
  insuranceAmountList: InsuranceAmountItem[]
}

// 模拟数据存储
const allData = ref<InsuranceRecord[]>([])

// 生成模拟数据
const generateMockData = (): InsuranceRecord[] => {
  const data: InsuranceRecord[] = [
    {
      id: '1',
      policyNo: 'POL202401010001',
      policyType: 'employer_liability',
      purchaseDate: '2024-01-01',
      effectiveDate: '2024-01-02',
      expiryDate: '2025-01-01',
      claimCompany: '中国平安保险',
      personCount: 50,
      unitPrice: 500,
      premium: 25000,
      insuranceAmountList: [
        {
          insuranceType: 'accident',
          amount: 50000
        },
        {
          insuranceType: 'medical',
          amount: 30000
        },
        {
          insuranceType: 'death_disability',
          amount: 20000
        }
      ]
    },
    {
      id: '2',
      policyNo: 'POL202401150002',
      policyType: 'employer_liability',
      purchaseDate: '2024-01-15',
      effectiveDate: '2024-01-16',
      expiryDate: '2025-01-15',
      claimCompany: '中国人寿保险',
      personCount: 30,
      unitPrice: 600,
      premium: 18000,
      insuranceAmountList: [
        {
          insuranceType: 'accident',
          amount: 70000
        },
        {
          insuranceType: 'medical',
          amount: 50000
        },
        {
          insuranceType: 'death_disability',
          amount: 30000
        }
      ]
    },
    {
      id: '3',
      policyNo: 'POL202402010003',
      policyType: 'employer_liability',
      purchaseDate: '2024-02-01',
      effectiveDate: '2024-02-02',
      expiryDate: '2025-02-01',
      claimCompany: '太平洋保险',
      personCount: 20,
      unitPrice: 450,
      premium: 9000,
      insuranceAmountList: [
        {
          insuranceType: 'accident',
          amount: 40000
        },
        {
          insuranceType: 'medical',
          amount: 30000
        },
        {
          insuranceType: 'death_disability',
          amount: 10000
        }
      ]
    }
  ]
  return data
}

// 获取保险类型名称
const getInsuranceTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    accident: '意外伤害',
    medical: '医疗费用',
    death_disability: '身故/伤残'
  }
  return typeMap[type] || type
}

// 格式化金额
const formatMoney = (value: number): string => {
  if (!value) return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 模拟获取保险详情
const fetchInsuranceDetail = async () => {
  loading.value = true
  try {
    // 实际项目中这里应该调用API
    // const response = await insuranceService.getInsuranceById(route.params.id as string)
    // insuranceData.value = response.data
    
    // 模拟数据
    const mockData = allData.value.find(item => item.id === route.params.id)
    if (mockData) {
      insuranceData.value = mockData
    } else {
      // 如果找不到，使用默认数据
      insuranceData.value = {
        id: route.params.id as string,
        policyNo: 'POL202401010001',
        policyType: 'employer_liability',
        purchaseDate: '2024-01-01',
        effectiveDate: '2024-01-02',
        expiryDate: '2025-01-01',
        claimCompany: '中国平安保险',
        personCount: 50,
        unitPrice: 500,
        premium: 25000,
        insuranceAmountList: [
          {
            insuranceType: 'accident',
            amount: 50000
          },
          {
            insuranceType: 'medical',
            amount: 30000
          },
          {
            insuranceType: 'death_disability',
            amount: 20000
          }
        ]
      }
    }
  } catch (error) {
    ElMessage.error('获取保险详情失败')
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/on-duty/insurance/form/${route.params.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该保险记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API
    // await insuranceService.deleteInsurance(route.params.id as string)
    
    // 模拟删除成功
    ElMessage.success('删除成功')
    goBack()
  }).catch(() => {})
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/insurance')
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchInsuranceDetail()
})
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-info {
  padding: 0 16px;
}

.mb-4 {
  margin-bottom: 20px;
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