<template>
  <div class="process-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索流程名称"
        prefix-icon="Search"
        clearable
        style="width: 300px; margin-right: 16px"
        @input="handleSearch"
      />
      <el-select
        v-model="flowTypeFilter"
        placeholder="流程类型"
        clearable
        style="width: 180px; margin-right: 16px"
        @change="handleSearch"
      >
        <el-option label="全部" value="" />
        <el-option label="请假审批" value="LEAVE" />
        <el-option label="调岗审批" value="TRANSFER" />
        <el-option label="离职审批" value="RESIGNATION" />
        <el-option label="报名审批" value="REGISTRATION" />
      </el-select>
      <el-button type="primary" @click="handleAdd">
        新增流程
      </el-button>
    </div>

    <!-- 流程列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="流程名称" min-width="180" />
      <el-table-column prop="typeName" label="流程类型" width="150" />
      <el-table-column prop="description" label="流程描述" min-width="250" show-overflow-tooltip />
      <el-table-column prop="nodeCount" label="审批节点" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'info'" size="small">
            {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" link @click.stop="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="primary" link @click.stop="handleConfigNode(scope.row)">
            配置节点
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
        <el-form-item label="流程名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入流程名称"
            maxlength="50"
          />
        </el-form-item>
        
        <el-form-item label="流程类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择流程类型"
            style="width: 100%"
          >
            <el-option label="请假审批" value="LEAVE" />
            <el-option label="调岗审批" value="TRANSFER" />
            <el-option label="离职审批" value="RESIGNATION" />
            <el-option label="报名审批" value="REGISTRATION" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="流程描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入流程描述"
            maxlength="500"
          />
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

    <!-- 节点配置对话框 -->
    <el-dialog
      v-model="nodeDialogVisible"
      title="配置审批节点"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="node-config-header">
        <el-button type="primary" size="small" @click="handleAddNode">
          添加节点
        </el-button>
      </div>
      
      <el-table
        :data="nodeList"
        border
        stripe
        style="width: 100%; margin-top: 12px"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="nodeName" label="节点名称" min-width="150">
          <template #default="scope, index">
            <el-input
              v-if="scope.row.editing"
              v-model="scope.row.nodeName"
              size="small"
              placeholder="节点名称"
            />
            <span v-else>{{ scope.row.nodeName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nodeType" label="节点类型" width="120">
          <template #default="scope, index">
            <el-select
              v-if="scope.row.editing"
              v-model="scope.row.nodeType"
              size="small"
              style="width: 100px"
            >
              <el-option label="审批人" value="approval" />
              <el-option label="抄送人" value="cc" />
            </el-select>
            <el-tag v-else :type="scope.row.nodeType === 'approval' ? 'primary' : 'info'" size="small">
              {{ scope.row.nodeType === 'approval' ? '审批人' : '抄送人' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approverName" label="审批人" width="200">
          <template #default="scope, index">
            <div v-if="scope.row.editing" class="approver-select">
              <PersonSelect
                v-model="scope.row.approverId"
                :source="'employee'"
                placeholder="选择审批人"
                :display-fields="['name', 'phone']"
                clearable
                style="width: 100%"
              />
            </div>
            <span v-else>{{ scope.row.approverName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approvalMode" label="审批方式" width="120">
          <template #default="scope, index">
            <el-select
              v-if="scope.row.editing"
              v-model="scope.row.approvalMode"
              size="small"
              style="width: 80px"
            >
              <el-option label="或签" value="or" />
              <el-option label="会签" value="and" />
            </el-select>
            <el-tag v-else :type="scope.row.approvalMode === 'or' ? 'warning' : 'success'" size="small">
              {{ scope.row.approvalMode === 'or' ? '或签' : '会签' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope, index">
            <template v-if="scope.row.editing">
              <el-button size="small" type="success" link @click="handleSaveNode(scope.row)">
                保存
              </el-button>
              <el-button size="small" link @click="handleCancelNode(scope.row, index)">
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button size="small" type="primary" link @click="handleEditNode(scope.row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" link @click="handleDeleteNode(scope.row, index)">
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <el-button @click="nodeDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PersonSelect from '@/components/PersonSelect.vue'

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const flowTypeFilter = ref('')

// 对话框
const dialogVisible = ref(false)
const nodeDialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

// 当前操作的流程ID
const currentFlowId = ref('')
const nodeList = ref<any[]>([])

// 流程类型名称映射
const typeNameMap: Record<string, string> = {
  LEAVE: '请假审批',
  TRANSFER: '调岗审批',
  RESIGNATION: '离职审批',
  REGISTRATION: '报名审批'
}

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  type: '',
  typeName: '',
  description: '',
  status: 'disabled'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入流程名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择流程类型', trigger: 'change' }
  ]
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
        name: '请假审批流程',
        type: 'LEAVE',
        typeName: '请假审批',
        description: '员工请假申请审批流程',
        nodeCount: 2,
        status: 'enabled',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        name: '调岗审批流程',
        type: 'TRANSFER',
        typeName: '调岗审批',
        description: '员工调岗申请审批流程',
        nodeCount: 3,
        status: 'enabled',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '3',
        name: '离职审批流程',
        type: 'RESIGNATION',
        typeName: '离职审批',
        description: '员工离职申请审批流程',
        nodeCount: 2,
        status: 'enabled',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '4',
        name: '报名审批流程',
        type: 'REGISTRATION',
        typeName: '报名审批',
        description: '活动报名申请审批流程',
        nodeCount: 1,
        status: 'disabled',
        createTime: '2024-01-01 10:00:00'
      }
    ]
    total.value = 4
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
  dialogTitle.value = '新增流程'
  Object.assign(formData, {
    id: '',
    name: '',
    type: '',
    typeName: '',
    description: '',
    status: 'disabled'
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑流程'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    type: row.type,
    typeName: row.typeName,
    description: row.description,
    status: row.status
  })
  dialogVisible.value = true
}

// 配置节点
const handleConfigNode = (row: any) => {
  currentFlowId.value = row.id
  // 模拟节点数据
  if (row.type === 'LEAVE') {
    nodeList.value = [
      { id: '1', nodeName: '部门负责人审批', nodeType: 'approval', approverId: '1', approverName: '张三', approvalMode: 'or', editing: false },
      { id: '2', nodeName: '人事审批', nodeType: 'approval', approverId: '2', approverName: '李四', approvalMode: 'or', editing: false }
    ]
  } else if (row.type === 'TRANSFER') {
    nodeList.value = [
      { id: '1', nodeName: '调出部门负责人审批', nodeType: 'approval', approverId: '1', approverName: '张三', approvalMode: 'or', editing: false },
      { id: '2', nodeName: '调入部门负责人审批', nodeType: 'approval', approverId: '2', approverName: '李四', approvalMode: 'or', editing: false },
      { id: '3', nodeName: '人事备案', nodeType: 'cc', approverId: '3', approverName: '王五', approvalMode: 'or', editing: false }
    ]
  } else if (row.type === 'RESIGNATION') {
    nodeList.value = [
      { id: '1', nodeName: '部门负责人审批', nodeType: 'approval', approverId: '1', approverName: '张三', approvalMode: 'or', editing: false },
      { id: '2', nodeName: '人事审批', nodeType: 'approval', approverId: '2', approverName: '李四', approvalMode: 'or', editing: false }
    ]
  } else {
    nodeList.value = [
      { id: '1', nodeName: '活动负责人审批', nodeType: 'approval', approverId: '1', approverName: '张三', approvalMode: 'or', editing: false }
    ]
  }
  nodeDialogVisible.value = true
}

// 添加节点
const handleAddNode = () => {
  nodeList.value.push({
    id: '',
    nodeName: '',
    nodeType: 'approval',
    approverId: '',
    approverName: '',
    approvalMode: 'or',
    editing: true,
    isNew: true
  })
}

// 编辑节点
const handleEditNode = (row: any) => {
  row.editing = true
  row.isNew = false
}

// 保存节点
const handleSaveNode = (row: any) => {
  if (!row.nodeName) {
    ElMessage.warning('请输入节点名称')
    return
  }
  if (!row.approverId) {
    ElMessage.warning('请选择审批人')
    return
  }
  row.editing = false
  row.isNew = false
  ElMessage.success('保存成功')
}

// 取消编辑节点
const handleCancelNode = (row: any, index: number) => {
  if (row.isNew) {
    nodeList.value.splice(index, 1)
  } else {
    row.editing = false
  }
}

// 删除节点
const handleDeleteNode = async (row: any, index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该节点吗？', '提示', {
      type: 'warning'
    })
    nodeList.value.splice(index, 1)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 切换状态
const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  const action = newStatus === 'enabled' ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定要${action}流程"${row.name}"吗？`, '提示', {
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
    await ElMessageBox.confirm(`确定要删除流程"${row.name}"吗？`, '提示', {
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
        // 设置类型名称
        formData.typeName = typeNameMap[formData.type] || formData.type
        
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
.process-container {
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

.node-config-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .process-container {
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
