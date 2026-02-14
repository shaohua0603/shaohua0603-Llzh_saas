<template>
  <div class="admin-packages">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>套餐配置</span>
          <el-button type="primary" size="small">添加套餐</el-button>
        </div>
      </template>
      
      <el-table :data="packageList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="套餐名称" min-width="150" />
        <el-table-column prop="type" label="套餐类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            <span style="font-weight: 500; color: #E6A23C;">
              ¥{{ scope.row.price.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="maxUsers" label="最大用户数" width="120" />
        <el-table-column prop="features" label="包含功能" min-width="300">
          <template #default="scope">
            <div class="feature-tags">
              <el-tag size="small" v-for="feature in scope.row.features" :key="feature" class="feature-tag">
                {{ feature }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewPackage(scope.row)">查看详情</el-button>
            <el-button size="small" type="primary" @click="editPackage(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 套餐列表数据
const packageList = ref([
  {
    id: 1,
    name: '劳务公司基础版',
    type: '劳务公司',
    price: 1999,
    maxUsers: 10,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算'],
    status: '启用'
  },
  {
    id: 2,
    name: '劳务公司高级版',
    type: '劳务公司',
    price: 3999,
    maxUsers: 30,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算', '培训管理', '福利管理'],
    status: '启用'
  },
  {
    id: 3,
    name: '工厂标准版',
    type: '工厂',
    price: 2999,
    maxUsers: 20,
    features: ['招聘需求发布', '面试管理', '工人管理', '奖励惩罚管理', '结算管理'],
    status: '启用'
  },
  {
    id: 4,
    name: '工厂企业版',
    type: '工厂',
    price: 5999,
    maxUsers: 50,
    features: ['招聘需求发布', '面试管理', '工人管理', '奖励惩罚管理', '结算管理', '岗前培训', '数据分析'],
    status: '启用'
  },
  {
    id: 5,
    name: '直营劳务基础版',
    type: '直营劳务',
    price: 1599,
    maxUsers: 15,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算'],
    status: '启用'
  }
])

// 获取套餐类型标签类型
const getTypeType = (type: string) => {
  switch (type) {
    case '劳务公司':
      return 'info'
    case '工厂':
      return 'success'
    case '直营劳务':
      return 'warning'
    default:
      return ''
  }
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '启用':
      return 'success'
    case '禁用':
      return 'danger'
    default:
      return ''
  }
}

// 查看套餐详情
const viewPackage = (pkg: any) => {
  console.log('查看套餐详情:', pkg)
}

// 编辑套餐
const editPackage = (pkg: any) => {
  console.log('编辑套餐:', pkg)
}
</script>

<style scoped>
.admin-packages {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  margin-bottom: 4px;
}
</style>