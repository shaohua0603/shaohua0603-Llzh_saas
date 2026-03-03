<template>
  <div class="common-table-container">
    <!-- 表格容器 -->
    <div class="table-wrapper">
      <!-- 数据统计区域 -->
      <div v-if="statsInfo" class="table-stats">
        <template v-if="Array.isArray(statsInfo)">
          <span v-for="(item, index) in statsInfo" :key="index" class="stats-item">
            {{ item.label }}: {{ item.value }}
            <span v-if="index < statsInfo.length - 1" class="stats-separator">|</span>
          </span>
        </template>
        <span v-else>{{ statsInfo }}</span>
      </div>

      <!-- 工具栏 -->
      <div v-if="showToolbar" class="table-toolbar">
        <div class="toolbar-left">
          <!-- 全局搜索 -->
          <el-input
            v-if="showGlobalSearch"
            v-model="globalSearchKeyword"
            placeholder="全局搜索"
            prefix-icon="Search"
            clearable
            style="width: 300px"
            @input="handleGlobalSearch"
          />
          <slot name="toolbar-left"></slot>
        </div>
        <div class="toolbar-right">
          <!-- 列表管理 -->
          <el-dropdown v-if="showListManagement" @command="handleListCommand">
            <el-button>
              <el-icon><Menu /></el-icon>
              列表管理
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="save">保存当前列表</el-dropdown-item>
                <el-dropdown-item command="manage">管理列表</el-dropdown-item>
                <el-dropdown-item command="reset">重置为默认</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 列设置 -->
          <el-button v-if="showColumnSetting" @click="columnSettingVisible = true">
            <el-icon><Setting /></el-icon>
            列设置
          </el-button>
          <slot name="toolbar-right"></slot>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        :border="border"
        :stripe="stripe"
        :height="height"
        :max-height="maxHeight"
        :row-key="rowKey"
        :default-sort="defaultSort"
        :sort-orders="['ascending', 'descending', null]"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        style="width: 100%"
      >
      <!-- 多选列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        :reserve-selection="true"
        fixed="left"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        fixed="left"
      />

      <!-- 动态列 -->
      <template v-for="column in props.columns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable ? 'custom' : false"
          :align="column.align || 'left'"
          :show-overflow-tooltip="column.showTooltip !== false"
          :resizable="column.resizable !== false"
        >
          <template #default="scope">
            <!-- 自定义列插槽 -->
            <slot
              v-if="$slots[`column-${column.prop}`]"
              :name="`column-${column.prop}`"
              :row="scope.row"
              :column="column"
              :$index="scope.$index"
            ></slot>
            <!-- 默认显示 -->
            <span v-else v-html="formatCellValue(scope.row[column.prop], column)"></span>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        label="操作"
        :width="actionColumnWidth"
        :fixed="actionFixed"
        align="center"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :$index="scope.$index"></slot>
        </template>
      </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div v-if="showPagination" class="table-pagination">
        <div class="pagination-left">
          <el-button
            v-if="showBatchActions && selectedRows.length > 0"
            type="primary"
            size="small"
            @click="handleBatchAction"
          >
            批量操作 ({{ selectedRows.length }})
          </el-button>
          <slot name="pagination-left" :selected-rows="selectedRows"></slot>
        </div>
        <el-pagination
          v-model:current-page="localCurrentPage"
          v-model:page-size="localPageSize"
          :page-sizes="pageSizes"
          :layout="paginationLayout"
          :total="total"
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 列设置对话框 -->
    <el-dialog
      v-model="columnSettingVisible"
      title="列设置"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="column-setting">
        <div class="setting-header">
          <span>显示/隐藏列</span>
          <el-button size="small" @click="resetColumnSettings">重置</el-button>
        </div>
        <el-checkbox-group v-model="visibleColumnProps">
          <div class="column-list">
            <el-checkbox
              v-for="column in props.columns"
              :key="column.prop"
              :label="column.prop"
              :disabled="column.required"
            >
              {{ column.label }}
              <el-tag v-if="column.required" size="small" type="info">必选</el-tag>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <div class="column-order">
        <div class="setting-header">
          <span>列顺序调整</span>
        </div>
        <div class="order-tips">
          <el-icon><InfoFilled /></el-icon>
          <span>拖拽调整列的显示顺序</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="columnSettingVisible = false">取消</el-button>
        <el-button type="primary" @click="saveColumnSettings">确定</el-button>
      </template>
    </el-dialog>

    <!-- 保存列表对话框 -->
    <el-dialog
      v-model="saveListVisible"
      title="保存列表"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="listForm" label-width="80px">
        <el-form-item label="列表名称">
          <el-input v-model="listForm.name" placeholder="请输入列表名称" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="listForm.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveListVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveList">确定</el-button>
      </template>
    </el-dialog>

    <!-- 列表管理对话框 -->
    <el-dialog
      v-model="listManagementVisible"
      title="列表管理"
      width="700px"
      :close-on-click-modal="false"
    >
      <div class="list-management">
        <div class="list-item" v-for="list in customLists" :key="list.id">
          <div class="list-info">
            <span class="list-name">{{ list.name }}</span>
            <el-tag v-if="list.isDefault" size="small" type="success">默认</el-tag>
          </div>
          <div class="list-actions">
            <el-button
              size="small"
              type="primary"
              link
              @click="applyList(list)"
            >
              应用
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="setDefaultList(list)"
              :disabled="list.isDefault"
            >
              设为默认
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="deleteList(list)"
              :disabled="list.isDefault"
            >
              删除
            </el-button>
          </div>
        </div>
        <el-empty v-if="customLists.length === 0" description="暂无自定义列表" />
      </div>
      <template #footer>
        <el-button @click="listManagementVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Menu,
  ArrowDown,
  Setting,
  InfoFilled
} from '@element-plus/icons-vue'

// 类型定义
export interface ColumnConfig {
  prop: string
  label: string
  width?: number
  minWidth?: number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  showTooltip?: boolean
  resizable?: boolean
  required?: boolean
  formatter?: (value: any, row: any) => string
}

export interface TableConfig {
  tableId: string
  columns: ColumnConfig[]
  defaultSort?: { prop: string; order: 'ascending' | 'descending' | null }
}

export interface CustomList {
  id: string
  name: string
  isDefault: boolean
  visibleColumns: string[]
  columnOrder: string[]
  userId: string
  createdAt: string
}

// Props定义
interface Props {
  // 表格数据
  data: any[]
  // 表格配置
  columns: ColumnConfig[]
  // 表格ID(用于保存设置)
  tableId: string
  // 是否显示边框
  border?: boolean
  // 是否显示斑马纹
  stripe?: boolean
  // 表格高度
  height?: string | number
  // 最大高度
  maxHeight?: string | number
  // 行数据的Key
  rowKey?: string
  // 默认排序
  defaultSort?: { prop: string; order: 'ascending' | 'descending' | null }
  // 是否显示工具栏
  showToolbar?: boolean
  // 是否显示全局搜索
  showGlobalSearch?: boolean
  // 是否显示列表管理
  showListManagement?: boolean
  // 是否显示列设置
  showColumnSetting?: boolean
  // 是否显示多选
  showSelection?: boolean
  // 是否显示序号
  showIndex?: boolean
  // 是否显示操作列
  showActions?: boolean
  // 操作列宽度
  actionColumnWidth?: number
  // 操作列固定
  actionFixed?: boolean | 'left' | 'right'
  // 是否显示分页
  showPagination?: boolean
  // 是否显示批量操作
  showBatchActions?: boolean
  // 分页大小选项
  pageSizes?: number[]
  // 分页布局
  paginationLayout?: string
  // 总条数
  total?: number
  // 当前页
  currentPage?: number
  // 每页条数
  pageSize?: number
  // 加载状态
  loading?: boolean
  // 数据统计信息
  statsInfo?: string | Array<{ label: string; value: string }>
}

const props = withDefaults(defineProps<Props>(), {
  border: true,
  stripe: true,
  rowKey: 'id',
  showToolbar: true,
  showGlobalSearch: true,
  showListManagement: true,
  showColumnSetting: true,
  showSelection: true,
  showIndex: true,
  showActions: true,
  actionColumnWidth: 200,
  actionFixed: 'right',
  showPagination: true,
  showBatchActions: true,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  total: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  statsInfo: '',
  columns: () => []
})

// Emits定义
const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  'sort-change': [sort: { prop: string; order: string | null }]
  'selection-change': [selection: any[]]
  'row-click': [row: any, column: any, event: Event]
  'global-search': [keyword: string]
  'batch-action': [selectedRows: any[]]
  'save-list': [list: CustomList]
  'apply-list': [list: CustomList]
  'reset-list': []
}>()

// 响应式数据
const tableRef = ref()
const globalSearchKeyword = ref('')
const selectedRows = ref<any[]>([])
const columnSettingVisible = ref(false)
const saveListVisible = ref(false)
const listManagementVisible = ref(false)
const visibleColumnProps = ref<string[]>([])

// 本地分页状态
const localCurrentPage = ref(props.currentPage)
const localPageSize = ref(props.pageSize)
const customLists = ref<CustomList[]>([])

// 列表表单
const listForm = ref({
  name: '',
  isDefault: false
})



// 计算属性 - 表格数据
const tableData = computed(() => props.data)

// 获取当前用户ID(实际项目中应从store或token中获取)
const getCurrentUserId = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return user.id || 'default'
    } catch {
      return 'default'
    }
  }
  return 'default'
}

// 获取存储键
const getStorageKey = (type: string) => {
  const userId = getCurrentUserId()
  return `common-table-${props.tableId}-${type}-${userId}`
}

// 初始化列设置
const initColumnSettings = () => {
  // 强制使用新的列配置，忽略localStorage中的旧设置
  // 确保props.columns存在且不为空
  if (props.columns && props.columns.length > 0) {
    visibleColumnProps.value = props.columns.map(col => col.prop)
  } else {
    // 安全处理，避免空数组
    visibleColumnProps.value = []
  }
  // 清除旧的存储设置，避免影响新的列配置
  const storageKey = getStorageKey('column-settings')
  localStorage.removeItem(storageKey)
}

// 保存列设置
const saveColumnSettings = () => {
  const settings = {
    visibleColumns: visibleColumnProps.value,
    columnOrder: visibleColumnProps.value
  }
  localStorage.setItem(getStorageKey('column-settings'), JSON.stringify(settings))
  columnSettingVisible.value = false
  ElMessage.success('列设置已保存')
}

// 重置列设置
const resetColumnSettings = () => {
  visibleColumnProps.value = props.columns.map(col => col.prop)
}

// 初始化自定义列表
const initCustomLists = () => {
  const savedLists = localStorage.getItem(getStorageKey('custom-lists'))
  if (savedLists) {
    try {
      customLists.value = JSON.parse(savedLists)
    } catch {
      customLists.value = []
    }
  } else {
    customLists.value = []
  }
}

// 保存自定义列表
const saveCustomLists = () => {
  localStorage.setItem(getStorageKey('custom-lists'), JSON.stringify(customLists.value))
}

// 处理列表命令
const handleListCommand = (command: string) => {
  switch (command) {
    case 'save':
      saveListVisible.value = true
      break
    case 'manage':
      listManagementVisible.value = true
      break
    case 'reset':
      handleResetList()
      break
  }
}

// 保存列表
const handleSaveList = () => {
  if (!listForm.value.name) {
    ElMessage.warning('请输入列表名称')
    return
  }

  const newList: CustomList = {
    id: Date.now().toString(),
    name: listForm.value.name,
    isDefault: listForm.value.isDefault,
    visibleColumns: [...visibleColumnProps.value],
    columnOrder: [...visibleColumnProps.value],
    userId: getCurrentUserId(),
    createdAt: new Date().toISOString()
  }

  // 如果设为默认,取消其他默认列表
  if (newList.isDefault) {
    customLists.value.forEach(list => list.isDefault = false)
  }

  customLists.value.push(newList)
  saveCustomLists()

  emit('save-list', newList)
  ElMessage.success('列表保存成功')
  saveListVisible.value = false
  listForm.value = { name: '', isDefault: false }
}

// 应用列表
const applyList = (list: CustomList) => {
  visibleColumnProps.value = [...list.visibleColumns]
  emit('apply-list', list)
  ElMessage.success('列表应用成功')
  listManagementVisible.value = false
}

// 设为默认列表
const setDefaultList = (list: CustomList) => {
  customLists.value.forEach(l => l.isDefault = false)
  list.isDefault = true
  saveCustomLists()
  ElMessage.success('已设为默认列表')
}

// 删除列表
const deleteList = (list: CustomList) => {
  ElMessageBox.confirm('确定要删除该列表吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = customLists.value.findIndex(l => l.id === list.id)
    if (index > -1) {
      customLists.value.splice(index, 1)
      saveCustomLists()
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 重置列表
const handleResetList = () => {
  ElMessageBox.confirm('确定要重置为默认列表吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    visibleColumnProps.value = props.columns.map(col => col.prop)
    emit('reset-list')
    ElMessage.success('已重置为默认列表')
  }).catch(() => {})
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  emit('global-search', keyword)
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  emit('sort-change', sort)
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

// 行点击
const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  localPageSize.value = size
  emit('update:pageSize', size)
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  localCurrentPage.value = current
  emit('update:currentPage', current)
}

// 批量操作
const handleBatchAction = () => {
  emit('batch-action', selectedRows.value)
}

// 格式化单元格值
const formatCellValue = (value: any, column: ColumnConfig) => {
  if (column.formatter) {
    return column.formatter(value, { [column.prop]: value })
  }
  return value
}

// 暴露方法
defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row: any, selected?: boolean) => tableRef.value?.toggleRowSelection(row, selected),
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  toggleRowExpansion: (row: any, expanded?: boolean) => tableRef.value?.toggleRowExpansion(row, expanded),
  setCurrentRow: (row: any) => tableRef.value?.setCurrentRow(row),
  clearSort: () => tableRef.value?.clearSort(),
  sort: (prop: string, order: string) => tableRef.value?.sort(prop, order)
})

// 监听分页状态变化
watch(() => props.currentPage, (newCurrentPage) => {
  localCurrentPage.value = newCurrentPage
})

watch(() => props.pageSize, (newPageSize) => {
  localPageSize.value = newPageSize
})

// 监听columns变化
watch(() => props.columns, (newColumns) => {
  if (newColumns && newColumns.length > 0) {
    // 重新初始化列设置
    initColumnSettings()
  }
}, { deep: true })

// 生命周期
onMounted(() => {
  // 确保props.columns存在且不为空
  if (props.columns && props.columns.length > 0) {
    initColumnSettings()
  } else {
    // 如果props.columns为空，设置一个默认值
    visibleColumnProps.value = []
  }
  initCustomLists()
})
</script>

<style scoped>
.common-table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 工具栏 */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 16px 16px;
  background-color: #fff;
}

/* 表格容器 */
.table-wrapper {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 数据统计区域 */
.table-stats {
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  border-left: 3px solid #409eff;
  margin: 16px;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.stats-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.stats-separator {
  color: #c0c4cc;
  margin-left: 4px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 表格 */
:deep(.el-table) {
  font-size: 14px;
  margin: 0 16px 16px 16px;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table .cell) {
  padding: 12px 8px;
}

:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid #ebeef5;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
}

/* 分页 */
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
}

.pagination-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 列设置 */
.column-setting {
  margin-bottom: 20px;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
}

.column-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.column-list .el-checkbox {
  margin: 0;
}

.column-order {
  margin-top: 20px;
}

.order-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #1890ff;
}

/* 列表管理 */
.list-management {
  max-height: 400px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: all 0.3s;
}

.list-item:hover {
  background-color: #e6f7ff;
}

.list-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-name {
  font-weight: 500;
  color: #303133;
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    flex-wrap: wrap;
  }

  .table-pagination {
    flex-direction: column;
    gap: 12px;
  }

  .pagination-left {
    width: 100%;
    justify-content: flex-start;
  }

  .column-list {
    grid-template-columns: 1fr;
  }
}
</style>
