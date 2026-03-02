<template>
  <div class="position-form-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑岗位' : '新增岗位' }}</span>
          <el-button type="primary" link @click="handleBack">
            返回
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="岗位名称" prop="positionName">
              <el-input
                v-model="formData.positionName"
                placeholder="请输入岗位名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="departmentId">
              <el-select
                v-model="formData.departmentId"
                placeholder="请选择所属部门"
                clearable
                style="width: 100%"
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
        </el-row>

        <el-form-item label="数据权限" prop="dataPermissionType">
          <el-radio-group v-model="formData.dataPermissionType">
            <el-radio
              v-for="(item, key) in dataPermissionOptions"
              :key="key"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.dataPermissionType === 'CUSTOM'"
          label="选择部门"
          prop="customDepartments"
        >
          <el-tree-select
            v-model="formData.customDepartments"
            :data="departmentTree"
            :props="treeProps"
            multiple
            :render-after-expand="false"
            placeholder="请选择部门"
            style="width: 100%"
            show-checkbox
          />
        </el-form-item>

        <el-form-item label="特殊权限">
          <el-checkbox v-model="formData.includeCreator">包含创建人</el-checkbox>
          <el-checkbox v-model="formData.includeManager">包含负责人</el-checkbox>
          <el-checkbox v-model="formData.includeContact">包含对接人</el-checkbox>
        </el-form-item>

        <el-form-item label="菜单权限" prop="menuPermissions">
          <div class="menu-permission-container">
            <el-tree
              ref="menuTreeRef"
              :data="menuTreeData"
              :props="treeProps"
              show-checkbox
              node-key="id"
              :default-checked-keys="formData.menuPermissions"
              :check-strictly="false"
              @check="handleMenuCheck"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <span>{{ data.name }}</span>
                  <span
                    v-if="data.children && data.children.length > 0"
                    class="permission-badges"
                  >
                    <el-tag size="small" type="info">
                      {{ data.children.length }}个子模块
                    </el-tag>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-form-item>

        <el-form-item label="岗位描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入岗位描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="enabled">启用</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePositionStore } from '@/stores/position'
import { DataPermissionTypeDict, type PositionFormData } from '@/types/system/positionTypes'

const route = useRoute()
const router = useRouter()
const positionStore = usePositionStore()

const isEdit = computed(() => !!route.params.id)
const formRef = ref()
const menuTreeRef = ref()
const submitting = ref(false)

const formData = reactive<PositionFormData>({
  id: undefined,
  positionName: '',
  departmentId: '',
  dataPermissionType: 'SELF',
  customDepartments: [],
  includeCreator: false,
  includeManager: false,
  includeContact: false,
  menuPermissions: [],
  description: '',
  status: 'enabled'
})

const formRules = {
  positionName: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
    { min: 2, max: 50, message: '岗位名称长度在2-50个字符', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ],
  dataPermissionType: [
    { required: true, message: '请选择数据权限', trigger: 'change' }
  ],
  menuPermissions: [
    {
      required: true,
      message: '请选择菜单权限',
      trigger: 'change',
      validator: (rule: any, value: any, callback: any) => {
        if (!value || value.length === 0) {
          callback(new Error('请选择菜单权限'))
        } else {
          callback()
        }
      }
    }
  ]
}

const dataPermissionOptions = [
  { value: 'ALL', label: '全部数据' },
  { value: 'DEPARTMENT', label: '本部门数据' },
  { value: 'DEPARTMENT_AND_BELOW', label: '本部门及以下所属部门数据' },
  { value: 'SELF', label: '本人数据权限' },
  { value: 'CUSTOM', label: '自定义数据权限' }
]

const departmentList = ref([
  { id: '1', name: '人力资源部' },
  { id: '2', name: '财务部' },
  { id: '3', name: '技术部' },
  { id: '4', name: '市场部' },
  { id: '5', name: '运营部' }
])

const departmentTree = ref([
  {
    id: '1',
    name: '蓝领智汇总部',
    children: [
      {
        id: '1-1',
        name: '技术研发部',
        children: [
          { id: '1-1-1', name: '前端开发组' },
          { id: '1-1-2', name: '后端开发组' }
        ]
      },
      { id: '1-2', name: '人力资源部' },
      { id: '1-3', name: '财务部' }
    ]
  }
])

const menuTreeData = ref([
  {
    id: '1',
    name: '工作中心',
    children: [
      { id: '1-1', name: '待办任务' },
      { id: '1-2', name: '消息中心' },
      { id: '1-3', name: '预警信息' }
    ]
  },
  {
    id: '2',
    name: '招聘管理',
    children: [
      { id: '2-1', name: '招聘需求' },
      { id: '2-2', name: '简历管理' }
    ]
  },
  {
    id: '3',
    name: '面试管理',
    children: [
      { id: '3-1', name: '接送管理' },
      { id: '3-2', name: '初步面试' },
      { id: '3-3', name: '面试邀约' },
      { id: '3-4', name: '工厂面试' }
    ]
  },
  {
    id: '4',
    name: '工人管理',
    children: [
      { id: '4-1', name: '工人信息' }
    ]
  },
  {
    id: '5',
    name: '合同管理',
    children: [
      { id: '5-1', name: '签订合同' }
    ]
  },
  {
    id: '6',
    name: '在职管理',
    children: [
      { id: '6-1', name: '工作与生活' },
      { id: '6-2', name: '管理与关怀' },
      { id: '6-3', name: '特殊情况' },
      { id: '6-4', name: '保险管理' },
      { id: '6-5', name: '考勤管理' },
      { id: '6-6', name: '请假管理' },
      { id: '6-7', name: '调岗管理' },
      { id: '6-8', name: '奖惩管理' },
      { id: '6-9', name: '业务课堂' },
      { id: '6-10', name: '异常管理' },
      { id: '6-11', name: '投诉/建议' }
    ]
  },
  {
    id: '7',
    name: '离职管理',
    children: [
      { id: '7-1', name: '离职管理' }
    ]
  },
  {
    id: '8',
    name: '结算管理',
    children: [
      { id: '8-1', name: '工作转介绍' },
      { id: '8-2', name: '结算管理' }
    ]
  },
  {
    id: '9',
    name: '系统管理',
    children: [
      { id: '9-1', name: '企业介绍' },
      { id: '9-2', name: '部门管理' },
      { id: '9-3', name: '正式员工' },
      { id: '9-4', name: '岗位管理' },
      { id: '9-5', name: '规则配置' },
      { id: '9-6', name: '菜单配置' },
      { id: '9-7', name: '字典管理' },
      { id: '9-8', name: '系统参数' },
      { id: '9-9', name: '流程管理' },
      { id: '9-10', name: '流程配置' },
      { id: '9-11', name: '附件管理' },
      { id: '9-12', name: '打印管理' }
    ]
  }
])

const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children'
}

const loadPositionData = async () => {
  if (isEdit.value) {
    try {
      const position = await positionStore.fetchPositionDetail(route.params.id as string)
      Object.assign(formData, {
        id: position.id,
        positionName: position.positionName,
        departmentId: position.departmentId,
        dataPermissionType: position.dataPermissionType,
        customDepartments: position.customDepartments || [],
        includeCreator: position.includeCreator || false,
        includeManager: position.includeManager || false,
        includeContact: position.includeContact || false,
        menuPermissions: position.menuPermissions || [],
        description: position.description || '',
        status: position.status
      })
      
      setTimeout(() => {
        if (menuTreeRef.value && formData.menuPermissions.length > 0) {
          menuTreeRef.value.setCheckedKeys(formData.menuPermissions)
        }
      }, 100)
    } catch (error) {
      console.error('获取岗位详情失败:', error)
      ElMessage.error('获取岗位详情失败')
    }
  }
}

const handleMenuCheck = (data: any, checked: any) => {
  const checkedKeys = checked.checkedKeys
  const halfCheckedKeys = checked.halfCheckedKeys
  formData.menuPermissions = [...checkedKeys, ...halfCheckedKeys]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        if (isEdit.value) {
          await positionStore.updatePosition(route.params.id as string, formData)
          ElMessage.success('更新成功')
        } else {
          await positionStore.createPosition(formData)
          ElMessage.success('创建成功')
        }
        router.push('/admin/system/position')
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleBack = () => {
  router.push('/admin/system/position')
}

onMounted(() => {
  loadPositionData()
})
</script>

<style scoped>
.position-form-container {
  padding: 20px;
}

.form-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-permission-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.permission-badges {
  margin-left: 8px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

@media screen and (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions > * {
    width: 100%;
  }
}
</style>
