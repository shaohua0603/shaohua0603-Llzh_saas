<template>
  <div class="person-select-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索姓名、手机号"
        prefix-icon="Search"
        clearable
        @input="handleSearch"
      />
      <el-select
        v-if="source !== 'all'"
        v-model="filterType"
        placeholder="人员类型"
        clearable
        @change="handleSearch"
      >
        <el-option label="工人" value="worker" />
        <el-option label="正式员工" value="employee" />
      </el-select>
    </div>

    <!-- 人员列表 -->
    <div class="person-list">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="filteredPersonList"
        :max-height="400"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选列 -->
        <el-table-column
          v-if="multiple"
          type="selection"
          width="55"
          :reserve-selection="true"
        />

        <!-- 单选列 -->
        <el-table-column
          v-if="!multiple"
          width="55"
          align="center"
        >
          <template #default="scope">
            <el-radio
              v-model="selectedPersonId"
              :label="scope.row.id"
              @change="handleRadioSelect(scope.row)"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>

        <!-- 序号列 -->
        <el-table-column
          type="index"
          label="序号"
          width="60"
        />

        <!-- 动态列 -->
        <el-table-column
          v-for="column in displayColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
        >
          <template #default="scope">
            <span v-if="column.formatter">
              {{ column.formatter(scope.row[column.prop], scope.row) }}
            </span>
            <span v-else>
              {{ scope.row[column.prop] }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :layout="'total, sizes, prev, pager, next, jumper'"
          :total="total"
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
        :disabled="!hasSelection"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableInstance } from 'element-plus'

// Props定义
interface Props {
  /** 人员来源 */
  source?: 'worker' | 'employee' | 'all'
  /** 是否多选 */
  multiple?: boolean
  /** 显示字段 */
  displayFields?: string[]
  /** 返回字段 */
  returnFields?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  source: 'all',
  multiple: false,
  displayFields: () => ['name', 'phone', 'department'],
  returnFields: () => ['id', 'name', 'phone', 'department']
})

// Emits定义
const emit = defineEmits<{
  'confirm': [selected: any]
  'cancel': []
}>()

// 响应式数据
const tableRef = ref<TableInstance>()
const loading = ref(false)
const searchKeyword = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const personList = ref<any[]>([])
const selectedRows = ref<any[]>([])
const selectedPersonId = ref<string>('')

// 显示列配置
const displayColumns = computed(() => {
  const columns: any[] = []

  if (props.displayFields.includes('name')) {
    columns.push({
      prop: 'name',
      label: '姓名',
      minWidth: 100
    })
  }

  if (props.displayFields.includes('phone')) {
    columns.push({
      prop: 'phone',
      label: '手机号',
      width: 120
    })
  }

  if (props.displayFields.includes('department')) {
    columns.push({
      prop: 'department',
      label: '部门',
      minWidth: 120
    })
  }

  if (props.displayFields.includes('position')) {
    columns.push({
      prop: 'position',
      label: '岗位',
      minWidth: 120
    })
  }

  if (props.displayFields.includes('type')) {
    columns.push({
      prop: 'type',
      label: '类型',
      width: 80,
      formatter: (value: any) => {
        return value === 'worker' ? '工人' : '员工'
      }
    })
  }

  return columns
})

// 过滤后的人员列表
const filteredPersonList = computed(() => {
  let list = personList.value

  // 按来源过滤
  if (props.source !== 'all') {
    list = list.filter(person => person.type === props.source)
  }

  // 按类型过滤
  if (filterType.value) {
    list = list.filter(person => person.type === filterType.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(person =>
      person.name?.toLowerCase().includes(keyword) ||
      person.phone?.includes(keyword)
    )
  }

  return list
})

// 是否有选中项
const hasSelection = computed(() => {
  if (props.multiple) {
    return selectedRows.value.length > 0
  } else {
    return !!selectedPersonId.value
  }
})

// 加载人员列表
const loadPersonList = async () => {
  loading.value = true
  try {
    // TODO: 调用实际API
    // 模拟数据
    const mockData = generateMockData()
    personList.value = mockData
    total.value = mockData.length
  } catch (error) {
    ElMessage.error('加载人员列表失败')
  } finally {
    loading.value = false
  }
}

// 生成模拟数据
const generateMockData = () => {
  const data = []
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: `person-${i}`,
      name: `人员${i}`,
      phone: `138${String(i).padStart(8, '0')}`,
      department: `部门${Math.ceil(i / 10)}`,
      position: `岗位${i % 5 + 1}`,
      type: i % 2 === 0 ? 'worker' : 'employee'
    })
  }
  return data
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 处理单选
const handleRadioSelect = (row: any) => {
  selectedRows.value = [row]
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 处理当前页变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
}

// 处理确认
const handleConfirm = () => {
  if (!hasSelection.value) {
    ElMessage.warning('请选择人员')
    return
  }

  let selected: any
  if (props.multiple) {
    selected = selectedRows.value.map(row => {
      const result: any = {}
      props.returnFields.forEach(field => {
        result[field] = row[field]
      })
      return result
    })
  } else {
    const row = selectedRows.value[0]
    selected = {}
    props.returnFields.forEach(field => {
      selected[field] = row[field]
    })
  }

  emit('confirm', selected)
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 暴露方法
defineExpose({
  loadPersonList
})

// 生命周期
onMounted(() => {
  loadPersonList()
})
</script>

<style scoped>
.person-select-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 搜索区域 */
.search-area {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-area .el-input {
  flex: 1;
}

.search-area .el-select {
  width: 150px;
}

/* 人员列表 */
.person-list {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .search-area {
    flex-direction: column;
  }

  .search-area .el-select {
    width: 100%;
  }

  .dialog-footer {
    flex-direction: column;
  }

  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>
