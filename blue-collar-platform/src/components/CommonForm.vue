<template>
  <div class="common-form-container">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-width="config.labelWidth || '120px'"
      :label-position="config.labelPosition || 'right'"
      :size="config.size || 'default'"
      :disabled="disabled || config.disabled"
      :validate-on-rule-change="false"
      @submit.prevent="handleSubmit"
    >
      <!-- 顶部按钮 -->
      <div v-if="config.buttonPosition === 'top' || config.buttonPosition === 'both'" class="form-buttons form-buttons-top">
        <slot name="buttons-top">
          <el-button
            v-if="config.showSaveDraft !== false"
            @click="handleSaveDraft"
            :loading="draftSaving"
          >
            {{ config.saveDraftText || '保存草稿' }}
          </el-button>
          <el-button
            v-if="config.showReset !== false"
            @click="handleReset"
          >
            {{ config.resetText || '重置' }}
          </el-button>
          <el-button
            v-if="config.showSubmit !== false"
            type="primary"
            @click="handleSubmit"
            :loading="loading"
          >
            {{ config.submitText || '提交' }}
          </el-button>
        </slot>
      </div>

      <!-- 表单字段 -->
      <el-row :gutter="config.gutter || 20">
        <el-col
          v-for="field in visibleFields"
          :key="field.field"
          :span="field.span || (config.columns ? 24 / config.columns : 24)"
        >
          <el-form-item
            v-if="isFieldVisible(field)"
            :label="config.showLabel !== false ? field.label : ''"
            :prop="field.field"
            :required="field.required && config.showStar !== false"
          >
            <!-- 自定义字段插槽 -->
            <slot
              v-if="$slots[`field-${field.field}`]"
              :name="`field-${field.field}`"
              :field="field"
              :value="formData[field.field]"
              :model="formData"
            ></slot>

            <!-- TEXT 单行文本输入 -->
            <el-input
              v-else-if="field.type === 'TEXT'"
              v-model="formData[field.field]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :disabled="field.disabled"
              :readonly="field.readonly"
              :clearable="field.clearable !== false"
              :maxlength="field.maxLength"
              :show-word-limit="field.maxLength"
              :prefix-icon="field.prefixIcon"
              :suffix-icon="field.suffixIcon"
              @input="handleFieldChange(field.field, $event)"
            >
              <template v-if="field.prefix" #prefix>{{ field.prefix }}</template>
              <template v-if="field.suffix" #suffix>{{ field.suffix }}</template>
            </el-input>

            <!-- TEXTAREA 多行文本输入 -->
            <el-input
              v-else-if="field.type === 'TEXTAREA'"
              v-model="formData[field.field]"
              type="textarea"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :disabled="field.disabled"
              :readonly="field.readonly"
              :rows="field.rows || 4"
              :autosize="field.autosize"
              :maxlength="field.maxLength"
              :show-word-limit="field.maxLength"
              @input="handleFieldChange(field.field, $event)"
            />

            <!-- NUMBER 数字输入 -->
            <el-input-number
              v-else-if="field.type === 'NUMBER'"
              v-model="formData[field.field]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :disabled="field.disabled"
              :min="field.min"
              :max="field.max"
              :precision="field.precision"
              :step="field.step || 1"
              :controls-position="field.controlsPosition || 'right'"
              @change="handleFieldChange(field.field, $event)"
            />

            <!-- SELECT 下拉单选 -->
            <el-select
              v-else-if="field.type === 'SELECT'"
              v-model="formData[field.field]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :multiple="field.multiple"
              :filterable="field.filterable !== false"
              @change="handleFieldChange(field.field, $event)"
            >
              <el-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
              />
            </el-select>

            <!-- RADIO 单选按钮组 -->
            <el-radio-group
              v-else-if="field.type === 'RADIO'"
              v-model="formData[field.field]"
              :disabled="field.disabled"
              @change="handleFieldChange(field.field, $event)"
            >
              <el-radio
                v-for="option in field.options"
                :key="option.value"
                :label="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>

            <!-- CHECKBOX 复选框组 -->
            <el-checkbox-group
              v-else-if="field.type === 'CHECKBOX'"
              v-model="formData[field.field]"
              :disabled="field.disabled"
              @change="handleFieldChange(field.field, $event)"
            >
              <el-checkbox
                v-for="option in field.options"
                :key="option.value"
                :label="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>

            <!-- DATE 日期选择 -->
            <el-date-picker
              v-else-if="field.type === 'DATE'"
              v-model="formData[field.field]"
              type="date"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :format="field.format || 'YYYY-MM-DD'"
              :value-format="field.valueFormat || 'YYYY-MM-DD'"
              @change="handleFieldChange(field.field, $event)"
            />

            <!-- DATETIME 日期时间选择 -->
            <el-date-picker
              v-else-if="field.type === 'DATETIME'"
              v-model="formData[field.field]"
              type="datetime"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :format="field.format || 'YYYY-MM-DD HH:mm:ss'"
              :value-format="field.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
              @change="handleFieldChange(field.field, $event)"
            />

            <!-- DATERANGE 日期范围选择 -->
            <el-date-picker
              v-else-if="field.type === 'DATERANGE'"
              v-model="formData[field.field]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              :format="field.format || 'YYYY-MM-DD'"
              :value-format="field.valueFormat || 'YYYY-MM-DD'"
              @change="handleFieldChange(field.field, $event)"
            />

            <!-- PERSON 人员选择 -->
            <el-button
              v-else-if="field.type === 'PERSON'"
              @click="handlePersonSelect(field)"
              :disabled="field.disabled"
            >
              {{ getPersonSelectText(field) }}
            </el-button>

            <!-- DEPARTMENT 部门选择 -->
            <el-button
              v-else-if="field.type === 'DEPARTMENT'"
              @click="handleDepartmentSelect(field)"
              :disabled="field.disabled"
            >
              {{ getDepartmentSelectText(field) }}
            </el-button>

            <!-- RICHTEXT 富文本 -->
            <div v-else-if="field.type === 'RICHTEXT'" class="richtext-container">
              <el-input
                v-model="formData[field.field]"
                type="textarea"
                :placeholder="field.placeholder || `请输入${field.label}`"
                :disabled="field.disabled"
                :rows="field.richtextHeight || 300"
                @input="handleFieldChange(field.field, $event)"
              />
            </div>

            <!-- FILE 文件上传 -->
            <el-upload
              v-else-if="field.type === 'FILE'"
              :action="uploadAction"
              :headers="uploadHeaders"
              :data="uploadData"
              :file-list="getFileList(field.field)"
              :disabled="field.disabled"
              :limit="field.uploadLimit || 5"
              :accept="field.accept?.join(',')"
              :before-upload="handleBeforeUpload"
              :on-success="(response, file, fileList) => handleUploadSuccess(field.field, response, file, fileList)"
              :on-remove="(file, fileList) => handleUploadRemove(field.field, file, fileList)"
              :on-exceed="handleUploadExceed"
              :on-change="(file, fileList) => handleUploadChange(field.field, file, fileList)"
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                点击上传
              </el-button>
              <template #tip>
                <div class="el-upload__tip">
                  {{ field.tip || `支持上传文件，大小不超过${field.fileSizeLimit || 10}MB` }}
                </div>
              </template>
            </el-upload>

            <!-- IMAGE 图片上传 -->
            <el-upload
              v-else-if="field.type === 'IMAGE'"
              :action="uploadAction"
              :headers="uploadHeaders"
              :data="uploadData"
              :file-list="getFileList(field.field)"
              :disabled="field.disabled"
              :limit="field.uploadLimit || 5"
              :accept="field.accept?.join(',') || 'image/*'"
              :before-upload="handleBeforeUpload"
              :on-success="(response, file, fileList) => handleUploadSuccess(field.field, response, file, fileList)"
              :on-remove="(file, fileList) => handleUploadRemove(field.field, file, fileList)"
              :on-exceed="handleUploadExceed"
              :on-change="(file, fileList) => handleUploadChange(field.field, file, fileList)"
              list-type="picture-card"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>

            <!-- 提示信息 -->
            <div v-if="field.tip" class="field-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>{{ field.tip }}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 底部按钮 -->
      <div v-if="config.buttonPosition === 'bottom' || config.buttonPosition === 'both'" class="form-buttons form-buttons-bottom">
        <slot name="buttons-bottom">
          <el-button
            v-if="config.showSaveDraft !== false"
            @click="handleSaveDraft"
            :loading="draftSaving"
          >
            {{ config.saveDraftText || '保存草稿' }}
          </el-button>
          <el-button
            v-if="config.showReset !== false"
            @click="handleReset"
          >
            {{ config.resetText || '重置' }}
          </el-button>
          <el-button
            v-if="config.showSubmit !== false"
            type="primary"
            @click="handleSubmit"
            :loading="loading"
          >
            {{ config.submitText || '提交' }}
          </el-button>
        </slot>
      </div>
    </el-form>

    <!-- 人员选择对话框 -->
    <el-dialog
      v-model="personSelectVisible"
      title="选择人员"
      width="800px"
      :close-on-click-modal="false"
    >
      <PersonSelect
        v-if="personSelectVisible"
        :source="currentPersonSelectConfig?.personSource || 'all'"
        :multiple="currentPersonSelectConfig?.multiple || false"
        :display-fields="currentPersonSelectConfig?.displayFields"
        :return-fields="currentPersonSelectConfig?.returnFields"
        @confirm="handlePersonSelectConfirm"
        @cancel="personSelectVisible = false"
      />
    </el-dialog>

    <!-- 部门选择对话框 -->
    <el-dialog
      v-model="departmentSelectVisible"
      title="选择部门"
      width="600px"
      :close-on-click-modal="false"
    >
      <DepartmentSelect
        v-if="departmentSelectVisible"
        :multiple="currentDepartmentSelectConfig?.multiple || false"
        @confirm="handleDepartmentSelectConfirm"
        @cancel="departmentSelectVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Plus, InfoFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type {
  FormConfig,
  FormFieldConfig,
  FormDataValue,
  DraftData,
  ValidationRule,
  FieldLinkage
} from '../types/common-form'

// Props定义
interface Props {
  /** 表单配置 */
  config: FormConfig
  /** 表单数据 */
  modelValue: FormDataValue
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用表单 */
  disabled?: boolean
  /** 上传地址 */
  uploadAction?: string
  /** 上传请求头 */
  uploadHeaders?: Record<string, string>
  /** 上传额外参数 */
  uploadData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  uploadAction: '/api/upload',
  uploadHeaders: () => ({}),
  uploadData: () => ({})
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: FormDataValue]
  'submit': [formData: FormDataValue]
  'reset': [formData: FormDataValue]
  'field-change': [field: string, value: any]
  'save-draft': [draftData: DraftData]
  'restore-draft': [draftData: DraftData]
  'validate-fail': [errors: Record<string, string>]
}>()

// 响应式数据
const formRef = ref<FormInstance>()
const formData = ref<FormDataValue>({ ...props.modelValue })
const formRules = ref<FormRules>({})
const draftSaving = ref(false)
const personSelectVisible = ref(false)
const departmentSelectVisible = ref(false)
const currentPersonSelectField = ref<string>('')
const currentPersonSelectConfig = ref<FormFieldConfig | null>(null)
const currentDepartmentSelectField = ref<string>('')
const currentDepartmentSelectConfig = ref<FormFieldConfig | null>(null)
const autoSaveTimer = ref<any>(null)
const fileLists = ref<Record<string, any[]>>({})

// 获取当前用户ID
const getCurrentUserId = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return user.id || 'default'
    } catch {
      return 'default'
    }
  }
  return 'default'
}

// 获取存储键
const getStorageKey = (type: string) => {
  const userId = getCurrentUserId()
  const key = props.config.draftStorageKey || 'common-form'
  return `${key}-${type}-${userId}`
}

// 计算属性 - 可见字段
const visibleFields = computed(() => {
  return props.config.fields.filter(field => {
    if (typeof field.visible === 'function') {
      return field.visible(formData.value)
    }
    return field.visible !== false
  })
})

// 初始化表单数据
const initFormData = () => {
  const data: FormDataValue = { ...props.modelValue }
  props.config.fields.forEach(field => {
    if (data[field.field] === undefined || data[field.field] === null) {
      data[field.field] = field.defaultValue !== undefined ? field.defaultValue : getDefaultValueByType(field.type)
    }
  })
  formData.value = data
}

// 根据字段类型获取默认值
const getDefaultValueByType = (type: string) => {
  switch (type) {
    case 'CHECKBOX':
      return []
    case 'NUMBER':
      return 0
    case 'DATERANGE':
      return []
    case 'FILE':
    case 'IMAGE':
      return []
    default:
      return ''
  }
}

// 初始化验证规则
const initFormRules = () => {
  const rules: FormRules = {}
  props.config.fields.forEach(field => {
    if (field.rules && field.rules.length > 0) {
      rules[field.field] = field.rules.map(rule => convertValidationRule(rule))
    } else if (field.required) {
      rules[field.field] = [
        {
          required: true,
          message: `请输入${field.label}`,
          trigger: 'blur'
        }
      ]
    }
  })
  formRules.value = rules
}

// 转换验证规则
const convertValidationRule = (rule: ValidationRule) => {
  const convertedRule: any = {
    message: rule.message,
    trigger: rule.trigger || 'blur'
  }

  switch (rule.type) {
    case 'required':
      convertedRule.required = true
      break
    case 'email':
      convertedRule.type = 'email'
      convertedRule.message = rule.message || '请输入正确的邮箱地址'
      break
    case 'phone':
      convertedRule.validator = (_rule: any, value: any, callback: any) => {
        const phoneReg = /^1[3-9]\d{9}$/
        if (!value) {
          callback()
        } else if (!phoneReg.test(value)) {
          callback(new Error(rule.message || '请输入正确的手机号'))
        } else {
          callback()
        }
      }
      break
    case 'idcard':
      convertedRule.validator = (_rule: any, value: any, callback: any) => {
        const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!value) {
          callback()
        } else if (!idCardReg.test(value)) {
          callback(new Error(rule.message || '请输入正确的身份证号'))
        } else {
          callback()
        }
      }
      break
    case 'custom':
      if (rule.validator) {
        convertedRule.validator = rule.validator
      }
      break
  }

  return convertedRule
}

// 判断字段是否可见
const isFieldVisible = (field: FormFieldConfig) => {
  if (typeof field.visible === 'function') {
    return field.visible(formData.value)
  }
  return field.visible !== false
}

// 处理字段值变化
const handleFieldChange = (field: string, value: any) => {
  formData.value[field] = value
  emit('update:modelValue', { ...formData.value })
  emit('field-change', field, value)

  // 处理字段联动
  handleFieldLinkage(field, value)
}

// 处理字段联动
const handleFieldLinkage = (changedField: string, changedValue: any) => {
  props.config.fields.forEach(field => {
    if (!field.linkage || field.linkage.length === 0) return

    field.linkage.forEach(linkage => {
      if (linkage.field !== changedField) return

      // 检查联动条件
      let shouldTrigger = false
      if (linkage.condition) {
        shouldTrigger = linkage.condition(formData.value)
      } else if (linkage.value !== undefined) {
        shouldTrigger = changedValue === linkage.value
      }

      if (!shouldTrigger) return

      // 执行联动
      switch (linkage.type) {
        case 'visible':
          // 显示/隐藏联动由isFieldVisible处理
          break
        case 'value':
          if (linkage.result !== undefined) {
            formData.value[field.field] = linkage.result
          } else if (linkage.resultFn) {
            formData.value[field.field] = linkage.resultFn(formData.value)
          }
          break
        case 'options':
          if (linkage.result !== undefined) {
            field.options = linkage.result
          } else if (linkage.resultFn) {
            field.options = linkage.resultFn(formData.value)
          }
          break
      }

      emit('update:modelValue', { ...formData.value })
    })
  })
}

// 处理人员选择
const handlePersonSelect = (field: FormFieldConfig) => {
  currentPersonSelectField.value = field.field
  currentPersonSelectConfig.value = field
  personSelectVisible.value = true
}

// 获取人员选择文本
const getPersonSelectText = (field: FormFieldConfig) => {
  const value = formData.value[field.field]
  if (!value) {
    return field.placeholder || `请选择${field.label}`
  }
  if (Array.isArray(value)) {
    return `已选择${value.length}人`
  }
  return '已选择'
}

// 处理人员选择确认
const handlePersonSelectConfirm = (selected: any) => {
  formData.value[currentPersonSelectField.value] = selected
  emit('update:modelValue', { ...formData.value })
  emit('field-change', currentPersonSelectField.value, selected)
  personSelectVisible.value = false
}

// 处理部门选择
const handleDepartmentSelect = (field: FormFieldConfig) => {
  currentDepartmentSelectField.value = field.field
  currentDepartmentSelectConfig.value = field
  departmentSelectVisible.value = true
}

// 获取部门选择文本
const getDepartmentSelectText = (field: FormFieldConfig) => {
  const value = formData.value[field.field]
  if (!value) {
    return field.placeholder || `请选择${field.label}`
  }
  if (Array.isArray(value)) {
    return `已选择${value.length}个部门`
  }
  return '已选择'
}

// 处理部门选择确认
const handleDepartmentSelectConfirm = (selected: any) => {
  formData.value[currentDepartmentSelectField.value] = selected
  emit('update:modelValue', { ...formData.value })
  emit('field-change', currentDepartmentSelectField.value, selected)
  departmentSelectVisible.value = false
}

// 获取文件列表
const getFileList = (field: string) => {
  return fileLists.value[field] || []
}

// 上传前验证
const handleBeforeUpload = (file: any) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  return true
}

// 上传成功
const handleUploadSuccess = (field: string, response: any, file: any, fileList: any[]) => {
  fileLists.value[field] = fileList
  const urls = fileList.map((f: any) => f.response?.data?.url || f.url)
  formData.value[field] = urls
  emit('update:modelValue', { ...formData.value })
  emit('field-change', field, urls)
}

// 移除文件
const handleUploadRemove = (field: string, file: any, fileList: any[]) => {
  fileLists.value[field] = fileList
  const urls = fileList.map((f: any) => f.response?.data?.url || f.url)
  formData.value[field] = urls
  emit('update:modelValue', { ...formData.value })
  emit('field-change', field, urls)
}

// 上传超出限制
const handleUploadExceed = () => {
  ElMessage.warning('超出上传数量限制')
}

// 上传文件变化
const handleUploadChange = (field: string, file: any, fileList: any[]) => {
  fileLists.value[field] = fileList
}

// 处理表单提交
const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (valid) {
      emit('submit', { ...formData.value })
    }
  } catch (error: any) {
    const errors: Record<string, string> = {}
    if (error && typeof error === 'object') {
      Object.keys(error).forEach(key => {
        errors[key] = error[key][0]?.message || '验证失败'
      })
    }
    emit('validate-fail', errors)
  }
}

// 处理表单重置
const handleReset = () => {
  formRef.value?.resetFields()
  initFormData()
  emit('reset', { ...formData.value })
  emit('update:modelValue', { ...formData.value })
}

// 保存草稿
const saveDraft = () => {
  const draftData: DraftData = {
    formData: { ...formData.value },
    savedAt: new Date().toISOString(),
    userId: getCurrentUserId()
  }
  localStorage.setItem(getStorageKey('draft'), JSON.stringify(draftData))
  emit('save-draft', draftData)
}

// 处理保存草稿
const handleSaveDraft = () => {
  draftSaving.value = true
  try {
    saveDraft()
    ElMessage.success('草稿保存成功')
  } catch (error) {
    ElMessage.error('草稿保存失败')
  } finally {
    draftSaving.value = false
  }
}

// 恢复草稿
const restoreDraft = () => {
  const draftStr = localStorage.getItem(getStorageKey('draft'))
  if (draftStr) {
    try {
      const draftData: DraftData = JSON.parse(draftStr)
      formData.value = { ...draftData.formData }
      emit('update:modelValue', { ...formData.value })
      emit('restore-draft', draftData)
      ElMessage.success('草稿恢复成功')
      return true
    } catch (error) {
      ElMessage.error('草稿恢复失败')
      return false
    }
  }
  return false
}

// 清除草稿
const clearDraft = () => {
  localStorage.removeItem(getStorageKey('draft'))
}

// 启动自动保存草稿
const startAutoSaveDraft = () => {
  if (!props.config.autoSaveDraft) return
  const interval = props.config.autoSaveDraftInterval || 30000 // 默认30秒
  autoSaveTimer.value = setInterval(() => {
    saveDraft()
  }, interval)
}

// 停止自动保存草稿
const stopAutoSaveDraft = () => {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
    autoSaveTimer.value = null
  }
}

// 监听外部数据变化
watch(
  () => props.modelValue,
  (newVal) => {
    formData.value = { ...newVal }
  },
  { deep: true }
)

// 监听配置变化
watch(
  () => props.config,
  () => {
    initFormData()
    initFormRules()
  },
  { deep: true }
)

// 暴露方法
defineExpose({
  validate: () => formRef.value?.validate(),
  validateField: (field: string) => formRef.value?.validateField(field),
  clearValidate: (fields?: string[]) => formRef.value?.clearValidate(fields),
  resetFields: () => {
    formRef.value?.resetFields()
    initFormData()
  },
  clearFields: () => {
    const data: FormDataValue = {}
    props.config.fields.forEach(field => {
      data[field.field] = getDefaultValueByType(field.type)
    })
    formData.value = data
    emit('update:modelValue', { ...data })
  },
  setFieldValue: (field: string, value: any) => {
    formData.value[field] = value
    emit('update:modelValue', { ...formData.value })
  },
  getFieldValue: (field: string) => formData.value[field],
  saveDraft,
  restoreDraft,
  clearDraft,
  getFormData: () => ({ ...formData.value }),
  setFormData: (data: FormDataValue) => {
    formData.value = { ...data }
    emit('update:modelValue', { ...data })
  }
})

// 生命周期
onMounted(() => {
  initFormData()
  initFormRules()
  startAutoSaveDraft()
})

onUnmounted(() => {
  stopAutoSaveDraft()
})
</script>

<style scoped>
.common-form-container {
  width: 100%;
}

/* 表单按钮 */
.form-buttons {
  display: flex;
  justify-content: v-bind('config.buttonAlign || "center"');
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.form-buttons-top {
  margin-bottom: 20px;
}

.form-buttons-bottom {
  margin-top: 20px;
}

/* 表单项 */
:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

/* 输入框 */
:deep(.el-input__inner) {
  font-size: 14px;
}

/* 富文本容器 */
.richtext-container {
  width: 100%;
}

.richtext-container :deep(.el-textarea__inner) {
  min-height: 300px;
  font-family: inherit;
}

/* 字段提示 */
.field-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.field-tip .el-icon {
  font-size: 14px;
}

/* 上传组件 */
:deep(.el-upload__tip) {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .form-buttons {
    flex-direction: column;
  }

  .form-buttons .el-button {
    width: 100%;
  }

  :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}
</style>
