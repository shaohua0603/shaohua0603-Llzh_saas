<template>
  <div class="initial-interview-form-container">
    <el-card class="form-card" shadow="never">
      <CommonForm
        ref="formRef"
        v-model="formData"
        :config="formConfig"
        :loading="loading"
        @submit="handleSubmit"
        @reset="handleReset"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import CommonForm from '../../../components/CommonForm.vue'
import type { FormConfig } from '../../types/common-form'

// 路由实例
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref()

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 加载状态
const loading = ref(false)

// 表单数据
const formData = ref({
  interviewTime: '',
  interviewLocation: '',
  interviewer: '',
  manager: '',
  recommendationLevel: '',
  imageLevel: '',
  recommendationReason: '',
  groupNumber: ''
})

// 表单配置
const formConfig: FormConfig = {
  fields: [
    {
      field: 'interviewTime',
      label: '面试时间',
      type: 'DATETIME',
      required: true,
      placeholder: '请选择面试时间',
      span: 12
    },
    {
      field: 'interviewLocation',
      label: '面试地点',
      type: 'TEXT',
      required: true,
      placeholder: '请输入面试地点',
      span: 12
    },
    {
      field: 'interviewer',
      label: '面试人',
      type: 'TEXT',
      required: true,
      placeholder: '请输入面试人',
      span: 12
    },
    {
      field: 'manager',
      label: '负责人',
      type: 'TEXT',
      required: true,
      placeholder: '请输入负责人',
      span: 12
    },
    {
      field: 'recommendationLevel',
      label: '推荐等级',
      type: 'SELECT',
      required: true,
      placeholder: '请选择推荐等级',
      span: 12,
      options: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' }
      ]
    },
    {
      field: 'imageLevel',
      label: '形象级别',
      type: 'SELECT',
      required: true,
      placeholder: '请选择形象级别',
      span: 12,
      options: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' }
      ]
    },
    {
      field: 'recommendationReason',
      label: '推荐理由',
      type: 'TEXTAREA',
      required: true,
      placeholder: '请输入推荐理由',
      span: 24,
      rows: 4
    },
    {
      field: 'groupNumber',
      label: '群号',
      type: 'TEXT',
      required: false,
      placeholder: '请输入群号',
      span: 12
    }
  ],
  labelWidth: '120px',
  columns: 2,
  buttonPosition: 'bottom',
  buttonAlign: 'center',
  submitText: '提交',
  resetText: '重置'
}

// 返回
const handleBack = () => {
  router.back()
}

// 提交表单
const handleSubmit = (data: any) => {
  console.log('提交表单数据:', data)
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    router.back()
  }, 1000)
}

// 重置表单
const handleReset = (data: any) => {
  console.log('重置表单')
}

// 加载面试详情（编辑模式）
const loadInterviewDetail = () => {
  if (!isEdit.value) return
  
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    formData.value = {
      interviewTime: '2024-02-26 10:00:00',
      interviewLocation: '深圳宝安面试点',
      interviewer: '张三',
      manager: '李四',
      recommendationLevel: 'A',
      imageLevel: 'A',
      recommendationReason: '工作经验丰富，沟通能力强',
      groupNumber: '1001'
    }
    loading.value = false
  }, 500)
}

// 生命周期
onMounted(() => {
  loadInterviewDetail()
})
</script>

<style scoped>
.initial-interview-form-container {
  width: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.form-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .initial-interview-form-container {
    padding: 12px;
  }

  :deep(.el-form) {
    font-size: 14px;
  }
}
</style>
