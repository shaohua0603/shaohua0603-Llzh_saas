<template>
  <div class="form-container">
    <div class="form-content">
      <el-card class="form-card" v-loading="loading">

        <el-form
          :model="formData"
          :rules="formRules"
          ref="formRef"
          label-width="120px"
          class="insurance-form"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="保单编号" prop="policyNo">
                <el-input v-model="formData.policyNo" placeholder="请输入保单编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保单类型" prop="policyType">
                <el-select v-model="formData.policyType" placeholder="请选择保单类型" style="width: 100%">
                  <el-option label="雇主责任险" value="employer_liability" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="购买日期" prop="purchaseDate">
                <el-date-picker
                  v-model="formData.purchaseDate"
                  type="date"
                  placeholder="选择购买日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生效日期" prop="effectiveDate">
                <el-date-picker
                  v-model="formData.effectiveDate"
                  type="date"
                  placeholder="选择生效日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="失效日期" prop="expiryDate">
                <el-date-picker
                  v-model="formData.expiryDate"
                  type="date"
                  placeholder="选择失效日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="理赔公司" prop="claimCompany">
                <el-input v-model="formData.claimCompany" placeholder="请输入理赔公司" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参保人数上限" prop="personCount">
                <el-input-number v-model="formData.personCount" :min="0" :max="99999" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单价" prop="unitPrice">
                <el-input-number v-model="formData.unitPrice" :min="0" :precision="2" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="保费" prop="premium">
                <el-input-number v-model="formData.premium" :min="0" :precision="2" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <!-- 保险金额列表 -->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="保险金额明细">
                <el-table :data="insuranceAmountList" style="width: 100%" border>
                  <el-table-column prop="insuranceType" label="保险类型" width="180">
                    <template #default="scope">
                      <el-select v-model="scope.row.insuranceType" placeholder="请选择" style="width: 100%">
                        <el-option label="意外伤害" value="accident" />
                        <el-option label="医疗费用" value="medical" />
                        <el-option label="身故/伤残" value="death_disability" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="amount" label="保险金额(元)">
                    <template #default="scope">
                      <el-input-number v-model="scope.row.amount" :min="0" :precision="2" style="width: 100%" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template #default="scope">
                      <el-button type="danger" size="small" @click="removeInsuranceAmount(scope.$index)">
                        <el-icon><Delete /></el-icon>
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button type="primary" @click="addInsuranceAmount" style="margin-top: 10px">
                  <el-icon><Plus /></el-icon>
                  添加保险金额
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        <el-icon><Check /></el-icon>
        {{ isEdit ? '保存' : '提交' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const formRef = ref<any>(null)
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)

const formData = reactive({
  id: '',
  policyNo: '',
  policyType: 'employer_liability',
  purchaseDate: '',
  effectiveDate: '',
  expiryDate: '',
  claimCompany: '',
  personCount: 0,
  unitPrice: 0,
  premium: 0
})

// 保险金额列表
const insuranceAmountList = ref([
  {
    insuranceType: 'accident',
    amount: 0
  }
])

const formRules = {
  policyNo: [{ required: true, message: '请输入保单编号', trigger: 'blur' }],
  policyType: [{ required: true, message: '请选择保单类型', trigger: 'change' }],
  purchaseDate: [{ required: true, message: '请选择购买日期', trigger: 'change' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  expiryDate: [{ required: true, message: '请选择失效日期', trigger: 'change' }],
  claimCompany: [{ required: true, message: '请输入理赔公司', trigger: 'blur' }],
  personCount: [{ required: true, message: '请输入参保人数上限', trigger: 'blur' }],
  unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  premium: [{ required: true, message: '请输入保费', trigger: 'blur' }]
}

// 添加保险金额
const addInsuranceAmount = () => {
  insuranceAmountList.value.push({
    insuranceType: '',
    amount: 0
  })
}

// 删除保险金额
const removeInsuranceAmount = (index: number) => {
  insuranceAmountList.value.splice(index, 1)
}

// 模拟获取保险详情
const fetchInsuranceDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 实际项目中这里应该调用 API
    // const response = await insuranceService.getInsuranceById(route.params.id as string)
    // formData = { ...response.data }
    
    // 模拟数据
    formData.id = route.params.id as string
    formData.policyNo = 'POL202401010001'
    formData.policyType = 'employer_liability'
    formData.purchaseDate = '2024-01-01'
    formData.effectiveDate = '2024-01-02'
    formData.expiryDate = '2025-01-01'
    formData.claimCompany = '中国平安保险'
    formData.personCount = 50
    formData.unitPrice = 500
    formData.premium = 25000
    
    // 模拟保险金额列表数据
    insuranceAmountList.value = [
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
  } catch (error) {
    ElMessage.error('获取保险详情失败')
  } finally {
    loading.value = false
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    loading.value = true
    // 实际项目中这里应该调用 API
    // if (isEdit.value) {
    //   await insuranceService.updateInsurance(formData)
    // } else {
    //   await insuranceService.createInsurance(formData)
    // }
    
    // 模拟提交成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    goBack()
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/insurance')
}

// 生命周期
onMounted(() => {
  fetchInsuranceDetail()
})
</script>

<style scoped>
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.form-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.insurance-form {
  max-width: 800px;
}

.form-footer {
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
  .form-footer {
    left: 0;
    flex-direction: column;
  }
  
  .form-footer .el-button {
    width: 100%;
  }
  
  .form-content {
    padding-bottom: 120px;
  }
}
</style>