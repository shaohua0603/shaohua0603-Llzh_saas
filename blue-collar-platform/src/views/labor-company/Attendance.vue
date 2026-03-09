<!-- 考勤管理页面 -->
<template>
  <div class="attendance-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <!-- 默认显示的一行查询条件 -->
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="工人姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入工人姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="考勤日期">
          <el-date-picker
            v-model="searchForm.attendanceDate"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
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
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="考勤状态">
            <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 150px">
              <el-option label="全部" value="" />
              <el-option label="正常" value="normal" />
              <el-option label="迟到" value="late" />
              <el-option label="早退" value="early" />
              <el-option label="缺勤" value="absent" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
      <el-button type="warning" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>

    </div>

    <!-- 表格区域 -->
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
      :action-column-width="200"
      :stats-info="statsInfo"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #column-paymentType="{ row }">
        <el-tag :type="row.paymentType === 'daily' ? 'warning' : 'success'">
          {{ row.paymentType === 'daily' ? '日结' : '月结' }}
        </el-tag>
      </template>

      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>
      <template #column-checkInTime="{ row }">
        {{ row.checkInTime || '-' }}
      </template>
      <template #column-checkOutTime="{ row }">
        {{ row.checkOutTime || '-' }}
      </template>
      <template #column-workHours="{ row }">
        {{ row.workHours ? row.workHours + '小时' : '-' }}
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>



    <!-- 导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="导入考勤数据" width="500px">
      <div class="import-content">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              请上传Excel文件，支持.xls和.xlsx格式
            </div>
          </template>
        </el-upload>
        <div class="download-template">
          <el-button link type="primary" @click="downloadTemplate">
            <el-icon><Download /></el-icon>
            下载导入模板
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit" :loading="importLoading">导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

// 搜索表单
const router = useRouter()
const filterExpanded = ref(false)
const searchForm = reactive({
  workerName: '',
  phone: '',
  attendanceDate: '',
  status: ''
})

// 切换筛选区域
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
}

// 考勤统计
const attendanceStats = ref({
  totalWorkers: 0,
  normalCount: 0,
  lateCount: 0,
  earlyCount: 0,
  absentCount: 0,
  attendanceRate: 0
})

// 统计信息
const statsInfo = ref([
  { label: '总人数', value: '0' },
  { label: '正常', value: '0' },
  { label: '迟到', value: '0' },
  { label: '早退', value: '0' },
  { label: '缺勤', value: '0' },
  { label: '出勤率', value: '0%' }
])

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<any[]>([])

// 表格列配置
const columns = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'paymentType', label: '结算方式', minWidth: 100 },
  { prop: 'attendanceDate', label: '考勤日期', minWidth: 120, sortable: true },
  { prop: 'status', label: '考勤状态', minWidth: 100 },
  { prop: 'checkInTime', label: '上班时间', minWidth: 120 },
  { prop: 'checkOutTime', label: '下班时间', minWidth: 120 },
  { prop: 'workHours', label: '工作时长', minWidth: 100 },
  { prop: 'createTime', label: '创建时间', minWidth: 160, sortable: true }
]

// 表格引用
const tableRef = ref()

// 弹窗控制
const importDialogVisible = ref(false)
const importLoading = ref(false)
const uploadRef = ref()
const importFile = ref()

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    normal: 'success',
    late: 'warning',
    early: 'warning',
    absent: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    normal: '正常',
    late: '迟到',
    early: '早退',
    absent: '缺勤'
  }
  return textMap[status] || status
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.workerName = ''
  searchForm.phone = ''
  searchForm.attendanceDate = ''
  searchForm.status = ''
  handleSearch()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    tableData.value = [
      {
        id: '1',
        workerName: '张三',
        phone: '13800138000',
        paymentType: 'daily',
        attendanceDate: '2024-01-15',
        status: 'normal',
        checkInTime: '08:30:00',
        checkOutTime: '17:30:00',
        workHours: 8,
        createTime: '2024-01-15 18:00:00'
      },
      {
        id: '2',
        workerName: '李四',
        phone: '13800138001',
        paymentType: 'monthly',
        attendanceDate: '2024-01-15',
        status: 'late',
        checkInTime: '09:15:00',
        checkOutTime: '17:30:00',
        workHours: 7.5,
        createTime: '2024-01-15 18:00:00'
      },
      {
        id: '3',
        workerName: '王五',
        phone: '13800138002',
        paymentType: 'daily',
        attendanceDate: '2024-01-15',
        status: 'early',
        checkInTime: '08:30:00',
        checkOutTime: '16:00:00',
        workHours: 7,
        createTime: '2024-01-15 18:00:00'
      },
      {
        id: '4',
        workerName: '赵六',
        phone: '13800138003',
        paymentType: 'monthly',
        attendanceDate: '2024-01-15',
        status: 'absent',
        checkInTime: '',
        checkOutTime: '',
        workHours: 0,
        createTime: '2024-01-15 18:00:00'
      },
      {
        id: '5',
        workerName: '钱七',
        phone: '13800138004',
        paymentType: 'daily',
        attendanceDate: '2024-01-16',
        status: 'normal',
        checkInTime: '08:00:00',
        checkOutTime: '17:00:00',
        workHours: 8,
        createTime: '2024-01-16 18:00:00'
      }
    ]
    total.value = 5

    // 统计
    attendanceStats.value = {
      totalWorkers: 5,
      normalCount: 2,
      lateCount: 1,
      earlyCount: 1,
      absentCount: 1,
      attendanceRate: 40
    }

    // 更新统计信息
    statsInfo.value = [
      { label: '总人数', value: attendanceStats.value.totalWorkers.toString() },
      { label: '正常', value: attendanceStats.value.normalCount.toString() },
      { label: '迟到', value: attendanceStats.value.lateCount.toString() },
      { label: '早退', value: attendanceStats.value.earlyCount.toString() },
      { label: '缺勤', value: attendanceStats.value.absentCount.toString() },
      { label: '出勤率', value: attendanceStats.value.attendanceRate + '%' }
    ]

    loading.value = false
  }, 500)
}

// 分页
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 排序
const handleSortChange = (sort: { prop: string; order: string }) => {
  console.log('排序变化:', sort)
}

// 选择
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  router.push('/tenant/attendance-add')
}

// 编辑
const handleEdit = (row: any) => {
  router.push({
    path: `/tenant/attendance-edit/${row.id}`
  })
}

// 详情
const handleDetail = (row: any) => {
  router.push({
    path: `/tenant/attendance-detail/${row.id}`
  })
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条考勤记录吗？', '提示', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}



// 导入
const handleImport = () => {
  importDialogVisible.value = true
}

// 文件变化
const handleFileChange = (file: any) => {
  importFile.value = file
}

// 下载模板
const downloadTemplate = () => {
  ElMessage.info('模板下载功能开发中')
}

// 提交导入
const handleImportSubmit = async () => {
  if (!importFile.value) {
    ElMessage.warning('请先选择要导入的文件')
    return
  }
  importLoading.value = true
  setTimeout(() => {
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    importLoading.value = false
    importFile.value = null
    fetchData()
  }, 1000)
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}



// 初始化
onMounted(() => {
  // 设置默认月份
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  searchForm.attendanceDate = `${year}-${month}`

  fetchData()
})
</script>

<style scoped>
.attendance-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-filter-section {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
}

.filter-content.expanded {
  padding: 0 20px 16px 20px;
  border-top: 1px solid #e4e7ed;
}

.expand-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
  padding: 0;
  height: 32px;
}

.expand-toggle:hover {
  color: #66b1ff;
}

.expand-toggle .el-icon {
  transition: transform 0.3s ease;
}

.expand-toggle .el-icon.rotate {
  transform: rotate(180deg);
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



.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.import-content {
  padding: 20px;
}

.download-template {
  margin-top: 20px;
  text-align: center;
}
</style>
