<!-- 异常管理页面 -->
<template>
  <div class="abnormal-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :showToolbar="true"
      :showSelection="false"
      :showIndex="true"
      :showActions="false"
      @sort-change="handleSortChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar-right>
        <el-button type="primary" @click="handleConfig">
          <el-icon><Setting /></el-icon>
          异常规则配置
        </el-button>
      </template>
      <template #column-abnormalName="{ row }">
        <el-tag type="warning">{{ row.abnormalName }}</el-tag>
      </template>
    </CommonTable>

    <!-- 异常规则配置弹窗 -->
    <el-dialog v-model="configVisible" title="异常规则配置" width="600px">
      <el-form ref="configFormRef" :model="configForm" :rules="configRules" label-width="140px">
        <el-form-item label="异常检查周期" prop="checkPeriod">
          <el-select v-model="configForm.checkPeriod" placeholder="请选择检查周期" style="width: 100%">
            <el-option label="每月" value="month" />
            <el-option label="每周" value="week" />
            <el-option label="每天" value="day" />
          </el-select>
        </el-form-item>
        <el-form-item label="请假次数阈值" prop="leaveThreshold">
          <el-input-number v-model="configForm.leaveThreshold" :min="1" :max="30" style="width: 100%" />
          <div class="form-tip">超过此次数将触发异常</div>
        </el-form-item>
        <el-form-item label="惩罚次数阈值" prop="punishmentThreshold">
          <el-input-number v-model="configForm.punishmentThreshold" :min="1" :max="30" style="width: 100%" />
          <div class="form-tip">超过此次数将触发异常</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfigSubmit" :loading="configLoading">保存配置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'

// 类型定义
interface AbnormalRecord {
  id: string
  workerName: string
  phone: string
  abnormalName: string
  count: number
}

// 表格列配置
const columns = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 130, sortable: true },
  { prop: 'abnormalName', label: '异常名称', minWidth: 200 },
  { prop: 'count', label: '次数', minWidth: 100, sortable: true }
]

// 响应式数据
const tableData = ref<AbnormalRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const configVisible = ref(false)
const configLoading = ref(false)

const searchForm = reactive({
  workerName: '',
  phone: ''
})

const configForm = reactive({
  checkPeriod: 'month',
  leaveThreshold: 3,
  punishmentThreshold: 2
})

const configFormRef = ref<FormInstance>()

const configRules: FormRules = {
  checkPeriod: [{ required: true, message: '请选择检查周期', trigger: 'change' }],
  leaveThreshold: [{ required: true, message: '请输入请假次数阈值', trigger: 'blur' }],
  punishmentThreshold: [{ required: true, message: '请输入惩罚次数阈值', trigger: 'blur' }]
}

// Mock数据
const mockData: AbnormalRecord[] = [
  {
    id: '1',
    workerName: '张三',
    phone: '13800138001',
    abnormalName: '请假次数超3次',
    count: 5
  },
  {
    id: '2',
    workerName: '李四',
    phone: '13800138002',
    abnormalName: '惩罚次数超2次',
    count: 3
  },
  {
    id: '3',
    workerName: '王五',
    phone: '13800138003',
    abnormalName: '请假次数超3次',
    count: 4
  },
  {
    id: '4',
    workerName: '赵六',
    phone: '13800138004',
    abnormalName: '惩罚次数超2次',
    count: 4
  },
  {
    id: '5',
    workerName: '钱七',
    phone: '13800138005',
    abnormalName: '请假次数超3次',
    count: 6
  },
  {
    id: '6',
    workerName: '孙八',
    phone: '13800138006',
    abnormalName: '惩罚次数超2次',
    count: 3
  }
]

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let filteredData = [...mockData]

    // 筛选
    if (searchForm.workerName) {
      filteredData = filteredData.filter(item => item.workerName.includes(searchForm.workerName))
    }
    if (searchForm.phone) {
      filteredData = filteredData.filter(item => item.phone.includes(searchForm.phone))
    }

    total.value = filteredData.length
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filteredData.slice(start, start + pageSize.value)
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.workerName = ''
  searchForm.phone = ''
  handleSearch()
}

// 打开配置弹窗
const handleConfig = () => {
  configVisible.value = true
}

// 提交配置
const handleConfigSubmit = async () => {
  if (!configFormRef.value) return
  await configFormRef.value.validate((valid) => {
    if (valid) {
      configLoading.value = true
      setTimeout(() => {
        ElMessage.success('异常规则配置保存成功')
        configLoading.value = false
        configVisible.value = false
      }, 500)
    }
  })
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 分页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.abnormal-page {
  padding: 20px;
}

.search-filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>
