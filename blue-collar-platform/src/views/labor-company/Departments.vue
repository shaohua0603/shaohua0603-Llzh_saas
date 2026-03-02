<template>
  <div class="department-management">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="部门名称">
          <el-input v-model="searchForm.name" placeholder="请输入部门名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <!-- 功能按钮栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增部门
          </el-button>
          <el-button @click="handleExpandAll">
            <el-icon><ArrowDown /></el-icon>
            {{ isExpanded ? '收起全部' : '展开全部' }}
          </el-button>
        </div>
      </div>

      <!-- 树形表格 -->
      <el-table
        ref="tableRef"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="isExpanded"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="部门名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="levelName" label="级别" width="100" align="center" />
        <el-table-column prop="levelAlias" label="级别别名" width="120" show-overflow-tooltip />
        <el-table-column prop="leaderName" label="部门负责人" width="120" show-overflow-tooltip />
        <el-table-column prop="contactPhone" label="联系电话" width="130" show-overflow-tooltip />
        <el-table-column prop="contactEmail" label="联系邮箱" width="180" show-overflow-tooltip />
        <el-table-column prop="contactAddress" label="联系地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="workerCount" label="人员数量" width="100" align="center" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleAddChild(scope.row)">
              新增子部门
            </el-button>
            <el-button link type="primary" size="small" @click="handleDetail(scope.row)">
              详情
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshLeft, Plus, ArrowDown } from '@element-plus/icons-vue'

// 路由
const router = useRouter()

// 表格引用
const tableRef = ref()

// 搜索表单
const searchForm = reactive({
  name: ''
})

// 表格数据
const tableData = ref<any[]>([])

// 展开/折叠状态
const isExpanded = ref(false)

// 选中的行
const selectedRows = ref<any[]>([])

// 模拟数据
const mockData: any[] = [
  {
    id: '1',
    parentId: null,
    name: '深圳三鼎劳务公司',
    level: 1,
    levelName: '一级',
    levelAlias: '总部',
    description: '深圳三鼎劳务公司总部',
    leaderId: 'e1',
    leaderName: '张三',
    contactPhone: '13800138000',
    contactEmail: 'sz@sanding.com',
    contactAddress: '深圳市南山区科技园',
    workerCount: 50,
    hasChildren: true,
    children: [
      {
        id: '2',
        parentId: '1',
        name: '人事部',
        level: 2,
        levelName: '二级',
        levelAlias: '人事',
        description: '人事管理部门',
        leaderId: 'e2',
        leaderName: '李四',
        contactPhone: '13800138001',
        contactEmail: 'hr@sanding.com',
        contactAddress: '深圳市南山区科技园A座',
        workerCount: 10,
        hasChildren: true,
        children: [
          {
            id: '5',
            parentId: '2',
            name: '招聘组',
            level: 3,
            levelName: '三级',
            levelAlias: '招聘',
            description: '负责招聘工作',
            leaderId: 'e5',
            leaderName: '王五',
            contactPhone: '13800138005',
            contactEmail: 'recruit@sanding.com',
            contactAddress: '深圳市南山区科技园A座301',
            workerCount: 5,
            children: []
          },
          {
            id: '6',
            parentId: '2',
            name: '培训组',
            level: 3,
            levelName: '三级',
            levelAlias: '培训',
            description: '负责培训工作',
            leaderId: 'e6',
            leaderName: '赵六',
            contactPhone: '13800138006',
            contactEmail: 'train@sanding.com',
            contactAddress: '深圳市南山区科技园A座302',
            workerCount: 3,
            children: []
          }
        ]
      },
      {
        id: '3',
        parentId: '1',
        name: '财务部',
        level: 2,
        levelName: '二级',
        levelAlias: '财务',
        description: '财务管理部门',
        leaderId: 'e3',
        leaderName: '钱七',
        contactPhone: '13800138002',
        contactEmail: 'finance@sanding.com',
        contactAddress: '深圳市南山区科技园B座',
        workerCount: 8,
        children: []
      },
      {
        id: '4',
        parentId: '1',
        name: '运营部',
        level: 2,
        levelName: '二级',
        levelAlias: '运营',
        description: '运营管理部门',
        leaderId: 'e4',
        leaderName: '孙八',
        contactPhone: '13800138003',
        contactEmail: 'operation@sanding.com',
        contactAddress: '深圳市南山区科技园C座',
        workerCount: 15,
        children: []
      }
    ]
  }
]

// 加载数据
const fetchData = () => {
  tableData.value = JSON.parse(JSON.stringify(mockData))
}

// 搜索
const handleSearch = () => {
  if (!searchForm.name) {
    tableData.value = mockData
    return
  }
  const filterData = (data: any[]): any[] => {
    return data
      .filter(item => item.name.includes(searchForm.name))
      .map(item => ({
        ...item,
        children: item.children ? filterData(item.children) : []
      }))
  }
  tableData.value = filterData(mockData)
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  tableData.value = JSON.parse(JSON.stringify(mockData))
}

// 展开/收起全部
const handleExpandAll = () => {
  isExpanded.value = !isExpanded.value
}

// 新增部门
const handleAdd = () => {
  router.push({ name: 'LaborCompanyDepartmentAdd' })
}

// 添加子部门
const handleAddChild = (row: any) => {
  router.push({ name: 'LaborCompanyDepartmentAdd', query: { parentId: row.id } })
}

// 查看详情
const handleDetail = (row: any) => {
  router.push({ name: 'LaborCompanyDepartmentDetail', params: { id: row.id } })
}

// 编辑
const handleEdit = (row: any) => {
  router.push({ name: 'LaborCompanyDepartmentEdit', params: { id: row.id } })
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除部门"${row.name}"吗？${row.children?.length ? '该部门包含子部门，将一并删除。' : ''}删除后无法恢复。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用实际API
      ElMessage.success('删除成功')
      // 刷新列表
      fetchData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.department-management {
  padding: 20px;
}

/* 搜索卡片 */
.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 表格卡片 */
.table-card {
  margin-bottom: 20px;
}

.table-card:last-child {
  margin-bottom: 0;
}

/* 功能工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .toolbar-left {
    width: 100%;
    flex-wrap: wrap;
  }

  .toolbar-left .el-button {
    flex: 1;
    min-width: 80px;
  }
}
</style>
