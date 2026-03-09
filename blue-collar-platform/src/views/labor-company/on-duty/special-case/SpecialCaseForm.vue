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
          class="special-case-form"
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
          <el-form-item label="特殊情况类型" prop="caseType">
            <el-select v-model="formData.caseType" placeholder="请选择特殊情况类型" style="width: 100%">
              <el-option label="一般情况" value="general" />
              <el-option label="工伤事故" value="work_injury" />
            </el-select>
          </el-form-item>
          <el-form-item label="情况标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入情况标题" />
          </el-form-item>
          <el-form-item label="情况描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="请输入情况描述"
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
  caseType: '',
  title: '',
  description: ''
})

const formRules = {
  workerId: [{ required: true, message: '请选择工人', trigger: 'change' }],
  caseType: [{ required: true, message: '请选择特殊情况类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入情况标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入情况描述', trigger: 'blur' }]
}

// 模拟数据存储
const allData = ref<any[]>([])

// 生成模拟数据
const generateMockData = () => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const titles = [
    '工资发放异常',
    '工作期间受伤',
    '住宿问题反馈',
    '饮食问题',
    '工作环境问题',
    '加班问题',
    '合同纠纷',
    '其他问题'
  ]
  const descriptions = [
    '工人反映上个月工资未按时发放',
    '工人在车间操作机器时手指受伤',
    '宿舍设施损坏需要维修',
    '食堂饭菜质量差，工人不满意',
    '车间温度过高，影响工作效率',
    '经常加班，没有加班费',
    '劳动合同与实际不符',
    '其他特殊情况需要处理'
  ]
  const caseTypes = ['general', 'work_injury']
  const statuses = ['pending', 'processing', 'processed']
  const data = []

  for (let i = 0; i < 50; i++) {
    const caseType = caseTypes[Math.floor(Math.random() * caseTypes.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createTime = new Date()
    createTime.setDate(createTime.getDate() - Math.floor(Math.random() * 30))

    const processingRecords = []
    if (status !== 'pending') {
      const recordCount = status === 'processed' ? Math.floor(Math.random() * 3) + 1 : 1
      for (let j = 0; j < recordCount; j++) {
        const processTime = new Date(createTime.getTime() + (j + 1) * 86400000)
        processingRecords.push({
          content: `第${j + 1}次处理：已联系相关人员协调解决`,
          result: status === 'processed' ? '问题已解决' : '处理中',
          handler: '管理员',
          createTime: processTime.toISOString()
        })
      }
    }

    data.push({
      id: `CASE${String(i + 1).padStart(6, '0')}`,
      workerId: `worker-${i + 1}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      caseType,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status,
      createTime: createTime.toISOString(),
      processingRecords
    })
  }

  return data
}

// 模拟获取特殊情况详情
const fetchSpecialCaseDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    // 实际项目中这里应该调用 API
    // const response = await specialCaseService.getSpecialCaseById(route.params.id as string)
    // formData = { ...response.data }
    
    // 模拟数据
    formData.id = route.params.id as string
    formData.workerId = 'worker-1'
    formData.workerName = '张三'
    formData.phone = '13800138000'
    formData.caseType = 'general'
    formData.title = '工资发放异常'
    formData.description = '工人反映上个月工资未按时发放'
  } catch (error) {
    ElMessage.error('获取特殊情况详情失败')
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
    //   await specialCaseService.updateSpecialCase(formData)
    // } else {
    //   await specialCaseService.createSpecialCase(formData)
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
  router.push('/tenant/on-duty/special-case')
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchSpecialCaseDetail()
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

.special-case-form {
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