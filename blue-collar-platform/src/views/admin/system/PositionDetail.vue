<template>
  <div class="position-detail-container" v-loading="loading">
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>岗位详情</span>
          <el-button type="primary" link @click="handleBack">
            返回
          </el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="岗位名称">
          {{ positionDetail?.positionName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="所属部门">
          {{ positionDetail?.departmentName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="数据权限">
          <el-tag :type="DataPermissionTypeDict[positionDetail?.dataPermissionType]?.color">
            {{ DataPermissionTypeDict[positionDetail?.dataPermissionType]?.label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="自定义部门" :span="2">
          <div v-if="positionDetail?.customDepartmentNames && positionDetail.customDepartmentNames.length > 0">
            <el-tag
              v-for="(dept, index) in positionDetail.customDepartmentNames"
              :key="index"
              style="margin-right: 8px; margin-bottom: 8px"
            >
              {{ dept }}
            </el-tag>
          </div>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="菜单权限" :span="2">
          <div v-if="positionDetail?.menuPermissionNames && positionDetail.menuPermissionNames.length > 0">
            <el-tag
              v-for="(menu, index) in positionDetail.menuPermissionNames"
              :key="index"
              style="margin-right: 8px; margin-bottom: 8px"
              type="success"
            >
              {{ menu }}
            </el-tag>
          </div>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="岗位描述" :span="2">
          {{ positionDetail?.description || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="岗位状态">
          <el-tag :type="positionDetail?.status === 'enabled' ? 'success' : 'info'">
            {{ positionDetail?.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">
          {{ positionDetail?.createdBy || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(positionDetail?.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新人">
          {{ positionDetail?.updatedBy || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDate(positionDetail?.updatedAt) }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="detail-actions">
        <el-button type="primary" @click="handleEdit">
          编辑
        </el-button>
        <el-button type="danger" @click="handleDelete">
          删除
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePositionStore } from '@/stores/position'
import { DataPermissionTypeDict, type PositionDetail } from '@/types/system/positionTypes'

const route = useRoute()
const router = useRouter()
const positionStore = usePositionStore()

const loading = ref(false)
const positionDetail = ref<PositionDetail | null>(null)

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const loadPositionDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    positionDetail.value = await positionStore.fetchPositionDetail(id)
  } catch (error) {
    console.error('获取岗位详情失败:', error)
    ElMessage.error('获取岗位详情失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  if (positionDetail.value) {
    router.push(`/admin/system/position/edit/${positionDetail.value.id}`)
  }
}

const handleDelete = async () => {
  if (!positionDetail.value) return

  try {
    await ElMessageBox.confirm(
      `确定要删除岗位"${positionDetail.value.positionName}"吗？`,
      '提示',
      {
        type: 'warning'
      }
    )
    await positionStore.deletePosition(positionDetail.value.id)
    ElMessage.success('删除成功')
    router.push('/admin/system/position')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleBack = () => {
  router.push('/admin/system/position')
}

onMounted(() => {
  loadPositionDetail()
})
</script>

<style scoped>
.position-detail-container {
  padding: 20px;
}

.detail-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

@media screen and (max-width: 768px) {
  .detail-card {
    max-width: 100%;
  }

  .detail-actions {
    flex-direction: column;
  }

  .detail-actions > * {
    width: 100%;
  }
}
</style>
