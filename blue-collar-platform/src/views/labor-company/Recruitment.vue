<template>
  <div class="labor-company-recruitment">
    <h2 class="page-title">招聘管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-input
        v-model="searchQuery"
        placeholder="搜索招聘标题"
        prefix-icon="Search"
        style="width: 300px; margin-right: 16px"
      />
      <el-select
        v-model="statusFilter"
        placeholder="筛选状态"
        style="width: 150px; margin-right: 16px"
      >
        <el-option label="全部" value="" />
        <el-option label="进行中" value="active" />
        <el-option label="待处理" value="pending" />
        <el-option label="已完成" value="completed" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAddRecruitment">发布招聘</el-button>
    </div>
    
    <!-- 招聘列表 -->
    <el-table :data="recruitmentList" style="width: 100%; margin-top: 16px">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="id" label="招聘ID" width="100" />
      <el-table-column prop="title" label="招聘标题" />
      <el-table-column prop="factoryName" label="工厂名称" width="180" />
      <el-table-column prop="department" label="部门" width="120" />
      <el-table-column prop="requiredWorkers" label="需求人数" width="100" />
      <el-table-column prop="salary" label="薪资范围" width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="发布时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleViewRecruitment(scope.row)">
            查看
          </el-button>
          <el-button size="small" type="success" @click="handleEditRecruitment(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteRecruitment(scope.row.id)">
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
        :total="totalRecruitments"
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
const statusFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecruitments = ref(0)

// 招聘列表
const recruitmentList = ref<any[]>([])

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'active': 'success',
    'pending': 'warning',
    'completed': 'info'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'active': '进行中',
    'pending': '待处理',
    'completed': '已完成'
  }
  return textMap[status] || status
}

// 搜索
const handleSearch = async () => {
  currentPage.value = 1
  await fetchRecruitments()
}

// 发布招聘
const handleAddRecruitment = () => {
  console.log('发布招聘')
  // 这里可以跳转到发布招聘页面
}

// 查看招聘
const handleViewRecruitment = (recruitment: any) => {
  console.log('查看招聘:', recruitment)
  // 这里可以跳转到招聘详情页
}

// 编辑招聘
const handleEditRecruitment = (recruitment: any) => {
  console.log('编辑招聘:', recruitment)
  // 这里可以跳转到编辑招聘页面
}

// 删除招聘
const handleDeleteRecruitment = async (id: string) => {
  try {
    await axios.delete(`/api/labor-company/recruitments/${id}`)
    await fetchRecruitments()
  } catch (error) {
    console.error('删除招聘失败:', error)
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchRecruitments()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  fetchRecruitments()
}

// 获取招聘列表
const fetchRecruitments = async () => {
  try {
    const response = await axios.get('/api/labor-company/recruitments', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
        status: statusFilter.value
      }
    })
    recruitmentList.value = response.data.items
    totalRecruitments.value = response.data.total
  } catch (error) {
    console.error('获取招聘列表失败:', error)
  }
}

// 初始化数据
onMounted(() => {
  fetchRecruitments()
})
</script>

<style scoped>
.labor-company-recruitment {
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
  .labor-company-recruitment {
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