<!-- 调岗管理页面 -->
<template>
  <div class="transfer-page">
    <!-- 搜索筛选区域 -->
    <div class="search-filter-section">
      <el-form inline :model="searchForm" class="search-form">
        <el-form-item label="工人姓名">
          <el-input v-model="searchForm.workerName" placeholder="请输入工人姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.approvalStatus" placeholder="请选择" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="未审核" value="pending" />
            <el-option label="审核中" value="processing" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="期望调岗日期">
          <el-date-picker
            v-model="searchForm.transferDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
        <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :show-toolbar="true"
      :show-selection="true"
      :show-index="true"
      :show-actions="true"
      action-column-width="280"
      table-id="transfer-table"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #column-approvalStatus="{ row }">
        <el-tag :type="getApprovalStatusTag(row.approvalStatus)">
          {{ getApprovalStatusText(row.approvalStatus) }}
        </el-tag>
      </template>
      <template #column-approvalRecords="{ row }">
        <el-button link type="primary" size="small" @click="viewApprovalRecords(row)">
          查看记录 ({{ row.approvalRecords?.length || 0 }})
        </el-button>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)" :disabled="row.approvalStatus !== 'pending'">编辑</el-button>
        <el-button link type="success" size="small" @click="handleSubmitApproval(row)" :disabled="row.approvalStatus !== 'pending'">提交审批</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)" :disabled="row.approvalStatus !== 'pending'">删除</el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工人姓名" prop="workerName">
              <el-input v-model="formData.workerName" placeholder="请输入工人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="期望调岗日期" prop="expectedTransferDate">
              <el-date-picker
                v-model="formData.expectedTransferDate"
                type="date"
                placeholder="选择期望调岗日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">原岗位信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="原部门" prop="originalDepartment">
              <el-input v-model="formData.originalDepartment" placeholder="请输入原部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原岗位" prop="originalPosition">
              <el-input v-model="formData.originalPosition" placeholder="请输入原岗位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="原岗位直属领导" prop="originalLeader">
              <el-input v-model="formData.originalLeader" placeholder="请输入原岗位直属领导" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">目标岗位信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="目标部门" prop="targetDepartment">
              <el-input v-model="formData.targetDepartment" placeholder="请输入目标部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标岗位" prop="targetPosition">
              <el-input v-model="formData.targetPosition" placeholder="请输入目标岗位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="目标岗位直属组长" prop="targetLeader">
              <el-input v-model="formData.targetLeader" placeholder="请输入目标岗位直属组长" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="调岗原因" prop="transferReason">
          <el-input v-model="formData.transferReason" type="textarea" :rows="4" placeholder="请输入调岗原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'

// 路由
const router = useRouter()

// 类型定义
interface TransferRecord {
  id: string
  workerName: string
  phone: string
  expectedTransferDate: string
  originalDepartment: string
  originalPosition: string
  originalLeader: string
  targetDepartment: string
  targetPosition: string
  targetLeader: string
  transferReason: string
  approvalStatus: 'pending' | 'processing' | 'approved' | 'rejected'
  approvalRecords: ApprovalRecord[]
}

interface ApprovalRecord {
  approver: string
  approvalTime: string
  approvalResult: 'approved' | 'rejected'
  approvalComment: string
}

// 表格列配置
const columns = [
  { prop: 'workerName', label: '姓名', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'expectedTransferDate', label: '期望调岗日期', minWidth: 140, sortable: true },
  { prop: 'originalDepartment', label: '原部门', minWidth: 120 },
  { prop: 'originalPosition', label: '原岗位', minWidth: 100 },
  { prop: 'originalLeader', label: '原岗位直属领导', minWidth: 130 },
  { prop: 'targetDepartment', label: '目标部门', minWidth: 120 },
  { prop: 'targetPosition', label: '目标岗位', minWidth: 100 },
  { prop: 'targetLeader', label: '目标岗位直属组长', minWidth: 130 },
  { prop: 'transferReason', label: '调岗原因', minWidth: 150, showTooltip: true },
  { prop: 'approvalStatus', label: '审核状态', minWidth: 100, sortable: true },
  { prop: 'approvalRecords', label: '审核记录', minWidth: 100 }
]

// 响应式数据
const tableData = ref<TransferRecord[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<TransferRecord[]>([])
const dialogVisible = ref(false)
const submitLoading = ref(false)
const dialogTitle = ref('新增调岗')

const searchForm = reactive({
  workerName: '',
  phone: '',
  approvalStatus: '',
  transferDate: [] as string[]
})

const formData = reactive<TransferRecord>({
  id: '',
  workerName: '',
  phone: '',
  expectedTransferDate: '',
  originalDepartment: '',
  originalPosition: '',
  originalLeader: '',
  targetDepartment: '',
  targetPosition: '',
  targetLeader: '',
  transferReason: '',
  approvalStatus: 'pending',
  approvalRecords: []
})

const formRef = ref<FormInstance>()

const formRules: FormRules = {
  workerName: [{ required: true, message: '请输入工人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  expectedTransferDate: [{ required: true, message: '请选择期望调岗日期', trigger: 'change' }],
  originalDepartment: [{ required: true, message: '请输入原部门', trigger: 'blur' }],
  originalPosition: [{ required: true, message: '请输入原岗位', trigger: 'blur' }],
  targetDepartment: [{ required: true, message: '请输入目标部门', trigger: 'blur' }],
  targetPosition: [{ required: true, message: '请输入目标岗位', trigger: 'blur' }],
  transferReason: [{ required: true, message: '请输入调岗原因', trigger: 'blur' }]
}

// Mock数据
const mockData: TransferRecord[] = [
  {
    id: '1',
    workerName: '张三',
    phone: '13800138001',
    expectedTransferDate: '2024-03-01',
    originalDepartment: '生产部',
    originalPosition: '操作工',
    originalLeader: '李主管',
    targetDepartment: '质检部',
    targetPosition: '质检员',
    targetLeader: '王组长',
    transferReason: '个人发展需求',
    approvalStatus: 'pending',
    approvalRecords: []
  },
  {
    id: '2',
    workerName: '李四',
    phone: '13800138002',
    expectedTransferDate: '2024-02-15',
    originalDepartment: '包装部',
    originalPosition: '包装工',
    originalLeader: '赵主管',
    targetDepartment: '仓储部',
    targetPosition: '仓管员',
    targetLeader: '钱组长',
    transferReason: '工作表现优秀',
    approvalStatus: 'approved',
    approvalRecords: [
      { approver: '管理员', approvalTime: '2024-02-10 10:00:00', approvalResult: 'approved', approvalComment: '同意调岗' }
    ]
  },
  {
    id: '3',
    workerName: '王五',
    phone: '13800138003',
    expectedTransferDate: '2024-02-20',
    originalDepartment: '组装部',
    originalPosition: '组装工',
    originalLeader: '孙主管',
    targetDepartment: '设备部',
    targetPosition: '设备维护',
    targetLeader: '周组长',
    transferReason: '技能匹配',
    approvalStatus: 'processing',
    approvalRecords: [
      { approver: '管理员', approvalTime: '2024-02-18 09:00:00', approvalResult: 'approved', approvalComment: '初审通过' }
    ]
  },
  {
    id: '4',
    workerName: '赵六',
    phone: '13800138004',
    expectedTransferDate: '2024-03-05',
    originalDepartment: '生产部',
    originalPosition: '操作工',
    originalLeader: '李主管',
    targetDepartment: '物流部',
    targetPosition: '配送员',
    targetLeader: '吴组长',
    transferReason: '个人原因',
    approvalStatus: 'rejected',
    approvalRecords: [
      { approver: '管理员', approvalTime: '2024-02-12 14:00:00', approvalResult: 'rejected', approvalComment: '该部门暂无空缺' }
    ]
  }
]

// 获取审核状态标签类型
const getApprovalStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

// 获取审核状态文本
const getApprovalStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return map[status] || status
}

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
    if (searchForm.approvalStatus) {
      filteredData = filteredData.filter(item => item.approvalStatus === searchForm.approvalStatus)
    }
    if (searchForm.transferDate?.length === 2) {
      filteredData = filteredData.filter(item => {
        return item.expectedTransferDate >= searchForm.transferDate[0] &&
               item.expectedTransferDate <= searchForm.transferDate[1]
      })
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
  searchForm.approvalStatus = ''
  searchForm.transferDate = []
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增调岗'
  Object.assign(formData, {
    id: '',
    workerName: '',
    phone: '',
    expectedTransferDate: '',
    originalDepartment: '',
    originalPosition: '',
    originalLeader: '',
    targetDepartment: '',
    targetPosition: '',
    targetLeader: '',
    transferReason: '',
    approvalStatus: 'pending',
    approvalRecords: []
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: TransferRecord) => {
  dialogTitle.value = '编辑调岗'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 详情
const handleDetail = (row: TransferRecord) => {
  router.push(`/labor-company/on-duty/transfer-detail?id=${row.id}`)
}

// 删除
const handleDelete = (row: TransferRecord) => {
  ElMessageBox.confirm('确定要删除该调岗记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData.splice(index, 1)
      ElMessage.success('删除成功')
      loadData()
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedRows.value.map(item => item.id)
    ids.forEach(id => {
      const index = mockData.findIndex(item => item.id === id)
      if (index > -1) {
        mockData.splice(index, 1)
      }
    })
    ElMessage.success('批量删除成功')
    loadData()
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        if (formData.id) {
          // 编辑
          const index = mockData.findIndex(item => item.id === formData.id)
          if (index > -1) {
            mockData[index] = { ...formData }
          }
          ElMessage.success('编辑成功')
        } else {
          // 新增
          mockData.unshift({
            ...formData,
            id: Date.now().toString()
          })
          ElMessage.success('新增成功')
        }
        submitLoading.value = false
        dialogVisible.value = false
        loadData()
      }, 500)
    }
  })
}

// 提交审批
const handleSubmitApproval = async (row: TransferRecord) => {
  try {
    await ElMessageBox.confirm('确定要提交审批吗？提交后将进入审批流程。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 更新状态
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData[index].approvalStatus = 'processing'
      ElMessage.success('提交审批成功')
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('提交审批失败:', error)
      ElMessage.error('提交审批失败')
    }
  }
}

// 查看审核记录
const viewApprovalRecords = (row: TransferRecord) => {
  // 跳转到详情页面查看审批记录
  router.push(`/labor-company/on-duty/transfer-detail?id=${row.id}`)
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  console.log('sort:', sort)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: TransferRecord[]) => {
  selectedRows.value = selection
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
.transfer-page {
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

.approval-records {
  margin-top: 20px;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
}
</style>
