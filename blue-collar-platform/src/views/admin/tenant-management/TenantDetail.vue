<template>
  <div class="tenant-detail-container">
    <el-card v-loading="loading" class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">租户详情</span>
          <div class="header-actions">
            <el-button
              type="primary"
              :icon="Edit"
              @click="handleEdit"
            >
              编辑
            </el-button>
            <el-button
              :icon="Back"
              @click="handleBack"
            >
              返回
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="tenantDetail" class="detail-content">
        <!-- 基本信息 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><InfoFilled /></el-icon>
            基本信息
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="租户名称">
              {{ tenantDetail.tenantName }}
            </el-descriptions-item>
            <el-descriptions-item label="统一社会信用代码">
              {{ tenantDetail.creditCode }}
            </el-descriptions-item>
            <el-descriptions-item label="租户类型">
              <el-tag :type="TenantTypeDict[tenantDetail.tenantType]?.color">
                {{ TenantTypeDict[tenantDetail.tenantType]?.label }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="套餐名称">
              {{ tenantDetail.packageName }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="TenantStatusDict[tenantDetail.status]?.color">
                {{ TenantStatusDict[tenantDetail.status]?.label }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(tenantDetail.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ formatDate(tenantDetail.updatedAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="创建人">
              {{ tenantDetail.createdBy }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 营业执照 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            营业执照
          </div>
          <div class="license-section">
            <el-image
              v-if="tenantDetail.businessLicense"
              :src="tenantDetail.businessLicense"
              fit="contain"
              style="width: 300px; height: 400px"
              :preview-src-list="[tenantDetail.businessLicense]"
              preview-teleported
            />
            <el-empty v-else description="暂无营业执照" :image-size="100" />
          </div>
        </div>

        <!-- 管理员信息 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><User /></el-icon>
            管理员信息
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="管理员姓名">
              {{ tenantDetail.adminName }}
            </el-descriptions-item>
            <el-descriptions-item label="管理员手机号">
              {{ tenantDetail.adminPhone }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 联系人信息 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><Phone /></el-icon>
            联系人信息
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="联系人姓名">
              {{ tenantDetail.contactName }}
            </el-descriptions-item>
            <el-descriptions-item label="联系人手机号">
              {{ tenantDetail.contactPhone }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <el-empty v-else description="暂无数据" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit, Back, InfoFilled, Document, User, Phone } from '@element-plus/icons-vue'
import { useTenantStore } from '@/stores/tenant'
import {
  TenantStatusDict,
  TenantTypeDict
} from '@/types/system/tenantTypes'
import type { TenantDetail as TenantDetailType } from '@/types/system/tenantTypes'

const router = useRouter()
const route = useRoute()
const tenantStore = useTenantStore()

const loading = ref(false)
const tenantDetail = ref<TenantDetailType | null>(null)

/**
 * 格式化日期
 * @param date 日期字符串
 */
const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

/**
 * 获取租户详情
 */
const fetchTenantDetail = async (id: string) => {
  loading.value = true
  try {
    const detail = await tenantStore.fetchTenantDetail(id)
    tenantDetail.value = detail
  } catch (error) {
    console.error('获取租户详情失败:', error)
    ElMessage.error('获取租户详情失败')
  } finally {
    loading.value = false
  }
}

/**
 * 编辑
 */
const handleEdit = () => {
  const id = route.params.id as string
  router.push(`/admin/tenant-management/tenant-info/edit/${id}`)
}

/**
 * 返回
 */
const handleBack = () => {
  router.back()
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    fetchTenantDetail(id)
  }
})
</script>

<style scoped>
.tenant-detail-container {
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

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.detail-content {
  padding: 20px 0;
}

.info-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.license-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
  background-color: #f5f7fa;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell.is-bordered-label) {
  font-weight: 600;
  background-color: #f5f7fa;
}

@media screen and (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions > * {
    flex: 1;
  }

  :deep(.el-descriptions) {
    --el-descriptions-table-column-width: 50%;
  }
}
</style>
