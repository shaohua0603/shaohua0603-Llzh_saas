<template>
  <div class="pickup-container">
    
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <!-- 初始模式显示的查询条件和按钮 -->
      <div class="filter-default">
        <div class="filter-toggle-container">
          <el-form :model="filterForm" inline>
            <el-form-item label="状态">
              <el-select v-model="filterForm.status" placeholder="请选择状态" clearable style="width: 150px">
                <el-option label="待接送" value="pending" />
                <el-option label="接送中" value="in_progress" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
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
            <el-form-item label="车牌号">
              <el-input v-model="filterForm.plateNumber" placeholder="请输入车牌号" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="集合时间">
              <el-date-picker
                v-model="filterForm.pickupTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 360px"
              />
            </el-form-item>
            <el-form-item label="起点">
              <el-input v-model="filterForm.startPoint" placeholder="请输入起点" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="终点">
              <el-input v-model="filterForm.endPoint" placeholder="请输入终点" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="负责人">
              <el-input v-model="filterForm.manager" placeholder="请输入负责人" clearable style="width: 150px" />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd" v-permission="['interview:pickup:create']">
        <el-icon><Plus /></el-icon>
        新增接送
      </el-button>
      <el-button @click="handleImport" v-permission="['interview:pickup:import']">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button @click="handleExport" v-permission="['interview:pickup:export']">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>

    <!-- 接送列表 -->
    <el-card class="table-card" shadow="never">
      <!-- 数据统计信息 -->
      <div class="table-stats">
        <span>共接送 {{ total }} 人次，其中待接送 {{ pickupList.filter(item => item.status === 'pending').length }} 人，接送中 {{ pickupList.filter(item => item.status === 'in_progress').length }} 人，已完成 {{ pickupList.filter(item => item.status === 'completed').length }} 人</span>
      </div>
      <CommonTable
        :data="pickupList"
        :columns="pickupColumns"
        table-id="pickup-list"
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
        <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" link size="small" @click.stop="handleDetail(row)" v-permission="['interview:pickup:view']">
            查看
          </el-button>
          <el-button type="warning" link size="small" @click.stop="handleEdit(row)" v-permission="['interview:pickup:update']">
            编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(row)" v-permission="['interview:pickup:delete']">
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="importVisible" title="导入接送信息" width="500px" :close-on-click-modal="false">
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
import { getPickupList, deletePickup, batchDeletePickups, importPickups, exportPickups, downloadPickupTemplate, type Pickup, type PickupQueryParams } from '@/api/interviewApi'
import { PermissionUtil } from '@/utils/permissionUtil'

// 路由实例
const router = useRouter()

// 筛选表单
const filterForm = ref({
  plateNumber: '',
  pickupTime: [],
  startPoint: '',
  endPoint: '',
  manager: '',
  status: ''
})

const pickupList = ref<Pickup[]>([])
const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const filterVisible = ref(false)

const pickupColumns: ColumnConfig[] = [
  { prop: 'id', label: '接送编号', width: 120, sortable: true },
  { prop: 'plateNumber', label: '车牌号', width: 120, sortable: true },
  { prop: 'pickupTime', label: '集合时间', width: 180, sortable: true },
  { prop: 'startPoint', label: '起点', width: 150, sortable: true },
  { prop: 'endPoint', label: '终点', width: 150, sortable: true },
  { prop: 'pickupPerson', label: '接送人', width: 100, sortable: true },
  { prop: 'manager', label: '负责人', width: 100, sortable: true },
  { prop: 'groupNumber', label: '群号', width: 100, sortable: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'workerCount', label: '接送人数', width: 100, sortable: true },
  { prop: 'createTime', label: '创建时间', width: 180, sortable: true }
]

// 导入相关
const importVisible = ref(false)
const importAction = '/api/pickup/import'
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
  router.push('/labor-company/interview/pickup/add')
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadPickupList()
}

// 重置
const handleReset = () => {
  filterForm.value = {
    plateNumber: '',
    pickupTime: [],
    startPoint: '',
    endPoint: '',
    manager: '',
    status: ''
  }
  currentPage.value = 1
  loadPickupList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadPickupList()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  loadPickupList()
}

// 排序变化
const handleSortChange = (sort: any) => {
  console.log('排序变化:', sort)
  loadPickupList()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  console.log('全局搜索:', keyword)
  loadPickupList()
}

// 行点击
const handleRowClick = (row: any) => {
  handleDetail(row)
}

// 查看详情
const handleDetail = (row: any) => {
  router.push(`/labor-company/interview/pickup/${row.id}`)
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/labor-company/interview/pickup/edit/${row.id}`)
}

// 删除
const handleDelete = async (row: Pickup) => {
  ElMessageBox.confirm(`确定要删除该接送信息吗？删除后不可恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePickup(row.id)
      ElMessage.success('删除成功')
      loadPickupList()
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
  if (response.code === 200 || response.code === 201) {
    ElMessage.success('文件上传成功')
    importForm.value.file = response.data
  } else {
    ElMessage.error(response.message || '文件上传失败')
  }
}

const handleImportError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response
    if (status === 413) {
      ElMessage.error('文件大小超过限制')
    } else if (data?.message) {
      ElMessage.error(data.message)
    } else {
      ElMessage.error('文件上传失败，请检查文件格式')
    }
  } else {
    ElMessage.error('网络错误，请检查网络连接')
  }
  console.error('导入失败:', error)
}

// 确认导入
const handleConfirmImport = async () => {
  if (!importForm.value.file) {
    ElMessage.warning('请先上传文件')
    return
  }
  importing.value = true
  try {
    await importPickups(importForm.value.file)
    importing.value = false
    importVisible.value = false
    ElMessage.success('导入成功')
    loadPickupList()
  } catch (error) {
    importing.value = false
    ElMessage.error('导入失败')
    console.error('API调用错误:', error)
  }
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadPickupTemplate()
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '接送信息导入模板.xlsx'
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

// 导出
const handleExport = async () => {
  try {
    const params: PickupQueryParams = {
      plateNumber: filterForm.value.plateNumber,
      startPoint: filterForm.value.startPoint,
      endPoint: filterForm.value.endPoint,
      manager: filterForm.value.manager
    }
    
    if (filterForm.value.pickupTime && filterForm.value.pickupTime.length === 2) {
      params.pickupTime = filterForm.value.pickupTime
    }
    
    const dataPermission = PermissionUtil.getDataPermission()
    if (dataPermission) {
      params.dataPermission = dataPermission.type
      if (dataPermission.departments && dataPermission.departments.length > 0) {
        params.departmentIds = dataPermission.departments
      }
    }
    
    const response = await exportPickups(params)
    
    if (response.headers['content-type'].includes('application/json')) {
      const errorData = JSON.parse(new TextDecoder().decode(response.data))
      ElMessage.error(errorData.message || '导出失败')
      return
    }
    
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `接送信息_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response
      if (status === 403) {
        ElMessage.error('没有导出权限')
      } else if (data?.message) {
        ElMessage.error(data.message)
      } else {
        ElMessage.error('导出失败')
      }
    } else if (error.message === 'Network Error') {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('导出失败')
    }
    console.error('导出错误:', error)
  }
}

// 加载接送列表
const loadPickupList = async () => {
  loading.value = true
  try {
    const params: PickupQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      plateNumber: filterForm.value.plateNumber,
      startPoint: filterForm.value.startPoint,
      endPoint: filterForm.value.endPoint,
      manager: filterForm.value.manager,
      status: filterForm.value.status
    }
    
    if (filterForm.value.pickupTime && filterForm.value.pickupTime.length === 2) {
      params.pickupTime = filterForm.value.pickupTime
    }
    
    console.log('请求参数:', params)
    
    try {
      const response = await getPickupList(params)
      pickupList.value = response.data?.list || []
      total.value = response.data?.total || 0
    } catch (error) {
      console.error('API调用错误:', error)
      throw error
    }
  } catch (error) {
    ElMessage.error('获取接送列表失败')
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
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
    pending: '待接送',
    in_progress: '接送中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || status
}



// 生命周期
onMounted(() => {
  loadPickupList()
})
</script>

<style scoped>
.pickup-container {
  width: 100%;
  padding: 10px 16px;
  background-color: #f5f7fa;
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
  color: #606266;
  line-height: 1.5;
}

@media screen and (max-width: 768px) {
  .pickup-container {
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
