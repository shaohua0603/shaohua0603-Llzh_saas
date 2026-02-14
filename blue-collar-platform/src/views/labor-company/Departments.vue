<template>
  <div class="labor-company-departments">
    <h2 class="page-title">部门管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-input
        v-model="searchQuery"
        placeholder="搜索部门名称"
        prefix-icon="Search"
        style="width: 300px; margin-right: 16px"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAddDepartment">添加部门</el-button>
    </div>
    
    <!-- 部门列表 -->
    <el-table :data="departmentsList" style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="id" label="部门ID" width="100" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="description" label="部门描述" />
      <el-table-column prop="workerCount" label="工人数量" width="100" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleViewDepartment(scope.row)">
            查看
          </el-button>
          <el-button size="small" type="success" @click="handleEditDepartment(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteDepartment(scope.row.id)">
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
        :total="totalDepartments"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 搜索和筛选
const searchQuery = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalDepartments = ref(0)

// 部门列表
const departmentsList = ref<any[]>([])

// 搜索
const handleSearch = async () => {
  currentPage.value = 1
  await fetchDepartments()
}

// 添加部门
const handleAddDepartment = () => {
  console.log('添加部门')
  // 这里可以跳转到添加部门页面
}

// 查看部门
const handleViewDepartment = (department: any) => {
  console.log('查看部门:', department)
  // 这里可以跳转到部门详情页
}

// 编辑部门
const handleEditDepartment = (department: any) => {
  console.log('编辑部门:', department)
  // 这里可以跳转到编辑部门页面
}

// 删除部门
const handleDeleteDepartment = async (id: string) => {
  try {
    await axios.delete(`/api/labor-company/departments/${id}`)
    await fetchDepartments()
  } catch (error) {
    console.error('删除部门失败:', error)
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchDepartments()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  fetchDepartments()
}

// 获取部门列表
const fetchDepartments = async () => {
  try {
    const response = await axios.get('/api/labor-company/departments', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value
      }
    })
    departmentsList.value = response.data.items
    totalDepartments.value = response.data.total
  } catch (error) {
    console.error('获取部门列表失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  fetchDepartments()
})
</script>

<style scoped>
.labor-company-departments {
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
  .labor-company-departments {
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
  
  .page-title {
    font-size: 20px;
  }
}
</style>