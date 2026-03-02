<template>
  <div class="admin-ranking-page">
    <div class="page-header">
      <h2 class="page-title">在岗时长排名</h2>
    </div>
    
    <el-card class="table-card">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="rank" label="排名" width="80">
          <template #default="{ $index }">
            <span class="rank" :class="getRankClass($index + 1)">{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="laborCompanyName" label="劳务公司" min-width="200" />
        <el-table-column prop="workerCount" label="工人数" width="100" />
        <el-table-column prop="totalHours" label="在岗时长总和（小时）" width="180">
          <template #default="{ row }">
            <span class="highlight">{{ row.totalHours }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="averageHours" label="平均在岗时长（小时）" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const tableData = ref([
  { id: 1, laborCompanyName: 'XX劳务公司1', workerCount: 150, totalHours: 25600, averageHours: 170.7 },
  { id: 2, laborCompanyName: 'XX劳务公司2', workerCount: 120, totalHours: 19800, averageHours: 165.0 },
  { id: 3, laborCompanyName: 'XX劳务公司3', workerCount: 100, totalHours: 16500, averageHours: 165.0 },
  { id: 4, laborCompanyName: 'XX劳务公司4', workerCount: 80, totalHours: 12800, averageHours: 160.0 },
  { id: 5, laborCompanyName: 'XX劳务公司5', workerCount: 60, totalHours: 9300, averageHours: 155.0 }
])

const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return ''
}
</script>

<style scoped>
.admin-ranking-page {
  padding: 0;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.table-card {
  margin-bottom: 20px;
}

.rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
}

.rank-first {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #fff;
}

.rank-second {
  background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
  color: #fff;
}

.rank-third {
  background: linear-gradient(135deg, #CD7F32, #B87333);
  color: #fff;
}

.highlight {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 16px;
}
</style>
