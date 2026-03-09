<template>
  <div class="process-form">
    <el-card>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入流程名称" maxlength="50" />
        </el-form-item>
        
        <el-form-item label="流程类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择流程类型" style="width: 100%">
            <el-option label="人事" value="personnel" />
            <el-option label="财务" value="finance" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="流程描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入流程描述" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="流程设计" prop="flowData">
          <BpmnDesigner
            v-model="formData.flowData"
            @save="handleFlowSave"
          />
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        <el-icon><Check /></el-icon>
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import BpmnDesigner from '@/components/BpmnDesigner.vue'

const router = useRouter()
const route = useRoute()

const formRef = ref()

const formData = reactive({
  id: '',
  name: '',
  type: '',
  description: '',
  status: 'enabled',
  flowData: ''
})

const formRules = {
  name: [
    { required: true, message: '请输入流程名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择流程类型', trigger: 'change' }
  ]
}

const handleFlowSave = (xml: string) => {
  formData.flowData = xml
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (!formData.flowData) {
    ElMessage.warning('请设计流程')
    return
  }

  ElMessage.success('保存成功')
  router.push('/tenant/process')
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  if (route.params.id) {
    formData.id = route.params.id as string
  }
})
</script>

<style scoped>
.process-form {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
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
}

@media screen and (max-width: 768px) {
  .form-footer {
    left: 0;
    flex-direction: column;
  }
}
</style>
