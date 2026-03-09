<template>
  <div class="form-container">
    <div class="form-content">
      <el-card class="form-card" v-loading="loading">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工人姓名" prop="workerName">
                <el-input v-model="formData.workerName" placeholder="请选择工人" readonly @click="showWorkerSelect = true" style="cursor: pointer" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="formData.phone" placeholder="手机号" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="请假类型" prop="leaveType">
                <el-select v-model="formData.leaveType" placeholder="请选择请假类型" style="width: 100%">
                  <el-option label="事假" value="personal" />
                  <el-option label="病假" value="sick" />
                  <el-option label="年假" value="annual" />
                  <el-option label="婚假" value="marriage" />
                  <el-option label="丧假" value="bereavement" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请假天数" prop="days">
                <el-input-number v-model="formData.days" :min="0" :max="999" :step="0.5" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="请假开始日期" prop="startDate">
                <el-date-picker
                  v-model="formData.startDate"
                  type="datetime"
                  placeholder="选择开始日期"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请假结束日期" prop="endDate">
                <el-date-picker
                  v-model="formData.endDate"
                  type="datetime"
                  placeholder="选择结束日期"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="请假原因" prop="reason">
                <el-input v-model="formData.reason" type="textarea" :rows="4" placeholder="请输入请假原因" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="驻厂负责人" prop="factoryManager">
                <el-input v-model="formData.factoryManager" placeholder="请输入驻厂负责人" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驻厂负责人电话" prop="factoryManagerPhone">
                <el-input v-model="formData.factoryManagerPhone" placeholder="请输入驻厂负责人电话" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文员" prop="clerk">
                <el-input v-model="formData.clerk" placeholder="请输入文员" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文员电话" prop="clerkPhone">
                <el-input v-model="formData.clerkPhone" placeholder="请输入文员电话" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="handleCancel">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
        <el-icon><Check /></el-icon>
        {{ isEdit ? '保存' : '提交' }}
      </el-button>
    </div>
    
    <!-- 工人选择对话框 -->
    <WorkerSelectDialog
      v-model:visible="showWorkerSelect"
      :selected-ids="selectedWorkerId"
      :multiple="false"
      title="选择工人"
      @confirm="handleWorkerSelect"
      @cancel="showWorkerSelect = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { submitApproval } from '@/api/approvalExecutionApi'
import WorkerSelectDialog from '@/components/WorkerSelectDialog.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitLoading = ref(false)
const showWorkerSelect = ref(false)
const selectedWorkerId = ref<number | number[]>([])

const isEdit = computed(() => !!route.params.id)

const formData = reactive({
  id: '',
  workerName: '',
  phone: '',
  leaveType: '',
  startDate: '',
  endDate: '',
  days: 0,
  reason: '',
  factoryManager: '',
  factoryManagerPhone: '',
  clerk: '',
  clerkPhone: ''
})

const formRules = {
  workerName: [{ required: true, message: '请输入工人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  leaveType: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择请假开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择请假结束日期', trigger: 'change' }],
  days: [{ required: true, message: '请输入请假天数', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入请假原因', trigger: 'blur' }],
  factoryManager: [{ required: true, message: '请输入驻厂负责人', trigger: 'blur' }],
  factoryManagerPhone: [{ required: true, message: '请输入驻厂负责人电话', trigger: 'blur' }],
  clerk: [{ required: true, message: '请输入文员', trigger: 'blur' }],
  clerkPhone: [{ required: true, message: '请输入文员电话', trigger: 'blur' }]
}

// 获取请假详情
const fetchLeaveDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    formData.id = route.params.id as string
    formData.workerName = '张三'
    formData.phone = '13800138000'
    formData.leaveType = 'personal'
    formData.startDate = '2024-01-20 09:00:00'
    formData.endDate = '2024-01-21 18:00:00'
    formData.days = 2
    formData.reason = '家中有事需要处理'
    formData.factoryManager = '李四'
    formData.factoryManagerPhone = '13900139000'
    formData.clerk = '王五'
    formData.clerkPhone = '13700137000'
  } catch (error) {
    ElMessage.error('获取请假详情失败')
  } finally {
    loading.value = false
  }
}

// 处理工人选择
const handleWorkerSelect = (selected: any) => {
  // 处理单选模式返回的对象和多选模式返回的数组
  let worker
  if (Array.isArray(selected)) {
    // 多选模式
    if (selected.length > 0) {
      worker = selected[0]
    }
  } else {
    // 单选模式
    worker = selected
  }
  
  if (worker) {
    formData.workerName = worker.name
    formData.phone = worker.phone
    selectedWorkerId.value = worker.id
  }
  showWorkerSelect.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 提交审批
    const submitData = {
      businessCode: 'LEAVE',
      businessId: formData.id || 'new',
      businessData: {
        workerName: formData.workerName,
        phone: formData.phone,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      }
    }
    
    await submitApproval(submitData)
    
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    handleCancel()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('提交失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 取消
const handleCancel = () => {
  router.push('/tenant/on-duty/leave')
}

// 生命周期
onMounted(() => {
  fetchLeaveDetail()
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