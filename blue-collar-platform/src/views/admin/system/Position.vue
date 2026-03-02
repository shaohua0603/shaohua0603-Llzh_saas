<template>
  <div class="position-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="岗位名称">
          <el-input
            v-model="queryParams.positionName"
            placeholder="请输入岗位名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select
            v-model="queryParams.departmentId"
            placeholder="请选择所属部门"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择岗位状态"
            clearable
            style="width: 150px"
          >
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="action-bar">
      <el-button
        type="primary"
        :icon="Plus"
        @click="handleAdd"
        v-permission="['system:position:create']"
      >
        新增
      </el-button>
      <el-button
        :icon="Delete"
        :disabled="selectedIds.length === 0"
        @click="handleBatchDelete"
        v-permission="['system:position:delete']"
      >
        批量删除
      </el-button>
      <el-button
        :icon="Download"
        @click="handleExport"
        v-permission="['system:position:export']"
      >
        导出
      </el-button>
    </div>

    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="positionList"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column
          prop="positionName"
          label="岗位名称"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="departmentName"
          label="所属部门"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="dataPermissionType"
          label="数据权限"
          min-width="150"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag :type="DataPermissionTypeDict[row.dataPermissionType]?.color">
              {{ DataPermissionTypeDict[row.dataPermissionType]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="menuPermissions"
          label="菜单权限"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.menuPermissions?.length || 0 }}个
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="岗位状态"
          width="100"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
              {{ row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建时间"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              link
              @click="handleDetail(row)"
              v-permission="['system:position:view']"
            >
              详情
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="handleEdit(row)"
              v-permission="['system:position:update']"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="handleDelete(row)"
              v-permission="['system:position:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download } from '@element-plus/icons-vue'
import { usePositionStore } from '@/stores/position'
import { DataPermissionTypeDict } from '@/types/system/positionTypes'
import type { Position, PositionQueryParams } from '@/types/system/positionTypes'

const router = useRouter()
const positionStore = usePositionStore()

const loading = ref(false)
const positionList = ref<Position[]>([])
const selectedIds = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const queryParams = reactive<PositionQueryParams>({
  page: 1,
  pageSize: 10,
  positionName: '',
  departmentId: '',
  status: undefined
})

const departmentList = ref([
  { id: '1', name: '人力资源部' },
  { id: '2', name: '财务部' },
  { id: '3', name: '技术部' },
  { id: '4', name: '市场部' },
  { id: '5', name: '运营部' }
])

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

const fetchData = async () => {
  loading.value = true
  try {
    await positionStore.fetchPositionList({
      ...queryParams,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    positionList.value = positionStore.positionList
    total.value = positionStore.total
  } catch (error) {
    console.error('获取岗位列表失败:', error)
    ElMessage.error('获取岗位列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleReset = () => {
  queryParams.positionName = ''
  queryParams.departmentId = ''
  queryParams.status = undefined
  currentPage.value = 1
  fetchData()
}

const handleAdd = () => {
  router.push('/admin/system/position/add')
}

const handleEdit = (row: Position) => {
  router.push(`/admin/system/position/edit/${row.id}`)
}

const handleDetail = (row: Position) => {
  router.push(`/admin/system/position/${row.id}`)
}

const handleDelete = async (row: Position) => {
  try {
    await ElMessageBox.confirm(`确定要删除岗位"${row.positionName}"吗？`, '提示', {
      type: 'warning'
    })
    await positionStore.deletePosition(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleSelectionChange = (selection: Position[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的岗位')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedIds.value.length}个岗位吗？`, '提示', {
      type: 'warning'
    })
    await positionStore.batchDeletePositions(selectedIds.value)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    fetchData()
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleExport = async () => {
  try {
    const blob = await positionStore.exportPositions(queryParams)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `岗位列表_${new Date().getTime()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.position-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 16px 20px;
}

@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-bar > * {
    width: 100%;
    margin-bottom: 12px;
  }
}
</style>
