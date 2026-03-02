<template>
  <div class="pickup-form-container">
    <div class="form-content">
      <el-card class="form-card" shadow="never">
        <CommonForm
          ref="formRef"
          v-model="formData"
          :config="formConfig"
          :loading="loading"
          @submit="handleSubmit"
          @reset="handleReset"
        >
          <template #field-workerIds>
            <el-form-item label="接送人员" prop="workerIds" required>
              <el-button type="primary" @click="showPersonSelectDialog = true">
                <el-icon><User /></el-icon>
                选择接送人员
              </el-button>
              <div class="selected-workers" v-if="selectedWorkers.length > 0">
                <el-tag
                  v-for="worker in selectedWorkers"
                  :key="worker.id"
                  closable
                  @close="removeWorker(worker.id)"
                  class="worker-tag"
                >
                  {{ worker.name }} - {{ worker.phone }}
                </el-tag>
              </div>
              <div v-else class="empty-tip">
                暂未选择接送人员
              </div>
            </el-form-item>
          </template>
        </CommonForm>
      </el-card>
    </div>
    
    <PersonSelectDialog
      v-model="showPersonSelectDialog"
      :multiple="true"
      :source="'worker'"
      :selected-ids="formData.workerIds"
      @confirm="handleWorkerSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import CommonForm from '../../../components/CommonForm.vue'
import PersonSelectDialog from '../../../components/PersonSelectDialog.vue'
import type { FormConfig, FormFieldConfig } from '../../types/common-form'
import { createPickup, updatePickup, getPickupDetail, type PickupFormData, type PickupDetail } from '@/api/interviewApi'
import { getWorkerOptions } from '@/api/interviewApi'

interface Worker {
  id: string
  name: string
  phone: string
  idCard: string
  jobCategory: string
  materialComplete: boolean
}

const router = useRouter()
const route = useRoute()

const formRef = ref()
const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const showPersonSelectDialog = ref(false)
const selectedWorkers = ref<Worker[]>([])

const formData = ref<PickupFormData>({
  plateNumber: '',
  pickupTime: '',
  startPoint: '',
  endPoint: '',
  pickupPerson: '',
  manager: '',
  managerPhone: '',
  groupNumber: '',
  workerIds: [],
  remark: ''
})

const formConfig: FormConfig = {
  fields: [
    {
      field: 'plateNumber',
      label: '车牌号',
      type: 'TEXT',
      required: true,
      placeholder: '请输入车牌号',
      span: 12,
      rules: [
        { required: true, message: '请输入车牌号', trigger: 'blur' },
        { pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '车牌号格式不正确', trigger: 'blur' }
      ]
    },
    {
      field: 'pickupTime',
      label: '集合时间',
      type: 'DATETIME',
      required: true,
      placeholder: '请选择集合时间',
      span: 12,
      rules: [
        { required: true, message: '请选择集合时间', trigger: 'change' },
        { validator: (rule: any, value: any, callback: any) => {
          if (value && new Date(value) < new Date()) {
            callback(new Error('集合时间不能早于当前时间'))
          } else {
            callback()
          }
        }, trigger: 'change' }
      ]
    },
    {
      field: 'startPoint',
      label: '起点',
      type: 'TEXT',
      required: true,
      placeholder: '请输入起点',
      span: 12,
      rules: [
        { required: true, message: '请输入起点', trigger: 'blur' },
        { min: 2, max: 100, message: '起点长度在2到100个字符之间', trigger: 'blur' }
      ]
    },
    {
      field: 'endPoint',
      label: '终点',
      type: 'TEXT',
      required: true,
      placeholder: '请输入终点',
      span: 12,
      rules: [
        { required: true, message: '请输入终点', trigger: 'blur' },
        { min: 2, max: 100, message: '终点长度在2到100个字符之间', trigger: 'blur' }
      ]
    },
    {
      field: 'pickupPerson',
      label: '接送人',
      type: 'TEXT',
      required: true,
      placeholder: '请输入接送人',
      span: 12,
      rules: [
        { required: true, message: '请输入接送人', trigger: 'blur' },
        { min: 2, max: 20, message: '接送人姓名长度在2到20个字符之间', trigger: 'blur' }
      ]
    },
    {
      field: 'manager',
      label: '负责人',
      type: 'TEXT',
      required: true,
      placeholder: '请输入负责人',
      span: 12,
      rules: [
        { required: true, message: '请输入负责人', trigger: 'blur' },
        { min: 2, max: 20, message: '负责人姓名长度在2到20个字符之间', trigger: 'blur' }
      ]
    },
    {
      field: 'groupNumber',
      label: '群号',
      type: 'TEXT',
      required: false,
      placeholder: '请输入群号',
      span: 12,
      rules: [
        { pattern: /^\d{6,20}$/, message: '群号格式不正确', trigger: 'blur' }
      ]
    },
    {
      field: 'managerPhone',
      label: '负责人电话',
      type: 'TEXT',
      required: true,
      placeholder: '请输入负责人电话',
      span: 12,
      rules: [
        { required: true, message: '请输入负责人电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
      ]
    },
    {
      field: 'workerIds',
      label: '接送人员',
      type: 'CUSTOM',
      required: true,
      span: 24,
      rules: [
        { required: true, message: '请选择接送人员', trigger: 'change' },
        { validator: (rule: any, value: any, callback: any) => {
          if (!value || value.length === 0) {
            callback(new Error('至少选择一名接送人员'))
          } else if (value.length > 50) {
            callback(new Error('接送人员数量不能超过50人'))
          } else {
            callback()
          }
        }, trigger: 'change' }
      ]
    },
    {
      field: 'remark',
      label: '备注',
      type: 'TEXTAREA',
      required: false,
      placeholder: '请输入备注信息',
      span: 24,
      rows: 3,
      rules: [
        { max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }
      ]
    }
  ],
  labelWidth: '120px',
  columns: 2,
  buttonPosition: 'bottom',
  buttonAlign: 'center',
  submitText: '提交',
  resetText: '重置',
  permissions: {
    submit: isEdit.value ? 'interview:pickup:update' : 'interview:pickup:create'
  }
}

const handleBack = () => {
  router.back()
}

const handleWorkerSelect = (workers: Worker[]) => {
  selectedWorkers.value = workers
  formData.value.workerIds = workers.map(w => w.id)
}

const removeWorker = (workerId: string) => {
  selectedWorkers.value = selectedWorkers.value.filter(w => w.id !== workerId)
  formData.value.workerIds = selectedWorkers.value.map(w => w.id)
}

const handleSubmit = async (data: PickupFormData) => {
  console.log('提交表单数据:', data)
  loading.value = true
  try {
    if (isEdit.value) {
      await updatePickup(route.params.id as string, data)
      ElMessage.success('编辑成功')
    } else {
      await createPickup(data)
      ElMessage.success('新增成功')
    }
    router.back()
  } catch (error) {
    ElMessage.error(isEdit.value ? '编辑失败' : '新增失败')
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
}

const handleReset = (data: any) => {
  console.log('重置表单')
  selectedWorkers.value = []
  formData.value.workerIds = []
}

const loadPickupDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    const response = await getPickupDetail(route.params.id as string)
    const detail = response.data
    formData.value = {
      plateNumber: detail.plateNumber,
      pickupTime: detail.pickupTime,
      startPoint: detail.startPoint,
      endPoint: detail.endPoint,
      pickupPerson: detail.pickupPerson,
      manager: detail.manager,
      managerPhone: detail.managerPhone || '',
      groupNumber: detail.groupNumber,
      workerIds: detail.workers?.map((worker: any) => worker.id) || [],
      remark: detail.remark || ''
    }
    
    if (detail.workers && detail.workers.length > 0) {
      selectedWorkers.value = detail.workers.map((worker: any) => ({
        id: worker.id,
        name: worker.name,
        phone: worker.phone,
        idCard: worker.idCard,
        jobCategory: '',
        materialComplete: false
      }))
    }
  } catch (error) {
    ElMessage.error('获取接送详情失败')
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPickupDetail()
})
</script>

<style scoped>
.pickup-form-container {
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

.form-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selected-workers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.worker-tag {
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
}

.empty-tip {
  color: #909399;
  font-size: 14px;
  margin-top: 12px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .form-content {
    padding: 12px;
    padding-bottom: 120px;
  }

  :deep(.el-form) {
    font-size: 14px;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  .selected-workers {
    gap: 6px;
  }

  .worker-tag {
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style>
