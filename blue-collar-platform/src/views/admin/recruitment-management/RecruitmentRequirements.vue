<template>
  <div class="recruitment-requirements-container">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <div class="filter-header">
        <el-form :inline="true" :model="queryParams">
          <el-form-item label="关键词">
            <el-input
              v-model="queryParams.keyword"
              placeholder="需求标题/岗位名称"
              clearable
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button @click="handleReset">
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
      <!-- 展开后显示的全部查询条件 -->
      <el-collapse-transition>
        <div v-show="filterVisible" class="filter-expanded">
          <el-form :model="queryParams" inline>
            <el-form-item label="工厂">
              <el-select
                v-model="queryParams.factoryId"
                placeholder="请选择工厂"
                clearable
                style="width: 180px"
              >
                <el-option
                  v-for="item in factoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="劳务公司">
              <el-select
                v-model="queryParams.laborCompanyId"
                placeholder="请选择劳务公司"
                clearable
                style="width: 180px"
              >
                <el-option
                  v-for="item in laborCompanyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="岗位类型">
              <el-select
                v-model="queryParams.positionCategory"
                placeholder="请选择岗位类型"
                clearable
                style="width: 150px"
              >
                <el-option label="普工" value="普工" />
                <el-option label="技工" value="技工" />
                <el-option label="干部" value="干部" />
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 280px"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button
        type="primary"
        :icon="Plus"
        @click="handleAdd"
      >
        新增
      </el-button>
      <el-button
        :icon="Delete"
        :disabled="selectedIds.length === 0"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
      <el-button
        :icon="Share"
        :disabled="selectedIds.length === 0"
        @click="handleBatchShare"
      >
        批量分享
      </el-button>
      <el-button
        :icon="Download"
        @click="handleExport"
      >
        导出
      </el-button>
    </div>

    <!-- 列表区域 -->
    <CommonTable
      ref="tableRef"
      :table-id="'recruitment-requirements'"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      :show-selection="true"
      :show-index="true"
      :stats-info="`共发布 ${pagination.total} 条招聘需求，其中已发布 ${tableData.filter(item => item.status === 'published').length} 条，已暂停 ${tableData.filter(item => item.status === 'paused').length} 条，已完成 ${tableData.filter(item => item.status === 'completed').length} 条`"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >

      <template #column-status="{ row }">
        <el-tag :type="getStatusTagType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-salary="{ row }">
        {{ row.salaryMin }}-{{ row.salaryMax }}{{ row.salaryUnit }}
      </template>

      <template #column-actions="{ row }">
        <el-button
          type="primary"
          link
          :icon="View"
          @click.stop="handleView(row)"
        >
          查看
        </el-button>
        <el-button
          type="primary"
          link
          :icon="Edit"
          @click.stop="handleEdit(row)"
        >
          编辑
        </el-button>
        <el-button
          type="primary"
          link
          :icon="Share"
          @click.stop="handleShare(row)"
        >
          分享
        </el-button>
        <el-button
          type="danger"
          link
          :icon="Delete"
          @click.stop="handleDelete(row)"
        >
          删除
        </el-button>
        <el-dropdown v-if="row.status === 'published'" @command="(cmd) => handleStatusCommand(cmd, row)">
          <el-button type="primary" link @click.stop>
            更多
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="pause">暂停</el-dropdown-item>
              <el-dropdown-item command="complete">完成</el-dropdown-item>
              <el-dropdown-item command="cancel">取消</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download, View, Edit, ArrowDown, ArrowUp, Share, ChatDotRound, ChatLineRound, Link } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import {
  getRecruitmentList,
  deleteRecruitment,
  batchDeleteRecruitments,
  exportRecruitments,
  pauseRecruitment,
  completeRecruitment,
  cancelRecruitment,
  getFactoryOptions,
  getLaborCompanyOptions
} from '@/api/recruitmentApi'
import type { Recruitment, RecruitmentQueryParams } from '@/types/recruitmentTypes'
import { RecruitmentStatus, RecruitmentStatusText, RecruitmentStatusTagType } from '@/types/recruitmentTypes'

const router = useRouter()

// 表格引用
const tableRef = ref()

// 加载状态
const loading = ref(false)

// 选中项
const selectedIds = ref<string[]>([])

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 查询条件展开状态
const filterVisible = ref(false)

// 查询参数
const queryParams = reactive<RecruitmentQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: undefined,
  factoryId: undefined,
  laborCompanyId: undefined,
  startDate: undefined,
  endDate: undefined
})

// 分页信息
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<Recruitment[]>([])

// 状态选项
const statusOptions = Object.entries(RecruitmentStatusText).map(([value, label]) => ({
  value,
  label
}))

// 工厂选项
const factoryOptions = ref<Array<{ value: string; label: string }>>([])

// 劳务公司选项
const laborCompanyOptions = ref<Array<{ value: string; label: string }>>([])

// 表格列配置
const columns = [
  {
    prop: 'title',
    label: '需求标题',
    minWidth: 200,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'factoryName',
    label: '工厂名称',
    width: 180,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'laborCompanyName',
    label: '劳务公司',
    width: 180,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'positionName',
    label: '岗位名称',
    width: 120,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'positionCategory',
    label: '岗位类型',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    prop: 'recruitCount',
    label: '招聘人数',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    prop: 'salary',
    label: '薪资范围',
    width: 150,
    sortable: false
  },
  {
    prop: 'workLocation',
    label: '工作地点',
    width: 150,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    sortable: true
  },
  {
    prop: 'publishTime',
    label: '发布时间',
    width: 180,
    sortable: true
  },
  {
    prop: 'actions',
    label: '操作',
    width: 240,
    fixed: 'right'
  }
]

// 获取状态文本
const getStatusText = (status: RecruitmentStatus) => {
  return RecruitmentStatusText[status] || status
}

// 获取状态标签类型
const getStatusTagType = (status: RecruitmentStatus) => {
  return RecruitmentStatusTagType[status] || 'info'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      startDate: dateRange.value?.[0],
      endDate: dateRange.value?.[1]
    }
    const response = await getRecruitmentList(params)
    tableData.value = response.data.list
    pagination.total = response.data.total
    pagination.currentPage = response.data.page
    pagination.pageSize = response.data.pageSize
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 加载选项数据
const loadOptions = async () => {
  try {
    const [factoryRes, laborCompanyRes] = await Promise.all([
      getFactoryOptions(),
      getLaborCompanyOptions()
    ])
    factoryOptions.value = factoryRes.data || []
    laborCompanyOptions.value = laborCompanyRes.data || []
  } catch (error) {
    console.error('加载选项数据失败:', error)
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
  queryParams.status = undefined
  queryParams.factoryId = undefined
  queryParams.laborCompanyId = undefined
  queryParams.positionCategory = undefined
  dateRange.value = null
  queryParams.startDate = undefined
  queryParams.endDate = undefined
  queryParams.page = 1
  loadData()
}

// 新增
const handleAdd = () => {
  router.push('/admin/recruitment-management/recruitment-requirements/add')
}

// 查看
const handleView = (row: Recruitment) => {
  router.push(`/admin/recruitment-management/recruitment-requirements/${row.id}`)
}

// 编辑
const handleEdit = (row: Recruitment) => {
  router.push(`/admin/recruitment-management/recruitment-requirements/edit/${row.id}`)
}

// 删除
const handleDelete = (row: Recruitment) => {
  ElMessageBox.confirm('确定要删除该招聘需求吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteRecruitment(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的${selectedIds.value.length}条招聘需求吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteRecruitments(selectedIds.value)
      ElMessage.success('批量删除成功')
      selectedIds.value = []
      loadData()
    } catch (error) {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }).catch(() => {})
}

// 导出
const handleExport = async () => {
  try {
    const params = {
      ...queryParams,
      startDate: dateRange.value?.[0],
      endDate: dateRange.value?.[1]
    }
    const response = await exportRecruitments(params)
    const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `招聘需求_${new Date().getTime()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 状态操作
const handleStatusCommand = (command: string, row: Recruitment) => {
  const actions = {
    pause: { text: '暂停', api: pauseRecruitment },
    complete: { text: '完成', api: completeRecruitment },
    cancel: { text: '取消', api: cancelRecruitment }
  }
  const action = actions[command as keyof typeof actions]
  if (action) {
    ElMessageBox.confirm(`确定要${action.text}该招聘需求吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await action.api(row.id)
        ElMessage.success(`${action.text}成功`)
        loadData()
      } catch (error) {
        console.error(`${action.text}失败:`, error)
        ElMessage.error(`${action.text}失败`)
      }
    }).catch(() => {})
  }
}

// 选择变化
const handleSelectionChange = (selection: Recruitment[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 排序变化
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  queryParams.sortField = prop
  queryParams.sortOrder = order === 'ascending' ? 'asc' : 'desc'
  loadData()
}

// 页码变化
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

// 单个岗位分享
const handleShare = (row: Recruitment) => {
  // 实现单个岗位分享功能
  const shareUrl = `http://localhost:5175/admin/recruitment-management/recruitment-requirements/${row.id}`
  
  ElMessageBox.alert(
    `<div style="padding: 20px;">
      <h3 style="margin-bottom: 16px;">分享到</h3>
      <div style="margin-bottom: 16px;">
        <p><strong>分享链接：</strong></p>
        <input type="text" value="${shareUrl}" readonly style="width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px;" />
      </div>
      <div style="margin-bottom: 16px;">
        <p>选择分享平台</p>
        <div style="display: flex; gap: 16px; margin-top: 12px;">
          <button type="button" style="width: 80px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            📱 微信
          </button>
          <button type="button" style="width: 80px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            💬 QQ
          </button>
          <button type="button" style="width: 100px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            🔗 复制链接
          </button>
        </div>
      </div>
    </div>`,
    '分享招聘需求',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭',
      customClass: 'share-dialog',
      showCancelButton: false
    }
  )
}

// 批量分享
const handleBatchShare = () => {
  // 实现批量分享功能
  const shareUrl = `http://localhost:5175/admin/recruitment-management/recruitment-requirements?ids=${selectedIds.value.join(',')}`
  
  ElMessageBox.alert(
    `<div style="padding: 20px;">
      <h3 style="margin-bottom: 16px;">分享到</h3>
      <div style="margin-bottom: 16px;">
        <p><strong>分享链接：</strong></p>
        <input type="text" value="${shareUrl}" readonly style="width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px;" />
      </div>
      <div style="margin-bottom: 16px;">
        <p>选择分享平台</p>
        <div style="display: flex; gap: 16px; margin-top: 12px;">
          <button type="button" style="width: 80px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            📱 微信
          </button>
          <button type="button" style="width: 80px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            💬 QQ
          </button>
          <button type="button" style="width: 100px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            🔗 复制链接
          </button>
        </div>
      </div>
    </div>`,
    '批量分享招聘需求',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭',
      customClass: 'share-dialog',
      showCancelButton: false
    }
  )
}

// 初始化
onMounted(() => {
  loadData()
  loadOptions()
})
</script>

<style scoped>
.recruitment-requirements-container {
  padding: 16px;
}

.search-card {
  margin-bottom: 20px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-toggle {
  color: #409eff;
}

.filter-expanded {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.filter-expanded .el-form-item {
  margin-right: 12px;
  margin-bottom: 12px;
}

/* 功能按钮区域 */
.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}




</style>
