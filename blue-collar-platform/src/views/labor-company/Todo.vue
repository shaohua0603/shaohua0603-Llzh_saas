<template>
  <div class="labor-company-todo">
    <CommonTable
      :data="tableData"
      :columns="columns"
      table-id="labor-company-todo"
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
          v-model="filters.status"
          placeholder="审批状态"
          clearable
          style="width: 150px"
          @change="handleFilterChange"
        >
          <el-option label="全部" value="" />
          <el-option label="待审批" value="pending" />
          <el-option label="审批中" value="in_progress" />
          <el-option label="已通过" value="approved" />
          <el-option label="已驳回" value="rejected" />
        </el-select>
        <el-select
          v-model="filters.type"
          placeholder="任务类型"
          clearable
          style="width: 150px"
          @change="handleFilterChange"
        >
          <el-option label="全部" value="" />
          <el-option label="请假审批" value="leave" />
          <el-option label="调岗审批" value="transfer" />
          <el-option label="离职审批" value="resignation" />
          <el-option label="合同审批" value="contract" />
          <el-option label="其他审批" value="other" />
        </el-select>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-type="{ row }">
        <el-tag type="info">{{ getTypeText(row.type) }}</el-tag>
      </template>

      <template #column-priority="{ row }">
        <el-tag :type="getPriorityType(row.priority)">
          {{ getPriorityText(row.priority) }}
        </el-tag>
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
          v-if="row.status === 'pending'"
          type="success"
          size="small"
          link
          @click.stop="handleApprove(row)"
        >
          审批
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

const router = useRouter()

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'taskNo', label: '任务编号', width: 150, sortable: true },
  { prop: 'title', label: '任务标题', minWidth: 200, sortable: true },
  { prop: 'type', label: '任务类型', width: 120, sortable: true },
  { prop: 'applicant', label: '申请人', width: 100, sortable: true },
  { prop: 'department', label: '所属部门', width: 120, sortable: true },
  { prop: 'priority', label: '优先级', width: 100, sortable: true },
  { prop: 'status', label: '审批状态', width: 100, sortable: true },
  { prop: 'createTime', label: '创建时间', width: 160, sortable: true },
  { prop: 'deadline', label: '截止时间', width: 160, sortable: true }
]

// 响应式数据
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选条件
const filters = reactive({
  status: '',
  type: '',
  keyword: ''
})

// 排序条件
const sortConfig = reactive({
  prop: '',
  order: ''
})

// 获取待办任务列表
const fetchTodoList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock数据
    const mockData = [
      {
        id: 1,
        taskNo: 'TD202602250001',
        title: '张三请假申请',
        type: 'leave',
        applicant: '张三',
        department: '生产部',
        priority: 'high',
        status: 'pending',
        createTime: '2026-02-25 09:00:00',
        deadline: '2026-02-26 18:00:00'
      },
      {
        id: 2,
        taskNo: 'TD202602250002',
        title: '李四调岗申请',
        type: 'transfer',
        applicant: '李四',
        department: '生产部',
        priority: 'medium',
        status: 'pending',
        createTime: '2026-02-25 10:00:00',
        deadline: '2026-02-27 18:00:00'
      },
      {
        id: 3,
        taskNo: 'TD202602240001',
        title: '王五离职申请',
        type: 'resignation',
        applicant: '王五',
        department: '质检部',
        priority: 'high',
        status: 'in_progress',
        createTime: '2026-02-24 14:00:00',
        deadline: '2026-02-26 18:00:00'
      },
      {
        id: 4,
        taskNo: 'TD202602240002',
        title: '赵六合同签订',
        type: 'contract',
        applicant: '赵六',
        department: '生产部',
        priority: 'low',
        status: 'approved',
        createTime: '2026-02-24 15:00:00',
        deadline: '2026-02-25 18:00:00'
      },
      {
        id: 5,
        taskNo: 'TD202602230001',
        title: '钱七请假申请',
        type: 'leave',
        applicant: '钱七',
        department: '包装部',
        priority: 'medium',
        status: 'rejected',
        createTime: '2026-02-23 11:00:00',
        deadline: '2026-02-24 18:00:00'
      }
    ]

    // 应用筛选
    let filteredData = mockData
    if (filters.status) {
      filteredData = filteredData.filter(item => item.status === filters.status)
    }
    if (filters.type) {
      filteredData = filteredData.filter(item => item.type === filters.type)
    }
    if (filters.keyword) {
      filteredData = filteredData.filter(item =>
        item.title.includes(filters.keyword) ||
        item.taskNo.includes(filters.keyword) ||
        item.applicant.includes(filters.keyword)
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
    ElMessage.error('获取待办任务列表失败')
  } finally {
    loading.value = false
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchTodoList()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTodoList()
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  sortConfig.prop = sort.prop
  sortConfig.order = sort.order || ''
  fetchTodoList()
}

// 搜索
const handleSearch = (keyword: string) => {
  filters.keyword = keyword
  currentPage.value = 1
  fetchTodoList()
}

// 筛选变化
const handleFilterChange = () => {
  currentPage.value = 1
  fetchTodoList()
}

// 行点击
const handleRowClick = (row: any) => {
  handleViewDetail(row)
}

// 查看
const handleViewDetail = (row: any) => {
  router.push(`/tenant/todo-detail/${row.id}`)
}

// 审批
const handleApprove = (row: any) => {
  router.push(`/tenant/todo-detail/${row.id}`)
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    in_progress: 'primary',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审批',
    in_progress: '审批中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || '未知'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    leave: '请假审批',
    transfer: '调岗审批',
    resignation: '离职审批',
    contract: '合同审批',
    other: '其他审批'
  }
  return textMap[type] || '未知'
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const typeMap: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return typeMap[priority] || 'info'
}

// 获取优先级文本
const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return textMap[priority] || '未知'
}

// 生命周期
onMounted(() => {
  fetchTodoList()
})
</script>

<style scoped>
.labor-company-todo {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
