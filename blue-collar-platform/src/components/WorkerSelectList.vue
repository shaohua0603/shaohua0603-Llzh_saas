<template>
  <div class="worker-select-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索姓名、手机号、工号"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select
        v-model="filterType"
        placeholder="人员类型"
        clearable
        @change="handleSearch"
      >
        <el-option label="所有工人" value="" />
        <el-option label="在职工人" value="active" />
        <el-option label="离职工人" value="inactive" />
      </el-select>
    </div>

    <!-- 工人列表 -->
    <div class="worker-list">
      <div class="table-container">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="workerList"
          :max-height="400"
          row-key="id"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
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
                v-model="selectedWorkerId"
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

          <!-- 固定列 -->
          <el-table-column prop="name" label="姓名" min-width="120" />
          <el-table-column prop="workerId" label="工号" min-width="100" />
          <el-table-column prop="idCard" label="证件号" min-width="200">
            <template #default="scope">
              {{ scope.row.idCard ? scope.row.idCard.replace(/(\d{6})(\d{8})(\d{4})/, '$1********$3') : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="120">
            <template #default="scope">
              {{ scope.row.phone ? scope.row.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别" min-width="80">
            <template #default="scope">
              {{ scope.row.gender === 'male' ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="age" label="年龄" min-width="80" />
        </el-table>
      </div>

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
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'

// Props定义
interface Props {
  /** 是否多选 */
  multiple?: boolean
  /** 显示字段 */
  displayFields?: string[]
  /** 返回字段 */
  returnFields?: string[]
  /** 是否可见 */
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  displayFields: () => ['name', 'workerId', 'idCard', 'phone', 'gender', 'age'],
  returnFields: () => ['id', 'name', 'workerId', 'idCard', 'phone', 'gender', 'age'],
  visible: false
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
const workerList = ref<any[]>([])
const selectedRows = ref<any[]>([])
const selectedWorkerId = ref<string>('')

// 显示列配置
const displayColumns = computed(() => {
  const columns: any[] = []

  if (props.displayFields.includes('name')) {
    columns.push({
      prop: 'name',
      label: '姓名',
      minWidth: 120
    })
  }

  if (props.displayFields.includes('workerId')) {
    columns.push({
      prop: 'workerId',
      label: '工号',
      minWidth: 100
    })
  }

  if (props.displayFields.includes('idCard')) {
    columns.push({
      prop: 'idCard',
      label: '证件号',
      minWidth: 200,
      formatter: (value: string) => {
        if (!value) return ''
        return value.replace(/(\d{6})(\d{8})(\d{4})/, '$1********$3')
      }
    })
  }

  if (props.displayFields.includes('phone')) {
    columns.push({
      prop: 'phone',
      label: '手机号',
      minWidth: 120,
      formatter: (value: string) => {
        if (!value) return ''
        return value.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
      }
    })
  }

  if (props.displayFields.includes('gender')) {
    columns.push({
      prop: 'gender',
      label: '性别',
      minWidth: 80,
      formatter: (value: string) => {
        return value === 'male' ? '男' : '女'
      }
    })
  }

  if (props.displayFields.includes('age')) {
    columns.push({
      prop: 'age',
      label: '年龄',
      minWidth: 80
    })
  }

  if (props.displayFields.includes('status')) {
    columns.push({
      prop: 'status',
      label: '状态',
      width: 100,
      formatter: (value: string) => {
        const statusMap = {
          active: '在职',
          inactive: '离职'
        }
        return statusMap[value] || value
      }
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

  return columns
})

// 过滤后的工人列表
const filteredWorkerList = computed(() => {
  let list = workerList.value
  console.log('原始工人列表长度:', workerList.value.length)

  // 按状态过滤
  if (filterType.value) {
    list = list.filter(worker => worker.status === filterType.value)
    console.log('按状态过滤后长度:', list.length)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(worker =>
      worker.name?.toLowerCase().includes(keyword) ||
      worker.phone?.includes(keyword) ||
      worker.workerId?.includes(keyword) ||
      worker.idCard?.includes(keyword)
    )
    console.log('按关键词搜索后长度:', list.length)
  }

  console.log('最终过滤后列表长度:', list.length)
  return list
})

// 是否有选中项
const hasSelection = computed(() => {
  if (props.multiple) {
    return selectedRows.value.length > 0
  } else {
    return !!selectedWorkerId.value
  }
})

// 加载工人列表
const loadWorkerList = async () => {
  console.log('开始加载工人列表...')
  loading.value = true
  try {
    // TODO: 调用实际API
    // 模拟数据
    const mockData = generateMockData()
    console.log('生成的模拟数据:', mockData.length, '条')
    workerList.value = mockData
    total.value = mockData.length
    console.log('工人列表更新完成，总数:', total.value)
  } catch (error) {
    console.error('加载工人列表失败:', error)
    ElMessage.error('加载工人列表失败')
  } finally {
    loading.value = false
    console.log('加载完成，loading:', loading.value)
  }
}

// 生成模拟数据
const generateMockData = () => {
  console.log('开始生成模拟数据...')
  const data = []
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const departments = ['生产部', '质检部', '物流部', '行政部', '财务部']
  const positions = ['普工', '技工', '主管', '经理', '助理']
  
  for (let i = 1; i <= 50; i++) {
    const age = 18 + Math.floor(Math.random() * 30)
    const gender = i % 2 === 0 ? 'male' : 'female'
    const status = i % 5 === 0 ? 'inactive' : 'active'
    
    data.push({
      id: `worker-${i}`,
      name: names[i % names.length] + (i > names.length ? i : ''),
      workerId: `W${String(i).padStart(5, '0')}`,
      idCard: `11010${String(i).padStart(10, '0')}${Math.floor(Math.random() * 10)}`,
      phone: `138${String(i).padStart(8, '0')}`,
      gender,
      age,
      status,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)]
    })
  }
  console.log('模拟数据生成完成，共', data.length, '条')
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

// 处理行点击
const handleRowClick = (row: any) => {
  if (props.multiple) {
    // 多选模式：切换选中状态
    const isSelected = selectedRows.value.some(item => item.id === row.id)
    if (isSelected) {
      // 取消选中
      selectedRows.value = selectedRows.value.filter(item => item.id !== row.id)
      if (tableRef.value) {
        tableRef.value.toggleRowSelection(row, false)
      }
    } else {
      // 选中
      selectedRows.value.push(row)
      if (tableRef.value) {
        tableRef.value.toggleRowSelection(row, true)
      }
    }
  } else {
    // 单选模式：直接选中
    selectedWorkerId.value = row.id
    selectedRows.value = [row]
  }
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
    ElMessage.warning('请选择工人')
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
  loadWorkerList
})

// 生命周期
onMounted(() => {
  console.log('WorkerSelectList mounted, loading data...')
  loadWorkerList()
  // 强制生成数据
  if (workerList.value.length === 0) {
    console.log('WorkerList is empty, forcing data generation...')
    const mockData = generateMockData()
    workerList.value = mockData
    total.value = mockData.length
    console.log('Forced data generation completed, total:', total.value)
  }
})

// 监听对话框显示状态
watch(() => props.visible, (newValue) => {
  if (newValue) {
    console.log('WorkerSelectList visible, loading data...')
    loadWorkerList()
  }
}, { immediate: true })
</script>

<style scoped>
.worker-select-container {
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

/* 工人列表 */
.worker-list {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-container {
  overflow-x: auto;
}

.table-container :deep(.el-table) {
  min-width: 800px;
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