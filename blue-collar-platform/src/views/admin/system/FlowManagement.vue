<template>
  <div class="flow-management-container">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="流程名称">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入流程名称"
            clearable
            style="width: 200px"
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="流程类型">
          <el-select
            v-model="queryParams.flowType"
            placeholder="请选择流程类型"
            clearable
            style="width: 180px"
            @change="handleSearch"
          >
            <el-option label="请假审批" value="LEAVE" />
            <el-option label="调岗审批" value="TRANSFER" />
            <el-option label="离职审批" value="RESIGNATION" />
            <el-option label="报名审批" value="REGISTRATION" />
          </el-select>
        </el-form-item>
        <el-form-item label="流程状态">
          <el-select
            v-model="queryParams.flowStatus"
            placeholder="请选择流程状态"
            clearable
            style="width: 120px"
            @change="handleSearch"
          >
            <el-option label="启用" :value="FlowStatus.ENABLED" />
            <el-option label="停用" :value="FlowStatus.DISABLED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增流程
      </el-button>
    </div>

    <!-- 列表区域 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="flow-management"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :show-global-search="false"
      :show-list-management="false"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
    >
      <!-- 流程状态列 -->
      <template #column-flowStatus="{ row }">
        <el-tag :type="row.flowStatus === FlowStatus.ENABLED ? 'success' : 'info'" size="small">
          {{ row.flowStatus === FlowStatus.ENABLED ? '启用' : '停用' }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="handleView(row)">
          查看
        </el-button>
        <el-button type="primary" link size="small" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button
          :type="row.flowStatus === FlowStatus.ENABLED ? 'warning' : 'success'"
          link
          size="small"
          @click="handleToggleStatus(row)"
        >
          {{ row.flowStatus === FlowStatus.ENABLED ? '停用' : '启用' }}
        </el-button>
        <el-button type="danger" link size="small" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import CommonTable, { type ColumnConfig } from '@/components/CommonTable.vue'
import {
  getApprovalFlowList,
  deleteApprovalFlow,
  updateApprovalFlowStatus
} from '@/api/system/flowConfigApi'
import type { ApprovalFlow, ApprovalFlowQueryParams } from '@/types/flow-config'
import { FlowStatus } from '@/types/flow-config'
import { useDataPermission } from '@/composables/useDataPermission'

// 路由
const router = useRouter()

// 数据权限
const { initialize, generateFilter, isAdmin } = useDataPermission()

// 表格引用
const tableRef = ref()

// 查询参数
const queryParams = reactive<ApprovalFlowQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  flowType: '',
  flowStatus: undefined
})

// 表格数据
const loading = ref(false)
const tableData = ref<ApprovalFlow[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 排序参数
const sortField = ref('')
const sortOrder = ref<'ascending' | 'descending' | null>(null)

// 流程类型映射
const flowTypeMap: Record<string, string> = {
  LEAVE: '请假审批',
  TRANSFER: '调岗审批',
  RESIGNATION: '离职审批',
  REGISTRATION: '报名审批'
}

// 表格列配置
const columns = computed<ColumnConfig[]>(() => [
  {
    prop: 'flowName',
    label: '流程名称',
    minWidth: 180,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'flowType',
    label: '流程类型',
    width: 120,
    formatter: (value) => flowTypeMap[value] || value
  },
  {
    prop: 'flowDescription',
    label: '流程描述',
    minWidth: 200,
    showTooltip: true
  },
  {
    prop: 'flowStatus',
    label: '流程状态',
    width: 100,
    sortable: true
  },
  {
    prop: 'nodeCount',
    label: '节点数量',
    width: 100,
    sortable: true
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    sortable: true
  }
])

// 获取列表数据
const fetchData = async () => {
  loading.value = true
  try {
    // 初始化数据权限
    await initialize()

    const params: ApprovalFlowQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: queryParams.keyword || undefined,
      flowType: queryParams.flowType || undefined,
      flowStatus: queryParams.flowStatus
    }

    // 集成数据权限过滤
    const dataPermissionFilter = generateFilter()
    if (!isAdmin.value && dataPermissionFilter) {
      // 将数据权限过滤条件添加到查询参数中
      Object.assign(params, dataPermissionFilter)
    }

    const response = await getApprovalFlowList(params)
    tableData.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('获取流程列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.flowType = ''
  queryParams.flowStatus = undefined
  currentPage.value = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  router.push('/admin/system/flow-management/add')
}

// 查看
const handleView = (row: ApprovalFlow) => {
  router.push(`/admin/system/flow-management/view/${row.id}`)
}

// 编辑
const handleEdit = (row: ApprovalFlow) => {
  router.push(`/admin/system/flow-management/edit/${row.id}`)
}

// 启用/停用
const handleToggleStatus = async (row: ApprovalFlow) => {
  const newStatus = row.flowStatus === FlowStatus.ENABLED ? FlowStatus.DISABLED : FlowStatus.ENABLED
  const action = newStatus === FlowStatus.ENABLED ? '启用' : '停用'

  try {
    await ElMessageBox.confirm(`确定要${action}流程"${row.flowName}"吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await updateApprovalFlowStatus(row.id!, newStatus)
    ElMessage.success(`${action}成功`)
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(`${action}失败`)
      console.error(error)
    }
  }
}

// 删除
const handleDelete = async (row: ApprovalFlow) => {
  try {
    await ElMessageBox.confirm(`确定要删除流程"${row.flowName}"吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteApprovalFlow(row.id!)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  sortField.value = sort.prop
  sortOrder.value = sort.order as 'ascending' | 'descending' | null
  // 这里可以添加排序参数到查询条件
  fetchData()
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.flow-management-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.search-card {
  margin-bottom: 16px;
}

.search-card :deep(.el-form-item) {
  margin-bottom: 0;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .flow-management-container {
    padding: 12px;
  }

  .search-card :deep(.el-form) {
    flex-direction: column;
  }

  .search-card :deep(.el-form-item) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 12px;
  }

  .search-card :deep(.el-input),
  .search-card :deep(.el-select) {
    width: 100% !important;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-bar .el-button {
    width: 100%;
  }
}
</style>
