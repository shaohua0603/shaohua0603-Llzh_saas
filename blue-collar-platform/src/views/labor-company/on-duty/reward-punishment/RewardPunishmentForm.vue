<template>
  <div class="form-container">
    <div class="form-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑奖惩' : '新增奖惩' }}</span>
          </div>
        </template>
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="奖惩人员" prop="workerName">
                <el-input v-model="formData.workerName" placeholder="请输入奖惩人员姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="formData.phone" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="奖惩类型" prop="rewardPunishmentType">
                <el-select v-model="formData.rewardPunishmentType" placeholder="请选择奖惩类型" style="width: 100%">
                  <el-option label="荣誉奖励" value="honor" />
                  <el-option label="金额奖励" value="money" />
                  <el-option label="其他奖励" value="other_reward" />
                  <el-option label="口头惩罚" value="verbal" />
                  <el-option label="金额惩罚" value="fine" />
                  <el-option label="其他惩罚" value="other_punishment" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="奖惩时间" prop="rewardPunishmentTime">
                <el-date-picker
                  v-model="formData.rewardPunishmentTime"
                  type="datetime"
                  placeholder="选择奖惩时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="奖惩内容" prop="content">
            <el-input v-model="formData.content" type="textarea" :rows="4" placeholder="请输入奖惩内容" />
          </el-form-item>
          <el-form-item label="奖惩备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入奖惩备注" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="驻厂负责人" prop="factoryManager">
                <el-input v-model="formData.factoryManager" placeholder="请输入驻厂负责人" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驻厂负责人电话" prop="factoryManagerPhone">
                <el-input v-model="formData.factoryManagerPhone" placeholder="请输入驻厂负责人电话" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文员" prop="clerk">
                <el-input v-model="formData.clerk" placeholder="请输入文员" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文员电话" prop="clerkPhone">
                <el-input v-model="formData.clerkPhone" placeholder="请输入文员电话" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

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
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

// 判断是否为编辑模式
const isEdit = ref(false)

// 表单数据
const formData = reactive({
  id: '',
  workerName: '',
  phone: '',
  rewardPunishmentType: 'honor' as 'honor' | 'money' | 'other_reward' | 'verbal' | 'fine' | 'other_punishment',
  rewardPunishmentTime: '',
  content: '',
  remark: '',
  factoryManager: '',
  factoryManagerPhone: '',
  clerk: '',
  clerkPhone: ''
})

// 表单规则
const formRules: FormRules = {
  workerName: [{ required: true, message: '请输入奖惩人员姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  rewardPunishmentType: [{ required: true, message: '请选择奖惩类型', trigger: 'change' }],
  rewardPunishmentTime: [{ required: true, message: '请选择奖惩时间', trigger: 'change' }],
  content: [{ required: true, message: '请输入奖惩内容', trigger: 'blur' }],
  factoryManager: [{ required: true, message: '请输入驻厂负责人', trigger: 'blur' }],
  factoryManagerPhone: [{ required: true, message: '请输入驻厂负责人电话', trigger: 'blur' }],
  clerk: [{ required: true, message: '请输入文员', trigger: 'blur' }],
  clerkPhone: [{ required: true, message: '请输入文员电话', trigger: 'blur' }]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    // 模拟提交
    setTimeout(() => {
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      router.push('/tenant/on-duty/reward-punishment')
    }, 500)
  } catch (error) {
    console.error('表单验证失败', error)
  } finally {
    submitLoading.value = false
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    // 模拟获取数据
    // 在实际应用中，这里应该调用API获取详情数据
    setTimeout(() => {
      formData.id = id as string
      formData.workerName = '张三'
      formData.phone = '13800138001'
      formData.rewardPunishmentType = 'honor'
      formData.rewardPunishmentTime = '2024-02-15 10:00:00'
      formData.content = '优秀员工称号'
      formData.remark = '年度优秀员工'
      formData.factoryManager = '李四'
      formData.factoryManagerPhone = '13900139000'
      formData.clerk = '王五'
      formData.clerkPhone = '13700137000'
    }, 300)
  }
})
</script>

<style scoped>
.form-container {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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