<template>
  <div class="flow-config-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>流程配置管理</span>
        </div>
      </template>

      <CommonTable
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        :show-selection="true"
        :show-index="true"
        :show-toolbar="true"
        :show-column-setting="true"
        :show-list-management="true"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #toolbar-left>
          <el-input
            v-model="searchForm.businessName"
            placeholder="业务名称"
            prefix-icon="Search"
            clearable
            style="width: 200px; margin-right: 12px"
            @input="handleSearch"
          />
          <el-input
            v-model="searchForm.flowName"
            placeholder="流程名称"
            prefix-icon="Search"
            clearable
            style="width: 200px; margin-right: 12px"
            @input="handleSearch"
          />
          <el-select
            v-model="searchForm.businessCode"
            placeholder="业务代码"
            clearable
            style="width: 150px; margin-right: 12px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="请假管理" value="LEAVE" />
            <el-option label="调岗管理" value="TRANSFER" />
            <el-option label="离职管理" value="RESIGNATION" />
            <el-option label="报名管理" value="REGISTRATION" />
            <el-option label="工人入职" value="WORKER_ENTRY" />
            <el-option label="合同签订" value="CONTRACT_SIGN" />
          </el-select>
          <el-select
            v-model="searchForm.isEnabled"
            placeholder="是否启用"
            clearable
            style="width: 120px; margin-right: 12px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </template>

        <template #toolbar-right>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
          <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </template>

        <template #column-businessCode="{ row }">
          <el-tag type="primary" size="small">
            {{ row.businessCode }}
          </el-tag>
        </template>

        <template #column-isEnabled="{ row }">
          <el-tag :type="row.isEnabled ? 'success' : 'info'" size="small">
            {{ row.isEnabled ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <template #column-effectiveDate="{ row }">
          {{ row.effectiveDate ? formatDate(row.effectiveDate) : '-' }}
        </template>

        <template #column-expiryDate="{ row }">
          {{ row.expiryDate ? formatDate(row.expiryDate) : '永久' }}
        </template>

        <template #column-createTime="{ row }">
          {{ formatDateTime(row.createTime) }}
        </template>

        <template #column-updateTime="{ row }">
          {{ formatDateTime(row.updateTime) }}
        </template>

        <template #column-actions="{ row }">
          <el-button size="small" type="primary" link @click="handleView(row)">
            <el-icon><View /></el-icon>
            查看
          </el-button>
          <el-button size="small" type="primary" link @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Edit,
  View
} from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import {
  getFlowConfigList,
  deleteFlowConfig
} from '@/api/system/flowConfigApi'
import type { FlowBusinessConfig, FlowConfigQueryParams } from '@/types/flow-config'
import type { ColumnConfig } from '@/types/common-table'
import { useDataPermission } from '@/composables/useDataPermission'

const router = useRouter()
const tableRef = ref()

// 数据权限
const { initialize, generateFilter, isAdmin } = useDataPermission()

const loading = ref(false)
const tableData = ref<FlowBusinessConfig[]>([])
const selectedRows = ref<FlowBusinessConfig[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  businessName: '',
  flowName: '',
  businessCode: '',
  isEnabled: ''
})

const columns: ColumnConfig[] = [
  { field: 'businessCode', label: '业务代码', width: 120, sortable: true },
  { field: 'businessName', label: '业务名称', width: 150, sortable: true },
  { field: 'flowName', label: '流程名称', width: 180, sortable: true },
  { field: 'isEnabled', label: '是否启用', width: 100, sortable: true },
  { field: 'effectiveDate', label: '生效日期', width: 120, sortable: true },
  { field: 'expiryDate', label: '失效日期', width: 120, sortable: true },
  { field: 'createTime', label: '创建时间', width: 160, sortable: true },
  { field: 'updateTime', label: '更新时间', width: 160, sortable: true },
  { field: 'actions', label: '操作', width: 200, fixed: 'right' }
]

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 初始化数据权限
    await initialize()

    const params: FlowConfigQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value
    }

    // 添加搜索条件
    if (searchForm.businessCode) {
      params.businessCode = searchForm.businessCode
    }
    if (searchForm.isEnabled !== '') {
      params.isEnabled = Number(searchForm.isEnabled)
    }

    // 集成数据权限过滤
    const dataPermissionFilter = generateFilter()
    if (!isAdmin.value && dataPermissionFilter) {
      // 将数据权限过滤条件添加到查询参数中
      Object.assign(params, dataPermissionFilter)
    }

    const { data } = await getFlowConfigList(params)
    tableData.value = data.list || []
    total.value = data.total || 0

    // 客户端过滤业务名称和流程名称
    if (searchForm.businessName || searchForm.flowName) {
      tableData.value = tableData.value.filter(row => {
        let match = true
        if (searchForm.businessName && !row.businessName.includes(searchForm.businessName)) {
          match = false
        }
        if (searchForm.flowName && !row.flowName?.includes(searchForm.flowName)) {
          match = false
        }
        return match
      })
      total.value = tableData.value.length
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
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
  Object.assign(searchForm, {
    businessName: '',
    flowName: '',
    businessCode: '',
    isEnabled: ''
  })
  currentPage.value = 1
  fetchData()
}

// 新增 - 跳转到新增页面
const handleAdd = () => {
  router.push('/admin/system/flow-config-form')
}

// 查看 - 跳转到详情页面
const handleView = (row: FlowBusinessConfig) => {
  router.push(`/admin/system/flow-config-detail/${row.id}`)
}

// 编辑 - 跳转到编辑页面
const handleEdit = (row: FlowBusinessConfig) => {
  router.push(`/admin/system/flow-config-form/${row.id}`)
}

// 删除 - 弹窗二次确认
const handleDelete = async (row: FlowBusinessConfig) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除流程配置"${row.businessName} - ${row.flowName}"吗？`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    await deleteFlowConfig(row.id!)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除 - 弹窗二次确认
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的${selectedRows.value.length}条流程配置吗？`,
      '批量删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )

    // 批量删除
    for (const row of selectedRows.value) {
      await deleteFlowConfig(row.id!)
    }

    ElMessage.success('批量删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 选择变化
const handleSelectionChange = (selection: FlowBusinessConfig[]) => {
  selectedRows.value = selection
}

// 排序变化
const handleSortChange = () => {
  fetchData()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 每页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.flow-config-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}
</style>
