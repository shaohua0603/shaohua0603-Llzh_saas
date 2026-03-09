<template>
  <div class="workflow-config-container">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="工作流名称">
          <el-input v-model="searchForm.flowName" placeholder="请输入工作流名称" />
        </el-form-item>
        <el-form-item label="工作流类型">
          <el-select v-model="searchForm.flowType" placeholder="请选择工作流类型">
            <el-option label="审批流程" value="APPROVAL" />
            <el-option label="业务流程" value="BUSINESS" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.flowStatus" placeholder="请选择状态">
            <el-option label="启用" value="ENABLED" />
            <el-option label="禁用" value="DISABLED" />
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

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增工作流
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
    </div>

    <!-- 列表展示区域 -->
    <el-card class="list-card">
      <!-- 数据统计区域 -->
      <div class="data-stats">
        <span class="stat-item">工作流总数: <strong>{{ totalCount }}</strong></span>
        <span class="stat-item">启用数量: <strong>{{ enabledCount }}</strong></span>
        <span class="stat-item">禁用数量: <strong>{{ disabledCount }}</strong></span>
      </div>
      
      <el-table
        v-loading="loading"
        :data="workflowList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="flowName" label="工作流名称" min-width="180" />
        <el-table-column prop="flowCode" label="工作流编码" min-width="150" />
        <el-table-column prop="flowType" label="工作流类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.flowType === 'APPROVAL'" type="primary">审批流程</el-tag>
            <el-tag v-else type="success">业务流程</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="flowStatus" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.flowStatus"
              active-value="ENABLED"
              inactive-value="DISABLED"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row.id)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id, row.flowName)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
            <el-button size="small" @click="handleCopy(row.id)">
              <el-icon><DocumentCopy /></el-icon>
              复制
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download, Upload, Edit, Delete, DocumentCopy, Switch } from '@element-plus/icons-vue'
import { getWorkflowList, deleteWorkflow, toggleWorkflowStatus } from '@/api/system/flowConfigApi'
import type { WorkflowItem } from '@/types/flow-config'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  flowName: '',
  flowType: '',
  flowStatus: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10
})

// 数据
const loading = ref(false)
const workflowList = ref<WorkflowItem[]>([])
const total = ref(0)

// 选中项
const selectedRows = ref<WorkflowItem[]>([])

// 统计数据
const totalCount = computed(() => total.value)
const enabledCount = computed(() => (workflowList.value || []).filter(item => item.flowStatus === 'ENABLED').length)
const disabledCount = computed(() => (workflowList.value || []).filter(item => item.flowStatus === 'DISABLED').length)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const response = await getWorkflowList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    workflowList.value = response.list
    total.value = response.total
  } catch (error) {
    ElMessage.error('获取工作流列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.flowName = ''
  searchForm.flowType = ''
  searchForm.flowStatus = ''
  pagination.page = 1
  loadData()
}

// 新增
const handleAdd = () => {
  // 根据当前路由判断是 admin 还是 tenant
  const isAdmin = window.location.pathname.includes('/admin/')
  const basePath = isAdmin ? '/admin/system' : '/tenant'
  router.push(`${basePath}/workflow-config/add`)
}

// 编辑
const handleEdit = (id: number) => {
  // 根据当前路由判断是 admin 还是 tenant
  const isAdmin = window.location.pathname.includes('/admin/')
  const basePath = isAdmin ? '/admin/system' : '/tenant'
  router.push(`${basePath}/workflow-config/edit/${id}`)
}

// 删除
const handleDelete = async (id: number, name: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除工作流「${name}」吗？此操作不可撤销。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await deleteWorkflow(id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 启用/禁用状态切换
const handleStatusChange = async (row: WorkflowItem) => {
  try {
    const enabled = row.flowStatus === 'ENABLED'
    await toggleWorkflowStatus(row.id, enabled)
    ElMessage.success(enabled ? '已启用' : '已禁用')
  } catch (error) {
    // 回滚状态
    row.flowStatus = enabled ? 'DISABLED' : 'ENABLED'
    ElMessage.error('状态更新失败')
    console.error(error)
  }
}

// 复制
const handleCopy = (id: number) => {
  // 根据当前路由判断是 admin 还是 tenant
  const isAdmin = window.location.pathname.includes('/admin/')
  const basePath = isAdmin ? '/admin/system' : '/tenant'
  router.push(`${basePath}/workflow-config/add?copyFrom=${id}`)
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 导入
const handleImport = () => {
  ElMessage.info('导入功能开发中')
}

// 选择变化
const handleSelectionChange = (val: WorkflowItem[]) => {
  selectedRows.value = val
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadData()
}

const handleCurrentChange = (current: number) => {
  pagination.page = current
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.workflow-config-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-card {
  margin-bottom: 16px;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-stats {
  margin-bottom: 16px;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #e4e7ed;
}

.stat-item {
  margin-right: 24px;
  font-size: 14px;
  color: #666;
}

.stat-item strong {
  color: #333;
  font-weight: 600;
}

.list-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .data-stats {
    flex-direction: column;
  }

  .stat-item {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .pagination-container {
    justify-content: center;
  }
}
</style>