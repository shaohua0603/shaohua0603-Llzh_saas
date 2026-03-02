<template>
  <RankingTable
    table-id="admin-ranking-complaint-rate"
    title="投诉率排名"
    :columns="columns"
    :load-function="rankingApi.getComplaintRateRanking"
  />
</template>

<script setup lang="ts">
import RankingTable from '@/components/RankingTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { rankingApi } from '@/api/operations/rankingApi'

const columns: ColumnConfig[] = [
  { prop: 'rank', label: '排名', width: 80, sortable: true },
  { prop: 'laborCompanyName', label: '劳务公司名称', minWidth: 180, sortable: true },
  { prop: 'complaintRate', label: '投诉率(%)', width: 120, sortable: true },
  { prop: 'totalWorkers', label: '总工人数', width: 120, sortable: true },
  { prop: 'complaintCount', label: '投诉次数', width: 120, sortable: true },
]
</script>
