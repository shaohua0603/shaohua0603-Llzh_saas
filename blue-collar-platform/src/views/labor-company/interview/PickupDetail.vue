<template>
  <div class="pickup-detail-container">
    <div class="detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border v-loading="loading">
          <el-descriptions-item label="接送编号">{{ pickupDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="车牌号">{{ pickupDetail.plateNumber }}</el-descriptions-item>
          <el-descriptions-item label="集合时间">{{ pickupDetail.pickupTime }}</el-descriptions-item>
          <el-descriptions-item label="起点">{{ pickupDetail.startPoint }}</el-descriptions-item>
          <el-descriptions-item label="终点">{{ pickupDetail.endPoint }}</el-descriptions-item>
          <el-descriptions-item label="接送人">{{ pickupDetail.pickupPerson }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ pickupDetail.manager }}</el-descriptions-item>
          <el-descriptions-item label="负责人电话">{{ pickupDetail.managerPhone }}</el-descriptions-item>
          <el-descriptions-item label="群号">{{ pickupDetail.groupNumber }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(pickupDetail.status)">
              {{ getStatusText(pickupDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="接送人数">{{ pickupDetail.workerCount }}</el-descriptions-item>
          <el-descriptions-item label="材料齐全人数">{{ pickupDetail.materialCompleteCount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ pickupDetail.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ pickupDetail.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2" v-if="pickupDetail.remark">
            {{ pickupDetail.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 接送人员卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><User /></el-icon>
            <span>接送人员清单</span>
          </div>
        </template>
        <el-table :data="pickupDetail.workers" border v-loading="loading">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="idCard" label="身份证号" width="180" />
          <el-table-column prop="jobCategory" label="岗位类别" width="100" />
          <el-table-column prop="jobIntention" label="岗位意向" width="120" />
          <el-table-column prop="expectedSalary" label="期望薪资" width="100" />
          <el-table-column prop="expectedWorkLocation" label="期望工作地址" width="120" />
          <el-table-column prop="materialComplete" label="材料齐全" width="100">
            <template #default="{ row }">
              <el-tag :type="row.materialComplete ? 'success' : 'danger'">
                {{ row.materialComplete ? '是' : '否' }}
              </el-tag>
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
        <el-timeline v-if="operationRecords.length > 0">
          <el-timeline-item
            v-for="(record, index) in operationRecords"
            :key="index"
            :timestamp="record.operationTime"
            placement="top"
          >
            <div class="record-content">
              <div class="record-operator">{{ record.operator }}</div>
              <div class="record-action">{{ record.operationContent }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无操作记录" />
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="warning" @click="handleEdit" v-permission="['interview:pickup:update']">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete" v-permission="['interview:pickup:delete']">
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
import { Edit, Delete, InfoFilled, Clock, ArrowLeft, User } from '@element-plus/icons-vue'
import { getPickupDetail, deletePickup, type PickupDetail } from '@/api/interviewApi'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const pickupDetail = ref<PickupDetail>({
  id: '',
  plateNumber: '',
  pickupTime: '',
  startPoint: '',
  endPoint: '',
  pickupPerson: '',
  manager: '',
  managerPhone: '',
  groupNumber: '',
  status: 'pending',
  workerCount: 0,
  materialCompleteCount: 0,
  workers: [],
  createTime: '',
  updateTime: ''
})

const operationRecords = ref<any[]>([])

const handleBack = () => {
  router.back()
}

const handleEdit = () => {
  router.push(`/tenant/interview/pickup/edit/${pickupDetail.value.id}`)
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该接送信息吗？删除后不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePickup(pickupDetail.value.id)
      ElMessage.success('删除成功')
      router.back()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('API调用错误:', error)
    }
  }).catch(() => {})
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待接送',
    in_progress: '接送中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || status
}

const loadPickupDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('接送ID不存在')
    router.back()
    return
  }
  
  loading.value = true
  try {
    const response = await getPickupDetail(id)
    pickupDetail.value = response.data
    operationRecords.value = response.data.operationRecords || []
  } catch (error) {
    ElMessage.error('获取接送详情失败')
    console.error('API调用错误:', error)
    router.back()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPickupDetail()
})
</script>

<style scoped>
/* 详情页容器 - 使用flex布局实现内部滚动 */
.pickup-detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 内容区域 - 垂直滚动 */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 底部按钮栏 - 固定悬浮 */
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

.info-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .detail-content {
    padding: 12px;
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }

  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }
}
</style>
