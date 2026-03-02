<template>
  <div class="admin-ranking-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" :inline="true" label-width="auto">
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
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
          <el-button type="success" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新排名
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <CommonTable
      :data="tableData"
      :columns="columns"
      :table-id="tableId"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
    >
      <template #column-rank="{ row }">
        <div class="rank-badge" :class="getRankClass(row.rank)">
          {{ row.rank }}
        </div>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshLeft, Refresh } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { rankingApi } from '@/api/operations/rankingApi'
import type { RankingQueryParams } from '@/types/operations/ranking'

// Props
interface Props {
  tableId: string
  title: string
  columns: ColumnConfig[]
  loadFunction: (params: RankingQueryParams) => Promise<any>
}

const props = defineProps<Props>()

// 查询参数
const queryParams = reactive<RankingQueryParams>({
  page: 1,
  pageSize: 10,
  startTime: '',
  endTime: '',
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.startTime = dateRange.value[0]
      queryParams.endTime = dateRange.value[1]
    } else {
      queryParams.startTime = ''
      queryParams.endTime = ''
    }

    const response = await props.loadFunction(queryParams)
    tableData.value = response.data.list
    total.value = response.data.total
    currentPage.value = response.data.page
    pageSize.value = response.data.pageSize
  } catch (error) {
    console.error(`加载${props.title}数据失败:`, error)
    ElMessage.error(`加载${props.title}数据失败`)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  dateRange.value = null
  queryParams.page = 1
  loadData()
}

// 刷新排名
const handleRefresh = () => {
  ElMessage.success('排名已刷新')
  loadData()
}

// 分页变化
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  queryParams.page = 1
  loadData()
}

// 获取排名样式
const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return ''
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-ranking-page {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f2f5;
  color: #606266;
  font-weight: 600;
  font-size: 14px;
}

.rank-badge.rank-first {
  background: linear-gradient(135deg, #ffd700 0%, #ffec8b 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.rank-badge.rank-second {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
}

.rank-badge.rank-third {
  background: linear-gradient(135deg, #cd7f32 0%, #e8a86c 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
}
</style>
