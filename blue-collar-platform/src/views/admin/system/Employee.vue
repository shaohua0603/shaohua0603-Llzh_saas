<template>
  <div class="employee-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索姓名或手机号"
        prefix-icon="Search"
        clearable
        style="width: 300px; margin-right: 16px"
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleAdd">
        新增员工
      </el-button>
    </div>

    <!-- 员工列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="email" label="邮箱" width="200" show-overflow-tooltip />
      <el-table-column prop="departmentName" label="部门" min-width="150" show-overflow-tooltip />
      <el-table-column prop="roleName" label="岗位" width="120" />
      <el-table-column prop="isDepartmentLeader" label="部门负责人" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.isDepartmentLeader ? 'success' : 'info'" size="small">
            {{ scope.row.isDepartmentLeader ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="leaderName" label="直属领导" width="100" />
      <el-table-column prop="entryDate" label="入职时间" width="120" />
      <el-table-column prop="leaveDate" label="离职时间" width="120">
        <template #default="scope">
          {{ scope.row.leaveDate || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === '在职' ? 'success' : 'info'" size="small">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" link @click.stop="handleEdit(scope.row)">
            编辑
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
      width="700px"
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入姓名"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入手机号"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formData.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId">
              <el-select
                v-model="formData.departmentId"
                placeholder="请选择部门"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="dept in departmentList"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="岗位" prop="roleId">
              <el-select
                v-model="formData.roleId"
                placeholder="请选择岗位"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="role in roleList"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="直属领导" prop="leaderId">
              <el-select
                v-model="formData.leaderId"
                placeholder="请选择直属领导"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="leader in leaderList"
                  :key="leader.id"
                  :label="leader.name"
                  :value="leader.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入职时间" prop="entryDate">
              <el-date-picker
                v-model="formData.entryDate"
                type="date"
                placeholder="请选择入职时间"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职时间" prop="leaveDate">
              <el-date-picker
                v-model="formData.leaveDate"
                type="date"
                placeholder="请选择离职时间"
                value-format="YYYY-MM-DD"
                style="width: 100%"
                :disabled="formData.status === '在职'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="联系地址" prop="address">
          <el-input
            v-model="formData.address"
            placeholder="请输入联系地址"
            maxlength="200"
          />
        </el-form-item>
        
        <el-form-item label="是否部门负责人" prop="isDepartmentLeader">
          <el-switch
            v-model="formData.isDepartmentLeader"
            active-text="是"
            inactive-text="否"
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

// 岗位列表
const roleList = ref<any[]>([
  { id: '1', name: '管理员' },
  { id: '2', name: '人事专员' },
  { id: '3', name: '招聘专员' },
  { id: '4', name: '财务专员' },
  { id: '5', name: '运营经理' }
])

// 部门列表
const departmentList = ref<any[]>([
  { id: '1', name: '技术研发部' },
  { id: '1-1', name: '前端开发组' },
  { id: '1-2', name: '后端开发组' },
  { id: '2', name: '人力资源部' },
  { id: '3', name: '财务部' },
  { id: '4', name: '运营部' },
  { id: '5', name: '市场部' }
])

// 领导列表
const leaderList = ref<any[]>([
  { id: '1', name: '张三' },
  { id: '4', name: '赵六' }
])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  phone: '',
  email: '',
  departmentId: '',
  departmentName: '',
  roleId: '',
  roleName: '',
  isDepartmentLeader: false,
  leaderId: '',
  leaderName: '',
  entryDate: '',
  leaveDate: '',
  address: '',
  status: '在职'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  roleId: [
    { required: true, message: '请选择岗位', trigger: 'change' }
  ],
  entryDate: [
    { required: true, message: '请选择入职时间', trigger: 'change' }
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
        name: '张三',
        phone: '13800138000',
        email: 'zhangsan@company.com',
        departmentId: '1',
        departmentName: '技术研发部',
        roleId: '1',
        roleName: '管理员',
        isDepartmentLeader: true,
        leaderId: '',
        leaderName: '-',
        entryDate: '2023-01-15',
        leaveDate: '',
        address: '北京市朝阳区建国路88号',
        status: '在职'
      },
      {
        id: '2',
        name: '李四',
        phone: '13800138001',
        email: 'lisi@company.com',
        departmentId: '1-1',
        departmentName: '前端开发组',
        roleId: '2',
        roleName: '人事专员',
        isDepartmentLeader: false,
        leaderId: '1',
        leaderName: '张三',
        entryDate: '2023-03-20',
        leaveDate: '',
        address: '北京市海淀区中关村大街1号',
        status: '在职'
      },
      {
        id: '3',
        name: '王五',
        phone: '13800138002',
        email: 'wangwu@company.com',
        departmentId: '1-2',
        departmentName: '后端开发组',
        roleId: '3',
        roleName: '招聘专员',
        isDepartmentLeader: false,
        leaderId: '1',
        leaderName: '张三',
        entryDate: '2023-05-10',
        leaveDate: '',
        address: '北京市西城区金融街1号',
        status: '在职'
      },
      {
        id: '4',
        name: '赵六',
        phone: '13800138003',
        email: 'zhaoliu@company.com',
        departmentId: '2',
        departmentName: '人力资源部',
        roleId: '4',
        roleName: '财务专员',
        isDepartmentLeader: true,
        leaderId: '',
        leaderName: '-',
        entryDate: '2022-11-01',
        leaveDate: '2024-01-31',
        address: '北京市东城区王府井大街138号',
        status: '离职'
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
  dialogTitle.value = '新增员工'
  Object.assign(formData, {
    id: '',
    name: '',
    phone: '',
    email: '',
    departmentId: '',
    departmentName: '',
    roleId: '',
    roleName: '',
    isDepartmentLeader: false,
    leaderId: '',
    leaderName: '',
    entryDate: '',
    leaveDate: '',
    address: '',
    status: '在职'
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑员工'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    departmentId: row.departmentId,
    departmentName: row.departmentName,
    roleId: row.roleId,
    roleName: row.roleName,
    isDepartmentLeader: row.isDepartmentLeader,
    leaderId: row.leaderId,
    leaderName: row.leaderName,
    entryDate: row.entryDate,
    leaveDate: row.leaveDate,
    address: row.address,
    status: row.status
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除员工"${row.name}"吗？`, '提示', {
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
        // 获取部门名称
        const department = tableData.value.find(d => d.id === formData.departmentId || d.departmentId === formData.departmentId)
        if (department) {
          formData.departmentName = department.departmentName || department.name
        }
        
        // 获取岗位名称
        const role = roleList.value.find(r => r.id === formData.roleId)
        if (role) {
          formData.roleName = role.name
        }
        
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
.employee-container {
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
  .employee-container {
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
