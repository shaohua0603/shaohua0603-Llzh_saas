<template>
  <div class="factory-interview-detail-container">
    <div class="detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>面试基本信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="面试编号">{{ interviewDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="劳务公司">{{ interviewDetail.laborCompany }}</el-descriptions-item>
          <el-descriptions-item label="面试时间">{{ interviewDetail.interviewTime }}</el-descriptions-item>
          <el-descriptions-item label="面试地点">{{ interviewDetail.interviewLocation }}</el-descriptions-item>
          <el-descriptions-item label="工厂对接人">{{ interviewDetail.factoryContact }}</el-descriptions-item>
          <el-descriptions-item label="对接人手机号">{{ interviewDetail.factoryContactPhone }}</el-descriptions-item>
          <el-descriptions-item label="面试人数">{{ interviewDetail.candidateCount }}人</el-descriptions-item>
          <el-descriptions-item label="面试类型">{{ interviewDetail.interviewType || '现场面试' }}</el-descriptions-item>
          <el-descriptions-item label="面试方式">{{ interviewDetail.interviewMethod || '集体面试' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(interviewDetail.status)">
              {{ getStatusText(interviewDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ interviewDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ interviewDetail.creator || '系统' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 面试人员清单卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><User /></el-icon>
            <span>面试人员清单</span>
          </div>
        </template>
        <el-table :data="candidateList" border>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="isReturnWorker" label="是否返厂员工" width="120">
            <template #default="{ row }">
              <el-tag :type="row.isReturnWorker ? 'success' : 'info'">
                {{ row.isReturnWorker ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="phone" label="手机号" width="120" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="gender" label="性别" width="80" />
          <el-table-column prop="recommendationLevel" label="推荐等级" width="100">
            <template #default="{ row }">
              <el-tag :type="getRecommendationLevelType(row.recommendationLevel)">
                {{ row.recommendationLevel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="imageLevel" label="形象级别" width="100">
            <template #default="{ row }">
              <el-tag :type="getImageLevelType(row.imageLevel)">
                {{ row.imageLevel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="education" label="学历" width="100" />
          <el-table-column prop="positionCategory" label="岗位类别" width="120" />
          <el-table-column prop="expectedLocation" label="期望工作地址" width="150" />
          <el-table-column prop="recommendationReason" label="推荐理由" width="200" />
          <el-table-column prop="interviewResult" label="面试结果" width="100">
            <template #default="{ row }">
              <el-tag :type="getInterviewResultType(row.interviewResult)">
                {{ getInterviewResultText(row.interviewResult) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="offerStatus" label="Offer状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getOfferStatusType(row.offerStatus)">
                {{ getOfferStatusText(row.offerStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleViewWorker(row)">
                查看
              </el-button>
              <el-button type="warning" link size="small" @click="handleInterviewResult(row)">
                面试结果
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 操作记录卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Clock /></el-icon>
            <span>操作记录</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in operationRecords"
            :key="index"
            :timestamp="record.time"
            placement="top"
          >
            <div class="record-content">
              <div class="record-operator">{{ record.operator }}</div>
              <div class="record-action">{{ record.action }}</div>
              <div class="record-remark" v-if="record.remark">{{ record.remark }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="warning" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>

    <!-- 蒙版 -->
    <div v-if="workerDetailVisible" class="sidebar-mask" @click="workerDetailVisible = false"></div>

    <!-- 工人详情右侧栏 -->
    <div class="worker-sidebar" :class="{ 'open': workerDetailVisible }">
      <div class="sidebar-header">
        <h3>{{ selectedWorker ? `工人详情 - ${selectedWorker.name}` : '工人详情' }}</h3>
        <el-button type="text" @click="workerDetailVisible = false" class="close-btn">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="sidebar-content">
        <el-card v-if="selectedWorker" shadow="never">
          <!-- 个人基本信息 -->
          <h4 class="section-title">个人基本信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="姓名">{{ selectedWorker.name }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ selectedWorker.phone }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ selectedWorker.age }}岁</el-descriptions-item>
            <el-descriptions-item label="性别">{{ selectedWorker.gender }}</el-descriptions-item>
            <el-descriptions-item label="是否返厂员工">
              <el-tag :type="selectedWorker.isReturnWorker ? 'success' : 'info'">
                {{ selectedWorker.isReturnWorker ? '是' : '否' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="推荐等级">
              <el-tag :type="getRecommendationLevelType(selectedWorker.recommendationLevel)">
                {{ selectedWorker.recommendationLevel }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="形象级别">
              <el-tag :type="getImageLevelType(selectedWorker.imageLevel)">
                {{ selectedWorker.imageLevel }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="学历">{{ selectedWorker.education }}</el-descriptions-item>
            <el-descriptions-item label="岗位类别">{{ selectedWorker.positionCategory }}</el-descriptions-item>
            <el-descriptions-item label="期望工作地址">{{ selectedWorker.expectedLocation }}</el-descriptions-item>
            <el-descriptions-item label="推荐理由">{{ selectedWorker.recommendationReason }}</el-descriptions-item>
          </el-descriptions>
          
          <!-- 面试结果信息 -->
          <h4 class="section-title">面试结果</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="面试结果">
              <el-tag :type="getInterviewResultType(selectedWorker.interviewResult)">
                {{ getInterviewResultText(selectedWorker.interviewResult) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Offer状态">
              <el-tag :type="getOfferStatusType(selectedWorker.offerStatus)">
                {{ getOfferStatusText(selectedWorker.offerStatus) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </div>

    <!-- 面试结果对话框 -->
    <el-dialog v-model="interviewResultDialogVisible" title="面试结果操作" width="500px" :close-on-click-modal="false">
      <el-form :model="interviewResultForm" label-width="100px">
        <el-form-item label="面试结果" required>
          <el-select v-model="interviewResultForm.interviewResult" placeholder="请选择面试结果" style="width: 100%">
            <el-option label="通过" value="pass" />
            <el-option label="不通过" value="reject" />
            <el-option label="待评估" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item label="Offer状态" required>
          <el-select v-model="interviewResultForm.offerStatus" placeholder="请选择Offer状态" style="width: 100%">
            <el-option label="已录用" value="offered" />
            <el-option label="已拒绝" value="rejected" />
            <el-option label="待处理" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="interviewResultForm.remark" type="textarea" rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="interviewResultDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveInterviewResult">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, InfoFilled, User, Clock, ArrowLeft, Close } from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()
const route = useRoute()

// 面试详情数据
const interviewDetail = ref({
  id: 'FI001',
  laborCompany: '深圳市某某劳务派遣有限公司',
  interviewTime: '2024-02-27 10:00:00',
  interviewLocation: '东莞长安工业区面试点',
  factoryContact: '李四',
  factoryContactPhone: '13900139000',
  candidateCount: 10,
  interviewType: '现场面试',
  interviewMethod: '集体面试',
  status: 'pending',
  createTime: '2024-02-25 10:00:00',
  creator: '张三'
})

// 面试人员列表
const candidateList = ref([
  {
    id: '1',
    isReturnWorker: false,
    name: '李四',
    phone: '13900139000',
    age: 28,
    gender: '男',
    recommendationLevel: 'A',
    imageLevel: 'A',
    education: '高中',
    positionCategory: '普工',
    expectedLocation: '深圳市',
    recommendationReason: '工作经验丰富，沟通能力强',
    interviewResult: 'pending',
    offerStatus: 'pending'
  },
  {
    id: '2',
    isReturnWorker: true,
    name: '王五',
    phone: '13700137000',
    age: 32,
    gender: '男',
    recommendationLevel: 'B',
    imageLevel: 'B',
    education: '初中',
    positionCategory: '普工',
    expectedLocation: '深圳市',
    recommendationReason: '态度端正，学习能力强',
    interviewResult: 'pending',
    offerStatus: 'pending'
  }
])

// 操作记录
const operationRecords = ref([
  {
    time: '2024-02-25 10:00:00',
    operator: '张三',
    action: '创建工厂面试',
    remark: '创建到东莞长安工业区的工厂面试，面试人数10人'
  }
])

// 工人详情右侧栏
const workerDetailVisible = ref(false)
const selectedWorker = ref<any>(null)

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/interview/factory-interview/edit/${interviewDetail.value.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该工厂面试吗？删除后不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.back()
  }).catch(() => {})
}

// 查看工人详情
const handleViewWorker = (row: any) => {
  selectedWorker.value = row
  workerDetailVisible.value = true
}

// 面试结果对话框
const interviewResultDialogVisible = ref(false)
const currentCandidate = ref<any>(null)
const interviewResultForm = ref({
  interviewResult: '',
  offerStatus: '',
  remark: ''
})

// 打开面试结果对话框
const handleInterviewResult = (row: any) => {
  currentCandidate.value = row
  interviewResultForm.value = {
    interviewResult: row.interviewResult || 'pending',
    offerStatus: row.offerStatus || 'pending',
    remark: ''
  }
  interviewResultDialogVisible.value = true
}

// 保存面试结果
const handleSaveInterviewResult = () => {
  if (currentCandidate.value) {
    // 更新面试结果
    const index = candidateList.value.findIndex(item => item.id === currentCandidate.value.id)
    if (index !== -1) {
      candidateList.value[index].interviewResult = interviewResultForm.value.interviewResult
      candidateList.value[index].offerStatus = interviewResultForm.value.offerStatus
      
      // 添加操作记录
      operationRecords.value.unshift({
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        operator: '当前用户',
        action: `更新 ${currentCandidate.value.name} 的面试结果为 ${getInterviewResultText(interviewResultForm.value.interviewResult)}`,
        remark: interviewResultForm.value.remark || '无'
      })
      
      ElMessage.success('面试结果更新成功')
      interviewResultDialogVisible.value = false
    }
  }
}

// 获取面试结果类型
const getInterviewResultType = (result: string) => {
  const typeMap: Record<string, any> = {
    pass: 'success',
    reject: 'danger',
    pending: 'warning'
  }
  return typeMap[result] || 'info'
}

// 获取面试结果文本
const getInterviewResultText = (result: string) => {
  const textMap: Record<string, string> = {
    pass: '通过',
    reject: '不通过',
    pending: '待评估'
  }
  return textMap[result] || result
}

// 获取Offer状态类型
const getOfferStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    offered: 'success',
    rejected: 'danger',
    pending: 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取Offer状态文本
const getOfferStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    offered: '已录用',
    rejected: '已拒绝',
    pending: '待处理'
  }
  return textMap[status] || status
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待面试',
    in_progress: '面试中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || status
}

// 获取推荐等级类型
const getRecommendationLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    A: 'success',
    B: 'primary',
    C: 'warning',
    D: 'danger'
  }
  return typeMap[level] || 'info'
}

// 获取形象级别类型
const getImageLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    A: 'success',
    B: 'primary',
    C: 'warning',
    D: 'danger'
  }
  return typeMap[level] || 'info'
}

// 生命周期
onMounted(() => {
  const id = route.params.id
  // 根据ID加载面试详情
  console.log('加载面试详情:', id)
})
</script>

<style scoped>
.factory-interview-detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
}

.info-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.record-content {
  padding: 8px 0;
}

.record-operator {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.record-action {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.record-remark {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
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

/* 工人详情右侧栏 */
.worker-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.worker-sidebar.open {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.close-btn {
  font-size: 18px;
  color: #909399;
}

.close-btn:hover {
  color: #303133;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.sidebar-content .section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 16px 0 8px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.sidebar-content .section-title:first-child {
  margin-top: 0;
}

/* 蒙版样式 */
.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  transition: opacity 0.3s ease;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .factory-interview-detail-container {
    padding: 0;
  }

  .detail-content {
    padding: 12px;
    padding-bottom: 120px;
  }

  .detail-footer {
    left: 0;
    flex-direction: column;
    padding: 12px;
  }

  .detail-footer .el-button {
    width: 100%;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }

  .worker-sidebar {
    width: 100%;
    right: -100%;
  }
}
</style>
