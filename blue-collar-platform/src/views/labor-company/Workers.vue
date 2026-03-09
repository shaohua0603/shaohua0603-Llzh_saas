<template>
  <div class="workers-page">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-default">
        <div class="filter-toggle-container">
          <el-form :model="filterForm" inline>
            <el-form-item label="关键词">
              <el-input
                v-model="filterForm.keyword"
                placeholder="姓名/手机号/身份证号"
                clearable
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="工人状态">
              <el-select
                v-model="filterForm.status"
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
          <el-form :model="filterForm" inline>
            <el-form-item label="工厂">
              <el-select
                v-model="filterForm.factoryId"
                placeholder="请选择工厂"
                clearable
                style="width: 180px"
              >
                <el-option label="富士康科技集团" value="1" />
                <el-option label="华为技术有限公司" value="2" />
                <el-option label="比亚迪股份有限公司" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="岗位类别">
              <el-select
                v-model="filterForm.positionType"
                placeholder="请选择岗位类别"
                clearable
                style="width: 150px"
              >
                <el-option label="普工" value="普工" />
                <el-option label="质检员" value="质检员" />
                <el-option label="技术工" value="技术工" />
                <el-option label="操作工" value="操作工" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
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
            <el-dropdown-item command="delete" divided>批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 工人信息 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共 {{ totalWorkers }} 名工人，其中进厂 {{ workersList.filter(item => item.lifecycleStatus === 'ENTERED').length }} 人，合同签订 {{ workersList.filter(item => item.lifecycleStatus === 'CONTRACT_SIGNED').length }} 人，面试中 {{ workersList.filter(item => item.lifecycleStatus === 'FIRST_INTERVIEW' || item.lifecycleStatus === 'FACTORY_INTERVIEW').length }} 人</span>
      </div>
      <CommonTable
        :data="workersList"
        :columns="tableColumns"
        table-id="labor-company-workers"
        :total="totalWorkers"
        :current-page="currentPage"
        :page-size="pageSize"
        :loading="loading"
        :show-selection="true"
        :show-actions="true"
        @update:current-page="handleCurrentChange"
        @update:page-size="handleSizeChange"
        @sort-change="handleSortChange"
        @global-search="handleGlobalSearch"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <template #column-lifecycleStatus="{ row }">
          <el-tag :type="getStatusType(row.lifecycleStatus)">
            {{ getStatusText(row.lifecycleStatus) }}
          </el-tag>
        </template>

        <template #column-paymentType="{ row }">
          <el-tag :type="getPaymentType(row.paymentType)">
            {{ row.paymentType }}
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
            type="success"
            link
            @click="handleEdit(row)"
          >
            <el-icon><Edit /></el-icon>
            编辑
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
          <el-button
            size="small"
            type="danger"
            link
            @click="handleDelete(row)"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Download, ArrowDown, ArrowUp, RefreshLeft, View, Edit, SwitchButton, Delete } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

const router = useRouter()

interface WorkerItem {
  id: string
  workerId: string
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
  lifecycleStatus: string
  paymentType: '日结' | '月结'
  entryDate?: string
}

interface StatusOption {
  label: string
  value: string
}

const filterForm = ref({
  keyword: '',
  status: '',
  factoryId: '',
  positionType: ''
})
const filterVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalWorkers = ref(0)
const loading = ref(false)
const workersList = ref<WorkerItem[]>([])
const selectedRows = ref<WorkerItem[]>([])

const statusOptions: StatusOption[] = [
  { label: '全部', value: '' },
  { label: '接送', value: 'PICKUP' },
  { label: '初次面试', value: 'FIRST_INTERVIEW' },
  { label: '合同签订', value: 'CONTRACT_SIGNED' },
  { label: '面试邀约', value: 'INTERVIEW_INVITATION' },
  { label: '工厂面试', value: 'FACTORY_INTERVIEW' },
  { label: '进厂', value: 'ENTERED' },
  { label: '离职', value: 'RESIGNED' }
]

const tableColumns = computed(() => [
  { prop: 'workerId', label: '工号', width: 100, sortable: true },
  { prop: 'name', label: '姓名', width: 100, sortable: true },
  { prop: 'gender', label: '性别', width: 70, sortable: true },
  { prop: 'age', label: '年龄', width: 70, sortable: true },
  { prop: 'phone', label: '手机号', width: 130 },
  { prop: 'idCard', label: '身份证号', width: 170 },
  { prop: 'laborCompany', label: '劳务公司', minWidth: 180 },
  { prop: 'factoryName', label: '工厂名称', minWidth: 150 },
  { prop: 'factoryArea', label: '区域', width: 100 },
  { prop: 'productionLine', label: '产线', width: 120 },
  { prop: 'positionType', label: '岗位类别', width: 100 },
  { prop: 'positionName', label: '岗位名称', width: 120 },
  { prop: 'paymentType', label: '结算方式', width: 100, sortable: true },
  { prop: 'lifecycleStatus', label: '工人状态', width: 120, sortable: true },
  { prop: 'entryDate', label: '入职日期', width: 120, sortable: true }
])

const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    'PICKUP': 'warning',
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
    'PICKUP': '接送',
    'FIRST_INTERVIEW': '初次面试',
    'CONTRACT_SIGNED': '合同签订',
    'INTERVIEW_INVITATION': '面试邀约',
    'FACTORY_INTERVIEW': '工厂面试',
    'ENTERED': '进厂',
    'RESIGNED': '离职'
  }
  return textMap[status] || '未知'
}

const getPaymentType = (paymentType: string): string => {
  return paymentType === '日结' ? 'warning' : 'success'
}

const handleSearch = () => {
  currentPage.value = 1
  fetchWorkers()
}

const handleReset = () => {
  filterForm.value = {
    keyword: '',
    status: '',
    factoryId: '',
    positionType: ''
  }
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

const handleSortChange = (sort: any) => {
  // 排序逻辑
  console.log('排序变化:', sort)
  fetchWorkers()
}

const handleGlobalSearch = (keyword: string) => {
  filterForm.value.keyword = keyword
  currentPage.value = 1
  fetchWorkers()
}

const handleRowClick = (row: WorkerItem) => {
  // 行点击逻辑
  console.log('行点击:', row)
}

const handleSelectionChange = (selection: WorkerItem[]) => {
  selectedRows.value = selection
}


const handleViewDetail = (row: WorkerItem) => {
  console.log('查看工人详情:', row.id)
  router.push(`/tenant/workers/${row.id}`)
}

const handleEdit = (row: WorkerItem) => {
  router.push(`/tenant/workers/${row.id}/edit`)
}

const handleTransfer = (row: WorkerItem) => {
  router.push(`/tenant/workers/${row.id}/transfer`)
}

const handleDelete = (row: WorkerItem) => {
  ElMessageBox.confirm(
    `确定要删除工人"${row.name}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      await new Promise(resolve => setTimeout(resolve, 500))
      ElMessage.success('删除成功')
      await fetchWorkers()
    } catch (error) {
      console.error('删除工人失败:', error)
      ElMessage.error('删除失败，请重试')
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

const handleBatchCommand = (command: string) => {
  switch (command) {
    case 'export':
      ElMessage.info('批量导出功能开发中')
      break
    case 'delete':
      handleBatchDelete()
      break
  }
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的工人')
    return
  }

  const names = selectedRows.value.map(row => row.name).join('、')
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 名工人吗？${names}`,
    '批量删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      await new Promise(resolve => setTimeout(resolve, 500))
      ElMessage.success('批量删除成功')
      selectedRows.value = []
      await fetchWorkers()
    } catch (error) {
      console.error('批量删除失败:', error)
      ElMessage.error('删除失败，请重试')
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

const fetchWorkers = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockData: WorkerItem[] = [
      {
        id: '1',
        workerId: 'EMP001',
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
        lifecycleStatus: 'ENTERED',
        paymentType: '月结',
        entryDate: '2023-01-15'
      },
      {
        id: '2',
        workerId: 'EMP002',
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
        lifecycleStatus: 'ENTERED',
        paymentType: '日结',
        entryDate: '2023-03-20'
      },
      {
        id: '3',
        workerId: 'EMP003',
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
        lifecycleStatus: 'RESIGNED',
        paymentType: '月结',
        entryDate: '2022-06-01'
      },
      {
        id: '4',
        workerId: 'EMP004',
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
        lifecycleStatus: 'CONTRACT_SIGNED',
        paymentType: '日结',
        entryDate: ''
      },
      {
        id: '5',
        workerId: 'EMP005',
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
        lifecycleStatus: 'FIRST_INTERVIEW',
        paymentType: '月结',
        entryDate: ''
      },
      {
        id: '6',
        workerId: 'EMP006',
        name: '孙八',
        gender: '女',
        age: 22,
        phone: '134****8006',
        idCard: '410106199805101234',
        laborCompany: '南通富民劳务服务有限公司',
        factoryName: '',
        factoryArea: '',
        productionLine: '',
        positionType: '',
        positionName: '',
        lifecycleStatus: 'REGISTERED',
        paymentType: '日结',
        entryDate: ''
      },
      {
        id: '7',
        workerId: 'EMP007',
        name: '周九',
        gender: '男',
        age: 35,
        phone: '133****8007',
        idCard: '410107198903151234',
        laborCompany: '南通富民劳务服务有限公司',
        factoryName: '',
        factoryArea: '',
        productionLine: '',
        positionType: '管理员',
        positionName: '劳务运维',
        lifecycleStatus: 'STAFF_LABOR',
        paymentType: '月结',
        entryDate: '2023-01-01'
      },
      {
        id: '8',
        workerId: 'EMP008',
        name: '吴十',
        gender: '女',
        age: 29,
        phone: '132****8008',
        idCard: '410108199108251234',
        laborCompany: '南通富民劳务服务有限公司',
        factoryName: '富士康科技集团',
        factoryArea: 'A区',
        productionLine: '',
        positionType: '管理员',
        positionName: '工厂正式员工',
        lifecycleStatus: 'STAFF_FACTORY',
        paymentType: '月结',
        entryDate: '2022-09-15'
      }
    ]

    let filteredData = mockData

    if (filterForm.value.keyword) {
      const keyword = filterForm.value.keyword.toLowerCase()
      filteredData = filteredData.filter(
        worker =>
          worker.workerId.toLowerCase().includes(keyword) ||
          worker.name.toLowerCase().includes(keyword) ||
          worker.phone.includes(keyword) ||
          worker.idCard.includes(keyword)
      )
    }

    if (filterForm.value.status) {
      filteredData = filteredData.filter(
        worker => worker.lifecycleStatus === filterForm.value.status
      )
    }

    if (filterForm.value.factoryId) {
      filteredData = filteredData.filter(
        worker => worker.factoryName === filterForm.value.factoryId
      )
    }

    if (filterForm.value.positionType) {
      filteredData = filteredData.filter(
        worker => worker.positionType === filterForm.value.positionType
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
  padding: 16px;
  background-color: #f5f7fa;
}

.filter-card {
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-default {
  margin-bottom: 12px;
}

.filter-toggle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-toggle {
  white-space: nowrap;
}

.filter-expanded {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e4e7ed;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-stats {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
  font-size: 14px;
  color: #f56c6c;
}

.table-stats p {
  margin: 0;
  line-height: 1.5;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .filter-toggle-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-bar .el-button {
    width: 100%;
  }
}
</style>
