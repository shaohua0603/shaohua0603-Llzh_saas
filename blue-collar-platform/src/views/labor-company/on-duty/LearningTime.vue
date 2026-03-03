<!-- 学习时长管理页面 -->
<template>
  <div class="learning-time-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-card :body-style="{ padding: '16px' }" shadow="hover">
        <el-form inline :model="searchForm" class="search-form">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.workerName" placeholder="请输入姓名" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="工号" v-show="filterExpanded">
            <el-input v-model="searchForm.workerNo" placeholder="请输入工号" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="学习材料类型" v-show="filterExpanded">
            <el-select v-model="searchForm.materialType" placeholder="请选择" clearable style="width: 150px">
              <el-option label="全部" value="" />
              <el-option label="岗前培训" value="pre_job" />
              <el-option label="日常培训" value="daily" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="text" @click="toggleFilter">
              <el-icon :class="{ 'is-rotated': filterExpanded }">
                <ArrowDown />
              </el-icon>
              {{ filterExpanded ? '收起' : '展开' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>

    <!-- 表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :showSelection="false"
      :showIndex="true"
      :showActions="false"
      :stats-info="statsInfo"
      @sort-change="handleSortChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >

      <template #column-materialType="{ row }">
        <el-tag :type="getMaterialTypeTag(row.materialType)">
          {{ getMaterialTypeText(row.materialType) }}
        </el-tag>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import { ArrowDown, Download } from '@element-plus/icons-vue'

// 类型定义
interface LearningTimeRecord {
  id: string
  workerName: string
  workerNo: string
  totalLearningTime: number
  monthLearningTime: number
  materialType: 'pre_job' | 'daily'
  materialTitle: string
  materialSummary: string
}

// 表格列配置
const columns = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'workerNo', label: '工号', minWidth: 120, sortable: true },
  { prop: 'totalLearningTime', label: '累计学习时长(小时)', minWidth: 150, sortable: true },
  { prop: 'monthLearningTime', label: '当月学习时长(小时)', minWidth: 160, sortable: true },
  { prop: 'materialType', label: '学习材料类型', minWidth: 120, sortable: true },
  { prop: 'materialTitle', label: '材料标题', minWidth: 200 },
  { prop: 'materialSummary', label: '材料摘要', minWidth: 300 }
]

// 响应式数据
const tableData = ref<LearningTimeRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const filterExpanded = ref(false)
const statsInfo = ref<Array<{ label: string; value: string | number }>>([])
const tableRef = ref()

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

const searchForm = reactive({
  workerName: '',
  workerNo: '',
  materialType: ''
})

// Mock数据
const mockData: LearningTimeRecord[] = [
  {
    id: '1',
    workerName: '张三',
    workerNo: 'W001',
    totalLearningTime: 45,
    monthLearningTime: 8,
    materialType: 'pre_job',
    materialTitle: '安全生产基础知识',
    materialSummary: '本课程主要介绍安全生产的基本概念、基本原则和基本要求'
  },
  {
    id: '2',
    workerName: '张三',
    workerNo: 'W001',
    totalLearningTime: 45,
    monthLearningTime: 8,
    materialType: 'daily',
    materialTitle: '消防知识培训',
    materialSummary: '消防知识普及和火灾应对方法'
  },
  {
    id: '3',
    workerName: '李四',
    workerNo: 'W002',
    totalLearningTime: 32,
    monthLearningTime: 5,
    materialType: 'pre_job',
    materialTitle: '岗位操作规程',
    materialSummary: '详细介绍各岗位的操作规程和注意事项'
  },
  {
    id: '4',
    workerName: '李四',
    workerNo: 'W002',
    totalLearningTime: 32,
    monthLearningTime: 5,
    materialType: 'daily',
    materialTitle: '职业健康防护',
    materialSummary: '职业健康防护知识和个人防护用品使用'
  },
  {
    id: '5',
    workerName: '王五',
    workerNo: 'W003',
    totalLearningTime: 28,
    monthLearningTime: 3,
    materialType: 'pre_job',
    materialTitle: '安全生产基础知识',
    materialSummary: '本课程主要介绍安全生产的基本概念、基本原则和基本要求'
  },
  {
    id: '6',
    workerName: '赵六',
    workerNo: 'W004',
    totalLearningTime: 56,
    monthLearningTime: 12,
    materialType: 'daily',
    materialTitle: '消防知识培训',
    materialSummary: '消防知识普及和火灾应对方法'
  },
  {
    id: '7',
    workerName: '钱七',
    workerNo: 'W005',
    totalLearningTime: 18,
    monthLearningTime: 2,
    materialType: 'pre_job',
    materialTitle: '岗位操作规程',
    materialSummary: '详细介绍各岗位的操作规程和注意事项'
  },
  {
    id: '8',
    workerName: '孙八',
    workerNo: 'W006',
    totalLearningTime: 40,
    monthLearningTime: 6,
    materialType: 'daily',
    materialTitle: '职业健康防护',
    materialSummary: '职业健康防护知识和个人防护用品使用'
  }
]

// 获取类型标签
const getMaterialTypeTag = (type: string) => {
  const map: Record<string, string> = {
    pre_job: 'success',
    daily: 'primary'
  }
  return map[type] || 'info'
}

// 获取类型文本
const getMaterialTypeText = (type: string) => {
  const map: Record<string, string> = {
    pre_job: '岗前培训',
    daily: '日常培训'
  }
  return map[type] || type
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let filteredData = [...mockData]

    // 筛选
    if (searchForm.workerName) {
      filteredData = filteredData.filter(item => item.workerName.includes(searchForm.workerName))
    }
    if (searchForm.workerNo) {
      filteredData = filteredData.filter(item => item.workerNo.includes(searchForm.workerNo))
    }
    if (searchForm.materialType) {
      filteredData = filteredData.filter(item => item.materialType === searchForm.materialType)
    }

    // 计算统计信息
    const totalWorkers = new Set(filteredData.map(item => item.workerNo)).size
    const totalLearningTime = filteredData.reduce((sum, item) => sum + item.totalLearningTime, 0)
    const avgLearningTime = totalWorkers > 0 ? (totalLearningTime / totalWorkers).toFixed(1) : 0
    
    statsInfo.value = [
      { label: '统计人数', value: totalWorkers },
      { label: '总学习时长(小时)', value: totalLearningTime },
      { label: '平均学习时长(小时)', value: avgLearningTime }
    ]

    total.value = filteredData.length
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filteredData.slice(start, start + pageSize.value)
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.workerName = ''
  searchForm.workerNo = ''
  searchForm.materialType = ''
  handleSearch()
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 分页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.learning-time-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-filter-section {
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  transition: all 0.3s ease;
}

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

.is-rotated {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

:deep(.el-icon) {
  transition: transform 0.3s;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .search-form {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .el-form-item {
    width: 100%;
  }
  
  .el-input,
  .el-select {
    width: 100% !important;
  }
}
</style>
