<template>
  <div class="workers-page">
    <CommonTable
      :data="workersList"
      :columns="tableColumns"
      table-id="factory-workers"
      :total="totalWorkers"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :show-toolbar="true"
      :show-global-search="false"
      :show-list-management="false"
      :show-column-setting="false"
      :show-selection="true"
      :show-index="true"
      :show-actions="true"
      :action-column-width="180"
      @current-page-change="handleCurrentChange"
      @page-size-change="handleSizeChange"
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <div class="search-filters">
          <el-input
            v-model="searchKeyword"
            placeholder="姓名/手机号"
            prefix-icon="Search"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
          <el-select
            v-model="statusFilter"
            placeholder="工人状态"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
      </template>

      <template #toolbar-right>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
        <el-dropdown
          v-if="selectedRows.length > 0"
          @command="handleBatchCommand"
        >
          <el-button>
            批量操作
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="export">批量导出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <template #column-lifecycleStatus="{ row }">
        <el-tag :type="getStatusType(row.lifecycleStatus)">
          {{ getStatusText(row.lifecycleStatus) }}
        </el-tag>
      </template>

      <template #column-entryDate="{ row }">
        {{ row.entryDate || '-' }}
      </template>

      <template #actions="{ row }">
        <el-button
          size="small"
          type="primary"
          link
          @click="handleViewDetail(row)"
        >
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button
          size="small"
          type="warning"
          link
          @click="handleTransfer(row)"
        >
          <el-icon><SwitchButton /></el-icon>
          调动
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Download, ArrowDown, View, SwitchButton } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

const router = useRouter()

interface WorkerItem {
  id: string
  name: string
  gender: string
  age: number
  phone: string
  idCard: string
  laborCompany: string
  factoryName: string
  factoryArea: string
  productionLine: string
  positionType: string
  positionName: string
  employmentType: string
  lifecycleStatus: string
  entryDate?: string
}

interface StatusOption {
  label: string
  value: string
}

const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalWorkers = ref(0)
const loading = ref(false)
const workersList = ref<WorkerItem[]>([])
const selectedRows = ref<WorkerItem[]>([])

const statusOptions: StatusOption[] = [
  { label: '全部', value: '' },
  { label: '注册', value: 'REGISTERED' },
  { label: '接送', value: 'PICKUP' },
  { label: '劳务运维人员', value: 'STAFF_LABOR' },
  { label: '工厂正式人员', value: 'STAFF_FACTORY' },
  { label: '初次面试', value: 'FIRST_INTERVIEW' },
  { label: '合同签订', value: 'CONTRACT_SIGNED' },
  { label: '面试邀约', value: 'INTERVIEW_INVITATION' },
  { label: '工厂面试', value: 'FACTORY_INTERVIEW' },
  { label: '进厂', value: 'ENTERED' },
  { label: '离职', value: 'RESIGNED' }
]

const tableColumns = computed(() => [
  { prop: 'name', label: '姓名', width: 100, sortable: true },
  { prop: 'gender', label: '性别', width: 70, sortable: true },
  { prop: 'age', label: '年龄', width: 70, sortable: true },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'laborCompany', label: '劳务公司', minWidth: 180 },
  { prop: 'factoryArea', label: '区域', width: 100 },
  { prop: 'productionLine', label: '产线', width: 120 },
  { prop: 'positionType', label: '岗位类别', width: 100 },
  { prop: 'positionName', label: '岗位名称', width: 120 },
  { prop: 'employmentType', label: '用工类型', width: 100 },
  { prop: 'lifecycleStatus', label: '状态', width: 120, sortable: true },
  { prop: 'entryDate', label: '入职日期', width: 120, sortable: true }
])

const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    'REGISTERED': 'info',
    'PICKUP': 'warning',
    'STAFF_LABOR': 'primary',
    'STAFF_FACTORY': 'primary',
    'FIRST_INTERVIEW': 'warning',
    'CONTRACT_SIGNED': 'success',
    'INTERVIEW_INVITATION': 'warning',
    'FACTORY_INTERVIEW': 'warning',
    'ENTERED': 'success',
    'RESIGNED': 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    'REGISTERED': '注册',
    'PICKUP': '接送',
    'STAFF_LABOR': '劳务运维人员',
    'STAFF_FACTORY': '工厂正式人员',
    'FIRST_INTERVIEW': '初次面试',
    'CONTRACT_SIGNED': '合同签订',
    'INTERVIEW_INVITATION': '面试邀约',
    'FACTORY_INTERVIEW': '工厂面试',
    'ENTERED': '进厂',
    'RESIGNED': '离职'
  }
  return textMap[status] || '未知'
}

const handleSearch = () => {
  currentPage.value = 1
  fetchWorkers()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchWorkers()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchWorkers()
}

const handleSelectionChange = (selection: WorkerItem[]) => {
  selectedRows.value = selection
}

const handleViewDetail = (row: WorkerItem) => {
  router.push(`/factory/workers/${row.id}`)
}

const handleTransfer = (row: WorkerItem) => {
  router.push(`/factory/workers/${row.id}/transfer`)
}

const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

const handleBatchCommand = (command: string) => {
  switch (command) {
    case 'export':
      ElMessage.info('批量导出功能开发中')
      break
  }
}

const fetchWorkers = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockData: WorkerItem[] = [
      {
        id: '1',
        name: '张三',
        gender: '男',
        age: 34,
        phone: '138****8001',
        idCard: '410101199005151234',
        laborCompany: '南通富民劳务服务有限公司',
        factoryName: '富士康科技集团',
        factoryArea: 'A区',
        productionLine: '智能手机组装',
        positionType: '普工',
        positionName: '操作工',
        employmentType: '月结',
        lifecycleStatus: 'ENTERED',
        entryDate: '2023-01-15'
      },
      {
        id: '2',
        name: '李四',
        gender: '女',
        age: 28,
        phone: '139****8002',
        idCard: '410102199010201234',
        laborCompany: '南通富民劳务服务有限公司',
        factoryName: '华为技术有限公司',
        factoryArea: 'B区',
        productionLine: '电子产品测试',
        positionType: '质检员',
        positionName: '质检员',
        employmentType: '月结',
        lifecycleStatus: 'ENTERED',
        entryDate: '2023-03-20'
      },
      {
        id: '3',
        name: '王五',
        gender: '男',
        age: 42,
        phone: '137****8003',
        idCard: '410103198506101234',
        laborCompany: '南通富民劳务服务有限公司',
        factoryName: '比亚迪股份有限公司',
        factoryArea: 'C区',
        productionLine: '汽车配件制造',
        positionType: '技术工',
        positionName: '焊工',
        employmentType: '日结',
        lifecycleStatus: 'RESIGNED',
        entryDate: '2022-06-01'
      },
      {
        id: '4',
        name: '赵六',
        gender: '女',
        age: 25,
        phone: '136****8004',
        idCard: '410104199512301234',
        laborCompany: '南通富民劳务服务有限公司',
        factoryName: '富士康科技集团',
        factoryArea: 'D区',
        productionLine: '电子产品组装',
        positionType: '普工',
        positionName: '包装工',
        employmentType: '月结',
        lifecycleStatus: 'CONTRACT_SIGNED',
        entryDate: ''
      },
      {
        id: '5',
        name: '钱七',
        gender: '男',
        age: 31,
        phone: '135****8005',
        idCard: '410105199208201234',
        laborCompany: '南通富民劳务服务有限公司',
        factoryName: '立讯精密工业股份有限公司',
        factoryArea: 'E区',
        productionLine: '连接器生产',
        positionType: '操作工',
        positionName: '操作工',
        employmentType: '月结',
        lifecycleStatus: 'FIRST_INTERVIEW',
        entryDate: ''
      }
    ]

    let filteredData = mockData

    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filteredData = filteredData.filter(
        worker =>
          worker.name.toLowerCase().includes(keyword) ||
          worker.phone.includes(keyword)
      )
    }

    if (statusFilter.value) {
      filteredData = filteredData.filter(
        worker => worker.lifecycleStatus === statusFilter.value
      )
    }

    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    workersList.value = filteredData.slice(start, end)
    totalWorkers.value = filteredData.length
  } catch (error) {
    console.error('获取工人信息失败:', error)
    ElMessage.error('获取工人信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWorkers()
})
</script>

<style scoped>
.workers-page {
  padding: 20px;
  background-color: var(--color-bg-page);
}

.search-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
