<template>
  <div class="print-history-container">
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="print-history-list"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :default-sort="defaultSort"
      :show-selection="true"
      :show-actions="true"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
      @global-search="handleSearch"
      @batch-action="handleBatchAction"
    >
      <template #toolbar-left>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出记录
        </el-button>
        <el-button @click="handleShowStatistics">
          <el-icon><DataAnalysis /></el-icon>
          打印统计
        </el-button>
      </template>

      <template #column-printStatus="{ row }">
        <el-tag :type="getStatusColor(row.printStatus)">
          {{ getStatusText(row.printStatus) }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button size="small" type="primary" link @click="handleViewDetail(row)">
          查看
        </el-button>
        <el-button size="small" type="primary" link @click="handleReprint(row)">
          重新打印
        </el-button>
      </template>
    </CommonTable>

    <el-dialog
      v-model="detailVisible"
      title="打印记录详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="业务代码">
          {{ currentRecord?.businessCode }}
        </el-descriptions-item>
        <el-descriptions-item label="业务ID">
          {{ currentRecord?.businessId }}
        </el-descriptions-item>
        <el-descriptions-item label="模版名称">
          {{ currentRecord?.templateName }}
        </el-descriptions-item>
        <el-descriptions-item label="打印状态">
          <el-tag :type="getStatusColor(currentRecord?.printStatus)">
            {{ getStatusText(currentRecord?.printStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="打印人">
          {{ currentRecord?.printedBy }}
        </el-descriptions-item>
        <el-descriptions-item label="打印时间">
          {{ currentRecord?.printedAt }}
        </el-descriptions-item>
        <el-descriptions-item label="IP地址" :span="2">
          {{ currentRecord?.ipAddress || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="错误信息" :span="2" v-if="currentRecord?.errorMessage">
          <el-text type="danger">{{ currentRecord.errorMessage }}</el-text>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider>打印数据</el-divider>

      <el-form label-width="120px" v-if="currentRecord?.printData">
        <el-form-item
          v-for="(value, key) in currentRecord.printData"
          :key="key"
          :label="key"
        >
          <el-input :value="value" readonly />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleReprint(currentRecord)">
          重新打印
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="statisticsVisible"
      title="打印统计"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="模版统计" name="template">
          <el-table :data="statisticsData?.templateStats" border>
            <el-table-column prop="templateId" label="模版ID" width="120" />
            <el-table-column prop="templateName" label="模版名称" min-width="180" />
            <el-table-column prop="count" label="打印次数" width="120" sortable />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="用户统计" name="user">
          <el-table :data="statisticsData?.userStats" border>
            <el-table-column prop="userId" label="用户ID" width="120" />
            <el-table-column prop="userName" label="用户名称" min-width="180" />
            <el-table-column prop="count" label="打印次数" width="120" sortable />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="趋势统计" name="trend">
          <div ref="chartRef" style="width: 100%; height: 400px"></div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="statisticsVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, DataAnalysis } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'
import type { PrintHistory, PrintStatus, PrintStatistics } from '@/types/print-management'

const tableRef = ref()
const loading = ref(false)
const tableData = ref<PrintHistory[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const defaultSort = ref({ prop: 'printedAt', order: 'descending' })
const selectedRows = ref<PrintHistory[]>([])

const detailVisible = ref(false)
const statisticsVisible = ref(false)
const activeTab = ref('template')
const currentRecord = ref<PrintHistory | null>(null)
const statisticsData = ref<PrintStatistics | null>(null)
const chartRef = ref()

const columns: ColumnConfig[] = [
  {
    prop: 'businessCode',
    label: '业务代码',
    width: 150,
    sortable: true
  },
  {
    prop: 'businessId',
    label: '业务ID',
    width: 150,
    sortable: true
  },
  {
    prop: 'templateName',
    label: '模版名称',
    minWidth: 180,
    showTooltip: true
  },
  {
    prop: 'printedBy',
    label: '打印人',
    width: 120
  },
  {
    prop: 'printStatus',
    label: '打印状态',
    width: 100,
    sortable: true
  },
  {
    prop: 'printedAt',
    label: '打印时间',
    width: 180,
    sortable: true
  },
  {
    prop: 'ipAddress',
    label: 'IP地址',
    width: 150
  }
]

const fetchData = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/v1/print-history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      tableData.value = result.data.list
      total.value = result.data.total
    } else {
      ElMessage.error(result.message || '获取失败')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    const response = await fetch('/api/v1/print-history/statistics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      statisticsData.value = result.data
    } else {
      ElMessage.error(result.message || '获取统计失败')
    }
  } catch (error) {
    console.error('获取统计失败:', error)
    ElMessage.error('获取统计失败')
  }
}

const handleSearch = (keyword: string) => {
  currentPage.value = 1
  fetchData()
}

const handleViewDetail = (row: PrintHistory) => {
  currentRecord.value = row
  detailVisible.value = true
}

const handleReprint = (row: PrintHistory) => {
  ElMessage.info('重新打印功能开发中')
}

const handleExport = async () => {
  try {
    const response = await fetch('/api/v1/print-history/export', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `打印记录_${new Date().getTime()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

const handleShowStatistics = async () => {
  await fetchStatistics()
  statisticsVisible.value = true
}

const handleBatchAction = (rows: PrintHistory[]) => {
  selectedRows.value = rows
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleSortChange = (sort: any) => {
  console.log('排序:', sort)
  fetchData()
}

const getStatusColor = (status: PrintStatus) => {
  const colorMap: Record<PrintStatus, string> = {
    success: 'success',
    failed: 'danger'
  }
  return colorMap[status] || 'info'
}

const getStatusText = (status: PrintStatus) => {
  const textMap: Record<PrintStatus, string> = {
    success: '成功',
    failed: '失败'
  }
  return textMap[status] || '未知'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.print-history-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

@media screen and (max-width: 768px) {
  .print-history-container {
    padding: 16px;
  }
}
</style>
