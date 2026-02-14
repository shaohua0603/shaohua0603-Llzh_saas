<template>
  <div class="labor-company-roles">
    <h2 class="page-title">角色管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-input
        v-model="searchQuery"
        placeholder="搜索角色名称"
        prefix-icon="Search"
        style="width: 300px; margin-right: 16px"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAddRole">添加角色</el-button>
    </div>
    
    <!-- 角色列表 -->
    <el-table :data="rolesList" style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="id" label="角色ID" width="100" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="角色描述" />
      <el-table-column prop="permissionCount" label="权限数量" width="100" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleViewRole(scope.row)">
            查看
          </el-button>
          <el-button size="small" type="success" @click="handleEditRole(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteRole(scope.row.id)">
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
        :total="totalRoles"
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
const totalRoles = ref(0)

// 角色列表
const rolesList = ref<any[]>([])

// 搜索
const handleSearch = async () => {
  currentPage.value = 1
  await fetchRoles()
}

// 添加角色
const handleAddRole = () => {
  console.log('添加角色')
  // 这里可以跳转到添加角色页面
}

// 查看角色
const handleViewRole = (role: any) => {
  console.log('查看角色:', role)
  // 这里可以跳转到角色详情页
}

// 编辑角色
const handleEditRole = (role: any) => {
  console.log('编辑角色:', role)
  // 这里可以跳转到编辑角色页面
}

// 删除角色
const handleDeleteRole = async (id: string) => {
  try {
    await axios.delete(`/api/labor-company/roles/${id}`)
    await fetchRoles()
  } catch (error) {
    console.error('删除角色失败:', error)
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchRoles()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  fetchRoles()
}

// 获取角色列表
const fetchRoles = async () => {
  try {
    const response = await axios.get('/api/labor-company/roles', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value
      }
    })
    rolesList.value = response.data.items
    totalRoles.value = response.data.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  fetchRoles()
})
</script>

<style scoped>
.labor-company-roles {
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
  .labor-company-roles {
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