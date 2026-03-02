<template>
  <div class="admin-recruitment-resume-page">
    <div class="page-header">
      <h2 class="page-title">简历管理</h2>
    </div>
    
    <el-card class="table-card">
      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="搜索简历" clearable style="width: 200px; margin-right: 10px;">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 150px; margin-right: 10px;">
          <el-option label="全部" value="" />
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="education" label="学历" width="100" />
        <el-table-column prop="position" label="应聘岗位" width="120" />
        <el-table-column prop="experience" label="工作经验" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">{{ row.statusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const tableData = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    gender: '男',
    age: 25,
    education: '大专',
    position: '普工',
    experience: '1-3年',
    status: 'pending',
    statusText: '待审核',
    submitTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    name: '李四',
    phone: '13800138001',
    gender: '女',
    age: 23,
    education: '高中',
    position: '包装工',
    experience: '1年以下',
    status: 'approved',
    statusText: '已通过',
    submitTime: '2024-01-14 15:30:00'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return map[status] || 'info'
}

const handleDetail = (row: any) => {
  router.push(`/admin/recruitment/resume/${row.id}`)
}

const handleSearch = () => {
  loadData()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadData()
}

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}
</script>

<style scoped>
.admin-recruitment-resume-page {
  padding: 0;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.table-card {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
