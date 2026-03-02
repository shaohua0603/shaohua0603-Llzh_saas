<template>
  <div class="position-management">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="岗位名称">
          <el-input v-model="searchForm.name" placeholder="请输入岗位名称" clearable />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" clearable style="width: 160px">
            <el-option v-for="dept in departmentList" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增岗位
        </el-button>
      </div>

      <el-table :data="tableData" stripe border>
        <el-table-column prop="name" label="岗位名称" width="150" />
        <el-table-column prop="departmentName" label="所属部门" width="150" />
        <el-table-column prop="dataPermission" label="数据权限" width="150">
          <template #default="{ row }">
            <el-tag :type="getDataPermissionType(row.dataPermission)">
              {{ row.dataPermission }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="menuPermissionCount" label="菜单权限数" width="100" align="center" />
        <el-table-column prop="employeeCount" label="员工数量" width="100" align="center" />
        <el-table-column prop="description" label="岗位描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="岗位名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入岗位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="departmentId">
              <el-select v-model="formData.departmentId" placeholder="请选择部门" style="width: 100%">
                <el-option v-for="dept in departmentList" :key="dept.id" :label="dept.name" :value="dept.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="数据权限" prop="dataPermission">
              <el-radio-group v-model="formData.dataPermission">
                <el-radio value="ALL">全部数据</el-radio>
                <el-radio value="DEPARTMENT">本部门数据</el-radio>
                <el-radio value="DEPARTMENT_AND_BELOW">本部门及以下所属部门数据</el-radio>
                <el-radio value="SELF">本人数据权限</el-radio>
                <el-radio value="CUSTOM">自定义数据权限</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="formData.dataPermission === 'CUSTOM'">
          <el-col :span="24">
            <el-form-item label="选择部门">
              <el-tree-select
                v-model="formData.customDepartments"
                :data="departmentTreeData"
                :props="{ label: 'name', value: 'id', children: 'children' }"
                multiple
                show-checkbox
                placeholder="请选择部门"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="菜单权限">
              <el-tree
                ref="menuTreeRef"
                :data="menuTreeData"
                :props="{ label: 'name', children: 'children' }"
                show-checkbox
                node-key="id"
                :default-checked-keys="formData.menuPermissions"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="岗位描述">
              <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入岗位描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface Position {
  id: string
  name: string
  departmentId: string
  departmentName: string
  dataPermission: string
  customDepartments: string[]
  menuPermissions: string[]
  menuPermissionCount: number
  employeeCount: number
  description: string
  createTime: string
}

const searchForm = reactive({
  name: '',
  departmentId: ''
})

const tableData = ref<Position[]>([])
const departmentList = ref<any[]>([])
const departmentTreeData = ref<any[]>([])
const menuTreeData = ref<any[]>([])
const menuTreeRef = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()

const formData = reactive({
  id: '',
  name: '',
  departmentId: '',
  dataPermission: 'ALL',
  customDepartments: [] as string[],
  menuPermissions: [] as string[],
  description: ''
})

const formRules = {
  name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
}

const dataPermissionMap: Record<string, string> = {
  ALL: '全部数据',
  DEPARTMENT: '本部门数据',
  DEPARTMENT_AND_BELOW: '本部门及以下所属部门数据',
  SELF: '本人数据权限',
  CUSTOM: '自定义数据权限'
}

const getDataPermissionType = (permission: string) => {
  const typeMap: Record<string, string> = {
    ALL: 'success',
    DEPARTMENT: 'warning',
    DEPARTMENT_AND_BELOW: 'warning',
    SELF: 'info',
    CUSTOM: 'info'
  }
  return typeMap[permission] || 'info'
}

const mockPositions: Position[] = [
  { id: 'p1', name: '人事经理', departmentId: '2', departmentName: '人事部', dataPermission: 'ALL', customDepartments: [], menuPermissions: ['m1', 'm2', 'm3'], menuPermissionCount: 3, employeeCount: 1, description: '负责人事部门全面管理工作', createTime: '2020-01-15 10:00:00' },
  { id: 'p2', name: '招聘专员', departmentId: '2', departmentName: '人事部', dataPermission: 'DEPARTMENT', customDepartments: [], menuPermissions: ['m1', 'm2'], menuPermissionCount: 2, employeeCount: 2, description: '负责招聘相关工作', createTime: '2021-03-20 10:00:00' },
  { id: 'p3', name: '财务经理', departmentId: '3', departmentName: '财务部', dataPermission: 'ALL', customDepartments: [], menuPermissions: ['m4', 'm5', 'm6'], menuPermissionCount: 3, employeeCount: 1, description: '负责财务部门全面管理工作', createTime: '2019-06-10 10:00:00' },
  { id: 'p4', name: '会计', departmentId: '3', departmentName: '财务部', dataPermission: 'DEPARTMENT', customDepartments: [], menuPermissions: ['m4', 'm5'], menuPermissionCount: 2, employeeCount: 1, description: '负责会计核算工作', createTime: '2022-01-05 10:00:00' },
  { id: 'p5', name: '运营经理', departmentId: '4', departmentName: '运营部', dataPermission: 'ALL', customDepartments: [], menuPermissions: ['m7', 'm8', 'm9'], menuPermissionCount: 3, employeeCount: 1, description: '负责运营部门全面管理工作', createTime: '2020-08-15 10:00:00' },
  { id: 'p6', name: '运营专员', departmentId: '4', departmentName: '运营部', dataPermission: 'DEPARTMENT', customDepartments: [], menuPermissions: ['m7', 'm8'], menuPermissionCount: 2, employeeCount: 1, description: '负责运营相关工作', createTime: '2023-02-01 10:00:00' }
]

const mockDepartments = [
  { id: '2', name: '人事部' },
  { id: '3', name: '财务部' },
  { id: '4', name: '运营部' }
]

const mockDepartmentTree = [
  { id: '1', name: '深圳三鼎劳务公司', children: [
    { id: '2', name: '人事部', children: [
      { id: '5', name: '招聘组' },
      { id: '6', name: '培训组' }
    ]},
    { id: '3', name: '财务部' },
    { id: '4', name: '运营部' }
  ]}
]

const mockMenuTree = [
  { id: 'm1', name: '工作中心', children: [
    { id: 'm1-1', name: '待办任务' },
    { id: 'm1-2', name: '消息中心' },
    { id: 'm1-3', name: '预警信息' }
  ]},
  { id: 'm2', name: '招聘管理', children: [
    { id: 'm2-1', name: '招聘需求' },
    { id: 'm2-2', name: '简历管理' }
  ]},
  { id: 'm3', name: '面试管理', children: [
    { id: 'm3-1', name: '接送管理' },
    { id: 'm3-2', name: '初步面试' },
    { id: 'm3-3', name: '面试邀约' },
    { id: 'm3-4', name: '工厂面试' }
  ]},
  { id: 'm4', name: '工人管理', children: [
    { id: 'm4-1', name: '工人信息' }
  ]},
  { id: 'm5', name: '合同管理', children: [
    { id: 'm5-1', name: '签订合同' }
  ]},
  { id: 'm6', name: '在职管理', children: [
    { id: 'm6-1', name: '考勤管理' },
    { id: 'm6-2', name: '请假管理' },
    { id: 'm6-3', name: '调岗管理' }
  ]},
  { id: 'm7', name: '离职管理', children: [
    { id: 'm7-1', name: '离职管理' }
  ]},
  { id: 'm8', name: '结算管理', children: [
    { id: 'm8-1', name: '工作转介绍' },
    { id: 'm8-2', name: '结算管理' }
  ]},
  { id: 'm9', name: '系统管理', children: [
    { id: 'm9-1', name: '部门管理' },
    { id: 'm9-2', name: '正式员工' },
    { id: 'm9-3', name: '岗位管理' }
  ]}
]

const fetchData = () => {
  tableData.value = mockPositions.map(p => ({
    ...p,
    dataPermission: dataPermissionMap[p.dataPermission] || p.dataPermission
  }))
  departmentList.value = mockDepartments
  departmentTreeData.value = mockDepartmentTree
  menuTreeData.value = mockMenuTree
  total.value = mockPositions.length
}

const handleSearch = () => {
  let result = [...mockPositions]
  if (searchForm.name) {
    result = result.filter(p => p.name.includes(searchForm.name))
  }
  if (searchForm.departmentId) {
    result = result.filter(p => p.departmentId === searchForm.departmentId)
  }
  tableData.value = result.map(p => ({
    ...p,
    dataPermission: dataPermissionMap[p.dataPermission] || p.dataPermission
  }))
  total.value = result.length
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.departmentId = ''
  fetchData()
}

const handleAdd = () => {
  formData.id = ''
  formData.name = ''
  formData.departmentId = ''
  formData.dataPermission = 'ALL'
  formData.customDepartments = []
  formData.menuPermissions = []
  formData.description = ''
  dialogTitle.value = '新增岗位'
  dialogVisible.value = true
}

const handleView = (row: Position) => {
  ElMessage.info(`查看岗位: ${row.name}`)
}

const handleEdit = (row: Position) => {
  formData.id = row.id
  formData.name = row.name
  formData.departmentId = row.departmentId
  const originalPerm = Object.keys(dataPermissionMap).find(k => dataPermissionMap[k] === row.dataPermission) || 'ALL'
  formData.dataPermission = originalPerm
  formData.customDepartments = []
  formData.menuPermissions = row.menuPermissions
  formData.description = row.description
  dialogTitle.value = '编辑岗位'
  dialogVisible.value = true
}

const handleDelete = (row: Position) => {
  ElMessageBox.confirm(`确定要删除岗位"${row.name}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const checkedKeys = menuTreeRef.value?.getCheckedKeys() || []
  formData.menuPermissions = checkedKeys as string[]

  ElMessage.success(formData.id ? '编辑成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.position-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-card .toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
