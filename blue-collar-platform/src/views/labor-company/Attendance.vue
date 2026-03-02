<!-- 考勤管理页面 -->
<template>
  <div class="attendance-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="工人姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入工人姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
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
        <el-form-item label="考勤状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="正常" value="normal" />
            <el-option label="迟到" value="late" />
            <el-option label="早退" value="early" />
            <el-option label="缺勤" value="absent" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 考勤统计 -->
    <div class="attendance-stats">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ attendanceStats.totalWorkers }}</div>
          <div class="stat-label">总人数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number normal">{{ attendanceStats.normalCount }}</div>
          <div class="stat-label">正常</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number late">{{ attendanceStats.lateCount }}</div>
          <div class="stat-label">迟到</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number early">{{ attendanceStats.earlyCount }}</div>
          <div class="stat-label">早退</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number absent">{{ attendanceStats.absentCount }}</div>
          <div class="stat-label">缺勤</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ attendanceStats.attendanceRate }}%</div>
          <div class="stat-label">出勤率</div>
        </div>
      </el-card>
    </div>

    <!-- 工具栏 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :showToolbar="true"
      :showSelection="true"
      :showIndex="true"
      :showActions="true"
      action-column-width="200"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar-right>
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
        <el-button type="info" @click="handlePrint">
          <el-icon><Printer /></el-icon>
          打印
        </el-button>
      </template>
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :showToolbar="false"
      :showSelection="true"
      :showIndex="true"
      :showActions="true"
      action-column-width="200"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="工人姓名" prop="workerName">
          <el-input v-model="formData.workerName" placeholder="请输入工人姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="考勤日期" prop="attendanceDate">
          <el-date-picker
            v-model="formData.attendanceDate"
            type="date"
            placeholder="选择考勤日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="考勤状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择考勤状态" style="width: 100%">
            <el-option label="正常" value="normal" />
            <el-option label="迟到" value="late" />
            <el-option label="早退" value="early" />
            <el-option label="缺勤" value="absent" />
          </el-select>
        </el-form-item>
        <el-form-item label="上班时间">
          <el-time-picker
            v-model="formData.checkInTime"
            placeholder="选择上班时间"
            format="HH:mm"
            value-format="HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="下班时间">
          <el-time-picker
            v-model="formData.checkOutTime"
            placeholder="选择下班时间"
            format="HH:mm"
            value-format="HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="工作时长">
          <el-input-number v-model="formData.workHours" :min="0" :max="24" :precision="1" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="考勤详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工人姓名">{{ currentRow.workerName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentRow.phone }}</el-descriptions-item>
        <el-descriptions-item label="考勤日期">{{ currentRow.attendanceDate }}</el-descriptions-item>
        <el-descriptions-item label="考勤状态">
          <el-tag :type="getStatusType(currentRow.status)">
            {{ getStatusText(currentRow.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="上班时间">{{ currentRow.checkInTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="下班时间">{{ currentRow.checkOutTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="工作时长">{{ currentRow.workHours ? currentRow.workHours + '小时' : '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, Printer } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

// 搜索表单
const searchForm = reactive({
  workerName: '',
  phone: '',
  attendanceDate: '',
  status: ''
})

// 考勤统计
const attendanceStats = ref({
  totalWorkers: 0,
  normalCount: 0,
  lateCount: 0,
  earlyCount: 0,
  absentCount: 0,
  attendanceRate: 0
})

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
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const importDialogVisible = ref(false)
const dialogTitle = ref('新增考勤')
const submitLoading = ref(false)
const importLoading = ref(false)
const formRef = ref()
const uploadRef = ref()
const currentRow = ref<any>({})
const importFile = ref()

const formData = reactive({
  id: '',
  workerName: '',
  phone: '',
  attendanceDate: '',
  status: 'normal',
  checkInTime: '',
  checkOutTime: '',
  workHours: 8
})

const formRules = {
  workerName: [{ required: true, message: '请输入工人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  attendanceDate: [{ required: true, message: '请选择考勤日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择考勤状态', trigger: 'change' }]
}

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
  dialogTitle.value = '新增考勤'
  formData.id = ''
  formData.workerName = ''
  formData.phone = ''
  formData.attendanceDate = ''
  formData.status = 'normal'
  formData.checkInTime = ''
  formData.checkOutTime = ''
  formData.workHours = 8
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑考勤'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 详情
const handleDetail = (row: any) => {
  currentRow.value = row
  detailDialogVisible.value = true
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

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        ElMessage.success(dialogTitle.value === '新增考勤' ? '新增成功' : '修改成功')
        dialogVisible.value = false
        submitLoading.value = false
        fetchData()
      }, 500)
    }
  })
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

// 打印
const handlePrint = () => {
  ElMessage.info('打印功能开发中')
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
  padding: 20px;
}

.search-filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 考勤统计 */
.attendance-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  height: 80px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-number.normal {
  color: #67c23a;
}

.stat-number.late {
  color: #e6a23c;
}

.stat-number.early {
  color: #f56c6c;
}

.stat-number.absent {
  color: #909399;
}

.stat-label {
  font-size: 14px;
  color: #606266;
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
