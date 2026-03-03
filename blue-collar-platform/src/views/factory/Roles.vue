<template>
  <div class="factory-roles">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" size="small" @click="addRole">添加角色</el-button>
        </div>
      </template>
      
      <el-table :data="roleList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="description" label="角色描述" min-width="200" />
        <el-table-column prop="menuCount" label="菜单权限数" width="120" />
        <el-table-column prop="userCount" label="关联用户数" width="120" />
        <el-table-column prop="createDate" label="创建日期" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewRole(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="editRole(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-card shadow="hover" class="mt-4" v-if="selectedRole">
      <template #header>
        <div class="card-header">
          <span>角色权限详情</span>
        </div>
      </template>
      
      <div class="role-details">
        <el-form :model="selectedRole" label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="selectedRole.name" disabled />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="selectedRole.description" type="textarea" rows="2" disabled />
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree
              :data="menuTree"
              :props="menuProps"
              node-key="id"
              show-checkbox
              default-expand-all
              :check-strictly="false"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="数据权限">
            <el-input v-model="selectedRole.dataPermission" disabled />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 角色列表数据
const roleList = ref([
  {
    id: 1,
    name: '工厂管理员',
    description: '工厂最高权限管理员，拥有所有操作权限',
    menuCount: 20,
    userCount: 5,
    createDate: '2026-01-01',
    dataPermission: '全部数据'
  },
  {
    id: 2,
    name: '人事专员',
    description: '负责招聘、员工管理等人事相关工作',
    menuCount: 12,
    userCount: 8,
    createDate: '2026-01-01',
    dataPermission: '全部数据'
  },
  {
    id: 3,
    name: '生产主管',
    description: '负责生产管理、工人调度等工作',
    menuCount: 10,
    userCount: 12,
    createDate: '2026-01-01',
    dataPermission: '本部门及以下数据'
  },
  {
    id: 4,
    name: '质检员',
    description: '负责产品质量检验工作',
    menuCount: 8,
    userCount: 20,
    createDate: '2026-01-01',
    dataPermission: '本人数据'
  }
])

// 选中的角色
const selectedRole = ref(null)

// 菜单树数据
const menuTree = ref([
  {
    id: 1,
    label: '仪表盘',
    children: []
  },
  {
    id: 2,
    label: '招聘管理',
    children: [
      {
        id: 21,
        label: '招聘需求',
        children: []
      },
      {
        id: 22,
        label: '面试管理',
        children: []
      }
    ]
  },
  {
    id: 3,
    label: '工人管理',
    children: []
  },
  {
    id: 4,
    label: '岗前培训',
    children: []
  },
  {
    id: 5,
    label: '结算管理',
    children: []
  },
  {
    id: 6,
    label: '部门管理',
    children: []
  },
  {
    id: 7,
    label: '角色管理',
    children: []
  }
])

// 菜单树配置
const menuProps = {
  children: 'children',
  label: 'label'
}

// 查看角色详情
const viewRole = (row: any) => {
  selectedRole.value = row
}

// 编辑角色
const editRole = (row: any) => {
  console.log('编辑角色:', row)
}

// 添加角色
const addRole = () => {
  console.log('添加角色')
}
</script>

<style scoped>
.factory-roles {
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

.role-details {
  padding: 20px 0;
}
</style>