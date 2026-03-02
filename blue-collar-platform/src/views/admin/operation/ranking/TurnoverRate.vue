<template>
  <RankingTable
    table-id="admin-ranking-turnover-rate"
    title="离职率排名"
    :columns="columns"
    :load-function="rankingApi.getTurnoverRateRanking"
  />
</template>

<script setup lang="ts">
import RankingTable from '@/components/RankingTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { rankingApi } from '@/api/operations/rankingApi'

const columns: ColumnConfig[] = [
  { prop: 'rank', label: '排名', width: 80, sortable: true },
  { prop: 'laborCompanyName', label: '劳务公司名称', minWidth: 180, sortable: true },
  { prop: 'turnoverRate', label: '离职率(%)', width: 120, sortable: true },
  { prop: 'totalWorkers', label: '总工人数', width: 120, sortable: true },
  { prop: 'resignedWorkers', label: '离职人数', width: 120, sortable: true },
]
</script>
