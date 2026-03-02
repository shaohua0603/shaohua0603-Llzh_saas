<template>
  <div class="employee-form-page">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑员工' : '新增员工' }}</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        class="employee-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-select
                v-model="formData.phone"
                placeholder="请选择手机号"
                filterable
                style="width: 100%"
                @change="handlePhoneChange"
              >
                <el-option
                  v-for="user in phoneOptions"
                  :key="user.phone"
                  :label="`${user.name} - ${user.phone}`"
                  :value="user.phone"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="formData.address" placeholder="请输入联系地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId">
              <el-select
                v-model="formData.departmentId"
                placeholder="请选择部门"
                style="width: 100%"
                @change="handleDepartmentChange"
              >
                <el-option
                  v-for="dept in departmentList"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位" prop="positionId">
              <el-select
                v-model="formData.positionId"
                placeholder="请选择岗位"
                style="width: 100%"
                :disabled="!formData.departmentId"
              >
                <el-option
                  v-for="pos in filteredPositionList"
                  :key="pos.id"
                  :label="pos.name"
                  :value="pos.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门负责人">
              <el-switch v-model="formData.isDepartmentLeader" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="直属领导" prop="leaderId">
              <el-select
                v-model="formData.leaderId"
                placeholder="请选择直属领导"
                clearable
                style="width: 100%"
                :disabled="!formData.departmentId"
              >
                <el-option
                  v-for="emp in filteredEmployeeList"
                  :key="emp.id"
                  :label="emp.name"
                  :value="emp.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入职时间" prop="hireDate">
              <el-date-picker
                v-model="formData.hireDate"
                type="date"
                placeholder="选择入职时间"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职时间" prop="leaveDate">
              <el-date-picker
                v-model="formData.leaveDate"
                type="date"
                placeholder="选择离职时间"
                value-format="YYYY-MM-DD"
                style="width: 100%"
                :disabled="!formData.hireDate"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="form-buttons">
        <el-button @click="handleBack">返回</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '保存' : '提交' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 路由
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref()

// 提交状态
const submitting = ref(false)

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  departmentId: '',
  departmentName: '',
  positionId: '',
  positionName: '',
  isDepartmentLeader: false,
  leaderId: '',
  leaderName: '',
  hireDate: '',
  leaveDate: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请选择手机号', trigger: 'change' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  positionId: [
    { required: true, message: '请选择岗位', trigger: 'change' }
  ],
  hireDate: [
    { required: true, message: '请选择入职时间', trigger: 'change' }
  ]
}

// 手机号选项（从注册用户中选择）
const phoneOptions = ref<any[]>([])

// 部门列表
const departmentList = ref<any[]>([])

// 岗位列表
const positionList = ref<any[]>([])

// 员工列表
const employeeList = ref<any[]>([])

// 根据部门筛选岗位
const filteredPositionList = computed(() => {
  if (!formData.departmentId) return []
  return positionList.value.filter(pos => pos.departmentId === formData.departmentId)
})

// 根据部门筛选员工（排除当前员工）
const filteredEmployeeList = computed(() => {
  if (!formData.departmentId) return []
  return employeeList.value.filter(emp =>
    emp.departmentId === formData.departmentId && emp.id !== formData.id
  )
})

// 手机号选择变化
const handlePhoneChange = (phone: string) => {
  const user = phoneOptions.value.find(u => u.phone === phone)
  if (user) {
    formData.name = user.name
    formData.email = user.email || ''
    formData.address = user.address || ''
  }
}

// 部门选择变化
const handleDepartmentChange = () => {
  // 部门变化时清空岗位和直属领导
  formData.positionId = ''
  formData.leaderId = ''
}

// 加载数据
const loadData = () => {
  // 模拟手机号选项（从注册用户中获取）
  phoneOptions.value = [
    { name: '张三', phone: '13800138000', email: 'zhangsan@example.com', address: '深圳市南山区' },
    { name: '李四', phone: '13800138001', email: 'lisi@example.com', address: '深圳市福田区' },
    { name: '王五', phone: '13800138002', email: 'wangwu@example.com', address: '深圳市宝安区' },
    { name: '赵六', phone: '13800138003', email: 'zhaoliu@example.com', address: '深圳市龙岗区' },
    { name: '钱七', phone: '13800138004', email: 'qianqi@example.com', address: '深圳市罗湖区' }
  ]

  // 部门列表
  departmentList.value = [
    { id: '2', name: '人事部' },
    { id: '3', name: '财务部' },
    { id: '4', name: '运营部' },
    { id: '5', name: '招聘组' },
    { id: '6', name: '培训组' }
  ]

  // 岗位列表
  positionList.value = [
    { id: 'p1', name: '人事经理', departmentId: '2' },
    { id: 'p2', name: '招聘专员', departmentId: '2' },
    { id: 'p3', name: '培训专员', departmentId: '2' },
    { id: 'p4', name: '财务经理', departmentId: '3' },
    { id: 'p5', name: '会计', departmentId: '3' },
    { id: 'p6', name: '运营经理', departmentId: '4' },
    { id: 'p7', name: '运营专员', departmentId: '4' }
  ]

  // 员工列表（用于选择直属领导）
  employeeList.value = [
    { id: 'e1', name: '张三', departmentId: '2' },
    { id: 'e2', name: '李四', departmentId: '2' },
    { id: 'e3', name: '王五', departmentId: '3' },
    { id: 'e4', name: '赵六', departmentId: '3' },
    { id: 'e5', name: '钱七', departmentId: '4' }
  ]

  // 编辑模式加载数据
  if (isEdit.value) {
    loadEmployeeData()
  }
}

// 加载员工数据
const loadEmployeeData = () => {
  // 模拟编辑时加载数据
  const mockData: Record<string, any> = {
    'e1': { id: 'e1', name: '张三', phone: '13800138000', email: 'zhangsan@example.com', address: '深圳市南山区', departmentId: '2', departmentName: '人事部', positionId: 'p1', positionName: '人事经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2020-01-15', leaveDate: '' },
    'e2': { id: 'e2', name: '李四', phone: '13800138001', email: 'lisi@example.com', address: '深圳市福田区', departmentId: '2', departmentName: '人事部', positionId: 'p2', positionName: '招聘专员', isDepartmentLeader: false, leaderId: 'e1', leaderName: '张三', hireDate: '2021-03-20', leaveDate: '' },
    'e3': { id: 'e3', name: '王五', phone: '13800138002', email: 'wangwu@example.com', address: '深圳市宝安区', departmentId: '3', departmentName: '财务部', positionId: 'p4', positionName: '财务经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2019-06-10', leaveDate: '' },
    'e4': { id: 'e4', name: '赵六', phone: '13800138003', email: 'zhaoliu@example.com', address: '深圳市龙岗区', departmentId: '3', departmentName: '财务部', positionId: 'p5', positionName: '会计', isDepartmentLeader: false, leaderId: 'e3', leaderName: '王五', hireDate: '2022-01-05', leaveDate: '' },
    'e5': { id: 'e5', name: '钱七', phone: '13800138004', email: 'qianqi@example.com', address: '深圳市罗湖区', departmentId: '4', departmentName: '运营部', positionId: 'p6', positionName: '运营经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2020-08-15', leaveDate: '' }
  }

  const data = mockData[route.params.id as string]
  if (data) {
    Object.assign(formData, data)
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true

  try {
    // 获取部门名称和岗位名称
    const dept = departmentList.value.find(d => d.id === formData.departmentId)
    const pos = positionList.value.find(p => p.id === formData.positionId)
    const leader = employeeList.value.find(e => e.id === formData.leaderId)

    formData.departmentName = dept?.name || ''
    formData.positionName = pos?.name || ''
    formData.leaderName = leader?.name || ''

    // TODO: 调用实际API保存数据

    ElMessage.success(isEdit.value ? '保存成功' : '新增成功')
    router.push({ name: 'LaborCompanyEmployees' })
  } catch (error) {
    ElMessage.error(isEdit.value ? '保存失败' : '新增失败')
  } finally {
    submitting.value = false
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.employee-form-page {
  padding: 20px;
}

.form-card {
  max-width: 900px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
}

.employee-form {
  padding: 20px 0;
}

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.form-buttons .el-button {
  min-width: 100px;
}
</style>
