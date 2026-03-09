<template>
  <div class="form-container">
    <div class="form-content">
      <el-card class="form-card" v-loading="loading">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
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
              <el-form-item label="工厂名称" prop="factoryName">
                <el-input v-model="formData.factoryName" placeholder="工厂名称" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="期望调岗日期" prop="expectedTransferDate">
                <el-date-picker
                  v-model="formData.expectedTransferDate"
                  type="date"
                  placeholder="选择期望调岗日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">原岗位信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="原部门" prop="originalDepartment">
                <el-input v-model="formData.originalDepartment" placeholder="请输入原部门" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原岗位" prop="originalPosition">
                <el-input v-model="formData.originalPosition" placeholder="请输入原岗位" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="原岗位直属领导" prop="originalLeader">
                <el-input v-model="formData.originalLeader" placeholder="请输入原岗位直属领导" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">目标岗位信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="目标部门" prop="targetDepartment">
                <el-input v-model="formData.targetDepartment" placeholder="请输入目标部门" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目标岗位" prop="targetPosition">
                <el-input v-model="formData.targetPosition" placeholder="请输入目标岗位" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="目标岗位直属组长" prop="targetLeader">
                <el-input v-model="formData.targetLeader" placeholder="请输入目标岗位直属组长" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="调岗原因" prop="transferReason">
            <el-input v-model="formData.transferReason" type="textarea" :rows="4" placeholder="请输入调岗原因" />
          </el-form-item>
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
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

interface TransferRecord {
  id: string
  workerName: string
  phone: string
  factoryName: string
  expectedTransferDate: string
  originalDepartment: string
  originalPosition: string
  originalLeader: string
  targetDepartment: string
  targetPosition: string
  targetLeader: string
  transferReason: string
  factoryManager: string
  factoryManagerPhone: string
  clerk: string
  clerkPhone: string
  approvalStatus: 'pending' | 'processing' | 'approved' | 'rejected'
  approvalRecords: any[]
}

const formData = reactive<TransferRecord>({
  id: '',
  workerName: '',
  phone: '',
  factoryName: '',
  expectedTransferDate: '',
  originalDepartment: '',
  originalPosition: '',
  originalLeader: '',
  targetDepartment: '',
  targetPosition: '',
  targetLeader: '',
  transferReason: '',
  factoryManager: '',
  factoryManagerPhone: '',
  clerk: '',
  clerkPhone: '',
  approvalStatus: 'pending',
  approvalRecords: []
})

const formRules: FormRules = {
  workerName: [{ required: true, message: '请选择工人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  expectedTransferDate: [{ required: true, message: '请选择期望调岗日期', trigger: 'change' }],
  originalDepartment: [{ required: true, message: '请输入原部门', trigger: 'blur' }],
  originalPosition: [{ required: true, message: '请输入原岗位', trigger: 'blur' }],
  targetDepartment: [{ required: true, message: '请输入目标部门', trigger: 'blur' }],
  targetPosition: [{ required: true, message: '请输入目标岗位', trigger: 'blur' }],
  transferReason: [{ required: true, message: '请输入调岗原因', trigger: 'blur' }],
  factoryManager: [{ required: true, message: '请输入驻厂负责人', trigger: 'blur' }],
  factoryManagerPhone: [{ required: true, message: '请输入驻厂负责人电话', trigger: 'blur' }],
  clerk: [{ required: true, message: '请输入文员', trigger: 'blur' }],
  clerkPhone: [{ required: true, message: '请输入文员电话', trigger: 'blur' }]
}

// 模拟数据
const mockData: TransferRecord[] = [
  {
    id: '1',
    workerName: '张三',
    phone: '13800138001',
    expectedTransferDate: '2024-03-01',
    originalDepartment: '生产部',
    originalPosition: '操作工',
    originalLeader: '李主管',
    targetDepartment: '质检部',
    targetPosition: '质检员',
    targetLeader: '王组长',
    transferReason: '个人发展需求',
    factoryManager: '李四',
    factoryManagerPhone: '13900139000',
    clerk: '王五',
    clerkPhone: '13700137000',
    approvalStatus: 'pending',
    approvalRecords: []
  }
]

// 获取调岗详情
const fetchTransferDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const record = mockData.find(item => item.id === route.params.id)
    if (record) {
      Object.assign(formData, record)
    }
  } catch (error) {
    ElMessage.error('获取调岗详情失败')
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
    formData.factoryName = worker.factoryName || '蓝领智汇工厂'
    formData.originalDepartment = worker.department || '生产部'
    formData.originalPosition = worker.position || '操作工'
    formData.originalLeader = worker.leader || '李主管'
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
    
    ElMessage.success(isEdit.value ? '编辑成功' : '提交成功')
    handleCancel()
  } catch (error) {
    // 验证失败
  } finally {
    submitLoading.value = false
  }
}

// 取消
const handleCancel = () => {
  router.push('/tenant/on-duty/transfer')
}

// 生命周期
onMounted(() => {
  fetchTransferDetail()
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