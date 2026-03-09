<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择工厂"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 查询条件 -->
    <el-form :model="queryForm" inline>
      <el-form-item label="工厂名称">
        <el-input
          v-model="queryForm.name"
          placeholder="请输入工厂名称"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="组织机构代码">
        <el-input
          v-model="queryForm.socialCreditCode"
          placeholder="请输入组织机构代码"
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

    <!-- 工厂列表 -->
    <el-table
      ref="tableRef"
      :data="factoryList"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      height="400"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="工厂名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="socialCreditCode" label="组织机构代码" width="200" />
      <el-table-column prop="contactPerson" label="对接人" width="120" />
      <el-table-column prop="contactPhone" label="对接人手机号" width="150" />
      <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
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
      <el-button type="primary" @click="handleConfirm" :disabled="!selectedFactory">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

// 定义Props
interface Props {
  modelValue: boolean
}

// 定义Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', factory: FactoryInfo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 对话框可见性
const dialogVisible = ref(false)

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    loadFactoryList()
  }
})

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 查询表单
const queryForm = ref({
  name: '',
  socialCreditCode: ''
})

// 工厂列表
const factoryList = ref<FactoryInfo[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 选中的工厂
const selectedFactory = ref<FactoryInfo | null>(null)

// 表格引用
const tableRef = ref()

// 工厂信息接口
interface FactoryInfo {
  id: string
  name: string
  socialCreditCode: string
  contactPerson: string
  contactPhone: string
  address: string
  type: string // 租户类型：工厂或劳务公司
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadFactoryList()
}

// 重置
const handleReset = () => {
  queryForm.value = {
    name: '',
    socialCreditCode: ''
  }
  currentPage.value = 1
  loadFactoryList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadFactoryList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadFactoryList()
}

// 选中行变化
const handleCurrentChange = (row: FactoryInfo | null) => {
  selectedFactory.value = row
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  selectedFactory.value = null
  tableRef.value?.setCurrentRow()
}

// 确认选择
const handleConfirm = () => {
  if (!selectedFactory.value) {
    ElMessage.warning('请选择工厂')
    return
  }
  emit('confirm', selectedFactory.value)
  handleClose()
}

// 加载工厂列表
const loadFactoryList = async () => {
  try {
    // 模拟API调用
    // const response = await getFactoryList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   name: queryForm.value.name,
    //   socialCreditCode: queryForm.value.socialCreditCode
    // })
    // 过滤出工厂类型的租户
    // factoryList.value = response.data.list.filter(item => item.type === '工厂')
    // total.value = factoryList.value.length

    // Mock数据
    const allTenants = [
      {
        id: 'factory1',
        name: '东莞长安工业区',
        socialCreditCode: '91440300MA5DXXXXXX',
        contactPerson: '张三',
        contactPhone: '13800138000',
        address: '广东省东莞市长安镇工业区',
        type: '工厂'
      },
      {
        id: 'factory2',
        name: '东莞厚街工业区',
        socialCreditCode: '91440300MA5DYYYYYY',
        contactPerson: '李四',
        contactPhone: '13900139000',
        address: '广东省东莞市厚街镇工业区',
        type: '工厂'
      },
      {
        id: 'factory3',
        name: '东莞虎门工业区',
        socialCreditCode: '91440300MA5DZZZZZZ',
        contactPerson: '王五',
        contactPhone: '13700137000',
        address: '广东省东莞市虎门镇工业区',
        type: '工厂'
      },
      {
        id: 'labor1',
        name: '南通富民劳务服务有限公司',
        socialCreditCode: '91320600MA12345678',
        contactPerson: '赵六',
        contactPhone: '13600136000',
        address: '江苏省南通市崇川区',
        type: '劳务公司'
      }
    ]
    
    // 过滤出工厂类型的租户
    factoryList.value = allTenants.filter(item => item.type === '工厂')
    total.value = factoryList.value.length
  } catch (error) {
    ElMessage.error('获取工厂列表失败')
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
