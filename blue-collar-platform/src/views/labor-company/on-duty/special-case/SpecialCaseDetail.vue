<template>
  <div class="detail-container">
    <div class="detail-content" :class="{ 'with-sidebar': workerInfoVisible }">
      <el-card class="detail-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <el-button v-if="specialCaseData" type="primary" link @click="toggleWorkerInfo">
              <el-icon><User /></el-icon>
              查看工人信息
            </el-button>
          </div>
        </template>
        
        <div v-if="specialCaseData" class="detail-info">
          <!-- 基本信息 -->
          <el-descriptions :column="2" border class="mb-4">
            <el-descriptions-item label="工人姓名">
              {{ specialCaseData.workerName }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号">
              {{ specialCaseData.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="特殊情况类型">
              <el-tag :type="specialCaseData.caseType === 'work_injury' ? 'danger' : 'info'">
                {{ specialCaseData.caseType === 'work_injury' ? '工伤事故' : '一般情况' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="处理状态">
              <el-tag :type="getStatusType(specialCaseData.status)">
                {{ getStatusText(specialCaseData.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情况标题" :span="2">
              {{ specialCaseData.title }}
            </el-descriptions-item>
            <el-descriptions-item label="情况描述" :span="2">
              {{ specialCaseData.description }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDateTime(specialCaseData.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="最后更新时间">
              {{ formatDateTime(specialCaseData.updateTime || specialCaseData.createTime) }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- 处理记录 -->
          <div class="processing-records" ref="processingRecordsRef">
            <h4 class="section-title">处理记录</h4>
            <el-timeline v-if="specialCaseData.processingRecords && specialCaseData.processingRecords.length">
              <el-timeline-item
                v-for="(record, index) in specialCaseData.processingRecords"
                :key="index"
                :timestamp="formatDateTime(record.createTime)"
                placement="top"
                :type="record.result === 'processed' ? 'success' : 'warning'"
              >
                <el-card>
                  <div class="record-content">
                    <div class="record-header">
                      <span class="record-title">{{ record.content }}</span>
                      <el-tag :type="getStatusType(record.result)" size="small">
                        {{ getStatusText(record.result) }}
                      </el-tag>
                    </div>
                    <div class="record-info">
                      <span>处理人：{{ record.handler }}</span>
                    </div>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无处理记录" class="mt-4" />
          </div>

          <!-- 处理表单 -->
          <div class="processing-form mt-4">
            <h4 class="section-title">处理特殊情况</h4>
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
              <el-form-item label="处理结果" prop="result">
                <el-select v-model="processForm.result" placeholder="请选择处理结果" style="width: 100%">
                  <el-option label="待处理" value="pending" />
                  <el-option label="处理中" value="processing" />
                  <el-option label="已处理" value="processed" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-empty v-else description="暂无特殊情况信息" class="mt-4" />
      </el-card>
    </div>
    
    <!-- 工人信息侧边栏 -->
    <WorkerInfoSidebar
      v-model:visible="workerInfoVisible"
      :worker-name="specialCaseData?.workerName"
      :phone="specialCaseData?.phone"
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
const specialCaseData = ref<any>(null)
const processingRecordsRef = ref<HTMLElement | null>(null)
const processFormRef = ref<any>(null)
const workerInfoVisible = ref(false)

// 处理表单数据
const processForm = ref({
  content: '',
  result: 'processing'
})

// 处理表单验证规则
const processRules = {
  content: [{ required: true, message: '请输入处理说明', trigger: 'blur' }],
  result: [{ required: true, message: '请选择处理结果', trigger: 'change' }]
}

// 类型定义
interface ProcessingRecord {
  content: string
  result: string
  handler: string
  createTime: string
}

interface SpecialCaseRecord {
  id: string
  workerName: string
  phone: string
  caseType: 'general' | 'work_injury'
  title: string
  description: string
  status: 'pending' | 'processing' | 'processed'
  createTime: string
  updateTime?: string
  processingRecords: ProcessingRecord[]
}

// 模拟数据存储
const allData = ref<SpecialCaseRecord[]>([])

// 生成模拟数据
const generateMockData = (): SpecialCaseRecord[] => {
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
  const caseTypes: SpecialCaseRecord['caseType'][] = ['general', 'work_injury']
  const statuses: SpecialCaseRecord['status'][] = ['pending', 'processing', 'processed']
  const data: SpecialCaseRecord[] = []

  for (let i = 0; i < 50; i++) {
    const caseType = caseTypes[Math.floor(Math.random() * caseTypes.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createTime = new Date()
    createTime.setDate(createTime.getDate() - Math.floor(Math.random() * 30))

    const processingRecords: ProcessingRecord[] = []
    if (status !== 'pending') {
      const recordCount = status === 'processed' ? Math.floor(Math.random() * 3) + 1 : 1
      for (let j = 0; j < recordCount; j++) {
        const processTime = new Date(createTime.getTime() + (j + 1) * 86400000)
        processingRecords.push({
          content: `第${j + 1}次处理：已联系相关人员协调解决`,
          result: status === 'processed' ? 'processed' : 'processing',
          handler: '管理员',
          createTime: processTime.toISOString()
        })
      }
    }

    data.push({
      id: `CASE${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      caseType,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status,
      createTime: createTime.toISOString(),
      updateTime: new Date().toISOString(),
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
    processed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    processed: '已处理'
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

// 模拟获取特殊情况详情
const fetchSpecialCaseDetail = async () => {
  loading.value = true
  try {
    // 实际项目中这里应该调用API
    // const response = await specialCaseService.getSpecialCaseById(route.params.id as string)
    // specialCaseData.value = response.data
    
    // 模拟数据
    const mockData = allData.value.find(item => item.id === route.params.id)
    if (mockData) {
      specialCaseData.value = mockData
    } else {
      // 如果找不到，使用默认数据
      specialCaseData.value = {
        id: route.params.id as string,
        workerName: '张三',
        phone: '13800138000',
        caseType: 'general',
        title: '工资发放异常',
        description: '工人反映上个月工资未按时发放',
        status: 'pending',
        createTime: new Date().toISOString(),
        processingRecords: []
      }
    }
  } catch (error) {
    ElMessage.error('获取特殊情况详情失败')
  } finally {
    loading.value = false
    // 移除自动滚动，让页面保持在顶部
    // scrollToProcessingSection()
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

// 提交处理
const handleProcessSubmit = async () => {
  if (!processFormRef.value) return
  
  try {
    await processFormRef.value.validate()
    
    loading.value = true
    // 实际项目中这里应该调用API
    // await specialCaseService.processSpecialCase(route.params.id as string, processForm.value)
    
    // 模拟处理成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地数据
    if (specialCaseData.value) {
      const newRecord: ProcessingRecord = {
        content: processForm.value.content,
        result: processForm.value.result,
        handler: '管理员',
        createTime: new Date().toISOString()
      }
      
      if (!specialCaseData.value.processingRecords) {
        specialCaseData.value.processingRecords = []
      }
      
      specialCaseData.value.processingRecords.push(newRecord)
      specialCaseData.value.status = processForm.value.result as 'pending' | 'processing' | 'processed'
      specialCaseData.value.updateTime = new Date().toISOString()
      
      // 清空表单
      processForm.value = {
        content: '',
        result: 'processing'
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
  router.push(`/tenant/on-duty/special-case/form/${route.params.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该特殊情况记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际项目中这里应该调用API
    // await specialCaseService.deleteSpecialCase(route.params.id as string)
    
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
  router.push('/tenant/on-duty/special-case')
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchSpecialCaseDetail()
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

.record-content {
  padding: 10px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-title {
  font-weight: 500;
}

.record-info {
  color: #666;
  font-size: 14px;
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