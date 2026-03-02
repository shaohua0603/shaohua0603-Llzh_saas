<template>
  <div class="role-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索岗位名称"
        prefix-icon="Search"
        clearable
        style="width: 300px; margin-right: 16px"
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleAdd">
        新增岗位
      </el-button>
    </div>

    <!-- 岗位列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="岗位名称" min-width="150" />
      <el-table-column prop="departmentName" label="所属部门" min-width="150" show-overflow-tooltip />
      <el-table-column prop="dataPermissionName" label="数据权限" width="180" />
      <el-table-column prop="menuPermissionCount" label="菜单权限数量" width="130" />
      <el-table-column prop="employeeCount" label="员工数量" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
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
      width="900px"
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
            <el-form-item label="岗位名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入岗位名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="departmentId">
              <DepartmentSelect
                v-model="formData.departmentId"
                placeholder="请选择所属部门"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="数据权限" prop="dataPermission">
          <el-radio-group v-model="formData.dataPermission">
            <el-radio value="ALL">全部数据</el-radio>
            <el-radio value="DEPARTMENT">本部门数据</el-radio>
            <el-radio value="DEPARTMENT_AND_BELOW">本部门及以下所属部门数据</el-radio>
            <el-radio value="SELF">本人数据权限</el-radio>
            <el-radio value="CUSTOM">自定义数据权限</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 自定义数据权限 -->
        <el-form-item v-if="formData.dataPermission === 'CUSTOM'" label="选择部门" prop="customDepartments">
          <el-tree-select
            v-model="formData.customDepartments"
            :data="departmentTree"
            :props="treeProps"
            multiple
            :render-after-expand="false"
            placeholder="请选择部门"
            style="width: 100%"
          />
        </el-form-item>
        
        <!-- 菜单权限 -->
        <el-form-item label="菜单权限" prop="menuPermissions">
          <div class="menu-permission-container">
            <el-tree
              ref="menuTreeRef"
              :data="menuTreeData"
              :props="treeProps"
              show-checkbox
              node-key="id"
              :default-checked-keys="formData.menuPermissions"
              @check="handleMenuCheck"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <span>{{ data.name }}</span>
                  <span v-if="data.children && data.children.length > 0" class="permission-badges">
                    <el-tag size="small" type="info">{{ data.children.length }}个子模块</el-tag>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DepartmentSelect from '@/components/DepartmentSelect.vue'

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
const menuTreeRef = ref()

// 树形选择器配置
const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children'
}

// 数据权限选项
const dataPermissionOptions = [
  { value: 'ALL', label: '全部数据' },
  { value: 'DEPARTMENT', label: '本部门数据' },
  { value: 'DEPARTMENT_AND_BELOW', label: '本部门及以下所属部门数据' },
  { value: 'SELF', label: '本人数据权限' },
  { value: 'CUSTOM', label: '自定义数据权限' }
]

// 部门树形数据
const departmentTree = ref([
  {
    id: '1',
    name: '蓝领智汇总部',
    children: [
      {
        id: '1-1',
        name: '技术研发部',
        children: [
          { id: '1-1-1', name: '前端开发组' },
          { id: '1-1-2', name: '后端开发组' }
        ]
      },
      { id: '1-2', name: '人力资源部' },
      { id: '1-3', name: '财务部' }
    ]
  }
])

// 菜单权限树形数据
const menuTreeData = ref([
  {
    id: '1',
    name: '工作中心',
    children: [
      { id: '1-1', name: '待办任务' },
      { id: '1-2', name: '消息中心' },
      { id: '1-3', name: '预警信息' }
    ]
  },
  {
    id: '2',
    name: '招聘管理',
    children: [
      { id: '2-1', name: '招聘需求' },
      { id: '2-2', name: '简历管理' }
    ]
  },
  {
    id: '3',
    name: '面试管理',
    children: [
      { id: '3-1', name: '接送管理' },
      { id: '3-2', name: '初步面试' },
      { id: '3-3', name: '面试邀约' },
      { id: '3-4', name: '工厂面试' }
    ]
  },
  {
    id: '4',
    name: '工人管理',
    children: [
      { id: '4-1', name: '工人信息' }
    ]
  },
  {
    id: '5',
    name: '合同管理',
    children: [
      { id: '5-1', name: '签订合同' }
    ]
  },
  {
    id: '6',
    name: '在职管理',
    children: [
      { id: '6-1', name: '工作与生活' },
      { id: '6-2', name: '管理与关怀' },
      { id: '6-3', name: '特殊情况' },
      { id: '6-4', name: '保险管理' },
      { id: '6-5', name: '考勤管理' },
      { id: '6-6', name: '请假管理' },
      { id: '6-7', name: '调岗管理' },
      { id: '6-8', name: '奖惩管理' },
      { id: '6-9', name: '业务课堂' },
      { id: '6-10', name: '异常管理' },
      { id: '6-11', name: '投诉/建议' }
    ]
  },
  {
    id: '7',
    name: '离职管理',
    children: [
      { id: '7-1', name: '离职管理' }
    ]
  },
  {
    id: '8',
    name: '结算管理',
    children: [
      { id: '8-1', name: '工作转介绍' },
      { id: '8-2', name: '结算管理' }
    ]
  },
  {
    id: '9',
    name: '系统管理',
    children: [
      { id: '9-1', name: '企业介绍' },
      { id: '9-2', name: '部门管理' },
      { id: '9-3', name: '正式员工' },
      { id: '9-4', name: '岗位管理' },
      { id: '9-5', name: '规则配置' },
      { id: '9-6', name: '菜单配置' },
      { id: '9-7', name: '字典管理' },
      { id: '9-8', name: '系统参数' },
      { id: '9-9', name: '流程管理' },
      { id: '9-10', name: '流程配置' },
      { id: '9-11', name: '附件管理' },
      { id: '9-12', name: '打印管理' }
    ]
  }
])

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  departmentId: '',
  departmentName: '',
  dataPermission: 'SELF',
  customDepartments: [] as string[],
  menuPermissions: [] as string[]
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ]
}

// 获取数据权限名称
const getDataPermissionName = (code: string) => {
  const option = dataPermissionOptions.find(item => item.value === code)
  return option ? option.label : code
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
        name: '系统管理员',
        departmentId: '1',
        departmentName: '技术研发部',
        dataPermission: 'ALL',
        dataPermissionName: '全部数据',
        menuPermissionCount: 12,
        employeeCount: 2,
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        name: '人事专员',
        departmentId: '1-2',
        departmentName: '人力资源部',
        dataPermission: 'DEPARTMENT',
        dataPermissionName: '本部门数据',
        menuPermissionCount: 8,
        employeeCount: 3,
        createTime: '2024-01-15 10:00:00'
      },
      {
        id: '3',
        name: '招聘专员',
        departmentId: '1-2',
        departmentName: '人力资源部',
        dataPermission: 'DEPARTMENT_AND_BELOW',
        dataPermissionName: '本部门及以下所属部门数据',
        menuPermissionCount: 6,
        employeeCount: 5,
        createTime: '2024-02-01 10:00:00'
      },
      {
        id: '4',
        name: '财务专员',
        departmentId: '1-3',
        departmentName: '财务部',
        dataPermission: 'DEPARTMENT',
        dataPermissionName: '本部门数据',
        menuPermissionCount: 4,
        employeeCount: 2,
        createTime: '2024-02-15 10:00:00'
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
  dialogTitle.value = '新增岗位'
  Object.assign(formData, {
    id: '',
    name: '',
    departmentId: '',
    departmentName: '',
    dataPermission: 'SELF',
    customDepartments: [],
    menuPermissions: []
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑岗位'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    departmentId: row.departmentId,
    departmentName: row.departmentName,
    dataPermission: row.dataPermission,
    customDepartments: row.customDepartments || [],
    menuPermissions: row.menuPermissions || []
  })
  dialogVisible.value = true
  
  // 设置菜单权限选中状态
  setTimeout(() => {
    if (menuTreeRef.value && formData.menuPermissions.length > 0) {
      menuTreeRef.value.setCheckedKeys(formData.menuPermissions)
    }
  }, 100)
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除岗位"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

// 菜单权限选择变化
const handleMenuCheck = (data: any, checked: any) => {
  const checkedKeys = checked.checkedKeys
  const halfCheckedKeys = checked.halfCheckedKeys
  formData.menuPermissions = [...checkedKeys, ...halfCheckedKeys]
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
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([])
  }
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
.role-container {
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

.menu-permission-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.permission-badges {
  margin-left: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .role-container {
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
  
  :deep(.el-radio) {
    display: block;
    margin-bottom: 8px;
  }
}
</style>
