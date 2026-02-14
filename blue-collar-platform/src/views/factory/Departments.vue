<template>
  <div class="factory-departments">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
          <el-button type="primary" size="small" @click="addDepartment">添加部门</el-button>
        </div>
      </template>
      
      <el-tree
        :data="departmentTree"
        :props="defaultProps"
        node-key="id"
        ref="departmentTreeRef"
        default-expand-all
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <span>{{ node.label }}</span>
            <span class="node-actions">
              <el-button size="small" type="text" @click.stop="editDepartment(data)">
                编辑
              </el-button>
              <el-button size="small" type="text" @click.stop="addSubDepartment(data)">
                添加子部门
              </el-button>
              <el-button size="small" type="text" @click.stop="deleteDepartment(data)" :disabled="data.children && data.children.length > 0">
                删除
              </el-button>
            </span>
          </div>
        </template>
      </el-tree>
    </el-card>
    
    <el-card shadow="hover" class="mt-4" v-if="selectedDepartment">
      <template #header>
        <div class="card-header">
          <span>部门详情</span>
        </div>
      </template>
      
      <div class="department-details">
        <el-form :model="selectedDepartment" label-width="100px">
          <el-form-item label="部门名称">
            <el-input v-model="selectedDepartment.name" disabled />
          </el-form-item>
          <el-form-item label="部门级别">
            <el-input v-model="selectedDepartment.level" disabled />
          </el-form-item>
          <el-form-item label="部门负责人">
            <el-input v-model="selectedDepartment.manager" disabled />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="selectedDepartment.phone" disabled />
          </el-form-item>
          <el-form-item label="部门人数">
            <el-input v-model="selectedDepartment.employeeCount" disabled />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="selectedDepartment.createDate" disabled />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="selectedDepartment.remark" type="textarea" rows="3" disabled />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TreeData } from 'element-plus'

// 部门树数据
const departmentTree = ref([
  {
    id: 1,
    name: '生产部',
    level: '一级部门',
    manager: '张经理',
    phone: '13800138001',
    employeeCount: 200,
    createDate: '2026-01-01',
    remark: '负责工厂生产运营',
    children: [
      {
        id: 2,
        name: '生产一部',
        level: '二级部门',
        manager: '李经理',
        phone: '13800138002',
        employeeCount: 100,
        createDate: '2026-01-01',
        remark: '负责A产品线生产',
        children: [
          {
            id: 3,
            name: '生产一组',
            level: '三级部门',
            manager: '王组长',
            phone: '13800138003',
            employeeCount: 50,
            createDate: '2026-01-01',
            remark: 'A产品线一组',
            children: []
          },
          {
            id: 4,
            name: '生产二组',
            level: '三级部门',
            manager: '赵组长',
            phone: '13800138004',
            employeeCount: 50,
            createDate: '2026-01-01',
            remark: 'A产品线二组',
            children: []
          }
        ]
      },
      {
        id: 5,
        name: '生产二部',
        level: '二级部门',
        manager: '刘经理',
        phone: '13800138005',
        employeeCount: 100,
        createDate: '2026-01-01',
        remark: '负责B产品线生产',
        children: []
      }
    ]
  },
  {
    id: 6,
    name: '质检部',
    level: '一级部门',
    manager: '陈经理',
    phone: '13800138006',
    employeeCount: 50,
    createDate: '2026-01-01',
    remark: '负责产品质量检验',
    children: []
  },
  {
    id: 7,
    name: '仓储部',
    level: '一级部门',
    manager: '杨经理',
    phone: '13800138007',
    employeeCount: 30,
    createDate: '2026-01-01',
    remark: '负责原材料和成品仓储',
    children: []
  }
])

// 树节点配置
const defaultProps = {
  children: 'children',
  label: 'name'
}

// 部门树引用
const departmentTreeRef = ref()

// 选中的部门
const selectedDepartment = ref(null)

// 节点点击事件
const handleNodeClick = (data: any) => {
  selectedDepartment.value = data
}

// 添加部门
const addDepartment = () => {
  console.log('添加部门')
}

// 编辑部门
const editDepartment = (data: any) => {
  console.log('编辑部门:', data)
}

// 添加子部门
const addSubDepartment = (data: any) => {
  console.log('添加子部门:', data)
}

// 删除部门
const deleteDepartment = (data: any) => {
  console.log('删除部门:', data)
}
</script>

<style scoped>
.factory-departments {
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

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.node-actions {
  display: flex;
  gap: 10px;
}

.department-details {
  padding: 20px 0;
}
</style>