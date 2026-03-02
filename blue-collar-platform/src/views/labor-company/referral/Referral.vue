<template>
  <div class="referral-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="被介绍人">
          <el-input v-model="searchForm.workerName" placeholder="请输入被介绍人姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="介绍人">
          <el-input v-model="searchForm.referrerName" placeholder="请输入介绍人姓名" clearable />
        </el-form-item>
        <el-form-item label="介绍日期">
          <el-date-picker
            v-model="searchForm.referralDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar-section">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增转介绍
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button @click="handleRuleConfig">
        <el-icon><Setting /></el-icon>
        佣金规则配置
      </el-button>
    </div>

    <!-- 表格区域 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      table-id="referral-list"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">详情</el-button>
        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Setting } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

// 路由
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  workerName: '',
  phone: '',
  referralDate: [] as string[],
  referrerName: ''
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref<any[]>([])

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'workerName', label: '被介绍人', minWidth: 100, sortable: true },
  { prop: 'phone', label: '手机号', minWidth: 120, sortable: true },
  { prop: 'idCard', label: '身份证号', minWidth: 180 },
  { prop: 'factory', label: '工厂', minWidth: 150 },
  { prop: 'position', label: '岗位', minWidth: 100 },
  { prop: 'referralDate', label: '介绍日期', minWidth: 120, sortable: true },
  { prop: 'entryDate', label: '进厂日期', minWidth: 120, sortable: true },
  { prop: 'referrerName', label: '介绍人', minWidth: 100 },
  { prop: 'referrerPhone', label: '介绍人手机号', minWidth: 120 },
  {
    prop: 'commissionStatus',
    label: '佣金状态',
    minWidth: 100,
    formatter: (value: string) => {
      const statusMap: Record<string, { text: string; type: string }> = {
        pending: { text: '待发放', type: 'info' },
        partial: { text: '部分发放', type: 'warning' },
        completed: { text: '已发放完成', type: 'success' }
      }
      return statusMap[value] || value
    }
  },
  { prop: 'totalCommission', label: '已发佣金(元)', minWidth: 120, sortable: true }
]

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟数据
    const mockData = [
      {
        id: 1,
        workerName: '张三',
        phone: '13800138001',
        idCard: '110101199001011234',
        factory: '富士康科技集团',
        position: '操作工',
        referralDate: '2026-01-15',
        entryDate: '2026-01-20',
        referrerName: '李四',
        referrerPhone: '13800138002',
        commissionStatus: 'completed',
        totalCommission: 1500
      },
      {
        id: 2,
        workerName: '王五',
        phone: '13800138003',
        idCard: '110101199003031234',
        factory: '华为技术有限公司',
        position: '质检员',
        referralDate: '2026-01-18',
        entryDate: '2026-01-25',
        referrerName: '赵六',
        referrerPhone: '13800138004',
        commissionStatus: 'partial',
        totalCommission: 500
      },
      {
        id: 3,
        workerName: '孙七',
        phone: '13800138005',
        idCard: '110101199005051234',
        factory: '比亚迪股份有限公司',
        position: '装配工',
        referralDate: '2026-02-01',
        entryDate: '2026-02-10',
        referrerName: '周八',
        referrerPhone: '13800138006',
        commissionStatus: 'pending',
        totalCommission: 0
      },
      {
        id: 4,
        workerName: '吴九',
        phone: '13800138007',
        idCard: '110101199007071234',
        factory: '特斯拉上海工厂',
        position: '生产操作员',
        referralDate: '2026-02-05',
        entryDate: '2026-02-15',
        referrerName: '郑十',
        referrerPhone: '13800138008',
        commissionStatus: 'partial',
        totalCommission: 300
      }
    ]

    // 筛选
    let filteredData = [...mockData]
    if (searchForm.workerName) {
      filteredData = filteredData.filter(item => item.workerName.includes(searchForm.workerName))
    }
    if (searchForm.phone) {
      filteredData = filteredData.filter(item => item.phone.includes(searchForm.phone))
    }
    if (searchForm.referrerName) {
      filteredData = filteredData.filter(item => item.referrerName.includes(searchForm.referrerName))
    }

    tableData.value = filteredData
    total.value = filteredData.length
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.workerName = ''
  searchForm.phone = ''
  searchForm.referralDate = []
  searchForm.referrerName = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  router.push({ name: 'LaborCompanyReferralAdd' })
}

// 编辑
const handleEdit = (row: any) => {
  router.push({ name: 'LaborCompanyReferralEdit', params: { id: row.id } })
}

// 详情
const handleView = (row: any) => {
  router.push({ name: 'LaborCompanyReferralDetail', params: { id: row.id } })
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该转介绍记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 佣金规则配置
const handleRuleConfig = () => {
  router.push({ name: 'LaborCompanyCommissionRule' })
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string }) => {
  console.log('排序变化:', sort)
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.referral-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.search-section {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toolbar-section {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
</style>
