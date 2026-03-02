<template>
  <div class="data-permission-page">
    <el-card class="permission-info-card">
      <template #header>
        <div class="card-header">
          <span>当前数据权限</span>
          <el-button type="primary" @click="handleEditPermission">编辑权限</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
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
            {{ getPermissionTypeDescription(userDataPermission?.dataPermission?.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="特殊权限" :span="2">
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
      </el-descriptions>
    </el-card>

    <el-card class="permission-statistics-card">
      <template #header>
        <span>权限统计</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-statistic title="总数据量" :value="statistics.total" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="可查看数据量" :value="statistics.accessible" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="权限覆盖率" :value="coverageRate" suffix="%" />
        </el-col>
      </el-row>
    </el-card>

    <el-card class="permission-application-card">
      <template #header>
        <div class="card-header">
          <span>权限申请记录</span>
          <el-button type="primary" @click="handleApplyPermission">申请权限</el-button>
        </div>
      </template>

      <el-table :data="applications" v-loading="loading" stripe>
        <el-table-column prop="applicantName" label="申请人" width="120" />
        <el-table-column prop="permissionType" label="权限类型" width="150">
          <template #default="{ row }">
            <el-tag :type="getPermissionTypeTag(row.permissionType)">
              {{ getPermissionTypeDescription(row.permissionType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="申请原因" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="danger"
              size="small"
              @click="handleWithdraw(row.id)"
            >
              撤销
            </el-button>
            <el-button
              v-if="row.status === 'approved'"
              type="primary"
              size="small"
              @click="handleViewDetail(row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadApplications"
        @current-change="loadApplications"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 编辑权限对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑数据权限"
      width="600px"
      :close-on-click-modal="false"
    >
      <DataPermissionSelector
        v-if="editDialogVisible"
        :model-value="editingPermission"
        @save="handlePermissionSave"
        @cancel="editDialogVisible = false"
      />
    </el-dialog>

    <!-- 申请权限对话框 -->
    <el-dialog
      v-model="applyDialogVisible"
      title="申请数据权限"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="applicationForm" :rules="applicationRules" ref="applicationFormRef" label-width="120px">
        <el-form-item label="权限类型" prop="permissionType">
          <el-radio-group v-model="applicationForm.permissionType">
            <el-radio label="ALL">全部数据</el-radio>
            <el-radio label="DEPARTMENT">本部门数据</el-radio>
            <el-radio label="DEPARTMENT_AND_BELOW">本部门及以下</el-radio>
            <el-radio label="CUSTOM">自定义部门</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="applicationForm.permissionType === 'CUSTOM'"
          label="选择部门"
          prop="departments"
        >
          <el-tree
            ref="applyTreeRef"
            :data="departmentTree"
            :props="treeProps"
            show-checkbox
            node-key="id"
            @check="handleApplyDepartmentCheck"
            style="max-height: 300px; overflow-y: auto"
          />
        </el-form-item>

        <el-form-item label="申请原因" prop="reason">
          <el-input
            v-model="applicationForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入申请原因"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmitApplication">提交申请</el-button>
          <el-button @click="applyDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import DataPermissionSelector from '../components/DataPermissionSelector.vue'
import type { DataPermissionConfig, DataPermissionApplication, UserDataPermission, Department } from '../types/data-permission'
import DataPermissionUtil from '../utils/dataPermissionUtil'
import dataPermissionService from '../services/dataPermissionService'

/**
 * 用户数据权限
 */
const userDataPermission = ref<UserDataPermission | null>(null)

/**
 * 权限统计
 */
const statistics = ref({
  total: 1000,
  accessible: 500
})

/**
 * 权限覆盖率
 */
const coverageRate = computed(() => {
  if (statistics.value.total === 0) return 0
  return Math.round((statistics.value.accessible / statistics.value.total) * 100)
})

/**
 * 是否有特殊权限
 */
const hasSpecialPermission = computed(() => {
  const config = userDataPermission.value?.dataPermission
  return config?.includeCreator || config?.includeManager || config?.includeContact
})

/**
 * 申请记录列表
 */
const applications = ref<DataPermissionApplication[]>([])

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 分页信息
 */
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

/**
 * 编辑权限对话框
 */
const editDialogVisible = ref(false)
const editingPermission = ref<DataPermissionConfig | null>(null)

/**
 * 申请权限对话框
 */
const applyDialogVisible = ref(false)
const applicationFormRef = ref<FormInstance>()
const applyTreeRef = ref()

/**
 * 申请表单
 */
const applicationForm = reactive({
  permissionType: 'DEPARTMENT',
  departments: [] as string[],
  reason: ''
})

/**
 * 部门树数据
 */
const departmentTree = ref<Department[]>([])

/**
 * 树形选择器配置
 */
const treeProps = {
  children: 'children',
  label: 'name'
}

/**
 * 申请表单验证规则
 */
const applicationRules: FormRules = {
  permissionType: [
    { required: true, message: '请选择权限类型', trigger: 'change' }
  ],
  departments: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (applicationForm.permissionType === 'CUSTOM' && (!value || value.length === 0)) {
          callback(new Error('请至少选择一个部门'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  reason: [
    { required: true, message: '请输入申请原因', trigger: 'blur' },
    { min: 10, message: '申请原因至少10个字符', trigger: 'blur' }
  ]
}

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
 * 获取权限类型描述
 */
const getPermissionTypeDescription = (type?: string) => {
  return DataPermissionUtil.getPermissionTypeDescription(type as any)
}

/**
 * 获取状态标签样式
 */
const getStatusTag = (status: string) => {
  const tagMap: Record<string, any> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return tagMap[status] || ''
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已驳回'
  }
  return textMap[status] || status
}

/**
 * 格式化日期
 */
const formatDate = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleString('zh-CN')
}

/**
 * 加载用户数据权限
 */
const loadUserDataPermission = async () => {
  try {
    userDataPermission.value = await dataPermissionService.getUserDataPermission()
  } catch (error) {
    console.error('加载用户数据权限失败:', error)
    ElMessage.error('加载用户数据权限失败')
  }
}

/**
 * 加载申请记录
 */
const loadApplications = async () => {
  loading.value = true
  try {
    const result = await dataPermissionService.getApplications({
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    applications.value = result.list
    pagination.total = result.total
  } catch (error) {
    console.error('加载申请记录失败:', error)
    ElMessage.error('加载申请记录失败')
  } finally {
    loading.value = false
  }
}

/**
 * 加载部门树
 */
const loadDepartmentTree = async () => {
  try {
    departmentTree.value = await dataPermissionService.getDepartmentTree()
  } catch (error) {
    console.error('加载部门树失败:', error)
    ElMessage.error('加载部门树失败')
  }
}

/**
 * 编辑权限
 */
const handleEditPermission = () => {
  if (userDataPermission.value?.dataPermission) {
    editingPermission.value = { ...userDataPermission.value.dataPermission }
    editDialogVisible.value = true
  }
}

/**
 * 保存权限配置
 */
const handlePermissionSave = async (config: DataPermissionConfig) => {
  try {
    await dataPermissionService.updateDataPermission(config)
    editDialogVisible.value = false
    await loadUserDataPermission()
    ElMessage.success('权限配置已更新')
  } catch (error) {
    console.error('保存权限配置失败:', error)
    ElMessage.error('保存权限配置失败')
  }
}

/**
 * 申请权限
 */
const handleApplyPermission = () => {
  applicationForm.permissionType = 'DEPARTMENT'
  applicationForm.departments = []
  applicationForm.reason = ''
  applyDialogVisible.value = true
}

/**
 * 部门选择变化处理
 */
const handleApplyDepartmentCheck = (data: any, checked: any) => {
  applicationForm.departments = checked.checkedKeys
}

/**
 * 提交申请
 */
const handleSubmitApplication = async () => {
  if (!applicationFormRef.value) return

  try {
    await applicationFormRef.value.validate()
    await dataPermissionService.applyDataPermission(applicationForm)
    applyDialogVisible.value = false
    await loadApplications()
    ElMessage.success('申请已提交')
  } catch (error) {
    console.error('提交申请失败:', error)
    ElMessage.error('提交申请失败')
  }
}

/**
 * 撤销申请
 */
const handleWithdraw = async (applicationId: string) => {
  try {
    await ElMessageBox.confirm('确定要撤销此申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await dataPermissionService.withdrawApplication(applicationId)
    await loadApplications()
    ElMessage.success('申请已撤销')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('撤销申请失败:', error)
      ElMessage.error('撤销申请失败')
    }
  }
}

/**
 * 查看详情
 */
const handleViewDetail = (application: DataPermissionApplication) => {
  ElMessageBox.alert(
    `
    <div style="text-align: left">
      <p><strong>申请人：</strong>${application.applicantName}</p>
      <p><strong>权限类型：</strong>${getPermissionTypeDescription(application.permissionType)}</p>
      <p><strong>申请原因：</strong>${application.reason}</p>
      <p><strong>审批人：</strong>${application.approverName || '-'}</p>
      <p><strong>审批时间：</strong>${application.approvalTime ? formatDate(application.approvalTime) : '-'}</p>
      <p><strong>审批意见：</strong>${application.approvalComment || '-'}</p>
    </div>
    `,
    '申请详情',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭'
    }
  )
}

/**
 * 初始化
 */
onMounted(() => {
  loadUserDataPermission()
  loadApplications()
  loadDepartmentTree()
})
</script>

<style scoped>
.data-permission-page {
  padding: 20px;
}

.permission-info-card,
.permission-statistics-card,
.permission-application-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
