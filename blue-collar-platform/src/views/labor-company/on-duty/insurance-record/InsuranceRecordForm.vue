<template>
  <div class="form-container">
    <div class="form-content">
      <el-card class="form-card" v-loading="loading">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="保单编号" prop="policyNo">
                    <el-input 
                      v-model="formData.policyNo" 
                      placeholder="请选择保单编号" 
                      readonly
                      style="width: 100%"
                    />
                    <el-button 
                      type="primary" 
                      style="margin-left: 10px" 
                      @click="openPolicyDialog"
                    >
                      选择
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保单类型" prop="policyType">
                    <el-select v-model="formData.policyType" placeholder="请选择保单类型" style="width: 100%" disabled>
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
                      disabled
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
                      disabled
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
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="理赔公司" prop="claimCompany">
                    <el-input v-model="formData.claimCompany" placeholder="请输入理赔公司" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="参保人数上限" prop="personCount">
                    <el-input-number v-model="formData.personCount" :min="0" :max="99999" style="width: 100%" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单价" prop="unitPrice">
                    <el-input-number v-model="formData.unitPrice" :min="0" :precision="2" style="width: 100%" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="保费" prop="premium">
                    <el-input-number v-model="formData.premium" :min="0" :precision="2" style="width: 100%" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="参保人员清单">
                    <div class="worker-list-toolbar">
                      <el-button type="primary" size="small" @click="openWorkerSelectDialog">
                        <el-icon><Plus /></el-icon>
                        添加人员
                      </el-button>
                      <el-button type="danger" size="small" :disabled="formData.workerList.length === 0" @click="clearAllWorkers">
                        清空人员
                      </el-button>
                    </div>
                    <el-table :data="formData.workerList" style="width: 100%">
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
                      <el-table-column label="操作" width="80">
                        <template #default="{ $index }">
                          <el-button link type="danger" size="small" @click="removeWorker($index)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    
    <!-- 保单选择弹窗 -->
    <el-dialog
      v-model="policyDialogVisible"
      title="选择保单"
      width="800px"
    >
      <el-table
        :data="policyList"
        style="width: 100%"
        @row-click="handlePolicyRowClick"
        highlight-current-row
      >
        <el-table-column prop="policyNo" label="保单编号" width="180" />
        <el-table-column prop="policyType" label="保单类型" width="120">
          <template #default="{ row }">
            <el-tag type="primary">雇主责任险</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="claimCompany" label="理赔公司" width="150" />
        <el-table-column prop="personCount" label="参保人数上限" width="120" />
        <el-table-column label="已参保人数" width="120">
          <template #default="{ row }">
            {{ row.insuredCount || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="purchaseDate" label="购买日期" width="120" />
        <el-table-column prop="effectiveDate" label="生效日期" width="120" />
        <el-table-column prop="expiryDate" label="失效日期" width="120" />
      </el-table>
      <template #footer>
        <el-button @click="policyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPolicySelection" :disabled="!selectedPolicy">确定</el-button>
      </template>
    </el-dialog>
    
    <!-- 工人选择对话框 -->
    <WorkerSelectDialog
      v-model:visible="workerSelectDialogVisible"
      title="选择参保人员"
      multiple
      @confirm="handleWorkerSelectConfirm"
      @cancel="handleWorkerSelectCancel"
    />
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
        <el-icon><Check /></el-icon>
        {{ isEdit ? '保存' : '提交' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check, Plus } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import WorkerSelectDialog from '@/components/WorkerSelectDialog.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref<any>(null)
const loading = ref(false)
const submitLoading = ref(false)
const activeTab = ref('basic')

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
  premium: 0,
  workerList: [] as any[],

})

// 保单列表
const policyList = ref<any[]>([])
// 保单选择弹窗控制
const policyDialogVisible = ref(false)
// 选中的保单
const selectedPolicy = ref<any>(null)

// 工人选择对话框
const workerSelectDialogVisible = ref(false)

// 模拟获取保单列表
const fetchPolicyList = async () => {
  try {
    // 实际项目中这里应该调用 API
    // const response = await insuranceService.getInsuranceList()
    // policyList.value = response.data
    
    // 模拟数据
    policyList.value = [
      {
        id: '1',
        policyNo: 'POL202401010001',
        policyType: 'employer_liability',
        purchaseDate: '2024-01-01',
        effectiveDate: '2024-01-02',
        expiryDate: '2025-01-01',
        claimCompany: '中国平安保险',
        personCount: 50,
        insuredCount: 25,
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
        insuredCount: 10,
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
        insuredCount: 5,
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
  } catch (error) {
    ElMessage.error('获取保单列表失败')
  }
}

// 打开保单选择弹窗
const openPolicyDialog = () => {
  selectedPolicy.value = null
  policyDialogVisible.value = true
}

// 处理表格行点击
const handlePolicyRowClick = (row: any) => {
  selectedPolicy.value = row
}

// 确认选择保单
const confirmPolicySelection = () => {
  if (selectedPolicy.value) {
    const policy = selectedPolicy.value
    formData.policyNo = policy.policyNo
    formData.policyType = policy.policyType
    formData.purchaseDate = policy.purchaseDate
    formData.effectiveDate = policy.effectiveDate
    formData.expiryDate = policy.expiryDate
    formData.claimCompany = policy.claimCompany
    formData.unitPrice = policy.unitPrice
    
    // 关闭弹窗
    policyDialogVisible.value = false
  }
}

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

// 打开工人选择对话框
const openWorkerSelectDialog = () => {
  workerSelectDialogVisible.value = true
}

// 处理工人选择确认
const handleWorkerSelectConfirm = (selectedWorkers: any[]) => {
  // 过滤掉已经存在的工人
  const existingWorkerIds = new Set(formData.workerList.map(worker => worker.id))
  const newWorkers = selectedWorkers.filter(worker => !existingWorkerIds.has(worker.id))
  
  // 添加新选择的工人
  formData.workerList = [...formData.workerList, ...newWorkers]
  
  // 更新参保人数上限
  formData.personCount = formData.workerList.length
  // 自动计算保费
  formData.premium = formData.personCount * formData.unitPrice
}

// 处理工人选择取消
const handleWorkerSelectCancel = () => {
  // 取消选择，无需处理
}

// 删除人员
const removeWorker = (index: number) => {
  formData.workerList.splice(index, 1)
  // 更新参保人数上限
  formData.personCount = formData.workerList.length
  // 自动计算保费
  formData.premium = formData.personCount * formData.unitPrice
}

// 清空所有人员
const clearAllWorkers = () => {
  formData.workerList = []
  // 更新参保人数上限
  formData.personCount = 0
  // 自动计算保费
  formData.premium = 0
}



// 模拟获取参保登记详情
const fetchInsuranceRecordDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 实际项目中这里应该调用 API
    // const response = await insuranceRecordService.getInsuranceRecordById(route.params.id as string)
    // formData = { ...response.data }
    
    // 模拟数据
    formData.id = route.params.id as string
    formData.policyNo = 'POL202401010001'
    formData.policyType = 'employer_liability'
    formData.purchaseDate = '2024-01-01'
    formData.effectiveDate = '2024-01-02'
    formData.expiryDate = '2025-01-01'
    formData.claimCompany = '中国平安保险'
    formData.personCount = 5
    formData.unitPrice = 500
    formData.premium = 2500
    formData.workerList = [
      { id: '1', name: '张三', workerId: 'W20240101', idCard: '110101199001011234', phone: '13800138000', age: 25, gender: 'male' },
      { id: '2', name: '李四', workerId: 'W20240102', idCard: '110101199001011235', phone: '13800138001', age: 28, gender: 'male' },
      { id: '3', name: '王五', workerId: 'W20240103', idCard: '110101199001011236', phone: '13800138002', age: 22, gender: 'female' },
      { id: '4', name: '赵六', workerId: 'W20240104', idCard: '110101199001011237', phone: '13800138003', age: 30, gender: 'male' },
      { id: '5', name: '钱七', workerId: 'W20240105', idCard: '110101199001011238', phone: '13800138004', age: 26, gender: 'female' }
    ]
  } catch (error) {
    ElMessage.error('获取参保登记详情失败')
  } finally {
    loading.value = false
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    // 实际项目中这里应该调用 API
    // if (isEdit.value) {
    //   await insuranceRecordService.updateInsuranceRecord(formData)
    // } else {
    //   await insuranceRecordService.createInsuranceRecord(formData)
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
    submitLoading.value = false
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/insurance-record')
}

// 监听参保人员列表变化，自动更新参保人数上限
watch(
  () => formData.workerList.length,
  (newLength) => {
    formData.personCount = newLength
    // 自动计算保费
    formData.premium = formData.personCount * formData.unitPrice
  }
)

// 监听单价变化，自动重新计算保费
watch(
  () => formData.unitPrice,
  (newPrice) => {
    formData.premium = formData.personCount * newPrice
  }
)

// 生命周期
onMounted(async () => {
  await fetchPolicyList()
  await fetchInsuranceRecordDetail()
  // 初始化参保人数上限
  formData.personCount = formData.workerList.length
  // 初始化保费
  formData.premium = formData.personCount * formData.unitPrice
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

.worker-list-toolbar {
  margin-bottom: 16px;
}

.insurance-amount-list {
  margin-top: 8px;
}

.insurance-amount-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
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