<template>
  <div class="admin-expense-query-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" :inline="true" label-width="auto">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="搜索租户名称、套餐名称"
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="租户">
          <el-select
            v-model="queryParams.tenantId"
            placeholder="请选择租户"
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="tenant in tenantList"
              :key="tenant.id"
              :label="tenant.name"
              :value="tenant.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐">
          <el-select
            v-model="queryParams.packageId"
            placeholder="请选择套餐"
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="pkg in packageList"
              :key="pkg.id"
              :label="pkg.name"
              :value="pkg.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="(label, value) in ExpenseStatusText"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结算时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button type="primary" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>

    <!-- 表格区域 -->
    <CommonTable
      :data="tableData"
      :columns="columns"
      :table-id="tableId"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
    >
      <template #column-amount="{ row }">
        <span class="amount">¥{{ row.amount?.toFixed(2) }}</span>
      </template>
      <template #column-actualAmount="{ row }">
        <span class="amount">¥{{ row.actualAmount?.toFixed(2) }}</span>
      </template>
      <template #column-discount="{ row }">
        {{ row.discount }}%
      </template>
      <template #column-status="{ row }">
        <el-tag :type="ExpenseStatusTagType[row.status]">
          {{ row.statusText }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleViewDetail(row)">
          查看详情
        </el-button>
      </template>
    </CommonTable>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入费用数据" width="500px">
      <el-upload
        class="upload-demo"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处,或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持.xlsx/.xls格式文件
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDownloadTemplate">下载模板</el-button>
        <el-button type="primary" @click="handleImportConfirm" :loading="importing">
          确认导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  RefreshLeft,
  Upload,
  Download,
  UploadFilled
} from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { expenseApi } from '@/api/operations/expenseApi'
import {
  ExpenseStatus,
  ExpenseStatusText,
  ExpenseStatusTagType,
  type ExpenseRecord,
  type ExpenseQueryParams,
} from '@/types/operations/expense'

const router = useRouter()

// 表格ID
const tableId = 'admin-expense-query'

// 查询参数
const queryParams = reactive<ExpenseQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  tenantId: undefined,
  packageId: undefined,
  status: undefined,
  startTime: '',
  endTime: '',
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<ExpenseRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 租户列表
const tenantList = ref([
  { id: 1, name: 'XX劳务公司' },
  { id: 2, name: 'YY电子厂' },
  { id: 3, name: 'ZZ劳务公司' },
])

// 套餐列表
const packageList = ref([
  { id: 1, name: '基础版套餐' },
  { id: 2, name: '高级版套餐' },
  { id: 3, name: '企业版套餐' },
])

// 导入对话框
const importDialogVisible = ref(false)
const importing = ref(false)
const selectedFile = ref<File | null>(null)

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'tenantName', label: '租户名称', minWidth: 180, sortable: true },
  { prop: 'packageName', label: '套餐名称', width: 150, sortable: true },
  { prop: 'amount', label: '应结金额', width: 120, sortable: true },
  { prop: 'actualAmount', label: '实际金额', width: 120, sortable: true },
  { prop: 'discount', label: '折扣', width: 80 },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'payTime', label: '支付时间', width: 180, sortable: true },
  { prop: 'settleTime', label: '结算时间', width: 180, sortable: true },
  { prop: 'createdAt', label: '创建时间', width: 180, sortable: true },
]

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.startTime = dateRange.value[0]
      queryParams.endTime = dateRange.value[1]
    } else {
      queryParams.startTime = ''
      queryParams.endTime = ''
    }

    const response = await expenseApi.getExpenseList(queryParams)
    tableData.value = response.data.list
    total.value = response.data.total
    currentPage.value = response.data.page
    pageSize.value = response.data.pageSize
  } catch (error) {
    console.error('加载费用数据失败:', error)
    ElMessage.error('加载费用数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.tenantId = undefined
  queryParams.packageId = undefined
  queryParams.status = undefined
  dateRange.value = null
  queryParams.page = 1
  loadData()
}

// 分页变化
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  queryParams.page = 1
  loadData()
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  queryParams.sortField = sort.prop
  queryParams.sortOrder = sort.order === 'ascending' ? 'asc' : sort.order === 'descending' ? 'desc' : undefined
  loadData()
}

// 查看详情
const handleViewDetail = (row: ExpenseRecord) => {
  console.log('查看详情:', row)
  // TODO: 跳转到详情页
}

// 导入
const handleImport = () => {
  importDialogVisible.value = true
  selectedFile.value = null
}

// 文件选择
const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const blob = await expenseApi.downloadImportTemplate()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '费用导入模板.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('下载模板失败:', error)
    ElMessage.error('下载模板失败')
  }
}

// 确认导入
const handleImportConfirm = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  importing.value = true
  try {
    const response = await expenseApi.importExpense(selectedFile.value)
    if (response.data.failureCount > 0) {
      ElMessage.warning(`导入完成,成功${response.data.successCount}条,失败${response.data.failureCount}条`)
    } else {
      ElMessage.success(`导入成功,共${response.data.successCount}条`)
    }
    importDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}

// 导出
const handleExport = async () => {
  try {
    ElMessage.success('导出成功')
    // TODO: 调用导出API
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-expense-query-page {
  padding: 0;
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

.amount {
  color: #f56c6c;
  font-weight: 600;
}

.upload-demo {
  margin-bottom: 20px;
}
</style>
