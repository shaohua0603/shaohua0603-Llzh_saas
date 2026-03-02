<template>
  <div class="data-permission-selector">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <!-- 权限类型选择 -->
      <el-form-item label="权限类型" prop="type">
        <el-radio-group v-model="formData.type" @change="handleTypeChange">
          <el-radio label="ALL">全部数据</el-radio>
          <el-radio label="DEPARTMENT">本部门数据</el-radio>
          <el-radio label="DEPARTMENT_AND_BELOW">本部门及以下</el-radio>
          <el-radio label="SELF">本人数据</el-radio>
          <el-radio label="CUSTOM">自定义部门</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 自定义部门选择 -->
      <el-form-item
        v-if="formData.type === 'CUSTOM'"
        label="选择部门"
        prop="departments"
      >
        <el-tree
          ref="treeRef"
          :data="departmentTree"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-checked-keys="formData.departments"
          @check="handleDepartmentCheck"
          style="max-height: 300px; overflow-y: auto"
        />
      </el-form-item>

      <!-- 特殊权限配置 -->
      <el-form-item label="特殊权限">
        <el-checkbox v-model="formData.includeCreator">包含创建人</el-checkbox>
        <el-checkbox v-model="formData.includeManager">包含负责人</el-checkbox>
        <el-checkbox v-model="formData.includeContact">包含对接人</el-checkbox>
      </el-form-item>

      <!-- 权限预览 -->
      <el-form-item label="权限预览">
        <el-alert
          :title="permissionPreview"
          type="info"
          :closable="false"
          show-icon
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { DataPermissionConfig, Department } from '../types/data-permission'
import DataPermissionUtil from '../utils/dataPermissionUtil'
import dataPermissionService from '../services/dataPermissionService'

/**
 * 组件Props
 */
interface Props {
  /** 初始数据权限配置 */
  modelValue?: DataPermissionConfig
  /** 是否只读 */
  readonly?: boolean
}

/**
 * 组件Emits
 */
interface Emits {
  (e: 'update:modelValue', value: DataPermissionConfig): void
  (e: 'save', value: DataPermissionConfig): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

const emit = defineEmits<Emits>()

/**
 * 表单引用
 */
const formRef = ref<FormInstance>()
const treeRef = ref()

/**
 * 表单数据
 */
const formData = reactive<DataPermissionConfig>({
  type: 'DEPARTMENT',
  departments: [],
  includeCreator: false,
  includeManager: false,
  includeContact: false
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
 * 表单验证规则
 */
const rules: FormRules = {
  type: [
    { required: true, message: '请选择权限类型', trigger: 'change' }
  ],
  departments: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (formData.type === 'CUSTOM' && (!value || value.length === 0)) {
          callback(new Error('请至少选择一个部门'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

/**
 * 权限预览文本
 */
const permissionPreview = computed(() => {
  const typeDesc = DataPermissionUtil.getPermissionTypeDescription(formData.type)
  const parts: string[] = [typeDesc]

  if (formData.includeCreator) {
    parts.push('包含创建人')
  }
  if (formData.includeManager) {
    parts.push('包含负责人')
  }
  if (formData.includeContact) {
    parts.push('包含对接人')
  }

  return parts.join('，')
})

/**
 * 权限类型变化处理
 */
const handleTypeChange = (value: string) => {
  // 清空自定义部门选择
  if (value !== 'CUSTOM') {
    formData.departments = []
  }
}

/**
 * 部门选择变化处理
 */
const handleDepartmentCheck = (data: any, checked: any) => {
  formData.departments = checked.checkedKeys
}

/**
 * 保存数据权限配置
 */
const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 验证数据权限配置
    if (!DataPermissionUtil.isValidPermission(formData)) {
      ElMessage.error('数据权限配置无效')
      return
    }

    // 调用API保存配置
    await dataPermissionService.updateDataPermission(formData)

    // 通知父组件
    emit('update:modelValue', { ...formData })
    emit('save', { ...formData })

    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存数据权限配置失败:', error)
    ElMessage.error('保存失败')
  }
}

/**
 * 重置表单
 */
const handleReset = () => {
  if (props.modelValue) {
    Object.assign(formData, props.modelValue)
  } else {
    formData.type = 'DEPARTMENT'
    formData.departments = []
    formData.includeCreator = false
    formData.includeManager = false
    formData.includeContact = false
  }
  formRef.value?.clearValidate()
}

/**
 * 取消操作
 */
const handleCancel = () => {
  emit('cancel')
}

/**
 * 加载部门树数据
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
 * 初始化
 */
onMounted(() => {
  // 加载部门树
  loadDepartmentTree()

  // 初始化表单数据
  if (props.modelValue) {
    Object.assign(formData, props.modelValue)
  }
})

/**
 * 监听props变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      Object.assign(formData, newValue)
    }
  },
  { deep: true }
)

/**
 * 暴露方法给父组件
 */
defineExpose({
  validate: () => formRef.value?.validate(),
  resetValidation: () => formRef.value?.clearValidate(),
  getData: () => ({ ...formData })
})
</script>

<style scoped>
.data-permission-selector {
  padding: 20px;
}

.el-checkbox {
  margin-right: 20px;
}
</style>
