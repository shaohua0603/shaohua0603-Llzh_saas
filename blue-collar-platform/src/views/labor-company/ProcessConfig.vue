<template>
  <div class="process-config">
    <!-- 查询条件区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="mb-4">
        <el-form-item label="业务名称">
          <el-input v-model="searchForm.businessName" placeholder="请输入业务名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="流程名称">
          <el-select v-model="searchForm.processId" placeholder="请选择流程" style="width: 200px">
            <el-option v-for="process in processes" :key="process.id" :label="process.name" :value="process.id" />
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
        新增配置
      </el-button>
    </div>

    <!-- 列表展示区域 -->
    <el-card>
      <el-table :data="configList" style="width: 100%">
        <el-table-column prop="businessCode" label="业务代码" width="150" />
        <el-table-column prop="businessName" label="业务名称" width="200" />
        <el-table-column prop="processName" label="流程名称" width="180" />
        <el-table-column label="操作" width="150">
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
  businessName: '',
  processId: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 3
})

// 流程列表（模拟数据）
const processes = ref([
  { id: 1, name: '请假流程' },
  { id: 2, name: '报销流程' }
])

// 配置列表
const configList = ref([
  {
    id: 1,
    businessCode: 'leave',
    businessName: '请假管理',
    processId: 1,
    processName: '请假流程'
  },
  {
    id: 2,
    businessCode: 'transfer',
    businessName: '调岗管理',
    processId: 1,
    processName: '请假流程'
  },
  {
    id: 3,
    businessCode: 'expense',
    businessName: '费用报销',
    processId: 2,
    processName: '报销流程'
  }
])

// 搜索
const search = () => {
  // 实际项目中这里应该调用API
  ElMessage.success('搜索功能')
}

// 重置
const reset = () => {
  searchForm.businessName = ''
  searchForm.processId = ''
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
  router.push('/tenant/process-config/add')
}

// 跳转到编辑页面
const goToEdit = (id: number) => {
  router.push(`/tenant/process-config/edit/${id}`)
}

// 删除配置
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这个配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = configList.value.findIndex(item => item.id === id)
    if (index > -1) {
      configList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}


</script>

<style scoped>
.process-config {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>