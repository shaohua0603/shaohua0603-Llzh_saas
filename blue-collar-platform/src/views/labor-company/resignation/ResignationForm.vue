<template>
  <div class="resignation-form-container">
    <!-- 表单区域 -->
    <div class="form-content">
      <el-card>
        <template #header>
          <span class="card-title">基本信息</span>
        </template>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          label-position="right"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工人" prop="workerId">
                <el-select
                  v-model="formData.workerId"
                  placeholder="请选择工人"
                  style="width: 100%"
                  filterable
                  @change="handleWorkerChange"
                >
                  <el-option
                    v-for="worker in workerList"
                    :key="worker.id"
                    :label="worker.name"
                    :value="worker.id"
                  >
                    <span>{{ worker.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ worker.phone }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号">
                <el-input v-model="formData.phone" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="身份证号">
                <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工厂" prop="factoryId">
                <el-select
                  v-model="formData.factoryId"
                  placeholder="请选择工厂"
                  style="width: 100%"
                  filterable
                  @change="handleFactoryChange"
                >
                  <el-option
                    v-for="factory in factoryList"
                    :key="factory.id"
                    :label="factory.name"
                    :value="factory.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="岗位">
                <el-input v-model="formData.position" placeholder="请输入岗位" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职日期">
                <el-date-picker
                  v-model="formData.entryDate"
                  type="date"
                  placeholder="请选择入职日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="mt-4">
        <template #header>
          <span class="card-title">离职信息</span>
        </template>
        <el-form
          ref="resignationFormRef"
          :model="formData"
          :rules="resignationRules"
          label-width="120px"
          label-position="right"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="离职日期" prop="resignationDate">
                <el-date-picker
                  v-model="formData.resignationDate"
                  type="date"
                  placeholder="请选择离职日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="离职原因" prop="resignationReason">
                <el-select v-model="formData.resignationReason" placeholder="请选择离职原因" style="width: 100%">
                  <el-option
                    v-for="item in resignationReasonOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="离职原因详情">
                <el-input
                  v-model="formData.resignationReasonDetail"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入离职原因详情"
                  :maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="结算工资">
                <el-input-number
                  v-model="formData.settlementSalary"
                  :min="0"
                  :precision="2"
                  placeholder="请输入结算工资"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作交接人">
                <el-input v-model="formData.handoverPersonName" placeholder="请输入工作交接人" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="交接日期">
                <el-date-picker
                  v-model="formData.handoverDate"
                  type="date"
                  placeholder="请选择交接日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归还物品">
                <el-input v-model="formData.returnItems" placeholder="请输入归还物品" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注"
                  :maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button @click="handleReset">
        <el-icon><RefreshRight /></el-icon>
        重置
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        <el-icon><Check /></el-icon>
        提交
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, RefreshRight, Check } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { RESIGNATION_REASON_OPTIONS, type ResignationFormData, type ResignationReason } from '@/types/resignationTypes'
import { getResignationDetail, createResignation, updateResignation } from '@/api/resignationApi'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const resignationFormRef = ref<FormInstance>()
const submitting = ref(false)

const isEdit = computed(() => !!route.params.id)

const resignationReasonOptions = RESIGNATION_REASON_OPTIONS

const workerList = ref([
  { id: 'W001', name: '张三', phone: '13800138001' },
  { id: 'W002', name: '李四', phone: '13800138002' },
  { id: 'W003', name: '王五', phone: '13800138003' }
])

const factoryList = ref([
  { id: 'F001', name: '深圳富士康' },
  { id: 'F002', name: '东莞华为' },
  { id: 'F003', name: '广州美的' }
])

const formData = reactive<ResignationFormData>({
  workerId: '',
  workerName: '',
  phone: '',
  idCard: '',
  factoryId: '',
  factoryName: '',
  position: '',
  entryDate: '',
  resignationDate: '',
  resignationReason: 'OTHER' as ResignationReason,
  resignationReasonDetail: '',
  settlementSalary: undefined,
  handoverPersonId: '',
  handoverPersonName: '',
  handoverDate: '',
  returnItems: '',
  remark: ''
})

const formRules: FormRules = {
  workerId: [{ required: true, message: '请选择工人', trigger: 'change' }],
  factoryId: [{ required: true, message: '请选择工厂', trigger: 'change' }]
}

const resignationRules: FormRules = {
  resignationDate: [{ required: true, message: '请选择离职日期', trigger: 'change' }],
  resignationReason: [{ required: true, message: '请选择离职原因', trigger: 'change' }]
}

const handleWorkerChange = (workerId: string) => {
  const worker = workerList.value.find(w => w.id === workerId)
  if (worker) {
    formData.workerName = worker.name
    formData.phone = worker.phone
  }
}

const handleFactoryChange = (factoryId: string) => {
  const factory = factoryList.value.find(f => f.id === factoryId)
  if (factory) {
    formData.factoryName = factory.name
  }
}

const handleBack = () => {
  router.back()
}

const handleReset = () => {
  formRef.value?.resetFields()
  resignationFormRef.value?.resetFields()
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    await resignationFormRef.value?.validate()

    submitting.value = true
    try {
      if (isEdit.value) {
        await updateResignation(route.params.id as string, formData)
        ElMessage.success('修改成功')
      } else {
        await createResignation(formData)
        ElMessage.success('提交成功')
      }
      router.push({ name: 'LaborCompanyResignation' })
    } catch (error) {
      ElMessage.error(isEdit.value ? '修改失败' : '提交失败')
    }
  } catch (error) {
    console.error('验证失败:', error)
  } finally {
    submitting.value = false
  }
}

const loadData = async () => {
  if (isEdit.value) {
    try {
      const res = await getResignationDetail(route.params.id as string)
      if (res.data) {
        Object.assign(formData, {
          workerId: res.data.workerId,
          workerName: res.data.workerName,
          phone: res.data.phone,
          idCard: res.data.idCard,
          factoryId: res.data.factoryId,
          factoryName: res.data.factoryName,
          position: res.data.position,
          entryDate: res.data.entryDate,
          resignationDate: res.data.resignationDate,
          resignationReason: res.data.resignationReason,
          resignationReasonDetail: res.data.resignationReasonDetail,
          settlementSalary: res.data.settlementSalary,
          handoverPersonName: res.data.handoverPersonName,
          handoverDate: res.data.handoverDate,
          returnItems: res.data.returnItems,
          remark: res.data.remark
        })
      }
    } catch (error) {
      ElMessage.error('加载数据失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.resignation-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.mt-4 {
  margin-top: 16px;
}

.form-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width, 200px);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base, 0.3s);
}
</style>
