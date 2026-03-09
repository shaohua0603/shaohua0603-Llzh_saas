<template>
  <div class="resume-management-container">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <div class="filter-header">
        <el-form :inline="true" :model="queryParams">
          <el-form-item label="关键词">
            <el-input
              v-model="queryParams.keyword"
              placeholder="姓名/手机号"
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
            <el-form-item label="应聘岗位">
              <el-select
                v-model="queryParams.positionId"
                placeholder="请选择岗位"
                clearable
                style="width: 180px"
              >
                <el-option
                  v-for="item in positionOptions"
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
            <el-form-item label="性别">
              <el-select
                v-model="queryParams.gender"
                placeholder="请选择性别"
                clearable
                style="width: 120px"
              >
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="学历">
              <el-select
                v-model="queryParams.education"
                placeholder="请选择学历"
                clearable
                style="width: 150px"
              >
                <el-option
                  v-for="item in educationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="工作经验">
              <el-select
                v-model="queryParams.experience"
                placeholder="请选择工作经验"
                clearable
                style="width: 150px"
              >
                <el-option
                  v-for="item in experienceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="提交时间">
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
        @click="handleAdd"
      >
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
      <el-button
        @click="handleExport"
      >
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-dropdown
        v-if="selectedIds.length > 0"
        @command="handleBatchCommand"
      >
        <el-button>
          批量操作
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="delete">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 简历列表 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共收到 {{ total }} 份简历，其中待审核 {{ tableData.filter(item => item.status === 'pending' || item.status === 'reviewing').length }} 份，已通过 {{ tableData.filter(item => item.status === 'approved').length }} 份，已拒绝 {{ tableData.filter(item => item.status === 'rejected').length }} 份</span>
      </div>
      <CommonTable
        ref="tableRef"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :show-selection="true"
        :show-index="true"
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

        <template #column-gender="{ row }">
          {{ getGenderText(row.gender) }}
        </template>

        <template #column-education="{ row }">
          {{ getEducationText(row.education) }}
        </template>

        <template #column-experience="{ row }">
          {{ getExperienceText(row.experience) }}
        </template>

        <template #column-actions="{ row }">
          <el-button
            type="primary"
            link
            @click="handleView(row)"
          >
            查看
          </el-button>
          <el-button
            type="primary"
            link
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            @click="handleDelete(row)"
          >
            删除
          </el-button>
          <el-dropdown v-if="row.status === 'pending' || row.status === 'reviewing'" @command="(cmd) => handleReviewCommand(cmd, row)">
            <el-button type="primary" link>
              审核
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="approved">通过</el-dropdown-item>
                <el-dropdown-item command="rejected">拒绝</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            v-if="row.status === 'approved'"
            type="success"
            link
            @click="handleHire(row)"
          >
            录用
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
import { Plus, Delete, Download, View, Edit, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import {
  getResumeList,
  deleteResume,
  batchDeleteResumes,
  exportResumes,
  reviewResume,
  hireResume,
  getPositionOptions
} from '@/api/recruitmentApi'
import type { Resume, ResumeQueryParams } from '@/types/recruitmentTypes'
import {
  ResumeStatus,
  ResumeStatusText,
  ResumeStatusTagType,
  Gender,
  GenderText,
  Education,
  EducationText,
  Experience,
  ExperienceText
} from '@/types/recruitmentTypes'

const router = useRouter()

// 表格引用
const tableRef = ref()

// 加载状态
const loading = ref(false)

// 选中项
const selectedIds = ref<string[]>([])

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 筛选条件展开状态
const filterVisible = ref(false)

// 总简历数
const total = ref(0)

// 查询参数
const queryParams = reactive<ResumeQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: undefined,
  positionId: undefined,
  gender: undefined,
  education: undefined,
  experience: undefined,
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
const tableData = ref<Resume[]>([])

// 状态选项
const statusOptions = Object.entries(ResumeStatusText).map(([value, label]) => ({
  value,
  label
}))

// 性别选项
const genderOptions = Object.entries(GenderText).map(([value, label]) => ({
  value,
  label
}))

// 学历选项
const educationOptions = Object.entries(EducationText).map(([value, label]) => ({
  value,
  label
}))

// 工作经验选项
const experienceOptions = Object.entries(ExperienceText).map(([value, label]) => ({
  value,
  label
}))

// 岗位选项
const positionOptions = ref<Array<{ value: string; label: string }>>([])

// 表格列配置
const columns = [
  {
    prop: 'name',
    label: '姓名',
    width: 100,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'phone',
    label: '手机号',
    width: 130,
    sortable: true
  },
  {
    prop: 'gender',
    label: '性别',
    width: 80,
    sortable: true
  },
  {
    prop: 'age',
    label: '年龄',
    width: 80,
    sortable: true,
    align: 'center'
  },
  {
    prop: 'education',
    label: '学历',
    width: 100,
    sortable: true
  },
  {
    prop: 'positionName',
    label: '应聘岗位',
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
    prop: 'experience',
    label: '工作经验',
    width: 120,
    sortable: true
  },
  {
    prop: 'factoryName',
    label: '工厂名称',
    width: 150,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'laborCompanyName',
    label: '劳务公司',
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
    prop: 'submitTime',
    label: '提交时间',
    width: 180,
    sortable: true
  },
  {
    prop: 'actions',
    label: '操作',
    width: 280,
    fixed: 'right'
  }
]

// 获取状态文本
const getStatusText = (status: ResumeStatus) => {
  return ResumeStatusText[status] || status
}

// 获取状态标签类型
const getStatusTagType = (status: ResumeStatus) => {
  return ResumeStatusTagType[status] || 'info'
}

// 获取性别文本
const getGenderText = (gender: Gender) => {
  return GenderText[gender] || gender
}

// 获取学历文本
const getEducationText = (education: Education) => {
  return EducationText[education] || education
}

// 获取工作经验文本
const getExperienceText = (experience: Experience) => {
  return ExperienceText[experience] || experience
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
    const response = await getResumeList(params)
    tableData.value = response.data.list
    pagination.total = response.data.total
    total.value = response.data.total
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
    const response = await getPositionOptions()
    positionOptions.value = response.data || []
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
  queryParams.positionId = undefined
  queryParams.positionCategory = undefined
  queryParams.gender = undefined
  queryParams.education = undefined
  queryParams.experience = undefined
  dateRange.value = null
  queryParams.startDate = undefined
  queryParams.endDate = undefined
  queryParams.page = 1
  loadData()
}

// 新增
const handleAdd = () => {
  router.push('/admin/recruitment-management/resume-management/add')
}

// 查看
const handleView = (row: Resume) => {
  router.push(`/admin/recruitment-management/resume-management/${row.id}`)
}

// 编辑
const handleEdit = (row: Resume) => {
  router.push(`/admin/recruitment-management/resume-management/edit/${row.id}`)
}

// 删除
const handleDelete = (row: Resume) => {
  ElMessageBox.confirm('确定要删除该简历吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteResume(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 批量操作
const handleBatchCommand = (command: string) => {
  switch (command) {
    case 'delete':
      handleBatchDelete()
      break
  }
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的${selectedIds.value.length}条简历吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeleteResumes(selectedIds.value)
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
    const response = await exportResumes(params)
    const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `简历管理_${new Date().getTime()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 审核
const handleReviewCommand = (command: string, row: Resume) => {
  const actions = {
    approved: { text: '通过', status: 'approved' },
    rejected: { text: '拒绝', status: 'rejected' }
  }
  const action = actions[command as keyof typeof actions]
  if (action) {
    if (action.status === 'rejected') {
      ElMessageBox.prompt('请输入拒绝原因', '拒绝简历', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '请输入拒绝原因'
      }).then(async ({ value }) => {
        try {
          await reviewResume(row.id, {
            status: action.status as 'approved' | 'rejected',
            reviewComment: value
          })
          ElMessage.success('审核成功')
          loadData()
        } catch (error) {
          console.error('审核失败:', error)
          ElMessage.error('审核失败')
        }
      }).catch(() => {})
    } else {
      ElMessageBox.confirm(`确定要${action.text}该简历吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await reviewResume(row.id, {
            status: action.status as 'approved' | 'rejected'
          })
          ElMessage.success('审核成功')
          loadData()
        } catch (error) {
          console.error('审核失败:', error)
          ElMessage.error('审核失败')
        }
      }).catch(() => {})
    }
  }
}

// 录用
const handleHire = (row: Resume) => {
  ElMessageBox.confirm(`确定要录用该候选人吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await hireResume(row.id, {
        hireDate: new Date().toISOString().split('T')[0]
      })
      ElMessage.success('录用成功')
      loadData()
    } catch (error) {
      console.error('录用失败:', error)
      ElMessage.error('录用失败')
    }
  }).catch(() => {})
}

// 选择变化
const handleSelectionChange = (selection: Resume[]) => {
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

// 初始化
onMounted(() => {
  loadData()
  loadOptions()
})
</script>

<style scoped>
.resume-management-container {
  padding: 16px;
  background-color: #f5f7fa;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  color: #606266;
}

.table-stats p {
  margin: 0;
  line-height: 1.5;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-bar .el-button {
    width: 100%;
  }
  
  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
