<template>
  <div class="labor-company-warnings">
    <CommonTable
      :data="tableData"
      :columns="columns"
      table-id="labor-company-warnings"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
      @global-search="handleSearch"
      @row-click="handleRowClick"
    >
      <template #toolbar-left>
        <el-select
          v-model="filters.type"
          placeholder="预警类型"
          clearable
          style="width: 150px"
          @change="handleFilterChange"
        >
          <el-option label="全部" value="" />
          <el-option label="工人数量预警" value="worker_count" />
          <el-option label="合同到期预警" value="contract_expire" />
          <el-option label="考勤异常预警" value="attendance_abnormal" />
          <el-option label="生产进度预警" value="production_progress" />
          <el-option label="其他预警" value="other" />
        </el-select>
        <el-select
          v-model="filters.level"
          placeholder="预警级别"
          clearable
          style="width: 150px"
          @change="handleFilterChange"
        >
          <el-option label="全部" value="" />
          <el-option label="紧急" value="critical" />
          <el-option label="重要" value="high" />
          <el-option label="一般" value="medium" />
          <el-option label="提示" value="low" />
        </el-select>
        <el-select
          v-model="filters.status"
          placeholder="处理状态"
          clearable
          style="width: 150px"
          @change="handleFilterChange"
        >
          <el-option label="全部" value="" />
          <el-option label="未处理" value="pending" />
          <el-option label="处理中" value="processing" />
          <el-option label="已处理" value="resolved" />
          <el-option label="已忽略" value="ignored" />
        </el-select>
      </template>

      <template #toolbar-right>
        <el-button @click="handleBatchProcess" :disabled="!hasPending">
          <el-icon><Operation /></el-icon>
          批量处理
        </el-button>
      </template>

      <template #column-level="{ row }">
        <el-tag :type="getLevelType(row.level)">
          {{ getLevelText(row.level) }}
        </el-tag>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-type="{ row }">
        <el-tag type="info">{{ getTypeText(row.type) }}</el-tag>
      </template>

      <template #actions="{ row }">
        <el-button
          type="primary"
          size="small"
          link
          @click.stop="handleViewDetail(row)"
        >
          查看
        </el-button>
        <el-button
          v-if="row.status === 'pending' || row.status === 'processing'"
          type="success"
          size="small"
          link
          @click.stop="handleProcess(row)"
        >
          处理
        </el-button>
        <el-button
          v-if="row.status === 'pending'"
          type="warning"
          size="small"
          link
          @click.stop="handleIgnore(row)"
        >
          忽略
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Operation } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

const router = useRouter()

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'warningNo', label: '预警编号', width: 150, sortable: true },
  { prop: 'title', label: '预警标题', minWidth: 200, sortable: true },
  { prop: 'type', label: '预警类型', width: 140, sortable: true },
  { prop: 'level', label: '预警级别', width: 100, sortable: true },
  { prop: 'status', label: '处理状态', width: 100, sortable: true },
  { prop: 'department', label: '涉及部门', width: 120, sortable: true },
  { prop: 'createTime', label: '预警时间', width: 160, sortable: true },
  { prop: 'processTime', label: '处理时间', width: 160, sortable: true }
]

// 响应式数据
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选条件
const filters = reactive({
  type: '',
  level: '',
  status: '',
  keyword: ''
})

// 排序条件
const sortConfig = reactive({
  prop: '',
  order: ''
})

// 是否有待处理预警
const hasPending = computed(() => {
  return tableData.value.some(item => item.status === 'pending')
})

// 获取预警列表
const fetchWarningList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock数据
    const mockData = [
      {
        id: 1,
        warningNo: 'WRN202602250001',
        title: '生产部工人数量不足',
        type: 'worker_count',
        level: 'critical',
        status: 'pending',
        department: '生产部',
        createTime: '2026-02-25 08:00:00',
        processTime: '',
        content: '生产部当前工人数量为50人,低于最低配置60人,请及时补充工人。',
        businessType: 'worker',
        businessId: '1'
      },
      {
        id: 2,
        warningNo: 'WRN202602250002',
        title: '王五合同即将到期',
        type: 'contract_expire',
        level: 'high',
        status: 'pending',
        department: '生产部',
        createTime: '2026-02-25 09:00:00',
        processTime: '',
        content: '工人王五的合同将于2026-03-01到期,请提前做好续签或离职安排。',
        businessType: 'contract',
        businessId: '1'
      },
      {
        id: 3,
        warningNo: 'WRN202602240001',
        title: '李四考勤异常',
        type: 'attendance_abnormal',
        level: 'medium',
        status: 'processing',
        department: '生产部',
        createTime: '2026-02-24 10:00:00',
        processTime: '2026-02-24 14:00:00',
        content: '工人李四连续3天未打卡,请核实情况。',
        businessType: 'attendance',
        businessId: '1'
      },
      {
        id: 4,
        warningNo: 'WRN202602240002',
        title: 'A生产线进度滞后',
        type: 'production_progress',
        level: 'high',
        status: 'resolved',
        department: '生产部',
        createTime: '2026-02-24 11:00:00',
        processTime: '2026-02-24 16:00:00',
        content: 'A生产线生产进度滞后10%,请及时调整生产计划。',
        businessType: 'production',
        businessId: '1'
      },
      {
        id: 5,
        warningNo: 'WRN202602230001',
        title: '系统存储空间不足',
        type: 'other',
        level: 'medium',
        status: 'ignored',
        department: '技术部',
        createTime: '2026-02-23 15:00:00',
        processTime: '2026-02-23 16:00:00',
        content: '系统存储空间使用率已达到85%,建议及时清理或扩容。',
        businessType: '',
        businessId: ''
      }
    ]

    // 应用筛选
    let filteredData = mockData
    if (filters.type) {
      filteredData = filteredData.filter(item => item.type === filters.type)
    }
    if (filters.level) {
      filteredData = filteredData.filter(item => item.level === filters.level)
    }
    if (filters.status) {
      filteredData = filteredData.filter(item => item.status === filters.status)
    }
    if (filters.keyword) {
      filteredData = filteredData.filter(item =>
        item.title.includes(filters.keyword) ||
        item.warningNo.includes(filters.keyword) ||
        item.content.includes(filters.keyword)
      )
    }

    // 应用排序
    if (sortConfig.prop && sortConfig.order) {
      filteredData.sort((a, b) => {
        const aVal = a[sortConfig.prop]
        const bVal = b[sortConfig.prop]
        if (sortConfig.order === 'ascending') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }

    total.value = filteredData.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredData.slice(start, end)
  } catch (error) {
    ElMessage.error('获取预警列表失败')
  } finally {
    loading.value = false
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchWarningList()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchWarningList()
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  sortConfig.prop = sort.prop
  sortConfig.order = sort.order || ''
  fetchWarningList()
}

// 搜索
const handleSearch = (keyword: string) => {
  filters.keyword = keyword
  currentPage.value = 1
  fetchWarningList()
}

// 筛选变化
const handleFilterChange = () => {
  currentPage.value = 1
  fetchWarningList()
}

// 行点击
const handleRowClick = (row: any) => {
  handleViewDetail(row)
}

// 查看详情
const handleViewDetail = (row: any) => {
  router.push(`/labor-company/warning-detail/${row.id}`)
}

// 处理预警
const handleProcess = (row: any) => {
  router.push(`/labor-company/warning-detail/${row.id}`)
}

// 忽略预警
const handleIgnore = (row: any) => {
  ElMessageBox.confirm('确定要忽略这条预警吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    row.status = 'ignored'
    row.processTime = new Date().toLocaleString('zh-CN')
    ElMessage.success('已忽略该预警')
  }).catch(() => {})
}

// 批量处理
const handleBatchProcess = () => {
  ElMessage.info('批量处理功能开发中')
}

// 获取级别类型
const getLevelType = (level: string) => {
  const typeMap: Record<string, string> = {
    critical: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'info'
  }
  return typeMap[level] || 'info'
}

// 获取级别文本
const getLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    critical: '紧急',
    high: '重要',
    medium: '一般',
    low: '提示'
  }
  return textMap[level] || '未知'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'danger',
    processing: 'warning',
    resolved: 'success',
    ignored: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '未处理',
    processing: '处理中',
    resolved: '已处理',
    ignored: '已忽略'
  }
  return textMap[status] || '未知'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    worker_count: '工人数量预警',
    contract_expire: '合同到期预警',
    attendance_abnormal: '考勤异常预警',
    production_progress: '生产进度预警',
    other: '其他预警'
  }
  return textMap[type] || '未知'
}

// 生命周期
onMounted(() => {
  fetchWarningList()
})
</script>

<style scoped>
.labor-company-warnings {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
