<template>
  <div class="admin-tenants">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>租户管理</span>
          <el-button type="primary" size="small">添加租户</el-button>
        </div>
      </template>
      
      <el-table :data="tenantList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="租户名称" min-width="150" />
        <el-table-column prop="type" label="租户类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" width="150" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建日期" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewTenant(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="editTenant(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>租户统计</span>
        </div>
      </template>
      
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ totalTenants }}</div>
              <div class="stats-label">总租户数</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ laborCompanyCount }}</div>
              <div class="stats-label">劳务公司</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ factoryCount }}</div>
              <div class="stats-label">工厂</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ activeTenants }}</div>
              <div class="stats-label">活跃租户</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 租户列表数据
const tenantList = ref([
  {
    id: 1,
    name: '三鼎劳务有限公司',
    type: '劳务公司',
    contact: '张总',
    phone: '13800138009',
    address: '上海市浦东新区张江高科技园区',
    status: '活跃',
    createDate: '2026-01-01'
  },
  {
    id: 2,
    name: '诚信劳务服务有限公司',
    type: '劳务公司',
    contact: '李总',
    phone: '13800138010',
    address: '北京市朝阳区CBD商务中心',
    status: '活跃',
    createDate: '2026-01-02'
  },
  {
    id: 3,
    name: '富士康科技集团',
    type: '工厂',
    contact: '王总',
    phone: '13800138011',
    address: '深圳市龙华区富士康科技园区',
    status: '活跃',
    createDate: '2026-01-03'
  },
  {
    id: 4,
    name: '华为技术有限公司',
    type: '工厂',
    contact: '刘总',
    phone: '13800138012',
    address: '深圳市龙岗区坂田华为基地',
    status: '活跃',
    createDate: '2026-01-04'
  },
  {
    id: 5,
    name: '比亚迪股份有限公司',
    type: '工厂',
    contact: '赵总',
    phone: '13800138013',
    address: '深圳市坪山区比亚迪工业园',
    status: '待激活',
    createDate: '2026-01-05'
  }
])

// 统计数据
const totalTenants = computed(() => tenantList.value.length)
const laborCompanyCount = computed(() => tenantList.value.filter(t => t.type === '劳务公司').length)
const factoryCount = computed(() => tenantList.value.filter(t => t.type === '工厂').length)
const activeTenants = computed(() => tenantList.value.filter(t => t.status === '活跃').length)

// 获取租户类型标签类型
const getTypeType = (type: string) => {
  switch (type) {
    case '劳务公司':
      return 'info'
    case '工厂':
      return 'success'
    default:
      return ''
  }
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '活跃':
      return 'success'
    case '待激活':
      return 'warning'
    default:
      return ''
  }
}

// 查看租户详情
const viewTenant = (tenant: any) => {
  console.log('查看租户详情:', tenant)
}

// 编辑租户
const editTenant = (tenant: any) => {
  console.log('编辑租户:', tenant)
}
</script>

<style scoped>
.admin-tenants {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-4 {
  margin-top: 20px;
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