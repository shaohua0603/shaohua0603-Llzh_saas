<template>
  <div class="tenant-info-container">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="租户名称/信用代码/手机号"
            clearable
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="套餐名称">
          <el-select
            v-model="queryParams.packageId"
            placeholder="请选择套餐"
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="item in packageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="租户状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="item in Object.values(TenantStatusDict)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <el-button
        type="primary"
        :icon="Plus"
        @click="handleAdd"
      >
        新增
      </el-button>
      <el-button
        :icon="Delete"
        :disabled="selectedIds.length === 0"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
      <el-button
        :icon="Download"
        @click="handleExport"
      >
        导出
      </el-button>
    </div>

    <!-- 列表区域 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tenantList"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column
          prop="tenantName"
          label="租户名称"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="creditCode"
          label="统一社会信用代码"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="businessLicense"
          label="营业执照"
          min-width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-button
              v-if="row.businessLicense"
              type="primary"
              link
              @click="handlePreviewLicense(row)"
            >
              预览
            </el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="adminName"
          label="管理员姓名"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="adminPhone"
          label="管理员手机号"
          width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="contactName"
          label="联系人姓名"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="contactPhone"
          label="联系人手机号"
          width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="packageName"
          label="套餐名称"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createdAt"
          label="创建时间"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag :type="TenantStatusDict[row.status]?.color">
              {{ TenantStatusDict[row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="320"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              link
              @click="handleDetail(row)"
            >
              详情
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="success"
              link
              @click="handleEnable(row)"
              v-if="row.status === 'disabled'"
            >
              启用
            </el-button>
            <el-button
              size="small"
              type="warning"
              link
              @click="handleDisable(row)"
              v-if="row.status === 'enabled'"
            >
              禁用
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 营业执照预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="营业执照预览"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="license-preview">
        <el-image
          v-if="currentLicense"
          :src="currentLicense"
          fit="contain"
          style="width: 100%; height: 500px"
        />
        <el-empty v-else description="暂无营业执照" />
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download } from '@element-plus/icons-vue'
import { useTenantStore } from '@/stores/tenant'
import {
  TenantStatusDict
} from '@/types/system/tenantTypes'
import type { Tenant, TenantQueryParams } from '@/types/system/tenantTypes'

const router = useRouter()
const tenantStore = useTenantStore()

const loading = ref(false)
const tenantList = ref<Tenant[]>([])
const selectedIds = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const packageOptions = ref<Array<{ label: string; value: string }>>([])
const previewVisible = ref(false)
const currentLicense = ref('')

const queryParams = reactive<TenantQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  packageId: undefined,
  status: undefined
})

/**
 * 格式化日期
 * @param date 日期字符串
 */
const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

/**
 * 获取套餐选项
 */
const fetchPackageOptions = async () => {
  try {
    const options = await tenantStore.fetchPackageOptions()
    packageOptions.value = options || []
  } catch (error) {
    console.error('获取套餐选项失败:', error)
  }
}

/**
 * 获取租户列表数据
 */
const fetchData = async () => {
  loading.value = true
  try {
    await tenantStore.fetchTenantList({
      ...queryParams,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    tenantList.value = tenantStore.tenantList
    total.value = tenantStore.total
  } catch (error) {
    console.error('获取租户列表失败:', error)
    ElMessage.error('获取租户列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 查询
 */
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.packageId = undefined
  queryParams.status = undefined
  currentPage.value = 1
  fetchData()
}

/**
 * 新增租户
 */
const handleAdd = () => {
  router.push('/admin/tenant-management/tenant-info/add')
}

/**
 * 编辑租户
 * @param row 租户信息
 */
const handleEdit = (row: Tenant) => {
  router.push(`/admin/tenant-management/tenant-info/edit/${row.id}`)
}

/**
 * 查看
 * @param row 租户信息
 */
const handleDetail = (row: Tenant) => {
  router.push(`/admin/tenant-management/tenant-info/${row.id}`)
}

/**
 * 删除租户
 * @param row 租户信息
 */
const handleDelete = async (row: Tenant) => {
  try {
    await ElMessageBox.confirm(`确定要删除租户"${row.tenantName}"吗？`, '提示', {
      type: 'warning'
    })
    await tenantStore.deleteTenant(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.info('已取消删除')
  }
}

/**
 * 启用租户
 * @param row 租户信息
 */
const handleEnable = async (row: Tenant) => {
  try {
    await ElMessageBox.confirm(`确定要启用租户"${row.tenantName}"吗？`, '提示', {
      type: 'warning'
    })
    await tenantStore.enableTenant(row.id)
    ElMessage.success('启用成功')
    fetchData()
  } catch {
    ElMessage.info('已取消启用')
  }
}

/**
 * 禁用租户
 * @param row 租户信息
 */
const handleDisable = async (row: Tenant) => {
  try {
    await ElMessageBox.confirm(`确定要禁用租户"${row.tenantName}"吗？`, '提示', {
      type: 'warning'
    })
    await tenantStore.disableTenant(row.id)
    ElMessage.success('禁用成功')
    fetchData()
  } catch {
    ElMessage.info('已取消禁用')
  }
}

/**
 * 预览营业执照
 * @param row 租户信息
 */
const handlePreviewLicense = (row: Tenant) => {
  currentLicense.value = row.businessLicense
  previewVisible.value = true
}

/**
 * 表格选择变化
 * @param selection 选中的数据
 */
const handleSelectionChange = (selection: Tenant[]) => {
  selectedIds.value = selection.map(item => item.id)
}

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的租户')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedIds.value.length}个租户吗？`, '提示', {
      type: 'warning'
    })
    await tenantStore.batchDeleteTenants(selectedIds.value)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    fetchData()
  } catch {
    ElMessage.info('已取消删除')
  }
}

/**
 * 导出
 */
const handleExport = async () => {
  try {
    const blob = await tenantStore.exportTenants(queryParams)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `租户列表_${new Date().getTime()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

/**
 * 分页大小变化
 * @param size 分页大小
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

/**
 * 当前页变化
 * @param page 当前页
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

onMounted(() => {
  fetchPackageOptions()
  fetchData()
})
</script>

<style scoped>
.tenant-info-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 16px 20px;
}

.license-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-bar > * {
    width: 100%;
    margin-bottom: 12px;
  }
}
</style>
