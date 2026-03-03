<template>
  <div class="contract-page">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-default">
        <div class="filter-toggle-container">
          <el-form :model="searchForm" inline>
            <el-form-item label="姓名">
              <el-input
                v-model="searchForm.name"
                placeholder="请输入姓名"
                clearable
                style="width: 150px"
              />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                v-model="searchForm.phone"
                placeholder="请输入手机号"
                clearable
                style="width: 150px"
              />
            </el-form-item>
            <el-form-item label="合同状态">
              <el-select
                v-model="searchForm.contractStatus"
                placeholder="请选择合同状态"
                clearable
                style="width: 120px"
              >
                <el-option label="未签订" value="UNSIGNED" />
                <el-option label="签订中" value="SIGNING" />
                <el-option label="已签订" value="SIGNED" />
                <el-option label="已取消" value="CANCELLED" />
              </el-select>
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
          <el-button type="text" class="filter-toggle" @click="filterVisible = !filterVisible">
            {{ filterVisible ? '收起' : '展开' }}
            <el-icon>
              <component :is="filterVisible ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
          </el-button>
        </div>
      </div>
      <!-- 展开后显示的全部查询条件 -->
      <el-collapse-transition>
        <div v-show="filterVisible" class="filter-expanded">
          <el-form :model="searchForm" inline>
            <el-form-item label="证件号">
              <el-input
                v-model="searchForm.idCard"
                placeholder="请输入证件号"
                clearable
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="结算方式">
              <el-select
                v-model="searchForm.settlementMethod"
                placeholder="请选择结算方式"
                clearable
                style="width: 120px"
              >
                <el-option label="日结" value="DAILY" />
                <el-option label="月结" value="MONTHLY" />
              </el-select>
            </el-form-item>
            <el-form-item label="签订日期">
              <el-date-picker
                v-model="searchForm.signDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 240px"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增合同
      </el-button>
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button
        type="danger"
        :disabled="selectedRows.length === 0"
        @click="handleBatchDelete"
      >
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
    </div>

    <!-- 合同列表 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共 {{ total }} 份合同，其中未签订 {{ tableData.filter(item => item.contractStatus === 'UNSIGNED').length }} 份，签订中 {{ tableData.filter(item => item.contractStatus === 'SIGNING').length }} 份，已签订 {{ tableData.filter(item => item.contractStatus === 'SIGNED').length }} 份，已取消 {{ tableData.filter(item => item.contractStatus === 'CANCELLED').length }} 份</span>
      </div>
      <CommonTable
        :data="tableData"
        :columns="contractColumns"
        table-id="contract-list"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :loading="loading"
        :show-selection="true"
        :show-actions="true"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @sort-change="handleSortChange"
        @global-search="handleGlobalSearch"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <template #column-settlementMethod="{ row }">
          {{ getSettlementMethodText(row.settlementMethod) }}
        </template>
        <template #column-contractStatus="{ row }">
          <el-tag :type="getStatusType(row.contractStatus)">
            {{ getStatusText(row.contractStatus) }}
          </el-tag>
        </template>
        <template #column-contractAmount="{ row }">
          ¥{{ formatAmount(row.contractAmount) }}
        </template>
        <template #actions="{ row }">
          <el-button link type="primary" size="small" @click="handleView(row)">
            查看
          </el-button>
          <el-button
            v-if="row.contractStatus === 'UNSIGNED' || row.contractStatus === 'SIGNING'"
            link
            type="primary"
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.contractStatus === 'UNSIGNED' || row.contractStatus === 'SIGNING'"
            link
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <el-dialog
      v-model="showImportDialog"
      title="导入合同"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :limit="1"
        accept=".xlsx,.xls"
        @change="handleFileChange"
      >
        <el-button type="primary">选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xlsx/xls 文件，且不超过 10MB
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit" :loading="importing">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type UploadInstance, type UploadUserFile } from 'element-plus'
import { Plus, Download, Delete, Search, RefreshLeft, Upload, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

interface Contract {
  id: string
  name: string
  phone: string
  idCard: string
  signDate: string
  settlementMethod: string
  responsiblePerson: string
  groupId: string
  attachments: any[]
  contractStatus: string
}

interface ContractQueryParams {
  page: number
  pageSize: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  contractNo?: string
  partyBName?: string
  partyBPhone?: string
  settlementMethod?: string
  contractStatus?: string
  contractSignDateStart?: string
  contractSignDateEnd?: string
}

const ContractStatusConfig = {
  UNSIGNED: { code: 'UNSIGNED', name: '未签订', color: 'info' },
  SIGNING: { code: 'SIGNING', name: '签订中', color: 'warning' },
  SIGNED: { code: 'SIGNED', name: '已签订', color: 'success' },
  CANCELLED: { code: 'CANCELLED', name: '已取消', color: 'danger' }
}

const SettlementMethodConfig = {
  DAILY: { code: 'DAILY', name: '日结' },
  MONTHLY: { code: 'MONTHLY', name: '月结' }
}

const router = useRouter()

const tableRef = ref()
const uploadRef = ref<UploadInstance>()

const loading = ref(false)
const tableData = ref<Contract[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const sortField = ref('')
const sortOrder = ref<'ascending' | 'descending' | null>(null)
const selectedRows = ref<Contract[]>([])
const filterVisible = ref(false)

const showImportDialog = ref(false)
const importing = ref(false)
const importFile = ref<File | null>(null)

// 模拟合同数据
const mockContracts: Contract[] = [
  {
    id: '1',
    name: '张三',
    phone: '138****8001',
    idCard: '110101199001011234',
    signDate: '2024-01-15',
    settlementMethod: 'MONTHLY',
    responsiblePerson: '李四',
    groupId: '123456',
    attachments: [],
    contractStatus: 'SIGNED'
  },
  {
    id: '2',
    name: '李四',
    phone: '139****8002',
    idCard: '110101199001011235',
    signDate: '2024-01-20',
    settlementMethod: 'DAILY',
    responsiblePerson: '张三',
    groupId: '123457',
    attachments: [],
    contractStatus: 'SIGNING'
  },
  {
    id: '3',
    name: '王五',
    phone: '137****8003',
    idCard: '110101199001011236',
    signDate: '',
    settlementMethod: 'MONTHLY',
    responsiblePerson: '赵六',
    groupId: '123458',
    attachments: [],
    contractStatus: 'UNSIGNED'
  },
  {
    id: '4',
    name: '赵六',
    phone: '136****8004',
    idCard: '110101199001011237',
    signDate: '2024-01-05',
    settlementMethod: 'DAILY',
    responsiblePerson: '王五',
    groupId: '123459',
    attachments: [],
    contractStatus: 'CANCELLED'
  }
]

const searchForm = reactive({
  name: '',
  phone: '',
  idCard: '',
  settlementMethod: '',
  contractStatus: '',
  signDateRange: [],
  dataScope: '',
  departmentId: ''
})

// 合同列表列配置
const contractColumns: ColumnConfig[] = [
  { prop: 'name', label: '姓名', width: 100, sortable: true, showTooltip: true },
  { prop: 'phone', label: '手机号', width: 130, sortable: true, showTooltip: true },
  { prop: 'idCard', label: '证件号', width: 180, sortable: true, showTooltip: true },
  { prop: 'signDate', label: '签订日期', width: 120, sortable: true },
  { prop: 'settlementMethod', label: '结算方式', width: 100, sortable: true },
  { prop: 'responsiblePerson', label: '负责人', width: 100, sortable: true, showTooltip: true },
  { prop: 'groupId', label: '群号', width: 100, sortable: true, showTooltip: true },
  { prop: 'attachments', label: '合同附件', width: 100, sortable: true }
]

const getStatusType = (status: string) => {
  const config = Object.values(ContractStatusConfig).find(c => c.code === status)
  return config?.color || 'info'
}

const getStatusText = (status: string) => {
  const config = Object.values(ContractStatusConfig).find(c => c.code === status)
  return config?.name || status
}

const getSettlementMethodText = (method: string) => {
  const config = Object.values(SettlementMethodConfig).find(c => c.code === method)
  return config?.name || method
}

const formatAmount = (amount: number) => {
  return amount ? amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
}

const loadContractList = async () => {
  loading.value = true
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 筛选数据
    let filteredData = [...mockContracts]

    if (searchForm.name) {
      filteredData = filteredData.filter(item => item.name.includes(searchForm.name))
    }
    if (searchForm.phone) {
      filteredData = filteredData.filter(item => item.phone.includes(searchForm.phone))
    }
    if (searchForm.idCard) {
      filteredData = filteredData.filter(item => item.idCard.includes(searchForm.idCard))
    }
    if (searchForm.settlementMethod) {
      filteredData = filteredData.filter(item => item.settlementMethod === searchForm.settlementMethod)
    }
    if (searchForm.contractStatus) {
      filteredData = filteredData.filter(item => item.contractStatus === searchForm.contractStatus)
    }
    if (searchForm.signDateRange && searchForm.signDateRange.length === 2) {
      const startDate = searchForm.signDateRange[0]
      const endDate = searchForm.signDateRange[1]
      filteredData = filteredData.filter(item => {
        if (!item.signDate) return false
        return item.signDate >= startDate && item.signDate <= endDate
      })
    }

    // 排序
    if (sortField.value) {
      filteredData.sort((a, b) => {
        const aValue = a[sortField.value as keyof Contract]
        const bValue = b[sortField.value as keyof Contract]
        if (aValue < bValue) return sortOrder.value === 'ascending' ? -1 : 1
        if (aValue > bValue) return sortOrder.value === 'ascending' ? 1 : -1
        return 0
      })
    }

    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredData.slice(start, end)
    total.value = filteredData.length
  } catch (error) {
    ElMessage.error('加载合同列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  router.push({ name: 'LaborCompanyContractAdd' })
}

const handleView = (row: Contract) => {
  router.push({ name: 'LaborCompanyContractDetail', params: { id: row.id } })
}

const handleEdit = (row: Contract) => {
  router.push({ name: 'LaborCompanyContractEdit', params: { id: row.id } })
}

const handleDelete = (row: Contract) => {
  ElMessageBox.confirm('确定要删除该合同吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      // 从模拟数据中删除
      const index = mockContracts.findIndex(item => item.id === row.id)
      if (index !== -1) {
        mockContracts.splice(index, 1)
        ElMessage.success('删除成功')
        loadContractList()
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}条合同吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      // 从模拟数据中删除
      const ids = selectedRows.value.map(row => row.id)
      for (const id of ids) {
        const index = mockContracts.findIndex(item => item.id === id)
        if (index !== -1) {
          mockContracts.splice(index, 1)
        }
      }
      ElMessage.success(`成功删除${ids.length}条合同`)
      selectedRows.value = []
      loadContractList()
    } catch (error) {
      console.error(error)
      ElMessage.error('批量删除失败')
    }
  }).catch(() => {})
}

const handleSearch = () => {
  currentPage.value = 1
  loadContractList()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.idCard = ''
  searchForm.settlementMethod = ''
  searchForm.contractStatus = ''
  searchForm.signDateRange = []
  currentPage.value = 1
  loadContractList()
}

const handleSortChange = (sort: { prop: string; order: string | null }) => {
  sortField.value = sort.prop
  sortOrder.value = sort.order as 'ascending' | 'descending' | null
  loadContractList()
}

const handleSelectionChange = (selection: Contract[]) => {
  selectedRows.value = selection
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadContractList()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadContractList()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  console.log('全局搜索:', keyword)
  loadContractList()
}

// 行点击
const handleRowClick = (row: any) => {
  handleView(row)
}

const handleImport = () => {
  showImportDialog.value = true
}

const handleFileChange = (file: UploadUserFile) => {
  importFile.value = file.raw as File
}

const handleImportSubmit = async () => {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  importing.value = true
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('导入成功')
    showImportDialog.value = false
    importFile.value = null
    loadContractList()
  } catch (error) {
    console.error(error)
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}

const handleExport = async () => {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('导出成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('导出失败')
  }
}

const initDataPermission = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    searchForm.dataScope = userInfo.dataScope || 'ALL'
    searchForm.departmentId = userInfo.departmentId || ''
  }
}

onMounted(() => {
  initDataPermission()
  loadContractList()
})
</script>

<style scoped>
.contract-page {
  width: 100%;
  padding: 10px 16px;
  background-color: #f5f7fa;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-toggle-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 16px;
}

.filter-toggle {
  margin-left: auto;
}

.filter-default {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-expanded {
  padding: 12px 16px;
  background-color: #f9f9f9;
}

.filter-card,
.table-card {
  margin-bottom: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-stats {
  margin-bottom: 12px;
  padding: 10px 14px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .contract-page {
    padding: 12px;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  :deep(.el-form--inline .el-form-item) {
    display: block;
    margin-right: 0;
    margin-bottom: 12px;
  }

  :deep(.el-form-item__content) {
    width: 100%;
  }

  :deep(.el-select),
  :deep(.el-input),
  :deep(.el-date-picker) {
    width: 100% !important;
  }
}
</style>
