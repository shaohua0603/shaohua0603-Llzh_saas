<template>
  <div class="entertainment-form-container">
    <!-- 内容区域 -->
    <div class="form-content">
      <el-card shadow="never" class="form-card">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
          <el-form-item label="活动标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入活动标题" />
          </el-form-item>
          <el-form-item label="活动类型" prop="activityType">
            <el-select v-model="formData.activityType" placeholder="请选择活动类型">
              <el-option label="文体活动" value="sports" />
              <el-option label="相亲活动" value="dating" />
              <el-option label="技能提升" value="skill" />
              <el-option label="社团活动" value="community" />
              <el-option label="其他活动" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formData.activityType === 'community'"
            label="选择社团"
            prop="communityId"
          >
            <el-select v-model="formData.communityId" placeholder="请选择社团">
              <el-option
                v-for="community in communityOptions"
                :key="community.id"
                :label="community.name"
                :value="community.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否报名审核" prop="isApprovalRequired">
            <el-switch
              v-model="formData.isApprovalRequired"
              active-text="需要审核"
              inactive-text="无需审核"
            />
          </el-form-item>
          <el-form-item label="报名开始日期" prop="registrationStartDate">
            <el-date-picker
              v-model="formData.registrationStartDate"
              type="date"
              placeholder="选择报名开始日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="报名截止日期" prop="registrationEndDate">
            <el-date-picker
              v-model="formData.registrationEndDate"
              type="date"
              placeholder="选择报名截止日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="活动地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入活动地址" />
          </el-form-item>
          <el-form-item label="活动简介" prop="summary">
            <el-input
              v-model="formData.summary"
              type="textarea"
              :rows="2"
              placeholder="请输入活动简介"
            />
          </el-form-item>
          <el-form-item label="活动详情" prop="content">
            <RichTextEditor v-model="formData.content" :height="'300px'" />
          </el-form-item>
          <el-form-item label="活动开始时间" prop="activityStartTime">
            <el-date-picker
              v-model="formData.activityStartTime"
              type="datetime"
              placeholder="选择活动开始时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="活动结束时间" prop="activityEndTime">
            <el-date-picker
              v-model="formData.activityEndTime"
              type="datetime"
              placeholder="选择活动结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
        <el-icon><Check /></el-icon>
        {{ isEdit ? '保存修改' : '新增活动' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface EntertainmentRecord {
  id: string
  title: string
  activityType: 'sports' | 'dating' | 'skill' | 'community' | 'other'
  communityId?: string
  isApprovalRequired: boolean
  registrationStartDate: string
  registrationEndDate: string
  address: string
  summary: string
  content: string
  activityStartTime: string
  activityEndTime: string
  status: 'unpublished' | 'published' | 'ongoing' | 'ended'
  isStarted: boolean
  createdAt: string
}

interface Community {
  id: string
  name: string
}

// 路由相关
const router = useRouter()
const route = useRoute()

// 响应式数据
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const communityOptions = ref<Community[]>([])

// 表单数据
const formData = reactive({
  title: '',
  activityType: '' as EntertainmentRecord['activityType'] | '',
  communityId: '',
  isApprovalRequired: true,
  registrationStartDate: '',
  registrationEndDate: '',
  address: '',
  summary: '',
  content: '',
  activityStartTime: '',
  activityEndTime: ''
})

// 表单验证规则
const formRules: FormRules = {
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  communityId: [
    {
      required: true,
      message: '请选择社团',
      trigger: 'change',
      validator: (_rule: any, value: any, callback: any) => {
        if (formData.activityType === 'community' && !value) {
          callback(new Error('请选择社团'))
        } else {
          callback()
        }
      }
    }
  ],
  registrationStartDate: [{ required: true, message: '请选择报名开始日期', trigger: 'change' }],
  registrationEndDate: [{ required: true, message: '请选择报名截止日期', trigger: 'change' }],
  address: [{ required: true, message: '请输入活动地址', trigger: 'blur' }],
  activityStartTime: [{ required: true, message: '请选择活动开始时间', trigger: 'change' }],
  activityEndTime: [{ required: true, message: '请选择活动结束时间', trigger: 'change' }]
}

// 计算属性
const isEdit = computed(() => !!route.params.id)

// 社团选项
const getCommunityOptions = (): Community[] => {
  return [
    { id: 'C001', name: '篮球社' },
    { id: 'C002', name: '足球社' },
    { id: 'C003', name: '羽毛球社' },
    { id: 'C004', name: '读书会' },
    { id: 'C005', name: '摄影社' },
    { id: 'C006', name: '舞蹈社' }
  ]
}

// 获取活动类型文本
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    sports: '文体活动',
    dating: '相亲活动',
    skill: '技能提升',
    community: '社团活动',
    other: '其他活动'
  }
  return typeMap[type] || type
}

// 加载数据
const loadData = () => {
  if (isEdit.value) {
    // 从localStorage获取数据（模拟）
    const allData = JSON.parse(localStorage.getItem('entertainmentData') || '[]')
    const record = allData.find((item: EntertainmentRecord) => item.id === route.params.id)
    if (record) {
      Object.assign(formData, record)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate()

  submitLoading.value = true

  try {
    // 从localStorage获取数据（模拟）
    let allData = JSON.parse(localStorage.getItem('entertainmentData') || '[]')

    if (isEdit.value) {
      // 编辑
      const index = allData.findIndex((item: EntertainmentRecord) => item.id === route.params.id)
      if (index > -1) {
        allData[index] = { ...allData[index], ...formData }
      }
      ElMessage.success('修改成功')
    } else {
      // 新增
      const newRecord: EntertainmentRecord = {
        id: `ENT${Date.now()}`,
        ...formData,
        status: 'unpublished',
        isStarted: false,
        createdAt: new Date().toISOString()
      }
      allData.unshift(newRecord)
      ElMessage.success('新增成功')
    }

    // 保存到localStorage（模拟）
    localStorage.setItem('entertainmentData', JSON.stringify(allData))

    // 跳转回列表页
    router.push('/tenant/on-duty/entertainment')
  } finally {
    submitLoading.value = false
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/entertainment')
}

// 生命周期
onMounted(() => {
  communityOptions.value = getCommunityOptions()
  loadData()
})
</script>

<style scoped>
.entertainment-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.form-card {
  margin-bottom: 16px;
}

.form-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .form-footer {
    left: 0;
    flex-direction: column;
  }
  
  .form-footer .el-button {
    width: 100%;
  }
  
  .form-content {
    padding-bottom: 120px;
  }
}
</style>