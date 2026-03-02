<template>
  <div class="admin-referral-page">
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
            <el-option label="待进厂" value="pending" />
            <el-option label="已进厂" value="employed" />
            <el-option label="已离职" value="left" />
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
        <el-button type="primary" @click="handleConfig">
          <el-icon><Setting /></el-icon>
          配置规则
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
        :show-selection="false"
        :show-index="true"
        :show-toolbar="true"
        :show-pagination="true"
        @update:current-page="handlePageChange"
        @update:page-size="handleSizeChange"
        @sort-change="handleSortChange"
      >
        <template #column-commissionPaid="{ row }">
          <span :class="{ 'text-success': row.commissionPaid > 0 }">
            ¥{{ row.commissionPaid }}
          </span>
        </template>
        <template #column-status="{ row }">
          <el-tag :type="getStatusTag(row.status)">{{ row.statusText }}</el-tag>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">
            详情
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 佣金规则配置弹窗 -->
    <el-dialog
      v-model="configDialogVisible"
      title="佣金规则配置"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form :model="commissionRule" label-width="140px">
        <el-form-item label="发放要求">
          <div class="rule-form">
            <span>进厂天数满</span>
            <el-input-number
              v-model="commissionRule.daysRequired"
              :min="1"
              :max="365"
            />
            <span>天</span>
          </div>
        </el-form-item>
        <el-divider content-position="left">日结方式</el-divider>
        <el-form-item label="第一次发放金额">
          <el-input-number
            v-model="commissionRule.daily.firstAmount"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="第二次发放金额">
          <el-input-number
            v-model="commissionRule.daily.secondAmount"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="第三次发放金额">
          <el-input-number
            v-model="commissionRule.daily.thirdAmount"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="后续每次发放">
          <el-input-number
            v-model="commissionRule.daily.subsequentAmount"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-divider content-position="left">月结方式</el-divider>
        <el-form-item label="第一次发放金额">
          <el-input-number
            v-model="commissionRule.monthly.firstAmount"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="第二次发放金额">
          <el-input-number
            v-model="commissionRule.monthly.secondAmount"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="第三次发放金额">
          <el-input-number
            v-model="commissionRule.monthly.thirdAmount"
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="后续每次发放">
          <el-input-number
            v-model="commissionRule.monthly.subsequentAmount"
            :min="0"
            :precision="2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveConfig" :loading="saving">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Setting } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import { getJobReferralList, getCommissionRule, updateCommissionRule } from '@/api/settlementApi'
import type { JobReferral, JobReferralQueryParams, CommissionRule, CommissionRuleFormData } from '@/types/settlementTypes'

// 表格ID
const tableId = 'admin-job-referral'

// 查询参数
const queryParams = ref<JobReferralQueryParams>({
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
const tableData = ref<JobReferral[]>([])
const total = ref(0)
const loading = ref(false)

// 规则配置
const configDialogVisible = ref(false)
const saving = ref(false)
const commissionRule = ref<CommissionRuleFormData>({
  daysRequired: 30,
  daily: {
    firstAmount: 100,
    secondAmount: 100,
    thirdAmount: 100,
    subsequentAmount: 50
  },
  monthly: {
    firstAmount: 200,
    secondAmount: 200,
    thirdAmount: 200,
    subsequentAmount: 100
  }
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
    prop: 'commissionPaid',
    label: '已发佣金',
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
  }
])

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const map: Record<string, any> = {
    'pending': 'warning',
    'employed': 'success',
    'left': 'info'
  }
  return map[status] || 'info'
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await getJobReferralList(queryParams.value)
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

// 查看详情
const handleDetail = (row: JobReferral) => {
  console.log('查看详情:', row)
  ElMessage.info('详情功能待实现')
}

// 配置规则
const handleConfig = async () => {
  try {
    const res = await getCommissionRule()
    if (res.code === 200) {
      commissionRule.value = {
        daysRequired: res.data.daysRequired,
        daily: res.data.daily,
        monthly: res.data.monthly
      }
      configDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取规则配置失败:', error)
    ElMessage.error('获取规则配置失败')
  }
}

// 保存规则配置
const handleSaveConfig = async () => {
  try {
    saving.value = true
    const res = await updateCommissionRule(commissionRule.value)
    if (res.code === 200) {
      ElMessage.success('规则配置保存成功')
      configDialogVisible.value = false
    }
  } catch (error) {
    console.error('保存规则配置失败:', error)
    ElMessage.error('保存规则配置失败')
  } finally {
    saving.value = false
  }
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-referral-page {
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

.rule-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.text-success {
  color: #67c23a;
  font-weight: 600;
}
</style>
