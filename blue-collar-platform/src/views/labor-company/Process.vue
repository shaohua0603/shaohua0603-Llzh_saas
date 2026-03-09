<template>
  <div class="process">
    <!-- 查询条件区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="mb-4">
        <el-form-item label="流程名称">
          <el-input v-model="searchForm.name" placeholder="请输入流程名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="流程类型">
          <el-select v-model="searchForm.type" placeholder="请选择流程类型" style="width: 150px">
            <el-option label="人事" value="personnel" />
            <el-option label="财务" value="finance" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px">
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 功能按钮区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="goToAdd">
        <el-icon><Plus /></el-icon>
        新增流程
      </el-button>
    </div>

    <!-- 列表展示区域 -->
    <el-card>
      <el-table :data="processList" style="width: 100%">
        <el-table-column prop="name" label="流程名称" width="180" />
        <el-table-column prop="type" label="流程类型" width="150">
          <template #default="scope">
            {{ getProcessTypeText(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="流程描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'info'">
              {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="goToEdit(scope.row.id)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 2
})

// 流程列表
const processList = ref([
  {
    id: 1,
    name: '请假流程',
    type: 'personnel',
    description: '员工请假审批流程',
    status: 'enabled',
    nodes: [
      { id: 1, name: '部门主管', approverType: 'user', approvers: [1] },
      { id: 2, name: '人力资源', approverType: 'group', approvers: [2, 3] }
    ]
  },
  {
    id: 2,
    name: '报销流程',
    type: 'finance',
    description: '费用报销审批流程',
    status: 'enabled',
    nodes: [
      { id: 1, name: '部门主管', approverType: 'user', approvers: [1] },
      { id: 2, name: '财务主管', approverType: 'user', approvers: [4] }
    ]
  }
])

// 模拟用户数据
const users = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' }
])

// 搜索
const search = () => {
  // 实际项目中这里应该调用API
  ElMessage.success('搜索功能')
}

// 重置
const reset = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
}

// 跳转到新增页面
const goToAdd = () => {
  router.push('/tenant/process/add')
}

// 跳转到编辑页面
const goToEdit = (id: number) => {
  router.push(`/tenant/process/edit/${id}`)
}

// 删除流程
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这个流程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = processList.value.findIndex(item => item.id === id)
    if (index > -1) {
      processList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}



// 获取流程类型文本
const getProcessTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    personnel: '人事',
    finance: '财务',
    other: '其他'
  }
  return typeMap[type] || type
}
</script>

<style scoped>
.process {
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.nodes-container {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.node-item {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: bold;
}

.node-form {
  margin-top: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>