<template>
  <div class="resume-container">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-header">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="姓名">
            <el-input v-model="filterForm.name" placeholder="请输入姓名" clearable style="width: 150px" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="filterForm.phone" placeholder="请输入手机号" clearable style="width: 150px" />
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
      <!-- 展开后显示的全部查询条件 -->
      <el-collapse-transition>
        <div v-show="filterVisible" class="filter-expanded">
          <el-form :model="filterForm" inline>
            <el-form-item label="应聘岗位">
              <el-select v-model="filterForm.position" placeholder="请选择岗位" clearable style="width: 150px">
                <el-option label="普工" value="普工" />
                <el-option label="技工" value="技工" />
                <el-option label="操作工" value="操作工" />
                <el-option label="质检员" value="质检员" />
              </el-select>
            </el-form-item>
            <el-form-item label="学历">
              <el-select v-model="filterForm.education" placeholder="请选择学历" clearable style="width: 150px">
                <el-option label="初中" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="中专" value="中专" />
                <el-option label="大专" value="大专" />
                <el-option label="本科" value="本科" />
              </el-select>
            </el-form-item>
            <el-form-item label="工作经验">
              <el-select v-model="filterForm.experience" placeholder="请选择经验" clearable style="width: 150px">
                <el-option label="不限" value="不限" />
                <el-option label="1年以下" value="1年以下" />
                <el-option label="1-3年" value="1-3年" />
                <el-option label="3-5年" value="3-5年" />
                <el-option label="5年以上" value="5年以上" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="filterForm.status" placeholder="请选择状态" clearable style="width: 150px">
                <el-option label="待处理" value="pending" />
                <el-option label="已查看" value="reviewed" />
                <el-option label="已面试" value="interviewed" />
                <el-option label="已录用" value="hired" />
                <el-option label="已拒绝" value="rejected" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入简历
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出简历
      </el-button>
      <el-dropdown
        v-if="selectedIds.length > 0"
        @command="handleBatchCommand"
      >
        <el-button>
          批量操作
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="export">批量导出</el-dropdown-item>
            <el-dropdown-item command="delete" divided>批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 简历列表 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共收到 {{ total }} 份简历，其中待处理 {{ resumeList.filter(item => item.status === 'pending').length }} 份，已查看 {{ resumeList.filter(item => item.status === 'reviewed').length }} 份，已面试 {{ resumeList.filter(item => item.status === 'interviewed').length }} 份，已录用 {{ resumeList.filter(item => item.status === 'hired').length }} 份，已拒绝 {{ resumeList.filter(item => item.status === 'rejected').length }} 份</span>
      </div>
      <CommonTable
        :data="resumeList"
        :columns="resumeColumns"
        table-id="resume-list"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :loading="loading"
        :show-selection="true"
        :show-actions="true"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @sort-change="handleSortChange"
        @global-search="handleGlobalSearch"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" link size="small" @click.stop="handleDetail(row)">
            查看
          </el-button>
          <el-button type="success" link size="small" @click.stop="handleContact(row)">
            联系
          </el-button>
          <el-button type="warning" link size="small" @click.stop="handleMark(row)">
            标记
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(row)">
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="importVisible" title="导入简历" width="500px" :close-on-click-modal="false">
      <el-form :model="importForm" label-width="100px">
        <el-form-item label="下载模板">
          <el-button type="primary" link @click="handleDownloadTemplate">
            <el-icon><Download /></el-icon>
            点击下载简历导入模板
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

    <!-- 标记对话框 -->
    <el-dialog v-model="markVisible" title="标记简历" width="500px" :close-on-click-modal="false">
      <el-form :model="markForm" label-width="100px">
        <el-form-item label="标记状态">
          <el-select v-model="markForm.status" placeholder="请选择状态">
            <el-option label="待处理" value="pending" />
            <el-option label="已查看" value="reviewed" />
            <el-option label="已面试" value="interviewed" />
            <el-option label="已录用" value="hired" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="markForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="markVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmMark">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Download, Search, RefreshLeft, ArrowLeft, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

// 路由实例
const router = useRouter()

// 筛选表单
const filterForm = ref({
  name: '',
  phone: '',
  position: '',
  education: '',
  experience: '',
  status: ''
})

// 筛选条件展开状态
const filterVisible = ref(false)

// 选中项
const selectedIds = ref<string[]>([])

// 简历列表数据
const resumeList = ref([
  {
    id: 'RES001',
    name: '李四',
    phone: '13900139000',
    position: '普工',
    education: '高中',
    experience: '2年',
    age: 28,
    gender: '男',
    status: 'pending',
    submitTime: '2024-02-25 09:30:00',
    updateTime: '2024-02-25 09:30:00'
  },
  {
    id: 'RES002',
    name: '王五',
    phone: '13700137000',
    position: '普工',
    education: '初中',
    experience: '3年',
    age: 32,
    gender: '男',
    status: 'reviewed',
    submitTime: '2024-02-24 14:20:00',
    updateTime: '2024-02-24 16:30:00'
  },
  {
    id: 'RES003',
    name: '赵六',
    phone: '13600136000',
    position: '技工',
    education: '中专',
    experience: '5年',
    age: 35,
    gender: '男',
    status: 'interviewed',
    submitTime: '2024-02-23 10:15:00',
    updateTime: '2024-02-24 11:20:00'
  },
  {
    id: 'RES004',
    name: '孙七',
    phone: '13500135000',
    position: '质检员',
    education: '大专',
    experience: '2年',
    age: 26,
    gender: '女',
    status: 'hired',
    submitTime: '2024-02-22 15:45:00',
    updateTime: '2024-02-23 09:10:00'
  },
  {
    id: 'RES005',
    name: '周八',
    phone: '13400134000',
    position: '操作工',
    education: '高中',
    experience: '1年',
    age: 24,
    gender: '女',
    status: 'rejected',
    submitTime: '2024-02-21 08:30:00',
    updateTime: '2024-02-22 14:50:00'
  }
])

const total = ref(5)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 简历列表列配置
const resumeColumns: ColumnConfig[] = [
  { prop: 'id', label: '简历编号', width: 120, sortable: true },
  { prop: 'name', label: '姓名', width: 100, sortable: true },
  { prop: 'phone', label: '手机号', width: 120, sortable: true },
  { prop: 'position', label: '应聘岗位', width: 100, sortable: true },
  { prop: 'education', label: '学历', width: 100, sortable: true },
  { prop: 'experience', label: '工作经验', width: 100, sortable: true },
  { prop: 'age', label: '年龄', width: 80, sortable: true },
  { prop: 'gender', label: '性别', width: 80, sortable: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'submitTime', label: '提交时间', width: 180, sortable: true },
  { prop: 'updateTime', label: '更新时间', width: 180, sortable: true }
]

// 导入相关
const importVisible = ref(false)
const importAction = '/api/resume/import'
const uploadHeaders = ref({})
const importing = ref(false)
const importForm = ref({
  file: null
})

// 标记相关
const markVisible = ref(false)
const markForm = ref({
  id: '',
  status: '',
  remark: ''
})

// 返回
const handleBack = () => {
  router.back()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadResumeList()
}

// 重置
const handleReset = () => {
  filterForm.value = {
    name: '',
    phone: '',
    position: '',
    education: '',
    experience: '',
    status: ''
  }
  currentPage.value = 1
  loadResumeList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadResumeList()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  loadResumeList()
}

// 排序变化
const handleSortChange = (sort: any) => {
  console.log('排序变化:', sort)
  loadResumeList()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  console.log('全局搜索:', keyword)
  loadResumeList()
}

// 行点击
const handleRowClick = (row: any) => {
  handleDetail(row)
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 批量操作
const handleBatchCommand = (command: string) => {
  switch (command) {
    case 'export':
      handleBatchExport()
      break
    case 'delete':
      handleBatchDelete()
      break
  }
}

// 批量导出
const handleBatchExport = () => {
  ElMessage.success('批量导出中...')
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的${selectedIds.value.length}条简历吗？删除后不可恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    loadResumeList()
  }).catch(() => {})
}

// 查看详情
const handleDetail = (row: any) => {
  router.push(`/tenant/recruitment/resume/${row.id}`)
}

// 联系
const handleContact = (row: any) => {
  ElMessageBox.confirm(`确定要联系 ${row.name} 吗？\n手机号：${row.phone}`, '联系确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('已记录联系信息')
  }).catch(() => {})
}

// 标记
const handleMark = (row: any) => {
  markForm.value = {
    id: row.id,
    status: row.status,
    remark: ''
  }
  markVisible.value = true
}

// 确认标记
const handleConfirmMark = () => {
  ElMessage.success('标记成功')
  markVisible.value = false
  loadResumeList()
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.name} 的简历吗？删除后不可恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    loadResumeList()
  }).catch(() => {})
}

// 导入
const handleImport = () => {
  importVisible.value = true
}

// 下载模板
const handleDownloadTemplate = () => {
  ElMessage.success('模板下载中...')
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
const handleConfirmImport = () => {
  if (!importForm.value.file) {
    ElMessage.warning('请先上传文件')
    return
  }
  importing.value = true
  // 模拟API调用
  setTimeout(() => {
    importing.value = false
    importVisible.value = false
    ElMessage.success('导入成功')
    loadResumeList()
  }, 1000)
}

// 导出
const handleExport = () => {
  ElMessage.success('导出中...')
}

// 加载简历列表
const loadResumeList = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'info',
    reviewed: 'warning',
    interviewed: 'primary',
    hired: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    reviewed: '已查看',
    interviewed: '已面试',
    hired: '已录用',
    rejected: '已拒绝'
  }
  return textMap[status] || status
}

// 生命周期
onMounted(() => {
  loadResumeList()
})
</script>

<style scoped>
.resume-container {
  width: 100%;
  padding: 16px;
  background-color: #f5f7fa;
}

.filter-card,
.table-card {
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-toggle {
  color: #409eff;
}

.filter-expanded {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.filter-expanded .el-form-item {
  margin-right: 12px;
  margin-bottom: 12px;
}

/* 功能按钮区域 */
.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-stats {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
  font-size: 14px;
  color: #f56c6c;
  line-height: 1.5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .resume-container {
    padding: 12px;
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-bar .el-button {
    width: 100%;
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
  :deep(.el-input) {
    width: 100% !important;
  }
}
</style>
