<template>
  <div class="position-culture-container">
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="工厂">
          <el-select
            v-model="searchForm.factoryId"
            placeholder="请选择工厂"
            clearable
            filterable
            style="width: 200px"
          >
            <el-option
              v-for="factory in factoryList"
              :key="factory.id"
              :label="factory.name"
              :value="factory.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" v-if="searchExpanded">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入标题"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="toggleSearch">
            {{ searchExpanded ? '收起' : '展开' }}<el-icon class="ml-1"><ArrowDown /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        新增岗位文化
      </el-button>
    </div>

    <CommonTable
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      :stats-info="`共 ${pagination.total} 条岗位文化记录`"
      table-id="position-culture"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #actions="{ row }">
        <el-button size="small" type="primary" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import { fetchPositionCultureList, deletePositionCulture, fetchFactoryListAPI } from '@/api/companyCulture'

const router = useRouter()

const loading = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])
const searchExpanded = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const searchForm = reactive({
  factoryId: '',
  title: ''
})

const factoryList = ref<any[]>([])

const toggleSearch = () => {
  searchExpanded.value = !searchExpanded.value
}

const columns = [
  { prop: 'factoryName', label: '工厂名称', minWidth: 150, showTooltip: true },
  { prop: 'title', label: '岗位文化标题', minWidth: 150, showTooltip: true },
  { prop: 'content', label: '岗位文化内容', minWidth: 300, showTooltip: true },
  { prop: 'createTime', label: '创建时间', width: 180 }
]

const fetchFactoryList = async () => {
  try {
    const response = await fetchFactoryListAPI()
    if (response.code === 200) {
      factoryList.value = response.data
    }
  } catch (error) {
    ElMessage.error('获取工厂列表失败')
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const response = await fetchPositionCultureList(params)
    if (response.code === 200 && response.data) {
      tableData.value = response.data.list
      pagination.total = response.data.total
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    factoryId: '',
    title: ''
  })
  handleSearch()
}

const handleAdd = () => {
  router.push('/tenant/position-culture/add')
}

const handleEdit = (row: any) => {
  router.push(`/tenant/position-culture/edit/${row.id}`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该岗位文化吗？', '提示', {
      type: 'warning'
    })
    const response = await deletePositionCulture(row.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch {
  }
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
}

onMounted(() => {
  fetchFactoryList()
  fetchData()
})
</script>

<style scoped>
.position-culture-container {
  padding: 16px;
}

.search-card {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ml-1 {
  margin-left: 4px;
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

@media screen and (max-width: 768px) {
  .position-culture-container {
    padding: 16px;
  }

  .search-body :deep(.el-form) {
    flex-direction: column;
  }

  .search-body :deep(.el-form-item) {
    width: 100%;
  }

  .search-body :deep(.el-select),
  .search-body :deep(.el-input) {
    width: 100% !important;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
