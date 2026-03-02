<template>
  <div class="package-info-container">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="套餐名称">
          <el-input
            v-model="queryParams.packageName"
            placeholder="请输入套餐名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="适合租户">
          <el-select
            v-model="queryParams.tenantType"
            placeholder="请选择适合租户"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in Object.values(TenantTypeDict)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择套餐状态"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in Object.values(PackageStatusDict)"
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
        :data="packageList"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column
          prop="packageName"
          label="套餐名称"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="packageDescription"
          label="套餐描述"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="tenantType"
          label="适合租户"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag :type="TenantTypeDict[row.tenantType]?.color">
              {{ TenantTypeDict[row.tenantType]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            ¥{{ row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="expiryFrequency"
          label="到期频率"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ ExpiryFrequencyDict[row.expiryFrequency]?.label }}
          </template>
        </el-table-column>
        <el-table-column
          prop="employeeAccountCount"
          label="正式员工账户数"
          width="140"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.employeeAccountCount }}个
          </template>
        </el-table-column>
        <el-table-column
          prop="backgroundCheckWorkerCount"
          label="背调工人数量"
          width="140"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.backgroundCheckWorkerCount }}个
          </template>
        </el-table-column>
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
            <el-tag :type="PackageStatusDict[row.status]?.color">
              {{ PackageStatusDict[row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="280"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download } from '@element-plus/icons-vue'
import { usePackageStore } from '@/stores/package'
import {
  PackageStatusDict,
  ExpiryFrequencyDict,
  TenantTypeDict
} from '@/types/system/packageTypes'
import type { Package, PackageQueryParams } from '@/types/system/packageTypes'

const router = useRouter()
const packageStore = usePackageStore()

const loading = ref(false)
const packageList = ref<Package[]>([])
const selectedIds = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const queryParams = reactive<PackageQueryParams>({
  page: 1,
  pageSize: 10,
  packageName: '',
  tenantType: undefined,
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
 * 获取套餐列表数据
 */
const fetchData = async () => {
  loading.value = true
  try {
    await packageStore.fetchPackageList({
      ...queryParams,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    packageList.value = packageStore.packageList
    total.value = packageStore.total
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    ElMessage.error('获取套餐列表失败')
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
  queryParams.packageName = ''
  queryParams.tenantType = undefined
  queryParams.status = undefined
  currentPage.value = 1
  fetchData()
}

/**
 * 新增套餐
 */
const handleAdd = () => {
  router.push('/admin/package-management/package-info/add')
}

/**
 * 编辑套餐
 * @param row 套餐信息
 */
const handleEdit = (row: Package) => {
  router.push(`/admin/package-management/package-info/edit/${row.id}`)
}

/**
 * 查看详情
 * @param row 套餐信息
 */
const handleDetail = (row: Package) => {
  router.push(`/admin/package-management/package-info/${row.id}`)
}

/**
 * 删除套餐
 * @param row 套餐信息
 */
const handleDelete = async (row: Package) => {
  try {
    await ElMessageBox.confirm(`确定要删除套餐"${row.packageName}"吗？`, '提示', {
      type: 'warning'
    })
    await packageStore.deletePackage(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.info('已取消删除')
  }
}

/**
 * 启用套餐
 * @param row 套餐信息
 */
const handleEnable = async (row: Package) => {
  try {
    await ElMessageBox.confirm(`确定要启用套餐"${row.packageName}"吗？`, '提示', {
      type: 'warning'
    })
    await packageStore.enablePackage(row.id)
    ElMessage.success('启用成功')
    fetchData()
  } catch {
    ElMessage.info('已取消启用')
  }
}

/**
 * 禁用套餐
 * @param row 套餐信息
 */
const handleDisable = async (row: Package) => {
  try {
    await ElMessageBox.confirm(`确定要禁用套餐"${row.packageName}"吗？`, '提示', {
      type: 'warning'
    })
    await packageStore.disablePackage(row.id)
    ElMessage.success('禁用成功')
    fetchData()
  } catch {
    ElMessage.info('已取消禁用')
  }
}

/**
 * 表格选择变化
 * @param selection 选中的数据
 */
const handleSelectionChange = (selection: Package[]) => {
  selectedIds.value = selection.map(item => item.id)
}

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的套餐')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedIds.value.length}个套餐吗？`, '提示', {
      type: 'warning'
    })
    await packageStore.batchDeletePackages(selectedIds.value)
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
    const blob = await packageStore.exportPackages(queryParams)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `套餐列表_${new Date().getTime()}.xlsx`
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
  fetchData()
})
</script>

<style scoped>
.package-info-container {
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
