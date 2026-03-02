<template>
  <div class="detail-container">
    <div class="detail-content">
      <el-card class="info-card">
        <template #header>
          <span class="section-title">基本信息</span>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="邀约编号">{{ interview.id }}</el-descriptions-item>
          <el-descriptions-item label="劳务公司">{{ interview.laborCompanyName }}</el-descriptions-item>
          <el-descriptions-item label="统一社会信用代码">{{ interview.socialCreditCode }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ interview.manager }}</el-descriptions-item>
          <el-descriptions-item label="负责人手机号">{{ interview.managerPhone }}</el-descriptions-item>
          <el-descriptions-item label="面试时间">{{ formatDate(interview.interviewTime) }}</el-descriptions-item>
          <el-descriptions-item label="面试地点" :span="2">{{ interview.interviewLocation }}</el-descriptions-item>
          <el-descriptions-item label="工厂对接人">{{ interview.factoryContactName }}</el-descriptions-item>
          <el-descriptions-item label="对接人手机号">{{ interview.factoryContactPhone }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(interview.status)">
              {{ getStatusText(interview.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(interview.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(interview.updatedAt) }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="3">{{ interview.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="info-card">
        <template #header>
          <span class="section-title">面试人员清单（{{ personList.length }}人）</span>
        </template>
        <el-table :data="personList" border>
          <el-table-column prop="isReturnWorker" label="是否返厂" width="100">
            <template #default="{ row }">
              <el-tag :type="row.isReturnWorker ? 'success' : 'info'">
                {{ row.isReturnWorker ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="handleViewWorker(row.workerId)">
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="{ row }">
              {{ row.gender === 'MALE' ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="recommendLevel" label="推荐等级" width="120">
            <template #default="{ row }">
              <el-tag :type="getRecommendLevelType(row.recommendLevel)">
                {{ formatRecommendLevel(row.recommendLevel) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="imageLevel" label="形象级别" width="120">
            <template #default="{ row }">
              {{ formatImageLevel(row.imageLevel) }}
            </template>
          </el-table-column>
          <el-table-column prop="education" label="学历" width="120" />
          <el-table-column prop="positionCategory" label="岗位类别" width="100">
            <template #default="{ row }">
              {{ formatPositionCategory(row.positionCategory) }}
            </template>
          </el-table-column>
          <el-table-column prop="expectedLocation" label="期望工作地址" width="150" />
          <el-table-column prop="recommendReason" label="推荐理由" min-width="200" show-overflow-tooltip />
        </el-table>
      </el-card>

      <el-card class="info-card">
        <template #header>
          <span class="section-title">操作记录</span>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="record in operationRecords"
            :key="record.id"
            :timestamp="formatDate(record.operationTime)"
            placement="top"
          >
            <p><strong>{{ record.operator }}</strong> {{ record.operationType }}</p>
            <p>{{ record.operationContent }}</p>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>

    <div class="detail-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
      <el-button @click="handlePrint">
        <el-icon><Printer /></el-icon>
        打印
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Edit, Delete, Printer } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFactoryInterviewDetail, deleteFactoryInterview, type FactoryInterviewDetail, type FactoryInterviewPerson } from '@/api/interviewApi'

const router = useRouter()
const route = useRoute()

const interview = ref<FactoryInterviewDetail | null>(null)
const personList = ref<FactoryInterviewPerson[]>([])
const operationRecords = ref<any[]>([])

onMounted(async () => {
  const id = route.params.id as string
  await loadInterviewDetail(id)
})

async function loadInterviewDetail(id: string) {
  try {
    const response = await getFactoryInterviewDetail(id)
    interview.value = response.data
    personList.value = response.data.persons || []
    operationRecords.value = response.data.operationRecords || []
  } catch (error) {
    ElMessage.error('获取面试详情失败')
    console.error('API调用错误:', error)
  }
}

function handleBack() {
  router.back()
}

function handleEdit() {
  router.push(`/factory/factory-interview/edit/${interview.value?.id}`)
}

async function handleDelete() {
  ElMessageBox.confirm('确定要删除这条面试邀约吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteFactoryInterview(interview.value?.id || '')
      ElMessage.success('删除成功')
      router.back()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('API调用错误:', error)
    }
  }).catch(() => {})
}

function handleViewWorker(workerId: string) {
  router.push(`/factory/workers/${workerId}`)
}

function handlePrint() {
  window.print()
}

function formatDate(date: string) {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    PENDING: 'info',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'danger'
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    PENDING: '待面试',
    IN_PROGRESS: '面试中',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  }
  return textMap[status] || status
}

function formatRecommendLevel(level: string) {
  const map = {
    PRIORITY: '优先推荐',
    NORMAL: '一般',
    NOT_RECOMMEND: '不建议'
  }
  return map[level] || level
}

function getRecommendLevelType(level: string) {
  const map = {
    PRIORITY: 'success',
    NORMAL: 'warning',
    NOT_RECOMMEND: 'danger'
  }
  return map[level] || 'info'
}

function formatImageLevel(level: string) {
  const map = {
    EXCELLENT: '优秀',
    NORMAL: '一般',
    OTHER: '其他'
  }
  return map[level] || level
}

function formatPositionCategory(category: string) {
  const map = {
    WORKER: '普工',
    TECHNICIAN: '技工',
    MANAGER: '干部'
  }
  return map[category] || category
}
</script>

<style scoped lang="scss">
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
  padding: 20px;
  padding-bottom: 80px;
}

.info-card {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
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
}
</style>
