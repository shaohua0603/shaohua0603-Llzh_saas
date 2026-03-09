<template>
  <div class="entertainment-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="活动标题">
          <el-input
            v-model="filterForm.keyword"
            placeholder="请输入活动标题"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select
            v-model="filterForm.type"
            placeholder="活动类型"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="文体活动" value="sports" />
            <el-option label="相亲活动" value="dating" />
            <el-option label="技能提升" value="skill" />
            <el-option label="社团活动" value="community" />
            <el-option label="其他活动" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select
            v-model="filterForm.status"
            placeholder="发布状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="未发布" value="unpublished" />
            <el-option label="进行中" value="ongoing" />
            <el-option label="已结束" value="ended" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <div class="expand-toggle" @click="toggleFilter">
        <el-icon :class="{ 'rotate-180': filterExpanded }"><ArrowDown /></el-icon>
        <span>{{ filterExpanded ? '收起' : '展开' }}</span>
      </div>
      <!-- 展开显示更多查询条件 -->
      <div v-if="filterExpanded" class="filter-content expanded">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="报名日期范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 250px"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增活动
      </el-button>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="entertainment-table"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :show-selection="false"
      :show-toolbar="true"
      :stats-info="statsInfo"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @global-search="handleGlobalSearch"
    >

      <template #column-activityType="{ row }">
        <el-tag>{{ getTypeText(row.activityType) }}</el-tag>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <template #column-isApprovalRequired="{ row }">
        <el-tag :type="row.isApprovalRequired ? 'warning' : 'success'">
          {{ row.isApprovalRequired ? '需要审核' : '无需审核' }}
        </el-tag>
      </template>

      <template #column-registrationPeriod="{ row }">
        {{ row.registrationStartDate }} ~ {{ row.registrationEndDate }}
      </template>

      <template #column-activityTime="{ row }">
        {{ row.activityStartTime }} ~ {{ row.activityEndTime }}
      </template>

      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button type="success" link @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
        <el-button type="info" link @click="handleShare(row)">
          <el-icon><Share /></el-icon>
          分享
        </el-button>
        <el-button
          v-if="row.status === 'unpublished'"
          type="warning"
          link
          @click="handlePublish(row)"
        >
          <el-icon><Upload /></el-icon>
          发布
        </el-button>
        <el-button
          v-if="row.status === 'published' || row.status === 'ongoing'"
          type="info"
          link
          @click="handleUnpublish(row)"
        >
          <el-icon><Download /></el-icon>
          取消发布
        </el-button>
        <el-button
          v-if="row.status === 'unpublished' && !row.isStarted"
          type="success"
          link
          @click="handleStartEarly(row)"
        >
          <el-icon><VideoPlay /></el-icon>
          提前开始
        </el-button>
        <el-button
          v-if="row.status === 'ongoing'"
          type="danger"
          link
          @click="handleEndEarly(row)"
        >
          <el-icon><VideoPause /></el-icon>
          提前结束
        </el-button>
      </template>
    </CommonTable>

    <!-- 分享组件 -->
    <ShareComponent 
      ref="shareComponentRef"
      :title="shareTitle"
      :id="shareId"
      :type="'entertainment'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, View, Edit, Delete, Upload, Download, VideoPlay, VideoPause, ArrowDown, Share } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import CommonTable from '@/components/CommonTable.vue'
import ShareComponent from '@/components/ShareComponent.vue'
import type { ColumnConfig } from '../../types/common-table'

// 类型定义
interface EntertainmentRecord {
  id: string
  title: string
  activityType: 'sports' | 'dating' | 'skill' | 'community' | 'other'
  communityId?: string
  isApprovalRequired: boolean
  registrationStartDate: string
  registrationEndDate: string
  address: string
  summary: string
  content: string
  activityStartTime: string
  activityEndTime: string
  status: 'unpublished' | 'published' | 'ongoing' | 'ended'
  isStarted: boolean
  createdAt: string
}

// 路由相关
const router = useRouter()

// 响应式数据
const filterExpanded = ref(false)
const filterForm = reactive({
  keyword: '',
  type: '',
  status: '',
  dateRange: [] as string[]
})
const tableData = ref<EntertainmentRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const shareComponentRef = ref<any>(null)
const shareTitle = ref('')
const shareId = ref('')

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'title', label: '活动标题', minWidth: 200, sortable: true },
  { prop: 'activityType', label: '活动类型', minWidth: 120 },
  { prop: 'isApprovalRequired', label: '是否报名审核', minWidth: 120 },
  { prop: 'registrationPeriod', label: '报名时间', minWidth: 220 },
  { prop: 'address', label: '活动地址', minWidth: 150 },
  { prop: 'activityTime', label: '活动时间', minWidth: 220 },
  { prop: 'status', label: '发布状态', minWidth: 100 }
]

// 统计数据
const stats = reactive({
  totalCount: 0,
  publishedCount: 0,
  ongoingCount: 0,
  endedCount: 0
})

// 统计信息字符串
const statsInfo = computed(() => {
  return `活动总数: ${stats.totalCount} | 已发布: ${stats.publishedCount} | 进行中: ${stats.ongoingCount} | 已结束: ${stats.endedCount}`
})

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

// 获取活动类型文本
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    sports: '文体活动',
    dating: '相亲活动',
    skill: '技能提升',
    community: '社团活动',
    other: '其他活动'
  }
  return typeMap[type] || type
}

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    unpublished: 'info',
    published: 'success',
    ongoing: 'primary',
    ended: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    unpublished: '未发布',
    published: '已发布',
    ongoing: '进行中',
    ended: '已结束'
  }
  return textMap[status] || status
}

// 生成模拟数据
const generateMockData = (): EntertainmentRecord[] => {
  const titles = [
    '周末篮球比赛',
    '中秋相亲派对',
    '技能培训班',
    '国庆文艺晚会',
    '羽毛球友谊赛',
    '读书分享会',
    '摄影外拍活动',
    '舞蹈教学课程',
    '歌手大赛',
    '趣味运动会'
  ]
  const types: EntertainmentRecord['activityType'][] = ['sports', 'dating', 'skill', 'community', 'other']
  const statuses: EntertainmentRecord['status'][] = ['unpublished', 'published', 'ongoing', 'ended']
  const data: EntertainmentRecord[] = []

  for (let i = 0; i < 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const activityType = types[Math.floor(Math.random() * types.length)]
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 10)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 10) + 1)
    const activityStart = new Date(startDate)
    activityStart.setHours(9 + Math.floor(Math.random() * 8), 0, 0)
    const activityEnd = new Date(activityStart)
    activityEnd.setHours(activityStart.getHours() + Math.floor(Math.random() * 4) + 2)

    data.push({
      id: `ENT${String(i + 1).padStart(6, '0')}`,
      title: titles[i % titles.length] + (i > 9 ? ` ${i + 1}` : ''),
      activityType,
      communityId: activityType === 'community' ? `C00${(i % 6) + 1}` : undefined,
      isApprovalRequired: Math.random() > 0.5,
      registrationStartDate: startDate.toISOString().split('T')[0],
      registrationEndDate: endDate.toISOString().split('T')[0],
      address: `活动中心${(i % 5) + 1}号场地`,
      summary: `精彩纷呈的${getTypeText(activityType)}，欢迎大家积极参与`,
      content: `<p>欢迎参加本次${titles[i % titles.length]}活动！</p><p>活动详情内容...</p>`,
      activityStartTime: activityStart.toISOString().replace('T', ' ').split('.')[0],
      activityEndTime: activityEnd.toISOString().replace('T', ' ').split('.')[0],
      status,
      isStarted: status === 'ongoing' || status === 'ended',
      createdAt: new Date().toISOString()
    })
  }

  return data
}

// 从localStorage获取数据
const getAllData = (): EntertainmentRecord[] => {
  const data = localStorage.getItem('entertainmentData')
  if (data) {
    return JSON.parse(data)
  } else {
    const mockData = generateMockData()
    localStorage.setItem('entertainmentData', JSON.stringify(mockData))
    return mockData
  }
}

// 保存数据到localStorage
const saveData = (data: EntertainmentRecord[]) => {
  localStorage.setItem('entertainmentData', JSON.stringify(data))
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const handleReset = () => {
  filterForm.keyword = ''
  filterForm.type = ''
  filterForm.status = ''
  filterForm.dateRange = []
  handleSearch()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  filterForm.keyword = keyword
  handleSearch()
}

// 获取数据
const fetchData = () => {
  loading.value = true

  let allData = getAllData()
  let filteredData = [...allData]

  if (filterForm.keyword) {
    filteredData = filteredData.filter(item =>
      item.title.toLowerCase().includes(filterForm.keyword.toLowerCase())
    )
  }

  if (filterForm.type) {
    filteredData = filteredData.filter(item => item.activityType === filterForm.type)
  }

  if (filterForm.status) {
    filteredData = filteredData.filter(item => item.status === filterForm.status)
  }

  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    filteredData = filteredData.filter(item => {
      return item.registrationStartDate >= filterForm.dateRange[0] && item.registrationEndDate <= filterForm.dateRange[1]
    })
  }

  // 更新统计
  stats.totalCount = filteredData.length
  stats.publishedCount = filteredData.filter(item =>
    item.status === 'published' || item.status === 'ongoing'
  ).length
  stats.ongoingCount = filteredData.filter(item => item.status === 'ongoing').length
  stats.endedCount = filteredData.filter(item => item.status === 'ended').length

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length

  loading.value = false
}

// 新增
const handleAdd = () => {
  router.push('/tenant/on-duty/entertainment/add')
}

// 编辑
const handleEdit = (row: EntertainmentRecord) => {
  router.push(`/tenant/on-duty/entertainment/edit/${row.id}`)
}

// 查看
const handleView = (row: EntertainmentRecord) => {
  router.push(`/tenant/on-duty/entertainment/detail/${row.id}`)
}

// 删除
const handleDelete = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let allData = getAllData()
    const index = allData.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.splice(index, 1)
      saveData(allData)
    }
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 发布
const handlePublish = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要发布该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    let allData = getAllData()
    const index = allData.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData[index].status = 'published'
      saveData(allData)
    }
    ElMessage.success('发布成功')
    fetchData()
  }).catch(() => {})
}

// 取消发布
const handleUnpublish = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要取消发布该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    let allData = getAllData()
    const index = allData.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData[index].status = 'unpublished'
      saveData(allData)
    }
    ElMessage.success('取消发布成功')
    fetchData()
  }).catch(() => {})
}

// 提前开始
const handleStartEarly = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要提前开始该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    let allData = getAllData()
    const index = allData.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData[index].status = 'ongoing'
      allData[index].isStarted = true
      saveData(allData)
    }
    ElMessage.success('活动已开始')
    fetchData()
  }).catch(() => {})
}

// 提前结束
const handleEndEarly = (row: EntertainmentRecord) => {
  ElMessageBox.confirm('确定要提前结束该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    let allData = getAllData()
    const index = allData.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData[index].status = 'ended'
      saveData(allData)
    }
    ElMessage.success('活动已结束')
    fetchData()
  }).catch(() => {})
}

// 分享
const handleShare = (row: EntertainmentRecord) => {
  shareTitle.value = row.title
  shareId.value = row.id
  if (shareComponentRef.value) {
    shareComponentRef.value.openShareDialog()
  }
}

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.entertainment-management {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 搜索筛选区域 */
.search-filter-section {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-content {
  margin-bottom: 12px;
}

.filter-content.expanded {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e4e7ed;
  animation: slideDown 0.3s ease-in-out;
}

.expand-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  width: fit-content;
}

.filter-form {
  margin-bottom: 0;
}

.filter-form :deep(.el-form-item) {
  margin-right: 16px;
  margin-bottom: 12px;
}

/* 操作按钮栏 */
.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-content {
  padding: 10px;
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .entertainment-management {
    padding: 12px;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .filter-form :deep(.el-form-item) {
    width: 100%;
  }
  
  .filter-form :deep(.el-input),
  .filter-form :deep(.el-select),
  .filter-form :deep(.el-date-picker) {
    width: 100%;
  }
}
</style>
