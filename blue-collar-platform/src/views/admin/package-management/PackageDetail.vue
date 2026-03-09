<template>
  <div class="package-detail-container">
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>套餐详情</span>
          <div class="header-actions">
            <el-button
              type="primary"
              :icon="Edit"
              @click="handleEdit"
            >
              编辑
            </el-button>
            <el-button
              type="success"
              :icon="Check"
              @click="handleEnable"
              v-if="packageDetail?.status === 'disabled'"
            >
              启用
            </el-button>
            <el-button
              type="warning"
              :icon="Close"
              @click="handleDisable"
              v-if="packageDetail?.status === 'enabled'"
            >
              禁用
            </el-button>
            <el-button
              type="danger"
              :icon="Delete"
              @click="handleDelete"
            >
              删除
            </el-button>
            <el-button @click="handleBack">
              返回
            </el-button>
          </div>
        </div>
      </template>

      <el-descriptions
        v-if="packageDetail"
        :column="2"
        border
        class="detail-descriptions"
      >
        <el-descriptions-item label="套餐名称">
          {{ packageDetail.packageName }}
        </el-descriptions-item>
        <el-descriptions-item label="适合租户">
          <el-tag :type="TenantTypeDict[packageDetail.tenantType]?.color">
            {{ TenantTypeDict[packageDetail.tenantType]?.label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="套餐描述" :span="2">
          {{ packageDetail.packageDescription }}
        </el-descriptions-item>
        <el-descriptions-item label="金额">
          <span class="amount-text">¥{{ packageDetail.amount.toFixed(2) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="到期频率">
          {{ ExpiryFrequencyDict[packageDetail.expiryFrequency]?.label }}
          <span class="frequency-desc">
            ({{ ExpiryFrequencyDict[packageDetail.expiryFrequency]?.description }})
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="正式员工账户数">
          <span class="count-text">{{ packageDetail.employeeAccountCount }}个</span>
        </el-descriptions-item>
        <el-descriptions-item label="背调工人数量">
          <span class="count-text">{{ packageDetail.backgroundCheckWorkerCount }}个</span>
        </el-descriptions-item>
        <el-descriptions-item label="套餐状态">
          <el-tag :type="PackageStatusDict[packageDetail.status]?.color">
            {{ PackageStatusDict[packageDetail.status]?.label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="授权菜单" :span="2">
          <div v-if="packageDetail.menuIds && packageDetail.menuIds.length > 0" class="menu-list">
            <el-tag
              v-for="menuId in packageDetail.menuIds"
              :key="menuId"
              class="menu-tag"
            >
              {{ getMenuNameById(menuId) }}
            </el-tag>
          </div>
          <div v-else class="no-menu">
            未授权任何菜单
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(packageDetail.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDate(packageDetail.updatedAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="创建人">
          {{ packageDetail.createdBy }}
        </el-descriptions-item>
        <el-descriptions-item label="更新人">
          {{ packageDetail.updatedBy }}
        </el-descriptions-item>
      </el-descriptions>

      <el-empty v-else description="暂无数据" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Check, Close, Delete } from '@element-plus/icons-vue'
import { usePackageStore } from '@/stores/package'
import {
  PackageStatusDict,
  ExpiryFrequencyDict,
  TenantTypeDict
} from '@/types/system/packageTypes'
import type { PackageDetail } from '@/types/system/packageTypes'
import * as menuApi from '@/api/system/menuApi'

const router = useRouter()
const route = useRoute()
const packageStore = usePackageStore()

const packageDetail = ref<PackageDetail | null>(null)
const loading = ref(false)
const menuTree = ref<any[]>([])

/**
 * 格式化日期
 * @param date 日期字符串
 */
const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

/**
 * 获取菜单树
 */
const fetchMenuTree = async () => {
  try {
    const response = await menuApi.getMenuTree({ menuStatus: 'enabled' })
    menuTree.value = response.data
  } catch (error) {
    console.error('获取菜单树失败:', error)
  }
}

/**
 * 根据菜单ID获取菜单名称
 * @param menuId 菜单ID
 */
const getMenuNameById = (menuId: number) => {
  const findMenu = (menus: any[]): string => {
    for (const menu of menus) {
      if (menu.id === menuId) return menu.menuName
      if (menu.children) {
        const found = findMenu(menu.children)
        if (found) return found
      }
    }
    return `菜单ID: ${menuId}`
  }
  return findMenu(menuTree.value)
}

/**
 * 获取套餐详情
 */
const fetchPackageDetail = async () => {
  try {
    loading.value = true
    const detail = await packageStore.fetchPackageDetail(route.params.id as string)
    packageDetail.value = detail
  } catch (error) {
    console.error('获取套餐详情失败:', error)
    ElMessage.error('获取套餐详情失败')
    handleBack()
  } finally {
    loading.value = false
  }
}

/**
 * 编辑套餐
 */
const handleEdit = () => {
  router.push(`/admin/package-management/package-info/edit/${route.params.id}`)
}

/**
 * 启用套餐
 */
const handleEnable = async () => {
  if (!packageDetail.value) return

  try {
    await ElMessageBox.confirm(`确定要启用套餐"${packageDetail.value.packageName}"吗？`, '提示', {
      type: 'warning'
    })
    await packageStore.enablePackage(route.params.id as string)
    ElMessage.success('启用成功')
    fetchPackageDetail()
  } catch {
    ElMessage.info('已取消启用')
  }
}

/**
 * 禁用套餐
 */
const handleDisable = async () => {
  if (!packageDetail.value) return

  try {
    await ElMessageBox.confirm(`确定要禁用套餐"${packageDetail.value.packageName}"吗？`, '提示', {
      type: 'warning'
    })
    await packageStore.disablePackage(route.params.id as string)
    ElMessage.success('禁用成功')
    fetchPackageDetail()
  } catch {
    ElMessage.info('已取消禁用')
  }
}

/**
 * 删除套餐
 */
const handleDelete = async () => {
  if (!packageDetail.value) return

  try {
    await ElMessageBox.confirm(`确定要删除套餐"${packageDetail.value.packageName}"吗？`, '提示', {
      type: 'warning'
    })
    await packageStore.deletePackage(route.params.id as string)
    ElMessage.success('删除成功')
    handleBack()
  } catch {
    ElMessage.info('已取消删除')
  }
}

/**
 * 返回列表
 */
const handleBack = () => {
  router.push('/admin/package-management/package-info')
}

onMounted(async () => {
  await fetchMenuTree()
  await fetchPackageDetail()
})
</script>

<style scoped>
.package-detail-container {
  padding: 20px;
}

.detail-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.detail-descriptions {
  margin-top: 20px;
}

.amount-text {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.frequency-desc {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}

.count-text {
  font-weight: bold;
  color: #409eff;
}

.menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.menu-tag {
  margin-bottom: 8px;
}

.no-menu {
  color: #909399;
  font-style: italic;
  margin-top: 4px;
}

@media screen and (max-width: 768px) {
  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-actions > * {
    flex: 1;
    min-width: 80px;
  }

  :deep(.el-descriptions) {
    --el-descriptions-table-border: 1px solid #ebeef5;
  }

  :deep(.el-descriptions__label) {
    width: 120px;
  }

  .menu-list {
    flex-direction: column;
  }

  .menu-tag {
    width: 100%;
    text-align: center;
  }
}
</style>
