<template>
  <div class="labor-company-workers">
    <h2 class="page-title">工人管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-input
        v-model="searchQuery"
        placeholder="搜索工人姓名或身份证号"
        prefix-icon="Search"
        style="width: 300px; margin-right: 16px"
      />
      <el-select
        v-model="statusFilter"
        placeholder="筛选状态"
        style="width: 150px; margin-right: 16px"
      >
        <el-option label="全部" value="" />
        <el-option label="在职" value="active" />
        <el-option label="离职" value="inactive" />
        <el-option label="待入职" value="pending" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAddWorker">添加工人</el-button>
    </div>
    
    <!-- 工人列表 -->
    <el-table :data="workersList" style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="idCard" label="身份证号" width="180" />
      <el-table-column prop="phone" label="手机号" width="150" />
      <el-table-column prop="department" label="部门" width="120" />
      <el-table-column prop="position" label="职位" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="hireDate" label="入职日期" width="150" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleViewWorker(scope.row)">
            查看
          </el-button>
          <el-button size="small" type="success" @click="handleEditWorker(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteWorker(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination" style="margin-top: 16px">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalWorkers"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 添加/编辑工人对话框 -->
    <el-dialog
      v-model="workerDialogVisible"
      :title="isEditing ? '编辑工人' : '添加工人'"
      width="500px"
    >
      <el-form :model="workerForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="workerForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="workerForm.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="workerForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="workerForm.department" placeholder="请选择部门">
            <el-option label="生产部" value="production" />
            <el-option label="质检部" value="quality" />
            <el-option label="物流部" value="logistics" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="workerForm.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="workerForm.status" placeholder="请选择状态">
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
            <el-option label="待入职" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="workerForm.hireDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="workerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveWorker">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalWorkers = ref(0)

// 工人列表
const workersList = ref<any[]>([])

// 对话框
const workerDialogVisible = ref(false)
const isEditing = ref(false)

// 工人表单
const workerForm = ref({
  id: '',
  name: '',
  idCard: '',
  phone: '',
  department: '',
  position: '',
  status: 'active',
  hireDate: ''
})

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'active': 'success',
    'inactive': 'danger',
    'pending': 'warning'
  }
  return typeMap[status] || 'default'
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

// 搜索
const handleSearch = async () => {
  currentPage.value = 1
  await fetchWorkers()
}

// 添加工人
const handleAddWorker = () => {
  isEditing.value = false
  workerForm.value = {
    id: '',
    name: '',
    idCard: '',
    phone: '',
    department: '',
    position: '',
    status: 'active',
    hireDate: ''
  }
  workerDialogVisible.value = true
}

// 编辑工人
const handleEditWorker = (worker: any) => {
  isEditing.value = true
  workerForm.value = { ...worker }
  workerDialogVisible.value = true
}

// 查看工人
const handleViewWorker = (worker: any) => {
  console.log('查看工人:', worker)
  // 这里可以跳转到工人详情页
}

// 删除工人
const handleDeleteWorker = async (id: string) => {
  try {
    await axios.delete(`/api/labor-company/workers/${id}`)
    await fetchWorkers()
  } catch (error) {
    console.error('删除工人失败:', error)
  }
}

// 保存工人
const handleSaveWorker = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/labor-company/workers/${workerForm.value.id}`, workerForm.value)
    } else {
      await axios.post('/api/labor-company/workers', workerForm.value)
    }
    workerDialogVisible.value = false
    await fetchWorkers()
  } catch (error) {
    console.error('保存工人失败:', error)
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchWorkers()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  fetchWorkers()
}

// 获取工人列表
const fetchWorkers = async () => {
  try {
    const response = await axios.get('/api/labor-company/workers', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
        status: statusFilter.value
      }
    })
    workersList.value = response.data.items
    totalWorkers.value = response.data.total
  } catch (error) {
    console.error('获取工人列表失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  fetchWorkers()
})
</script>

<style scoped>
.labor-company-workers {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #303133;
}

/* 搜索和筛选 */
.search-filter {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .labor-company-workers {
    padding: 16px;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-filter > * {
    margin-bottom: 12px;
    margin-right: 0 !important;
  }
  
  .el-input {
    width: 100% !important;
  }
}
</style>