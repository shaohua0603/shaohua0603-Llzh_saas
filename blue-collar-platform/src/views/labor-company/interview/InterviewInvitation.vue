<template>
  <div class="interview-invitation-container">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="filterForm" inline>
        <!-- 默认显示的查询条件 -->
        <div class="filter-toggle-container">
          <div class="filter-default">
            <el-form-item label="工厂名称">
              <el-input v-model="filterForm.factoryName" placeholder="请输入工厂名称" clearable style="width: 150px" />
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
          </div>
          <el-button type="text" class="filter-toggle" @click="filterVisible = !filterVisible">
            {{ filterVisible ? '收起' : '展开' }}
            <el-icon>
              <component :is="filterVisible ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
          </el-button>
        </div>
        <!-- 展开显示的查询条件 -->
        <transition name="el-fade-in-linear">
          <div v-if="filterVisible" class="filter-expanded">
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
            <el-form-item label="对接人">
              <el-input v-model="filterForm.contactPerson" placeholder="请输入对接人" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="负责人">
              <el-input v-model="filterForm.manager" placeholder="请输入负责人" clearable style="width: 150px" />
            </el-form-item>
          </div>
        </transition>
      </el-form>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd" v-permission="['interview:invitation:create']">
        <el-icon><Plus /></el-icon>
        新增邀约
      </el-button>
      <el-button @click="handleImport" v-permission="['interview:invitation:import']">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button @click="handleExport" v-permission="['interview:invitation:export']">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>

    <!-- 邀约列表 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共发出 {{ total }} 份邀约，涉及 {{ invitationList.reduce((sum, item) => sum + (item.candidateCount || 0), 0) }} 人次面试</span>
      </div>
      <CommonTable
        :data="invitationList"
        :columns="invitationColumns"
        table-id="interview-invitation-list"
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
        <template #actions="{ row }">
          <el-button type="primary" link size="small" @click.stop="handleDetail(row)" v-permission="['interview:invitation:view']">
            查看
          </el-button>
          <el-button type="warning" link size="small" @click.stop="handleEdit(row)" v-permission="['interview:invitation:update']">
            编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(row)" v-permission="['interview:invitation:delete']">
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="importVisible" title="导入面试邀约" width="500px" :close-on-click-modal="false">
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
import { getInterviewInvitationList, deleteInterviewInvitation, batchDeleteInterviewInvitations, importInterviewInvitations, exportInterviewInvitations, downloadInterviewInvitationTemplate, type InterviewInvitation, type InterviewInvitationQueryParams } from '@/api/interviewApi'

// 路由实例
const router = useRouter()

// 筛选表单
const filterForm = ref({
  factoryName: '',
  interviewTime: [],
  contactPerson: '',
  manager: ''
})

// 筛选条件展开状态
const filterVisible = ref(false)

// 邀约列表数据
const invitationList = ref<InterviewInvitation[]>([])

const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 邀约列表列配置
const invitationColumns: ColumnConfig[] = [
  { prop: 'id', label: '邀约编号', width: 150, sortable: true },
  { prop: 'factoryName', label: '工厂名称', width: 180, sortable: true },
  { prop: 'contactPerson', label: '对接人', width: 120, sortable: true },
  { prop: 'contactPhone', label: '对接人手机号', width: 150, sortable: true },
  { prop: 'interviewTime', label: '面试时间', width: 180, sortable: true },
  { prop: 'interviewLocation', label: '面试地点', width: 200, sortable: true, showOverflowTooltip: true },
  { prop: 'candidateCount', label: '面试人数', width: 100, sortable: true },
  { prop: 'manager', label: '负责人', width: 120, sortable: true },
  { prop: 'createTime', label: '创建时间', width: 180, sortable: true },
  { prop: 'creator', label: '创建人', width: 120, sortable: true }
]

// 导入相关
const importVisible = ref(false)
const importAction = '/api/interview-invitation/import'
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
  router.push('/tenant/interview/invitation/add')
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadInvitationList()
}

// 重置
const handleReset = () => {
  filterForm.value = {
    factoryName: '',
    interviewTime: [],
    contactPerson: '',
    manager: ''
  }
  currentPage.value = 1
  loadInvitationList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadInvitationList()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  loadInvitationList()
}

// 排序变化
const handleSortChange = (sort: any) => {
  console.log('排序变化:', sort)
  loadInvitationList()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  console.log('全局搜索:', keyword)
  loadInvitationList()
}

// 行点击
const handleRowClick = (row: any) => {
  handleDetail(row)
}

// 查看
const handleDetail = (row: any) => {
  router.push(`/tenant/interview/invitation/${row.id}`)
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/tenant/interview/invitation/edit/${row.id}`)
}

// 删除
const handleDelete = async (row: InterviewInvitation) => {
  ElMessageBox.confirm(`确定要删除该面试邀约吗？删除后不可恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteInterviewInvitation(row.id)
      ElMessage.success('删除成功')
      loadInvitationList()
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
    const response = await downloadInterviewInvitationTemplate()
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '面试邀约导入模板.xlsx'
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
    await importInterviewInvitations(importForm.value.file)
    importing.value = false
    importVisible.value = false
    ElMessage.success('导入成功')
    loadInvitationList()
  } catch (error) {
    importing.value = false
    ElMessage.error('导入失败')
    console.error('API调用错误:', error)
  }
}

// 导出
const handleExport = async () => {
  try {
    const params: InterviewInvitationQueryParams = {
      factoryName: filterForm.value.factoryName,
      contactPerson: filterForm.value.contactPerson,
      manager: filterForm.value.manager
    }
    
    if (filterForm.value.interviewTime && filterForm.value.interviewTime.length === 2) {
      params.interviewTime = filterForm.value.interviewTime
    }
    
    const response = await exportInterviewInvitations(params)
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `面试邀约信息_${new Date().toISOString().split('T')[0]}.xlsx`
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

// 加载邀约列表
const loadInvitationList = async () => {
  loading.value = true
  try {
    const params: InterviewInvitationQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      factoryName: filterForm.value.factoryName,
      contactPerson: filterForm.value.contactPerson,
      manager: filterForm.value.manager
    }
    
    if (filterForm.value.interviewTime && filterForm.value.interviewTime.length === 2) {
      params.interviewTime = filterForm.value.interviewTime
    }
    
    const response = await getInterviewInvitationList(params)
    invitationList.value = response.data?.list || []
    total.value = response.data?.total || 0
  } catch (error) {
    ElMessage.error('获取邀约列表失败')
    console.error('API调用错误:', error)
    // 确保即使API调用失败，invitationList也会被设置为空数组
    invitationList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadInvitationList()
})
</script>

<style scoped>
.interview-invitation-container {
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

/* 筛选条件样式 */
.filter-toggle-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 20px;
}

.filter-toggle {
  margin-left: auto;
}

.filter-default {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-expanded {
  padding: 16px 20px;
  background-color: #f9f9f9;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .filter-default {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-expanded {
    margin-top: 12px;
    padding-top: 12px;
  }
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .interview-invitation-container {
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
