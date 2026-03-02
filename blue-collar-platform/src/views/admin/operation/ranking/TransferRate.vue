<template>
  <RankingTable
    table-id="admin-ranking-transfer-rate"
    title="调岗率排名"
    :columns="columns"
    :load-function="rankingApi.getTransferRateRanking"
  />
</template>

<script setup lang="ts">
import RankingTable from '@/components/RankingTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { rankingApi } from '@/api/operations/rankingApi'

const columns: ColumnConfig[] = [
  { prop: 'rank', label: '排名', width: 80, sortable: true },
  { prop: 'laborCompanyName', label: '劳务公司名称', minWidth: 180, sortable: true },
  { prop: 'transferRate', label: '调岗率(%)', width: 120, sortable: true },
  { prop: 'totalWorkers', label: '总工人数', width: 120, sortable: true },
  { prop: 'transferredWorkers', label: '调岗人数', width: 120, sortable: true },
]
</script>
