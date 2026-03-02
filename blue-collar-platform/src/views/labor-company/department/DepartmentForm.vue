<template>
  <div class="department-form-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button class="back-button" text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <span class="page-title">{{ pageTitle }}</span>
      </div>
      <div class="page-actions">
        <el-button @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          提交
        </el-button>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-content">
      <el-card class="form-card">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="department-form"
        >
          <el-form-item label="上级部门" prop="parentId">
            <el-tree-select
              v-model="formData.parentId"
              :data="departmentTreeData"
              :props="{ label: 'name', value: 'id', children: 'children' }"
              check-strictly
              placeholder="请选择上级部门（不选择则为顶级部门）"
              clearable
              style="width: 100%"
              :render-after-expand="false"
            />
          </el-form-item>

          <el-form-item label="部门名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入部门名称" maxlength="50" show-word-limit />
          </el-form-item>

          <el-form-item label="级别别名" prop="levelAlias">
            <el-input v-model="formData.levelAlias" placeholder="请输入级别别名，如：总部、部门、小组" maxlength="20" show-word-limit />
          </el-form-item>

          <el-form-item label="部门介绍" prop="description">
            <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入部门介绍" maxlength="500" show-word-limit />
          </el-form-item>

          <el-form-item label="部门负责人" prop="leaderId">
            <el-select v-model="formData.leaderId" placeholder="请选择部门负责人" clearable style="width: 100%">
              <el-option
                v-for="emp in employeeList"
                :key="emp.id"
                :label="emp.name"
                :value="emp.id"
              >
                <span style="float: left">{{ emp.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ emp.department }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" maxlength="20" />
          </el-form-item>

          <el-form-item label="联系邮箱" prop="contactEmail">
            <el-input v-model="formData.contactEmail" placeholder="请输入联系邮箱" maxlength="100" />
          </el-form-item>

          <el-form-item label="联系地址" prop="contactAddress">
            <el-input v-model="formData.contactAddress" placeholder="请输入联系地址" maxlength="200" show-word-limit />
          </el-form-item>

          <el-form-item v-if="formData.level" label="部门级别">
            <el-input :value="formData.levelName" disabled />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

// 路由
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref()

// 提交状态
const submitting = ref(false)

// 页面标题
const pageTitle = computed(() => {
  if (route.params.id) {
    return '编辑部门'
  }
  if (route.query.parentId) {
    return '添加子部门'
  }
  return '新增部门'
})

// 部门树形数据（用于上级部门选择）
const departmentTreeData = ref<any[]>([])

// 员工列表
const employeeList = ref<any[]>([])

// 表单数据
const formData = reactive({
  id: '',
  parentId: null as string | null,
  name: '',
  level: 1,
  levelName: '一级',
  levelAlias: '',
  description: '',
  leaderId: '',
  leaderName: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  workerCount: 0
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' }
  ],
  contactPhone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  contactEmail: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 模拟部门数据
const mockDepartmentData: any[] = [
  {
    id: '1',
    parentId: null,
    name: '深圳三鼎劳务公司',
    level: 1,
    levelName: '一级',
    levelAlias: '总部',
    description: '深圳三鼎劳务公司总部',
    leaderId: 'e1',
    leaderName: '张三',
    contactPhone: '13800138000',
    contactEmail: 'sz@sanding.com',
    contactAddress: '深圳市南山区科技园',
    workerCount: 50,
    children: [
      {
        id: '2',
        parentId: '1',
        name: '人事部',
        level: 2,
        levelName: '二级',
        levelAlias: '人事',
        description: '人事管理部门',
        leaderId: 'e2',
        leaderName: '李四',
        contactPhone: '13800138001',
        contactEmail: 'hr@sanding.com',
        contactAddress: '深圳市南山区科技园A座',
        workerCount: 10,
        children: [
          {
            id: '5',
            parentId: '2',
            name: '招聘组',
            level: 3,
            levelName: '三级',
            levelAlias: '招聘',
            description: '负责招聘工作',
            leaderId: 'e5',
            leaderName: '王五',
            contactPhone: '13800138005',
            contactEmail: 'recruit@sanding.com',
            contactAddress: '深圳市南山区科技园A座301',
            workerCount: 5,
            children: []
          },
          {
            id: '6',
            parentId: '2',
            name: '培训组',
            level: 3,
            levelName: '三级',
            levelAlias: '培训',
            description: '负责培训工作',
            leaderId: 'e6',
            leaderName: '赵六',
            contactPhone: '13800138006',
            contactEmail: 'train@sanding.com',
            contactAddress: '深圳市南山区科技园A座302',
            workerCount: 3,
            children: []
          }
        ]
      },
      {
        id: '3',
        parentId: '1',
        name: '财务部',
        level: 2,
        levelName: '二级',
        levelAlias: '财务',
        description: '财务管理部门',
        leaderId: 'e3',
        leaderName: '钱七',
        contactPhone: '13800138002',
        contactEmail: 'finance@sanding.com',
        contactAddress: '深圳市南山区科技园B座',
        workerCount: 8,
        children: []
      },
      {
        id: '4',
        parentId: '1',
        name: '运营部',
        level: 2,
        levelName: '二级',
        levelAlias: '运营',
        description: '运营管理部门',
        leaderId: 'e4',
        leaderName: '孙八',
        contactPhone: '13800138003',
        contactEmail: 'operation@sanding.com',
        contactAddress: '深圳市南山区科技园C座',
        workerCount: 15,
        children: []
      }
    ]
  }
]

// 模拟员工数据
const mockEmployees = [
  { id: 'e1', name: '张三', department: '总部' },
  { id: 'e2', name: '李四', department: '人事部' },
  { id: 'e3', name: '钱七', department: '财务部' },
  { id: 'e4', name: '孙八', department: '运营部' },
  { id: 'e5', name: '王五', department: '人事部/招聘组' },
  { id: 'e6', name: '赵六', department: '人事部/培训组' }
]

// 查找部门
const findDepartment = (id: string, data: any[]): any | null => {
  for (const item of data) {
    if (item.id === id) {
      return item
    }
    if (item.children && item.children.length > 0) {
      const found = findDepartment(id, item.children)
      if (found) return found
    }
  }
  return null
}

// 计算部门级别
const calculateLevel = (parentId: string | null): { level: number; levelName: string } => {
  if (!parentId) {
    return { level: 1, levelName: '一级' }
  }
  const parent = findDepartment(parentId, mockDepartmentData)
  if (parent) {
    return {
      level: parent.level + 1,
      levelName: `${parent.level + 1}`
    }
  }
  return { level: 1, levelName: '一级' }
}

// 加载部门详情
const loadDepartmentDetail = async (id: string) => {
  try {
    const department = findDepartment(id, mockDepartmentData)
    if (department) {
      Object.assign(formData, department)
    }
  } catch (error) {
    ElMessage.error('加载部门详情失败')
  }
}

// 处理保存
const handleSave = async () => {
  try {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    submitting.value = true
    // TODO: 调用实际API保存
    ElMessage.success('保存成功')
    router.push({ name: 'LaborCompanyDepartments' })
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    submitting.value = false
  }
}

// 处理提交
const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    submitting.value = true
    // TODO: 调用实际API提交

    // 获取负责人名称
    const leader = employeeList.value.find(e => e.id === formData.leaderId)
    if (leader) {
      formData.leaderName = leader.name
    }

    if (formData.id) {
      ElMessage.success('编辑成功')
    } else {
      ElMessage.success('新增成功')
    }
    router.push({ name: 'LaborCompanyDepartments' })
  } catch (error) {
    ElMessage.error('提交失败')
  } finally {
    submitting.value = false
  }
}

// 处理返回
const handleBack = () => {
  ElMessageBox.confirm('确定要返回吗？未保存的内容将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push({ name: 'LaborCompanyDepartments' })
  }).catch(() => {})
}

// 监听上级部门变化，自动计算级别
const handleParentIdChange = (parentId: string | null) => {
  if (parentId) {
    const levelInfo = calculateLevel(parentId)
    formData.level = levelInfo.level
    formData.levelName = levelInfo.levelName
  } else {
    formData.level = 1
    formData.levelName = '一级'
  }
}

// 初始化
onMounted(() => {
  // 加载部门树形数据
  departmentTreeData.value = JSON.parse(JSON.stringify(mockDepartmentData))
  employeeList.value = mockEmployees

  // 判断是编辑还是新增
  if (route.params.id) {
    // 编辑模式
    loadDepartmentDetail(route.params.id as string)
  } else if (route.query.parentId) {
    // 添加子部门模式
    formData.parentId = route.query.parentId as string
    handleParentIdChange(formData.parentId)
  } else {
    // 新增顶级部门
    handleParentIdChange(null)
  }
})
</script>

<style scoped>
.department-form-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  font-size: 14px;
  color: #606266;
}

.back-button:hover {
  color: #409eff;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.page-actions {
  display: flex;
  gap: 12px;
}

/* 表单内容 */
.form-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.form-card {
  margin-bottom: 20px;
}

.department-form {
  max-width: 800px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
  }

  .page-actions {
    width: 100%;
  }

  .page-actions .el-button {
    flex: 1;
  }

  .department-form :deep(.el-form-item__label) {
    width: 100px !important;
  }

  .department-form :deep(.el-form-item__content) {
    margin-left: 100px !important;
  }
}
</style>
