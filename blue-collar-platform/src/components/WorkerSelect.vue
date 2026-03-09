<template>
  <div class="worker-select-form-item">
    <!-- 单选模式：显示单个输入框 -->
    <el-input
      v-if="!multiple"
      :model-value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      readonly
      @clear="handleClear"
      @focus="openDialog"
    >
      <template #append>
        <el-button @click="openDialog" :disabled="disabled">
          <el-icon><User /></el-icon>
          选择工人
        </el-button>
      </template>
    </el-input>
    
    <!-- 多选模式：显示多个标签 -->
    <div v-else class="multiple-select">
      <div class="selected-tags">
        <el-tag
          v-for="(item, index) in selectedItems"
          :key="item[valueKey]"
          closable
          :size="size"
          @close="removeTag(item)"
        >
          {{ item[labelKey] }}
        </el-tag>
        <el-button
          v-if="!disabled"
          :size="size"
          @click="openDialog"
          class="add-button"
        >
          <el-icon><User /></el-icon>
          选择工人
        </el-button>
      </div>
    </div>

    <!-- 工人选择对话框 -->
    <WorkerSelectDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :multiple="multiple"
      :selected-ids="selectedIds"
      :placeholder="searchPlaceholder"
      :page-size="pageSize"
      :display-fields="displayFields"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { User } from '@element-plus/icons-vue'
import WorkerSelectDialog from './WorkerSelectDialog.vue'

// Props 定义
interface Props {
  /** 选中的工人 ID，单选为数字，多选为数组 */
  modelValue: number | number[] | string | string[] | null
  /** 是否支持多选，默认 false */
  multiple?: boolean
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 组件大小 */
  size?: 'large' | 'default' | 'small'
  /** 每页显示数量 */
  pageSize?: number
  /** 显示字段 */
  displayFields?: string[]
  /** 值字段 */
  valueKey?: string
  /** 标签字段 */
  labelKey?: string
  /** 对话框标题 */
  dialogTitle?: string
  /** 搜索框占位文本 */
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  placeholder: '请选择工人',
  disabled: false,
  clearable: true,
  size: 'default',
  pageSize: 10,
  displayFields: () => ['name', 'workerId', 'phone', 'gender', 'age'],
  valueKey: 'id',
  labelKey: 'name',
  dialogTitle: '选择工人',
  searchPlaceholder: '搜索姓名、手机号、工号'
})

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: number | number[] | string | string[] | null]
  'change': [value: any]
}>()

// 响应式数据
const dialogVisible = ref(false)
const selectedItems = ref<any[]>([])

// 计算选中 ID 列表
const selectedIds = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue
  } else if (!props.multiple && props.modelValue) {
    return [props.modelValue]
  }
  return []
})

// 计算显示值
const displayValue = computed(() => {
  if (!props.multiple && selectedItems.value.length > 0) {
    return selectedItems.value[0][props.labelKey]
  }
  return ''
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== null && newValue !== undefined && newValue !== '') {
    // 这里可以加载选中的工人详情
    // 为了简化，我们假设 selectedItems 已经包含数据
  }
}, { immediate: true })

// 打开对话框
const openDialog = () => {
  if (props.disabled) return
  dialogVisible.value = true
}

// 处理确认
const handleConfirm = (selected: any) => {
  if (props.multiple) {
    const ids = selected.map((item: any) => item[props.valueKey])
    selectedItems.value = selected
    emit('update:modelValue', ids)
    emit('change', selected)
  } else {
    const item = Array.isArray(selected) ? selected[0] : selected
    selectedItems.value = [item]
    emit('update:modelValue', item[props.valueKey])
    emit('change', item)
  }
  dialogVisible.value = false
}

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
}

// 处理清空
const handleClear = () => {
  selectedItems.value = []
  emit('update:modelValue', props.multiple ? [] : null)
  emit('change', props.multiple ? [] : null)
}

// 移除标签（多选模式）
const removeTag = (item: any) => {
  const index = selectedItems.value.findIndex(i => i[props.valueKey] === item[props.valueKey])
  if (index > -1) {
    selectedItems.value.splice(index, 1)
    const ids = selectedItems.value.map(i => i[props.valueKey])
    emit('update:modelValue', ids)
    emit('change', selectedItems.value)
  }
}

// 暴露方法
defineExpose({
  openDialog
})
</script>

<style scoped>
.worker-select-form-item {
  width: 100%;
}

.worker-select-form-item :deep(.el-input-group__append) {
  padding: 0 12px;
}

.worker-select-form-item :deep(.el-input-group__append .el-button) {
  padding: 8px 12px;
}

.multiple-select {
  width: 100%;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.add-button {
  height: 32px;
}

.add-button .el-icon {
  margin-right: 4px;
}
</style>