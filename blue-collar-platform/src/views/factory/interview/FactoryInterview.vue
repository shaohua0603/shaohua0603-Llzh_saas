<template>
  <div class="factory-interview-container">
    <el-card class="filter-card" shadow="never">
      <el-form :model="filterForm" inline>
        <el-form-item label="劳务公司">
          <el-input v-model="filterForm.laborCompany" placeholder="请输入劳务公司" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="统一社会信用代码">
          <el-input v-model="filterForm.socialCreditCode" placeholder="请输入信用代码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="面试时间">
          <el-date-picker
            v-model="filterForm.interviewTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="filterForm.manager" placeholder="请输入负责人" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="工厂对接人">
          <el-input v-model="filterForm.factoryContact" placeholder="请输入对接人" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待面试" value="PENDING" />
            <el-option label="面试中" value="IN_PROGRESS" />
            <el-option label="已完成" value="COMPLETED" />
            <el-option label="已取消" value="CANCELLED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据统计区域 -->
    <div class="stats-section">
      <p>• 共面试 {{ total }} 人次，其中待面试 {{ interviewList.filter(item => item.status === 'PENDING').length }} 人，面试中 {{ interviewList.filter(item => item.status === 'IN_PROGRESS').length }} 人，已完成 {{ interviewList.filter(item => item.status === 'COMPLETED').length }} 人</p>
    </div>

    <el-card class="table-card" shadow="never">
      <CommonTable
        :data="interviewList"
        :columns="interviewColumns"
        table-id="factory-interview-list"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :loading="loading"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @sort-change="handleSortChange"
        @global-search="handleGlobalSearch"
        @row-click="handleRowClick"
      >
        <template #toolbar-right>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增面试
          </el-button>
          <el-button @click="handleImport">
            <el-icon><Upload /></el-icon>
            导入
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </template>
        <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" link size="small" @click.stop="handleDetail(row)">
            查看
          </el-button>
          <el-button type="warning" link size="small" @click.stop="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(row)">
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <el-dialog v-model="importVisible" title="导入工厂面试" width="500px" :close-on-click-modal="false">
      <el-form :model="importForm" label-width="100px">
        <el-form-item label="下载模板">
          <el-button type="primary" link @click="handleDownloadTemplate">
            <el-icon><Download /></el-icon>
            点击下载导入模板
          </el-button>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            :action="importAction"
            :headers="uploadHeaders"
            :on-success="handleImportSuccess"
            :on-error="handleImportError"
            :before-upload="handleBeforeImport"
            accept=".xlsx,.xls"
            :limit="1"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              选择文件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">支持上传Excel文件，大小不超过10MB</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmImport" :loading="importing">
          确定导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, Search, RefreshLeft } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'
import { getFactoryInterviewList, deleteFactoryInterview, batchDeleteFactoryInterviews, importFactoryInterviews, exportFactoryInterviews, downloadFactoryInterviewTemplate, type FactoryInterview, type FactoryInterviewQueryParams } from '@/api/interviewApi'

const router = useRouter()

const filterForm = ref({
  laborCompany: '',
  socialCreditCode: '',
  interviewTime: [],
  manager: '',
  factoryContact: '',
  status: ''
})

const interviewList = ref<FactoryInterview[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const interviewColumns: ColumnConfig[] = [
  { prop: 'id', label: '邀约编号', width: 120, sortable: true },
  { prop: 'laborCompanyName', label: '劳务公司', width: 200, sortable: true },
  { prop: 'socialCreditCode', label: '统一社会信用代码', width: 200, sortable: true },
  { prop: 'manager', label: '负责人', width: 120, sortable: true },
  { prop: 'managerPhone', label: '负责人手机号', width: 130, sortable: true },
  { prop: 'interviewTime', label: '面试时间', width: 180, sortable: true },
  { prop: 'interviewLocation', label: '面试地点', width: 200, sortable: true },
  { prop: 'factoryContactName', label: '工厂对接人', width: 120, sortable: true },
  { prop: 'factoryContactPhone', label: '对接人手机号', width: 130, sortable: true },
  { prop: 'personCount', label: '面试人数', width: 100, sortable: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'createdAt', label: '创建时间', width: 180, sortable: true }
]

const importVisible = ref(false)
const importAction = '/api/v1/interview/factory-interviews/import'
const uploadHeaders = ref({})
const importing = ref(false)
const importForm = ref({
  file: null
})

const handleSearch = () => {
  currentPage.value = 1
  loadInterviewList()
}

const handleReset = () => {
  filterForm.value = {
    laborCompany: '',
    socialCreditCode: '',
    interviewTime: [],
    manager: '',
    factoryContact: '',
    status: ''
  }
  currentPage.value = 1
  loadInterviewList()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadInterviewList()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  loadInterviewList()
}

const handleSortChange = (sort: any) => {
  console.log('排序变化:', sort)
  loadInterviewList()
}

const handleGlobalSearch = (keyword: string) => {
  console.log('全局搜索:', keyword)
  loadInterviewList()
}

const handleRowClick = (row: any) => {
  handleDetail(row)
}

const handleDetail = (row: any) => {
  router.push(`/factory/factory-interview/detail/${row.id}`)
}

const handleEdit = (row: any) => {
  router.push(`/factory/factory-interview/edit/${row.id}`)
}

const handleDelete = async (row: FactoryInterview) => {
  ElMessageBox.confirm(`确定要删除该工厂面试吗？删除后不可恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteFactoryInterview(row.id)
      ElMessage.success('删除成功')
      loadInterviewList()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('API调用错误:', error)
    }
  }).catch(() => {})
}

const handleAdd = () => {
  router.push('/factory/factory-interview/add')
}

const handleImport = () => {
  importVisible.value = true
}

const handleDownloadTemplate = async () => {
  try {
    const response = await downloadFactoryInterviewTemplate()
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '工厂面试导入模板.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('模板下载完成')
  } catch (error) {
    ElMessage.error('模板下载失败')
    console.error('API调用错误:', error)
  }
}

const handleBeforeImport = (file: any) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.type === 'application/vnd.ms-excel'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isExcel) {
    ElMessage.error('只能上传Excel文件！')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB！')
    return false
  }
  return true
}

const handleImportSuccess = (response: any) => {
  ElMessage.success('文件上传成功')
  importForm.value.file = response.data
}

const handleImportError = (error: any) => {
  ElMessage.error('文件上传失败')
}

const handleConfirmImport = async () => {
  if (!importForm.value.file) {
    ElMessage.warning('请先上传文件')
    return
  }
  importing.value = true
  try {
    await importFactoryInterviews(importForm.value.file)
    importing.value = false
    importVisible.value = false
    ElMessage.success('导入成功')
    loadInterviewList()
  } catch (error) {
    importing.value = false
    ElMessage.error('导入失败')
    console.error('API调用错误:', error)
  }
}

const handleExport = async () => {
  try {
    const params: FactoryInterviewQueryParams = {
      laborCompany: filterForm.value.laborCompany,
      socialCreditCode: filterForm.value.socialCreditCode,
      manager: filterForm.value.manager,
      factoryContact: filterForm.value.factoryContact,
      status: filterForm.value.status
    }
    
    if (filterForm.value.interviewTime && filterForm.value.interviewTime.length === 2) {
      params.interviewTime = filterForm.value.interviewTime
    }
    
    const response = await exportFactoryInterviews(params)
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `工厂面试信息_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
    console.error('API调用错误:', error)
  }
}

const loadInterviewList = async () => {
  loading.value = true
  try {
    const params: FactoryInterviewQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      laborCompany: filterForm.value.laborCompany,
      socialCreditCode: filterForm.value.socialCreditCode,
      manager: filterForm.value.manager,
      factoryContact: filterForm.value.factoryContact,
      status: filterForm.value.status
    }
    
    if (filterForm.value.interviewTime && filterForm.value.interviewTime.length === 2) {
      params.interviewTime = filterForm.value.interviewTime
    }
    
    const response = await getFactoryInterviewList(params)
    interviewList.value = response.data.data.list
    total.value = response.data.data.total
  } catch (error) {
    ElMessage.error('获取面试列表失败')
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    PENDING: 'info',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    PENDING: '待面试',
    IN_PROGRESS: '面试中',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  }
  return textMap[status] || status
}

onMounted(() => {
  loadInterviewList()
})
</script>

<style scoped>
.factory-interview-container {
  width: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.filter-card,
.table-card {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-section {
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.stats-section p {
  margin: 0;
  font-size: 14px;
  color: #f56c6c;
  line-height: 1.5;
}

.stats-section p::before {
  content: "• ";
  color: #409eff;
  font-weight: bold;
}

@media screen and (max-width: 768px) {
  .factory-interview-container {
    padding: 12px;
  }

  :deep(.el-form--inline .el-form-item) {
    display: block;
    margin-right: 0;
    margin-bottom: 12px;
  }

  :deep(.el-form-item__content) {
    width: 100%;
  }

  :deep(.el-select),
  :deep(.el-input),
  :deep(.el-date-picker) {
    width: 100% !important;
  }
}
</style>
