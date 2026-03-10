<template>
  <div class="form-container">
    <div class="form-content">
      <el-card class="form-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑理赔' : '新增理赔' }}</span>
            <el-button type="primary" link @click="toggleWorkerInfo" :disabled="!selectedWorkerName">
              <el-icon><User /></el-icon>
              查看工人信息
            </el-button>
          </div>
        </template>
        <el-form
          :model="formData"
          :rules="rules"
          ref="formRef"
          label-width="120px"
          class="claim-form"
        >
          <el-form-item label="理赔人员" prop="workerId">
            <div class="worker-select-container">
              <el-input
                v-model="selectedWorkerName"
                placeholder="请选择理赔人员"
                class="w-full"
                readonly
              />
              <el-button
                type="primary"
                @click="openWorkerSelectDialog"
                class="worker-select-button"
              >
                选择
              </el-button>
            </div>
          </el-form-item>
          
          <!-- 工人选择对话框 -->
          <WorkerSelectDialog
            v-model:visible="workerSelectDialogVisible"
            :selected-ids="formData.workerId"
            :multiple="false"
            title="选择理赔人员"
            @confirm="handleWorkerSelect"
            @cancel="workerSelectDialogVisible = false"
          />

          
          <el-form-item label="理赔类型" prop="type">
            <el-select
              v-model="formData.type"
              placeholder="请选择理赔类型"
              class="w-full"
            >
              <el-option label="医疗理赔" value="medical" />
              <el-option label="意外理赔" value="accident" />
              <el-option label="其他理赔" value="other" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="理赔金额" prop="amount">
            <el-input
              v-model.number="formData.amount"
              type="number"
              placeholder="请输入理赔金额"
              class="w-full"
            />
          </el-form-item>
          
          <el-form-item label="理赔原因" prop="reason">
            <el-input
              v-model="formData.reason"
              type="textarea"
              placeholder="请输入理赔原因"
              class="w-full"
              :rows="3"
            />
          </el-form-item>
          
          <el-form-item label="理赔日期" prop="claimDate">
            <el-date-picker
              v-model="formData.claimDate"
              type="date"
              placeholder="选择理赔日期"
              class="w-full"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="formData.status"
              placeholder="请选择状态"
              class="w-full"
            >
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已拒绝" value="rejected" />
            </el-select>
          </el-form-item>
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
    
    <!-- 工人信息侧边栏 -->
    <WorkerInfoSidebar
      v-model:visible="workerInfoVisible"
      :worker-name="selectedWorkerName"
      :phone="formData.phone"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Check, User } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import WorkerSelectDialog from '@/components/WorkerSelectDialog.vue'
import WorkerInfoSidebar from '@/components/WorkerInfoSidebar.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref<any>(null)

// 工人信息侧边栏
const workerInfoVisible = ref(false)
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)

const formData = reactive({
  id: '',
  workerId: '',
  type: '',
  amount: 0,
  reason: '',
  claimDate: '',
  status: 'pending',
  phone: ''
})

const rules = {
  workerId: [{ required: true, message: '请选择理赔人员', trigger: 'blur' }],
  type: [{ required: true, message: '请选择理赔类型', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入理赔金额', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入理赔原因', trigger: 'blur' }],
  claimDate: [{ required: true, message: '请选择理赔日期', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
}

// 工人选择对话框相关
const workerSelectDialogVisible = ref(false)
const selectedWorkerName = ref('')

// 打开工人选择对话框
const openWorkerSelectDialog = () => {
  workerSelectDialogVisible.value = true
}

// 处理工人选择
const handleWorkerSelect = (workers: any[]) => {
  if (workers && workers.length > 0) {
    const selectedWorker = workers[0]
    formData.workerId = selectedWorker.id
    selectedWorkerName.value = selectedWorker.name
    formData.phone = selectedWorker.phone || ''
  }
  workerSelectDialogVisible.value = false
}

// 模拟获取理赔详情
const fetchClaimDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 实际项目中这里应该调用API
    // const response = await claimService.getClaimById(route.params.id as string)
    // formData = { ...response.data }
    // 然后根据 workerId 获取工人信息
    // const workerResponse = await workerService.getWorkerById(formData.workerId)
    // selectedWorkerName.value = workerResponse.data.name
    
    // 模拟数据
    formData.id = route.params.id as string
    formData.workerId = '1'
    formData.type = 'medical'
    formData.amount = 1000
    formData.reason = '感冒发烧'
    formData.claimDate = '2024-01-01'
    formData.status = 'processing'
    selectedWorkerName.value = '张三' // 模拟工人姓名
  } catch (error) {
    ElMessage.error('获取理赔详情失败')
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
    // 实际项目中这里应该调用API
    // if (isEdit.value) {
    //   await claimService.updateClaim(formData)
    // } else {
    //   await claimService.createClaim(formData)
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
  router.push('/tenant/on-duty/claim')
}

// 切换工人信息侧边栏
const toggleWorkerInfo = () => {
  workerInfoVisible.value = !workerInfoVisible.value
}

// 生命周期
onMounted(() => {
  fetchClaimDetail()
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

.form-content.with-sidebar {
  margin-right: 480px;
  transition: margin-right 0.3s ease;
}

.form-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.claim-form {
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
  
  .form-content.with-sidebar {
    margin-right: 0;
  }
  
  .worker-select-container {
    flex-direction: column;
  }
  
  .worker-select-button {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }
}

.worker-select-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.worker-select-button {
  margin-left: 10px;
  white-space: nowrap;
}
</style>