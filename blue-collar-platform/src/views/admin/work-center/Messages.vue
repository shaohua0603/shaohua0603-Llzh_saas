<template>
  <div class="admin-messages-page">
    <!-- 查询条件区域 -->
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="消息类型">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择消息类型"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in messageTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="阅读状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择阅读状态"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select
            v-model="queryParams.priority"
            placeholder="请选择优先级"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleMarkAllAsRead">
        全部标记已读
      </el-button>
      <el-button type="success" @click="handleBatchMarkAsRead">
        批量标记已读
      </el-button>
      <el-button type="warning" @click="handleBatchMarkAsUnread">
        批量标记未读
      </el-button>
      <el-button type="danger" @click="handleBatchDelete">
        批量删除
      </el-button>
    </div>

    <!-- 表格区域 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="admin-messages"
      :loading="loading"
      :total="total"
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      @global-search="handleGlobalSearch"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 消息类型列 -->
      <template #column-type="{ row }">
        <el-tag :type="getTypeTag(row.type)">{{ row.typeName }}</el-tag>
      </template>

      <!-- 优先级列 -->
      <template #column-priority="{ row }">
        <el-tag :type="getPriorityTag(row.priority)">{{ row.priorityName }}</el-tag>
      </template>

      <!-- 阅读状态列 -->
      <template #column-status="{ row }">
        <el-tag :type="getStatusTag(row.status)">{{ row.statusName }}</el-tag>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">查看</el-button>
        <el-button
          v-if="row.status === 'unread'"
          type="success"
          link
          @click="handleMarkAsRead(row)"
        >
          标记已读
        </el-button>
        <el-button
          v-if="row.status === 'read'"
          type="warning"
          link
          @click="handleMarkAsUnread(row)"
        >
          标记未读
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </CommonTable>

    <!-- 消息详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="消息详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentMessage" :column="2" border>
        <el-descriptions-item label="消息标题" :span="2">
          {{ currentMessage.title }}
        </el-descriptions-item>
        <el-descriptions-item label="消息类型">
          <el-tag :type="getTypeTag(currentMessage.type)">
            {{ currentMessage.typeName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityTag(currentMessage.priority)">
            {{ currentMessage.priorityName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发送人">
          {{ currentMessage.sender }}
        </el-descriptions-item>
        <el-descriptions-item label="发送时间">
          {{ currentMessage.sendTime }}
        </el-descriptions-item>
        <el-descriptions-item label="阅读状态">
          <el-tag :type="getStatusTag(currentMessage.status)">
            {{ currentMessage.statusName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="阅读时间" v-if="currentMessage.readTime">
          {{ currentMessage.readTime }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentMessage.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="消息内容" :span="2">
          <div class="message-content">{{ currentMessage.content }}</div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="currentMessage && currentMessage.status === 'unread'"
          type="primary"
          @click="handleMarkAsReadFromDetail"
        >
          标记已读
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '@/components/CommonTable.vue'
import {
  getMessageList,
  getMessageDetail,
  markMessageAsRead,
  markMessageAsUnread,
  batchMarkMessagesAsRead,
  batchDeleteMessages,
  markAllMessagesAsRead,
} from '@/api/workCenterApi'
import type {
  Message,
  MessageQueryParams,
  MessageType,
  MessagePriority,
  MessageStatus,
} from '@/types/work-center'

// 响应式数据
const tableRef = ref()
const loading = ref(false)
const tableData = ref<Message[]>([])
const total = ref(0)
const selectedRows = ref<Message[]>([])
const detailVisible = ref(false)
const currentMessage = ref<Message | null>(null)
const dateRange = ref<[string, string] | null>(null)

// 查询参数
const queryParams = reactive<MessageQueryParams>({
  page: 1,
  pageSize: 10,
  type: undefined,
  status: undefined,
  priority: undefined,
  keyword: undefined,
  sortField: undefined,
  sortOrder: undefined,
})

// 表格列配置
const columns: ColumnConfig[] = [
  {
    prop: 'title',
    label: '消息标题',
    minWidth: 200,
    sortable: true,
    showTooltip: true,
  },
  {
    prop: 'type',
    label: '消息类型',
    width: 120,
    sortable: true,
  },
  {
    prop: 'content',
    label: '消息内容',
    minWidth: 300,
    showTooltip: true,
  },
  {
    prop: 'sender',
    label: '发送人',
    width: 120,
    sortable: true,
  },
  {
    prop: 'priority',
    label: '优先级',
    width: 100,
    sortable: true,
  },
  {
    prop: 'status',
    label: '阅读状态',
    width: 100,
    sortable: true,
  },
  {
    prop: 'sendTime',
    label: '发送时间',
    width: 180,
    sortable: true,
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    sortable: true,
  },
]

// 消息类型选项
const messageTypeOptions = [
  { label: '系统通知', value: 'system' as MessageType },
  { label: '功能通知', value: 'feature' as MessageType },
  { label: '政策通知', value: 'policy' as MessageType },
  { label: '培训通知', value: 'training' as MessageType },
  { label: '业务通知', value: 'business' as MessageType },
]

// 优先级选项
const priorityOptions = [
  { label: '高', value: 'high' as MessagePriority },
  { label: '中', value: 'medium' as MessagePriority },
  { label: '低', value: 'low' as MessagePriority },
]

// 状态选项
const statusOptions = [
  { label: '未读', value: 'unread' as MessageStatus },
  { label: '已读', value: 'read' as MessageStatus },
]

// 获取消息类型标签类型
const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    system: 'info',
    feature: 'success',
    policy: 'warning',
    training: 'primary',
    business: 'info',
  }
  return map[type] || 'info'
}

// 获取优先级标签类型
const getPriorityTag = (priority: string) => {
  const map: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
  }
  return map[priority] || 'info'
}

// 获取状态标签类型
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    unread: 'warning',
    read: 'success',
  }
  return map[status] || 'info'
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const params = { ...queryParams }
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    const response = await getMessageList(params)
    if (response.code === 200) {
      tableData.value = response.data.list
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
    ElMessage.error('获取消息列表失败')
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.type = undefined
  queryParams.status = undefined
  queryParams.priority = undefined
  queryParams.keyword = undefined
  dateRange.value = null
  queryParams.page = 1
  loadData()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  queryParams.keyword = keyword || undefined
  queryParams.page = 1
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: Message[]) => {
  selectedRows.value = selection
}

// 排序变化
const handleSortChange = (sort: { prop: string; order: string | null }) => {
  queryParams.sortField = sort.prop
  queryParams.sortOrder = sort.order === 'ascending' ? 'asc' : sort.order === 'descending' ? 'desc' : undefined
  loadData()
}

// 查看详情
const handleView = async (row: Message) => {
  try {
    const response = await getMessageDetail(row.id)
    if (response.code === 200) {
      currentMessage.value = response.data
      detailVisible.value = true
      // 如果是未读消息,自动标记为已读
      if (row.status === 'unread') {
        await handleMarkAsRead(row)
      }
    }
  } catch (error) {
    console.error('获取消息详情失败:', error)
    ElMessage.error('获取消息详情失败')
  }
}

// 标记已读
const handleMarkAsRead = async (row: Message) => {
  try {
    const response = await markMessageAsRead(row.id)
    if (response.code === 200) {
      ElMessage.success('标记已读成功')
      loadData()
    }
  } catch (error) {
    console.error('标记已读失败:', error)
    ElMessage.error('标记已读失败')
  }
}

// 从详情页标记已读
const handleMarkAsReadFromDetail = async () => {
  if (!currentMessage.value) return
  await handleMarkAsRead(currentMessage.value)
  detailVisible.value = false
}

// 标记未读
const handleMarkAsUnread = async (row: Message) => {
  try {
    const response = await markMessageAsUnread(row.id)
    if (response.code === 200) {
      ElMessage.success('标记未读成功')
      loadData()
    }
  } catch (error) {
    console.error('标记未读失败:', error)
    ElMessage.error('标记未读失败')
  }
}

// 全部标记已读
const handleMarkAllAsRead = async () => {
  try {
    const response = await markAllMessagesAsRead()
    if (response.code === 200) {
      ElMessage.success('全部标记已读成功')
      loadData()
    }
  } catch (error) {
    console.error('全部标记已读失败:', error)
    ElMessage.error('全部标记已读失败')
  }
}

// 批量标记已读
const handleBatchMarkAsRead = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要操作的消息')
    return
  }

  try {
    const ids = selectedRows.value.map(row => row.id)
    const response = await batchMarkMessagesAsRead({ ids })
    if (response.code === 200) {
      ElMessage.success('批量标记已读成功')
      tableRef.value?.clearSelection()
      loadData()
    }
  } catch (error) {
    console.error('批量标记已读失败:', error)
    ElMessage.error('批量标记已读失败')
  }
}

// 批量标记未读
const handleBatchMarkAsUnread = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要操作的消息')
    return
  }

  try {
    const ids = selectedRows.value.map(row => row.id)
    for (const id of ids) {
      await markMessageAsUnread(id)
    }
    ElMessage.success('批量标记未读成功')
    tableRef.value?.clearSelection()
    loadData()
  } catch (error) {
    console.error('批量标记未读失败:', error)
    ElMessage.error('批量标记未读失败')
  }
}

// 删除消息
const handleDelete = (row: Message) => {
  ElMessageBox.confirm('确定要删除该消息吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const response = await batchDeleteMessages([row.id])
      if (response.code === 200) {
        ElMessage.success('删除成功')
        loadData()
      }
    } catch (error) {
      console.error('删除消息失败:', error)
      ElMessage.error('删除消息失败')
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的消息')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}条消息吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const ids = selectedRows.value.map(row => row.id)
      const response = await batchDeleteMessages(ids)
      if (response.code === 200) {
        ElMessage.success('批量删除成功')
        tableRef.value?.clearSelection()
        loadData()
      }
    } catch (error) {
      console.error('批量删除消息失败:', error)
      ElMessage.error('批量删除消息失败')
    }
  }).catch(() => {})
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-messages-page {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-content {
  white-space: pre-wrap;
  line-height: 1.6;
  max-height: 300px;
  overflow-y: auto;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .admin-messages-page {
    padding: 10px;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-bar .el-button {
    width: 100%;
  }
}
</style>
