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
              <el-form-item label="考勤日期" prop="attendanceDate">
                <el-date-picker
                  v-model="formData.attendanceDate"
                  type="date"
                  placeholder="选择考勤日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考勤状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择考勤状态" style="width: 100%">
                  <el-option label="正常" value="normal" />
                  <el-option label="迟到" value="late" />
                  <el-option label="早退" value="early" />
                  <el-option label="缺勤" value="absent" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上班时间">
                <el-time-picker
                  v-model="formData.checkInTime"
                  placeholder="选择上班时间"
                  format="HH:mm"
                  value-format="HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下班时间">
                <el-time-picker
                  v-model="formData.checkOutTime"
                  placeholder="选择下班时间"
                  format="HH:mm"
                  value-format="HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工作时长">
                <el-input-number v-model="formData.workHours" :min="0" :max="24" :precision="1" style="width: 100%" />
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
import { ElMessage, type FormInstance } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
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
  attendanceDate: '',
  status: 'normal',
  checkInTime: '',
  checkOutTime: '',
  workHours: 8,
  factoryManager: '',
  factoryManagerPhone: '',
  clerk: '',
  clerkPhone: ''
})

const formRules = {
  workerName: [{ required: true, message: '请输入工人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  attendanceDate: [{ required: true, message: '请选择考勤日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择考勤状态', trigger: 'change' }],
  factoryManager: [{ required: true, message: '请输入驻厂负责人', trigger: 'blur' }],
  factoryManagerPhone: [{ required: true, message: '请输入驻厂负责人电话', trigger: 'blur' }],
  clerk: [{ required: true, message: '请输入文员', trigger: 'blur' }],
  clerkPhone: [{ required: true, message: '请输入文员电话', trigger: 'blur' }]
}

// 获取考勤详情
const fetchAttendanceDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    formData.id = route.params.id as string
    formData.workerName = '张三'
    formData.phone = '13800138000'
    formData.attendanceDate = '2024-01-15'
    formData.status = 'normal'
    formData.checkInTime = '08:30:00'
    formData.checkOutTime = '17:30:00'
    formData.workHours = 8
    formData.factoryManager = '李四'
    formData.factoryManagerPhone = '13900139000'
    formData.clerk = '王五'
    formData.clerkPhone = '13700137000'
  } catch (error) {
    ElMessage.error('获取考勤详情失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    handleCancel()
  } catch (error) {
    // 验证失败
  } finally {
    submitLoading.value = false
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

// 取消
const handleCancel = () => {
  router.push('/tenant/attendance')
}

// 生命周期
onMounted(() => {
  fetchAttendanceDetail()
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