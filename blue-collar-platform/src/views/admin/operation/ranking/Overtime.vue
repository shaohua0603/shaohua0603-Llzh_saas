<template>
  <RankingTable
    table-id="admin-ranking-overtime-hours"
    title="加班时长排名"
    :columns="columns"
    :load-function="rankingApi.getOvertimeHoursRanking"
  />
</template>

<script setup lang="ts">
import RankingTable from '@/components/RankingTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { rankingApi } from '@/api/operations/rankingApi'

const columns: ColumnConfig[] = [
  { prop: 'rank', label: '排名', width: 80, sortable: true },
  { prop: 'laborCompanyName', label: '劳务公司名称', minWidth: 180, sortable: true },
  { prop: 'totalOvertimeHours', label: '加班时长总和', width: 150, sortable: true },
  { prop: 'workerCount', label: '工人数量', width: 120, sortable: true },
  { prop: 'avgOvertimeHours', label: '平均加班时长', width: 150, sortable: true },
]
</script>
