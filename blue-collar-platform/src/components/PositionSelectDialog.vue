<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择岗位"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 查询条件 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="岗位名称">
        <el-input
          v-model="queryForm.name"
          placeholder="请输入岗位名称"
          clearable
          style="width: 200px"
        />
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

    <!-- 岗位列表 -->
    <el-table
      ref="tableRef"
      :data="positionList"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      height="400"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="岗位名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="department" label="所属部门" width="150" />
      <el-table-column prop="description" label="岗位描述" min-width="200" show-overflow-tooltip />
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="!selectedPosition">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

// 定义Props
interface Props {
  modelValue: boolean
  factoryId?: string // 工厂ID，用于过滤岗位
}

// 定义Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', position: PositionInfo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 对话框可见性
const dialogVisible = ref(false)

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
  if (newVal && props.factoryId) {
    loadPositionList()
  }
})

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听factoryId变化
watch(() => props.factoryId, () => {
  if (dialogVisible.value && props.factoryId) {
    loadPositionList()
  }
})

// 查询表单
const queryForm = ref({
  name: ''
})

// 岗位列表
const positionList = ref<PositionInfo[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 选中的岗位
const selectedPosition = ref<PositionInfo | null>(null)

// 表格引用
const tableRef = ref()

// 岗位信息接口
interface PositionInfo {
  id: string
  name: string
  department: string
  description: string
  factoryId: string // 所属工厂ID
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadPositionList()
}

// 重置
const handleReset = () => {
  queryForm.value = {
    name: ''
  }
  currentPage.value = 1
  loadPositionList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadPositionList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadPositionList()
}

// 选中行变化
const handleCurrentChange = (row: PositionInfo | null) => {
  selectedPosition.value = row
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  selectedPosition.value = null
  tableRef.value?.setCurrentRow()
}

// 确认选择
const handleConfirm = () => {
  if (!selectedPosition.value) {
    ElMessage.warning('请选择岗位')
    return
  }
  emit('confirm', selectedPosition.value)
  handleClose()
}

// 加载岗位列表
const loadPositionList = async () => {
  if (!props.factoryId) {
    ElMessage.warning('请先选择工厂')
    return
  }
  
  try {
    // 模拟API调用
    // const response = await getPositionList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   factoryId: props.factoryId,
    //   name: queryForm.value.name
    // })
    // positionList.value = response.data.list
    // total.value = response.data.total

    // Mock数据
    const allPositions = [
      {
        id: 'pos1',
        name: '操作工',
        department: '生产部',
        description: '负责生产线操作',
        factoryId: 'factory1'
      },
      {
        id: 'pos2',
        name: '质检员',
        department: '质量部',
        description: '负责产品质量检测',
        factoryId: 'factory1'
      },
      {
        id: 'pos3',
        name: '仓库管理员',
        department: '物流部',
        description: '负责仓库管理',
        factoryId: 'factory1'
      },
      {
        id: 'pos4',
        name: '流水线工人',
        department: '生产部',
        description: '负责流水线作业',
        factoryId: 'factory2'
      },
      {
        id: 'pos5',
        name: '包装工',
        department: '包装部',
        description: '负责产品包装',
        factoryId: 'factory2'
      },
      {
        id: 'pos6',
        name: '搬运工',
        department: '物流部',
        description: '负责货物搬运',
        factoryId: 'factory3'
      }
    ]
    
    // 过滤出指定工厂的岗位
    let filteredPositions = allPositions.filter(item => item.factoryId === props.factoryId)
    
    // 按岗位名称搜索
    if (queryForm.value.name) {
      filteredPositions = filteredPositions.filter(item => 
        item.name.includes(queryForm.value.name)
      )
    }
    
    positionList.value = filteredPositions
    total.value = filteredPositions.length
  } catch (error) {
    ElMessage.error('获取岗位列表失败')
    console.error('API调用错误:', error)
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

:deep(.el-table__body tr.current-row > td) {
  background-color: #ecf5ff !important;
}
</style>