<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <PersonSelect
      ref="personSelectRef"
      :source="source"
      :multiple="multiple"
      :display-fields="displayFields"
      :return-fields="returnFields"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PersonSelect from './PersonSelect.vue'

// Props定义
interface Props {
  /** 是否显示对话框 */
  modelValue: boolean
  /** 对话框标题 */
  title?: string
  /** 人员来源 */
  source?: 'worker' | 'employee' | 'all'
  /** 是否多选 */
  multiple?: boolean
  /** 显示字段 */
  displayFields?: string[]
  /** 返回字段 */
  returnFields?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '选择人员',
  source: 'all',
  multiple: false,
  displayFields: () => ['name', 'phone', 'department'],
  returnFields: () => ['id', 'name', 'phone', 'department']
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [selected: any]
  'cancel': []
}>()

// 响应式数据
const personSelectRef = ref()
const dialogVisible = ref(props.modelValue)

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
})

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 处理确认
const handleConfirm = (selected: any) => {
  emit('confirm', selected)
  dialogVisible.value = false
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

// 处理关闭
const handleClose = () => {
  emit('cancel')
}

// 暴露方法
defineExpose({
  loadPersonList: () => personSelectRef.value?.loadPersonList()
})
</script>

<style scoped>
/* 对话框样式由Element Plus自动处理 */
</style>
