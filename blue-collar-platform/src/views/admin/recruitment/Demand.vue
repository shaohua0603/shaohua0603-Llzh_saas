<template>
  <div class="admin-recruitment-demand-page">
    <div class="page-header">
      <h2 class="page-title">招聘需求</h2>
    </div>
    
    <el-card class="table-card">
      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="搜索招聘需求" clearable style="width: 200px; margin-right: 10px;">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 150px; margin-right: 10px;">
          <el-option label="全部" value="" />
          <el-option label="进行中" value="ongoing" />
          <el-option label="已结束" value="ended" />
          <el-option label="已暂停" value="paused" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="title" label="招聘标题" min-width="180" />
        <el-table-column prop="factoryName" label="用工工厂" width="150" />
        <el-table-column prop="laborCompany" label="劳务公司" width="150" />
        <el-table-column prop="position" label="招聘岗位" width="120" />
        <el-table-column prop="人数" label="招聘人数" width="100" />
        <el-table-column prop="salary" label="薪资范围" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">{{ row.statusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
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
    title: '电子厂普工招聘',
    factoryName: 'XX电子厂',
    laborCompany: 'XX劳务公司',
    position: '普工',
    人数: 50,
    salary: '5000-7000元/月',
    status: 'ongoing',
    statusText: '进行中',
    publishTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    title: '食品厂包装工招聘',
    factoryName: 'XX食品厂',
    laborCompany: 'XX劳务公司',
    position: '包装工',
    人数: 30,
    salary: '4500-6000元/月',
    status: 'ongoing',
    statusText: '进行中',
    publishTime: '2024-01-14 15:30:00'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    'ongoing': 'success',
    'ended': 'info',
    'paused': 'warning'
  }
  return map[status] || 'info'
}

const handleDetail = (row: any) => {
  router.push(`/admin/recruitment/demand/${row.id}`)
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
.admin-recruitment-demand-page {
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
