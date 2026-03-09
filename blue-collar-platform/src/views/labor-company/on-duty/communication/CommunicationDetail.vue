<template>
  <div class="detail-container">
    <div class="detail-content" :class="{ 'with-sidebar': workerInfoVisible }">
      <el-card class="detail-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <el-button v-if="communicationData" type="primary" link @click="toggleWorkerInfo">
              <el-icon><User /></el-icon>
              查看工人信息
            </el-button>
          </div>
        </template>
        
        <div v-if="communicationData" class="detail-info">
          <!-- 基本信息 -->
          <el-descriptions :column="2" border class="mb-4">
            <el-descriptions-item label="工人姓名">
              {{ communicationData.workerName }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号">
              {{ communicationData.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="遇到困难" :span="2">
              {{ communicationData.difficulty }}
            </el-descriptions-item>
            <el-descriptions-item label="需要帮助" :span="2">
              {{ communicationData.helpNeeded }}
            </el-descriptions-item>
            <el-descriptions-item label="处理状态">
              <el-tag :type="getStatusType(communicationData.status)">
                {{ getStatusText(communicationData.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="提交时间">
              {{ formatDateTime(communicationData.submitTime) }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- 处理记录 -->
          <div class="processing-records" ref="processingRecordsRef">
            <h4 class="section-title">处理记录</h4>
            <el-timeline v-if="communicationData.processingRecords && communicationData.processingRecords.length">
              <el-timeline-item
                v-for="(record, index) in communicationData.processingRecords"
                :key="index"
                :timestamp="formatDateTime(record.processTime)"
                placement="top"
              >
                <el-card>
                  <p><strong>处理人：</strong>{{ record.processor }}</p>
                  <p><strong>处理说明：</strong>{{ record.content }}</p>
                  <p v-if="record.result"><strong>处理结果：</strong>{{ record.result }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无处理记录" class="mt-4" />
          </div>

          <!-- 处理表单 -->
          <div class="processing-form mt-4">
            <h4 class="section-title">处理沟通</h4>
            <el-form
              :model="processForm"
              :rules="processRules"
              ref="processFormRef"
              label-width="120px"
              class="process-form"
            >
              <el-form-item label="处理说明" prop="content">
                <el-input
                  v-model="processForm.content"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入处理说明"
                />
              </el-form-item>
              <el-form-item label="处理结果" prop="result" v-if="processForm.showResult">
                <el-input
                  v-model="processForm.result"
                  placeholder="请输入处理结果"
                />
              </el-form-item>
              <el-form-item label="处理状态">
                <el-radio-group v-model="processForm.status">
                  <el-radio label="processing">处理中</el-radio>
                  <el-radio label="completed">已处理</el-radio>
                </el-radio-group>
              </el-form-item>

            </el-form>
          </div>
        </div>
        <el-empty v-else description="暂无沟通记录信息" class="mt-4" />
      </el-card>
    </div>
    
    <!-- 工人信息侧边栏 -->
    <WorkerInfoSidebar
      v-model:visible="workerInfoVisible"
      :worker-name="communicationData?.workerName"
      :phone="communicationData?.phone"
    />
    
    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleProcessSubmit">
        <el-icon><Check /></el-icon>
        提交处理
      </el-button>
      <el-button type="success" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete, Check, User } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import WorkerInfoSidebar from '@/components/WorkerInfoSidebar.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const communicationData = ref<any>(null)
const processingRecordsRef = ref<HTMLElement | null>(null)
const processFormRef = ref<any>(null)
const workerInfoVisible = ref(false)

// 处理表单数据
const processForm = ref({
  content: '',
  result: '',
  status: 'processing',
  showResult: false
})

// 处理表单验证规则
const processRules = {
  content: [{ required: true, message: '请输入处理说明', trigger: 'blur' }],
  result: [{ required: true, message: '请输入处理结果', trigger: 'blur' }]
}

// 类型定义
interface ProcessingRecord {
  processTime: string
  processor: string
  content: string
  result?: string
}

interface CommunicationRecord {
  id: string
  workerName: string
  phone: string
  difficulty: string
  helpNeeded: string
  status: 'pending' | 'processing' | 'completed'
  submitTime: string
  processingRecords: ProcessingRecord[]
}

// 模拟数据存储
const allData = ref<CommunicationRecord[]>([])

// 生成模拟数据
const generateMockData = (): CommunicationRecord[] => {
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
  const statuses: CommunicationRecord['status'][] = ['pending', 'processing', 'completed']
  const data: CommunicationRecord[] = []

  for (let i = 0; i < 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const submitTime = new Date()
    submitTime.setDate(submitTime.getDate() - Math.floor(Math.random() * 30))

    const processingRecords: ProcessingRecord[] = []
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

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已处理'
  }
  return textMap[status] || status
}

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 模拟获取沟通记录详情
const fetchCommunicationDetail = async () => {
  loading.value = true
  try {
    // 实际项目中这里应该调用API
    // const response = await communicationService.getCommunicationById(route.params.id as string)
    // communicationData.value = response.data
    
    // 模拟数据
    const mockData = allData.value.find(item => item.id === route.params.id)
    if (mockData) {
      communicationData.value = mockData
    } else {
      // 如果找不到，使用默认数据
      communicationData.value = {
        id: route.params.id as string,
        workerName: '张三',
        phone: '13800138000',
        difficulty: '工资发放不及时',
        helpNeeded: '希望尽快解决工资问题',
        status: 'processing',
        submitTime: new Date().toISOString(),
        processingRecords: [
          {
            processTime: new Date().toISOString(),
            processor: '管理员',
            content: '已联系财务部门核实情况',
            result: undefined
          }
        ]
      }
    }
  } catch (error) {
    ElMessage.error('获取沟通记录详情失败')
  } finally {
    loading.value = false
    // 数据加载完成后，自动滚动到处理记录区域
    scrollToProcessingSection()
  }
}

// 自动滚动到处理记录区域
const scrollToProcessingSection = async () => {
  await nextTick()
  // 在处理模式下，滚动到处理表单区域
  if (isProcessMode.value) {
    const processingFormRef = document.querySelector('.processing-form')
    if (processingFormRef) {
      processingFormRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } else if (processingRecordsRef.value) {
    // 否则滚动到处理记录区域
    processingRecordsRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 检查是否为处理模式
const isProcessMode = computed(() => route.query.mode === 'process')

// 监听处理状态变化
watch(() => processForm.value.status, (newStatus) => {
  processForm.value.showResult = newStatus === 'completed'
})

// 提交处理
const handleProcessSubmit = async () => {
  if (!processFormRef.value) return
  
  try {
    await processFormRef.value.validate()
    
    loading.value = true
    // 实际项目中这里应该调用API
    // await communicationService.processCommunication(route.params.id as string, processForm.value)
    
    // 模拟处理成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地数据
    if (communicationData.value) {
      const newRecord: ProcessingRecord = {
        processTime: new Date().toISOString(),
        processor: '管理员',
        content: processForm.value.content,
        result: processForm.value.result
      }
      
      if (!communicationData.value.processingRecords) {
        communicationData.value.processingRecords = []
      }
      
      communicationData.value.processingRecords.push(newRecord)
      communicationData.value.status = processForm.value.status as 'pending' | 'processing' | 'completed'
      
      // 清空表单
      processForm.value = {
        content: '',
        result: '',
        status: 'processing',
        showResult: false
      }
      
      ElMessage.success('处理成功')
    }
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/on-duty/communication/form/${route.params.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该沟通记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API
    // await communicationService.deleteCommunication(route.params.id as string)
    
    // 模拟删除成功
    ElMessage.success('删除成功')
    goBack()
  }).catch(() => {})
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
.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-info {
  padding: 0 16px;
}

.section-title {
  margin: 20px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.mb-4 {
  margin-bottom: 20px;
}

.mt-4 {
  margin-top: 20px;
}

.detail-footer {
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
.detail-content.with-sidebar {
  margin-right: 400px;
  transition: margin-right 0.3s ease;
}

@media screen and (max-width: 768px) {
  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
  
  .detail-content {
    padding-bottom: 120px;
  }
  
  .detail-content.with-sidebar {
    margin-right: 0;
  }
}
</style>