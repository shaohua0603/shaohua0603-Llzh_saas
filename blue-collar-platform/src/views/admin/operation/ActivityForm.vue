<template>
  <div class="admin-activity-form-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑活动' : '新增活动' }}</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import CommonForm from '@/components/CommonForm.vue'
import type { FormConfig } from '@/types/common-form'
import { activityApi } from '@/api/operations/activityApi'
import {
  ActivityType,
  ActivityTypeText,
  type ActivityFormData,
  type ActivityInfo,
} from '@/types/operations/activity'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

// 表单数据
const formData = ref<ActivityFormData>({
  title: '',
  type: ActivityType.OTHER,
  needAudit: false,
  registerStartTime: '',
  registerEndTime: '',
  startTime: '',
  endTime: '',
  address: '',
  summary: '',
  content: '',
  coverImage: '',
  maxParticipants: undefined,
})

// 表单配置
const formConfig: FormConfig = {
  labelWidth: '120px',
  columns: 2,
  buttonPosition: 'bottom',
  showSubmit: true,
  submitText: '提交',
  showReset: true,
  resetText: '重置',
  fields: [
    {
      field: 'title',
      label: '活动标题',
      type: 'TEXT',
      required: true,
      placeholder: '请输入活动标题',
      span: 24,
    },
    {
      field: 'type',
      label: '活动类型',
      type: 'SELECT',
      required: true,
      placeholder: '请选择活动类型',
      options: Object.entries(ActivityTypeText).map(([value, label]) => ({
        value,
        label,
      })),
      span: 12,
    },
    {
      field: 'needAudit',
      label: '是否需要审核',
      type: 'CHECKBOX',
      options: [
        { label: '需要审核', value: true },
      ],
      span: 12,
    },
    {
      field: 'registerStartTime',
      label: '报名开始时间',
      type: 'DATETIME',
      required: true,
      placeholder: '请选择报名开始时间',
      span: 12,
    },
    {
      field: 'registerEndTime',
      label: '报名截止时间',
      type: 'DATETIME',
      required: true,
      placeholder: '请选择报名截止时间',
      span: 12,
    },
    {
      field: 'startTime',
      label: '活动开始时间',
      type: 'DATETIME',
      required: true,
      placeholder: '请选择活动开始时间',
      span: 12,
    },
    {
      field: 'endTime',
      label: '活动结束时间',
      type: 'DATETIME',
      required: true,
      placeholder: '请选择活动结束时间',
      span: 12,
    },
    {
      field: 'address',
      label: '活动地址',
      type: 'TEXT',
      placeholder: '请输入活动地址',
      span: 12,
    },
    {
      field: 'maxParticipants',
      label: '最大参与人数',
      type: 'NUMBER',
      placeholder: '请输入最大参与人数',
      min: 1,
      span: 12,
    },
    {
      field: 'summary',
      label: '活动简介',
      type: 'TEXTAREA',
      placeholder: '请输入活动简介',
      rows: 3,
      span: 24,
    },
    {
      field: 'content',
      label: '活动详情',
      type: 'RICHTEXT',
      required: true,
      placeholder: '请输入活动详情(支持富文本)',
      richtextHeight: 400,
      span: 24,
    },
    {
      field: 'coverImage',
      label: '封面图片',
      type: 'IMAGE',
      uploadLimit: 1,
      accept: ['image/jpeg', 'image/png', 'image/gif'],
      tip: '支持上传jpg/png/gif格式图片,大小不超过2MB',
      span: 24,
    },
  ],
}

// 加载活动详情
const loadActivityDetail = async (id: string) => {
  loading.value = true
  try {
    const response = await activityApi.getActivityDetail(Number(id))
    const activity = response.data

    formData.value = {
      title: activity.title,
      type: activity.type,
      needAudit: activity.needAudit,
      registerStartTime: activity.registerStartTime,
      registerEndTime: activity.registerEndTime,
      startTime: activity.startTime,
      endTime: activity.endTime,
      address: activity.address || '',
      summary: activity.summary || '',
      content: activity.content || '',
      coverImage: activity.coverImage || '',
      maxParticipants: activity.maxParticipants,
    }
  } catch (error) {
    console.error('加载活动详情失败:', error)
    ElMessage.error('加载活动详情失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async (data: ActivityFormData) => {
  loading.value = true
  try {
    if (isEdit.value) {
      await activityApi.updateActivity(Number(route.params.id), data)
      ElMessage.success('更新成功')
    } else {
      await activityApi.createActivity(data)
      ElMessage.success('创建成功')
    }
    handleBack()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  } finally {
    loading.value = false
  }
}

// 重置表单
const handleReset = () => {
  formData.value = {
    title: '',
    type: ActivityType.OTHER,
    needAudit: false,
    registerStartTime: '',
    registerEndTime: '',
    startTime: '',
    endTime: '',
    address: '',
    summary: '',
    content: '',
    coverImage: '',
    maxParticipants: undefined,
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  if (isEdit.value && route.params.id) {
    loadActivityDetail(route.params.id as string)
  }
})
</script>

<style scoped>
.admin-activity-form-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
