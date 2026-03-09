<template>
  <div class="interview-invitation-detail-container">
    <div class="detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="邀约编号">{{ invitationDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="工厂名称">{{ invitationDetail.factoryName }}</el-descriptions-item>
          <el-descriptions-item label="统一社会信用代码">{{ invitationDetail.socialCreditCode }}</el-descriptions-item>
          <el-descriptions-item label="对接人">{{ invitationDetail.contactPerson }}</el-descriptions-item>
          <el-descriptions-item label="对接人手机号">{{ invitationDetail.contactPhone }}</el-descriptions-item>
          <el-descriptions-item label="面试时间">{{ invitationDetail.interviewTime }}</el-descriptions-item>
          <el-descriptions-item label="面试地点">{{ invitationDetail.interviewLocation }}</el-descriptions-item>
          <el-descriptions-item label="面试人">{{ invitationDetail.interviewer }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ invitationDetail.manager }}</el-descriptions-item>
          <el-descriptions-item label="负责人手机号">{{ invitationDetail.managerPhone }}</el-descriptions-item>
          <el-descriptions-item label="面试人数">{{ invitationDetail.candidateCount }}人</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ invitationDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ invitationDetail.creator }}</el-descriptions-item>
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
          <el-table-column prop="idCard" label="身份证号" width="180" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="gender" label="性别" width="80" />
          <el-table-column prop="recommendationLevel" label="推荐等级" width="100">
            <template #default="{ row }">
              <el-tag :type="getRecommendationLevelType(row.recommendationLevel)">
                {{ getRecommendationLevelText(row.recommendationLevel) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="imageLevel" label="形象" width="100">
            <template #default="{ row }">
              <el-tag :type="getImageLevelType(row.imageLevel)">
                {{ getImageLevelText(row.imageLevel) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="education" label="学历" width="100" />
          <el-table-column prop="positionCategory" label="岗位类别" width="120" />
          <el-table-column prop="expectedLocation" label="期望工作地址" width="150" />
          <el-table-column prop="materialsComplete" label="材料是否齐全" width="120">
            <template #default="{ row }">
              <el-tag :type="row.materialsComplete ? 'success' : 'danger'">
                {{ row.materialsComplete ? '齐全' : '不齐全' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="recommendationReason" label="推荐理由" width="200" />
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
            :timestamp="record.operationTime"
            placement="top"
          >
            <div class="record-content">
              <div class="record-operator">{{ record.operator }}</div>
              <div class="record-action">{{ record.operationType }}</div>
              <div class="record-remark" v-if="record.operationContent">{{ record.operationContent }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, InfoFilled, User, Clock, ArrowLeft } from '@element-plus/icons-vue'
import type { InterviewInvitationDetail, InterviewCandidate } from '@/api/interviewApi'

// 路由实例
const router = useRouter()
const route = useRoute()

// 邀约详情数据
const invitationDetail = ref<InterviewInvitationDetail>({
  id: 'INV001',
  factoryName: '东莞长安工业区',
  socialCreditCode: '91440300MA5DXXXXXX',
  contactPerson: '张三',
  contactPhone: '13800138000',
  interviewTime: '2024-02-27 10:00:00',
  interviewLocation: '东莞长安工业区面试点',
  interviewer: '李四',
  manager: '王五',
  managerPhone: '13900139000',
  candidateCount: 10,
  createTime: '2024-02-25 10:00:00',
  creator: '王五',
  factoryInfo: {
    id: 'factory1',
    name: '东莞长安工业区',
    socialCreditCode: '91440300MA5DXXXXXX',
    contactPerson: '张三',
    contactPhone: '13800138000'
  },
  interviewer: '李四',
  candidates: [],
  operationRecords: []
})

// 面试人员列表
const candidateList = ref<InterviewCandidate[]>([
  {
    isReturnWorker: false,
    name: '李四',
    phone: '13900139000',
    idCard: '440***********1234',
    age: 28,
    gender: '男',
    recommendationLevel: '优先推荐',
    imageLevel: '优秀',
    education: '高中',
    positionCategory: '普工',
    expectedLocation: '深圳市',
    materialsComplete: true,
    recommendationReason: '工作经验丰富，沟通能力强'
  },
  {
    isReturnWorker: true,
    name: '王五',
    phone: '13700137000',
    idCard: '440***********5678',
    age: 32,
    gender: '男',
    recommendationLevel: '一般',
    imageLevel: '一般',
    education: '初中',
    positionCategory: '普工',
    expectedLocation: '深圳市',
    materialsComplete: true,
    recommendationReason: '态度端正，学习能力强'
  }
])

// 操作记录
const operationRecords = ref([
  {
    id: '1',
    operationType: '创建面试邀约',
    operator: '王五',
    operationTime: '2024-02-25 10:00:00',
    operationContent: '创建到东莞长安工业区的面试邀约，面试人数10人'
  }
])

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/interview/invitation/edit/${invitationDetail.value.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该面试邀约吗？删除后不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.back()
  }).catch(() => {})
}

// 获取推荐等级类型
const getRecommendationLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    '优先推荐': 'success',
    '一般': 'primary',
    '不建议': 'danger'
  }
  return typeMap[level] || 'info'
}

// 获取推荐等级文本
const getRecommendationLevelText = (level: string) => {
  return level || ''
}

// 获取形象类型
const getImageLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    '优秀': 'success',
    '一般': 'primary',
    '其他': 'info'
  }
  return typeMap[level] || 'info'
}

// 获取形象文本
const getImageLevelText = (level: string) => {
  return level || ''
}

// 生命周期
onMounted(() => {
  const id = route.params.id
  // 根据ID加载邀约详情
  console.log('加载邀约详情:', id)
})
</script>

<style scoped>
.interview-invitation-detail-container {
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .interview-invitation-detail-container {
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
}
</style>
