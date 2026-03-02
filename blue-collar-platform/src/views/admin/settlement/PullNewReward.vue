<template>
  <div class="admin-pull-new-reward-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="搜索被介绍人/介绍人"
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="待发放" value="pending" />
            <el-option label="已发放" value="paid" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <div class="action-bar-left"></div>
      <div class="action-bar-right">
        <el-button
          type="primary"
          @click="handleBatchPay"
          :disabled="selectedRows.length === 0"
        >
          <el-icon><Money /></el-icon>
          批量发放 ({{ selectedRows.length }})
        </el-button>
      </div>
    </div>

    <!-- 列表区域 -->
    <el-card class="table-card">
      <CommonTable
        :data="tableData"
        :columns="columns"
        :table-id="tableId"
        :loading="loading"
        :total="total"
        :current-page="queryParams.page"
        :page-size="queryParams.pageSize"
        :show-actions="true"
        :show-selection="true"
        :show-index="true"
        :show-toolbar="true"
        :show-pagination="true"
        @update:current-page="handlePageChange"
        @update:page-size="handleSizeChange"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <template #column-rewardAmount="{ row }">
          <span class="amount">¥{{ row.rewardAmount }}</span>
        </template>
        <template #column-status="{ row }">
          <el-tag :type="getStatusTag(row.status)">{{ row.statusText }}</el-tag>
        </template>
        <template #actions="{ row }">
          <el-button
            type="primary"
            link
            @click="handlePay(row)"
            v-if="row.status === 'pending'"
          >
            发放
          </el-button>
          <el-button type="primary" link @click="handleDetail(row)">
            详情
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 发放确认弹窗 -->
    <el-dialog
      v-model="payDialogVisible"
      title="发放确认"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="payForm" label-width="100px">
        <el-form-item label="发放金额">
          <span class="amount">¥{{ payForm.amount }}</span>
        </el-form-item>
        <el-form-item label="发放数量">
          <span>{{ payForm.count }} 笔</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="payForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="payDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmPay" :loading="paying">
          确认发放
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Money } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import {
  getReferralRewardList,
  payReferralReward,
  batchPayReferralReward
} from '@/api/settlementApi'
import type {
  ReferralReward,
  ReferralRewardQueryParams,
  ReferralRewardFormData
} from '@/types/settlementTypes'

// 表格ID
const tableId = 'admin-referral-reward'

// 查询参数
const queryParams = ref<ReferralRewardQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '',
  startDate: '',
  endDate: ''
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<ReferralReward[]>([])
const total = ref(0)
const loading = ref(false)
const selectedRows = ref<ReferralReward[]>([])

// 发放弹窗
const payDialogVisible = ref(false)
const paying = ref(false)
const payForm = ref({
  ids: [] as string[],
  amount: 0,
  count: 0,
  remark: ''
})

// 表格列配置
const columns = ref<ColumnConfig[]>([
  {
    prop: 'referredName',
    label: '被介绍人',
    width: 120,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'referredPhone',
    label: '被介绍人手机号',
    width: 140,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'introduceDate',
    label: '介绍日期',
    width: 120,
    sortable: true
  },
  {
    prop: 'entryDate',
    label: '进厂日期',
    width: 120,
    sortable: true
  },
  {
    prop: 'introducerName',
    label: '介绍人',
    width: 120,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'introducerPhone',
    label: '介绍人手机号',
    width: 140,
    sortable: true,
    showTooltip: true
  },
  {
    prop: 'rewardAmount',
    label: '奖励金额',
    width: 120,
    sortable: true,
    align: 'right'
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    prop: 'payTime',
    label: '发放时间',
    width: 180,
    sortable: true
  }
])

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const map: Record<string, any> = {
    'pending': 'warning',
    'paid': 'success'
  }
  return map[status] || 'info'
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await getReferralRewardList(queryParams.value)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.value.page = 1
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.value.startDate = dateRange.value[0]
    queryParams.value.endDate = dateRange.value[1]
  } else {
    queryParams.value.startDate = ''
    queryParams.value.endDate = ''
  }
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.value = {
    page: 1,
    pageSize: 10,
    keyword: '',
    status: '',
    startDate: '',
    endDate: ''
  }
  dateRange.value = null
  loadData()
}

// 分页变化
const handlePageChange = (page: number) => {
  queryParams.value.page = page
  loadData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  queryParams.value.pageSize = size
  queryParams.value.page = 1
  loadData()
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  if (sort.prop) {
    queryParams.value.sortField = sort.prop
    queryParams.value.sortOrder = sort.order === 'ascending' ? 'asc' : 'desc'
  } else {
    queryParams.value.sortField = undefined
    queryParams.value.sortOrder = undefined
  }
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: ReferralReward[]) => {
  selectedRows.value = selection
}

// 查看详情
const handleDetail = (row: ReferralReward) => {
  console.log('查看详情:', row)
  ElMessage.info('详情功能待实现')
}

// 发放奖励
const handlePay = async (row: ReferralReward) => {
  try {
    await ElMessageBox.confirm(
      `确认发放奖励 ¥${row.rewardAmount}?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    paying.value = true
    const res = await payReferralReward({ ids: [row.id], remark: '' })
    if (res.code === 200) {
      ElMessage.success('奖励发放成功')
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发放奖励失败:', error)
      ElMessage.error('发放奖励失败')
    }
  } finally {
    paying.value = false
  }
}

// 批量发放
const handleBatchPay = () => {
  const totalAmount = selectedRows.value.reduce((sum, item) => sum + item.rewardAmount, 0)
  payForm.value = {
    ids: selectedRows.value.map(item => item.id),
    amount: totalAmount,
    count: selectedRows.value.length,
    remark: ''
  }
  payDialogVisible.value = true
}

// 确认发放
const handleConfirmPay = async () => {
  try {
    paying.value = true
    const res = await batchPayReferralReward({
      ids: payForm.value.ids,
      remark: payForm.value.remark
    })
    if (res.code === 200) {
      ElMessage.success('批量奖励发放成功')
      payDialogVisible.value = false
      loadData()
    }
  } catch (error) {
    console.error('批量发放失败:', error)
    ElMessage.error('批量发放失败')
  } finally {
    paying.value = false
  }
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-pull-new-reward-page {
  padding: 0;
}

.search-card {
  margin-bottom: 16px;
}

.search-card :deep(.el-form-item) {
  margin-bottom: 0;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-bar-left {
  display: flex;
  gap: 12px;
}

.action-bar-right {
  display: flex;
  gap: 12px;
}

.table-card {
  margin-bottom: 20px;
}

.amount {
  color: #f56c6c;
  font-weight: 600;
}
</style>
