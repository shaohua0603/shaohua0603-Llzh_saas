<template>
  <div class="attachment-layout">
    <!-- 左侧菜单树 -->
    <div class="left-panel">
      <el-card class="menu-tree-card">
        <template #header>
          <div class="card-header">
            <span>菜单列表</span>
            <el-input
              v-model="menuSearchKeyword"
              placeholder="搜索菜单"
              prefix-icon="Search"
              clearable
              size="small"
              style="width: 120px"
              @input="handleMenuSearch"
            />
          </div>
        </template>
        <el-tree
          ref="menuTreeRef"
          :data="menuTreeData"
          :props="treeProps"
          :filter-node-method="filterMenuNode"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          :default-expand-all="true"
          @node-click="handleMenuNodeClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <el-icon v-if="data.icon">
                <component :is="data.icon" />
              </el-icon>
              <span class="menu-label">{{ node.label }}</span>
              <el-tag v-if="data.attachmentCount" size="small" type="info">
                {{ data.attachmentCount }}
              </el-tag>
            </span>
          </template>
        </el-tree>
      </el-card>
    </div>

    <!-- 右侧附件配置 -->
    <div class="right-panel">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>{{ selectedMenuName ? `【${selectedMenuName}】附件配置` : '请在左侧选择菜单' }}</span>
          </div>
        </template>

        <!-- 查询条件 -->
        <div class="search-bar" v-if="selectedMenuId">
          <el-input
            v-model="searchForm.attachmentName"
            placeholder="附件名称"
            clearable
            style="width: 200px"
            @input="handleSearch"
          />
          <el-select
            v-model="searchForm.attachmentTypes"
            placeholder="附件类型"
            multiple
            clearable
            collapse-tags
            collapse-tags-tooltip
            style="width: 200px"
            @change="handleSearch"
          >
            <el-option label="图片" value="IMAGE" />
            <el-option label="文件" value="FILE" />
            <el-option label="视频" value="VIDEO" />
            <el-option label="音频" value="AUDIO" />
            <el-option label="文档" value="DOCUMENT" />
          </el-select>
          <el-select
            v-model="searchForm.required"
            placeholder="是否必传"
            clearable
            style="width: 120px"
            @change="handleSearch"
          >
            <el-option label="必传" :value="true" />
            <el-option label="可选" :value="false" />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </div>

        <!-- 功能按钮 -->
        <div class="action-bar" v-if="selectedMenuId">
          <el-button type="primary" :disabled="!selectedMenuId" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>

        <!-- 表格 -->
        <el-table
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
          v-if="selectedMenuId"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="attachmentName" label="附件名称" min-width="150" />
          <el-table-column prop="attachmentTypes" label="类型" width="150">
            <template #default="{ row }">
              <el-tag
                v-for="type in (row.attachmentTypes || [])"
                :key="type"
                :type="getAttachmentTypeTag(type)"
                size="small"
                style="margin-right: 4px"
              >
                {{ getAttachmentTypeLabel(type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="maxSize" label="大小限制" width="100">
            <template #default="{ row }">
              {{ row.maxSize ? `${row.maxSize}MB` : '不限制' }}
            </template>
          </el-table-column>
          <el-table-column prop="required" label="必传" width="80">
            <template #default="{ row }">
              <el-tag :type="row.required ? 'danger' : 'info'" size="small">
                {{ row.required ? '必传' : '可选' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="templateFileName" label="模板文件" min-width="150">
            <template #default="{ row }">
              {{ row.templateFileName || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 'enabled' ? 'success' : 'info'" size="small">
                {{ row.status === 'enabled' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="primary" link @click="handleView(row)">详情</el-button>
              <el-button
                :type="row.status === 'enabled' ? 'warning' : 'success'"
                link
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 'enabled' ? '禁用' : '启用' }}
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态提示 -->
        <el-empty v-if="!selectedMenuId" description="请在左侧选择菜单" />
        <el-empty v-if="selectedMenuId && tableData.length === 0 && !loading" description="暂无附件配置" />

        <!-- 分页 -->
        <div class="pagination" v-if="selectedMenuId && tableData.length > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import { attachmentConfigApi } from '@/api/attachmentConfigApi'
import { getMenuTree } from '@/api/system/menuApi'
import { AttachmentType, AttachmentTypeConfig, type AttachmentConfig } from '@/types/attachment'

const router = useRouter()

const menuSearchKeyword = ref('')
const menuTreeRef = ref()
const menuTreeData = ref<any[]>([])
const selectedMenuId = ref<string>('')
const selectedMenuName = ref<string>('')

const treeProps = {
  children: 'children',
  label: 'menuName',
  value: 'id'
}

const loading = ref(false)
const tableData = ref<AttachmentConfig[]>([])
const selectedRows = ref<AttachmentConfig[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  attachmentName: '',
  attachmentTypes: [] as string[],
  required: null as boolean | null
})

const loading = ref(false)

const getAttachmentTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    IMAGE: 'success',
    FILE: 'primary',
    VIDEO: 'warning',
    AUDIO: 'danger',
    DOCUMENT: 'info'
  }
  return tags[type] || 'info'
}

const getAttachmentTypeLabel = (type: string) => {
  return AttachmentTypeConfig[type as AttachmentType]?.label || type
}

const loadMenuTree = async () => {
  try {
    const response = await getMenuTree({ menuStatus: 'enabled' })
    if (response.data) {
      const processMenu = (menus: any[]): any[] => {
        return menus.map(menu => ({
          ...menu,
          children: menu.children ? processMenu(menu.children) : undefined
        })).filter(item => item.menuType !== 'button')
      }
      menuTreeData.value = processMenu(response.data)
    }
  } catch (error) {
    ElMessage.error('加载菜单失败')
  }
}

const handleMenuNodeClick = (data: any) => {
  selectedMenuId.value = String(data.id)
  selectedMenuName.value = data.menuName
  currentPage.value = 1
  fetchAttachmentList()
}

const handleMenuSearch = () => {
  menuTreeRef.value?.filter(menuSearchKeyword.value)
}

const filterMenuNode = (value: string, data: any) => {
  if (!value) return true
  return data.menuName?.includes(value)
}

const fetchAttachmentList = async () => {
  if (!selectedMenuId.value) {
    tableData.value = []
    return
  }
  
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      menuId: selectedMenuId.value,
      ...searchForm
    }
    const response = await attachmentConfigApi.getAttachmentConfigList(params)
    tableData.value = response.data?.list || []
    total.value = response.data?.total || 0
  } catch (error) {
    ElMessage.error('获取附件配置失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchAttachmentList()
}

const handleReset = () => {
  searchForm.attachmentName = ''
  searchForm.attachmentTypes = []
  searchForm.required = null
  handleSearch()
}

const handleAdd = () => {
  router.push({
    path: '/admin/attachment-config-create',
    query: { menuId: selectedMenuId.value, menuName: selectedMenuName.value }
  })
}

const handleEdit = (row: AttachmentConfig) => {
  router.push({
    path: '/admin/attachment-config-edit',
    query: { id: row.id }
  })
}

const handleView = (row: AttachmentConfig) => {
  router.push({
    path: '/admin/attachment-config-view',
    query: { id: row.id }
  })
}

const handleDelete = async (row: AttachmentConfig) => {
  try {
    await ElMessageBox.confirm(`确定要删除附件配置"${row.attachmentName}"吗？`, '提示', {
      type: 'warning'
    })
    await attachmentConfigApi.deleteAttachmentConfig(row.id)
    ElMessage.success('删除成功')
    fetchAttachmentList()
  } catch {}
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}条配置吗？`, '提示', {
      type: 'warning'
    })
    const ids = selectedRows.value.map(row => row.id)
    await attachmentConfigApi.batchDeleteAttachmentConfig(ids)
    ElMessage.success('批量删除成功')
    fetchAttachmentList()
  } catch {}
}

const handleToggleStatus = async (row: AttachmentConfig) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  await attachmentConfigApi.updateAttachmentConfigStatus(row.id, newStatus)
  ElMessage.success(`${newStatus === 'enabled' ? '启用' : '禁用'}成功`)
  fetchAttachmentList()
}

const handleSelectionChange = (selection: AttachmentConfig[]) => {
  selectedRows.value = selection
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchAttachmentList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchAttachmentList()
}

onMounted(() => {
  loadMenuTree()
})
</script>

<style scoped>
.attachment-layout {
  display: flex;
  gap: 16px;
  padding: 16px;
  height: calc(100vh - 140px);
  background-color: #f5f7fa;
}

.left-panel {
  width: 300px;
  flex-shrink: 0;
}

.menu-tree-card {
  height: 100%;
}

.menu-tree-card :deep(.el-card__body) {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 12px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding-right: 8px;
}

.menu-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-panel {
  flex: 1;
  min-width: 0;
}

.right-panel :deep(.el-card__body) {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media screen and (max-width: 1200px) {
  .left-panel {
    width: 260px;
  }
}

@media screen and (max-width: 768px) {
  .attachment-layout {
    flex-direction: column;
    height: auto;
  }

  .left-panel {
    width: 100%;
    max-height: 300px;
  }

  .right-panel {
    width: 100%;
  }

  .search-bar {
    flex-direction: column;
  }

  .search-bar > * {
    width: 100% !important;
  }
}
</style>
