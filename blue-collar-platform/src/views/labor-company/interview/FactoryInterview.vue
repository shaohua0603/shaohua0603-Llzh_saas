<template>
  <div class="factory-interview-container">
    <!-- 筛选区域 -->
  <el-card class="filter-card" shadow="never">
    <el-form :model="filterForm" inline>
      <!-- 默认显示的查询条件 -->
      <div class="filter-toggle-container">
        <div class="filter-default">
          <el-form-item label="劳务公司">
            <el-input v-model="filterForm.laborCompany" placeholder="请输入劳务公司" clearable style="width: 150px" />
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
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable style="width: 150px">
              <el-option label="待面试" value="pending" />
              <el-option label="面试中" value="in_progress" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
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
          <el-form-item label="对接人">
            <el-input v-model="filterForm.contactPerson" placeholder="请输入对接人" clearable style="width: 150px" />
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="filterForm.manager" placeholder="请输入负责人" clearable style="width: 150px" />
          </el-form-item>
          <el-form-item label="统一社会信用代码">
            <el-input v-model="filterForm.socialCreditCode" placeholder="请输入信用代码" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="工厂对接人">
            <el-input v-model="filterForm.factoryContact" placeholder="请输入工厂对接人" clearable style="width: 150px" />
          </el-form-item>
        </div>
      </transition>
    </el-form>
  </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd" v-permission="['interview:factory:create']">
        <el-icon><Plus /></el-icon>
        新增面试
      </el-button>
      <el-button @click="handleImport" v-permission="['interview:factory:import']">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button @click="handleExport" v-permission="['interview:factory:export']">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>

    <!-- 面试列表 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共 {{ total }} 场面试</span>
      </div>
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
        <template #column-interviewResult="{ row }">
          <el-tag :type="getInterviewResultType(row.interviewResult)">
            {{ getInterviewResultText(row.interviewResult) }}
          </el-tag>
        </template>
        <template #column-offerStatus="{ row }">
          <el-tag :type="getOfferStatusType(row.offerStatus)">
            {{ getOfferStatusText(row.offerStatus) }}
          </el-tag>
        </template>
        <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" link size="small" @click.stop="handleDetail(row)" v-permission="['interview:factory:view']">
            查看
          </el-button>
          <el-button type="warning" link size="small" @click.stop="handleEdit(row)" v-permission="['interview:factory:update']">
            编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(row)" v-permission="['interview:factory:delete']">
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 导入对话框 -->
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
import { Plus, Upload, Download, Search, RefreshLeft, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'
import { getFactoryInterviewList, deleteFactoryInterview, batchDeleteFactoryInterviews, importFactoryInterviews, exportFactoryInterviews, downloadFactoryInterviewTemplate, type FactoryInterview, type FactoryInterviewQueryParams } from '@/api/interviewApi'

// 路由实例
const router = useRouter()

// 筛选表单
const filterForm = ref({
  laborCompany: '',
  socialCreditCode: '',
  interviewTime: [],
  manager: '',
  factoryContact: '',
  status: '',
  contactPerson: ''
})

// 筛选区域展开状态
const filterVisible = ref(false)

// 面试列表数据
const interviewList = ref<FactoryInterview[]>([])

const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 面试列表列配置
const interviewColumns: ColumnConfig[] = [
  { prop: 'id', label: '面试编号', width: 150, sortable: true },
  { prop: 'laborCompany', label: '劳务公司', width: 180, sortable: true },
  { prop: 'contactPerson', label: '劳务公司对接人', width: 150, sortable: true },
  { prop: 'contactPhone', label: '对接人手机号', width: 150, sortable: true },
  { prop: 'interviewTime', label: '面试时间', width: 180, sortable: true },
  { prop: 'interviewLocation', label: '面试地点', width: 200, sortable: true, showOverflowTooltip: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'createTime', label: '创建时间', width: 180, sortable: true },
  { prop: 'creator', label: '创建人', width: 120, sortable: true }
]

// 导入相关
const importVisible = ref(false)
const importAction = '/api/factory-interview/import'
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
  router.push('/labor-company/interview/factory-interview/add')
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadInterviewList()
}

// 重置
const handleReset = () => {
  filterForm.value = {
    laborCompany: '',
    socialCreditCode: '',
    interviewTime: [],
    manager: '',
    factoryContact: '',
    status: '',
    contactPerson: ''
  }
  currentPage.value = 1
  loadInterviewList()
}

// 加载面试列表
const loadInterviewList = async () => {
  loading.value = true
  try {
    // 模拟数据
    let mockData = [
      {
        id: 'FI001',
        laborCompany: '深圳市某某劳务派遣有限公司',
        contactPerson: '张三',
        contactPhone: '13800138000',
        interviewTime: '2024-02-27 10:00:00',
        interviewLocation: '东莞长安工业区面试点',
        status: 'pending',
        createTime: '2024-02-25 10:00:00',
        creator: '系统'
      },
      {
        id: 'FI002',
        laborCompany: '广州市某某劳务派遣有限公司',
        contactPerson: '李四',
        contactPhone: '13900139000',
        interviewTime: '2024-02-28 14:00:00',
        interviewLocation: '深圳宝安工业区面试点',
        status: 'in_progress',
        createTime: '2024-02-26 14:00:00',
        creator: '王五'
      },
      {
        id: 'FI003',
        laborCompany: '东莞市某某劳务派遣有限公司',
        contactPerson: '赵六',
        contactPhone: '13700137000',
        interviewTime: '2024-02-26 09:00:00',
        interviewLocation: '东莞虎门工业区面试点',
        status: 'completed',
        createTime: '2024-02-24 09:00:00',
        creator: '系统'
      },
      {
        id: 'FI004',
        laborCompany: '深圳市某某劳务派遣有限公司',
        contactPerson: '张三',
        contactPhone: '13800138000',
        interviewTime: '2024-03-01 10:00:00',
        interviewLocation: '深圳龙岗工业区面试点',
        status: 'cancelled',
        createTime: '2024-02-27 10:00:00',
        creator: '张三'
      }
    ]

    // 根据筛选条件过滤数据
    if (filterForm.value.laborCompany) {
      mockData = mockData.filter(item => 
        item.laborCompany.includes(filterForm.value.laborCompany)
      )
    }
    
    if (filterForm.value.status) {
      mockData = mockData.filter(item => 
        item.status === filterForm.value.status
      )
    }
    
    if (filterForm.value.contactPerson) {
      mockData = mockData.filter(item => 
        item.contactPerson.includes(filterForm.value.contactPerson)
      )
    }

    interviewList.value = mockData
    total.value = interviewList.value.length
  } catch (error) {
    ElMessage.error('获取面试列表失败')
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
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

// 查看
const handleDetail = (row: any) => {
  router.push(`/labor-company/interview/factory-interview/${row.id}`)
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/labor-company/interview/factory-interview/edit/${row.id}`)
}

// 删除
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

// 导入
const handleImport = () => {
  importVisible.value = true
}

// 下载模板
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

// 导出
const handleExport = async () => {
  try {
    const params: FactoryInterviewQueryParams = {
      laborCompany: filterForm.value.laborCompany,
      socialCreditCode: filterForm.value.socialCreditCode,
      manager: filterForm.value.manager,
      factoryContact: filterForm.value.factoryContact,
      status: filterForm.value.status,
      contactPerson: filterForm.value.contactPerson
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



// 获取面试结果类型
const getInterviewResultType = (result: string) => {
  const typeMap: Record<string, any> = {
    pass: 'success',
    reject: 'danger',
    pending: 'warning'
  }
  return typeMap[result] || 'info'
}

// 获取面试结果文本
const getInterviewResultText = (result: string) => {
  const textMap: Record<string, string> = {
    pass: '通过',
    reject: '不通过',
    pending: '待评估'
  }
  return textMap[result] || result
}

// 获取Offer状态类型
const getOfferStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    offered: 'success',
    rejected: 'danger',
    pending: 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取Offer状态文本
const getOfferStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    offered: '已录用',
    rejected: '已拒绝',
    pending: '待处理'
  }
  return textMap[status] || status
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待面试',
    in_progress: '面试中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || status
}

// 生命周期
onMounted(() => {
  loadInterviewList()
})
</script>

<style scoped>
.factory-interview-container {
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
  color: #606266;
  line-height: 1.5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .factory-interview-container {
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
