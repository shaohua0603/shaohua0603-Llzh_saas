<template>
  <div class="employee-management">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" clearable style="width: 160px">
            <el-option v-for="dept in departmentList" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="searchForm.positionId" placeholder="请选择岗位" clearable style="width: 160px">
            <el-option v-for="pos in positionList" :key="pos.id" :label="pos.name" :value="pos.id" />
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
          新增员工
        </el-button>
        <el-button>
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>

      <el-table :data="tableData" stripe border>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="departmentName" label="部门" width="150" />
        <el-table-column prop="positionName" label="岗位" width="120" />
        <el-table-column prop="isDepartmentLeader" label="部门负责人" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isDepartmentLeader ? 'success' : 'info'">
              {{ row.isDepartmentLeader ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="leaderName" label="直属领导" width="100" />
        <el-table-column prop="hireDate" label="入职时间" width="120" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'

// 路由
const router = useRouter()

interface Employee {
  id: string
  name: string
  phone: string
  email: string
  address: string
  departmentId: string
  departmentName: string
  positionId: string
  positionName: string
  isDepartmentLeader: boolean
  leaderId: string
  leaderName: string
  hireDate: string
  leaveDate: string | null
  status: string
}

const searchForm = reactive({
  name: '',
  phone: '',
  departmentId: '',
  positionId: ''
})

const tableData = ref<Employee[]>([])
const departmentList = ref<any[]>([])
const positionList = ref<any[]>([])
const employeeOptions = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟数据
const mockEmployees: Employee[] = [
  { id: 'e1', name: '张三', phone: '13800138000', email: 'zhangsan@example.com', address: '深圳市南山区', departmentId: '2', departmentName: '人事部', positionId: 'p1', positionName: '人事经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2020-01-15', leaveDate: null, status: '在职' },
  { id: 'e2', name: '李四', phone: '13800138001', email: 'lisi@example.com', address: '深圳市福田区', departmentId: '2', departmentName: '人事部', positionId: 'p2', positionName: '招聘专员', isDepartmentLeader: false, leaderId: 'e1', leaderName: '张三', hireDate: '2021-03-20', leaveDate: null, status: '在职' },
  { id: 'e3', name: '王五', phone: '13800138002', email: 'wangwu@example.com', address: '深圳市宝安区', departmentId: '3', departmentName: '财务部', positionId: 'p3', positionName: '财务经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2019-06-10', leaveDate: null, status: '在职' },
  { id: 'e4', name: '赵六', phone: '13800138003', email: 'zhaoliu@example.com', address: '深圳市龙岗区', departmentId: '3', departmentName: '财务部', positionId: 'p4', positionName: '会计', isDepartmentLeader: false, leaderId: 'e3', leaderName: '王五', hireDate: '2022-01-05', leaveDate: null, status: '在职' },
  { id: 'e5', name: '钱七', phone: '13800138004', email: 'qianqi@example.com', address: '深圳市罗湖区', departmentId: '4', departmentName: '运营部', positionId: 'p5', positionName: '运营经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2020-08-15', leaveDate: null, status: '在职' },
  { id: 'e6', name: '孙八', phone: '13800138005', email: 'sunba@example.com', address: '深圳市光明区', departmentId: '4', departmentName: '运营部', positionId: 'p6', positionName: '运营专员', isDepartmentLeader: false, leaderId: 'e5', leaderName: '钱七', hireDate: '2023-02-01', leaveDate: null, status: '在职' },
  { id: 'e7', name: '周九', phone: '13800138006', email: 'zhoujiu@example.com', address: '深圳市坪山区', departmentId: '2', departmentName: '人事部', positionId: 'p7', positionName: '培训专员', isDepartmentLeader: false, leaderId: 'e1', leaderName: '张三', hireDate: '2023-05-10', leaveDate: null, status: '在职' }
]

const mockDepartments = [
  { id: '2', name: '人事部' },
  { id: '3', name: '财务部' },
  { id: '4', name: '运营部' },
  { id: '5', name: '招聘组' },
  { id: '6', name: '培训组' }
]

const mockPositions = [
  { id: 'p1', name: '人事经理' },
  { id: 'p2', name: '招聘专员' },
  { id: 'p3', name: '财务经理' },
  { id: 'p4', name: '会计' },
  { id: 'p5', name: '运营经理' },
  { id: 'p6', name: '运营专员' },
  { id: 'p7', name: '培训专员' }
]

const fetchData = () => {
  tableData.value = mockEmployees
  departmentList.value = mockDepartments
  positionList.value = mockPositions
  employeeOptions.value = mockEmployees.map(e => ({ id: e.id, name: e.name }))
  total.value = mockEmployees.length
}

const handleSearch = () => {
  let result = [...mockEmployees]
  if (searchForm.name) {
    result = result.filter(e => e.name.includes(searchForm.name))
  }
  if (searchForm.phone) {
    result = result.filter(e => e.phone.includes(searchForm.phone))
  }
  if (searchForm.departmentId) {
    result = result.filter(e => e.departmentId === searchForm.departmentId)
  }
  if (searchForm.positionId) {
    result = result.filter(e => e.positionId === searchForm.positionId)
  }
  tableData.value = result
  total.value = result.length
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.departmentId = ''
  searchForm.positionId = ''
  fetchData()
}

const handleAdd = () => {
  // 跳转到新增页面
  router.push({ name: 'TenantEmployeeAdd' })
}

const handleView = (row: Employee) => {
  // 跳转到详情页面
  router.push({
    name: 'TenantEmployeeDetail',
    params: { id: row.id }
  })
}

const handleEdit = (row: Employee) => {
  // 跳转到编辑页面
  router.push({
    name: 'TenantEmployeeEdit',
    params: { id: row.id }
  })
}

const handleDelete = (row: Employee) => {
  ElMessageBox.confirm(`确定要删除员工"${row.name}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
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
.employee-management {
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
