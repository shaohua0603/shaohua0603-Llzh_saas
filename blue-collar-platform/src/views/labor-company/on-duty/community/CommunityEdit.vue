<template>
  <div class="community-edit-container">
    <!-- 内容区域 -->
    <div class="form-content">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑社团' : '新增社团' }}</span>
          </div>
        </template>
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
          <el-form-item label="社团标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入社团标题" />
          </el-form-item>
          <el-form-item label="社团类型" prop="communityType">
            <el-select v-model="formData.communityType" placeholder="请选择社团类型">
              <el-option label="体育类" value="sports" />
              <el-option label="文化类" value="culture" />
              <el-option label="兴趣类" value="interest" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否团员限制" prop="isMemberLimit">
            <el-switch
              v-model="formData.isMemberLimit"
              active-text="开启"
              inactive-text="关闭"
              @change="handleMemberLimitChange"
            />
          </el-form-item>
          <el-form-item v-if="formData.isMemberLimit" label="团员人数限制" prop="memberLimit">
            <el-input-number v-model="formData.memberLimit" :min="1" :max="1000" />
            <span class="form-tip">人</span>
          </el-form-item>
          <el-form-item label="是否报名审核" prop="isApprovalRequired">
            <el-switch
              v-model="formData.isApprovalRequired"
              active-text="需要审核"
              inactive-text="无需审核"
            />
          </el-form-item>
          <el-form-item label="社团简介" prop="summary">
            <el-input
              v-model="formData.summary"
              type="textarea"
              :rows="2"
              placeholder="请输入社团简介"
            />
          </el-form-item>
          <el-form-item label="社团活动地址" prop="activityAddress">
            <el-input v-model="formData.activityAddress" placeholder="请输入社团活动地址" />
          </el-form-item>
          <el-form-item label="社团活动时间" prop="activityTime">
            <el-input v-model="formData.activityTime" placeholder="如：每周六下午3点" />
          </el-form-item>
          <el-form-item label="加入社团要求" prop="requirements">
            <el-input
              v-model="formData.requirements"
              type="textarea"
              :rows="2"
              placeholder="请输入加入社团要求"
            />
          </el-form-item>
          <el-form-item label="社团介绍" prop="introduction">
            <RichTextEditor v-model="formData.introduction" :height="'300px'" />
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
        {{ isEdit ? '保存' : '提交' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { FormInstance, FormRules } from 'element-plus'

// 路由实例
const route = useRoute()
const router = useRouter()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)
const submitLoading = ref(false)

// 判断是否为编辑模式
const isEdit = ref(!!route.params.id)

// 表单数据
const formData = reactive({
  title: '',
  communityType: '' as 'sports' | 'culture' | 'interest' | '',
  isMemberLimit: false,
  memberLimit: 50,
  isApprovalRequired: true,
  summary: '',
  activityAddress: '',
  activityTime: '',
  requirements: '',
  introduction: ''
})

// 表单验证规则
const formRules: FormRules = {
  title: [{ required: true, message: '请输入社团标题', trigger: 'blur' }],
  communityType: [{ required: true, message: '请选择社团类型', trigger: 'change' }],
  memberLimit: [
    {
      required: true,
      message: '请输入团员人数限制',
      trigger: 'blur',
      validator: (_rule: any, value: any, callback: any) => {
        if (formData.isMemberLimit && !value) {
          callback(new Error('请输入团员人数限制'))
        } else {
          callback()
        }
      }
    }
  ],
  activityAddress: [{ required: true, message: '请输入社团活动地址', trigger: 'blur' }]
}

// 团员限制开关变化
const handleMemberLimitChange = (value: boolean) => {
  if (!value) {
    formData.memberLimit = 50
  }
}

// 获取社团数据
const fetchCommunityData = () => {
  if (!isEdit.value) return
  
  loading.value = true
  
  try {
    // 模拟数据
    const mockData = {
      id: route.params.id as string,
      title: '篮球社',
      communityType: 'sports' as const,
      isMemberLimit: true,
      memberLimit: 50,
      isApprovalRequired: true,
      summary: '强身健体，结交球友',
      activityAddress: '活动中心1号场地',
      activityTime: '每周六下午3点',
      requirements: '热爱运动，积极参与',
      introduction: '<h3>篮球社介绍</h3><p>篮球社是一个以篮球运动为核心的社团，旨在为热爱篮球的同学提供一个交流和锻炼的平台。</p><p>我们每周六下午3点在活动中心1号场地进行训练和比赛，欢迎所有对篮球感兴趣的同学加入！</p>',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    
    // 填充表单数据
    formData.title = mockData.title
    formData.communityType = mockData.communityType
    formData.isMemberLimit = mockData.isMemberLimit
    formData.memberLimit = mockData.memberLimit
    formData.isApprovalRequired = mockData.isApprovalRequired
    formData.summary = mockData.summary
    formData.activityAddress = mockData.activityAddress
    formData.activityTime = mockData.activityTime
    formData.requirements = mockData.requirements
    formData.introduction = mockData.introduction
  } catch (error) {
    console.error('获取社团数据失败:', error)
    ElMessage.error('获取社团数据失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  submitLoading.value = true
  
  try {
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
    router.push('/tenant/on-duty/community')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  } finally {
    submitLoading.value = false
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/community')
}

// 生命周期
onMounted(() => {
  fetchCommunityData()
})
</script>

<style scoped>
.community-edit-container {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-tip {
  margin-left: 8px;
  color: #909399;
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