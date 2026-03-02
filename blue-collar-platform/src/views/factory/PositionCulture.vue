<template>
  <div class="position-culture-container">
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="标题">
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
      </el-form>
    </el-card>

    <CommonTable
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      table-id="factory-position-culture"
      @current-change="handleCurrentChange"
    >
      <template #operations="{ row }">
        <el-button size="small" type="primary" @click="handleView(row)">
          查看
        </el-button>
      </template>
    </CommonTable>

    <el-dialog
      v-model="detailVisible"
      title="岗位文化详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="工厂名称">
          {{ detailData.factoryName }}
        </el-descriptions-item>
        <el-descriptions-item label="岗位文化标题">
          {{ detailData.title }}
        </el-descriptions-item>
        <el-descriptions-item label="岗位文化内容">
          <div class="rich-content" v-html="detailData.content"></div>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailData.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import { fetchFactoryPositionCultureList } from '@/api/companyCulture'

const loading = ref(false)
const tableData = ref<any[]>([])
const detailVisible = ref(false)
const detailData = reactive({
  factoryName: '',
  title: '',
  content: '',
  createTime: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const searchForm = reactive({
  title: ''
})

const columns = [
  { prop: 'factoryName', label: '工厂名称', minWidth: 150, showTooltip: true },
  { prop: 'title', label: '岗位文化标题', minWidth: 150, showTooltip: true },
  { prop: 'content', label: '岗位文化内容', minWidth: 300, showTooltip: true },
  { prop: 'createTime', label: '创建时间', width: 180 }
]

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const response = await fetchFactoryPositionCultureList(params)
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
    title: ''
  })
  handleSearch()
}

const handleView = (row: any) => {
  Object.assign(detailData, {
    factoryName: row.factoryName,
    title: row.title,
    content: row.content,
    createTime: row.createTime
  })
  detailVisible.value = true
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.position-culture-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.rich-content {
  min-height: 100px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.rich-content :deep(p) {
  margin: 8px 0;
}

.rich-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.rich-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.rich-content :deep(table td),
.rich-content :deep(table th) {
  border: 1px solid #ddd;
  padding: 8px;
  min-width: 50px;
}

@media screen and (max-width: 768px) {
  .position-culture-container {
    padding: 12px;
  }

  .search-card :deep(.el-form) {
    flex-direction: column;
  }

  .search-card :deep(.el-form-item) {
    width: 100%;
  }

  .search-card :deep(.el-input) {
    width: 100% !important;
  }
}
</style>
