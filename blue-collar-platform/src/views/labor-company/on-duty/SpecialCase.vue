<!-- 特殊情况管理页面 -->
<template>
  <div class="special-case-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="工人姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入工人姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="特殊情况类型">
          <el-select v-model="searchForm.caseType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="一般情况" value="general" />
            <el-option label="工伤事故" value="work_injury" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="processed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
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
        <el-button type="success" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </template>
      <template #column-caseType="{ row }">
        <el-tag :type="row.caseType === 'work_injury' ? 'danger' : 'info'">
          {{ row.caseType === 'work_injury' ? '工伤事故' : '一般情况' }}
        </el-tag>
      </template>
      <template #column-status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>
      <template #column-processingRecords="{ row }">
        <el-button link type="primary" size="small" @click="viewRecords(row)">
          查看记录 ({{ row.processingRecords?.length || 0 }})
        </el-button>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="warning" size="small" @click="handleProcess(row)">处理</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="工人姓名" prop="workerName">
          <el-input v-model="formData.workerName" placeholder="请输入工人姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="特殊情况类型" prop="caseType">
          <el-select v-model="formData.caseType" placeholder="请选择特殊情况类型" style="width: 100%">
            <el-option label="一般情况" value="general" />
            <el-option label="工伤事故" value="work_injury" />
          </el-select>
        </el-form-item>
        <el-form-item label="情况标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入情况标题" />
        </el-form-item>
        <el-form-item label="情况描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入情况描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 处理记录弹窗 -->
    <el-dialog
      v-model="processDialogVisible"
      title="填写处理记录"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="processFormRef" :model="processForm" :rules="processFormRules" label-width="100px">
        <el-form-item label="处理情况" prop="content">
          <el-input v-model="processForm.content" type="textarea" :rows="4" placeholder="请填写处理情况" />
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-select v-model="processForm.result" placeholder="请选择处理结果" style="width: 100%">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="processed" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProcessSubmit" :loading="processLoading">提交</el-button>
      </template>
    </el-dialog>

    <!-- 处理记录查看弹窗 -->
    <el-dialog v-model="recordsDialogVisible" title="处理记录" width="700px">
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in currentRecords"
          :key="index"
          :timestamp="record.createTime"
          placement="top"
          :type="record.result === 'processed' ? 'success' : 'warning'"
        >
          <el-card>
            <div class="record-content">
              <div class="record-header">
                <span class="record-title">{{ record.content }}</span>
                <el-tag :type="getStatusType(record.result)" size="small">
                  {{ getStatusText(record.result) }}
                </el-tag>
              </div>
              <div class="record-info">
                <span>处理人：{{ record.handler }}</span>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <template #footer>
        <el-button @click="recordsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'

// 搜索表单
const searchForm = reactive({
  workerName: '',
  phone: '',
  caseType: '',
  status: ''
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 表格列配置
const columns = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'caseType', label: '特殊情况类型', minWidth: 120 },
  { prop: 'title', label: '情况标题', minWidth: 180 },
  { prop: 'description', label: '情况描述', minWidth: 200, showTooltip: true },
  { prop: 'status', label: '处理状态', minWidth: 100 },
  { prop: 'createTime', label: '创建时间', minWidth: 160, sortable: true },
  { prop: 'processingRecords', label: '处理记录', minWidth: 120 }
]

// 表格引用
const tableRef = ref()

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增特殊情况')
const submitLoading = ref(false)
const formRef = ref()
const formData = reactive({
  id: '',
  workerName: '',
  phone: '',
  caseType: '',
  title: '',
  description: ''
})

const formRules = {
  workerName: [{ required: true, message: '请输入工人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  caseType: [{ required: true, message: '请选择特殊情况类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入情况标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入情况描述', trigger: 'blur' }]
}

// 处理弹窗
const processDialogVisible = ref(false)
const processLoading = ref(false)
const processFormRef = ref()
const processForm = reactive({
  id: '',
  content: '',
  result: 'processing'
})

const processFormRules = {
  content: [{ required: true, message: '请填写处理情况', trigger: 'blur' }],
  result: [{ required: true, message: '请选择处理结果', trigger: 'change' }]
}

// 处理记录查看弹窗
const recordsDialogVisible = ref(false)
const currentRecords = ref<any[]>([])

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    processed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    processed: '已处理'
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
  searchForm.caseType = ''
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
        caseType: 'general',
        title: '工资发放异常',
        description: '工人反映上个月工资未按时发放',
        status: 'pending',
        createTime: '2024-01-15 10:00:00',
        processingRecords: []
      },
      {
        id: '2',
        workerName: '李四',
        phone: '13800138001',
        caseType: 'work_injury',
        title: '工作期间受伤',
        description: '工人在车间操作机器时手指受伤',
        status: 'processing',
        createTime: '2024-01-14 14:30:00',
        processingRecords: [
          {
            content: '已联系医院进行检查',
            result: 'processing',
            handler: '管理员',
            createTime: '2024-01-14 16:00:00'
          }
        ]
      },
      {
        id: '3',
        workerName: '王五',
        phone: '13800138002',
        caseType: 'general',
        title: '住宿问题反馈',
        description: '宿舍设施损坏需要维修',
        status: 'processed',
        createTime: '2024-01-10 09:00:00',
        processingRecords: [
          {
            content: '已安排维修人员进行检查',
            result: 'processing',
            handler: '管理员',
            createTime: '2024-01-10 11:00:00'
          },
          {
            content: '设施已修复完成',
            result: 'processed',
            handler: '管理员',
            createTime: '2024-01-12 15:00:00'
          }
        ]
      }
    ]
    total.value = 3
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
  console.log('选择变化:', selection)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增特殊情况'
  formData.id = ''
  formData.workerName = ''
  formData.phone = ''
  formData.caseType = ''
  formData.title = ''
  formData.description = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑特殊情况'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 详情
const handleDetail = (row: any) => {
  dialogTitle.value = '特殊情况详情'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条特殊情况记录吗？', '提示', {
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
        ElMessage.success(dialogTitle.value === '新增特殊情况' ? '新增成功' : '修改成功')
        dialogVisible.value = false
        submitLoading.value = false
        fetchData()
      }, 500)
    }
  })
}

// 处理
const handleProcess = (row: any) => {
  processForm.id = row.id
  processForm.content = ''
  processForm.result = 'processing'
  processDialogVisible.value = true
}

// 提交处理记录
const handleProcessSubmit = async () => {
  if (!processFormRef.value) return
  await processFormRef.value.validate((valid) => {
    if (valid) {
      processLoading.value = true
      setTimeout(() => {
        ElMessage.success('处理记录提交成功')
        processDialogVisible.value = false
        processLoading.value = false
        fetchData()
      }, 500)
    }
  })
}

// 查看处理记录
const viewRecords = (row: any) => {
  currentRecords.value = row.processingRecords || []
  recordsDialogVisible.value = true
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.special-case-page {
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

.record-content {
  padding: 10px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-title {
  font-weight: 500;
}

.record-info {
  color: #666;
  font-size: 14px;
}
</style>
