<template>
  <div class="factory-salary">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>结算管理</span>
          <el-select v-model="settlementType" placeholder="选择结算类型" size="small" style="width: 150px;">
            <el-option label="工资结算" value="salary" />
            <el-option label="离职结算" value="resignation" />
          </el-select>
        </div>
      </template>
      
      <el-table :data="settlementList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="laborCompany" label="劳务公司" width="180" />
        <el-table-column prop="settlementPeriod" label="结算周期" width="150" />
        <el-table-column prop="workerCount" label="工人数量" width="100" />
        <el-table-column prop="totalAmount" label="结算金额" width="120">
          <template #default="scope">
            <span style="font-weight: 500; color: #E6A23C;">
              ¥{{ scope.row.totalAmount.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建日期" width="120" />
        <el-table-column prop="settlementDate" label="结算日期" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewSettlement(scope.row)">查看详情</el-button>
            <el-button size="small" type="primary" @click="confirmSettlement(scope.row)">
              {{ scope.row.status === '待确认' ? '确认' : '修改' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>结算统计</span>
        </div>
      </template>
      
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">¥{{ totalSettlementAmount.toFixed(2) }}</div>
              <div class="stats-label">总结算金额</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ totalSettlements }}</div>
              <div class="stats-label">总结算单数</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ pendingSettlements }}</div>
              <div class="stats-label">待确认单数</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 结算类型
const settlementType = ref('salary')

// 结算列表数据
const settlementList = ref([
  {
    id: 1,
    laborCompany: '三鼎劳务有限公司',
    settlementPeriod: '2025-12-01至2025-12-31',
    workerCount: 50,
    totalAmount: 275000,
    status: '已确认',
    createDate: '2026-01-05',
    settlementDate: '2026-01-10'
  },
  {
    id: 2,
    laborCompany: '三鼎劳务有限公司',
    settlementPeriod: '2026-01-01至2026-01-15',
    workerCount: 50,
    totalAmount: 137500,
    status: '待确认',
    createDate: '2026-01-16',
    settlementDate: ''
  },
  {
    id: 3,
    laborCompany: '诚信劳务服务有限公司',
    settlementPeriod: '2025-12-01至2025-12-31',
    workerCount: 30,
    totalAmount: 165000,
    status: '已确认',
    createDate: '2026-01-05',
    settlementDate: '2026-01-08'
  },
  {
    id: 4,
    laborCompany: '诚信劳务服务有限公司',
    settlementPeriod: '2026-01-01至2026-01-15',
    workerCount: 30,
    totalAmount: 82500,
    status: '待确认',
    createDate: '2026-01-16',
    settlementDate: ''
  }
])

// 统计数据
const totalSettlementAmount = computed(() => {
  return settlementList.value.reduce((sum, item) => sum + item.totalAmount, 0)
})

const totalSettlements = computed(() => settlementList.value.length)

const pendingSettlements = computed(() => {
  return settlementList.value.filter(item => item.status === '待确认').length
})

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '已确认':
      return 'success'
    case '待确认':
      return 'warning'
    default:
      return ''
  }
}

// 查看结算详情
const viewSettlement = (row: any) => {
  console.log('查看结算详情:', row)
}

// 确认结算
const confirmSettlement = (row: any) => {
  console.log('确认/修改结算:', row)
}
</script>

<style scoped>
.factory-salary {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-4 {
  margin-top: 20px;
}

.stats-container {
  padding: 20px 0;
}

.stats-card {
  text-align: center;
  padding: 20px 0;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 14px;
  color: #606266;
}
</style>