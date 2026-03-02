<template>
  <div class="process-config-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索业务名称"
        prefix-icon="Search"
        clearable
        style="width: 300px; margin-right: 16px"
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleAdd">
        新增配置
      </el-button>
    </div>

    <!-- 配置列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="businessCode" label="业务代码" width="200" />
      <el-table-column prop="businessName" label="业务名称" min-width="200" />
      <el-table-column prop="flowName" label="流程名称" min-width="180" />
      <el-table-column prop="flowType" label="流程类型" width="150">
        <template #default="scope">
          <el-tag :type="getFlowTypeTag(scope.row.flowType)" size="small">
            {{ scope.row.flowTypeName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'info'" size="small">
            {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" link @click.stop="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button
            size="small"
            :type="scope.row.status === 'enabled' ? 'warning' : 'success'"
            link
            @click.stop="handleToggleStatus(scope.row)"
          >
            {{ scope.row.status === 'enabled' ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="danger" link @click.stop="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="业务代码" prop="businessCode">
          <el-select
            v-model="formData.businessCode"
            placeholder="请选择业务代码"
            style="width: 100%"
            filterable
            @change="handleBusinessCodeChange"
          >
            <el-option
              v-for="business in businessList"
              :key="business.code"
              :label="`${business.name} (${business.code})`"
              :value="business.code"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="业务名称" prop="businessName">
          <el-input
            v-model="formData.businessName"
            placeholder="业务名称"
            readonly
          />
        </el-form-item>
        
        <el-form-item label="流程名称" prop="flowId">
          <el-select
            v-model="formData.flowId"
            placeholder="请选择流程"
            style="width: 100%"
            filterable
            @change="handleFlowChange"
          >
            <el-option
              v-for="flow in flowList"
              :key="flow.id"
              :label="flow.name"
              :value="flow.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-value="enabled"
            inactive-value="disabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

// 业务列表
const businessList = ref<any[]>([
  { code: 'LEAVE', name: '请假管理' },
  { code: 'TRANSFER', name: '调岗管理' },
  { code: 'RESIGNATION', name: '离职管理' },
  { code: 'REGISTRATION', name: '报名管理' },
  { code: 'WORKER_ENTRY', name: '工人入职' },
  { code: 'CONTRACT_SIGN', name: '合同签订' }
])

// 流程列表
const flowList = ref<any[]>([
  { id: '1', name: '请假审批流程', type: 'LEAVE' },
  { id: '2', name: '调岗审批流程', type: 'TRANSFER' },
  { id: '3', name: '离职审批流程', type: 'RESIGNATION' },
  { id: '4', name: '报名审批流程', type: 'REGISTRATION' }
])

// 流程类型名称映射
const flowTypeNameMap: Record<string, string> = {
  LEAVE: '请假审批',
  TRANSFER: '调岗审批',
  RESIGNATION: '离职审批',
  REGISTRATION: '报名审批'
}

// 表单数据
const formData = reactive({
  id: '',
  businessCode: '',
  businessName: '',
  flowId: '',
  flowName: '',
  flowType: '',
  flowTypeName: '',
  status: 'disabled'
})

// 表单验证规则
const formRules = {
  businessCode: [
    { required: true, message: '请选择业务代码', trigger: 'change' }
  ],
  flowId: [
    { required: true, message: '请选择流程', trigger: 'change' }
  ]
}

// 获取流程类型标签
const getFlowTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    LEAVE: 'primary',
    TRANSFER: 'success',
    RESIGNATION: 'warning',
    REGISTRATION: 'info'
  }
  return tags[type] || 'info'
}

// 业务代码变化
const handleBusinessCodeChange = (code: string) => {
  const business = businessList.value.find(b => b.code === code)
  if (business) {
    formData.businessName = business.name
  }
}

// 流程变化
const handleFlowChange = (flowId: string) => {
  const flow = flowList.value.find(f => f.id === flowId)
  if (flow) {
    formData.flowName = flow.name
    formData.flowType = flow.type
    formData.flowTypeName = flowTypeNameMap[flow.type] || flow.type
  }
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: '1',
        businessCode: 'LEAVE',
        businessName: '请假管理',
        flowId: '1',
        flowName: '请假审批流程',
        flowType: 'LEAVE',
        flowTypeName: '请假审批',
        status: 'enabled',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        businessCode: 'TRANSFER',
        businessName: '调岗管理',
        flowId: '2',
        flowName: '调岗审批流程',
        flowType: 'TRANSFER',
        flowTypeName: '调岗审批',
        status: 'enabled',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '3',
        businessCode: 'RESIGNATION',
        businessName: '离职管理',
        flowId: '3',
        flowName: '离职审批流程',
        flowType: 'RESIGNATION',
        flowTypeName: '离职审批',
        status: 'enabled',
        createTime: '2024-01-01 10:00:00'
      }
    ]
    total.value = 3
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增流程配置'
  Object.assign(formData, {
    id: '',
    businessCode: '',
    businessName: '',
    flowId: '',
    flowName: '',
    flowType: '',
    flowTypeName: '',
    status: 'disabled'
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑流程配置'
  Object.assign(formData, {
    id: row.id,
    businessCode: row.businessCode,
    businessName: row.businessName,
    flowId: row.flowId,
    flowName: row.flowName,
    flowType: row.flowType,
    flowTypeName: row.flowTypeName,
    status: row.status
  })
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  const action = newStatus === 'enabled' ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定要${action}该流程配置吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success(`${action}成功`)
    fetchData()
  } catch {
    // 用户取消
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除该流程配置吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('保存成功')
        dialogVisible.value = false
        fetchData()
      } finally {
        submitting.value = false
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.process-config-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .process-config-container {
    padding: 16px;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toolbar > * {
    margin-bottom: 12px;
    margin-right: 0 !important;
  }
  
  :deep(.el-input) {
    width: 100% !important;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>
