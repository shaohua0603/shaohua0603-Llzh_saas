<template>
  <div class="resignation-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="请输入姓名、手机号、离职编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="离职日期">
          <el-date-picker
            v-model="searchForm.resignationDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.approvalStatus" placeholder="请选择审核状态" clearable style="width: 140px">
            <el-option label="未审核" value="PENDING" />
            <el-option label="审核中" value="IN_PROGRESS" />
            <el-option label="审核通过" value="APPROVED" />
            <el-option label="已驳回" value="REJECTED" />
          </el-select>
        </el-form-item>
        <el-form-item label="离职状态">
          <el-select v-model="searchForm.resignationStatus" placeholder="请选择离职状态" clearable style="width: 140px">
            <el-option label="未开始" value="NOT_STARTED" />
            <el-option label="离职中" value="IN_PROGRESS" />
            <el-option label="已离职" value="COMPLETED" />
          </el-select>
        </el-form-item>
        <el-form-item label="离职原因">
          <el-select v-model="searchForm.resignationReason" placeholder="请选择离职原因" clearable style="width: 140px">
            <el-option v-for="item in resignationReasonOptions" :key="item.value" :label="item.label" :value="item.value" />
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
    </el-card>

    <!-- 工具栏 -->
    <div class="toolbar-section">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增离职
      </el-button>
      <el-button type="success" @click="handleBatchSubmitApproval" :disabled="!hasSelection">
        <el-icon><DocumentChecked /></el-icon>
        批量提交审核
      </el-button>
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button @click="handlePrint">
        <el-icon><Printer /></el-icon>
        打印
      </el-button>
    </div>

    <!-- 表格区域 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      table-id="resignation-list"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">详情</el-button>
        <el-button type="primary" link @click="handleEdit(row)" v-if="row.approvalStatus === 'PENDING' || row.approvalStatus === 'REJECTED'">编辑</el-button>
        <el-button type="primary" link @click="handleApproval(row)" v-if="row.approvalStatus === 'IN_PROGRESS'">审核</el-button>
        <el-button type="danger" link @click="handleDelete(row)" v-if="row.approvalStatus === 'PENDING'">删除</el-button>
      </template>
    </CommonTable>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="approvalDialogVisible"
      title="离职审核"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="审核结果" required>
          <el-radio-group v-model="approvalForm.result">
            <el-radio label="approved">
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
              通过
            </el-radio>
            <el-radio label="rejected">
              <el-icon color="#f56c6c"><CircleClose /></el-icon>
              驳回
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            v-model="approvalForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitApproval">提交</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入离职记录" width="500px">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持.xlsx/.xls格式，<el-button type="primary" link @click="handleDownloadTemplate">下载模板</el-button>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmImport" :loading="importing">确定导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, Printer, CircleCheck, CircleClose, DocumentChecked, Search, Refresh, UploadFilled } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'
import { RESIGNATION_REASON_OPTIONS, type Resignation, type ApprovalStatus, type ResignationStatus, type ResignationReason } from '@/types/resignationTypes'
import { getResignationList, deleteResignation, submitApproval as submitApprovalApi, approveResignation, importResignation, exportResignation } from '@/api/resignationApi'

const router = useRouter()

const resignationReasonOptions = RESIGNATION_REASON_OPTIONS

const searchForm = reactive({
  keyword: '',
  resignationDate: [] as string[],
  approvalStatus: '' as ApprovalStatus | '',
  resignationStatus: '' as ResignationStatus | '',
  resignationReason: '' as ResignationReason | ''
})

const tableData = ref<Resignation[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<Resignation[]>([])

const hasSelection = computed(() => selectedRows.value.length > 0)

const columns: ColumnConfig[] = [
  { type: 'selection', width: 50 },
  { prop: 'resignationNo', label: '离职编号', minWidth: 140, sortable: true },
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'gender', label: '性别', minWidth: 60 },
  { prop: 'phone', label: '手机号', minWidth: 120 },
  { prop: 'laborCompanyName', label: '劳务公司', minWidth: 150 },
  { prop: 'factoryName', label: '工厂', minWidth: 150 },
  { prop: 'position', label: '岗位', minWidth: 100 },
  { prop: 'entryDate', label: '入职日期', minWidth: 120, sortable: true },
  { prop: 'resignationDate', label: '离职日期', minWidth: 120, sortable: true },
  {
    prop: 'resignationReason',
    label: '离职原因',
    minWidth: 100,
    formatter: (value: ResignationReason) => {
      const reason = RESIGNATION_REASON_OPTIONS.find(r => r.value === value)
      return reason?.label || value
    }
  },
  {
    prop: 'approvalStatus',
    label: '审核状态',
    minWidth: 100,
    formatter: (value: ApprovalStatus) => {
      const statusMap: Record<ApprovalStatus, { text: string; type: string }> = {
        PENDING: { text: '未审核', type: 'info' },
        IN_PROGRESS: { text: '审核中', type: 'warning' },
        APPROVED: { text: '审核通过', type: 'success' },
        REJECTED: { text: '已驳回', type: 'danger' }
      }
      const status = statusMap[value]
      if (status) {
        return `<el-tag type="${status.type}">${status.text}</el-tag>`
      }
      return value
    },
    showTooltip: true
  },
  {
    prop: 'resignationStatus',
    label: '离职状态',
    minWidth: 100,
    formatter: (value: ResignationStatus) => {
      const statusMap: Record<ResignationStatus, { text: string; type: string }> = {
        NOT_STARTED: { text: '未开始', type: 'info' },
        IN_PROGRESS: { text: '离职中', type: 'warning' },
        COMPLETED: { text: '已离职', type: 'success' }
      }
      const status = statusMap[value]
      if (status) {
        return `<el-tag type="${status.type}">${status.text}</el-tag>`
      }
      return value
    },
    showTooltip: true
  },
  { prop: 'applicationTime', label: '申请时间', minWidth: 160, sortable: true }
]

const approvalDialogVisible = ref(false)
const approvalForm = reactive({
  result: 'approved' as 'approved' | 'rejected',
  comment: ''
})
const currentApprovalRow = ref<Resignation | null>(null)

const importDialogVisible = ref(false)
const uploadRef = ref()
const importing = ref(false)
const importFile = ref<File | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.keyword || undefined,
      startResignationDate: searchForm.resignationDate?.[0],
      endResignationDate: searchForm.resignationDate?.[1],
      approvalStatus: searchForm.approvalStatus || undefined,
      resignationStatus: searchForm.resignationStatus || undefined,
      resignationReason: searchForm.resignationReason || undefined
    }
    const res = await getResignationList(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.resignationDate = []
  searchForm.approvalStatus = ''
  searchForm.resignationStatus = ''
  searchForm.resignationReason = ''
  handleSearch()
}

const handleAdd = () => {
  router.push({ name: 'AdminResignationAdd' })
}

const handleEdit = (row: Resignation) => {
  router.push({ name: 'AdminResignationEdit', params: { id: row.id } })
}

const handleView = (row: Resignation) => {
  router.push({ name: 'AdminResignationDetail', params: { id: row.id } })
}

const handleDelete = (row: Resignation) => {
  ElMessageBox.confirm('确定要删除该离职记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteResignation(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleApproval = (row: Resignation) => {
  currentApprovalRow.value = row
  approvalForm.result = 'approved'
  approvalForm.comment = ''
  approvalDialogVisible.value = true
}

const handleSubmitApproval = async () => {
  if (!currentApprovalRow.value) return
  
  if (approvalForm.result === 'rejected' && !approvalForm.comment) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  try {
    await approveResignation(currentApprovalRow.value.id, {
      result: approvalForm.result,
      comment: approvalForm.comment
    })
    ElMessage.success(approvalForm.result === 'approved' ? '审核通过' : '已驳回')
    approvalDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleImport = () => {
  importFile.value = null
  importDialogVisible.value = true
}

const handleFileChange = (file: any) => {
  importFile.value = file.raw
}

const handleDownloadTemplate = () => {
  ElMessage.info('模板下载功能开发中')
}

const handleConfirmImport = async () => {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }
  importing.value = true
  try {
    await importResignation(importFile.value)
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}

const handleExport = async () => {
  try {
    await exportResignation({
      keyword: searchForm.keyword || undefined,
      approvalStatus: searchForm.approvalStatus || undefined,
      resignationStatus: searchForm.resignationStatus || undefined,
      resignationReason: searchForm.resignationReason || undefined
    })
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const handlePrint = () => {
  ElMessage.info('打印功能开发中')
}

const handleBatchSubmitApproval = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要提交审核的记录')
    return
  }

  const pendingRows = selectedRows.value.filter(row => row.approvalStatus === 'PENDING')
  if (pendingRows.length === 0) {
    ElMessage.warning('选中的记录都已提交审核')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要提交选中的 ${pendingRows.length} 条记录进行审核吗？`,
      '提交审核确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    for (const row of pendingRows) {
      await submitApprovalApi(row.id)
    }

    ElMessage.success('提交审核成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('提交审核失败')
    }
  }
}

const handleSortChange = (sort: { prop: string; order: string }) => {
  console.log('排序变化:', sort)
}

const handleSelectionChange = (selection: Resignation[]) => {
  selectedRows.value = selection
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.resignation-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 16px;
}

.toolbar-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
