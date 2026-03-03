<!-- 考试成绩页面 -->
<template>
  <div class="exam-result-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入姓名" clearable style="width: 160px" />
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
        <el-form-item>
          <el-button type="text" @click="toggleFilter" class="expand-toggle">
            <el-icon :class="{ 'rotate': filterExpanded }"><ArrowDown /></el-icon>
            <span>{{ filterExpanded ? '收起' : '展开' }}</span>
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 展开显示的更多查询条件 -->
      <div v-if="filterExpanded" class="filter-content expanded">
        <el-form inline :model="searchForm" class="search-form">
          <el-form-item label="工号">
            <el-input v-model="searchForm.workerNo" placeholder="请输入工号" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="考卷名称">
            <el-input v-model="searchForm.examName" placeholder="请输入考卷名称" clearable style="width: 200px" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="warning" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button type="info" @click="handlePrint">
        <el-icon><Printer /></el-icon>
        打印
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
      :showSelection="true"
      :showIndex="true"
      :showActions="true"
      action-column-width="180"
      :stats-info="statsInfo"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #column-score="{ row }">
        <span :class="getScoreClass(row.score, row.totalScore)">{{ row.score }}分</span>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">
          <el-icon><View /></el-icon>
          详情
        </el-button>
      </template>
    </CommonTable>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="考试成绩详情" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ currentRow?.workerName }}</el-descriptions-item>
        <el-descriptions-item label="工号">{{ currentRow?.workerNo }}</el-descriptions-item>
        <el-descriptions-item label="考卷名称">{{ currentRow?.examName }}</el-descriptions-item>
        <el-descriptions-item label="总分数">{{ currentRow?.totalScore }}分</el-descriptions-item>
        <el-descriptions-item label="实得分数">
          <span :class="getScoreClass(currentRow?.score || 0, currentRow?.totalScore || 100)">
            {{ currentRow?.score }}分
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="总时长">{{ currentRow?.totalTime }}分钟</el-descriptions-item>
        <el-descriptions-item label="总题数">{{ currentRow?.totalQuestions }}道</el-descriptions-item>
        <el-descriptions-item label="报考开始时间">{{ currentRow?.startTime }}</el-descriptions-item>
        <el-descriptions-item label="报考结束时间">{{ currentRow?.endTime }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">试卷题目及回答结果</el-divider>
      <el-table :data="currentRow?.questions || []" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="questionType" label="题目类型" width="100">
          <template #default="{ row }">
            {{ getQuestionTypeText(row.questionType) }}
          </template>
        </el-table-column>
        <el-table-column prop="answerType" label="答题类型" width="100">
          <template #default="{ row }">
            {{ getAnswerTypeText(row.answerType) }}
          </template>
        </el-table-column>
        <el-table-column prop="question" label="题干" min-width="200" show-overflow-tooltip />
        <el-table-column prop="score" label="分数" width="80" />
        <el-table-column prop="answerResult" label="回答结果" width="150">
          <template #default="{ row }">
            <el-tag :type="row.answerResult === '正确' ? 'success' : 'danger'" size="small">
              {{ row.answerResult }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog v-model="importVisible" title="导入考试成绩" width="500px">
      <div class="import-content">
        <el-upload
          ref="uploadRef"
          class="import-upload"
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleImportChange"
          :on-exceed="handleImportExceed"
        >
          <el-button type="primary">点击上传文件</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传xlsx/xls文件</div>
          </template>
        </el-upload>
        <div class="import-tips">
          <el-button type="text" @click="downloadTemplate">下载模板</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit" :loading="importLoading">确定导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import { Upload, Download, Printer, Search, Refresh, View, ArrowDown } from '@element-plus/icons-vue'

// 类型定义
interface ExamQuestionResult {
  questionType: string
  answerType: string
  question: string
  score: number
  answerResult: string
}

interface ExamResultRecord {
  id: string
  workerName: string
  workerNo: string
  examName: string
  totalScore: number
  score: number
  totalTime: number
  totalQuestions: number
  startTime: string
  endTime: string
  questions: ExamQuestionResult[]
}

// 表格列配置
const columns = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'workerNo', label: '工号', minWidth: 120, sortable: true },
  { prop: 'examName', label: '考卷名称', minWidth: 180, sortable: true },
  { prop: 'totalScore', label: '总分数', minWidth: 100, sortable: true },
  { prop: 'score', label: '实得分数', minWidth: 120, sortable: true },
  { prop: 'totalTime', label: '总时长(分钟)', minWidth: 120, sortable: true },
  { prop: 'totalQuestions', label: '总题数', minWidth: 100, sortable: true },
  { prop: 'startTime', label: '报考开始时间', minWidth: 160 },
  { prop: 'endTime', label: '报考结束时间', minWidth: 160 }
]

// 响应式数据
const tableData = ref<ExamResultRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<ExamResultRecord[]>([])
const detailVisible = ref(false)
const importVisible = ref(false)
const importLoading = ref(false)
const currentRow = ref<ExamResultRecord | null>(null)
const filterExpanded = ref(false)
const statsInfo = ref<Array<{ label: string; value: string }>>([])
const tableRef = ref<InstanceType<typeof CommonTable> | null>(null)

const searchForm = reactive({
  workerName: '',
  workerNo: '',
  examName: ''
})

// Mock数据
const mockData: ExamResultRecord[] = [
  {
    id: '1',
    workerName: '张三',
    workerNo: 'W001',
    examName: '安全生产知识测试',
    totalScore: 100,
    score: 85,
    totalTime: 60,
    totalQuestions: 20,
    startTime: '2024-02-01 00:00:00',
    endTime: '2024-02-28 23:59:59',
    questions: [
      { questionType: 'single', answerType: 'single', question: '安全生产中的"三违"是指什么？', score: 5, answerResult: '正确' },
      { questionType: 'multiple', answerType: 'multiple', question: '以下哪些属于个人防护用品？', score: 5, answerResult: '错误' },
      { questionType: 'true_false', answerType: 'true_false', question: '发现火灾时，应该首先拨打119报警。', score: 3, answerResult: '正确' }
    ]
  },
  {
    id: '2',
    workerName: '李四',
    workerNo: 'W002',
    examName: '安全生产知识测试',
    totalScore: 100,
    score: 92,
    totalTime: 60,
    totalQuestions: 20,
    startTime: '2024-02-01 00:00:00',
    endTime: '2024-02-28 23:59:59',
    questions: [
      { questionType: 'single', answerType: 'single', question: '安全生产中的"三违"是指什么？', score: 5, answerResult: '正确' },
      { questionType: 'multiple', answerType: 'multiple', question: '以下哪些属于个人防护用品？', score: 5, answerResult: '正确' },
      { questionType: 'true_false', answerType: 'true_false', question: '发现火灾时，应该首先拨打119报警。', score: 3, answerResult: '正确' }
    ]
  },
  {
    id: '3',
    workerName: '王五',
    workerNo: 'W003',
    examName: '岗位技能考核',
    totalScore: 100,
    score: 78,
    totalTime: 90,
    totalQuestions: 25,
    startTime: '2024-02-10 00:00:00',
    endTime: '2024-02-20 23:59:59',
    questions: [
      { questionType: 'single', answerType: 'single', question: '岗位操作规程的第一步是什么？', score: 4, answerResult: '正确' },
      { questionType: 'fill', answerType: 'fill', question: '设备维护的"三懂"是懂原理、懂性能、懂___。', score: 10, answerResult: '错误' }
    ]
  },
  {
    id: '4',
    workerName: '赵六',
    workerNo: 'W004',
    examName: '职业健康培训测试',
    totalScore: 80,
    score: 65,
    totalTime: 45,
    totalQuestions: 15,
    startTime: '2024-02-05 00:00:00',
    endTime: '2024-02-15 23:59:59',
    questions: [
      { questionType: 'single', answerType: 'single', question: '职业病危害因素包括哪些？', score: 5, answerResult: '错误' },
      { questionType: 'multiple', answerType: 'multiple', question: '个人防护用品的正确使用方法？', score: 5, answerResult: '正确' }
    ]
  },
  {
    id: '5',
    workerName: '钱七',
    workerNo: 'W005',
    examName: '安全生产知识测试',
    totalScore: 100,
    score: 55,
    totalTime: 60,
    totalQuestions: 20,
    startTime: '2024-02-01 00:00:00',
    endTime: '2024-02-28 23:59:59',
    questions: [
      { questionType: 'single', answerType: 'single', question: '安全生产中的"三违"是指什么？', score: 5, answerResult: '错误' },
      { questionType: 'multiple', answerType: 'multiple', question: '以下哪些属于个人防护用品？', score: 5, answerResult: '错误' }
    ]
  }
]

// 获取题目类型文本
const getQuestionTypeText = (type: string) => {
  const map: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    true_false: '判断题',
    fill: '填空题'
  }
  return map[type] || type
}

// 获取答题类型文本
const getAnswerTypeText = (type: string) => {
  const map: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    true_false: '判断题',
    fill: '填空题'
  }
  return map[type] || type
}

// 获取分数样式
const getScoreClass = (score: number, totalScore: number) => {
  const percentage = (score / totalScore) * 100
  if (percentage >= 90) return 'score-excellent'
  if (percentage >= 60) return 'score-pass'
  return 'score-fail'
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
    if (searchForm.examName) {
      filteredData = filteredData.filter(item => item.examName.includes(searchForm.examName))
    }

    total.value = filteredData.length
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filteredData.slice(start, start + pageSize.value)
    
    // 计算统计信息
    const totalRecords = mockData.length
    const excellentCount = mockData.filter(item => (item.score / item.totalScore) * 100 >= 90).length
    const passCount = mockData.filter(item => (item.score / item.totalScore) * 100 >= 60).length
    const failCount = mockData.filter(item => (item.score / item.totalScore) * 100 < 60).length
    statsInfo.value = [
      { label: '总记录数', value: totalRecords.toString() },
      { label: '优秀', value: excellentCount.toString() },
      { label: '及格', value: passCount.toString() },
      { label: '不及格', value: failCount.toString() }
    ]
    
    loading.value = false
  }, 500)
}

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
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
  searchForm.examName = ''
  handleSearch()
}

// 详情
const handleDetail = (row: ExamResultRecord) => {
  currentRow.value = row
  detailVisible.value = true
}

// 导入
const handleImport = () => {
  importVisible.value = true
}

// 处理导入文件变化
const handleImportChange = (file: any) => {
  console.log('import file:', file)
}

// 处理导入超出限制
const handleImportExceed = () => {
  ElMessage.warning('只能上传一个文件')
}

// 下载模板
const downloadTemplate = () => {
  ElMessage.info('模板下载功能开发中')
}

// 提交导入
const handleImportSubmit = () => {
  importLoading.value = true
  setTimeout(() => {
    ElMessage.success('导入成功')
    importLoading.value = false
    importVisible.value = false
    loadData()
  }, 1000)
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 打印
const handlePrint = () => {
  ElMessage.info('打印功能开发中')
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: ExamResultRecord[]) => {
  selectedRows.value = selection
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
.exam-result-page {
  padding: 16px;
  background-color: #f5f7fa;
}

.search-filter-section {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.filter-content {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
}

.expand-toggle {
  color: #409eff;
}

.rotate {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

:deep(.el-icon) {
  transition: transform 0.3s ease;
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

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.score-excellent {
  color: #67c23a;
  font-weight: 600;
}

.score-pass {
  color: #e6a23c;
  font-weight: 600;
}

.score-fail {
  color: #f56c6c;
  font-weight: 600;
}

.import-content {
  padding: 20px;
}

.import-upload {
  margin-bottom: 20px;
}

.import-tips {
  text-align: center;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
}
</style>
