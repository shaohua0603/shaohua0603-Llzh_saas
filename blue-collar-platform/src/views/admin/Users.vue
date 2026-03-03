<template>
  <div class="admin-users">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>注册用户查询</span>
          <el-input v-model="searchQuery" placeholder="搜索用户姓名或手机号" style="width: 300px" prefix-icon="Search" />
        </div>
      </template>
      
      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="40" :src="scope.row.avatar" />
              <div class="user-details">
                <div class="user-name">{{ scope.row.name }}</div>
                <div class="user-phone">{{ scope.row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="用户类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.userType)">{{ scope.row.userType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerDate" label="注册日期" width="120" />
        <el-table-column prop="lastLoginDate" label="最后登录" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewUser(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="manageUser(scope.row)">管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="users.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>用户统计</span>
        </div>
      </template>
      
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ totalUsers }}</div>
              <div class="stats-label">总用户数</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ workerCount }}</div>
              <div class="stats-label">工人用户</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ enterpriseCount }}</div>
              <div class="stats-label">企业用户</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ activeUsers }}</div>
              <div class="stats-label">活跃用户</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 用户列表数据
const users = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138001',
    avatar: 'https://via.placeholder.com/150',
    userType: '工人',
    registerDate: '2026-01-01',
    lastLoginDate: '2026-01-20',
    status: '活跃'
  },
  {
    id: 2,
    name: '李四',
    phone: '13800138002',
    avatar: 'https://via.placeholder.com/150',
    userType: '劳务公司',
    registerDate: '2026-01-02',
    lastLoginDate: '2026-01-19',
    status: '活跃'
  },
  {
    id: 3,
    name: '王五',
    phone: '13800138003',
    avatar: 'https://via.placeholder.com/150',
    userType: '工厂',
    registerDate: '2026-01-03',
    lastLoginDate: '2026-01-18',
    status: '活跃'
  },
  {
    id: 4,
    name: '赵六',
    phone: '13800138004',
    avatar: 'https://via.placeholder.com/150',
    userType: '平台管理员',
    registerDate: '2026-01-04',
    lastLoginDate: '2026-01-20',
    status: '活跃'
  },
  {
    id: 5,
    name: '钱七',
    phone: '13800138005',
    avatar: 'https://via.placeholder.com/150',
    userType: '工人',
    registerDate: '2026-01-05',
    lastLoginDate: '2026-01-17',
    status: '未活跃'
  },
  {
    id: 6,
    name: '孙八',
    phone: '13800138006',
    avatar: 'https://via.placeholder.com/150',
    userType: '工人',
    registerDate: '2026-01-06',
    lastLoginDate: '2026-01-16',
    status: '活跃'
  },
  {
    id: 7,
    name: '周九',
    phone: '13800138007',
    avatar: 'https://via.placeholder.com/150',
    userType: '劳务公司',
    registerDate: '2026-01-07',
    lastLoginDate: '2026-01-15',
    status: '活跃'
  },
  {
    id: 8,
    name: '吴十',
    phone: '13800138008',
    avatar: 'https://via.placeholder.com/150',
    userType: '工厂',
    registerDate: '2026-01-08',
    lastLoginDate: '2026-01-14',
    status: '未活跃'
  }
])

// 搜索查询
const searchQuery = ref('')

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)

// 过滤后的用户列表
const filteredUsers = computed(() => {
  let result = users.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.phone.includes(query)
    )
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 统计数据
const totalUsers = computed(() => users.value.length)
const workerCount = computed(() => users.value.filter(u => u.userType === '工人').length)
const enterpriseCount = computed(() => users.value.filter(u => u.userType !== '工人').length)
const activeUsers = computed(() => users.value.filter(u => u.status === '活跃').length)

// 获取用户类型标签类型
const getTypeType = (type: string) => {
  switch (type) {
    case '工人':
      return 'info'
    case '劳务公司':
      return 'success'
    case '工厂':
      return 'warning'
    case '平台管理员':
      return 'danger'
    default:
      return ''
  }
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '活跃':
      return 'success'
    case '未活跃':
      return 'info'
    default:
      return ''
  }
}

// 查看用户详情
const viewUser = (user: any) => {
  console.log('查看用户详情:', user)
}

// 管理用户
const manageUser = (user: any) => {
  console.log('管理用户:', user)
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
}
</script>

<style scoped>
.admin-users {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mt-4 {
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 500;
}

.user-phone {
  font-size: 12px;
  color: #606266;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.stats-container {
  padding: 20px 0;
}

.stats-card {
  text-align: center;
  padding: 20px 0;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 14px;
  color: #606266;
}
</style>