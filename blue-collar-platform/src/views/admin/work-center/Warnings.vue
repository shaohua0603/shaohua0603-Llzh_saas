<template>
  <div class="admin-warnings-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="预警类型">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择预警类型"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in warningTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预警级别">
          <el-select
            v-model="queryParams.level"
            placeholder="请选择预警级别"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="item in warningLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择处理状态"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预警时间">
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
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <el-button type="success" @click="handleBatchHandle('handled')">
        批量标记已处理
      </el-button>
      <el-button type="warning" @click="handleBatchIgnore">
        批量忽略
      </el-button>
      <el-button type="danger" @click="handleBatchDelete">
        批量删除
      </el-button>
    </div>

    <!-- 表格区域 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="admin-warnings"
      :loading="loading"
      :total="total"
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      @global-search="handleGlobalSearch"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 预警类型列 -->
      <template #column-type="{ row }">
        <el-tag :type="getTypeTag(row.type)">{{ row.typeName }}</el-tag>
      </template>

      <!-- 预警级别列 -->
      <template #column-level="{ row }">
        <el-tag :type="getLevelTag(row.level)">{{ row.levelName }}</el-tag>
      </template>

      <!-- 处理状态列 -->
      <template #column-status="{ row }">
        <el-tag :type="getStatusTag(row.status)">{{ row.statusName }}</el-tag>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">查看</el-button>
        <el-button
          v-if="row.status === 'unhandled'"
          type="success"
          link
          @click="handleHandle(row)"
        >
          处理
        </el-button>
        <el-button
          v-if="row.status === 'unhandled'"
          type="warning"
          link
          @click="handleIgnore(row)"
        >
          忽略
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>

    <!-- 预警详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="预警详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentWarning" :column="2" border>
        <el-descriptions-item label="预警标题" :span="2">
          {{ currentWarning.title }}
        </el-descriptions-item>
        <el-descriptions-item label="预警类型">
          <el-tag :type="getTypeTag(currentWarning.type)">
            {{ currentWarning.typeName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="预警级别">
          <el-tag :type="getLevelTag(currentWarning.level)">
            {{ currentWarning.levelName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="处理状态">
          <el-tag :type="getStatusTag(currentWarning.status)">
            {{ currentWarning.statusName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="预警对象" v-if="currentWarning.target">
          {{ currentWarning.target }}
        </el-descriptions-item>
        <el-descriptions-item label="预警时间">
          {{ currentWarning.warningTime }}
        </el-descriptions-item>
        <el-descriptions-item label="处理人" v-if="currentWarning.handler">
          {{ currentWarning.handler }}
        </el-descriptions-item>
        <el-descriptions-item label="处理时间" v-if="currentWarning.handleTime">
          {{ currentWarning.handleTime }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentWarning.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="预警内容" :span="2">
          <div class="warning-content">{{ currentWarning.content }}</div>
        </el-descriptions-item>
        <el-descriptions-item
          label="处理备注"
          :span="2"
          v-if="currentWarning.handleRemark"
        >
          <div class="warning-remark">{{ currentWarning.handleRemark }}</div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="currentWarning && currentWarning.status === 'unhandled'"
          type="primary"
          @click="handleHandleFromDetail"
        >
          处理
        </el-button>
        <el-button
          v-if="currentWarning && currentWarning.status === 'unhandled'"
          type="warning"
          @click="handleIgnoreFromDetail"
        >
          忽略
        </el-button>
      </template>
    </el-dialog>

    <!-- 处理预警对话框 -->
    <el-dialog
      v-model="handleVisible"
      title="处理预警"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理状态">
          <el-radio-group v-model="handleForm.status">
            <el-radio label="handled">已处理</el-radio>
            <el-radio label="ignored">已忽略</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input
            v-model="handleForm.handleRemark"
            type="textarea"
            :rows="4"
            placeholder="请输入处理备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmHandle">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import {
  getWarningList,
  getWarningDetail,
  handleWarning,
  batchHandleWarnings,
  batchIgnoreWarnings,
  batchDeleteWarnings,
} from '@/api/workCenterApi'
import type {
  Warning,
  WarningQueryParams,
  WarningType,
  WarningLevel,
  WarningStatus,
  WarningHandleForm,
} from '@/types/work-center'

// 响应式数据
const tableRef = ref()
const loading = ref(false)
const tableData = ref<Warning[]>([])
const total = ref(0)
const selectedRows = ref<Warning[]>([])
const detailVisible = ref(false)
const handleVisible = ref(false)
const currentWarning = ref<Warning | null>(null)
const dateRange = ref<[string, string] | null>(null)

// 处理表单
const handleForm = reactive<WarningHandleForm>({
  id: 0,
  status: 'handled',
  handleRemark: '',
})

// 查询参数
const queryParams = reactive<WarningQueryParams>({
  page: 1,
  pageSize: 10,
  type: undefined,
  level: undefined,
  status: undefined,
  keyword: undefined,
  sortField: undefined,
  sortOrder: undefined,
})

// 表格列配置
const columns: ColumnConfig[] = [
  {
    prop: 'title',
    label: '预警标题',
    minWidth: 200,
    sortable: true,
    showTooltip: true,
  },
  {
    prop: 'type',
    label: '预警类型',
    width: 120,
    sortable: true,
  },
  {
    prop: 'level',
    label: '预警级别',
    width: 100,
    sortable: true,
  },
  {
    prop: 'content',
    label: '预警内容',
    minWidth: 300,
    showTooltip: true,
  },
  {
    prop: 'target',
    label: '预警对象',
    width: 150,
    sortable: true,
  },
  {
    prop: 'warningTime',
    label: '预警时间',
    width: 180,
    sortable: true,
  },
  {
    prop: 'status',
    label: '处理状态',
    width: 100,
    sortable: true,
  },
  {
    prop: 'handler',
    label: '处理人',
    width: 120,
  },
  {
    prop: 'handleTime',
    label: '处理时间',
    width: 180,
    sortable: true,
  },
]

// 预警类型选项
const warningTypeOptions = [
  { label: '离职率异常', value: 'turnover_rate' as WarningType },
  { label: '投诉率异常', value: 'complaint_rate' as WarningType },
  { label: '系统性能', value: 'system_performance' as WarningType },
  { label: '数据安全', value: 'data_security' as WarningType },
  { label: '业务预警', value: 'business' as WarningType },
]

// 预警级别选项
const warningLevelOptions = [
  { label: '紧急', value: 'urgent' as WarningLevel },
  { label: '高', value: 'high' as WarningLevel },
  { label: '中', value: 'medium' as WarningLevel },
  { label: '低', value: 'low' as WarningLevel },
]

// 状态选项
const statusOptions = [
  { label: '未处理', value: 'unhandled' as WarningStatus },
  { label: '已处理', value: 'handled' as WarningStatus },
  { label: '已忽略', value: 'ignored' as WarningStatus },
]

// 获取预警类型标签类型
const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    turnover_rate: 'danger',
    complaint_rate: 'warning',
    system_performance: 'danger',
    data_security: 'danger',
    business: 'info',
  }
  return map[type] || 'info'
}

// 获取预警级别标签类型
const getLevelTag = (level: string) => {
  const map: Record<string, string> = {
    urgent: 'danger',
    high: 'danger',
    medium: 'warning',
    low: 'info',
  }
  return map[level] || 'info'
}

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    unhandled: 'warning',
    handled: 'success',
    ignored: 'info',
  }
  return map[status] || 'info'
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const params = { ...queryParams }
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    const response = await getWarningList(params)
    if (response.code === 200) {
      tableData.value = response.data.list
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取预警列表失败:', error)
    ElMessage.error('获取预警列表失败')
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.type = undefined
  queryParams.level = undefined
  queryParams.status = undefined
  queryParams.keyword = undefined
  dateRange.value = null
  queryParams.page = 1
  loadData()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  queryParams.keyword = keyword || undefined
  queryParams.page = 1
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: Warning[]) => {
  selectedRows.value = selection
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  queryParams.sortField = sort.prop
  queryParams.sortOrder = sort.order === 'ascending' ? 'asc' : sort.order === 'descending' ? 'desc' : undefined
  loadData()
}

// 查看
const handleView = async (row: Warning) => {
  try {
    const response = await getWarningDetail(row.id)
    if (response.code === 200) {
      currentWarning.value = response.data
      detailVisible.value = true
    }
  } catch (error) {
    console.error('获取预警详情失败:', error)
    ElMessage.error('获取预警详情失败')
  }
}

// 处理预警
const handleHandle = (row: Warning) => {
  handleForm.id = row.id
  handleForm.status = 'handled'
  handleForm.handleRemark = ''
  handleVisible.value = true
}

// 从详情页处理预警
const handleHandleFromDetail = async () => {
  if (!currentWarning.value) return
  handleForm.id = currentWarning.value.id
  handleForm.status = 'handled'
  handleForm.handleRemark = ''
  await handleConfirmHandle()
  detailVisible.value = false
}

// 忽略预警
const handleIgnore = (row: Warning) => {
  ElMessageBox.confirm('确定要忽略该预警吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const response = await handleWarning(row.id, {
        id: row.id,
        status: 'ignored',
        handleRemark: '',
      })
      if (response.code === 200) {
        ElMessage.success('忽略成功')
        loadData()
      }
    } catch (error) {
      console.error('忽略预警失败:', error)
      ElMessage.error('忽略预警失败')
    }
  }).catch(() => {})
}

// 从详情页忽略预警
const handleIgnoreFromDetail = async () => {
  if (!currentWarning.value) return
  await handleIgnore(currentWarning.value)
  detailVisible.value = false
}

// 确认处理
const handleConfirmHandle = async () => {
  try {
    const response = await handleWarning(handleForm.id, handleForm)
    if (response.code === 200) {
      ElMessage.success('处理成功')
      handleVisible.value = false
      loadData()
    }
  } catch (error) {
    console.error('处理预警失败:', error)
    ElMessage.error('处理预警失败')
  }
}

// 批量处理
const handleBatchHandle = async (status: WarningStatus) => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要操作的预警')
    return
  }

  ElMessageBox.confirm(
    `确定要将选中的${selectedRows.value.length}个预警标记为${status === 'handled' ? '已处理' : '已忽略'}吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const ids = selectedRows.value.map(row => row.id)
      const response = await batchHandleWarnings(ids, status, '')
      if (response.code === 200) {
        ElMessage.success('批量处理成功')
        tableRef.value?.clearSelection()
        loadData()
      }
    } catch (error) {
      console.error('批量处理预警失败:', error)
      ElMessage.error('批量处理预警失败')
    }
  }).catch(() => {})
}

// 批量忽略
const handleBatchIgnore = () => {
  handleBatchHandle('ignored')
}

// 删除预警
const handleDelete = (row: Warning) => {
  ElMessageBox.confirm('确定要删除该预警吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const response = await batchDeleteWarnings([row.id])
      if (response.code === 200) {
        ElMessage.success('删除成功')
        loadData()
      }
    } catch (error) {
      console.error('删除预警失败:', error)
      ElMessage.error('删除预警失败')
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的预警')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}个预警吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const ids = selectedRows.value.map(row => row.id)
      const response = await batchDeleteWarnings(ids)
      if (response.code === 200) {
        ElMessage.success('批量删除成功')
        tableRef.value?.clearSelection()
        loadData()
      }
    } catch (error) {
      console.error('批量删除预警失败:', error)
      ElMessage.error('批量删除预警失败')
    }
  }).catch(() => {})
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-warnings-page {
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

.warning-content {
  white-space: pre-wrap;
  line-height: 1.6;
  max-height: 200px;
  overflow-y: auto;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.warning-remark {
  white-space: pre-wrap;
  line-height: 1.6;
  padding: 12px;
  background-color: #e6f7ff;
  border-radius: 4px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .admin-warnings-page {
    padding: 10px;
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
