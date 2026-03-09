<template>
  <div class="initial-interview-container">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <!-- 初始模式显示的查询条件和按钮 -->
      <div class="filter-default">
        <div class="filter-toggle-container">
          <el-form :model="filterForm" inline>
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
          <el-button type="text" class="filter-toggle" @click="filterVisible = !filterVisible">
            {{ filterVisible ? '收起' : '展开' }}
            <el-icon>
              <component :is="filterVisible ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
          </el-button>
        </div>
      </div>
      <!-- 展开后显示的全部查询条件 -->
      <el-collapse-transition>
        <div v-show="filterVisible" class="filter-expanded">
          <el-form :model="filterForm" inline>
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
            <el-form-item label="面试地点">
              <el-input v-model="filterForm.interviewLocation" placeholder="请输入面试地点" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="面试人">
              <el-input v-model="filterForm.interviewer" placeholder="请输入面试人" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="负责人">
              <el-input v-model="filterForm.manager" placeholder="请输入负责人" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="推荐等级">
              <el-select v-model="filterForm.recommendationLevel" placeholder="请选择推荐等级" clearable style="width: 150px">
                <el-option label="优先推荐" value="PRIORITY" />
                <el-option label="一般" value="NORMAL" />
                <el-option label="不建议" value="NOT_RECOMMENDED" />
              </el-select>
            </el-form-item>
            <el-form-item label="形象级别">
              <el-select v-model="filterForm.imageLevel" placeholder="请选择形象级别" clearable style="width: 150px">
                <el-option label="优秀" value="EXCELLENT" />
                <el-option label="一般" value="NORMAL" />
                <el-option label="其他" value="OTHER" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd" v-permission="['interview:initial:create']">
        <el-icon><Plus /></el-icon>
        新增面试
      </el-button>
      <el-button @click="handleImport" v-permission="['interview:initial:import']">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button @click="handleExport" v-permission="['interview:initial:export']">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>

    <!-- 面试列表 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共面试 {{ total }} 人次，其中待面试 {{ interviewList.filter(item => item.status === 'PENDING').length }} 人，面试中 {{ interviewList.filter(item => item.status === 'IN_PROGRESS').length }} 人，已完成 {{ interviewList.filter(item => item.status === 'COMPLETED').length }} 人</span>
      </div>
      <CommonTable
        :data="interviewList"
        :columns="interviewColumns"
        table-id="initial-interview-list"
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
        <template #column-recommendationLevel="{ row }">
          <el-tag :type="getRecommendationLevelType(row.recommendationLevel)">
            {{ getRecommendationLevelText(row.recommendationLevel) }}
          </el-tag>
        </template>
        <template #column-imageLevel="{ row }">
          <el-tag :type="getImageLevelType(row.imageLevel)">
            {{ getImageLevelText(row.imageLevel) }}
          </el-tag>
        </template>
        <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" link size="small" @click.stop="handleDetail(row)" v-permission="['interview:initial:view']">
            查看
          </el-button>
          <el-button type="warning" link size="small" @click.stop="handleEdit(row)" v-permission="['interview:initial:update']">
            编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(row)" v-permission="['interview:initial:delete']">
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="importVisible" title="导入面试信息" width="500px" :close-on-click-modal="false">
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
import { Plus, Upload, Download, Search, RefreshLeft, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'
import { getInitialInterviewList, deleteInitialInterview, batchDeleteInitialInterviews, importInitialInterviews, exportInitialInterviews, downloadInitialInterviewTemplate, type InitialInterview, type InitialInterviewQueryParams } from '@/api/interviewApi'

// 路由实例
const router = useRouter()

// 筛选表单
const filterForm = ref({
  interviewTime: [],
  interviewLocation: '',
  interviewer: '',
  manager: '',
  recommendationLevel: '',
  imageLevel: '',
  status: ''
})

// 筛选区域展开状态
const filterVisible = ref(false)

// 面试列表数据
const interviewList = ref<InitialInterview[]>([])

const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 面试列表列配置
const interviewColumns: ColumnConfig[] = [
  { prop: 'id', label: '面试编号', width: 120, sortable: true },
  { prop: 'interviewTime', label: '面试时间', width: 180, sortable: true },
  { prop: 'interviewLocation', label: '面试地点', width: 150, sortable: true },
  { prop: 'interviewer', label: '面试人', width: 100, sortable: true },
  { prop: 'managerName', label: '负责人', width: 100, sortable: true },
  { prop: 'managerPhone', label: '负责人电话', width: 150, sortable: true },
  { prop: 'recommendationLevel', label: '推荐等级', width: 120, sortable: true },
  { prop: 'imageLevel', label: '形象级别', width: 120, sortable: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'createTime', label: '创建时间', width: 180, sortable: true }
]

// 导入相关
const importVisible = ref(false)
const importAction = '/api/initial-interview/import'
const uploadHeaders = ref({})
const importing = ref(false)
const importForm = ref({
  file: null
})

// 返回
const handleBack = () => {
  router.back()
}

// 新增
const handleAdd = () => {
  router.push('/tenant/interview/initial-interview/add')
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadInterviewList()
}

// 重置
const handleReset = () => {
  filterForm.value = {
    interviewTime: [],
    interviewLocation: '',
    interviewer: '',
    manager: '',
    recommendationLevel: '',
    imageLevel: '',
    status: ''
  }
  currentPage.value = 1
  loadInterviewList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadInterviewList()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  loadInterviewList()
}

// 排序变化
const handleSortChange = (sort: any) => {
  console.log('排序变化:', sort)
  loadInterviewList()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  console.log('全局搜索:', keyword)
  loadInterviewList()
}

// 行点击
const handleRowClick = (row: any) => {
  handleDetail(row)
}

// 查看详情
const handleDetail = (row: any) => {
  router.push(`/tenant/interview/initial-interview/${row.id}`)
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/tenant/interview/initial-interview/edit/${row.id}`)
}

// 删除
const handleDelete = async (row: InitialInterview) => {
  ElMessageBox.confirm(`确定要删除该面试信息吗？删除后不可恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteInitialInterview(row.id)
      ElMessage.success('删除成功')
      loadInterviewList()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('API调用错误:', error)
    }
  }).catch(() => {})
}

// 导入
const handleImport = () => {
  importVisible.value = true
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadInitialInterviewTemplate()
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '初步面试导入模板.xlsx'
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

// 上传前验证
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

// 导入成功
const handleImportSuccess = (response: any) => {
  ElMessage.success('文件上传成功')
  importForm.value.file = response.data
}

// 导入失败
const handleImportError = (error: any) => {
  ElMessage.error('文件上传失败')
}

// 确认导入
const handleConfirmImport = async () => {
  if (!importForm.value.file) {
    ElMessage.warning('请先上传文件')
    return
  }
  importing.value = true
  try {
    await importInitialInterviews(importForm.value.file)
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

// 导出
const handleExport = async () => {
  try {
    const params: InitialInterviewQueryParams = {
      interviewLocation: filterForm.value.interviewLocation,
      interviewer: filterForm.value.interviewer,
      manager: filterForm.value.manager,
      recommendationLevel: filterForm.value.recommendationLevel
    }
    
    if (filterForm.value.interviewTime && filterForm.value.interviewTime.length === 2) {
      params.interviewTime = filterForm.value.interviewTime
    }
    
    const response = await exportInitialInterviews(params)
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `初步面试信息_${new Date().toISOString().split('T')[0]}.xlsx`
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

// 加载面试列表
const loadInterviewList = async () => {
  loading.value = true
  try {
    const params: InitialInterviewQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      interviewLocation: filterForm.value.interviewLocation,
      interviewer: filterForm.value.interviewer,
      manager: filterForm.value.manager,
      recommendationLevel: filterForm.value.recommendationLevel,
      imageLevel: filterForm.value.imageLevel,
      status: filterForm.value.status
    }
    
    if (filterForm.value.interviewTime && filterForm.value.interviewTime.length === 2) {
      params.interviewTime = filterForm.value.interviewTime
    }
    

    
    const response = await getInitialInterviewList(params)
    interviewList.value = response.data?.list || []
    total.value = response.data?.total || 0
  } catch (error) {
    ElMessage.error('获取面试列表失败')
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
}

// 获取推荐等级类型
const getRecommendationLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    PRIORITY: 'success',
    NORMAL: 'info',
    NOT_RECOMMENDED: 'danger'
  }
  return typeMap[level] || 'info'
}

// 获取推荐等级文本
const getRecommendationLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    PRIORITY: '优先推荐',
    NORMAL: '一般',
    NOT_RECOMMENDED: '不建议'
  }
  return textMap[level] || level
}

// 获取形象级别类型
const getImageLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    EXCELLENT: 'success',
    NORMAL: 'info',
    OTHER: 'warning'
  }
  return typeMap[level] || 'info'
}

// 获取形象级别文本
const getImageLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    EXCELLENT: '优秀',
    NORMAL: '一般',
    OTHER: '其他'
  }
  return textMap[level] || level
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    PENDING: 'info',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    PENDING: '待面试',
    IN_PROGRESS: '面试中',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  }
  return textMap[status] || status
}

// 生命周期
onMounted(() => {
  loadInterviewList()
})
</script>

<style scoped>
.initial-interview-container {
  width: 100%;
  padding: 10px 16px;
  background-color: #f5f7fa;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-toggle-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 16px;
}

.filter-toggle {
  margin-left: auto;
}

.filter-default {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-expanded {
  padding: 12px 16px;
  background-color: #f9f9f9;
}

.filter-card,
.table-card {
  margin-bottom: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-stats {
  margin-bottom: 12px;
  padding: 10px 14px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #f56c6c;
  line-height: 1.5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .initial-interview-container {
    padding: 12px;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
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
