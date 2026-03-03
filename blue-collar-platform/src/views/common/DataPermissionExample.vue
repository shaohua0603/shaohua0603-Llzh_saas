<template>
  <div class="data-permission-example">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据权限示例 - 工人信息</span>
          <div>
            <el-button @click="handleRefreshPermission">刷新权限</el-button>
            <el-button @click="handleShowPermissionInfo">查看权限</el-button>
          </div>
        </div>
      </template>

      <!-- 权限信息展示 -->
      <el-alert
        v-if="permissionInfo"
        :title="permissionInfo"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      />

      <!-- 工人信息表格 -->
      <CommonTable
        :columns="columns"
        :data="filteredWorkers"
        :loading="loading"
        :pagination="pagination"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #column-actions="{ row }">
          <el-button type="primary" size="small" @click="handleViewDetail(row)">
            查看
          </el-button>
          <el-button
            v-if="canEdit(row)"
            type="warning"
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="canDelete(row)"
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </CommonTable>
    </el-card>

    <!-- 权限信息对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="当前数据权限"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">
          {{ userDataPermission?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ userDataPermission?.departmentName }}
        </el-descriptions-item>
        <el-descriptions-item label="岗位">
          {{ userDataPermission?.positionName }}
        </el-descriptions-item>
        <el-descriptions-item label="权限类型">
          <el-tag :type="getPermissionTypeTag(userDataPermission?.dataPermission?.type)">
            {{ permissionTypeDescription }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="特殊权限">
          <el-tag v-if="userDataPermission?.dataPermission?.includeCreator" type="info" style="margin-right: 10px">
            包含创建人
          </el-tag>
          <el-tag v-if="userDataPermission?.dataPermission?.includeManager" type="info" style="margin-right: 10px">
            包含负责人
          </el-tag>
          <el-tag v-if="userDataPermission?.dataPermission?.includeContact" type="info">
            包含对接人
          </el-tag>
          <span v-if="!hasSpecialPermission" style="color: #909399">无</span>
        </el-descriptions-item>
        <el-descriptions-item label="权限范围">
          {{ permissionRange }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import { useDataPermission } from '@/composables/useDataPermission'
import type { ColumnConfig } from '@/types/common-table'

/**
 * 数据权限Composable
 */
const {
  userDataPermission,
  isAdmin,
  currentUserId,
  currentDepartmentId,
  currentDataPermission,
  permissionTypeDescription,
  hasSpecialPermission,
  loading: permissionLoading,
  refresh,
  hasPermission,
  filterData,
  getDepartmentName,
  getAllChildDepartmentIds
} = useDataPermission()

/**
 * 工人信息数据
 */
const workers = ref<any[]>([])

/**
 * 过滤后的工人信息
 */
const filteredWorkers = computed(() => {
  if (isAdmin.value) {
    return workers.value
  }
  return filterData(workers.value)
})

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 分页信息
 */
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

/**
 * 权限信息
 */
const permissionInfo = computed(() => {
  if (!userDataPermission.value) return ''

  const typeDesc = permissionTypeDescription.value
  const specialPerms: string[] = []

  if (hasSpecialPermission.value) {
    if (userDataPermission.value.dataPermission?.includeCreator) {
      specialPerms.push('创建人')
    }
    if (userDataPermission.value.dataPermission?.includeManager) {
      specialPerms.push('负责人')
    }
    if (userDataPermission.value.dataPermission?.includeContact) {
      specialPerms.push('对接人')
    }
  }

  const specialDesc = specialPerms.length > 0 ? `（${specialPerms.join('、')}）` : ''
  return `当前权限：${typeDesc}${specialDesc}`
})

/**
 * 权限范围
 */
const permissionRange = computed(() => {
  if (!currentDataPermission.value || !userDataPermission.value) return ''

  const config = currentDataPermission.value
  const deptId = userDataPermission.value.departmentId

  switch (config.type) {
    case 'ALL':
      return '所有部门的所有数据'
    case 'DEPARTMENT':
      return `仅 ${getDepartmentName(deptId)} 的数据`
    case 'DEPARTMENT_AND_BELOW':
      const childDepts = getAllChildDepartmentIds(deptId)
      const deptNames = childDepts.map(id => getDepartmentName(id)).filter(Boolean)
      return `${getDepartmentName(deptId)} 及其子部门（${deptNames.join('、')}）的数据`
    case 'SELF':
      return '仅本人创建/负责/对接的数据'
    case 'CUSTOM':
      if (config.departments && config.departments.length > 0) {
        const deptNames = config.departments.map(id => getDepartmentName(id)).filter(Boolean)
        return `自定义部门（${deptNames.join('、')}）的数据`
      }
      return '未配置部门'
    default:
      return ''
  }
})

/**
 * 权限对话框
 */
const permissionDialogVisible = ref(false)

/**
 * 表格列配置
 */
const columns: ColumnConfig[] = [
  {
    prop: 'name',
    label: '姓名',
    width: 120,
    sortable: true
  },
  {
    prop: 'phone',
    label: '手机号',
    width: 150
  },
  {
    prop: 'departmentName',
    label: '部门',
    width: 150
  },
  {
    prop: 'positionName',
    label: '岗位',
    width: 120
  },
  {
    prop: 'creatorName',
    label: '创建人',
    width: 120
  },
  {
    prop: 'managerName',
    label: '负责人',
    width: 120
  },
  {
    prop: 'contactName',
    label: '对接人',
    width: 120
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    formatter: (row: any) => {
      const statusMap: Record<string, string> = {
        active: '在职',
        inactive: '离职',
        pending: '待入职'
      }
      return statusMap[row.status] || row.status
    }
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: 180,
    formatter: (row: any) => {
      return new Date(row.createdAt).toLocaleString('zh-CN')
    }
  },
  {
    prop: 'actions',
    label: '操作',
    width: 200,
    fixed: 'right'
  }
]

/**
 * 获取权限类型标签样式
 */
const getPermissionTypeTag = (type?: string) => {
  const tagMap: Record<string, any> = {
    ALL: 'danger',
    DEPARTMENT: 'warning',
    DEPARTMENT_AND_BELOW: 'primary',
    SELF: 'info',
    CUSTOM: 'success'
  }
  return tagMap[type || ''] || ''
}

/**
 * 检查是否可以编辑
 */
const canEdit = (row: any): boolean => {
  if (isAdmin.value) return true
  return hasPermission(row)
}

/**
 * 检查是否可以删除
 */
const canDelete = (row: any): boolean => {
  if (isAdmin.value) return true
  // 只有创建人或负责人可以删除
  return row.creatorId === currentUserId.value || row.managerId === currentUserId.value
}

/**
 * 加载工人信息
 */
const loadWorkers = async () => {
  loading.value = true
  try {
    // 这里应该调用真实的API
    // const response = await api.getWorkers({
    //   page: pagination.value.page,
    //   pageSize: pagination.value.pageSize,
    //   ...generateFilter()
    // })

    // 使用Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockWorkers = [
      {
        id: 'w001',
        name: '张三',
        phone: '13800138001',
        departmentId: 'dept001',
        departmentName: '人力资源部',
        positionName: '人事专员',
        creatorId: 'user001',
        creatorName: '李四',
        managerId: 'user002',
        managerName: '王五',
        contactId: 'user003',
        contactName: '赵六',
        status: 'active',
        createdAt: '2026-02-01T00:00:00.000Z'
      },
      {
        id: 'w002',
        name: '李四',
        phone: '13800138002',
        departmentId: 'dept001-1',
        departmentName: '招聘组',
        positionName: '招聘专员',
        creatorId: 'user001',
        creatorName: '李四',
        managerId: 'user002',
        managerName: '王五',
        contactId: 'user003',
        contactName: '赵六',
        status: 'active',
        createdAt: '2026-02-02T00:00:00.000Z'
      },
      {
        id: 'w003',
        name: '王五',
        phone: '13800138003',
        departmentId: 'dept002',
        departmentName: '财务部',
        positionName: '会计',
        creatorId: 'user004',
        creatorName: '孙七',
        managerId: 'user005',
        managerName: '周八',
        contactId: 'user006',
        contactName: '吴九',
        status: 'active',
        createdAt: '2026-02-03T00:00:00.000Z'
      }
    ]

    workers.value = mockWorkers
    pagination.value.total = mockWorkers.length
  } catch (error) {
    console.error('加载工人信息失败:', error)
    ElMessage.error('加载工人信息失败')
  } finally {
    loading.value = false
  }
}

/**
 * 页码变化
 */
const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadWorkers()
}

/**
 * 每页条数变化
 */
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  loadWorkers()
}

/**
 * 查看
 */
const handleViewDetail = (row: any) => {
  ElMessageBox.alert(
    `
    <div style="text-align: left">
      <p><strong>姓名：</strong>${row.name}</p>
      <p><strong>手机号：</strong>${row.phone}</p>
      <p><strong>部门：</strong>${row.departmentName}</p>
      <p><strong>岗位：</strong>${row.positionName}</p>
      <p><strong>创建人：</strong>${row.creatorName}</p>
      <p><strong>负责人：</strong>${row.managerName}</p>
      <p><strong>对接人：</strong>${row.contactName}</p>
      <p><strong>状态：</strong>${row.status}</p>
      <p><strong>创建时间：</strong>${new Date(row.createdAt).toLocaleString('zh-CN')}</p>
    </div>
    `,
    '工人详情',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭'
    }
  )
}

/**
 * 编辑
 */
const handleEdit = (row: any) => {
  ElMessage.info(`编辑工人：${row.name}`)
  // 跳转到编辑页面
}

/**
 * 删除
 */
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除工人 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除API
    ElMessage.success('删除成功')
    loadWorkers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 刷新权限
 */
const handleRefreshPermission = async () => {
  try {
    await refresh()
    ElMessage.success('权限已刷新')
  } catch (error) {
    console.error('刷新权限失败:', error)
    ElMessage.error('刷新权限失败')
  }
}

/**
 * 查看权限信息
 */
const handleShowPermissionInfo = () => {
  permissionDialogVisible.value = true
}

/**
 * 初始化
 */
onMounted(async () => {
  // 初始化数据权限
  await refresh()
  // 加载工人信息
  loadWorkers()
})
</script>

<style scoped>
.data-permission-example {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
