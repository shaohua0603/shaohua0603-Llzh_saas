<template>
  <div class="labor-company-messages">
    <CommonTable
      :data="tableData"
      :columns="columns"
      table-id="labor-company-messages"
      :loading="loading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @sort-change="handleSortChange"
      @global-search="handleSearch"
      @row-click="handleRowClick"
    >
      <template #toolbar-left>
        <el-select
          v-model="filters.type"
          placeholder="消息类型"
          clearable
          style="width: 150px"
          @change="handleFilterChange"
        >
          <el-option label="全部" value="" />
          <el-option label="系统通知" value="system" />
          <el-option label="业务通知" value="business" />
          <el-option label="审批通知" value="approval" />
          <el-option label="预警通知" value="warning" />
        </el-select>
        <el-select
          v-model="filters.readStatus"
          placeholder="阅读状态"
          clearable
          style="width: 150px"
          @change="handleFilterChange"
        >
          <el-option label="全部" value="" />
          <el-option label="未读" value="unread" />
          <el-option label="已读" value="read" />
        </el-select>
      </template>

      <template #toolbar-right>
        <el-button @click="handleMarkAllRead" :disabled="!hasUnread">
          <el-icon><Check /></el-icon>
          全部标为已读
        </el-button>
        <el-button @click="handleDeleteRead" :disabled="!hasRead">
          <el-icon><Delete /></el-icon>
          删除已读
        </el-button>
      </template>

      <template #column-readStatus="{ row }">
        <el-tag :type="row.readStatus === 'unread' ? 'danger' : 'info'" size="small">
          {{ row.readStatus === 'unread' ? '未读' : '已读' }}
        </el-tag>
      </template>

      <template #column-type="{ row }">
        <el-tag :type="getTypeType(row.type)">
          {{ getTypeText(row.type) }}
        </el-tag>
      </template>

      <template #column-title="{ row }">
        <div class="message-title">
          <span v-if="row.readStatus === 'unread'" class="unread-dot"></span>
          {{ row.title }}
        </div>
      </template>

      <template #actions="{ row }">
        <el-button
          type="primary"
          size="small"
          link
          @click.stop="handleViewDetail(row)"
        >
          查看
        </el-button>
        <el-button
          v-if="row.readStatus === 'unread'"
          type="success"
          size="small"
          link
          @click.stop="handleMarkRead(row)"
        >
          标为已读
        </el-button>
        <el-button
          type="danger"
          size="small"
          link
          @click.stop="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Delete } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/types/common-table'

const router = useRouter()

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'messageNo', label: '消息编号', width: 150, sortable: true },
  { prop: 'title', label: '消息标题', minWidth: 200, sortable: true },
  { prop: 'type', label: '消息类型', width: 120, sortable: true },
  { prop: 'sender', label: '发送人', width: 100, sortable: true },
  { prop: 'readStatus', label: '阅读状态', width: 100, sortable: true },
  { prop: 'sendTime', label: '发送时间', width: 160, sortable: true }
]

// 响应式数据
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选条件
const filters = reactive({
  type: '',
  readStatus: '',
  keyword: ''
})

// 排序条件
const sortConfig = reactive({
  prop: '',
  order: ''
})

// 是否有未读消息
const hasUnread = computed(() => {
  return tableData.value.some(item => item.readStatus === 'unread')
})

// 是否有已读消息
const hasRead = computed(() => {
  return tableData.value.some(item => item.readStatus === 'read')
})

// 获取消息列表
const fetchMessageList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock数据
    const mockData = [
      {
        id: 1,
        messageNo: 'MSG202602250001',
        title: '系统维护通知',
        type: 'system',
        sender: '系统管理员',
        readStatus: 'unread',
        sendTime: '2026-02-25 08:00:00',
        content: '系统将于2026-02-26 02:00-04:00进行维护,请提前做好相关准备。',
        businessType: '',
        businessId: ''
      },
      {
        id: 2,
        messageNo: 'MSG202602250002',
        title: '张三请假审批通过',
        type: 'approval',
        sender: '系统',
        readStatus: 'unread',
        sendTime: '2026-02-25 09:30:00',
        content: '张三的请假申请已通过审批。',
        businessType: 'leave',
        businessId: '1'
      },
      {
        id: 3,
        messageNo: 'MSG202602240001',
        title: '新工人入职通知',
        type: 'business',
        sender: '人事部',
        readStatus: 'read',
        sendTime: '2026-02-24 14:00:00',
        content: '新工人李四已办理入职手续,请安排相关工作。',
        businessType: 'worker',
        businessId: '1'
      },
      {
        id: 4,
        messageNo: 'MSG202602240002',
        title: '工人数量预警',
        type: 'warning',
        sender: '系统',
        readStatus: 'read',
        sendTime: '2026-02-24 15:00:00',
        content: '生产部工人数量不足,请及时补充。',
        businessType: 'warning',
        businessId: '1'
      },
      {
        id: 5,
        messageNo: 'MSG202602230001',
        title: '合同到期提醒',
        type: 'warning',
        sender: '系统',
        readStatus: 'read',
        sendTime: '2026-02-23 10:00:00',
        content: '王五的合同将于2026-03-01到期,请及时处理。',
        businessType: 'contract',
        businessId: '1'
      }
    ]

    // 应用筛选
    let filteredData = mockData
    if (filters.type) {
      filteredData = filteredData.filter(item => item.type === filters.type)
    }
    if (filters.readStatus) {
      filteredData = filteredData.filter(item => item.readStatus === filters.readStatus)
    }
    if (filters.keyword) {
      filteredData = filteredData.filter(item =>
        item.title.includes(filters.keyword) ||
        item.messageNo.includes(filters.keyword) ||
        item.content.includes(filters.keyword)
      )
    }

    // 应用排序
    if (sortConfig.prop && sortConfig.order) {
      filteredData.sort((a, b) => {
        const aVal = a[sortConfig.prop]
        const bVal = b[sortConfig.prop]
        if (sortConfig.order === 'ascending') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }

    total.value = filteredData.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredData.slice(start, end)
  } catch (error) {
    ElMessage.error('获取消息列表失败')
  } finally {
    loading.value = false
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchMessageList()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchMessageList()
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  sortConfig.prop = sort.prop
  sortConfig.order = sort.order || ''
  fetchMessageList()
}

// 搜索
const handleSearch = (keyword: string) => {
  filters.keyword = keyword
  currentPage.value = 1
  fetchMessageList()
}

// 筛选变化
const handleFilterChange = () => {
  currentPage.value = 1
  fetchMessageList()
}

// 行点击
const handleRowClick = (row: any) => {
  handleViewDetail(row)
}

// 查看
const handleViewDetail = (row: any) => {
  // 标记为已读
  if (row.readStatus === 'unread') {
    handleMarkRead(row)
  }
  router.push(`/tenant/message-detail/${row.id}`)
}

// 标记为已读
const handleMarkRead = (row: any) => {
  // 模拟API调用
  row.readStatus = 'read'
  ElMessage.success('已标记为已读')
}

// 全部标为已读
const handleMarkAllRead = () => {
  ElMessageBox.confirm('确定要将所有未读消息标记为已读吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    tableData.value.forEach(item => {
      if (item.readStatus === 'unread') {
        item.readStatus = 'read'
      }
    })
    ElMessage.success('已全部标记为已读')
  }).catch(() => {})
}

// 删除消息
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除这条消息吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value--
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 删除已读
const handleDeleteRead = () => {
  ElMessageBox.confirm('确定要删除所有已读消息吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    const readCount = tableData.value.filter(item => item.readStatus === 'read').length
    tableData.value = tableData.value.filter(item => item.readStatus === 'unread')
    total.value -= readCount
    ElMessage.success(`已删除${readCount}条已读消息`)
  }).catch(() => {})
}

// 获取类型类型
const getTypeType = (type: string) => {
  const typeMap: Record<string, string> = {
    system: 'info',
    business: 'primary',
    approval: 'success',
    warning: 'danger'
  }
  return typeMap[type] || 'info'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    system: '系统通知',
    business: '业务通知',
    approval: '审批通知',
    warning: '预警通知'
  }
  return textMap[type] || '未知'
}

// 生命周期
onMounted(() => {
  fetchMessageList()
})
</script>

<style scoped>
.labor-company-messages {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unread-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #f56c6c;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
