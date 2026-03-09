<template>
  <div class="form-container">
    <div class="form-content" :class="{ 'with-sidebar': workerInfoVisible }">
      <el-card class="form-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <el-button type="primary" link @click="toggleWorkerInfo">
              <el-icon><User /></el-icon>
              查看工人信息
            </el-button>
          </div>
        </template>
        <el-form
          :model="formData"
          :rules="formRules"
          ref="formRef"
          label-width="120px"
          class="communication-form"
        >
          <el-form-item label="选择工人" prop="workerId">
            <WorkerSelect
              v-model="formData.workerId"
              placeholder="请选择工人"
              @change="handleWorkerChange"
            />
          </el-form-item>
          <el-form-item label="工人姓名" prop="workerName">
            <el-input v-model="formData.workerName" placeholder="选择工人后自动填充" disabled />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="选择工人后自动填充" disabled />
          </el-form-item>
          <el-form-item label="驻厂负责人" prop="factoryManager">
            <el-input v-model="formData.factoryManager" placeholder="请输入驻厂负责人" />
          </el-form-item>
          <el-form-item label="驻厂负责人手机号" prop="factoryManagerPhone">
            <el-input v-model="formData.factoryManagerPhone" placeholder="请输入驻厂负责人手机号" />
          </el-form-item>
          <el-form-item label="文员" prop="clerk">
            <el-input v-model="formData.clerk" placeholder="请输入文员" />
          </el-form-item>
          <el-form-item label="文员手机号" prop="clerkPhone">
            <el-input v-model="formData.clerkPhone" placeholder="请输入文员手机号" />
          </el-form-item>
          <el-form-item label="遇到的困难" prop="difficulty">
            <el-input
              v-model="formData.difficulty"
              type="textarea"
              :rows="3"
              placeholder="请输入遇到的困难"
            />
          </el-form-item>
          <el-form-item label="需要的帮助" prop="helpNeeded">
            <el-input
              v-model="formData.helpNeeded"
              type="textarea"
              :rows="3"
              placeholder="请输入需要的帮助"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 工人信息侧边栏 -->
    <WorkerInfoSidebar
      v-model:visible="workerInfoVisible"
      :worker-name="formData.workerName"
      :phone="formData.phone"
    />
    
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
import { ArrowLeft, Check, User } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import WorkerInfoSidebar from '@/components/WorkerInfoSidebar.vue'
import WorkerSelect from '@/components/WorkerSelect.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref<any>(null)
const loading = ref(false)
const workerInfoVisible = ref(false)

const isEdit = computed(() => !!route.params.id)

const formData = reactive({
  id: '',
  workerId: null as number | string | null,
  workerName: '',
  phone: '',
  factoryManager: '',
  factoryManagerPhone: '',
  clerk: '',
  clerkPhone: '',
  difficulty: '',
  helpNeeded: ''
})

const formRules = {
  workerId: [{ required: true, message: '请选择工人', trigger: 'change' }],
  difficulty: [{ required: true, message: '请输入遇到的困难', trigger: 'blur' }],
  factoryManager: [{ required: true, message: '请输入驻厂负责人', trigger: 'blur' }],
  factoryManagerPhone: [{ required: true, message: '请输入驻厂负责人手机号', trigger: 'blur' }],
  clerk: [{ required: true, message: '请输入文员', trigger: 'blur' }],
  clerkPhone: [{ required: true, message: '请输入文员手机号', trigger: 'blur' }]
}

// 模拟数据存储
const allData = ref<any[]>([])

// 生成模拟数据
const generateMockData = () => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const difficulties = [
    '工资发放不及时',
    '工作环境有问题',
    '住宿条件差',
    '饮食不习惯',
    '工作时间长',
    '加班费用问题',
    '工伤处理问题',
    '合同纠纷'
  ]
  const helpNeededList = [
    '希望尽快解决工资问题',
    '需要改善工作环境',
    '希望更换宿舍',
    '希望能调整饮食',
    '希望减少加班时间',
    '需要结算加班费',
    '需要进行工伤认定',
    '需要法律援助'
  ]
  const statuses = ['pending', 'processing', 'completed']
  const data = []

  for (let i = 0; i < 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const submitTime = new Date()
    submitTime.setDate(submitTime.getDate() - Math.floor(Math.random() * 30))

    const processingRecords = []
    if (status !== 'pending') {
      const recordCount = status === 'completed' ? Math.floor(Math.random() * 3) + 1 : 1
      for (let j = 0; j < recordCount; j++) {
        const processTime = new Date(submitTime.getTime() + (j + 1) * 86400000)
        processingRecords.push({
          processTime: processTime.toISOString(),
          processor: '管理员',
          content: `第${j + 1}次处理：已联系相关人员协调解决`,
          result: status === 'completed' ? '问题已解决' : undefined
        })
      }
    }

    data.push({
      id: `COMM${String(i + 1).padStart(6, '0')}`,
      workerId: `worker-${i + 1}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      helpNeeded: helpNeededList[Math.floor(Math.random() * helpNeededList.length)],
      status,
      submitTime: submitTime.toISOString(),
      processingRecords
    })
  }

  return data
}

// 模拟获取沟通记录详情
const fetchCommunicationDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 实际项目中这里应该调用 API
    // const response = await communicationService.getCommunicationById(route.params.id as string)
    // formData = { ...response.data }
    
    // 模拟数据
    formData.id = route.params.id as string
    formData.workerId = 'worker-1'
    formData.workerName = '张三'
    formData.phone = '13800138000'
    formData.factoryManager = '赵六'
    formData.factoryManagerPhone = '13700137000'
    formData.clerk = '钱七'
    formData.clerkPhone = '13600136000'
    formData.difficulty = '工资发放不及时'
    formData.helpNeeded = '希望尽快解决工资问题'
  } catch (error) {
    ElMessage.error('获取沟通记录详情失败')
  } finally {
    loading.value = false
  }
}

// 处理工人选择变化
const handleWorkerChange = (worker: any) => {
  if (worker) {
    formData.workerName = worker.name
    formData.phone = worker.phone
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
    //   await communicationService.updateCommunication(formData)
    // } else {
    //   await communicationService.createCommunication(formData)
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

// 切换工人信息侧边栏
const toggleWorkerInfo = () => {
  workerInfoVisible.value = !workerInfoVisible.value
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/communication')
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchCommunicationDetail()
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

.communication-form {
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

/* 侧边栏显示时的内容区域样式 */
.form-content.with-sidebar {
  margin-right: 400px;
  transition: margin-right 0.3s ease;
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
}

</style>