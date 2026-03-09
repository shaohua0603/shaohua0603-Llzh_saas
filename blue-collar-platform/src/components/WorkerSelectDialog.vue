<template>
  <el-dialog
    v-model="internalVisible"
    :title="title"
    :width="width"
    :destroy-on-close="true"
    @close="handleCancel"
  >
    <WorkerSelectList
      ref="workerSelectRef"
      :multiple="multiple"
      :display-fields="displayFields"
      :return-fields="returnFields"
      :visible="internalVisible"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import WorkerSelectList from './WorkerSelectList.vue'

// Props 定义
interface Props {
  /** 对话框是否可见 */
  visible: boolean
  /** 对话框标题 */
  title?: string
  /** 对话框宽度 */
  width?: string
  /** 是否多选 */
  multiple?: boolean
  /** 显示字段 */
  displayFields?: string[]
  /** 返回字段 */
  returnFields?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '选择工人',
  width: '1000px',
  multiple: false,
  displayFields: () => ['name', 'workerId', 'idCard', 'phone', 'gender', 'age'],
  returnFields: () => ['id', 'name', 'workerId', 'idCard', 'phone', 'gender', 'age']
})

// Emits 定义
const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'confirm': [selected: any]
  'cancel': []
}>()

// 响应式数据
const internalVisible = ref(props.visible)
const workerSelectRef = ref<any>(null)

// 监听 visible 变化
watch(() => props.visible, (newValue) => {
  internalVisible.value = newValue
  if (newValue) {
    // 当对话框打开时，手动调用加载数据
    setTimeout(() => {
      if (workerSelectRef.value) {
        workerSelectRef.value.loadWorkerList()
      }
    }, 100)
  }
})

// 监听 internalVisible 变化
watch(internalVisible, (newValue) => {
  if (newValue !== props.visible) {
    emit('update:visible', newValue)
  }
})

// 处理确认
const handleConfirm = (selected: any) => {
  emit('confirm', selected)
  internalVisible.value = false
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  internalVisible.value = false
}

// 暴露方法
defineExpose({
  loadWorkerList: () => {
    if (workerSelectRef.value) {
      workerSelectRef.value.loadWorkerList()
    }
  }
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>