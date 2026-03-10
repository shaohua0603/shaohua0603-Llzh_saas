<template>
  <div class="rule-config-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-select
        v-model="ruleTypeFilter"
        placeholder="规则类型"
        clearable
        style="width: 180px; margin-right: 16px"
        @change="handleSearch"
      >
        <el-option label="全部" value="" />
        <el-option label="可预支额度计算规则" value="ADVANCE_AMOUNT" />
        <el-option label="工厂岗位时薪" value="HOURLY_WAGE" />
        <el-option label="每日工作时长" value="WORKING_HOURS" />
        <el-option label="大班时薪倍数" value="SHIFT_MULTIPLIER" />
        <el-option label="节假日时薪倍数" value="HOLIDAY_MULTIPLIER" />
        <el-option label="起算日期" value="START_DATE" />
        <el-option label="可预支生活费比例" value="LIVING_EXPENSE_RATIO" />
        <el-option label="注册平台用户规则" value="PLATFORM_USER_REGISTRATION" />
      </el-select>
      <el-select
        v-model="statusFilter"
        placeholder="生效状态"
        clearable
        style="width: 150px; margin-right: 16px"
        @change="handleSearch"
      >
        <el-option label="全部" value="" />
        <el-option label="生效中" value="active" />
        <el-option label="未生效" value="inactive" />
        <el-option label="已过期" value="expired" />
      </el-select>
      <el-button type="primary" @click="handleAdd">
        新增规则
      </el-button>
    </div>

    <!-- 规则列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="规则名称" min-width="180" />
      <el-table-column prop="typeName" label="规则类型" width="180" />
      <el-table-column prop="effectiveDate" label="生效日期" width="120" />
      <el-table-column prop="expireDate" label="失效日期" width="120">
        <template #default="scope">
          {{ scope.row.expireDate || '长期有效' }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="规则说明" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)" size="small">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" link @click.stop="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button
            size="small"
            :type="scope.row.status === 'active' ? 'warning' : 'success'"
            link
            @click.stop="handleToggleStatus(scope.row)"
          >
            {{ scope.row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="danger" link @click.stop="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入规则名称"
            maxlength="100"
          />
        </el-form-item>
        
        <el-form-item label="规则类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择规则类型"
            style="width: 100%"
            @change="handleTypeChange"
          >
            <el-option label="可预支额度计算规则" value="ADVANCE_AMOUNT" />
            <el-option label="工厂岗位时薪" value="HOURLY_WAGE" />
            <el-option label="每日工作时长" value="WORKING_HOURS" />
            <el-option label="大班时薪倍数" value="SHIFT_MULTIPLIER" />
            <el-option label="节假日时薪倍数" value="HOLIDAY_MULTIPLIER" />
            <el-option label="起算日期" value="START_DATE" />
            <el-option label="可预支生活费比例" value="LIVING_EXPENSE_RATIO" />
            <el-option label="注册平台用户规则" value="PLATFORM_USER_REGISTRATION" />
          </el-select>
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker
                v-model="formData.effectiveDate"
                type="date"
                placeholder="请选择生效日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失效日期" prop="expireDate">
              <el-date-picker
                v-model="formData.expireDate"
                type="date"
                placeholder="请选择失效日期（不填为长期有效）"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 规则值（根据不同类型显示不同输入框） -->
        <el-form-item v-if="showRuleValue" :label="ruleValueLabel" :prop="ruleValueField">
          <template v-if="formData.type === 'HOURLY_WAGE'">
            <el-input v-model="formData.factoryId" placeholder="请输入工厂ID" style="width: 48%; margin-right: 4%" />
            <el-input-number v-model="formData.hourlyWage" :min="0" :precision="2" placeholder="时薪（元）" style="width: 48%" />
          </template>
          <template v-else-if="formData.type === 'WORKING_HOURS'">
            <el-input-number v-model="formData.dailyHours" :min="0" :max="24" :step="0.5" placeholder="每日工作时长（小时）" style="width: 100%" />
          </template>
          <template v-else-if="formData.type === 'SHIFT_MULTIPLIER'">
            <el-input-number v-model="formData.shiftMultiplier" :min="1" :max="5" :precision="2" placeholder="大班时薪倍数" style="width: 100%" />
          </template>
          <template v-else-if="formData.type === 'HOLIDAY_MULTIPLIER'">
            <el-input-number v-model="formData.holidayMultiplier" :min="1" :max="5" :precision="2" placeholder="节假日时薪倍数" style="width: 100%" />
          </template>
          <template v-else-if="formData.type === 'START_DATE'">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="请选择起算日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </template>
          <template v-else-if="formData.type === 'LIVING_EXPENSE_RATIO'">
            <el-input-number v-model="formData.livingExpenseRatio" :min="0" :max="100" :precision="0" placeholder="可预支生活费比例（%）" style="width: 100%" />
          </template>
          <template v-else-if="formData.type === 'PLATFORM_USER_REGISTRATION'">
            <el-switch
              v-model="formData.ruleValue"
              active-value="true"
              inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
            />
          </template>
          <template v-else>
            <el-input
              v-model="formData.ruleValue"
              :placeholder="`请输入${formData.typeName || '规则值'}`"
            />
          </template>
        </el-form-item>
        
        <el-form-item label="规则说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入规则说明"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="生效状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-value="active"
            inactive-value="inactive"
            active-text="生效"
            inactive-text="未生效"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选
const ruleTypeFilter = ref('')
const statusFilter = ref('')

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  type: '',
  typeName: '',
  effectiveDate: '',
  expireDate: '',
  ruleValue: 'false',
  factoryId: '',
  hourlyWage: 0,
  dailyHours: 8,
  shiftMultiplier: 1,
  holidayMultiplier: 2,
  startDate: '',
  livingExpenseRatio: 50,
  description: '',
  status: 'inactive'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入规则名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择规则类型', trigger: 'change' }
  ],
  effectiveDate: [
    { required: true, message: '请选择生效日期', trigger: 'change' }
  ]
}

// 是否显示规则值
const showRuleValue = computed(() => {
  return ['ADVANCE_AMOUNT', 'HOURLY_WAGE', 'WORKING_HOURS', 'SHIFT_MULTIPLIER', 'HOLIDAY_MULTIPLIER', 'START_DATE', 'LIVING_EXPENSE_RATIO', 'PLATFORM_USER_REGISTRATION'].includes(formData.type)
})

// 规则值标签
const ruleValueLabel = computed(() => {
  const labels: Record<string, string> = {
    ADVANCE_AMOUNT: '规则值',
    HOURLY_WAGE: '时薪配置',
    WORKING_HOURS: '每日工作时长',
    SHIFT_MULTIPLIER: '大班时薪倍数',
    HOLIDAY_MULTIPLIER: '节假日时薪倍数',
    START_DATE: '起算日期',
    LIVING_EXPENSE_RATIO: '生活费比例',
    PLATFORM_USER_REGISTRATION: '注册开关'
  }
  return labels[formData.type] || '规则值'
})

// 规则值字段
const ruleValueField = computed(() => {
  const fields: Record<string, string> = {
    ADVANCE_AMOUNT: 'ruleValue',
    HOURLY_WAGE: 'hourlyWage',
    WORKING_HOURS: 'dailyHours',
    SHIFT_MULTIPLIER: 'shiftMultiplier',
    HOLIDAY_MULTIPLIER: 'holidayMultiplier',
    START_DATE: 'startDate',
    LIVING_EXPENSE_RATIO: 'livingExpenseRatio',
    PLATFORM_USER_REGISTRATION: 'ruleValue'
  }
  return fields[formData.type] || 'ruleValue'
})

// 规则类型名称映射
const typeNameMap: Record<string, string> = {
  ADVANCE_AMOUNT: '可预支额度计算规则',
  HOURLY_WAGE: '工厂岗位时薪',
  WORKING_HOURS: '每日工作时长',
  SHIFT_MULTIPLIER: '大班时薪倍数',
  HOLIDAY_MULTIPLIER: '节假日时薪倍数',
  START_DATE: '起算日期',
  LIVING_EXPENSE_RATIO: '可预支生活费比例',
  PLATFORM_USER_REGISTRATION: '注册平台用户规则'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    expired: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    active: '生效中',
    inactive: '未生效',
    expired: '已过期'
  }
  return texts[status] || status
}

// 规则类型变化
const handleTypeChange = (value: string) => {
  formData.typeName = typeNameMap[value] || value
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: '1',
        name: '默认每日工作时长',
        type: 'WORKING_HOURS',
        typeName: '每日工作时长',
        effectiveDate: '2024-01-01',
        expireDate: '',
        description: '规定每日标准工作时长为8小时',
        dailyHours: 8,
        status: 'active',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        name: '节假日时薪倍数',
        type: 'HOLIDAY_MULTIPLIER',
        typeName: '节假日时薪倍数',
        effectiveDate: '2024-01-01',
        expireDate: '',
        description: '节假日工作按2倍时薪计算',
        holidayMultiplier: 2,
        status: 'active',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '3',
        name: '可预支生活费比例',
        type: 'LIVING_EXPENSE_RATIO',
        typeName: '可预支生活费比例',
        effectiveDate: '2024-01-01',
        expireDate: '',
        description: '每月可预支生活费的最高比例为工资的50%',
        livingExpenseRatio: 50,
        status: 'active',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '4',
        name: '大班时薪倍数',
        type: 'SHIFT_MULTIPLIER',
        typeName: '大班时薪倍数',
        effectiveDate: '2024-01-01',
        expireDate: '2024-12-31',
        description: '大班（夜班）工作按1.5倍时薪计算',
        shiftMultiplier: 1.5,
        status: 'expired',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '5',
        name: '注册平台用户规则',
        type: 'PLATFORM_USER_REGISTRATION',
        typeName: '注册平台用户规则',
        effectiveDate: '2024-01-01',
        expireDate: '',
        description: '开启后租户新增的工人或正式员工将自动推送到平台验证是否为新用户，如果为新用户将自动完成注册，同时平台向租户定期结算拉新奖励',
        ruleValue: 'false',
        status: 'inactive',
        createTime: '2024-01-01 10:00:00'
      }
    ]
    total.value = 5
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增规则'
  Object.assign(formData, {
    id: '',
    name: '',
    type: '',
    typeName: '',
    effectiveDate: '',
    expireDate: '',
    ruleValue: 'false',
    factoryId: '',
    hourlyWage: 0,
    dailyHours: 8,
    shiftMultiplier: 1,
    holidayMultiplier: 2,
    startDate: '',
    livingExpenseRatio: 50,
    description: '',
    status: 'inactive'
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑规则'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    type: row.type,
    typeName: row.typeName,
    effectiveDate: row.effectiveDate,
    expireDate: row.expireDate,
    ruleValue: row.ruleValue || '',
    factoryId: row.factoryId || '',
    hourlyWage: row.hourlyWage || 0,
    dailyHours: row.dailyHours || 8,
    shiftMultiplier: row.shiftMultiplier || 1,
    holidayMultiplier: row.holidayMultiplier || 2,
    startDate: row.startDate || '',
    livingExpenseRatio: row.livingExpenseRatio || 50,
    description: row.description,
    status: row.status
  })
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定要${action}规则"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success(`${action}成功`)
    fetchData()
  } catch {
    // 用户取消
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除规则"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('保存成功')
        dialogVisible.value = false
        fetchData()
      } finally {
        submitting.value = false
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.rule-config-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .rule-config-container {
    padding: 16px;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toolbar > * {
    margin-bottom: 12px;
    margin-right: 0 !important;
  }
  
  :deep(.el-input) {
    width: 100% !important;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>
