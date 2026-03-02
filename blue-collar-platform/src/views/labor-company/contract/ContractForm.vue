<template>
  <div class="contract-form-page">
    <el-card class="form-card" shadow="never">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        :disabled="loading"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input
                v-model="formData.contractNo"
                placeholder="请输入合同编号"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="甲方" prop="partyA">
              <el-input
                v-model="formData.partyA"
                placeholder="请输入甲方名称"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乙方" prop="partyB">
              <div class="person-select-wrapper">
                <el-button @click="showPersonSelect = true" :disabled="loading">
                  <el-icon><User /></el-icon>
                  {{ getPersonSelectText() }}
                </el-button>
                <div v-if="formData.partyB" class="selected-person">
                  <el-tag closable @close="handleClearPerson">
                    {{ formData.partyB.name }}
                  </el-tag>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算方式" prop="settlementMethod">
              <el-select
                v-model="formData.settlementMethod"
                placeholder="请选择结算方式"
                style="width: 100%"
              >
                <el-option
                  v-for="item in Object.values(SettlementMethodConfig)"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同签订日期" prop="contractSignDate">
              <el-date-picker
                v-model="formData.contractSignDate"
                type="date"
                placeholder="请选择合同签订日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同生效日期" prop="contractEffectiveDate">
              <el-date-picker
                v-model="formData.contractEffectiveDate"
                type="date"
                placeholder="请选择合同生效日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同过期日期" prop="contractExpiryDate">
              <el-date-picker
                v-model="formData.contractExpiryDate"
                type="date"
                placeholder="请选择合同过期日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同金额" prop="contractAmount">
              <el-input-number
                v-model="formData.contractAmount"
                :min="0"
                :precision="2"
                :step="100"
                placeholder="请输入合同金额"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同内容" prop="contractContent">
              <el-input
                v-model="formData.contractContent"
                type="textarea"
                :rows="8"
                placeholder="请输入合同内容"
                maxlength="10000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="form-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button @click="handleSaveDraft" :loading="draftSaving">
        保存草稿
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        提交
      </el-button>
    </div>

    <el-dialog
      v-model="showPersonSelect"
      title="选择乙方（工人）"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="worker-select-content">
        <el-input
          v-model="workerKeyword"
          placeholder="请输入姓名或手机号"
          clearable
          @keyup.enter="searchWorkers"
          style="margin-bottom: 16px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-table
          :data="workerList"
          :loading="workerLoading"
          height="400"
          @selection-change="handleWorkerSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="gender" label="性别" width="80" />
          <el-table-column prop="education" label="学历" width="100" />
          <el-table-column prop="jobIntention" label="岗位意向" width="120" />
          <el-table-column prop="expectedSalary" label="期望薪资" width="100" />
          <el-table-column prop="materialsComplete" label="材料齐全" width="100">
            <template #default="{ row }">
              <el-tag :type="row.materialsComplete ? 'success' : 'warning'">
                {{ row.materialsComplete ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="workerPage"
          v-model:page-size="workerPageSize"
          :total="workerTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleWorkerSizeChange"
          @current-change="handleWorkerPageChange"
          style="margin-top: 16px"
        />
      </div>
      <template #footer>
        <el-button @click="showPersonSelect = false">取消</el-button>
        <el-button type="primary" @click="handleWorkerConfirm" :disabled="!selectedWorker">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, User, Search } from '@element-plus/icons-vue'
import { useContractStore } from '@/stores/contract'
import type { ContractFormData, AvailableWorker } from '@/types/contract'
import { ContractStatusConfig, SettlementMethodConfig } from '@/types/contract'

const router = useRouter()
const route = useRoute()
const contractStore = useContractStore()

const isEdit = computed(() => !!route.params.id)
const formRef = ref()
const loading = ref(false)
const submitting = ref(false)
const draftSaving = ref(false)
const showPersonSelect = ref(false)

const workerKeyword = ref('')
const workerList = ref<AvailableWorker[]>([])
const workerLoading = ref(false)
const workerPage = ref(1)
const workerPageSize = ref(10)
const workerTotal = ref(0)
const selectedWorker = ref<AvailableWorker | null>(null)

const formData = ref<ContractFormData>({
  contractNo: '',
  partyA: '',
  partyAId: '',
  partyBId: '',
  partyB: null,
  settlementMethod: '',
  contractStatus: 'UNSIGNED',
  contractSignDate: '',
  contractEffectiveDate: '',
  contractExpiryDate: '',
  contractAmount: 0,
  contractContent: '',
  attachments: [],
  remark: ''
})

const formRules = {
  partyA: [
    { required: true, message: '请输入甲方', trigger: 'blur' },
    { max: 100, message: '甲方名称不能超过100个字符', trigger: 'blur' }
  ],
  partyB: [
    { required: true, message: '请选择乙方', trigger: 'change' }
  ],
  settlementMethod: [
    { required: true, message: '请选择结算方式', trigger: 'change' }
  ],
  contractSignDate: [
    { required: true, message: '请选择合同签订日期', trigger: 'change' }
  ],
  contractEffectiveDate: [
    { required: true, message: '请选择合同生效日期', trigger: 'change' },
    {
      validator: (rule: any, value: any, callback: any) => {
        const signDate = formData.value.contractSignDate
        if (signDate && value && new Date(value) < new Date(signDate)) {
          callback(new Error('合同生效日期不能早于签订日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  contractExpiryDate: [
    { required: true, message: '请选择合同过期日期', trigger: 'change' },
    {
      validator: (rule: any, value: any, callback: any) => {
        const effectiveDate = formData.value.contractEffectiveDate
        if (effectiveDate && value && new Date(value) <= new Date(effectiveDate)) {
          callback(new Error('合同过期日期必须晚于生效日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  contractAmount: [
    { required: true, message: '请输入合同金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '合同金额必须大于0', trigger: 'blur' }
  ],
  contractContent: [
    { required: true, message: '请输入合同内容', trigger: 'blur' },
    { max: 10000, message: '合同内容不能超过10000个字符', trigger: 'blur' }
  ]
}

const getPersonSelectText = () => {
  if (formData.value.partyB) {
    return `已选择：${formData.value.partyB.name}`
  }
  return '请选择乙方（工人）'
}

const handlePersonSelectConfirm = (selected: AvailableWorker) => {
  formData.value.partyB = selected
  formData.value.partyBId = selected.id
  showPersonSelect.value = false
}

const handleClearPerson = () => {
  formData.value.partyB = null
  formData.value.partyBId = ''
}

const searchWorkers = async () => {
  workerLoading.value = true
  try {
    const data = await contractStore.fetchAvailableWorkers({
      page: workerPage.value,
      pageSize: workerPageSize.value,
      keyword: workerKeyword.value
    })
    workerList.value = data.list
    workerTotal.value = data.total
  } catch (error) {
    console.error(error)
  } finally {
    workerLoading.value = false
  }
}

const handleWorkerSelectionChange = (selection: AvailableWorker[]) => {
  if (selection.length > 1) {
    selectedWorker.value = selection[selection.length - 1]
  } else if (selection.length === 1) {
    selectedWorker.value = selection[0]
  } else {
    selectedWorker.value = null
  }
}

const handleWorkerSizeChange = (size: number) => {
  workerPageSize.value = size
  workerPage.value = 1
  searchWorkers()
}

const handleWorkerPageChange = (page: number) => {
  workerPage.value = page
  searchWorkers()
}

const handleWorkerConfirm = () => {
  if (selectedWorker.value) {
    handlePersonSelectConfirm(selectedWorker.value)
  }
}

const loadContractDetail = async (id: string) => {
  loading.value = true
  try {
    await contractStore.fetchContractDetail(id)
    if (contractStore.contractDetail) {
      Object.assign(formData.value, contractStore.contractDetail)
    }
  } catch (error) {
    ElMessage.error('加载合同详情失败')
  } finally {
    loading.value = false
  }
}

const generateContractNo = async () => {
  try {
    const contractNo = await contractStore.generateNo()
    formData.value.contractNo = contractNo
  } catch (error) {
    console.error(error)
  }
}

const handleSaveDraft = async () => {
  draftSaving.value = true
  try {
    const submitData = {
      ...formData.value,
      partyBId: formData.value.partyB?.id,
      contractStatus: 'UNSIGNED'
    }

    if (isEdit.value) {
      await contractStore.updateContract(formData.value.id, submitData)
    } else {
      await contractStore.createContract(submitData)
    }
  } catch (error) {
    console.error(error)
  } finally {
    draftSaving.value = false
  }
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) {
      ElMessage.warning('请完善表单信息')
      return
    }

    submitting.value = true

    const submitData = {
      ...formData.value,
      partyBId: formData.value.partyB?.id,
      contractStatus: 'SIGNING'
    }

    if (isEdit.value) {
      await contractStore.updateContract(formData.value.id, submitData)
      ElMessage.success('合同更新成功')
    } else {
      await contractStore.createContract(submitData)
      ElMessage.success('合同创建成功')
    }

    router.push({ name: 'LaborCompanyContract' })
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

const handleBack = () => {
  ElMessageBox.confirm('确定要返回吗？未保存的内容将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push({ name: 'LaborCompanyContract' })
  }).catch(() => {})
}

onMounted(() => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    formData.value.partyA = userInfo.companyName || ''
    formData.value.partyAId = userInfo.tenantId || ''
  }

  if (isEdit.value) {
    loadContractDetail(route.params.id as string)
  } else {
    generateContractNo()
  }
})
</script>

<style scoped>
.contract-form-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  background-color: #f5f7fa;
}

.form-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.form-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.person-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-person {
  display: flex;
  gap: 8px;
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

.worker-select-content {
  padding: 0;
}

@media screen and (max-width: 768px) {
  .contract-form-page {
    padding: 12px;
  }

  .form-card :deep(.el-card__body) {
    padding: 16px;
  }

  :deep(.el-row) {
    flex-direction: column;
  }

  :deep(.el-col) {
    width: 100% !important;
    max-width: 100%;
  }

  .form-footer {
    left: 0;
    flex-direction: column;
  }

  .form-footer .el-button {
    width: 100%;
  }
}
</style>
