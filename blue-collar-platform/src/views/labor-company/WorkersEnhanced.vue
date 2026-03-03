<template>
  <div class="labor-company-workers">
    <!-- 工人信息筛选 -->
    <WorkerFilter
      ref="filterRef"
      :default-expand="false"
      @filter-change="handleFilterChange"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 工人信息 -->
    <el-card class="workers-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">工人信息</span>
          <div class="header-actions">
            <el-button type="primary" :icon="Plus" @click="handleAddWorker">
              新增工人
            </el-button>
            <el-button :icon="Download" @click="handleExport">
              导出
            </el-button>
          </div>
        </div>
      </template>

      <CommonTable
        ref="tableRef"
        :data="workersList"
        :columns="tableColumns"
        table-id="labor-company-workers"
        :loading="loading"
        :total="totalWorkers"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :default-sort="defaultSort"
        @sort-change="handleSortChange"
        @global-search="handleGlobalSearch"
        @batch-action="handleBatchAction"
      >
        <template #column-name="{ row }">
          <el-link type="primary" @click="handleViewWorker(row)">
            {{ row.name }}
          </el-link>
        </template>

        <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>

        <template #column-workerStatus="{ row }">
          <el-tag :type="getWorkerStatusType(row.workerStatus)">
            {{ getWorkerStatusText(row.workerStatus) }}
          </el-tag>
        </template>

        <template #column-gender="{ row }">
          {{ getGenderText(row.gender) }}
        </template>

        <template #actions="{ row }">
          <el-button size="small" type="primary" link @click="handleViewWorker(row)">
            查看
          </el-button>
          <el-button size="small" type="success" link @click="handleEditWorker(row)">
            编辑
          </el-button>
          <el-button size="small" type="warning" link @click="handleTransfer(row)">
            调动
          </el-button>
          <el-button size="small" type="danger" link @click="handleDeleteWorker(row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 新增/编辑工人对话框 -->
    <el-dialog
      v-model="workerDialogVisible"
      :title="isEditing ? '编辑工人' : '新增工人'"
      width="800px"
      :close-on-click-modal="false"
    >
      <CommonForm
        ref="workerFormRef"
        :config="workerFormConfig"
        v-model="workerForm"
        :loading="workerFormLoading"
        @submit="handleSaveWorker"
        @reset="handleResetWorkerForm"
      >
        <template #field-department>
          <el-button @click="handleSelectDepartment">
            {{ getDepartmentText() }}
          </el-button>
        </template>

        <template #field-position>
          <el-select
            v-model="workerForm.positionId"
            placeholder="请选择岗位"
            clearable
            filterable
            :disabled="!workerForm.departmentId"
            @change="handlePositionChange"
          >
            <el-option
              v-for="position in positionOptions"
              :key="position.id"
              :label="position.name"
              :value="position.id"
            />
          </el-select>
        </template>
      </CommonForm>
    </el-dialog>

    <!-- 部门选择对话框 -->
    <el-dialog
      v-model="departmentSelectVisible"
      title="选择部门"
      width="600px"
      :close-on-click-modal="false"
    >
      <DepartmentSelect
        v-if="departmentSelectVisible"
        :multiple="false"
        @confirm="handleDepartmentSelectConfirm"
        @cancel="departmentSelectVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import CommonForm from '@/components/CommonForm.vue'
import WorkerFilter from '@/components/WorkerFilter.vue'
import DepartmentSelect from '@/components/DepartmentSelect.vue'
import type { ColumnConfig, FormConfig } from '@/types'

// 响应式数据
const filterRef = ref()
const tableRef = ref()
const workerFormRef = ref()
const loading = ref(false)
const workerFormLoading = ref(false)
const departmentSelectVisible = ref(false)
const workerDialogVisible = ref(false)
const isEditing = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalWorkers = ref(0)
const defaultSort = { prop: 'createdAt', order: 'descending' }

// 筛选条件
const filterParams = ref<any>({})

// 工人信息
const workersList = ref<any[]>([])

// 选项数据
const positionOptions = ref<any[]>([])

// 工人表单
const workerForm = reactive({
  id: '',
  name: '',
  idCard: '',
  phone: '',
  gender: '',
  education: '',
  nativePlace: '',
  departmentId: '',
  department: '',
  positionId: '',
  position: '',
  status: 'active',
  workerStatus: 'registered',
  hireDate: '',
  age: null
})

// 表格列配置
const tableColumns: ColumnConfig[] = [
  { prop: 'name', label: '姓名', width: 100, sortable: true, required: true },
  { prop: 'phone', label: '手机号', width: 120, sortable: true },
  { prop: 'gender', label: '性别', width: 80, sortable: true },
  { prop: 'age', label: '年龄', width: 80, sortable: true },
  { prop: 'education', label: '学历', width: 100, sortable: true },
  { prop: 'nativePlace', label: '籍贯', width: 120 },
  { prop: 'department', label: '部门', width: 120, sortable: true },
  { prop: 'position', label: '岗位', width: 120, sortable: true },
  { prop: 'workerStatus', label: '工人状态', width: 120, sortable: true },
  { prop: 'status', label: '在职状态', width: 100, sortable: true },
  { prop: 'hireDate', label: '入职日期', width: 120, sortable: true },
  { prop: 'createdAt', label: '创建时间', width: 180, sortable: true }
]

// 工人表单配置
const workerFormConfig: FormConfig = {
  fields: [
    {
      field: 'name',
      label: '姓名',
      type: 'TEXT',
      required: true,
      placeholder: '请输入姓名'
    },
    {
      field: 'idCard',
      label: '身份证号',
      type: 'TEXT',
      required: true,
      rules: [
        { type: 'idcard', message: '请输入正确的身份证号', trigger: 'blur' }
      ],
      placeholder: '请输入身份证号'
    },
    {
      field: 'phone',
      label: '手机号',
      type: 'TEXT',
      required: true,
      rules: [
        { type: 'phone', message: '请输入正确的手机号', trigger: 'blur' }
      ],
      placeholder: '请输入手机号'
    },
    {
      field: 'gender',
      label: '性别',
      type: 'SELECT',
      required: true,
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
    {
      field: 'age',
      label: '年龄',
      type: 'NUMBER',
      required: true,
      min: 16,
      max: 65,
      placeholder: '请输入年龄'
    },
    {
      field: 'education',
      label: '学历',
      type: 'SELECT',
      required: true,
      options: [
        { label: '初中', value: 'junior' },
        { label: '高中', value: 'high' },
        { label: '中专', value: 'secondary' },
        { label: '大专', value: 'college' },
        { label: '本科', value: 'bachelor' },
        { label: '硕士', value: 'master' },
        { label: '博士', value: 'doctor' }
      ]
    },
    {
      field: 'nativePlace',
      label: '籍贯',
      type: 'TEXT',
      placeholder: '请输入籍贯'
    },
    {
      field: 'department',
      label: '部门',
      type: 'DEPARTMENT',
      required: true,
      placeholder: '请选择部门'
    },
    {
      field: 'position',
      label: '岗位',
      type: 'SELECT',
      required: true,
      options: [],
      placeholder: '请选择岗位'
    },
    {
      field: 'workerStatus',
      label: '工人状态',
      type: 'SELECT',
      required: true,
      options: [
        { label: '注册', value: 'registered' },
        { label: '接送', value: 'pickup' },
        { label: '劳务运维人员', value: 'labor_employee' },
        { label: '工厂正式人员', value: 'factory_employee' },
        { label: '初次面试', value: 'initial_interview' },
        { label: '合同签订', value: 'contract_signed' },
        { label: '面试邀约', value: 'interview_invited' },
        { label: '工厂面试', value: 'factory_interview' },
        { label: '进厂', value: 'entered' },
        { label: '离职', value: 'resigned' }
      ]
    },
    {
      field: 'status',
      label: '在职状态',
      type: 'SELECT',
      required: true,
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' },
        { label: '待入职', value: 'pending' }
      ]
    },
    {
      field: 'hireDate',
      label: '入职日期',
      type: 'DATE',
      placeholder: '请选择入职日期'
    }
  ],
  labelWidth: '120px',
  columns: 2,
  buttonPosition: 'bottom',
  submitText: '保存',
  showReset: true,
  showSaveDraft: false
}

// 获取部门文本
const getDepartmentText = () => {
  if (workerForm.department) {
    return workerForm.department
  }
  return '请选择部门'
}

// 选择部门
const handleSelectDepartment = () => {
  departmentSelectVisible.value = true
}

// 部门选择确认
const handleDepartmentSelectConfirm = (selected: any) => {
  workerForm.department = selected.name
  workerForm.departmentId = selected.id
  workerForm.position = ''
  workerForm.positionId = ''
  positionOptions.value = []

  // 加载岗位
  loadPositions(selected.id)
  departmentSelectVisible.value = false
}

// 加载岗位
const loadPositions = async (departmentId: string) => {
  try {
    // TODO: 调用实际API
    // const response = await axios.get(`/api/departments/${departmentId}/positions`)
    // positionOptions.value = response.data

    // 模拟数据
    positionOptions.value = [
      { id: 'pos-1', name: '操作工' },
      { id: 'pos-2', name: '质检员' },
      { id: 'pos-3', name: '仓管员' }
    ]
  } catch (error) {
    ElMessage.error('加载岗位列表失败')
  }
}

// 岗位变化
const handlePositionChange = (positionId: string) => {
  const position = positionOptions.value.find(p => p.id === positionId)
  if (position) {
    workerForm.position = position.name
  }
}

// 筛选条件变化
const handleFilterChange = (filters: any) => {
  filterParams.value = filters
}

// 搜索
const handleSearch = async (filters: any) => {
  filterParams.value = filters
  currentPage.value = 1
  await fetchWorkers()
}

// 重置
const handleReset = () => {
  filterParams.value = {}
  currentPage.value = 1
  fetchWorkers()
}

// 新增工人
const handleAddWorker = () => {
  isEditing.value = false
  Object.assign(workerForm, {
    id: '',
    name: '',
    idCard: '',
    phone: '',
    gender: '',
    education: '',
    nativePlace: '',
    departmentId: '',
    department: '',
    positionId: '',
    position: '',
    status: 'active',
    workerStatus: 'registered',
    hireDate: '',
    age: null
  })
  positionOptions.value = []
  workerDialogVisible.value = true
}

// 编辑工人
const handleEditWorker = (worker: any) => {
  isEditing.value = true
  Object.assign(workerForm, worker)
  workerDialogVisible.value = true
}

// 查看工人
const handleViewWorker = (worker: any) => {
  console.log('查看工人:', worker)
  // 跳转到工人详情页
  // router.push(`/labor-company/workers/${worker.id}`)
}

// 调动工人
const handleTransfer = (worker: any) => {
  console.log('调动工人:', worker)
  // 跳转到岗位调动页面
  // router.push(`/labor-company/worker-transfer?workerId=${worker.id}`)
}

// 删除工人
const handleDeleteWorker = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该工人吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用实际API
    // await axios.delete(`/api/labor-company/workers/${id}`)

    ElMessage.success('删除成功')
    await fetchWorkers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 保存工人
const handleSaveWorker = async (data: any) => {
  workerFormLoading.value = true
  try {
    // TODO: 调用实际API
    // if (isEditing.value) {
    //   await axios.put(`/api/labor-company/workers/${data.id}`, data)
    // } else {
    //   await axios.post('/api/labor-company/workers', data)
    // }

    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success(isEditing.value ? '更新成功' : '创建成功')
    workerDialogVisible.value = false
    await fetchWorkers()
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    workerFormLoading.value = false
  }
}

// 重置工人表单
const handleResetWorkerForm = () => {
  if (!isEditing.value) {
    Object.assign(workerForm, {
      id: '',
      name: '',
      idCard: '',
      phone: '',
      gender: '',
      education: '',
      nativePlace: '',
      departmentId: '',
      department: '',
      positionId: '',
      position: '',
      status: 'active',
      workerStatus: 'registered',
      hireDate: '',
      age: null
    })
    positionOptions.value = []
  }
}

// 导出
const handleExport = async () => {
  try {
    // TODO: 调用实际API
    // const response = await axios.get('/api/labor-company/workers/export', {
    //   params: filterParams.value,
    //   responseType: 'blob'
    // })
    // 处理文件下载

    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 批量操作
const handleBatchAction = (selectedRows: any[]) => {
  console.log('批量操作:', selectedRows)
  ElMessage.info(`已选择${selectedRows.length}条记录`)
}

// 排序变化
const handleSortChange = (sort: any) => {
  console.log('排序变化:', sort)
  fetchWorkers()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  console.log('全局搜索:', keyword)
  filterParams.value.keyword = keyword
  currentPage.value = 1
  fetchWorkers()
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'active': 'success',
    'inactive': 'danger',
    'pending': 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'active': '在职',
    'inactive': '离职',
    'pending': '待入职'
  }
  return textMap[status] || status
}

// 获取工人状态类型
const getWorkerStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'registered': 'info',
    'pickup': 'warning',
    'labor_employee': 'primary',
    'factory_employee': 'success',
    'initial_interview': 'warning',
    'contract_signed': 'primary',
    'interview_invited': 'warning',
    'factory_interview': 'warning',
    'entered': 'success',
    'resigned': 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取工人状态文本
const getWorkerStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'registered': '注册',
    'pickup': '接送',
    'labor_employee': '劳务运维人员',
    'factory_employee': '工厂正式人员',
    'initial_interview': '初次面试',
    'contract_signed': '合同签订',
    'interview_invited': '面试邀约',
    'factory_interview': '工厂面试',
    'entered': '进厂',
    'resigned': '离职'
  }
  return textMap[status] || status
}

// 获取性别文本
const getGenderText = (gender: string) => {
  const textMap: Record<string, string> = {
    'male': '男',
    'female': '女'
  }
  return textMap[gender] || gender
}

// 获取工人信息
const fetchWorkers = async () => {
  loading.value = true
  try {
    // TODO: 调用实际API
    // const response = await axios.get('/api/labor-company/workers', {
    //   params: {
    //     page: currentPage.value,
    //     pageSize: pageSize.value,
    //     ...filterParams.value
    //   }
    // })
    // workersList.value = response.data.list
    // totalWorkers.value = response.data.total

    // 模拟数据
    workersList.value = [
      {
        id: '1',
        name: '张三',
        idCard: '110101199001011234',
        phone: '13800138001',
        gender: 'male',
        age: 28,
        education: 'college',
        nativePlace: '河北省',
        department: '生产部',
        departmentId: 'dept-1',
        position: '操作工',
        positionId: 'pos-1',
        workerStatus: 'entered',
        status: 'active',
        hireDate: '2025-01-15',
        createdAt: '2025-01-15 10:00:00'
      },
      {
        id: '2',
        name: '李四',
        idCard: '110101199002021234',
        phone: '13800138002',
        gender: 'female',
        age: 26,
        education: 'high',
        nativePlace: '河南省',
        department: '质检部',
        departmentId: 'dept-2',
        position: '质检员',
        positionId: 'pos-2',
        workerStatus: 'entered',
        status: 'active',
        hireDate: '2025-02-01',
        createdAt: '2025-02-01 14:30:00'
      },
      {
        id: '3',
        name: '王五',
        idCard: '110101199003031234',
        phone: '13800138003',
        gender: 'male',
        age: 30,
        education: 'secondary',
        nativePlace: '山东省',
        department: '仓储部',
        departmentId: 'dept-3',
        position: '仓管员',
        positionId: 'pos-3',
        workerStatus: 'resigned',
        status: 'inactive',
        hireDate: '2024-06-01',
        createdAt: '2024-06-01 09:00:00'
      }
    ]
    totalWorkers.value = 3
  } catch (error) {
    ElMessage.error('获取工人信息失败')
  } finally {
    loading.value = false
  }
}

// 初始化数据
onMounted(() => {
  fetchWorkers()
})
</script>

<style scoped>
.labor-company-workers {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

/* 卡片样式 */
.workers-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .labor-company-workers {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }
}
</style>
