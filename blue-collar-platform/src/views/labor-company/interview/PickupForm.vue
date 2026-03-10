<template>
  <div class="pickup-form-container">
    <div class="form-content">
      <!-- 基本信息表单 -->
      <el-card class="form-card" shadow="never">
        <CommonForm
          ref="formRef"
          v-model="formData"
          :config="formConfig"
          :loading="loading"
          @submit="handleSubmit"
          @reset="handleReset"
          :show-buttons="false"
        />
        
      </el-card>

      <!-- 接送人员清单卡片 -->
      <el-card class="info-card" shadow="never" style="margin-top: 20px;">
        <template #header>
          <div class="card-header">
            <el-icon><User /></el-icon>
            <span>接送人员清单</span>
            <el-button type="primary" @click="showPersonSelectDialog = true" style="margin-left: auto;">
              <el-icon><User /></el-icon>
              选择接送人员
            </el-button>
          </div>
        </template>
        <div v-if="selectedWorkers.length > 0">
          <el-table :data="selectedWorkers" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="phone" label="手机号" width="130" />
            <el-table-column prop="idCard" label="身份证号" width="180" />
            <el-table-column prop="jobCategory" label="岗位类别" width="100" />
            <el-table-column prop="jobIntention" label="岗位意向" width="120" />
            <el-table-column prop="expectedSalary" label="期望薪资" width="100" />
            <el-table-column prop="expectedWorkLocation" label="期望工作地址" width="120" />
            <el-table-column prop="materialComplete" label="材料齐全" width="100">
              <template #default="{ row }">
                <el-tag :type="row.materialComplete ? 'success' : 'danger'">
                  {{ row.materialComplete ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="danger"
                  size="small"
                  @click="removeWorker(row.id)"
                >
                  <el-icon><Delete /></el-icon>
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="empty-tip">
          暂未选择接送人员
        </div>
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button @click="handleResetForm">
        <el-icon><Refresh /></el-icon>
        重置
      </el-button>
      <el-button @click="handleSaveDraft">
        <el-icon><Upload /></el-icon>
        保存草稿
      </el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">
        <el-icon><Check /></el-icon>
        提交
      </el-button>
    </div>
    
    <PersonSelectDialog
      v-model="showPersonSelectDialog"
      :multiple="true"
      :source="'all'"
      :selected-ids="formData.workerIds"
      @confirm="handleWorkerSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Delete, ArrowLeft, Refresh, Upload, Check } from '@element-plus/icons-vue'
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
  jobIntention: string
  expectedSalary: string
  expectedWorkLocation: string
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

const handleSubmit = async () => {
  // 验证接送人员
  if (!formData.value.workerIds || formData.value.workerIds.length === 0) {
    ElMessage.error('请选择接送人员')
    return
  }
  
  if (formData.value.workerIds.length > 50) {
    ElMessage.error('接送人员数量不能超过50人')
    return
  }
  
  console.log('提交表单数据:', formData.value)
  loading.value = true
  try {
    if (isEdit.value) {
      await updatePickup(route.params.id as string, formData.value)
      ElMessage.success('编辑成功')
    } else {
      await createPickup(formData.value)
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

const handleResetForm = () => {
  console.log('重置表单')
  if (formRef.value) {
    formRef.value.resetFields()
  }
  selectedWorkers.value = []
  formData.value.workerIds = []
}

const handleSaveDraft = () => {
  // 验证接送人员
  if (!formData.value.workerIds || formData.value.workerIds.length === 0) {
    ElMessage.error('请选择接送人员')
    return
  }
  
  if (formData.value.workerIds.length > 50) {
    ElMessage.error('接送人员数量不能超过50人')
    return
  }
  
  // 保存草稿逻辑
  ElMessage.success('草稿保存成功')
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
        jobCategory: worker.jobCategory || '',
        jobIntention: worker.jobIntention || '',
        expectedSalary: worker.expectedSalary || '',
        expectedWorkLocation: worker.expectedWorkLocation || '',
        materialComplete: worker.materialComplete || false
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

.info-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
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

/* 底部按钮栏 - 固定悬浮 */
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
